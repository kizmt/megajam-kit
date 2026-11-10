# Connectivity Interface

https://dev.epicgames.com/documentation/en-us/unreal-engine/connectivity-interface-in-unreal-engine?application_version=5.9

> Determine whether your game is connected to your platform's online services.

[image: Connectivity Interface]

Learn to use this **Beta** feature, but use caution when shipping with it.

The **Online Services** **Connectivity Interface** provides you with tools to determine whether your game is connected to your platform's backend online services.

## API Overview

### Functions

The following table provides a high-level overview of the functions provided by the Connectivity Interface:

| Function | Description |
| --- | --- |
| GetConnectionStatus (-> API) | Retrieve the connection status for the provided online service. |
| OnConnectionStatusChanged (-> API) | The event triggered when an online service connection status changes. |

### Enumerated Classes

Online service connection status is represented by the EOnlineServicesConnectionStatus (-> API) enumerated class.

#### EOnlineServicesConnectionStatus

| Value | Description |
| --- | --- |
| `Connected` | Connected to the online services. |
| `NotConnected` | Not connected to the online services. |

## Connection Status

`GetConnectionStatus` returns the current connection status for the provided online service. Some online services consist of multiple underlying microservices. Use the name of one of these microservices as a parameter for `GetConnectionStatus` to determine the particular microservice's connection status. If you don't specify an online service parameter, `GetConnectionStatus` returns `EOnlineServicesConnectionStatus::Connected` only if all underlying microservices are connected.

You can bind `OnConnectionStatusChanged` to events to inform you when the connection status of an online service or one of its microservices changes.

The organization of an online service and the accessibility of its particular microservices varies by platform. Consult your platform's online services documentation for more information.

## More Information

### Header File

Consult the `Connectivity.h` header file directly for more information as needed. The Connectivity Interface header file `Connectivity.h` is located in the directory:

 C++

```
Engine\Plugins\Online\OnlineServices\Source\OnlineServicesInterface\Public\Online
```

Engine\Plugins\Online\OnlineServices\Source\OnlineServicesInterface\Public\Online

For instructions on how to obtain the UE source code, see our documentation on Downloading Unreal Engine Source Code (-> downloading-source-code-in-unreal-engine).

### Function Parameters and Return Types

Refer to the Functions (-> overview-of-online-services-in-unreal-engine) section of the Online Services Overview page for an explanation of function parameters and return types, including how to pass parameters and processing the results when functions return.

- beta
- programming
- online services
- status
- connectivity
- connection

On this page

- API Overview (-> connectivity-interface-in-unreal-engine)
- Functions (-> connectivity-interface-in-unreal-engine)
- Enumerated Classes (-> connectivity-interface-in-unreal-engine)
- EOnlineServicesConnectionStatus (-> connectivity-interface-in-unreal-engine)
- Connection Status (-> connectivity-interface-in-unreal-engine)
- More Information (-> connectivity-interface-in-unreal-engine)
- Header File (-> connectivity-interface-in-unreal-engine)
- Function Parameters and Return Types (-> connectivity-interface-in-unreal-engine)
