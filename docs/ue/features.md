# Beta and Experimental features: policy

Epic's definitions (5.8):
- **Beta**: "available in a stable state"; stable APIs, backward-compatible assets; "use caution when shipping".
- **Experimental**: "not quite ready for use in shipping projects"; no asset backward compatibility; APIs may change;
  features may be removed.

We already depend on Experimental and Beta features on purpose: **Unreal MCP, the Toolset Registry/toolsets, PCG via
MCP** (Experimental) and **Python editor scripting** (Beta: `PythonScriptPlugin.uplugin` has `IsBetaVersion` true). Editor-side tooling that doesn't ship in the game is low risk. Runtime features that ship
inside the game are where the risk is.

## Rules

1. Use a Beta/Experimental feature when it clearly saves time or adds something judges will notice. Never for novelty.
2. **Never use one for the first time on jam day.** Prove it in a practice run first, including a **packaged build**.
3. Experimental features that run in the shipped game need a **fallback** written down before we commit.
4. After each practice run, log the result (works / doesn't / gotchas) in the project's `KIT_NOTES.md`; a
   kit-maintenance session records it here.

## Candidates to try in practice runs

| Feature | Status | Why it might matter | Verdict |
|---|---|---|---|
| Recovery Hub | Beta | Restores the editor session after a crash: insurance for 93 hours | untested |
| Multi-Process Cooking | Beta | Faster packaging | untested |
| MetaSounds | Not Beta in 5.8 (`Metasound.uplugin`: `IsBetaVersion` false, enabled by default) | Reactive, procedural game audio | untested; still prove it in a practice run (rule 2) |
| Modeling Tools / Geometry Scripting | Beta | Blockout and custom geometry inside the editor | untested |
| UMG Viewmodel | Beta | Cleaner data-driven UI | untested |
| Scriptable Tools (Editor Utility Widgets themselves are production, not a candidate) | Beta (`ScriptableToolsEditorMode.uplugin`) | Custom click-in-viewport editor tools if we need them | untested; rarely worth it in a jam (`editor-scripting.md` C) |
| PCG with GPU Processing | Beta | Faster PCG | **not for us**: runtime-only instances, no collision/navigation (`pcg.md` Performance) |
| Gameplay Camera System | Experimental | Better third-person/cinematic cameras | untested |
| Day Sequence | Experimental | Time-of-day changes | untested |
| Texture Graph | Experimental | Procedural textures in-engine | untested |
| PCG Editor Mode | Experimental | Faster PCG authoring | untested |
| Dynamic Asset Selection (Choosers) | Experimental | Data-driven asset/animation picking | untested |
| Mutable (runtime customisation) | Production-ready per Epic; plugin file says Beta. Population add-on discontinued per the wiki: skip | Character/vehicle creators, varied NPCs from shared parts | untested; graph authoring is by hand only: `mutable.md` |

Not for us: virtual production (nDisplay, ICVFX, Switchboard), XR, mobile, Datasmith/USD/ShotGrid, networking (Iris, Mover).

Sources: https://dev.epicgames.com/documentation/en-us/unreal-engine/beta-features?application_version=5.8 ,
https://dev.epicgames.com/documentation/en-us/unreal-engine/experimental-features?application_version=5.8
