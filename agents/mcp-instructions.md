# Unreal MCP server instructions (5.9)

UE 5.9 sends a project's MCP **Instructions** to every agent that connects to the editor: Claude Code in the
terminal, the editor's Unreal Assistant panel, anything else. They are the kit's core editor rules for agents that
never read `CLAUDE.md`. Project Settings > Agentic Workflows > Model Context Protocol > **Instructions** (stored in
`Config/DefaultGame.ini`, so it travels with the project); clients reconnect to pick up a change. `SETUP.md` step 3
pastes it. 5.8 has no such setting: there `CLAUDE.md` is the only copy of these rules.

Keep it short: it is sent on every connect. Paste the paragraph below as one line.

```text
megajam-kit project: one AI session (Claude Code in the project folder, following its CLAUDE.md) drives this editor. Tool calls run one at a time on the game thread, so no second agent calls tools while that session works. Before calling a tool you haven't used, read its schema (describe_toolsets with include_schemas: true, or describe_tools); schemas are strict. Before unfamiliar work, AgentSkillToolset ListSkills and GetSkills: /Skills/MegajamTools/megajam-editor-scripting before any editor Python or asset edit, /Skills/MegajamTools/megajam-assets before importing, placing or materials, and Epic's PCG, Niagara, material and Blueprint skills for those areas. Gameplay logic is C++; Blueprints are thin data wrappers with no graph logic. Never move, rename or delete asset files with OS file tools, and never delete an asset something references. Save scripted edits with only_if_is_dirty=False and check the file changed on disk. Many edits: one Python script instead of many calls. Nothing works until a capture or a log line shows it. Don't change Editor Preferences or other per-user settings. The kit at C:\dev\megajam-kit is read-only.
```
