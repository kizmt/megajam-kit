# LiDAR Point Cloud Plugin Quick Start Guide

https://dev.epicgames.com/documentation/en-us/unreal-engine/lidar-point-cloud-plugin-quick-start-guide-in-unreal-engine?application_version=5.9

> Guide to enabling and using the LiDAR Point Cloud plugin.

[image: LiDAR Point Cloud Plugin Quick Start Guide]

This Quick Start guide covers the following steps:

- Enabling the LiDAR Point Cloud plugin.

- Importing a point cloud and placing it into a scene.

- Building collision for the point cloud so you can explore it in real time.

- Editing the point cloud.

## 1. Enabling the Plugin

The LiDAR Point Cloud plugin is included with the Unreal Engine, but you must enable it for your Project before you can use it.

- Open the **Plugins** window (main menu: **Edit > Plugins**).

- In the **Plugins** window, search for the **LiDAR Point Cloud Support** plugin, then click the **Enabled** option. [image: LiDAR Point Cloud Support plugin]

- Save your project and restart Unreal Engine.

## 2. Importing the Point Cloud

- Create a new project. Use a template that includes a character controller, such as Third Person Template.

- Choose the point cloud file you want to import and drag it into the **Content Browser**.

- Drag the point cloud from the **Content Browser** into the **Viewport**. This will automatically create an instance of a **LidarPointCloudActor** and assign your specified cloud to it.

## 3. Building and Testing Collision

Before you can move around the imported point cloud scan like any other Level, you need to build and enable collision for it.

- In the **Main Toolbar**, click the **Modes** button, select **Lidar Mode**. Click image for full size.

- Select **Add Collision**. Click image for full size.

- Click **Save **to save your changes.

- Back in the main editor window, from the **Place Actors** panel, search for a **Player Start** component and drag it into your level. Place it above the ground.

- Click **Play** to start **Play in Editor **mode and move around the imported scan. Click image for full size.

## 4. Editing the Point Cloud

Next, you'll be making some simple edits to the point cloud. You can select and edit individual points and point groups using a range of tools.

- To edit points, you must select them first. Choose one of the available selection methods: Box Selection

- Polygonal Selection

- Lasso Selection

- Paint Selection Click image for full size.

Selected points will be highlighted. Press the **Esc** key on your keyboard to clear your selection.

Click image for full size.

- You can **Hide**, **Delete**, or **Crop** the selected points.

After you edit the point cloud, you must rebuild its collision.

## On Your Own!

Explore some of the other functionality the LiDAR Point Cloud plugin offers:

- Enable Eye-Dome Lighting (-> eye-dome-lighting-mode-for-point-clouds-in-unreal-engine) to enhance depth perception.

- See the LiDAR Point Cloud Reference (-> lidar-point-cloud-plugin-reference) for the full range of available options.

- ui
- lidar

On this page

- 1. Enabling the Plugin (-> lidar-point-cloud-plugin-quick-start-guide-in-unreal-engine)
- 2. Importing the Point Cloud (-> lidar-point-cloud-plugin-quick-start-guide-in-unreal-engine)
- 3. Building and Testing Collision (-> lidar-point-cloud-plugin-quick-start-guide-in-unreal-engine)
- 4. Editing the Point Cloud (-> lidar-point-cloud-plugin-quick-start-guide-in-unreal-engine)
- On Your Own! (-> lidar-point-cloud-plugin-quick-start-guide-in-unreal-engine)
