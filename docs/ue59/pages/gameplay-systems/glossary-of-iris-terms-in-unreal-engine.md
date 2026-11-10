# Glossary of Iris Terms

https://dev.epicgames.com/documentation/en-us/unreal-engine/glossary-of-iris-terms-in-unreal-engine?application_version=5.9

> Glossary page for Iris terminology.

[image: Glossary of Iris Terms]

Learn to use this **Experimental** feature, but use caution when shipping with it.

Iris introduces several new concepts to Unreal Engine's (UE) replication system. This page is a glossary of terms that are used frequently when referring to the organization and operation of the Iris replication system.

## Glossary

 actor replication bridge

The actor replication bridge implements the replication bridge interface. The actor replication bridge constructs replication protocols and replication instance protocols from actors and actor components. It also implements code to poll state data from properties and issue required legacy callbacks.

 changemask

A changemask is a bit array used to track dirtiness of replicated data. Iris uses changemasks in two ways:

- All replication states have inlined storage used for local, cache-friendly tracking of changed members.
- The replication system maintains combined changemasks for all replication states in replication protocols.

 data stream

A data stream is the Iris equivalent of a data channel in the generic replication system. Data streams are responsible for serializing data. You can also use a data stream to implement specific data delivery guarantees for different types of data.

 fast array replication fragment

A fast array replication fragment is the owning object for a fast array replication state. This is a specific implementation of a replication fragment for fast arrays.

 net bit stream reader

A net bit stream reader facilitates efficient deserialization of bits from a memory buffer.

 net blob

Net blob is the base class for something that can be replicated with an object. There is currently nothing outside of Iris itself that makes use of it, but you can use them to send most types of data or events, for example, debug data or RPCs.

 net object

A net object is the internal, networking representation of a replicated object instantiated in gameplay code. A net object is associated with a unique net ref handle and an internal index.

 net ref handle

A net ref handle is a unique identifier for an object on both the server and clients similar in concept to a NetGUID (Network Globally Unique Identifier). Net handles are used for object references to statically addressable objects and replicated objects.

 net ref handle manager

The net ref handle manager assigns internal IDs and state storage for all net objects.

 net RPC

A net blob implemented specifically to handle standard RPCs.

 net RPC handler

The net RPC handler processes the logic involved in creating and handling received RPCs. For example, the net RPC handler determines whether an actor is still valid to call an RPC on.

 net token

A net token is a network object for various types of data that are not necessarily directly related to networking, but you may still want to be able to communicate between server and client. Examples of what can be expressed as a new token include strings, data blobs and packages.

You can communicate token data to clients either explicitly using a net token data stream, loaded at startup, or exported during serialization. You can query the net token manager for the status of all tokens on the remote end.

 net token data stream

The net token data stream serializes net token data.

 object reference cache

The object reference cache stores references to replicated and statically named `UObject`s. This works in a similar way as the NetGUID cache and client package map.

 property replication fragment

A property replication fragment is the owning object for a property replication state.

 property replication state

A property replication state is a dynamic replication state used to interact with the current reflection system.

 replication bridge

The replication bridge transfers data between gameplay code and networking code. The replication bridge provides the type specific interface for the game and has functionality to create replication protocols and replication instance protocols from the data. The replication bridge is also responsible for instantiating gameplay objects, such as actors and other supported types, upon request from the replication system.

 replication data stream

The replication data stream is responsible for serializing and deserializing replication data. The implementation is split into two parts: replication reader and replication writer.

 replication fragment

A replication fragment is an owning object for a replication state. To transfer data back and forth between the replication system and gameplay code, replication states must be bound to an owning object. Replication fragments serve as this owning object for replication states.

 replication instance protocol

A replication instance protocol is created for each object instance. It is an array of all replication fragments for an instance and is used whenever state data is exchanged between gameplay code and the replication system.

 replication protocol

A replication protocol defines how to replicate data for an object. A replication protocol is an array of all replication states describing the data to be replicated.

 replication reader

A replication reader is an internal system responsible for incoming data. It drives the deserialization and state application using the replication bridge.

 replication record

A replication record is a list of in-flight data from the replication writer. A key aspect of the replication writer is to track all in-flight data. This is done so that steps can be taken to act accordingly and efficiently if data is lost or delivered. The replication record maintains linked lists for all objects with data in-flight that is still pending delivery notification.

 replication state

A replication state is a struct containing data that should be replicated or transmitted over the network.

 replication state descriptor

A replication state descriptor describes all aspects of a replication state including memory layout for internal and external representations, how to serialize each member of the state, and re representations.

 replication state descriptor builder

A replication state descriptor builder builds replication state descriptors for all supported types based on reflection data.

 replication system

The replication system is the primary interface for interacting with Iris in gameplay code.

 replication system internal

The replication system internal is the internal interface for the replication system and is only exposed to internal Iris code.

 replication writer

A replication writer is responsible for tracking and serializing the state of all replicated objects for all connections. This includes scheduling replication data based on priority, scheduling priority, and replication status of replicated objects; dependencies; subobjects; and serialization.

 typed replication state

A typed replication state is a replication state based on a struct with accessors for all members and internal members to store the ID of the owning net object along with a bit field that tracks the dirtiness for each member.

- experimental
- multiplayer
- networking
- iris

On this page

- Glossary (-> glossary-of-iris-terms-in-unreal-engine)
