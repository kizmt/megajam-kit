#Requires -Version 5.1
<#
.SYNOPSIS
  Records a game window's client area (ffmpeg ddagrab), and only while the game is alive, has the focus and no other
  window covers it. Called by autoclip.ps1; use it directly for any capture of a game window.
.DESCRIPTION
  Desktop capture records whatever is on screen: a prototype recorder once captured a private chat window, and once
  the desktop after the game had quit. So this script:
  - refuses to start unless the game window is in front and uncovered;
  - checks every 50 ms that the game process is alive, its window has the focus, and no other window covers any of
    25 grid points over the client area;
  - the moment a check fails, stops ffmpeg and cuts the clip back to the last frame that was encoded while the window
    was last seen clear (stream copy, no re-encode).
  Then look at the first and last frame of the clip anyway, and delete any clip that shows anything but the game.
  x264 runs with zerolatency, so "encoded" trails the screen by a frame or two, not a ~2 s look-ahead.
  Video only (no audio track): record the game's audio with the submix recorder and mux it in (cinematics-video.md
  D1). -Fps defaults to 60 (trailer footage).
  Prints 'REC ...' lines on the output stream (Write-Output), so a caller can capture them (2>&1 or a variable).
  'REC start' is the time ffmpeg was launched; 'REC first frame' is when the first frame was captured (about
  0.25-0.35 s later in a rehearsal). Line the video up with logged event times from 'REC first frame'.
  Exit 0 = clip saved, 1 = no clip, 2 = the game had already exited (not a failure at the end of a play session).
.EXAMPLE
  & C:\dev\megajam-kit\gen\test\record_window.ps1 -GamePid $p.Id -Hwnd $h -Out C:\dev\MyGame\Generated\clips\x.mp4 -Seconds 20
#>
param([Parameter(Mandatory)][int]$GamePid, [Parameter(Mandatory)][long]$Hwnd, [Parameter(Mandatory)][string]$Out,
    [int]$Seconds = 20, [ValidateRange(1, 120)][int]$Fps = 60, [switch]$KeepRaw)
$ErrorActionPreference = 'Stop'
# Full path: ffmpeg runs in the process's working directory, which is not PowerShell's current location.
$Out = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($Out)
$win =[IntPtr]::new($Hwnd)  # [long] parameter: powershell -File passes strings, which don't convert to IntPtr
if (-not ('KitRecWin' -as [type])) {
    Add-Type @"
using System;
using System.Runtime.InteropServices;
public static class KitRecWin {
    [StructLayout(LayoutKind.Sequential)] public struct RECT { public int L, T, R, B; }
    [StructLayout(LayoutKind.Sequential)] public struct POINT { public int X, Y; }
    [DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
    [DllImport("user32.dll")] public static extern bool GetClientRect(IntPtr h, out RECT r);
    [DllImport("user32.dll")] public static extern bool ClientToScreen(IntPtr h, ref POINT p);
    [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
    [DllImport("user32.dll")] public static extern IntPtr WindowFromPoint(POINT p);
    [DllImport("user32.dll")] public static extern IntPtr GetAncestor(IntPtr h, uint flags);
    [DllImport("user32.dll")] public static extern bool IsWindow(IntPtr h);
    [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, out uint pid);
}
"@
}
[void][KitRecWin]::SetProcessDPIAware()
$game = Get-Process -Id $GamePid -ErrorAction SilentlyContinue
if (-not $game -or $game.HasExited -or -not [KitRecWin]::IsWindow($win)) {
    Write-Output 'REC GONE: the game has exited; nothing to record'; exit 2
}
$r = New-Object KitRecWin+RECT; [void][KitRecWin]::GetClientRect($win, [ref]$r)
$origin = New-Object KitRecWin+POINT; [void][KitRecWin]::ClientToScreen($win, [ref]$origin)
$w = ($r.R - $r.L) - (($r.R - $r.L) % 2); $h = ($r.B - $r.T) - (($r.B - $r.T) % 2)
if ($w -lt 64 -or $h -lt 64) { Write-Output "REC FAIL: window client area is ${w}x${h}"; exit 1 }
# ddagrab output_idx=0 captures the primary monitor, whose top-left is (0,0): the client area must lie fully on it.
Add-Type -AssemblyName System.Windows.Forms
$prim = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
if ($origin.X -lt 0 -or $origin.Y -lt 0 -or ($origin.X + $w) -gt $prim.Width -or ($origin.Y + $h) -gt $prim.Height) {
    Write-Output "REC FAIL: the game window ($($origin.X),$($origin.Y) ${w}x${h}) is not fully on the primary monitor ($($prim.Width)x$($prim.Height))"; exit 1
}
# A 5x5 grid over the client area, inset 2 px: any other top-level window over one of these points stops the recording.
$points = foreach ($fy in 0, 0.25, 0.5, 0.75, 1) { foreach ($fx in 0, 0.25, 0.5, 0.75, 1) {
    $pt = New-Object KitRecWin+POINT
    $pt.X = $origin.X + 2 + [int](($w - 5) * $fx); $pt.Y = $origin.Y + 2 + [int](($h - 5) * $fy); $pt } }

function Get-Blocker {
    if ($game.HasExited -or -not [KitRecWin]::IsWindow($win)) { return 'the game exited' }
    if ([KitRecWin]::GetForegroundWindow() -ne $win) { return 'the game lost the focus' }
    foreach ($pt in $points) {
        if ([KitRecWin]::GetAncestor([KitRecWin]::WindowFromPoint($pt), 2) -ne $win) { return "another window covers ($($pt.X), $($pt.Y))" }
    }
    return $null
}

function Get-EncodedSeconds([string]$Path) {
    # The last out_time_us in ffmpeg's -progress file: how much of the clip is already encoded.
    if (-not (Test-Path $Path)) { return 0.0 }
    $fs = [IO.File]::Open($Path, 'Open', 'Read', 'ReadWrite')
    try {
        [void]$fs.Seek([Math]::Max(0, $fs.Length - 2048), 'Begin')
        $text = (New-Object IO.StreamReader($fs)).ReadToEnd()
    } finally { $fs.Dispose() }
    $m = [regex]::Matches($text, 'out_time_us=(\d+)')
    if ($m.Count -eq 0) { return 0.0 }
    return [double]$m[$m.Count - 1].Groups[1].Value / 1e6
}

function Get-FrontName {
    $pid2 = [uint32]0
    [void][KitRecWin]::GetWindowThreadProcessId([KitRecWin]::GetForegroundWindow(), [ref]$pid2)
    $fp = Get-Process -Id $pid2 -ErrorAction SilentlyContinue
    return "$($fp.ProcessName) (pid $pid2)"
}

function Find-Ffmpeg {
    $c = Get-Command ffmpeg -ErrorAction SilentlyContinue
    if ($c) { return $c.Source }
    $w = Get-ChildItem "$env:LOCALAPPDATA\Microsoft\WinGet\Packages\Gyan.FFmpeg*\*\bin\ffmpeg.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($w) { return $w.FullName }
    return $null
}

$why = Get-Blocker
if ($why) { Write-Output "REC FAIL: not recording, $why; in front: $(Get-FrontName)"; exit 1 }
$ff = Find-Ffmpeg
if (-not $ff) { Write-Output 'REC FAIL: ffmpeg not found (PATH or WinGet Gyan.FFmpeg)'; exit 1 }
New-Item -ItemType Directory -Force -Path (Split-Path $Out) | Out-Null
$tmp = [IO.Path]::ChangeExtension($Out, '.rec.mp4')
$progress = [IO.Path]::ChangeExtension($Out, '.progress.txt')
Remove-Item $tmp, $progress -ErrorAction SilentlyContinue
$psi = New-Object Diagnostics.ProcessStartInfo $ff
$psi.Arguments = "-hide_banner -loglevel error -y -progress `"$progress`" -stats_period 0.1 -f lavfi " +
    "-i `"ddagrab=output_idx=0:framerate=${Fps}:offset_x=$($origin.X):offset_y=$($origin.Y):video_size=${w}x${h}`" " +
    "-t $Seconds -vf `"hwdownload,format=bgra`" -c:v libx264 -preset fast -tune zerolatency -crf 18 -pix_fmt yuv420p `"$tmp`""
$psi.UseShellExecute = $false
$psi.RedirectStandardInput = $true  # 'q' on stdin stops ffmpeg cleanly (the mp4 is finalized)
$psi.CreateNoWindow = $true  # a console window would cover the game
$t0 = Get-Date
$ffp = [Diagnostics.Process]::Start($psi)
Write-Output "REC start $($t0.ToString('HH:mm:ss.fff')): ${w}x${h} at $($origin.X),$($origin.Y), up to $Seconds s"
$good = 0.0
$why = $null
$firstLogged = $false
while (-not $ffp.HasExited) {
    # Read first, then check: everything encoded by now was captured before this check found the window clear.
    $encoded = Get-EncodedSeconds $progress
    if (-not $firstLogged -and $encoded -gt 0) {
        # Wall time of the first frame = when ffmpeg wrote this progress block, minus what it had encoded by then
        # (x264 zerolatency trails the screen by a frame or two, so this is good to a few hundredths of a second).
        $firstLogged = $true
        $t1 = (Get-Item $progress).LastWriteTime.AddSeconds(-$encoded)
        Write-Output "REC first frame $($t1.ToString('HH:mm:ss.fff')) ($([Math]::Round(($t1 - $t0).TotalSeconds, 2)) s after start)"
    }
    $why = Get-Blocker
    if ($why) {
        $hit = Get-Date
        try { $ffp.StandardInput.Write('q'); $ffp.StandardInput.Flush() } catch { }  # ffmpeg may have just ended
        break
    }
    $good = $encoded
    Start-Sleep -Milliseconds 50
}
if (-not $ffp.WaitForExit(15000)) { $ffp.Kill() }
if (-not $why) {
    $why = Get-Blocker  # ffmpeg ended at -t: the last 50 ms still have to be clear
    if ($why) { $hit = Get-Date }
}
if ($why) {
    Write-Output "REC stop $($hit.ToString('HH:mm:ss.fff')) ($([Math]::Round(($hit - $t0).TotalSeconds, 2)) s after start): $why"
    if ($good -lt 0.5 -or -not (Test-Path $tmp)) {
        Remove-Item $tmp, $progress -ErrorAction SilentlyContinue
        Write-Output 'REC FAIL: stopped before any usable footage; no clip'
        exit 1
    }
    & $ff -hide_banner -loglevel error -y -i $tmp -t $good -c copy $Out
    if ($LASTEXITCODE -ne 0 -or -not (Test-Path $Out)) {
        Remove-Item $tmp, $progress, $Out -ErrorAction SilentlyContinue
        Write-Output "REC FAIL: cutting the clip failed (ffmpeg exit $LASTEXITCODE); no clip"
        exit 1
    }
    if ($KeepRaw) { Copy-Item $tmp ([IO.Path]::ChangeExtension($Out, '.raw.mp4')) -Force }  # for testing this script only
    Write-Output "REC clip cut to $([Math]::Round($good, 2)) s (the last footage encoded while the game was clear)"
} else {
    if ($ffp.ExitCode -ne 0 -or -not (Test-Path $tmp) -or $good -lt 0.5) {
        Remove-Item $tmp, $progress -ErrorAction SilentlyContinue
        Write-Output "REC FAIL: ffmpeg exited $($ffp.ExitCode) after $([Math]::Round($good, 2)) s encoded; no clip (run its command by hand to see the error)"
        exit 1
    }
    Move-Item -Force $tmp $Out
    Write-Output "REC done: the full $Seconds s"
}
Remove-Item $tmp, $progress -ErrorAction SilentlyContinue
Write-Output "REC saved $Out (check its first and last frame before using it)"
exit 0
