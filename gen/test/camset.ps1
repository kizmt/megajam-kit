#Requires -Version 5.1
<#
.SYNOPSIS
  Captures the fixed camera set in -game: one settled frame per CamSet camera (camset_capture.py), at the game's own
  resolution and settings, then quits. Use it for every visual before/after and every critic round.
.DESCRIPTION
  The camera set is CameraActors in the level tagged "CamSet" plus "cam:<Name>" (art/camera-set.md lists them).
  Frames: <OutDir>\<Prefix>_<Name>.png (default <Project>\Generated\look). -Exec runs console commands first (a look
  variant: "r.Lumen.Reflections.DownsampleFactor 1;r.Tonemapper.Sharpen 0.5"). -Measure uncaps the frame rate and
  logs a mean frame time per camera (rough; benches come from gen/perf/bench.ts on a packaged build).
.EXAMPLE
  & C:\dev\megajam-kit\gen\test\camset.ps1 -Prefix r3_before
  & C:\dev\megajam-kit\gen\test\camset.ps1 -Prefix r3_after -Cams 'Hub,Exit' -Exec 'r.Tonemapper.Sharpen 0.5'
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][string]$Prefix,
    [string]$Project = '',
    [string]$Map = 'Main',
    [string]$OutDir = '',
    [int]$ResX = 1920,
    [int]$ResY = 1080,
    [int]$Settle = 120,
    [string]$Cams = '',
    [string]$Exec = '',
    [switch]$Measure,
    [switch]$ShowUI,
    [int]$TimeoutSec = 300,
    [string]$GameArgs = ''
)
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'game_common.ps1')
$proj = Resolve-KitProject $Project
if (-not $OutDir) { $OutDir = Join-Path $proj.Dir 'Generated\look' }
$safe = $Prefix -replace '[^\w-]', '_'
Get-ChildItem $OutDir -Filter "$safe`_*.png" -ErrorAction SilentlyContinue | Remove-Item -Force
$log = Join-Path $proj.Dir "Saved\Logs\camset_$safe.log"
$p = Start-KitGame $proj $Map (Join-Path $PSScriptRoot 'camset_capture.py') @{
    KIT_CAP_DIR = $OutDir; KIT_PREFIX = $safe; KIT_SETTLE = $Settle; KIT_CAMS = $Cams; KIT_EXEC = $Exec
    KIT_MEASURE = $(if ($Measure) { '1' } else { '0' }); KIT_SHOWUI = $(if ($ShowUI) { '1' } else { '0' }) } $log $ResX $ResY $GameArgs
Write-Host "game pid $($p.Id), log $log"
if (-not $p.WaitForExit($TimeoutSec * 1000)) { Write-Host "the game did not quit within $TimeoutSec s: stopping it"; Stop-Process -Id $p.Id -Force }
Show-KitLog $log
$frames = @(Get-ChildItem $OutDir -Filter "$safe`_*.png" -ErrorAction SilentlyContinue)
$frames | ForEach-Object { "$($_.FullName) $([math]::Round($_.Length / 1KB)) KB" }
if (-not $frames) { Write-Host 'FAIL: no frames (no CamSet cameras, or the game did not reach the level)'; exit 1 }
