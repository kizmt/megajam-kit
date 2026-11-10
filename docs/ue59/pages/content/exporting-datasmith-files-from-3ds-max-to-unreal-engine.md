# Exporting Datasmith Files from 3ds Max

https://dev.epicgames.com/documentation/en-us/unreal-engine/exporting-datasmith-files-from-3ds-max-to-unreal-engine?application_version=5.9

> Describes how to export a 3ds Max scene to a Datasmith file that you can import into Unreal Engine.

[image: Exporting Datasmith Files from 3ds Max]

You can export **3ds Max** content as `.udatasmith` files that you can import into **Unreal Engine**. You can export an entire scene, or a specific selection. In either case, **Datasmith** only exports objects that are visible in 3ds Max.

To import a `.udatasmith` file into Unreal Engine, your Unreal Engine project must have the Datasmith Importer plugin enabled. If you don't enable the plugin, you won't see the Datasmith options in Unreal Engine. For more information, see Enable the Datasmith Importer Plugin (-> using-datasmith-with-3ds-max-in-unreal-engine).

## Export a .udatasmith File

From the Datasmith tab of the 3ds Max ribbon, do the following:

- Configure the export settings as needed (see Export Settings (-> exporting-datasmith-files-from-3ds-max-to-unreal-engine) below).

- If you plan to export a specific selection, select the objects you want to export. If you plan to export the entire scene, skip this step.

- Do one of the following: a. To export the entire scene, click **Export**. a. To export the current selection, click **Export Selected**.

- In the **Export Datasmith File** dialog, choose a name and location for the exported file. Make sure **Save as type** is set to **Datasmith (*`.udatasmith`)**, and click **Save**.

## Export Settings

All of the 3ds Max export settings are on the Datasmith tab of 3ds Max ribbon, either in the File Export panel or the Settings panel

### File Export Panel Settings

Expand the File Export panel to display the following settings:

| Option | Description |
| --- | --- |
| Export | Exports the 3ds Max Scene to a `.udatasmith` file that you can import into Unreal Engine, or an Unreal Engine-based application such as Twinmotion, or an Unreal Engine runtime application. Datasmith only exports visible objects. |
| Export Selected | Exports currently selected objects in the 3ds Max scene to a `.udatasmith` file that you can import into Unreal Engine, or an Unreal Engine-based application such as Twinmotion, or an Unreal Engine runtime application. Datasmith only exports visible objects. |
| Animated Transforms | Specifies how the Datasmith exporter handles objects with animated 3D transforms. **Current Frame Only**: Datasmith exports objects in the scene as they appear in the current frame, without any animation data. **Active Time Segment**: Datasmith exports animation data for any objects whose 3D transforms are animated in the active time segment in the 3ds Max timeline. The Datasmith importer converts animation data into a Level Sequence (-> creating-level-sequences-with-dynamic-transforms-in-unreal-engine), which you can use to play back the animations in Unreal Engine. |

### Settings panel Settings

| Option | Description |
| --- | --- |
| Limit Texture Resolution | When Datasmith bakes procedural textures into images for import in Unreal Engine, this setting specifies the maximum number of pixels in the baked images. Possible values range from 4K (4096 pixels) to 16M (16 megapixels). For example, if you set this value to 4K, Datasmith limits textures to resolutions that contain 4096 pixels (64x64, 128x32px, and so on). This setting does not affect the size of raster textures, for example TIFF or JPEG files assigned as bump maps, diffuse maps, and so on. |
| Export XRef Scenes | Specifies whether to include XRef scenes in the exported `.udatasmith` file. XRef scenes are externally-referenced scenes that appear in your current file, but are loaded temporarily from other MAX files. For more information, see XRef Scene in the 3ds Max documentation. |

- datasmith
- enterprise
- 3ds max
- interop

On this page

- Export a .udatasmith File (-> exporting-datasmith-files-from-3ds-max-to-unreal-engine)
- Export Settings (-> exporting-datasmith-files-from-3ds-max-to-unreal-engine)
- File Export Panel Settings (-> exporting-datasmith-files-from-3ds-max-to-unreal-engine)
- Settings panel Settings (-> exporting-datasmith-files-from-3ds-max-to-unreal-engine)
