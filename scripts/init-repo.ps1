#Requires -Version 5.1
<#
.SYNOPSIS
  Sets up Git + Git LFS for the Unreal project in the parent folder of this script.
  Writes .gitignore and .gitattributes (if missing), runs git init, enables LFS, makes the first commit.
.EXAMPLE
  .\scripts\init-repo.ps1
#>
[CmdletBinding()]
param(
    [string]$Message = 'Initial project setup',
    [string[]]$Trailer = @()
)

$ErrorActionPreference = 'Stop'

$projectDir = Split-Path -Parent $PSScriptRoot
$uproject = Get-ChildItem -Path $projectDir -Filter *.uproject -File | Select-Object -First 1
if (-not $uproject) { Write-Host "FAIL: no .uproject found in $projectDir"; exit 1 }
if (Test-Path (Join-Path $projectDir '.git')) { Write-Host "FAIL: $projectDir is already a git repository."; exit 1 }

foreach ($cmd in @('git', 'git lfs')) {
    $null = & cmd.exe /c "$cmd version" 2>&1
    if ($LASTEXITCODE -ne 0) { Write-Host "FAIL: '$cmd' is not installed or not on PATH."; exit 1 }
}

$gitignore = @'
# --- Unreal generated (rebuilt automatically) ---
Binaries/
DerivedDataCache/
Intermediate/
Saved/
Plugins/*/Binaries/
Plugins/*/Intermediate/

# Build folder: ignore output, keep platform config and icons
Build/*
!Build/*/
Build/*/**
!Build/*/PakBlacklist*.txt
!Build/**/*.ico

# --- IDE / generated project files ---
.vs/
.vscode/
.idea/
*.sln
*.slnx
*.suo
*.sdf
*.opensdf
*.VC.db
*.VC.opendb

# --- Machine-local ---
.claude/settings.local.json
*.log
Thumbs.db
desktop.ini
'@

$gitattributes = @'
# Normalise text line endings
* text=auto
*.ps1 text eol=crlf
*.bat text eol=crlf
*.cmd text eol=crlf

# Unreal assets
*.uasset filter=lfs diff=lfs merge=lfs -text
*.umap   filter=lfs diff=lfs merge=lfs -text

# Source art / models
*.fbx  filter=lfs diff=lfs merge=lfs -text
*.obj  filter=lfs diff=lfs merge=lfs -text
*.glb  filter=lfs diff=lfs merge=lfs -text
*.blend filter=lfs diff=lfs merge=lfs -text
*.png  filter=lfs diff=lfs merge=lfs -text
*.jpg  filter=lfs diff=lfs merge=lfs -text
*.jpeg filter=lfs diff=lfs merge=lfs -text
*.tga  filter=lfs diff=lfs merge=lfs -text
*.psd  filter=lfs diff=lfs merge=lfs -text
*.exr  filter=lfs diff=lfs merge=lfs -text
*.hdr  filter=lfs diff=lfs merge=lfs -text

# Audio / video
*.wav filter=lfs diff=lfs merge=lfs -text
*.mp3 filter=lfs diff=lfs merge=lfs -text
*.ogg filter=lfs diff=lfs merge=lfs -text
*.mp4 filter=lfs diff=lfs merge=lfs -text
*.mov filter=lfs diff=lfs merge=lfs -text

# Fonts / archives
*.ttf filter=lfs diff=lfs merge=lfs -text
*.otf filter=lfs diff=lfs merge=lfs -text
*.zip filter=lfs diff=lfs merge=lfs -text
'@

Push-Location $projectDir
try {
    $utf8 = New-Object System.Text.UTF8Encoding($false)
    foreach ($pair in @(@('.gitignore', $gitignore), @('.gitattributes', $gitattributes))) {
        $path = Join-Path $projectDir $pair[0]
        if (Test-Path $path) { Write-Host "Keeping existing $($pair[0])" }
        else { [System.IO.File]::WriteAllText($path, ($pair[1] -replace "`r?`n", "`r`n"), $utf8); Write-Host "Wrote $($pair[0])" }
    }

    git init -b main | Out-Null
    git lfs install --local | Out-Null
    git add -A
    $msgArgs = @('-m', $Message)
    if ($Trailer.Count -gt 0) { $msgArgs += @('-m', ($Trailer -join "`n")) }
    git commit -q @msgArgs
    if ($LASTEXITCODE -ne 0) { Write-Host 'FAIL: git commit failed.'; exit 1 }

    $tracked = (git ls-files | Measure-Object).Count
    $lfs = (git lfs ls-files | Measure-Object).Count
    $sizeMB = [math]::Round(((git ls-files | ForEach-Object { (Get-Item $_ -ErrorAction SilentlyContinue).Length } | Measure-Object -Sum).Sum / 1MB), 2)

    Write-Host ''
    Write-Host "PASS  $($uproject.BaseName) repository created"
    Write-Host "  Commit: $(git log -1 --format='%h %s')"
    Write-Host "  Tracked files: $tracked ($lfs via LFS), $sizeMB MB"
} finally {
    Pop-Location
}
