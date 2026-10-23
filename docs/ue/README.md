# UE 5.8 knowledge base

Curated notes for this kit, written 2026-10-24 from the UE 5.8 docs and checked against the 5.8.4
headers, the Python stub and the SmokeTest project. Read the matching note **before** starting work in
that area, then still verify what you use (CLAUDE.md, "Unreal knowledge"). Each note ends with
"Verified against" and "Sources (5.8)" so claims can be traced.

If a note and the engine disagree, the engine wins: fix the note and add the fact to
`PIPELINE.md` "Hard-won facts".

## Rules (read at the start of every project)

| Note | Read it for |
|---|---|
| [performance.md](performance.md) | Budgets for the RTX 4060, Nanite/material/texture/tick rules, how to measure |
| [naming.md](naming.md) | Asset prefixes and folder layout |
| [features.md](features.md) | When a Beta/Experimental feature is allowed, and the candidates list |

## By task

| When you are about to... | Read |
|---|---|
| Write or build C++, change Build.cs, fix a compile/link error, package | [cpp.md](cpp.md) |
| Make the player, camera, input, interaction, damage, spawning, save, level changes | [gameplay.md](gameplay.md) |
| Bring in a character, rig, retarget, animate | [characters.md](characters.md) |
| Add enemies/NPCs, navigation, perception, StateTree | [ai.md](ai.md) |
| Light a scene, set exposure/post, fix Lumen or shadow artefacts | [lighting.md](lighting.md) |
| Build or change materials (master, glass, decals, emissive, hit flash) | [materials.md](materials.md) |
| Make particle effects | [vfx.md](vfx.md) |
| Physics props, collision, doors, pick-up, destruction | [physics.md](physics.md) |
| Sound, music, MetaSounds, HUD and menus (UMG/CommonUI) | [audio-ui.md](audio-ui.md) |
| Lay out the level, blockout, splines, water | [worldbuilding.md](worldbuilding.md) |
| Scatter content procedurally | [pcg.md](pcg.md) |
| Write editor Python, MCP toolsets, in-editor skills | [editor-scripting.md](editor-scripting.md) |
| Track down a bug, crash, hitch; profile; write a test | [debugging.md](debugging.md) |
| Record the submission video or a cinematic | [cinematics-video.md](cinematics-video.md) |
| Packaging, DDC/Zen, version control background | [production.md](production.md) |

## Finding anything else

[INDEX-docs.md](INDEX-docs.md) maps ~1,265 pages of the 5.8 documentation by section, each tagged
**core** (likely needed in the jam), **useful** or **skip**, with its URL. Search it before web-searching.
