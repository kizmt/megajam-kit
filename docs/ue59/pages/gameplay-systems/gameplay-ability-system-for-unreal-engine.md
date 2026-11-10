# Gameplay Ability System

https://dev.epicgames.com/documentation/en-us/unreal-engine/gameplay-ability-system-for-unreal-engine?application_version=5.9

> High-level view of the Gameplay Ability System

[image: Gameplay Ability System]

The **Gameplay Ability System** is a framework for building attributes, abilities, and interactions that an Actor (-> actors-in-unreal-engine) can own and trigger. The system is designed to be adapted to a wide variety of Gameplay-Driven (-> data-driven-gameplay-elements-in-unreal-engine) projects such as **Role-Playing Games**(RPGs), **Action-Adventure** games, and **Multiplayer Online Battle Arenas** games(MOBA).

With the Gameplay Ability System, you can:

- Use the Ability System Component (-> gameplay-ability-system-component-and-gameplay-attributes-in-unreal-engine). The Ability System Component includes all the base functionality that an Actor Component (-> components-in-unreal-engine) implements.
- The Ability System Component implements its own Interface to access and interact with the framework of the Gameplay Ability System.
- Create active or passive Gameplay Abilities (-> gameplay-ability-system-for-unreal-engine), for Actors that coordinate with your project's gameplay mechanics, visual effects (-> creating-visual-effects-in-niagara-for-unreal-engine),animations (-> animating-characters-and-objects-in-unreal-engine), sounds (-> working-with-audio-in-unreal-engine), and other data-driven elements.
- Use Attributes and Attribute Sets (-> gameplay-attributes-and-attribute-sets-for-the-gameplay-ability-system-in-unreal-engine) that store, calculate, and modify your gameplay-related values as they interact with the Gameplay Ability System.
- Change Attributes with Gameplay Effects (-> gameplay-effects-for-the-gameplay-ability-system-in-unreal-engine) that provide a method to directly modify attribute values with your project's design. Gameplay Effects contain Gameplay Effect Components that determine how a Gameplay Effect behaves.
- Ability Tasks (-> gameplay-ability-tasks-in-unreal-engine)(`UAbilityTask`) are a specialized form of a Gameplay Task class that work with Gameplay Abilities. Games that use the Gameplay Ability System usually include a variety of custom Ability Tasks which implement their unique gameplay features. They perform asynchronous work during a Gameplay Ability's execution, and have the capability to affect execution flow by calling Delegates in native C++ code or moving through one or more output execution pins like Blueprints (-> blueprints-visual-scripting-in-unreal-engine).

Using this system, you can create abilities like a single attack, or add more complexity like a spell that triggers many status effects depending on data from the user and the targets.

## Valley of the Ancient Sample

Echo's charge and attack animation and their walking animation are examples of a Gameplay Ability.

See the Valley of the Ancient Sample (-> valley-of-the-ancient-sample-game-for-unreal-engine) for additional features.

### Walking Animation Example

### Charge Attack Example

## Topic Directory

- [image: Ability System Component And Attributes] Ability System Component And AttributesUsing the Ability System Component with Gameplay Attributes and Attribute Sets (-> gameplay-ability-system-component-and-gameplay-attributes-in-unreal-engine)
- [image: Gameplay Ability] Gameplay AbilityOverview of the Gameplay Ability class. (-> using-gameplay-abilities-in-unreal-engine)
- [image: Gameplay Attributes and Attribute Sets] Gameplay Attributes and Attribute SetsUsing Gameplay Attributes and Attribute Sets (-> gameplay-attributes-and-attribute-sets-for-the-gameplay-ability-system-in-unreal-engine)
- [image: Gameplay Ability System Overview] Gameplay Ability System OverviewA breakdown of the Gameplay Ability System and how each of its component classes contribute to abilities. (-> understanding-the-unreal-engine-gameplay-ability-system)
- [image: Gameplay Effects] Gameplay EffectsOverview of Gameplay Effects within the Gameplay Ability System. (-> gameplay-effects-for-the-gameplay-ability-system-in-unreal-engine)
- [image: Ability Tasks] Ability TasksOverview of the Ability Task class. (-> gameplay-ability-tasks-in-unreal-engine)

- blueprints
- programming
- gameplay ability system

On this page

- Valley of the Ancient Sample (-> gameplay-ability-system-for-unreal-engine)
- Walking Animation Example (-> gameplay-ability-system-for-unreal-engine)
- Charge Attack Example (-> gameplay-ability-system-for-unreal-engine)
- Topic Directory (-> gameplay-ability-system-for-unreal-engine)
