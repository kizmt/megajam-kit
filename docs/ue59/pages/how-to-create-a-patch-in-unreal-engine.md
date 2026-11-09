# How To Create a Patch (Platform-Agnostic)

https://dev.epicgames.com/documentation/en-us/unreal-engine/how-to-create-a-patch-in-unreal-engine?application_version=5.9

> This page describes how to create a patch for an existing project.

[image: How To Create a Patch (Platform-Agnostic)]

 [image: Banner Image]

During patching, the **Unreal Engine** (UE) compares all the content post-cook to the originally released cooked content, and uses that to determine what is included in a patch. The smallest piece of content is a single package (like a `.ulevel` or `.uasset`), so if anything changes in a package then the entire package will be included in the patch. The method you use to get the patch's **PAK** (`.pak`) file to the users will depend on your distribution platforms, but this procedure will allow you to create a much smaller PAK file that just contains the updated content.

You can patch a project you have previously released using a versioned release. Some things to keep in mind are:

- Lock down the serialization code paths at the time of release.

- Keep the released cooked content, as the **UnrealPak** tool uses this to determine which content should be in the patch package file.

- At runtime, mount both PAK files, with a higher priority for the patch file so any content within it is loaded first.

There are several methods for patching projects created in Unreal Engine. The method used here is **platform-agnostic**, meaning it technically can be used for any platform. However, the only two platforms that you would intentionally use this method with are **Windows** and **Xbox** One. Other platforms have specific patching methods. You can find documentation on these platform-specific methods in the section for the platform you are planning to develop for.

This method can eventually use a lot of data storage, because this method keeps all old files, and merely points the game to the newest files that exist. Platform-specific methods often use less space.

## How to Create a Patch Using the Project Launcher

This example provides information about creating a patch for the UE project.

### Create a Launch Profile for Testing the Patch

If you have base build of your project, you can create a **Launch Profile** for the patch in the **Project Launcher**. You might want to create one Launch Profile for creating a test version of your patch, and another Launch Profile for your actual patch release.

- Open the **Project Launcher**, by clicking **Platforms > Project Launcher**. [image: Open the Project Launcher]

- Create a new **Custom Launch Profile** using the **+Add** button. This first Launch Profile is specifically for a test version of your patch. Type in a **Name** and **Description** that makes that clear. [image: Add a new Custom Launch Profile]

- There are a number of settings in the Project Launcher that you can customize for a Launch Profile. You can further customize each setting by clicking the **Show Advanced** and set **Advance Settings** using dropdown menus. You can also click the top dropdown in the **Cook**, **Package** or **Deploy** sections, and your selection can change the available options. [image: Show Advanced options in the Project Launcher] | Launch Profile Section Name | Description of Advanced Settings |
| --- | --- |
| **Project** | You can browse to the specific project to use, or use **Any Project** to patch the current project. |
| **Build** | Options are **DebugGame**, **Development** and **Shipping**. Click the **Advanced Settings** dropdown to build the Unreal Automation Tool (UAT) as part of the patch process. |
| **Cook** | Click the dropdown to select **Cook by the Book** or **Cook on the Fly**. You can also select **Do Not Cook**. You can click the **Advanced Settings** dropdown to select **Only Cook Modified Content**. Additional options display for **Advanced Settings**, and for **Release/DLC/Patching**, when you select **Cook by the Book**. |
| **Package** | Options are **Package and Store Locally**, **Package and Store in Repository**, or **Do Not Package**. |
| **Archive** | If you want to archive the build, check the box in this section. |
| **Deploy** | Options are **Copy to Device**, **Copy Repository**, **File Server**, or **Do Not Deploy**. |
| **Launch** | Options are **Using Default Role**, **Using Custom Roles**, and **Do Not Launch**. |

### Customize the Launch Profile

Follow these steps to customize your new Launch Profile.

- In the **Project** section, click the dropdown to browse to your project. [image: Set Project section]

- In the **Build** section, click the dropdown and select **Shipping**. Optionally, expand **Advanced Settings** if you need to build **Unreal Automation Tool (UAT)** as part of the patch process because you are creating the patch on a build machine. [image: Set Build section]

- In the **Cook** section, click the dropdown and select **By the Book**. This gives you options for **Cooked Platforms**, **Cooked Cultures**, and **Cooked Maps**. Check the Cook settings for your project. [image: Set Cook section] The Cook settings determine which content in your project is cooked for this patch, and that content is then compared to the original package file.

- Click the arrow to expand **Release/DLC/Patching Settings**. [image: Open Release/DLC/Patching Settings]

- Under **Release Version This is Based On**, type the release version. Then check the box for **Generate Patch**. [image: Set Release/DLC/Patching Settings]

- Click the arrow to expand **Advanced Settings**. Make sure the following boxes are checked, as well as any others you need for your specific project's distribution method. **Compress Content**

- **Save Packages Without Versions**

- **Store All Content in a Single File (UnrealPak)**

 [image: Set Advanced settings in the Cook section]

- Also in **Advanced Settings**, click the dropdown for **Cooker Build Configuration** and select **Shipping**. [image: Set Build Configuration]

- In the **Package** section, click the dropdown and select **Package and Store Locally**. The local directory is entered by default; if you want to change it, click **Browse** and select the directory where you want to store the package. [image: Set Package section]

- In the **Deploy** section, click the dropdown and select **Do Not Deploy**. [image: Set Deploy section] Select **Do Not Deploy** to test the patch. When you have tested your patch and are ready to build a shipping version, follow the steps in this section and just choose a different Deploy method.

### Launch the Test Version of the Patch

- Navigate back to the main profile window using the **Back** button in the top right corner. [image: Navigate to the Main Project Launcher window]

- Click on the launch icon next to your **Patching** profile. [image: Launch Patching process]

- The project launcher will go through the building, cooking, and packaging process. This may take some time depending on the complexity of your project. [image: Patching process in progress]

- Once the operation is complete, close the window or click on **Done**. [image: Patching process done]

### Create and Customize a Launch Profile for Shipping the Patch

- Create a new Custom Launch Profile using the **Plus** (**+**) button. This profile is for shipping your patch, so type a **Name** and **Description** to make that clear.

- Follow steps 1-11 in the Customize the Launch Profile (-> how-to-create-a-patch-in-unreal-engine) section. If needed, change the custom settings if your test version was significantly different from what you want to ship.

- In the **Deploy** section, click the dropdown and select the deployment option you want to use.

- When you've finished making the Shipping Launch Profile, follow the steps in the Launch the Test Version of the Patch (-> how-to-create-a-patch-in-unreal-engine) section.

## How to Create a Patch Using the Command Line

The Project Launcher is not the only option for creating a platform-agnostic patch for your project. You can also create a patch using command-line instructions with UAT.

First you need to create a base build. This is probably your shipping build. You need to use the command line parameter `-Createreleaseversion=<releasenumber>` when creating this build. This will create version 1.0 of your project.

Example:

```
	BuildCookRun <normalbuildcookrunarguments> -build -cook -stage -pak -createreleaseversion=1.0
```

BuildCookRun <normalbuildcookrunarguments> -build -cook -stage -pak -createreleaseversion=1.0

This will save a build in the `<ProjectPath>\Releases\1.0\` directory which will be required when generating the patch.

Once you have a numbered base build, you can create a patch that is based on that previous build. You need to use the command line parameter `-basedonreleaseversion=<releasenumber>` when creating this patch.

Example:

```
	BuildCookRun <normalbuildcookrunarguments> -build -cook -stage -pak -generatepatch -basedonreleaseversion=1.0
```

BuildCookRun <normalbuildcookrunarguments> -build -cook -stage -pak -generatepatch -basedonreleaseversion=1.0

## Installing a Patch

The platform-agnostic patching process creates a PAK file in following directory: `[ProjectName]\Saved\StagedBuilds[PlatformName][ProjectName]\Content\Paks`. Depending on the platform your project is created for, the PAK file contains the new or changed content that should be distributed to users. For example, on Windows, you would create an installer to copy that PAK file into the user's `[ProjectName]\Releases[VersionNumber][PlatformName]` folder, next to the original content PAK file.

The patch PAK file will automatically be mounted when it is located on the device in any of the PAK search directories set in `FPakPlatformFile::GetPakFolders`. To prioritize patches, the mounting system uses a `_p` at the end of the filename to determine that it gets priority over other PAK files. It can be renamed, but you need to include the `_p.pak` at the end of the file name.

If you build two patches from the same release version, they are both complete patches, so you should remove the first patch while installing the second patch.

- patching
- distribution
- platform delivery

On this page

- How to Create a Patch Using the Project Launcher (-> how-to-create-a-patch-in-unreal-engine)
- Create a Launch Profile for Testing the Patch (-> how-to-create-a-patch-in-unreal-engine)
- Customize the Launch Profile (-> how-to-create-a-patch-in-unreal-engine)
- Launch the Test Version of the Patch (-> how-to-create-a-patch-in-unreal-engine)
- Create and Customize a Launch Profile for Shipping the Patch (-> how-to-create-a-patch-in-unreal-engine)
- How to Create a Patch Using the Command Line (-> how-to-create-a-patch-in-unreal-engine)
- Installing a Patch (-> how-to-create-a-patch-in-unreal-engine)
