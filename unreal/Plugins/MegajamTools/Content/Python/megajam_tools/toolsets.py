import contextlib
import io
import os
import traceback

import unreal

import toolset_registry
from toolset_registry.registration import Registration

# Epic's import helper (verified on 5.8.4). UE 5.9 dropped Epic's Python editor toolsets (a 5.9 run found
# editor_toolset.toolsets.asset.AssetTools unregistered), so where the module is missing the import runs as a plain
# automated AssetImportTask, the route the 5.9 run verified for FBX, PNG and the re-import below.
try:
    from editor_toolset.toolsets.asset import import_asset
except ImportError:
    def import_asset(folder_path: str, asset_name: str, source_file: str) -> list:
        task = unreal.AssetImportTask()
        task.set_editor_property("filename", source_file)
        task.set_editor_property("destination_path", folder_path)
        task.set_editor_property("destination_name", asset_name)
        task.set_editor_property("replace_existing", True)
        task.set_editor_property("automated", True)
        task.set_editor_property("save", False)
        unreal.AssetToolsHelpers.get_asset_tools().import_asset_tasks([task])
        assets = [unreal.EditorAssetLibrary.load_asset(p) for p in task.get_editor_property("imported_object_paths")]
        if not assets:
            raise RuntimeError(f"import of {source_file} into {folder_path}/{asset_name} produced nothing")
        return assets

from megajam_tools.refs import referencers_outside


def _tool(mode: str):
    """The tool decorator with an access mode where the engine takes one. 5.9 documents
    tool_call(mode=unreal.ToolAccessMode.READ|WRITE|EXECUTE) on every tool (sent to clients as readOnlyHint; the
    default is Execute); the kit's 5.8.4 tools used the bare decorator, so fall back to it if mode isn't accepted."""
    try:
        return toolset_registry.tool_call(mode=getattr(unreal.ToolAccessMode, mode))
    except (AttributeError, TypeError):
        return toolset_registry.tool_call


def _delete_if_exists(folder_path: str, asset_name: str) -> bool:
    """Delete the asset if nothing else references it. Returns False (and deletes nothing) when it is referenced:
    deleting a referenced asset opens a modal dialog that stalls the editor, so the caller re-imports over it."""
    path = f"{folder_path}/{asset_name}"
    if not unreal.EditorAssetLibrary.does_asset_exist(path):
        return True
    if referencers_outside([path]):
        return False
    if not unreal.EditorAssetLibrary.delete_asset(path):
        raise RuntimeError(f"delete failed: {path}")
    return True


_MESH_EXT = (".fbx", ".obj", ".gltf", ".glb", ".usd", ".usda", ".usdc", ".usdz", ".abc")


def _import_over(folder_path: str, asset_name: str, source_file: str) -> list:
    """Re-import onto an existing, referenced asset in place (no dialog; references keep pointing at it).
    Not for meshes: an option-less task can't be trusted to keep a mesh's type and skeleton."""
    path = f"{folder_path}/{asset_name}"
    if source_file.lower().endswith(_MESH_EXT):
        raise RuntimeError(f"{path} is referenced, so it can't be deleted and re-imported; for a mesh use a new name "
                           "or remove the references first")
    task = unreal.AssetImportTask()
    task.set_editor_property("filename", source_file)
    task.set_editor_property("destination_path", folder_path)
    task.set_editor_property("destination_name", asset_name)
    task.set_editor_property("replace_existing", True)
    task.set_editor_property("automated", True)
    task.set_editor_property("save", False)
    unreal.AssetToolsHelpers.get_asset_tools().import_asset_tasks([task])
    assets = [unreal.EditorAssetLibrary.load_asset(p) for p in task.get_editor_property("imported_object_paths")]
    if not assets:
        raise RuntimeError(f"re-import over {path} from {source_file} produced nothing")
    return assets


def _import(folder_path: str, asset_name: str, source_file: str, replace: bool) -> list:
    if replace and not _delete_if_exists(folder_path, asset_name):
        return _import_over(folder_path, asset_name, source_file)
    return import_asset(folder_path, asset_name, source_file)


@unreal.uclass()
class MegajamTools(unreal.ToolsetDefinition):
    """Extra tools for the megajam-kit pipeline: importing sounds and other files
    that the built-in toolsets cannot import, and running editor console commands."""

    @_tool("WRITE")
    @staticmethod
    def import_sound(folder_path: str, asset_name: str, source_file: str,
                     looping: bool = False, replace: bool = True) -> unreal.SoundWave:
        """Imports a WAV (or other supported audio file) from disk as a SoundWave asset.

        Args:
            folder_path: Content folder to import into, e.g. '/Game/Audio/SFX'.
            asset_name: Name of the new SoundWave asset, e.g. 'SFX_ChestOpen'.
            source_file: Absolute path to the audio file on disk.
            looping: When True, the sound loops when played (ambience, music).
            replace: When True, an existing asset with the same name is replaced (deleted first, or
                re-imported in place when something references it).

        Returns:
            The imported SoundWave asset.
        """
        assets = _import(folder_path, asset_name, os.path.normpath(source_file), replace)
        sound = next((a for a in assets if isinstance(a, unreal.SoundWave)), None)
        if sound is None:
            raise RuntimeError(f"import_sound: no SoundWave produced from {source_file}")
        sound.set_editor_property("looping", looping)
        unreal.EditorAssetLibrary.save_loaded_asset(sound)
        return sound

    @_tool("WRITE")
    @staticmethod
    def import_any(folder_path: str, asset_name: str, source_file: str,
                   replace: bool = True) -> list[unreal.Object]:
        """Imports any file type Unreal can import (images, audio, meshes, CSV, ...) using
        the engine's default importer for that extension.

        Args:
            folder_path: Content folder to import into.
            asset_name: Name of the new asset.
            source_file: Absolute path to the file on disk.
            replace: When True, an existing asset with the same name is replaced (deleted first, or
                re-imported in place when something references it).

        Returns:
            Every asset produced by the import.
        """
        return _import(folder_path, asset_name, os.path.normpath(source_file), replace)

    @_tool("EXECUTE")
    @staticmethod
    def run_console_command(command: str) -> bool:
        """Runs an editor console command, e.g. 'Scalability 2' or 'stat unit'.

        Args:
            command: The console command to execute.

        Returns:
            True once the command has been issued.
        """
        world = unreal.get_editor_subsystem(unreal.UnrealEditorSubsystem).get_editor_world()
        unreal.SystemLibrary.execute_console_command(world, command)
        return True

    @_tool("EXECUTE")
    @staticmethod
    def run_python(code: str) -> str:
        """Runs a Python script in the editor and returns its printed output. Use for one-off
        editor automation no other tool covers. Prefer dedicated tools when one exists.

        Args:
            code: Python source to execute (multiple statements allowed; 'import unreal' as needed).

        Returns:
            'OK' or 'ERROR', followed by everything the script printed, and the exception trace
            on failure. A script that calls exit() (SystemExit) also returns 'ERROR'.
        """
        buffer = io.StringIO()
        scope = {"__name__": "__megajam_run_python__", "unreal": unreal}
        status = "OK"
        with contextlib.redirect_stdout(buffer), contextlib.redirect_stderr(buffer):
            try:
                exec(compile(code, "<run_python>", "exec"), scope)
            except (Exception, SystemExit):
                # SystemExit too: a script calling exit() must not unwind into the editor's Python.
                status = "ERROR"
                traceback.print_exc(file=buffer)
        return f"{status}\n{buffer.getvalue()}".rstrip()

    @_tool("READ")
    @staticmethod
    def get_sound_info(sound: unreal.SoundWave) -> str:
        """Returns duration, channel count, sample rate and looping for a SoundWave.

        Args:
            sound: The SoundWave asset to inspect.

        Returns:
            A short description such as 'duration=2.48s channels=2 sample_rate=48000 looping=False'.
        """
        def prop(name, default="?"):
            try:
                return sound.get_editor_property(name)
            except Exception:
                return default
        return (f"duration={prop('duration', 0.0):.2f}s "
                f"channels={prop('num_channels')} "
                f"sample_rate={prop('imported_sample_rate')} "
                f"looping={prop('looping')}")


_registration = Registration([MegajamTools])
