# Remote Control Presets and Web Application

https://dev.epicgames.com/documentation/en-us/unreal-engine/remote-control-presets-and-web-application-for-unreal-engine?application_version=5.9

> Collect and organize UI parameters and functions into a Remote Control Preset and connect them to widgets in a web application.

[image: Remote Control Presets and Web Application]

Learn to use this **Beta** feature, but use caution when shipping with it.

With **Remote Control Preset**, collect and organize any UI parameters or functions in a single panel and expose them to the Remote Control API (-> remote-control-for-unreal-engine). These parameters and functions can be connected to widgets in a companion web application provided by the **Remote Control Web Interface** plugin to control the engine remotely. This web application has a built-in UI editor so you can customize its interface without any additional code to create or format it.

Since this is a web application, you can run multiple clients at the same time. Any properties that are modified in one client will have their changes propagated through the web server to all the other clients. This can help create a collaborative workflow in a live environment.

 [image: GIF of light direction rotating when controlled using a Remote Control widget]

##

- beta
- optimization
- remote control

On this page

- (-> remote-control-presets-and-web-application-for-unreal-engine)
