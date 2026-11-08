#Requires -Version 5.1
<#
.SYNOPSIS
  Temporal-stability check (shimmer, boiling, crawling edges) in -game: stability_capture.py saves bursts of
  consecutive frames per variant and camera-set camera; this script measures them with ffmpeg, one line per burst:
    flicker = mean |frame-to-frame| luma change over the static burst (0-255 levels; 0 = perfectly stable)
    area%   = share of pixels whose mean frame-to-frame change is above 6 levels (visible shimmer)
    grain   = mean |frame - blurred frame| of the first frame (spatial noise; compare variants of one camera)
  and writes a heat map per burst (<prefix>_<variant>_<cam>_heat.png, x8 gain, turbo colours).
.DESCRIPTION
  Critics judge stills and can't see shimmer; this can. Bar used in a practice run: area% <= 0.02 per camera after
  every look change. The game clock runs at a fixed step (-FixedFps, default 60): each burst frame stalls ~0.27 s on
  the screenshot save, and on wall-clock time any time-driven material (a pulse) jumps between "consecutive" frames
  and reads as flicker. Real motion isn't instability: tag moving actors "StabilityFreeze" (stability_capture.py).
.EXAMPLE
  & C:\dev\megajam-kit\gen\test\stability.ps1 -Prefix st1
  & C:\dev\megajam-kit\gen\test\stability.ps1 -Prefix st2 -Cams 'Hub' -Variants '[{"name":"base"},{"name":"sp","cmds":["r.ScreenPercentage 75"]}]'
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][string]$Prefix,
    [string]$Project = '',
    [string]$Variants = '[{"name":"base"}]',
    [string]$Cams = '',
    [int]$Settle = 180,
    [int]$Burst = 6,
    [string]$Map = 'Main',
    [string]$OutDir = '',
    [int]$ResX = 1920,
    [int]$ResY = 1080,
    [int]$FixedFps = 60,
    [int]$TimeoutSec = 420,
    [switch]$NoFreeze,
    [switch]$MetricsOnly
)
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'game_common.ps1')
$proj = Resolve-KitProject $Project
$ff = Find-Ffmpeg
if (-not $ff) { throw 'ffmpeg not found (PATH or WinGet Gyan.FFmpeg)' }
if (-not $OutDir) { $OutDir = Join-Path $proj.Dir 'Generated\stab' }
$Prefix = $Prefix -replace '[^\w-]', '_'
$OutDir = Join-Path $OutDir $Prefix   # one folder per prefix: a run never deletes another run's bursts
if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir | Out-Null }
try { $null = $Variants | ConvertFrom-Json } catch { Write-Host "FAIL: -Variants is not valid JSON: $($_.Exception.Message)"; exit 1 }
$log = Join-Path $proj.Dir "Saved\Logs\stab_$Prefix.log"

if (-not $MetricsOnly) {
    Get-ChildItem $OutDir -Filter "$Prefix`_*" | Remove-Item
    $extra = $(if ($FixedFps -gt 0) { "-UseFixedTimeStep -FPS=$FixedFps" } else { '' })
    $p = Start-KitGame $proj $Map (Join-Path $PSScriptRoot 'stability_capture.py') @{
        KIT_CAP_DIR = $OutDir; KIT_PREFIX = $Prefix; KIT_CAMS = $Cams; KIT_SETTLE = $Settle; KIT_BURST = $Burst
        KIT_VARIANTS = $Variants; KIT_FREEZE = $(if ($NoFreeze) { '0' } else { '1' }) } $log $ResX $ResY $extra
    Write-Host "game pid $($p.Id), log $log"
    if (-not $p.WaitForExit($TimeoutSec * 1000)) { Write-Host "the game did not quit within $TimeoutSec s: stopping it"; Stop-Process -Id $p.Id -Force }
    Show-KitLog $log 60
}

# ---- metrics (ffmpeg runs inside $OutDir so the metadata file needs no drive colon in the filter graph)
$meta = Join-Path $OutDir "$Prefix`_meta.txt"
$metaF = "$Prefix`_meta.txt"
Push-Location $OutDir
try {
function Get-Stat([string[]]$inArgs, [string]$vf, [string]$key) {
    Remove-Item $meta -ErrorAction SilentlyContinue
    & $ff -v error @inArgs -vf "$vf,signalstats,metadata=print:file=$metaF" -f null - | Out-Null
    $line = Select-String -Path $meta -Pattern "lavfi.signalstats.$key=" -ErrorAction SilentlyContinue | Select-Object -Last 1
    if ($line) { [double]($line.Line -split '=')[1] } else { [double]::NaN }
}
$rows = @()
$groups = Get-ChildItem $OutDir -Filter "$Prefix`_*_s0.png" | Sort-Object Name
foreach ($g in $groups) {
    $stem = $g.Name.Substring(0, $g.Name.Length - '_s0.png'.Length)
    $n = (Get-ChildItem $OutDir -Filter "$stem`_s*.png").Count
    if ($n -lt 3) { continue }
    $seq = @('-start_number', '0', '-i', (Join-Path $OutDir "$stem`_s%d.png"))
    $sel = "select='eq(n,$($n - 2))'"
    $diff = "format=gray,tblend=all_mode=difference,tmix=frames=$($n - 1),$sel"
    $flicker = Get-Stat $seq $diff 'YAVG'
    $area = (Get-Stat $seq "$diff,lut=c0='if(gt(val,6),255,0)'" 'YAVG') / 2.55
    $first = @('-i', (Join-Path $OutDir "$stem`_s0.png"))
    $grain = Get-Stat $first "format=gray,split[a][b];[b]gblur=sigma=1.5[c];[a][c]blend=all_mode=difference" 'YAVG'
    $heat = Join-Path $OutDir "$stem`_heat.png"
    & $ff -v error -y @seq -vf "$diff,lut=c0='min(val*8,255)',format=yuv444p,pseudocolor=preset=turbo,scale=960:-2" -frames:v 1 -update 1 $heat | Out-Null
    $mot = ''
    if (Test-Path (Join-Path $OutDir "$stem`_m0.png")) {
        $ms = @(); $ma = @()
        foreach ($k in 0, 1) {
            $mc = @('-i', (Join-Path $OutDir "$stem`_m$k.png"), '-i', (Join-Path $OutDir "$stem`_c$k.png"))
            $fc = "[0]format=gray[a];[1]format=gray[b];[a][b]blend=all_mode=difference"
            Remove-Item $meta -ErrorAction SilentlyContinue
            & $ff -v error @mc -filter_complex "$fc,signalstats,metadata=print:file=$metaF" -f null - | Out-Null
            $ms += [double](((Select-String -Path $meta -Pattern 'lavfi.signalstats.YAVG=' -ErrorAction SilentlyContinue | Select-Object -Last 1).Line -split '=')[1])
            Remove-Item $meta -ErrorAction SilentlyContinue
            & $ff -v error @mc -filter_complex "$fc,lut=c0='if(gt(val,12),255,0)',signalstats,metadata=print:file=$metaF" -f null - | Out-Null
            $ma += [double](((Select-String -Path $meta -Pattern 'lavfi.signalstats.YAVG=' -ErrorAction SilentlyContinue | Select-Object -Last 1).Line -split '=')[1]) / 2.55
            if ($k -eq 0) {
                & $ff -v error -y @mc -filter_complex "$fc,lut=c0='min(val*4,255)',format=yuv444p,pseudocolor=preset=turbo,scale=960:-2" -frames:v 1 -update 1 (Join-Path $OutDir "$stem`_mheat.png") | Out-Null
            }
        }
        $mot = ' motion={0:N2} marea%={1:N2}' -f (($ms | Measure-Object -Average).Average), (($ma | Measure-Object -Average).Average)
    }
    $pan = $mot
    if (Test-Path (Join-Path $OutDir "$stem`_p0.png")) {
        $pg = Get-Stat @('-i', (Join-Path $OutDir "$stem`_p$($n - 1).png")) "format=gray,split[a][b];[b]gblur=sigma=1.5[c];[a][c]blend=all_mode=difference" 'YAVG'
        $pan = $mot + (' pan_grain={0:N2}' -f $pg)
    }
    $rows += ('{0,-34} flicker={1,6:N3} area%={2,6:N2} grain={3,5:N2}{4}' -f $stem.Substring($Prefix.Length + 1), $flicker, $area, $grain, $pan)
}
} finally { Pop-Location }
$rows | ForEach-Object { $_ }
if (-not $rows) { Write-Host 'FAIL: no bursts measured (no CamSet cameras, or the game did not reach the level)'; exit 1 }
