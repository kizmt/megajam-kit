# Scripting the Unreal Editor Using Python

https://dev.epicgames.com/documentation/en-us/unreal-engine/scripting-the-unreal-editor-using-python?application_version=5.9

> Describes how to use Python in the Unreal Editor to script content production tasks.

[image: Scripting the Unreal Editor Using Python]

Learn to use this **Experimental** feature, but use caution when shipping with it.

## Why Python?

In recent years, Python has become the standard language for production pipelines and interoperability between 3D applications, particularly in the media and entertainment industry. This is partially due to the wide range of applications that support it. As the complexity of production pipelines continues to rise and the number of applications involved continues to grow, having a common scripting language makes it easier to create and maintain large-scale asset management systems.

Even without these outside considerations, or the need to work with other applications, Python is a great choice if you want to automate your workflows in Unreal Editor. It's relatively easy for those new to programming to get started, it offers the ability to create complex and full-featured user interfaces through modules like PySide, and there are many other useful free modules available to the community.

You can use Python in Unreal Editor to do the following:

- Construct larger-scale asset management pipelines or workflows that tie Unreal Editor to other 3D applications that you use in your organization.
- Automate time-consuming Asset management tasks in Unreal Editor, such as generating Levels of Detail (LODs) for Static Meshes.
- Procedurally lay out content in a level.
- Control Unreal Editor from UIs that you create yourself in Python.

## Set Up Your Project to Use Python

Python support in Unreal Editor is provided by the **Python Editor Script Plugin**. You need to enable this plugin for your current project before you can run Python scripts in the editor.

You must enable the plugin separately for each project.

To enable the plugin:

- Open your project and select **Edit > Plugins** from the main menu.
- In the **Plugins** window, go to the **Scripting** section.
- Find the **Python Editor Script Plugin** in the right panel, and select its checkbox to enable it.[image: Enable the Python Editor Script Plugin]We recommend also enabling the **Editor Scripting Utilities** plugin, which offers simplified APIs for many common editor tasks. For details, see Scripting and Automating the Unreal Editor (-> scripting-and-automating-the-unreal-editor).
- Restart Unreal Editor.

### Python 3.11.8

The Python Editor Script Plugin contains an embedded version of Python 3.11.8, so you don’t have to install Python separately on your computer.

Unreal Engine uses Python 3.11.8 by default because it is an important part of the current VFX Reference Platform.To use a different version of Python, you can set the `UE_PYTHON_DIR` environment variable in your operating system to point to the installation you want to embed, then rebuild Unreal Engine from source.

## Ways to Run Python Code in Unreal Editor

You can run Python scripts in Unreal Editor in several ways, each designed for a different scenario. Choose the one that fits your needs.

Unlike Blueprints, the Python environment is only available **in Unreal Editor**, not when your project is running in Unreal Engine in any mode, including Play In Editor (PIE), Standalone Game, and cooked executables. That means that you can use Python freely for scripting and automating Unreal Editor or building asset production pipelines, but you cannot use it as a gameplay scripting language.

### The Python Console in the Output Log

You can switch Unreal Editor's console input bar to accept Python code instead of Unreal console commands.

[image: The Python console]

You can do this in the **Output Log** panel, as shown above, or when you open the console input bar by pressing the backtick (`) key.

When the console is in Python mode:

- You can enter lines of Python code into this console and have Unreal Editor run each one immediately, exactly as if you were using an interactive Python console in a command window. This is the only way to run Python code line by line. All other approaches on this page run a script file that you specify.
- You can run multiple lines of code at a time by using **Shift + Enter** to separate each line, or by pasting in a multi-line block that you copy from a text editor.
- You can run Python script files by typing the file name in the console. If your Python script requires additional command-line arguments, include them after the name of your script.

Output from the built-in Python `print` function is also redirected to the **Output Log** panel.

### The py Console Command

With the console in Cmd mode, you can use the `py` command to run the rest of the line as Python code, exactly as if you had typed it into the Python console described earlier.

For example, this command runs the specified script file:

 Command Line

```
py "C:\MyScripts\my_script.py"
```

py "C:\MyScripts\my_script.py"

Don't run this command in the value of the `ExecCmd` command-line parameter when you start Unreal Editor. This can cause your script to run before the editor environment is ready — for example, before the startup level is fully loaded. The following sections describe better options.

### The File Menu

The **File** menu in the main window of Unreal Editor includes options that you can use to run Python script files.

- Use **Execute Python Script** if you want to browse to a new script file on your computer that you have not run before.
- Use the **Recent Python scripts** list to rerun any script that you ran previously. The file is read from disk again, so if you changed the script in the meantime, the updated version runs.

[image: Execute Python from the File menu]

### The Command Line

If you start Unreal Editor from the command line or from a script, you can specify a Python script file in the command line arguments. If your Python script requires additional command-line arguments, include them after the name of your script.

You can run a Python script from the command line in two ways. In both approaches, Unreal Editor shuts down immediately after running your Python script.

**Option 1: Full Editor**
In this approach, the full Unreal Editor launches, opens your specified project, loads the default startup level, then runs your Python script once everything is loaded and ready. Use this approach if your script needs to interact with content in your project or in a level that takes time to load.

Add the `ExecutePythonScript` argument to the command line, and set its value to the path and filename of the Python script you want to run. For example:

 Command Line

```
> UnrealEditor-Cmd.exe "C:\projects\MyProject.uproject" -ExecutePythonScript="c:\my_script.py"
```

> UnrealEditor-Cmd.exe "C:\projects\MyProject.uproject" -ExecutePythonScript="c:\my_script.py"

This approach requires that you enable the Editor Scripting Utilities plugin for your project. You must also have enabled the Python Editor Script Plugin in the project that you specify on the command line.

**Option 2: Commandlet**
This approach runs quickly and can run your scripts in headless mode, without opening the Unreal Editor UI.

Add the following arguments to the command line for `UnrealEditor-Cmd.exe`: `-run=pythonscript -script=<script_file_or_code>`. `<script_file_or_code>` takes either of the following values:

- The path and filename of a Python script that you want to run.
- Python statements and commands that you want to run. If needed, you can use `\n` in the string to escape line breaks.

For example:

 Command Line

```
> UnrealEditor-Cmd.exe "C:\projects\MyProject.uproject" -run=pythonscript -script="c:\\my_script.py"
```

> UnrealEditor-Cmd.exe "C:\projects\MyProject.uproject" -run=pythonscript -script="c:\\my_script.py"

or:

 Command Line

```
> UnrealEditor-Cmd.exe "C:\projects\MyProject.uproject" -run=pythonscript -script="a=5 \nb=10 \nc=a+b \nf=open('D:\myfile.txt','w+') \nf.write(str(c)) \nf.close()"
```

> UnrealEditor-Cmd.exe "C:\projects\MyProject.uproject" -run=pythonscript -script="a=5 \nb=10 \nc=a+b \nf=open('D:\myfile.txt','w+') \nf.write(str(c)) \nf.close()"

This commandlet does not load levels automatically, so add the following line at the start of your script:

 Command Line

```
unreal.get_editor_subsystem(unreal.LevelEditorSubsystem).load_level("/Game/maps/UVlayoutTest.UVlayoutTest")
```

unreal.get_editor_subsystem(unreal.LevelEditorSubsystem).load_level("/Game/maps/UVlayoutTest.UVlayoutTest")

You must also have enabled the Python Editor Script Plugin in the project that you specify on the command line.

### The init_unreal.py File

If Unreal Editor detects a script file called `init_unreal.py` in any of the paths it is configured to use, it automatically runs that script.

Use this approach when you work on a project or plugin and everyone who works with that content needs to run the same initialization code every time Unreal Editor starts. Put your initialization code in a script with this name, and place it in the **Content/Python** folder within that project or plugin. Plugins that provide Python toolsets for AI agents also register those toolsets from this file. For more information, see the **Toolset Conventions** list in Using Python with AI Agents (-> using-python-with-ai-agents-in-unreal-engine).

### Startup Scripts

In your Project Settings, you can specify any number of Python scripts that you want to run every time you open that project. Unreal Editor runs these scripts after the default startup level is fully loaded.

Select **Edit > Project Settings**. Under the **Plugins** list, select **Python**. Then, add your scripts to the **Startup scripts** setting:

[image: Python startup scripts]

Restart Unreal Editor when done. The next time the editor loads your project, it runs your startup scripts.

### From Editor-Only Blueprints

The Python Editor Script Plugin exposes nodes to Blueprint Visual Scripting that you can use to run Python code snippets or files during the evaluation of a Blueprint graph.

Python execution nodes are only available in Editor-only Blueprint classes, such as Editor Utility Widgets and Editor Utility Blueprints. Refer to Scripting the Unreal Editor using Blueprints (-> scripting-the-unreal-editor-using-blueprints). You can't use this method in any Blueprint classes that are available at runtime, such as a class that you derive directly from **Actor**.

You can find the following nodes in the **Python > Execution** section of the Blueprint palette.

|  |  |
| --- | --- |
| [image: Execute Python Script] | Executes the literal Python code that you pass in to or type in the Python Command input. It is the recommended way to call Python from Blueprints, and supersedes creating a new `BlueprintFunctionLibrary(BPFL`) type in Python. |
| [image: Execute Python Command] | Executes the literal Python code or file that you pass in to or type in the Python Script input. The node determines from your input whether it’s literal code or a filename. The Return Value output is true if the Python code or file was executed successfully, or false otherwise. If it is false, you can find the errors in the Output Log. |
| [image: Execute Python Command Advanced] | Executes the literal Python code or file that you pass in to or type in the Python Script input. This node is similar to **Execute Python Command**, but offers some additional inputs and outputs that can be useful in some scenarios. |

## Python Environment and Paths in Unreal Editor

When you use a relative path to run a Python script, or to import another script module using the `import` command in one of your scripts, the script that you run or import can be in any path that is listed in the `sys.path` variable of your Python environment.

Unreal Editor automatically adds several paths to this `sys.path` list:

- The **Content/Python** subfolder in your project’s folder.
- The **Content/Python** subfolder in the main Unreal Engine installation.
- The **Content/Python** subfolder in each enabled plugin’s folder.
- The **Documents/UnrealEngine/Python** folder inside your user directory. For example, on Windows, this is `C:/Users/Username/Documents/UnrealEngine/Python`.

You can also add your own paths to `sys.path` in any of the following ways:

**In Project Settings**

- Select **Edit > Project Settings**.
- Under **Plugins**, select **Python**.
- Add your paths to the **Additional Paths** setting.
- Restart Unreal Editor.

[image: Additional Python paths]

**With an Environment Variable**

Add your paths to the `UE_PYTHONPATH` environment variable in your operating system, then restart Unreal Editor. If you disabled the isolated interpreter environment option, use `PYTHONPATH` instead.

**In a Python Script or the Python Console**

Add your paths directly to the `sys.path` list.

**From C++**

Use this option to add paths outside the standard Unreal Engine locations, such as a folder that a plugin downloads scripts to. Call `IPythonScriptPlugin::GetAdditionalPathsInterface()` to get the `IPythonAdditionalPaths` interface, then use it to add your paths.

- Each path has a single owner.
- The path must be absolute and must already exist. `AddAdditionalPath` returns false if the path is invalid or already on `sys.path`.
- You can give a path an optional mount point root, such as `/MyPlugin/Python/Extra`, so Python-generated types get stable names. For example, `/MyPlugin/Python/Extra/MyClass_PY.MyClass` instead of `/Engine/PythonTypes.MyClass_0x…`.
- Generated types are purged automatically when the owning plugin's content is unmounted, but only if the owner names the plugin and the mount point root is inside that plugin's `//Python` folder.
- Removing a path with `RemoveAdditionalPath`, or with `RemoveAdditionalPaths(Owner)` for every path that owner added, doesn't unload modules or purge generated types.
- Adding a path doesn't create a content mount or run startup scripts.

For more information, see the Python sys.path documentation.

By default, Unreal Engine's embedded Python interpreter runs in isolated mode. To disable isolate mode, open **Project Settings**. Under **Plugins**, select **Python**, and enable** Isolate Interpreter Environment.**

[image: Isolate Interpreter Environment]

For more information, see the Python command line -I option documentation.

The **`UE_PYTHONPATH`** environment variable is always parsed by the engine and its content is added to `sys.path`, regardless of the isolation mode options you select. `UE_PYTHONPATH` serves the same purpose as the `PYTHONPATH` variable, but it should never be modified by any third-party software.

## About the Unreal Editor Python API

The Python Editor Script Plugin exposes a wide range of classes and functions that you can use to interact with Unreal Editor, the Assets in your project, and the content in your levels. This API is all contained in the `unreal` module. To access it, import this module at the beginning of any Python script you run in the Unreal Editor Python environment:

 Python

```
import unreal
```

import unreal

The `unreal` module exposes nearly everything that is exposed from C++ to Blueprints in your Unreal Editor environment. It is not pre-generated. It automatically reflects whatever is available in Blueprints in the editor. As you enable new plugins in the editor, anything those plugins expose to Blueprints also becomes available in Python. The same goes for any C++ code that you write in your project and expose to Blueprints.

The Python API is designed to expose native Unreal APIs in a way that is natural for Python developers. For example:

- Simple data types are transparently converted back and forth between Python and native types whenever necessary. When you pass in a Python list, set or dict, it is automatically converted to an Unreal array, set, or map. When you retrieve a list, set, or dict returned by an API function, you are actually getting an instance of an Unreal class, but its API is fully consistent with the base Python list, set, or dict type.
- Python classes maintain the same inheritance hierarchy as the native types they represent. That means, for example, that you can use the built-in Python functions `isinstance()` and `type()` to test whether an object derives from or matches a given class.
- The API tries to strike a good balance between the naming conventions used in Unreal for C++ and Blueprints on one hand, and Python naming conventions on the other hand. Classes and objects in the Python API have the same names as they do in Blueprints. This is typically the same as their native types, without the prefix (for example, `U` or `T`). Function and property names are automatically exposed as lowercase `snake_case`. For example, you typically call functions such as `unreal.StaticMeshActor.get_actor_transform()`. Enumeration value names are automatically exposed as uppercase `SNAKE_CASE`.
- All exposed functions can accept either ordered parameters, or named parameters in any order. For example, the following two function calls are exactly equivalent:

 Python

```
	unreal.get_editor_subsystem(unreal.StaticMeshEditorSubsystem).join_static_mesh_actors(list_of_actors, my_options)

	    unreal.get_editor_subsystem(unreal.StaticMeshEditorSubsystem).join_static_mesh_actors(join_options=my_options, actors_to_join=list_of_actors)
```

 unreal.get_editor_subsystem(unreal.StaticMeshEditorSubsystem).join_static_mesh_actors(list_of_actors, my_options)

 unreal.get_editor_subsystem(unreal.StaticMeshEditorSubsystem).join_static_mesh_actors(join_options=my_options, actors_to_join=list_of_actors)

### Exposing C++ Functions to Python

A C++ function is exposed to Python when its UFUNCTION is marked BlueprintCallable or BlueprintEvent, or when it has the PythonCallable metadata specifier. Use PythonCallable for editor scripting APIs that should not appear in Blueprint graphs:

 C++

```
UFUNCTION(meta = (PythonCallable))
static TArray<ALandscape*> GetLandscapes();
```

UFUNCTION(meta = (PythonCallable))
static TArray<ALandscape*> GetLandscapes();

The following specifiers prevent a function from being exposed to Python, even when it has `PythonCallable`: `ScriptNoExport`, `BlueprintGetter`, `BlueprintSetter`, `BlueprintInternalUseOnly`, `CustomThunk`, `NativeMakeFunc`, and `NativeBreakFunc`.

If a function should be available to both Python and AI agents, add both specifiers, for example `meta = (PythonCallable, AICallable, AIAccessMode = "Read")`. For more information about AI-callable functions, see Unreal MCP (-> unreal-mcp-in-unreal-editor).

### Blueprint Classes and User Defined Structs in Python

The first time Python receives a Blueprint-generated class or a User Defined Struct, it generates a dedicated wrapper type for it:

- **Blueprint classes:** A Blueprint class appears as its own Python type, which is a subclass of its native parent. For example, an Actor Blueprint named BP_MyActor appears as BP_MyActor_C, a subclass of unreal.Actor. You can access the properties and functions added in the Blueprint directly.
- **User Defined Structs:** A User Defined Struct appears as its own Python type, which is a subclass of unreal.StructBase.

In 5.8 and earlier, Python saw Blueprint classes as their nearest native parent and User Defined Structs as `unreal.StructBase`. To restore that behavior, set these console variables to `false`:

- **Engine.Python.WrapBlueprintClassesOnDemand:** Set to false to treat Blueprint classes as their nearest native parent class. The default is true.
- **Engine.Python.WrapUserDefinedStructsOnDemand:** Set to false to treat User Defined Structs as unreal.StructBase. The default is true.

Scripts that use `isinstance()` with a native class, or `get_editor_property()` to read Blueprint variables, work with either setting. Scripts written for 5.8 that check `type(obj)` against a native class, or rely on the Python type name, see the generated type in 5.9 and might need to be updated.

### Other Scripting API Behavior

Keep the following behavior in mind when you script these areas of the editor:

- **Loading levels:** `LevelEditorSubsystem.load_level` takes an `UnsavedChangesPolicy` argument. With the default value, Fail, the call raises an error that names the packages with unsaved changes instead of discarding those changes. Set it to `Save` to save the changes before the level loads.
- **Generating PCG content:** To generate PCG content from Python, use `ExecuteGraphInstance` with an execution source. The `Generate` and `GenerateLocal` functions on `PCGComponent` are not available from Python.
- **Audio editor scripting:** Audio editor scripting subsystems are available from Python. To find them, see the Unreal Editor Python API Reference (-> python-api).

### API Reference

For details on all of the classes and functions exposed by the Unreal Python API, see Unreal Editor Python API Reference (-> python-api).

The API Reference is not an exhaustive list of everything that plugins might expose to Python. If you have installed additional plugins that are not included in the API Reference, and you need to see the way their scripting features are exposed to Python, you can generate your own local version of the API Reference that contains docs for the plugins you need. For instructions, see the readme file under `Engine\Plugins\Experimental\PythonScriptPlugin\SphinxDocs` in your Unreal Engine installation folder.

## Best Practices for Using the Python API

Keep the following practices in mind when you use the Python API.

### Working with Assets

If you need to work with Assets in your project, always use functions from the Unreal Python API to do it. Never use file management modules built in to Python to work directly with your Asset files on disk. For example, if you need to move an Asset to a different folder, do not use Python functions like `os.rename` or `shutil.move`. Unreal projects and Assets contain internal content references that you can break if you do not respect this rule.

Instead, use the `unreal.EditorAssetLibrary` API that is provided by the Editor Scripting Utilities plugin, or the `unreal.AssetTools` class built in to the Unreal Python API.

### Changing Editor Properties

You can use Python to get access to Objects in your project and set up many configuration properties on those Objects programmatically. For example, your Python script could access Static Mesh Actors in the current level, and set properties like whether the Actors can be damaged, or whether they should be hidden in the game. Or, you could retrieve their Static Mesh Components and set up properties on those Components, like their Lightmass settings, or even the Static Mesh Asset that they are linked to.

These properties can be exposed to Python in two ways:

- Items with the `BlueprintReadOnly` or `BlueprintReadWrite` flag are exposed as simple properties on the object. You can read and modify these properties like you access any Python object property.
- Items with the `ViewAnywhere` or `EditAnywhere` flag are exposed as "editor properties". You can read and write these values using a special pair of functions exposed by every object: `set_editor_property()` and `get_editor_property()`.

In the API Reference for each class, you can find a list of **Editor Properties** immediately following the class description. These are all the values that you can set and get using these `set_editor_property()` and `get_editor_property()` functions. Whenever you need to set or get a configuration property on an object, check this list first to see if the property you want is listed there.

- When you need to read a value that is exposed both as an object property and as an editor property, the result of accessing the property directly is usually the same as by calling the `get_editor_property()` function. However, the `get_editor_property()` function often has access to properties that aren't exposed directly on the Python object.
- When you need to set a value that is exposed both as an object property and as an editor property, you should in most cases use the `set_editor_property()` function to set the value rather than set the value directly on the object. When you adjust properties in the UI, Unreal Editor often performs additional operations behind the scenes: pre- and post-edit changes. These operations typically respond to the choices you make in some way, and keep the editor UI in sync with the state of the object in the game world. If you modify these properties directly on the Python object, this editor code doesn’t run automatically. On the other hand, when you call `set_editor_property()` to set the state of a property, you do trigger this pre- and post-edit code, exactly as if you changed the setting in the **Details** panel of the editor UI.

For example, Media Player objects have a **Play on Open** setting:

[image: Play on Open setting in the Media Player Details panel]

This is exposed in the `unreal.MediaPlayer` class in the `play_on_open` class member:

 Python

```
import unreal
		obj = unreal.MediaPlayer()
		# Modifying a property directly can have different results
		# than changing settings in the Editor UI.
		# Generally you'll want to avoid setting these values directly, like this:
		obj.play_on_open = True
		# This way of accessing the property will have exactly the same
		# result as changing the setting in the Editor UI:
		obj.set_editor_property("play_on_open", True)
		# Both ways of reading the value are equivalent.
```

import unreal
 obj = unreal.MediaPlayer()
 # Modifying a property directly can have different results
 # than changing settings in the Editor UI.
 # Generally you'll want to avoid setting these values directly, like this:
 obj.play_on_open = True
 # This way of accessing the property will have exactly the same
 # result as changing the setting in the Editor UI:
 obj.set_editor_property("play_on_open", True)
 # Both ways of reading the value are equivalent.

### Use Unreal Types Whenever Possible

Whenever you need utilities that are available in the Unreal Python API, like classes for math operations or manipulating 3D coordinates, use the Unreal utilities rather than using your own implementations. The Unreal versions are optimized for best performance in the Engine environment.

For example, when you need to manipulate coordinates in 3D space, use the `unreal.Vector` class:

 Python

```
	import unreal

	    v1 = unreal.Vector()

	    v1.x = 10

	    v2 = unreal.Vector(10, 20, 30)

	    v3 = (v1 + v2) * 2
```

### Logging and Feedback

The `unreal` object exposes functions that you can use in your code to send log, warning, and error messages through the same messaging system used by all Engine and Editor subsystems. Use this standardized logging framework any time your script needs to send a message to the user.

- Use `unreal.log()` for information messages. For your convenience, the Python `print()` function has also been implemented to pass through `unreal.log()` internally.
- Use `unreal.log_warning()` to alert users of potential problems.
- Use `unreal.log_error()` for severe problems that prevent your script from running as expected.

Your messages appear in the **Output Log** panel, along with the messages sent by other subsystems:

[image: Python log messages]

### Supporting Undo and Redo

Your scripts can take full advantage of the Undo / Redo system built in to Unreal Editor.

Each transaction that you define can contain any number of Python operations. Using these transactions, you can bundle large operations, or operations on many different objects, together into a single entry in the Undo / Redo history. Typically, if your script intends to perform a certain change on multiple objects, you don't want a separate entry in the Undo / Redo history for each change; you want one entry that will undo all changes to all objects.

To define a transaction, use the `unreal.ScopedEditorTransaction` scope. For example, if you run this code:

 Python

```
	import unreal

		obj = unreal.MediaPlayer()

		with unreal.ScopedEditorTransaction("My Transaction Test") as trans:

			obj.set_editor_property("play_on_open", False)

			obj.set_editor_property("vertical_field_of_view", 80)
```

 import unreal

 obj = unreal.MediaPlayer()

 with unreal.ScopedEditorTransaction("My Transaction Test") as trans:

 obj.set_editor_property("play_on_open", False)

 obj.set_editor_property("vertical_field_of_view", 80)

The editor’s **Undo History** panel now lists that transaction by name:

[image: Undo History]

As a general rule, your scoped transactions can contain any operations that are also undoable in the Unreal Editor UI. However, not every editor operation is undoable. For example, you can't undo importing a model in the editor UI, so trying to import a model inside an `unreal.ScopedEditorTransaction` doesn’t work as you might expect.

### Progress Dialogs for Slow Operations

If your scripts need to work on many Assets or Actors in the same operation, they may take some time to complete. However, while Unreal Editor is running a Python script, its UI becomes blocked to other user interactions. To give the user information about the progress of a large task, and avoid the editor appearing to freeze or hang, you can use the `unreal.ScopedSlowTask` scope.

For example:

 Python

```
import unreal
    total_frames = 100
    text_label = "Working!"
    with unreal.ScopedSlowTask(total_frames, text_label) as slow_task:
        slow_task.make_dialog(True)               # Makes the dialog visible, if it isn't already
        for i in range(total_frames):
            if slow_task.should_cancel():         # True if the user has pressed Cancel in the UI
                break
            slow_task.enter_progress_frame(1)     # Advance progress by one frame.
                                                # You can also update the dialog text in this call, if you want.
```

import unreal
 total_frames = 100
 text_label = "Working!"
 with unreal.ScopedSlowTask(total_frames, text_label) as slow_task:
 slow_task.make_dialog(True) # Makes the dialog visible, if it isn't already
 for i in range(total_frames):
 if slow_task.should_cancel(): # True if the user has pressed Cancel in the UI
 break
 slow_task.enter_progress_frame(1) # Advance progress by one frame.
 # You can also update the dialog text in this call, if you want.

[image: Progress bar for a Scoped Slow Task]

## Using Python with AI Agents

You can also use Python with AI agents in Unreal Editor through Unreal MCP, the editor’s Model Context Protocol (MCP) server. AI agents connected through Unreal MCP can run editor Python scripts, and you can write toolsets and agent skills in Python that extend what AI agents can do in the editor. For more information, see Using Python with AI Agents (-> using-python-with-ai-agents-in-unreal-engine).

- editor
- python
- datasmith
- overview
- landing page
- experimental
- programming
- scripting
- landing

On this page

- Why Python? (-> scripting-the-unreal-editor-using-python)
- Set Up Your Project to Use Python (-> scripting-the-unreal-editor-using-python)
- Python 3.11.8 (-> scripting-the-unreal-editor-using-python)
- Ways to Run Python Code in Unreal Editor (-> scripting-the-unreal-editor-using-python)
- The Python Console in the Output Log (-> scripting-the-unreal-editor-using-python)
- The py Console Command (-> scripting-the-unreal-editor-using-python)
- The File Menu (-> scripting-the-unreal-editor-using-python)
- The Command Line (-> scripting-the-unreal-editor-using-python)
- The init_unreal.py File (-> scripting-the-unreal-editor-using-python)
- Startup Scripts (-> scripting-the-unreal-editor-using-python)
- From Editor-Only Blueprints (-> scripting-the-unreal-editor-using-python)
- Python Environment and Paths in Unreal Editor (-> scripting-the-unreal-editor-using-python)
- About the Unreal Editor Python API (-> scripting-the-unreal-editor-using-python)
- Exposing C++ Functions to Python (-> scripting-the-unreal-editor-using-python)
- Blueprint Classes and User Defined Structs in Python (-> scripting-the-unreal-editor-using-python)
- Other Scripting API Behavior (-> scripting-the-unreal-editor-using-python)
- API Reference (-> scripting-the-unreal-editor-using-python)
- Best Practices for Using the Python API (-> scripting-the-unreal-editor-using-python)
- Working with Assets (-> scripting-the-unreal-editor-using-python)
- Changing Editor Properties (-> scripting-the-unreal-editor-using-python)
- Use Unreal Types Whenever Possible (-> scripting-the-unreal-editor-using-python)
- Logging and Feedback (-> scripting-the-unreal-editor-using-python)
- Supporting Undo and Redo (-> scripting-the-unreal-editor-using-python)
- Progress Dialogs for Slow Operations (-> scripting-the-unreal-editor-using-python)
- Using Python with AI Agents (-> scripting-the-unreal-editor-using-python)
