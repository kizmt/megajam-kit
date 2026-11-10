# Automation Tool Overview

https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-automation-tool-overview-for-unreal-engine?application_version=5.9

> A host program and a set of utility libraries that enable you to script unattended processes related to Unreal Engine.

[image: Automation Tool Overview]

**Automation Tool** is a host program and a set of utility libraries you can use to script unattended processes related to **Unreal Engine (UE)** when using C#. Internally, we use Automation Tool for a variety of tasks, including building, cooking, and running games, running automation tests, and scripting other operations to be executed on our build farm.

The source code for Automation Tool, and various scripts that run under it, can be found under `Engine/Source/Programs/AutomationTool`.

While we provide this tool as a courtesy, the level of support we can provide is limited.

## How Automation Tool Works

### Automation Projects

When run, Automation Tool finds all automation projects (saved as Visual Studio C# projects with an `.Automation.csproj` extension), compiles them, and then uses reflection to find the appropriate command to be executed. Those commands are implemented as classes derived from the `BuildCommand` base class, and are identified by the class name.

To learn more, read how to add an automation project (-> create-an-automation-project-in-unreal-engine).

### Running Automation Tool

You can run commands under the Visual Studio debugger on Windows, or from the command line on Windows, Mac, and Linux.

#### Running Commands under the Debugger

To run Automation Tool under the Debugger in Visual Studio:

- Right click the Automation Tool Project, and select **Properties** from the context menu.

- Select the **Debug** tab, and enter your command name (here, we use `SampleCommand`) into the Start **Options > Command line arguments:** field.

- Set a breakpoint in your script before pressing the F5 key (or clicking the **Start** button in the Visual Studio toolbar).

#### Running Commands from the command line (Windows)

To run Automation Tool from the command line:

- Open a Command Prompt window.

- Change the working directory to `Engine/Build/BatchFiles`.

- Enter the following into the command line: `RunUAT.bat SampleCommand`

#### Running Commands from the terminal (Mac/Linux)

To run Automation Tool from the terminal:

- Open the terminal.

- Change the working directory to `Engine/Build/BatchFiles`.

- Enter the following into the command line: `./RunUAT.sh SampleCommand`

### Command Line Syntax

The general syntax of the Automation Tool command line is:

```
	RunUAT.bat COMMAND_1 [-ARG_1 -ARG_2...] COMMAND_2 [-ARG_3 -ARG_4...] ...
```

RunUAT.bat COMMAND_1 [-ARG_1 -ARG_2...] COMMAND_2 [-ARG_3 -ARG_4...] ...

Here, two commands will be run sequentially. `-ARG_1` and `-ARG_2` are passed to `COMMAND_1`, `-ARG_3` and `-ARG_4` are passed to `COMMAND_2`, and so on.

Global options:

| Option | Description |
| --- | --- |
| `-Help` | Shows help and options for Automation Tool in general, or (when specified after a command name) help for that particular command. |
| `-List` | Displays a list of all available Automation Tool commands. |
| `-P4` | Enable Perforce support. |
| `-Submit` | Allows automated processes to submit files. |
| `-NoCompile` | Prevents Automation Tool from compiling any `.Automation.csproj` files on startup. |

If set, the following environment variables are used to configure Perforce support for build machines. They may be set via the Automation Tool command line in the `VARNAME=VALUE` syntax or inherited from the current session.

| Environment Variable | Description |
| --- | --- |
| `uebp_PORT` | The Perforce server and port (for example, `perforce:1666`). |
| `uebp_CLIENT_ROOT` | Path to the local root directory of the current client (for example, `D:\P4`). |
| `uebp_CL` | The current changelist that is synced to. |
| `uebp_CodeCL` | The current code changelist that is synced to. This may be before the current changelist specified by `uebp_CL`. |
| `uebp_USER` | The Perforce user. |
| `uebp_CLIENT` | Name of the client used to access Perforce. |
| `uebp_BuildRoot_P4` | Path to the root of the current branch or stream (for example, `//UE4/Release-4.22`). |

- programming
- automationtool

On this page

- How Automation Tool Works (-> unreal-automation-tool-overview-for-unreal-engine)
- Automation Projects (-> unreal-automation-tool-overview-for-unreal-engine)
- Running Automation Tool (-> unreal-automation-tool-overview-for-unreal-engine)
- Running Commands under the Debugger (-> unreal-automation-tool-overview-for-unreal-engine)
- Running Commands from the command line (Windows) (-> unreal-automation-tool-overview-for-unreal-engine)
- Running Commands from the terminal (Mac/Linux) (-> unreal-automation-tool-overview-for-unreal-engine)
- Command Line Syntax (-> unreal-automation-tool-overview-for-unreal-engine)
