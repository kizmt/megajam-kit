#Requires -Version 5.1
<#
.SYNOPSIS
  Real-input test of a packaged build: launches the game, waits for it, then presses keys on a timeline while the game
  window is in front, optionally recording the screen. Use it to prove key bindings work (autoplay hooks bypass input).
.DESCRIPTION
  RULE: ask the director before EVERY run (an earlier yes doesn't carry over), then pass -Approved.
  Safety: injected keys go to whatever window has focus. Keys are only sent while the game window is in front; if any
  other window takes the foreground (or the game can't be brought forward), every held key is released and the test
  aborts, so no keystrokes land in other apps.
.EXAMPLE
  .\keytest.ps1 -Approved -Exe C:\dev\Builds\MyGame\Windows\MyGame.exe -StartPattern 'MYGAME_GO' `
      -Sequence '0:tap Enter; 1:down Right; 2.5:up Right; 3:tap Space; 4:tap Escape' -Record C:\dev\MyGame\Generated\clips\keytest.mp4
.NOTES
  Sequence: "<seconds>:<down|up|tap> <key>" separated by ';'. Seconds count from -StartPattern (a log line, regex) or,
  without it, from one second after the window is focused. Keys: A-Z, 0-9, F1-F12, Space, Enter, Escape, Tab,
  Backspace, LShift, RShift, LCtrl, RCtrl, LAlt, RAlt, Up, Down, Left, Right.
  The packaged root <Game>.exe is a launcher; the window belongs to <Game>\Binaries\Win64\<Game>.exe, so the window is
  found by process name, not by the launcher's PID.
#>
[CmdletBinding()]
param(
    [switch]$Approved,
    [Parameter(Mandatory = $true)][string]$Exe,
    [Parameter(Mandatory = $true)][string]$Sequence,
    [string]$StartPattern = '',      # log regex that marks t = 0 (e.g. the level/round start line)
    [double]$ReadyTimeoutSec = 120,
    [string]$Record = '',            # optional mp4 path: recorded through record_window.ps1 (game window only)
    [string[]]$GameArgs = @()
)
$ErrorActionPreference = 'Stop'
if (-not $Approved) { Write-Host 'REFUSED: key-injection tests need the director''s yes for each run. Ask, then rerun with -Approved.'; exit 3 }
if (-not (Test-Path $Exe)) { Write-Host "FAIL: exe not found: $Exe"; exit 1 }

Add-Type @"
using System;
using System.Runtime.InteropServices;
public static class KitKeys {
    [DllImport("user32.dll")] public static extern void keybd_event(byte vk, byte scan, uint flags, UIntPtr extra);
    [DllImport("user32.dll")] public static extern uint MapVirtualKey(uint code, uint mapType);
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
    [DllImport("user32.dll")] public static extern bool BringWindowToTop(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint pid);
    [DllImport("user32.dll")] public static extern bool AttachThreadInput(uint idAttach, uint idAttachTo, bool attach);
    [DllImport("kernel32.dll")] public static extern uint GetCurrentThreadId();
    public static void Down(byte vk) { keybd_event(vk, (byte)MapVirtualKey(vk, 0), 0, UIntPtr.Zero); }
    public static void Up(byte vk) { keybd_event(vk, (byte)MapVirtualKey(vk, 0), 2, UIntPtr.Zero); }
    // Windows refuses SetForegroundWindow from a background process unless its input is attached to the foreground thread.
    public static bool Focus(IntPtr h) {
        uint pid; uint fg = GetWindowThreadProcessId(GetForegroundWindow(), out pid); uint me = GetCurrentThreadId();
        AttachThreadInput(me, fg, true); SetForegroundWindow(h); BringWindowToTop(h); AttachThreadInput(me, fg, false);
        return GetForegroundWindow() == h;
    }
}
"@

. (Join-Path $PSScriptRoot 'game_common.ps1')   # KitGameWin.Largest: finds the game's viewport window

$vk = @{ Space = 0x20; Enter = 0x0D; Escape = 0x1B; Tab = 0x09; Backspace = 0x08; LShift = 0xA0; RShift = 0xA1
         LCtrl = 0xA2; RCtrl = 0xA3; LAlt = 0xA4; RAlt = 0xA5; Left = 0x25; Up = 0x26; Right = 0x27; Down = 0x28 }
foreach ($c in [char[]]'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') { $vk["$c"] = [int][char]$c }
for ($i = 1; $i -le 12; $i++) { $vk["F$i"] = 0x6F + $i }

# Parse the sequence up front so a typo fails before anything launches.
$steps = @(foreach ($part in ($Sequence -split ';' | Where-Object { $_.Trim() })) {
    if ($part.Trim() -notmatch '^([0-9.]+)\s*:\s*(down|up|tap)\s+(\w+)$') { throw "bad sequence step: '$part'" }
    if (-not $vk.ContainsKey($Matches[3])) { throw "unknown key '$($Matches[3])'" }
    [pscustomobject]@{ At = [double]$Matches[1]; Action = $Matches[2]; Key = [byte]$vk[$Matches[3]]; Name = $Matches[3] }
}) | Sort-Object At

$name = [IO.Path]::GetFileNameWithoutExtension($Exe)
$log = Join-Path (Split-Path $Exe) "$name\Saved\Logs\$name.log"
$start = Get-Date
# Instances already running are not ours: never send keys to, record or kill one of them.
# A packaged <Game>.exe is a launcher: the window belongs to a child named <Game> (Development) or
# <Game>-Win64-Shipping (Shipping).
$names = @($name, "$name-Win64-Shipping")
$before = @(Get-Process $names -ErrorAction SilentlyContinue | ForEach-Object Id)
if ($before.Count) { Write-Host "FAIL: $name is already running (pid $($before -join ', ')); close it first (ask the director)"; exit 1 }
$launcher = if ($GameArgs.Count) { Start-Process $Exe -ArgumentList $GameArgs -PassThru } else { Start-Process $Exe -PassThru }
$game = $null
$deadline = (Get-Date).AddSeconds($ReadyTimeoutSec)
$hwnd = [IntPtr]::Zero
while ($hwnd -eq [IntPtr]::Zero -and (Get-Date) -lt $deadline) {
    Start-Sleep -Milliseconds 250
    # The largest visible window, not MainWindowHandle: with -log that can be the console.
    foreach ($p in @(Get-Process $names -ErrorAction SilentlyContinue)) {
        $h = [KitGameWin]::Largest([uint32]$p.Id)
        if ($h -ne [IntPtr]::Zero) { $game = $p; $hwnd = $h; break }
    }
}
if (-not $game) {
    # Clean up what this run started (nothing else was running under these names, checked above).
    Stop-Process -Id $launcher.Id -Force -ErrorAction SilentlyContinue
    Get-Process $names -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host 'FAIL: no game window appeared'; exit 1
}

$held = New-Object System.Collections.Generic.HashSet[byte]
$rec = $null
function Stop-Test([string]$why, [int]$code = 2) {
    foreach ($k in @($held)) { [KitKeys]::Up($k) }
    if ($game) { Stop-Process -Id $game.Id -Force -ErrorAction SilentlyContinue }
    # The recorder sees the game exit, stops and cuts the clip back to clean footage by itself.
    if ($rec) { $null = $rec.WaitForExit(15000) }
    Write-Host "ABORTED: $why (no keys were sent while another window was in front)"; exit $code
}
$focused = $false
for ($i = 0; $i -lt 10 -and -not $focused; $i++) { $focused = [KitKeys]::Focus($hwnd); if (-not $focused) { Start-Sleep -Milliseconds 200 } }
if (-not $focused) { Stop-Test 'could not bring the game window to the front' }

if ($Record) {
    # Always through record_window.ps1: it records only the game window, only while the game is alive, in front and
    # uncovered, and cuts the clip back to clean footage the moment that ends (raw desktop capture once recorded a
    # private chat window).
    $dur = [math]::Ceiling(($steps | Select-Object -Last 1).At) + 4 + $(if ($StartPattern) { [int]$ReadyTimeoutSec } else { 2 })
    $recScript = Join-Path $PSScriptRoot 'record_window.ps1'
    $recLog = [IO.Path]::ChangeExtension($Record, '.rec.log')
    New-Item -ItemType Directory -Force -Path (Split-Path $Record) | Out-Null
    Remove-Item $recLog -ErrorAction SilentlyContinue
    $rec = Start-Process powershell -ArgumentList @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', "`"$recScript`"",
        '-GamePid', $game.Id, '-Hwnd', $hwnd.ToInt64(), '-Out', "`"$Record`"", '-Seconds', $dur) -PassThru -WindowStyle Hidden `
        -RedirectStandardOutput $recLog
    # No keys until the recorder has said 'REC start' (a cold powershell.exe can take a few seconds to get there).
    $recDeadline = (Get-Date).AddSeconds(15)
    while (-not ((Test-Path $recLog) -and (Select-String -Path $recLog -Pattern '^REC start' -Quiet))) {
        if ($rec.HasExited -or (Get-Date) -gt $recDeadline) {
            $why = if (Test-Path $recLog) { (Get-Content $recLog | Select-Object -Last 3) -join ' / ' } else { 'no output' }
            Stop-Test "the recorder did not start: $why" 1
        }
        Start-Sleep -Milliseconds 100
    }
}

if ($StartPattern) {
    while (-not ((Test-Path $log) -and (Get-Item $log).LastWriteTime -ge $start -and (Select-String -Path $log -Pattern $StartPattern -Quiet))) {
        if ((Get-Date) -gt $deadline) { Stop-Test "start line '$StartPattern' never appeared in $log" 1 }
        if ([KitKeys]::GetForegroundWindow() -ne $hwnd) { Stop-Test 'the game lost the foreground before the start' }
        Start-Sleep -Milliseconds 20
    }
} else { Start-Sleep -Seconds 1 }
$t0 = Get-Date

foreach ($s in $steps) {
    while (((Get-Date) - $t0).TotalSeconds -lt $s.At) {
        if ($held.Count -gt 0 -and [KitKeys]::GetForegroundWindow() -ne $hwnd) { Stop-Test 'the game lost the foreground' }
        Start-Sleep -Milliseconds 5
    }
    if ([KitKeys]::GetForegroundWindow() -ne $hwnd) { Stop-Test 'the game lost the foreground' }
    switch ($s.Action) {
        'down' { [KitKeys]::Down($s.Key); [void]$held.Add($s.Key) }
        'up'   { [KitKeys]::Up($s.Key); [void]$held.Remove($s.Key) }
        'tap'  { [KitKeys]::Down($s.Key); Start-Sleep -Milliseconds 80; [KitKeys]::Up($s.Key) }
    }
    Write-Host ("{0,6:N2}s {1,-4} {2}" -f $s.At, $s.Action, $s.Name)
}
foreach ($k in @($held)) { [KitKeys]::Up($k) }
Start-Sleep -Seconds 2
Stop-Process -Id $game.Id -Force -ErrorAction SilentlyContinue  # only the instance this test launched
if ($rec) { $null = $rec.WaitForExit(20000) }
$recNote = if (-not $Record) { '' } elseif (Test-Path $Record) { "`nRecording: $Record" } else { "`nNO RECORDING (recorder output: $recLog)" }
Write-Host "DONE. Game log: $log$recNote"
Write-Host 'Prove each action from the game''s own log lines (log one line per player action in the game).'
