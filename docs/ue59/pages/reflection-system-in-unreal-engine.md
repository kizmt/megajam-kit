# Unreal Engine Reflection System

https://dev.epicgames.com/documentation/en-us/unreal-engine/reflection-system-in-unreal-engine?application_version=5.9

> Information for programmers developing Objects to be used with Unreal Engine.

[image: Unreal Engine Reflection System]

The **Unreal Engine Reflection System** encapsulates your classes with various macros that provide engine and editor functionality. When programming with **Unreal Engine**(**UE**), it is possible to have standard C++ classes, functions, and variables.

- The base class for objects in Unreal is UObject (-> objects-in-unreal-engine). Each class defines a template for a new Actor (-> actors-in-unreal-engine) or Object.
- You can use the `UCLASS` macro to tag classes derived from `UObject` so that the UObject handling system (-> unreal-object-handling-in-unreal-engine) is aware of them.
- TSubclassOf (-> typed-object-pointer-properties-in-unreal-engine) is a template class that provides `UClass` type safety. It is useful for assigning classes that derive from a specific type. For example, you may expose this variable to Blueprint where a designer can assign which weapon class is spawned for a Player Character.
- Classes can contain structs (-> structs-in-unreal-engine). Structs are data structures that help with the organization and manipulation of their related member properties. Structs can be defined on their own using the `USTRUCT()` macro.
- The Unreal Smart Pointer Library (-> smart-pointers-in-unreal-engine) is a custom implementation of C++11 smart pointers designed to ease the burden of memory allocation and tracking. This implementation includes the industry standard Shared Pointers (-> shared-pointers-in-unreal-engine), Weak Pointers (-> weak-pointers-in-unreal-engine), **Unique Pointers**, and Shared References (-> shared-references-in-unreal-engine) which act like non-nullable Shared Pointers.
- Interfaces (-> interfaces-in-unreal-engine) provide functions and additional gameplay behavior you can implement in multiple or different classes. Your player character can interact with a variety of Actors in the world. Each of these interactions can cause a different reaction to an event.
- Metadata Specifiers (-> metadata-specifiers-in-unreal-engine) control how classes, interfaces, structs, enums, functions, or properties interact with various aspects of the engine and editor. Each type of data structure or member has its own list of Metadata Specifiers.
- UFUNCTION (-> ufunctions-in-unreal-engine), and UPROPERTY (-> unreal-engine-uproperties) macros make UE aware of new classes, functions, and variables. These macros are garbage collected by the engine. When specifying macros, you can edit and display them within the Unreal Editor.

## Section Directory

- [image: Objects] ObjectsExplanations of the basic gameplay elements, Actors and Objects. (-> objects-in-unreal-engine)
- [image: Properties] PropertiesReference for creating and implementing properties for gameplay classes. (-> unreal-engine-uproperties)
- [image: Structs] StructsReference to creating and implementing structs for gameplay classes. (-> structs-in-unreal-engine)
- [image: TSubclassOf] TSubclassOfUsing the TSubclassOf template class to provide type safety. (-> typed-object-pointer-properties-in-unreal-engine)
- [image: Unreal Interfaces] Unreal InterfacesCreate and implement Unreal Interfaces in C++ and Blueprints. (-> interfaces-in-unreal-engine)
- [image: Metadata Specifiers] Metadata SpecifiersMetadata keywords used when declaring UClasses, UFunctions, UProperties, UEnums, and UInterfaces to specify how they behave with various aspects of Unreal Engine and the editor (-> metadata-specifiers-in-unreal-engine)
- [image: UFunctions] UFunctionsOverview for creating and implementing functions for gameplay Classes (-> ufunctions-in-unreal-engine)
- [image: Unreal Smart Pointer Library] Unreal Smart Pointer LibraryCustom implementation of shared pointers, including weak pointers and non-nullable shared references. (-> smart-pointers-in-unreal-engine)

- programming

On this page

- Section Directory (-> reflection-system-in-unreal-engine)
