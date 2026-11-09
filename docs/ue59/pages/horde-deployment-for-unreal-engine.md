# Horde Deployment

https://dev.epicgames.com/documentation/en-us/unreal-engine/horde-deployment-for-unreal-engine?application_version=5.9

> An overview of deploying Horde for use with Unreal Engine.

[image: Horde Deployment]

Horde is designed to be scalable and can be deployed in many different configurations depending on need. This page describes the system architecture of Horde, the various components that make it up, and the external services that it interfaces with.

## Components

Horde requires the following components:

- **Horde Dashboard** A web frontend for Horde written in Typescript using React. The dashboard can be hosted by the regular Horde Server or a separate web server.

- **Horde Server** The core server code, written in C# / ASP.NET. It can be deployed in isolation or as a horizontally scaled service with multiple instances behind a load balancer. Supported on Windows and Linux.

- See: Deployment > Server (-> horde-server-for-unreal-engine)

- **Horde Agent** Software that runs on worker machines and executes tasks assigned to it by the Horde server. Written in C# / NET. Supported on Windows, Mac, and Linux.

- See: Deployment > Agent (-> horde-agent-deployment-for-unreal-engine)

- **MongoDB** database (or compatible) A document database used to track and persist Horde state, such as jobs, users, agents, and so on. Unless configured otherwise, Horde will automatically create a local MongoDB database on startup.

- Standalone or hosted instances of MongoDB are available from MongoDB, Inc. Compatible hosted products are also available from Amazon (DocumentDB) and Microsoft (Azure CosmosDB).

- **Redis** database (or compatible) An in-memory database used to cache frequently accessed states between server instances, and provide pub/sub services for intra-server communication. Unless configured otherwise, Horde will automatically start a local Redis instance on startup.

- Standalone (or hosted) instances of Redis are available from Redis Labs. Compatible hosted products are also available from Amazon (ElastiCache) and Microsoft (Azure Cache for Redis).

- **Storage** Horde can use a local disk, network share, or cloud-based object store (for example, AWS S3, Azure Blob Store) for storing intermediate and output artifacts, log files, and cache data. You can implement other backends through the `IStorageBackend` interface. By default, Horde stores data locally on the server machine.

## Integrations

- **Slack** Horde supports sending notifications to Slack out of the box, though other backends can be supported through the `INotificationSink` interface.

- See: Deployment > Integrations > Slack (-> horde-integrations-for-unreal-engine)

- **Perforce** Horde supports Perforce for revision control in a CI setting and supports reading configuration data directly from it.

- See: Deployment > Integrations > Perforce (-> horde-integrations-for-unreal-engine)

- **Jira** Horde has a system for tracking and triaging build health issues but can interface with an external issue service if desired. Horde ships with support for Jira, though you can implement other backends through the the `IExternalIssueService` interface.

Support for services mentioned above is the result of what Epic Games uses internally. Support might change in the future and should not be taken as an endorsement or non-endorsement of particular products.

## Epic Games' Horde Deployment

Epic Games' internal deployment of Horde is hosted on AWS and consists of the following:

- Amazon Load Balancer for SSL termination and routing

- 2 Linux containers serving the dashboard managed by Amazon ECS (0.25 vCPU, 0.5GB RAM each)

- 10 Horde Server instances configured with the 'Server' runmode (-> horde-settings-for-unreal-engine), running in Linux containers managed by Amazon ECS (4 vCPU, 16GB RAM each) These instances handle lightweight user-facing requests.

- 2 Horde Server instances configured with the 'Worker' runmode (-> horde-settings-for-unreal-engine), running in Linux containers managed by Amazon ECS (4 vCPU, 16GB RAM each) These instances handle heavier scheduled tasks, such as replicating Perforce metadata, reading and updating config state, and starting scheduled jobs.

- Amazon DocumentDB (compatible with MongoDB)

- Amazon ElastiCache (compatible with Redis)

- Several hundred EC2 instances running AMIs containing the Horde agent.

- Around 100 machines hosted on-premise to provide access to mobile devices, consoles, and unhosted platforms (for example, Mac).

- horde
- bronze

On this page

- Components (-> horde-deployment-for-unreal-engine)
- Integrations (-> horde-deployment-for-unreal-engine)
- Epic Games' Horde Deployment (-> horde-deployment-for-unreal-engine)
