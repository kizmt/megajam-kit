# Asynchronous Level Loading

https://dev.epicgames.com/documentation/en-us/unreal-engine/asynchronous-level-loading-in-unreal-engine?application_version=5.9

> Enable asynchronous loading to improve loading times when opening levels.

Asynchronous (async) loading is experimental. You might encounter race conditions and other issues when using this feature.

To improve loading times when opening levels in the editor, Unreal Engine supports asynchronous (async) loading.

In Unreal Engine by default, loading happens synchronously on a single thread called the game thread. Loading involves deserializing assets, creating UObjects, and applying transformations until the world is loaded and ready to be displayed.

When using async level loading, parts of the loading process are delegated to worker threads that run asynchronously alongside the game thread. The async loading process is also split across multiple CPU cores so that computers with higher core counts can load worlds faster.

For more details on how async loading works in Unreal Engine, and how this feature was implemented, see Mastering Async Loading in Unreal Engine.

## Set up Async Loading

To detect race conditions with the async loading tool, we recommend that your system has between 24 and 32GB of free memory after you have your editor running and your map loaded.

The async loading tool includes an instrumenting compiler and runtime race detection. Follow these steps to set up the tool:

- To activate the compiler, set `bEnableInstrumentation` to `true` in the `BuildConguration.xml` file in the branch you’re working on, then compile your project: XML BuildConfiguration.xml ```
<?xml version="1.0" encoding="utf-8" ?>
<Configuration xmlns="https://www.unrealengine.com/BuildConfiguration">
  <BuildConfiguration>
     <bEnableInstrumentation>true</bEnableInstrumentation>
  </BuildConfiguration>
</Configuration>
``` true
- After you have compiled your project with instrumentation enabled, run the following command line to activate race detection: Command Line ```
-asyncloadingthread -dpcvars=s.DetectRaceDuringLoading=1
``` -asyncloadingthread -dpcvars=s.DetectRaceDuringLoading=1The compiler is Clang based, so you might have to fix some compilation errors if you were only compiling with MSVC before.

This command runs race detection only when async loading is active to improve editor performance. Running an instrumented build when race detection is active is typically 10 to 20 times slower than a normal build. When race detection is not active, the instrumented build slowdown is only 1.5 to 3 times slower.

Running the race detection is not mandatory, but is considered best practice if you have a heavily modified engine or C++ code in your project, as it can detect threading bugs that might be hard to reproduce.

## Enable Async Loading by Default

After you test async loading using the console, you can set your project to use async loading by default by editing your DefaultEngine.ini and adding the following:

 Config

```
[/Script/Engine.EditorStreamingSettings]
s.AsyncLoadingThreadEnabled=True

s.AllowMultithreadedLoading=True
```

[/Script/Engine.EditorStreamingSettings]
s.AsyncLoadingThreadEnabled=True

s.AllowMultithreadedLoading=True

## Async Loading Best Practices

When using async loading, follow these best practices:

- Avoid flushes of the loading pipeline as much as possible. Each flush requires worker threads to synchronize with the game thread, which stops them temporarily from running parallel to the game thread.
- Defer delegate registration to Postload or later during loading.
- Defer global system interactions to Postload or later during loading.
- Avoid UI interactions from functions called by the loader.
- Avoid transaction system interactions from functions called by the loader.
- Custom serialization code should touch only the object being serialized.
- Defer synchronous loads to Postload or later during loading.
- Avoid making decisions based on global variables from functions called by the loader.

On this page

- Set up Async Loading (-> asynchronous-level-loading-in-unreal-engine)
- Enable Async Loading by Default (-> asynchronous-level-loading-in-unreal-engine)
- Async Loading Best Practices (-> asynchronous-level-loading-in-unreal-engine)
