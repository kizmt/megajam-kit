# Set Up the SteamVR Chaperone

https://dev.epicgames.com/documentation/en-us/unreal-engine/set-up-the-steamvr-chaperone-in-unreal-engine?application_version=5.9

> Setting up the SteamVR Chaperone system in Unreal Engine.

The SteamVR Chaperone component is used to display to the user where the soft and hard bounds of the VR interaction area are. In the following How - To we will take a look at how to add the SteamVR Chaperone to any UE4 VR Pawn.

It is **NOT** possible nor advisable to disable the Chaperone system from inside UE4. You can, however, adjust how UE4 will react to the user getting close to the boundaries.

## Steps

To add the SteamVR Chaperone system to your UE4 player pawn, you will need to do the following:

- Open up your projects player Pawn Blueprint and make sure the **Components** tab is visible.

- Click on the **Add Component** button and from the displayed list search for the **Steam VRChaperone** component and when located, click on it to add it to the Component list.

- When completed, your player pawn should look like the following image.

## End Result

Now, launch your project in VR and put on your Vive HMD and when you approach the bounds of your VR interaction area you should see something similar to the following video:

## UE4 Project Downloads

Below you will find a link to where you can download the UE4 project that was used to create this example.

- **SteamVR Chaperone Set Up Project**
