# Online Services External UI Interface

https://dev.epicgames.com/documentation/en-us/unreal-engine/external-ui-interface-in-unreal-engine?application_version=5.9

> Display your platform's online services external user interface.

[image: Online Services External UI Interface]

Learn to use this **Beta** feature, but use caution when shipping with it.

The **Online Services External UI Interface** provides access to your platform's online services external user interface. A platform-specific External UI can be useful for:

- User login
- Friends and social interaction

## API Overview

| Function | Description |
| --- | --- |
| ShowLoginUI (-> API) | Display the default online service's login UI. |
| ShowFriendsUI (-> API) | Display the default online service's friends UI. |
| OnExternalUIStatusChanged (-> API) | Event triggered when the external UI status changes. |

Access to the External UI interface only succeeds if the Online Services platform implementation that you are using supports the External UI interface.

## Accessing the External UI Interface

Some online services have built-in, standardized user interfaces that are displayed whenever certain operations are performed. Examples of operations that display the built-in UI might include:

- Logging in to online services
- Inviting a player to a session
- Adding a friend

These operations might bring up a game-independent form, overlay, screen, or workflow that the user must navigate to access that feature. This is generally done to ensure that certain sensitive interactions are always handled the same way, and are controlled by the company that owns the online service rather than individual, third-party developers. These features are also not standard across every online service, and in some cases, may only exist on one particular service or system. To handle these disparate features, the Online Services plugin collects them and provides the External UI Interface to interact with them.

## More Information

### Header File

See the `ExternalUI.h` header file directly for more information as needed. The External UI Interface header file `ExternalUI.h` is located in the directory:

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
- external ui

On this page

- API Overview (-> external-ui-interface-in-unreal-engine)
- Accessing the External UI Interface (-> external-ui-interface-in-unreal-engine)
- More Information (-> external-ui-interface-in-unreal-engine)
- Header File (-> external-ui-interface-in-unreal-engine)
- Function Parameters and Return Types (-> external-ui-interface-in-unreal-engine)
