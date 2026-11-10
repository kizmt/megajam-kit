# Using Profiles for Bodies and Constraints

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-profiles-for-bodies-and-constraints-in-unreal-engine?application_version=5.9

> How to use profiles for bodies and constraints in the Physics Asset Editor.

[image: Using Profiles for Bodies and Constraints]

The Physics Asset Editor (-> physics-asset-editor-interface-in-unreal-engine) enables you to create your own Profiles (-> physics-asset-editor-in-unreal-engine---tools-and-profiles) that can be used to assign Physical Animation settings to Bodies (-> physics-bodies-in-unreal-engine) and Constraint settings to Constraints (-> physics-constraint-reference-in-unreal-engine).

 [image: Profiles properties]

Use the sections below to learn how to create and assign, unassign, and delete your profiles:

## Create and Assign a Profile

To create and assign a profile, follow these steps:

- Select a **Physics Body** or **Physics Constraint** from the **Skeleton Tree**. [image: Select a Physics Body or Constraint]

- In the **Profiles** tab, click the **New** button next to the type of profile you want to create; **Physical Animation** or **Constraint**. Then under the **Current Profile** in the text box, give your profile a name to reference later. [image: Create new profile] When profiles are created, they are initialized "empty" meaning they use default settings.

- Use the **Graph** or **Skeleton Tree** to select the bodies or constraints you want to assign to a profile. [image: Bodies selected in the Graph] The Graph for the selected body. Then in the **Profiles** tab, set the **Current Profile** to the one you want to use and click **Assign**. The selected nodes will change from shaded to their fill color. [image: Assign button in Profiles panel] The color change indicates they are assigned this profile, while the other Body node (shaded) is not. [image: Profile association node color change]

- In the **Details** panel for the selected body, the assigned profile will be displayed, and you can adjust the properties for the type of profile you're creating. [image: Profile in the Details panel] A Physical Animation profile is assigned to this selected Body. For a Physical Animation profile, a solid place to start for these values is 1000, 100, 1000, 100, 0, 0 [image: Recommended default Physical Animation values]

## Unassigning a Profile

To **Unassign** a body or constraint from a profile, follow these steps:

- Select a **Physics Body** or **Physics Constraint** from the **Skeleton Tree** that you want to edit. [image: Select a Physics Body or Constraint]

- In the **Profiles** tab, set the **Current Profile** to the one you want to edit. Use the **dropdown menu** to select the assigned profile, if needed. [image: Select profile] In the **Graph**, the nodes assigned to the selected profile will have their fill color and not be shaded. [image: Nodes associated with profile]

- Select the nodes that you want to disassociate from the profile, then click the **Unassign** button in the **Profiles** tab. [image: Unassign button in the Profiles panel] After doing so, the selected nodes will show as shaded rather than show the fill color for the currently selected profile. [image: Nodes shaded no longer associated with profile]

## Deleting a Profile

To **Delete** a profile, follow these steps:

- In the **Profiles** tab, use the **dropdown menu** to select as the **Current Profile** the one you want to delete. [image: Select profile] The bottom part of the drop-down lists all created profiles.

- Click the **Delete** button to remove it from the list of available profiles. [image: Delete profile]

## Additional Resources

- physics

On this page

- Create and Assign a Profile (-> using-profiles-for-bodies-and-constraints-in-unreal-engine)
- Unassigning a Profile (-> using-profiles-for-bodies-and-constraints-in-unreal-engine)
- Deleting a Profile (-> using-profiles-for-bodies-and-constraints-in-unreal-engine)
- Additional Resources (-> using-profiles-for-bodies-and-constraints-in-unreal-engine)
