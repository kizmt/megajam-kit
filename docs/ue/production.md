# Production pipeline notes (UE 5.8, from Epic's docs, checked against our setup 2026-10-24)

## Packaging and what gets shipped

- Only content that the packaged levels reference (plus Primary Assets / always-cook rules) is cooked.
  Generated props that sit in /Game but are never placed or referenced do not ship.
- Before the final build: Project Settings > Game > Asset Manager > **Directories to Exclude** for test folders,
  and consider **Only Cook Production Assets** (DevelopmentCook assets then error the cook instead of shipping).
- itch submission asks for a **Development** build (our `scripts/package.ps1` default). Close the editor first.
- Use the Asset Manager audit tools to see what's taking disk/memory before cutting content.

## Derived Data Cache / Zen

- UE 5.4+ stores the local DDC in Zen: `C:\ProgramData\Epic\Zen\Data` (Windows). It holds compiled shaders and
  other derived data; disposable, rebuilt from .uasset files; never goes in Git.
- Move it with the `UE-LocalDataCachePath` env var (restart editor) if C: runs short. Not needed on GIZMO now.
- The "Failed reading oplog from Zen at [::1]:8558" burst seen in our packaging test recovered by itself.
  If a packaged build is missing content, suspect Zen first and re-run the package.

## C++ build tools

- UBT builds; it runs UHT (reflection code generation) first, then the compiler. Never run UHT by hand.
- **UHT runs with warnings-as-errors**: any UHT warning fails the build. Write reflection macros exactly.
- A header whose only reflected content is `DECLARE_DYNAMIC_*` delegates is skipped unless one delegate has `UDELEGATE`.
- Hot Reload fails if generated code changed; our rule stands: new UPROPERTY/UFUNCTION/UCLASS = close editor, full build.
- Reflection rules (UCLASS/USTRUCT/UENUM/UPROPERTY/UFUNCTION, GENERATED_BODY, `.generated.h` as the last include):
  see the Reflection System docs; to be distilled into `docs/ue/cpp.md`.

## Editor scripting

- Epic recommends the Editor Scripting Utilities plugin for any editor automation (enabled; our MegajamTools uses it).
- Python editor scripting is itself marked **Experimental** in 5.8, as are Unreal MCP and the toolsets. We depend on them
  deliberately; that is why every pipeline step is verified by reading back state or a screenshot.

## Version control

- Epic's docs cover Perforce, SVN, Anchorpoint, Diversion and Epic's new Lore, not Git. Our Git + LFS setup
  (`scripts/init-repo.ps1`) is our own and tested. Binary assets (.uasset/.umap) can't be merged: one writer at a time
  (only one session edits the editor anyway).

## Sources (5.8)

- Naming: https://dev.epicgames.com/documentation/en-us/unreal-engine/recommended-asset-naming-conventions-in-unreal-engine-projects?application_version=5.8
- Asset management: https://dev.epicgames.com/documentation/en-us/unreal-engine/asset-management-in-unreal-engine?application_version=5.8
- DDC: https://dev.epicgames.com/documentation/en-us/unreal-engine/using-derived-data-cache-in-unreal-engine?application_version=5.8
- Zen: https://dev.epicgames.com/documentation/en-us/unreal-engine/zen-storage-server-for-unreal-engine?application_version=5.8
- Scripting: https://dev.epicgames.com/documentation/en-us/unreal-engine/scripting-and-automating-the-unreal-editor?application_version=5.8
- Version control: https://dev.epicgames.com/documentation/en-us/unreal-engine/collaboration-and-version-control-in-unreal-engine?application_version=5.8
- Build pipeline: https://dev.epicgames.com/documentation/en-us/unreal-engine/using-the-unreal-engine-build-pipeline?application_version=5.8
  (UBT: unreal-build-tool-in-unreal-engine, UHT: unreal-header-tool-for-unreal-engine, UAT: unreal-automation-tool-for-unreal-engine)

## Next level down (knowledge-base session)

Reflection System; BuildCookRun reference and build configurations; Cooking and Chunking; Target.cs reference.
