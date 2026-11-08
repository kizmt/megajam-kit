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
  capture script's start line). Keys: A-Z, 0-9, F1-F12, Space, Enter, Escape, Tab, Backspace, LShift, RShift, LCtrl,
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
    [string]$GameArgs = ''
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

$proj = Resolve-KitProject $Project
$safe = $Name -replace '[^\w-]', '_'
$log = Join-Path $proj.Dir "Saved\Logs\postkeys_$safe.log"
$capDir = Join-Path $proj.Dir "Generated\clips\$safe"
if (Test-Path $capDir) { Get-ChildItem $capDir -Filter 'f_*.png' | Remove-Item -Force }
$p = Start-KitGame $proj $Map (Join-Path $PSScriptRoot 'frame_capture.py') @{
    KIT_CAP_DIR = $capDir; KIT_CAP_EVERY = $ShotEvery; KIT_QUIT_AFTER = $QuitAfter } $log $ResX $ResY $GameArgs
Write-Host "game pid $($p.Id), log $log"

$deadline = (Get-Date).AddSeconds($ReadyTimeoutSec)
# Look the window up after the start line: editor -game shows a splash window first, which closes on load.
while (-not ((Test-Path $log) -and (Select-String -Path $log -Pattern $StartPattern -Quiet))) {
    if ((Get-Date) -gt $deadline -or $p.HasExited) {
        Write-Host "FAIL: start line '$StartPattern' never appeared"
        if (-not $p.HasExited) { Stop-Process -Id $p.Id -Force }
        Show-KitLog $log 20; exit 1
    }
    Start-Sleep -Milliseconds 20
}
$t0 = Get-Date
Write-Host ("start line seen at {0:HH:mm:ss.fff}" -f $t0)
$hwnd = [IntPtr]::Zero
$held = @{}
foreach ($s in $steps) {
    while (((Get-Date) - $t0).TotalSeconds -lt $s.At) { Start-Sleep -Milliseconds 2 }
    $h = [KitGameWin]::Largest([uint32]$p.Id)
    if ($h -eq [IntPtr]::Zero) { Write-Host 'FAIL: the game window is gone'; exit 1 }
    if ($h -ne $hwnd) { Write-Host ("window 0x{0:X}" -f $h.ToInt64()); $hwnd = $h }
    $ok = switch ($s.Action) {
        'down' { $held[$s.Name] = $s.Key; [KitPostKeys]::Down($hwnd, $s.Key) }
        'up'   { $held.Remove($s.Name); [KitPostKeys]::Up($hwnd, $s.Key) }
        'tap'  { $a = [KitPostKeys]::Down($hwnd, $s.Key); Start-Sleep -Milliseconds 80; $b = [KitPostKeys]::Up($hwnd, $s.Key); $a -and $b }
    }
    Write-Host ("{0,6:N2}s {1,-4} {2,-9} posted={3} (sent at {4:N3}s)" -f $s.At, $s.Action, $s.Name, $ok, ((Get-Date) - $t0).TotalSeconds)
}
foreach ($k in @($held.Keys)) { [void][KitPostKeys]::Up($hwnd, $held[$k]); Write-Host "released held key $k" }
if (-not $p.WaitForExit([int](($QuitAfter + 40) * 1000))) { Write-Host 'the game did not quit by itself: stopping it'; Stop-Process -Id $p.Id -Force }
$shots = @(Get-ChildItem $capDir -Filter 'f_*.png' -ErrorAction SilentlyContinue)
Show-KitLog $log 20
Write-Host "DONE. log $log; $($shots.Count) frames in $capDir"
