# Debugging Android Projects

https://dev.epicgames.com/documentation/en-us/unreal-engine/debugging-unreal-engine-projects-for-android-using-android-studio?application_version=5.9

> How to debug your Android project in Android Studio

[image: Debugging Android Projects]

You can use Android Studio to debug the C++ and Java code used in your Unreal Engine (UE) projects. This tutorial will guide you on how to set up Android Studio for this process.

## Reduce Iteration Times

To reduce the build time for Android projects during iteration, you can set your project to avoid bundling `libUnreal.so` in your `.apk` and instead push it to an internal file directory on your device. This skips gradle and avoids reinstalling the `.apk` with every change. To implement this, open your project's `*Engine.ini` and add the following lines to it:

*Engine.ini

 C++

```
[[/Script/AndroidRuntimeSettings.AndroidRuntimeSettings]
	bDontBundleLibrariesInAPK=True
```

[[/Script/AndroidRuntimeSettings.AndroidRuntimeSettings]
 bDontBundleLibrariesInAPK=True

If you are using Unreal Build Tool directly, you can also pass `-ForceDontBundleLibrariesInAPK=true` to enable this setting.

After you opt in to this setting, it should be enabled for both AGDE and Quick Launch for non-shipping builds. Shipping builds still bundle `libUnreal.so` in your `.apk`.

## Set Up Android Studio

To set up Android Studio to debug a UE project, follow these steps:

- If you have not already done so, download and install the version of Android Studio that is compatible with your current build of Unreal Engine. Refer to the Development Requirements page for information on which version to use, and the Android SDK and NDK Setup guide for information about how to set up your environment.
- Build the `APK` that you want to debug and then deploy it to your Android device you will be using for debugging.[image: Package Project via Unreal Engine] Package Project via Unreal Engine Click image for full size.
- Open the Android Studio Launcher and from the displayed options, then select the **Open an existing Android Studio Project**.[image: Open an existing Android Studio Project] Open an existing Android Studio Project Click image for full size.
- From the **Open File or Project** menu, navigate to **C:\YourProjectName\Intermediate\Android\APK\Gradle** and select the **Gradle** directory, then press the **OK** button.[image: Navigate to Grandle directory]
- Once Android Studio is open, go to the **Run Menu** and select the **Edit Configurations** option.[image: Select the Edit Configurations option] Select the Edit Configurations option Click image for full size.
- Click on the **Debugger** tab and set the debug type to **Dual**.[image: Set Debug Type] Set Debug Type Click image for full size.
- Next, go to the **LLDB Startup Command** tab, press **plus** icon (+) and then input the following line, pressing the **OK** button to complete the process. C++ ```
command script import "C:\PathToYourUE4EngineInstall\Engine\Extras/LLDBDataFormatters\UE4DataFormatters_2ByteChars.py"
``` command script import "C:\PathToYourUE4EngineInstall\Engine\Extras/LLDBDataFormatters\UE4DataFormatters_2ByteChars.py"Note that TEXT("string") should be used instead of L("string") in your C++ code.[image: Add input to the LLDB Startup Command tab] Add input to the LLDB Startup Command tab Click image for full size.Make sure to press the **Enter** key or the command will not take.
- Now, open up any of your project's `.cpp` files and add breakpoints to items you want to debug.[image: Open CPP file and add breakpoints] Open CPP file and add breakpoints Click image for full size.
- From the main menu, select **Run** > **Debug 'app-app'**.

[image: Select Debug 'app-app'] Select Debug 'app-app'

Click image for full size.

- When the **Select Deployment Type** windows is displayed, select your device from the list and press the **OK** button.

[image: Select your device from the list] Select your device from the list

Click image for full size.

## End Result

Once you have completed the above steps, wait for the debugger to attach to your Android Device.

[image: Wait for the debugger to attach to your Android Device] Wait for the debugger to attach to your Android Device

Click image for full size.

Depending on the size of your project, it could take some time for the debugger to attach. This also **does not** install the data on the device if you don't use the **Package data inside APK** option. Doing so will make the redeploying for debugging slower since the APK will be larger. Another option is to first do a **Launch **on in the editor before using Android Studio for debugging to install the current level on the device. Alternatively, you can package and install the OBB on the device if you need more than the current level data.

- development
- debugging
- programming
- android
- platform delivery

On this page

- Reduce Iteration Times (-> debugging-unreal-engine-projects-for-android-using-android-studio)
- Set Up Android Studio (-> debugging-unreal-engine-projects-for-android-using-android-studio)
- End Result (-> debugging-unreal-engine-projects-for-android-using-android-studio)
