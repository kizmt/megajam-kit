# Using Steam Sockets

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-steam-sockets-in-unreal-engine?application_version=5.9

> How to enable the Steam network protocol layer for Unreal Engine projects.

[image: Using Steam Sockets]

###### Prerequisite topics

In order to understand and use the content on this page, make sure you are familiar with the following topics:

- Plugins (-> plugins-in-unreal-engine)
- Configuration Files (-> configuration-files-in-unreal-engine)

In Unreal Engine 4.27.0, an issue with the `FUniqueNetIdSteam` structure prevented Steam Sockets from creating successful connections. This issue is fixed in 4.27.2 and later.

**Steam Sockets** is a networking plugin that takes advantage of the new Steam network protocol layer, which **Unreal Engine** supports as of **Steamworks SDK** version 1.46.

Compared with the previous SteamNetworking protocol, this plugin provides improved security and reliability using Steam's communication network, with built-in DDoS protection, end-to-end encryption, and NAT traversal. Steam Sockets also provides **ping calculation** for listen servers, which can be used by matchmaking systems to match users to servers with better performance. This is a significant improvement over SteamNetworking, which could not provide ping calculation until users were already connected to a server.

Steam Sockets uses its own net driver in place of Unreal Engine's default net driver, and builds created with Steam Sockets enabled can only connect with other builds using Steam Sockets. Additionally, Steam Sockets builds can support cross-platform play between Windows, Mac, and Linux, but not with other devices.

## Enabling the Steam Sockets Plugin

Steam Sockets can be enabled for Windows, Mac, and Linux-based builds with the following steps:

- Open your project in **Unreal Editor** and click **Edit** > **Plugins**.

- In the **Plugins Menu**, click the **Networking** plugins group under **Built-in Plugins**.

- Locate the **Steam Sockets** plugin and click **enabled**. You will need to restart Unreal Editor for the changes to take effect.

 [image: Steam Sockets Plugin]

- Open the **Engine.ini** files for each platform that you want to use the Steam Sockets plugin, and change the **Net Driver Definitions** to use `SteamSockets.SteamSocketsNetDriver`. As an example, if you are enabling Steam Sockets for a Windows build, you would add the following to **WindowsEngine.ini**:

WindowsEngine.ini

```
[/Script/Engine.GameEngine]
!NetDriverDefinitions=ClearArray
+NetDriverDefinitions=(DefName="GameNetDriver",DriverClassName="/Script/SteamSockets.SteamSocketsNetDriver",DriverClassNameFallback="/Script/SteamSockets.SteamNetSocketsNetDriver")
```

[/Script/Engine.GameEngine]
!NetDriverDefinitions=ClearArray
+NetDriverDefinitions=(DefName="GameNetDriver",DriverClassName="/Script/SteamSockets.SteamSocketsNetDriver",DriverClassNameFallback="/Script/SteamSockets.SteamNetSocketsNetDriver")

Any builds targeting devices outside of Windows, Mac, and Linux will strip Steam Sockets before packaging and default to UE4's standard network protocol.

If you are targeting a platform outside of Steam on any of those OSes, such as the Oculus store on Windows, the build will still package with Steam's net driver, which will be incorrectly set for that platform. You will need to account for this by configuring your project appropriately for builds distributed on different PC-based platforms.

## Using Steam Sockets Features

Steam Sockets can be customized with config parameters for enabling and disabling large-scale functionality.

`OnlineSubsystemSteam.bUseSteamNetworking` controls whether SteamSockets SocketSubsystem is the default subsystem or not. This parameter is set to true by default. Most projects will not need to change this setting, and it is mainly available as a backward-compatibility option for developers migrating from the previous SteamNetworking protocol.

`OnlineSubsystemSteam.bAllowP2PPacketRelay` controls whether or not packets should tunnel through the Steam communication network when using a dedicated server. This parameter is set to true by default. When this setting is disabled, dedicated servers expose their connection addresses directly, enabling custom implementation. When this setting is enabled, dedicated servers function over Steam's relay network, which insulates them from DDoS attacks and provides improved security. P2P listen servers always use Steam's communication network regardless of this setting.

Other functionality, including ping calculation, is provided through existing network interfaces in UE4.

For additional information about the Steamworks SDK, refer to Valve's official documentation.

- plugins
- steam
- online subsystem
- advanced
- networking

On this page

- Enabling the Steam Sockets Plugin (-> using-steam-sockets-in-unreal-engine)
- Using Steam Sockets Features (-> using-steam-sockets-in-unreal-engine)
