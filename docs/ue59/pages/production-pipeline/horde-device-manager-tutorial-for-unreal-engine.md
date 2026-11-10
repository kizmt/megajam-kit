# Horde Device Manager Tutorial

https://dev.epicgames.com/documentation/en-us/unreal-engine/horde-device-manager-tutorial-for-unreal-engine?application_version=5.9

> A tutorial for using the Horde device manager with Unreal Engine.

[image: Horde Device Manager Tutorial]

## Introduction

Horde includes a device manager (-> horde-devices-for-unreal-engine) for maintaining mobile and console development kit resources. Managed devices are reserved by automated tests using a simple REST api. Additionally, devices may be partitioned into user pools that support checkouts of shared remote devices for manual testing and development.

The device manager includes a dashboard UI which makes it easy to administer and monitor devices. Device usage generates telemetry which can be viewed to help allocate and schedule tests. The Horde device manager is used extensively at Epic and is battle tested with features such as automatic problem reporting, kit rollover on errors, and integration with Slack.

While the device manager is integreated with Horde build automation (-> horde-build-automation-for-unreal-engine), it is possible to use it in isolation via the REST api.

## Prerequisites

- Horde Server and an Android phone or tablet (see the Horde Installation Tutorial (-> horde-installation-tutorial-for-unreal-engine)).

## Steps

- Navigate to the Device management view on the Horde dashboard [image: Device Navigation]

- The example Horde configuration includes a definition for the Android platform. It also defines a shared and automation pool which devices can be partioned into for user checkouts and automated testing respectively. ```
     "devices": {
     "platforms": [
         {
         "id": "android",
         "name": "Android"
         }
     ],
     "pools": [
         {
         "id": "ue5",
         "name": "UE5",
         "poolType": "Automation"
         },
         {
         "id": "remote-ue5",
         "name": "Remote UE5",
         "poolType": "Shared"
         }
     ]
     }
``` "devices": { "platforms": [ { "id": "android", "name": "Android" } ], "pools": [ { "id": "ue5", "name": "UE5", "poolType": "Automation" }, { "id": "remote-ue5", "name": "Remote UE5", "poolType": "Shared" } ] } Click Add Device and fill out the new device form including the devices IP. Select the example UE5 automation pool to assign the device for this workload. [image: New Device] Once saved, the Android device will be added and available for work. The device can also be edited, maintenance notes applied, and historical job details viewed. [image: Device Added]

- Optionally repeat step 2 selecting a shared pool instead for the device. This will populate the Shared device pivot, making that device available for users to check out.

- horde
- bronze

On this page

- Introduction (-> horde-device-manager-tutorial-for-unreal-engine)
- Prerequisites (-> horde-device-manager-tutorial-for-unreal-engine)
- Steps (-> horde-device-manager-tutorial-for-unreal-engine)
