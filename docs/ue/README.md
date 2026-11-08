# UE 5.8 knowledge base

Curated notes for this kit, written from the UE 5.8 docs (from 2026-10-24) and checked against the 5.8.4
headers, the Python stub and a test project, then extended with lessons from prototypes.
Lessons that depend on genre or art style say so where they appear; treat their numbers as one data point and
re-measure. Read the matching note **before** starting work in that area, then still verify what you use
(CLAUDE.md, "Unreal knowledge"). Most notes end with "Verified against" (dated) and "Sources (5.8)" so claims can
be traced.

If a note and the engine disagree, the engine wins. In a game session, add an entry to the project's
`KIT_NOTES.md` (the kit is read-only there); a kit-maintenance session then fixes the note and, for pipeline facts,
`PIPELINE.md` "Hard-won facts".

## Rules (read at the start of every project)

| Note | Read it for |
|---|---|
| [performance.md](performance.md) | Render paths by art style (measured), budgets for the RTX 4060, Nanite/material/texture/tick rules, how to measure |
| [naming.md](naming.md) | Asset prefixes and folder layout |
| [features.md](features.md) | When a Beta/Experimental feature is allowed, and the candidates list |

## By task

| When you are about to... | Read |
|---|---|
| Write or build C++, change Build.cs, fix a compile/link error, package | [cpp.md](cpp.md) |
| Make the player's pawn or character, camera, input, interaction, damage, spawning, save, level changes | [gameplay.md](gameplay.md) |
| Bring in a character, rig, retarget, animate | [characters.md](characters.md) |
| Let players customise characters, vehicles or objects, or make varied NPCs from shared parts (Mutable) | [mutable.md](mutable.md) |
| Give a character combat or rich animation (sources, jam rules, library retarget, combat pattern) | [animation-library.md](animation-library.md) |
| Add enemies/NPCs, navigation, perception, StateTree | [ai.md](ai.md) |
| Light a scene, set exposure/post, fix Lumen or shadow artefacts, the no-Lumen stylized look | [lighting.md](lighting.md) |
| Build or change materials (master, glass, decals, emissive, hit flash) | [materials.md](materials.md) |
| Make particle effects | [vfx.md](vfx.md) |
| Make actions feel good: hit-stop, shake, flash, rumble, springs, a juice pass | [game-feel.md](game-feel.md) |
| Physics props, collision, doors, pick-up, destruction | [physics.md](physics.md) |
| Sound, music, MetaSounds, HUD and menus (UMG/CommonUI), settings menu, gamepad menus, accessibility checklist | [audio-ui.md](audio-ui.md); generating the audio: [../elevenlabs.md](../elevenlabs.md) |
| Lay out the level, blockout, splines; foliage and landscape grass; script a landscape, World Partition or Water plugin sea/rivers/lakes; make a small game feel big; Quixel Megascans (supporting art only) | [worldbuilding.md](worldbuilding.md) |
| Generate walls, arches, stairs, props with Blender Python and import them | [procedural-assets.md](procedural-assets.md) |
| Scatter content procedurally | [pcg.md](pcg.md) |
| Write editor Python, MCP toolsets, in-editor skills | [editor-scripting.md](editor-scripting.md) |
| Track down a bug, crash, hitch; profile; write a test; scripted captures, key-injection tests, rare crashes | [debugging.md](debugging.md) |
| Record the submission video or a cinematic (trailer recipes: game audio, offline `-game` frame capture (the default once the game has test hooks), MRQ gameplay render, beat-cut edit) | [cinematics-video.md](cinematics-video.md) |
| Packaging, build stamp, final-pass checklist, code signing / Smart App Control, DDC/Zen, version control | [production.md](production.md) |

## Official references (5.8; all verified to resolve to 5.8 pages on 2026-10-24)

- Python API reference: https://dev.epicgames.com/documentation/en-us/unreal-engine/python-api/?application_version=5.8
  Same content as the local stub (both come from the engine's reflection data). Grep the stub first; use the web
  reference for readable class pages and descriptions.
- C++ API reference: https://dev.epicgames.com/documentation/unreal-engine/API?application_version=5.8 (headers on disk
  are faster to grep). Sections, matching the folders under `Engine\Source\` and `Engine\Plugins\`:
  - Runtime modules: https://dev.epicgames.com/documentation/unreal-engine/API/Runtime?application_version=5.8
  - Editor modules: https://dev.epicgames.com/documentation/unreal-engine/API/Editor?application_version=5.8
  - Developer modules: https://dev.epicgames.com/documentation/unreal-engine/API/Developer?application_version=5.8
  - Plugin modules, A-Z: https://dev.epicgames.com/documentation/unreal-engine/API/Plugins?application_version=5.8
  - Plugins by category: https://dev.epicgames.com/documentation/unreal-engine/API/PluginIndex?application_version=5.8
- Unreal MCP: https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-mcp-in-unreal-editor?application_version=5.8
- C++ coding standard: https://dev.epicgames.com/documentation/en-us/unreal-engine/epic-cplusplus-coding-standard-for-unreal-engine?application_version=5.8
- Enhanced Input: https://dev.epicgames.com/documentation/en-us/unreal-engine/enhanced-input-in-unreal-engine?application_version=5.8
- IK Rig retargeting: https://dev.epicgames.com/documentation/en-us/unreal-engine/ik-rig-animation-retargeting-in-unreal-engine?application_version=5.8
- Packaging: https://dev.epicgames.com/documentation/en-us/unreal-engine/packaging-your-project?application_version=5.8
  (hub: https://dev.epicgames.com/documentation/en-us/unreal-engine/packaging-and-cooking-games-in-unreal-engine?application_version=5.8)
- Console variables: https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-console-variables-reference?application_version=5.8
- Everything else: https://dev.epicgames.com/documentation/en-us/unreal-engine/ (check the version selector says 5.8).

## Finding anything else

[INDEX-docs.md](INDEX-docs.md) maps ~1,265 pages of the 5.8 documentation by section, each tagged
**core** (likely needed in the jam), **useful** or **skip**, with its URL. Search it before web-searching.
