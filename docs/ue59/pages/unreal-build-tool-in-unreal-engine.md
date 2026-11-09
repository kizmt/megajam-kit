# UnrealBuildTool

https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-build-tool-in-unreal-engine?application_version=5.9

> UnrealBuildTool (UBT) manages the process of building Unreal Engine source code across a variety of build configurations.

[image: UnrealBuildTool]

**UnrealBuildTool (UBT)** is a custom tool that manages the process of building **Unreal Engine (UE)** source code across a variety of build configurations. Read `BuildConfiguration.cs` to explore various user-configurable build options.

## Modular Architecture

UE is split into many modules. Each module has a `.build.cs` file that controls how it is built, including options for defining module dependencies, additional libraries, include paths, etc. By default, these modules are compiled into DLLs and loaded by a single executable. You can choose to build a monolithic executable in the `BuildConfiguration.cs` file.

It is important to understand that the build process executes independently of any project files for the development environment, such as `.sln` or `.vcproj` files (for Visual Studio). These files are useful to have for editing purposes though, so there is a tool being provided to generate them dynamically (based on the contents of your project directory tree). You can run this tool with the `GenerateProject.bat` file located in your `[Unreal Engine Root Directory]`.

**Note:** Running `GenerateProject.bat` from time-to-time will keep your code editor up-to-date with files that are being added to (or being removed) from disk.

## Topics

- [image: Targets] TargetsAn overview of UBT Targets, including property descriptions. (-> unreal-engine-build-tool-target-reference)
- [image: Module Properties] Module PropertiesAn overview of Unreal Build Tool Modules, including property descriptions. (-> module-properties-in-unreal-engine)
- [image: Build Configuration] Build ConfigurationConfigure how the engine is built. (-> build-configuration-for-unreal-engine)
- [image: Include What You Use] Include What You UseA brief overview of the code base for Unreal Engine, using an Include-What-You-Use (IWYU) dependency model. (-> include-what-you-use-iwyu-for-unreal-engine-programming)
- [image: Project Files for IDEs] Project Files for IDEsA guide to automatically generate project files for games and modules in the current workspace. (-> how-to-generate-unreal-engine-project-files-for-your-ide)
- [image: Versioning of Binaries] Versioning of BinariesReference for Unreal Engine's BuildID system, which mitigates potential errors that may result from outdated DLL files. (-> how-to-version-binaries-in-unreal-engine)
- [image: Third-Party Libraries] Third-Party LibrariesIntegrating third-party libraries into Unreal Engine (-> integrating-third-party-libraries-into-unreal-engine)
- [image: Static Code Analysis] Static Code AnalysisUnreal Build Tool supports running a variety of static code analyzers. (-> static-code-analysis-in-unreal-engine)
- [image: Use Clang to Build Microsoft Platforms] Use Clang to Build Microsoft PlatformsSpecify Clang options through build configuration, command-line arguments, or engine configuration. (-> use-clang-to-build-microsoft-platforms-in-unreal-engine)

- programming

On this page

- Modular Architecture (-> unreal-build-tool-in-unreal-engine)
- Topics (-> unreal-build-tool-in-unreal-engine)
