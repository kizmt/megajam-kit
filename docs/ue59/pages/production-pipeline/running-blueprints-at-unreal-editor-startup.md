# Running Blueprints at Editor Startup

https://dev.epicgames.com/documentation/en-us/unreal-engine/running-blueprints-at-unreal-editor-startup?application_version=5.9

> Describes how to define Blueprint functions that the editor invokes when it starts up.

[image: Running Blueprints at Editor Startup]

Learn to use this **Beta** feature, but use caution when shipping with it.

You can set up the **Unreal Editor** to always run predefined Blueprint graphs every time your Project is opened. This can help you to ensure that the editing environment is set up the way you are expecting, regardless of who opens your Project or what computer they open it on. For example, depending on the needs of your content development pipeline or production standards, you may need to initialize some editing systems that you have created, load or modify content, reimport **Assets** from disk to pick up latest modifications, open custom **Editor Utility Widgets**, or bind to events that may occur during the editing session.

The instructions on this page show how you can register Editor-only Blueprint classes as **startup objects**, so that the Unreal Editor will invoke functions on those objects every time it starts up.

These instructions work with any Editor Utility Blueprint that derives directly or indirectly from **EditorUtilityObject**, and with any Editor Utility Widget.

## Steps

- If you don't already have an Editor Utility Blueprint that derives from **EditorUtilityObject**, or an Editor Utility Widget, create one. For example, these instructions create a new Editor Utility Blueprint: Right-click in the **Content Browser** and choose **Editor Utility > Editor Utility Blueprint**. [image: Create a new Editor Utility Blueprint]

- Choose a parent class. **EditorUtilityObject** is a safe choice, but you could choose any other class that derives from **EditorUtilityObject**. Click **Create**. [image: EditorUtilityObject parent class]

- Enter a descriptive name for your new class, and press **Enter**. [image: Rename the new class]

- Double-click your Blueprint class to open it in the **Blueprint Editor**.

- Override the **Run** function for the class. To do this, hover over the **Functions** group in the **My Blueprint** panel until the **Override** button appears. Click the **Override** button and select **Run** from the dropdown list. [image: Override the Run function] The Blueprint Editor creates a new **Event Run** node in the **Event Graph**. Add the Blueprint logic you want to trigger here. For example, this implementation writes a message to the log to indicate that the function was called, then spawns a cube in the middle of the editor's default startup Level. [image: A simple Run implementation]

- **Compile** and **Save** your Blueprint class.

- Shut down the Unreal Editor.

- Find the `DefaultEditorPerProjectUserSettings.ini` file, which is located in your Project folder at `Project/Config/DefaultEditorPerProjectUserSettings.ini`. If this file does not exist, create it.

- Open `DefaultEditorPerProjectUserSettings.ini` in a text editor.

- Find the following section of the file: ```
        [/Script/Blutility.EditorUtilitySubsystem]

``` [/Script/Blutility.EditorUtilitySubsystem] If this section doesn't exist, create it.

- For each Blueprint class that you want to act as a startup object, add the path to that class as a new value in the `StartupObjects` array. Start the path with `/Game/`, then add the path to the Blueprint class as shown in the **Content Browser**. Follow the object name with a period (`.`) character, then repeat the object name again. For example, to register the object created under step 1 above, you would use: ```
    [/Script/Blutility.EditorUtilitySubsystem]
    StartupObjects=/Game/ThirdPerson/CustomBP/MyStartupObject.MyStartupObject
``` [/Script/Blutility.EditorUtilitySubsystem] StartupObjects=/Game/ThirdPerson/CustomBP/MyStartupObject.MyStartupObject If you need to register multiple startup objects, precede each additional line with a plus (`+`) character. For example, a possible configuration with three startup objects might look like this: ```
    [/Script/Blutility.EditorUtilitySubsystem]
    StartupObjects=/Game/Folder/MyClass.MyClass
    +StartupObjects=/Game/AnotherFolder/MyOtherClass.MyOtherClass
    +StartupObjects=/Game/AnotherFolder/MyThirdClass.MyThirdClass
``` [/Script/Blutility.EditorUtilitySubsystem] StartupObjects=/Game/Folder/MyClass.MyClass +StartupObjects=/Game/AnotherFolder/MyOtherClass.MyOtherClass +StartupObjects=/Game/AnotherFolder/MyThirdClass.MyThirdClass

- Save and close the `.ini` file.

- Restart the Unreal Editor and reload your Project.

## End Result

When you reload your Project, the editor Utilities Subsystem automatically creates an instance of each Blueprint class that you identified as a startup object. For each instance, it calls your custom implementation of the **Run** function.

For example, the **Run** function implemented in the preceding steps has two effects:

- A line printed in the **Output Log**:

- A newly spawned cube in the center of the Level:

## Binding to Editor Events

One useful possibility for startup objects is to bind custom events in your Blueprint class to other events that may occur as a user works on your Project content in the Unreal Editor. Because the startup object is guaranteed to be invoked any time the Project content is opened by any user, this can help you to guarantee a consistent editing experience.

For example, this implementation of the **Run** function binds to an event triggered by the **Import Subsystem** any time the editor imports a new Asset. In this case, it prints the name of the Asset to the screen and the log. You could also use the information returned about the new Asset to carry out additional steps, like validating that the name or folder location of the new Asset matches the naming conventions and content conventions that you use in your Project. Putting this kind of check in a startup object helps guarantee that the same validation steps happen for all users that contribute content to your Project.

Drag left from the **Event** input on the **Bind Event to...** node and choose **Add Event > Add Custom Event** to get a custom event node that exposes additional inputs, like the **In Factory** and **In Created Object** shown above.

Your startup object can only bind to other objects that exist at the time the editor starts up. In addition, the binding becomes lost if the bound object leaves memory—for example, if a Level is closed and reopened. For that reason, it's safest to bind to objects that will be available during the entire editing session, like the Subsystem shown in the example above.

For more about binding to Blueprint events, see Event Dispatchers (-> event-dispatchers-in-unreal-engine) and Binding and Unbinding Events (-> binding-and-unbinding-events-in-unreal-engine). For more about Subsystems and how to access them, see Programming Subsystems (-> programming-subsystems-in-unreal-engine).

- editor
- blueprints
- beta
- scripting
- blueprint utilities

On this page

- Steps (-> running-blueprints-at-unreal-editor-startup)
- End Result (-> running-blueprints-at-unreal-editor-startup)
- Binding to Editor Events (-> running-blueprints-at-unreal-editor-startup)

Related documents

Configuration Files

 [image: Configuration Files] (-> configuration-files-in-unreal-engine)
