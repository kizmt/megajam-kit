# Debugging and Optimization in Niagara

https://dev.epicgames.com/documentation/en-us/unreal-engine/debugging-and-optimization-in-niagara-effects-for-unreal-engine?application_version=5.9

> Learn how to debug and optimize your Niagara simulations.

[image: Debugging and Optimization in Niagara]

Unreal Engine provides several different tools you can use to help debug what's going on in your simulations.

## Optimizing your Niagara System

- [image: Optimizing Niagara] Optimizing NiagaraLearn how to optimize your Niagara systems in Unreal Engine. (-> optimizing-niagara)

## Niagara Debugger

If you need to further debug Niagara simulations after they've been added to your level, then you can use the **Niagara Debugger**. This lets you turn on a heads-up display (HUD) that outputs detailed information about the simulations in your level, such as the number of particles being generated, the amount of memory being used, and more. You can also capture a snapshot of information and then analyze that output.

- [image: Niagara Debugger] Niagara DebuggerUse the Niagara Debugger to analyze your Niagara systems in a level. (-> niagara-debugger-for-unreal-engine)

## Performance Budgeting Using Effect Types

Create a new type of asset called a Niagara Effect Type to configure a variety of settings to help you manage budgeting in your level. Any Niagara Systems that use this Effect Type will inherit the rules you set. This way, you can improve performance by, for example, culling systems that are a certain distance away.

- [image: Performance Budgeting Using Effect Types] Performance Budgeting Using Effect TypesUse Effect Types to set up ways to improve the performance of your Niagara systems. (-> performance-budgeting-using-effect-types-in-niagara-for-unreal-engine)

## How to Fix a GPU Crash

As some Niagara simulations can be graphically intensive, working in those scenes in Windows could cause a GPU crash. Visit this page to find out more about how to resolve it.

- [image: Dealing with a GPU Crash] Dealing with a GPU CrashAn overview of investigating, resolving, and reporting GPU Crashes in Unreal Engine. (-> dealing-with-a-gpu-crash-when-using-unreal-engine)

- vfx
- niagara
- visual effects
- particle effects

On this page

- Optimizing your Niagara System (-> debugging-and-optimization-in-niagara-effects-for-unreal-engine)
- Niagara Debugger (-> debugging-and-optimization-in-niagara-effects-for-unreal-engine)
- Performance Budgeting Using Effect Types (-> debugging-and-optimization-in-niagara-effects-for-unreal-engine)
- How to Fix a GPU Crash (-> debugging-and-optimization-in-niagara-effects-for-unreal-engine)
