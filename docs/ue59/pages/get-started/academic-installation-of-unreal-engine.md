# Academic Installation

https://dev.epicgames.com/documentation/en-us/unreal-engine/academic-installation-of-unreal-engine?application_version=5.9

> An overview of how to install the Launcher and Unreal Engine in academic environments.

[image: Academic Installation]

As universities, colleges, and trade schools continue to offer **Unreal Engine (UE)** to students and faculty, one of the most frequently asked questions we get from these users is how to distribute UE on school computers without exposing the academic account being used to access the engine. If you are installing UE in an academic environment, this document describes how deployment automation can be used to distibute academic installations of UE.

## Installing UE and Content

Typically, schools install UE on several computers, for example, in a computer lab or instruction room. At this time, we do not provide a silent (or one-step) installer for UE, which means that the installer needs to be manually run at least once on a machine in the academic environment. Rather than mirroring the install machine or manually running the installer on the rest of the computers in the classroom, we automated part of the deployment process.

Perform the following steps to install UE in an academic environment:

### Using the Launcher

If your school's network is behind a proxy server, it is a best practice to use the UE on GitHub build because the **Launcher** will not run behind the server. If, however, you prefer to use the Launcher version behind the proxy server, contact your IT department to have them open port 7777 or 7778. Keep in mind, though, that opening these ports does not always enable the Launcher to open or update behind a proxy server.

- Download the latest installers using the following links: PC - MSI

- macOS - DMG

- Run the installer on the machine you want to make an image from.

- After the installer finishes its routine, the Launcher automatically runs, enabling you to log in with your Epic Games credentials.

- To download and install the latest version of UE, begin by selecting the **Unreal Engine** sidebar option. Click for full image. Next, select the **Library** tab at the top. [image: The Library tab in the Unreal Engine section of the Epic Games Launcher]

- Click the **Engine Versions (+)** button. [image: The add new Engine Version button]

- Open the **drop-down list** to select the engine version you want to download. For purposes of this example, select version **5.0.1**. [image: Select the Engine version to install]

- Finally, click the **Install** button and follow the Installer's prompts to get Unreal Engine 5.0.1 onto your machine. [image: Click this button to install Unreal Engine 5]

- Some instructors use our learning samples in their curricula, and suppose an instructor teaching game design wants to use our **Lyra Starter Game** sample as a teaching tool. To download Lyra, they will need to select the **Samples** tab (1), then click on the Lyra Starter Game (-> lyra-sample-game-in-unreal-engine) (2). Click for full image. From the Lyra Starter Game's **Content Detail** menu, first click the **Free** button to gain access to the content. The EULA window appears. Click for full image. Before downloading a learning sample, refer to the **Supported Platforms** and **Supported Engine Version** sections of the **Content Detail** menu, which we update when deploying new releases.

- Accept the EULA, and the button changes to **Create Project**, click it to start setting up the project. [image: The Lyra Starter Game Create Project button]

- Set the **project's name**, its **installation folder**, and, if required, the **engine version**, before selecting **Create**. [image: The Lyra Starter Game install location]

- When the Lyra Starter Game is done installing, you will see it in the **Library > My Projects** menu. It is also available to create new projects in the **Vault**. [image: The Lyra Starter Game project showing in My Projects]

- If you see any automatically created projects in the **Library > My Projects** menu, delete them. If you do not delete projects that the Launcher automatically creates for you, it may cause problems for users on share-machines using the same projects. This includes the Lyra Starter Game project created in the previous example, you will still have it available in the Vault.

- After removing all of the automatically-created projects, you can mirror this machine's setup to the rest of your class's computers. Alternatively, you can save this machines image so that you can distribute it out to your lab's computers.

### From GitHub

Visit the following pages (in order) to learn how to download, install, and update UE from GitHub:

- Accessing Unreal Engine on GitHub

- Downloading Unreal Engine Source Code (-> downloading-source-code-in-unreal-engine)

- Updating to the Latest Changes from Epic (-> building-unreal-engine-from-source)

## Performing Updates

After installing UE, you are ready to use the engine and some free content in an academic environment. It is important, however, to plan for updates because when new versions of UE are released, or when engine content is released, you can update the mirror or push out new content to install machines by copying the relevant files, which you can automate with a script.

Read through the following sections to learn how to update UE and engine content in an academic environment:

### Using the Launcher

- From a central machine, open the **Launcher** and navigate to the **Library** menu.

- Click the **Engine Versions (+)** button.

- After the Launcher downloads the latest version of UE, you can update the mirror.

If you do not want to perform updates using the Launcher, read through the following section to learn how to copy updates to lab machines with UE.

### Copying UE and Content

- Copy the following directories from the base machine to every machine that you want to update: `(Local Directory)\Epic Games\Launcher\VaultCache`

- `[Local Directory]\Epic Games\(Engine Version)` In some cases, it is possible to install the Launcher in the `C:\Program Files (x86)` folder.

- If you are copying a specific version, for example, version 5.0, you can copy `C:\Program Files (x86)\Epic Games\(Engine Version)`, otherwise, you can use the wildcard character (`*`) to automate the copy operation for all engine versions, which looks like `C:\Program Files (x86)\Epic Games\*`.

- Make the following directory on every machine that you want to update, `[Local Drive Letter]\ProgramData\Epic\EpicGamesLauncher\Data\Manifests`.

- Assuming you recently downloaded the engine, copy the most recently downloaded `.item` file from `[Local Drive Letter]\ProgramData\Epic\EpicGamesLauncher\Data\Manifests` to the machine's local manifest directory (from the previous step). As an example, the item file might look something like, `~\Manifests\6CB2FA12345680D212345678B525AE86.item `.

- To verify you have a copy of the most recently downloaded item file, open the file in a text editor and search for `"AppName"`.

After following these steps, the Launcher automatically detects updates when a user runs the Launcher. This is true for new engine versions and downloaded content from the Marketplace.

If you want to disable the Launcher from automatically detecting updates, read through the following section.

## Disabling Automatic Updates

By default, the Launcher automatically checks for updates during its launch routine. To prevent Launcher updates from taking up class time, perform the following steps:

- Right-click the **EpicGamesLauncher - Shortcut** to open the Launcher's contextual menu.

- Select the **Properties** to open the file's **Properties** window.

- Locate the **Target:** property in the **Shortcut** tab and add the `-noselfupdate` command to the end of the target line.

Do not forget to re-enable Launcher updates when class is not in session.

## Best Practices for Students

There are scenarios that might impact your students' ability to access UE (or downloaded content). For example, your school might regularly wipe computers for security (or resource) reasons, which might affect a student's progress in-class. To help those students, we have collected the following best practices for some common scenarios they might face while using UE in an academic environment.

### During Network Outages

Students can run the Launcher during network outages by selecting the **Continue in Offline Mode** option during sign-in.

Click for full image.

After signing-in in Offline Mode, students can access UE, their projects, and previously downloaded content.

### Preparing for Memory Wipes

If your school has a policy of wiping computer (or drive) memory on a regular schedule, returning student computers to their base image, students must save their work in a directory that will not be wiped (or cleared).

- For example, suppose a student creates a new Lyra Starter Game project from their Vault on the Library tab. [image: The Lyra Starter Game in the Vault]

- When creating the new project, the student should specify a folder (or network directory, such as a Sandbox drive) that will not be removed when their computer is re-imaged. [image: Installing the Lyra Starter Game to a sandbox drive where it will not be wiped when the computer is re-imaged.]

As long as your school's policy allows it, students typically download additional content using the Launcher, however, if the downloaded content is not saved off the mirrored drive, the content will most likely be wiped during re-imaging.

- installation

On this page

- Installing UE and Content (-> academic-installation-of-unreal-engine)
- Using the Launcher (-> academic-installation-of-unreal-engine)
- From GitHub (-> academic-installation-of-unreal-engine)
- Performing Updates (-> academic-installation-of-unreal-engine)
- Using the Launcher (-> academic-installation-of-unreal-engine)
- Copying UE and Content (-> academic-installation-of-unreal-engine)
- Disabling Automatic Updates (-> academic-installation-of-unreal-engine)
- Best Practices for Students (-> academic-installation-of-unreal-engine)
- During Network Outages (-> academic-installation-of-unreal-engine)
- Preparing for Memory Wipes (-> academic-installation-of-unreal-engine)
