# Use Clang to Build Microsoft Platforms

https://dev.epicgames.com/documentation/en-us/unreal-engine/use-clang-to-build-microsoft-platforms-in-unreal-engine?application_version=5.9

> Specify Clang options through build configuration, command-line arguments, or engine configuration.

[image: Use Clang to Build Microsoft Platforms]

**Unreal Engine (UE)** supports using the **Clang** compiler on Windows to build supported Microsoft platforms (-> sharing-and-releasing-projects-for-unreal-engine). You can enable Clang with:

- Build Configuration (-> use-clang-to-build-microsoft-platforms-in-unreal-engine)
- Command-Line Arguments (-> use-clang-to-build-microsoft-platforms-in-unreal-engine)
- Engine Configuration (-> use-clang-to-build-microsoft-platforms-in-unreal-engine)

This page also includes a table of additional options, such as specifying:

- Clang linker
- Clang version
- MSVC version
- Toolchain version

For more information, see the Additional Options (-> use-clang-to-build-microsoft-platforms-in-unreal-engine) section below. As of UE 5.3, the latest supported version of Clang is Clang 16.

## What is Clang

Clang is a front-end compiler that compiles C, C++, Objective-C, and Objective-C++ into machine code. Clang is an alternative to the MSVC (Microsoft Visual C++) compiler.

## Install Clang

You can install Clang through Visual Studio or directly from the LLVM Downloads page.

## Enable Clang

Once you have installed Clang, follow any one of the methods below to enable Clang in your Unreal project.

### Build Configuration

To enable Clang in Build Configuration (-> build-configuration-for-unreal-engine), navigate to an engine `BuildConfiguration.xml` file, and add the following:

 C++

```
<?xml version="1.0" encoding="utf-8" ?>
<Configuration xmlns="https://www.unrealengine.com/BuildConfiguration">
	...
	<WindowsPlatform>
      		<Compiler>Clang</Compiler>
	</WindowsPlatform>
...
</Configuration>
```

<?xml version="1.0" encoding="utf-8" ?>
<Configuration xmlns="https://www.unrealengine.com/BuildConfiguration">
 ...
 <WindowsPlatform>
 <Compiler>Clang</Compiler>
 </WindowsPlatform>
...
</Configuration>

### Command-Line Arguments

To enable Clang with Command-Line Arguments (-> command-line-arguments-in-unreal-engine), pass the `-Compiler=Clang` option.

### Engine Configuration

To enable Clang in Engine Configuration (-> configuration-files-in-unreal-engine), navigate to an engine configuration file, such as `DefaultEngine.ini`, and add the following:

 C++

```
[/Script/WindowsTargetPlatform.WindowsTargetSettings]
Compiler=Clang
```

[/Script/WindowsTargetPlatform.WindowsTargetSettings]
Compiler=Clang

## Additional Options

The following options assume that:

- Build Configuration options are added inside the `...` section of `BuildConfiguration.xml`.
- Engine Configuration options are added to the `[/Script/WindowsTargetPlatform.WindowsTargetSettings]` section of an engine configuration file, such as `DefaultEngine.ini`.

| Option | Build Configuration | Command-Line Argument | Engine Configuration |
| --- | --- | --- | --- |
| Clang linker | `<bAllowClangLinker>true</bAllowClangLinker>` | `-ClangLinker` | `bAllowClangLinker=true` |
| Clang Compiler Version | `<CompilerVersion>Latest</CompilerVersion>` | `-CompilerVersion=Latest` | `CompilerVersion=Latest` |
| MSVC Version | `<Toolchain>VisualStudio2022</VisualStudio>` | `-VCToolchain=VisualStudio2022` | `Toolchain=VisualStudio2022` |
| Toolchain Version | `<ToolchainVersion>Latest</ToolchainVersion>` | `-VCToolchainVersion=Latest` | `ToolchainVersion=Latest` |

### Clang Linker

The Clang Linker is a boolean option that determines whether the Clang Linker is used when compiling with Clang.

### Clang Compiler Version

The Clang compiler version is a string option that determines which version of the specified compiler is used. The options include:

- Specific version number: Use the exact version specified, for example, "16.0.0".
- Latest: Use the newest installed version.

### MSVC Version

The MSVC Toolchain is a string option that determines which toolchain is used. The options include:

- VisualStudio2022

### Toolchain Version

The Toolchain version is a string option that determines which version of the MSVC toolchain is used. The options include:

- Specific version number: Use the exact version specified, for example, "14.37.32822".
- Latest: Use the newest installed version.
- Preview: Use the newest installed preview version.

## More Information

Follow these links for information about:

- Windows Platform section of Build Configuration
- Command-Line Arguments (-> command-line-arguments-in-unreal-engine)
- Engine Configuration Files (-> configuration-files-in-unreal-engine)

- programming
- clang
- microsoft
- toolchain
- linker

On this page

- What is Clang (-> use-clang-to-build-microsoft-platforms-in-unreal-engine)
- Install Clang (-> use-clang-to-build-microsoft-platforms-in-unreal-engine)
- Enable Clang (-> use-clang-to-build-microsoft-platforms-in-unreal-engine)
- Build Configuration (-> use-clang-to-build-microsoft-platforms-in-unreal-engine)
- Command-Line Arguments (-> use-clang-to-build-microsoft-platforms-in-unreal-engine)
- Engine Configuration (-> use-clang-to-build-microsoft-platforms-in-unreal-engine)
- Additional Options (-> use-clang-to-build-microsoft-platforms-in-unreal-engine)
- Clang Linker (-> use-clang-to-build-microsoft-platforms-in-unreal-engine)
- Clang Compiler Version (-> use-clang-to-build-microsoft-platforms-in-unreal-engine)
- MSVC Version (-> use-clang-to-build-microsoft-platforms-in-unreal-engine)
- Toolchain Version (-> use-clang-to-build-microsoft-platforms-in-unreal-engine)
- More Information (-> use-clang-to-build-microsoft-platforms-in-unreal-engine)
