#Requires -Version 5.1
<#
.SYNOPSIS
  Films the game playing itself (an autoplay hook in the game, no key injection): launches a map standalone (-game) in
  a 1920x1080 window from the editor build, waits for a start line in the log, records the window through
  record_window.ps1 (only while the game is alive, focused and uncovered), then closes the game.
.DESCRIPTION
  The game window takes the foreground while it runs: tell the director first, and close nothing of theirs.
  The autoplay hook is game code written during the jam (a cvar plus a command-line flag that drives the same
  functions real input calls); this script only launches and records. Autoplay clips are for review and regression,
  never proof that real keys work (that is the director playing, or keytest.ps1 with their yes).
  With the editor open the -game instance writes a different log, so -abslog is always passed.
  Record with the editor in the background or closed: with the editor in front, a clip once showed the editor's
  viewport for its first seconds.
.EXAMPLE
  & C:\dev\megajam-kit\gen\test\autoclip.ps1 -Map Main -GameArgs '-Autoplay' -StartPattern 'Autoplay on' -Seconds 20 `
      -Out C:\dev\MyGame\Generated\clips\autoplay.mp4
#>
param([string]$Project = '', [string]$Map = 'Main', [string]$GameArgs = '', [string]$StartPattern = 'Autoplay on',
    [Parameter(Mandatory)][string]$Out, [int]$Seconds = 20, [int]$ReadyTimeoutSec = 180)
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'game_common.ps1')
$proj = Resolve-KitProject $Project
$log = Join-Path $proj.Dir 'Saved\Logs\autoclip.log'
if (Test-Path $log) { Remove-Item $log }
New-Item -ItemType Directory -Force -Path (Split-Path $Out) | Out-Null
$args2 = "`"$($proj.UProject)`" $Map -game -windowed -ResX=1920 -ResY=1080 -WinX=40 -WinY=40 -log -abslog=`"$log`" $GameArgs"
$p = Start-Process (Get-EditorExe) -ArgumentList $args2 -PassThru
$h = Wait-GameWindow -Process $p -Log $log -Pattern $StartPattern -TimeoutSec $ReadyTimeoutSec
if ($h -eq [IntPtr]::Zero) {
    Write-Host "FAIL: game window or the '$StartPattern' log line never appeared"
    Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue; exit 1
}
$ok = $false
try {
    Set-GameForeground $h
    & (Join-Path $PSScriptRoot 'record_window.ps1') -GamePid $p.Id -Hwnd $h -Out $Out -Seconds $Seconds
    $ok = $LASTEXITCODE -eq 0
} finally {
    Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue   # only the instance this script started, even on an error
}
if (-not $ok) { exit 1 }
Write-Host "DONE $Out"
