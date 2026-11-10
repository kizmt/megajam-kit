# Scripting glTF Exports

https://dev.epicgames.com/documentation/en-us/unreal-engine/scripting-gltf-exports-in-unreal-engine?application_version=5.9

> How to use scripting, and Blueprint, to export to glTF from the Unreal Editor, and at runtime

[image: Scripting glTF Exports]

This page explains how to use the **Export to glTF** function to export Levels or supported Assets from the Unreal Editor using **Blueprint** or **Python**, and how to export them at runtime.

## The Export to glTF Function

The Export to GLTF function takes the following inputs:

- **An object to export:** this can be any supported Asset. For more information about supported Assets, see How the glTF Exporter Handles Unreal Engine Content. To export the current Level, you can pass an empty (null) reference.

- **Selected actors:** specifies the subset of the scene to export. When you export using Blueprint or Python, you must provide this set, even if it is empty.

- When you export a Level, provide an empty set to export all Actors in the Level.

- **A destination path:** the name, path, and format (file extension) of the exported glTF file. You can specify the following formats: | Format | Description |
| --- | --- |
| JSON `.gltf` | Includes the following elements, saved separately in a directory you specify: **Full scene description:** saved as a JSON-formatted, human-readable UTF-8 text file with the `.gltf` extension. **Texture files:** saved to the format you specify, `.png`, `.jpeg`, and so on. **Binary data files:** saved separate files with a `.bin` file extension. |
| Binary `.glb` | Combines the full scene description, all binary data, and all textures into a single self-contained binary file. |

- The export options. For more information, see glTF Export Options Reference (-> exporting-unreal-engine-content-to-gltf).

The **Export to GLTF** function produces the following outputs:

- **OutMessage:** The log messages from the export.

- **Return value:** Returns `true` if the export was successful, `false` otherwise.

## Exporting with Blueprint

You can add the **Export to GLTF** action to a Blueprint graph from the context menu (**Miscellaneous > Export to GLTF**).

 [image: Export to glTF Blueprint function configured to export a simple cube to glTF.]

Export to glTF Blueprint function configured to export a simple cube to glTF

| Input | Description |
| --- | --- |
| **Object** | The object to export (supported types are UMaterialInterface, UStaticMesh, USkeletalMesh, UWorld, UAnimSequence, ULevelSequence, ULevelVariantSets).Will default to the currently active world if null. |
| **File Path** | The filename on disk to save as. Associated textures and binary files will be saved in the same folder, unless the file extension is `.glb`, which results in a self-contained binary file. |
| **Options** | The various options to use during export. Will default to the project's user-specific editor settings if null. |
| **Selected Actors** | The set of Actors to export. This is only applicable if the object to export is a UWorld. An empty set results in the export of all actors. |

## Exporting with Python

The following code sample exports all Assets in the `/game/models/` subfolder as individual glTF files.

```

    import unreal

    assetPath = '/game/models/'
    outputDir = 'c:/Temp/glTFExport/'
    exportOptions = unreal.GLTFExportOptions()
    selectedActors = set()

    staticMestPaths = unreal.EditorAssetLibrary.list_assets(assetPath)
    for smp in staticMestPaths:
        sm = unreal.EditorAssetLibrary.load_asset(smp)
        if unreal.MathLibrary.class_is_child_of(sm.get_class(), unreal.StaticMesh):
            exportPath = outputDir+sm.get_name()+'/'+sm.get_name()+'.gltf'
            unreal.GLTFExporter.export_to_gltf(sm,exportPath,exportOptions,selectedActors)
```

import unreal

 assetPath = '/game/models/'
 outputDir = 'c:/Temp/glTFExport/'
 exportOptions = unreal.GLTFExportOptions()
 selectedActors = set()

 staticMestPaths = unreal.EditorAssetLibrary.list_assets(assetPath)
 for smp in staticMestPaths:
 sm = unreal.EditorAssetLibrary.load_asset(smp)
 if unreal.MathLibrary.class_is_child_of(sm.get_class(), unreal.StaticMesh):
 exportPath = outputDir+sm.get_name()+'/'+sm.get_name()+'.gltf'
 unreal.GLTFExporter.export_to_gltf(sm,exportPath,exportOptions,selectedActors)

## Exporting at Runtime

You can use the Export to GLTF function to export glTF files at runtime. However, neither Material baking (-> how-the-gltf-exporter-handles-unreal-engine-content) nor Material expression matching (-> how-the-gltf-exporter-handles-unreal-engine-content) is possible at runtime, so you need to do one of the following to handle most materials:

- **Pre-bake materials:** in the editor, create glTF proxy Materials. The glTF exporter uses the proxy materials for runtime glTF exports. Proxy Materials automatically ship with your application because they are referenced in the User Data for your Unreal Engine Materials. For more information about creating proxy Materials, see glTF Proxy Materials (-> gltf-proxy-materials-in-unreal-engine).

- In C++, use the **GLTFBuilder** API at runtime to modify the content of the glTF file before it is exported.

- gltf
- gl transmission format
- import / export

On this page

- The Export to glTF Function (-> scripting-gltf-exports-in-unreal-engine)
- Exporting with Blueprint (-> scripting-gltf-exports-in-unreal-engine)
- Exporting with Python (-> scripting-gltf-exports-in-unreal-engine)
- Exporting at Runtime (-> scripting-gltf-exports-in-unreal-engine)
