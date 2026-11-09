# Running Unreal Engine

https://dev.epicgames.com/documentation/en-us/unreal-engine/running-unreal-engine?application_version=5.9

> Running the engine as a game or editor, including how to launch a specific map and useful in-game commands.

[image: Running Unreal Engine]

Operating System

×Windows

Select an option from the dropdown to see content relevant to it.

The instructions on this page are for running the engine with projects compiled in a **Development** build configuration. You can substitute the `UEEditor-_.exe` or `UE-_.exe` that you need for opening projects built in other configurations. More information on the binary naming convention can be found on the Building Unreal Engine (-> building-unreal-engine-from-source) page.

## Running the Editor

The process of running the editor requires passing the name of the project to run as an argument to the executable.

You can add the `-debug` switch to force the executable to load the debug version of the modules for your project, which contain all of the debugging symbols. This is necessary even when debugging through Visual Studio with the configuration set to **Debug** because the main executable is always compiled using the **Development** configuration. Of course, you must first compile your modules using the Debug configuration so they exist for the executable to load.

### Running the Editor from the Command Line

- From a command prompt, navigate to your `[LauncherInstall][VersionNumber]\Engine\Binaries\Win64` directory.
- Run the `UEEditor.exe`, passing it the path to your project. Shell ```
UEEditor.exe "[ProjectPath][ProjectName].uproject"
``` UEEditor.exe "[ProjectPath][ProjectName].uproject"

### Running the Editor from the Executable

- Navigate to your `[LauncherInstall][VersionNumber]\Engine\Binaries\Win64` directory.
- Right-click on the `UEEditor.exe` executable and choose **Create shortcut**.
- Rename the shortcut to something like **MyProject - Editor.exe** as this reflects that this shortcut runs the MyProject game editor.
- Right-click on the newly created shortcut and choose **Properties**.
- Add the name of the game to run as an argument at the end of the **Target** property: Shell ```
[LauncherInstall][VersionNumber]\Engine\Binaries\Win64\UEEditor.exe "[ProjectPath][ProjectName].uproject"
``` [LauncherInstall][VersionNumber]\Engine\Binaries\Win64\UEEditor.exe "[ProjectPath][ProjectName].uproject"
- Press **OK** to save the changes.
- Double-click the shortcut to launch the editor.

### Running the Editor with No Arguments (Stand-alone)

If the editor is not set to open the most recent project at startup, running the editor executable without any arguments will launch the Project Browser. From here, you can create a new project (-> creating-a-new-project-in-unreal-engine) , open your existing projects (-> creating-a-new-project-in-unreal-engine) , or open content examples and sample games (-> samples-and-tutorials-for-unreal-engine) .

## Running an Uncooked Game

Once a project is loaded in Unreal Editor, you can test your gameplay (-> ineditor-testing-play-and-simulate-in-unreal-engine) in Uncooked Game mode from the **Play In** menu. To play the uncooked game in its own window, select the New Window At > Default Player Start mode (-> ineditor-testing-play-and-simulate-in-unreal-engine) using the Play In dropdown menu (-> ineditor-testing-play-and-simulate-in-unreal-engine) in the Level Editor toolbar.

Click to see full-size image:

Running the uncooked game version of the engine executable using either of the below methods will result in the same behavior.

### Running an Uncooked Game from the Command Line

When running from the command line, you must pass the name of the project you want to run along with the `-game` switch as arguments.

- From a command prompt, navigate to your `[LauncherInstall][VersionNumber]\Engine\Binaries\Win64` directory.
- Run the **UEEditor.exe** passing it the path to the project to run, along with the `-game` parameter. C++ ```
UEEditor.exe "[ProjectPath][ProjectName].uproject" -game
``` UEEditor.exe "[ProjectPath][ProjectName].uproject" -game

### Running an Uncooked Game from the Executable

When running from the executable, you must specify the path to the project you want to run along with the `-game` switch as arguments to the executable via the **Target** property of a shortcut.

- Navigate to your `[LauncherInstall][VersionNumber]\Engine\Binaries\Win64` directory.
- **Right-click** on the **UEEditor.exe** executable and choose **Create shortcut**.
- Rename the shortcut to reflect the game it will run, i.e. **MyProject.exe**.
- **Right-click** on the newly created shortcut and choose **Properties** to display the properties of the shortcut.
- Add the full path to the project to run as an argument at the end of the **Target** property, and specify the `-game` argument to run as a game: C++ ```
[LauncherInstall][VersionNumber]\Engine\Binaries\Win64\UEEditor.exe "[ProjectPath][ProjectName].uproject" -game
``` [LauncherInstall][VersionNumber]\Engine\Binaries\Win64\UEEditor.exe "[ProjectPath][ProjectName].uproject" -game
- Press **OK** to save the changes.
- **Double-click** the shortcut to run the game.

## Running a Cooked Game

See Packaging Projects (-> packaging-your-project) for information on how to package and run cooked game builds

## Useful In-Game Commands

When you are running the game, there are a multitude of **console commands** you can use in the console inside the game. The console can be summoned by pressing the **~ (tilde)** or **Tab** keys. Some of the most useful commands are listed below.

- `EXIT/QUIT`
- `DISCONNECT`
- `OPEN [MapURL]`
- `TRAVEL [MapURL]`
- `VIEWMODE [Mode]`

## Loading Maps

It is possible to specify a particular map to load when running the engine or editor or load a new map while running the engine. This can be useful for testing by quickly jumping into the map you want to test without needing to make your way through a series of menus.

### Loading Maps at Startup

The engine will always attempt to load a default map when it is run. This map is specified in the `DefaultEngine.ini` config file located in the `Config` folder of your game project. The map to run by default is set using the **Map** property in the `[URL]` section of the .ini file. As an example, when you create a project with a map file named "MyMap", the following is set automatically in its `DefaultEngine.ini` file:

 C++

```
GameDefaultMap=/Game/Maps/MyMap
```

GameDefaultMap=/Game/Maps/MyMap

This will cause the `MyMap.umap` (located in `(UE4Directory)/(YourProjectName)/Content/Maps`) to load at startup unless it is overridden. Generally, you will want to specify the map that loads or is used as the background for your main menu as the default map.

To override the default map, you can pass in a map name (without the file extension) as a command line argument. It was mentioned previously that you must specify the project name on the command line. Following these, you can also specify a map name to force the engine to load a map other than the default. For instance, the following command line could be used to load the engine running the `ExampleMap` map:

 C++

```
UEEditor.exe "[ProjectPath][ProjectName].uproject" ExampleMap -game
```

UEEditor.exe "[ProjectPath][ProjectName].uproject" ExampleMap -game

The same concept works when running the editor. Specifying the name of the map to load will load that map when the editor opens instead of the default or blank map. To load the editor with the `ExampleMap` map loaded, the following command line can be used:

`UE4Editor.exe "[ProjectPath][ProjectName].uproject" ExampleMap -game`

The map name can also be a full map URL specifying additional settings such as the GameMode. Settings are appended to the map name as key-value pairs separated by a `?`. For example:

 C++

```
DM-Deck?Game=CaptureTheFlag
```

DM-Deck?Game=CaptureTheFlag

### Loading New Maps

If you want to load a new map during play, in order to test during development or even to switch maps during gameplay, this can be done using the `OPEN` or `TRAVEL` console commands followed by the name of the map (without the file extension) to load.

The difference between the `OPEN` and `TRAVEL` commands is described above in the Useful In-Game Commands (-> running-unreal-engine) section.

The commands below load the DM-Deck map during play with the same settings or settings reset, respectively:

 C++

```
open DM-Deck
```

open DM-Deck

Or

 C++

```
travel DM-Deck
```

travel DM-Deck

- testing

On this page

- Running the Editor (-> running-unreal-engine)
- Running the Editor from the Command Line (-> running-unreal-engine)
- Running the Editor from the Executable (-> running-unreal-engine)
- Running the Editor with No Arguments (Stand-alone) (-> running-unreal-engine)
- Running an Uncooked Game (-> running-unreal-engine)
- Running an Uncooked Game from the Command Line (-> running-unreal-engine)
- Running an Uncooked Game from the Executable (-> running-unreal-engine)
- Running a Cooked Game (-> running-unreal-engine)
- Useful In-Game Commands (-> running-unreal-engine)
- Loading Maps (-> running-unreal-engine)
- Loading Maps at Startup (-> running-unreal-engine)
- Loading New Maps (-> running-unreal-engine)
