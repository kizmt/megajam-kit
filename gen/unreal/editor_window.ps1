#Requires -Version 5.1
<#
.SYNOPSIS
  Reports whether the Unreal Editor's window is minimised and, with -Restore, shows it again without giving it focus:
  EDITOR_WINDOW_JSON={"found":true,"minimised":true,"restored":true,"title":"MyGame - Unreal Editor"}
.DESCRIPTION
  A minimised editor does not draw its viewports and barely ticks. MCP still answers, so nothing looks wrong, but a
  viewport screenshot is never written and Kimodo never starts generating (rehearsal 2026-11-11: a 300 s wait, then
  generation began within a second of restoring the window). The tools that need a drawing editor call this first.
  -Name: the project's name; the editor whose window title starts with it is checked (any editor when none matches).
  Restoring uses SW_SHOWNOACTIVATE: the window comes back where it was, the foreground window keeps the keyboard.
#>
param([string]$Name = '', [switch]$Restore)
$ErrorActionPreference = 'Stop'
Add-Type @'
using System;
using System.Runtime.InteropServices;
public static class KitEditorWin {
  [DllImport("user32.dll")] public static extern bool IsIconic(IntPtr h);
  [DllImport("user32.dll")] public static extern bool ShowWindowAsync(IntPtr h, int cmd);
}
'@
$all = @(Get-Process UnrealEditor -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 })
$mine = @($all | Where-Object { $Name -and $_.MainWindowTitle -like "$Name*" })
$p = if ($mine.Count) { $mine[0] } elseif ($all.Count) { $all[0] } else { $null }
if (-not $p) { Write-Output 'EDITOR_WINDOW_JSON={"found":false}'; exit 0 }
$min = [KitEditorWin]::IsIconic($p.MainWindowHandle)
$restored = $false
if ($min -and $Restore) {
    [void][KitEditorWin]::ShowWindowAsync($p.MainWindowHandle, 4)
    Start-Sleep -Milliseconds 800
    $restored = -not [KitEditorWin]::IsIconic($p.MainWindowHandle)
}
Write-Output ('EDITOR_WINDOW_JSON=' + (@{ found = $true; minimised = $min; restored = $restored; title = $p.MainWindowTitle } | ConvertTo-Json -Compress))
