# Using Ad Mob In-Game Ads on Android

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-ad-mob-for-in-game-ads-on-android-with-unreal-engine?application_version=5.9

> Using the AdMob in-game advertisement system on Android.

[image: Using Ad Mob In-Game Ads on Android]

 [image: Banner Image]

## Configuration

To configure your project to use the AdMob in-game advertisement system on Android:

- In the **Edit** menu in **Unreal Editor**, select **Project Setings** to view the configuration options for your project. [image: Open Project Settings]

- On the left, Select the **Platforms: Android** tab. Navigate to the **Google Play Services** section and configure project for Google Play services platform. Click to full view

- In the **Google Play Services** section, check the **Enable Google Play Support** option.

- Enter the App ID for your game in the **Games App ID** field.

- Add an element to the **Ad Mob Ad Unit IDs** array for each AdMob ID you want to associate and enter the ID in the text box.

- Enter your Google Play License Key in the **Google Play License Key** field. Click to full view All of these values are available in the Google Play Developer Console for your App and Game Services, or in the Google Ad Mob interface.

- Finally, you'll need to add **com.android.vending.BILLING** to the **Extra Permissions** array in the **Advanced APKPackaging** section of the **Android** settings: Click to full view

### C++ Projects

If your project is a C++ project you will also need to add the appropriate modules to your Target.cs file, for example:

```
		...
		if (Target.Platform == UnrealTargetPlatform.Android)
		{
			ExtraModuleNames.Add("OnlineSubsystemGooglePlay");
			ExtraModuleNames.Add("OnlineSubsystem");
			ExtraModuleNames.Add("AndroidAdvertising");
		}
```

...
 if (Target.Platform == UnrealTargetPlatform.Android)
 {
 ExtraModuleNames.Add("OnlineSubsystemGooglePlay");
 ExtraModuleNames.Add("OnlineSubsystem");
 ExtraModuleNames.Add("AndroidAdvertising");
 }

Look at the Unreal Match 3 Target.cs file, `Match3\Source\Match3.Target.cs`, to see how this fits into the entire file.

## Showing the Ad Banner

The **Show Ad Banner** function is used to display an ad banner in your game. Call it somewhere in the logic where you want to show an ad, such as when the main menu is shown.

**In Blueprints:**

The example below is from the Unreal Match 3 sample game, which displays an ad banner when the victory/defeat screen is shown using the **Construct** event of that Widget Blueprint:

 [image: Blueprint script for showing ad banner]

See the Show Ad Banner reference for more information on the node.

## Hiding the Ad Banner

The **Hide Ad Banner** functions hides the visible ad banner. Call it when you no longer want the ad to be displayed, such as when you exit the main menu.

**In Blueprints:**

The example below is from the Unreal Match 3 sample game, which hides the ad banner when the victory/defeat screen is exited using the **Destruct** event of that Widget Blueprint:

 [image: Blueprint script for hiding ad banner]

See the Hide Ad Banner reference for more information on the node.

- blueprints
- mobile
- android
- services
- ads
- platform delivery

On this page

- Configuration (-> using-ad-mob-for-in-game-ads-on-android-with-unreal-engine)
- C++ Projects (-> using-ad-mob-for-in-game-ads-on-android-with-unreal-engine)
- Showing the Ad Banner (-> using-ad-mob-for-in-game-ads-on-android-with-unreal-engine)
- Hiding the Ad Banner (-> using-ad-mob-for-in-game-ads-on-android-with-unreal-engine)
