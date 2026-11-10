# Set Up iOS, iPadOS, and tvOS Devices for Development

https://dev.epicgames.com/documentation/en-us/unreal-engine/set-up-ios-ipados-and-tvos-devices-for-development-in-unreal-engine?application_version=5.9

> Set up an Apple device so you can deploy Unreal Engine builds directly to that device for testing.

[image: Set Up iOS, iPadOS, and tvOS Devices for Development]

Before you can deploy an Unreal Engine iOS, iPadOS, or tvOS build to an Apple device, the device requires a trusted connection to the Mac running Xcode and Unreal Editor, and it must be registered with your Apple Developer team. This guide covers connecting your device to your Mac, enabling Developer Mode, registering the device, and verifying the connection in Xcode.

## Connect Your Apple Device to Your Mac

To ensure your device is properly connected with your Mac, follow these steps:

- Plug your Apple device into your Mac with a compatible cable.
- Unlock your device.
- When the **Trust This Computer?** prompt appears on the device, tap **Trust **and enter your device passcode.You only need to enable trust once per Mac, unless you reset the device or revoke the Mac’s trust (from **Settings > General > Transfer** or **Reset > Reset Location & Privacy**).
- Your Mac may also prompt you to confirm the connection. Approve the prompt if it appears.
- After trusting the device, open Xcode and go to **Window > Devices and Simulators**. Your device should appear in the list on the left. Xcode automatically fetches debug symbols for the device on first connection — this may take several minutes.

## Enable Developer Mode on Your Apple Device

For Xcode to deploy development-signed builds to your device, you must enable Developer Mode on the device if it’s using iOS 16 and later, iPadOS 16 and later, or tvOS 16 and later.

To enable Developer Mode so you can deploy builds to your device, follow these steps:

- On your Apple device, open **Settings**.
- Tap **Privacy & Security**.
- Scroll to the bottom of the security settings and tap **Developer Mode**.[image: iPhone screens showing the Settings menu and Privacy & Security menu and Developer Mode option]Developer Mode only appears after your device detects a development connection from a Mac. If you don’t see the **Developer Mode** option, make sure your device is connected to your Mac with a cable and Xcode is open on the Mac, then check device settings again.
- Tap the** Developer Mode** switch to turn it on. When the device prompts you to restart, tap **Restart**.
- After the device restarts, tap **Turn On** in the **Developer Mode** prompt and enter your device passcode.

Developer Mode is a one-time setting per device. Once enabled, it remains on until you disable it manually or factory reset the device.

## Register Your Device With Your Apple Developer Team

Your Apple device must be registered as a development device under your Apple Developer team before that device can run signed builds associated with that team. Without registration, builds fail to launch with a provisioning profile error.

If you have automatic signing enabled in Xcode and have device-registration permissions on your Apple Developer team, you can skip this step — Xcode automatically registers the device with your team when you first build to that device. Go to the **Verifying That Your Device is Connected** section below. Otherwise, continue with the steps in this section.

To register your device with your Apple Developer account and Apple Developer team, follow these steps:

- In Xcode, go to **Window > Devices and Simulators**.
- Select your device. Note your device's **Identifier **(UUID) shown in the device details panel.
- Log in to your Apple Developer account at `developer.apple.com`. If you do not have an Apple ID and a developer account, create one.While Epic's software is available free of charge, Apple Developer accounts cost a yearly fee. Keep this in mind when registering your account. If you don’t have a paid membership, you can use a Personal Team for limited testing. Personal Team builds expire after seven days and have other limitations. For full development workflows, a paid Apple Developer Program membership is required.
- Once you have logged in, in the **Certificates, IDs, & Profiles** section, click **Devices**.
- In the top right corner of the page, under your name, ensure the correct team is selected. Click **Register a Device**.
- Enter the following information about your device:Set the **Platform **to **iOS, tvOS, watchOS**.
- Set the **Device Name** to a unique, recognizable name.
- Copy the UUID from Xcode into the **UUID **field.

- Click **Continue **when you are finished.
- Check that the device information you entered is correct. If you enter the wrong UUID, you may see the wrong type of device listed.
- Click **Register**. When device registration is complete, click **Done**.

After registration, regenerate your team's provisioning profile to include the newly added device. If Xcode is set to automatic signing, this happens the next time you build for the device. For more information, see Provisioning Profiles and Signing Certificates (-> setting-up-ios-tvos-and-ipados-provisioning-profiles-and-signing-certificates-for-unreal-engine-projects).

## Verify That Your Device Is Connected

To verify your Apple device is set up correctly:

- Open Xcode.
- Connect your device to your Mac with a cable. Wait for Xcode to recognize the device.
- Open** Window > Devices and Simulators**.
- In the left panel, select your device.If the device is set up correctly, the device details panel shows the device name, model, OS version, and UUID with no warning or error icons.

If Xcode displays a warning or error for the device, do the following:

| Message | Solution |
| --- | --- |
| "Device is not trusted." | Unlock the device and approve the **Trust This Computer?** prompt. |
| "Developer Mode is disabled." | Follow the **Enable Developer Mode** steps above. |
| "Device is not registered with your team." | Follow the **Register Your Device** steps above. |
| "Preparing debugger support." | Wait for Xcode to finish fetching debug symbols. This can take several minutes on first connection and during major iOS version updates. |

## Next Steps

After completing the above steps, your Apple device is prepared for deployment and debugging from Unreal Editor or Xcode. For instructions on configuring an Unreal Engine project for iOS, see the iOS, iPadOS, tvOS Quick Start Guide (-> ios-ipados-tvos-quick-start-guide-for-unreal-engine).

For information on launching a build to your Apple Silicon Mac as a Designed for iPad app rather than to a physical device, see Test on Mac With Designed for iPad (-> test-on-mac-with-designed-for-ipad-in-unreal-engine).

- mobile
- ios
- tvos
- ipados
- xcode
- platform development
- apple

On this page

- Connect Your Apple Device to Your Mac (-> set-up-ios-ipados-and-tvos-devices-for-development-in-unreal-engine)
- Enable Developer Mode on Your Apple Device (-> set-up-ios-ipados-and-tvos-devices-for-development-in-unreal-engine)
- Register Your Device With Your Apple Developer Team (-> set-up-ios-ipados-and-tvos-devices-for-development-in-unreal-engine)
- Verify That Your Device Is Connected (-> set-up-ios-ipados-and-tvos-devices-for-development-in-unreal-engine)
- Next Steps (-> set-up-ios-ipados-and-tvos-devices-for-development-in-unreal-engine)

Related documents

iOS Quick Start Guide

 [image: iOS Quick Start Guide] (-> setting-up-an-unreal-engine-project-for-ios)iOS, iPadOS, and tvOS

 [image: iOS, iPadOS, and tvOS] (-> ios-ipados-and-tvos-in-unreal-engine)
