# Online Services Presence Interface

https://dev.epicgames.com/documentation/en-us/unreal-engine/presence-interface-in-unreal-engine?application_version=5.9

> Access the presence and joinability status of friends and followers.

[image: Online Services Presence Interface]

Learn to use this **Beta** feature, but use caution when shipping with it.

When logged into an online service, you may want to look for information about your friends and other users you have met online. For example, on many online services, you can see whether other users are online, what game they are currently playing, if they are available to join matches, and so on. The **Online Services Presence Interface** encompasses all functionality related to platform-specific user states across online services, including querying and updating a user's presence as well as listening for changes.

This document provides an API overview and code examples as well as tips for converting code from the Online Subsystem Presence Interface (-> online-subsystem-presence-interface-in-unreal-engine).

## API Overview

### Functions

The following table provides a high-level description of the functions included in the Presence Interface.

| Function | Description |
| --- | --- |
| **Query** |  |
| QueryPresence (-> API) | Fetch the presence of the user with the supplied `TargetAccountId`. |
| BatchQueryPresence (-> API) | Fetch the presence for every user in the supplied list of `TargetAccountIds`. |
| **Get** |  |
| GetCachedPresence (-> API) | Retrieve the presence of the user with the supplied `TargetAccountId` cached in the interface. |
| **Update** |  |
| UpdatePresence (-> API) | Update the presence of the user. |
| PartialUpdatePresence (-> API) | Update the presence of the user with only the specified presence settings. |
| **Event Listening** |  |
| OnPresenceUpdated (-> API) | Event will trigger as a result of updates to a user's presence. |

### Enumeration Classes

The Presence Interface defines three enumeration classes that represent a user's status (EUserPresenceStatus (-> API)), joinability (EUserPresenceJoinability (-> API)), and game status (EUserPresenceGameStatus (-> API)). These enumeration classes represent three primary members of the `FUserPresence` struct. For more information, refer to the Primary Struct (-> presence-interface-in-unreal-engine) section of this page.

#### EUserPresenceStatus

| Enumerator | Description |
| --- | --- |
| `Offline` | User is offline. |
| `Online` | User is online. |
| `Away` | User is away. |
| `ExtendedAway` | User has been away for at least two hours (may be platform dependent). |
| `DoNotDisturb` | User does not want to be disturbed. |
| `Unknown` | Default user presence status. |

#### EUserPresenceJoinability

| Enumerator | Description |
| --- | --- |
| `Public` | Anyone can discover and join this session. |
| `FriendsOnly` | Anyone trying to join must be a friend of a lobby member. |
| `InviteOnly` | Anyone trying to join must be invited first. |
| `Private` | User is not currently accepting invitations. |
| `Unknown` | Default user presence joinability status. |

#### EUserPresenceGameStatus

| Enumerator | Description |
| --- | --- |
| `PlayingThisGame` | User is playing the same game as you. |
| `PlayingOtherGame` | User is playing a different game than you. |
| `Unknown` | Default user presence game status. |

### Primary Struct

#### FUserPresence

The FUserPresence (-> API) struct is the primary object in the Presence interface and consists of all necessary information pertaining to a user's presence.

| Member | Type | Description |
| --- | --- | --- |
| `AccountId` | `FAccountId` | User whose presence this is. |
| `Status` | `EUserPresenceStatus` | User presence state. (Default value is `EUserPresenceStatus::Unknown`.) |
| `Joinability` | `EUserPresenceJoinability` | User session state. (Default value is `EUserPresenceJoinability::Unknown`.) |
| `GameStatus` | `EUserPresenceGameStatus` | User game state. (Default value is `EUserPresenceGameStatus::Unknown`.) |
| `StatusString` | `FString` | String representation of user presence state. |
| `RichPresenceString` | `FString` | Game-defined representation of the current game state. |
| `Properties` | `FPresenceProperties` | Session keys. |

The type `FPresenceProperties` is a typedef for `TMap<FString, FPresenceVariant>` where `FPresenceVariant` is an `FString`.

## Examples

We now provide an example demonstrating `UpdatePresence`, `QueryPresence`, and `GetPresence`. `UserA` updates their presence with the default platform services, then `UserB` queries the presence of `UserA` after it has been updated. If the query successfully returns, then `UserB` retrieves the presence of `UserA`.

### Code

 C++

 UserAPresence.cpp

```
UE::Online::IOnlineServicesPtr OnlineServices = UE::Online::GetServices();
UE::Online::IPresencePtr PresenceInterface = OnlineServices->GetPresenceInterface();

TSharedRef<UE::Online::FUserPresence> Presence = MakeShared<UE::Online::FUserPresence>();
Presence->AccountId = UserA;
Presence->Status = UE::Online::EUserPresenceStatus::Online;
Presence->Joinability = UE::Online::EUserPresenceJoinability::Public;
Presence->RichPresenceString = TEXT("Exploring the Great Citadel");
Presence->Properties.Add(TEXT("advanced_class"), TEXT("advanced_class_assassin"));
```

 C++

 UserBPresence.cpp

```
UE::Online::IOnlineServicesPtr OnlineServices = UE::Online::GetServices();
UE::Online::IPresencePtr PresenceInterface = OnlineServices->GetPresenceInterface();

PresenceInterface->QueryPresence({UserA})
.OnComplete([](const UE::Online::TOnlineResult<UE::Online::FQueryPresence> Result)
{
	if(Result.IsOk())
	{
		// we succeeded - now use GetPresence to actually view the presence object
```

### Walkthrough

- Both users retrieve the default online services by calling `GetServices` with no parameters specified and access the Presence Interface: C++ UserAPresence.cpp and UserBPresence.cpp ```
UE::Online::IOnlineServicesPtr OnlineServices = UE::Online::GetServices();
 UE::Online::IPresencePtr PresenceInterface = OnlineServices->GetPresenceInterface();
``` UE::Online::IOnlineServicesPtr OnlineServices = UE::Online::GetServices(); UE::Online::IPresencePtr PresenceInterface = OnlineServices->GetPresenceInterface();
- `UserA` initializes an `FUserPresence` struct named `Presence`. Notice that we are using two of the aforementioned enumerations provided by the Presence Interface: `EUserPresenceStatus` and `EUserPresenceJoinability`. C++ UserAPresence.cpp ```
TSharedRef<UE::Online::FUserPresence> Presence = MakeShared<UE::Online::FUserPresence>();
 Presence->AccountId = UserA;
 Presence->Status = UE::Online::EUserPresenceStatus::Online;
 Presence->Joinability = UE::Online::EUserPresenceJoinability::Public;
 Presence->RichPresenceString = TEXT("Exploring the Great Citadel");
 Presence->Properties.Add(TEXT("advanced_class"), TEXT("advanced_class_assassin"));
``` TSharedRef Presence = MakeShared(); Presence->AccountId = UserA; Presence->Status = UE::Online::EUserPresenceStatus::Online; Presence->Joinability = UE::Online::EUserPresenceJoinability::Public; Presence->RichPresenceString = TEXT("Exploring the Great Citadel"); Presence->Properties.Add(TEXT("advanced_class"), TEXT("advanced_class_assassin"));
- `UserA` initializes an `FUpdatePresence::Params` struct named `Params` with the parameters that will be passed to `UpdatePresence`: C++ UserAPresence.cpp ```
UE::Online::FUpdatePresence::Params Params;
 Params.LocalAccountId = AccountId;
 Params.Presence = Presence;
``` UE::Online::FUpdatePresence::Params Params; Params.LocalAccountId = AccountId; Params.Presence = Presence;
- `UserA` calls `UpdatePresence` and processes the result with an `OnComplete` callback: C++ UserAPresence.cpp ```
PresenceInterface->UpdatePresence(MoveTemp(Params))
 .OnComplete([](const UE::Online::TOnlineResult<UE::Online::FUpdatePresence> Result)
 {
     if(Result.IsOk())
     {
         // we succeeded - UserB is now clear to query presence
     }
     else
     {
         // we failed - check the error state in Result.GetErrorValue();
```
- `UserB` queries the presence of `UserA`. Inside the queries' `OnComplete` callback, `UserB` first checks to ensure `QueryPresence` returned an "Ok" status. If it did, then `UserB` is safe to retrieve the presence of `UserA` and process the result or error of `GetPresence` accordingly: C++ UserBPresence.cpp ```
PresenceInterface->QueryPresence({UserA})
 .OnComplete([](const UE::Online::TOnlineResult<UE::Online::FQueryPresence> Result)
 {
     if(Result.IsOk())
     {
         // we succeeded - now use GetPresence to actually view the presence object

         UE::Online::TOnlineResult<UE::Online::FGetPresence> GetPresenceResult = PresenceInterface->GetPresence({UserB});
         if(GetPresenceResult.IsOk())
         {
```

If all function calls return without error, `UserB` now sees the updated status of `UserA` and `UserB` can choose to make decisions based on this status. For example, `UserB` could access the `GetPresenceResult` to see `UserA` is online and their joinability status is public. Upon setting this status `UserB` could decide to join `UserA` and "Explore the Great Citadel" together.

## Converting Code from Online Subsystem

The Online Services (-> online-services-in-unreal-engine) plugins are an updated version of the Online Subsystem (-> online-subsystem-in-unreal-engine) plugins and will exist alongside one another for the foreseeable future. The API functionality of the Online Services Presence Interface maps approximately one-to-one with the API functionality of the Online Subsystem Presence Interface. A few caveats include:

- `SetPresence` was renamed to `UpdatePresence` to better represent the function's asynchronicity.
- `UpdatePresence` and `QueryPresence` are no longer overloaded.
- We recommend using their renamed functions `PartialUpdatePresence` and `BatchQueryPresence` instead.The overloads for `UpdatePresence` and `QueryPresence` were renamed to `PartialUpdatePresence` and `BatchQueryPresence`, respectively.

- `QueryPresence` was given the `bListenToChanges` parameter.This adds a specific user to the `OnPresenceUpdated` event.
- The parameter is set to true by default.

## More Information

### Header File

Consult the `Presence.h` header file directly for more information as needed. The Presence Interface header file `Presence.h` is located in the directory:

 C++

```
Engine\Plugins\Online\OnlineServices\Source\OnlineServicesInterface\Public\Online
```

Engine\Plugins\Online\OnlineServices\Source\OnlineServicesInterface\Public\Online

For instructions on how to obtain the UE source code, refer to our documentation on Downloading Unreal Engine Source Code (-> downloading-source-code-in-unreal-engine).

### Function Parameters and Return Types

Refer to the Functions (-> overview-of-online-services-in-unreal-engine) section of the Online Services Overview page for an explanation of function parameters and return types, including how to pass parameters and processing the results when functions return.

- social
- beta
- programming
- presence
- multiplayer
- online services
- status

On this page

- API Overview (-> presence-interface-in-unreal-engine)
- Functions (-> presence-interface-in-unreal-engine)
- Enumeration Classes (-> presence-interface-in-unreal-engine)
- EUserPresenceStatus (-> presence-interface-in-unreal-engine)
- EUserPresenceJoinability (-> presence-interface-in-unreal-engine)
- EUserPresenceGameStatus (-> presence-interface-in-unreal-engine)
- Primary Struct (-> presence-interface-in-unreal-engine)
- FUserPresence (-> presence-interface-in-unreal-engine)
- Examples (-> presence-interface-in-unreal-engine)
- Code (-> presence-interface-in-unreal-engine)
- Walkthrough (-> presence-interface-in-unreal-engine)
- Converting Code from Online Subsystem (-> presence-interface-in-unreal-engine)
- More Information (-> presence-interface-in-unreal-engine)
- Header File (-> presence-interface-in-unreal-engine)
- Function Parameters and Return Types (-> presence-interface-in-unreal-engine)
