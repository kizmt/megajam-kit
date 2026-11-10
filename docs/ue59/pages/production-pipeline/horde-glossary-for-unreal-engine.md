# Horde Glossary

https://dev.epicgames.com/documentation/en-us/unreal-engine/horde-glossary-for-unreal-engine?application_version=5.9

> A glossary of terms for Horde for use with Unreal Engine.

[image: Horde Glossary]

 access control list (ACL)

Abbreviation for access control list. An ACL in Horde defines rules that grant entitlements to users (that is, the ability to perform certain actions) based on claims that their user has.

 ACL action

The ability to perform a certain operation on an entity in Horde, such as `ViewJob` or `DownloadTool`. See Config > Schema > AclActions (-> horde-schema-for-unreal-engine) for a full list.

 ACL profile

A list of actions that can be given to a user, without having to list each individual action each time. Similar to a macro.

 ACL scope

Used to refer to a layer within Horde's hierarchical permissions system. Jobs are an ACL scope within a stream, which are an ACL scope within a project, which is an ACL scope within the global permissions scope. Entitlements to perform actions are typically inherited from parent to child scopes, unless explicitly forbidden by setting the `inherit` property in an AclConfig (-> horde-schema-for-unreal-engine) to false.

 agent

An agent can represent either a player or a non-player character (NPC).

In Horde, a service on a remote machine that connects to the Horde server and can be sent work to execute.

 aggregate

A name given to a set of nodes within a graph as a shorthand.

 analytics

Umbrella term for data gathering and analysis.

 backend

The underlying storage provider for a particular namespace. Horde supports many types backends, from local disks to cloud object stores.

 blob

An opaque byte stream and set of outward references to other blobs.

 BuildGraph Glossary

Epic Games' scripting language for large-scale build pipelines (for example, compiling, cooking, and packaging a game to run on multiple platforms). Describes a parameterized dependency graph between nodes that produce artifacts. Epic uses BuildGraph internally to make Unreal Engine and Fortnite builds, and run all the automation around them. Horde executes BuildGraph scripts in jobs, which are created from templates.

 bundle

A container for a set of blobs that is written to the underlying storage system. Bundles support compression and reduce the overhead of storing small objects.

 claims

A key/value string pair that makes a statement about that user. Claims are part of the OAuth2 standard, and identity providers maintain a list of unique claims for a user. To prevent collisions between different applications, keys typically use a URI with an owned domain name to ensure global uniqueness, though the URI does not identify an actual web resource. Horde's internally issued claims all begin with `http://epicgames.com/ue/horde`.

 continuous delivery (CD)

Continuous delivery, or CD, is the process of continually producing new builds of a product through build automation.

 continuous integration (CI)

The process of continually validating a stream of changes submitted to a codebase through build automation.

 entitlement

The ability of a user to perform a certain action.

 job

An instance of a template run on a particular changelist with certain parameters.

 job batch

A set of steps within a job that are run sequentially on a single machine (in a lease) using a synced workspace. Steps within the batch may or may not have dependencies on each other.

 job step

A unit of work that can pass or fail, tracking the execution of a node.

 label

Annotates a set of nodes whose outcomes can be monitored as a single unit. Labels are displayed prominently on the Horde dashboard, showing information on which parts of a build have succeeded or failed.

 lease

A unit of work that an agent is given to execute.

 metrics

Aggregated data computed from telemetry events matching a set of configured criteria for a particular time interval.

 namespace

A logical partition of the storage system that can have custom permissions, behaviors, and garbage collection policies.

 node

In **UEFN**, a node is a fundamental unit within a graph-based system that represents a specific function, operation, or data point. In the context of node graphs, a node is an individual component that processes or routes audio signals, such as a sound source, effect (like reverb or delay), mixer, or output.

For **Verse**, see linked list node.

In **UE**, a unit of work within a BuildGraph script. Each node could have dependencies on any other nodes or build outputs, and executes a sequence of operations to produce its outputs. A node is executed as a job step.

 preflight

A build run to test the contents of changes before submitting via a Perforce shelf.

 presubmit

A suite of tests designed to run before users submit changes.

 ref

A named reference to a blob. Refs are typically the entry point into the storage system for client applications. Blobs that are not directly or indirectly referenced through a ref are garbage collected.

 target

Specifies the nodes and aggregates within a BuildGraph script a user wishes to execute.

 telemetry

Individual events sent by an application to the Horde server. Horde processes telemetry events as schema-less JSON objects.

 template

Describes the options for running a particular BuildGraph script and specifies parameters for how to execute it.

- horde
- bronze
