# Importing Assets Using Interchange

https://dev.epicgames.com/documentation/en-us/unreal-engine/importing-assets-using-interchange-in-unreal-engine?application_version=5.9

> An overview of the Interchange Framework and how it can be used to customize the import process.

[image: Importing Assets Using Interchange]

The **Interchange Framework** is Unreal Engine's import and export framework. It is file format agnostic, asynchronous, customizable, and can be used at runtime.

[image: Interchange Interface] Interchange Interface

Interchange uses a code base that is extensible and provides a customizable pipeline stack. This gives you the freedom to edit the import pipeline using C++, Blueprint, or Python to fit your project's needs.

## Important Concepts and Terms

When using Interchange, the following concepts and terms are important:

- **Pipeline**: A collection of operations that process imported data. A pipeline exposes the options used to customize the import process.
- **Pipeline Stack**: An ordered list of pipelines that process an imported file. Pipelines are combined in the stack and assigned to specific file formats. The pipeline stacks are located in **Project Settings > Interchange**.
- **Factory**: An operation that generates the asset from the imported data.

## Enable the Interchange Plugins

The Interchange Framework requires the **Interchange Editor** and** Interchange Framework** plugins, which are enabled by default. If these plugins are not enabled in your project, you can enable them in the Project settings for your project.

For more information on enabling plugins, see Working with Plugins.

## Import an Asset

Assets are imported into Unreal Engine using one of several different methods.

You can import assets in the Content Drawer or Content Browser, or by selecting **File > Import Into Level**.

For more information on importing files, see Importing Assets Directly (-> importing-assets-directly-into-unreal-engine).

**Import Into Level** currently only works with glTF (-> the-gl-transmission-format-gltf-in-unreal-engine) and **MaterialX** file formats.

## Import Process

Begin the import process by using one of the methods listed above.This opens the **Interchange Pipeline Configuration** window:

- Open the **Choose Pipeline Stack** dropdown menu and select the pipeline stack to use from the list.
- Configure your settings.
- Press **Import** to complete the process.

[image: Importing Using Interchange] Use the interface to select your import settings and click Import to continue.

With each import, the engine checks whether the file format is supported by the Interchange Framework. If the file is supported, Interchange uses the appropriate import pipeline stack for your format.

Interchange then goes through the following process:

- Interchange converts the imported data into an intermediary node structure in Unreal Engine.
- Interchange data processes through the pipeline stack, and follows the instructions for the import.
- Uses factories to generate the asset from the result.

If the file format is not supported by Interchange, Unreal Engine uses the legacy framework to import the file.

The Interchange Pipeline Configuration window has the following options:

| Option | Description |
| --- | --- |
| **Basic Layout** | Filters the import pipeline options down to the basic pipeline properties. |
| **Filter on Contents** | Filters the import pipeline options based on the data found in the source file. |
| **Choose Pipeline Stack** | Selects that pipeline stack that is used for this import. |

Support for the FBX file format is currently Experimental. To enable FBX import using Interchange, use the following console commands:

| Console Command | Description |
| --- | --- |
| Interchange.FeatureFlags.Import.FBX | Toggles experimental support for FBX import using Interchange. |
| Interchange.FeatureFlags.Import.FBX.ToLevel | Toggles experimental support for FBX Import Into Level. |

### Interchange Preview

When you click the **Preview** button in the Interchange Pipeline Configuration window, the Interchange Preview editor window opens:

[image: Interchange Preview] The Interchange Preview window shows a list of assets that will be created

In this window, you can see:

- A list of assets that will be created.
- Their types as icons or in the tooltip text (materials, static mesh, texture2D).
- Their properties are set up by the pre-import step of the pipeline.

### Conflicts Preview

If the import process detects changes in the material or skeleton structure of a reimported asset, it highlights the affected pipeline. When you click **Show Conflict**, the Conflicts Preview window opens:

[image: Interchange Conflicts Preview] The Interchange Conflicts Preview window shows changes to the material or skeleton structure on reimport

This window highlights each conflict to inform you what changes when the asset is reimported.

In previous versions, you could choose to preserve the original material assignment or replace it from the conflict window. You can no longer do this using Interchange. To change the assigned material of an asset, you must make the correction in the source file or use the Static Mesh Editor. For more information on using the Static Mesh Editor, see Applying a Material via the Static Mesh Editor (-> using-materials-with-static-meshes-in-unreal-engine).

## Reimporting Assets using Interchange

When you reimport an asset that was previously imported using Interchange, Unreal Engine remembers the pipeline stack and options that were used, and displays those options.

## Import an Asset Using Blueprint

You can use Blueprint to import assets into Unreal Engine through the Interchange Framework.

[image: Interchange Blueprint Example] The Blueprint example creates an object that imports files at runtime using Interchange.

For example, you can use Blueprint to import files using Interchange at runtime in an Unreal Engine-based application. The example above creates a function that imports a texture file to a specified file location using the default texture pipeline stack. This method of import currently does not support Skeletal Mesh or Animation data.

### Create a new Blueprint Class

To recreate the example, follow the steps below:

- In your project, create a new Actor Blueprint Class to contain the Function. To create the Actor Blueprint, right-click in the **Content Browser**, navigate to the context menu, and select **Blueprint Class**.
- In the **Pick Parent Class** window, select **Actor** and name the new Blueprint class **InterchangeActor**.[image: Pick Parent Class] Pick the Parent Class of your new Blueprint.

### Add a Function

To add a Function:

- Double-click the new Blueprint to open the editor.
- In the **My Blueprint** panel, go to the Functions setting, click the **+** button, and name the new function **InterchangeImport**.[image: Add New Function] Add New Function

### Add and Connect the Nodes

To add and connect the nodes:

- Add a **Sequence** node and connect it to the output of the function.
- Connect the** Then 0** output and create a **Create Source Data** node to reference the existing file that will be imported.
- Connect the **In File Name** input on **Create Source Data** and, from the context menu, select **Promote to Variable**.
- Name the new String variable **FilePath**. This holds the location of the file that will be imported.
- In the blueprint, select the new variable, and click the checkbox for **Instance Editable**.
- Promote the output of the **Create Source Data** node to a new variable named **SourceData**.
- Drag from the **Then 1** output on the Sequence and create a **Get Interchange Manager Scripted** node. This creates a pointer to the Interchange Manager that is used in the next step.
- Drag from the **Get Interchange Manager Scripted** output and create an **Import Asset** node. Connect the Return Value from **Get Interchange Manager Scripted** to the **Target input **on **Import Asset**.
- Drag off from the **Content Path** input and promote it to a new variable named **SavePath**. This holds the location of the newly imported file.
- In the blueprint, select the new variable and select the checkbox for **Instance Editable**.
- Get a reference to the **Source Data** variable and connect it to the Source Data input on **Import Asset**.
- Drag off from the **Import Asset Parameters** input and create a **Make Input Asset Parameters** node.[image: Interchange Blueprint Example] Click image for full size.

### Make the Function Available at Runtime

To make the function available at runtime:

- In **My Blueprints**, click on the **InterchangeImport** function, and click the checkbox next to **Call In Editor** in the **Details** panel. This option makes the function available at runtime in the **Details** of the **InterchangeActor** object.
- **Save** and **Compile** your Blueprint.

### Use Your New Blueprint

- Drag a copy of the InterchangeActor blueprint into the level.
- Click **Play**.
- In the **Outliner**, select the **InterchangeActor**.
- In the **Details** panel, fill in the **FilePath** and the **SavePath**.
- Click the **Interchange Import** button to import your file.

If you use an **Import Scene** node with the Blueprint example above, the asset spawns directly into the scene.

### Using Interchange in a Cooked Application

If you plan to use the Interchange Framework at runtime in a cooked application, go to the **Project Settings > Project - Packating > Additional Asset Directories to Cook**, and add the **Interchange** folder.

 Click image for full size.

## Import an Asset Using Python

You can use Python script to import assets into Unreal Engine through the Interchange Framework.

 Python

```
import unreal

import_path = "C:/Users/foo/Downloads/Fbx/SkeletalMesh/Animations/Equilibre.fbx"

import_extension = unreal.Paths.get_extension(import_path, False)

is_gltf = import_extension == 'glb' or import_extension == 'gltf'
is_fbx = import_extension == 'fbx'
is_usd = import_extension == 'usd'

```

In the above example, a Python script is used to import the `Equilibre.fbx` file. The script checks to see if the file format is `.glb` `.gltf` `.fbx` or `.usd` and then assigns the correct pipeline.

## Edit the Pipeline Stack

One of the advantages of the Interchange Framework is the ability to select and customize the pipeline stack, a customizable stack of processes that process the asset data is processed. You can add pipelines to the default pipeline stack to add behaviors during the import process.

Unreal Engine ships with the following default pipelines:

- Default Assets Pipeline
- Default Material Pipeline
- Default Texture Pipeline
- Default Scene Assets Pipeline
- Default Scene Level Pipeline
- Default Graph Inspector Pipeline

Each default pipeline contains the most common options used for that type of import. You can customize these pipelines to meet the specific needs of your project.

### Edit an Existing Pipeline

Each of the default pipelines is customizable to fit the needs of your project and team.

The following are methods for customizing the import options for your project:

- Add, remove, or reorder the existing pipeline stack in your **Project Settings**.
- Change which pipelines are used by default.
- Modify the existing default pipelines.
- Create a custom pipeline.

### Edit the Project Settings

You can find the pipeline stack in the **Project Settings** under **Engine > Interchange**:

[image: Pipeline Stack] The pipeline stack in Project Settings.

The pipeline stack contains the default settings for:

- Import Content
- Import Into Level
- Editor Interface
- Generic
- Editor Generic Pipeline Class

#### Import Content

Unreal Engine uses these settings to import content into the **Content Drawer** or **Content Browser**.

[image: Interchange Import Content] Click image for full size.

You can alter the settings for each type of content listed. You can also add additional headings if needed. For example, the default configuration contains **Assets**, **Materials**, and **Textures**. You could add an additional section to the pipeline stack for Animations and then be able to add one or more custom pipelines to handle incoming animation files.

#### Import Into Level

In the Editor window, you can find the **File > Import Into Level**. By default, this function uses two pipelines that work together. These pipelines import the Actor data from a file and then spawn an Actor in the level. The import function uses the following settings:

 Click image for full size.

- **DefaultSceneAssetPipeline** is based on the same class as the DefaultAssetPipeline and is designed for scene import.
- **DefaultSceneLevelPipeline** generates the Actor in the world after the data passes through the DefaultSceneAssetPipeline.

### Modify the Existing Default Pipelines

You can modify the properties of the default Interchange Pipelines to change the following:

- Default Values
- Visibility
- Read-only status

[image: Interchange Pipeline Details] The Interchange Pipeline Details panel.

To change the settings of the default Interchange Pipelines, follow the steps below:

- Locate the default pipelines in the Content Drawer or Content Browser and double click one to open it. The pipelines are located in the** Engine > Plugins >Interchange Framework Content > Pipelines** folder. If you are unable to see the Engine folder, click on **Settings** in the top right corner of the **Content Drawer** or **Content Browser** and select the checkbox for **Show Engine Content**.
- Edit the following as needed:Visibility during the import and reimport process.
- Default setting.
- Whether the property is read only during the import process.

- Save and close the window.

### Create a Custom Pipeline

You can create new Interchange Pipelines to further customize the import process using Blueprints, C++, or Python.

#### Create a Custom Pipeline Using Blueprints

To create a new Interchange Pipeline using Blueprints, follow the steps below:

- In the **Content Drawer** or **Content Browser**, right-click and select **Create Blueprint Class**.
- In the P**ick Parent Class window**, expand the **All Classes** category, and select **InterchangePipelineBase** as its **Parent Class**.
- Double-click the new Blueprint to open the **Blueprint Editor**.

[image: Select InterchangePipelineBase as the Parent Class] Select InterchangePipelineBase as the Parent Class.

A custom pipeline created using Blueprints has the following functions that can be overridden to add custom behavior.

[image: Interchange Blueprint Override Functions] Interchange Blueprint Override Functions.

| Override Function | Description |
| --- | --- |
| **Scripted Can Execute on Any Thread** | Communicates to the Interchange Manager that this pipeline can be executed in async mode. |
| **Scripted Execute Export Pipeline** | Executes during the export process (feature is currently nonfunctional). |
| **Scripted Execute Pipeline** | Executes after file translation. Creates the factory needed to generate Assets. |
| **Scripted Execute Post Factory Pipeline** | Executes after the factory creates an asset, but before the PostEditChange function is called. |
| **Scripted Execute Post Import Pipeline** | Executes after the Asset is completely imported and the PostEditChange function is called. |
| **Scripted Set Reimport Source Index** | Executes and tells the pipeline which source index to reimport. Use this function when reimporting an Asset that can have more than one source. For example, a Skeletal Mesh that has one source file for geometry and another for skinning information. |

#### Create a Custom Pipeline Using C++

To create a new Interchange pipeline using C++, Create a header file that contains the following:

 C++

```
#pragma once
​
#include "CoreMinimal.h"
​
#include "InterchangePipelineBase.h"
#include "InterchangeSourceData.h"
#include "Nodes/InterchangeBaseNodeContainer.h"
​
#include "InterchangeMyPipeline.generated.h"
​
```

Next, create a source file that contains the following:

 C++

```
#include "InterchangeMyPipeline.h"
​
​
void UInterchangeMyPipeline::ExecutePipeline(UInterchangeBaseNodeContainer* NodeContainer, const TArray<UInterchangeSourceData*>& InSourceDatas)
{
	Super::ExecutePipeline(NodeContainer, InSourceDatas);
​
	// Put the logic you need on either translated nodes or factory nodes
}
```

#include "InterchangeMyPipeline.h"
​
​
void UInterchangeMyPipeline::ExecutePipeline(UInterchangeBaseNodeContainer* NodeContainer, const TArray<UInterchangeSourceData*>& InSourceDatas)
{
 Super::ExecutePipeline(NodeContainer, InSourceDatas);
​
 // Put the logic you need on either translated nodes or factory nodes
}

For more information on working with C++ in Unreal Engine, see Programming with C++ (-> programming-with-cplusplus-in-unreal-engine).

#### Create a Custom Pipeline Using Python

To create a new Interchange Pipeline using Python script, create a new Python script and use the Project settings to add it to the Startup Scripts. For more information on working with Python scripting in Unreal Engine, see Scripting the Unreal Editor Using Python.

In the example script below, Python script is used to create a basic asset import pipeline.

 Python

```
import unreal
​
@unreal.uclass()
class PythonPipelineTest(unreal.InterchangePythonPipelineBase):
​
	import_static_meshes = unreal.uproperty(bool,meta=dict(Category="StaticMesh"))
	import_skeletal_meshes = unreal.uproperty(bool,meta=dict(Category="SkeletalMesh"))
​
	def cast(self, object_to_cast, object_class):
		try:
```

- import
- working with content
- export
- data pipeline
- interchange

On this page

- Important Concepts and Terms (-> importing-assets-using-interchange-in-unreal-engine)
- Enable the Interchange Plugins (-> importing-assets-using-interchange-in-unreal-engine)
- Import an Asset (-> importing-assets-using-interchange-in-unreal-engine)
- Import Process (-> importing-assets-using-interchange-in-unreal-engine)
- Interchange Preview (-> importing-assets-using-interchange-in-unreal-engine)
- Conflicts Preview (-> importing-assets-using-interchange-in-unreal-engine)
- Reimporting Assets using Interchange (-> importing-assets-using-interchange-in-unreal-engine)
- Import an Asset Using Blueprint (-> importing-assets-using-interchange-in-unreal-engine)
- Create a new Blueprint Class (-> importing-assets-using-interchange-in-unreal-engine)
- Add a Function (-> importing-assets-using-interchange-in-unreal-engine)
- Add and Connect the Nodes (-> importing-assets-using-interchange-in-unreal-engine)
- Make the Function Available at Runtime (-> importing-assets-using-interchange-in-unreal-engine)
- Use Your New Blueprint (-> importing-assets-using-interchange-in-unreal-engine)
- Using Interchange in a Cooked Application (-> importing-assets-using-interchange-in-unreal-engine)
- Import an Asset Using Python (-> importing-assets-using-interchange-in-unreal-engine)
- Edit the Pipeline Stack (-> importing-assets-using-interchange-in-unreal-engine)
- Edit an Existing Pipeline (-> importing-assets-using-interchange-in-unreal-engine)
- Edit the Project Settings (-> importing-assets-using-interchange-in-unreal-engine)
- Import Content (-> importing-assets-using-interchange-in-unreal-engine)
- Import Into Level (-> importing-assets-using-interchange-in-unreal-engine)
- Modify the Existing Default Pipelines (-> importing-assets-using-interchange-in-unreal-engine)
- Create a Custom Pipeline (-> importing-assets-using-interchange-in-unreal-engine)
- Create a Custom Pipeline Using Blueprints (-> importing-assets-using-interchange-in-unreal-engine)
- Create a Custom Pipeline Using C++ (-> importing-assets-using-interchange-in-unreal-engine)
- Create a Custom Pipeline Using Python (-> importing-assets-using-interchange-in-unreal-engine)
