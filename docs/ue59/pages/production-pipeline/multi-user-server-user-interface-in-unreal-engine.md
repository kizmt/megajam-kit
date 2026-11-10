# Multi-User Server User Interface

https://dev.epicgames.com/documentation/en-us/unreal-engine/multi-user-server-user-interface-in-unreal-engine?application_version=5.9

> A breakdown of the Multi-User Server user interface.

[image: Multi-User Server User Interface]

Learn to use this **Beta** feature, but use caution when shipping with it.

A user interface was added to the **Multi-User Server** to inspect the running status of the server live. This enables operators and ICVFX stage managers to inspect, monitor, and diagnose problems during Multi-User Server operation.

This has benefits over the console server, which only provided a stream of connection information over a console command, and did not provide contextual information about the running server operation.

The console server is still available for operation on headless computers, or on computers where running a UI is not possible. For example, a Linux server or containerized operation.

## Building the Multi-User Server

The Multi-User Server program needs to be built in order to run. If you are using precompiled binary builds, the server should be pre-built, and available upon launching the Engine. If you are building Unreal Engine from Source, we recommend you use **UnrealGameSync** to build compiled versions of the server for both console and UI versions.

In UnrealGameSync you can build the server during the normal sync operation by enabling the options **Compile UnrealMultiUserServer** and **Compile UnrealMultiUserSlateServer**. The latter is the name of the new UI based server.

- Click **Options** in the bottom-right corner of the UnrealGameSync interface and select **Customize Commands.** [image: Customize Build UnrealGameSync]

- In the Modify Build Steps dialog, enable the checkbox next to **Compile UnrealMultiUserServer** and **Compile UnrealMultiUserSlateServer.** [image: Modify Build Steps UnrealGameSync]

## Enable the Multi-User Editing Plugin

To use the Multi-User Server, you must enable the **Multi-User Editing** plugin in your project.

- In the Editor go to **Edit** > **Plugins** to open the Plugin Browser.

- Search for "Multi-User" and enable the **Multi-User Editing** plugin. [image: Enable Multi-User Editing]

- Restart the Unreal Editor before you proceed.

## Change Settings to Launch UI Mode

After you enable the plugin you need to change the default server mode in the Multi-User Project Settings to make the plugin launch in UI mode.

- In the **Window** menu select **Multi-User Browser** to open the plugin interface. [image: Enable Multi-User Editing]

- Click the **Settings** gear icon in the upper-right corner of the **Multi-User Browser** window. This will open the Multi-User Editor plugin settings.

- Under **Client Settings**, change the **Server Type** property to **Slate** mode. [image: Enable Slate UI mode]

### Switchboard Support

Launching the Multi-User Server in UI mode is also supported in Switchboard. The Switchboard application launches Multi-User Server in UI Mode by default.

You can change this behavior by adjusting the global settings in the **Switchboard Settings** menu.

- In the Switchboard application menu go to **Settings** > **Settings**. [image: Switchboard Settings Menu]

- Scroll down to the **Multi User Server** section.

- Uncheck the box next to **Launch Multi-user server in UI mode** to disable the user interface version. Switchboard will now launch Multi-User Server sessions in Console mode. [image: Switchboard Settings Panel]

## Running the Multi-User Server

You can run a new server from the **Multi-User Browser** Editor panel, or from **Switchboard**.

### From Multi-User Browser

When the Multi-User Browser panel is open, the plugin will automatically search for available servers on the network.

You can launch a new server by clicking the **Launch a Server** button in the middle of the window, or the server icon on the left side of the toolbar.

 [image: Launch Multi-User Server]

The Multi-User Server UI opens in a new window.

 [image: Launch Multi-User Server]

### From Switchboard

In the Switchboard application click the **Multi-user Server** launch icon in the bottom-left corner of the window.

 [image: Launch Multi-User Server in Switchboard]

## Multi-User Server UI Overview

The Multi-User Server interface contains three regions.

 [image: Multi-User Server UI]

- Menu bar and Tabs.

- Sessions and Client information panels.

- Command Console and Output Log.

### Menu bar and Tabs

#### Window

The Window menu displays a context-sensitive list of browser windows available within the current UI tab (Sessions, Clients, or Active Session). You can use this list to restore windows that were previously closed.

 [image: Window Menu]

#### Debug

Under **Debug** > **View App Icons** you can summon an information key that describes all the icons in the Multi-User Server interface.

 [image: Multi-User Server Icon Key]

#### Tabs

Beneath the menu bar is a row of tabs which enable you to switch between the various UI panels in the Multi-User Server. The **Sessions** and **Clients** tabs are displayed by default. If you double-click an **Active** or **Archived Session**, a new tab panel will open containing detailed information about that session.

 [image: Multi-User Server UI Tabs]

### Command Console and Output Log

The Multi-User Server has an Output Log where you can review logs for information relevant to the operation of the server. You can find errors, warnings, and general diagnostic information that may assist you in troubleshooting the Multi-User Server operation.

 [image: Output Log Filters]

Several options are available under the Filters drop-down menu to limit which Output Log entries are visible.

This interface also has a Command Console where you can modify various Console Variables that affect the operation of the Multi-User Server.

## Sessions Information Tab

Similar to the existing Multi-User Browser available in the Unreal Editor, the Multi-User Server has a Sessions Panel where you can examine running and archived sessions.

 [image: Sessions information panel]

### Toolbar Icons

When an Active or Archived session is selected, you can perform three actions from the toolbar in the Sessions tab.

| Icon | Description |
| --- | --- |
| [image: Restore Session] | Restore the selected session. |
| [image: Archive Session] | Archive the selected session. |
| [image: Delete session] | Delete the selected session if permitted. |

### Active Sessions

All **Active Sessions** on the server are listed here, with summary information about their Server, Project name, Unreal Engine Version, and the Last Modified date. If you right-click an active session you can Archive, Rename, or Delete that session from the context menu.

 [image: Active Session context menu]

You can **double-click** an active session to inspect that session in greater detail in a new tab.

### Archived Sessions

All **Archived Sessions** on the server are listed here with the same summary information as above. If you right-click an archived session, you can Restore, Rename or Delete that session from the context menu.

 [image: Archived Session context menu]

You can double-click an archived session to inspect it in a new tab.

## Active Session Tab

You can double-click any active session in the Sessions Information Panel to display more information about that session. Information about the session opens in a new tab bearing the name of the session. The information panel of an Active Session has four regions.

 [image: Active Session Panel]

- Connected Clients

- Session History

- Transaction Details

- Session Content

### Connected Clients

From an active session tab, you can click the **Connected Clients** button to inspect the clients currently connected to that session. The Connected Clients button will take you to the main **Clients** tab, with the content filtered to display only the active connections in that specific session. You can clear the filter and show all clients by using the gear icon in the Clients tab.

### Session History

Once open, the active session tab displays a chronological history of all the individual transactions that occurred during that session. This panel also displays a brief summary of the operation and the Client where the changes originated.

 [image: Session History]

You can use the search bar to look for specific transactions in the history timeline. Several display filters are available under the gear icon.

 [image: History Filters]

### Transaction Details

You can select any individual transaction in the Session History and expand the Details section to expose more information about the changes that were made in that transaction.

 [image: Transaction Details]

Under **Modified objects and properties** you can hover the mouse over one of the listed items and a tooltip will display precisely which Asset was modified.

### Session Content

 [image: Session Content]

The **Session Content** panel lists any changes made to the contents of the project. When new packages are added, they are listed with a plus icon to the left of the package name. This icon changes to a check sign when the package is saved.

## Clients Information Tab

The Clients information tab displays network information about the Multi-User server, and a record of any clients that have participated in a session on that server.

### Clients Table

The Clients table keeps track of all clients that have participated in the server, both connected and disconnected. Clients that are currently connected to an active session in the Multi-User server will display a green swatch in the bottom-left corner of the table. When a client disconnects from the server, the swatch turns gray.

 [image: Clients table]

The client table provides a summary view of the active network data that each client is sending and receiving. You can use the search bar to retrieve information about specific clients. You can also see detailed connection information about a specific client by right-clicking in the corner of the client and selecting one of the options in the context menu.

 [image: Client table Display options]

- **Open Log:** Opens a new tab in which you can view log events related to this client.

- **Network Graph:** Displays a real time graph of the client's network activity.

- **Outbound segment table:** An itemized record of all transactions initiated by the client.

- **Inbound segment table:** An itemized record of all transactions received by the client.

These tables provide information about the active data being sent or received by the client.

| Item | Description |
| --- | --- |
| Sent | Total data sent by the client. |
| Received | Total data received by the client. |
| RTT | Round trip time in milliseconds. |
| Inflight | Current inflight data, waiting to be acknowledged by the receiver. |
| Lost | Information about packet loss. |

This information is extremely useful when diagnosing passible packet loss in high throughput situations. You can identify connections that are unstable, or may be unreachable due to network congestion or configuration.

### Packages Column

The Packages column on the right side of the server window displays package transfer information between clients. This view provides insights about the current transfer of large data to other clients. For example, Level Snapshot data or GPU Lightmass bakes.

 [image: Packages column]

The time at which the package was sent, size, and revision information is visible. The green checkmark in the **State** column indicates that the package was acknowledged by the receiver to be completely transferred, and therefore should exist on the node. When **Enhanced Logging** is enabled, you can also click the checkmark to determine the exact message that was used to send the package.

### Enhanced Logging

Enhanced logging is available in the the **Server Log** panel at the bottom of the **Clients** tab. Click **Enable logging** in the middle of the Server Log panel to enable Enhanced Logging.

 [image: Enable Enhanced Logging]

Enhanced logging displays a detailed view of the current transfer of message between the Multi-User Server and its Clients. It is an inspection of the types of messages transmitted. By default all message types are visible, along with the time it was sent, who sent it, where it was sent, and whether it was acknowledged by the client.

Various filters are available to the left of the search bar in the Server Log panel. Click the dropdown caret icon to display the filters.

 [image: Server Log Filters]

Once enhanced logging is enabled in a server, you cannot turn it off. Logging information is written to a CSV file found in the same directory as your server log files. Long sessions can generate very large CSV files, so you should only enable this feature when troubleshooting issues.

## Muting and Deleting Transactions

The Multi-User Server application has the capability for users to edit existing session data, enabling you to mute or delete transactions that were generated by clients. This feature is a useful way to identify and eliminate transactions that may be causing problems with user operation.

### Archiving a Session

To use this feature, you must create an archived copy of the session you wish to edit, and open that archived session in the Multi-User Server. **Right-click** an Active Session in the Sessions tab and select **Archive** in the context menu. Double-click the archived session to open its information panel.

 [image: Archive Session]

Once the archived session is open, you can select any transaction and mute or delete it.

### Deleting a Transaction

To delete a transaction, right-click it in the archived session and select **Edit** > **Delete** from the context menu.

 [image: Delete Transaction]

Note that deleting a transaction is destructive and cannot be undone. Muting transactions can achieve a similar effect, but enables you to unmute at a later time. If there is any chance you will want to recover the transaction later, consider muting instead.

### Muting a Transaction

If you mute a transaction in an archived session, that transaction is not replayed when clients rejoin the session after it is unarchived. Muted transactions appear as dimmed entries in the transaction history. To mute a transaction right-click it in the transaction history and select **Mute** from the context menu.

 [image: Mute Transaction]

This workflow yields essentially the same results as deleting transactions. However you can always unmute transactions at a later time, whereas deleted transactions cannot be recovered. Muting is the recommended workflow for either temporarily or permanently disabling a transaction.

#### Dependency Analysis

When you attempt to mute a transaction, a warning dialog appears to inform you that by muting a transaction there is some risk of disrupting downstream dependencies.

 [image: Mute Transaction Warning]

Since some transactions may depend on earlier transactions, muting or deleting always requires a dependency analysis on the transaction history. This process is automatic, and will find transactions that relate to one another. Dependency analysis is not infallible, and in some cases it is indeterminate whether or not a transaction depends on another. In those cases you are given the option to include or exclude the transaction. In most cases it is best to err on the side of caution.

- getting started
- beta
- multi-user editing
- virtual sets

On this page

- Building the Multi-User Server (-> multi-user-server-user-interface-in-unreal-engine)
- Enable the Multi-User Editing Plugin (-> multi-user-server-user-interface-in-unreal-engine)
- Change Settings to Launch UI Mode (-> multi-user-server-user-interface-in-unreal-engine)
- Switchboard Support (-> multi-user-server-user-interface-in-unreal-engine)
- Running the Multi-User Server (-> multi-user-server-user-interface-in-unreal-engine)
- From Multi-User Browser (-> multi-user-server-user-interface-in-unreal-engine)
- From Switchboard (-> multi-user-server-user-interface-in-unreal-engine)
- Multi-User Server UI Overview (-> multi-user-server-user-interface-in-unreal-engine)
- Menu bar and Tabs (-> multi-user-server-user-interface-in-unreal-engine)
- Window (-> multi-user-server-user-interface-in-unreal-engine)
- Debug (-> multi-user-server-user-interface-in-unreal-engine)
- Tabs (-> multi-user-server-user-interface-in-unreal-engine)
- Command Console and Output Log (-> multi-user-server-user-interface-in-unreal-engine)
- Sessions Information Tab (-> multi-user-server-user-interface-in-unreal-engine)
- Toolbar Icons (-> multi-user-server-user-interface-in-unreal-engine)
- Active Sessions (-> multi-user-server-user-interface-in-unreal-engine)
- Archived Sessions (-> multi-user-server-user-interface-in-unreal-engine)
- Active Session Tab (-> multi-user-server-user-interface-in-unreal-engine)
- Connected Clients (-> multi-user-server-user-interface-in-unreal-engine)
- Session History (-> multi-user-server-user-interface-in-unreal-engine)
- Transaction Details (-> multi-user-server-user-interface-in-unreal-engine)
- Session Content (-> multi-user-server-user-interface-in-unreal-engine)
- Clients Information Tab (-> multi-user-server-user-interface-in-unreal-engine)
- Clients Table (-> multi-user-server-user-interface-in-unreal-engine)
- Packages Column (-> multi-user-server-user-interface-in-unreal-engine)
- Enhanced Logging (-> multi-user-server-user-interface-in-unreal-engine)
- Muting and Deleting Transactions (-> multi-user-server-user-interface-in-unreal-engine)
- Archiving a Session (-> multi-user-server-user-interface-in-unreal-engine)
- Deleting a Transaction (-> multi-user-server-user-interface-in-unreal-engine)
- Muting a Transaction (-> multi-user-server-user-interface-in-unreal-engine)
- Dependency Analysis (-> multi-user-server-user-interface-in-unreal-engine)
