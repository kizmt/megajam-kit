# Run External AI Agents in the Unreal Assistant Panel

https://dev.epicgames.com/documentation/en-us/unreal-engine/run-external-ai-agents-in-the-unreal-assistant-panel-in-unreal-engine?application_version=5.9

> Learn how to run Claude Code, Codex, and other AI agents in the Unreal Assistant panel.

[image: Run External AI Agents in the Unreal Assistant Panel]

You can run your own AI agent, such as Claude Code or Codex, in the Unreal Assistant panel instead of the Unreal Assistant service. The panel looks the same, but your agent provides the replies, the model, and the tool calls, using your own account with that agent's provider. While an external agent is selected, the panel sends your chat to that agent, not to the Unreal Assistant service.

Use an external agent if you already work with one of these agents and want to keep your own model, settings, and subscription while you work in Unreal Editor.

Unreal Editor starts the agent as a local program and communicates with it over the **Agent Client Protocol (ACP)**. The editor also connects the agent to its Unreal MCP server, so the agent can use the same tools as any other MCP client. For more information, see Unreal MCP.

The panel supports the following AI agents:

| Agent | Adapter or Command Unreal Editor Runs | Install |
| --- | --- | --- |
| Claude Code | `claude-agent-acp` | `npm install -g @agentclientprotocol/claude-agent-acp` |
| Codex | `codex-acp` | `npm install -g @agentclientprotocol/codex-acp` |
| Cursor | `agent acp` | Install the Cursor CLI |
| OpenCode | `opencode acp` | Install the OpenCode CLI |
| Custom | Your own command and arguments | Your own ACP agent |

The npm adapters are published by the Agent Client Protocol project, not by Epic Games.

### Prerequisites

Before you start, ensure you have:

- Enabled the **Unreal Assistant** and **Unreal MCP** plugins. Both are enabled by default.
- Enabled the **All Toolsets** plugin, or the specific toolset plugins your agent needs. Your agent needs toolsets to use editor tools.
- Confirmed the Unreal MCP server is running. By default, it starts with the editor, and you can check the Model Context Protocol settings in Editor Preferences. For more information, see Unreal MCP (-> unreal-mcp-in-unreal-editor).
- Installed **Node.js**, if you use one of the npm adapters.
- Installed your agent's CLI and signed in to your own account. The adapter uses that sign-in. To sign in, run `claude login` for Claude Code or `codex login` for Codex.
- Installed the ACP adapter for your agent. For install commands, see the table above. After you install the adapter, restart the editor so it can find the adapter on your `PATH`.

The MCP server has no authentication. Any local process, and any browser page served from `localhost`, `127.0.0.1`, or `[::1]`, can call the editor's tools. For more information, see Limitations and Known Issues in Unreal MCP (-> unreal-mcp-in-unreal-editor).

## Set Up Your Agent in the Unreal Assistant Panel

To run your own AI agent in the panel, open the panel, then turn on and approve your agent.

### Open the Unreal Assistant Panel

To open the panel, in Unreal Editor's main menu, go to **Window > Unreal Assistant**, or click **Assistant** on the right side of the status bar at the bottom of the editor.

[image: Assistant button in the status bar]

### Turn On Your Agent

To turn on your agent, follow these steps:

- Go to **Edit > Editor Preferences**. Under **General** settings, select **Unreal Assistant**.
- Expand **External Agent**.
- In the **External Agent** dropdown, select your agent (Claude Code, Codex, Cursor, OpenCode, or Custom).If you select **Custom**, two more fields appear, **Custom Agent Command** and **Custom Agent Arguments**. Don’t put credentials in either field. This text is visible in the panel and written to the editor log when the agent starts. To pass secrets, use the agent’s environment variables or its own config file instead.
- Enable **Use External Agent**. When your agent is set up, **External Agent Status** shows the full path to the adapter or command the editor runs.If **External Agent Status** shows an error with an install command, restart the editor first. If the error is still there after you restart, run the listed install command in a terminal, then restart the editor again.

### Approve Your Agent

The first time the editor runs an agent's command in a project (when you enable **Use External Agent** or change the agent), an approval prompt appears.

- If you click **Allow**, the editor saves your approval for this project and starts the agent in the panel.
- If you click **Don't Allow**, the editor turns **Use External Agent** off and keeps using the Unreal Assistant service.

After you allow the agent, **External Agent Status** shows Runs `<path>`.

The editor stores approvals per user, per project, and per command line. On Windows, approvals are stored in the registry in `HKCU\Software\Epic Games\Unreal Engine\AIAssistant\ApprovedAgentCommands`. The External Agent settings are saved per user in `Saved/Config/WindowsEditor/EditorPerProjectUserSettings.ini.`

### Switch Agents in the Panel

The **Agent** selector in the top-left corner of the panel lists **Unreal Assistant** and each external agent. Agents whose adapter isn't installed are grayed out.

[image: Agent selector in the Unreal Assistant panel]

When you select an external agent, the panel asks you to confirm the switch. If you haven't approved that agent's command in this project yet, the approval prompt appears.

Selecting **Unreal Assistant** from the list switches the panel back to the Unreal Assistant service without a prompt. Each agent keeps its own chat history.

### Prompt Your Agent

The prompt bar shows your agent's own settings, such as permission mode, model, and reasoning effort. These settings change when you switch agents. For example, Claude Code's prompt bar looks like this:

[image: Panel running Claude Code]

With Codex, the prompt bar shows Codex's settings:

[image: Codex answering through unreal-mcp]

The available permission modes (shield icon) depend on the selected agent. For example, Claude Code's modes are **Manual**, **Accept edits**, **Plan**, **Auto**, and **Bypass permissions**.

[image: Claude Code permission modes]

When you prompt the agent to work in or get information from the editor, it calls Unreal MCP tools. To see each call, expand **Required Actions**.

[image: Claude Code calling unreal-mcp tools]

[image: Codex answering through unreal-mcp]

## Troubleshooting

| Problem | Solution |
| --- | --- |
| External Agent Status shows `Could not find <command>` | Install the adapter, then restart the editor. The editor reads your `PATH` at startup. If it still can't find the adapter, fully quit the Epic Games Launcher, including from the system tray, then start the editor from the Launcher again. You can also select **Custom** and enter the full path. |
| External Agent Status shows `<command> is a relative path` | Enter a full path, or a command name on your `PATH`. |
| The panel shows `The Unreal Assistant is unavailable` | Click **Reconnect**. If that doesn't work, restart the editor. Your conversation is kept. |
| The prompt bar still shows the previous agent's model | The agent starts when you send your first message. Send a message, and the settings update. |
| Pressing Enter adds a new line | To send your message, click the send arrow. |
| Claude Code in **Manual **mode stays on `Waiting for your approval` with no buttons | Switch the permission mode to **Auto** or **Accept edits**, start a **New Chat**, and send your message again. |
| The agent replies but can't see the editor | Check that the MCP server is running. For more information, see Prerequisites. If you use `AIAssistant.json`, make sure `mcp_servers` isn't an empty array (`[]`). |

On this page

- Prerequisites (-> run-external-ai-agents-in-the-unreal-assistant-panel-in-unreal-engine)
- Set Up Your Agent in the Unreal Assistant Panel (-> run-external-ai-agents-in-the-unreal-assistant-panel-in-unreal-engine)
- Open the Unreal Assistant Panel (-> run-external-ai-agents-in-the-unreal-assistant-panel-in-unreal-engine)
- Turn On Your Agent (-> run-external-ai-agents-in-the-unreal-assistant-panel-in-unreal-engine)
- Approve Your Agent (-> run-external-ai-agents-in-the-unreal-assistant-panel-in-unreal-engine)
- Switch Agents in the Panel (-> run-external-ai-agents-in-the-unreal-assistant-panel-in-unreal-engine)
- Prompt Your Agent (-> run-external-ai-agents-in-the-unreal-assistant-panel-in-unreal-engine)
- Troubleshooting (-> run-external-ai-agents-in-the-unreal-assistant-panel-in-unreal-engine)

Related documents

Unreal MCP

 [image: Unreal MCP] (-> unreal-mcp-in-unreal-editor)AI Features, Tools, and Plugins

 [image: AI Features, Tools, and Plugins] (-> ai-features-tools-and-plugins-in-unreal-engine)
