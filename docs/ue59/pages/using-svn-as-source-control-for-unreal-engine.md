# Using SVN as Source Control

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-svn-as-source-control-for-unreal-engine?application_version=5.9

> How to setup SVN so that you can share assets with other on your team.

[image: Using SVN as Source Control]

Unreal Engine comes with an integrated method that allows people to work together on their projects using version control software called Subversion or SVN for short. Version control allows users on your team to share assets and code with one another, as well as providing a backup and history of changes so any files can be rolled back to an earlier version if something went wrong with the file.

## Using Subversion (SVN) with Unreal Engine

If Perforce is not an option for you, then you can use Subversion (SVN). SVN is similar to Perforce in how users handle data. The following guide will walk you through how to setup a SVN source control server for your UE projects.

### Setting Up a SVN Server

Setting up an SVN server can be done using the Subversion command-line tools, but in this case for ease of use, we are going to describe how to set up a server using VisualSVN on Windows.

You can download SVN for Windows by clicking here and downloading the program from the SVN website.

### Setting up a SVN server on your Local Machine

- After SVN had been installed, open SVN up and in VisualSVN, **Right-click** on the **Repositories** tree item and select **Create New Repository**:

- If asked, choose a **Regular Files System** for now.

- Then enter a name for your repository.

- Next choose whether you want some initial folders adding to the repo:

Adding the **Trunk**, **Branches**, and **Tags** directories can be useful if you plan on doing concurrent C++ code development with other people. Initial security settings can also be set up at this time. If you are unsure of what to set here, leave it as the defaults and all Subversion users have Read/Write access. Once created, you should see your repository in the tree view.

### Server on your Local Network

You can set up a server on your local network for people to use to collaborate with one another. To do this, follow the steps above on the server and connect using the server's URL from your clients.

### Secure Access

Many users like to use a secure connection to access their repositories. These connections have URLs starting with **https://** and have a number of things to be aware of when setting them up. To use HTTPS, the server needs to provide a **trusted certificate** so that clients know that they are connecting to a secure server. VisualSVN can issue a local certificate so that internal users can connect securely. You can find details of this by **Right-clicking** on the root of the tree view, selecting **Properties**, and navigating to the **Certificate** tab:

To connect to an SVN server using a secure connection, the certificate issued by the server needs to be issued to the same name that users use to connect to it. For example; if users access the server using the URL **https://my-server/svn**, then the certificate needs to be issued to "my-server" (without quotes), similarly if users connect via IP address **https://192.168.0.1/svn** then the certificate should be issued to "192.168.0.1" (without quotes).

### Cloud Provider

There are various cloud providers that allow you to host SVN servers off-site and to collaborate remotely. A quick search online for **SVN Hosting** should turn up a few results. Each hosting provider is different, but all should end up with a URL, username, and password that you can use to connect to the server.

### Checking Out to a Local Working Copy

To work with files that are under SVN control, you will need to set up a **Working Copy** so that the files can be managed on your local machine. For the moment, you cannot do this inside of the Unreal Editor. You can do this via the SVN command line tools, but in this case for ease of use, we are going to describe how to set up a working copy using TortoiseSVN on Windows.

You can download TortoiseSVN for Windows by clicking here and downloading the program from the TortoiseSVN website.

When you create a new project, you can choose whether it incorporates C++ code and Blueprint elements. If you are using C++ code in your project, you will see a `Source/` directory as well. You should initially add the following directories of your project:

Folders and files highlighted in **Green** should be added to your depot. The Binaries folder in **Yellow** is optional, depending on how your team wants to work together. It is not required if every team member is going to compile their editor/game themselves, but should be included in the **initial add** if any team members will just be grabbing a version from the depot to create content.

If you are trying to edit a project that someone else has already created, you can skip ahead as the following will not apply to you.

To create your working copy, you should **Check Out** the (assumed empty) root of your repository. To do this, **Right-click** on your project's folder in Windows Explorer and select **SVN Checkout**.

Then enter the URL of your repository and where it should be checked out (make sure this is not creating a subdirectory you do not want).

Next click **OK** and it should create a hidden **.svn** directory that SVN uses to store information about the working copy.

### Adding files to Subversion

- To add the files to your repository, select the items in Windows Explorer and then **Right-click** to add and select the **TortoiseSVN->Add** option.

- When you do this, SVN will mark the files you selected for addition to the repository. Next, **Right-click** in the directory containing your project and select **TortoiseSVN->SVN Commit**.

- This will scan the directory for any changes/adds that you have made and display them in the Commit dialog.

- Now enter a commit message and click **OK** to upload your additions to the server. If you want to start work on a project that someone else has already started, you will need to get the latest revision from SVN using TortoiseSVN. To do this, you should perform the **SVN Checkout** stage above and make sure you have **Fully Recursive** set for your checkout depth. This should download the all the existing files to your local machine.

### Connecting to Subversion from Unreal Editor

You can connect to your SVN server from the Unreal Editor by clicking on the **Source Control** icon in the **Toolbar**.

Once open, choose **Subversion** as the provider from the Source Control Login dialog and enter your login credentials. The password field is optional and does not need to be filled in every time. If it is entered correctly once, SVN will remember it.

### Using SVN on Mac OSX with Secure Connections

Because of how the Mac stores security information such as passwords, you may need to perform some extra steps to get your Editor to connect to servers via **https://** connections.
You may need to perform these steps if you see errors in your logs like:

```
	E175002: Unexpected HTTP status 400 'Bad Request' on '/projectname/'
	E175002: Unexpected HTTP status 405 'Method Not Allowed' on '/projectname/'
	E215004: Authentication failed and interactive prompting is disabled; see the --force-interactive option
	E215004: No more credentials or we tried too many times.
```

E175002: Unexpected HTTP status 400 'Bad Request' on '/projectname/'
 E175002: Unexpected HTTP status 405 'Method Not Allowed' on '/projectname/'
 E215004: Authentication failed and interactive prompting is disabled; see the --force-interactive option
 E215004: No more credentials or we tried too many times.

To fix this, first open a command prompt and type.

```
	cd [Engine Installation Directory]/Engine/Binaries/ThirdParty/svn/Mac/bin
```

cd [Engine Installation Directory]/Engine/Binaries/ThirdParty/svn/Mac/bin

This will change the directory to where the SVN binaries that are shipped with UE4 are found (substituting the engine installation directory).

Then type the following.

```
	svn info --username=me https://example.com/svn/repo
```

svn info --username=me https://example.com/svn/repo

Substituting your username and repository URL appropriately. This should then present you with a password prompt:

```
	Authentication realm:
	Password for 'me':
```

Authentication realm:
 Password for 'me':

Enter your password and it will be stored in the keychain. After this, the Editor should be able to connect correctly to your server following the regular instructions above.

On this page

- Using Subversion (SVN) with Unreal Engine (-> using-svn-as-source-control-for-unreal-engine)
- Setting Up a SVN Server (-> using-svn-as-source-control-for-unreal-engine)
- Setting up a SVN server on your Local Machine (-> using-svn-as-source-control-for-unreal-engine)
- Server on your Local Network (-> using-svn-as-source-control-for-unreal-engine)
- Secure Access (-> using-svn-as-source-control-for-unreal-engine)
- Cloud Provider (-> using-svn-as-source-control-for-unreal-engine)
- Checking Out to a Local Working Copy (-> using-svn-as-source-control-for-unreal-engine)
- Adding files to Subversion (-> using-svn-as-source-control-for-unreal-engine)
- Connecting to Subversion from Unreal Editor (-> using-svn-as-source-control-for-unreal-engine)
- Using SVN on Mac OSX with Secure Connections (-> using-svn-as-source-control-for-unreal-engine)

Related documents

Source Control

 [image: Source Control] (-> source-control-in-unreal-engine)Project Settings

 [image: Project Settings] (-> project-settings-in-unreal-engine)Configuration Files

 [image: Configuration Files] (-> configuration-files-in-unreal-engine)
