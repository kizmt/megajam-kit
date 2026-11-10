# Paper 2D Import Options

https://dev.epicgames.com/documentation/en-us/unreal-engine/import-sprites-in-unreal-engine?application_version=5.9

> Importing assets from third party applications for use with Paper 2D.

[image: Paper 2D Import Options]

Paper 2D in Unreal Engine supports a number of different import options for your externally created content. Below are some examples of importing assets from some of the more commonly used content creation applications.

## Importing from Texture Packer

If you are using the third party sprite sheet generation tool **Texture Packer** for content creation, it has a plug-in built into it which will allow you to easily import your content into Unreal Engine by creating a **.paper2dsprites** file. This file when imported into UE will automatically import your sprite sheet as a texture, extract and create sprites from it as well as create a **Sprite Asset** which can be used to auto-generate **Flipbooks** out of your sprites.

**Example Workflow**

- Inside **Texture Packer**, select the **UnrealEngine - Paper2d** framework option.

- Add your assets that will be included in the sprite sheet.

- Under **Layout** set **Size Constraints** to **POT (Power of 2)**.

- Under **Sprites**, show advanced and set **Border** and **Shape Padding** to **0**. This will eliminate the spaces between your sprites, making it easier to tile them together or create **Flipbook** animations.

- Click the **Publish** sprite option (this will create a **.paper2dsprites** file along with a **.png** sprite sheet)

- Drag the **.paper2dsprites** file into the **Content Browser** of your project to import it. The .png file is already included with the .paper2dsprites file so there is no need to import that as well.

- This will create a **Sprite Sheet** asset and two folders **Frames** (extracted sprites) and **Textures** (your sprite sheet).

From here you can **Right-click** on...

- Your **Sprite Sheet** asset to automatically generate **Flipbooks** based on your sprites.

- Your imported texture to adjust its settings, configure it for retro sprites or create a **Tile Set** based on it.

- Your individual frames to manually add them to a **Flipbook**.

## Importing from Tiled / Adobe Flash CS6

If you are building your content in external content generation tools such as **Tiled** or **Adobe Flash CS6**, you can import your work into Unreal Engine in the **.json** file format. This will automatically import the sprite sheet(s) used to create your map and create **Tile Sets** and a **Tile Map** based off those assets for you.

**Example Workflow for Tiled**

- Inside **Tiled**, choose the File/Save As option, then Save as type **.json**. Click for full view.

- Drag-and-drop the **.json** asset into the **Content Browser** of your project.

- This will import your sprite sheet textures, create **Tile Sets** and a **Tile Map** from those textures. Opening the **Tile Map** created, you will see the map constructed externally which can be modified inside Unreal Engine.

On this page

- Importing from Texture Packer (-> import-sprites-in-unreal-engine)
- Importing from Tiled / Adobe Flash CS6 (-> import-sprites-in-unreal-engine)
