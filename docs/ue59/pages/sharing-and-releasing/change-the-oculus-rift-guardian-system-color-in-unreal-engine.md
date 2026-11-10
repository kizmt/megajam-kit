# Change the Oculus Rift Guardian System Color

https://dev.epicgames.com/documentation/en-us/unreal-engine/change-the-oculus-rift-guardian-system-color-in-unreal-engine?application_version=5.9

> Changing the color of the Rift Guardian system.

Skill_family: Tutorial Level 2
Version: 5.0
Parent: sharing-and-releasing-projects/xr-development/supported-xr-platforms/developing-for-oculus/OculusHowTo
Order: 2
tags: Oculus
topic-image:sharing-and-releasing-projects/xr-development/supported-xr-platforms/developing-for-oculus/OculusHowTo/GuardianSystem\HTGuardian_System_Topic_Image.png
prereq:sharing-and-releasing-projects/xr-development/supported-xr-platforms/developing-for-steamvr/HowTo/StandingCamera
prereq:sharing-and-releasing-projects/xr-development\MotionController
prereq:sharing-and-releasing-projects/xr-development/supported-xr-platforms/developing-for-oculus/OculusHowTo/GuardianSystem

The Oculus Guardian system is used to display the boundaries of the VR interaction area. As a tracked device approaches the boundaries, the Oculus Runtime automatically provides visual cues notifying the user of this. In the following tutorial we will take a look at changing the color the Oculus Guardian system uses to display the VR interaction area.

For the Guardian system to work, you will need to make sure you have set it up using the Oculus App. For more information on how to do this, please see the official Oculus Guardian System Setup pages.

It is **NOT** possible nor advisable to disable the Guardian system from inside UE. You can, however, adjust how UE will react to the user getting close to the boundaries.

## Steps

Make sure that your Pawn has an **OculusRiftBoundary** added to it or the following will not work. If you are not certain how to do this, please see the Setting Up Guardian System (-> set-up-the-oculus-rift-guardian-system-in-unreal-engine) pages for more information on how to do this.

- Create a new **Variable** called **Oculus Rift Boundary Color** and set its type to **Linear Color** and its color to **Red**.

- In the **Event Graph** add a **Event Begin Play** and **Set Tracking Origin** node. Make sure that the Set Tracking Origin node has had its **Origin** set to **Floor Level** and then connect the Event Begin Play to the Set Tracking Origin node.

- Right - click on the Event Graph and from the menu search for **Set Outer Boundary Color**, clicking on it to add it to the graph.

- Drag both the **Oculus Rift Boundary Color** variable and the **Oculus Rift Boundary** component into the Event Graph. Connect the Oculus Rift Boundary Color variable to in the **In Boundary Color** on the Set Boundary Color node and connect the Oculus Rift Boundary to the **Target** input.

- Connect the output of the Set Tracking Origin node to the input of the Set Outer Boundary Color node and when completed your Event Graph should look like the following. Click for full image.

## End Result

Now when you run the level and put the Oculus Rift on when the boundary is displayed, it will be the color you set in the Oculus Rift Boundary Color variable.

## UE Project Downloads

Below you will find a link to where you can download the UE project that was used to create this example.

- **Oculus Rift Guardian System Example Project**
