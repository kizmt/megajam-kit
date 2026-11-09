# Creating a Mobile Project

https://dev.epicgames.com/documentation/en-us/unreal-engine/setting-up-an-unreal-engine-project-for-mobile-platforms?application_version=5.9

> Configure a new project for mobile devices.

[image: Creating a Mobile Project]

This guide provides details about how to set up a new **Unreal Engine **game project for Mobile platforms. While Mobile devices have a wide range of specifications and some may support more robust rendering features, the settings detailed here will work with the broadest range of new projects.

## 1. Project Setup

[image: The settings for a new Mobile project]

- Open **Unreal Editor**. When the **Unreal Project Browser** appears, click **Games**.
- Configure your project as follows:**Project Template: **Choose the template best suited to your project
- **Target Platform: **Mobile
- **Quality Preset: **Scalable
- **Project Name: **Choose a project name

You can create a project that uses either Blueprint or C++.

- Click Create to create the project and open it in Unreal Editor.

## 2. Overview of Project Defaults

This section provides details on the project defaults from the previous section and why these are recommended for new Mobile projects.

### Project Template

All game templates are equipped with minimal mobile user interfaces. Select the project template that best suits your gameplay requirements.

### C++ Project vs. Blueprint-Only

Blueprint-only projects can publish to iOS and Android, but there are many features for configuring these platforms that are only available in C++.

- iOS and Android projects benefit from additional debugging options and tools when using a C++ project.
- You can build and test iOS projects on an iOS device with Blueprint-only projects, even from a Windows machine. However, iOS applications require Xcode to sign and provision a project for shipping on the App Store, so you will need a Mac with Xcode to ship your game eventually.

Refer to Coding in UE: Blueprint vs. C++ (-> coding-in-unreal-engine-blueprint-vs-cplusplus) to learn more about choosing which preset is right for you.

### Target Platform: Mobile

Selecting **Mobile** as your target hardware will disable several features that are either not supported by Mobile devices at all, not commonly supported, or that are too resource-intensive for the lower-end Mobile devices that Unreal Engine supports.

- **Engine – Rendering**Bloom is disabled.
- Separate Translucency is disabled.
- Motion Blur is disabled.
- Ambient Occlusion is disabled.
- Anti-Aliasing Method is set to None.

- **Project – Maps and Modes**Use Splitscreen is disabled.

- **Slate**Explicit Canvas Child ZOrder is enabled.

### Quality Preset: Scalable

The **Scalable** setting provides a minimal rendering feature set that disables several post-processes and favors performance over fidelity.

- **Engine – Rendering**Motion Blur is disabled.
- Auto Exposure is disabled.
- Anti-Aliasing Method is set to None.

You can change the target Platform and Quality Preset in **Project Settings** > **Target Hardware**.

You can also change individual settings as necessary for your project, or you can override them on a per-device basis in your Device Profiles (-> setting-up-device-profiles-in-unreal-engine).

## 3. Setting Up Your Project for Android

For full details on setting up your project for Android, refer to the Android Quick Start Guide (-> android-quick-start). The following is a summary of the required steps:

### Install the Android toolchain with Turnkey

Unreal Engine includes **Turnkey**, an automation tool that installs everything required to build for Android — the Android command-line tools, Android Studio, and the SDK / NDK / JDK versions verified against your engine release — without manual configuration.

- Open **Unreal Editor**.
- Click **Platforms > SDK Management > Android > Install SDK**.
- Installing Sdk for Android… will show in a toast.
- Follow the on-screen prompts. Turnkey will:Install Android Studio (if not already present).
- Download the Android command-line tools.
- Install the SDK, NDK, and JDK versions required by your engine release.
- Set the `ANDROID_HOME`, `JAVA_HOME`, and related environment variables.

This process is explained in depth in the Simplified Android SDK, NDK, and JDK Setup Using Turnkey (-> set-up-android-sdk-ndk-and-android-studio-using-turnkey-for-unreal-engine) page.

If you need to manage your Android toolchain manually — for example, to pin a specific Android Studio version or set up a headless build agent — see Advanced Android SDK, NDK, and JDK Setup Using Android Studio (-> advanced-setup-and-troubleshooting-guide-for-using-android-sdk) instead.

### Configure the Project

After Turnkey has finished installing the toolchain, configure the project itself:

- Open your project in Unreal Editor.
- Open **Project Settings > Platforms > Android**, locate the prompt for configuring your project for the Android platform, then click **Configure Now**. This adds the `Build/Android` folder to your project.
- If you have not accepted the Android SDK license, click **Accept SDK License** in your Project Settings.
- If you need to support the Google Play Store, scroll down to the **Google Play Services** section, locate the prompt for configuring for Google Play, then click **Configure Now**.
- Add an **Android Package Name** with a reverse-domain style string in the format `com.(OrganizationName).(ProjectName)`. For this example project, the package name is `com.YourCompany.MobileTestGame`.

## 4. Setting Up Your Project for iOS

For full details, refer to the iOS Quick Start Guide (-> setting-up-an-unreal-engine-project-for-ios). The following is a summary of the required steps.

To build a project for iOS, you need an Apple ID and a Mac with Xcode installed. A paid **Apple Developer Program** membership is only required for App Store distribution; a free Apple ID is sufficient for development and on-device testing.

### Set up within Xcode

Before configuring your project in Unreal, install Xcode and sign it into your Apple Developer account so your credentials are available to both Xcode and Unreal for signing.

- **Install Xcode** – Download Xcode from the Mac App Store, or from the Apple Developer Downloads page if you need a specific version. After installation, open Xcode once and accept the license agreement so the command-line tools are installed.
- **Sign into your Apple Developer account** – In Xcode, open **Settings > Accounts** and add your Apple ID. Select your team in the account details. This makes your developer credentials available system-wide so Unreal can use them for signing.
- **Connect your iOS device** – Attach your device to your Mac with a USB cable and trust the computer when prompted on the device. Your team will register the device automatically the first time you build to it.

### Configure the Project

After Xcode is set up, configure the project itself:

- Open your project in Unreal Editor.
- In **Project Settings > Platforms > iOS**, set the **Bundle Identifier** to a reverse-domain string in the format `com.(OrganizationName).(ProjectName)`. For this example project, the bundle identifier is `com.YourCompany.MobileTestGame`.
- In Project **Settings > Platforms > Xcode Projects**, check **Use Automatic Code Signing**. Unreal will use the developer credentials from your signed-in Xcode account to generate and refresh the signing certificate and provisioning profile for you — no manual certificate or provisioning profile creation is required.

If you need to manage iOS code signing manually — for example, to share a distribution certificate across a team, set up a CI/CD build agent, or prepare an App Store distribution build — see Provisioning Profiles and Signing Certificates (-> setting-up-ios-tvos-and-ipados-provisioning-profiles-and-signing-certificates-for-unreal-engine-projects) instead.

## 5. Testing Your Project On-Device

The fastest way to test your project on a device is Quick Launch, which cooks, packages, and deploys your project in one step.

- Connect your device:**Android **– Connect with a USB cable, or pair over Wi-Fi (USB connection is recommended for the first deployment). **Confirm Developer Mode** and **USB Debugging** are enabled, and accept the **Allow USB debugging?** prompt that appears on the device. See Setting up Your Android Device for Development for more information.
- **iOS **– Connect the device to your Mac with a USB cable. The first time you deploy, accept the **Trust This Computer** prompt on the device. See Setting Up Your iOS/iPadOS/tvOS Device For Development for more information.

- Open the **Platforms** dropdown in the editor toolbar. Your device should appear in the **Quick Launch Current Level** section.
- Click the device's name. Unreal Engine will cook, package, and deploy the project to that device.

If your device does not appear:

- Confirm the USB cable supports data transfer (not charge-only).
- **Android**: Run `adb devices` to confirm the device is visible and authorized.
- **iOS**: Open Xcode's **Window > Devices and Simulators** to confirm the device is trusted and registered.
- Check the editor **Output Log** (**Window > Output Log**) for deployment errors.

Quick Launch builds are unoptimized and intended for iteration. For performance testing or release validation, build a packaged shipping build instead.

## 6. Final Result

After following the steps in this guide, your Mobile project is now ready to build, deploy, and test on both Android and iOS.

- mobile
- ios
- android
- platform
- tvos
- ipados
- project setup
- platform delivery

On this page

- 1. Project Setup (-> setting-up-an-unreal-engine-project-for-mobile-platforms)
- 2. Overview of Project Defaults (-> setting-up-an-unreal-engine-project-for-mobile-platforms)
- Project Template (-> setting-up-an-unreal-engine-project-for-mobile-platforms)
- C++ Project vs. Blueprint-Only (-> setting-up-an-unreal-engine-project-for-mobile-platforms)
- Target Platform: Mobile (-> setting-up-an-unreal-engine-project-for-mobile-platforms)
- Quality Preset: Scalable (-> setting-up-an-unreal-engine-project-for-mobile-platforms)
- 3. Setting Up Your Project for Android (-> setting-up-an-unreal-engine-project-for-mobile-platforms)
- Install the Android toolchain with Turnkey (-> setting-up-an-unreal-engine-project-for-mobile-platforms)
- Configure the Project (-> setting-up-an-unreal-engine-project-for-mobile-platforms)
- 4. Setting Up Your Project for iOS (-> setting-up-an-unreal-engine-project-for-mobile-platforms)
- Set up within Xcode (-> setting-up-an-unreal-engine-project-for-mobile-platforms)
- Configure the Project (-> setting-up-an-unreal-engine-project-for-mobile-platforms)
- 5. Testing Your Project On-Device (-> setting-up-an-unreal-engine-project-for-mobile-platforms)
- 6. Final Result (-> setting-up-an-unreal-engine-project-for-mobile-platforms)
