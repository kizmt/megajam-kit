import contextlib
import io
import os
import traceback

import unreal

import toolset_registry
from toolset_registry.registration import Registration
from editor_toolset.toolsets.asset import import_asset


def _delete_if_exists(folder_path: str, asset_name: str) -> None:
    path = f"{folder_path}/{asset_name}"
    if unreal.EditorAssetLibrary.does_asset_exist(path):
        unreal.EditorAssetLibrary.delete_asset(path)


@unreal.uclass()
class MegajamTools(unreal.ToolsetDefinition):
    """Extra tools for the megajam-kit pipeline: importing sounds and other files
    that the built-in toolsets cannot import, and running editor console commands."""

    @toolset_registry.tool_call
    @staticmethod
    def import_sound(folder_path: str, asset_name: str, source_file: str,
                     looping: bool = False, replace: bool = True) -> unreal.SoundWave:
        """Imports a WAV (or other supported audio file) from disk as a SoundWave asset.

        Args:
            folder_path: Content folder to import into, e.g. '/Game/Audio/SFX'.
            asset_name: Name of the new SoundWave asset, e.g. 'SFX_ChestOpen'.
            source_file: Absolute path to the audio file on disk.
            looping: When True, the sound loops when played (ambience, music).
            replace: When True, an existing asset with the same name is deleted first.

        Returns:
            The imported SoundWave asset.
        """
        if replace:
            _delete_if_exists(folder_path, asset_name)
        assets = import_asset(folder_path, asset_name, os.path.normpath(source_file))
        sound = next((a for a in assets if isinstance(a, unreal.SoundWave)), None)
        if sound is None:
            raise RuntimeError(f"import_sound: no SoundWave produced from {source_file}")
        sound.set_editor_property("looping", looping)
        unreal.EditorAssetLibrary.save_loaded_asset(sound)
        return sound

    @toolset_registry.tool_call
    @staticmethod
    def import_any(folder_path: str, asset_name: str, source_file: str,
                   replace: bool = True) -> list[unreal.Object]:
        """Imports any file type Unreal can import (images, audio, meshes, CSV, ...) using
        the engine's default importer for that extension.

        Args:
            folder_path: Content folder to import into.
            asset_name: Name of the new asset.
            source_file: Absolute path to the file on disk.
            replace: When True, an existing asset with the same name is deleted first.

        Returns:
            Every asset produced by the import.
        """
        if replace:
            _delete_if_exists(folder_path, asset_name)
        return import_asset(folder_path, asset_name, os.path.normpath(source_file))

    @toolset_registry.tool_call
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

    @toolset_registry.tool_call
    @staticmethod
    def run_python(code: str) -> str:
        """Runs a Python script in the editor and returns its printed output. Use for one-off
        editor automation no other tool covers. Prefer dedicated tools when one exists.

        Args:
            code: Python source to execute (multiple statements allowed; 'import unreal' as needed).

        Returns:
            'OK' or 'ERROR', followed by everything the script printed or logged, and the
            exception trace on failure.
        """
        buffer = io.StringIO()
        scope = {"__name__": "__megajam_run_python__", "unreal": unreal}
        status = "OK"
        with contextlib.redirect_stdout(buffer), contextlib.redirect_stderr(buffer):
            try:
                exec(compile(code, "<run_python>", "exec"), scope)
            except Exception:
                status = "ERROR"
                traceback.print_exc(file=buffer)
        return f"{status}\n{buffer.getvalue()}".rstrip()

    @toolset_registry.tool_call
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
