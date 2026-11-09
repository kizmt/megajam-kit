# Using RenderDoc with Unreal Engine

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-renderdoc-with-unreal-engine?application_version=5.9

> RenderDoc is a standalone open-source graphics debugger that you can use to perform single-frame captures and inspect them.

[image: Using RenderDoc with Unreal Engine]

RenderDoc is a free standalone open-source graphics debugger that you can use to perform single-frame captures of an application, such as Unreal Engine. The capture is loaded into RenderDoc to inspect what is happening on the GPU through the events, API, and much more, in full detail.

## Install RenderDoc

RenderDoc is an open-source graphics debugger that is free, and available to download and install from RenderDoc.org.

The list of supported operating systems and APIs below reflect what RenderDoc currently supports, which may differ from what Unreal Engine supports. For the latest updates, see RenderDoc's FAQ page.

RenderDoc supports the following Operating Systems:

- Windows 7, 10, and 11
- Linux
- Android

RenderDoc supports the following APIs:

- Vulkan
- D3D11
- D3D12
- OpenGL 3.2+
- OpenGL ES 2.0 — 3.2

## Enable RenderDoc in Your Project

The **RenderDoc** plugin is included with the engine and enabled by default. There are two ways you can run RenderDoc with your project: by command line argument, or a project setting.

When RenderDoc attaches on startup, you'll see the RenderDoc icon in the upper-right corner of the Level Viewport.

[image: RenderDoc Level Viewport Icon]

Follow the steps below to see how each is enabled.

### Enabling with Plugin Project Settings

In the Project Settings in **Plugins > RenderDoc** under **Advanced Settings**, enable **Auto attach on startup**. This method is ideal when you want to run RenderDoc on startup anytime the project loads.

[image: RenderDoc Plugin Settings]

### Enabling with Command Line

Enable command line arguments using an editor shortcut. In the **Shortcut** tab, add the following to the **Target** line: `-AttachRenderDoc`. This method is ideal when you only want to run RenderDoc some of the time.

[image: RenderDoc Project Shortcut Example]

## Performing a Frame Capture

The steps below describe at a high level how to perform a single-frame capture with your Unreal Engine project using the integrated RenderDoc plugin or directly from RenderDoc application.

Further details on functionality and use of RenderDoc can be found in RenderDoc Documentation.

### RenderDoc Plugin

The following steps are used to capture a frame using Unreal Engine's RenderDoc Plugin:

- Enable the RenderDoc plugin for your project.
- Open your project and scene where you want to perform a capture.
- Click the **RenderDoc Capture** button in the Level Viewport.Click image for full size.

### RenderDoc Application

The following are the high-level steps required to capture a frame using Unreal Engine with the standalone RenderDoc executable:

- Configure RenderDoc to launch your game or the UEEditor.exe with the appropriate command line arguments.Enable **Capture Child Processes** when launching with the UEEditor.exe.
- Launch the executable.
- Press the **F12** hotkey to perform a frame capture.

For full details on setting up RenderDoc, launching an application and performing a frame capture, see the RenderDoc Getting Started Guide.

## Project Settings

Use the Project Settings window to set additional RenderDoc Plugin settings. From the main menu, select **Edit** > **Project Settings** and then under the **Plugins** category, select **RenderDoc**.

| Property | Description |
| --- | --- |
| Frame Capture Settings |  |
| **Capture all activity** | When enabled, RenderDoc captures all activity in all viewports and Editor windows for the entire frame instead of only the current viewport. |
| **Capture all call stacks** | When enabled, RenderDoc captures call stacks for all API calls. |
| **Reference all resources** | When enabled, RenderDoc includes all rendering resources in the capture, even those that have not been used during the frame.Enabling this property will significantly increase capture size. |
| **Save all initial states** | When enabled, RenderDoc always captures the initial state of all rendering resources, even if they are not likely to be used during the frame.Enabling this property will significantly increase capture size. |
| Advanced Settings |  |
| **Show help on startup** | When enabled, a help window with RenderDoc is shown on Editor startup. |
| **Use the RenderDoc crash handler** | If enabled, the RenderDoc crash handler is used if a crash occurs.This should only be used if you know the problem is with the RenderDoc application and would like to notify the RenderDoc developers. |
| **RenderDoc executable path** | Sets the path to the RenderDoc executable to use.This should automatically fill in when with the correct path when RenderDoc is installed. |

## Additional Notes and Resources

- See RenderDoc Documentation for further reading on RenderDoc use and analysis of frame captures.
- The RenderDoc Plugin was created and developed by Fredrik Lindh ("Temaran") for Unreal Engine. For additional information, see the RenderDoc GitHub respository.

- performance
- rendering
- optimization
- debugging

On this page

- Install RenderDoc (-> using-renderdoc-with-unreal-engine)
- Enable RenderDoc in Your Project (-> using-renderdoc-with-unreal-engine)
- Enabling with Plugin Project Settings (-> using-renderdoc-with-unreal-engine)
- Enabling with Command Line (-> using-renderdoc-with-unreal-engine)
- Performing a Frame Capture (-> using-renderdoc-with-unreal-engine)
- RenderDoc Plugin (-> using-renderdoc-with-unreal-engine)
- RenderDoc Application (-> using-renderdoc-with-unreal-engine)
- Project Settings (-> using-renderdoc-with-unreal-engine)
- Additional Notes and Resources (-> using-renderdoc-with-unreal-engine)
