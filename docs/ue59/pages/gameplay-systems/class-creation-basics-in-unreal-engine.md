# Class Creation Basics

https://dev.epicgames.com/documentation/en-us/unreal-engine/class-creation-basics-in-unreal-engine?application_version=5.9

> Examples showing how to create classes with Blueprints alone, C++ alone, and a combination of C++ and Blueprints.

[image: Class Creation Basics]

These examples show how to create a new class using Blueprints only, C++ code only, and a combination of C++ code and Blueprints. The goal is to create new LightSwitch classes with the same properties and behavior using all three workflows, and then add an instance of each new class to the level, so there are three new LightSwitch Actors.

LightSwitch classes are based directly on the Actor class, since their primary requirement is that they can be placed within the level. They contain a PointLightComponent as the root component, and a SphereComponent that is a child of the PointLightComponent. Each LightSwitch class also has a variable called DesiredIntensity, which is used to set the intensity of the PointLightComponent. Finally, the default behavior of the classes is that when the player enters or leaves the SphereComponent, the PointLightComponent's visibility will be toggled.

## Examples

- [image: Blueprints Only] Blueprints OnlyIntroductory information for gameplay programmers getting started with Unreal Engine. (-> blueprints-only-example)

- [image: C++ Only] C++ OnlyIntroductory information for gameplay programmers getting started with Unreal Engine. (-> cpp-only-example)

- [image: C++ and Blueprints] C++ and BlueprintsIntroductory information for gameplay programmers getting started with Unreal Engine. (-> cpp-and-blueprints-example)

- blueprints
- programming

On this page

- Examples (-> class-creation-basics-in-unreal-engine)
