# Using Pix on Windows with Unreal Engine

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-pix-on-windows-with-unreal-engine?application_version=5.9

> Instructions on how to get started using Pix with Unreal Engine

Pix is a free standalone proprietary graphics debugger maintained by Microsoft, that you can use to perform single-frame captures of an application, such as Unreal Engine. The capture is loaded into Pix to inspect what is happening on the GPU through events, API calls, and more, in full detail.

## Install Pix

Pix is available to download and install from thePix on Windows website. The list of supported operating systems and APIs below reflect what Pix currently supports, which may differ from what Unreal Engine supports. For the latest updates, seePix’s Download page.

Pix supports the following Operating Systems:

- Windows 10 and 11

Pix supports the following Graphics APIs:

- D3D11 (Using an emulator, instructions are provided below (-> using-pix-on-windows-with-unreal-engine).)

- D3D12

- Xbox GDK (Not covered in this article.)

## Enable Pix in Your Project

You need to install Windows on Pix on your system before being able to use it. As of Unreal Engine 5.5, all you need to do to enable Pix is to pass in the `-AttachPix` command line argument when launching your project.

When Pix attaches on startup, you'll see the Pix application icon in the upper-right corner of the Level Viewport.

 [image: Pix application icon in the Level Viewport]

For more detailed steps, please follow the instructions below.

## Enabling Pix through Shortcut Properties

- Enable command line arguments using an editor shortcut.

- In the Shortcut tab, add the following to the Target line: `-AttachPix`.

This method is ideal when you only want to run Pix some of the time. You can also provide this command line argument inside Visual Studio or any other IDE that supports passing in command line arguments at launch.

 [image: Pix shortcut properties]

## Performing a Frame Capture

The steps below describe at a high level how to perform a single-frame capture with your Unreal Engine project using the integrated Pix plugin or directly from the Pix application.

You can find further details on functionality and use of Pix in the Pix Documentation.

## Pix Application

The following are the high-level steps required to capture a frame using Unreal Engine with the standalone Pix executable:

- Configure Pix to launch your game or the UEEditor.exe with the appropriate command line arguments. You can either choose to launch the application through PIX or attach to a running process.

- Once launched, you can press the in-editor capture button or use the Pix's native capture button to capture a single frame.

 [image: Pix attach options]

If you are using a D3D11 application, make sure to select the Force D3D11On12 option.

- Launch the executable. The Pix capture button should automatically appear in the level viewport.

- Press the capture button and the capture should open automatically within Pix.

For full details on setting up Pix, launching an application and performing a frame capture, see the Pix Take A Capture Guide.

## **Troubleshooting**

If you are having trouble seeing all of the events in your Pix captures, make sure to disable the **Use Less CPU in Background** editor setting.

 [image: Disable Use Less CPU in Background editor setting]

## **Additional Notes and Resources**

See Pix Documentation for further reading on Pix use and analysis of frame captures.
