#Requires -Version 5.1
<#
.SYNOPSIS
  Checks that a project is ready for a session to start: the engine, the kit files copied in, Claude Code's settings,
  the MCP server and the kit's plugin, and for a practice run the run card. Prints PASS / WARN / FAIL per check and
  exits 1 if anything FAILs.
.DESCRIPTION
  Run it before starting Claude Code in the project (jam day, SETUP step 6; practice runs, SETUP step 11), with the
  editor open on the project. FAIL means the session must not start yet: some things (CLAUDE.md, the critic) only load
  when Claude Code starts, so a session can't repair them mid-run. WARN means it will start but something is off.
  Read-only: it changes nothing, and it never prints the kit's .env (it reads only the MEGAJAM_PROJECT line).
.EXAMPLE
  C:\dev\megajam-kit\scripts\preflight.ps1 -Project C:\dev\MJT59 -Autonomous
  .\scripts\preflight.ps1                     # from the project's copy: checks the project it sits in
#>
[CmdletBinding()]
param(
    [string]$Project = '',                     # default: the project this script sits in (its scripts\ copy)
    [string]$Kit = '',                         # default: the kit this script sits in, else C:\dev\megajam-kit
    [switch]$Autonomous,                       # also check the practice run's AUTONOMOUS.md run card
    [string]$McpUrl = 'http://127.0.0.1:8000/mcp'
)

$ErrorActionPreference = 'Stop'
$script:fails = 0; $script:warns = 0
function Pass([string]$m) { Write-Host "PASS  $m" -ForegroundColor Green }
function Warn([string]$m) { Write-Host "WARN  $m" -ForegroundColor Yellow; $script:warns++ }
function Fail([string]$m) { Write-Host "FAIL  $m" -ForegroundColor Red; $script:fails++ }
function SameFile([string]$a, [string]$b) {
    (Test-Path -LiteralPath $a) -and (Test-Path -LiteralPath $b) -and
        ((Get-FileHash -LiteralPath $a).Hash -eq (Get-FileHash -LiteralPath $b).Hash)
}

# ---------- where things are ----------
$here = Split-Path -Parent $PSScriptRoot
if (-not $Kit) {
    $Kit = if ((Test-Path "$here\CLAUDE.md") -and (Test-Path "$here\gen\paths.ts")) { $here } else { 'C:\dev\megajam-kit' }
}
if (-not $Project) {
    if (Get-ChildItem -LiteralPath $here -Filter *.uproject -ErrorAction SilentlyContinue) { $Project = $here }
    else { throw 'Pass -Project C:\dev\<ProjectName> (this copy of the script is not inside a project)' }
}
$Project = (Resolve-Path -LiteralPath $Project).Path.TrimEnd('\')
$uprojects = @(Get-ChildItem -LiteralPath $Project -Filter *.uproject)
Write-Host "project: $Project"
Write-Host "kit:     $Kit"
if ($uprojects.Count -ne 1) { Fail "expected one .uproject in $Project, found $($uprojects.Count)"; exit 1 }
$uproject = $uprojects[0].FullName
$projName = $uprojects[0].BaseName

# ---------- engine ----------
. (Join-Path $Kit 'gen\test\game_common.ps1')
$engine = $null; $minor = $null
try {
    $engine = Resolve-KitEngine $uproject
    $bv = Get-Content -Raw (Join-Path $engine 'Engine\Build\Build.version') | ConvertFrom-Json
    $minor = "$($bv.MajorVersion).$($bv.MinorVersion)"
    Pass "engine $minor.$($bv.PatchVersion) at $engine (EngineAssociation $((Get-Content -Raw $uproject | ConvertFrom-Json).EngineAssociation))"
} catch { Fail "engine: $($_.Exception.Message)" }
$is59 = $minor -eq '5.9'

$running = @(Get-Process UnrealEditor -ErrorAction SilentlyContinue | Where-Object { $_.Path })
if (-not $running) { Fail 'no editor running: open the project in the editor first (SETUP step 1)' }
elseif ($engine -and -not ($running | Where-Object { $_.Path -like "$($engine.Replace('/', '\'))*" })) {
    Fail "the running editor isn't this project's engine: $($running[0].Path)"
} else { Pass "editor running from the project's engine" }

# ---------- kit ----------
$branch = (& git -C $Kit branch --show-current 2>$null)
$dirty = @(& git -C $Kit status --short 2>$null).Count
if ($is59 -and -not (Test-Path (Join-Path $Kit 'docs\ue\ue59.md'))) {
    Fail "kit branch '$branch' has no 5.9 support (docs\ue\ue59.md): check out the 5.9 branch in $Kit"
} else { Pass "kit on branch '$branch' @ $((& git -C $Kit log --oneline -1 2>$null))" }
if ($dirty) { Warn "kit has $dirty uncommitted change(s): the session reads them as they are" }

# ---------- kit files copied into the project (they must match the kit's current copy) ----------
$pairs = @(
    @('CLAUDE.md', 'CLAUDE.md', 'loads only when Claude Code starts'),
    @('agents\critic.md', '.claude\agents\critic.md', 'subagents load only if .claude\agents existed at start')
)
foreach ($s in Get-ChildItem -LiteralPath (Join-Path $Kit 'scripts') -Filter *.ps1) {
    $pairs += , @("scripts\$($s.Name)", "scripts\$($s.Name)", 'copy the kit''s scripts folder')
}
foreach ($p in $pairs) {
    $k = Join-Path $Kit $p[0]; $d = Join-Path $Project $p[1]
    if (-not (Test-Path -LiteralPath $d)) { Fail "$($p[1]) missing ($($p[2])): SETUP step 5-6 robocopy" }
    elseif (-not (SameFile $k $d)) { Fail "$($p[1]) differs from the kit's: copy it again (SETUP step 5-6)" }
    else { Pass $p[1] }
}
$kitPlugin = Join-Path $Kit 'unreal\Plugins\MegajamTools'
$projPlugin = Join-Path $Project 'Plugins\MegajamTools'
$skip = '\\(__pycache__|Binaries|Intermediate)\\'
$stale = @(Get-ChildItem -LiteralPath $kitPlugin -Recurse -File | Where-Object { $_.FullName -notmatch $skip } |
    Where-Object { -not (SameFile $_.FullName ($_.FullName.Replace($kitPlugin, $projPlugin))) })
if (-not (Test-Path -LiteralPath $projPlugin)) { Fail 'Plugins\MegajamTools missing: SETUP step 6 robocopy, then restart the editor' }
elseif ($stale) { Fail "Plugins\MegajamTools differs from the kit's ($($stale.Count) file(s), e.g. $($stale[0].Name)): copy it again, restart the editor" }
else { Pass 'Plugins\MegajamTools matches the kit' }

# ---------- Claude Code and MCP config ----------
$settings = Join-Path $Project '.claude\settings.local.json'
if (-not (Test-Path $settings)) { Fail '.claude\settings.local.json missing (SETUP step 5)' }
else {
    try {
        $j = Get-Content -Raw $settings | ConvertFrom-Json
        $dirs = @($j.permissions.additionalDirectories) -join ';'
        $deny = @($j.permissions.deny) -join ';'
        if ($dirs -notmatch 'megajam-kit') { Fail 'settings.local.json: permissions.additionalDirectories lacks the kit' }
        elseif ($deny -notmatch 'megajam-kit') { Fail 'settings.local.json: no deny rule keeping the kit read-only' }
        elseif (@($j.enabledMcpjsonServers) -notcontains 'unreal-mcp') { Fail 'settings.local.json: enabledMcpjsonServers lacks unreal-mcp' }
        else { Pass 'settings.local.json (kit read-only, unreal-mcp enabled)' }
    } catch { Fail "settings.local.json doesn't parse: $($_.Exception.Message)" }
}
$mcpJson = Join-Path $Project '.mcp.json'
if (-not (Test-Path $mcpJson)) { Fail '.mcp.json missing: ModelContextProtocol.GenerateClientConfig ClaudeCode (SETUP step 3)' }
elseif ((Get-Content -Raw $mcpJson) -notmatch [regex]::Escape($McpUrl)) { Warn ".mcp.json doesn't point at $McpUrl" }
else { Pass '.mcp.json' }

# MEGAJAM_PROJECT: read only that line of the kit's .env, never print the file.
$envLine = Select-String -LiteralPath (Join-Path $Kit '.env') -Pattern '^\s*MEGAJAM_PROJECT\s*=' -ErrorAction SilentlyContinue |
    Select-Object -First 1
$envProj = if ($envLine) { ($envLine.Line -split '=', 2)[1].Trim().Trim('"').TrimEnd('\') } else { '' }
if ($envProj -ieq $Project) { Pass "MEGAJAM_PROJECT names this project" }
else { Fail "MEGAJAM_PROJECT in the kit's .env is '$envProj', not $Project (the director sets it, SETUP step 6.4)" }

# ---------- project settings ----------
$plugins = @((Get-Content -Raw $uproject | ConvertFrom-Json).Plugins)
if (-not ($plugins | Where-Object { $_.Name -eq 'AllToolsets' -and $_.Enabled })) { Fail 'All Toolsets not enabled (SETUP step 2.1)' }
else { Pass 'All Toolsets enabled' }
$defEngine = Join-Path $Project 'Config\DefaultEngine.ini'
$ini = if (Test-Path $defEngine) { Get-Content -Raw $defEngine } else { '' }
if ($ini -match '(?m)^GameDefaultMap=/Game/Maps/Main' -and $ini -match '(?m)^EditorStartupMap=/Game/Maps/Main') { Pass 'startup and default map are /Game/Maps/Main' }
else { Warn 'Editor Startup Map / Game Default Map are not /Game/Maps/Main (SETUP step 4)' }
if (Test-Path (Join-Path $Project 'Intermediate\PythonStub\unreal.py')) { Pass 'Python API stub present' }
else { Warn 'no Intermediate\PythonStub\unreal.py: tick Python Developer Mode and restart the editor (SETUP step 2.4)' }
if ($is59) {
    $game = Join-Path $Project 'Config\DefaultGame.ini'
    if ((Test-Path $game) -and (Get-Content -Raw $game) -match 'megajam-kit project: one AI session') { Pass 'MCP project Instructions set (5.9)' }
    else { Warn 'MCP project Instructions not found in DefaultGame.ini (5.9, SETUP step 3.5; the ini key is unconfirmed)' }
}
# "Use Less CPU when in Background": per user and per engine version (5.9 keeps it in %LOCALAPPDATA%\UnrealEngine\5.9\
# ...\EditorSettings.ini); a project file may also carry it. On, a background editor runs at ~3 fps: fatal unattended.
$throttle = @()
foreach ($ini in @((Join-Path $env:LOCALAPPDATA "UnrealEngine\$minor\Saved\Config\WindowsEditor\EditorSettings.ini"),
                   (Join-Path $Project 'Saved\Config\WindowsEditor\EditorPerProjectUserSettings.ini'))) {
    if (Test-Path $ini) { $throttle += @(Select-String -LiteralPath $ini -Pattern '^\s*bThrottleCPUWhenNotForeground=(\w+)' | ForEach-Object { $_.Matches[0].Groups[1].Value }) }
}
if ($throttle -contains 'True') { Fail '"Use Less CPU when in Background" is ON: Editor Preferences > General > Performance, untick it (SETUP step 8.2)' }
elseif ($throttle -contains 'False') { Pass '"Use Less CPU when in Background" is off' }
else { Warn '"Use Less CPU when in Background" not found in the settings files (the default is on): untick it in Editor Preferences (SETUP step 8.2)' }

# ---------- machine ----------
$node = (& node --version 2>$null)
if ($node -match '^v(\d+)' -and [int]$Matches[1] -ge 24) { Pass "node $node" } else { Fail "node 24+ needed, found '$node'" }
if ($is59) {
    $vswhere = Join-Path ${env:ProgramFiles(x86)} 'Microsoft Visual Studio\Installer\vswhere.exe'
    $vs = if (Test-Path $vswhere) { & $vswhere -latest -products * -property installationPath } else { $null }
    $msvc = if ($vs) { @(Get-ChildItem (Join-Path $vs 'VC\Tools\MSVC') -Directory -Filter '14.50.*' -ErrorAction SilentlyContinue) } else { @() }
    if ($msvc) { Pass "MSVC $($msvc[0].Name) (5.9 needs 14.50)" } else { Fail 'MSVC 14.50 not found: 5.9 needs the MSVC Build Tools v14.50 component (SETUP prerequisites)' }
}
$sac = (Get-ItemProperty 'HKLM:\SYSTEM\CurrentControlSet\Control\CI\Policy' -ErrorAction SilentlyContinue).VerifiedAndReputablePolicyState
if ($sac -eq 0 -or $null -eq $sac) { Pass 'Smart App Control off' } else { Fail 'Smart App Control is on: it blocks fresh editor DLLs (SETUP prerequisites)' }

# ---------- MCP server: right editor, kit toolset registered ----------
try {
    $h = @{ 'Content-Type' = 'application/json'; Accept = 'application/json, text/event-stream' }
    $body = '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"megajam-preflight","version":"1"}}}'
    $r = Invoke-WebRequest -Uri $McpUrl -Method Post -Headers $h -Body $body -UseBasicParsing -TimeoutSec 20
    $text = if ($r.Content -is [byte[]]) { [Text.Encoding]::UTF8.GetString($r.Content) } else { [string]$r.Content }
    if ($text -match '(?m)^data:') { $text = ((($text -split "`n") | Where-Object { $_ -like 'data:*' }) | Select-Object -Last 1).Substring(5) }
    $init = $text | ConvertFrom-Json
    $inst = $init.result._meta.'com.epicgames.unrealengine/instance'
    if ($inst) {
        $iproj = [string]$inst.projectName
        if ($iproj -and $iproj -ne $projName) { Fail "MCP on $McpUrl is a different project's editor ($iproj)" }
        else { Pass "MCP answers: $($init.result.serverInfo.name), engine $($inst.engineVersion), project $iproj" }
    } else { Pass "MCP answers: $($init.result.serverInfo.name) (no instance info: 5.8)" }
    Push-Location $Kit
    try { $toolsets = (& node gen\unreal\mcp.ts toolsets 2>&1) -join "`n" } finally { Pop-Location }
    if ($toolsets -match 'megajam_tools') { Pass 'MegajamTools toolset registered on MCP' }
    else { Fail "MegajamTools not in the MCP toolset list: restart the editor after copying the plugin; Output Log should show 'Registering Toolset megajam_tools.toolsets.MegajamTools'" }
} catch {
    Fail "MCP not reachable at ${McpUrl}: $($_.Exception.Message) (SETUP step 3; Auto Start Server or ModelContextProtocol.StartServer)"
}

# ---------- practice run card ----------
if ($Autonomous) {
    $card = Join-Path $Project 'AUTONOMOUS.md'
    if (-not (Test-Path $card)) { Fail 'AUTONOMOUS.md missing: the run card from prompts\autonomous.md, filled in (SETUP step 11.2)' }
    else {
        $c = Get-Content -Raw $card
        $missing = @('Start S', 'Length', 'Theme', 'Team name', 'Tripo', 'Image', 'ElevenLabs') | Where-Object { $c -notmatch "\|\s*$_" }
        $blank = [regex]::Matches($c, '(?m)^\|[^|\n]+\|\s*(<[^>|]*>)?\s*\|\s*$')
        $defaults = [regex]::Matches($c, '(?m)^\|[^|\n]+\|\s*\[[^\]|]*\]\s*\|\s*$')
        if ($missing) { Fail "AUTONOMOUS.md lacks rows: $($missing -join ', ')" }
        elseif ($blank.Count) { Fail "AUTONOMOUS.md has $($blank.Count) row(s) blank or <placeholder>, e.g. $($blank[0].Value.Trim())" }
        else { Pass 'AUTONOMOUS.md run card filled in' }
        if ($defaults.Count) { Warn "AUTONOMOUS.md keeps $($defaults.Count) [bracketed] default(s), e.g. $($defaults[0].Value.Trim()): fine if meant" }
    }
}

Write-Host ''
if ($script:fails) { Write-Host "NOT READY: $($script:fails) FAIL, $($script:warns) WARN. Fix the FAILs before starting Claude Code." -ForegroundColor Red; exit 1 }
Write-Host "READY ($($script:warns) WARN)" -ForegroundColor Green
exit 0
