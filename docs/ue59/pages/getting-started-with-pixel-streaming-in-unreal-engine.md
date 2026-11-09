# Getting Started with Pixel Streaming in Unreal Engine

https://dev.epicgames.com/documentation/en-us/unreal-engine/getting-started-with-pixel-streaming-in-unreal-engine?application_version=5.9

> Get up and running streaming an Unreal Engine application from one computer to other computers and mobile devices on the same network.

[image: Getting Started with Pixel Streaming in Unreal Engine]

Follow the steps below to stream the rendered output from your Unreal Engine project over your local network to browsers and mobile devices.

The images for the steps on this page illustrate the procedure using a project built from the **Third-Person Blueprint** template. However, the same steps should work for any Unreal Engine project.

## Prerequisites

- **Check your OS and hardware:** The Pixel Streaming plugin can only encode video on computers running Windows, Linux, or Mac operating systems, with certain specific types of GPU hardware. For details, see the Pixel Streaming Reference (-> unreal-engine-pixel-streaming-reference).
- **Open network ports:** Make sure you have the following network ports open for communication on your local network: 80, 8888. If you need to change these defaults, see the Pixel Streaming Reference (-> unreal-engine-pixel-streaming-reference).
- **Stop other web servers:** If your computer is running any other Web servers, stop them for now.
- **IP addresses:** You'll need to know the IP address of your computer if you intend to test Pixel Streaming over the Internet. It's a good idea to get started with Pixel Streaming within a LAN or VPN first, which means you can use `localhost` or `127.0.0.1` as your Pixel Streaming IP address. If you are trying to connect from a machine on a different network, you'll likely need to configure your signalling server to use a STUN / TURN server. See the Pixel Streaming Reference (-> unreal-engine-pixel-streaming-reference) for details on how to configure your signalling server with `peerConnectionOptions` that specify a STUN / TURN server.

## 1 - Prepare Your Unreal Engine Application

In this step, you will create a standalone executable file for your project.

The Pixel Streaming Plugin only works when you run your project as a packaged application, or when you launch it from the Unreal Editor using the **Standalone Game** option.

The procedure below shows how to set this up for both scenarios.

- Open your project in the Unreal Editor.
- From the main menu in the Unreal Editor, select **Edit > Plugins**.
- Under the **Graphics** category, find the **Pixel Streaming** or **Pixel Streaming 2** Plugin and check its **Enabled** box.[image: Enable the Pixel Streaming plugin]
- Click **Restart Now** to restart your Project and apply the change.[image: Restart now]
- Back in the Unreal Editor, choose **Edit > Project Settings** from the main menu.
- If your project involves a character, and you want to enable input from touch devices such as phones and tablets to move that character around the level, you may want to show the on-screen touch controllers. Under the **Engine > Input category**, find and enable the **Always Show Touch Interface** setting.[image: Always Show Touch Interface]This is optional, and not required for all projects. However, for projects like the Third-Person Template, this makes sure that users with touch devices can control the streamed application (as long as the project's Player Controller supports touch input).
- From the main menu, choose **Edit > Editor Preferences...**
- Under the **Level Editor > Play** category, find the **Additional Launch Parameters** setting, and set its value to `-PixelStreamingURL=ws://127.0.0.1:8888`. [image: Image-of-project-settings]
- Package your project for Windows. From the main menu in the Unreal Editor, choose **Files > Package Project > Windows (64-bit)**. [image: Package for Windows 64-bit]
- Browse to the folder on your computer where you want the Unreal Editor to place the packaged version of your project, and click **Select Folder**. [image: Select a folder]
- The Unreal Editor begins the packaging process.[image: Packaging progress indicator]
- When the packaging process is finished, go to the folder that you selected in step 10 above. You'll find a folder called `Windows` with contents similar to the following: [image: Packaged output]
- Every time you start your packaged application, you need to pass it the same command-line flags set in step 8 above. One way to do this is to set up a shortcut: On the **Shortcut** tab of the **Shortcut Properties** window, append the text `-PixelStreamingURL=ws://127.0.0.1:8888` at the end of the **Target** field, and click **OK**. [image: Command line parameters]
- Press **Alt** and drag your `.exe` file to create a new shortcut in the same folder (or anywhere else you like on your computer). [image: Create a shortcut]
- Right-click the shortcut and choose **Properties** from the context menu. [image: Shortcut properties]
- On the Shortcut tab of the **Shortcut Properties** window, append the text `-PixelStreamingURL=ws://127.0.0.1:8888` at the end of the **Target** field, and click **OK**.[image: Add-to-target-field]

Once you've got the Pixel Streaming system up and running, you may want to add the `-RenderOffScreen` command-line parameter. If your Unreal Engine application window ever gets accidentally minimized, the Pixel Streaming input stream may stop working. `-RenderOffScreen` avoids this possibility by running the application in a headless mode without any visible window.

### End Result

You now have a packaged, standalone Unreal Engine application that has the Pixel Streaming plugin enabled, ready to stream its rendered frames and audio.

## 2 - Get the Pixel Streaming Servers

Recent changes to Pixel Streaming have moved the frontend and web server elements of Pixel Streaming to an external repository. We refer to this as the Pixel Streaming infrastructure.

There are a few ways to access the Pixel Streaming infrastructure.

- Directly access the github repository as found here: https://github.com/EpicGamesExt/PixelStreamingInfrastructure
- Use `git clone --branch UEX.Y https://github.com/EpicGamesExt/PixelStreamingInfrastructure.git` in your preferred terminal (make sure you have git installed). Replace UEX.Y with your desired branch, such as 5.7.
- Navigate to `\Engine\Plugins\Media\PixelStreaming\Resources\WebServers` and run the `get_ps_servers` command (make sure to use the `.bat` script for Windows and `.sh` script for Linux or Mac accordingly). This will automatically pull the relevant branch of the Pixel Streaming infrastructure into that folder.

For more information about the Pixel Streaming frontend and web server changes, see Pixel Streaming Infrastructure

## 3 - Start the Servers

In this step, you will start the web services that will help to establish peer-to-peer connections between your Unreal Engine application and clients' browsers. If you have not done the previous step, you will not have access to these servers.

The following steps assume you are using Windows. However, Linux and Mac both use the same process except that you run the scripts in the `SignallingWebServer\platform_scripts\bash` folder instead.

- In the location you pulled the Pixel Streaming Infrastructure, find the location of the Signalling Server under the folder `SignallingWebServer`.
- To prepare for the Signalling Server, start by opening PowerShell as Administrator and running `SignallingWebServer\platform_scripts\cmd\setup.bat`. This will install all the required dependencies.
- Start the Signalling Server by running `SignallingWebServer\platform_scripts\cmd\start_with_stun.bat`. When the server has started and is ready to accept connections, you'll see the following lines in the console window: C++ ```
WebSocket listening to Streamer connections on :8888
        WebSocket listening to Players connections on :80
        Http listening on *: 80
``` WebSocket listening to Streamer connections on :8888 WebSocket listening to Players connections on :80 Http listening on *: 80
- Now, start the Unreal Engine application from the shortcut that you created in the previous section. Or, if you prefer to launch your application from the command line, execute the following command: C++ ```
MyPixelStreamingApplication.exe -PixelStreamingURL=ws://127.0.0.1:8888
``` MyPixelStreamingApplication.exe -PixelStreamingURL=ws://127.0.0.1:8888

For convenience, when you package your Unreal Engine application, these servers are also copied to the folder that contains your packaged executable. You'll find them under the Engine sub-folder, at the same paths indicated above. You can launch the servers from there instead of launching them from your Unreal Engine installation folder.

However, remember that if you need to modify any files in these folders, particularly the player page or configuration file for the Signalling and Web Server, you should modify them in the original location. If you modify them in your package folder, your changes may be overwritten the next time you package your application.

### End Result

When the Unreal Engine application connects to the Signalling and Web Server, you should see the following line of output in the console window opened by the Signalling and Web Server:

`Streamer connected`

This means that you now have the Unreal Engine application running with the Pixel Streaming plugin enabled, and the frontend Signalling and Web Server is ready to route connecting clients to the Unreal Engine application.

If necessary, you can stop and restart the Unreal Engine application and the Signalling and Web Server independently. As long as they're both running at the same time, they should be able to reconnect automatically.

At this point, you have everything you need set up and working on your computer. All that's left is to connect a browser.

## 4 - Connect!

In this step, you'll connect Web browsers running on multiple different devices to your Pixel Streaming broadcast.

- On the same computer running your Unreal Engine application, press alt-tab to switch the focus away from the Unreal Engine application, and start a supported Web browser (Google Chrome and Mozilla Firefox are safe choices).
- In the address bar, navigate to `http://127.0.0.1`. This IP address of the local machine, so the request should be served by the Signalling Server:[image: Connect to the localhost]
- Click the page to connect, then click again on the Play button to start the stream.
- You'll now be connected to your application, and you should see the rendered output streaming into the middle of the player Web page:[image: Media streaming to localhost]The default player page is already set up to forward keyboard, mouse, and touchscreen input to the Unreal Engine, so you can control the application and navigate around exactly the way you would if you were controlling the app directly.
- Click the **Add (+)** button at the left of the window to expand some built-in options for controlling the stream. For a breakdown of the options available, please refer to the repository here: https://github.com/EpicGamesExt/PixelStreamingInfrastructureTo see how frontend controls are implemented, study the contents of Frontend/
- Now, find other computers and/or mobile devices in your network. Repeat the same steps, but instead of using `http://127.0.0.1`, direct the browser to the IP address of the computer running the Unreal Engine application and the Signalling Server.[image: Media streaming to remote host]

### End Result

You now have one instance of Unreal Engine running on your computer, broadcasting a media stream to multiple devices over your local network. Each connected device sees the same view of the same Level, all rendered on the same original desktop PC.

By default, all connected devices share control over the Unreal Engine application, forwarding all keyboard, mouse, and touchscreen inputs.

|  |  |  |
| --- | --- | --- |
|  |  |  |
| Desktop | iPhone | Android |

## 5 - On Your Own

The steps above walk you through a relatively simple setup that uses a single server host and a default player page. With a little more effort, you can take the Pixel Streaming system much farther. For example:

- You can completely redesign the player HTML page to meet the needs of your project. Control who can send input to the Unreal Engine application, and even create HTML5 UI elements on the page that emit custom gameplay events to the Unreal Engine. For details, see Customizing the Player Web Page (-> customizing-the-player-web-page-in-unreal-engine). For a working example, see the Pixel Streaming Demo (-> pixel-streaming-sample-project-for-unreal-engine) available in the **Learn** tab of the Epic Games Launcher.
- If you need to provide Pixel Streaming services over the open Internet, or across subnets, you will likely need to do some more advanced network configuration. Or, you may prefer to have each connecting client stream content from a separate instance of the Unreal Engine, or through a separate player page that offers different controls. For details on topics like these, see the Hosting and Networking Guide (-> hosting-and-networking-guide-for-pixel-streaming-in-unreal-engine).
- Each component of the Pixel Streaming system has a number of configuration properties that you can use to control encoding resolution, screen size, IP addresses and communication ports, and more. For information on all these properties and how to set them, see the Pixel Streaming Reference (-> unreal-engine-pixel-streaming-reference).
- To check out new experimental features in Pixel Streaming, see the Experimental Pixel Streaming Features (-> experimental-pixel-streaming-features) page.
- The Stream Tuning Guide (-> stream-tuning-guide) page can help provide extra control over your stream quality and settings.

- getting started
- pixel streaming

On this page

- Prerequisites (-> getting-started-with-pixel-streaming-in-unreal-engine)
- 1 - Prepare Your Unreal Engine Application (-> getting-started-with-pixel-streaming-in-unreal-engine)
- End Result (-> getting-started-with-pixel-streaming-in-unreal-engine)
- 2 - Get the Pixel Streaming Servers (-> getting-started-with-pixel-streaming-in-unreal-engine)
- 3 - Start the Servers (-> getting-started-with-pixel-streaming-in-unreal-engine)
- End Result (-> getting-started-with-pixel-streaming-in-unreal-engine)
- 4 - Connect! (-> getting-started-with-pixel-streaming-in-unreal-engine)
- End Result (-> getting-started-with-pixel-streaming-in-unreal-engine)
- 5 - On Your Own (-> getting-started-with-pixel-streaming-in-unreal-engine)
