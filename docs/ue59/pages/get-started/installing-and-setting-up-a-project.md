# Installing Unreal Engine and Setting Up a Project

https://dev.epicgames.com/documentation/en-us/unreal-engine/installing-and-setting-up-a-project?application_version=5.9

> A guide to installing Unreal Engine and setting up a project.

This guide will walk you through downloading and installing the latest version of Unreal Engine. Additionally, you’ll learn how to set up everything needed to complete this guide by creating a project and downloading the Control Rig sample pack from the Fab marketplace.

## Downloading and Installing Unreal Engine

Before you begin, let’s start by downloading the latest precompiled version of Unreal Engine from the Epic Games Launcher by following the steps below:

> **note:** If you’re working with a team or studio, you may have other requirements for how you acquire the engine, such as using source control or GitHub to retrieve the Unreal Engine source code and locally compile it on your machine. This guide does not cover these steps.
> If you have acquired Unreal Engine in this way, you can skip to the next section to create a project and start familiarizing yourself with the Unreal Editor and its workflows.

- Download and install the Epic Games Launcher.

- Open the Epic Games Launcher.

- Select Unreal Engine in the side navigation and **Library **in the top-level tabs.

- Next to **Engine Version**, click the **Add** (+) button to add an Engine Version Tile.

- On the **Engine Version Tile**, click **Install **to install the latest release of Unreal Engine.

- Use the **Choose Install Location** dialog to choose where the engine is installed.

- Click **Install**.

For a more detailed walkthrough of the steps above, see Install Unreal Engine (-> install-unreal-engine).

## Creating a Project

When you launch the Unreal Engine from the Epic Games Launcher, you’ll use the **Project Browser** to select an industry development category and a template project to start from. Template projects are a good starting point to familiarize yourself with the Unreal Editor as they may include different types of gameplay, project settings, enabled plugins, and more.

For the purposes of this guide, you’ll create a ThirdPerson template project you can use to explore the Unreal Editor’s features and its workflows, and how you can apply them to your work.

To get started creating a project, follow these steps:

- From the Epic Games Launcher, click **Launch **in the top-right corner to open the Unreal Engine. [image: Launch Unreal Engine.]

- After a moment, the **Project Browser** loads. From here you can select a template project to use. For the purposes of this guide and demonstration, select the **Games **tab in the left-side categories, and then the **Third Person** template to follow along most accurately. [image: Unreal Engine Project Browser] In the Project Browser window, you can optionally set the following: - Set a **Project Name** for what this project should be called. This is the name you can use to locate it in the Project Browser’s recent project’s tab or in the **Library** tab of the Epic Games Launcher. You can name this project anything you like. - Click **Create **when you’re ready to create and load your project. - Set a **Project Location** for where you want the project to be saved.

When the project loads, you should see the Unreal Editor and the default template project map on screen.

[image: Unreal Engine Third Person Template]

For more details on the Project Launcher and the available template projects, see the following documentation:

- Projects and Templates (-> working-with-projects-and-templates-in-unreal-engine)

- Creating a New Project (-> creating-a-new-project-in-unreal-engine)

- Templates Projects Reference (-> unreal-engine-templates-reference)

## Download the Control Rig Samples Pack

Before you can effectively follow the steps of this guide, you’ll need to download the Control Rig Samples Pack from Fab.com — Epic Games’ unified content marketplace for digital assets.

- In the **Content Browser**, click the **Fab **icon to open the Fab marketplace inside of Unreal Editor. [image: Access the Fab marketplace in Unreal Engine]

- Under the **Education & Tutorials **category, locate the Control Rig Sample Pack. [image: Education & Tutorials content on Fab marketplace.]

- Click **Add to My Library** to associate this content with your Epic Games account, making it easier to locate with your owned assets later to add to any other projects you have. [image: Control Rig Sample Pack for Unreal Engine.] Once added to your library, this part of the interface changes to quick access buttons to options to add the content directly to this project or to view in your Fab library of content you own. [image: Add this content to a project.]

- Click **Add to Project**. This downloads the content and installs it directly to your project. [image: Content downloading progress to your project.]

Once the content is downloaded, you can locate the downloaded content folder in the Content Browser.

[image: The Control Rig Sample Pack is added to your project and accessible from the Content Browser.]

You’ll use this in the next section of this guide when you start to animate a character in Sequencer that has a control rig.

## Additional Notes for Projects

### Fab Marketplace and Unreal Engine

The Fab marketplace is a unified platform where creators can discover, buy, sell, and share high-quality, real-time-ready digital assets and plugins.

Unreal Engine has integration with the marketplace through the Fab plugin, which enables you to open to the marketplace directly in the Unreal Editor and download content for your project.

Fab includes paid and free content for you to use in your projects, which includes Epic’s freely available samples and content packs which you can find under Unreal Engine > Education & Tutorials here.

You can learn more about using Fab with Unreal Engine here:

- Fab in Unreal Engine

### Source Control

For teams already using or considering source control in their projects, see Collaboration and Version Control in Unreal Engine (-> collaboration-and-version-control-in-unreal-engine).

## Next Step

In this next step, you’ll dive into using the Animation features of Unreal Engine with our cinematic tool Sequencer and a prop that uses a set up Control Rig. You’ll create a simplistic animation while learning about the basics of these tools and assets so that you can apply these to your own projects.

- How to Animate with Sequencer (-> how-to-animate-with-sequencer): How to setup a scene with a level sequence and animate a control rigged character.
