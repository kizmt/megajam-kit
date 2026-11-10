# FBX Scene Import

https://dev.epicgames.com/documentation/en-us/unreal-engine/fbx-scene-import-in-unreal-engine?application_version=5.9

> Using Import Into Level to bring full FBX scenes into Unreal Engine.

[image: FBX Scene Import]

The Import Into Level command enables users to import full FBX scenes into their levels instead of importing assets individually. Users are given full control of exactly which assets will be imported, as well as per-asset control over import settings. The workflow also allows for selective reimporting for individual assets that receive further edits outside of Unreal.

At this time, FBX full scene import supports the following asset types:

- Static Meshes

- Skeletal Meshes

- Animations

- Materials (Basic support; may not match original material in your content creation app)

- Textures

- Rigid Mesh

- Morph Targets

- Cameras (no animation)

- Lights

In order to reimport your scene later, you must import your scenes as a single Blueprint containing components for each asset in the scene.

## FBX Full Scene Workflow

- From the Main Menu bar, choose **File > Import Into Level**

- Select the FBX file containing the scene you wish to import.

- Choose the destination folder in your Unreal project.

- Using the FBX Scene Import Dialog, select the assets (static meshes, skeletal meshes, and materials) from your scene you would like to import.

You may also select the final output of the import process, importing all selected FBX scene assets as:

- **Individual level Actors**

- **Components of a single Actor**

- **Components of a single Blueprint Actor Class** (this is the only method that supports full scene reimporting)

Once you have imported your FBX scene, all of the assets will be imported into your project, along with an FBX Scene Data asset. This asset contains all of the linking information between the original FBX scene and all of the assets that were just imported into your project.

## FBX Scene Import Options Dialog

The FBX Scene Import Options Dialog gives you complete control over which assets will be imported into your scene and which will be included in the final output asset(s). You can also establish named groups of specific import settings, and quickly assign them to objects in your scene.

### Scene Tab

The Scene tab is where you can control how each asset from your FBX scene will be imported. The left side includes a tree view of the scene hierarchy. The right includes general import options for the entire scene.

It is important to note that unchecking an asset in the tree view of the Scene Tab will not prevent that asset from being imported. It only prevents the asset from being included in the final output (level actors, single actor components, or Blueprint).
In order to completely prevent an asset from being imported, you must uncheck it in both the Scene Tab and the Static Meshes or Skeletal Meshes tab, respectively. This workflow enables you to import assets from the scene that you may use eventually.

#### Available Options

| Option | Description |
| --- | --- |
| **Create Content Folder Hierarchy** | This will automatically create a folder representing each tier in the hierarchy. The folder will be named after the first item found at that hierarchy level. |
| **Import as Dynamic** | If checked, the mobility of all actors or components will be dynamic. If unchecked, they will be static. |
| **Hierarchy Type** | This is where you choose the final output of the import process: **Blueprint Asset**: This creates a single Blueprint Actor. All the assets selected in the tree view will become components of this Blueprint Actor. This is the only hierarchy type that supports full scene reimporting. **Actor Component**: This will create a single Actor, with each of the selected assets from the tree view imported as its components. This type does not support reimporting. **Actors**: This option will import each of the assets in the tree view as individual Actors. This type does not support reimporting. |

### Static Meshes Tab

The Static Meshes tab contains all options for importing the various Static Meshes found in your FBX scene file. On the left is a list of all of the included meshes, where you can uncheck meshes you do not want imported. On the right are the Static Mesh import options. This tab includes the ability to create presets of import options that can be quickly applied to groups of Static Meshes in the list view. The options found are similar to those in the standard Static Mesh import options (-> fbx-import-options-reference-in-unreal-engine).

The Static Meshes tab also includes the ability to create sets of override options, which will be covered in the Option Overrides (-> fbx-scene-import-in-unreal-engine) section.

### Skeletal Meshes Tab

The Skeletal Meshes tab will show all of the Skeletal Meshes being imported into the scene from your FBX file. On the left is a list of all the included Skeletal Meshes. As with the Static Meshes tab, you can uncheck any meshes you do not want to import. The right side contains a list of options for each of the Skeletal Meshes being imported, and is very similar to the standard Skeletal Mesh import options (-> fbx-import-options-reference-in-unreal-engine).

The Skeletal Meshes tab also includes the ability to create sets of override options, which will be covered in the Option Overrides (-> fbx-scene-import-in-unreal-engine) section.

### Materials Tab

The Materials tab enables control over the materials that are being imported into your scene along with your FBX file. You can also **Right-click** on an existing material from the FBX file and replace it with an existing one in your project.

Keep in mind that the FBX importer never allows you to override materials that already exist in the project. You can only assign existing materials to replace those in the FBX, or it will create new materials with basic texture hookups.

Also on the Materials Tab you can override the location of where to save all Materials.
Click the **Browse** option and define where in your project you would like to import your Materials to.

### Option Overrides

Option overrides can be used to group sets of import options into a named set, which can then be applied to multiple assets simultaneously. This allows users to quickly create sets of common options for groups of meshes, rather than having to set them all one at a time.

To create and apply an option override:

- Click the Create Override button found in either the Static Meshes or Skeletal Meshes tab.

- Enter a name for the new override.

- With the new override selected from the dropdown at the top of the options list, set your desired options.

- Select any number of meshes from the list on the left of the tab, then **Right-click** and choose your new override from the context menu.

You may also remove any selected override by clicking the Delete button, located above the options list.

## Full Scene Reimporting

If you have imported your scene as a Blueprint object, you also have the ability to do a full scene reimport. This works very similarly to the full scene import functionality, but also tells you what components of your FBX scene have been added, removed, or edited. Using full scene reimport, it is easy to return to your DCC app, make any desired changes, and then bring your complete scene back into Unreal, selectively applying only the changes you wish to update.

### Scene Reimport Workflow

To reimport your scene **Right-click** on the **FBX Scene Import Data** asset (or any assets imported by a previous scene import) and choose **Reimport** from the context menu.

This will open the FBX Scene Reimport Options dialog. This dialog is similar to the FBX Scene Import options, but will also show any assets that have been removed (their icons will have a minus sign) and assets which have been added (their icons will have a plus sign). The scene asset tree view can also be filtered to show you which assets in your FBX scenes have been added, removed, or changed.

The dialog consists of the same four tabs as before:

- Scene

- Static Meshes

- Skeletal Meshes

- Materials

### Reimport List Filter Buttons

All of the tabs of the FBX Scene Reimport Options dialog contain a series of filters for quick access to changed assets. These filters include:

| Option | Description |
| --- | --- |
| **Add** | This will automatically create a folder representing each tier in the hierarchy. The folder will be named after the first item found at that hierarchy level. |
| **Delete** | This only shows those assets in the FBX scene that have been removed since the last import. |
| **Overwrite** | This shows only assets that will be overwritten from the last import. |
| **Diff** | This shows only assets that are different (added or deleted) from the last import. |

### Reimport Scene Tab

The Reimport Scene tab is essentially the same as the Scene tab from the original Import Into Level operation. However, a key difference is the ability to reimport the hierachy.
When the Reimport Hierarchy checkbox (found at the top of the Options group) is checked, this re-imports the Blueprint's hierarchy, causing you to lose any changes you've made to the Components list of the Blueprint.
Any node graph changes you make to the Blueprint will be maintained.

### Reimport Static Meshes Tab

The Reimport Static Meshes Tab shows offers the same functionality as the standard Static Meshes Tab (-> fbx-scene-import-in-unreal-engine) found in the FBX Scene Import Dialog, now applied to meshes being reimported.
You can also filter the results using the Filter Options (-> fbx-scene-import-in-unreal-engine).

### Reimport Skeletal Meshes Tab

The Reimport Skeletal Meshes Tab shows offers the same functionality as the standard Skeletal Meshes Tab (-> fbx-scene-import-in-unreal-engine) found in the FBX Scene Import Dialog, now applied to meshes being reimported.
You can also filter the results using the Filter Options (-> fbx-scene-import-in-unreal-engine).

### Reimport Materials Tab

The Reimport Materials Meshes Tab shows offers the same functionality as the standard Materials Tab (-> fbx-scene-import-in-unreal-engine) found in the FBX Scene Import Dialog, now applied to materials that are a part of the FBX scene being reimported.

Remember that the importer will never overwrite existing Materials!

- import
- fbx

On this page

- FBX Full Scene Workflow (-> fbx-scene-import-in-unreal-engine)
- FBX Scene Import Options Dialog (-> fbx-scene-import-in-unreal-engine)
- Scene Tab (-> fbx-scene-import-in-unreal-engine)
- Available Options (-> fbx-scene-import-in-unreal-engine)
- Static Meshes Tab (-> fbx-scene-import-in-unreal-engine)
- Skeletal Meshes Tab (-> fbx-scene-import-in-unreal-engine)
- Materials Tab (-> fbx-scene-import-in-unreal-engine)
- Option Overrides (-> fbx-scene-import-in-unreal-engine)
- Full Scene Reimporting (-> fbx-scene-import-in-unreal-engine)
- Scene Reimport Workflow (-> fbx-scene-import-in-unreal-engine)
- Reimport List Filter Buttons (-> fbx-scene-import-in-unreal-engine)
- Reimport Scene Tab (-> fbx-scene-import-in-unreal-engine)
- Reimport Static Meshes Tab (-> fbx-scene-import-in-unreal-engine)
- Reimport Skeletal Meshes Tab (-> fbx-scene-import-in-unreal-engine)
- Reimport Materials Tab (-> fbx-scene-import-in-unreal-engine)
