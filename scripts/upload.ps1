#Requires -Version 5.1
<#
.SYNOPSIS
  Uploads the packaged zip to itch.io with butler. DRY RUN by default: checks the prerequisites and prints the exact
  commands; nothing is uploaded unless -Push is given (ask the director first). Run after scripts\package.ps1.
  Lives in <Project>\scripts\ like package.ps1 and finds the project from its own location.
.EXAMPLE
  .\scripts\upload.ps1 -ZipName MyTeam -Target myname/mygame          # dry run
  .\scripts\upload.ps1 -ZipName MyTeam -Target myname/mygame -Push    # upload
.NOTES
  butler docs: https://itch.io/docs/butler/ (installing, login, pushing). Setup steps: kit SETUP.md section 9.
  - Push the zip, never the build folder: the folder also holds Saved\ (test-run logs with local paths and the Windows
    user name, crash reports, profiling traces), which package.ps1 leaves out of the zip.
  - A channel name containing "windows" tags the upload as a Windows download. Pushes are diffed against the
    channel's last build, so re-uploads only send changes.
  - The credentials file is a secret: never print or commit it; revoke at itch.io/user/settings/api-keys if leaked.
#>
[CmdletBinding()]
param(
    [string]$Target = '',                      # itch "user/game" (lowercase); the page must exist (itch.io/game/new)
    [string]$Channel = 'windows',
    [string]$BuildRoot = 'C:\dev\Builds',
    [string]$ZipName = '',                     # the team name, same as package.ps1 -ZipName
    [switch]$Push                              # really upload (only with the director's go-ahead)
)
$ErrorActionPreference = 'Stop'
if (-not $ZipName) { Write-Host 'FAIL: pass -ZipName <TeamName> (the same as for package.ps1).'; exit 1 }

$projectDir = Split-Path -Parent $PSScriptRoot
$uproject = Get-ChildItem -Path $projectDir -Filter *.uproject -File | Select-Object -First 1
if (-not $uproject) { Write-Host "FAIL: no .uproject found in $projectDir"; exit 1 }
$projectName = $uproject.BaseName
$zip = Join-Path $BuildRoot "${ZipName}_$projectName.zip"
$stampFile = Join-Path $BuildRoot "$projectName\Windows\$projectName\BuildStamp.txt"
$version = if (Test-Path $stampFile) { (Get-Content $stampFile -TotalCount 1).Trim() -replace ' ', '_' } else { '' }

$butler = Get-Command butler -ErrorAction SilentlyContinue
if (-not $butler -and (Test-Path 'C:\butler\butler.exe')) { $butler = Get-Command 'C:\butler\butler.exe' }
$creds = Join-Path $env:USERPROFILE '.config\itch\butler_creds'
$targetShown = if ($Target) { $Target } else { '<itch-user>/<game>' }

Write-Host "itch.io upload for $projectName ($(if ($Push) { 'PUSH' } else { 'dry run: nothing is uploaded' }))"
Write-Host ''
Write-Host 'Checks'
Write-Host "  zip            $(if (Test-Path $zip) { 'OK' } else { 'MISSING: run scripts\package.ps1' })  $zip"
Write-Host "  build stamp    $(if ($version) { $version } else { 'MISSING (BuildStamp.txt): repackage with the current package.ps1' })"
Write-Host "  butler         $(if ($butler) { "OK  $($butler.Source)" } else { 'NOT INSTALLED (SETUP.md section 9)' })"
Write-Host "  logged in      $(if (Test-Path $creds) { 'yes (credentials file present)' } else { 'no: run "butler login" once (opens a browser)' })"
Write-Host "  itch page      $(if ($Target) { "https://$($Target.Split('/')[0]).itch.io/$($Target.Split('/')[1]) (must already exist)" } else { 'not set: pass -Target user/game (create the page at itch.io/game/new first)' })"
$savedInZip = 0
if (Test-Path $zip) {
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $z = [System.IO.Compression.ZipFile]::OpenRead($zip)
    try {
        $savedInZip = @($z.Entries | Where-Object { $_.FullName -match '/Saved/' }).Count
        Write-Host ("  upload size    {0:N0} MB, {1} files; Saved\ entries: {2}" -f ((Get-Item $zip).Length / 1MB), $z.Entries.Count,
            $(if ($savedInZip) { "$savedInZip (REPACKAGE: local test output is in the zip)" } else { 'none (OK)' }))
    } finally { $z.Dispose() }
}
$versionArgs = if ($version) { @('--userversion', $version) } else { @() }   # never pass an empty --userversion
Write-Host ''
Write-Host 'Commands'
Write-Host "  butler push `"$zip`" $targetShown`:$Channel $($versionArgs -join ' ')"
Write-Host "  butler status $targetShown`:$Channel"
Write-Host ''

if (-not (Test-Path $zip)) { Write-Host 'Stopping: no zip.'; exit 1 }
if ($savedInZip) { Write-Host 'Stopping: the zip contains Saved\ files. Repackage with the current package.ps1.'; exit 1 }
$stopCode = if ($Push) { 1 } else { 0 }   # a dry run that can't go further is fine; an upload that didn't happen is a failure
if (-not $butler) { Write-Host 'Stopping: butler is not installed.'; exit $stopCode }
if (-not $Target) { Write-Host 'Stopping: no -Target.'; exit $stopCode }
if ($Push) {
    if (-not $version) { Write-Host 'Stopping: no build stamp, so the upload would have no version. Repackage with the current package.ps1.'; exit 1 }
    & $butler.Source push $zip "${Target}:$Channel" @versionArgs
    if ($LASTEXITCODE -ne 0) { Write-Host "FAIL: butler push exited $LASTEXITCODE"; exit $LASTEXITCODE }
    & $butler.Source status "${Target}:$Channel"
} else {
    & $butler.Source push --dry-run $zip "${Target}:$Channel" @versionArgs   # lists what would go up
}
