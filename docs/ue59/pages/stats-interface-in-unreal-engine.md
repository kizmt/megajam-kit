# Stats Interface

https://dev.epicgames.com/documentation/en-us/unreal-engine/stats-interface-in-unreal-engine?application_version=5.9

> Upload stats and data to online services and complete stats queries.

[image: Stats Interface]

Learn to use this **Beta** feature, but use caution when shipping with it.

The **Online Services Stats Interface** is used to upload stats and data to online services and complete stats queries. Stats Interface functionality is also used by other interfaces that rely on user gameplay statistics such as the Online Services' Achievements and Leaderboards Interfaces.

## API Overview

The following table provides a high-level description of the functions included in the Stats Interface.

| Function | Description |
| --- | --- |
| **Update** |  |
| UpdateStats (-> API) | Upload stats to the platform |
| **Query** |  |
| QueryStats (-> API) | Query the stats of a user and cache the result in the interface. |
| BatchQueryStats (-> API) | Query the stats of a group of users and cache the results in the interface. |
| **Get** |  |
| GetCachedStats (-> API) | Retrieve the cached user stats stored after a call to QueryStats or BatchQueryStats. |
| **Event Listening** |  |
| OnStatsUpdated (-> API) | An event will fire as a result of changes to user stats. |

## Configuration

You can use the Stats Interface with either a corresponding platform backend or a `StatsNull` implementation. To use the Stats Interface, you must first configure the Stats Interface in your `DefaultEngine.ini` file:

 C++

 DefaultEngine.ini

```
[OnlineServices.Stats]
+StatDefinitions=(Name=<STAT_NAME>, Id=<ID_NUMBER>, ModifyMethod=<METHOD>, DefaultValue="<TYPE>:<DEFAULT_VALUE>")
```

[OnlineServices.Stats]
+StatDefinitions=(Name=<STAT_NAME>, Id=<ID_NUMBER>, ModifyMethod=<METHOD>, DefaultValue="<TYPE>:<DEFAULT_VALUE>")

**Stat Definitions** consist of the following fields:

- `Name`: The name of the stat.This is the name that will be used to update and query stats with `UpdateStats` and `QueryStats` respectively.

- `Id`: The ID of the stat.This is the corresponding configured stat ID in the platform portal.

- `ModifyMethod`: Method prescribing how the stat will be updated.For non-`StatsNull` implementations, the Modify Method is configured in the platform portal.
- The Modify Method is used by the Achievements Interface on all implementations when using Title Managed achievements to determine whether an achievement meets the prescribed unlock rules.

- `DefaultValue`: The type and default value of the stat.This prescribes the initial value of the stat.

To unlock achievements and update leaderboards with stats, you must specify corresponding stats in the Achievements and Leaderboards config sections of `DefaultEngine.ini`.

### Configuration Example

Here is a configuration example for the Online Services Stats interface:

 C++

 DefaultEngine.ini

```
[OnlineServices.Stats]
+StatDefinitions=(Name=Stat_Use_Largest, Id=0, ModifyMethod=Largest, DefaultValue="Int64:0")
+StatDefinitions=(Name=Stat_Use_Smallest, Id=1, ModifyMethod=Smallest, DefaultValue="Int64:999")
+StatDefinitions=(Name=Stat_Use_Set, Id=2, ModifyMethod=Set, DefaultValue="Int64:0")
+StatDefinitions=(Name=Stat_Use_Sum, Id=3, ModifyMethod=Sum, DefaultValue="Int64:0")
+StatDefinitions=(Name=Stat_Type_Bool, Id=4, ModifyMethod=Set, DefaultValue="Bool:True")
+StatDefinitions=(Name=Stat_Type_Double, Id=5, ModifyMethod=Smallest, DefaultValue="Double:9999.999")
```

[OnlineServices.Stats]
+StatDefinitions=(Name=Stat_Use_Largest, Id=0, ModifyMethod=Largest, DefaultValue="Int64:0")
+StatDefinitions=(Name=Stat_Use_Smallest, Id=1, ModifyMethod=Smallest, DefaultValue="Int64:999")
+StatDefinitions=(Name=Stat_Use_Set, Id=2, ModifyMethod=Set, DefaultValue="Int64:0")
+StatDefinitions=(Name=Stat_Use_Sum, Id=3, ModifyMethod=Sum, DefaultValue="Int64:0")
+StatDefinitions=(Name=Stat_Type_Bool, Id=4, ModifyMethod=Set, DefaultValue="Bool:True")
+StatDefinitions=(Name=Stat_Type_Double, Id=5, ModifyMethod=Smallest, DefaultValue="Double:9999.999")

## Examples

This section contains a variety of code examples that guide you on how to:

- Query Stats (-> stats-interface-in-unreal-engine)
- Get Cached Stats (-> stats-interface-in-unreal-engine)
- Listen for an event (-> stats-interface-in-unreal-engine)
- Execute a Console Command (-> stats-interface-in-unreal-engine)

### Query Stats

 C++

```
UE::Online::IOnlineServicesPtr OnlineServices = UE::Online::GetServices();
UE::Online::IStatsPtr Stats = OnlineServices->GetStatsInterface();

UE::Online::FQueryStats::Params Params;
Params.LocalAccountId = LocalAccountId;
Params.TargetAccountId = TargetAccountId;
Params.StatNames = {"StatA", "StatB"};

// See Note below Walkthrough for more information about this OnComplete call
Stats->QueryStats(MoveTemp(Params)).OnComplete([](const UE::Online::TOnlineResult<FQueryStats>& Result)
```

#### Walkthrough

- Use the default online services by calling `GetServices` with no parameters specified: C++ ```
UE::Online::IOnlineServicesPtr OnlineServices = UE::Online::GetServices();
``` UE::Online::IOnlineServicesPtr OnlineServices = UE::Online::GetServices();
- Access the Stats Interface for the default online services: C++ ```
UE::Online::IStatsPtr Stats = OnlineServices->GetStatsInterface();
``` UE::Online::IStatsPtr Stats = OnlineServices->GetStatsInterface();
- Instantiate the parameters necessary to query the `StatNames` of the `TargetAccountId`: C++ ```
UE::Online::FQueryStats::Params Params;
     Params.LocalAccountId = LocalAccountId;
     Params.TargetAccountId = TargetAccountId;
     Params.StatNames = {"StatA", "StatB"};
``` UE::Online::FQueryStats::Params Params; Params.LocalAccountId = LocalAccountId; Params.TargetAccountId = TargetAccountId; Params.StatNames = {"StatA", "StatB"};
- Handle the `QueryStats.OnComplete` callback by processing the error or the queried stats: C++ ```
Stats->QueryStats(MoveTemp(Params)).OnComplete([](const UE::Online::TOnlineResult<FQueryStats>& Result)
     {
         if (Result.IsError())
         {
             const UE::Online::FOnlineError OnlineError = Result.GetErrorValue();
             // Process OnlineError
             return;
         }
         const UE::Online::FQueryStats::Result QueriedStats = Result.GetOkValue();
         // Process QueriedStats
```

To bind to a member function, always prefer to use a UObject-derived class or a class that inherits from `TSharedFromThis` and use

 C++

```
.OnComplete(this, &MyClass::OnQueryStatsComplete)
```

.OnComplete(this, &MyClass::OnQueryStatsComplete)

This automatically selects `CreateUObject`, `CreateThreadSafeSP`, or `CreateSP`. The safest delegate creation call will be used. For more information, refer to the Callback Format section of the Online Services Overview page.

### Get Cached Stats

 C++

```
UE::Online::IOnlineServicesPtr OnlineServices = UE::Online::GetServices();
UE::Online::IStatsPtr Stats = OnlineServices->GetStatsInterface();

UE::Online::TOnlineResult<FGetCachedStats> CachedStats = Stats->GetCachedStats({});
if (CachedStats.IsError())
{
	UE::Online::FOnlineError OnlineError = CachedStats.GetErrorValue();
	// Process OnlineError
	return;
}
```

#### Walkthrough

- Use the default online services by calling `GetServices` with no parameters specified and access the Stats Interface: C++ ```
UE::Online::IOnlineServicesPtr OnlineServices = UE::Online::GetServices();
     UE::Online::IStatsPtr Stats = OnlineServices->GetStatsInterface();
``` UE::Online::IOnlineServicesPtr OnlineServices = UE::Online::GetServices(); UE::Online::IStatsPtr Stats = OnlineServices->GetStatsInterface();
- Retrieve the cached stats through the Stats Interface with `Stats->GetCachedStats`: C++ ```
UE::Online::TOnlineResult<UE::Online::FGetCachedStats> CachedStats = Stats->GetCachedStats({});
``` UE::Online::TOnlineResult CachedStats = Stats->GetCachedStats({});
- Handle the `CachedStats` by processing the error or the cached stats data: C++ ```
if (CachedStats.IsError())
     {
         UE::Online::FOnlineError OnlineError = CachedStats.GetErrorValue();
         // Process OnlineError
         return;

     }
     UE::Online::FGetCachedStats::Result& CachedStatsData = CachedStats.GetOkValue();
     // Process CachedStatsData
``` if (CachedStats.IsError()) { UE::Online::FOnlineError OnlineError = CachedStats.GetErrorValue(); // Process OnlineError return; } UE::Online::FGetCachedStats::Result& CachedStatsData = CachedStats.GetOkValue(); // Process CachedStatsData

### Listen for an Event

Event listening is handled differently than synchronous and asynchronous functions. An `FOnlineEventDelegateHandle` is created to handle the result of the `OnStatsUpdated` event, then `Unbind` must be called in your shutdown code to ensure proper destruction.

#### Walkthrough

- Declare an event handle in your class for the Stat interface. C++ ```
UE::Online::FOnlineEventDelegateHandle StatEventHandle;
``` UE::Online::FOnlineEventDelegateHandle StatEventHandle;
- In your init code, initialize the default online services, access the Stats interface, and process the stats when an event happens. C++ ```
UE::Online::IOnlineServicesPtr OnlineServices = UE::Online::GetServices();
     UE::Online::IStatsPtr Stats = OnlineServices->GetStatsInterface();
     StatEventHandle = Stats->OnStatsUpdated().Add([](const UE::Online::FStatsUpdated& StatsUpdated)
     {
         // custom logic inside this lambda
     });
``` UE::Online::IOnlineServicesPtr OnlineServices = UE::Online::GetServices(); UE::Online::IStatsPtr Stats = OnlineServices->GetStatsInterface(); StatEventHandle = Stats->OnStatsUpdated().Add([](const UE::Online::FStatsUpdated& StatsUpdated) { // custom logic inside this lambda });
- Ensure that you unbind the event handler in your shutdown code. C++ ```
StatEventHandle.Unbind();
``` StatEventHandle.Unbind();

### Execute a Console Command

For the general command-line syntax to run an async interface with a console command, refer to the Online Services Overview (-> overview-of-online-services-in-unreal-engine) documentation.

#### Example

To run the `QueryStats` function, execute the following console command:

 C++

```
OnlineServices Index=0 Stats QueryStats 0 0 ["StatA", "StatB"]
```

OnlineServices Index=0 Stats QueryStats 0 0 ["StatA", "StatB"]

This command calls `QueryStats` from the Stats Interface with the default online services for the zeroth local user. In particular, the above command queries the default online services for `StatA` and `StatB` of this user.

## Reset Stats Data

During development and testing, the `ResetStats` function resets all provided player stats for the current title. Although policies vary across online services, you should not expect this function to work outside a testing environment. Be sure to remove any code that uses `ResetStats` from shipping builds, or use compile-time logic to mask the code like this:

 C++

```
#if !UE_BUILD_SHIPPING
// Code block with call to ResetStats
#endif
```

#if !UE_BUILD_SHIPPING
// Code block with call to ResetStats
#endif

## More Information

### Header File

Consult the `Stats.h` header file directly for more information as needed. The Stats Interface header file `Stats.h` is located in the directory:

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
- achievements
- leaderboards
- multiplayer
- online services
- stats

On this page

- API Overview (-> stats-interface-in-unreal-engine)
- Configuration (-> stats-interface-in-unreal-engine)
- Configuration Example (-> stats-interface-in-unreal-engine)
- Examples (-> stats-interface-in-unreal-engine)
- Query Stats (-> stats-interface-in-unreal-engine)
- Walkthrough (-> stats-interface-in-unreal-engine)
- Get Cached Stats (-> stats-interface-in-unreal-engine)
- Walkthrough (-> stats-interface-in-unreal-engine)
- Listen for an Event (-> stats-interface-in-unreal-engine)
- Walkthrough (-> stats-interface-in-unreal-engine)
- Execute a Console Command (-> stats-interface-in-unreal-engine)
- Example (-> stats-interface-in-unreal-engine)
- Reset Stats Data (-> stats-interface-in-unreal-engine)
- More Information (-> stats-interface-in-unreal-engine)
- Header File (-> stats-interface-in-unreal-engine)
- Function Parameters and Return Types (-> stats-interface-in-unreal-engine)
