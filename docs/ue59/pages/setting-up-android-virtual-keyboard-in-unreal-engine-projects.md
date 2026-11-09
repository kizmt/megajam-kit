# Android Virtual Keyboard

https://dev.epicgames.com/documentation/en-us/unreal-engine/setting-up-android-virtual-keyboard-in-unreal-engine-projects?application_version=5.9

> Going over setting up the Android Virtual Keyboard.

[image: Android Virtual Keyboard]

All **Unreal Engine** (UE) Android-based projects offer support for using either the standard pop up dialog input box or the operating system's virtual keyboard. The following document shows how to set up and call either virtual keyboard in your UE projects.

 [image: New Keyboard Input]

 [image: Old Keyboard Input]

## Steps

To enable the Virtual Keyboard in your project, you will need to do the following:

- From the **Main Menu** go to **Edit** and then click on the **Project Settings** option.[image: Open Project Settings]
- In the **Project Settings** menu go to **Platforms > Android** and under the **APK Packaging** section look for and click on the check mark box next to the **Enable improved virtual keyboard** option to enable it.[image: Enable improved virtual keyboard] Enable improved virtual keyboard Click for full image.
- Right-click in the **Content Browser** and then go to **User Interface > Widget Blueprint** option, giving this new Blueprint a name of **InputText**.[image: Create Widget Blueprint] Create Widget Blueprint Click for full image.
- Double - click on the **Input Text** UMG widget to open it up and from the **Palette** drag a **TextBox** into the UMG graph.[image: Drag Text Box Widget] Drag Text Box Widget Click for full image.
- Position the **TextBox** so that it is in the middle of the **Canvas** panel and then press the **Compile** and **Save** buttons.[image: Set position Text Box widget and compile] Set position Text Box widget and compile Click for full image.Keep in mind that your application is responsible for ensuring input elements are visible and not obscured behind the virtual keyboard. You can use the supplied **OnVirtualKeyboardShown** and **OnVirtualKeyboardHidden** event handlers to make sure that UI elements do not obscure the virtual keyboard.
- Open up the **Level Blueprint** and add the following nodes to the **Event Graph**.**Event Begin Play**
- **Create Widget**
- **Add to Viewport**[image: Add nodes to the Event Graph] Add nodes to the Event Graph Click for full image.

- Connect the **Event Begin Play** node to the **Create Widget** node and then connect the **Create Widget** node to the **Add Viewport** node. When completed your **Level Blueprint** should look like the following image.[image: Set Blueprint Script for Widget] Set Blueprint Script for Widget Click for full image.
- Next, in the **Create Widget Blueprint** node, in the **Class** input, add the **InputText** Widget Blueprint that was created earlier.[image: Set Blueprint Script for Widget] Set Blueprint Script for Widget Click for full image.
- Save the level, giving it a name of **AndroidVirtualKeyboard** then open up your **Project Settings** and go to **Maps & Modes**. In the **Default Maps** input the **AndroidVirtualKeyboard** map into the **Editor Startup Map** and the **Game Default Map**.[image: Set Default Maps options] Set Default Maps options Click for full image.
- Click on the **Platforms** button small and from the displayed list, select the Android device you want to deploy your UE project to.

[image: Deploy Project to the Device] Deploy Project to the Device

Click for full image.

## End Result

Once your project launches on your Android device, press on the text input box and when you do, you should now be able to input the text you want using the Android system keyboard like in the following video.

You can also disable the virtual keyboard using the **Android.NewKeyboard** console variable followed by one of the following numbers. Doing this is particularly useful when the user is using a language requiring a different IME (Input Method Editor).

| Command Name | Input | Description |
| --- | --- | --- |
| **Android.NewKeyboard** | 0 | Uses the check mark box setting that was set in the UE editor. |
| **Android.NewKeyboard** | 1 | Forces the new keyboard to be used. |
| **Android.NewKeyboard** | 2 | Forces the dialog to be used. |

- development
- blueprints
- guides
- mobile
- android
- platform delivery

On this page

- Steps (-> setting-up-android-virtual-keyboard-in-unreal-engine-projects)
- End Result (-> setting-up-android-virtual-keyboard-in-unreal-engine-projects)
