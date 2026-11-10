# Using Slate in a Project

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-slate-in-a-project-in-unreal-engine?application_version=5.9

> Setting up your project to use the Slate UI Framework

[image: Using Slate in a Project]

In order to use the Slate User Interface (UI) Framework, your project must be set up properly so that it is aware of the
framework. This allows you to include the Slate.h header and reference the various elements of the
framework necessary for building a UI with slate.

## Module Dependencies

The Slate framework is stored in a few modules. In order to make your project aware of these,
some dependencies must be set up in the *.build.cs file for your project.

The modules your project needs access to are:

| Module | Dependency Type |
| --- | --- |
| InputCore | Public |
| Slate | Private |
| SlateCore | Private |

**To set up the Slate module dependencies:**

- Open the [ProjectName].build.cs file for your project. It is located in the [ProjectDir]/[ProjectName]/Source/[ProjectName] directory.

- Add the InputCore public dependency by adding `"InputCore"` to the `PublicDependencyModuleNames`. ```
     PublicDependencyModuleNames.AddRange(new string[] { "Core", "CoreUObject", "Engine", "InputCore" });

``` PublicDependencyModuleNames.AddRange(new string[] { "Core", "CoreUObject", "Engine", "InputCore" }); The InputCore module is set as a public dependency by default when code projects are created.

- Add Slate and SlateCore private dependencies. A line exists in the *.build.cs file for adding private dependencies: ```
     PrivateDependencyModuleNames.AddRange(new string[] {  });

``` PrivateDependencyModuleNames.AddRange(new string[] { }); Add the SlateCore and Slate modules to that line: ```
     PrivateDependencyModuleNames.AddRange(new string[] { "Slate", "SlateCore" });
``` PrivateDependencyModuleNames.AddRange(new string[] { "Slate", "SlateCore" }); Depending on when you created your project, and with what version of the engine, it may already have the Slate dependencies set up in the *.build.cs files but commented out. You can uncomment the appropriate lines to set up the dependencies. ```
     // Uncomment if you are using Slate UI
     // PrivateDependencyModuleNames.AddRange(new string[] { "Slate", "SlateCore" });
``` // Uncomment if you are using Slate UI // PrivateDependencyModuleNames.AddRange(new string[] { "Slate", "SlateCore" });

- ui
- slate

On this page

- Module Dependencies (-> using-slate-in-a-project-in-unreal-engine)
