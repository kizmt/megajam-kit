#Requires -Version 5.1
<#
.SYNOPSIS
  SETUP.md step 7b in one command: the game's display settings and its render path, written into the project's
  Config\Default*.ini files. Run with the editor closed.

    C:\dev\megajam-kit\scripts\apply-7b.ps1 -Project C:\dev\<Name> -Path lumen
    C:\dev\megajam-kit\scripts\apply-7b.ps1 -Project C:\dev\<Name> -Path none -Internal 58.33 -Title "Thirteen O'Clock"
    C:\dev\megajam-kit\scripts\apply-7b.ps1 -Project C:\dev\<Name> -Check        (prints what is set; writes nothing)

.DESCRIPTION
  -Path      lumen  full Lumen GI and reflections, High GI/reflection/shadow quality (looks that need bounce light)
             lite   Lumen Lite: Medium GI and reflections (softer GI, screen-space reflections only)
             none   no Lumen: SSR, TSR, no ambient occlusion passes (flat or stylized looks, many moving characters)
  -Internal  internal render resolution as a percentage of the output. Default 50 (1080p on a 4K display) for the
             Lumen paths, 58.33 (1260p) for none. The bench decides the real value: rerun with it.
  -Title     the window title (ProjectDisplayedTitle). A plain string is right: the engine reads it as raw text
             (FTextStringHelper::ReadFromBuffer). A Development build still appends "(64-bit Development ...)".
  -Version   ProjectVersion, e.g. 0.1.0.   -Company   CompanyName.   All three are written only when given.
  -Check     report each setting as set, different or missing, and exit 0 when all are set (1 otherwise).

  Every setting is one "key=value" under its section: an existing key is updated, a missing one added, nothing else
  in the files is touched, so it is safe to rerun and to switch paths (switching to a Lumen path removes the no-Lumen
  path's two ambient-occlusion lines). What the script can't do is printed at the end: the level's VolumetricCloud
  actor, the post-process volume's reflection cap, the icon and splash, and the bench that confirms the choice.
#>
param(
    [Parameter(Mandatory)][string]$Project,
    [ValidateSet('lumen', 'lite', 'none')][string]$Path = 'lumen',
    [double]$Internal = 0,
    [string]$Title = '',
    [string]$Version = '',
    [string]$Company = '',
    [switch]$Check
)
$ErrorActionPreference = 'Stop'
$Project = $Project.TrimEnd('\')
$uprojects = @(Get-ChildItem -LiteralPath $Project -Filter *.uproject -ErrorAction SilentlyContinue)
if ($uprojects.Count -ne 1) { Write-Host "FAIL: expected one .uproject in $Project"; exit 1 }
$name = $uprojects[0].BaseName
if (-not $Check -and (Get-Process UnrealEditor -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -like "$name*" })) {
    Write-Host "FAIL: close the editor for $name first (render settings are read at startup, and the editor can rewrite these files when it exits)"; exit 1
}
if ($Internal -le 0) { $Internal = if ($Path -eq 'none') { 58.33 } else { 50 } }
if ($Internal -lt 25 -or $Internal -gt 100) { Write-Host "FAIL: -Internal is a percentage between 25 and 100 (got $Internal)"; exit 1 }
$sp = $Internal.ToString('0.##', [Globalization.CultureInfo]::InvariantCulture)
$utf8 = New-Object System.Text.UTF8Encoding($false)
$config = Join-Path $Project 'Config'
$script:changed = 0; $script:bad = 0

function Read-Ini([string]$File) { if (Test-Path -LiteralPath $File) { , @(Get-Content -LiteralPath $File) } else { , @() } }
function Find-Section($lines, [string]$Section) {
    for ($i = 0; $i -lt $lines.Count; $i++) { if ($lines[$i].Trim() -eq "[$Section]") { return $i } }
    return -1
}
# The value of Key under Section, or $null. The LAST matching line wins, as it does in the engine.
function Get-IniValue([string]$File, [string]$Section, [string]$Key) {
    $lines = Read-Ini $File; $start = Find-Section $lines $Section; $found = $null
    if ($start -lt 0) { return $null }
    for ($i = $start + 1; $i -lt $lines.Count -and $lines[$i] -notmatch '^\['; $i++) {
        if ($lines[$i] -match "^$([regex]::Escape($Key))=(.*)$") { $found = $Matches[1] }
    }
    return $found
}
function Set-IniValue([string]$File, [string]$Section, [string]$Key, [string]$Value) {
    $label = "$(Split-Path -Leaf $File) [$Section] $Key=$Value"
    $have = Get-IniValue $File $Section $Key
    if ($have -eq $Value) { Write-Host "  ok     $label"; return }
    if ($Check) { $script:bad++; Write-Host "  $(if ($null -eq $have) { 'MISSING' } else { 'DIFFERS' }) $label$(if ($null -ne $have) { "   (file has $have)" })"; return }
    $lines = Read-Ini $File; $start = Find-Section $lines $Section
    if ($start -ge 0) {
        $at = -1
        for ($i = $start + 1; $i -lt $lines.Count -and $lines[$i] -notmatch '^\['; $i++) { if ($lines[$i] -match "^$([regex]::Escape($Key))=") { $at = $i } }
        if ($at -ge 0) { $lines[$at] = "$Key=$Value" }
        else { $lines = @($lines[0..$start]) + "$Key=$Value" + @(if ($start + 1 -lt $lines.Count) { $lines[($start + 1)..($lines.Count - 1)] }) }
    } else {
        $lines = @($lines) + $(if ($lines.Count) { '' }) + "[$Section]" + "$Key=$Value" | Where-Object { $null -ne $_ }
    }
    [IO.File]::WriteAllLines($File, [string[]]$lines, $utf8); $script:changed++
    Write-Host "  $(if ($null -eq $have) { 'added ' } else { 'set   ' }) $label$(if ($null -ne $have) { "   (was $have)" })"
}
function Remove-IniKey([string]$File, [string]$Section, [string]$Key) {
    if ($null -eq (Get-IniValue $File $Section $Key)) { return }
    $label = "$(Split-Path -Leaf $File) [$Section] $Key"
    if ($Check) { $script:bad++; Write-Host "  EXTRA   $label (belongs to the no-Lumen path)"; return }
    $lines = Read-Ini $File; $out = @(); $inSection = $false
    foreach ($l in $lines) {
        if ($l -match '^\[') { $inSection = ($l.Trim() -eq "[$Section]") }
        elseif ($inSection -and $l -match "^$([regex]::Escape($Key))=") { continue }
        $out += $l
    }
    [IO.File]::WriteAllLines($File, [string[]]$out, $utf8); $script:changed++
    Write-Host "  removed $label"
}

$engine = Join-Path $config 'DefaultEngine.ini'
$scal = Join-Path $config 'DefaultScalability.ini'
$gus = Join-Path $config 'DefaultGameUserSettings.ini'
$inputIni = Join-Path $config 'DefaultInput.ini'
$game = Join-Path $config 'DefaultGame.ini'
$R = '/Script/Engine.RendererSettings'

Write-Host "${name}: SETUP 7b, path $Path, internal resolution $sp%$(if ($Check) { ' (check only)' })"
Write-Host 'All paths'
Set-IniValue $engine $R 'r.DefaultFeature.MotionBlur' 'False'
Set-IniValue $engine '/Script/Engine.UserInterfaceSettings' 'bAllowHighDPIInGameMode' 'True'
Set-IniValue $engine 'SystemSettings' 'r.Tonemapper.Sharpen' '0'
Set-IniValue $engine 'SystemSettings' 'r.ScreenPercentage.Default.Desktop.Mode' '0'
Set-IniValue $engine 'SystemSettings' 'r.ScreenPercentage.Default' $sp
Set-IniValue $scal 'AntiAliasingQuality@3' 'r.TSR.History.ScreenPercentage' '100'
Set-IniValue $scal 'AntiAliasingQuality@Cine' 'r.TSR.History.ScreenPercentage' '100'
foreach ($p in @(@('1', '1000'), @('2', '1800'), @('3', '2500'), @('Cine', '3000'))) {
    Set-IniValue $scal "TextureQuality@$($p[0])" 'r.Streaming.PoolSize' $p[1]
}
Set-IniValue $scal 'TextureQuality@3' 'r.Streaming.LimitPoolSizeToVRAM' '1'
Set-IniValue $scal 'TextureQuality@Cine' 'r.Streaming.LimitPoolSizeToVRAM' '1'
Set-IniValue $gus '/Script/Engine.GameUserSettings' 'FullscreenMode' '1'
Set-IniValue $gus '/Script/Engine.GameUserSettings' 'PreferredFullscreenMode' '1'

# The console on F10 as well as tilde (backtick is a dead key on some layouts). An array entry, so a "+" line.
$inLines = Read-Ini $inputIni
if ($inLines -contains '+ConsoleKeys=F10') { Write-Host '  ok     DefaultInput.ini +ConsoleKeys=F10' }
elseif ($Check) { $script:bad++; Write-Host '  MISSING DefaultInput.ini +ConsoleKeys=F10' }
else {
    $at = -1
    for ($i = 0; $i -lt $inLines.Count; $i++) { if ($inLines[$i] -eq '+ConsoleKeys=Tilde') { $at = $i } }
    if ($at -lt 0) { $at = Find-Section $inLines '/Script/Engine.InputSettings' }
    if ($at -lt 0) { $inLines = @($inLines) + '[/Script/Engine.InputSettings]' + '+ConsoleKeys=F10' }
    else { $inLines = @($inLines[0..$at]) + '+ConsoleKeys=F10' + @(if ($at + 1 -lt $inLines.Count) { $inLines[($at + 1)..($inLines.Count - 1)] }) }
    [IO.File]::WriteAllLines($inputIni, [string[]]$inLines, $utf8); $script:changed++
    Write-Host '  added  DefaultInput.ini +ConsoleKeys=F10'
}

$G = '/Script/EngineSettings.GeneralProjectSettings'
if ($Title) { Set-IniValue $game $G 'ProjectName' $Title; Set-IniValue $game $G 'ProjectDisplayedTitle' $Title }
if ($Version) { Set-IniValue $game $G 'ProjectVersion' $Version }
if ($Company) { Set-IniValue $game $G 'CompanyName' $Company }

Write-Host "Render path: $Path"
if ($Path -eq 'none') {
    Set-IniValue $engine $R 'r.DynamicGlobalIlluminationMethod' '0'
    Set-IniValue $engine $R 'r.ReflectionMethod' '2'
    Set-IniValue $engine $R 'r.AntiAliasingMethod' '4'
    Set-IniValue $engine 'SystemSettings' 'r.AmbientOcclusionLevels' '0'
    Set-IniValue $engine 'SystemSettings' 'r.DistanceFieldAO' '0'
} else {
    Set-IniValue $engine $R 'r.DynamicGlobalIlluminationMethod' '1'
    Set-IniValue $engine $R 'r.ReflectionMethod' '1'
    Remove-IniKey $engine 'SystemSettings' 'r.AmbientOcclusionLevels'
    Remove-IniKey $engine 'SystemSettings' 'r.DistanceFieldAO'
    $q = if ($Path -eq 'lite') { '1' } else { '2' }
    Set-IniValue $gus 'ScalabilityGroups' 'sg.GlobalIlluminationQuality' $q
    Set-IniValue $gus 'ScalabilityGroups' 'sg.ReflectionQuality' $q
    Set-IniValue $gus 'ScalabilityGroups' 'sg.ShadowQuality' '2'
}

Write-Host ''
if ($Check) {
    if ($script:bad) { Write-Host "$($script:bad) setting(s) not as SETUP 7b ($Path) has them: run this script without -Check, editor closed"; exit 1 }
    Write-Host "All of SETUP 7b ($Path) is set."; exit 0
}
Write-Host "$($script:changed) change(s) written. Left for the session (SETUP.md 7b has the detail):"
$left = @(
    'Record the render path, the internal resolution and the target fps in DECISIONS.md.',
    "Level: delete the template's VolumetricCloud actor (about 2.5 ms at 4K)."
)
if ($Path -eq 'lumen') {
    $left += 'Post-process volume (built at the style lock): LumenMaxRoughnessToTraceReflections 0.25.'
    $left += 'With a physically bright sun (~100,000 lux): r.EyeAdaptation.CachedLightingPreExposure=8 under [/Script/Engine.RendererSettings].'
}
if ($Path -eq 'none') { $left += 'Lighting stand-ins for the missing bounce: docs\ue\lighting.md "No-Lumen look".' }
if (-not $Title) { $left += 'Window title: rerun with -Title "<Game Name>" [-Version 0.1.0] [-Company <Team>] once the game has a name.' }
$left += 'Icon and splash: Project Settings > Platforms > Windows (needs a package).'
$left += "Check: package, then  node gen\perf\bench.ts --res native --target-fps <target> --variant `"check:`"  and rerun this script with the -Internal the bench supports."
$n = 1; foreach ($t in $left) { Write-Host "  $n. $t"; $n++ }
