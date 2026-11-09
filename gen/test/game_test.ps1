#Requires -Version 5.1
<#
.SYNOPSIS
  Runs a scripted test in a standalone -game instance of the editor build and prints its result lines. The test is a
  Python file in the project (written during the jam) that drives the game from a slate post-tick callback
  (e.g. add_movement_input on a pawn, or the game's test hooks; no OS input, so no key injection), measures, prints
  lines starting with -Tag, and quits.
.DESCRIPTION
  Why -game and not PIE: with the editor in the background, PIE runs at 3-8 fps and timing or foot-slide measurements
  are meaningless; -game runs at full speed. In -game, EditorAssetLibrary calls crash (use unreal.load_asset), Python
  can't spawn actors (borrow ones placed in the level) and the world is found with
  unreal.ObjectIterator(unreal.PlayerController). Python sees only BlueprintVisible properties in -game (an
  EditAnywhere-only UPROPERTY doesn't exist there). Details: docs/ue/debugging.md F.
  The game window appears while it runs: tell the director first. The -game process keeps the packages it loaded open:
  don't save those assets in the editor until it ends. The log is Saved\Logs\gametest_<Tag>.log (one per tag); the
  script refuses to start while another -game instance of the project runs, and stops a run whose log fills with
  Python errors (more than -MaxPyErrors lines after the test's first log line: startup noise from other plugins
  doesn't count) or whose script raises before printing a -Tag line, instead of letting it run to the timeout.
.EXAMPLE
  & C:\dev\megajam-kit\gen\test\game_test.ps1 -Script C:\dev\MyGame\scripts\test_reset.py -Tag GAMETEST
#>
param([string]$Project = '', [string]$Map = 'Main', [Parameter(Mandatory)][string]$Script, [string]$Tag = 'GAMETEST',
    [string]$GameArgs = '', [int]$TimeoutSec = 600, [int]$ResX = 1920, [int]$ResY = 1080, [int]$MaxPyErrors = 50)
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'game_common.ps1')
$proj = Resolve-KitProject $Project
if (-not (Test-Path $Script)) { throw "Test script not found: $Script" }
# Another -game run of this project would share the DLLs and the assets: refuse rather than fight it.
$others = Get-CimInstance Win32_Process -Filter "Name='UnrealEditor.exe'" |
    Where-Object { $_.CommandLine -and $_.CommandLine.IndexOf($proj.UProject, [StringComparison]::OrdinalIgnoreCase) -ge 0 -and $_.CommandLine -match '\s-game(\s|$)' }
if ($others) { throw "Another -game instance of this project is running (PID $(@($others.ProcessId) -join ', ')): wait for it or stop it first" }
$safeTag = $Tag -replace '[^\w-]', '_'
$log = Join-Path $proj.Dir "Saved\Logs\gametest_$safeTag.log"
if (Test-Path $log) { Remove-Item $log }
$py = (Resolve-Path $Script).Path.Replace('\', '/')
# -ExecCmds="py <path>" can't carry a quoted path inside its own quotes.
if ($py -match '\s') { throw "The test script path contains a space, which -ExecCmds can't pass: $py (move it to a path without spaces)" }
$argline = "`"$($proj.UProject)`" $Map -game -windowed -ResX=$ResX -ResY=$ResY -WinX=40 -WinY=40 -log -abslog=`"$log`" -ExecCmds=`"py $py`" $GameArgs"
$p = Start-Process (Get-EditorExe $proj) -ArgumentList $argline -PassThru
# Wait, but stop early if the test throws every tick (a long run otherwise burns its whole timeout).
$deadline = (Get-Date).AddSeconds($TimeoutSec)
while (-not $p.WaitForExit(5000)) {
    if ((Get-Date) -gt $deadline) { Write-Host 'FAIL: timeout'; Stop-Process -Id $p.Id -Force; exit 1 }
    if (Test-Path $log) {
        # Count only errors after the test script started: at startup, experimental toolset plugins log dozens of
        # Python errors in -game (their init_unreal.py needs editor-only classes), which are harmless noise.
        $start = Select-String -Path $log -Pattern "LogPython: .*($([regex]::Escape($py))|$([regex]::Escape($Tag)))" -ErrorAction SilentlyContinue |
            Select-Object -First 1
        $errs = @()
        if ($start -and $start.Line -match 'LogPython: Error') {
            # The script's first line is a traceback (it failed while loading, before printing a -Tag line): it never
            # registered its tick and will never quit, so don't wait for the timeout.
            Write-Host "FAIL: the test script raised before printing a '$Tag' line ($log):"
            Select-String -Path $log -Pattern 'LogPython: Error' | Where-Object { $_.LineNumber -ge $start.LineNumber } |
                Select-Object -First 12 | ForEach-Object { $_.Line }
            Stop-Process -Id $p.Id -Force; exit 1
        }
        if ($start) {
            $errs = @(Select-String -Path $log -Pattern 'LogPython: Error' -ErrorAction SilentlyContinue |
                Where-Object { $_.LineNumber -gt $start.LineNumber })
        }
        if ($errs.Count -gt $MaxPyErrors) {
            Write-Host "FAIL: $($errs.Count) Python error lines in $log; stopping the run. First ones:"
            $errs | Select-Object -First 8 | ForEach-Object { $_.Line }
            Stop-Process -Id $p.Id -Force; exit 1
        }
    }
}
if (-not (Test-Path $log)) { Write-Host "FAIL: the game exited without writing $log"; exit 1 }
$lines = Select-String -Path $log -Pattern $Tag | ForEach-Object { $_.Line -replace '^\[[^\]]*\]\[[^\]]*\]LogPython: ', '' }
if (-not $lines) { Write-Host "FAIL: no '$Tag' lines in $log (check the log for Python errors)"; exit 1 }
$lines
