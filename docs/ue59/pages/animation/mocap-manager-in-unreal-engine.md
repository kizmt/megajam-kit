# Mocap Manager

https://dev.epicgames.com/documentation/en-us/unreal-engine/mocap-manager-in-unreal-engine?application_version=5.9

> Learn how to set up and use the Mocap Manager.

This tutorial provides a complete walkthrough of **Mocap Manager **(part of the Performance Capture Workflow Plugin) in Unreal Engine.

This tutorial covers the following topics:

- Enabling the plugin

- Setting up your mocap stage representation

- Managing performers, characters, and props

- Configuring Live Link

- Recording and reviewing takes

- Creating a custom workflow

- Using Metahumans with Mocap Manager

## Set up Mocap Manager

To open **Mocap** **Manager**, follow these steps:

- In the main menu, click **Edit > Plugins**.

- Search for and enable the **Performance Capture Workflow** plugin. When prompted, restart the editor.

- In the main menu, click **Window > Virtual Production > Mocap Manager**.

### Create the Required Data Tables

Mocap Manager is a centralized location for controlling what is needed during a mocap shoot. It is designed to lead you through the process linearly, from start to finish.

There are two data tables to keep track of your shoots — a **Productions Table** and a **Sessions Table**.

Productions are intended as the highest level container; many sessions can be created in a production. Productions can be used to organize larger efforts (such as separate games or cinematic deliveries) in a single Unreal project. They are optional — you can use the default production instead.

Sessions are a collection of folders and assets for a given shoot. Sessions represent individual capture sessions, such as a morning or an afternoon shoot. When you create a session, folders and a collection of assets used during a session are created.

To create and assign these data tables, follow these steps:

- In the Mocap Manager window, click **Create Missing Assets** if prompted. [image: The Create Missing Assets button]

- Select **Yes** to create these assets in the default folder (`/Game/Pcap`) or select **No** to choose a custom location.

Once you have created the data tables, follow these steps:

- In the main menu, click **Edit > Project Settings**.

- In the **Project Settings** window, navigate to **Performance Capture**. Under **Internal Database Tables**, assign the Sessions and Productions data tables.

## Use Mocap Manager

In this section, you'll step through each major section of the Mocap Manager UI and learn about what each feature does.

### Session

In the **Session** tab, you can create and manage a capture session and generate a folder structure that becomes the active context for your shoot.

To create a new session, follow these steps:

- In the **Create New Session** section, enter a session name and any optional notes.

- Click **+ Session**.

This creates a folder in your project and the session becomes active. This folder structure is created per session and is placed under the **PCapRoot** folder defined in your **DefaultSessionTemplate** asset.

> **info:** Mocap Manager can only have one active session at a time.

Navigate to your session folder at any time by clicking the **folder** icon in Mocap Manager, in the top-right of the UI.

[image: Jump to session folder button]

Session templates allow for customization of folder structure and naming using dynamic naming tokens (-> BlueprintAPI).

[image: A session template data asset]

All actors created by Mocap Manager are assigned to a data layer or sub-level for your session. Each session gets a new data layer or sub-level.

When you create a session, Mocap Manager checks if your open level is using **world partition** or **level streaming**. Depending on the context of creation, a data layer or sub-level is created in the `[SessionName]/Scenes` folder. This data layer or sub-level will be the edit context for your level. This means that all actors will be placed inside this context.

> **note:** It is not advised to change persistent level once you have created and started a session.

### Stage

In the **Stage** tab, you can spawn, customize, and visually align a stage asset to match your physical mocap stage — giving you a spatial reference inside Unreal for where your real-world performers and cameras are.

The Performance Capture Workflow plugin comes with a default stage asset called **BP_DemoStage **that you can duplicate and edit to suit your needs. This Blueprint spawns on any valid floor in front of the camera and is added to the Current Context for your level. For easier positioning when aligning your Unreal level to your real-world stage, you can toggle the grid view and the stage ghost meshes.

[image: An example mocap stage actor]

### Motion

In the **Motion **tab, you can create performers, characters, and props, and configure Live Link subjects.

#### Performers

In the **Performers** tab, you can create and spawn performers. Performers are encapsulated in a data asset called a **PCapPerformer**.

[image: The Performers tab]

To create a performer, follow these steps:

- In the **Create Proportioned Mesh** section of the **Performers **tab, select a **Live Link Subject **from the dropdown menu. Only subjects with the role type **animation **(skeletal data) will be listed on the dropdown.

- Click **Launch Workflow** to launch the **Create Proportioned Mesh** viewport. [image: The Mocap Manager Proportioned Mesh workflow]

- In the viewport, align the skeleton over the origin (the pelvis at (0,0)) by asking the performer to move their position until they line up. - Alternatively, expand the **Advanced** section and enable **Constrain** **Pelvis**. This locks the chosen pelvis bone above the mocap system’s origin, so the performer does not need to reposition themself.

- Click **Create Mesh & IKRig**. This closes the **Proportioned Mesh** viewport and takes you back to the **Mocap Manager** panel.

- Click **Create Performer** to generate the PCapPerformer data asset.

The performer will now be selectable from the **Spawn Performer** section. Click **Spawn** **Performer **and the newly created skeletal mesh with Live Link data applied will spawn, parented to your Stage Root actor.

#### Characters

In the **Characters** tab, you can create characters for your performers to control.

[image: The Character tab in Mocap Manager]

To create a character, follow these steps:

- In the **Create New Character Asset** section, enter the following information: - **Source Performer Asset**: Select the performer that will control this character. - **Character Class**: Select the default **CaptureCharacter** class, unless you are using a custom Blueprint, such as the one from the Metahuman example above. - Character Mesh: Assign the body skeletal mesh for the character. This is required for retargeting. - **Character Name**: Enter a name for the character.

- Click **Create Character Asset**. A character data asset is generated, storing references to the performer, retarget asset, IKRig, mesh, and CaptureCharacter class.

- Click **Spawn Character** to spawn your character in the scene.

When you spawn your character, it will be attached to the Stage Root actor.

##### Tune Retarget

In this window, you can modify retarget properties on each bone chain. Retarget tuner is designed to work only with Humanoid Bipeds, as its chains are named specifically to match those created by auto IKRig scripts.

To open the Retarget Settings window, click the retarget tuner button on a character.

[image: The retarget tuner button, and the Retarget Settings window.]

#### Props

In **Props **tab, you can create props for your performers to use.

[image: The Props tab]

To create a prop, follow these steps:

- In the **Props** tab, click **Launch Workflow** to open the **Create Prop** viewport.

- In either the **Static Mesh** or **Skeletal Mesh **dropdown menus, select a mesh for the prop.

- In the **Subject** dropdown, select a Live Link subject.

- In the Prop Offset section, make adjustments to align the mesh and the subject.

- In the **Name Override **field, enter a name for the prop.

- Click **Finalize**. This closes the **Create Prop** viewport and takes you back to the Mocap Manager panel.

- Click **Create Prop Asset** to generate the PCapProp data asset.

You can spawn this prop into the level, same as the Performer data asset, by selecting it from the picker and clicking **Spawn Prop**.

##### Dynamic Prop Attachment

By default, props are created using the **DynamicPropComponent**. This is a Blueprint-defined actor component which you can customize by overriding the **Calculate Dynamic Offset** function. You are not required to customize it, as there is already logic to govern applying a dynamic offset to a single-handed prop.

Once you have spawned the prop into your level, click the** Prop Offset** button to open the prop tuning panel.

Here you can set the **CaptureCharacters **that will handle the prop, and which bones should be tested for hand contacts.

In the gif below, you can see the final result.

> **tip:** For best results, in your motion capture software, set the pivot of your tracked prop as close to the hand-contact region of the prop as possible.

#### Live Link

In the **LiveLink** tab, you can toggle which of your incoming Live Link subject data is displayed in the preview. The icons in the list indicate the data type: skeletal mesh, camera, or markers.

You can choose to show individual subjects or all by clicking the **Show/Hide** icon.

[image: The LiveLink tab]

[image: Live Link data in the preview]

### Record

In the **Record **tab, you can prep a slate to name your take, use the Mocap Recorder to select which actors and data to capture, and begin a recording.

#### Create Slates

You can predefine your recording names using slates with name and metadata. This also provides facility for a checklist to work through during a session.

To open the Slates tab in Mocap Manager, click the **Record** tab, then **Slates**.

Slates are stored in a data table. You can import updates using `.csv` files.

Click **Prep **on your chosen slate to use this name for your text recording.

#### Create a Recording

To record mocap in Mocap Manager, follow these steps:

- Click the **Record** tab, then click **Mocap Recorder**. [image: The Mocap Recorder tab]

- Select which actors and data to capture (performers, props, Live Link, or audio).

- Click **Record** to start recording. The rest of the interface locks down while recording.

- Click **Stop** to stop recording.

Recordings are automatically logged into a Takes Data table.

### Review

In the **Review **tab, you can browse your Takes Data table, inspect the recording, assign star ratings for sorting and filtering, and export the table to `.csv` for production tracking.

To view your takes, follow these steps:

- Click the **Review** tab, then click **Take View**.

- Under **Takes Data**, double-click a take to open it.

## Create a Custom Workflow

> **note:** The following tutorial assumes a working knowledge of Editor Utilities, Blueprint Namesspaces, UMG, MVVM and reparenting.

To create a custom workflow in Mocap Manager, you first need to create a data asset. This data asset contains an array of variables that define the name of a phase, a Texture2D to use as the icon, a bool to determine if this phase should be enabled and visible in Mocap Manager, and the Editor Utility Widget to display.

Alternatively, if you want to extend Mocap Manager you can simply duplicate and add additional entries to **DA_MocapManagerDefaultWorkflow**, at the following location:

`/PerformanceCaptureWorkflow/Core/DA_MocapManagerDefaultWorkflow`

To create a custom data asset, follow these steps:

- In the **Content** **Browser**, right-click and choose **Virtual Production > PCapDataAsset**.

- In the **Pick Class** window, select the class **PCapWorfklowCustomization **and click **Select**.

This creates a new data asset of the type PCapWorkflowCustomization.

To create an Editor Utility Widget, reparent it to the **EW_PCapPanelBase **class, and update Project Settings, follow these steps:

- In the Content Browser, right-click and choose **Blueprint > Editor Utility Widget**.

- In the new window, open the **Graph Editor **and select **Class Settings**. In the **Details Panel**, click the dropdown next to **Imported Namespaces **and select **PerformanceCapture**.

- In the main menu, click **File > Reparent Blueprint**.

- Search for and select **EW_PCapPanelBase**. > **info:** Only Editor Utility Widgets parented to the EW_PCapPanelBase class can be selected in the Workflow Customization asset.

- In the main menu, click **Edit > Project Settings**. Under **Performance** **Capture**, next to **Default** **Workflows**, assign your data asset.

> **note:** If you use the same programming pattern as Mocap Manager, it is recommended you also subclass the **VM_PCapWokflow **view model class. You can do this by creating a new Editor Utility Blueprint and inherit from VM_PCapWorkflow.

> **tip:** The **EW_PCapPanelBase **has custom events from OnActive and OnDeactivate that can be overridden to ensure the widget is up-to-date when it is made visible by the main Mocap Manager panel.

## Prepare a Metahuman (Optional)

> **info:** By default, Metahuman Blueprints are not ideal for mocap retargeting and recording because they do not use a SkeletalMeshComponent as their root component.

On Fab, you can find a plugin to integrate MetaHumans with Mocap Manager with scripted action to convert a MetaHuman Blueprint actor to a CaptureCharacter Blueprint.

To manually prepare a Metahuman for the Mocap Manager, follow these steps:

- Create a Blueprint derived from **CaptureCharacter**.

- Copy the necessary skeletal mesh components and grooms from your Metahuman Blueprint into the new Blueprint.

- Disable decals on all the components.

- On all skeletal mesh components attached to the root, apart from the head, add a **Follow Leader Pose** node in the construction script to force these components to get their pose from the root component.

- In the **Performance Capture** section of your Blueprint, untick **Force All Components to Follow Leader**.

> **info:** If your character is not a Metahuman or does not use multiple meshes, you can directly use CaptureCharacter and assign a single skeletal mesh.
