# Creating a Physical Animation Profile

https://dev.epicgames.com/documentation/en-us/unreal-engine/creating-a-physical-animation-profile-in-unreal-engine?application_version=5.9

> This tutorial will show you how to create a Physical Animation Profile using the Physics Asset Editor.

[image: Creating a Physical Animation Profile]

In this How-To, we will cover the basics of creating a **Physical Animation Profile** and adding **Physics Bodies** to it.

## Steps

- Find or Create (-> creating-a-new-physics-asset-in-unreal-engine) a **Physics Asset** for your **Skeletal Mesh** using the **Content Drawer**. [image: Physics Asset in the Content Browser] If opting to create a new **Physics Asset**, you will need to set it up before continuing.

- Double-click the Physics Asset to open the **Physics Asset Editor**. [image: The Physics Asset Editor main user interface]

- Under the **Windows** menu, select **Profiles**; the **Profiles** window should appear as a docked tab. [image: Windows menu with Profiles highlighted]

- Add a **Profile** using the **New** button on the **Physical Animation Profiles** entry, and set its name (in the image below we've named it `DocsProfile`). [image: Adding and naming a new Physical Animation Profile]

- Select the **Physics Body** you want to include in your new **Physical Animation Profile** in the **Skeleton Tree** panel, the **Physics Graph** panel, or the **Viewport**. To see Constraints in the Skeleton Tree panel, select **Show Constraints** in the **Options** dropdown menu.

- Press the **Assign** button in the **Profiles** panel. [image: Assigning Constraints to a Profile] 1 - Assign a button 2 - Physics Bodies selected in the Skeleton Tree panel 3 - Physics Bodies selected in the Physics Graph panel 4 - Physics Bodies selected in the Viewport

- Adjust the properties for the selected **Physics Bodies**. [image: Physical animation properties in the details panel] A good set of starting values is 1000, 100, 1000, 100, 0, 0 [image: Physical animation recommended default values]

- Repeat steps 5-7 for all the **Physics Bodies** you want to add to the **Physics Animation Profile**. You can select, assign, and edit the Properties of multiple Physics Bodies simultaneously. You only need to edit them individually if you want their properties to be different.

- Save your **Physics Asset** using the **Save** button in the **Physics Asset Editor**. [image: Save your Physics Asset using the Save button in the Physics Asset Editor]

You can edit an existing Physics Animation Profile by selecting it in the dropdown menu, then using **Assign** to add new Physics Bodies, or using **Unassign** to remove existing Physics Bodies.

## Result

The **Physics Asset** will have a profile that can be called upon from Blueprint or C++ to change the **Physical Animation** properties of its **Physics Bodies**.

## Additional Resources

- physics

On this page

- Steps (-> creating-a-physical-animation-profile-in-unreal-engine)
- Result (-> creating-a-physical-animation-profile-in-unreal-engine)
- Additional Resources (-> creating-a-physical-animation-profile-in-unreal-engine)
