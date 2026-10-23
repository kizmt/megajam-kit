# megajam-kit

A toolkit for building a solo entry to the **2026 Epic AI MegaJam** with Unreal Engine 5.8.4 and Claude Code.

It holds **tools only**: setup steps, agent instructions, pipeline scripts and engine notes. It contains no
gameplay code, levels or game assets.

## How it works

- **One developer, one agent session.** The developer sets the concept, art direction and feel, and signs off on
  each round. A single Claude Code session (Claude Opus 5.5) writes the code, drives the Unreal editor and runs the
  asset pipeline. `CLAUDE.md` holds the standing rules the session follows.
- **Unreal Engine 5.8.4**, C++ gameplay classes with thin Blueprint subclasses, Lumen lighting, Nanite meshes.
- The session works in the editor through Epic's **Unreal MCP** plugin plus a small kit plugin (`MegajamTools`)
  that adds a few editor tools: running editor Python, importing sounds and files, and console commands.
- **Short rounds with a review after each.** Claude plans, builds and captures screenshots, then stops for
  the developer's review. The look is locked from approved key art before any gameplay is built (`prompts/style-lock.md`).

## AI services used

| Purpose | Service / model | Kit script |
|---|---|---|
| Code, editor work, orchestration | Claude Code (Claude Opus 5.5) | – |
| Concept art and key frames | Google Gemini `gemini-3-pro-image` (OpenAI `gpt-image-2` as fallback) | `gen/image.ts` |
| Image to 3D model, re-texturing, auto-rigging | Tripo (API + CLI; texture model v3.5) | `gen/asset.ts`, `gen/character.ts` |
| Sound effects, music, voice | ElevenLabs (`eleven_text_to_sound_v2`, music, `eleven_multilingual_v2`) | `gen/audio.ts` |

Non-AI tools: Blender (headless, for model clean-up and texture packing), ffmpeg (audio conversion), Node 24
(the kit's TypeScript runs directly), Git + Git LFS.

## What's in the kit

| Path | What it is |
|---|---|
| `SETUP.md` | Checklist from empty project to ready: plugins, MCP, build loop, packaging, render and performance defaults |
| `CLAUDE.md` | Standing rules for the Claude session: scope, workflow, engine conventions, verification |
| `PIPELINE.md` | How each asset type is produced, with the facts learned while testing the pipeline |
| `docs/ue/` | Curated notes on UE 5.8 (C++, gameplay, materials, characters, lighting, performance and more) with links to Epic's docs |
| `prompts/style-lock.md` | Procedure for agreeing and writing down the game's visual style |
| `gen/image.ts` | Concept image generation |
| `gen/asset.ts` | One command from a prompt to a prop placed in the level: concept → 3D model → Blender prep → import (Nanite, collision, material) |
| `gen/character.ts` | One command from a concept to a playable character: 3D model → re-texture → rig → PBR maps → import → animation retarget → Blueprint |
| `gen/audio.ts` | Sound effects, music and voice, converted and imported into the editor |
| `gen/blender/` | Headless Blender scripts: size/pivot/texture prep, rig prep, PBR map extraction, ORM packing, previews |
| `gen/unreal/` | Editor automation over MCP: master material + material instances, skeletal import checks, retargeting, screenshots, running editor Python |
| `gen/perf/` | Benchmarking of the packaged build: CSV profile summaries and settings comparisons |
| `scripts/` | PowerShell: C++ build (fails on warnings), packaging + itch.io zip, project Git/LFS setup |
| `unreal/Plugins/MegajamTools` | The kit's small editor plugin (Python tools exposed to Unreal MCP) |

All generated files go into the game project (`<Project>/Generated/`), never into this kit.

## Running it

Requires Windows, UE 5.8.4, Node 24, pnpm, Blender, ffmpeg and the Tripo CLI. Copy `.env.example` to `.env` and add
API keys (`.env` is gitignored). Point `MEGAJAM_PROJECT` at the Unreal project, then follow `SETUP.md`.
Type-check the kit with `pnpm install` then `pnpm typecheck`.
