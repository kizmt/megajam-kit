# Saving and Restoring Session Archives

https://dev.epicgames.com/documentation/en-us/unreal-engine/saving-and-restoring-session-archives-in-unreal-engine?application_version=5.9

> Save your session changes in an archive that you can restore at any time.

[image: Saving and Restoring Session Archives]

Learn to use this **Beta** feature, but use caution when shipping with it.

At any time, you can have the Multi-User Editing server save all of the transactions made in a single session into an archive on disk. Later, you can use this archive to create a new session that contains all the same changes.

The instructions on this page show how to save a session to an archive, and to restore the archive to an active session later.

You'll use the controls in the **Multi-User Browser** to do this. You can open this panel by choosing **Window > Developer Tools > Multi-User Browser** from the main menu, or by activating the Toolbar button for Multi-User Editing. For more, see the Quick Start (-> getting-started-with-multi-user-editing-in-unreal-engine).

## Saving a Session to an Archive

Follow the instructions in this section to save an active session to an archive on disk.

### Steps

- Select the session you want to archive in the **Multi-User Browser**.

- Click the **Archive** icon in the Toolbar, or right-click the session and choose **Archive** from the context menu. [image: Archive icon]

- Immediately below your session name, give the archive a descriptive name, then click the checkbox icon. [image: Name the session]

### End Result

Your new archive appears in the list of sessions. It's distinguished from active sessions by its box icon, and by its lighter grey text.

 [image: An archived session in the list of sessions]

The server saves session archives in the `Engine\Programs\UnrealMultiUserServer\Saved\MultiUser` folder under your Unreal Engine installation folder.

## Restoring an Archived Session

Follow the instructions in this section to restore an archive back to an active session that you can join to resume editing.

### Steps

To restore a session from an archive:

- Make sure you have the same server running that you used to host the original session. Each server is responsible for saving its own sessions to archives locally on its own computer. That means that each server can only restore sessions that it archived.

- Make sure that you have the same Project open that was originally used to create the session, and make sure the state of the Project's content matches the original state of the archived session. Remember that when you restore an archived session, just like when you join an existing session, your Project content on disk must match the state that the Project content was in at the time the session was originally created.

- Select the archive you want to restore in the **Multi-User Browser**. [image: Select an archive in the sessions list]

- Click the **Restore** icon in the Toolbar, or double-click the archive, or right-click the archive and choose **Restore** from the context menu. [image: Restore icon]

- Set the name of the new session that you want to create from the transactions stored in the archive, then click the checkbox icon. [image: Name the new session] ]

### End Result

The Multi-User Editing system starts a new session, owned by you, and immediately joins you to the session. The History will show the full record of all the transactions made while the session was live. As you work, you'll continue adding new transactions on top of this existing history.

 [image: Restored session]

- beta
- post processing
- multi-user editing

On this page

- Saving a Session to an Archive (-> saving-and-restoring-session-archives-in-unreal-engine)
- Steps (-> saving-and-restoring-session-archives-in-unreal-engine)
- End Result (-> saving-and-restoring-session-archives-in-unreal-engine)
- Restoring an Archived Session (-> saving-and-restoring-session-archives-in-unreal-engine)
- Steps (-> saving-and-restoring-session-archives-in-unreal-engine)
- End Result (-> saving-and-restoring-session-archives-in-unreal-engine)
