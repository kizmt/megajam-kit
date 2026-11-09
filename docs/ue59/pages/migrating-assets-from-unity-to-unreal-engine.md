# Migrating Assets from Unity to Unreal Engine

https://dev.epicgames.com/documentation/en-us/unreal-engine/migrating-assets-from-unity-to-unreal-engine?application_version=5.9

> Import, Migrate, and Convert game assets from Unity to Unreal Engine.

### Importing and Converting Assets

**Unreal Engine 5** projects contain a variety of assets that make up the final game. Some of those asset types are specific to Unreal Engine, such as Blueprint classes, while others are universal file formats that can be imported into the engine.

This document goes over the types of assets you can import into Unreal Engine, how to import them, and links to additional information.

## Common Asset Types

Unreal Engine 5 supports the following asset types:

| Unreal Asset Type | Unity Equivalent | Supported Formats |
| --- | --- | --- |
| Static Mesh | Mesh | `.fbx, .obj` |
| Skeletal Mesh | Skinned Mesh | `.fbx, .obj, .usd` |
| Animation Sequence | Animation, Mecanim | `.fbx, .obj, .abc` |
| Texture (-> textures-in-unreal-engine) | Texture | `.bmp, .float, .jpeg, .jpg, .pcx, .png, .psd, .tga, .dds` (Cubemap or 2D), `.exr` (HDR), `.tif `(TIFF), `.tiff` (TIFF) |
| Audio File | Audio File | `.wav, .ogg, .flac, .aif, .opus, .mp3` |
| Video Files | Video clip | `.mov, .mp4, .wmv` |
| Fonts | Font asset | `.ttf, .otf` |
| glTF File | glTF File | `.gltf` (JSON), `.glb` |
| SpeedTree Model | SpeedTree | `.srt` |

## Asset Considerations Before Importing to Unreal Engine

### Unreal Engine’s Coordinate System

Unreal Engine uses the Cartesian coordinate system to represent positions in three-dimensional Euclidean space. The coordinate system in the Unreal Editor is left-handed and uses the **X axis** to represent the **forward / backwards** direction, the **Y axis** to represent the **right / left** directions, and **Z axis** to represent the **up / down** directions.

[video]

Unity’s coordinate system is also left-handed. However, Unity uses the **X axis** to represent **right / left**, **Y Axis** to represent **up / down**, and the **Z Axis** to represent the **forward / backwards** direction.

This has implications when directly importing assets from Unity to Unreal Engine as the asset’s orientation may be incorrect. To solve this, you can change the asset’s orientation inside a digital content creation (DCC) package such as Maya or Blender, or directly in the **Import dialogue** of Unreal Engine.

You can learn more about Unreal Engine’s coordinate system by reading the Coordinate System and Spaces (-> coordinate-system-and-spaces-in-unreal-engine) documentation.

### Units of Measurement in Unreal Engine

Unreal Engine uses the Metric System to measure object size and distance. Specifically, Unreal Engine uses the **Unreal unit (UU)** internally for measurements. **One Unreal Unit** is equivalent to **1 cm**.

Use this information to assign the correct scale when creating meshes in an external digital content creation (DCC) package.

Unity also uses the Metric System internally, with **one Unity unit** being equal to **1 meter (100 cm)**. This will affect the scale of objects imported directly from Unity into Unreal Engine.

You can learn more about Unreal Engine’s units of measurement by reading the Units of Measurement (-> units-of-measurement-in-unreal-engine) documentation.

### FBX Content Pipeline

Unreal Engine supports a variety of file formats for importing content into your project. One of the most popular asset formats is **Autodesk FBX**.

The FBX format provides interoperability between many digital content creating (DCC) packages and offers the following advantages:

- Using a single file format for static meshes, skeletal meshes, animations, and morph targets.

- Importing multiple LODs and Morphs/Blendshapes in one import operation.

- Importing material and texture assets, and automatically applying them to static meshes.

Unreal Engine’s FBX pipeline uses **FBX 2020.2**, so we recommend using that version to avoid possible incompatibilities when importing assets.

To learn more about the FBX pipeline, read the FBX Content Pipeline (-> fbx-content-pipeline) documentation.

## Version Information

At the time of writing, the version of Unreal Engine and Unity engine used for screenshots and terminology are as follows:

- Unreal Engine 5.4.3

- Unity 6 (6000.0.2f1)

## Preparing to Export Assets from Unity

Before exporting assets from Unity, follow these steps to **enable **the **FBX Exporter** package:

- In Unity, click **Window > Package Manager** to open the **Package Manager** window. [image: Click Window - Package Manager]

- Click the **Unity Registry** category on the left and search for **FBX Exporter**. Click **Install **to install the package. [image: Search for FBX Exporter and install the package]

- Once the package is installed, close the **Package Manager** window.

You can now **right-click** a prefab in the **Hierarchy **window and select **Export to FBX** to export it as an `.fbx` file.

Alternatively, you can open your Unity project’s **source folder** and directly copy certain files, such as textures directly.

## Meshes / Static Meshes

[image: A static mesh in Unity]

**Static meshes** are 3D meshes whose geometry does not change. You can import static meshes to Unreal Engine in .**fbx** or .**obj** formats, with .fbx as the preferred format. You can learn more about static meshes in Unreal Engine by reading the Static Meshes (-> static-meshes) documentation.

This example shows you how to export the Unreal Engine **material ball **static mesh from Unity into Unreal.

This prefab has one mesh and three materials. However, your mesh prefab can contain multiple meshes in its hierarchy.

[image: The Unreal Engine material ball static mesh]

[image: This prefab has one mesh and three materials]

### Export a Static Mesh from Unity

To export a **static mesh** from Unity, follow these steps:

- Right-click the prefab in the **Hierarchy **window and select **Export FBX…** from the menu. [image: Right click the prefab in the Hierarchy window and select Export FBX]

- In the **Export Options** window, enter the **Export Name** and **Export Path**. - Under the **Options **category, select the **ASCII Export Format**. - Click the **Include **dropdown and select **Model(s) Only**. - If your mesh has Levels of Detail (LODs) then select the appropriate level. - **Enable **the **Embed Textures** checkbox if you want to export the mesh materials with their corresponding textures. - Click **Export **to export your static mesh. [image: Enter the correct export options for your static mesh]

- Go to the **Export Path** folder to find the static mesh .fbx file. This is the file you will import to Unreal Engine. [image: Go to the Export Path folder to find the static mesh .fbx file]

### Import a Static Mesh to Unreal Engine

To import a **static mesh** to Unreal Engine, follow these steps:

- Open **Unreal Engine** and click the **Import **button in the **Content Browser**. [image: Click the Import button in the Content Browser]

- Navigate to the **Export Path folder** and **select the mesh** .fbx file, then click **Open**. > **note:** Alternatively, after using the **Show in Explorer** setting in Unity, you can **drag **the file from the file explorer window directly into the Unreal Engine **Content Browser** to import it.

- The **FBX Import Options** window will open to show the **import settings** for the static mesh. - Scroll to the bottom of the window to the **Fbx File Information** section to see the asset details. Notice that the **Creator Application** appears as **Unity FBX Exporter 5.1.1** and the **File Axis Direction** is **Y-UP**. [image: Scroll down to the Fbx File Information section to see the asset details] - Scroll up to the **Mesh **section and **enable **the **Generate Missing Collision checkbox**. [image: Enable the Generate Missing Collision checkbox] - Expand the **Advanced **section and **enable **the **Combine Meshes** checkbox if you want to combine several meshes into one. You can also **enable **the **Import Mesh LODs** if your mesh has LODs. [image: Enable the Combine Meshes and Import Mesh LODs checkboxes if desired] - Scroll down to the **Miscellaneous **section and **enable **the **Convert Scene** and the **Force Front X Axis** checkboxes. [image: Enable the Convert Scene and the Force Front X Axis checkboxes] - Scroll down to the **Material **section, click the **Material Import Method** dropdown, and select **Create New Materials**. This will automatically create new materials for the static mesh. [image: Click the Material Import Method dropdown and select Create New Materials] > **note:** For more information on the settings available in the FBX Importer, go to the FBX Import Options Reference page.

- Click **Import All** to import the static mesh to Unreal Engine. [image: Click Import All]

- The **static mesh** asset along with the **materials **and **textures **are now imported to Unreal Engine. [image: The static mesh asset is now imported to Unreal Engine]

- **Drag **the **static mesh** asset from the **Content Browser** to the level to see the final result. [image: Drag the static mesh asset to the level]

Learn more about the static mesh FBX pipeline by reading the FBX Static Mesh Pipeline in Unreal Engine (-> fbx-static-mesh-pipeline-in-unreal-engine) documentation.

## Skinned Meshes / Skeletal Meshes

[image: A skeletal mesh in Unity]

Characters in Unreal Engine are created using multiple unique assets that render the visual geometry, play animations, and construct logic that controls the character's behaviors in real time.

The foundational asset for characters in Unreal Engine is the **skeletal mesh** asset, which contains the character's **visual mesh**, or geometric model render of the character, and the character's **skeleton (-> skeletons-in-unreal-engine)** that contains bone data, which is used to animate the character.

Learn more about skeletal meshes in Unreal Engine by reading the Skeletal Meshes (-> skeletal-mesh-assets-in-unreal-engine) documentation.

This example shows you how to export Unreal Engine’s **Quinn** character from Unity to Unreal.

This prefab has a **root **component which holds several transforms for IK processing, and a **skeletal mesh** component which has the Skinned Mesh Renderer and two materials.

[image: Quinn character prefab]

[image: The skeletal mesh component which has the Skinned Mesh Renderer and 2 materials]

### Export a Skeletal Mesh from Unity

To export a **Skeletal Mesh** from Unity, follow these steps:

- Right-click the prefab in the **Hierarchy **window and select **Export FBX…** from the menu. [image: Right click the prefab in the Hierarchy window and select Export FBX]

- In the **Export Options** window, enter the **Export Name** and **Export Path**. - Under the **Options **category, select the **ASCII Export Format**, then click the **Include **dropdown and select **Model(s) + Animations**. This will include any animations assigned to the skeletal mesh. - If your mesh has Levels of Detail (LODs), select the appropriate level. - **Enable** the **Animated Skinned Mesh** checkbox. - **Enable **the **Embed Textures** checkbox if you want to export the mesh materials with their corresponding textures. - Click **Export **to export your static mesh. [image: Enter the correct export options for your skeletal mesh]

- Go to the **Export Path** folder to find the skeletal mesh `.fbx` file. This is the file you will import to Unreal Engine. [image: Go to the Export Path folder to find the skeletal mesh .fbx file]

### Import a Skeletal Mesh to Unreal Engine

To import a **Skeletal Mesh** to Unreal Engine, follow these steps:

- Open **Unreal Engine** and click the **Import **button in the **Content Browser**. [image: Click the Import button in the Content Browser]

- Navigate to the **Export Path folder** and **select the skeletal mesh** `.fbx` file then click **Open**. > **note:** Alternatively, after using the **Show in Explorer** setting in Unity, you can **drag **the file from the file explorer window directly into the Unreal Engine **Content Browser** to import the file.

- The **FBX Import Options** window will open to show the **import settings** for the static mesh. - Scroll to the bottom of the window to the **FBX File Information** section to see the asset details. Notice that the **Creator Application** appears as **Unity FBX Exporter 5.1.1** and the **File Axis Direction** is **Y-UP**. [image: Scroll down to the Fbx File Information section to see the asset details] - Scroll up to the **Mesh **section and **enable **the **Skeletal Mesh** and **Import Mesh checkboxes**. Click the **Import Content Type** dropdown and select **Geometry and Skinning Weights**. [image: Enable the Skeletal Mesh and Import Mesh checkboxes] > **note:** If your Unreal Engine project already contains a skeleton asset that is compatible with the character’s skeleton that you are importing, you can optionally select the compatible skeleton from the **Skeleton **drop-down. However, unless the skeleton assets are identical, you may choose to import the skeletons as their own assets and then define the different skeleton assets as compatible. For more information, see the Compatible Skeletons (-> skeletons-in-unreal-engine) documentation. - If your skeletal mesh was exported with animations, scroll down to the **Animation **section and **enable **the **Import Animations** checkbox. For this example, the skeletal mesh does not contain any animations. [image: If your skeletal mesh has animations, enable the Import Animations checkbox] - Scroll down to the **Material **section, click the **Material Import Method** dropdown and select **Create New Materials**. This will automatically create new materials for the skeletal mesh. [image: Click the Material Import Method dropdown and select Create New Materials] > **note:** For more information on the settings available in the FBX Importer, go to the FBX Import Options Reference page. |

- Click **Import All** to import the skeletal mesh to Unreal Engine. [image: Click Import All]

- The **skeletal mesh** asset along with the **materials **and **textures **are now imported to Unreal Engine. In addition, a **skeleton **and a **physics asset** are also created based on the skeletal mesh. [image: The skeletal mesh asset is now imported to Unreal Engine]

- **Drag **the **skeletal mesh** asset from the **Content Browser** to the level to see the final result. [image: Drag the skeletal mesh asset to the level]

Learn more about the skeletal mesh FBX pipeline by reading the FBX Skeletal Mesh Pipeline (-> fbx-skeletal-mesh-pipeline-in-unreal-engine)documentation.

## Animations

[image: Character animations in Unreal Engine]

You can use Unreal Engine's suite of powerful **animation tools** and **editors **to create **character **and **object runtime animation systems**, **rendered cinematic content**, and author **new animation content** directly in the engine.

Character **animations **in Unreal Engine are built using the Skeletal Mesh Animation System (-> skeletal-mesh-animation-system-in-unreal-engine). Animations are applied to a **skeletal mesh** and are driven by **animation assets**, such as an Animation Blueprint (-> animation-blueprints-in-unreal-engine).

Unreal Engine provides a variety of animation tools to work with Skeletal Meshes to further enhance your animations.

For more information about the Skeletal Mesh Animation system and for information about the suite of Animation Editors (-> animation-editors-in-unreal-engine), Assets, and Features (-> animation-assets-and-features-in-unreal-engine) in Unreal Engine, see the Animating Characters and Objects (-> skeletal-mesh-animation-system-in-unreal-engine) documentation.

### Export Animation Clips from Unity

**Animation Clips** from Unity can be exported as `.fbx` files using the **FBX Exporter** package. These exported files can then be imported into Unreal Engine as **Animation Sequences** to be used in your project.

[image: Skeletal mesh animation in unity]

To export an Animation Clip from Unity, follow these steps:

- Navigate in your Unity project to the **Hierarchy** panel, and select the character prefab that contains the Animation Clip you want to export.

- **Right-click** the prefab and select the **Export to FBX…** option. [image: Export animation clips in unity]

- Set the** Export Name **and **Export Path** properties to define the name of your exported file and where it will be saved on your computer. [image: Export Name and Export Path properties]

- Set the **Export Format** property to **ASCII**, then set the **Include** property to **Model(s) + Animation**. You can optionally decide to include all of the character’s Level Of Detail models (LODs) using the **LOD Level** property and set the **Object(s) Position** property to set a custom transform value. [image: Options settings] > **note:** Setting the Include property to **Model(s) + Animation** will export the Animation Clip and your characters Model and Skeleton Hierarchy, and store everything in one .fbx file. This can be helpful when importing your assets into Unreal Engine as all of your assets will be saved together.

- **Enable** the** Animated Skinned Mesh** checkbox, then export the assets using the **Export **button. [image: Enable the Animated Skinned Mesh checkbox and click Export]

### Import Animations to Unreal Engine

To import an animation from Unity to Unreal Engine, follow these steps:

- In the Unreal Engine **Content Browser**, click the** Import **button. [image: unreal engine content browser import button]

- Navigate to the location on your computer that you saved your exported Unity Animation Clip to, select the file, and click the **Open **button. > **note:** Alternatively, after using the **Show in Explorer** setting in Unity, you can **drag **the file from the file explorer window directly into the Unreal Engine **Content Browser** to import it.

- In the** FBX Import Options **window, set the following properties: - **Enable **the **Skeletal Mesh** property. - If you want to import the Animation Clip and generate a new Skeletal Mesh asset with the Animation Sequence asset, **enable** the **Import Mesh** property. If you only want to import the animation as an Animation Sequence, **disable** this property. For this example, we are only importing an animation and do not want to import the mesh as well, since the skeletal mesh has already been previously imported. [image: Set the correct options in the FBX Import Options window] > **note:** If you are importing the mesh, you will also need to **enable **the **Import Animations** checkbox. > [image: import animation property] - If you are importing a new character, and want to generate a new skeleton asset during the import process, leave the** Skeleton **property **undefined**. If you are importing an animation that you want to use with an existing character skeleton in your project, select the skeleton asset from the asset selection drop-down menu. In this example, the animation is for the Quinn skeletal mesh so the property is defined to use the **SK_Mannequin **asset. [image: skeleton property unreal engine] > **note:** If your Unreal Engine project already contains a skeleton asset that is compatible with the character’s skeleton that you are importing, you can optionally define this **Skeleton **property using the compatible skeleton. However, unless the skeleton assets are identical, you may choose to import the skeletons as their own assets and then define the different skeleton assets as compatible. For more information see the Compatible Skeletons (-> skeletons-in-unreal-engine) documentation. - After defining the properties for the FBX Import Option window, click** Import** to import the asset. > **note:** When importing skeletal mesh and animation assets using the FBX Import Option window, you can select either the **Import All** or the** Import **button to initiate the import process. The** Import All** will import all associated mesh, skeleton, material and texture assets contained within the .fbx file. This option is best used when trying to import all elements of the character. If you are importing additional animations associated with a character you have already imported, select the **Import** option to only import the individual animation assets.

After the import process completes, you can now access your Animation Sequence in the Asset Editor, or by dragging the asset into a level and playing the project in the editor (-> playing-and-simulating-in-unreal-engine).

[video]

### Skeletal Mesh Import Troubleshooting

You may encounter some issues when importing skeletal mesh characters and objects into Unreal Engine from another digital content creation (DCC) package or game engine. For example, objects may be imported at the incorrect scale or rotation due to differences between the programs and their respective coordinate systems.

Unreal Engine's FBX Import Settings menu can correct some issues during the import process, but if your objects are not importing correctly please reference the following sections for information about how to correct your import errors.

#### Scale

Unreal Engine’s coordinate system is based on a set scale where 1 Unreal Unit is 1 centimeter. Other programs operate using different scales, which, when migrating a file between the two programs, can result in characters or objects that are larger or smaller than they are designed to be. When migrating a file from Unity, which uses 1-meter units, your characters and objects could appear smaller after importing the assets into Unreal Engine.

[image: scale import error]

To fix this issue, navigate in the skeletal mesh editor to the** Asset Details** panel, and use the **Import Uniform Scale** property to set a new value for the mesh. After setting this value, use the **Reimport Base Mesh** button in the editor’s toolbar.

[image: scale import error fix]

#### Rotation

If your character’s skeleton, skeletal mesh, or animation assets are not rotated properly in the viewport, you can fix this issue by opening the asset in its associated editor.

[image: rotation import error]

Use the** Asset Details** panel to set a value for the **Import Rotation** property, then use the** Reimport Base Mesh **button in the asset editor’s **toolbar**. After the process is complete, your asset should be correctly rotated in Unreal Engine.

[image: rotation import error fix]

> **note:** Due to the coordinate system differences between Unity and Unreal Engine, a value of **90.0** on the **X-Axis** should correct any rotation issues for your skeletal mesh or Animation Sequence assets.

#### Convert Scene Properties

In the **Asset Details** panel of your asset, you can **enable **the **Convert Scene**, **Force Front Axis**, and **Convert Scene Unity** properties to correct any broken or irregular meshes during playback. After enabling any of these properties, click the **Reimport Base Mesh** button in the asset editor’s toolbar to apply the changes.

[image: convert scene properties]

#### Simultaneously Editing Multiple Assets

When importing Assets into Unreal Engine, it is possible that multiple assets will need the same correction to a setting, such as the import rotation or import scale. Rather than editing each asset individually, you can use bulk editing to apply the same setting or property value to multiple assets at the same time.

To edit multiple assets at once, use the following steps:

- Select each asset you want to edit in the **Content Browser** using **Shift + Click**.

- **Right-click** the selected assets and select the **Asset Actions** > **Edit Selection in Property Matrix **option in the context menu. [image: bulk edit setting]

- Each asset’s property will now be accessible in the **Asset Details** panel, where you can search or navigate to a specific property to apply a setting to all assets at once.

### Animation Blueprints

After importing your skeletal mesh character and its Animation Sequence assets, you can use an **Animation Blueprint** to drive animation playback and logic at runtime. Use these graphs to select animations to be played, blend between animations, and layer animations. For more information about using Animation Blueprints to drive animations in your project, see the Animation Blueprint (-> animation-blueprints-in-unreal-engine) documentation.

[image: animation blueprint graph overview]

## Textures

[image: A cube with a material that uses a brick texture in Unity]

**Textures **are image assets primarily used in Materials and applied to objects. They can also be used directly for other purposes, such as a heads up display (HUD).

Unreal Engine renders textures using texture streaming (-> texture-streaming-overview-for-unreal-engine) to optimize loading textures into the scene. The texture streaming system uses texture **mipmaps**. These are a pre-calculated sequence of images of the same texture at different resolutions.

You can learn more about textures in Unreal Engine by reading the Textures (-> textures-in-unreal-engine) documentation.

### Export a Texture from Unity

Unity keeps texture files saved in their original format inside the project directory, so there is no need to export a texture from Unity. Instead, you can copy the files directly from the project directory.

To find a texture file in Unity’s project directory, follow these steps:

- **Right-click** on the texture file inside the **Project **window and click **Show in Explorer**.

- You can now see the files inside the project directory. You can copy the files directly from here, or use this folder location to find the files from Unreal Engine. [image: You can now see the files inside the project directory]

### Import a Texture to Unreal Engine

To import a **texture** to Unreal Engine, follow these steps:

- Open **Unreal Engine** and click the **Import **button in the **Content Browser**. [image: Click the Import button in the Content Browser]

- Navigate to the **Unity project folder** where the textures are located, **select the texture** files, and click **Open**. [image: Select the texture files and click Open] > **note:** Alternatively, after using the **Show in Explorer** setting in Unity, you can **drag **the files from the file explorer window directly into the Unreal Engine **Content Browser** to import them.

- The **textures **are now imported to Unreal Engine. [image: The textures are now imported to Unreal Engine]

To learn how to use the textures in a material, see the **Shaders / Materials** section below.

## Shaders / Materials

[image: A cube with a brick material in Unity]

**Materials **in Unreal Engine define the surface properties of the objects in your scene. In the broadest sense, you can think of a Material as the "paint" that is applied to a mesh to control its visual appearance.

In more technical terms, Materials tell the render engine exactly how a surface should interact with the light in your scene. Materials define every aspect of the surface including color, reflectivity, bumpiness, transparency, and so on. These calculations are done using data that is input to the material from a variety of **images (textures)** and node-based **Material Expressions**, as well as from various property settings (-> unreal-engine-material-properties) inherent to the material itself.

You can learn more about materials in Unreal Engine by reading the Materials (-> unreal-engine-materials) documentation.

### Export a Material from Unity

Unity’s **Shader Graph** is used to build shaders visually. Unity also has **materials**, which can reference a Shader Graph asset and are applied to GameObjects directly.

Unreal Engine’s materials are converted to shaders internally and are built using the Material Editor (-> unreal-engine-material-editor-user-guide), which also uses a node-based approach to building materials.

A Shader Graph asset cannot be directly exported from Unity and converted to a Material graph in Unreal Engine. However, you can export all relevant **textures **from Unity into Unreal Engine and rebuild the Shader Graph node network inside Unreal Engine’s Material Editor.

This example shows a **Lit Shader Graph** that contains a texture applied to the **base color** and another texture applied as the **normal map**.

[image: Lit Shader Graph that uses 2 textures]

Export both of those textures from Unity by following the steps described in the **Textures **section of this document.

### Import a Material to Unreal Engine

Since you cannot directly import a material from Unity, you will rebuild the Shader Graph shown above in Unreal Engine’s Material Editor.

Follow these steps to build the material:

- Import the textures to Unreal by following the steps described in the **Textures **section of this guide. [image: The textures are now imported to Unreal Engine]

- Right click in the **Content Browser** and click **Material **to create a new material. Name the asset **M_Bricks**. [image: Create a new material and name it M_Bricks] [image: The material asset is now created]

- Double click **M_Bricks **to open the Material Editor. [image: Double click M_Bricks to open the Material Editor]

- Select the **textures **in the **Content Browser** and drag them inside the **Material Editor** to create two **Texture Sample nodes**. [image: Select the textures and drag them inside the Material Editor]

- Connect the **Texture Sample** node that references the **diffuse **texture to the **Base Color** pin of the material node. Then, connect the **Texture Sample** node that references the **normal map **texture to the **Normal** pin of the material node. [image: Connect the Texture Sample nodes to the Base Color and Normal pins of the material node]

- On the material node, enter the values **0.2** for **Specular **and **0.8** for **Roughness**. Click the **Save **button to compile and save the material. [image: On the material node, enter the values 0.2 for Specular and 0.8 for Roughness]

- In the viewport, click **Add + > Shapes > Cube** to add a Cube static mesh to the level. [image: In the viewport click Add + - Shapes - Cube] [image: A cube is added to the level]

- Select **M_Bricks **in the **Content Browser** and **drag it **to the **cube **static mesh in the level to apply the material. [image: Select M_Bricks and drag it to the cube static mesh]

Learn more about the material FBX pipeline by reading the FBX Material Pipeline (-> fbx-material-pipeline-in-unreal-engine) documentation.

## Particle Effects

[image: Niagara Visual Effects System in Unreal Engine]

Unity’s Visual Effects Graph is used to create GPU particle simulations. The system uses a node-based interface to create the effects and can simulate a large number of particles during gameplay.

The **Niagara VFX System** is Unreal Engine's next-generation VFX system. Niagara offers full control to its users. It is programmable and customizable on every axis and provides advanced tools for debugging, visualization, and performance measurement.

Niagara **Systems **contain one or more **emitters **that can combine to create complex effects. Emitters can spawn **CPU **or **GPU particles** independently and can render their particles as **sprites**, **meshes**, **decals**, **lights**, and **ribbons**. In addition, Niagara Systems have **inheritance**, which means that you can create a master Niagara System and derive several child systems from it.

Advanced users can create **custom modules** directly in the system for complete control over the emitter’s behavior. Niagara also comes with **pre-built templates**, including a full suite of fluid simulation (-> niagara-fluids-in-unreal-engine) examples for **2D** and **3D gasses**, **liquids**, and **shallow water**.

Niagara particles can interact with the environment by using mesh distance fields, collision, and the NeighborGrid3D module that allows for complex particle BOID behavior, such as flocking.

Niagara supports input data from other systems in Unreal Engine such as physics, animations, and Blueprint code. It also supports input data from external sources.

A Unity Visual Effects Graph cannot be directly exported out and imported to Unreal, so you will have to recreate your effects within Niagara. Many effects use materials and textures, which can be exported. To learn how to export textures from Unity, see the **Textures **section of this document.

Learn more about Niagara by reading the Creating Visual Effects (-> creating-visual-effects-in-niagara-for-unreal-engine) documentation.

## Audio

[video]

Unity’s audio system can import and play a variety of audio file formats in 3D space. The system can also apply many optional effects at runtime, such as reverb.

The **Unreal Audio Engine** is a robust audio engine that supports a wide variety of features across all platforms supported by Unreal Engine.

The audio engine comes with a multi-platform audio mixer (-> audio-mixer-overview-in-unreal-engine) that enables audio digital signal processing (DSP), procedural synthesis, a customizable submix graph, and a flexible C++ API.

Next-generation features, such as MetaSounds (-> metasounds-in-unreal-engine), audio modulation (-> audio-modulation-in-unreal-engine), audio analysis (-> audio-analysis-and-visualization-in-unreal-engine) and the ability to support custom interactive and procedural music systems (-> creating-procedural-music-with-metasounds) means that there is no need to use audio middleware such as FMOD or Wwise when creating rich, interactive audio for your games.

Learn more about audio in Unreal Engine by reading the Audio in Unreal Engine 5 (-> audio-in-unreal-engine-5) documentation.

### Export an Audio File from Unity

Unity keeps audio files saved in their original format inside the project directory, so there is no need to export audio files from Unity. Instead, you can copy the file directly from the project directory.

To find an audio file in Unity’s project directory, follow these steps:

- Right click your audio file in the **Project **window and click **Show in Explorer**.

- You can now see the audio file inside the project directory. You can copy the file directly from here, or use this folder location to find the file from Unreal Engine. [image: You can now see the audio file inside the project directory]

### Import an Audio file to Unreal Engine

To import an **audio file **to Unreal Engine, follow these steps:

- Open **Unreal Engine** and click the **Import **button in the **Content Browser**. [image: Click the Import button in the Content Browser]

- Navigate to the **Unity project folder** where the audio file is located, **select the audio **file and click **Open**. > **note:** Alternatively, after using the **Show in Explorer** setting in Unity, you can **drag **the file from the file explorer window directly into the Unreal Engine **Content Browser** to import it.

- The **audio file **is now imported to Unreal Engine. [image: The audio file** **is now imported to Unreal Engine]

- Right click the **audio file** in the **Content Browser** and click **Create Cue** to create a sound cue asset. This is the standard audio asset in the engine used to play sounds in-game. [image: A Sound Cue is now created in the Content Browser]

Learn more about sound cues by reading the Sound Cues (-> sound-cues-in-unreal-engine) documentation. We also recommend you learn about MetaSounds (-> metasounds-in-unreal-engine), as they provide more advanced features compared to Sound Cues.

## Video

[video]

Unity’s Video Player component attaches video files to GameObjects and provides several options to play video files in the scene.

Unreal Engine comes with a fully-featured Media Framework (-> media-framework-technical-reference-for-unreal-engine) that provides similar functionality. The framework supports a variety of video file formats, comes with playback optimization, and supports audio/video capture hardware on Windows and Android devices.

Learn more about playing a video file in Unreal Engine by reading the Play a Video File (-> play-a-video-file-in-unreal-engine) documentation.

### Export a Video File from Unity

Unity keeps video files saved in their original format inside the project directory, so there is no need to export a video from Unity. Instead, you can copy the file directly from the project directory.

To find the video file in Unity’s project directory, follow these steps:

- **Right-click** on the video file inside the **Project **window and click **Show in Explorer**.

- You can now see the file inside the project directory. You can copy the file directly from here, or use this folder location to find the file from Unreal Engine. [image: You can now see video file inside the project directory]

### Import a Video File to Unreal Engine

To import a **video file **to Unreal Engine, follow these steps:

- Open **Unreal Engine** and click the **Import **button in the **Content Browser**. [image: Click the Import button in the Content Browser]

- Navigate to the **Unity project folder** where the video is located, **select the video **file and click **Open**. > **note:** Alternatively, after using the **Show in Explorer** setting in Unity, you can **drag **the file from the file explorer window directly into the Unreal Engine **Content Browser** to import it.

- The **video file **is now imported to Unreal Engine. A **Media Plate actor** is automatically created in the **Content Browser** which can be dragged into the level to play the video file directly. [image: The video file** **is now imported to Unreal Engine]

- Select the **video file** in the **Content Browser** and drag it into the level. [image: Select the video file** **and drag it into the level]

- With the **Media Plate actor** selected, go to the **Details **panel and scroll down to the **Control **section. - **Enable **the **Play on Open**, **Auto Play**, and **Enable Audio** checkboxes. - If desired, **enable **the **Loop **checkbox to have the video loop indefinitely. [image: With the Media Plate actor selected, go to the Details panel and set your desired options]

- Optionally, you can scroll down to the **Geometry **section and adjust the **geometry **used to display the video (Plane, Sphere, or Custom), the **Aspect Ratio**, and **Letterbox Aspect Ratio**. For this example, we will leave the **Auto Aspect Ratio** checkbox **enabled **so the shape conforms to the video file’s native aspect ratio when playing. [image: You can scroll down to the Geometry section to adjust the geometry used and aspect ratio]

- Click **Simulate **to see the video play inside the level. [image: Click Simulate to see the video play inside the level] [video]

You can learn more about the **Media Plate actor** by reading the Media Plate Actor (-> the-media-plate-actor-in-unreal-engine) documentation.

## Camera Control and Cinematic Sequences

[image: A cinematic sequence created in Sequencer]

Unity comes with several tools to create cinematic content. The Timeline tool is used to create cinematic sequences in the editor and Cinemachine is a set of tools for controlling the camera.

When used together, these tools provide developers the ability to create dynamic cinematic sequences at runtime.

**Sequencer **is Unreal Engine's multi-track editor used for creating and previewing cinematic sequences in real time.

The editor contains robust cinematic tools that you can use to create animated and cinematic sequences. You can pilot cameras to create level fly-throughs, animate lights, move objects, animate characters, render output sequences, and more.

Camera animations and behaviors created in Timeline and Cinemachine cannot be directly exported from Unity and into Unreal Engine. For this use case, you will have to recreate that behavior by using Sequencer.

Learn more about Sequencer by reading the Cinematics and Sequencer (-> cinematics-and-movie-making-in-unreal-engine) documentation.

## Code and Visual Scripting

[image: Code comparison between Unity and Unreal]

Unity’s default programming language is C#, while Unreal uses C++ (-> programming-with-cplusplus-in-unreal-engine) as its native programming language. Unity also has Bolt Visual Scripting, which is similar to Unreal Engine’s Blueprint Visual Scripting (-> blueprints-visual-scripting-in-unreal-engine) language.

Unity C# scripts and Bolt scripting files cannot be directly exported from Unity and imported to Unreal Engine. You will have to build your functionality using C++ or Blueprints.

To learn about common Unreal Engine programming patterns and best practices, read the Creating Gameplay in Unreal Engine (-> creating-gameplay-in-unreal-engine-for-unity-developers) documentation.

## 2D Assets

[image: sprite paper 2d asset]

**Paper 2D** is a sprite-based system for creating 2D and 2D/3D hybrid games in Unreal Engine. The Paper 2D system uses texture files mapped to planer game objects to represent 2D characters, objects and backgrounds in your Unreal Engine project.

For more information about Paper 2D, and creating 2D projects in Unreal Engine, see the Paper 2D (-> paper-2d-overview-in-unreal-engine) documentation.

### Export 2D Assets from Unity

To export 2D assets from Unity, following these steps:

- **Right-click** the asset in your **Project **window, and select the **Show In Explorer** option to open the asset’s location on your computer. [image: Export a sprite from Unity]

- You can now see the file inside the project directory. You can copy the file directly from here, or use this folder location to find the file from Unreal Engine. [image: unity asset in file explorer]

### Import 2D Assets to Unreal Engine

To import a **2D asset **to Unreal Engine, follow these steps:

- Open **Unreal Engine** and click the **Import **button in the **Content Browser**. [image: import button unreal engine content browser]

- Navigate to the **Unity project folder** where the 2D file is located, select the 2D file and click **Open **to import the asset. > **note:** Alternatively, after using the **Show in Explorer** setting in Unity, you can **drag** the file from the file explorer window directly into the Unreal Engine **Content Browser**, to import the file. > [image: import sprite to unreal]

- The 2D asset is now imported to Unreal Engine [image: sprite imported in unreal engine content browser]

- Now that your file is imported, you can use it to create 2D assets or animations using Paper 2D.

For information about importing assets, creating Sprites, and Flipbook Animations, see the Paper 2D (-> how-to-import-and-use-paper-2d-sprites-in-unreal-engine) documentation.

## SpeedTree Assets

[image: SpeedTree foliage]

SpeedTree is a suite of products focused on creating foliage for real time and linear content. The product includes a tree modeler and prebuilt assets you can purchase and import directly into Unreal Engine.

Learn more about using SpeedTree in Unreal Engine by reading Introduction to SpeedTree for Unreal Engine in the SpeedTree documentation.
