# UE 5.9 Preview 1: known issues and workarounds (unofficial, a last resort)

**Do not read this file whole, and never load it into a session's standing context.** Search it only when a 5.9
error has resisted the normal steps (the log, the headers, `docs/ue/debugging.md`):

    rg -i -A3 "<a word from the error or the feature>" docs/ue59/known-issues.md

Each issue is one block: `ISSUE [area] ids: text`, then `FIX: workaround`. A hit costs about 60 tokens.

- **Source:** a post by an Epic support staffer under the 5.9 MegaJam Preview announcement
  (https://forums.unrealengine.com/t/unreal-engine-5-9-megajam-preview/2852840), copied 2026-11-11. **Not officially
  confirmed**: treat a match as a lead to test, not as fact.
- **It goes stale fast.** Epic planned a fix build (QFE) within days of the post, so an issue here may already be
  patched: check the engine's build (`<Engine>\Engine\Build\Build.version`) and the forum thread before spending
  time on a workaround.
- Most entries are about the web (Wasm) target, which this kit doesn't use (`CLAUDE.md` "Jam compliance"). They are
  kept so that a search finds them if that ever changes.

ISSUE [web, mac, linux] no id: The premade builds on Mac and Linux are missing part of the Wasm (Web) support files.
FIX: Use a source build on Mac/Linux to target the Wasm platform. A Quick Fix Engineering (QFE) build is currently planned to release this week.

ISSUE [web] UE-412003: Save games/settings lost on reload (Launcher-built C++ web games)
FIX: Append -project=../../..//.uproject to Page Args, preserving existing arguments, then repackage. For an already hosted build, append it to index.html’s ue-args tag and regenerate/remove index.html.br.

ISSUE [web] UE-411671: Game crashes above 2 GB Wasm memory.
FIX: Reduce content usage, and follow other workarounds in this page.

ISSUE [web] UE-411514, UE-412029: Mobile devices can crash/freeze during start with forced multithreading due to increased memory usage.
FIX: Keep the default single-threaded mode. With the Launcher engine, use Shipping (which uses much less memory), although it has fewer dev features (like in-game console and most commandline options). A source build can use Test config which could be a useful “middle of the road” solution.

ISSUE [web] UE-412148: iOS: 5.9 Preview 1 web builds work best on iOS 27. On iOS 26’s version of WebKit, threads use a lot more memory than webKit 27.
FIX: On iOS 26: Turn off Project Settings > Platforms > Wasm > Threading and sound > iOS > Audio Thread (single-threaded) (bSingleThreadedAudioThread=False) and package again; or, without repackaging, open the page with ?audiothread=0 (or set the ue-audio-thread meta to 0 in index.html); or try a Shipping build which will use less memory and you may stay in budget while having an audio thread. Sound stays on either way.

ISSUE [web] UE-411884: Phone rotation during loading breaks the image/touch controls.
FIX: Wait about 10 seconds before rotating, or reload.

ISSUE [web] UE-411441: AMD browser GPU crashes on the experimental desktop rendering tier.
FIX: Use the default rendering tiers.

ISSUE [web] UE-411439: On the Mobile Forward tier (the one phones use), metallic and glossy surfaces near a Reflection Capture can render black.
FIX: Turn on Project Settings > Rendering > Mobile > Clustered reflections (When using ForwardShading), restart the editor, and cook again. The Mobile Deferred tier isn’t affected.

ISSUE [web] no id: Android phones and iPhones older than iPhone 15 Pro have no BC/DXT texture support. A build cooked with BC textures only stops at a compatibility card on those phones.
FIX: Cook with ASTC textures (-cookflavor=ASTC plus -WasmAddTextureSet) for iPhone testing. Recommended: You can use the web-texture-sets LLM skill to help make a dual-texture build.

ISSUE [web] UE-411710: Mobile: starting a second Lyra match after returning to the front end can crash the tab due to memory usage.
FIX: Reload the page between matches.

ISSUE [web] UE-411672: Bink video isn’t supported on the web, and calling Bink Media Player Blueprint functions in a web build is expected to crash
FIX: Skip Bink calls on Wasm, for example behind a Get Platform Name check.

ISSUE [web, packaging, hosting] no id: itch.io rejects oversized browser games: 500 MB total, 200 MB per file. Lyra and Development builds exceed these limits.
FIX: Use Shipping and reduce content; otherwise request higher limits, use another host, or provide a downloadable build. You can also try removing .br files if there is a non-.br version of the file- they are optional files used just to improve initial download speed.

ISSUE [web, packaging, hosting] UE-412027: Projects created with new_template_project.py --web-ready can’t join a server, through the WebSocket relay or otherwise: the web build has no IpNetDriver.
FIX: In the project’s .uproject, remove “Wasm” from the PlatformDenyList of OnlineSubsystemUtils and OnlineSubsystemNull, then package again from the start (build, cook and stage). Projects created without --web-ready aren’t affected.

ISSUE [web, packaging, hosting] UE-411774: Launcher builds fail with WebMinimal/DesktopMinimal trim profiles.
FIX: Remove ApplyTrimProfile; configure plugins in the .uproject and use supported per-target size options.

ISSUE [web, packaging, hosting] UE-411525: Incremental packaging can ship stale content with -NoCleanStage.
FIX: Remove the switch or clean the staging folder after content changes.

ISSUE [web, packaging, hosting] UE-411308, UE-411939: Opening the packaged index.html from disk (file://) shows a cross-origin isolation error or a hosting card instead of starting the game.
FIX: Start the game with Play_.bat in the packaged folder, or serve the stage with python serve.py --root Wasm --port 8800.

ISSUE [web, packaging, hosting] UE-411973: After an interrupted download, every reload in that browser session downloads the game again (45-49 s instead of about 3 s).
FIX: Restart the browser.

ISSUE [web, packaging, hosting] UE-411974: Play_.bat fails from a network share (UNC path) and no server starts.
FIX: Copy the packaged build to a local folder.

ISSUE [web, packaging, hosting] UE-412037: Launcher engine: changing the Wasm SIMD or allocator settings in a Target.cs (bSimd128, bSseEmulation, Malloc) will generate code incompatible with what ships in the Launcher, which could corrupt memory or crash.
FIX: Keep these settings at their defaults with the Launcher engine; change them only with an engine built from source.

ISSUE [editor, scripting] UE-411502: Python Blueprint root swaps can crash the editor.
FIX: Use a C++ base class that owns the required root component instead of swapping Blueprint-added roots.

ISSUE [editor, scripting] UE-410941: Undo after scripted Deformer Graph additions can crash and lose unsaved work.
FIX: Add variables/component bindings through the Deformer Graph editor’s Explorer > Add menu; the manual path supports Undo/Redo.

ISSUE [editor, scripting] UE-411097: Dataflow Add/Remove Option Pin crashes when a comment box is selected.
FIX: Avoidance: deselect comment boxes and select only the relevant Dataflow node before changing pins.

ISSUE [mcp, agents] UE-412135: New projects give AI agents no tools to edit the level: the Unreal MCP server is on by default, but the Toolset plugins (AllToolsets, EditorToolset, BlueprintToolsets, ConsoleToolset, LiveCodingToolset) are off, so list_toolsets offers no actor, level, asset, Blueprint or Python tools, and nothing tells the agent why.
FIX: Before connecting the agent, enable All Toolsets in Edit > Plugins, or add { “Name”: “AllToolsets”, “Enabled”: true, “TargetAllowList”: [ “Editor” ] } to the .uproject, then restart the editor and reconnect your agent. Do this once per project.
