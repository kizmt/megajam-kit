# Provisioning Profiles and Signing Certificates

https://dev.epicgames.com/documentation/en-us/unreal-engine/setting-up-ios-tvos-and-ipados-provisioning-profiles-and-signing-certificates-for-unreal-engine-projects?application_version=5.9

> Create a Provisioning Profile and Signing Certificate so you can package iOS, iPadOS, and tvOS applications.

[image: Provisioning Profiles and Signing Certificates]

To publish iOS, iPadOS, and tvOS games, you need a **Code Signing Certificate** identifying you as a valid Apple developer, as well as a **Provisioning Profile** identifying the services and permissions needed for your app. While **Xcode **automatically manages this process for building code, you need to provide these manually in your **Unreal Engine **project settings so that the Unreal Engine build system can cook and package a project. This guide will explain all the steps needed to set up valid Certificates and Provisioning Profiles.

This guide covers the full setup for building Unreal Engine C++ projects with MacOS and Xcode. While you need a MacOS machine with Xcode to build your project to ship on the app store, Unreal Engine provides several other paths for building iOS apps for development and testing purposes, including paths for working on Windows. Refer to Appendix B: Additional Build Options (-> setting-up-ios-tvos-and-ipados-provisioning-profiles-and-signing-certificates-for-unreal-engine-projects) for more information.

## 1. Overview and Requirements

To build and distribute an **Unreal Engine **project for an iOS, tvOS, or iPadOS device, you need the following requirements:

- A computer running MacOS.
- An installation of Xcode that is compatible with your current version of Unreal Engine.
- An Apple Developer Account.
- An Unreal Engine Project.

Refer to the iOS, iPadOS, and tvOS Development Requirements page for more information about the MacOS and Xcode versions required for use with the current version of Unreal Engine. Refer to the iOS Quickstart Guide guide for instructions about how to set up Xcode to work with Unreal Engine.

You need an Apple Developer Account to create code signing certificates and provisioning profiles. If you do not already have one, visit developer.apple.com and create an Apple ID and a Developer Account.

While Epic's software is available free of charge, Apple Developer accounts cost a fee of $99 per year. Keep this in mind when registering your account.

Finally, you need to do the following on your Apple Developer Account:

- Connect Xcode with your Developer Account.
- Create an **Identifier (App ID)** for your app.
- Create a **Provisioning Profile** for a deployment of your app.
- Create a **Signing Certificate** identifying yourself as the creator of your app.
- Register your iOS device with your account.

Once you have each of these components, you need to download the Provisioning Profile and Signing Certificate and add them to your **Project Settings.** After that, you can package projects and push them to your device. The sections below will detail each of these steps.

## 2. Connect Xcode With Your Apple Developer Account

To make sure your Certificates and Provisioning Profiles are recognized correctly, connect Xcode with the Apple ID for your Apple Developer Account.

- Open Xcode, then click **Xcode** > **Preferences**.
- Click the **Accounts** tab.
- Click **Add (+) **to add an account. Provide the information for your Apple Developer Account.

## 3. Create Your Identifier (App ID)

All iOS apps require an Identifier with a Bundle ID. Your Provisioning Profile references this information in a later step. To create an Identifier, follow these steps:

- Login to your Apple Developer Account.[image: The sign-in screen for the Apple Developer page]
- Click **Certificates, Identifiers, and Profiles**.[image: The Certificates, Identifiers, and Profiles option is where you configure most of the details in this guide]
- Click **Identifiers**, then click **Register an App ID**.[image: Registering an Identifier in the Identifiers page]
- Select **App IDs** and click **Continue**.
- Select **App** and click **Continue**.
- In the **Register an App ID** menu, fill in your **Description** and **Bundle ID**. The Bundle ID should be a reverse-domain string taking the format `com.(OrganizationDomainName).(AppName)`. In this example, the app is called `com.YourCompany.MobileTestGame`.Take note of the application name you provide for the App ID, as this information must match the name of your Unreal Engine project. Specifically, you need the name of the `.uproject`, without the extension. You also need the Bundle ID to match in both your Xcode project and the **Project Settings** in Unreal Editor.
- Select any permissions and services your app needs, then click **Continue**.
- Confirm that all your settings are correct, then click **Register**.

## 4A. Create a Code Signing Certificate from Xcode

If you have connected Xcode with your Apple Developer account, you can generate a Development Certificate automatically with these steps:

- Open your project's solution in **Xcode**, then select your project in the navigation panel. This will display the project's settings.
- In the **General** settings, provide your project's bundle identifier. This should be a reverse-domain style string reading com.(OrganizationName).(ProjectName). In this example, it reads `com.YourCompany.MobileTestGame`.
- Click **Signing and Capabilities**. Set the **Team** to the name given by your Apple Developer profile.
- Enable **Automatically Manage Signing**. Xcode will connect with the Apple Developer site and generate a Code Signing Certificate for Development.

This Certificate will only be available on the Mac you configured it on, and it will only be usable for development, not shipping.

## 4B. Generate a Signing Certificate Manually

Development Certificates generated by Xcode make it possible to deploy your project for testing, but to ship your project you may need to create a Signing Certificate that is configured for distribution on the app store. You may also need to create a Certificate that is usable by your team on other devices.

Follow these steps to manually create a Certificate with your Apple Developer account:

- Open the **Keychain Access** app. Click **Keychain Access** > **Certificate Assistant** > **Request a Certificate From a Certificate Authority.**
- In the **Certificate Information** dialog, provide your Apple Developer Email address and your name. Click **Continue**, then save the signing request to a convenient location, such as the desktop.
- Open the **Apple Developer Page**. In the Certificates, Identifiers, and Profiles menu, click **Certificates**, then click **Create a Certificate**.
- Select **iOS App Development**, then click **Continue**. If you are creating a certificate to ship your app, you need to use **iOS Distribution (App Store and Ad Hoc) **instead.[image: Creating a Code Signing Certificate]
- Click **Choose File**, then select the **Certificate Signing Request file** you generated. Click **Continue** to generate your Certificate.
- Download the Certificate and open it to add it to your System Keychain.

## 6. Create a Provisioning Profile

Your app's Provisioning Profile ties together your identity as an Apple Developer, information about your test devices, and information about the app's entitlements.To create a Provisioning Profile, follow these steps:

- In the **Certificates, Identifiers & Profiles** menu on the Apple Developer page, click **Profiles**, then click **Generate a Profile**.
- Select **iOS App Development, **then click **Continue**.[image: Creating a Provisioning Profile]This page uses an iOS app as an example, but you can select the provisioning profile type that is appropriate to your target device. For example, if you are creating a tvOS app, choose **tvOS App Development**.
- Click the **App ID** dropdown and select the App ID you generated in the previous section, then click **Continue**.[image: Choosing the Identifier for your app for your Provisioning Profile]
- Choose the **Signing Certificate** for **Development** that you generated in the previous section, then click **Continue**.If you need to share your Signing Certificate and Provisioning Profile with your team, create a Certificate manually.
- Choose your registered device as a test device, then click **Continue**.
- Provide a **Provisioning Profile Name**. In this example, the profile is called **MobileTestGame_Development**. Click **Generate**.
- Download the Provisioning Profile and place it in a convenient location. Click and drag it onto the Xcode app icon in your dock to install it.

## 7. Add Your Provisioning Profile and Signing Certificate to Unreal Editor

Xcode does not need a Provisioning Profile to build code if you have it set to automatically manage code signing. However, Unreal Engine's build system and the iPhone Packager need to refer to your Provisioning Profile and Signing Certificate to cook and package your project's executable for iOS. Follow these steps to provide your Provisioning Profile and Signing Certificate in Unreal Engine's project settings:

- Open Unreal Editor, then open **Project Settings** > **Platforms** > **iOS**. Make sure your **Bundle Identifier** is set to the same name as in both Xcode and your Apple Developer Account.
- Wait for a moment for the editor to discover your Provisioning Profile and Signing Certificate. If the entries for your Provisioning Profile and your Certificate both turn green, they are recognized as valid profiles and will be used automatically. You can select the check box to manually set them as well.

You can perform the steps in this section on a Windows machine for Blueprint-only projects and remote builds.

The Signing Certificate you select in your Project Settings must match the one used to generate your Provisioning Profile, otherwise your project will fail to package.

## 8. Package Your Project

- Click **Platforms** > **iOS** > **Package Project** to package for iOS. If all of your settings are correct and your Provisioning Profile and Signing Certificate are both valid, UE creates an iOS build.
- Click the **Platforms** dropdown again. If your iOS device appears in the **Quick Launch** options, select it to deploy a build directly to your device.

## Final Result

After following the steps in this guide, you have all the needed components to build and distribute iOS projects. When you need to create a Provisioning Profile for testing or shipping, refer to this guide again and configure your Identifier, Certificate, and Provisioning Profile accordingly.

## Appendix A: Obtaining an Apple Worldwide Developer Relations (WWDR) Certificate

Apple requires an Apple Worldwide Developer Relations Certificate to build apps. This should be provided by Xcode automatically, but in some situations, you may need to manually install it on your Mac.

- Go to the Apple Certificate Authority Page and download the latest WWDR Intermediate Certificate.
- Open the **Keychain Access** app and drag the certificate into the **System keychain**.

## Appendix B: Additional Build Options

The steps in this guide are for the full Signing and Provisioning process needed to distribute an app. There are several other options available during development and testing:

- Blueprint-only iOS projects do not need to go through the Signing and Provisioning process to package builds or push them to devices for testing – you can package them directly out of the box. This path will also work on Windows. Refer to Building for iOS on Windows (-> creating-remote-builds-of-unreal-engine-projects-for-ios) for more information.
- Because most teams using Unreal Engine use Windows machines for development, a remote build process is available. This will create a secure connection with a MacOS device and have it automate a build. Refer to the Building for iOS on Windows guide (-> creating-remote-builds-of-unreal-engine-projects-for-ios) for more information.

## Appendix C: Sharing Your Signing Certificates With Your Team

In UE 5.3 and newer, automatic code signing is the preferred method for handling signing certificates in Development builds. Your team should have a shared Apple developer account that each team member can connect to in Xcode, which provides all of them shared access to signing and provisioning resources.

If you need to share manually-created signing certificates or provisioning profiles, create a folder in your UE project directory called Provisioning, then place them in that folder. They are not necessary for the build process, but you can add them to source control for your team and share them as needed.

- c++
- mobile
- macos
- ios
- tvos
- ipados
- xcode
- itunes
- provisioning
- provisioning profile
- signing
- certificate
- signing certificate
- platform delivery

On this page

- 1. Overview and Requirements (-> setting-up-ios-tvos-and-ipados-provisioning-profiles-and-signing-certificates-for-unreal-engine-projects)
- 2. Connect Xcode With Your Apple Developer Account (-> setting-up-ios-tvos-and-ipados-provisioning-profiles-and-signing-certificates-for-unreal-engine-projects)
- 3. Create Your Identifier (App ID) (-> setting-up-ios-tvos-and-ipados-provisioning-profiles-and-signing-certificates-for-unreal-engine-projects)
- 4A. Create a Code Signing Certificate from Xcode (-> setting-up-ios-tvos-and-ipados-provisioning-profiles-and-signing-certificates-for-unreal-engine-projects)
- 4B. Generate a Signing Certificate Manually (-> setting-up-ios-tvos-and-ipados-provisioning-profiles-and-signing-certificates-for-unreal-engine-projects)
- 6. Create a Provisioning Profile (-> setting-up-ios-tvos-and-ipados-provisioning-profiles-and-signing-certificates-for-unreal-engine-projects)
- 7. Add Your Provisioning Profile and Signing Certificate to Unreal Editor (-> setting-up-ios-tvos-and-ipados-provisioning-profiles-and-signing-certificates-for-unreal-engine-projects)
- 8. Package Your Project (-> setting-up-ios-tvos-and-ipados-provisioning-profiles-and-signing-certificates-for-unreal-engine-projects)
- Final Result (-> setting-up-ios-tvos-and-ipados-provisioning-profiles-and-signing-certificates-for-unreal-engine-projects)
- Appendix A: Obtaining an Apple Worldwide Developer Relations (WWDR) Certificate (-> setting-up-ios-tvos-and-ipados-provisioning-profiles-and-signing-certificates-for-unreal-engine-projects)
- Appendix B: Additional Build Options (-> setting-up-ios-tvos-and-ipados-provisioning-profiles-and-signing-certificates-for-unreal-engine-projects)
- Appendix C: Sharing Your Signing Certificates With Your Team (-> setting-up-ios-tvos-and-ipados-provisioning-profiles-and-signing-certificates-for-unreal-engine-projects)
