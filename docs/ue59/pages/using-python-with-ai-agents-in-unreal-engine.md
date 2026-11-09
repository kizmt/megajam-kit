# Using Python with AI Agents

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-python-with-ai-agents-in-unreal-engine?application_version=5.9

> Learn how to use Python with AI agents in Unreal Editor through Unreal MCP, including running scripts and writing toolsets and agent skills.

[image: Using Python with AI Agents]

You can use Python to work with AI agents in the Unreal Editor in two ways. AI agents can run editor Python scripts to inspect and change your project, and you can write toolsets and agent skills in Python that extend what AI agents can do in the editor.

This page is for technical artists, pipeline engineers, and tools programmers who already script the editor in Python and want to make their scripts, tools, and workflows available to AI agents.

## Prerequisites

Before you start, do the following:

- Set up Unreal MCP and connect an AI agent to the editor. For more information, see Unreal MCP (-> unreal-mcp-in-unreal-editor).
- Enable the **Python Editor Script Plugin** for your project. For more information, see Scripting the Unreal Editor Using Python (-> scripting-the-unreal-editor-using-python).

## Running Python Through AI Agents

With the `PythonScriptingTools` toolset in `EditorToolset`, an AI agent can run editor Python through the `execute_python` tool, which uses the Execute access mode. The `search_symbols`, `get_symbol`, and `grep_stubs` tools look up the Python API. The toolset's `read_me` tool is intended to be called once per conversation.

Scripts that run through `execute_python` work as follows:

- All imports must be at the top level of the script, and star imports (`from module import *`) aren't allowed. `execute_python` checks the script before it runs and rejects it if it breaks either rule. The error names the line.
- The tool returns the value of the script's final expression, the same way an interactive Python session does. If the final expression is an `await`, the tool returns the awaited value.
- Output from `print` goes to the Output Log under the `LogPython` category, not to the tool result.

A script can also call other tools with `await call_tool(name, **arguments)`, using the tool's full name. Results are checked against the tool's output schema, so reading a field the tool doesn't return raises a `KeyError` that lists the available fields.

### Using One Script for Many Edits

When an AI agent needs to make many edits, such as building a widget tree or creating dozens of Material Instances, prompt it to write and run one Python script instead of making many separate tool calls. Use individual tool calls for inspection, screenshots, and compile errors.

## Writing Toolsets in Python

A toolset is a class that groups related tools. Toolsets register with the Toolset Registry, and editor AI features that use the registry, including Unreal MCP, offer those tools to AI agents. You write a toolset once, and it works with every AI feature that reads the registry. For authoring toolsets in C++, see Unreal MCP.

To write a toolset in Python, place a module in any plugin's `Content/Python` folder, define the toolset class in it, then register the class from the plugin's `init_unreal.py` file.

### Defining a Toolset

The following example from the GeometryToolset plugin (`Engine/Plugins/Experimental/Toolsets/GeometryToolset/Content/Python/geometry_toolset/geometry_ops.py`) defines a toolset with one tool:

 Python

```
import unreal
import toolset_registry

@unreal.uclass()
class GeometryTools(unreal.ToolsetDefinition):
    """Procedural geometry primitives for DynamicMesh instances. Use when
    an AI agent needs to build custom geometry that isn't available as a
    StaticMesh asset, directly inside the level."""

    @toolset_registry.tool_call(mode=unreal.ToolAccessMode.WRITE)
```

### Registering a Toolset

To register a toolset, create a `Registration` object for it. In the GeometryToolset plugin, `geometry_toolset/__init__.py` creates the object:

 Python

```
from toolset_registry.registration import Registration
from geometry_toolset import geometry_ops

_registration = Registration([geometry_ops.GeometryTools])
```

from toolset_registry.registration import Registration
from geometry_toolset import geometry_ops

_registration = Registration([geometry_ops.GeometryTools])

The plugin's `init_unreal.py` file then registers it:

 Python

```
from geometry_toolset import _registration
_registration.register()
```

from geometry_toolset import _registration
_registration.register()

After you change a Python toolset, reload the module and run the `ModelContextProtocol.RefreshTools` console command. Connected clients might need to reconnect to see the updated tools.

### Toolset Conventions

Follow these conventions when you write a Python toolset:

- **Class:** Use the `@unreal.uclass()` decorator to register the class with reflection, and derive the class from `unreal.ToolsetDefinition`.
- **Toolset description:** The class docstring becomes the toolset description. Write it as guidance on when an AI agent should use the toolset.
- **Tools:** Mark each tool with the `@toolset_registry.tool_call(mode=...)` and `@staticmethod` decorators. Methods without these decorators are not advertised as tools.
- **Access mode:** Set `mode` to `unreal.ToolAccessMode.READ`, `unreal.ToolAccessMode.WRITE`, or `unreal.ToolAccessMode.EXECUTE` to declare what the tool can do. For more information about access modes, see Unreal MCP.
- **Type hints:** Parameter and return type hints define the tool's JSON schema. `list[T]` maps to `unreal.Array(T)`, `dict[str, V]` maps to `unreal.Map(str, V)`, `set[T]` maps to `unreal.Set(T)`, and `T | None` makes a parameter optional.
- **Docstrings:** Google-style docstrings with `Args:` and `Returns:` sections provide the descriptions in the tool's schema. Write them with the same care as any public API.
- **Errors:** Raise exceptions for errors instead of returning error strings. Exceptions that a tool raises are returned to the client as tool errors.
- **Long-running work:** Tools can be `async def` functions. For example, the `execute_python` tool in the `PythonScriptingTools` toolset is asynchronous.
- **Tests:** Put unit tests in a `tests` package inside the toolset's Python package (`/tests/`), and register them from the plugin's `init_unreal.py` file with `register_test_runner('.tests', '')`. The tests then appear in the Session Frontend automation tests under that path. For example, the EditorToolset plugin registers its tests like this: Python ```
from _unittest_runner.unittest_runner_bridge import register_test_runner
register_test_runner('editor_toolset.tests', 'AIAssistant.Toolsets.EditorToolset')
``` from _unittest_runner.unittest_runner_bridge import register_test_runner register_test_runner('editor_toolset.tests', 'AIAssistant.Toolsets.EditorToolset')

## Writing Agent Skills in Python

An agent skill is a named set of instructions that an AI agent loads when a task needs it. Use skills to capture workflow knowledge, such as how to place actors so they rest on the ground, instead of putting that knowledge in tool descriptions.

In Python, an agent skill is a class that derives from `unreal.AgentSkill` and uses the `@agent_skill` decorator from `toolset_registry.agent_skill`. The class docstring describes when to apply the skill, and the `instructions` attribute holds the instructions. Skill classes are discovered automatically, so you do not need to register them.

The following example is from the EditorToolset plugin (`EditorToolset/Content/Python/editor_toolset/skills/placing_actors.py`):

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

For agent skills written in C++ or as Markdown files, see Unreal MCP.

On this page

- Prerequisites (-> using-python-with-ai-agents-in-unreal-engine)
- Running Python Through AI Agents (-> using-python-with-ai-agents-in-unreal-engine)
- Using One Script for Many Edits (-> using-python-with-ai-agents-in-unreal-engine)
- Writing Toolsets in Python (-> using-python-with-ai-agents-in-unreal-engine)
- Defining a Toolset (-> using-python-with-ai-agents-in-unreal-engine)
- Registering a Toolset (-> using-python-with-ai-agents-in-unreal-engine)
- Toolset Conventions (-> using-python-with-ai-agents-in-unreal-engine)
- Writing Agent Skills in Python (-> using-python-with-ai-agents-in-unreal-engine)

Related documents

Scripting the Unreal Editor Using Python

 [image: Scripting the Unreal Editor Using Python] (-> scripting-the-unreal-editor-using-python)Unreal MCP

 [image: Unreal MCP] (-> unreal-mcp-in-unreal-editor)
