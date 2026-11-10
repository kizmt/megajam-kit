# Steam Deck Quick Start

https://dev.epicgames.com/documentation/en-us/unreal-engine/steam-deck-quick-start-in-unreal-engine?application_version=5.9

> Get started with Steam Deck development in Unreal Engine

This quick-start guide shows you how to build and run an Unreal Engine project on the Valve Steam Deck.

After completing this guide you will be able to:

- Pair a Steam Deck to your development system.

- Add a Steam Deck device to Unreal Engine.

- Run an Unreal Engine project on your Steam Deck.

Unreal Engine currently supports deploying to a Steam Deck from the Windows editor.

Requirements:

To build Unreal Engine projects for Steam deck you need:

- A Steam Deck

- The SteamOS Devkit client

## Initial Steam Deck Setup

Before pairing your Steam Deck, ensure the system software is up to date by navigating to **Steam > Settings > System > Software Updates** on your Steam Deck.

## Initial Pairing Setup

Before deploying your project, you need to pair your Steam Deck to your development machine.

- Install the SteamOS Devkit Client and open it on your development machine.

- Make sure your Steam Deck is connected to the same network as your development machine.

- Once connected, on your Steam Deck go to **Steam > System > Network Settings** and make a note of your Steam Deck's IP Address.

- On your Steam Deck, go to **Settings > System** and select **Enable Development**** Mode** under the System Settings section.

- On your Steam Deck, go to **Settings > Developer** and select **Pair New Host **under the **Development Kit** section to begin the pairing process.

- In the SteamOS Devkit Client, under the **Devkit** tab, enter the IP of your Steam Deck in the **Connect to Steam Deck by IP** box, then click **Connect**. [image: The SteamOS Devkit interface]

- On your Steam Deck, approve the pairing request from your PC to complete the pairing process.

## Add a Steam Deck Device to Unreal Editor

After you have paired your device, you need to update an Engine.ini file to add your Steam Deck to Unreal Editor.

- Open any `Engine.ini` file (for example, `Engine/Config/BaseEngine.ini`) in a text editor.

- After opening the `Engine.ini` file, add a line to the file for each Steam Deck you want to connect, following the format below:

Engine.ini example

```
	[SteamDeck]
	+SteamDeckDevice=(IpAddr=192.168.0.10,Name=MySteamDeck,UserName=deck)
```

- **IpAddr (Required) **- The IP Address of your Steam Deck

- **Name (Optional) **- The name you want Unreal Engine to display for this Steam Deck

- **Username (Required) **- The username must always be 'deck' for Steam Decks connected to Unreal Engine.

After you have edited your `Engine.ini` file, restart Unreal Editor. You can then find your Steam Deck under the **Platforms **context menu

 [image: The platform selection screen in Unreal Editor]

To launch your Unreal Engine project on your Steam Deck, go to the **Platforms** context menu then find and select your Steam Deck. Unreal Engine then launches your project on your Steam Deck.
