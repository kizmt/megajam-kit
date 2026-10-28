#Requires -Version 5.1
<#
.SYNOPSIS
  Runs a scripted test in a standalone -game instance of the editor build and prints its result lines. The test is a
  Python file in the project (written during the jam) that drives the pawn from a slate post-tick callback
  (add_movement_input, no OS input, so no key injection), measures, prints lines starting with -Tag, and quits.
.DESCRIPTION
  Why -game and not PIE: with the editor in the background, PIE runs at 3-8 fps and timing or foot-slide measurements
  are meaningless; -game runs at full speed. In -game, EditorAssetLibrary calls crash (use unreal.load_asset), Python
  can't spawn actors (borrow ones placed in the level) and the world is found with
  unreal.ObjectIterator(unreal.PlayerController). Details: docs/ue/debugging.md.
  The game window appears while it runs: tell the director first.
.EXAMPLE
  & C:\dev\megajam-kit\gen\test\game_test.ps1 -Script C:\dev\MyGame\scripts\test_corridor.py -Tag GAMETEST
#>
param([string]$Project = '', [string]$Map = 'Main', [Parameter(Mandatory)][string]$Script, [string]$Tag = 'GAMETEST',
    [string]$GameArgs = '', [int]$TimeoutSec = 600)
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'game_common.ps1')
$proj = Resolve-KitProject $Project
if (-not (Test-Path $Script)) { throw "Test script not found: $Script" }
$log = Join-Path $proj.Dir 'Saved\Logs\gametest.log'
if (Test-Path $log) { Remove-Item $log }
$py = (Resolve-Path $Script).Path.Replace('\', '/')
# -ExecCmds="py <path>" can't carry a quoted path inside its own quotes.
if ($py -match '\s') { throw "The test script path contains a space, which -ExecCmds can't pass: $py (move it to a path without spaces)" }
$argline = "`"$($proj.UProject)`" $Map -game -windowed -ResX=1920 -ResY=1080 -WinX=40 -WinY=40 -log -abslog=`"$log`" -ExecCmds=`"py $py`" $GameArgs"
$p = Start-Process (Get-EditorExe) -ArgumentList $argline -PassThru
if (-not $p.WaitForExit($TimeoutSec * 1000)) { Write-Host 'FAIL: timeout'; Stop-Process -Id $p.Id -Force; exit 1 }
if (-not (Test-Path $log)) { Write-Host "FAIL: the game exited without writing $log"; exit 1 }
$lines = Select-String -Path $log -Pattern $Tag | ForEach-Object { $_.Line -replace '^\[[^\]]*\]\[[^\]]*\]LogPython: ', '' }
if (-not $lines) { Write-Host "FAIL: no '$Tag' lines in $log (check the log for Python errors)"; exit 1 }
$lines
