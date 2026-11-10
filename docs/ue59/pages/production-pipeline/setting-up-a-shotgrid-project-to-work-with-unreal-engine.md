# Setting up a ShotGrid Project to Work with Unreal Engine

https://dev.epicgames.com/documentation/en-us/unreal-engine/setting-up-a-shotgrid-project-to-work-with-unreal-engine?application_version=5.9

> Describes how to set up an existing Autodesk ShotGrid project with a configuration that enables the Unreal toolkit engine.

[image: Setting up a ShotGrid Project to Work with Unreal Engine]

Learn to use this **Beta** feature, but use caution when shipping with it.

 [image: ShotGrid Project in Unreal Editor]

The process for setting up a ShotGrid project to work with Unreal Engine 5 is similar to the process for other applications in your content pipeline, such as Autodesk Maya or 3ds Max, or the Foundry's Nuke. You will configure your ShotGrid project to use a Toolkit engine: a collection of tools and scripts designed to make your ShotGrid project aware of Unreal Engine, and that integrate ShotGrid tools and workflows into the Unreal Editor interface.

The configuration outlined on this page is only done once for each ShotGrid project that you want to use with Unreal Engine, typically by a ShotGrid administrator. If you have already set up ShotGrid projects and configured them to integrate with other content creation tools, this process should be familiar to you. If not, refer to the following resources:

- The Integrations User Guide gives a high-level overview of how to get started with ShotGrid integrations.

- The Integrations Admin Guide describes more about pipeline configurations.

## Before you Start

We recommend using the project configuration set up for you in the tk-config-unrealbasic repository on GitHub. This configuration extends the basic ShotGrid toolkit config with the elements that make up the Unreal integration. We also offer a second example project configuration in the tk-config-unreal repository that is equivalent to ShotGrid's default2 config.

- To use this configuration from GitHub, you must have Git installed on your computer. If you don't already have Git installed, download it here.

- Download and install the **ShotGrid Desktop** application from the **Apps** menu of your site. [image: Downloading ShotGrid Desktop via the ShotGrid Apps menu]

## 1 - Adding Unreal Engine Software to ShotGrid

In this step, you'll add the Unreal Engine integration as new Software for your organization.

- Log in to your organization's ShotGrid URL in a web browser. Then, from the user menu in the top right, select **Software**.

- On the **Software** page, click **Add Software**.

- Set the **Software Name** to **Unreal Engine**, and set the **Engine** to **tk-unreal**.

- Click **Create Software**. When you return to the **Software** page, you should see a new entry in the list for Unreal Engine.

### End Result

ShotGrid is now aware of the Unreal Engine integration. Follow the steps in the next section to make any of your organization's ShotGrid projects work with the Unreal Editor.

## 2 - Set up the ShotGrid Project

In this step, you will add a **Pipeline Configuration** to your ShotGrid project and deploy it using a distributed configuration. This shares the configuration to everyone on the project with access to the ShotGrid website. You can also set up a centralized configuration on disk, if desired, by following the instructions in ShotGrid's documentation.

To add a Pipeline Configuration to your ShotGrid Project:

- Download the latest release of tk-config-unrealbasic as a .zip file from GitHub.

- On your ShotGrid Site, open your project and navigate to **Other** > **Pipeline Configurations**.

- On the **Pipeline Configurations** page, click **Add Pipeline Configuration**.

- Set the **Config Name** to Primary, and set the ***Plugin Ids** to **basic.***.

- Click **Create Pipeline Configuration**. When you return to the **Pipeline Configurations** page, you should see a new entry in the list for **Primary**.

- Click in the **Uploaded Config** field, and select **Upload File**. Provide the .zip file that you downloaded from GitHub here.

### End Result

Your ShotGrid project is now ready to use the Unreal Engine integration. The uploaded Pipeline Configuration will be automatically downloaded by each user from the site and installed by the ShotGrid Desktop. Subsequent updates to the configuration files inside of the .zip file will be detected and updated for each user if and when an administrator modifies the uploaded configuration.

## 3 - Set up the ShotGrid Project Configurations

In this step, you will install your Pipeline Configuration in ShotGrid Desktop and launch a ShotGrid-aware instance of Unreal Engine.

To install the Pipeline Configuration:

- Open ShotGrid Desktop and click on the project you just uploaded a Pipeline Configuration for on the ShotGrid website.

- When you click on the project, it detects the uploaded Pipeline Configuration and downloads it, along with all of the necessary ShotGrid components (engines, apps, and frameworks) from GitHub.

### End Result

When the project setup is complete, ShotGrid Desktop scans your computer for installations of Unreal Engine and lists them on the Apps page for your project. Click on the icon to launch the latest available version or the dropdown to choose a specific one.

 [image: Launch the latest version of Unreal Engine]

If you launch Unreal Engine from ShotGrid Desktop and open an Unreal Engine project that has the ShotGrid plugin enabled, you'll be able to use the ShotGrid integration as described on the [Using Unreal Engine with Autodesk ShotGrid](#using-unreal-engine-with-autodesk-shortgrid page.

## Next steps

- For more about how you can extend the toolkit configuration for your project, refer to Autodesk's Beyond Your First Project documentation.

- For more about how to manage project configurations in ShotGrid, refer to Autodesk's Configuration staging and rollout documentation.

- To see how the Unreal project configuration is set up, refer to the tk-config-unreal-basic repository.

- To explore the implementation of the Unreal toolkit engine, including the Python hooks it uses and exposes, refer to the tk-unreal repository.

- beta
- shotgrid
- integration

On this page

- Before you Start (-> setting-up-a-shotgrid-project-to-work-with-unreal-engine)
- 1 - Adding Unreal Engine Software to ShotGrid (-> setting-up-a-shotgrid-project-to-work-with-unreal-engine)
- End Result (-> setting-up-a-shotgrid-project-to-work-with-unreal-engine)
- 2 - Set up the ShotGrid Project (-> setting-up-a-shotgrid-project-to-work-with-unreal-engine)
- End Result (-> setting-up-a-shotgrid-project-to-work-with-unreal-engine)
- 3 - Set up the ShotGrid Project Configurations (-> setting-up-a-shotgrid-project-to-work-with-unreal-engine)
- End Result (-> setting-up-a-shotgrid-project-to-work-with-unreal-engine)
- Next steps (-> setting-up-a-shotgrid-project-to-work-with-unreal-engine)
