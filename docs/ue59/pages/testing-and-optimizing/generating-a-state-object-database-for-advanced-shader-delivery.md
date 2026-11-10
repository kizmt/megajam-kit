# Generating a State Object Database for Advanced Shader Delivery

https://dev.epicgames.com/documentation/en-us/unreal-engine/generating-a-state-object-database-for-advanced-shader-delivery?application_version=5.9

> Generate a State Object Database from your cooked build to enable stores to precompile its shaders ahead of time.

[image: Generating a State Object Database for Advanced Shader Delivery]

When a Direct3D 12 (D3D12) game is launched for the first time, the GPU driver compiles shaders into GPU-specific code as the game creates Pipeline State Objects (PSOs). This can cause long first-launch load times and hitches.

**DirectX Advanced Shader Delivery (ASD)** moves this work out of the game; the shaders are compiled ahead of time for each GPU and driver, and the store downloads the results alongside your game.

ASD is built on two file types:

- **A State Object Database (SODB)** (.sodb) is a GPU-independent file that contains the shaders and PSOs of your application. You create it from your cooked build and submit it to the Microsoft Store (Epic Games Store support is planned for early 2027).
- **A Precompiled Shader Database (PSDB)** (.psdb) is the result of compiling an SODB for a specific GPU family and driver. The store creates PSDBs from your SODB and downloads the matching one to the player’s machine.

In Unreal Engine 5.8, the ASD Tool (`ASDTool`) generates an SODB from a cooked Windows build. It is a standalone command-line program and doesn’t need the editor or a running game.

ASD only applies to **Windows D3D12 SM6** (PCD3D_SM6). Ray tracing PSOs are not supported.

ASD works alongside PSO precaching (-> pso-precaching-for-unreal-engine) and bundled PSO caches (-> manually-creating-bundled-pso-caches-in-unreal-engine) and does not replace them. Your bundled PSO cache provides the graphics PSOs that the store precompiles. At runtime, your game still creates PSOs as usual. If a PSO is in the installed PSDB, the driver loads it quickly instead of compiling it. Otherwise, the driver compiles it as usual.

We recommend keeping PSO precaching enabled in builds that use ASD. PSO precaching still creates PSOs ahead of time, which avoids small hitches from loading precompiled shaders from disk, and it covers any PSOs that are missing from the PSDB.

ASD also does not apply to every player. Stores only provide PSDBs for supported GPU families and a limited set of recent drivers. On older GPUs, or on machines with older drivers, your game compiles PSOs at runtime as it would without ASD, so keep your bundled PSO cache and PSO precaching set up.

## Prerequisites

Before you generate an SODB, make sure you have the following.

For all SODBs:

- A project that targets Windows with D3D12 and Shader Model 6 (SM6), cooked with the PCD3D_SM6 shader format.
- Shared shader code enabled, so that the cook writes shader archives (`.ushaderbytecode` files). This is enabled by default. If your project overrides it, make sure `bShareMaterialShaderCode=True` is set in `DefaultGame.ini` under `[/Script/UnrealEd.ProjectPackagingSettings]`.
- An engine built from source. The ASD Tool is not available as a precompiled binary, so you need to build it from the engine source.

If you use `-BundleDir` to include graphics PSOs:

- A PSO cache for the Windows D3D12 SM6 build. The ASD Tool reads both recorded caches (`.rec.upipelinecache`) and cooked stable caches (`.stable.upipelinecache`). For setup and collection steps, see Creating a Bundled PSO Cache (-> manually-creating-bundled-pso-caches-in-unreal-engine).

If you use -ValidatePSOs:

- The D3D12 debug layer, installed through the Windows Graphics Tools optional feature.

## What Goes into the SODB

The ASD Tool reads the cooked shader archives (.ushaderbytecode) of your build and collects shaders from one or both of these sources:

- **All compute shaders** (`-AllCompute`). Collects every SM6 compute shader in the shader archives. This needs no additional data.
- **A PSO cache **(`-BundleDir`). Collects the graphics PSOs and compute PSOs from one or more `.upipelinecache` files, such as the bundled PSO cache of your game.

You can combine both to cover all compute shaders plus the graphics PSOs recorded in your PSO cache. Compute shaders that appear in both sources are only included once. Graphics PSOs are only included through a PSO cache, so the quality of your PSO cache determines how much of the graphics workload is covered.

## Building the ASD Tool

The ASD Tool is a program target in the engine (`Engine/Source/Programs/Windows/ASDTool`). To build it, run the following from your engine root:

 C++

```
Engine\Build\BatchFiles\Build.bat ASDTool Win64 Development
```

Engine\Build\BatchFiles\Build.bat ASDTool Win64 Development

This produces `Engine\Binaries\Win64\ASDTool.exe`.

## Generating the SODB

Run the `generatesodb` command on the output of a cooked Windows build:

 Command Line

```
ASDTool.exe generatesodb -ShaderCodeDir=<dir> -OutputDir=<dir> -Name=<string> -ExeFilename=<string> -Engine=<string> -AllCompute -BundleDir=<dir>
```

ASDTool.exe generatesodb -ShaderCodeDir=<dir> -OutputDir=<dir> -Name=<string> -ExeFilename=<string> -Engine=<string> -AllCompute -BundleDir=<dir>

### Required Arguments

| Argument | Description |
| --- | --- |
| `-ShaderCodeDir=<dir>` | Directory with the cooked `.ushaderbytecode` files of your build. |
| `-OutputDir=<dir>` | Directory where the `.sodb` files are written. |
| `-Name=<string>` | Application name, for example `MyGame`. |
| `-ExeFilename=<string>` | Filename of the game executable, for example `MyGame.exe`. |
| `-Engine=<string>` | Engine name, for example `UnrealEngine5.8`. Use the major and minor engine version only; GPU drivers might not recognize other names. |

`-Name`, `-ExeFilename`, and `-Engine` identify your application in the SODB. GPU drivers can use these values to apply game- and engine-specific optimizations. Make sure `-ExeFilename` matches the executable you ship.

The ASD Tool also stores the engine version and changelist of its own build in the SODB. You don’t need to build the ASD Tool from the same changelist as your game.

You also need at least one collection source:

| Argument | Description |
| --- | --- |
| `-AllCompute` | Collect all compute shaders from the shader archives. |
| `-BundleDir=<dir>` | Directory with .upipelinecache files. Collects graphics and compute PSOs. |

### Optional Arguments

| Argument | Description |
| --- | --- |
| `-Clean` | Delete existing .sodb files in the output directory before generating. |
| `-ValidatePSOs` | Create all collected PSOs on a D3D12 debug device to report detailed errors. |
| `-OneThread` | Disable parallel shader extraction. |

The tool writes a single `default.sodb` file. At the end, the tool prints a summary with the number of compute and graphics PSOs written and failed. If you used `-BundleDir`, the number of graphics PSOs should be greater than 0. If any PSOs failed, see the **Troubleshooting **section at the bottom of this page.

### Example Command

The following generates an SODB with all compute shaders and the PSOs from the bundled PSO cache:

 C++

```
ASDTool.exe generatesodb -ShaderCodeDir=D:\MyGame\Saved\Cooked\Windows\MyGame\Content -BundleDir=D:\MyGame\Saved\Cooked\Windows\MyGame\Content\PipelineCaches\Windows -OutputDir=D:\MyGame\SODB -Name=MyGame -ExeFilename=MyGame.exe -Engine=UnrealEngine5.8 -AllCompute -Clean
```

ASDTool.exe generatesodb -ShaderCodeDir=D:\MyGame\Saved\Cooked\Windows\MyGame\Content -BundleDir=D:\MyGame\Saved\Cooked\Windows\MyGame\Content\PipelineCaches\Windows -OutputDir=D:\MyGame\SODB -Name=MyGame -ExeFilename=MyGame.exe -Engine=UnrealEngine5.8 -AllCompute -Clean

`-BundleDir` reads the `.upipelinecache` files in a single directory. By default, Unreal Engine writes the stable PSO cache to `Content/PipelineCaches/<Platform>` in the cooked output and recorded PSO caches to `Saved/CollectedPSOs`. To include both, copy them into one directory and pass that directory to `-BundleDir`.

You can now submit the resulting SODB to the store, which compiles it into PSDBs for each supported GPU family.

### When to Generate an SODB

The SODB contains the shader code of your build. Generate a new SODB whenever your shaders change. If a new build has no shader changes, you can reuse the existing SODB.

## Testing the SODB Locally

When you publish your game, the store compiles your SODB into PSDBs, and the store client downloads and registers them on the player’s machine. Your game doesn’t need to do anything.

To check that your SODB works before you publish, the ASD Tool has two commands that do the same steps on your development machine. After you run them, the D3D12 runtime picks up the PSDBs when you launch your game, the same way it would on a player’s machine. Both commands require the D3D12 compiler plugins from GPU vendors in `Engine/Binaries/ThirdParty/D3D12CompilerPlugins`.

- `compilepsdbs` compiles an SODB into PSDBs, similar to what the store does. Use it to verify that the generated SODB compiles. Add `-LocalAdapter` to only compile for the GPUs installed in your machine. Command Line ```
ASDTool.exe compilepsdbs -SODBPath=<file_or_dir> -OutputDir=<dir> -Name=<string> -ExeFilename=<string> -Engine=<string> -LocalAdapter
``` ASDTool.exe compilepsdbs -SODBPath= -OutputDir= -Name= -ExeFilename= -Engine= -LocalAdapter
- `registerpsdbs` registers the PSDBs for your local GPU with the D3D12 runtime, for a specific game executable. When you launch that executable, the driver uses the precompiled shaders, just like on a player’s machine after a store download. C++ ```
ASDTool.exe registerpsdbs -PSDBDir=<dir> -SODBPath=<file> -Name=<string> -ExeFilename=<string> -ExePath=<path> -Engine=<string>
``` ASDTool.exe registerpsdbs -PSDBDir= -SODBPath= -Name= -ExeFilename= -ExePath= -Engine=

- `-ExePath` must be the full path to your game executable. The D3D12 runtime uses this path to match the registered PSDBs to your game.
- Use `-ListOnly` to list existing registrations and -Unregister to remove the registration for an executable.
- Use the same `-Name`, `-ExeFilename`, and `-Engine` values for all commands. Run any command with `-Help` to see all its arguments.

### Verifying That the PSDB Is Used

To check that the D3D12 runtime uses the registered PSDBs when you launch your game, you can use a tool that listens to D3D12 Event Tracing for Windows (ETW) events and reports PSDB hit rates, such as D3D12CacheListener.

This tool also helps you find out why the runtime doesn’t use a PSDB. The runtime only uses a PSDB if the values stored in it match the running application, including the application name, version, executable, engine name, and engine version. The tool shows which of these values don’t match.

## Troubleshooting

- **The summary reports failed PSOs:**PSOs can fail to compile for several reasons. To find out why, run `generatesodb` again with `-ValidatePSOs`. The ASD Tool creates the collected PSOs on a D3D12 debug device and reports detailed errors, similar to D3D12 debug validation at runtime. This requires the D3D12 debug layer (see **Prerequisites **near the top of this page).

On this page

- Prerequisites (-> generating-a-state-object-database-for-advanced-shader-delivery)
- What Goes into the SODB (-> generating-a-state-object-database-for-advanced-shader-delivery)
- Building the ASD Tool (-> generating-a-state-object-database-for-advanced-shader-delivery)
- Generating the SODB (-> generating-a-state-object-database-for-advanced-shader-delivery)
- Required Arguments (-> generating-a-state-object-database-for-advanced-shader-delivery)
- Optional Arguments (-> generating-a-state-object-database-for-advanced-shader-delivery)
- Example Command (-> generating-a-state-object-database-for-advanced-shader-delivery)
- When to Generate an SODB (-> generating-a-state-object-database-for-advanced-shader-delivery)
- Testing the SODB Locally (-> generating-a-state-object-database-for-advanced-shader-delivery)
- Verifying That the PSDB Is Used (-> generating-a-state-object-database-for-advanced-shader-delivery)
- Troubleshooting (-> generating-a-state-object-database-for-advanced-shader-delivery)

Related documents

PSO Caches

 [image: PSO Caches] (-> optimizing-rendering-with-pso-caches-in-unreal-engine)Creating a Bundled PSO Cache

 [image: Creating a Bundled PSO Cache] (-> manually-creating-bundled-pso-caches-in-unreal-engine)
