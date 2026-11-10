#Requires -Version 5.1
<#
.SYNOPSIS
  Full C++ build of the editor target for the Unreal project in the parent folder of this script.
  Use after adding/changing UCLASS/UPROPERTY/UFUNCTION/USTRUCT or Build.cs (Live Coding can't do those).
  The editor must be closed. Prints PASS/FAIL with every warning and error; exit code 0 only on a clean
  build (zero warnings, per the kit rules) unless -AllowWarnings.
.EXAMPLE
  .\scripts\build.ps1
#>
[CmdletBinding()]
param(
    [string]$EngineRoot = '',          # default: the engine the .uproject names (Resolve-KitEngine)
    [string]$Configuration = 'Development',
    [switch]$AllowWarnings
)

$ErrorActionPreference = 'Stop'

# The engine this project uses: the .uproject's EngineAssociation ("5.8", "5.9", or a source build's GUID), looked up
# in the Launcher's install list, then the default install folder. KIT_ENGINE_ROOT overrides. So one script serves a
# 5.8 and a 5.9 project side by side: switching a project's engine (right-click the .uproject > Switch Unreal Engine
# version) is all it takes.
function Resolve-KitEngine([string]$UProject) {
    if ($env:KIT_ENGINE_ROOT) { return $env:KIT_ENGINE_ROOT }
    $assoc = [string](Get-Content -Raw $UProject | ConvertFrom-Json).EngineAssociation
    if (-not $assoc) { throw "$UProject has no EngineAssociation: open it once in the editor, or pass -EngineRoot" }
    if ($assoc -match '^\{?[0-9A-Fa-f-]{36}\}?$') {
        $builds = Get-ItemProperty 'HKCU:\Software\Epic Games\Unreal Engine\Builds' -ErrorAction SilentlyContinue
        $root = if ($builds) { $builds.PSObject.Properties[$assoc].Value } else { $null }
        if ($root) { return $root }
        # The registration can vanish: on 2026-11-11 the Builds key was empty after the Launcher started, while
        # projects made earlier still named the GUID. Fall back to the Launcher engine that built this project's
        # editor module (same BuildId).
        $modules = Join-Path (Split-Path $UProject) 'Binaries\Win64\UnrealEditor.modules'
        $installed = Join-Path $env:ProgramData 'Epic\UnrealEngineLauncher\LauncherInstalled.dat'
        if ((Test-Path $modules) -and (Test-Path $installed)) {
            $id = (Get-Content -Raw $modules | ConvertFrom-Json).BuildId
            foreach ($e in @((Get-Content -Raw $installed | ConvertFrom-Json).InstallationList | ForEach-Object { $_ } | Where-Object { $_.AppName -like 'UE_*' })) {
                $em = Join-Path $e.InstallLocation 'Engine\Binaries\Win64\UnrealEditor.modules'
                if ((Test-Path $em) -and ((Get-Content -Raw $em | ConvertFrom-Json).BuildId -eq $id)) { return $e.InstallLocation }
            }
        }
        throw "engine $assoc (from $UProject) is not registered (HKCU\Software\Epic Games\Unreal Engine\Builds) and no Launcher engine matches the project's build: right-click the .uproject > Switch Unreal Engine version, or set KIT_ENGINE_ROOT"
    }
    $dat = Join-Path $env:ProgramData 'Epic\UnrealEngineLauncher\LauncherInstalled.dat'
    if (Test-Path $dat) {
        $hit = @((Get-Content -Raw $dat | ConvertFrom-Json).InstallationList | ForEach-Object { $_ } |
            Where-Object { $_.AppName -eq "UE_$assoc" -and (Test-Path $_.InstallLocation) }) | Select-Object -First 1
        if ($hit) { return $hit.InstallLocation }
    }
    $default = "C:\Program Files\Epic Games\UE_$assoc"
    if (Test-Path $default) { return $default }
    throw "engine $assoc (from $UProject) not found: install it in the Epic Games Launcher, or pass -EngineRoot"
}

if (Get-Process -Name UnrealEditor -ErrorAction SilentlyContinue) {
    Write-Host 'FAIL: UnrealEditor.exe is running. Save, close the editor, then run this again.'
    Write-Host '      (New reflected types need a full build; Live Coding locks UnrealBuildTool while the editor is open.)'
    exit 1
}

$projectDir = Split-Path -Parent $PSScriptRoot
$uproject = Get-ChildItem -Path $projectDir -Filter *.uproject -File | Select-Object -First 1
if (-not $uproject) { Write-Host "FAIL: no .uproject found in $projectDir"; exit 1 }
$name = $uproject.BaseName
if (-not $EngineRoot) { $EngineRoot = Resolve-KitEngine $uproject.FullName }
Write-Host "engine: $EngineRoot"
$buildBat = Join-Path $EngineRoot 'Engine\Build\BatchFiles\Build.bat'
if (-not (Test-Path $buildBat)) { Write-Host "FAIL: Build.bat not found at $buildBat"; exit 1 }

$logDir = Join-Path $projectDir 'Saved\Logs'
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$logPath = Join-Path $logDir ("build-{0:yyyyMMdd-HHmmss}.log" -f (Get-Date))

$sw = [System.Diagnostics.Stopwatch]::StartNew()
& cmd.exe /c "`"$buildBat`" ${name}Editor Win64 $Configuration -Project=`"$($uproject.FullName)`" -WaitMutex > `"$logPath`" 2>&1"
$exit = $LASTEXITCODE
$sw.Stop()

$lines = Get-Content $logPath
$errors = @($lines | Where-Object { $_ -match '\berror\b' -and $_ -notmatch '^\s*(Total|Result)' })
$allWarnings = @($lines | Where-Object { $_ -match '\bwarning\b' } | Sort-Object -Unique)
# Ours = reported against a file in this project (Source/, Plugins/). Engine headers and toolchain notices
# are listed but don't fail the build (e.g. 5.8's own Character.h raises C4996 for every ACharacter subclass).
$projRe = [regex]::Escape($projectDir)
$ours = @($allWarnings | Where-Object { $_ -match "^\s*$projRe" -or $_ -match '\b(UHT|LogCompile)\b.*\bwarning\b' })
$other = @($allWarnings | Where-Object { $ours -notcontains $_ })
$elapsed = $sw.Elapsed.ToString('mm\:ss')
$ok = ($exit -eq 0) -and ($AllowWarnings -or $ours.Count -eq 0)

Write-Host ''
if ($ok) {
    Write-Host "PASS  ${name}Editor $Configuration built in $elapsed (0 errors, $($ours.Count) warnings in our code)"
} else {
    Write-Host "FAIL  ${name}Editor $Configuration (exit $exit) after ${elapsed}: $($errors.Count) error lines, $($ours.Count) warnings in our code"
}
$errors | Select-Object -First 25 | ForEach-Object { Write-Host "  E $($_.Trim())" }
$ours | Select-Object -First 25 | ForEach-Object { Write-Host "  W $($_.Trim())" }
if ($other.Count) {
    Write-Host "  Engine/toolchain warnings (not ours, not counted): $($other.Count)"
    $other | Select-Object -First 5 | ForEach-Object { Write-Host "    - $(($_.Trim() -replace '^.*?(warning)', '$1').Substring(0, [Math]::Min(140, ($_.Trim() -replace '^.*?(warning)', '$1').Length)))" }
}
Write-Host "  Log: $logPath"
exit $(if ($ok) { 0 } else { 1 })
