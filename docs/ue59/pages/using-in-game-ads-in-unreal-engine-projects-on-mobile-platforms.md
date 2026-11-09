# Using In-Game Ads

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-in-game-ads-in-unreal-engine-projects-on-mobile-platforms?application_version=5.9

> Using in-game advertisements to monetize your game.

[image: Using In-Game Ads]

In-game advertisements enable you to display ads to players of your game on mobile platforms. This provides a means of monetizing your game while allowing it to remain completsharing-and-releasing-projects/general-mobile-development/supporting-mobile-services

 [image: Banner Image]

## Configuration

See the appropriate platform-specific page below for details on configuring in-game advertisements for each platform:

- Using Ad Mob In-Game Ads on Android (-> using-ad-mob-for-in-game-ads-on-android-with-unreal-engine)

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

- Configuration (-> using-in-game-ads-in-unreal-engine-projects-on-mobile-platforms)
- Showing the Ad Banner (-> using-in-game-ads-in-unreal-engine-projects-on-mobile-platforms)
- Hiding the Ad Banner (-> using-in-game-ads-in-unreal-engine-projects-on-mobile-platforms)
