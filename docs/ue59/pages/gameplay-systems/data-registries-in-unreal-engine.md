# Data Registries

https://dev.epicgames.com/documentation/en-us/unreal-engine/data-registries-in-unreal-engine?application_version=5.9

> Use Data Registries to store, combine, read, and manage data from various sources.

[image: Data Registries]

Programming Language

×C++

Select an option from the dropdown to see content relevant to it.

A **Data Registry** is an efficient global storage space for `USTRUCT`-tagged data structures. Data Registries support synchronous and asynchronous data access, and user-defined caching behaviors. They are intended to work with general read-only data.

Data Registries are part of a plugin. The Data Registries Quickstart (-> quick-start-guide-for-unreal-engine-data-registries) can guide you through the process and familiarize you with some of the basic concepts.For specific session-based data such as progress in a story, or a character's current state, use the engine's Save Game system.

You can configure your Data Registry to load or generate data from a variety of different sources, and can populate it with Asset scanning and manual registration. Data Registries are similar to **Composite Data Tables**, but can store curve data in addition to standard table rows, and use an indirection layer rather than manually compositing multiple tables together.

## Data Sources

Data Registries gather data items from two types of sources, **Data Registry Sources** and **Meta Data Registry Sources**. These sources are not the actual data items, instead the Data Registry uses them to find or generate data items.
The order in which data sources appear within a Data Registry matters, if a specific data item is not found in one source, then the Data Registry will look in the sources that appear after it in the list.

This creates the potential for override and fallback behavior, and enables context-specific sources to override generic ones.
The Data Registry plugin includes built-in Data Registry Sources and Meta Data Registry Sources that wrap **Data Tables** (`UDataTable`) and **Curve Tables** (`UCurveTable`).

### Data Registry Sources

The Data Registry directly owns a set of Data Registry Source objects that you can create and configure in an array within the Data Registry Asset.
These objects represent interfaces to specific data sources where the Data Registry can find information, such as an individual data table or a web database.
You can create child classes of `UDataRegistrySource` if you want to handle other types of data, or implement different indirection rules to map identifiers to data items.

Any child class you create will appear in the dropdown list when you add new data sources to a Data Registry Asset.

### Meta Data Registry Sources

Meta Data Registry Sources create and own other data sources at runtime. Rather than explicitly list all data sources, Meta Data Registry Sources use generic rules, such as scanning a set of user-named paths, to locate Assets that contain data items. They can also listen for manual registration of specific Assets.
Because Meta Data Registry Sources are dynamically generated, data sources (and the data items within those sources) that they discover load into the Data Registry at runtime.
Similar to Data Registry Sources, you can create your own child classes to handle other data types, create different scanning rules, and so on. To do this, override the `UMetaDataRegistrySource` class.

Any child classes you create will appear in the dropdown list as options when you add new Data Sources to a Data Registry Asset.

## Identifiers

The Data Registry plugin uses its own identifier types to identify or look up Data Registries and the individual data items they contain. While these identifiers are string-based names (-> string-handling-in-unreal-engine), the `FDataRegistryType` (for Data Registry Assets) and `FDataRegistryId` (for individual items within a Data Registry) structures act as wrappers and provide useful in-editor functionality.
`FDataRegistryType` identifies a Data Registry Asset, while `FDataRegistryId` identifies a Data Registry and a specific data item within it. You can use these identifier types when you need to find Data Registry Assets or retrieve individual data items from them.

Each Data Registry Asset must have a unique name in the **Registry Type** field.
If two Data Registry Assets have the same name in this field, the system will only recognize and populate one of them. Similarly, if multiple data items share the same identifying value (name or Gameplay Tag), the registry will read all items, but retrieval operations will only access the first one that the Data Registry Asset loaded; see the section on data sources (-> data-registries-in-unreal-engine) for information about the order in which data items load.

Developers using C++ can change this behavior by creating a child Data Registry class and overriding the `ResolveDataRegistryId` function.

### Data Registry Asset Identifiers

While setting up a Data Registry Asset, developers must set the **Registry Type** field to a unique name value. This is the identifier for the Data Registry.
After setting this value, `FDataRegistryType` fields across the editor will immediately add the new Data Registry name to their dropdown list.
This prevents user error resulting from spelling mistakes when referencing the Data Registry in other Assets, and makes the selection process quicker and easier.

 Above, setting the Data Registry Asset's identifier.

### Data Item Identifiers

Identifying an individual data item, such as a row within a data table, requires specifying the Data Registry Asset and the data item itself. The `FDataRegistryId` type contains both identifiers. Its **Data Registry Type** field will appear as a dropdown list, from which you can select any known Data Registry by its identifying name.
After selecting a Data Registry's name from that dropdown list, the **Data Registry ID** field will change to accommodate the Data Registry.

If the Data Registry's ID Format uses a Gameplay Tag, the user interface will display a filtered list containing that Gameplay Tag and all of its children.
If the Data Registry's ID Format did not use a Gameplay Tag, the user interface will display a dropdown list of all known rows that the Data Registry Asset contains.

If you edit a Data Registry Asset, your changes may not take effect immediately in other Assets that reference it using data item identifiers.
If this happens, the data item identifiers could contain obsolete rows in its dropdown lists.
Click the **Compile** button in the Asset that references the Data Registry (not the Data Registry Asset itself) to update the interface with current data item information.

 On the left, item selection for a Data Registry Asset with an ID Format that uses a Gameplay Tag.

Because `FDataRegistryId` has an `FDataRegistryType` member (called `RegistryType`), you can find the Data Registry Asset that contains the row without needing a separate `FDataRegistryType` identifier.

#### Dynamic Identifier Resolution

By default, the system looks up data items by searching for the value of the `ItemName` field of the `FDataRegistryId` you supply. If this is not the ideal behavior for your project, you can create your own `UDataRegistry` subclass and override the `MapIdToResolvedName` function to include additional `FDataRegistryResolverScope` structs in the local scope. By overriding the `ResolveIdToName` function within your `FDataRegistryResolverScope` subclasses, you can remap the incoming row names, even using dynamic or player-specific information. After resolving an ID, the system produces an `FDataRegistryLookup` which is guaranteed to be unique (within the system) and is used as the caching unique ID.

## Quick Function Reference

The following functions are helpful for getting started with Data Registries. This is not a complete reference, but these functions are the basics you will need to access your data after having set up Data Registries in your project.

| Function | Description |
| --- | --- |
| `UDataRegistrySubsystem::Get` | Returns a pointer to the `UDataRegistrySubsystem` instance. The only static function in the list, this function acts as the entry point to the subsystem. |
| `UDataRegistrySubsystem::GetRegistryForType` | Takes a name or `FDataRegistryType` (either standalone or from `FDataRegistryId::RegistryType`) and returns a `UDataRegistry` pointer to the matching Data Registry, if it exists. |
| `UDataRegistrySubsystem::RegisterSpecificAsset` | Searches for a Data Registry by `FDataRegistryType`, and adds a specific Asset to it. If you do not provide a valid `FDataRegistryType`, the subsystem will attempt to add the Asset to all Data Registries in the subsystem. Returns `true` if at least one Data Registry accepted the Asset. |
| `UDataRegistry::GetCachedItem` | Searches the Data Registry for the data item that corresponds to the `FDataRegistryId` you provide. If the item is not in the cache at the time of the function call, the function will return null. Otherwise, the function returns a const pointer to whichever struct type the Data Registry stores. |
| `UDataRegistry::GetAllCachedItems` | Populates a map with a pointer to the engine's `UScriptStruct` data (as a `const uint8*`) for each cached item in the Data Registry, using the item's `FDataRegistryId` as the key. Also provides the `UScriptStruct` itself through a separate output parameter. This is often useful for iterating over the cache as a debugging tool, such as using the `UScriptStruct::ExportText` function to log the contents of each cached item. |
| `UDataRegistry::EvaluateCachedCurve` | Finds the curve that corresponds to the `FDataRegistryId` you provide, and evaluates it for a given input value. This function will fail if the requested curve is not in the cache at the time of the call. The function's return value is of type `FDataRegistryCacheGetResult`, which provides information about the cached status of the curve you requested, and most importantly whether or not the curve was found. The curve's output value, of type `float`, comes through an output parameter. |
| `UDataRegistry::AcquireItem` | Similar to `GetCachedItem`, but finds the data item even if it is not cached at the time of the call. This function is asynchronous; it will run your callback function, of type `FDataRegistryItemAcquiredCallback`, when the search is complete. The function's return value is a `bool` that indicates success at scheduling the callback; a `false` return value means that there has been an error and your callback function will not run. A return value of `true` means that your callback function will run, but does not guarantee that the data item exists. |

Caching struct pointers that you retrieve from a Data Registry can be unsafe. While some data items are always available, others load dynamically and the Data Registry can unload them without warning.
If you are potentially dealing with data that can be unloaded, the recommended practice is to use the data immediately after retrieving it, or cache your own copy rather than keeping the pointer from the Data Registry.

## Integration with Game Features

The Data Registry plugin can add both Data Registries and individual Data Registry Sources from Game Feature plugins. For details on how this process works, see the Game Features and Modular Gameplay (-> game-features-and-modular-gameplay-in-unreal-engine) page.

- gameplay framework
- programming and scripting

On this page

- Data Sources (-> data-registries-in-unreal-engine)
- Data Registry Sources (-> data-registries-in-unreal-engine)
- Meta Data Registry Sources (-> data-registries-in-unreal-engine)
- Identifiers (-> data-registries-in-unreal-engine)
- Data Registry Asset Identifiers (-> data-registries-in-unreal-engine)
- Data Item Identifiers (-> data-registries-in-unreal-engine)
- Dynamic Identifier Resolution (-> data-registries-in-unreal-engine)
- Quick Function Reference (-> data-registries-in-unreal-engine)
- Integration with Game Features (-> data-registries-in-unreal-engine)
