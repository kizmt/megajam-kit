# Install Unreal Engine

https://dev.epicgames.com/documentation/en-us/unreal-engine/install-unreal-engine?application_version=5.9

> Download and update Unreal Engine from the Epic Games Launcher.

[image: Install Unreal Engine]

This tutorial describes how to download and install **Unreal Engine **(UE). To uninstall or make changes to Unreal Engine after you install, see Make Changes to an Unreal Engine Installation (-> install-unreal-engine).

## Hardware and Software Requirements

To determine if your hardware and software are compatible with Unreal Engine and the **Epic Games Launcher**, see Hardware and Software Specifications (-> hardware-and-software-specifications-for-unreal-engine).

### Additional Software

To install Unreal Engine, you only need the Epic Games Launcher. However, developing with Unreal Engine can require additional software depending on your development role and criteria. Additional software can include:

- Microsoft Visual Studio
- Mobile platform Software Development Kits (SDKs) for iOS and Android
- Console platform SDKs
- Third-Party Debugging Tools

Developing and packaging for consoles requires a source code build of the Unreal Engine and cannot use the pre-compiled version obtained through the Epic Games Launcher. You can download a source code build from GitHub, but this guide does not cover this method.

## Download and Install the Epic Games Launcher

The Epic Games Launcher is where you download and manage your Unreal Engine versions. The launcher also gives you access to the Epic Games Store, sample projects, and professional development tools such as Fab, Twinmotion, and RealityCapture.

To download and install the Epic Games Launcher, follow these steps:

- Access the Download Unreal Engine page.
- Click the **Download Launcher** button to download the installer file. Alternatively, you can click the **Download **button in the top-right corner of the page.[image: Epic Games Launcher Download Page]Depending on your browser presets, a pop-up window may ask where you’d like to save the installer file. Alternatively, it may automatically save to the Downloads folder on your computer.
- After the download is complete, execute the **installer file **to run the Setup Wizard.Depending on your system settings, you may be asked to approve security prompts before the Setup Wizard can start.
- Once the Setup Wizard is complete, open the **Epic Games Launcher**.

### Sign In to the Epic Games Launcher

Once the Epic Games Launcher is open, you’ll be prompted to sign in using an Epic Games account. You can sign in with an existing Epic Games account (-> install-unreal-engine) or create an Epic Games account (-> install-unreal-engine).

You must be signed in to download Unreal Engine. If you click **sign in later**, you cannot download the engine.

[image: Epic Games Launcher Sign In Later]

#### Sign In with an Existing Epic Games Account

If you already have an Epic Games account, sign in using one of the following methods:

- Enter your email address and password into the text fields. Then, click **Sign In**.[image: Epic Games Launcher Sign In With Existing Account]
- Select a supported third-party social media or gaming platform account.[image: Epic Games Launcher Sign In With Third-Party Platform]If there is no Epic Games account associated with the third-party account you select, the Epic Games Launcher will prompt you to associate them.[image: Epic Games Launcher Link Third-Party Account]

#### Create an Epic Games Account

If you don’t have an Epic Games account, follow these steps to create one:

- Click **Create account**. Follow the on-screen prompts to fill in your date of birth, email, name, and other relevant information.[image: Epic Games Launcher Create Account]
- Once you’ve entered your information, check the box next to **Terms of Service** and the **Epic Games Store End User License Agreement** to accept these policies. Click **Continue**.[image: Epic Games Launcher TOS And EULA]Accepting the Terms of Service and Epic Games Store EULA is required to create an Epic Games account. To review these terms and policies, click on either of the links next to the check box.
- Verify your email by entering the numeric code sent to your email address. Then click **Verify email**.[image: Epic Games Launcher Verify Email]
- Review the **Epic Games Privacy Policy** and click **Continue**.[image: Epic Games Launcher Privacy Policy]Once logged in, by default, the Epic Games Launcher lands on the **Unreal Engine** option in the left-hand navigation panel and displays the **News **tab.

### Install and Run Unreal Engine

To install the latest version of Unreal Engine, follow these steps:

- In the Epic Games Launcher, click **Unreal Engine** in the left-hand navigation panel. This displays tabs relevant to Unreal Engine.[image: Epic Games Launcher Unreal Engine Tabs]
- Click the **Library **tab. This is where you install and manage versions of Unreal Engine.[image: Epic Games Launcher Library Tab]
- Click the **Add (+)** button next to **ENGINE VERSIONS** to add a new engine tile. This tile indicates which version of the engine will be installed.[image: Epic Games Launcher Add Engine Tile]If you have no versions of Unreal Engine installed, the quick launch button in the top-right corner of the Epic Games Launcher displays **Install Engine**. Clicking this opens the Library, adds an engine tile for the latest Unreal Engine version, and begins the installation process.[image: Epic Games Launcher Quick Launch Button]
- By default, the latest version of Unreal Engine is displayed on an engine tile. If you want to use an older version of the engine, click the version number dropdown menu and select the version you want to install from the list. [image: Epic Games Launcher Engine Version Number]
- On the engine tile, click **Install**. In the new dialog, review the terms and licensing options:Read through the **Unreal Engine Pricing options**. Click **Accept **to proceed.
- Read through the **Unreal Engine End User License Agreement**. Check the checkbox to indicate that you’ve read and agree with the terms. Click **Accept **to proceed.

You must accept both agreements in order to download Unreal Engine. If you click **Dismiss **you cannot download the engine.

- To choose where to install Unreal Engine on your hard drive, click **Browse **in the **Choose install location** dialog. By default, Unreal Engine uses the default installation location for your operating system.[image: Epic Games Launcher Browse]
- You can customize which Unreal Engine components to install by clicking **Options**. This opens the **Unreal Engine Installation Options** dialog.[image: Epic Games Launcher Installation Options]Here you can choose which components suit your development needs. See the table below for descriptions of each component: | Component | Description |
| --- | --- |
| **Core Components** (Required) | Required Unreal Engine files. |
| **Starter Content** | Default assets; maps, meshes, textures, and more. |
| **Templates and Feature Packs** | Create projects from default templates and feature packs. |
| **Engine Source** | View the engine source code. The source code cannot be modified or rebuilt. |
| **Editor symbols for debugging** | Adds source code used to provide more detailed information on Unreal Engine crashes. |
| **Target Platform** | Adds required source code to develop for target platforms such as Android, iOS, Linux, and TVOS. Developing for these platforms requires additional SDKs. | Before you install a version of Unreal Engine, make sure your drive has enough storage space. The Unreal Engine Installation Options dialog displays the storage space required for the components you select.[image: Epic Games Launcher Download Size]After making your selection, click **Apply **to confirm.
- In the **Choose install location** dialog, click **Install**. [image: Epic Games Launcher Install]Depending on your operating system settings, you might be asked to approve security prompts before the installation can start.To pause an installation, click the **Pause installation **icon on the engine tile.
- To cancel an installation, click the **Cancel installation (X)** icon.
- To resume a paused installation, click the **Resume installation** icon.

|  |  |
| --- | --- |
| [image: Engine Tile Pause And Cancel] (1) Pause installation icon (2) Cancel installation icon | [image: Resume Installation Icon] Resume installation icon |

- After the installation is complete, run Unreal Engine by clicking **Launch **on the engine tile. Alternatively, you can use the quick launch button in the top-right corner of the Epic Games Launcher.[image: Epic Games Launcher Launch Unreal Engine]If you have more than one version of Unreal Engine installed, you can use the dropdown arrow on the quick launch button to select any of the installed engine versions.

#### Install Multiple Engine Versions

The Epic Games Launcher gives you access to each version of Unreal Engine dating back to Unreal Engine 4.0. This is useful because some projects or content may require specific versions of the engine.

Installing multiple versions of the engine follows the same steps as Install and Run Unreal Engine (-> install-unreal-engine):

- Add a new engine tile by clicking the **Add (+)** button.
- On the engine tile, click the version number dropdown menu and select the version you want to install from the list.
- Click **Install **to begin the installation process.

You can only have one of each engine version installed at a time.

#### Install Unreal Engine Preview Builds

Prior to every major release of an Unreal Engine version, Epic Games issues a **Preview build**. Preview builds let you try out new features before they become available in major engine releases.

Because Preview builds are actively being developed, you may experience bugs or crashes while using them. For this reason, Preview builds are not intended for project development. However, they can be useful for determining if it’s worth moving development to an upcoming engine release, in order to take advantage of new features or avoid issues.

When a Preview build becomes available, it appears in the version number dropdown menu on an engine tile. Installing a Preview build follows the same steps as Install and Run Unreal Engine (-> install-unreal-engine).

[image: Epic Games Launcher Preview Builds]

## Make Changes to an Unreal Engine Installation

The following sections describe how to verify, customize, update, and remove Unreal Engine after installation:

- Verify an Unreal Engine Installation (-> install-unreal-engine)
- Change the Components of an Unreal Engine Installation (-> install-unreal-engine)
- Apply HotFix Updates (-> install-unreal-engine)
- Install and Remove Plugins (-> install-unreal-engine)
- Uninstall Unreal Engine (-> install-unreal-engine)

### Verify an Unreal Engine Installation

The Epic Games Launcher can “verify,” or evaluate existing engine files and plugins for corrupted or missing content.

In the Library tab of the Epic Games Launcher, the Verify option is located in the dropdown menu of each engine tile.

[image: Epic Games Launcher Verify]

After clicking Verify, you can see the progress of the verification by clicking **Downloads**, in the left-hand navigation panel.

[image: Epic Games Launcher Downloads]

If any files are found to be missing or corrupted, only these files will be downloaded and installed.

The option to verify an Unreal Engine installation will not appear if a HotFix update is available but has not been downloaded and installed.

### Change the Components of an Unreal Engine Installation

You can modify the components for each Unreal Engine version at any time, without redownloading the engine. This is useful if your development needs change after installation, such as requiring a different target platform or symbols for debugging.

To add or remove components from an existing version of Unreal Engine, follow these steps:

- In the **Epic Games Launcher**, click the **Unreal Engine** tab. Then click the **Library **tab to view your installed Unreal Engine versions.
- On the **engine tile** you want to make changes to, open the **dropdown menu**, and select **Options **to open the **Unreal Engine Installation Options** dialog.[image: Epic Games Launcher Options]
- In the **Unreal Engine Installation Options** dialog, check the components you want to add or remove.
- Click **Apply **to confirm your choices.

### Apply HotFix Updates

An update for an engine version is called a **HotFix **update or release. A HotFix update is a targeted update consisting of bug and crash fixes to address critical issues. HotFix updates do not include new features for the engine.

You can identify a release that has had a HotFix update by looking at its third decimal value. In this example, 5.5.0 is the first release of this engine version, increasing by one for each new HotFix:

- 5.5.**0**
- 5.5.**1**
- 5.5.**2**

The release cadence for each HotFix update is determined by the amount of post-release issues to address and the severity of the issues.

When HotFix updates become available, the Epic Games Launcher notifies you in two ways:

- An info notification badge appears on the top-right corner of the engine tile with a HotFix.
- The engine tile’s **Launch **button is replaced with an **Update **button.

The Update button downloads the latest available updates and installs them.

[image: Epic Games Launcher Update]

We advise you to update your engine versions each time a HotFix becomes available. If you need to use your engine version without updating immediately, use the **Launch **button in the top-right corner of the Epic Games Launcher.

[image: Epic Games Launcher Quick Launch Button]

### Install and Remove Plugins

You can find and download plugins for Unreal Engine from the Fab marketplace. Plugins that are currently installed, or available to install can be found in the Epic Games Launcher by clicking **Unreal Engine > Library**, under the **Fab Library** section.

To install a plugin, follow these steps:

- Locate the plugin you want to install in your **Fab Library**.
- Click the **Install to Engine** button.[image: Epic Games Launcher Plugins]
- Select the Unreal Engine version to install the plugin for, if one exists. [image: Epic Games Launcher Install Plugins]The dropdown menu only displays engine versions that are both installed and supported by the plugin.
- Click **Install **to queue the download.

You can check the download’s progress in the Epic Games Launcher under the Downloads category in the left-hand navigation panel.

[image: Epic Games Launcher Downloads]

If there are no compatible versions of the engine installed, or if the plugin is already installed to all compatible versions, you will see the following warning dialogs:

[image: Epic Games Launcher Plugin Error 1]

[image: Epic Games Launcher Plugin Error 2]

To inspect which plugins are currently installed on an engine version, click the **Installed Plugins** link under its engine tile.

[image: Epic Games Launcher Installed Plugins]

When you click Installed Plugins, the **Unreal Engine Plugins **dialog displays a list of installed plugins. To remove plugins for the selected engine version, click **Remove**.

[image: Epic Games Launcher Remove Plugins]

### Uninstall Unreal Engine

To uninstall an existing version Unreal Engine, follow these steps:

- In the **Epic Games Launcher**, click the **Unreal Engine** tab. Then click the **Library **tab to view your installed Unreal Engine versions.
- On the **engine tile** you want to uninstall, open the dropdown menu, and select **Remove **to open the **Uninstall **dialog.[image: Epic Games Launcher Remove Engine]
- In the Uninstall dialog, click **Uninstall**.[image: Epic Games Launcher Uninstall]

## Next Up

- [image: Hardware and Software Specifications] Hardware and Software SpecificationsMinimum and recommended hardware specifications and necessary software for developing with Unreal Engine. (-> hardware-and-software-specifications-for-unreal-engine)
- [image: Multiple Launcher Installs] Multiple Launcher InstallsOverview of how to enable the Launcher's PCB Mode, and if needed, how to add a Windows Registry Install Path Override. (-> multiple-launcher-unreal-engine-installs)
- [image: Academic Installation] Academic InstallationAn overview of how to install the Launcher and Unreal Engine in academic environments. (-> academic-installation-of-unreal-engine)
- [image: Offline Installer] Offline InstallerLearn how to use the Unreal Engine offline installer. (-> offline-installer-of-unreal-engine)
- [image: Downloading Unreal Engine Source Code from GitHub] Downloading Unreal Engine Source Code from GitHubSteps for connecting to the source code repository and downloading the latest build of Unreal Engine. (-> downloading-source-code-in-unreal-engine)

- launcher
- setup
- plugins
- hotfix

On this page

- Hardware and Software Requirements (-> install-unreal-engine)
- Additional Software (-> install-unreal-engine)
- Download and Install the Epic Games Launcher (-> install-unreal-engine)
- Sign In to the Epic Games Launcher (-> install-unreal-engine)
- Sign In with an Existing Epic Games Account (-> install-unreal-engine)
- Create an Epic Games Account (-> install-unreal-engine)
- Install and Run Unreal Engine (-> install-unreal-engine)
- Install Multiple Engine Versions (-> install-unreal-engine)
- Install Unreal Engine Preview Builds (-> install-unreal-engine)
- Make Changes to an Unreal Engine Installation (-> install-unreal-engine)
- Verify an Unreal Engine Installation (-> install-unreal-engine)
- Change the Components of an Unreal Engine Installation (-> install-unreal-engine)
- Apply HotFix Updates (-> install-unreal-engine)
- Install and Remove Plugins (-> install-unreal-engine)
- Uninstall Unreal Engine (-> install-unreal-engine)
- Next Up (-> install-unreal-engine)
