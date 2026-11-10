# Connecting Unreal Engine to Motionbuilder with Live Link

https://dev.epicgames.com/documentation/en-us/unreal-engine/live-link-stream-motionbuilder-to-unreal-engine?application_version=5.9

> Connect Unreal Engine to Autodesk Motionbuilder with the Live Link Plugin.

Using Live Link, you can stream content from MotionBuilder into Unreal Engine in real time, in order to preview your content in Unreal without needing to export and import. There are also a variety of settings for controlling the session's IP address and casting.

 [image: motionbuilder live link unreal]

This document provides an overview of how to set up a Live Link session between MotionBuilder and Unreal Engine, as well as the settings available to you.

#### Prerequisites

- You have read **Live Link (-> live-link-in-unreal-engine)** and have enabled the **Live Link** plugin. [image: live Link plugin]

- You have a Skeletal Mesh Actor for use in Unreal Engine and MotionBuilder. If you do not have one, then you can create a project using the Third Person Template, and **Export the SK_Mannequin** (-> working-with-assets-in-unreal-engine) Skeletal Mesh to FBX in order to **Import to MotionBuilder**

- You can optionally **Characterize** your character in MotionBuilder in order to use the Control Rig.

## MotionBuilder Setup

Follow these steps to set up Unreal Live Link in MotionBuilder and begin broadcasting a Live Link signal.

### Install Plugin

You will need to download and install the MotionBuilder Live Link plugin. To do this, first using this link: GitHub - ue4plugins/MobuLiveLink: Plugin for MotionBuilder that send data to Unreal Engine.

On that page, click *Releases**.

 [image: MotionBuilder Live Link plugin GitHub page Releases link]

You can now choose the plugin version appropriate for whatever version of Motionbuilder you are currently using. Download the file, and extract it at a convenient location.

 [image: MotionBuilder Live Link plugin release versions list]

Now you will assign the plugin path to MotionBuilder. In MotionBuilder, click **Settings > Preferences** in the main menu bar to open the **Preferences** window, and navigate to the **SDK **category. Click **Add** then browse to the location of the extracted folder containing your MotionBuilder plugin. Restart MotionBuilder afterward.

 [image: install motionbuilder plugin]

After restarting MotionBuilder, you should now see the **UE - LiveLink** entry in the **Devices **category of the **Asset Browser** tab.

 [image: UE LiveLink devices]

### Broadcast Live Link

Ensure your MotionBuilder scene contains the characters you want to use, then drag the **UE - LiveLink** plugin into the viewport.

 [image: drag drop plugin]

This will open up the **Live Link Connection** window, which you can find under the **Devices **section of the **Navigator**.

 [image: motionbuilder live link window]

Click the **Subject Selector (...)** button, expand and select your character's **Root Bone**, then click **Add**. You must ensure the selected root bone also matches the root (top-most) bone from the imported **Skeleton (-> skeletons-in-unreal-engine)** in your project.

 [image: add live link subject]

This will add your character as a **Subject** to stream over to Unreal Engine. You can optionally enable **Stream Viewport Camera**. This will make MotionBuilder's camera streamed as a Live Link subject to Unreal Engine, from which you can select it as a source to drive the editor camera.

 [image: stream viewport camera]

You can optionally rename your Subject by editing the **Subject Name** field. This will help distinguish it in the Live Link broadcast.

 [image: live link subject name]

Click the button next to **Online **to enable content streaming. The Online status button will change from **red (Offline)** to **green (Online)**. At this point, MotionBuilder is now broadcasting a Live Link signal.

 [image: live link online]

When MotionBuilder loses focus and becomes a background application, its performance will be throttled, which could lead to stuttering during the streaming process. To prevent this from occurring, enable the **Always refresh viewer** option, located in the Navigator's **System **menu.

 [image: always refresh viewer]

## Unreal Engine Setup

Follow these steps to connect Unreal Engine to your MotionBuilder Live Link broadcast, in order to preview the connection on a character.

### Setup Connection

With MotionBuilder running in the background, open Unreal Engine and select **Window > Live Link** from the main menu bar. This will open the **Live Link Connection Window**, which will enable you to connect to the running instance of MotionBuilder.

 [image: live link connection window]

Click the **+ Source** button, then select your MotionBuilder broadcast signal from **Message Bus Source**.

 [image: live link]

The Connection Window will update to show the connected Source Type, Subjects, and Status.

 [image: live link connected]

Refer to the **Live Link Overview (-> live-link-in-unreal-engine)** page for more information on Live Link **Options**, **Roles** and **Status Indicators**.

### Preview Live Link

You can now preview the Live Link connection on your character. Open your character's **Skeletal Mesh** asset from the **Content Browser**.

 [image: skeletal mesh]

In the **Preview Scene Settings** tab, set the following properties:

- Preview Controller: **Live Link Preview Controller**

- Subject Name:** Subject name from MotionBuilder **

- Enable Camera Sync: **Enabled**

 [image: skeletal mesh live link preview]

Your MotionBuilder Subject is now connected to this window and will stream data. The MotionBuilder viewport will also stream to this view if **Enable Camera Sync** and **Stream Viewport Camera** are enabled from MotionBuilder.

 [image: skeletal mesh live link preview]

You can alternatively use **Blueprint functions (-> using-live-link-data-in-unreal-engine)** to establish a connection instead of manually connecting through the Live Link window. Instead of using a Preview Controller, you can also use a **Live Link Component (-> live-link-in-unreal-engine)** attached to an Actor, or the **Live Link Pose** node in an Animation Blueprint.

## MotionBuilder Settings

The MotionBuilder Live Link Plugin contains various advanced settings for controlling your Live Link casting behavior. To access these settings, click the **Settings **tab in the **Live Link Connection** window.

 [image: motionbuilder settings]

### Linking to Other Machines

By default, using Live Link to connect MotionBuilder to Unreal Engine works as long as the session is running on the same device. If you are on a local area network where multiple devices are being used, and you want to broadcast to a different device, then you will need to use **Unicast **and **Static Endpoints** with explicit Local **IPv4 Addresses** set on them.

The **Unicast Endpoint** can be considered as one end of the Live Link bridge, whereas **Static Endpoints** are the other end of the bridge. Together they form an active Live Link connection.

To set up a Unicast Endpoint, copy your **IPv4 Address** into the **Unicast Endpoint** property. To get your IPv4 Address, you can type "ipconfig" into a **Windows Command Prompt** window to view and copy it. You must also specify a **port number** at the end of the address.

 [image: unicast endpoint]

Port **6666 **is reserved and cannot be used for Motion Builder Unicast Endpoints.

In Unreal Engine, on the other receiving PC, open the **Project Settings (-> project-settings-in-unreal-engine)** window by clicking **Edit > Project Settings** and navigate to the **UDP Messaging** panel. In the **Transport **category, expand the advanced details and input the same address and port from the host machine's **Unicast Endpoint** in the **Static Endpoints** property.

 [image: static endpoint]

You should now be able to receive the remote Live Link source when adding sources to the Live Link Connection Window.

 [image: remote live link source]

The inverse of this process will work as well. You can instead set a **Unicast Endpoint** in the **UDP Messaging Project Setting** and set the **Static Endpoint in MotionBuilder**.

 [image: static unicast endpoint]

### Broadcast Satellites

Rather than a single MotionBuilder live link instance broadcasting to multiple Unreal Engine destinations at the same time, you can set up a single Unreal Engine receiver to re-broadcast the live link source to other machines. This can be useful if the live link source is located far away from all receivers, or has limited bandwidth.

 [image: unreal rebroadcast live link signal]

To enable this behavior, first select your live link **source** and **subject** in the **Live Link Connection Window** and enable **Rebroadcast Subject**.

 [image: rebroadcast subject]

The second checkbox associated with Rebroadcast Subject is used with Live Link Hub. You must select both checkboxes to enable Rebroadcast Subject.

Next, you will need to set a **Unicast Endpoint** in the **UDP Messaging Project Setting** on the machine that is performing the rebroadcast**.**

 [image: rebroadcast unicast endpoint]

Now when selecting Live Link sources from other machines, you can choose the re-broadcasted source from an Unreal Engine instance.

 [image: rebroadcast live link]

### Multicast

Multicast is an internet specification through which clients can participate in network communication. Multicast is represented using **Class D** addresses which are different from the standard class address space that you usually see in endpoint to endpoint communication. Multicast addresses range from 224.0.0.0 and to 239.255.255.255.

Clients can subscribe to the multicast group that tells the router, switch, or operating system that it is interested in multicast messages on that given IP. Unreal Engine uses multicast group **230.0.0.1** at port **6666**. On startup, Unreal Engine will transmit a signal to the network that it would like to join the 230.0.0.1:6666 multicast group. Any multicast message received with that specified IP and port will then be assigned to that Unreal Engine instance inbound socket for processing by the engine.

The purpose of the multicast address is to notify other Unreal Engine instances about the presence of other Unreal Engine instances on the network. This is done using a discovery message that is sent on the multicast socket. The discovery message will be received by the other instances and contained within that message is the specific IP or port that can be used to directly communicate with the Unreal Engine instance. Direct communication will then occur using this known endpoint (IP and port) and no further communication will occur over the multicast group. This is equivalent to manually adding the static endpoint. The multicast mechanism enables this automatically.

Typically most routers will not propagate multicast messages beyond the local area network (LAN) unless they are configured to do so. In most cases, you can only discover Unreal Engine instances on the same local area network.

Live Link is generally not aware of multicast communication when it is happening. All of this network communication occurs through the message bus and using UDP messaging. Live Link is made aware of the available endpoints through its interaction with the message bus and when sending its own discovery message over the message bus framework. All of the endpoints that have been discovered will be made available to Live Link as receivers and Live Link will send its discovery message to those receivers.

#### Change Multicast Range

If you want to change the multicast range group, it will need to be changed in both the **UDP Messaging Project Settings** and the **Live Link plugin Engine.ini** file.

You can locate **Multicast Endpoint** in the UDP Messaging Project Setting.

 [image: multicast]

- live link
- motionbuilder

On this page

- Prerequisites (-> live-link-stream-motionbuilder-to-unreal-engine)
- MotionBuilder Setup (-> live-link-stream-motionbuilder-to-unreal-engine)
- Install Plugin (-> live-link-stream-motionbuilder-to-unreal-engine)
- Broadcast Live Link (-> live-link-stream-motionbuilder-to-unreal-engine)
- Unreal Engine Setup (-> live-link-stream-motionbuilder-to-unreal-engine)
- Setup Connection (-> live-link-stream-motionbuilder-to-unreal-engine)
- Preview Live Link (-> live-link-stream-motionbuilder-to-unreal-engine)
- MotionBuilder Settings (-> live-link-stream-motionbuilder-to-unreal-engine)
- Linking to Other Machines (-> live-link-stream-motionbuilder-to-unreal-engine)
- Broadcast Satellites (-> live-link-stream-motionbuilder-to-unreal-engine)
- Multicast (-> live-link-stream-motionbuilder-to-unreal-engine)
- Change Multicast Range (-> live-link-stream-motionbuilder-to-unreal-engine)
