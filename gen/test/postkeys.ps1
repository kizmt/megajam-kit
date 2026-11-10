#Requires -Version 5.1
<#
.SYNOPSIS
  Real-key test that needs no foreground: posts WM_KEYDOWN / WM_KEYUP to the game's own window, on a timeline, while
  the game runs in -game; frame_capture.py saves every Nth frame and quits the game.
.DESCRIPTION
  UE's window procedure processes posted key messages like keyboard keys (WindowsApplication.cpp WM_KEYDOWN), so they
  go through Slate and Enhanced Input like a real press. The messages go to this one window only: nothing reaches
  another app, whatever has the focus. So, unlike keytest.ps1, this runs on a busy or unattended machine (a practice
  run lost keytest.ps1 for hours to a Windows Firewall prompt holding the foreground; this drove all 21 key events of
  its test sequence, each logged by the game within the same millisecond).
  Limits: no mouse; keys only. keytest.ps1 (the director in the loop, packaged build, screen recording) stays the
  final check of a release build.
.EXAMPLE
  & C:\dev\megajam-kit\gen\test\postkeys.ps1 -Name seqA -Map /Game/Maps/Main -StartPattern 'MYGAME_READY' `
      -Sequence '0.5:tap Enter; 1:down Right; 2.5:up Right; 3:tap Space; 4:tap Escape' -QuitAfter 8
.NOTES
  Sequence: "<seconds>:<down|up|tap> <key>" separated by ';', seconds from -StartPattern (a log regex; default: the
  capture script's start line). -QuitAfter counts from that capture start line, not from -StartPattern: with a later
  -StartPattern, make -QuitAfter cover the pattern's delay plus the last step. Keys: A-Z, 0-9, F1-F12, Space, Enter, Escape, Tab, Backspace, LShift, RShift, LCtrl,
  RCtrl, LAlt, RAlt, Up, Down, Left, Right. Frames: <Project>\Generated\clips\<Name>\f_*.png; log:
  Saved\Logs\postkeys_<Name>.log. The game window appears on screen while it runs.
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][string]$Sequence,
    [Parameter(Mandatory = $true)][string]$Name,
    [string]$Project = '',
    [string]$Map = 'Main',
    [string]$StartPattern = 'PROOF capture start',
    [int]$ResX = 1280,
    [int]$ResY = 720,
    [double]$QuitAfter = 25,
    [int]$ShotEvery = 15,
    [double]$ReadyTimeoutSec = 150,
    [string]$GameArgs = '',
    # A packaged build's exe (the outer <Project>.exe or the inner Binaries\Win64 one): post the keys to the build that
    # ships instead of the editor's -game. No frames are captured (the capture script is editor Python): prove
    # results from the game's log. Give -StartPattern a line the GAME logs (its ready line); the game is stopped at
    # -QuitAfter if it has not quit by itself.
    [string]$Exe = '',
    # Print only the start and DONE lines: a 300-key sequence otherwise floods the session's context.
    [switch]$Quiet
)
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'game_common.ps1')
if (-not ('KitPostKeys' -as [type])) {
    Add-Type @"
using System;
using System.Runtime.InteropServices;
public static class KitPostKeys {
    [DllImport("user32.dll")] public static extern bool PostMessage(IntPtr h, uint msg, IntPtr w, IntPtr l);
    [DllImport("user32.dll")] public static extern uint MapVirtualKey(uint code, uint mapType);
    public static bool Down(IntPtr h, uint vk) {
        long l = 1 | ((long)MapVirtualKey(vk, 0) << 16);
        return PostMessage(h, 0x0100, (IntPtr)vk, (IntPtr)l);
    }
    public static bool Up(IntPtr h, uint vk) {
        long l = 1 | ((long)MapVirtualKey(vk, 0) << 16) | (1L << 30) | (1L << 31);
        return PostMessage(h, 0x0101, (IntPtr)vk, (IntPtr)l);
    }
}
"@
}
$vk = @{ Space = 0x20; Enter = 0x0D; Escape = 0x1B; Tab = 0x09; Backspace = 0x08; LShift = 0xA0; RShift = 0xA1
    LCtrl = 0xA2; RCtrl = 0xA3; LAlt = 0xA4; RAlt = 0xA5; Left = 0x25; Up = 0x26; Right = 0x27; Down = 0x28 }
foreach ($c in [char[]]'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') { $vk["$c"] = [int][char]$c }
for ($i = 1; $i -le 12; $i++) { $vk["F$i"] = 0x6F + $i }
$steps = @(foreach ($part in ($Sequence -split ';' | Where-Object { $_.Trim() })) {
    if ($part.Trim() -notmatch '^([0-9.]+)\s*:\s*(down|up|tap)\s+(\w+)$') { throw "bad sequence step: '$part'" }
    if (-not $vk.ContainsKey($Matches[3])) { throw "unknown key '$($Matches[3])'" }
    [pscustomobject]@{ At = [double]$Matches[1]; Action = $Matches[2]; Key = [uint32]$vk[$Matches[3]]; Name = $Matches[3] }
}) | Sort-Object At

$last = ($steps | Measure-Object -Property At -Maximum).Maximum
if ($last + 1 -gt $QuitAfter) { Write-Host "FAIL: the sequence runs to $last s but the game quits at -QuitAfter $QuitAfter s"; exit 1 }
$proj = Resolve-KitProject $Project
$safe = $Name -replace '[^\w-]', '_'
$log = Join-Path $proj.Dir "Saved\Logs\postkeys_$safe.log"
$capDir = Join-Path $proj.Dir "Generated\clips\$safe"
if (Test-Path $capDir) { Get-ChildItem $capDir -Filter 'f_*.png' | Remove-Item -Force }
$buildRoot = ''
if ($Exe) {
    if (-not (Test-Path -LiteralPath $Exe)) { Write-Host "FAIL: -Exe not found: $Exe"; exit 1 }
    if ($StartPattern -eq 'PROOF capture start') { Write-Host 'FAIL: with -Exe, pass -StartPattern with a line the game itself logs (its ready line)'; exit 1 }
    if (Test-Path $log) { Remove-Item $log -Force }
    # The folder that holds the whole build: the outer exe's own folder, or three levels up from the inner exe.
    $exeFull = (Resolve-Path -LiteralPath $Exe).Path
    $buildRoot = if ($exeFull -match '\\Binaries\\Win64\\[^\\]+$') { Split-Path (Split-Path (Split-Path (Split-Path $exeFull))) } else { Split-Path $exeFull }
    $p = Start-Process $exeFull -ArgumentList "-windowed -ResX=$ResX -ResY=$ResY -WinX=40 -WinY=40 -abslog=`"$log`" $GameArgs" -PassThru
} else {
    $p = Start-KitGame $proj $Map (Join-Path $PSScriptRoot 'frame_capture.py') @{
        KIT_CAP_DIR = $capDir; KIT_CAP_EVERY = $ShotEvery; KIT_QUIT_AFTER = $QuitAfter } $log $ResX $ResY $GameArgs
}
# The process that owns the game window: -game is the editor process itself; a packaged outer exe starts an inner one.
function Get-GamePid {
    if (-not $buildRoot) { return [uint32]$p.Id }
    $g = Get-Process | Where-Object { $_.MainWindowHandle -ne 0 -and $_.Path -and $_.Path.StartsWith($buildRoot, [StringComparison]::OrdinalIgnoreCase) } | Select-Object -First 1
    if ($g) { return [uint32]$g.Id } else { return [uint32]$p.Id }
}
function Test-GameGone {
    if (-not $buildRoot) { return $p.HasExited }
    return -not (Get-Process | Where-Object { $_.Path -and $_.Path.StartsWith($buildRoot, [StringComparison]::OrdinalIgnoreCase) })
}
function Stop-Game {
    if ($buildRoot) { Get-Process | Where-Object { $_.Path -and $_.Path.StartsWith($buildRoot, [StringComparison]::OrdinalIgnoreCase) } | Stop-Process -Force -ErrorAction SilentlyContinue }
    elseif (-not $p.HasExited) { Stop-Process -Id $p.Id -Force }
}
Write-Host "game pid $($p.Id), log $log"

$deadline = (Get-Date).AddSeconds($ReadyTimeoutSec)
# Look the window up after the start line: editor -game shows a splash window first, which closes on load.
while (-not ((Test-Path $log) -and (Select-String -Path $log -Pattern $StartPattern -Quiet))) {
    if ((Get-Date) -gt $deadline -or ($p.HasExited -and (Test-GameGone))) {
        Write-Host "FAIL: start line '$StartPattern' never appeared"
        Stop-Game
        Show-KitLog $log 20; exit 1
    }
    Start-Sleep -Milliseconds 20
}
$t0 = Get-Date
Write-Host ("start line seen at {0:HH:mm:ss.fff}" -f $t0)
$hwnd = [IntPtr]::Zero
$script:gamePid = 0
$held = @{}
foreach ($s in $steps) {
    while (((Get-Date) - $t0).TotalSeconds -lt $s.At) { Start-Sleep -Milliseconds 2 }
    if (-not $script:gamePid) { $script:gamePid = Get-GamePid }
    $h = [KitGameWin]::Largest($script:gamePid)
    if ($h -eq [IntPtr]::Zero) { Write-Host 'FAIL: the game window is gone'; exit 1 }
    if ($h -ne $hwnd) { Write-Host ("window 0x{0:X}" -f $h.ToInt64()); $hwnd = $h }
    $ok = switch ($s.Action) {
        'down' { $held[$s.Name] = $s.Key; [KitPostKeys]::Down($hwnd, $s.Key) }
        'up'   { $held.Remove($s.Name); [KitPostKeys]::Up($hwnd, $s.Key) }
        'tap'  { $a = [KitPostKeys]::Down($hwnd, $s.Key); Start-Sleep -Milliseconds 80; $b = [KitPostKeys]::Up($hwnd, $s.Key); $a -and $b }
    }
    if (-not $Quiet -or -not $ok) { Write-Host ("{0,6:N2}s {1,-4} {2,-9} posted={3} (sent at {4:N3}s)" -f $s.At, $s.Action, $s.Name, $ok, ((Get-Date) - $t0).TotalSeconds) }
}
foreach ($k in @($held.Keys)) { [void][KitPostKeys]::Up($hwnd, $held[$k]); Write-Host "released held key $k" }
if ($Exe) {
    # A packaged game has no capture script to quit it: wait out -QuitAfter (or its own exit), then stop it.
    while (((Get-Date) - $t0).TotalSeconds -lt $QuitAfter -and -not (Test-GameGone)) { Start-Sleep -Milliseconds 200 }
    if (-not (Test-GameGone)) { Stop-Game }
} elseif (-not $p.WaitForExit([int](($QuitAfter + 40) * 1000))) { Write-Host 'the game did not quit by itself: stopping it'; Stop-Process -Id $p.Id -Force }
$shots = @(Get-ChildItem $capDir -Filter 'f_*.png' -ErrorAction SilentlyContinue)
Show-KitLog $log 20
if ($Exe) { Write-Host "DONE (packaged build). log $log; no frames (prove results from the log)" }
else { Write-Host "DONE. log $log; $($shots.Count) frames in $capDir" }
