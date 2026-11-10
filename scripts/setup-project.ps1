#Requires -Version 5.1
<#
.SYNOPSIS
  Does the file-side steps of SETUP.md for a new project in one go, so the director's part of project setup is a
  short list of editor clicks. Run it from the kit with the editor CLOSED, right after Unreal has created the project:

      C:\dev\megajam-kit\scripts\setup-project.ps1 -Project C:\dev\<ProjectName>

  Run it again any time: every step only adds what is missing (it never overwrites the project's settings file,
  and re-copies CLAUDE.md, the critic, the scripts and the plugin from the kit).
.DESCRIPTION
  What it does (SETUP.md step numbers):
    2    enables the plugins in the .uproject: All Toolsets; on 5.9 also Geometry Toolset (mesh editing tools that
         All Toolsets leaves out), and AnimGenOffline, Kimodo and Sequencer Anim Mixer Toolset (Kimodo's animation
         generation) unless -NoKimodo. -Plugins adds more by name, for a game that needs them, e.g.
         -Plugins PCGPrimitives,ProceduralVegetationEditor (procedural levels; scripted trees)
    3.5  5.9: writes the MCP project Instructions (agents\mcp-instructions.md) into Config\DefaultGame.ini
    5    .claude\settings.local.json (kit read-only, unreal-mcp enabled), CLAUDE.md, the critic subagent
    6    scripts\ and Plugins\MegajamTools
    10b  5.9: Pip Strict Hash Check off in Config\DefaultEngine.ini (without it the editor's pip install of Kimodo's
         packages fails on the Preview), and, once the editor has made its Python environment, the two packages the
         Preview leaves out (antlr4-python3-runtime 4.9.3, omegaconf 2.3.0). Both are the director's calls: running
         this script without -NoKimodo is saying yes to them.
  What it leaves to the director (printed at the end): the editor clicks, and MEGAJAM_PROJECT in the kit's .env.
  It never reads or prints the kit's .env.
#>
param(
    [Parameter(Mandatory)][string]$Project,
    [switch]$NoKimodo,
    [string[]]$Plugins = @()
)
$ErrorActionPreference = 'Stop'
$Kit = Split-Path $PSScriptRoot
$Project = $Project.TrimEnd('\')
$uprojects = @(Get-ChildItem -LiteralPath $Project -Filter *.uproject -ErrorAction SilentlyContinue)
if ($uprojects.Count -ne 1) { Write-Host "FAIL: expected one .uproject in $Project (create the project in Unreal first: SETUP step 1)"; exit 1 }
$uproject = $uprojects[0].FullName
$name = $uprojects[0].BaseName
if (Get-Process UnrealEditor -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -like "$name*" }) {
    Write-Host "FAIL: close the editor for $name first (it rewrites the .uproject and the Config files when it exits)"; exit 1
}
. (Join-Path $Kit 'gen\test\game_common.ps1')
$engine = Resolve-KitEngine $uproject
$bv = Get-Content -Raw (Join-Path $engine 'Engine\Build\Build.version') | ConvertFrom-Json
$is59 = ("$($bv.MajorVersion).$($bv.MinorVersion)" -eq '5.9')
$kimodo = $is59 -and -not $NoKimodo
$utf8 = New-Object System.Text.UTF8Encoding($false)
function Done([string]$m) { Write-Host "  done   $m" }
function Kept([string]$m) { Write-Host "  ok     $m" }

Write-Host "Project $name, engine $($bv.MajorVersion).$($bv.MinorVersion).$($bv.PatchVersion)$(if ($kimodo) { ', with Kimodo' })"

# ---------- plugins in the .uproject
$u = Get-Content -Raw $uproject | ConvertFrom-Json
if (-not ($u.PSObject.Properties.Name -contains 'Plugins')) { $u | Add-Member -NotePropertyName Plugins -NotePropertyValue @() }
$want = @('AllToolsets')
if ($is59) { $want += 'GeometryToolset' }
if ($kimodo) { $want += 'AnimGenOffline', 'Kimodo', 'SequencerAnimMixerToolset' }
$want += @($Plugins | ForEach-Object { $_ -split ',' } | ForEach-Object { $_.Trim() } | Where-Object { $_ })
$added = @()
foreach ($w in $want) {
    $have = @($u.Plugins) | Where-Object { $_.Name -eq $w }
    if ($have) { if (-not $have.Enabled) { $have.Enabled = $true; $added += $w } }
    else { $u.Plugins = @($u.Plugins) + [pscustomobject]@{ Name = $w; Enabled = $true }; $added += $w }
}
if ($added) { [IO.File]::WriteAllText($uproject, ($u | ConvertTo-Json -Depth 10), $utf8); Done "plugins enabled: $($added -join ', ')" }
else { Kept "plugins already enabled: $($want -join ', ')" }

# ---------- ini settings: add "key=value" under [section] unless the key is already there
function Set-IniValue([string]$File, [string]$Section, [string]$Key, [string]$Value, [string]$What) {
    $lines = if (Test-Path $File) { @(Get-Content -LiteralPath $File) } else { @() }
    $start = -1
    for ($i = 0; $i -lt $lines.Count; $i++) { if ($lines[$i].Trim() -eq "[$Section]") { $start = $i; break } }
    if ($start -ge 0) {
        for ($i = $start + 1; $i -lt $lines.Count -and $lines[$i] -notmatch '^\['; $i++) {
            if ($lines[$i] -match "^$([regex]::Escape($Key))=") {
                if ($lines[$i] -eq "$Key=$Value") { Kept $What; return }
                $lines[$i] = "$Key=$Value"; [IO.File]::WriteAllLines($File, $lines, $utf8); Done "$What (updated)"; return
            }
        }
        $lines = @($lines[0..$start]) + "$Key=$Value" + @(if ($start + 1 -lt $lines.Count) { $lines[($start + 1)..($lines.Count - 1)] })
    } else {
        $lines = @($lines) + '' + "[$Section]" + "$Key=$Value"
    }
    [IO.File]::WriteAllLines($File, $lines, $utf8); Done $What
}
$config = Join-Path $Project 'Config'
if ($is59) {
    # The one-line Instructions text is the fenced block in agents\mcp-instructions.md.
    $md = Get-Content -Raw (Join-Path $Kit 'agents\mcp-instructions.md')
    if ($md -match '(?s)```text\r?\n(.+?)\r?\n```') {
        Set-IniValue (Join-Path $config 'DefaultGame.ini') '/Script/ModelContextProtocol.ModelContextProtocolProjectSettings' 'Instructions' $Matches[1].Trim() 'MCP project Instructions (SETUP 3.5)'
    } else { Write-Host '  WARN   no ```text block in agents\mcp-instructions.md: paste the Instructions by hand (SETUP 3.5)' }
}
if ($kimodo) {
    Set-IniValue (Join-Path $config 'DefaultEngine.ini') '/Script/PythonScriptPlugin.PythonScriptPluginSettings' 'bPipStrictHashCheck' 'False' 'Pip Strict Hash Check off (SETUP 10b; Kimodo needs it on the Preview)'
}

# ---------- Claude Code settings, CLAUDE.md, the critic, the scripts, the plugin
$claude = Join-Path $Project '.claude'
New-Item -ItemType Directory -Force (Join-Path $claude 'agents') | Out-Null
$settings = Join-Path $claude 'settings.local.json'
if (Test-Path $settings) { Kept '.claude\settings.local.json (kept as it is)' }
else {
    $kitFwd = '//' + $Kit.Substring(0, 1).ToLower() + ($Kit.Substring(2) -replace '\\', '/')
    $json = @"
{
  "enabledMcpjsonServers": ["unreal-mcp"],
  "allowedMcpServers": [{ "serverUrl": "http://127.0.0.1:8000/mcp" }],
  "disableClaudeAiConnectors": true,
  "autoCompactWindow": 300000,
  "attribution": { "commit": "", "pr": "" },
  "permissions": {
    "additionalDirectories": ["$($Kit -replace '\\', '\\')"],
    "deny": ["Edit($kitFwd/**)"]
  }
}
"@
    [IO.File]::WriteAllText($settings, $json, $utf8); Done '.claude\settings.local.json'
}
function Copy-Kit([string]$From, [string]$To, [string]$File, [string]$What) {
    $a = @($From, $To); if ($File) { $a += $File } else { $a += '/E', '/XD', 'Binaries', 'Intermediate', '__pycache__' }
    & robocopy @a /NJH /NJS /NP /NFL /NDL | Out-Null
    if ($LASTEXITCODE -ge 8) { Write-Host "  FAIL   copying $What (robocopy $LASTEXITCODE)"; exit 1 }
    Done $What
}
Copy-Kit $Kit $Project 'CLAUDE.md' 'CLAUDE.md'
Copy-Kit (Join-Path $Kit 'agents') (Join-Path $claude 'agents') 'critic.md' 'the critic subagent'
Copy-Kit (Join-Path $Kit 'scripts') (Join-Path $Project 'scripts') '' 'scripts\'
Copy-Kit (Join-Path $Kit 'unreal\Plugins\MegajamTools') (Join-Path $Project 'Plugins\MegajamTools') '' 'Plugins\MegajamTools'

# ---------- Kimodo's two missing packages, once the editor has made the project's Python environment
$needEditorStart = $false
if ($kimodo) {
    $py = Join-Path $Project 'Intermediate\PipInstall\Scripts\python.exe'
    if (Test-Path $py) {
        # pip writes notices to stderr; under 'Stop' Windows PowerShell 5.1 turns those into a terminating error.
        $ErrorActionPreference = 'Continue'
        $have = (& $py -m pip list 2>&1 | Out-String)
        if ($have -match '(?im)^omegaconf\s' -and $have -match '(?im)^antlr4-python3-runtime\s') { Kept "Kimodo's two extra Python packages" }
        else {
            $out = (& $py -m pip install --no-deps antlr4-python3-runtime==4.9.3 omegaconf==2.3.0 2>&1 | Out-String)
            $code = $LASTEXITCODE
            $out.Trim().Split("`n") | Select-Object -Last 2 | ForEach-Object { Write-Host "         $($_.Trim())" }
            if ($code -eq 0) { Done "Kimodo's two extra Python packages installed" } else { Write-Host '  FAIL   pip install of antlr4-python3-runtime / omegaconf (SETUP 10b step 3)'; exit 1 }
        }
        $ErrorActionPreference = 'Stop'
    } else { $needEditorStart = $true }
}

# ---------- what is left: only the steps that are not done yet
$todo = @()
$envLine = Select-String -LiteralPath (Join-Path $Kit '.env') -Pattern '^\s*MEGAJAM_PROJECT\s*=' -ErrorAction SilentlyContinue | Select-Object -First 1
$envProj = if ($envLine) { ($envLine.Line -split '=', 2)[1].Trim().Trim('"').TrimEnd('\') } else { '' }
if ($envProj -ine $Project) { $todo += "Kit .env: MEGAJAM_PROJECT=$Project" }
$opened = Test-Path (Join-Path $Project 'Intermediate\PipInstall\Scripts\python.exe')
if ($kimodo -and -not $opened) { $todo += "Open the project and let it finish: the first start with the new plugins installs Kimodo's Python packages (a few GB, several minutes)." }
if (-not (Test-Path (Join-Path $Project 'Content\Characters\Mannequins'))) { $todo += 'Content Drawer > Add > Add Feature or Content Pack > Third Person (SETUP 2.5)' }
$engineIni = Join-Path $config 'DefaultEngine.ini'
$mapsSet = (Test-Path $engineIni) -and ((Get-Content -Raw $engineIni) -match '(?m)^GameDefaultMap=/Game/Maps/Main') -and ((Get-Content -Raw $engineIni) -match '(?m)^EditorStartupMap=/Game/Maps/Main')
if (-not (Test-Path (Join-Path $Project 'Content\Maps\Main.umap')) -or -not $mapsSet) { $todo += 'File > New Level > Basic, save as Content\Maps\Main; Project Settings > Maps & Modes: Editor Startup Map and Game Default Map = Main (SETUP 4)' }
$gameIni = Join-Path $config 'DefaultGame.ini'
if (-not ((Test-Path $gameIni) -and ((Get-Content -Raw $gameIni) -match 'GameFeatureData'))) { $todo += 'Project Settings > Game > Asset Manager > Primary Asset Types to Scan: + GameFeatureData / GameFeatureData / /Game/Unused (SETUP 2.3)' }
if (-not (Test-Path (Join-Path $Project 'Intermediate\PythonStub\unreal.py'))) { $todo += 'Editor Preferences > Plugins > Python > Developer Mode on, then restart the editor (SETUP 2.4)' }
$todo += "Check once: Editor Preferences > Performance > 'Use Less CPU when in Background' is off (SETUP 8.2; preflight reads it)"
if (-not (Test-Path (Join-Path $Project '.mcp.json'))) { $todo += 'Output Log Cmd box: ModelContextProtocol.GenerateClientConfig ClaudeCode   (writes .mcp.json, SETUP 3.3)' }
if ($needEditorStart) { $todo += "After that first start, close the editor and run this script again: it then installs Kimodo's two extra packages." }
if ($kimodo) { $todo += 'Kimodo, once per project: a Level Sequence with the mannequin (SKM_Manny_Simple) added through Sequencer''s AnimGenOffline drop-down > Add Character (SETUP 10b step 4). The script can''t see whether this is done.' }
if (-not (Test-Path (Join-Path $Project '.git'))) { $todo += "$Project\scripts\init-repo.ps1" }
$todo += "With the editor open: C:\dev\megajam-kit\scripts\preflight.ps1 -Project $Project   then: cd $Project; claude"
Write-Host ''
Write-Host 'Left for you (SETUP.md has the detail):'
for ($i = 0; $i -lt $todo.Count; $i++) { Write-Host "  $($i + 1). $($todo[$i])" }
