# Using Anchorpoint as Source Control

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-anchorpoint-as-source-control-for-unreal-engine?application_version=5.9

> How to use Anchorpoint to manage version control for Unreal Engine.

[image: Using Anchorpoint as Source Control]

**Anchorpoint** is a Git-based version control application built for artists and game teams that is integrated with Unreal Engine. It adds file locking, Git LFS management, and a metadata layer on top of standard Git, and supports any Git hosting provider, including GitHub, GitLab, Gitea, and Azure DevOps.

You can use Anchorpoint for your Unreal Engine projects by installing the following:

- The Anchorpoint plugin for Unreal Engine (available on Fab).
- The Anchorpoint desktop application.

Download the plugin from Fab, and then enable the plugin in the UE Plugin window.

[image: Anchorpoint on Fab] Anchorpoint on Fab.

[image: Anchorpoint plugin in UE] Anchorpoint plugin in UE.

The UE plugin communicates with the Anchorpoint desktop application over an IPC connection, so you can handle revision control directly in the Unreal Editor. This means you can:

- View locked, modified, and outdated files and actors in the Unreal Editor.
- Check out and lock files exclusively to avoid merge conflicts.
- Commit changes from the Unreal Editor.
- View Blueprint diffs, individual file history, and resolve merge conflicts.
- Pull, revert, and reset project files without closing Unreal Engine.
- Open the Anchorpoint browser from anywhere in the **Content Drawer**.

For more information, visit the following links to the official Anchorpoint documentation:

- The Unreal Engine plugin.
- Setting up Git for Unreal Engine projects.
- The Anchorpoint official Discord server.
