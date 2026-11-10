# Updating Projects to Newer Versions of Unreal Engine

https://dev.epicgames.com/documentation/en-us/unreal-engine/updating-projects-to-newer-versions-of-unreal-engine?application_version=5.9

> Learn how to update projects to a newer version of Unreal Engine.

[image: Updating Projects to Newer Versions of Unreal Engine]

This page shows how to use Unreal Engine's built-in project update feature to convert your Unreal Engine project to a newer version of the engine.

After you update a project to a newer version of Unreal Engine, you **will not** be able to open it in an older Unreal Engine version. As a best practice, we always recommend converting a copy of the project by following the steps below. Once you make sure your converted project works as intended, you can manually delete the old version.

## Prerequisites

This workflow requires **Visual Studio 2019** to be installed on your machine.

## Converting a Project

To convert a project, follow these steps:

- Launch the version of Unreal Engine to which you want to convert your project. For example, if you have an Unreal Engine 5 project, and you want to convert it to Unreal Engine 5.1, launch Unreal Engine 5.1.

- In the **Unreal Project Browser** window that opens, find the project you want to convert. Use the search bar (1) to find the project by name. Note that the version of Unreal Engine that the project was created with displays on the project tile (2). Click the image for full size.

- Click the project tile to select it, then click **Open**.

- In the dialog window that appears, click **Open a Copy** to have Unreal Engine create a copy of your project and attempt to update it and open it in the current version. If you click **More Options**, you also have access to the following options: | **Option** | **Description** |
| --- | --- |
| **Convert in-place** | If you select this option, Unreal Engine attempts to convert the original project as it is without making a copy first. This can cause irreversible data corruption and data loss if the conversion fails. |
| **Skip conversion** | If you select this option, Unreal Engine attempts to open the project as it is, without attempting to upgrade it first. This can cause irreversible data corruption and data loss if the project fails to open. |

## Conversion Result

Regardless of the option you select, Unreal Engine attempts to automatically generate the code for your project files.

If the conversion succeeds, your project will open in the Unreal Editor.

If the conversion fails, Unreal Engine will display an error log with more information about the failure and why it occurred. You need to resolve the causes of the failure manually before attempting to update the project again.

- projects
- templates

On this page

- Prerequisites (-> updating-projects-to-newer-versions-of-unreal-engine)
- Converting a Project (-> updating-projects-to-newer-versions-of-unreal-engine)
- Conversion Result (-> updating-projects-to-newer-versions-of-unreal-engine)
