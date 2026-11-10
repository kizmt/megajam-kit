# DMX MVR Import and Export

https://dev.epicgames.com/documentation/en-us/unreal-engine/dmx-mvr-import-and-export-in-unreal-engine?application_version=5.9

> Import MVR files manually or using the Datasmith plugin to use with DMX.

[image: DMX MVR Import and Export]

“In the entertainment industry, the MVR file format allows programs to share data and geometry for a scene. A scene is a set of parametric objects such as fixtures, trusses, video screens, and other objects that are used in the entertainment industry.” (Quote: MVR Standard)

You can import MVR Files into Unreal Engine to use with DMX. Manually importing an MVR file only includes DMX-related fixtures and patching information. To also import static and scene geometry, use Datasmith and the Datasmith MVR plugin (-> dmx-mvr-import-and-export-in-unreal-engine).

## MVR Exporter

 [image: A promotional graphic of two stylized file icons, an MVR file and a GDTF file.]

You can use the **MVR Exporter** in Unreal Engine to share DMX Libraries with lighting desks and 3rd party software.

The exported MVR file includes the following information from the DMX Library:

- Patching information

- Fixture definitions

- Fixture GDTF signatures

### MVR Export Process

To export a DMX Library as an MVR file, follow these steps:

- Open the DMX Library from the **Content Browser**.

- Click **Export**. [image: A screenshot of the Export button]

- Set the following options: **Consider Level**: If checked, uses data from the current level. Must be checked for the other options to be available.

- **Export Patches not Present in the World**: If checked, exports patches that are not used in the current level.

- **Use Transforms from Level**: If checked, uses the transforms of patches as used in the level. If unchecked, uses the default transforms of Fixture Patches.

- **Create Multi Patch Fixtures (experimental)**: If the same Fixture Patch is used more than once in a level, creates an MVR multi patch.

 [image: The MVR export options]

- Click **Export**.

Unreal Engine relies on Datasmith to import scene elements. If the DMX Library was created from an MVR file, then it retains the scene elements when the DMX Library is exported as an MVR file.

## Import an MVR File Manually

To manually import an MVR file into Unreal Engine, follow these steps:

- Drag the MVR file from your device into the **Content Browser**. This creates a DMX Library Asset using the data from the MVR file.

- Drag the DMX Library Asset into the level to populate the **DMX MVR Scene Actor**. This spawns the DMX-enabled Blueprint Actors at the right location along with their transforms.

It is possible but not recommended to add the same DMX Library to a level more than once. Adding more than one may lead to ambiguous MVR Fixture IDs for the actors, which will cause limitations during MVR export.

### DMX MVR Scene Actor

The DMX MVR Scene Actor contains a list of DMX-enabled Blueprints, automatically chosen to match the attributes of the fixtures described in the MVR file.

 [image: A screenshot of the DMX MVR Scene Actor]

The **Details** panel for the MVR Scene Actor include the following options:

 [image: The Details panel for the MVR Scene Actor]

- **Write Transforms to DMX Library**: Writes the current transforms of the fixture to the DMX Library.

- **Refresh Actors from DMX Library**: Refreshes the DMX Library, spawns new actors, and includes the following options: **Respawn Deleted Actors**: When enabled, respawns deleted Fixture actors that are defined in the DMX Library.

- **Update Transforms**: When enabled, Fixture actors adopt the transform of their related patch in the DMX Library.

- **Fixture Type to Spawned Actor**: Shows a list of Fixture Types described in the DMX Library. Use the dropdown menu to match a different Blueprint to the fixture. This replaces all Actors that make use of a Fixture Patch with related Fixture Type. You can only select Blueprints that implement the MVR Fixture Actor Interface.

### DMX MVR Fixture Actor Interface

You can implement the MVR Fixture Actor Interface in any actor class in Blueprints or C++.

 [image: A screenshot of the DMX MVR Fixture Actor Interface]

**On MVR Get Supported DMX Attributes** returns the attributes that the Blueprint's actor supports. When an MVR file is imported, each fixture is automatically matched with the Blueprint of the actor with the most matching attributes.

Actors that implement the DMX MVR Fixture Actor Interface need to have exactly one DMX component attached. The component is automatically patched when the actor is spawned in an MVR scene. The engine logs an error if no or many DMX components are used in an Actor that implements the DMX MVR Fixture Actor Interface.

## Import an MVR File Using The Datasmith MVR Plugin

### Export MVR and Datasmith Files from Vectorworks Datasmith

- In Datasmith, click **File** > **Export** > **Unreal Datasmith (3D Only)** to export your Vectorworks scene.

- Click **File** > **Export** > **MVR** to export the DMX-related data from fixtures, GDTF, and patching information.

Place your MVR file in the same directory and use the same filename as the `.udatasmith` file from step 1.

### Import MVR and Datasmith Files into Unreal Engine

- In Unreal Engine, go to the Main Toolbar and click Create > Datasmith > File Import… [image: A screenshot of the File Import menu option]

- In the dialog, enable **Import MVR** to import DMX-related fixtures and patching information. If you only require the 3D geometry from the Datasmith file, then you can uncheck this option.

Place the MVR file in the same directory location as the `*.datasmith` file.

 [image: A screenshot of the Datasmith Import Options window]

### Unreal Imported Scene

The following example shows a sample Vectorworks project in Unreal Engine once fully imported through this process.

 [image: A screenshot of a sample Vectorworks project imported into Unreal Engine]

Note the following elements in the editor:

- Content Browser Datasmith Scene

- DMX Library

- Preview Window Instanced 3D scene, geometry with textures and materials

- Instanced DMX enabled fixture BPs

- Datasmith Scene Actor Actor Scene Geometry actor

- DMX MVR Scene Actor

- Datasmith settings

#### Datasmith Scene

This asset contains all the mesh, texture, and material references imported from Vectorworks through Datasmith.

 [image: The Details panel for a Datasmith scene]

#### DMX Library

The DMX Library asset contains the following information:

- Fixture Types

- GDTF signature

- Attribute definitions

 [image: A screenshot of a DMX Library]

It also includes the DMX patching data imported from Vectorworks using the MVR standard.

 [image: A screenshot of the DMX patching data]

#### Datasmith Scene Actor

The instantiated Datasmith Scene Actor in your level contains two actors:

- Actor Scene Geometry actor: this contains all of the instantiated 3D geometry, materials and texture references. !A screenshot of the Actor Scene Geometry actor](actor-scene-geometry.png)

- DMX MVR Scene Actor: This contains all of the DMX-enabled fixture Blueprints. These Blueprints are automatically chosen when you import the MVR file. You can choose to assign different Blueprints in the **GDTF To Spawned Actor** section. [image: A screenshot of the DMX MVR Scene Actor]

Use the **Details** panel to access **Update actors from Scene** and **Respawn** options for the **DatasmithSceneActor**. For more information about respawning and updating actors, refer to Reimporting Datasmith Content (-> datasmith-reimport-workflow-in-unreal-engine).

 [image: A screenshot of the DatasmithSceneActor options]

MVR and Datasmith scene actors are mutually exclusive in ownership and control. A live sync from Datasmith will not work with an MVR scene actor.

- dmx
- ar/vr/xr

On this page

- MVR Exporter (-> dmx-mvr-import-and-export-in-unreal-engine)
- MVR Export Process (-> dmx-mvr-import-and-export-in-unreal-engine)
- Import an MVR File Manually (-> dmx-mvr-import-and-export-in-unreal-engine)
- DMX MVR Scene Actor (-> dmx-mvr-import-and-export-in-unreal-engine)
- DMX MVR Fixture Actor Interface (-> dmx-mvr-import-and-export-in-unreal-engine)
- Import an MVR File Using The Datasmith MVR Plugin (-> dmx-mvr-import-and-export-in-unreal-engine)
- Export MVR and Datasmith Files from Vectorworks Datasmith (-> dmx-mvr-import-and-export-in-unreal-engine)
- Import MVR and Datasmith Files into Unreal Engine (-> dmx-mvr-import-and-export-in-unreal-engine)
- Unreal Imported Scene (-> dmx-mvr-import-and-export-in-unreal-engine)
- Datasmith Scene (-> dmx-mvr-import-and-export-in-unreal-engine)
- DMX Library (-> dmx-mvr-import-and-export-in-unreal-engine)
- Datasmith Scene Actor (-> dmx-mvr-import-and-export-in-unreal-engine)
