# Creating a New Physics Asset

https://dev.epicgames.com/documentation/en-us/unreal-engine/creating-a-new-physics-asset-in-unreal-engine?application_version=5.9

> This how-to covers the procedures for creating a new Physics Asset.

[image: Creating a New Physics Asset]

There are two ways to create a new **Physics Asset**: on import or by using the context menu in the **Content Drawer**. Below are the steps and interfaces for both methods.

## Steps

When a Skeletal Mesh is imported, there is an option to generate a Physics Asset for it as it is imported. Once the imported file is processed, a new Physics Asset will be generated using the default properties, which can be modified using the **Physics Asset Editor**.

 [image: An option to generate a Physics Asset for Skeletal Mesh as it is imported]

You can choose to use an existing Physical Asset by disabling the **Create Physics Asset** checkbox, then selecting the appropriate Physics Asset using the dropdown menu.

 [image: You can choose to use an existing Physical Asset by disabling the Create Physics Asset checkbox and select the appropriate Physics Asset using the dropdown menu]

However, you can follow these steps if you need to create a Physics Asset for a Skeletal Mesh at a later time:

- in the **Content Drawer**, find the Skeletal Mesh asset to which you wish to add a Physics Asset.

- Right-click on the **Skeletal Mesh** to open the **Context Menu**, the select **Create -> Physics Asset -> Create**. [image: Right-click on the Skeletal Mesh to open the Context Menu]

- Adjust the properties to your liking. [image: Adjust the properties to your liking]

- Click **Create Asset**.

## Result

Upon creating a **Physics Asset** you will find it in the same folder as the **Skeletal Mesh** it is based on.

- physics

On this page

- Steps (-> creating-a-new-physics-asset-in-unreal-engine)
- Result (-> creating-a-new-physics-asset-in-unreal-engine)
