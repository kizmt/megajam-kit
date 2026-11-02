# megajam-kit

A toolkit for building a solo entry to the **2026 Epic AI MegaJam** with Unreal Engine 5.8.4 and Claude Code.

It holds **tools only**: setup steps, agent instructions, pipeline scripts and engine notes. It contains no
gameplay code, levels or game assets.

## How it works

- **One director, one agent session, one team.** The director owns the vision (concept, story, look, whether it
  is fun) and steers at any time; the session works long stretches on its own once it has what it needs, and asks
  the director for the steps only a human can do. A single Claude Code session (Claude Opus 5.5) writes the code, drives the Unreal editor and runs the
  asset pipeline. `CLAUDE.md` holds the standing rules the session follows.
- **Unreal Engine 5.8.4**, C++ gameplay classes with thin Blueprint subclasses, dynamic lighting (full Lumen, Lumen Lite
  or a no-Lumen stylized path, chosen at the style lock), Nanite meshes.
- The session works in the editor through Epic's **Unreal MCP** plugin plus a small kit plugin (`MegajamTools`)
  that adds a few editor tools: running editor Python, importing sounds and files, and console commands.
- **Short rounds with a report after each.** Claude plans, builds, captures screenshots and reports, then carries
  on; it stops only for the director's calls. The look is locked from approved key art before any gameplay is built (`prompts/style-lock.md`).

## AI services used

| Purpose | Service / model | Kit script |
|---|---|---|
| Code, editor work, orchestration | Claude Code (Claude Opus 5.5) | – |
| Concept art and key frames | Google Gemini `gemini-3-pro-image` (OpenAI `gpt-image-2` as fallback) | `gen/image.ts` |
| Image to 3D model, re-texturing, auto-rigging | Tripo (API + CLI; texture model v3.5) | `gen/asset.ts`, `gen/character.ts` |
| Sound effects, music, voice | ElevenLabs (`eleven_text_to_sound_v2`, music, `eleven_multilingual_v2`) | `gen/audio.ts` |
| Text-to-motion animation | Uthana (`text-to-motion-3.0`) | manual for now (see `PIPELINE.md`) |

Non-AI tools: Blender (headless, for model clean-up and texture packing), ffmpeg (audio conversion), Node 24
(the kit's TypeScript runs directly), Git + Git LFS.

## What's in the kit

| Path | What it is |
|---|---|
| `SETUP.md` | Checklist from empty project to ready: plugins, MCP, build loop, packaging, render and performance defaults |
| `CLAUDE.md` | Standing rules for the Claude session: scope, workflow, engine conventions, verification |
| `PIPELINE.md` | How each asset type is produced, with the facts learned while testing the pipeline |
| `docs/design.md` | Game, level and progression design playbook, with playtesting checks |
| `docs/submission.md` | The submission: the rules' must-haves, the itch.io page, the devlog, the last-day order |
| `docs/elevenlabs.md` | Prompting ElevenLabs for sound effects, music and voice; limits, prices and licence |
| `docs/ue/` | Curated notes on UE 5.8 (C++, gameplay, materials, characters, lighting, performance and more) with links to Epic's docs |
| `prompts/concept.md` | Jam-start procedure: concepts scored against the judging categories, cut list, schedule with freeze points |
| `prompts/style-lock.md` | Procedure for agreeing and writing down the game's visual style |
| `prompts/playtest.md` | Brief for a fresh agent reviewing a recorded first-time play |
| `agents/critic.md` | The blind critic subagent (Read only, no CLAUDE.md); SETUP step 5 copies it into the project's `.claude\agents\` |
| `prompts/critic.md` | Brief for a blind critic agent that scores screenshots against references or a rubric |
| `gen/image.ts` | Concept image generation |
| `gen/asset.ts` | One command from a prompt to a prop placed in the level: concept → 3D model → Blender prep → import (Nanite, collision, material) |
| `gen/character.ts` | One command from a concept to a playable character: 3D model → re-texture → rig → PBR maps → import → animation retarget → Blueprint |
| `gen/audio.ts` | Sound effects, music and voice, converted and imported into the editor |
| `gen/blender/` | Headless Blender scripts: size/pivot/texture prep, rig prep, PBR map extraction, ORM packing, previews |
| `gen/vfx/` | VFX building blocks: procedural mask/noise textures, the master VFX material and instances, effect meshes |
| `gen/unreal/` | Editor automation over MCP: master material + material instances, skeletal import checks, retargeting, screenshots, running editor Python |
| `gen/perf/` | Benchmarking of the packaged build: CSV profile summaries and settings comparisons |
| `gen/test/` | Real-input key tests (with approval), scripted `-game` tests (including a route walker), and safe recording of the game window |
| `scripts/` | PowerShell: C++ build (fails on warnings), packaging + itch.io zip, itch.io upload (butler), project Git/LFS setup |
| `unreal/Plugins/MegajamTools` | The kit's small editor plugin (Python tools exposed to Unreal MCP) |

All generated files go into the game project (`<Project>/Generated/`), never into this kit.

## Running it

Requires Windows, UE 5.8.4, Node 24, pnpm, Blender, ffmpeg and the Tripo CLI. Copy `.env.example` to `.env` and add
API keys (`.env` is gitignored). Point `MEGAJAM_PROJECT` at the Unreal project, then follow `SETUP.md`.
Type-check the kit with `pnpm install` then `pnpm typecheck`.

## Maintaining the kit

Only kit-maintenance sessions change the kit (game sessions log suggestions in their project's `KIT_NOTES.md`).
The kit is version-controlled in the kit's private GitHub repo. **Push after every kit commit:** GitHub's
push time is the server-side proof of what existed before the jam (rules 7(h); Epic may ask for the history). Kit
changes made during the jam are allowed but get their own commits, so pre-jam and in-jam work stay distinguishable.
Kit scripts (`gen/**/*.ts`) are strict TypeScript run directly by Node 24 (type stripping: no enums, namespaces or
parameter properties; `import type`; `.ts` in import paths). After changing one, run `pnpm typecheck` (must pass) and
run the script for real. Type external results at the boundary (`callTool<T>`, typed parse functions) only after
seeing the real shape. Keep docs general: a lesson from one prototype goes in as its general principle, not its
specific numbers.
