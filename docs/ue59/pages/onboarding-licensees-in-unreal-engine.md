# Onboarding Licensees

https://dev.epicgames.com/documentation/en-us/unreal-engine/onboarding-licensees-in-unreal-engine?application_version=5.9

> Get started with Unreal Engine as a licensee.

## Term Definitions

Learn the following terms before proceeding.

| Term | License |
| --- | --- |
| Developer Portal | The main site where licensees can manage their organization, their license seats, and download offline installers for Unreal Engine and other Epic Games applications. |
| **Epic Pro Support** | The private site for dedicated custom license support for Unreal Engine and other Epic Games applications. |
| **Unreal Engine** | A complete suite of tools for creating interactive experiences. |
| **UE** | Acronym for Unreal Engine. |
| **Unreal Editor** | The interface used to develop with Unreal Engine. |
| **Epic Games Launcher** | A platform for installing Unreal Engine, including managing user projects and downloaded content. |
| **Datasmith** | A feature in Unreal Engine that provides import capabilities for data from a wide variety of CAD, BIM, and 3D content creation tools. |

## Quick Start

For the best experience in getting started with your Unreal Engine license, follow these steps in order, skipping any that you have already completed.

### 1. Set up your Developer Portal organization and allocate licenses

If you are just starting with your Unreal Engine license, your first step is to set up your organization in the Developer Portal. Your technical administrators are granted initial access, and can then assign license seats to members of your organization.

### 2. Set up Epic Pro Support access

If you have Epic Pro Support as part of your licensee agreement with Epic Games, you also need to sign into Epic Pro Support. Your technical administrators are granted initial access, and can then set up other members of your organization as Contacts, who gain access to Epic Pro Support.

### 3. Install Unreal Engine

The next step is to install Unreal Engine. You first need to verify your system meets the hardware and software requirements (-> hardware-and-software-requirements-for-container-deployments-in-unreal-engine). Then, the simplest recommended method is using the Epic Games Launcher, which you can download here. You can also use the UE offline installer provided to all paid licensees. If you intend to customize the source code or want to use distributed installation, you can find out more about your options below.

### 4. Install Datasmith Plugins (Optional)

Datasmith is a default feature in Unreal Engine. However, some formats such as 3ds Max, SketchUp Pro, and Revit, also require you to install exporter plugins in the source application.

### 5. Launch Unreal Engine

You're now ready to get started and launch Unreal Editor. If you installed Unreal Engine using the Launcher, log in, click the Unreal Engine sidebar text, and click the yellow **Launch **button. You can also launch the editor from the **Library **tab, where you can select from multiple engine installations or load directly into your specific projects. See below for information about launching a custom or offline build of Unreal Editor.

### 6. Create a project

When you first open Unreal Editor, the **Project Browser** will appear. You can create a new project from a template here. You can also load one of the fully fleshed-out example projects from the **Samples **tab of the launcher.

### 7. Start your learning journey

There's a wealth of learning resources to help you get up to speed, including our Online Learning Platform. There's also lots of help available from the Unreal Engine Documentation (-> unreal-engine-5-6-documentation).

For a more detailed explanation of installing, launching, and creating with Unreal Engine, see Installing Unreal Engine (-> onboarding-licensees-in-unreal-engine) on this page.

## Accessing and Managing Accounts

The first step toward getting yourself and your staff working with your Unreal Engine license is to set up everyone's access. This section is for technical administrators and provides more details than the information offered in the Quick Start (-> onboarding-licensees-in-unreal-engine) guide.

### Your Epic Games Account

Your gateway to the majority of features and services related to Unreal Engine is your Epic Games account, which is associated with your specific email address. You may have previously created an Epic Games account using your current professional email address, but if not, then you will need to sign up for an account.

All staff in your organization will also require their own Epic Games accounts to access all features and services for Unreal Engine. They will need to create individual accounts from www.unrealengine.com to log in.

### Developer Portal

The Developer Portal is where you manage your subscription to Unreal Engine, including your organization and who is assigned to your license seats. After you subscribe to Unreal Engine, your primary technical contact identified during the license-signing process will receive an email from Unreal Engine Onboarding titled "Unreal Engine Subscription for [your organization name]", with the details of your subscription and instructions on how to log in to the Developer Portal.

To comply with the terms of your license agreement, only the members of your organization that you have assigned the license seats should be using Unreal Engine for development purposes.

### Epic Pro Support 

If you have the optional Epic Pro Support as part of your license agreement with Epic Games, our staff will grant the initial Epic Pro Support access to the primary technical contact identified during the license-signing process. This individual will be granted administrative permissions and have the ability to extend Epic Pro Support access to additional staff.

Look for an email message titled "Welcome to the Epic Pro Support community!" which is automatically sent after your access is enabled.

Follow the link in the email to log in to Epic Pro Support with the Epic Games account credentials related to your professional email address. You may experience login issues if you are already logged in to the Epic Games ecosystem with a different Epic Games account that does not have Epic Pro Support access.

Upon the first login, complete the onboarding process to set up your profile and notification settings, and then your access is complete. You can now review knowledge articles, search for posts submitted by other developers, or post your own support requests.

### Epic Games Account Security

For your account's security, we require that you enable **two-factor authentication**. To do so, go into your account settings and click on the **Password & Security** tab. Scroll to the bottom, click the **Send email verification** link to confirm your email address, and then (based on your preference) click to choose either **Enable Authenticator App** or **Enable Email Authentication**.

## Installing Unreal Engine

### Unreal Engine Hardware and Software Requirements

Before installing the Unreal Engine, make sure your system can run it. You’ll want to review the requirements of using Unreal Engine for your development needs. The hardware and software specifications are based on the equipment we use for our own development needs, and any additional software that may be required for general usage or specific needs of development. You will find recommended system specifications for Unreal Engine use on Windows, Mac, and Linux below. For more information, see the Installing Unreal Engine (-> install-unreal-engine) documentation.

#### Recommended Hardware

This section describes the recommended hardware for working with Unreal Engine.

**windows:**

|  |  |
| --- | --- |
| **Operating System** | Windows 10 64-bit version 1909 revision .1350 or higher, or versions 2004 and 20H2 revision .789 or higher. > **note:** Windows 11 is compatible with UE5 and fits in the recommended specs. |
| **Processor** | Quad-core Intel or AMD, 2.5 GHz or faster |
| **Memory** | 32 GB RAM |
| **Graphics RAM** | 8 GB or more |
| **Graphics Card** | DirectX 11 or 12 compatible graphics card with the latest drivers. |

> **tip:** Although some features have a minimum requirement of DirectX 11, we recommend DirectX 12 for most games.
> DirectX11 is better for older PCs, especially laptops with integrated graphics. However, DirectX12 provides a higher frame rate, multi-core processing support, and parallel and asynchronous computing.

**macos:**

|  |  |
| --- | --- |
| **Recommended Operating System** | Latest macOS 13 Ventura |
| **Recommended Processor** | Apple Silicon M3 |
| **Minimum Processor** | M1 or M2 depending on rendering features |
| **Recommended Memory** | 32 GB or more |
| **Minimum Memory** | 16 GB |
| **Graphics Card** | Metal 1.2 Compatible Graphics Card |

**linux:**

| **Recommended Operating System** | Ubuntu 22.04 |
| --- | --- |
| **Processor** | Quad-core Intel or AMD, 2.5 GHz or faster |
| **Memory** | 32 GB RAM |
| **Graphics Card** | GeForce 2080 |
| **Graphics RAM** | 8 GB or more |
| **RHI Version** | Vulkan: AMD (RADV 24.0.9+) and NVIDIA (560+) |

> **note:** To get the most out of rendering features in Unreal Engine 5, such as Nanite and Lumen, see the Requirements for UE5 Rendering Features section.

#### Minimum Software Requirements

The minimum requirements for running Unreal Engine and Unreal Editor are listed below.

**windows:**

| Running the Engine |  |
| --- | --- |
| **Operating System** | Windows 10 version 1703 (Creators Update) |
| **DirectX Runtime** | DirectX End-User Runtimes (June 2010) |

**macos:**

| Running the Engine |  |
| --- | --- |
| **Minimum Operating System** | Ventura 13.5 |

**linux:**

| Running the Engine |  |
| --- | --- |
| **Operating System** | Rocky Linux 8 / Redhat Linux 8 or newer |
| **Linux Kernel Version** | kernel 4.18 or newer |
| **Additional Dependencies** | glibc 2.28 or newer |

> **note:** If either Unreal Editor or installations of UE games take a very long time on startup, check that your `glibc` is version 2.35 or newer, as earlier versions have a slow implementation of `dlopen`.

The requirements for programmers developing with UE are listed below.

**windows:**

| Developing with the engine |  |
| --- | --- |
| All 'Running the Engine' requirements (automatically installed) |  |
| Visual Studio Version | Visual Studio 2022 |

| iOS App Development |  |
| --- | --- |
| iTunes Version | iTunes 12 or higher |

> **tip:** Although Visual Studio is recommended for Windows development, Unreal Engine also supports VS Code and Rider.

## Software Installed by the Prerequisite Installer

Unreal Engine includes a prerequisite installer that installs everything needed to run the editor and engine, including several DirectX components and Visual C++ redistributables. When you install Unreal Engine through the Epic Games Launcher, the Launcher automatically installs these prerequisites for you. However, you may need to run the prerequisite installer yourself if you build Unreal Engine from source, or if you need to prepare a computer with all the Unreal Engine prerequisites for a specific purpose—for example, if you are setting up a fresh computer to act as a Swarm Agent (-> unreal-swarm-in-unreal-engine).

You can find the installer in the `Engine/Extras/Redist/en-us` folder under your Unreal Engine installation location.

> **note:** Support for 32-bit platforms was removed in Unreal Engine 5.

If you use Perforce to get the Unreal Engine source code, you'll also find precompiled binaries in the same `Engine/Extras/Redist/en-us` folder of the Perforce repository. The source for the installer is under `Engine/Source/Programs/PrereqInstaller`.

The following table lists the software that is installed by the prerequisite installer.

| DirectX Components | Visual C++ Redists |
| --- | --- |
| XInput 1.3 (April 2007) | Visual C++ 2010 CRT |
| X3DAudio 1.7 (February 2010) | Visual C++ 2010 OpenMP library |
| XAudio 2.7 (June 2010) | Visual C++ 2012 CRT |
| D3D Compiler 4.3 (June 2010) | Visual C++ 2013 CRT |
| D3DCSX 4.3 (June 2010) | Visual C++ 2015 CRT |
| D3DX9 4.3 (June 2010) | Microsoft Visual C++ 2015-2022 Redistributable |
| D3DX10 4.3 (June 2010) |  |
| D3DX11 4.3 (June 2010) |  |

> **note:** The most important DirectX components from that list are the XInput, X3DAudio, and XAudio dependencies. These aren't included in standard installations of DirectX (and aren't distributed with Windows by default), so they have to be installed manually or distributed with the application.

**macos:**

| Developing with the Engine |  |
| --- | --- |
| **Recommended Xcode Version** | 15.4 or newer |
| **Minimum Xcode Version** | Xcode 15.2 |

**linux:**

| Developing with the Engine |  |
| --- | --- |
| **Operating System** | Ubuntu 22.04, Rocky Linux 8 |
| **Compiler** | clang 18.1.0 |
| Optional |  |
| **IDE** | Visual Studio Code, Rider |

#### Graphics Card Drivers

We recommend using the latest stable releases for your graphics card driver.

- Download NVIDIA drivers

- Download AMD drivers

- Download Intel drivers

> **tip:** If you experience performance issues, VTune can be an extremely useful tool for finding problems; however, it only works on Intel CPUs. One of the most common bottlenecks is disk I/O, so getting a RAID 0 disk array and extra RAM can help.

**windows:**

## Performance Notes

The spec below represents a typical system used at Epic Games (a Lenovo P620 Content Creation Workstation, standard version). This provides a reasonable guideline for developing games with Unreal Engine 5:

- Operating System: Windows 10 22H2

- Power Supply: 1000W power supply unit

- RAM: 128GB DDR4-3200

- Processor: AMD Ryzen Threadripper Pro 3975WX Processor - 128MB Cache, 3.5 GHz base / 4.2 GHz turbo, 32 Cores / 64 Threads, 280w TDP

- OS Drive: 1 TB M.2 NVMe3 x4 PCI-e SSD

- DATA Drive: 4 TB Raid Array - 2 x 2TB NVMe3 x4 PCI-e SSD in Raid 0

- GPU: Nvidia RTX 3080 - 10GB

- NIC 1GBPS on-board + Intel X550-T1 10G PCI-e Ethernet adapter

- TPM Compliant

**linux:**

## Performance Notes

The spec below represents a typical system used at Epic (a Lenovo P620 Content Creation Workstation, standard version). This provides a reasonable guideline for developing games with Unreal Engine 5:

- Operating System: Ubuntu 22.04

- Power Supply: 1000W power supply unit

- RAM: 128GB DDR4-3200

- Processor: AMD Ryzen Threadripper Pro 3975WX Processor - 128MB Cache, 3.5 GHz base / 4.2 GHz turbo, 32 Cores / 64 Threads, 280w TDP

- OS Drive 1 TB M.2 NVMe3 x4 PCI-e SSD

- DATA Drive 4 TB Raid Array - 2 x 2TB NVMe3 x4 PCI-e SSD in Raid 0

- GPU: Nvidia RTX 3080 - 10GB

- NIC 1GBPS on-board + Intel X550-T1 10G PCI-e Ethernet adapter

- TPM Compliant

#### Requirements for UE5 Rendering Features

Some of Unreal Engine's rendering features require more than the minimum specifications.

**windows:**

| UE5 Feature | System Requirements |
| --- | --- |
| **Lumen Global Illumination, Lumen Reflections, and MegaLights** | - Windows 10 build 1909.1350 and newer with DirectX 12 support. - **SM6** must be enabled in the Project Settings. - One of the following graphics cards: - AMD RX-6000 series or newer. - Intel® Arc™ A-Series Graphics Cards or newer. - NVIDIA RTX-2000 series or newer. > **note:** Lumen Hardware Ray Tracing now requires SM6 to be set in Project Settings. To learn more, see Lumen Technical Details (-> lumen-technical-details-in-unreal-engine). |
| **Nanite Virtualized Geometry and Virtual Shadow Maps** | - All versions of Windows 10 build 1909.1350 and newer, and Windows 11 with support forDirectX 12 Agility SDK are supported. - Windows 10 version 2004 and 20H2 — The revision number should exceed or be equal to .789. - DirectX 12 (with Shader Model 6.6 atomics), or Vulkan (VK_KHR_shader_atomic_int64). - **SM6** must be enabled in the Project Settings. (On by default in new projects.) - Windows 10 version 1909 — The revision number should exceed or be equal to .1350. - Latest graphics drivers. To learn more, see Nanite Virtualized Geometry (-> nanite-virtualized-geometry-in-unreal-engine) and Virtual Shadow Maps (-> virtual-shadow-maps-in-unreal-engine). |
| **Temporal Super Resolution** | Runs on any video card that supports Shader Model 5, but the limit of 8UAVs per shader has performance implications. Temporal Super Resolution shaders compile with 16bit types enabled on D3D12 that supports Shader Model 6. To learn more, see Temporal Super Resolution (-> temporal-super-resolution-in-unreal-engine). |

**macos:**

| UE5 Feature | System Requirements |
| --- | --- |
| **Lumen Global Illumination and Reflections with Software Ray Tracing** | Apple computers with an Intel and AMD Based GPU and/or Apple Silicon M1+. To learn more, see Lumen Technical Details (-> lumen-technical-details-in-unreal-engine). |
| **Lumen Global Illumination and Reflections with Hardware Ray Tracing and MegaLights** | Not currently supported. To learn more, see Lumen Technical Details (-> lumen-technical-details-in-unreal-engine). |
| **Nanite Virtualized Geometry and Virtual Shadow Maps** | Apple Silicon M2+ (beta support). To learn more, see Nanite Virtualized Geometry (-> nanite-virtualized-geometry-in-unreal-engine). |
| **Temporal Super Resolution** | Apple computers with an Intel and AMD Based GPU and/or Apple Silicon M1+. To learn more, see Temporal Super Resolution (-> temporal-super-resolution-in-unreal-engine). |

**linux:**

| UE5 Feature | System Requirements |
| --- | --- |
| **Lumen Global Illumination, Lumen Reflections, and MegaLights** | - **SM6** must be enabled in the Project Settings. - One of the following graphics cards: - NVIDIA RTX-2000 series or newer. - AMD RX-6000 series or newer. - Intel® Arc™ A-Series Graphics Cards or newer. > **note:** Lumen Hardware Ray Tracing now requires SM6 to be set in Project Settings. To learn more see, Lumen Technical Details (-> lumen-technical-details-in-unreal-engine). |
| **Path Tracing** | - **SM6** must be enabled in the Project Settings. - One of the following graphics cards: - NVIDIA RTX-2000 series or newer. - AMD RX-6000 series or newer. To learn more, see Path Tracer (-> path-tracer-in-unreal-engine). |
| **Nanite Virtualized Geometry and Virtual Shadow Maps** | - GPU which supports the VK_KHR_shader_atomic_int64 Vulkan extension. - **SM6** must be enabled in the Project Settings. (On by default in new projects.) - Latest Graphics Drivers. To learn more see, Nanite Virtualized Geometry (-> nanite-virtualized-geometry-in-unreal-engine) and Virtual Shadow Maps (-> virtual-shadow-maps-in-unreal-engine). |

### Acquiring Unreal Engine

Unreal Engine is available through a variety of sources, depending on your needs and use case.

- Most software that you are familiar with is provided as an executable program stored in binary (computer-readable) files. Unreal Engine is available in a binary format, which is easiest to get started with. This does come with the limitation that each release is provided as-is, meaning that you cannot modify it except with plugins, or by updating when Epic Games releases a new version.

- The alternate approach is source code, which is also provided by Epic Games for Unreal Engine. You can download the engine source code, make changes, updates, or improvements you want, then compile the code into a usable build. This approach provides you a lot of control, but is also more complicated to get started with, and requires you to have programming experience.

The binary build of Unreal Engine is available for you to download using the Epic Games Launcher, and the source-code build is available to you using GitHub. We recommend these options, however, as a subscription licensee, alternate access options are also available to you if required, including Perforce access, distributed installation, or an offline installer.

Use the following flow diagram to determine which is right for you, and then read the associated paragraphs below to proceed.

[image: Choosing Unreal Engine Builds]

> **note:** Developing for consoles requires a source code build of the Unreal Engine and cannot use the pre-compiled version obtained through the Epic Games Launcher.

The following sections describe each way to acquire Unreal Engine in detail:

- A: Epic Games Launcher (-> onboarding-licensees-in-unreal-engine)

- B: UE5 Offline Installer (-> onboarding-licensees-in-unreal-engine)

- C: UE5 Distributed Installation (-> onboarding-licensees-in-unreal-engine)

- D: GitHub (-> onboarding-licensees-in-unreal-engine)

- E: Perforce (-> onboarding-licensees-in-unreal-engine)

#### A: Epic Games Launcher

Accessing the binary build of Unreal Engine using the Epic Games Launcher is the recommended approach for most customers. The launcher will manage your downloads, notify you of updates, and handle the installation of plugins and other downloadable content. The only drawbacks might be for organizations that do not allow internet access or enforce restrictive software policies for their staff.

The Epic Games Launcher is also available from the **Download **button on www.unrealengine.com. If you want to hide the navigation options for various video games that are normally available on the Launcher, you can download it here. This specific download link enables a setting which hides the video game navigation options. These can be re-enabled in the Launcher settings if desired.

Once you have installed the Epic Games Launcher, you can log in to it with your Epic Account credentials. While on the **Unreal Engine** tab, you can click the yellow button on the right to install the latest version of the Unreal Engine, or you can navigate to the **Library **page for more control over the version you want to install.

[image: Epic Games Launcher Install Engine]

It is important to note that new versions of Unreal Engine are released multiple times a year. Each of these major version releases is a separate installation, not updates to the previous version. For example, if you have UE 5.5 installed, and a new version of UE is released and you choose to install it, you will keep the previous 5.5 installation and add the new version as a separate new installation. This is represented on the Epic Games Launcher's **Library **page as different engine slots, where new slots can be added by clicking the **Add (+)** button.

[image: Epic Games Launcher Engine Versions]

Major versions receive smaller hotfix updates, represented by a point number, like .2 and .3. For example, a hotfix update to UE 5.5 would appear as 5.5.1. The Launcher will provide a notification when a hotfix is available, and the update for these will apply directly to the existing installation. When you install an engine version, the Launcher installs it with the latest available hotfix updates applied.

[image: Epic Games Launcher Update]

When installing Unreal Engine, you can choose where it installs to (this can be important since the file size for the Unreal Engine is multiple gigabytes) and you are provided installation options. The **Options **provide a way for you to configure what you need to download, such as code required to develop for particular platforms.

Once you have installed an engine version, see Running UE from the Epic Games Launcher (-> onboarding-licensees-in-unreal-engine) to open and begin creating with UE.

We recommend you get started by learning the basics of Unreal Editor through Getting Started with Unreal Engine (-> onboarding-licensees-in-unreal-engine).

> **tip:** While on the Unreal Engine tab of the Epic Games Launcher, don't forget to explore the **News**, **Samples**, **Fab**, **Twinmotion**, and **RealityScan **pages to discover additional resources.

#### B: UE5 Offline Installer

For businesses where Unreal Engine is used on computers without an internet connection, we provide an offline solution with a standalone version of Unreal Engine, available to all subscription licensees for download on the Developer Portal. It has an install wizard, and supports remote and silent installation. Documentation on how to use the installer is available as a PDF on the Developer Portal.

> **note:** Offline installation limits access to the Fab marketplace for asset and plugin acquisition.

#### C: UE5 Distributed Installation

The traditional installation workflow for Unreal Engine is that the end-user directly downloads it, then either installs or compiles the engine on their local computer, depending on the choice of binary or source code. However, we are aware that this workflow is not appropriate for all organizations.

It is possible for you to download the engine to a single computer, then mirror the installation out to other computers. We have prepared a document to provide more information regarding this installation process here (-> academic-installation-of-unreal-engine). The document was written specifically for academic institutions, but the installation information is applicable to other organizations.

#### D: GitHub

If you require the ability to modify source code for Unreal Engine, downloading the source code through GitHub is our default recommendation.

For GitHub access, you need to successfully link your Epic Games account with your GitHub account. Once you have done so, you can access Unreal Engine source code through GitHub. You can find more details below:

- Link your GitHub account.

- Download Unreal Engine source code (-> downloading-source-code-in-unreal-engine).

- Build the Unreal Engine source code (-> building-unreal-engine-from-source).

#### E: Perforce

For businesses that require source code access but whose needs are not met by GitHub, we can provide access to Epic Games' Perforce (P4V) proxy server for Unreal Engine development. You can then download the source code for Unreal Engine directly from Epic Games' Perforce depot.

If you require Perforce access, contact your Epic Games Business Development representative for a custom licensee agreement that includes access to the Perforce depot. Once this is approved, the login credentials for the Perforce server are provided to your team's technical administrator by Epic Games. Only one set of login credentials is provided to each team.

For more information, see Accessing Unreal Engine with Perforce (-> accessing-unreal-engine-with-perforce).

> **warning:** Please note that only one authorized user should log into the Perforce account. **Multiple users logging into the same account is a violation of the Perforce terms of service.**
> Epic Games's guidance is for a single user or automation to use the account to sync engine builds to your local Perforce depot, and allow your staff access with their own individual Perforce accounts licensed by your company.
> If you don’t already have a Perforce license for your team, it isfree for up to 5 users or you canexplore licensing options.

### Optional Setup for Datasmith

Datasmith is a core part of Unreal Engine, and is enabled by default when creating a new project from any of the categories of **Film, Television, and Live Events**; **Architecture**, **Engineering**, and **Construction**; or **Automotive, Product Design, and Manufacturing** (see the Creating a New Project (-> onboarding-licensees-in-unreal-engine)section below for more details). If you are working with a project of a different category and want to enable Datasmith, in the Unreal Editor navigate to **Edit > Plugins > Importers**, enable the required Datasmith components, then restart Unreal Engine.

Some formats, such as 3ds Max, SketchUp Pro, and Revit, also require you to install plug-ins in the source application. If you intend to export your assets from these applications, follow the link to get the Exporter Plugins and install them.

## Getting Started with Unreal Engine

Unreal Engine offers a wealth of resources to help you and your staff succeed with your projects — everything from learning to use the Unreal Editor to tutorials that teach proficiency with advanced development techniques. This section will guide you through the information you need on that journey, and we recommend you share it with all staff who use Unreal Engine.

- Launch Unreal Engine (-> onboarding-licensees-in-unreal-engine)

- Creating a New Project (-> onboarding-licensees-in-unreal-engine)

- Learning Resources (-> onboarding-licensees-in-unreal-engine)

- Support Resources (-> onboarding-licensees-in-unreal-engine)

### Launch Unreal Engine

#### Running UE from the Epic Games Launcher

If you used the Epic Games Launcher to install Unreal Engine, you can launch UE by logging into the launcher, and clicking the yellow **Launch **button. Alternatively, you can launch UE from the **Library **tab, where you can also manage your engine installations or directly open a specific project.

[image: Epic Games Launcher Launch Button]

If you installed Unreal Engine using compiled source code or a standalone offline build, navigate to the directory where you installed Unreal Engine, and locate the executable in the following path:

**windows:**

`\Engine\Binaries\Win64\UnrealEditor.exe`

**macos:**

`/Engine/Binaries/Mac/UnrealEditor.app`

**linux:**

`Engine/Binaries/Linux/UnrealEditor`

> **tip:** You may want to create a desktop shortcut for easier access in the future.

You have several options for how to launch the Unreal Editor executable.

#### Running UE from the Executable 

**windows:**

- Navigate to your `[LauncherInstall][VersionNumber]\Engine\Binaries\Win64` directory.

- Right-click on the `UEEditor.exe` executable and choose **Create shortcut**.

- Rename the shortcut to something like **MyProject - Editor.exe** as this reflects that this shortcut runs the MyProject game editor.

- Right-click on the newly created shortcut and choose **Properties**.

- Add the name of the game to run as an argument at the end of the **Target** property: ```shell [LauncherInstall][VersionNumber]\Engine\Binaries\Win64\UEEditor.exe "[ProjectPath][ProjectName].uproject" ```

- Press **OK** to save the changes.

- Double-click the shortcut to launch the editor.

**macos:**

The editor must be run from the command prompt to load a specific project directly (see above) or with no arguments (see below) to access the Project Browser.

#### Running UE from the Command Line

**windows:**

- From a command prompt, navigate to your `[LauncherInstall][VersionNumber]\Engine\Binaries\Win64` directory.

- Run the `UEEditor.exe`, passing it the path to your project. ```shell UEEditor.exe "[ProjectPath][ProjectName].uproject" ```

**macos:**

- From a command prompt, navigate to your `[LauncherInstall]/[VersionNumber]/Engine/Binaries/Mac` directory.

- Run the `UEEditor.app` passing it the path to your project: ```shell open UEEditor.app --args "[ProjectPath]/[ProjectName].uproject" ```

#### Running UE with No Arguments (Stand-alone)

If the editor is not set to open the most recent project at startup, running the editor executable without any arguments will launch the Project Browser. From here, you can create a new project, open your existing projects, or open content examples and sample games.

### Creating a New Project

When you launch Unreal Engine, the **Unreal Project Browser** opens automatically. The Project Browser provides a starting point from which you can manage your existing projects, access templates to use when creating projects, or open projects created from sample games and showcases. This is where you can:

- Create a new project.

- Open an existing project.

- Manage existing projects.

The diagram below illustrates the steps to create a new project in Unreal Engine.

[image: Unreal Project Browser]

To create a new project, follow these steps:

- Select the **development category** (1) that best matches your industry and project goals. You can select from the following categories: - Games - Film, Television, and Live Events - Architecture, Engineering, and Construction (AEC) - Automotive, Product Design, and Manufacturing (APM)

- Select a **template **(2) for your project. The templates you can choose from are based on the category you selected in step 1. > **tip:** Unreal Engine contains a number of **project templates** you can use as a starting point for your own projects. To learn more about the different project templates available, refer to the Templates Reference (-> unreal-engine-templates-reference) page.

- Configure the **Project Defaults** (3). In this section, you can select your target platform (that is, the hardware where your game or application will run, like a computer or a mobile device), configure quality and ray tracing settings, and more. > **note:** Some of the settings below may not be available for certain templates. For example, the Handheld AR template can only use Blueprint implementation. You can configure the following settings: | **Implementation** | Select how you want to implement your project's logic, such as character movement, level transitions, and so on. You can choose from the following options: - **Blueprint**, if you want to build your project in the Unreal Editor, and use the Blueprint Visual Scripting system to create interactions and behavior. - **C++**, if you want to build your project by programming with C++ in Visual Studio. > **tip:** For more information about these implementation methods, refer to the following pages: > - Blueprint Visual Scripting (-> blueprints-visual-scripting-in-unreal-engine) > - Programming with C++ (-> programming-with-cpp-in-unreal-engine) | | --- | --- | | **Target Platform** | Select the type of platform your project is intended for: - **Desktop** - **Mobile** | | **Quality Preset** | Select the maximum quality level, based on which platform your project targets. We recommend that you choose: - **Maximum**, if you are developing your project for a computer or game console. - **Scalable**, if you are developing your project for mobile devices. | | **Starter Content** | Select whether you want your new project to include **starter content**. Starter content includes some simple static meshes with basic textures and materials. It is useful if you want to start learning and experimenting immediately, without sourcing and importing custom content. Starter content is only intended for early development; when you are ready to replace it with production-quality assets, you can either shop on Fab, or import your own assets from other applications. | | **Ray Tracing** | Select whether to enable or disable **ray tracing **for your project. > **tip:** For more information about ray tracing in Unreal Engine, refer to the Hardware Ray Tracing and Path Tracing Features (-> ray-tracing-and-path-tracing-features-in-unreal-engine) page. |

- Select where you want to store your project, and give your project a name (4).

- Click **Create **(5) to finish creating your new project. Unreal Engine creates a new project with the settings you configured, and then automatically opens the project.

Once you have created your project, you can reload it when launching Unreal Editor either by selecting it on the launcher from the **My Projects **section or by creating a desktop shortcut with the target properties such as:

**windows:**

`UNREAL_ENGINE_ROOT\Engine\Binaries\Win64\UnrealEditor.exe "PROJECT_DIR\PROJECT_NAME.uproject"`

**macos:**

`UNREAL_ENGINE_ROOT/Engine/Binaries/Mac/UnrealEditor.app "PROJECT_DIR/PROJECT_NAME.uproject"`

**linux:**

> **note:** Launching projects directly from shortcuts is not available on Linux.

### Learning Resources

We provide a wide variety of resources to help you begin developing with Unreal Engine. A good way to find the resources most applicable to your development needs is to visit the Getting Started (-> getting-started) page in the UE Dev Community. The resources available include:

- Documentation

- Sample Projects

- Learning Resources

- Epic Games Dev Community

- Unreal Engine Videos

[image: Getting Started]

#### Unreal Engine Documentation

The Unreal Engine Documentation features quick-start guides, feature overviews and tutorials, reference pages, scripting and programming guides, release notes, and more.

We recommend you get started by learning the basics of Unreal Editor through Getting Started with Unreal Engine. Once you have a basic familiarity with the engine, you can search for information on the docs site to learn more about specific topics.

For information about using Datasmith, see the Datasmith (-> datasmith-plugins-for-unreal-engine) documentation.

##### Other Product Documentation

Epic Games has other products and services you can leverage for your development needs. You can explore these through the documentation for these products, like:

- MetaHuman

- Fab

- Twinmotion

- Fortnite

#### Sample Projects and Games

Working from a blank project can be intimidating if you are intending to build interactive functionality, but templates are still only starting points. Epic Games offers complete examples you can learn from, and customize to your own requirements.

We offer a large range of example projects and games, accessible through the **Samples **tab on the Launcher.

[image: Epic Games Launcher Feature Samples]

When you open one of these samples, you are redirected to its listing on Fab, where you can click **Add to My** **Library**. This makes it available for you to use to create projects.

[image: Fab City Sample]

Return to the Launcher and click the **Library **tab. Find the sample in the content listed, then click **Create Project**.

[image: Epic Games Launcher Library]

After the project installs, you can open it from the Project Browser or the Library page.

#### Learn Unreal Engine

If you want additional resources to learn more about working with Unreal Engine, our online Learning content (-> learning) offers a variety of on-demand options:

- You can improve your skills by working through courses, learning paths, and tutorials presented by both Epic Games and Epic Developer Community members.

- You can watch videos about Unreal Engine and its features. These include: - Live stream, training, and demonstration videos. - Recordings of demonstration and technical talks from GDC and other events.

Once you've mastered the basics, you can filter the content by topics such as Films & TV, Architecture, Virtual Production, Game Development, and more, to find the learning path that's right for you.

[image: Unreal Engine Learning]

### Support Resources

When you need specific answers to questions that arise during your development process using Unreal Engine, there are several options available to you to get the support you need.

#### Epic Pro Support

Unreal Engine licensees can optionally have access to premium support through Epic Pro Support as part of the license agreement. This is an exclusive support website where you can ask questions, get answers from Epic Games staff, and learn from the interactions of other developers with our staff.

To learn more about how to make the best use of our support site and grant access to additional staff, take a look at the various knowledge base articles which have been prepared.

#### Community Resources

Subscription licensees who have not purchased Epic Pro Support may also find it helpful to engage with our public community for discussions with other developers and to quickly search for known solutions. Visit the Unreal Engine Forums to engage in discussions with fellow developers.

#### Reaching Out to Epic Games Directly

Do you still have questions or issues? Get in touch, and we'll get you up and running as quickly as possible.

- Contact us through our support page.

- Contact your Epic Games Business Development representative for any questions about your license or to activate additional benefits.

- Email us at developer-access@unrealengine.com for general questions about the account or onboarding help.
