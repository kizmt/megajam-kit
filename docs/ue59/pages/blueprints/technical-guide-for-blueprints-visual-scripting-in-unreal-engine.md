# Blueprints Technical Guide

https://dev.epicgames.com/documentation/en-us/unreal-engine/technical-guide-for-blueprints-visual-scripting-in-unreal-engine?application_version=5.9

> Technical guide for programmers working with Blueprints.

**Blueprints** are a powerful new feature introduced in Unreal Engine 4. Blueprints are a way to create new UClasses (-> API) without the need for writing or compiling code. When you create a Blueprint, you can choose to extend a C++ class or another Blueprint class.
You can then add, arrange, and customize Components (-> components-in-unreal-engine), implement custom logic using a visual scripting language, respond to Events (-> events-in-unreal-engine) and interactions, define custom Variables (-> blueprint-variables-in-unreal-engine), handle Input (-> input-in-unreal-engine), and create a fully custom object type.

Each Blueprint has a Construction Script (-> construction-script-in-unreal-engine), analogous to a constructor in C++, which is run when the object is created. This script can dynamically construct the Actor instance based on any number
of factors, such as a fence that automatically sizes itself to fill a gap between buildings. In this sense, a Blueprint can be thought of as a very powerful prefab system.

- Blueprint Function Libraries (-> blueprint-function-libraries-in-unreal-engine): Information about Blueprint Function Libraries for C++ in Unreal Engine.

- Blueprint Compiler Overview (-> compiler-overview-for-blueprints-visual-scripting-in-unreal-engine): The steps of the Blueprint compilation process

- Exposing Gameplay Elements to Blueprints (-> exposing-gameplay-elements-to-blueprints-visual-scripting-in-unreal-engine): Technical guide for gameplay programmers exposing gameplay elements to Blueprints.

- Exposing C++ to Blueprints (-> exposing-cplusplus-to-blueprints-visual-scripting-in-unreal-engine): Tips and tricks for how best to write a Blueprint-friendly API
