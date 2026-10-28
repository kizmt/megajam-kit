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

function Get-EditorExe {
    $exe = 'C:\Program Files\Epic Games\UE_5.8\Engine\Binaries\Win64\UnrealEditor.exe'
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
