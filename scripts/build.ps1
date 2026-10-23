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
    [string]$EngineRoot = 'C:\Program Files\Epic Games\UE_5.8',
    [string]$Configuration = 'Development',
    [switch]$AllowWarnings
)

$ErrorActionPreference = 'Stop'

if (Get-Process -Name UnrealEditor -ErrorAction SilentlyContinue) {
    Write-Host 'FAIL: UnrealEditor.exe is running. Save, close the editor, then run this again.'
    Write-Host '      (New reflected types need a full build; Live Coding locks UnrealBuildTool while the editor is open.)'
    exit 1
}

$projectDir = Split-Path -Parent $PSScriptRoot
$uproject = Get-ChildItem -Path $projectDir -Filter *.uproject -File | Select-Object -First 1
if (-not $uproject) { Write-Host "FAIL: no .uproject found in $projectDir"; exit 1 }
$name = $uproject.BaseName
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
