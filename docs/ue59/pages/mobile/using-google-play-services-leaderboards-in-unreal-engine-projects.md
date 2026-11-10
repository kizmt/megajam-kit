# Using Google Play Services Leaderboards

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-google-play-services-leaderboards-in-unreal-engine-projects?application_version=5.9

> Using leaderboards in your game.

[image: Using Google Play Services Leaderboards]

[image: Banner Image]

## Configuration

Please see Leaderboards | Play Games Services | Google Developers for information on setting up the Google Play Game Services for your application.

For your Unreal Project:

- In the **Edit** menu in **Unreal Editor**, select **Project Settings** to view the configuration options for your project.[image: Open Project Settings]
- On the left, Select the **Platforms: Android** tab. Navigate to the **Google Play Services** section and configure project for Google Play services platform.[image: Configure project for Google Play services] Configure project for Google Play services
- In the **Google Play Services** section, check the **Enable Google Play Support** option.
- Enter the App ID for your game in the **Games App ID** field.
- Enter your Google Play License Key in the **Google Play License Key** field.
- Add an element to the **Leaderboard Map**.
- In the **Leaderboard Map** you'll need to enter a **Name** that is only used within your Unreal Project and the **Leaderboard ID** you set up in your Google Play Services.[image: Set other options in the Google Play Services section] Set other options in the Google Play Services section All of these values are available in the Google Play Developer Console for your App and Game Services.

Since the **Name** value in the achievement map is only a mapping for the Google Play Services **Leaderboard ID**, and iOS is directly referred to by their **Leaderboard Reference**, and if you are releasing on both Android and iOS platforms, enter the Leaderboard Reference from your iOS Game Center settings as your **Name** so you only have to call one node regardless of platform.

## Reading from a Leaderboard

The **Read Leaderboard Integer** node will request from the platform's game service (currently iOS Game Center, or Google Play Services), the value stored on the given **Stat Name** for the provided **Player Controller**.

Note that it is a **latent** node, and thusly has a number of execution output pins. The top most is a "pass through," that works like any other execution output pin. The other two pins (**On Success**, and **On Failure**) will execute when the online service returns (or fails to return) a value. The value of **Leaderboard Value** before a successful return (or if the service fails to get a response) will be `0`.

**In Blueprints:**

The example below is from the **Global Game Instance** Blueprint in the Unreal Match 3 sample game. In these few nodes we're calling the **Read Leaderboard Integer** node for the Player Controller at Player Index 0 on the Stat Name (Leaderboard) "Match3HighScore":

## Writing to a Leaderboard

The **Write Leaderboard Integer** node will send the given integer **Stat Value** to the leaderboard specified in **Stat Name** for the provided **Player Controller**.

**In Blueprints:**

The example below is from the **VictoryScreen** Blueprint in the Unreal Match 3 sample game. When the victory (or defeat) screen is shown, it will check to see if on load Unreal Match 3 was able to retrieve a high score, then if it was able to it will submit the latest high score to the leaderboard. There is some additional checking before this to see if the new highscore is more than the one that was pulled during the app startup, but even if that wasn't there, the iOS and Android leaderboard systems will only accept values greater than what they currently store.

## Showing the Platform Specific Leadboard

The **Show Platform Specific Leaderboard Screen** will show the leaderboard specified by **Category Name** on the device.

**In Blueprints:**

The example below is from the **GameOverButtons** Blueprint Widget in the Unreal Match 3 sample game. When the **ShowScores** button is pressed, the game will attempt to show the leaderboard.

- development
- blueprints
- mobile
- leaderboards
- android
- platform delivery

On this page

- Configuration (-> using-google-play-services-leaderboards-in-unreal-engine-projects)
- Reading from a Leaderboard (-> using-google-play-services-leaderboards-in-unreal-engine-projects)
- Writing to a Leaderboard (-> using-google-play-services-leaderboards-in-unreal-engine-projects)
- Showing the Platform Specific Leadboard (-> using-google-play-services-leaderboards-in-unreal-engine-projects)
