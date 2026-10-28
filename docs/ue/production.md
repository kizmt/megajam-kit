# Production pipeline notes (UE 5.8, from Epic's docs, checked against our setup 2026-10-24)

## Packaging and what gets shipped

- Only content that the packaged levels reference (plus Primary Assets / always-cook rules) is cooked.
  Generated props that sit in /Game but are never placed or referenced do not ship.
- Before the final build: Project Settings > Game > Asset Manager > **Directories to Exclude** for test folders,
  and consider **Only Cook Production Assets** (DevelopmentCook assets then error the cook instead of shipping).
- We ship a **Development** build (`scripts/package.ps1`; the reasons are in `cpp.md` "Build configurations"). Close the
  editor first.
- Use the Asset Manager audit tools to see what's taking disk/memory before cutting content.

## Derived Data Cache / Zen

- UE 5.4+ stores the local DDC in Zen: `C:\ProgramData\Epic\Zen\Data` (Windows). It holds compiled shaders and
  other derived data; disposable, rebuilt from .uasset files; never goes in Git.
- Move it with the `UE-LocalDataCachePath` env var (restart editor) if C: runs short. Not needed on the target PC now.
- The "Failed reading oplog from Zen at [::1]:8558" burst seen in our packaging test recovered by itself.
  If a packaged build is missing content, suspect Zen first and re-run the package.

## C++ build tools

- UBT builds; it runs UHT (reflection code generation) first, then the compiler. Never run UHT by hand.
- **UHT runs with warnings-as-errors**: any UHT warning fails the build. Write reflection macros exactly.
- A header whose only reflected content is `DECLARE_DYNAMIC_*` delegates is skipped unless one delegate has `UDELEGATE`.
- Reflection rules (UCLASS/USTRUCT/UENUM/UPROPERTY/UFUNCTION, GENERATED_BODY, `.generated.h` as the last include):
  `cpp.md` and the Reflection System docs.

## Editor scripting

- Use the editor subsystems (`EditorActorSubsystem`, `LevelEditorSubsystem`, `EditorAssetSubsystem`...) for
  automation. The Editor Scripting Utilities plugin is Beta and off by default, and its `EditorLevelLibrary` /
  mesh libraries are deprecated in favour of the subsystems (`EditorAssetLibrary` is still fine; `editor-scripting.md`
  A). MegajamTools does not depend on it (its plugins: PythonScriptPlugin, ToolsetRegistry,
  EditorToolset).
- Python editor scripting and Unreal MCP are Beta/Experimental (`features.md`); every pipeline step is therefore
  verified by reading back state or a screenshot.

## Version control

- Epic's docs cover Perforce, SVN, Anchorpoint, Diversion and Epic's new Lore, not Git. Our Git + LFS setup
  (`scripts/init-repo.ps1`) is our own and tested. Binary assets (.uasset/.umap) can't be merged: one writer at a time
  (only one session edits the editor anyway).

## Build stamp (game side)

`scripts/package.ps1` writes `<Build>\<Project>\BuildStamp.txt` (`<Build>` as in `debugging.md`) (`<short commit>[+dirty] <time>`). In the game,
read `FPaths::ProjectDir() / "BuildStamp.txt"` once into a static `FString` (fallback `"editor"` when missing, i.e. PIE),
log it from the game mode's `InitGame`, and draw it small in a HUD corner. When someone reports a bug, the stamp says
which build they played (a stale unzipped copy fooled a prototype test).

## Known engine warnings (5.8.4)

- `Character.h:798` raises C4996 (`APawn::GetMovementBase` deprecated) in every `ACharacter` subclass. Engine noise;
  `scripts/build.ps1` already treats it as not ours.

## Unsigned builds and Windows Smart App Control

- On the dev PC, SAC blocks freshly compiled editor DLLs at random ("Bad Image ... 0xc0e90002", then "The game module
  could not be loaded"; log `GetLastError=4551`; Event Viewer CodeIntegrity 3033/3077). Keep SAC off (`SETUP.md`).
- For players: SAC checks every executable, zip-extracted ones too, with no per-file "Run anyway"; the only fix is
  turning SAC off machine-wide. New Windows 11 installs start in evaluation mode and many switch it off, so expect a
  minority of players. Only the two `<Game>.exe` files are unsigned; staged third-party DLLs are already signed.
- Mitigations: **Microsoft Artifact Signing** (~$10/month; identity check 1-20 business days; individuals must be in
  the US or Canada, organisations qualify in more countries), an **OV certificate** (~$120-220/yr, key on a hardware
  token or cloud HSM), or no signing plus a note on the game page (`SETUP.md` section 9). Self-signing doesn't help.
  Sign after packaging (any later change breaks the signature) and check with `Get-AuthenticodeSignature`.

## Final pass (last half-day, on the packaged zip)

Freeze features first: from here, only fixes. Each check is done on the build that will ship, unzipped to a fresh
folder, never on PIE.

- **Full play-through twice**, start to credits, with real input (keyboard and mouse, plus gamepad if the page claims
  it). Restart, quit and every menu path work; Esc always has a way out; the game never soft-locks.
- **No debug left on screen:** print strings, on-screen debug messages, debug draws, `stat` overlays, cheat keys,
  test levels in the level list. The build stamp is the only debug text.
- **Starts right:** opens in the intended window mode at the monitor's native resolution, mouse captured, first
  gameplay within seconds; a missing save or settings file doesn't break the first launch.
- **Performance:** `gen/perf/bench.ts --target-fps <target>` on this build meets `performance.md` "The bar", including
  the Low-preset check and a settings menu that changes quality, resolution scale and frame cap; one look at the
  worst spot in the level.
- **Audio:** nothing clips, music and effects balanced, no sound missing on key actions, volume sensible at launch.
- **Compliance:** credits list every sourced asset (`SOURCED_ASSETS.md`); no trademarks or real brands; content fits a
  Teen rating; all text in English.
- **Package:** zip named `TeamName_GameName.zip`, under 1 GB (`scripts/package.ps1` checks), no `Saved/` inside (`scripts/upload.ps1` checks), build
  stamp matches the final commit with no `+dirty`.
- **Submission:** video passes its checklist (`cinematics-video.md`), devlog complete, game page notes the unsigned exe.

## Sources (5.8)

- Naming: https://dev.epicgames.com/documentation/en-us/unreal-engine/recommended-asset-naming-conventions-in-unreal-engine-projects?application_version=5.8
- Asset management: https://dev.epicgames.com/documentation/en-us/unreal-engine/asset-management-in-unreal-engine?application_version=5.8
- DDC: https://dev.epicgames.com/documentation/en-us/unreal-engine/using-derived-data-cache-in-unreal-engine?application_version=5.8
- Zen: https://dev.epicgames.com/documentation/en-us/unreal-engine/zen-storage-server-for-unreal-engine?application_version=5.8
- Scripting: https://dev.epicgames.com/documentation/en-us/unreal-engine/scripting-and-automating-the-unreal-editor?application_version=5.8
- Version control: https://dev.epicgames.com/documentation/en-us/unreal-engine/collaboration-and-version-control-in-unreal-engine?application_version=5.8
- Build pipeline: https://dev.epicgames.com/documentation/en-us/unreal-engine/using-the-unreal-engine-build-pipeline?application_version=5.8
  (UBT: unreal-build-tool-in-unreal-engine, UHT: unreal-header-tool-for-unreal-engine, UAT: unreal-automation-tool-for-unreal-engine)

