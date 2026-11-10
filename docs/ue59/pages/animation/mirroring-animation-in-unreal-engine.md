# Mirroring Animation

https://dev.epicgames.com/documentation/en-us/unreal-engine/mirroring-animation-in-unreal-engine?application_version=5.9

> Mirror animation in Unreal Engine using the Mirror Data Table.

[image: Mirroring Animation]

Animation mirroring copies animation from one side of a character to another so you can reuse the same animation in different situations. Using the **Mirror Data Table**, and other mirroring workflows, you can mirror not only your Animation Sequences, but also curves, sync markers, and Notifies. Additionally, mirroring within Unreal Engine provides a way to create mirrored animations without needing to manage a second copy.

This document provides an overview of how to mirror animation using the Mirror Data Table and Animation Blueprints.

#### Prerequisites

- Your project already contains a Skeletal Mesh (-> skeletal-mesh-actors-in-unreal-engine) and animations (-> animation-sequences-in-unreal-engine) to mirror.

- You have an understanding of how to create and use Animation Blueprints (-> animation-blueprints-in-unreal-engine).

## Mirror Data Table

To start mirroring animations, you must first create a **Mirror Data Table **Asset. Mirror Data Tables provide mirroring assignments and instructions for all the elements of a Skeleton you want to mirror.

To create it, click **Add (+)** in the Content Browser and select **Animation > Mirror Data Table**. A dialog window will appear where you must select the Skeleton you want to mirror. Select one and click **Accept**.

 [image: create mirror data table]

Open the Mirror Data Table to view the editor with the following primary areas:

 [image: mirror data table editor]

- **Data Table**, which contains the list of elements to mirror. This list auto-populates depending on the bone, notify, and other element names, which you can configure in the Data Table Details (-> mirroring-animation-in-unreal-engine).

- **Data Table Details** (-> mirroring-animation-in-unreal-engine), which contains configuration settings for the mirroring behavior.

- **Row Editor**, which provides settings for the selected entry where you can edit the element name, the mirrored name, and the element type.

### Adding and Editing Entries

To add a new table entry, click the **Add (+)** toolbar button and fill the four properties in the **Row Editor** panel.

- **Row Name**, which is the name of the entry.

- **Name**, which is the name of the first bone to mirror.

- **Mirrored Name**, which is the name of the second bone to mirror. Left or right bones can go in either of these properties, but these properties must contain the symmetrical bones.

- **Mirror Entry Type**, which is the element type to mirror. You can select the following types: Bone

- Animation Notify (-> animation-notifies-in-unreal-engine)

- Curve (-> animation-curves-in-unreal-engine)

- Sync Marker (-> animation-notifies-in-unreal-engine)

- Custom, which provides a code foundation for extending the Mirror Data Table in C++ by adding additional types.

 [image: add mirror entry]

In order to have a fully mirrored character, it is necessary that the table contains most skinned bones, including central bones like **pelvis**, **spine**, **neck**, and **head**. This is so that the mirroring operation can appropriately flip the rotations of those bones along the mirror axis. For these entries, both the **Name **and **Mirrored Name** should match.

 [image: mirror central bones]

### Data Table Details

The Data Table Details panel contains configurations and other settings for the mirror behavior:

 [image: data table details]

| Name | Descriptions |
| --- | --- |
| **Mirror Find Replace Expressions** | An array of expressions that are used to automatically populate the table with common mirror entries. Refer to the Find and Replace Expressions (-> mirroring-animation-in-unreal-engine) section for more information. |
| **Mirror Axis** | The axis of mirroring, which is across the front of the character. In most cases this should be **X**. [image: mirror axis] |
| **Skeleton** | The Skeleton Asset to use for the mirror operation. |
| **Row Struct** | The structure to use for each row of the table. You must inherit from `FTableRowBase` if you want to extend this. |
| **Strip from Client Builds** | Enabling this will not cook this Data Table into client builds. Useful if you are making confidential tables that only servers should know about. |

### Find and Replace Expressions

**Find **and **Replace Expressions** are array entries you can add to the Data Table Details that automatically search and replace certain string text of elements in the skeleton. These expressions are then used to inform which elements are automatically populated when creating or reimporting the skeleton.

 [image: find and replace expression properties]

Each array requires the following expressions:

| Name | Description |
| --- | --- |
| **Find Expression** | The text to search for. In most cases this will likely be the symmetry modifiers for your element names, such as `_l`, `left_`, or `_left_`. |
| **Replace Expression** | The text to replace. In most cases this will likely be the symmetry modifiers for your element names, such as `_r`, `right_,` or `_right_`. |
| **Find Replace Method** | The search method to use when replacing text. You can select from the following options: **Prefix**, which will search for text only at the beginning of the name. **Suffix**, which will search for text only at the end of the name. **Regular Expression**, where you can write a custom expression for finding and replacing names. |

When using **Regular Expression** as your method, you can write custom Regular Expressions for **Find Expression** and **Replace Expression**.

For example, **Index 12** of the default array contains the following expression, searching for common central bone names and assigning to the **Name **and **Mirrored Name** properties:

- Find Expression: `((?:^[sS]pine|^[rR]oot|^[pP]elvis|^[nN]eck|^[hH]ead|^ik_hand_gun).*)`

- Replace Expression: `$1`

In cases where your symmetry text modifiers are in the middle of an element name, such as `finger_left_index1`, you can write the following expression to correctly search and replace:

- Find Expression: `(\S*)_left_(\S*)`

- Replace Expression: `$1_right_$2`

The array comes pre-populated with common expressions, such as searching and replacing several permutations of symmetry modifiers as pre or postfixes. You can change this default array from the Project Settings (-> project-settings-in-unreal-engine). In the main Unreal Engine menu bar, select **Edit > Project Settings**, then navigate to the **Engine > Animation **section and locate the **Mirroring **property section.

 [image: expression project settings]

## Mirroring Animation

Once you have created and populated your Mirror Data Table, you can now mirror your animations in Animation Blueprints (-> animation-blueprints-in-unreal-engine). This is done using the **Mirror **AnimGraph node.

To create it, right-click in the AnimGraph and select your table from the **Mirroring **category.

 [image: mirror animation blueprint]

You can preview the mirroring effect by providing an input pose and bool variable, enabling or disabling the mirroring.

 [image: enable or disable mirroring]

The Mirror node contains the following properties:

 [image: mirror properties]

| Name | Description |
| --- | --- |
| **Mirror** | Enables or disables the mirror effect. This is exposed as a pin by default. |
| **Mirror Data Table** | The Mirror Data Table (-> mirroring-animation-in-unreal-engine) to use for mirroring. |
| **Blend Time on Mirror State Change** | The length of time to blend between mirror states when **Mirror** is enabled or disabled. Using this also requires you to use an Intertialization (-> animation-blueprint-blend-nodes-in-unreal-engine) node after the Mirror node. [image: blend time on mirror state change] |
| **Reset Child on Mirror State Change** | Enabling this will reinitialize the source pose when the mirror state changes. |
| **Bone** | Whether or not to include bone data in the mirroring. |
| **Curve** | Whether or not to include curve data in the mirroring. |
| **Attributes** | Whether or not to include notify and sync marker data in the mirroring. |

### Detecting Mirrored Animation in Blueprint Notifies

If you are using Custom Notify States (-> animation-notifies-in-unreal-engine), then you may want to change it to have a different behavior based on the mirrored state. You can differentiate between mirrored states in the Notify Blueprint using the **Is Triggered By Mirrored Animation** node.

In this example, it is being used in the **Received Notify Function** to branch the logic, checking if the notify was received from a mirrored animation or not.

 [image: is triggered by mirrored animation]

- animation

On this page

- Prerequisites (-> mirroring-animation-in-unreal-engine)
- Mirror Data Table (-> mirroring-animation-in-unreal-engine)
- Adding and Editing Entries (-> mirroring-animation-in-unreal-engine)
- Data Table Details (-> mirroring-animation-in-unreal-engine)
- Find and Replace Expressions (-> mirroring-animation-in-unreal-engine)
- Mirroring Animation (-> mirroring-animation-in-unreal-engine)
- Detecting Mirrored Animation in Blueprint Notifies (-> mirroring-animation-in-unreal-engine)
