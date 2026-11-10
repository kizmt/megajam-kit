# Online User Interface

https://dev.epicgames.com/documentation/en-us/unreal-engine/online-subsystem-user-interface-in-unreal-engine?application_version=5.9

> Overview of the Online User Interface.

[image: Online User Interface]

The **OnlineUser Interface** is the central repository for all cached information and metadata about users, both remote and local. This interface also provides reverse-lookup functionality, enabling developers to search for user IDs based on their display names or email addresses and map them back to Unreal Engine's native `FUniqueId` system.

## Retrieving and Examining User Metadata

To access user metadata, you must first request and cache that data from the online service. Call `QueryUserInfo` with a list of `FUniqueNetId` values for the users whose information you want, as well as the index of the local user making the request. This is an asynchronous process, and will call a delegate of type `OnQueryUserInfoComplete` when it finishes. After a successful query populates the cache with user information, the `GetAllUserInfo` function will return all collected data. If you have the `FUniqueNetId` of a specific user whose data you want, you can call `GetUserInfo` with that `FUniqueNetId` to get just that user's data.

## Mapping External User IDs

Most online services support searching for users by their display names or email addresses. The OnlineUser Interface mirrors this functionality with `QueryUserIdMapping`, which takes a display name or email address and attempts to map it, through the online service, to an `FUniqueNetId`. Since this procedure involves contacting the online service, it is asynchronous, and will call `FOnQueryUserMappingComplete` upon completion. Unlike most information requests, this function does not update a cache. Instead, when the operation is successful, the delegate's payload will contain the known display name or email address that was searched, and the resulting `FUniqueNetId` that the online service found.

- programming
- online subsystem
- online user interface
- userinfo

On this page

- Retrieving and Examining User Metadata (-> online-subsystem-user-interface-in-unreal-engine)
- Mapping External User IDs (-> online-subsystem-user-interface-in-unreal-engine)
