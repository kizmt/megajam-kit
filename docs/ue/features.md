# Beta and Experimental features: policy

Epic's definitions (5.8):
- **Beta**: "available in a stable state"; stable APIs, backward-compatible assets; "use caution when shipping".
- **Experimental**: "not quite ready for use in shipping projects"; no asset backward compatibility; APIs may change;
  features may be removed.

We already depend on Experimental features on purpose: **Unreal MCP, the Toolset Registry/toolsets, Python editor
scripting, PCG via MCP**. Editor-side tooling that doesn't ship in the game is low risk. Runtime features that ship
inside the game are where the risk is.

## Rules

1. Use a Beta/Experimental feature when it clearly saves time or adds something judges will notice. Never for novelty.
2. **Never use one for the first time on jam day.** Prove it in a practice run first, including a **packaged build**.
3. Experimental features that run in the shipped game need a **fallback** written down before we commit.
4. Record the result here (works / doesn't / gotchas) after each practice run.

## Candidates to try in practice runs

| Feature | Status | Why it might matter | Verdict |
|---|---|---|---|
| Recovery Hub | Beta | Restores the editor session after a crash: insurance for 93 hours | untested |
| Multi-Process Cooking | Beta | Faster packaging | untested |
| MetaSounds | Beta | Reactive, procedural game audio | untested |
| Modeling Tools / Geometry Scripting | Beta | Blockout and custom geometry inside the editor | untested |
| UMG Viewmodel | Beta | Cleaner data-driven UI | untested |
| Editor Utility Widgets / Scriptable Tools | Beta | Custom editor tools if we need them | untested |
| PCG with GPU Processing | Beta | Faster PCG | untested |
| Gameplay Camera System | Experimental | Better third-person/cinematic cameras | untested |
| Day Sequence | Experimental | Time-of-day changes | untested |
| Texture Graph | Experimental | Procedural textures in-engine | untested |
| PCG Editor Mode | Experimental | Faster PCG authoring | untested |
| Dynamic Asset Selection (Choosers) | Experimental | Data-driven asset/animation picking | untested |

Not for us: virtual production (nDisplay, ICVFX, Switchboard), XR, mobile, Datasmith/USD/ShotGrid, networking (Iris, Mover).

Sources: https://dev.epicgames.com/documentation/en-us/unreal-engine/beta-features?application_version=5.8 ,
https://dev.epicgames.com/documentation/en-us/unreal-engine/experimental-features?application_version=5.8
