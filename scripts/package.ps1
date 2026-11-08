#Requires -Version 5.1
<#
.SYNOPSIS
  Packages the Unreal project in the parent folder for Win64 (Development by default) and zips it for the jam submission.
.DESCRIPTION
  BuildCookRun -archive copies the staged build over the archive folder and never deletes, so a file from an older
  package (a DLL of a plugin since turned off) would ship again. The script first deletes every file in the archive
  folder except those under a Saved\ folder (bench CSVs, logs: they are never zipped anyway). It refuses when the
  archive folder (<BuildRoot>\<Project>) is or contains the project, holds a .uproject or .git, or contains a junction
  or symbolic link, so the delete stays inside a build folder. It prints the ten
  largest zip entries, so a stale or oversized file shows up.
.EXAMPLE
  .\scripts\package.ps1 -ZipName MyTeam
  .\scripts\package.ps1 -ZipName MyTeam -Config Shipping     # experiments only: the jam rules require Development
#>
[CmdletBinding()]
param(
    [string]$EngineRoot = 'C:\Program Files\Epic Games\UE_5.8',
    [string]$BuildRoot  = 'C:\dev\Builds',
    [string]$ZipName    = '',           # the team name: the jam wants <TeamName>_<GameName>.zip
    [ValidateSet('Development', 'Shipping')][string]$Config = 'Development'
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
# Full paths (a relative -BuildRoot would break the relative-path cuts below) without a trailing backslash.
$archiveDir = (Resolve-Path -LiteralPath $archiveDir).ProviderPath.TrimEnd('\')
$projFull   = (Resolve-Path -LiteralPath $projectDir).ProviderPath.TrimEnd('\')

# Guard the delete below: the archive folder must be a build folder of its own. -BuildRoot C:\dev would make it the
# project folder itself; a junction inside it would lead the recursive listing (and the delete) outside it.
if ($archiveDir -ieq $projFull -or $projFull.StartsWith($archiveDir + '\', [StringComparison]::OrdinalIgnoreCase)) {
    Write-Host "FAIL: the archive folder $archiveDir is the project folder or contains it; pass another -BuildRoot."; exit 1
}
if ((Get-ChildItem -LiteralPath $archiveDir -Force -Filter *.uproject -File) -or
    (Test-Path -LiteralPath (Join-Path $archiveDir '.git'))) {
    Write-Host "FAIL: $archiveDir holds a .uproject or .git, so it is not a build folder; pass another -BuildRoot."; exit 1
}
$links = @(Get-ChildItem -LiteralPath $archiveDir -Recurse -Force -Directory -ErrorAction SilentlyContinue |
    Where-Object { $_.Attributes -band [IO.FileAttributes]::ReparsePoint })
if ($links.Count -gt 0) {
    Write-Host "FAIL: $archiveDir contains a junction or symbolic link ($($links[0].FullName)); remove it first."; exit 1
}

# Clear the last build out of the archive folder (BuildCookRun only adds and overwrites). Saved\ stays.
$stale = @(Get-ChildItem -Path $archiveDir -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { ('\' + $_.FullName.Substring($archiveDir.Length).TrimStart('\')) -notmatch '\\Saved\\' })
if ($stale.Count -gt 0) {
    $stale | Remove-Item -Force
    Write-Host "Removed $($stale.Count) file(s) of the previous build from $archiveDir (Saved\ folders kept)"
}
$logPath = Join-Path $logDir ("package-{0:yyyyMMdd-HHmmss}.log" -f (Get-Date))

$uatArgs = @(
    'BuildCookRun',
    "-project=`"$($uproject.FullName)`"",
    '-platform=Win64',
    "-clientconfig=$Config",
    '-build', '-cook', '-stage', '-pak', '-archive',
    "-archivedirectory=`"$archiveDir`"",
    '-utf8output',
    '-unattended',
    '-nop4',
    '-NoCodeSign'
)

Write-Host "Packaging $projectName ($Config) -> $archiveDir"
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
        # The ten largest entries (stored size): a stale DLL or an unexpected big file shows up here.
        $zr = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
        try {
            Write-Host 'Largest zip entries (MB stored / MB raw):'
            $zr.Entries | Sort-Object CompressedLength -Descending | Select-Object -First 10 | ForEach-Object {
                Write-Host ("  {0,8:N1} {1,8:N1}  {2}" -f ($_.CompressedLength / 1MB), ($_.Length / 1MB), $_.FullName)
            }
        } finally { $zr.Dispose() }
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
    # The jam's "1 GB" is read as 1,000,000,000 bytes (PowerShell's 1GB is 1,073,741,824: a 1,050 MB zip passed that).
    $limit = 1000000000
    if ($zipSize -ge $limit) { Write-Host ("  WARNING: zip is {0:N0} bytes; the jam requires under 1 GB (1,000,000,000 bytes)." -f $zipSize) }
    else { Write-Host ("  Under the jam 1 GB limit (1,000,000,000 bytes): OK, {0:N0} bytes" -f $zipSize) }
} else {
    Write-Host "FAIL  $projectName (UAT exit code $exit) after $elapsed"
    Write-Host '  Last errors from log:'
    Select-String -Path $logPath -Pattern 'error' -SimpleMatch -ErrorAction SilentlyContinue |
        Select-Object -Last 10 | ForEach-Object { Write-Host "    $($_.Line.Trim())" }
    $rules = Select-String -Path $logPath -Pattern 'RulesError|module rules named' -ErrorAction SilentlyContinue |
        Select-Object -First 1
    if ($rules) {
        Write-Host "  RulesError: $($rules.Line.Trim())"
        if ($rules.Line -match 'FabToolset') {
            Write-Host '  Likely a launcher update of the Fab plugin. Set {"Name": "Fab", "Enabled": false} in the'
            Write-Host '  .uproject plugins list and package again (SETUP.md step 2).'
        }
    }
}
Write-Host "  Log: $logPath"

exit $(if ($ok) { 0 } else { 1 })
