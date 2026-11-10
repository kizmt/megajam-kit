# Using Google Play Achievements

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-google-play-achievements-in-unreal-engine-projects?application_version=5.9

> Using Google Play Achievements to increase player engagement.

[image: Using Google Play Achievements]

 [image: Banner Image]

## Configuration

Please see Achievements | Play Games Services | Google Developers for information on setting up the Google Play Game Services for your application.

For your Unreal Project:

- In the **Edit** menu in **Unreal Editor**, select **Project Settings** to view the configuration options for your project. [image: Open Project Settings]

- On the left, Select the **Platforms: Android** tab. Navigate to the **Google Play Services** section and configure project for Google Play services platform. Click to full view

- In the **Google Play Services** section, check the **Enable Google Play Support** option.

- Enter the App ID for your game in the **Games App ID** field.

- Enter your Google Play License Key in the **Google Play License Key** field.

- Add an element to the **Achievement Map**.

- In the **Achievement Map** you'll need to enter a **Name** that is only used within your Unreal Project and the **Achievement ID** you set up in your Google Play Services. Click to full view All of these values are available in the Google Play Developer Console for your App and Game Services.

Since the **Name** value in the achievement map is only a mapping for the Google Play Services **Achievement ID**, and iOS is directly referred to by their **Achievement Reference**, and if you are releasing on both Android and iOS platforms, enter the Achievement Reference from your iOS Game Center settings as your **Name** so you only have to call one node regardless of platform.

## Caching your Achievements

**Cache Achievements** will request from the platform's game service the list of achievements and the values the current player has for said achievements. You'll be able to use the **Get Cached Achievement Value** if this node returns successfully.

Note that it is a **latent** node, and thusly has a number of execution output pins. The top most is a "pass through," that works like any other execution output pin. The other two pins (**On Success**, and **On Failure**) will execute when the online service returns (or fails to return) a value. When the execution returns a success

**In Blueprints:**

The example below is from the **Global Game Instance** Blueprint in the Unreal Match 3 sample game. After the user logs into the device's game platform (Game Center, Google Play), we run the **Cache Achievements** node and actually halt execution (by not having anything execute off the top output execution pin) at this point to give the service time to return all the achievements:

## Reading Values from your Achievements

The **Get Cached Achievement Progress** will return the progress of a given **Achievement ID** for the provided **Player Controller**, and only work if a **Cache Achievements** node was run earlier and returned successfully.

For iOS Game Center, this value is actually a floored float, as they store it as an integer. A float is received for Google Play Services.

**In Blueprints:**

The example below is from the **Global Game Instance** Blueprint in the Unreal Match 3 sample game. Once the achievements are cached, we run through a loop pulling achievement names, as well as their target scores, from arrays, and do a quick comparison to any offline values found. We then accept the higher value of the service or the local values:

## Writing Values to your Achievements

The **Write Achievement Progress** will send a message up to the platform's achievement system to write a percentage (0.0% - 100.0%) based **Progress** to the provided achievement for the given user (**Player Controller** and **User Tag**). For "one off" achievements you will always pass in `100.0` for **Progress**, while for incremental achievements, you'll be passing in some lesser percentage until the user reaches `100.0` for that achievement.

For iOS Game Center, this value is actually sent as an integer, as they only have 1-100 incremental achievements. A float is sent for Google Play Services.

Note that it is a **latent** node, and thusly has a number of execution output pins. The top most is a "pass through," that works like any other execution output pin. The other two pins (**On Success**, and **On Failure**) will execute when the online service returns (or fails to return) a value. When the execution returns a success the **Written Achievement Name**, **Written Progress**, and **Written User Tag** will return non-null values equal to what you passed into the node.

**In Blueprints:**

The example below is from the **Global Game Instance** Blueprint in the Unreal Match 3 sample game. There's a loop that compares the current achievement value to the metrics required to increase that achievement, and if progress has been made, the **Write Achievement** event is called:

This was done because latent nodes can't be used in Functions.

## Showing the Platform Specific Achievement Screen

The **Show Platform Specific Achievement Screen** will show the achievements of the provided **Player Controller** for the current platform.

**In Blueprints:**

The example below is from the **GameOverButtons** Blueprint Widget in the Unreal Match 3 sample game. When the **ShowAchievements** button is pressed, the game will attempt to show the achievement screen for the current platform.

- blueprints
- mobile
- achievements
- android
- services
- platform delivery

On this page

- Configuration (-> using-google-play-achievements-in-unreal-engine-projects)
- Caching your Achievements (-> using-google-play-achievements-in-unreal-engine-projects)
- Reading Values from your Achievements (-> using-google-play-achievements-in-unreal-engine-projects)
- Writing Values to your Achievements (-> using-google-play-achievements-in-unreal-engine-projects)
- Showing the Platform Specific Achievement Screen (-> using-google-play-achievements-in-unreal-engine-projects)
