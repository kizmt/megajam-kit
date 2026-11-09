# Horde Installation Tutorial

https://dev.epicgames.com/documentation/en-us/unreal-engine/horde-installation-tutorial-for-unreal-engine?application_version=5.9

> A tutorial for installing Horde for use with Unreal Engine.

[image: Horde Installation Tutorial]

## Introduction

This guide describes a simple local Horde server installation on Windows.

Horde can also be installed via Docker on Linux (-> horde-server-for-unreal-engine), both as a single instance and horizontally scaled service via a container orchestration system such as Kubernetes.

For a more detailed discussion of these advanced deployment scenarios, see Horde > Deployment (-> horde-deployment-for-unreal-engine).

## Prerequisites

- A machine to function as the Horde Server.

- One or more machines to function as Horde Agents. We currently recommend dedicated machines for this purpose.

## Steps

### Horde Server

- Install the Horde Server by running `Engine\Extras\Horde\UnrealHordeServer.msi`. The Horde Server can also be deployed on Linux using Docker (-> horde-server-for-unreal-engine).

- By default, Horde is configured to use ports 13340 (HTTP) and 13342 (HTTP/2) (-> horde-server-for-unreal-engine). We recommend setting up HTTPS (-> horde-server-for-unreal-engine) for production deployments.

- See also: Deployment > Server (-> horde-server-for-unreal-engine)

### Horde Agents

- Navigate to the installed Horde Server (-> horde-installation-tutorial-for-unreal-engine) in a web browser on the agent machine. This is typically `http://{{ HOST_NAME_OR_IP_ADDRESS }}:13340` with a default installation.

- Note that the Horde Server defaults to HTTP hosting by default (not HTTPS), so you may need to enter `http://` manually as part of the address.

- Open the **Tools** menu at the top of the dashboard and select **Downloads**.

- Download and run **Horde Agent (Windows Installer)**. Enter the same server address you used above when prompted, and choose an empty working directory for the remote execution sandbox.

- We recommend choosing a drive with at least 100GB of free space for C++ compilation.

- Leave the `Enroll with Server` option checked at the end of the installation, or locate the Unreal icon in the system notification area, right-click on it, and select `Enroll with Server`.

- Choose your agent from the list, and select **Enroll**. This process validates that you trust the agent and permits it to take on work.

- horde
- bronze

On this page

- Introduction (-> horde-installation-tutorial-for-unreal-engine)
- Prerequisites (-> horde-installation-tutorial-for-unreal-engine)
- Steps (-> horde-installation-tutorial-for-unreal-engine)
- Horde Server (-> horde-installation-tutorial-for-unreal-engine)
- Horde Agents (-> horde-installation-tutorial-for-unreal-engine)
