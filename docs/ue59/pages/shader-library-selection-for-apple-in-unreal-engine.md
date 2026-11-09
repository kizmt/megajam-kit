# Shader Library Selection for Apple

https://dev.epicgames.com/documentation/en-us/unreal-engine/shader-library-selection-for-apple-in-unreal-engine?application_version=5.9

> How to switch between the generic UE shader library and the Apple native shader library.

## Introduction

On Apple platforms, the default behavior is now to use UE's `FMetalIoStoreShaderCodeArchive` for shader storage instead of the `FMetalShaderLibrary` native Metal shader library, bringing UE shader functionality for Apple platforms in line with other platforms.

This includes the following changes:

- **Storage**: `.pak` → `.ucas` (IoStore container).

- **Metallibs**: Previously, fat metallibs (up to 10k shaders each) were built at cook time. Now, only one metallib is built per shader, generated at packaging and grouped into compressed shader groups.

- **Pak chunk rules**: Pak chunk rules now apply; `bGenerateChunks=True + r.ShaderCodeLibrary.PakChunkOverride=1` correctly assigns shaders to pak chunks (this was previously ignored).

- **Shader group compression**: >2:1 ratio.

- **Memory mapping**: You can optionally enable memory mapping (mmap) on iOS when compression is disabled.

### Functionality Comparison

| Feature | Native (old default) | Native MMap* | Generic Compressed (new default) | Generic MMap* |
| --- | --- | --- | --- | --- |
| **System memory** | Baseline | Reduced | Baseline | Reduced |
| **Disk usage** | Baseline | Baseline | Reduced (>2×) | Baseline |
| **IAD ******support | ❌ | ❌ | ✅ | ✅ |
| **Pak chunk rules** | ❌ | ❌ | ✅ | ✅ |

* iOS-only, requires shader group compression disabled.

### Development Impact

At a high level, these changes affect development for Apple platform in the following ways:

- Builds are smaller due to >2:1 shader compression.

- Chunking now works for shaders.

- Individual asset download (IAD) is now functional.

## Configuration

You can configure which shader library to use by setting it in your `.ini` file.

### Default

The `bSharedMaterialNativeLibraries` command controls which backend is used. It now defaults to `false` (previously, the default was `true`).

- `true`: Uses the old `FMetalShaderLibrary` path (the native Metal shader library, `.pak` storage, no IAD, no pak chunk rules).

- `false`: Uses the new `FMetalIoStoreShaderCodeArchive` path (`.ucas` storage, compression, IAD, pak chunk rules).

You don't need to take action unless your project is explicitly setting the value to `true` — in this case, review whether you still want to keep that setting.

### INI Settings

You can find both `bSharedMaterialNativeLibraries` and the shader group compression filter under `[/Script/UnrealEd.ProjectPackagingSettings]` in your platform-specific game config file (for example, `IOSGame.ini`, `TVOSGame.ini`).

#### Granular Compression Options

If you want to disable compression for use with mmap on iOS, you can optionally keep it on for specific pak chunks using `FilteredShaderGroupCompressionContainers`:

```config
[/Script/UnrealEd.ProjectPackagingSettings]
bSharedMaterialNativeLibraries=false
bFilterShaderGroupCompression=true
; Optional: keep compression on for these chunks (omit to disable everywhere)
+FilteredShaderGroupCompressionContainers=pakchunk30
+FilteredShaderGroupCompressionContainers=pakchunk31
```

#### Enable Memory Mapping (iOS)

The mmap functionality for iOS requires you to also disable compression. Add the following to `{Game}.Target.cs`:

```c_sharp
if (Target.Platform == UnrealTargetPlatform.IOS)
{
    GlobalDefinitions.Add("USE_MMAPPED_SHADERARCHIVE=1");
}
```
