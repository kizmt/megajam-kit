# Beta and Experimental features: policy

Epic's definitions (5.8):
- **Beta**: "available in a stable state"; stable APIs, backward-compatible assets; "use caution when shipping".
- **Experimental**: "not quite ready for use in shipping projects"; no asset backward compatibility; APIs may change;
  features may be removed.

We already depend on Experimental and Beta features on purpose: **Unreal MCP, the Toolset Registry/toolsets, PCG via
MCP** (Experimental) and **Python editor scripting** (`PythonScriptPlugin.uplugin` has `IsBetaVersion` true, but the
5.8 Experimental hub lists "Scripting the Unreal Editor Using Python"; editor-only either way).
Editor-side tooling that doesn't ship in the game is low risk. Runtime features that ship inside the game are where
the risk is.

## Rules

1. Use a Beta/Experimental feature when it clearly saves time or adds something judges will notice. Never for novelty.
2. **Never use one for the first time on jam day.** Prove it in a practice run first, including a **packaged build**.
3. Experimental features that run in the shipped game need a **fallback** written down before we commit.
4. After each practice run, log the result (works / doesn't / gotchas) in the project's `KIT_NOTES.md`; a
   kit-maintenance session records it here.

## Candidates to try in practice runs

| Feature | Status | Why it might matter | Verdict |
|---|---|---|---|
| Recovery Hub | Beta | Replays Level editing and Sequencer transactions after a crash. Off by default: enable the plugin, then Project Settings > Plugins > Recovery Hub > Is Enabled; after a crash, Tools > Recovery Hub > Recover All. Epic: "not intended as a replacement for autosave" | untested; scripted MCP edits are likely not recorded (`editor-scripting.md`), so save before scripted batches |
| Multi-Process Cooking | Beta | Faster packaging | untested |
| MetaSounds | Not Beta in 5.8 (`Metasound.uplugin`: `IsBetaVersion` false, enabled by default) | Reactive, procedural game audio | untested; still prove it in a practice run (rule 2) |
| Modeling Tools / Geometry Scripting | Beta | Blockout and custom geometry inside the editor | untested |
| UMG Viewmodel | Beta | Cleaner data-driven UI | untested |
| Scriptable Tools (Editor Utility Widgets are also Beta per the 5.8 Beta hub; editor-only, low risk) | Beta (`ScriptableToolsEditorMode.uplugin`) | Custom click-in-viewport editor tools if we need them | untested; rarely worth it in a jam (`editor-scripting.md` C) |
| PCG with GPU Processing | Beta | Faster PCG | **not for us**: runtime-only instances, no collision/navigation (`pcg.md` Performance) |
| Gameplay Camera System | Experimental | Better gameplay cameras (follow, top-down, cinematic) | untested |
| Day Sequence | Experimental | Time-of-day changes | untested |
| Texture Graph | Experimental | Procedural textures in-engine | untested |
| PCG Editor Mode | Experimental | Faster PCG authoring | untested |
| Dynamic Asset Selection (Choosers) | Experimental | Data-driven asset/animation picking | untested |
| Water plugin | Experimental (`Water.uplugin`) | Sea, rivers, lakes with waves, shoreline and SLW shading for free | **works from Python** (rehearsal): many gotchas, recipe in `worldbuilding.md` "Water"; packaged perf not isolated |
| Motion Warping | Beta | Lines up attacks, vaults and climbs with a target by warping root motion | untested in the kit; `animation-library.md` "Combat animation pattern" |
| Nanite Foliage (shape preservation `VOXELIZE`) | Experimental (Project Settings > Rendering > Nanite Foliage, editor restart) | Thin leaves that survive at distance | **tested in the rehearsal:** right for trees (5-7 m), wrong for small thin plants (use Preserve Area); WPO wind works. Epic's Nanite Foliage page says some voxel settings "don't actually work as intended yet, if at all". Rehearsal details: `performance.md` "Geometry" |
| MegaLights | Production Ready per the 5.8 release notes; doc page and source help text still say Experimental | Many shadowed local lights at near-constant cost | untested; only for a night or interior level, after a practice-run measurement; not for the sun (`lighting.md` "MegaLights") |
| Lumen Lite | Beta (5.8 release notes) | "Twice as fast as Lumen high quality"; the kit ships it as the Medium preset | untested in a packaged build: prove it (rule 2; `lighting.md` "Scalability") |
| Sandboxes | Experimental (5.8 launch post) | Isolated workspace keeping only chosen changes | **skip**: Git branches do this; interaction with Git and World Partition external actors undocumented |
| Mutable (runtime customisation) | Production-ready per Epic; plugin file says Beta. Population add-on discontinued per the wiki: skip | Character/vehicle creators, varied NPCs from shared parts | untested; graph authoring is by hand only: `mutable.md` |

Not for us: virtual production (nDisplay, ICVFX, Switchboard), XR, mobile, Datasmith/USD/ShotGrid, networking (Iris).
**Mover** replaces the movement component (not just networking) and is still Experimental in 5.8; CharacterMovement
covers single-player, so skip it.

**Traps new in 5.7-5.8, all Experimental: don't start them in the jam.** Mesh Terrain, the Procedural Vegetation
Editor (grows Nanite foliage assemblies), Fog Screen Space Scattering ("only a single blur quality level and may exhibit
visual artifacts"), Direct Mesh Controls, Animation Mixer in Sequencer, MetaHuman Crowds/Collections, Fast Geometry
Streaming and Spatially Aware Retargeting. Control Rig Physics is Beta but needs a hand-authored rig.

5.8 hub lists, for reference. Beta: Recovery Hub, Modeling Mode/Tools, UV Editor, Geometry Scripting, PCG GPU
Processing, Substrate, UMG Viewmodel, Waveform Editor, MetaSounds Quick Start, MetaSound Builder API, Editor Utility
Widgets, Scripted Actions, Scriptable Tools, Multi-Process Cooking. Experimental: PCG Editor Mode, PCG Biome, Nanite
Foliage, Heterogeneous Volumes, Texture Graph, Day Sequence, Gameplay Camera System, Mover, Mass Avoidance, Choosers,
CommonUI with Enhanced Input, MetaSound Templates and Pages, Python editor scripting. StateTree and Smart Objects are on
neither list. Epic's pages disagree in places (Substrate: "production-ready" in the 5.7 notes, Beta on the 5.8 hub).

Sources: https://dev.epicgames.com/documentation/en-us/unreal-engine/beta-features?application_version=5.8 ,
https://dev.epicgames.com/documentation/en-us/unreal-engine/experimental-features?application_version=5.8 ,
https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-5-8-release-notes ,
https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-5-7-release-notes?application_version=5.7 ,
https://www.unrealengine.com/en-US/news/unreal-engine-5-8-is-now-available ,
https://dev.epicgames.com/documentation/en-us/unreal-engine/recovery-hub-in-unreal-engine?application_version=5.8 ,
https://dev.epicgames.com/documentation/en-us/unreal-engine/nanite-foliage
