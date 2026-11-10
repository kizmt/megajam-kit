# Blueprint Debugging Example

https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-debugging-example-in-unreal-engine?application_version=5.9

> Pause execution using Breakpoints to inspect graphs and the values of variables.

[image: Blueprint Debugging Example]

Blueprint debugging is a powerful feature that provides the functionality to pause the execution of a game during Play In Editor(**PIE**) or Simulate In Editor(**SIE**) mode. When debugging, you can step through any graph of a Blueprint or Level Blueprint through the use of Breakpoints.

## Debugging Controls

The Blueprint Debugger provides control over execution of the game during PIE and SIE sessions. The controls become enabled in the Toolbar (-> toolbar-in-the-blueprints-visual-scripting-editor-for-unreal-engine) when the game is running. Different debugging controls appear depending on the type of Blueprint being debugged and the current state of the debugging session. Some controls only become enabled when relevant, such as when a **Breakpoint** is hit.

Both the Debug tab, which can be opened from the Blueprint Editor's window menu, and the Blueprint Debugger will display the context-sensitive debugging buttons when PIE or SIE modes are active.

## Enable Debugging

To Enable Debugging of a Blueprint, you must first specify the instance of the Blueprint you wish to debug that is in your level.

Inside your Blueprint, click the **Debug Object** drop-down menu, then select the instance you wish to see in the debugger.

Once you have an object selected, you can jump to that object in your level by clicking the magnifying glass icon.

When you play in the editor, with your Blueprint up in another window, you should see the pulsating "Active Wires" as your script executes.

In the example above, there are two Input Axis Events that call a function in Blueprints to add movement to the Pawn's Controller. You can see in the left window that the script executes when the game is launched (as the pulsating wire leaves the red InputAxis Event node and enters the Add Controller input nodes)

## Breakpoints

**Breakpoints** are markers that can be placed on Blueprint graph nodes. When a node with a Breakpoint is about to be executed during PIE or SIE mode, the game will pause and the developer will be taken to the node in the Blueprint Editor's graph view. This provides the opportunity to observe the values of variables and examine or step through the flow of execution within the Blueprint. All Breakpoints for a given Blueprint are displayed in the **Debug tab**, and can be viewed in the Blueprint's graph when selected. To place a Breakpoint on a node, right-click the node and select **Add Breakpoint** from the context menu, at which point a solid, red octagon will appear in the upper-left corner of the node. The Breakpoint can be removed by right-clicking the node again, or by right-clicking the Breakpoint's entry in the Debug tab, and selecting the **Remove Breakpoint** command.

This Breakpoint will interrupt the game when the Jump node is executed.

To disable a Breakpoint temporarily without fully removing it, you can right-click on either the Blueprint node itself, or the Breakpoint's entry in the Debug tab, and choose **Disable Breakpoint** from the context menu. A disabled Breakpoint will appear as an outline of a red octagon. Disabled Breakpoints will not execute, but can easily be enabled again. This process is more convenient and less prone to human error than destroying and remaking Breakpoints repeatedly.

This Breakpoint has been disabled and currently does nothing, but can easily be enabled again if it is needed.

To enable a disabled Breakpoint, **Right-click** on the node and choose **Enable Breakpoint** or click the icon next to the Breakpoint in the **Debug** tab. This can also be done by **Right-clicking** the Breakpoint in the **Debug** tab and choosing **Enable Breakpoint**. Breakpoints can be created, disabled, enabled, or destroyed at any time, including during a debugging session. Breakpoints are saved in project .ini files, so they will persist between Editor sessions.

If a Breakpoint is placed at an invalid location, it may appear yellow and feature an exclamation point. In some cases, compiling the Blueprint will resolve the issue. If this is not the case, holding the mouse cursor over the Breakpoint icon will reveal an explanation.

This Breakpoint is invalid and will never be hit. In some cases, recompiling the Blueprint can fix this.

When pausing execution with a Breakpoint, the Editor will highlight and focus the node, and will place a large, red arrow over it.

This Breakpoint has just been hit, pausing execution.

## Watches

**Watches** keep track of the value of Blueprint node pins for quick reference during debugging sessions. A pin holds the value that was computed on the most recent time the node containing the pin executed. To place a Watch on a pin, right-click the pin's name in the Blueprint Graph and select **Watch this value** from the context menu. Pins that you are already watching will replace **Watch this value** with **Stop watching this value** in the context menu.

Pins whose nodes have not executed yet do not have debugging information available, and will show a message indicating this fact rather than a data value. This is because the pin's value is only updated when the node executes its underlying code, and is therefore invalid until the node has executed at least once. Even Blueprint variable nodes need to execute code to retrieve the variable's value, and will do so only when another node attempts to access their output value.

## Debug Window and Blueprint Debugger

The **Debug** window shows Breakpoints, Watches, and the current code execution trace stack. This window also features execution controls, so you can stop, resume, or step through your code when using Breakpoints. You can use tabs to switch between the full execution call stack and the Breakpoint, Watch, and call stack information for specific Blueprint instances.

### Watch Window

The **Blueprint Watch Window** speeds up debugging by giving you access to the data that you want to watch. You can watch Blueprint classes that you open in the Editor and that are part of the current call stack. When execution pauses, you can see a consolidated call stack populated with current data. You can jump between Blueprints with ease and inspect property values and node outputs. This view supports expansion of Arrays, Sets, Maps, and other data structures, making drill-down examination of any data they contain quick and convenient. You can also click on an entry in the **Node Name** column to go to that node in any Blueprint class, or select an entry in the **Object Name** column to select that specific instance.

### Call Stack

The **Call Stack** that is available during debugging sessions is similar in concept to the call stack that is found in most C++ development environments. It reveals the flow of execution between Blueprints visual scripting functions and native (C++) code functions. The Blueprint visual scripting function currently executing is at the top of the stack.

Blueprint Macros do not show up in the Call Stack. Instead, they appear as part of the function that called them.

The Blueprint Function above get's all Actors of a certain class and deactivates its components. A Breakpoint has been set at the end of the function.

When a Breakpoint is hit, the Call Stack lists the functions currently in operation, starting with the current function at the top, and proceeding downward to the calling functions. This means that each line entry contains the name of a function that was called by the function named on the line immediately below it. In the case of a recursive (self-calling) function, the same function name may appear multiple times in a row.

This Call Stack shows a call into the Third Person Character's Event Graph when the Player pressed the custom function "FindActorPressed" as shown above. This was originally called from the Actor's Blueprint Event Graph, which in turn was responding to the FindActorPressed Action mapping event called from the Player Input Component in Native code.

To view (or hide) the Call Stack, right-click on the Blueprint Debugger window, then from the dropdown, select Call Stack.

The Blueprint call stack can be tedious to inspect from the C++ call stack. To get a snapshot of the Blueprint call stack in your IDE, call `{,,UnrealEditor-Core}::PrintScriptCallstack()` in the Immediate window when stopped at a breakpoint. This only works in editor builds.

### Execution Trace

The **Execution Trace** stack shows a list of the nodes executed with the most recent at the top.

 [image: Blueprint Debugging - Execution Trace Stack]

This list updates as you step through the graph when debugging.

- blueprints

On this page

- Debugging Controls (-> blueprint-debugging-example-in-unreal-engine)
- Enable Debugging (-> blueprint-debugging-example-in-unreal-engine)
- Breakpoints (-> blueprint-debugging-example-in-unreal-engine)
- Watches (-> blueprint-debugging-example-in-unreal-engine)
- Debug Window and Blueprint Debugger (-> blueprint-debugging-example-in-unreal-engine)
- Watch Window (-> blueprint-debugging-example-in-unreal-engine)
- Call Stack (-> blueprint-debugging-example-in-unreal-engine)
- Execution Trace (-> blueprint-debugging-example-in-unreal-engine)

Related documents

Blueprint Debugger

 [image: Blueprint Debugger] (-> blueprint-debugger-in-unreal-engine)Blueprints Visual Scripting

 [image: Blueprints Visual Scripting] (-> blueprints-visual-scripting-in-unreal-engine)
