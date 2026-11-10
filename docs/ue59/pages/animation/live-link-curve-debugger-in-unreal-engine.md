# Live Link Curve Debugger

https://dev.epicgames.com/documentation/en-us/unreal-engine/live-link-curve-debugger-in-unreal-engine?application_version=5.9

> Using the Live Link Curve Debugger, you can quickly see what the output is of various Live Link curves are in an easy to debug manner.

[image: Live Link Curve Debugger]

Learn to use this **Experimental** feature, but use caution when shipping with it.

When streaming content into Unreal Engine using the Live Link (-> live-link-in-unreal-engine) Plugin, you may want to view the various curves and values that are active. The **Live Link Curve Debugger **is a tool that enables you to quickly see what the output is of various Live Link curves are in an easy to debug manner.

## Enabling Live Link Curve Debugger

In order to use the Live Link Curve Debugger, you will first need to enable it from the **Plugins **menu:

- From the **Edit** menu, select **Plugins**.

- In the **Plugins **menu under **Animation**, enable both **Live Link **and **Live Link Curve Debug UI **options, and restart the Editor.

- From the **Window **option, under **Developer Tools**, select **Live Link Curve Debugger**. The **Live Link Curve Debugger** window will open.

## Using Live Link Curve Debugger

Once connected to Motion Builder with Live Link (-> live-link-stream-motionbuilder-to-unreal-engine), the content you have in your application will be accessible within Unreal Engine, include any animation curves. With the Live Link Curve Debugger, you can see a list of all the curves and curve values for the currently selected **Subject Name** which you can define by clicking the **Live Link Subject Name **drop-down menu and selecting your Subject.

Once you select a Subject, any curves will be displayed in the window along with their values.

Click image for full view.

If you haven't specified a Subject Name, as soon as one connects with some curves, the debugger will switch to that one. You can change this selection by clicking the **Live Link Subject Name** drop-down (in Editor or a Desktop build) or by typing **LiveLinkDebugger Next** in the command-line to cycle through different subject names (on other client builds)

Inside a client you can also use the command-line to show the Live Link Debugger with the command: **LiveLinkDebugger Show**

Optionally you may specify a Live Link Subject Name to start with in the command-line by using the command **LiveLinkDebugger Show** SubjectName (the name of your Subject).

- animation
- experimental
- live link

On this page

- Enabling Live Link Curve Debugger (-> live-link-curve-debugger-in-unreal-engine)
- Using Live Link Curve Debugger (-> live-link-curve-debugger-in-unreal-engine)
