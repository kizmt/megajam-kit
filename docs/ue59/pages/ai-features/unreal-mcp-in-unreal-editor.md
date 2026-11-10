# Unreal MCP

https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-mcp-in-unreal-editor?application_version=5.9

> Overview of using MCP-compatible workflows to drive editor functionality.

Learn to use this **Experimental** feature, but use caution when shipping with it.

**Unreal MCP** embeds a Model Context Protocol (MCP) server inside the Unreal Editor process so any MCP-compatible AI agent, such as Claude Code, Codex, Cursor, Gemini CLI, Visual Studio Code with GitHub Copilot, or the MCP Inspector, can control the editor over a local HTTP connection. The plugin exposes engine functionality as tools that an AI agent can call, such as spawning and editing actors, building Blueprints and Widget Blueprints, authoring materials, MetaSounds, PCG, Niagara, and Sequencer content, inspecting Slate widgets, profiling, and running automation tests. You can also add your own tools.

Unreal MCP is **Experimental**. Many features are still under development and APIs and data formats may change at any time. Use caution when shipping a project with it.

## What Is the Model Context Protocol?

The **Model Context Protocol** (MCP) is an open specification published at modelcontextprotocol.io. It defines how an AI client talks to an MCP server using a small set of JSON-RPC message types: initialize, tools/list, tools/call, and similar. An MCP server can offer three kinds of primitives:

- **Tools **are named functions the client can call, with typed parameters and return values.
- **Resources** are read-only data the client can fetch by a Uniform Resource Identifier (URI).
- **Prompts** are reusable prompt templates.

**Unreal MCP** is an MCP server. It offers tools from toolsets registered with the Toolset Registry, supports Resources, and accepts connections from any MCP client. It doesn’t support Prompts.

## Set Up Unreal MCP

[image: Get started with Unreal MCP]

How you set up Unreal MCP depends on where you run your AI agent. Your agent has access to the same tools either way.

- **In a terminal**, such as your own terminal or the editor’s Terminal plugin. Choose this option if you use an MCP client the Unreal Assistant panel doesn’t support, prefer to work in your own IDE or terminal, or want to connect your agent to more than one editor.
- **In the Unreal Assistant panel.** Choose this option if you want the quickest setup and want to stay inside the editor. The editor connects your agent to Unreal MCP for you, so you don’t need a config file. The panel supports Claude Code, Codex, Cursor, OpenCode, and custom Agent Client Protocol (ACP) agents, and connects to one editor at a time.

To set up Unreal MCP, follow these steps:

- Enable the plugins.
- Check that the server is running.
- Run your AI agent from a terminal or in the Unreal Assistant panel.
- Optional: Add server instructions for your project.
- Test your connection.

### Enable the Plugins

To enable the plugins, follow these steps:

- In the main menu, go to **Edit > Plugins**.
- Search for **Unreal MCP** and make sure its checkbox is selected. Unreal MCP is enabled by default.[image: Enable the Unreal MCP Plugin in the Plugins browser.]
- Search for **All Toolsets** and select its checkbox to enable it.
- When prompted, restart the editor.

Both plugins depend on the **Toolset Registry** plugin, which is enabled automatically.

### Check Auto-Start

Auto-start is on by default, so the MCP server starts every time the editor launches and binds to `http://127.0.0.1:8000/mcp`. You only need to check this setting if the server isn't running.

To check if the MCP server is automatically running when you start Unreal Editor, follow these steps:

- In the main menu, go to **Edit > Editor Preferences**.
- In the left panel, under **Agentic Workflows**, select **Model Context Protocol**.
- Make sure **Auto Start Server** is enabled.[image: In Editor Preferences, enable Auto Start Server under Model Context Protocol.]

The same panel sets the port (default `8000`) and the URL path (default `/mcp`). Change them if another local service already uses those defaults.

To start the server only when you need it, turn **Auto Start Server** off and enter `ModelContextProtocol.StartServer` in the editor console. The command also accepts an optional port: `ModelContextProtocol.StartServer 8000`.

Commandlets don't start the server automatically. To start it in a commandlet, pass `-ModelContextProtocolStartServer`. If an AI agent launches its own editor, start that editor with `-ModelContextProtocolPort=<port>` so the server doesn't conflict with your editor or another agent's editor.

Next, you can run your AI agent from a terminal or in the Unreal Assistant panel. You only need one.

### Run Your AI Agent from a Terminal

To run your AI agent from a terminal, generate a client config file, then launch the agent from the folder that holds it. You can use your own terminal or the editor's Terminal plugin.

#### Generate a Client Config

Each AI agent expects its server list in a specific file format and location. Unreal MCP can write that file for you. To generate a client config, follow these steps:

- In Unreal Editor’s main menu, go to **Edit > Editor Preferences**.
- Select **Agentic Workflows > Model Context Protocol**.
- In the **MCP Client** category, choose your client from** Client Selection**. The default is **Claude Code**.
- Click** Generate Client Config**.
- Confirm the Unreal MCP plugin successfully generated a `.mcp.json` file. The file’s location depends on your build:Installed builds: The project root.
- Source builds: The engine root, even when the project is somewhere else. If you launch the agent from the project folder, copy the entry into your project's config.

For example, the generated `.mcp.json` file for Claude Code looks like this:

 Config

```
	{

	  "mcpServers": {

	    "unreal-mcp": {

	      "type": "http",

	      "url": "http://127.0.0.1:8000/mcp"
```

You can also generate a config from the editor console. In the Cmd box, run `ModelContextProtocol.GenerateClientConfig <Client>`, where `<Client>` is `ClaudeCode`, `Cursor`, `VSCode`, `Gemini`, `Codex`, or `All`. You can view the output in the Output Log.

[image: Look at the log to see the output has been written.]

If you change the server port or start using another AI client, click **Generate Client Config** again. Generating the config again doesn’t remove other entries in the file:

- **JSON configs** (Claude Code, Cursor, VS Code, Gemini) are merged with any existing entries, and the `unreal-mcp` entry’s URL is updated to match the current server port.
- **The Codex TOML config** is write-once. If `.codex/config.toml` already exists, Unreal MCP logs an error instead of updating the file, and you must update the `[mcp_servers.unreal-mcp]` entry by hand.

#### Launch Your AI Agent

To connect, launch your AI agent CLI or application from the folder that holds the config file. For connection steps and advanced settings, see the documentation for your AI client.

If your AI agent doesn't find Unreal MCP, try the following:

- Make sure you launched the agent from the folder that holds the config file.
- Launch the agent after the editor is running and the MCP server has started.
- Reconnect to the MCP server from your agent.

#### Optional: Use the Terminal Plugin

The **Terminal **plugin embeds a terminal panel inside the editor and can run shell commands automatically when the panel opens. With Unreal MCP, this keeps the whole workflow inside a single editor window.

To set up the **Terminal **plugin, follow these steps:

- In the main menu, go to **Edit > Plugins**, search for **Terminal**, and select its checkbox. Restart the editor when prompted.
- Go to** Edit > Editor Preferences**. Under **General**, select **Terminal**.
- Add these entries to the **Startup Commands **list, in this order:Set the terminal type so the AI agent CLI detects a capable terminal. On Windows (`cmd.exe`), enter `set TERM=xterm-256color`. On Unix shells (bash, zsh), enter `export TERM=xterm-256color`.
- Change to the folder where `GenerateClientConfig` wrote `.mcp.json`. On Windows, enter `cd /d ""`. On Unix, enter `cd ""`.
- Start your AI agent CLI. For example, enter `claude`.

If you skip the `TERM` entry, `claude` and similar CLIs fall back to a degraded mode and might show raw escape sequences instead of formatted output.

The `cd` entry matters because the Terminal panel starts new sessions in `FPaths::RootDir()`. That's the workspace root in source builds and the engine installation folder in installed builds, so it doesn't always match where `.mcp.json` is.

### Run Your AI Agent in the Unreal Assistant Panel

The Unreal Assistant panel can run Claude Code, Codex, Cursor, OpenCode, or a custom Agent Client Protocol (ACP) agent inside the editor, instead of a separate terminal. The editor connects the agent to this editor's Unreal MCP server, so you don't need a client config file.

For full setup steps, including prerequisites, see Run External AI Agents in the Unreal Assistant Panel (-> run-external-ai-agents-in-the-unreal-assistant-panel-in-unreal-engine).

### Optional: Add Server Instructions

You can send instructions to every AI agent when it connects to the server. Use instructions for project conventions, such as naming rules, folders that must not change, or the preferred test map. You can set instructions in two places:

- **Editor Preferences > Agentic Workflows > Model Context Protocol > Instructions**: Applies only to you.
- **Project Settings > Agentic Workflows > Model Context Protocol > Instructions**: Applies to everyone on the project, and is stored in `DefaultGame.ini`.

Clients must reconnect before changes take effect.

### Test Your Connection

With the server running and your AI agent connected, you can start working with Unreal Editor.

To confirm that your AI agent is connected and can see the editor, try a simple prompt, such as:

- "What actors do I have selected?"
- "What are a few things you can do in Unreal?"
- "What toolsets are available, and what can you do with them?"
- "Add a point light above the selected actor and make it warm white."

Results vary depending on the AI agent you use.

## How Unreal MCP Works

Unreal MCP gets its tools from toolsets registered with the Toolset Registry, offers them to AI agents through tool search, and runs inside a set of runtime and editor modules.

### Toolsets and the Toolset Registry

Unreal MCP gets its tools from the **Toolset Registry**, a subsystem provided by the Toolset Registry plugin.

A **toolset** is any class that implements the `IToolsetProvider` interface and exposes one or more functions as tools. Most toolsets derive from `UToolsetDefinition` (C++) or `unreal.ToolsetDefinition` (Python), which implement the interface for you. Existing editor subsystems and Blueprint function libraries can also implement `IToolsetProvider`, so their tagged functions become tools without a wrapper class. Examples include `LevelSequenceEditorSubsystem`, `PCGEditorSubsystem`, and `WidgetBlueprintEditorSubsystem`.

Each toolset registers with the **Toolset Registry**: C++ toolsets at module startup, and Python toolsets from the plugin's `init_unreal.py` file. Unreal MCP wraps each registered tool as an MCP tool, and the wrapped tool becomes available to every connected MCP client. Other AI features in Unreal Engine use the same registry, so a toolset authored for MCP works with them without changes.

Toolset names are qualified. C++ toolsets use `<Plugin>.<Class>` without the `U` prefix, such as `GASToolsets.AttributeSetToolset`. Python toolsets use their module path, such as `geometry_toolset.geometry_ops.GeometryTools`. With tool search off, tools are listed as `<Toolset>.<Tool>`.

### Tool Search

By default, the plugin runs in tool-search mode (`bEnableToolSearch = true`). In this mode, `tools/list` returns four discovery meta-tools instead of every tool:

|  |  |
| --- | --- |
| **Meta-tool** | **Description** |
| list_toolsets | Returns the available toolset names and descriptions. |
| describe_toolsets | Returns the tools of one or more named toolsets, with each tool's name, description, and annotations. To include input and output schemas, pass `include_schemas: true`. |
| describe_tools | Returns complete schemas for specific tools, named as `Toolset.Tool` (or a bare name for a top-level tool). Returns an error for each unknown name. |
| call_tool | Calls a toolset's tool with the supplied arguments and returns the result on the same turn. If no toolset name is given, calls a top-level MCP tool. |

AI agents use these meta-tools to find tools as they need them, which keeps `tools/list` responses small even with hundreds of tools. Setting **Enable Tool Search **to `false` lists every tool up front, which makes the first response much larger. Don't rely on tools being listed up front, because most connecting agents get the tool-search meta-tools.

### Plugin Modules

The plugin is split across three modules. `ModelContextProtocol` and `ModelContextProtocolEngine` are runtime modules: they own the server, the protocol implementation, the settings, and the `StartServer`, `StopServer`, `RefreshTools`, and `GenerateClientConfig` console commands. `ModelContextProtocolEditor` is editor-only and handles the auto-start hook. The Toolset Registry adapter and tool search are part of the runtime `ModelContextProtocol` module, and the Toolset Registry itself is a runtime module.

### How the Server Runs

The plugin runs inside the editor process. By default, the server only accepts connections from the same machine, has no authentication layer, and isn't designed for remote use.

The server checks each request's `Origin` header against an allow-list: `localhost`, `127.0.0.1`, and `[::1]`, plus any origins you add in Editor Preferences. This prevents a web page from reaching the server through DNS rebinding. Each origin you add widens that exposure. Because there's no authentication, any local process or any browser page served from an allowed origin can call the editor's tools.

The MCP server runs tool calls one at a time on the game thread, so clients shouldn't send overlapping tool calls.

In the engine source, `.uplugin` files, C++ symbols, and console commands, the plugin's identifier is ModelContextProtocol. The **Plugins **window and documentation use the name Unreal MCP.

## Extend Unreal MCP

You can extend Unreal MCP with your own tools, agent skills, and Resources:

- **Toolsets:** The recommended way to add tools. Write a toolset in Python or C++ and register it with the Toolset Registry. This fits almost every case.
- **Direct registration:** For advanced cases where reflection-based discovery doesn’t work, such as tools whose schemas are only known at runtime.
- **Agent skills:** Named sets of instructions that AI agents load when they need workflow knowledge.
- **Resources:** Read-only data that MCP clients can fetch by URI.

### Create Tools with the Toolset Registry

A toolset is a class that derives from `unreal.ToolsetDefinition` (Python) or `UToolsetDefinition` (C++) and groups related tools. You can use either language.

If you use Claude Code, you can create a starter toolset in either language with the `create-toolset` skill from the `unreal-mcp` Claude Code plugin. The skill just writes the boilerplate for you, so you still need to follow the conventions for your language.

You can write most toolsets in either language. Use C++ when:

- A tool needs engine functionality not exposed to Python.
- A tool's signature uses `USTRUCT` or other reflected types that Python type hints can't express cleanly.
- A tool is called often enough that the cost of crossing between Python and the engine matters.
- A tool must run in a cooked build, which is covered later on this page.

Whichever language you use, follow these guidelines so AI clients can use your tools reliably:

- Keep each tool small and focused on one task.
- Prefer descriptive function names and structured return types over free-form strings. Structured types become JSON Schema with a type and description for each field. Free-form strings have no schema, so the client has to parse them.

#### Write a Toolset in Python

To write toolsets in Python, define a class that derives from `unreal.ToolsetDefinition`, mark each tool with the `@toolset_registry.tool_call` and `@staticmethod` decorators, and register the class from your plugin's `init_unreal.py` file. For a full example, registration steps, and Python conventions, see Using Python with AI Agents (-> using-python-with-ai-agents-in-unreal-engine).

#### Write a Toolset in C++

C++ toolsets follow the same pattern. Derive from `UToolsetDefinition`, mark the class `UCLASS(BlueprintType, Hidden)`, expose `UFUNCTION(meta = (AICallable))` functions, and register the class at module startup with `UToolsetRegistry::RegisterToolsetClass()`. Doc comments on the function and on each parameter are reflected into the schema in the same way as Python docstrings.

For a complete example, see `UAttributeSetToolset` in the `GASToolsets` plugin (`Engine/Plugins/Experimental/Toolsets/GASToolsets/Source/GASToolsets/Private/AttributeSetToolset.h`). It exposes two `AICallable` functions with plain `USTRUCT` return types and no asynchronous behavior.

`GASToolsets` is an experimental plugin that's disabled by default. When you first enable it, the editor shows an experimental-feature warning.

 C++

```
UCLASS(BlueprintType, Hidden)
class UAttributeSetToolset : public UToolsetDefinition
{
    GENERATED_BODY()
public:
    /**
     * Returns all AttributeSet subclasses found in the project, including their attributes.
     * @return A list of attribute set descriptors sorted by class name.
     */
    UFUNCTION(meta = (AICallable, AIAccessMode = "Read"), Category = "AttributeSets")
```

#### Tool Metadata

Use these metadata specifiers on toolset functions:

- `AICallable`: Marks the function as a tool.
- `AIRuntimeCallable`: Implies `AICallable` and also marks the tool as safe to run in cooked and runtime builds. Only these tools are included in the runtime manifest.
- `AIAccessMode = "Read"`, `"Write"`, or `"Execute"`: Declares what the tool can do. Unreal MCP sends this to clients as an access mode and maps it to the MCP `readOnlyHint`, so clients can decide whether to ask for confirmation. The default is `Execute`, so set it on every tool.
- `AIIgnore`: Excludes a function on a toolset class from being a tool and silences validation errors.

In Python, pass `mode=unreal.ToolAccessMode.<Mode>` to the `tool_call` decorator instead of `AIAccessMode`.

Tools are static by default. To call a tool on an object instead, such as an editor subsystem or an object that the AI agent names, override one of these `IToolsetProvider` methods in your toolset class. A class can use only one of them.

- `UsesInstanceDispatch()`: The registry finds a single target object, such as an editor subsystem, and calls the tool on it.
- `UsesInstanceArgument()`: Each tool receives a reserved `instance` argument that names the object to run on. A tool can't declare its own parameter named `instance`. `EditorToolset.ObjectToolset` and `EditorToolset.MaterialInstanceToolset` use this mode.

#### Refresh Tools After You Make Changes

Run `ModelContextProtocol.RefreshTools` in the editor console to reload tools from the registry. Connected clients might need to reconnect to see new schemas. For C++ tools, Live Coding picks up changes to existing function bodies; adding a new `UFUNCTION` requires a full editor restart. For Python tools, reloading the module and running `RefreshTools` is enough.

### Register Tools Directly

If reflection-based discovery doesn't fit, such as for tools whose schemas are only known at runtime, tools that come and go, or tools backed by data outside the type system, implement `IModelContextProtocolTool` and register it:

 C++

```
	TSharedRef<IModelContextProtocolTool> Tool = MakeShared<FMyDynamicTool>();

	IModelContextProtocolModule::GetChecked().AddTool(Tool);
```

 TSharedRef<IModelContextProtocolTool> Tool = MakeShared<FMyDynamicTool>();

 IModelContextProtocolModule::GetChecked().AddTool(Tool);

When the tool's lifetime ends, remove it with `RemoveTool()`. As with Toolset Registry tools, the interface methods run on the game thread.

Cooked-build hosts that register tools through `IModelContextProtocolModule::AddTool()` directly list them in full regardless of the `bEnableToolSearch` setting.

### Write Agent Skills

An **agent skill** is a named set of instructions, optionally tied to toolsets, that an AI agent can load when it needs them. Use skills to capture workflow knowledge, such as how to place actors so they rest on the ground or how to structure a MetaSound, instead of putting that knowledge in tool descriptions.

In Python, decorate a class that derives from `unreal.AgentSkill` with `@agent_skill`. This example is from `EditorToolset/Content/Python/editor_toolset/skills/placing_actors.py`:

 Python

```
import unreal
from toolset_registry.agent_skill import agent_skill

@agent_skill
class PlacingActorsSkill(unreal.AgentSkill):
    """Provides guidance on placing actors in a level, including when to snap
    them to the ground. Apply this skill whenever spawning/adding actors."""

    instructions = """SNAPPING TO THE GROUND
- Physical things that rest on a surface should snap ...
```

In C++, derive from `UAgentSkill`. Skill classes are discovered through the Asset Registry. You can also create and edit skills at runtime with the `CreateSkill` and `UpdateSkill` tools.

You can also write a skill in Markdown. A folder that contains a `SKILL.md` file is a skill. The file starts with frontmatter that has a `name` and `description`, followed by the instructions. The registry looks for skill folders in these locations:

- `/Skills/` in every enabled plugin
- `/Skills/`
- `Engine/Extras/AgentTools/Skills/`

C++ code can add more locations with `AddSearchRoot`. Each skill gets a key, such as `/Skills/<PluginName>/<folder>` or `/Skills/Project/<folder>`, that AI agents pass to `AgentSkillToolset.GetSkills`. Relative links in `SKILL.md` are rewritten to absolute paths, so agents can open pages and scripts stored next to it.

### Add MCP Resources

Unreal MCP supports MCP Resources. To provide Resources, implement `IModelContextProtocolResourceProvider` (`ListResources`, `CanReadResource`, and `ReadResource`) and register it with `IModelContextProtocolModule::AddResourceProvider()`. Clients can then use `resources/list` and `resources/read`. The engine doesn't include any resource providers.

### Make Tools Available in Cooked Builds

The server isn't tied to the editor. Cooked game builds, including Shipping builds, can host an MCP server. Start it by calling `IModelContextProtocolModule::StartServer()` at startup or by passing `-ModelContextProtocolStartServer`.

- **Editor:** Toolsets are read through `UFUNCTION` reflection metadata, and all `AICallable` tools are available.
- **Cooked and runtime builds:** Reflection metadata isn't available, so toolsets register from a manifest generated at build time. The manifest includes only `AIRuntimeCallable` tools. To make a tool usable in a packaged game, tag it `AIRuntimeCallable`.

Cooked games aren't read-only. The `AIRuntimeCallable` tag is the only thing that limits which tools a cooked game exposes, so tag tools carefully.

Engine toolsets with runtime-callable tools include NavMesh, Scene Capture, Console, Widget Finder, Perf (CSV and GPU profiler, Stats), and Input.

## Debug Unreal MCP

Unreal MCP includes the following tools and information to help you debug connection and tool problems:

**Output Log**: When Auto Start Server is enabled, the server logs its bind address, port, and URL path to the Output Log during editor initialization. If the server can't bind, for example because the port is in use or a required plugin is missing, the error appears there. If the server doesn't seem to be running, check the log first.

**Instance Information: **Every `initialize` result includes instance information in `_meta["com.epicgames.unrealengine/instance"]`: the instance ID, process ID, engine version, branch, changelist, project name, and engine and project folders. An AI agent can check which editor it reached before it changes anything. The server always reports its name in `serverInfo.name` as `unreal-mcp`.

**LogModelContextProtocol log category**. All plugin output goes to this category. To see more detail, enter Log `LogModelContextProtocol Verbose` in the editor console.

**LogToolsetRegistry log category**. Toolset Registry problems log to `LogToolsetRegistry`. For example, `Cannot register Toolset … no entry in baked manifest` in a cooked build means the toolset has no `AIRuntimeCallable` tools.

**MCP Inspector. **The MCP Inspector is the official debugging client for MCP servers. If a tool doesn't appear, returns unexpected output, or reports a protocol error, connect the Inspector to the server. It lists every tool with its schema and lets you call tools from a form, with no AI agent in between.

To launch the Inspector:

- Run `npx @modelcontextprotocol/inspector`.
- When the Inspector opens, connect it to `http://127.0.0.1:8000/mcp` over the **Streamable HTTP** transport.
- If the Inspector runs on a non-loopback origin, add that origin to **Additional Allowed Origins**.

**ModelContextProtocol.RefreshTools**. If new or changed tools don't appear, run this command and reconnect your client. For more information, see Refresh Tools After You Make Changes (-> unreal-mcp-in-unreal-editor).

**Dump Media To Disk**. To inspect the images and audio that tools return, enable **Dump Media To Disk** in Editor Preferences. Files are written to `Saved/ModelContextProtocol/`.

## Tips and Best Practices

### Connect to More Than One Editor

You can connect an AI agent to more than one Unreal Editor at a time, such as editors for two engine versions or two projects, or an editor that the agent launched alongside your own. Each editor runs its own MCP server, so each one needs its own port and its own entry in the client config.

- Give each editor a different port. Set **Server Port Number** in Editor Preferences, or pass `-ModelContextProtocolPort=` when you launch the editor.
- Add one entry per editor to your client config, and give each entry a different name. `GenerateClientConfig` always writes an entry named `unreal-mcp` and points it at the editor you run it in, so add the other entries by hand.

For example, this `.mcp.json` file connects Claude Code to one editor on port 8000 and another on port 8001:

 Config

```
{
  "mcpServers": {
    "unreal-mcp": {
      "type": "http",
      "url": "http://127.0.0.1:8000/mcp"
    },
    "unreal-mcp-5-8": {
      "type": "http",
      "url": "http://127.0.0.1:8001/mcp"
    }
```

To check which editor answered a request, look at the instance information in the `initialize` result. For more information, see Debug Unreal MCP (-> unreal-mcp-in-unreal-editor).

If your AI client can edit files, such as Claude Code, you can ask it to add the extra entries to your config file for you.

### Handle Long Tool Calls

Some clients stop waiting for a call after a timeout (Claude Code after about 120 seconds). To keep a long call alive, send a `progressToken` in `_meta` to get `notifications/progress` heartbeats during the call. To cancel, send `notifications/cancelled`. Split very long work, such as Live Coding builds, large scripts, asset scans, and automation runs, into shorter calls.

### Restart the Editor from an AI Agent

To restart the editor from an AI agent, call `ExitEditor` in `EditorToolset.EditorAppToolset` (set `bDiscardUnsavedChanges` if needed), then start the editor again. Clients must reconnect after the restart.

### Import Assets with Tools

The `ImportFile` tools for Sound Waves, Textures, Static Meshes, Skeletal Meshes, Data Tables, Curve Tables, and String Tables take `bReplaceExisting` and `bSave` arguments, which are both `false` by default. Each tool only replaces an existing asset of its own class, and `bSave` runs save validators.

## Configuration Reference

The following sections list the settings, console commands, command-line flags, and console variables that control Unreal MCP.

### Editor Preferences

In** Editor Preferences**, in **Agentic Workflows > Model Context Protocol**, you can find the following settings:

|  |  |  |
| --- | --- | --- |
| **Property** | **Default** | **Description** |
| **Auto Start Server** | `true` | Start the MCP server automatically on editor startup. |
| **Server Port Number** | `8000` | Port the server listens on. |
| **Server URL Path** | `/mcp` | URL path the server serves under. |
| **Enable Tool Search** | `true` | When enabled, `tools/list` returns only the meta-tools (`list_toolsets`, `describe_toolsets`, `describe_tools`, `call_tool`) instead of every tool schema. See Tool Search (-> unreal-mcp-in-unreal-editor). |
| **Additional Allowed Origins** | empty | Extra `scheme://host[:port]` origins the server accepts besides `localhost`, `127.0.0.1`, and `[::1]`. Each entry widens DNS-rebinding exposure. |
| **Dump Media To Disk** | `false` | Writes every image and audio block sent over MCP to `Saved/ModelContextProtocol/`. Useful for debugging screenshot tools. |
| **Instructions** | empty | Your instructions, sent to every client when it connects. See Add Server Instructions (-> unreal-mcp-in-unreal-editor). |
| **Client Selection** | Claude Code | In the MCP Client category. The client that the Generate Client Config button writes a config for: All, Claude Code, Codex, Cursor, Gemini, or VS Code. |

### Project Settings

In **Project Settings**, in** Agentic Workflows > Model Context Protocol**, you can find the following settings:

|  |  |  |
| --- | --- | --- |
| **Property** | **Default** | **Description** |
| **Instructions** | n/a | Project instructions sent to every client when it connects. They're stored in DefaultGame.ini, so everyone working on the project gets them. |

### Console Commands

|  |  |
| --- | --- |
| Command | Description |
| `ModelContextProtocol.StartServer [port]` | Start the server, optionally overriding the port. |
| `ModelContextProtocol.StopServer` | Stop the server and close all sessions. |
| `ModelContextProtocol.RefreshTools` | Re-poll registered tool providers. Use after authoring or hot-reloading toolsets. |
| `ModelContextProtocol.GenerateClientConfig <Client/All>` | Generate a config file for the named MCP client in the project root (installed builds) or the engine root (source builds). |

### Command-Line Flags

|  |  |
| --- | --- |
| **Flag** | **Description** |
| `-ModelContextProtocolStartServer` | Start the server during editor or commandlet startup, regardless of the Auto Start Server setting. |
| `-ModelContextProtocolPort=N` | Override the port (1–65535). If the value isn't valid, the server uses the Server Port Number setting. |

### Console Variables

|  |  |  |  |
| --- | --- | --- | --- |
| **Console Variable** | **Type** | **Default** | Description |
| `ModelContextProtocol.WrapPODToolResultsInObject` | `bool` | `true` | Wrap primitive tool results in {`"result": ..`.} for clients that expect object-shaped responses. |
| `ModelContextProtocol.AudioResultOggFormat` | `bool` | `false` | Encode audio tool results as OGG instead of WAV. |
| `ModelContextProtocol.ProgressIntervalSeconds` | `float` | `1.0` | Minimum interval between MCP progress notifications. |
| `ModelContextProtocol.PaginationPageSize` | `int32` | `0` | Maximum items per paginated response. `0` disables pagination and returns all items. |
| `ModelContextProtocol.EnableAnalytics` | `bool` | `true` | Turn analytics on or off. |

## Limitations and Known Issues

- Supports Streamable HTTP and Server-Sent Events (SSE) only. The `stdio` and WebSocket transports aren't supported.
- Loopback only by default. The HTTP listener uses `[HTTPServer.Listeners] DefaultBindAddress` (default `127.0.0.1`). A project or plugin that sets it to `any` also exposes MCP to the network. The server rejects `Origin` headers that aren't on the allow-list. There's no authentication layer, so don't expose the server beyond the local machine.
- No engine toolsets provide MCP Resources, and Prompts aren't supported.
- In cooked builds, only `AIRuntimeCallable` tools are available.
- Live Coding doesn't pick up new `UFUNCTION` declarations, so adding a C++ tool requires an editor restart.

## See Also

- Model Context Protocol specification
- MCP Inspector

- ai
- mcp

On this page

- What Is the Model Context Protocol? (-> unreal-mcp-in-unreal-editor)
- Set Up Unreal MCP (-> unreal-mcp-in-unreal-editor)
- Enable the Plugins (-> unreal-mcp-in-unreal-editor)
- Check Auto-Start (-> unreal-mcp-in-unreal-editor)
- Run Your AI Agent from a Terminal (-> unreal-mcp-in-unreal-editor)
- Generate a Client Config (-> unreal-mcp-in-unreal-editor)
- Launch Your AI Agent (-> unreal-mcp-in-unreal-editor)
- Optional: Use the Terminal Plugin (-> unreal-mcp-in-unreal-editor)
- Run Your AI Agent in the Unreal Assistant Panel (-> unreal-mcp-in-unreal-editor)
- Optional: Add Server Instructions (-> unreal-mcp-in-unreal-editor)
- Test Your Connection (-> unreal-mcp-in-unreal-editor)
- How Unreal MCP Works (-> unreal-mcp-in-unreal-editor)
- Toolsets and the Toolset Registry (-> unreal-mcp-in-unreal-editor)
- Tool Search (-> unreal-mcp-in-unreal-editor)
- Plugin Modules (-> unreal-mcp-in-unreal-editor)
- How the Server Runs (-> unreal-mcp-in-unreal-editor)
- Extend Unreal MCP (-> unreal-mcp-in-unreal-editor)
- Create Tools with the Toolset Registry (-> unreal-mcp-in-unreal-editor)
- Write a Toolset in Python (-> unreal-mcp-in-unreal-editor)
- Write a Toolset in C++ (-> unreal-mcp-in-unreal-editor)
- Tool Metadata (-> unreal-mcp-in-unreal-editor)
- Refresh Tools After You Make Changes (-> unreal-mcp-in-unreal-editor)
- Register Tools Directly (-> unreal-mcp-in-unreal-editor)
- Write Agent Skills (-> unreal-mcp-in-unreal-editor)
- Add MCP Resources (-> unreal-mcp-in-unreal-editor)
- Make Tools Available in Cooked Builds (-> unreal-mcp-in-unreal-editor)
- Debug Unreal MCP (-> unreal-mcp-in-unreal-editor)
- Tips and Best Practices (-> unreal-mcp-in-unreal-editor)
- Connect to More Than One Editor (-> unreal-mcp-in-unreal-editor)
- Handle Long Tool Calls (-> unreal-mcp-in-unreal-editor)
- Restart the Editor from an AI Agent (-> unreal-mcp-in-unreal-editor)
- Import Assets with Tools (-> unreal-mcp-in-unreal-editor)
- Configuration Reference (-> unreal-mcp-in-unreal-editor)
- Editor Preferences (-> unreal-mcp-in-unreal-editor)
- Project Settings (-> unreal-mcp-in-unreal-editor)
- Console Commands (-> unreal-mcp-in-unreal-editor)
- Command-Line Flags (-> unreal-mcp-in-unreal-editor)
- Console Variables (-> unreal-mcp-in-unreal-editor)
- Limitations and Known Issues (-> unreal-mcp-in-unreal-editor)
- See Also (-> unreal-mcp-in-unreal-editor)
