# Using Mobile Service Leaderboards

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-mobile-service-leaderboards-in-unreal-engine-projects-for-mobile-devices?application_version=5.9

> Using Mobile Service Leaderboards in your game.

[image: Using Mobile Service Leaderboards]

Leaderboards enable you to track and display high scores for players on a per-platform basis. This lets players compete for bragging rights and helps to build community.

 [image: iOS Game Center]

 [image: Google Play]

## Configuration

See the appropriate platform-specific page below for details on configuring leaderboards for each platform:

- Using Google Play Services Leaderboards (-> using-google-play-services-leaderboards-in-unreal-engine-projects)

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

- blueprints
- mobile
- leaderboards
- services
- platform delivery

On this page

- Configuration (-> using-mobile-service-leaderboards-in-unreal-engine-projects-for-mobile-devices)
- Reading from a Leaderboard (-> using-mobile-service-leaderboards-in-unreal-engine-projects-for-mobile-devices)
- Writing to a Leaderboard (-> using-mobile-service-leaderboards-in-unreal-engine-projects-for-mobile-devices)
- Showing the Platform Specific Leadboard (-> using-mobile-service-leaderboards-in-unreal-engine-projects-for-mobile-devices)
