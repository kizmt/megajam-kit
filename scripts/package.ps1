#Requires -Version 5.1
<#
.SYNOPSIS
  Packages the Unreal project in the parent folder for Win64 (Development) and zips it for the jam submission.
.EXAMPLE
  .\scripts\package.ps1 -ZipName MyTeam
#>
[CmdletBinding()]
param(
    [string]$EngineRoot = 'C:\Program Files\Epic Games\UE_5.8',
    [string]$BuildRoot  = 'C:\dev\Builds',
    [string]$ZipName    = ''            # the team name: the jam wants <TeamName>_<GameName>.zip
)

$ErrorActionPreference = 'Stop'
if (-not $ZipName) { Write-Host 'FAIL: pass -ZipName <TeamName> (the zip is named <TeamName>_<ProjectName>.zip).'; exit 1 }

if (Get-Process -Name UnrealEditor -ErrorAction SilentlyContinue) {
    Write-Host 'FAIL: UnrealEditor.exe is running. Save your work and close the editor, then run this script again.'
    Write-Host '      (An open editor with Live Coding active makes UnrealBuildTool refuse to build.)'
    exit 1
}

$sw = [System.Diagnostics.Stopwatch]::StartNew()

$projectDir = Split-Path -Parent $PSScriptRoot
$uproject = Get-ChildItem -Path $projectDir -Filter *.uproject -File | Select-Object -First 1
if (-not $uproject) { Write-Host "FAIL: no .uproject found in $projectDir"; exit 1 }
$projectName = $uproject.BaseName

$runUat = Join-Path $EngineRoot 'Engine\Build\BatchFiles\RunUAT.bat'
if (-not (Test-Path $runUat)) { Write-Host "FAIL: RunUAT.bat not found at $runUat"; exit 1 }

$archiveDir = Join-Path $BuildRoot $projectName
$zipPath    = Join-Path $BuildRoot "${ZipName}_$projectName.zip"
$logDir     = Join-Path $projectDir 'Saved\Logs'
New-Item -ItemType Directory -Force -Path $logDir, $archiveDir | Out-Null
$logPath = Join-Path $logDir ("package-{0:yyyyMMdd-HHmmss}.log" -f (Get-Date))

$uatArgs = @(
    'BuildCookRun',
    "-project=`"$($uproject.FullName)`"",
    '-platform=Win64',
    '-clientconfig=Development',
    '-build', '-cook', '-stage', '-pak', '-archive',
    "-archivedirectory=`"$BuildRoot\$projectName`"",
    '-utf8output',
    '-unattended',
    '-nop4',
    '-NoCodeSign'
)

Write-Host "Packaging $projectName -> $archiveDir"
Write-Host "Log: $logPath"

# Run UAT with all output going to the log file only.
& cmd.exe /c "`"$runUat`" $($uatArgs -join ' ') > `"$logPath`" 2>&1"
$exit = $LASTEXITCODE

$ok = ($exit -eq 0)
$zipSize = $null
$exePath = $null

if ($ok) {
    # BuildCookRun archives into <archive>\Windows (or WindowsClient/WindowsNoEditor on older layouts)
    $exe = Get-ChildItem -Path $archiveDir -Filter "$projectName.exe" -Recurse -File -ErrorAction SilentlyContinue |
        Where-Object { $_.FullName -notmatch '\\Binaries\\Win64\\' } | Select-Object -First 1
    if (-not $exe) { $exe = Get-ChildItem -Path $archiveDir -Filter '*.exe' -File -Recurse | Select-Object -First 1 }
    $exePath = if ($exe) { $exe.FullName } else { $null }

    # Build stamp: <archive>\<Platform>\<Project>\BuildStamp.txt (the packaged game's project dir), one line:
    # "<short commit>[+dirty] <package time>". The game logs it at startup and shows it in a corner.
    if ($exe) {
        # git's stderr under $ErrorActionPreference='Stop' would throw in PS 5.1 (no repo, no commits, no git), after the
        # build already succeeded: run it with Continue and treat any failure as 'nogit'.
        $gitOut = {
            param([string[]]$GitArgs)
            if (-not (Get-Command git -ErrorAction SilentlyContinue)) { return $null }
            $ErrorActionPreference = 'Continue'
            $o = & git -C $projectDir @GitArgs 2>$null
            if ($LASTEXITCODE -ne 0) { return $null }
            return $o
        }
        $commit = & $gitOut @('rev-parse', '--short', 'HEAD')
        if (-not $commit) { $commit = 'nogit' }
        elseif (& $gitOut @('status', '--porcelain', '--untracked-files=no')) { $commit += '+dirty' }
        $stamp = "$commit {0:yyyy-MM-dd HH:mm}" -f (Get-Date)
        $stampPath = Join-Path (Join-Path $exe.DirectoryName $projectName) 'BuildStamp.txt'
        Set-Content -Path $stampPath -Value $stamp -Encoding ASCII
        Write-Host "Build stamp: $stamp"
    }

    try {
        if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
        Add-Type -AssemblyName System.IO.Compression
        Add-Type -AssemblyName System.IO.Compression.FileSystem
        # Zip everything except debug symbols (*.pdb, ~350 MB); they stay in the build folder
        # for crash debugging. Entries keep the top-level folder so the zip extracts into one directory.
        # Also leave out every Saved\ folder: test runs of the packaged game write logs (local paths, user name),
        # crash reports, profiling traces and recordings there (a prototype test found ~250 MB of it in the zip).
        # Upload the zip, never the build folder: the folder still contains Saved\.
        $rootName = Split-Path -Leaf $archiveDir
        $zip = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)
        $skipped = 0
        $skippedSaved = 0
        try {
            Get-ChildItem -Path $archiveDir -Recurse -File | ForEach-Object {
                if ($_.Extension -ieq '.pdb') { $skipped++; return }
                $rel = $_.FullName.Substring($archiveDir.Length).TrimStart('\') -replace '\\', '/'
                if ("/$rel" -match '/Saved/') { $skippedSaved++; return }
                [void][System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName,
                    "$rootName/$rel", [System.IO.Compression.CompressionLevel]::Optimal)
            }
        } finally { $zip.Dispose() }
        if ($skipped -gt 0) { Write-Host "Left $skipped .pdb file(s) out of the zip (kept in $archiveDir)" }
        if ($skippedSaved -gt 0) { Write-Host "Left $skippedSaved file(s) from Saved\ folders out of the zip (local test-run output)" }
        $zipSize = (Get-Item $zipPath).Length
    } catch {
        Write-Host "Zip failed: $_"
        $ok = $false
    }
}

$sw.Stop()
$elapsed = $sw.Elapsed.ToString('hh\:mm\:ss')

Write-Host ''
if ($ok) {
    $mb = [math]::Round($zipSize / 1MB, 1)
    Write-Host "PASS  $projectName packaged in $elapsed"
    if ($exePath) { Write-Host "  Exe: $exePath" }
    Write-Host "  Zip: $zipPath ($mb MB)"
    if ($zipSize -ge 1GB) { Write-Host '  WARNING: zip is 1 GB or larger; the jam requires under 1 GB.' }
    else { Write-Host '  Under the jam 1 GB limit: OK' }
} else {
    Write-Host "FAIL  $projectName (UAT exit code $exit) after $elapsed"
    Write-Host '  Last errors from log:'
    Select-String -Path $logPath -Pattern 'error' -SimpleMatch -ErrorAction SilentlyContinue |
        Select-Object -Last 10 | ForEach-Object { Write-Host "    $($_.Line.Trim())" }
}
Write-Host "  Log: $logPath"

exit $(if ($ok) { 0 } else { 1 })
