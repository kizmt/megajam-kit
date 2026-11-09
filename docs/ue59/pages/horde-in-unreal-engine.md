# Horde

https://dev.epicgames.com/documentation/en-us/unreal-engine/horde-in-unreal-engine?application_version=5.9

> An infrastructure to improve your team's workflow.

[image: Horde]

**Horde** is a set of services supporting workflows Epic Games uses to develop Fortnite, Unreal Engine, and other projects.

## Features

Horde offers the following functionality, most of which can be enabled or disabled independently:

- **Remote Execution**: Functionality to offload compute work to other machines, including C++ compilation with Unreal Build Accelerator (-> horde-unreal-build-accelerator-and-remote-compilation-tutorial-for-unreal-engine).

- **Build Automation (CI/CD)**: A build automation system designed for teams working with large Perforce repositories.

- **Test Automation**: A frontend for querying automation results across streams and projects, integrated with Automation Tool (-> unreal-automation-tool-for-unreal-engine) and Gauntlet (-> gauntlet-automation-framework-in-unreal-engine).

- **Studio Analytics**: Received telemetry from Unreal Editor and shows charts for key workflow metrics.

- **UnrealGameSync Metadata Server**: Various features for teams using UnrealGameSync (-> unreal-game-sync-ugs-for-unreal-engine), including build status reporting, comment aggregation, and crowdsourced build health functionality.

- **Mobile/Console Device Manager**: A system for allocating and managing a farm of development kits and mobile devices.

## Goals & Philosophy

### Opinionated

We created Horde from workflows and best practices that have arisen for Epic Games over time. They aren't the only way to work and may not be for everyone. Being completely generic is a non-goal for Horde. We believe that the interaction between systems and the context in which tools are used provides the richest opportunity for creating smooth and slick workflows for creators.

### Simple to Deploy

We've tried to build Horde in a way that requires little setup to run. While you can have fairly elaborate, multi-machine, distributed deployments, we strive to make it easy to run and debug locally on all our supported desktop platforms with few prerequisites installed. A database is created locally if you don't have one set up, and all the required services will automatically start and stop with the server's lifetime.

### Easy to Manage

Having control over the source for a project like Horde, while also using it in a high-velocity environment, empowers us to optimize for our own ease of use. We have a tight feedback loop with our operations teams and try to make their lives as easy as possible. As such, you can store most configuration data in source control, and we provide built-in profiling and performance tooling.

### Private

We do not host your data with Horde nor receive any telemetry from user deployments. You can host it on a private network, as befits your IT policies, and integrate it with your own OpenID Connect (OIDC) authentication provider to access it.

### Scalable

We distribute full source code for all Horde client and server functionality.

## Getting Started with Horde

Before getting started, download the Horde Windows MSI Installer.

Requires access to the EpicGames GitHub repository. If you need access to the repository, follow the instructions on the UE on GitHub page.

After downloading Horde, we recommend starting with the following tutorials based on your needs:

- Install the Horde agent (-> horde-installation-tutorial-for-unreal-engine)

- Enable remote C++ compilation with Unreal Build Accelerator (-> horde-unreal-build-accelerator-and-remote-compilation-tutorial-for-unreal-engine)

- Set up build automation (-> horde-build-automation-tutorial-for-unreal-engine)

- Enable test automation with Gauntlet (-> horde-test-automation-tutorial-for-unreal-engine)

- Get telemetry and analytics for your team (-> horde-analytics-tutorial-for-unreal-engine)

- Work with mobile and console devices (-> horde-device-manager-tutorial-for-unreal-engine)

- Install UnrealGameSync and distribute Unreal Editor to your team (-> horde-unrealgamesync-tutorial-for-unreal-engine)

- Enable authentication (-> horde-authentication-tutorial-for-unreal-engine)

## Topic Directory

- automation
- unrealgamesync
- horde
- unreal build accelerator
- automation tool
- gauntlet
- unreal build tool

On this page

- Features (-> horde-in-unreal-engine)
- Goals & Philosophy (-> horde-in-unreal-engine)
- Opinionated (-> horde-in-unreal-engine)
- Simple to Deploy (-> horde-in-unreal-engine)
- Easy to Manage (-> horde-in-unreal-engine)
- Private (-> horde-in-unreal-engine)
- Scalable (-> horde-in-unreal-engine)
- Getting Started with Horde (-> horde-in-unreal-engine)
- Topic Directory (-> horde-in-unreal-engine)
