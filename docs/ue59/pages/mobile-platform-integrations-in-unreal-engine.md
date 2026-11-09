# Mobile Platform Integrations

https://dev.epicgames.com/documentation/en-us/unreal-engine/mobile-platform-integrations-in-unreal-engine?application_version=5.9

> Implement common mobile services, such as achievements, notifications, and in-app purchases.

[image: Mobile Platform Integrations]

Mobile applications rely on **platform services** (sometimes called **platform features**) to extend what a game can do outside of the game itself. These are capabilities that iOS, Android, and their app stores provide to your app:

- Player achievements and leaderboards to drive engagement.
- In-game ads to deliver monetized content.
- In-app purchases to connect players to the storefront.
- Local notifications to reach players through the OS.

To integrate these services into an Unreal Engine project, you can configure mobile **plugins** to connect Unreal Engine to the native SDKs that Google Play and Apple Game Center provide. These plugins are self-contained packages that wrap a third-party SDK and expose its functionality to your Blueprints and C++ code.

To wire plugins into the native Android or iOS build, Unreal Engine uses the **Unreal Plugin Language (UPL)**. UPL is an XML-based scripting system that lets plugins declare their platform-specific build requirements, such as adding permissions to an Android manifest, injecting Gradle dependencies, or linking iOS frameworks at package time.

The guides in this section cover integrating these platform services into your Unreal Engine projects.

- [image: Unreal Plugin Language] Unreal Plugin LanguageUPL is a simple XML-based language for manipulating XML and returning strings. (-> using-the-unreal-plugin-language-for-mobile-projects-in-unreal-engine)
- [image: Using In-App Purchases] Using In-App PurchasesUsing in-app purchases to offer additional paid content for your game. (-> using-inapp-purchases-in-unreal-engine-projects-for-mobile-devices)
- [image: Using In-Game Ads] Using In-Game AdsUsing in-game advertisements to monetize your game. (-> using-in-game-ads-in-unreal-engine-projects-on-mobile-platforms)
- [image: Using Mobile Service Achievements] Using Mobile Service AchievementsUsing Mobile Achievements to increase player engagement. (-> using-achievements-in-mobile-applications-in-unreal-engine)
- [image: Using Mobile Service Leaderboards] Using Mobile Service LeaderboardsUsing Mobile Service Leaderboards in your game. (-> using-mobile-service-leaderboards-in-unreal-engine-projects-for-mobile-devices)
- [image: Local Notification For Android and iOS] Local Notification For Android and iOSProduct documentation including reference and guides for Unreal Engine 4 (-> local-notifications-for-android-and-ios-in-unreal-engine)

- platform delivery

Related documents

Android Support

 [image: Android Support] (-> android-support-for-unreal-engine)iOS, iPadOS, and tvOS

 [image: iOS, iPadOS, and tvOS] (-> ios-ipados-and-tvos-support-for-unreal-engine)Using In-App Purchases on iOS

 [image: Using In-App Purchases on iOS] (-> how-to-use-inapp-purchases-in-unreal-engine-projects-on-ios)
