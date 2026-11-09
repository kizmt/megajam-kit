# Title File Interface

https://dev.epicgames.com/documentation/en-us/unreal-engine/title-file-interface-in-unreal-engine?application_version=5.9

> Read title files from the backend online services.

[image: Title File Interface]

Learn to use this **Beta** feature, but use caution when shipping with it.

The **Online Services Title File Interface** provides support for your game to read files from your platform's backend online services at runtime.

Your game might require reading files not packaged with your title. The title file interface provides you with tools to read files that you have uploaded to backend online services. Examples of such information might include configuration files or a message of the day. This interface helps you to access and download these files for use at runtime.

For player-specific file storage, see the User File Interface (-> user-file-interface-in-unreal-engine).

## API Overview

### Functions

The following table provides a high-level overview of the functions provided by the Title File Interface:

| Function | Description |
| --- | --- |
| EnumerateFiles (-> API) | Enumerate all available files. |
| GetEnumeratedFiles (-> API) | Retrieve a cached list of files enumerated by a call to `EnumerateFiles`. |
| ReadFile (-> API) | Read a file and return its contents. |

## Process Flow

To read a file from the backend online services with the Title File Interface, follow these steps:

- `EnumerateFiles` asynchronously caches a list of all files available to retrieve from the online services with the interface.
- `GetEnumeratedFiles` retrieves the list of files cached with the interface by `EnumerateFiles`.
- For each file in the retrieved list, `ReadFile` reads the file asynchronously and returns its contents for use in your game.

## More Information

### Header File

Consult the `TitleFile.h` header file directly for more information as needed. The Title File Interface header file `TitleFile.h` is located in the directory:

 C++

```
Engine\Plugins\Online\OnlineServices\Source\OnlineServicesInterface\Public\Online
```

Engine\Plugins\Online\OnlineServices\Source\OnlineServicesInterface\Public\Online

For instructions on how to obtain the UE source code, see our documentation on Downloading Unreal Engine Source Code (-> downloading-source-code-in-unreal-engine).

### Function Parameters and Return Types

See the Functions (-> overview-of-online-services-in-unreal-engine) section of the Online Services Overview page for an explanation of function parameters and return types, including how to pass parameters and processing the results when functions return.

- beta
- programming
- online services
- title
- file

On this page

- API Overview (-> title-file-interface-in-unreal-engine)
- Functions (-> title-file-interface-in-unreal-engine)
- Process Flow (-> title-file-interface-in-unreal-engine)
- More Information (-> title-file-interface-in-unreal-engine)
- Header File (-> title-file-interface-in-unreal-engine)
- Function Parameters and Return Types (-> title-file-interface-in-unreal-engine)
