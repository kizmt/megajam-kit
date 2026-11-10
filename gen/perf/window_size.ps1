#Requires -Version 5.1
<#
.SYNOPSIS
  Prints the real size of a running game's window and of the display, in physical pixels:
  WINDOW_JSON={"client":[w,h],"display":[w,h],"borderless":true,"pid":123}
.DESCRIPTION
  A game's log and its CSV metadata give the size that was asked for, not the size the window has: -ResX/-ResY
  without a window mode are ignored by a borderless game, and with display scaling a build that is not DPI-aware
  renders a smaller back buffer that Windows stretches (SETUP 7b bAllowHighDPIInGameMode). The window's client
  rectangle is the evidence. This process is made DPI-aware first, or Windows would report scaled sizes to it too.
  -Dir: the packaged build's folder; the window is the one owned by a process whose exe is under it.
#>
param([Parameter(Mandatory)][string]$Dir)
$ErrorActionPreference = 'Stop'
Add-Type @'
using System;
using System.Runtime.InteropServices;
public static class KitWin {
  [StructLayout(LayoutKind.Sequential)] public struct RECT { public int L, T, R, B; }
  [DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
  [DllImport("user32.dll")] public static extern bool GetClientRect(IntPtr h, out RECT r);
  [DllImport("user32.dll")] public static extern int GetSystemMetrics(int i);
  [DllImport("user32.dll", EntryPoint = "GetWindowLongPtrW")] public static extern IntPtr GetWindowLongPtr(IntPtr h, int i);
}
'@
[void][KitWin]::SetProcessDPIAware()
$root = (Resolve-Path -LiteralPath $Dir).Path.TrimEnd('\') + '\'
$p = Get-Process | Where-Object { $_.MainWindowHandle -ne 0 -and $_.Path -and $_.Path.StartsWith($root, [StringComparison]::OrdinalIgnoreCase) } | Select-Object -First 1
if (-not $p) { Write-Output 'WINDOW_JSON=null'; exit 0 }
$r = New-Object KitWin+RECT
[void][KitWin]::GetClientRect($p.MainWindowHandle, [ref]$r)
$style = [KitWin]::GetWindowLongPtr($p.MainWindowHandle, -16).ToInt64()
$caption = ($style -band 0x00C00000) -eq 0x00C00000
Write-Output ('WINDOW_JSON={{"client":[{0},{1}],"display":[{2},{3}],"borderless":{4},"pid":{5}}}' -f
  ($r.R - $r.L), ($r.B - $r.T), [KitWin]::GetSystemMetrics(0), [KitWin]::GetSystemMetrics(1), ($(if ($caption) { 'false' } else { 'true' })), $p.Id)
