# Packaging iOS Projects

https://dev.epicgames.com/documentation/en-us/unreal-engine/packaging-ios-projects-in-unreal-engine?application_version=5.9

> Learn how to package iOS Projects in Unreal Engine

[image: Packaging iOS Projects]

Windows
 macOS
 Linux

## Steps

In the following section, we will take a look at using the UE Editor to create an **.IPA** of your project, which can be installed later without the need for the Editor.

If you are localizing your iOS project, you will need to also translate strings in your code. See the Localize 'plist' and 'NSLocalizedString' in an iOS Project (-> localizing-plist-and-nslocalizedstring-in-an-ios-project-in-unreal-engine) page for instructions on how to do this.

- Connect your device to your computer if it is not already connected.

- Open your project in Unreal Editor.

- In the **File** menu, select **Package Project > iOS**.

- In the directory dialog, select a location for the `.ipa` file to be saved.

- A packaging message will appear in the bottom right corner of the editor while the game is being packaged.

- A message is displayed when the project is successfully packaged.

## End Result

When completed you will now have an .IPA that is ready to be deployed to your iOS device.

## Steps

In the following section, we will take a look at creating a **.IPA** of your project that can be installed without the need for **Unreal Editor**.

- Connect your device to your computer if it is not already connected.

- Open your project in Unreal Editor.

- In the **File** menu, select **Package Project > iOS**.

- In the directory dialog, select your project's directory as this is where the packaged project (`.ipa` file) will be located.

- A packaging message will appear in the bottom right corner of the Editor while the game is being packaged.

- A message is displayed when the project is successfully packaged.

- From Xcode go to **Window** and then select **Devices and Simulators**.

- In the **Devices** section, press the **Plus** sign icon to start the app install process.

- Locate and select the **.ipa** file that UE4 created and then press the **Open** button to begin the install process.

- The progress of the install will be displayed across the top of the **Devices** window.

## End Result

When completed you will see the IPA added to your iOS device.

- guides
- mobile
- ios
- platform delivery

On this page

- Steps (-> packaging-ios-projects-in-unreal-engine)
- End Result (-> packaging-ios-projects-in-unreal-engine)
- Steps (-> packaging-ios-projects-in-unreal-engine)
- End Result (-> packaging-ios-projects-in-unreal-engine)
