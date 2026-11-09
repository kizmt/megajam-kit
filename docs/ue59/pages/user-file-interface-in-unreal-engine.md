# User File Interface

https://dev.epicgames.com/documentation/en-us/unreal-engine/user-file-interface-in-unreal-engine?application_version=5.9

> Read user files from the backend online services.

[image: User File Interface]

Learn to use this **Beta** feature, but use caution when shipping with it.

The **Online Services User File Interface** provides support for your game to read user-specific files from your platform's backend online services at runtime.

Your game might require you to read user files that are not packaged with your title. Examples may include configuration files or user-specific game save files. This interface helps you to access and download these files for use at runtime.

For title-specific file storage, see the Title File Interface (-> title-file-interface-in-unreal-engine).

## API Overview

### Functions

The following table provides a high-level overview of the functions provided by the User File Interface:

| Function | Description |
| --- | --- |
| EnumerateFiles (-> API) | Enumerate all available files. |
| GetEnumeratedFiles (-> API) | Retrieve a cached list of files enumerated by a call to `EnumerateFiles`. |
| ReadFile (-> API) | Read a file and return its contents. |
| WriteFile (-> API) | Write the file contents to a file with the provided name. |
| CopyFile (-> API) | Copy the file contents to another file. |
| DeleteFile (-> API) | Delete a file. |

## Process Flow for Reading Files

To read, copy, or delete a file from the backend online services with the User File Interface, follow these steps:

- `EnumerateFiles` caches a list of all files available to retrieve from the online services with the interface.
- `GetEnumeratedFiles` retrieves the list of files cached with the interface by `EnumerateFiles`.
- For each file in the retrieved list, `ReadFile` reads the file and returns its contents.

## Modifying Files

The User File Interface also supports operations for modifying files:

- `WriteFile` creates new files or overwrites existing ones.
- `CopyFile` copies the contents of a user file to a different user file.
- `DeleteFile` deletes the user file with the provided name from the backend online services.

## More Information

### Header File

Consult the `UserFile.h` header file directly for more information as needed. The User File Interface header file `UserFile.h` is located in the directory:

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
- file
- user

On this page

- API Overview (-> user-file-interface-in-unreal-engine)
- Functions (-> user-file-interface-in-unreal-engine)
- Process Flow for Reading Files (-> user-file-interface-in-unreal-engine)
- Modifying Files (-> user-file-interface-in-unreal-engine)
- More Information (-> user-file-interface-in-unreal-engine)
- Header File (-> user-file-interface-in-unreal-engine)
- Function Parameters and Return Types (-> user-file-interface-in-unreal-engine)
