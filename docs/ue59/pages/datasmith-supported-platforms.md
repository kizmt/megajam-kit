# Datasmith Supported Platforms

https://dev.epicgames.com/documentation/en-us/unreal-engine/datasmith-supported-platforms?application_version=5.9

> Details what Datasmith features work on which different platforms.

[image: Datasmith Supported Platforms]

This page describes which features of Datasmith work on which different platforms when you download Unreal Engine through the Epic Games Launcher, and when you build the engine yourself from its source code distribution.

## Supported File Formats by Platform

Some components used internally by the different Datasmith importers only work on selected Unreal Engine platforms.

| Source format | 64-bit Windows | Mac OS X | Linux |
| --- | --- | --- | --- |
| **.udatasmith files** | [image: Supported] | [image: Supported] | [image: Supported] |
| **CAD file formats** | [image: Supported] | [image: Unsupported] | [image: Supported] |
| **Alias .wire** | [image: Supported] | [image: Unsupported] | [image: Unsupported] |
| **Rhino** | [image: Supported] | [image: Unsupported] | [image: Unsupported] |
| **Cinema 4D** | [image: Supported] | [image: Supported] | [image: Unsupported] |
| **AxF** | [image: Supported] | [image: Unsupported] | [image: Unsupported] |
| **MDL** | [image: Supported] | [image: Supported] | [image: Supported] |
| **Deltagen and VRED** | [image: Supported] | [image: Supported] | [image: Supported] |

## Rebuilding Unreal Engine from Source

Some components used internally by the Datasmith importers are not redistributable as part of the Unreal Engine source code. Therefore, you can't rebuild Unreal Engine yourself with support for the features provided by these components.

When you rebuild Unreal Engine yourself from its source code distribution, the Datasmith import plugins support the following formats:

| Source format | Rebuildable? |
| --- | --- |
| **.udatasmith files** | [image: Supported] |
| **CAD file formats** | [image: Unsupported] |
| **Alias .wire** | [image: Unsupported] |
| **Rhino** | [image: Unsupported] |
| **Cinema 4D** | [image: Unsupported] |
| **AxF** | [image: Unsupported] |
| **MDL** | [image: Unsupported] |
| **Deltagen and VRED** | [image: Supported] |

You may be able to compile Unreal Engine with some of the unsupported features listed above if you download and install the required software development kits from third parties.

Support for gITF is now native to UE.

## Datasmith Export Plugins

The pre-built versions of the Datasmith Exporter Plugins on the Datasmith export plugins download page support the following platforms:

| Source application | 64-bit Windows | Mac OS X |
| --- | --- | --- |
| **SketchUp Pro** | [image: Supported] | [image: Supported] |
| **3ds Max** | [image: Supported] | n/a * |
| **Revit** | [image: Supported] | n/a * |
| **Navisworks** | [image: Supported] | n/a * |
| **Rhino** | [image: Supported] | [image: Supported] |
| **Archicad** | [image: Supported] | [image: Supported] |
| **Solidworks** | [image: Supported] | n/a * |

* Not available on macOS.

** As of Unreal Engine 5.3, Autodesk now manages newer versions of the Revit exporter plugin and is shipped directly in Revit 2024+. UE still supports this plugin and you can get older versions of the plugin from the download page.

When you rebuild Unreal Engine yourself from its source code distribution, you can rebuild the Datasmith Exporter Plugins for Windows. However, you need to download and install the SDK for your source application from Trimble or Autodesk.

- reference
- datasmith
- enterprise
- manufacturing
- simulation
- architecture

On this page

- Supported File Formats by Platform (-> datasmith-supported-platforms)
- Rebuilding Unreal Engine from Source (-> datasmith-supported-platforms)
- Datasmith Export Plugins (-> datasmith-supported-platforms)
