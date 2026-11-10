---
name: megajam-editor-scripting
description: The megajam-kit's rules for editor Python and scripted asset or level edits through Unreal MCP (saving, deleting, PIE, Blueprint defaults, World Partition). Load before writing or running any editor script in this project.
---

Rules from the megajam-kit, each learned from a failure in a practice project. Full detail and sources:
`C:\dev\megajam-kit\docs\ue\editor-scripting.md` (the start of the file, then section A).

CALLS
- Tool calls run one at a time on the game thread. Send the next call after the previous one returns.
- Many tools report failure in the result, not as an error: read the result, then read back what you changed.
- Many edits (a widget tree, dozens of material instances, a level layout): write one Python script, keep it in the
  project's Tools\ folder, and run it in one call. Use single tool calls for inspection, screenshots and compile errors.
- Running Python: MegajamTools.run_python(code) returns OK or ERROR, everything the script printed and the
  traceback. Epic's PythonScriptingTools.execute_python (5.9) returns the script's final expression instead, sends
  print output to the Output Log, accepts imports only at the top of the script and no star imports, and lets the
  script call other tools with await call_tool(name, **arguments). Use execute_python when a script must call other
  tools; otherwise run_python, whose output the kit's scripts read.
- Long work (Live Coding builds, big scripts, asset scans): split it into calls under about 2 minutes.

SAVING
- A scripted edit is saved only when the file on disk changed. Many Python edits don't mark the asset dirty, so a
  normal save skips them and the edit is lost on restart. Save each edited asset with
  unreal.EditorAssetLibrary.save_loaded_asset(asset, only_if_is_dirty=False), then check the .uasset changed on
  disk (git status). Reading it back in the same editor proves nothing.
- World Partition actors: call actor.modify() before the change, then save each actor's own package
  (EditorLoadingAndSavingUtils.save_packages([a.get_package() for a in moved], False)).
- Save before and after bulk changes: scripted edits are not always undoable, and imports never are.

THINGS THAT FREEZE THE EDITOR (a modal dialog blocks the game thread and every MCP call)
- Deleting an asset something references, then creating one with the same name ("Overwrite Existing Object").
  Check get_referencers first and refuse instead; reuse shared assets.
- EditorLoadingAndSavingUtils.reload_packages on a dirty asset. To undo a preview, set the old values back.
- Saving a package that a running -game test has loaded (it locks the file). Stop the test before saving.

CORRECTNESS
- Assert every load_asset: it returns None for a wrong path and many setters then do nothing, silently.
- Blueprint defaults: set them on get_default_object(bp.generated_class()), then
  BlueprintEditorLibrary.compile_blueprint(bp), then save, and only then place or spawn instances.
- Not during Play-In-Editor: asset creation, duplication and saves fail with only a log line. If
  UnrealEditorSubsystem.get_game_world() is not None, someone is playing: wait, never stop their session.
- Open or create a map in its own call. Never duplicate a map and load the copy in the same call (editor crash).
- Move, rename and delete assets only with EditorAssetLibrary or AssetTools, never os or shutil on .uasset files.
- 5.9: a Blueprint class is its own Python type (BP_Name_C, a subclass of its native parent). Use isinstance, not
  type(obj) == or the type's name. LevelEditorSubsystem.load_level raises on unsaved changes unless given an
  UnsavedChangesPolicy.
- API names: search the Python stub <Project>\Intermediate\PythonStub\unreal.py (or, on 5.9, the search_symbols and
  grep_stubs tools). Never write unreal.* calls from memory.
