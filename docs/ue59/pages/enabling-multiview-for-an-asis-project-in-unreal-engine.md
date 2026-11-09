# Enabling Multiview for an ASIS Project

https://dev.epicgames.com/documentation/en-us/unreal-engine/enabling-multiview-for-an-asis-project-in-unreal-engine?application_version=5.9

> Learn how to enable and set up multiview in your ASIS project.

The ASIS template project includes multi-view functionality without any additional setup.

The project includes two extra cameras that are used as extra views. It also includes Blueprint calls for registering the cameras, which can be found in the Level Blueprint.

 Camera registration calls found in the Level Blueprint.

## Enable Multiview

Open the example client Android application project located in the `{Project}\Binaries\Android\` folder of your Unreal Engine project.

The location of the course code for the client app is `{Project_Name}\Binaries\Android\ExampleUseCase_{Project_Name}\.`

This application is **not **the packaged Unreal project.

You need to switch from standard ASIS to Multiview. To do this, follow these steps:

- Locate the **AndroidManifest.xml** located in the `{Project_Name}\Binaries\Android\ExampleUseCase_{Project_Name}\app\src\main\` folder.
- Open the file.
- Change **Line 22** to the game activity `ActivityForMultiview`.
- Save and close the file.

Once you’ve made this change, install the updated APK. The expected result will look like the example running below:

- automotive
- android
- hmi
- asis

On this page

- Enable Multiview (-> enabling-multiview-for-an-asis-project-in-unreal-engine)
