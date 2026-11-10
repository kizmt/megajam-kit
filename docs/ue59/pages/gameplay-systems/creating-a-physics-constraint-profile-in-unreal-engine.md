# Creating a Physics Constraint Profile

https://dev.epicgames.com/documentation/en-us/unreal-engine/creating-a-physics-constraint-profile-in-unreal-engine?application_version=5.9

> This how-to will show you how to create a Physics Constraint Profile using the Physics Asset Editor.

[image: Creating a Physics Constraint Profile]

In this How-To, we will cover the basics of creating a **Constraint Profile** and adding **Physics Constraints** to it.

## Steps

- Find or Create (-> creating-a-new-physics-asset-in-unreal-engine) a **Physics Asset** for your **Skeletal Mesh** using the **Content Drawer**. [image: Physics Asset in the Content Drawer] If opting to create a new **Physics Asset**, you will need to set it up before continuing.

- Double-click the Physics Asset to open the **Physics Asset Editor**. [image: The Physics Asset Editor main user interface]

- Under the **Windows** menu, select **Profiles**; the **Profiles** window should appear as a docked tab. [image: Windows menu with Profiles highlighted]

- Add a **Profile** using the **New** button on the **Constraints Profiles** section, and set its name (in the image below we've named it `DocsConstraintProfile`). [image: Adding and naming a new Constraints Profile]

- Select the **Physics Constraint** you want to include in your new **Constraint Profile** in the **Skeleton Tree** panel, the **Physics Graph** panel, or the **Viewport**. To see Constraints in the Skeleton Tree panel, select **Show Constraints** in the **Options** dropdown menu.

- Press the **Assign** button in the **Profiles** panel. [image: Assigning Constraints to a Profile] 1 - Assign a button 2 - Constraints selected in the Skeleton Tree panel 3 - Constraints selected in the Physics Graph panel 4 - Constraints selected in the Viewport

- Adjust the properties for the selected **Physics Constraints**. [image: Adjusting Physical Constraint Properties]

- Repeat steps 5-7 for all the **Physics Constraints** you want to add to the **Constraint Profile**. You can select, assign, and edit the Properties of multiple Constraints simultaneously. You only need to edit them individually if you want their Properties to be different.

- Save your **Physics Asset** using the **Save** button in the **Physics Asset Editor**. [image: Save your Physics Asset using the Save button in the Physics Asset Editor]

You can edit an existing Constraints Profile by selecting it in the dropdown menu, then using **Assign** to add new Constraints, or using **Unassign** to remove existing Constraints.

## Result

The **Physics Asset** now has a profile that can be called upon from Blueprint or C++ to change its **Physical Constraint** properties.

## Additional Resources

- physics

On this page

- Steps (-> creating-a-physics-constraint-profile-in-unreal-engine)
- Result (-> creating-a-physics-constraint-profile-in-unreal-engine)
- Additional Resources (-> creating-a-physics-constraint-profile-in-unreal-engine)
