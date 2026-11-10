# Datasmith Supported Software and File Types

https://dev.epicgames.com/documentation/en-us/unreal-engine/datasmith-supported-software-and-file-types?application_version=5.9

> Details all the third-party software applications and data formats that Datasmith works with.

[image: Datasmith Supported Software and File Types]

Datasmith currently works with the software applications and file formats listed in the following table.

For each type of software or file format listed, the **Status** column uses the following icons to indicate the level of readiness you should expect:

| Icon | Meaning |
| --- | --- |
| [image: Production-ready] | Production-ready. |
| [image: Beta or Experimental] | Beta or Experimental feature, shared with customers for testing and feedback. Expect changes, and we may deprecate functionality at our discretion. |

The **Workflow Type** indicates how you package the information from your design application:

- **Direct** means that the Datasmith Importer Plugin in Unreal reads the application's file format directly.
- **Export** means that you need to export the content from your application to a specific file format before Datasmith can import it into Unreal Engine. You export the content using functionality that is already built into your application.
- **Export Plugin** means that you need to install a new plugin into your application in order to export your design data into the format that Datasmith imports into Unreal.

The **Importer Plugin** column below tells you which Datasmith importer plugin you need to enable in your Unreal Engine Project to be able to import files of each type. For more information about this process, see Importing Datasmith Content into Unreal Engine (-> importing-datasmith-content-into-unreal-engine)

You can download all Datasmith exporter plugins from the Datasmith exporter plugins page.

## Supported Applications

| Application | Support Level | Version | Workflow Type | Importer Plugin |
| --- | --- | --- | --- | --- |
| **3D ACIS** | [image: Production-ready] | Up to 2023 | Direct | **CAD** |
| **3DEXCITE DELTAGEN** | [image: Production-ready] | 2017–2024 | Export (FBX only) | **FBX** |
| **ArcGIS CityEngine** | [image: Production-ready] | -- | Export Plugin | **Datasmith** |
| **Autodesk 3ds Max** | [image: Production-ready] | 2016–2026 | Export Plugin | **Datasmith** |
| **Autodesk Alias** | [image: Production-ready] | Up to 2025 | Direct | **CAD** |
| **Autodesk AutoCAD** | [image: Beta or Experimental] | -- | Direct | **CAD** |
| **Autodesk Inventor** | [image: Production-ready] | Up to 2025 | Direct | **CAD** |
| **Autodesk Revit** | [image: Production-ready] | 2016.3–2023* | Export Plugin | **Datasmith** |
| **Autodesk Navisworks** | [image: Production-ready] | 2019–2026 | Export Plugin | **Datasmith** |
| **Autodesk VRED** | [image: Production-ready] | VRED Professional 2018–2026 | Export Plugin | **FBX** |
| **Dassault Systèmes CATIA V5** | [image: Production-ready] | Up to V5_6 R2024 | Direct | **CAD** |
| **Dassault Systèmes SOLIDWORKS** | [image: Production-ready] | Up to 2025 | Export Plugin | **CAD** |
| **Dassault Systèmes SOLIDWORKS** | [image: Beta or Experimental] | 2020–2025 | Direct | **Datasmith** |
| **Graphisoft Archicad** | [image: Beta or Experimental] | 23–28 | Export Plugin | **Datasmith** |
| **Maxon Cinema 4D** | [image: Production-ready] | -- | Direct | **C4D** |
| **McNeel Rhinoceros** | [image: Production-ready] | up to 8 | Export Plugin | **Datasmith** |
| **McNeel Rhinoceros** | [image: Production-ready] | up to 8 | Direct (`.3dm` files) | **Datasmith** |
| **PTC Creo (Pro/ENGINEER)** | [image: Production-ready] | Pro/Engineer 19.0 to Creo 11.0 | Direct | **CAD** |
| **Siemens NX** | [image: Production-ready] | V11–V18, NX–NX12, NX1847–NX2412 | Direct | **CAD** |
| **Trimble SketchUp Pro** | [image: Production-ready] | 2019–2025 | Export Plugin, DirectLink | **Datasmith** |

* As of Unreal Engine 5.3, Autodesk now manages newer versions of the Revit exporter plugin and is shipped directly in Revit 2024+. UE still supports this plugin and you can get older versions of the plugin from the download page.

## Supported File Formats and Standards

| File Format or Standard Name | Support Level | Version | Workflow Type | Importer Plugin |
| --- | --- | --- | --- | --- |
| **3DXML** | [image: Production-ready] | Up to V5-6 R2024 | Direct | **CAD** |
| **Industry Foundation Classes (IFC)** | [image: Production-ready] | IFC2x Editions 2-4, 4x3 (Beta) | Direct | **CAD** |
| **Initial Graphics Exchange Specification (IGES)** | [image: Production-ready] | 5.1, 5.2, 5.3 | Direct | **CAD** |
| **JT Open** | [image: Production-ready] | Up to 10.9 | Direct | **CAD** |
| **Parasolid (x_t)** | [image: Production-ready] | up to 37.1 | Direct | **CAD** |
| **Siemens PLM XML** | [image: Production-ready] | 7.0.3 and later (Compatible with TeamCenter 11 or later) | Direct | **CAD** |
| **STEP** | [image: Production-ready] | AP203, AP214, AP242 Ed2 and Ed3 | Direct | **CAD** |

### Export Plugins for macOS

Most **Export Plugins**, as well as all Datasmith importers in the Unreal Editor, are currently only available for Microsoft Windows platforms. As of Unreal Engine 4.27, we also support exporting from the following applications on macOS:

| Application | Supported Versions |
| --- | --- |
| Trimble SketchUp Pro | 2019–2025 |
| Graphisoft Archicad | 23–28 |
| McNeel Rhinoceros | 6, 7, 8 |

## Formats that Unreal Engine Supports Directly

Unreal Engine offers built-in support for importing and exporting FBX files.

These FBX-based workflows are optimized to support game requirements, which tend to be focused on working with individual objects. Datasmith, by contrast, brings in entire scenes, potentially containing thousands of objects, each with its materials, pivots, scale, hierarchy, and metadata, from a wide range of sources. However, you should feel free to use the FBX import pipeline if it suits your needs. For example, you might use it to import pieces of additional set dressing that you'll use to augment your Datasmith content in your Unreal Level.

For details, you can read about our FBX Content Pipeline (-> fbx-content-pipeline).

## Backward Compatibility

Sometimes, we may need to change the Datasmith file format and the behavior of the importer plugins in order to add new features. We do not guarantee backward compatibility between all versions of Unreal and all versions of the Datasmith export plugins. Although you may be able to import a `.udatasmith` file generated with an older version of an export plugin into a newer version of Unreal Engine, we do not recommend depending on it.

Always use the version of an export plugin that matches the Unreal Engine and Datasmith plugin versions that you need to use the exported file with. To get the most out of Datasmith, and to make sure you benefit from the latest fixes and features, we recommend always using the latest available version of Unreal Engine and the export plugins.

- reference
- datasmith
- enterprise
- manufacturing
- simulation
- architecture
- supported software
- file types

On this page

- Supported Applications (-> datasmith-supported-software-and-file-types)
- Supported File Formats and Standards (-> datasmith-supported-software-and-file-types)
- Export Plugins for macOS (-> datasmith-supported-software-and-file-types)
- Formats that Unreal Engine Supports Directly (-> datasmith-supported-software-and-file-types)
- Backward Compatibility (-> datasmith-supported-software-and-file-types)
