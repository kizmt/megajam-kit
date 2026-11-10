# Testing, Debugging, and Optimization

https://dev.epicgames.com/documentation/en-us/unreal-engine/network-debugging-for-unreal-engine?application_version=5.9

> An Overview for Network Debugging in Unreal.

[image: Testing, Debugging, and Optimization]

When creating a multiplayer game or networked project in **Unreal Engine (UE)**, there are several unique challenges in the process of debugging, profiling, and testing your project. These challenges include:

- Debugging multiple instances of your project

- Accounting for the general unreliability and instability that comes with networked communication

- Examining the different functionality that exists on **Clients** as opposed to **Servers**.

UE multiplayer is based around the Client-Server model. This means that there will be a single server that will be Authoritative over the GameState (-> game-mode-and-game-state-in-unreal-engine), while connected clients will maintain a close approximation. See Client-Server Model (-> setting-up-dedicated-servers-in-unreal-engine) for additional documentation.

Unreal Engine features specialized tools and workflows for debugging networked applications. The guides below will show you how to use these tools, as well as tips and best practices for troubleshooting common networking issues.

## Index

On this page

- Index (-> network-debugging-for-unreal-engine)
