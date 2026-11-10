# Virtual Camera Multi-User Quick-Start Guide

https://dev.epicgames.com/documentation/en-us/unreal-engine/virtual-camera-multiuser-quickstart-guide-in-unreal-engine?application_version=5.9

> Use Switchboard to connect multiple users to simultaneously operate Virtual Cameras.

[image: Virtual Camera Multi-User Quick-Start Guide]

You can use a **Multi-User** **Virtual Camera **(**VCam**) workspace to control and render Vcams in the same scene using multiple workstations. This lets multiple users simultaneously work on the same scene. **Multi-User Vcam **Multi-User Actor Replication feature, which is in beta.

Multi-User Vcam can only be used in Virtual Production projects.

This document provides an example workflow, which you can use to set up a connected work environment that enables multiple users (-> multi-user-editing-in-unreal-engine) to operate VCams (-> BlueprintAPI) in the same scene simultaneously.

#### Prerequisites

- Enable the **Multi-User Editing** Plugin (-> plugins-in-unreal-engine). In the **Menu Bar**, navigate to **Edit** > **Plugins**, and locate the **Multi-User Editing** plugin under the **Editor** section. Alternatively, you can use the **Search Bar**. After enabling the plugin, restart the editor.

[image: The Plugins window showing the Multi-User Plugin]

- You must have a functional **Virtual Production** project. If you do not have one, you can use the Template (-> working-with-projects-and-templates-in-unreal-engine) project.
- You must have a **Multi-User Editor Server**. For more information, refer to the Multi-User Quick Start Guide (-> multi-user-editing-in-unreal-engine).
- Your project must have a Virtual Camera (VCam) Actor (-> controlling-a-virtual-camera-actor-using-live-link-in-unreal-engine).

#### Launching an MU Session

Replication of a virtual camera between instances of Unreal Engine uses Multi-User Editing. All clients must be in a shared Multi-User (MU) session. For more information on joining an MU, session see Multi-User Editing in Unreal Engine (-> multi-user-editing-in-unreal-engine)

#### Replicating a VCam Actor

When a VCam actor is added to the scene in an MU session, the actor is displayed in the editor on every client. This is because no client has declared that it is the author of the VCam’s properties.

To declare authorship over a VCam, tap or click the **Multi User **button in the lower left corner of the VCam. This disables the output providers and modifier stack evaluation on the other clients, which hides the HUD and ensures that this client determines the values used by the Vcam. Tapping again relinquishes authorship and enables the output providers, HUD, and modifiers on every client so that a new client can claim authorship.

#### Recording Remotely

To record a Virtual Camera on a machine other than its host machine, you must add its respective Record Camera (named [VCamActorName]_Record) to Take Recorder (-> record-gameplay-in-unreal-engine), rather than the VCamActor itself.

## Legacy Roles for MU

The legacy Virtual Camera Multi-User workflows are deprecated, but still function in Unreal Engine 5.4.

This workflow does not support new, high-frequency replication

This section provides an example workflow for using the legacy system for limited, low-frequency virtual camera operation in Multi-User mode.

#### Prerequisites

- Enable the **Switchboard** Plugin (-> plugins-in-unreal-engine). In the **Menu Bar**, navigate to **Edit** > **Plugins** and locate the **Switchboard** plugin under the **Virtual Production** section. Alternatively, you can use the **Search Bar**. After enabling the Plugin, restart the editor.

[image: image alt text]

You can access the Switchboard application using the Icon in the Unreal Engine Toolbar, after the plugin has been successfully installed.

[image: image alt text]

- You must have a functional **Virtual Production** project. If you do not have one, you can use the Template (-> working-with-projects-and-templates-in-unreal-engine) project.
- You must have a **Multi-User Editor Server**. For more information, refer to the Multi-User Quick Start Guide (-> multi-user-editing-in-unreal-engine).
- Your project must have a Virtual Camera (VCam) Actor (-> controlling-a-virtual-camera-actor-using-live-link-in-unreal-engine).

## Declare Virtual Production Roles

The **Switchboard** application requires each user to occupy a **VP Role**, such as an **Editor** or **Render**, to differentiate and identify which user is associated with which VCam Actor.

- On your primary workstation in the Unreal Editor, navigate to the Toolbar, and select the **VP Roles**, then select (**+**) **Add Role** from the drop-down menu. Give the new role a name. In this workflow example the primary workstation is named Editor.
- Using the same steps, add a second **Role** for your secondary device to occupy. In this workflow example, the secondary workstation is named Render.
- In the **Menu Bar**, navigate to** Edit** > **Project Settings**, and under the** Multi-User Editing** section,set the **Validation Mode** property to **Soft**, using the drop-down menu.

If your project contains any dirty packages, an error prompt displays when you join a multi-user session. You then have the opportunity to cancel the connection or to fix any present issues. If you choose to proceed any dirty packages will be deleted.

Your project is now ready to connect other devices using Switchboard for multiple users to operate VCams simultaneously in the same scene.

For more information about connecting multiple users using the **Switchboard** plugin, refer to the Switchboard (-> switchboard-in-unreal-engine) and the Switchboard Quick-Start Guide (-> switchboard-quick-start-for-unreal-engine) documentation.

## Connect Your Devices

After creating your VP Roles in the Unreal Editor, use the Switchboard application to connect your devices to the Multi-User session.

- In the Toolbar, click the options menu next to the Switchboard button, and select **Launch Switchboard Listener.**[image: image alt text]
- In the Toolbar, launch the **Switchboard application**.[image: image alt text]
- In the **Add Device** drop-down, select **Unreal**. This creates a new Switchboard Device, which represents the primary workstation.[image: image alt text]
- In the provided field, set the **Name** and **IP Address** for the primary work station. The name must be the same name as the primary workstation role set in Unreal Engine. This workflow example uses **Editor** as the name.[image: image alt text]
- Repeat steps 1-3 to create a second Switchboard Device. For the second device, use the same name as the second workstation's role. Both devices should now be listed in the Switchboard application, in the **Unreal Devices** list. This workflow example uses the name **Render**.[image: image alt text]
- To automatically open a network connection and to connect a device to the Multi-User Editor session, select the **Auto-Join** and **Network Connection** icons for each device in the **Unreal Devices** list. When a device successfully connects to the network, the **Connection Indicator** appears blue.[image: image alt text]
- Assign a **VP Role** to each connected device. In the Switchboard's** Menu Bar**, navigate to **Settings** > **Settings**, and scroll down to each connected device's section. In the **Roles** property, select one of the Unreal Engine **VP Roles**, for each device, using the drop-down menu.[image: image alt text]

You can open a **Network Connection** and enable **Auto-Join** for every listed device by using the **Auto-Join** and **Network Connection** icons in the Unreal Device's list header.

[image: image alt text]

With your workstations connected, and their roles assigned, you can now launch each device and start operating VCams in a Multi-User environment.

## Multi-User Virtual Camera Operation

- To connect your primary workstation to the multi-user session, open the Switchboard application, go to the **Unreal Devices** list, locate the primary **Editor** device, and click the **Launch**.[image: image alt text]Once your project has launched, you can verify that the editor is connected to the multi-user session in the **Multi-User Browser** window. You can open the Multi-User Browser in the Menu bar, navigating to **Window** > **Multi-User Browser**.[image: image alt text]
- In the **World Outliner**, select the** VCamActor**.
- Select the **VCam component** in the VCam actor's **Details** panel.
- Set the **Role** property to **Edit** in the **Virtual Camera** properties section and select the **Editor** VP Role from the drop down menu.[image: image alt text]
- Enable the Virtual Camera by toggling the **Enabled** property.
- In the Switchboard application, launch the **Render** device by clicking the **Launch** icon. Following the steps above, verify that the secondary** Render **device is also connected to the multi-user session, using the **Multi-User Browser** window.
- Now that both editor instances are open, move the **Virtual Camera** on the primary **Editor** device and see the changes replicated in the secondary **Render** device in real time. In the example below the **Editor** device (**Left**) is operating a **VCam Actor** and the **Render **device (**Right**) is receiving the changes and rendering the scene.

- getting started
- virtual camera
- switchboard
- working with media

On this page

- Prerequisites (-> virtual-camera-multiuser-quickstart-guide-in-unreal-engine)
- Launching an MU Session (-> virtual-camera-multiuser-quickstart-guide-in-unreal-engine)
- Replicating a VCam Actor (-> virtual-camera-multiuser-quickstart-guide-in-unreal-engine)
- Recording Remotely (-> virtual-camera-multiuser-quickstart-guide-in-unreal-engine)
- Legacy Roles for MU (-> virtual-camera-multiuser-quickstart-guide-in-unreal-engine)
- Prerequisites (-> virtual-camera-multiuser-quickstart-guide-in-unreal-engine)
- Declare Virtual Production Roles (-> virtual-camera-multiuser-quickstart-guide-in-unreal-engine)
- Connect Your Devices (-> virtual-camera-multiuser-quickstart-guide-in-unreal-engine)
- Multi-User Virtual Camera Operation (-> virtual-camera-multiuser-quickstart-guide-in-unreal-engine)

Related documents

Multi-User Editing in Unreal Engine

 [image: Multi-User Editing in Unreal Engine] (-> multi-user-editing-in-unreal-engine)
