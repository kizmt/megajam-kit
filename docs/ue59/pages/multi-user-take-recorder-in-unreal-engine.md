# Multi-User Take Recorder

https://dev.epicgames.com/documentation/en-us/unreal-engine/multi-user-take-recorder-in-unreal-engine?application_version=5.9

> How to enable Take Recording in a Multi-User Editing session.

[image: Multi-User Take Recorder]

During a Multi-User Editing (-> multi-user-editing-in-unreal-engine) session, you can control which nodes are included in a Take Recording (-> take-recorder-in-unreal-engine) session. You can assign nodes as recording nodes which may contain additional data not visible in the **Operator** session, such as with **nDisplay** or game nodes in a multi-user session.

In the example below, there are two nodes connected to the session.

- **Computer A**: the main operator who is controlling the stage using the multi-user feature.

- **Computer B**: an editor node assisting the main operator session.

 [image: The node list]

In the **Take Recorder** panel, you will also see a similar interface when using a new settings section.

There is a master property called **Synchronize Take Recorder Transactions**, which controls the trigger for sending multi-user recording events. When this property is disabled, the corresponding node will be greyed out which indicates that the user cannot trigger a multi-user recording.

The Multi-User Take Synchronization property also has a shortcut to the **Exclusion Filters** in the **Multi-User Take Settings** so that users can filter sources. Previously, it was not possible to use Take Recorder in a multi-user setting without assigning a filter to prevent transacting recorded takes.

 [image: Multi-User Take Synchronization property enabled]

In the image below, Synchronize Take Recorder Transaction is disabled, and the multi-user icon is gone which indicates that you will be recording locally.

 [image: Multi-User Take Synchronization property disabled]

In a connected session when Synchronize Take Recorder Transaction is enabled, connected nodes will have two properties that indicate their participation in a multi-user recording session.

- **Record on Client**: this is the client that is doing the recording. In a Virtual Production stage, this will typically be a single machine that is the authority for the recording.

- **Transact Sources**: these are the nodes that communicate the **Sources** in the Take Recorder for other nodes. In the image above, the source **Actor_Blueprint** is provided by the Operator node. Any changes to the source property made by the Operator node will be propagated to the other nodes. If the other nodes change the source, the change will not propagate to other nodes.

Once you have assigned sources and specified at least one node that is recording, the multi-user record icon will reappear, and you can begin recording.

It is possible to have multiple recording nodes active simultaneously. However, this configuration will produce multiple Take Recorder assets which will have the name of the recording node appended.

For example, `Scene_01_03` will become `Scene_01_03_computer_A` and `Scene_01_03_computer_B` if both `computer_A` and `computer_B` are Recording.

The user is shown a warning if they have multiple active recording nodes.

If you do not provide a source, it is not possible to start a recording.

 [image: No source, recording impossible]

- post processing
- take recorder
- multi-user editing
