# Shared helpers for gen/test/*.ps1 (dot-source it). Finds the project, the editor exe and the game window.

function Resolve-KitProject([string]$Project) {
    if (-not $Project) { $Project = $env:MEGAJAM_PROJECT }
    if (-not $Project) {
        $envFile = Join-Path (Split-Path (Split-Path $PSScriptRoot)) '.env'
        if (Test-Path $envFile) {
            $line = Select-String -Path $envFile -Pattern '^\s*MEGAJAM_PROJECT\s*=\s*(.+?)\s*$' | Select-Object -First 1
            if ($line) { $Project = ($line.Matches[0].Groups[1].Value -replace '\s+#.*$', '').Trim().Trim('"', "'") }
        }
    }
    if (-not $Project) { throw 'No project: pass -Project C:\dev\<Name> or set MEGAJAM_PROJECT in the kit .env' }
    $up = Get-ChildItem $Project -Filter *.uproject -ErrorAction SilentlyContinue | Select-Object -First 1
    if (-not $up) { throw "No .uproject in $Project" }
    return [pscustomobject]@{ Dir = $Project; UProject = $up.FullName; Name = $up.BaseName }
}

function Find-Ffmpeg {
    $c = Get-Command ffmpeg -ErrorAction SilentlyContinue
    if ($c) { return $c.Source }
    $w = Get-ChildItem "$env:LOCALAPPDATA\Microsoft\WinGet\Packages\Gyan.FFmpeg*\*\bin\ffmpeg.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($w) { return $w.FullName }
    return $null
}

# Starts the editor build in -game on a map with a kit capture script (gen/test/*_capture.py), passing settings in
# KIT_* environment variables (inherited by the game). Returns the process. The script quits the game when done.
function Start-KitGame($proj, [string]$Map, [string]$Script, [hashtable]$Settings, [string]$Log, [int]$ResX = 1920,
        [int]$ResY = 1080, [string]$ExtraArgs = '') {
    foreach ($k in $Settings.Keys) { Set-Item "env:$k" ([string]$Settings[$k]) }
    $py = $Script.Replace('\', '/')
    if ($py -match '\s') { throw "Script path has a space, which -ExecCmds can't pass: $py" }
    if (Test-Path $Log) { Remove-Item $Log }
    $argline = "`"$($proj.UProject)`" $Map -game -windowed -ResX=$ResX -ResY=$ResY -WinX=40 -WinY=40 -abslog=`"$Log`" -ExecCmds=`"py $py`" -NoTitle $ExtraArgs"
    return Start-Process (Get-EditorExe $proj) -ArgumentList $argline -PassThru
}

# The kit capture scripts' result lines (PROOF ...) and real errors, without the toolset plugins' -game noise.
function Show-KitLog([string]$Log, [int]$Max = 40) {
    if (-not (Test-Path $Log)) { Write-Host "no log at $Log"; return }
    Select-String -Path $Log -Pattern 'PROOF|Error:|Fatal' |
        # A -game process tries the MCP port the open editor already holds: two expected error lines per run.
        Where-Object { $_.Line -notmatch 'HttpListener unable to bind|MCP server listener could not start' } |
        Where-Object { $_.Line -notmatch 'LogPython: Error: .*(ToolsetDefinition|toolset|StateTree|init_unreal|AgentSkill|PythonTestRunner|Traceback|\^\^\^|from skills|class .*Skill)' } |
        Select-Object -First $Max | ForEach-Object { $_.Line -replace '^\[[^\]]*\]\[[^\]]*\]', '' }
}

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

# The editor of the engine the project names (5.8 or 5.9 side by side). $proj from Resolve-KitProject.
function Get-EditorExe($proj = $null) {
    if (-not $proj) { $proj = Resolve-KitProject '' }
    $exe = Join-Path (Resolve-KitEngine $proj.UProject) 'Engine\Binaries\Win64\UnrealEditor.exe'
    if (-not (Test-Path $exe)) { throw "Editor not found at $exe" }
    return $exe
}

if (-not ('KitGameWin' -as [type])) {
    Add-Type @"
using System;
using System.Runtime.InteropServices;
public static class KitGameWin {
    [StructLayout(LayoutKind.Sequential)] public struct RECT { public int L, T, R, B; }
    [DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
    [DllImport("user32.dll")] public static extern bool GetClientRect(IntPtr h, out RECT r);
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
    [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
    [DllImport("user32.dll")] public static extern bool BringWindowToTop(IntPtr h);
    [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, IntPtr pid);
    [DllImport("kernel32.dll")] public static extern uint GetCurrentThreadId();
    [DllImport("user32.dll")] public static extern bool AttachThreadInput(uint a, uint b, bool attach);
    [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
    [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, out uint pid);
    public delegate bool EnumProc(IntPtr h, IntPtr p);
    [DllImport("user32.dll")] public static extern bool EnumWindows(EnumProc f, IntPtr p);
    // The process's largest visible top-level window (the viewport, not the -log console).
    public static IntPtr Largest(uint pid) {
        IntPtr best = IntPtr.Zero; long bestArea = 0;
        EnumWindows((h, p) => {
            uint owner; GetWindowThreadProcessId(h, out owner);
            if (owner == pid && IsWindowVisible(h)) {
                RECT r; GetClientRect(h, out r);
                long a = (long)(r.R - r.L) * (r.B - r.T);
                if (a > bestArea) { bestArea = a; best = h; }
            }
            return true;
        }, IntPtr.Zero);
        return best;
    }
}
"@
}
[void][KitGameWin]::SetProcessDPIAware()

# Waits until the process has a window and the log (written after launch) contains the pattern. Returns the game's
# largest window (MainWindowHandle can be the -log console), or IntPtr.Zero on timeout.
function Wait-GameWindow($Process, [string]$Log, [string]$Pattern, [int]$TimeoutSec = 180) {
    $start = Get-Date
    $deadline = $start.AddSeconds($TimeoutSec)
    while ((Get-Date) -lt $deadline) {
        Start-Sleep -Milliseconds 300
        if ($Process.HasExited) { return [IntPtr]::Zero }
        if ((Test-Path $Log) -and (Select-String -Path $Log -Pattern $Pattern -Quiet)) {
            $h = [KitGameWin]::Largest([uint32]$Process.Id)
            if ($h -ne [IntPtr]::Zero) { return $h }
        }
    }
    return [IntPtr]::Zero
}

# Windows refuses SetForegroundWindow from a background process while the user works in another app: join that app's
# input thread for the call. record_window.ps1 still refuses to record if the game didn't come to the front.
function Set-GameForeground([IntPtr]$Hwnd) {
    $front = [KitGameWin]::GetWindowThreadProcessId([KitGameWin]::GetForegroundWindow(), [IntPtr]::Zero)
    $me = [KitGameWin]::GetCurrentThreadId()
    [void][KitGameWin]::AttachThreadInput($me, $front, $true)
    [void][KitGameWin]::BringWindowToTop($Hwnd)
    [void][KitGameWin]::SetForegroundWindow($Hwnd)
    [void][KitGameWin]::AttachThreadInput($me, $front, $false)
    Start-Sleep -Milliseconds 300
}
