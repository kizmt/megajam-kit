# Setting Up a New AR Project

https://dev.epicgames.com/documentation/en-us/unreal-engine/setting-up-a-new-ar-project-in-unreal-engine?application_version=5.9

> Learn how to set up a new AR project from a blank template.

[image: Setting Up a New AR Project]

This guide shows how to create a new empty project in Unreal Engine and add the necessary Blueprints and configurations to turn it into an AR experience.

If you want to start with an AR project that is set up already, see the following AR templates:

- Handheld AR Template for iOS and Android (-> handheld-ar-template-quickstart-in-unreal-engine)

Follow these steps to create a new Unreal Engine project and level with minimal rendering features enabled. Blank projects open with the default level, which includes a Sky Sphere and Atmosphere Fog objects. These objects will persistently overlay everything in AR, so it's useful to start with an empty level when creating an AR experience to control what will be displayed.

- Launch **Unreal Engine** from the Epic Games Launcher.
- In the **Unreal Project Browser** window, choose **Games**. [image: Choose Games in the Unreal Project Browser] Click image to expand.
- Select the **Blank Template**.[image: Select the Blank Template] Click image to expand.
- For the **Project Defaults**, choose the following:Blueprint
- Scalable
- Raytracing Disabled
- Mobile
- No Start Content[image: Choose Project Defaults] Click image to expand.

- In the main menu, select **Edit > Plugins**, and in the **Plugins** windows, search for and enable the **AR Utilities** plugin. Click **Restart Now**, and wait for Unreal Engine to restart.[image: Enable the AR Utilities plugin]
- From the Editor, choose **File > New Level…** and choose **Empty Level**. Make sure to name and save your level. In this example, the level is named **Main**. [image: Select Empty Level]
- In the main navigation, choose **Edit > Project Settings.**
- In the Project Settings window, select **Maps & Modes** under the **Project **section. Set the **Editor Startup Map** and the **Game Default Map** to the new level **Main.**[image: Project Settings Maps & Modes] Click image to expand.

## Adding a Pawn and Game Mode

In Unreal Engine, a pawn (-> pawn-in-unreal-engine) is the physical representation of the user and defines how the user interacts with the world. The Game Mode (-> game-mode-and-game-state-in-unreal-engine)
 object defines the rules of the experience, such as which pawn object
to use. In order to build a new AR project, you need to set up the pawn
so you can interact with the environment when you run your app.

Follow the steps below to create a Pawn and Game Mode for your AR project.

- Right-click in the **Content Drawer** and choose **Blueprint Class** from the list. In the **Pick Parent Class** window, select **Pawn**. Name the asset **ARPawn**.[image: Select Blueprint Class][image: Pick Actor as parent class]
- Double-click the **ARPawn** object in the **Content Drawer** to open it in the **Blueprint Editor**. In the Blueprint Editor, choose **Add Component** and search for **Camera**.[image: Add a Camera component]
- Make sure the **Camera** component's parent is **DefaultSceneRoot**.[image: Make sure DefaultSceneRoot is the Camera component's parent]
- Right-click in the **Content Drawer** and choose **Blueprint Class** from the list. In the **Pick Parent Class** window, select **Game Mode Base**. Name the asset **ARGameMode**.[image: Select Game Mode Base as the parent class]
- Double-click **ARGameMode** to edit the settings. Set **Default Pawn Class** to **ARPawn**. [image: Set Default Pawn Class to ARPawn] Click image to expand.
- In the main navigation, choose **Edit > Project Settings** to open the **Project Settings** window.
- In the **Project Settings** window under the **Project** section on the left, select **Maps & Modes**.Set **Default GameMode** to **ARGameMode.**
- Set **Default Pawn Class** to **ARPawn**.

[image: Set the Default Game Mode and the Default Pawn Class] Click image to expand.

## Creating an AR Session

The function **Start AR Session** requires an ARSessionConfig object, which defines all the AR-specific capabilities for the project. See UARSessionConfig (-> API) for more information on what each setting is.

Follow the steps below to add the AR session logic to your project.

- Right-click in the **Content Drawer**. Choose **Miscellaneous > Data Asset** to open the **Pick Data Asset Class** window.[image: Select Data Asset]
- In the **Pick Data Asset Class** window, choose **ARSessionConfig**. Name the data asset **ARSessionConfig**. Open the asset and select **Save** to confirm the default AR options.[image: Pick ARSessionConfig as the data asset instance]
- Double-click the **ARPawn** asset to open it in the **Blueprint Editor**. Add the function **Set Tracking Origin**. Set the **Origin** value to **Floor Level**.[image: Set Tracking Origin node value set to Floor Level]
- Add the function **Start AR Session**. Set **Session Config** asset to **ARSessionConfig**.[image: Start AR Session node value set to ARSessionConfig]
- Add the function **Stop AR Session**.[image: Add Stop AR Session node]

When you launch your project on your device, you will now be able to
navigate your AR environment. See the documentation for your AR platform
 for detailed steps on how to launch your Unreal project on your device.

## On Your Own

In this guide, you learned how to create a new AR project, and add the necessary Blueprints to get started building an AR app.

- template
- xr
- vr
- ar
- ar/vr/xr

On this page

- Adding a Pawn and Game Mode (-> setting-up-a-new-ar-project-in-unreal-engine)
- Creating an AR Session (-> setting-up-a-new-ar-project-in-unreal-engine)
- On Your Own (-> setting-up-a-new-ar-project-in-unreal-engine)
