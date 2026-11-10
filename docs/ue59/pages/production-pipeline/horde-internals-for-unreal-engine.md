# Horde Internals

https://dev.epicgames.com/documentation/en-us/unreal-engine/horde-internals-for-unreal-engine?application_version=5.9

> An overview of Horde internals for use with Unreal Engine.

[image: Horde Internals]

## Getting Started

### Server

The source code for the Horde Server is in `Engine/Source/Programs/Horde/Horde.Server`. It is written in C#, using ASP.NET.

Horde uses the standard
C# coding conventions published by Microsoft, though we use tabs rather than spaces for legacy reasons. We enable most static analyzer warnings that ship with the NET SDK, but you may disable some through `.editorconfig` files.

Horde is configured to support local development by default. You can launch it by opening `Engine/Source/Programs/Horde/Horde.sln` and setting Horde.Server as the default project. By default, you can access the server at `http://localhost:5000/account`.

When debugging a local Horde server against a live deployment, setting the `DatabaseReadOnlyMode` property in `Server.json` (-> horde-settings-for-unreal-engine) prevents the server from attempting any operation that modifies the server state. Using a read-only DB account in addition is recommended for safety.

### Dashboard

The Horde dashboard is a frontend client developed in TypeScript using React. To set up your machine for developing the dashboard:

- Install Node.js.

- From a command line, install Yarn using: `npm install --global yarn`.

- Navigate to the dashboard folder at `Engine\Source\Programs\Horde\HordeDashboard`.

- Run `yarn install` to install the package dependencies.

- Edit package.json setting the proxy property to point at your server URL, for example: `http://localhost:13340`.

- Navigate to the admin token endpoint of your server to get an expiring access token, for example: `http://localhost:13340/api/v1/admin/token`.

- Create a file called `.env.development.local` in the root HordeDashboard folder and paste the access token in like so: `REACT_APP_HORDE_DEBUG_TOKEN=eyFhbGciziJIUz`.

- Run `yarn start` to start the development web server which should open a tab to the local dashboard at `http://localhost:3000`.

## Docker

Horde includes a `Dockerfile` for creating Docker images. However, its position in Unreal Engine source tree requires files to be staged beforehand to reduce the size of data copied into build images.

A BuildGraph script to perform these operations is included under `Engine\Source\Programs\Horde\HordeBuild.xml`, which can be run as follows:

```
RunUAT.bat Engine/Source/Programs/Horde/HordeBuild.xml -Target="Build HordeServer"
```

RunUAT.bat Engine/Source/Programs/Horde/HordeBuild.xml -Target="Build HordeServer"

## Topics

- Build Health (-> horde-build-health-for-unreal-engine)

- Storage (-> horde-storage-for-unreal-engine)

- Leases (-> horde-leases-for-unreal-engine)

- Logs (-> horde-logs-for-unreal-engine)

- Structured Logging (-> horde-structured-logging-for-unreal-engine)

- horde
- bronze

On this page

- Getting Started (-> horde-internals-for-unreal-engine)
- Server (-> horde-internals-for-unreal-engine)
- Dashboard (-> horde-internals-for-unreal-engine)
- Docker (-> horde-internals-for-unreal-engine)
- Topics (-> horde-internals-for-unreal-engine)
