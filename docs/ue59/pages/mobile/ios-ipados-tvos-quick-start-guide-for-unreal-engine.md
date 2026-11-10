# iOS, iPadOS, tvOS Quick Start Guide

https://dev.epicgames.com/documentation/en-us/unreal-engine/ios-ipados-tvos-quick-start-guide-for-unreal-engine?application_version=5.9

> Set up an Unreal Engine project for iOS, tvOS, or iPadOS.

[image: iOS, iPadOS, tvOS Quick Start Guide]

This quick start guide explains the steps to build an **Unreal Engine** project for Apple's iOS, iPadOS, and tvOS platforms. Through this guide, you will:

- Set up Xcode on your Mac.
- Connect to your device in Xcode.
- Register your device with your Apple Developer account.
- Create a Provisioning Profile and Certificates for your project.
- Configure your project for iOS.
- Build and run your project on an iOS device.

This guide covers creating signed builds for C++ projects. For Blueprint-only projects on Windows, there is an alternate workflow for building iOS projects. Refer to Packaging iOS Projects (-> packaging-ios-projects-in-unreal-engine) for more information.

Additionally, while this guide refers to iPhone and iOS as an example, note that the same setup steps are used for tvOS. To connect to a tvOS device, refer to the Connecting to a tvOS Device (-> connecting-to-tvos-devices-in-unreal-engine) page.

## Requirements

To build projects for Apple's platforms, you need the following:

- A computer running MacOS with Unreal Engine installed.
- An installation of Xcode that is compatible with your current version of Unreal Engine.
- An Apple Developer Account.
- An iOS device that is compatible with your current version of Unreal Engine.

The following software versions are compatible with the current version of Unreal Engine:

- Current UE Version: 5.8Supported Target SDK versions: iOS/iPadOS/tvOS 17 or later.
- Recommended macOS, Xcode, iOS base SDK versions:macOS Sequoia 15.x
- Xcode 26.1.1
- Base iOS/iPadOS/tvOS SDK 26

The following iOS hardware versions are compatible with the current version of Unreal Engine:

- iOS 17iPhone 11 or later

- iPadOS 17iPad (6th generation) or later
- iPad Air (3rd generation) or later
- iPad Mini (5th generation) or later
- iPad Pro (all models)

- tvOS 17Apple TV 4K (first generation) or later

Apple requires apps uploaded to App Store Connect to be built with Xcode 26 or later using base SDK iOS 26, iPadOS 26, tvOS 26, visionOS 26, or watchOS 26 since April 28, 2026.

To select iOS SDKs 15 and 16 in Unreal Engine 5.8, disable Metal Shader Stripping (`r.Shaders.Symbols=1`) to avoid a corrupted library assertion under the Xcode 26 metal-strip toolchain. Disabling shader stripping significantly increases Metal shader library size, which can affect performance.

Apple A8/A8X-based devices (iPad Air 2, iPad Mini 4 and Apple TV HD) are not supported in Unreal Engine 5.8.

For software compatibility information about older versions of Unreal Engine, refer to the iOS, iPadOS, and tvOS Development Requirements (-> ios-ipados-and-tvos-development-requirements-for-unreal-engine) page.

## Set Up Xcode

To set up Xcode for mobile development in Unreal Engine, follow these steps:

- If you do not already have Xcode installed on your Mac, download and install it from the App Store. You need to sign in with your Apple ID.If you need a specific version of Xcode, refer to Apple Developer’s download archive.[image: Download Xcode from the App Store]
- Open Xcode. In the toolbar, open **Xcode** > **Settings**.[image: Open Xcode > Settings]
- Go to the **Components **tab. Verify that the Platform Support components for the platforms you are deploying to are downloaded. The Metal Toolchain is required for all platforms you are deploying to.[image: Components settings in Xcode]
- Open the **Locations** tab and verify that the **Command Line Tools** path is set to the current version of Xcode. If this path isn't set, Unreal Editor won't open because the Metal shader compiler can't find Xcode.[image: Make sure to set your Command Line Tools path]

## Create a Project

To set up a new mobile project in Unreal Engine, follow these steps:

[image: The New Project window, with a Top Down game template selected.]

- Open Unreal Editor. When the Home Panel appears, click **New Project**.
- In the **New Project** window, click **Games**.
- Configure your project as follows:**Project Template**: Choose the template best suited to your project
- **Target Platform**: Mobile
- **Quality Preset**: Scalable
- **Project Name**: Enter a project name

You can create a project that uses either **Blueprints **or **C++**.

- Click **Create **to create the project and open it in Unreal Editor.

The above specifications and project name are from the Creating a Mobile Project (-> setting-up-an-unreal-engine-project-for-mobile-platforms) guide. Refer to that page for more details on these specifications.

## Connect Your Device With Xcode and Register it With Your Apple Developer Account

The following is a short summary of how to provision your Apple device for development. For fully detailed steps, see the Set Up iOS, iPadOS, and tvOS Devices for Development (-> set-up-ios-ipados-and-tvos-devices-for-development-in-unreal-engine) page.

To use your iOS device for testing, you need to connect it to your computer, make sure it is recognized by Xcode, and register it in your Apple Developer Account as a testing device for your apps. The device registration will be used later for creating a Provisioning Profile.

To set up your device with Xcode, follow these steps:

- Connect your Apple device to your computer with a USB cable.
- Open Xcode, then click **Window** > **Devices and Simulators**.
- Unlock your device to grant Xcode access to it. When you see the **Trust This Device** prompt on your iOS device, tap **Trust**, then provide your passcode. Xcode will fetch debug symbols for the device.
- Log in to your Apple Developer account at developer.apple.com. If you do not have an Apple ID and a developer account, create one.While Epic's software is available free of charge, Apple Developer accounts costs a yearly fee. Keep this in mind when registering your account.
- Once you have logged in, click **Certificates, Identifiers & Profiles**.
- Click **Devices**, then click **Register a Device**.
- Fill out the following information about your device:Set the **Platform** to iOS, tvOS, watchOS.
- Set the **Device Name** to a unique, recognizable name.
- Look at the information about your device in **Xcode** in **Window** > **Devices and Simulators**. Copy the **Identifier**, then return to the Register a Device page and paste it into the **UUID** field.

Click **Continue** when you are finished.

- Double-check that the information about your device is correct. If you input the wrong UUID, you may see the wrong type of device listed. Click **Register** to finish registering your device with your Apple developer account. When registration is complete, click **Done**.

## Provisioning and Signing

The following is a summary of how to use modern Xcode workflows in Unreal Engine using Automatic Code Signing. For detailed steps, refer to Provisioning Profiles and Signing Certificates (-> setting-up-ios-tvos-and-ipados-provisioning-profiles-and-signing-certificates-for-unreal-engine-projects).

- In Xcode, open **Settings > Accounts** and add your Apple ID. Select your team in the account details. This makes your developer credentials available system-wide so Unreal can use them for signing.
- Open your project in Unreal Editor.
- In** Project Settings > Platforms > iOS**, set the **Bundle Identifier** to a reverse-domain string in the format `com.(OrganizationName).(ProjectName)`.
- In **Project Settings > Platforms > Xcode Projects**, enable **Use Automatic Code Signing**. Unreal Engine now uses the developer credentials from your signed-in Xcode account to generate and refresh the signing certificate and provisioning profile for you — no manual certificate or provisioning profile creation is required.

## Launch and Package Your Project

Several options are available to package your project for iOS from the editor.

To package and deploy your project to a connected Apple device:

- Connect your Apple device.
- Go to the **Platforms > Quick Launch Current Level** menu.
- Select the name of your connected Apple device.

To package your project as an archive on disk:

- Go to **Platforms > Package Project **and, under **Package For**, select **iOS**.
- Click **Platforms > Package Project > Package Project**. If all of your components are set up correctly, your project will package successfully.

## On Your Own

You are now ready to develop your mobile app and package and distribute it to iOS, iPadOS, and tvOS devices. Depending on your project's needs and your target devices, further configuration will be required in order to optimize your builds.

The following links provide more detail on the steps above and take you to the next steps in building your mobile projects:

- [image: iOS, iPadOS, and tvOS Development Requirements] iOS, iPadOS, and tvOS Development RequirementsiOS development requirements including compatible hardware, software, and SDK information. (-> ios-ipados-and-tvos-development-requirements-for-unreal-engine)

- [image: Set Up iOS, iPadOS, and tvOS Devices for Development] Set Up iOS, iPadOS, and tvOS Devices for DevelopmentSet up an Apple device so you can deploy Unreal Engine builds directly to that device for testing. (-> set-up-ios-ipados-and-tvos-devices-for-development-in-unreal-engine)

- [image: Provisioning Profiles and Signing Certificates] Provisioning Profiles and Signing CertificatesCreate a Provisioning Profile and Signing Certificate so you can package iOS, iPadOS, and tvOS applications. (-> setting-up-ios-tvos-and-ipados-provisioning-profiles-and-signing-certificates-for-unreal-engine-projects)

- [image: Test on Mac With Designed for iPad] Test on Mac With Designed for iPadUse Apple's Designed for iPad mode to test your iPad or iPhone project on your Apple Silicon Mac without using a physical device. (-> test-on-mac-with-designed-for-ipad-in-unreal-engine)

- [image: Debugging iOS Projects With Xcode] Debugging iOS Projects With XcodeUse Xcode to launch your project on device and debug with break points and LLDB commands. (-> debugging-ios-projects-with-xcode-in-unreal-engine)

- [image: Profiling iOS Projects with Platform-Native Tools] Profiling iOS Projects with Platform-Native ToolsPerform diagnostics on Unreal Engine iOS projects using Xcode and Instruments. (-> profiling-ios-projects-with-platformnative-tools)

- mobile
- macos
- ios
- tvos
- ipados
- xcode
- platform delivery

On this page

- Requirements (-> ios-ipados-tvos-quick-start-guide-for-unreal-engine)
- Set Up Xcode (-> ios-ipados-tvos-quick-start-guide-for-unreal-engine)
- Create a Project (-> ios-ipados-tvos-quick-start-guide-for-unreal-engine)
- Connect Your Device With Xcode and Register it With Your Apple Developer Account (-> ios-ipados-tvos-quick-start-guide-for-unreal-engine)
- Provisioning and Signing (-> ios-ipados-tvos-quick-start-guide-for-unreal-engine)
- Launch and Package Your Project (-> ios-ipados-tvos-quick-start-guide-for-unreal-engine)
- On Your Own (-> ios-ipados-tvos-quick-start-guide-for-unreal-engine)

Related documents

Set Up iOS, iPadOS, and tvOS Devices for Development

 [image: Set Up iOS, iPadOS, and tvOS Devices for Development] (-> set-up-ios-ipados-and-tvos-devices-for-development-in-unreal-engine)
