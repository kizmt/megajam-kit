#Requires -Version 5.1
<#
.SYNOPSIS
  Renders a shot list offline for the trailer and the page screenshots (docs/ue/cinematics-video.md D3b): the game
  runs in -game on a fixed clock, shots_capture.py saves every frame of every shot, and ffmpeg encodes one mp4 per
  shot plus all shots joined in order. Smooth at any machine speed; nothing needs the foreground.
.DESCRIPTION
  The shot list is a JSON file (format in shots_capture.py): camera-set cameras, still or moving from -> to, or the
  player's own camera with console commands that drive the game's test hooks. Write it at the concept stage (the
  60-second moment, the set piece, the ending) and build those spots on purpose.
  The clips are silent: record the game's own mix separately in real time (cinematics-video.md D1, the submix
  recorder) or score the edit. Frames: <OutDir>\<shot>\f_*.png; clips: <OutDir>\<shot>.mp4 and <OutDir>\all.mp4.
.EXAMPLE
  & C:\dev\megajam-kit\gen\test\shots.ps1 -Shots C:\dev\MyGame\design\shots.json -Fps 60 -ResX 1920 -ResY 1080
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][string]$Shots,
    [string]$Project = '',
    [string]$Map = 'Main',
    [string]$OutDir = '',
    [int]$Fps = 60,
    [int]$ResX = 1920,
    [int]$ResY = 1080,
    [int]$Settle = 60,
    [int]$Crf = 16,
    [switch]$ShowUI,
    [switch]$KeepFrames,
    [string]$GameArgs = ''
)
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'game_common.ps1')
$proj = Resolve-KitProject $Project
$ff = Find-Ffmpeg
if (-not $ff) { throw 'ffmpeg not found (PATH or WinGet Gyan.FFmpeg)' }
$list = Get-Content $Shots -Raw | ConvertFrom-Json
if (-not $OutDir) { $OutDir = Join-Path $proj.Dir 'Generated\shots' }
if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir | Out-Null }
foreach ($s in $list) { $d = Join-Path $OutDir $s.name; if (Test-Path $d) { Get-ChildItem $d -Filter 'f_*.png' | Remove-Item -Force } }
# About 0.3 s of wall time per saved frame plus loading: give it room.
$frames = ($list | ForEach-Object { [double]$(if ($_.seconds) { $_.seconds } else { 3 }) * $Fps + $Settle } | Measure-Object -Sum).Sum
$timeout = [int](180 + $frames * 0.6)
$log = Join-Path $proj.Dir 'Saved\Logs\shots.log'
$p = Start-KitGame $proj $Map (Join-Path $PSScriptRoot 'shots_capture.py') @{
    KIT_CAP_DIR = $OutDir; KIT_SHOTS = (Resolve-Path $Shots).Path; KIT_SETTLE = $Settle
    KIT_SHOWUI = $(if ($ShowUI) { '1' } else { '0' }) } $log $ResX $ResY "-UseFixedTimeStep -FPS=$Fps $GameArgs"
Write-Host "game pid $($p.Id), log $log, ~$([int]$frames) frames, timeout $timeout s"
if (-not $p.WaitForExit($timeout * 1000)) { Write-Host "the game did not quit within $timeout s: stopping it"; Stop-Process -Id $p.Id -Force }
Show-KitLog $log 40

$clips = @()
foreach ($s in $list) {
    $d = Join-Path $OutDir $s.name
    $n = @(Get-ChildItem $d -Filter 'f_*.png' -ErrorAction SilentlyContinue).Count
    if ($n -lt 2) { Write-Host "SKIP $($s.name): $n frames"; continue }
    $mp4 = Join-Path $OutDir "$($s.name).mp4"
    # Even dimensions for yuv420p; frames are PNG from `shot`.
    & $ff -v error -y -framerate $Fps -i (Join-Path $d 'f_%05d.png') -vf 'scale=trunc(iw/2)*2:trunc(ih/2)*2' `
        -c:v libx264 -preset slow -crf $Crf -pix_fmt yuv420p -movflags +faststart $mp4
    if ($LASTEXITCODE -ne 0) { Write-Host "FAIL: ffmpeg could not encode $($s.name)"; continue }
    $clips += $mp4
    Write-Host ("{0}: {1} frames = {2:N2} s -> {3}" -f $s.name, $n, ($n / $Fps), $mp4)
    if (-not $KeepFrames) { Get-ChildItem $d -Filter 'f_*.png' | Select-Object -Skip 1 | Remove-Item -Force }  # keep f_00000 as a still
}
if ($clips.Count -gt 1) {
    $cat = Join-Path $OutDir 'concat.txt'
    [IO.File]::WriteAllLines($cat, @($clips | ForEach-Object { "file '$($_.Replace('\', '/'))'" }))
    $all = Join-Path $OutDir 'all.mp4'
    & $ff -v error -y -f concat -safe 0 -i $cat -c copy $all
    if ($LASTEXITCODE -eq 0) { Write-Host "all shots: $all" }
}
if (-not $clips) { Write-Host 'FAIL: no clips'; exit 1 }
