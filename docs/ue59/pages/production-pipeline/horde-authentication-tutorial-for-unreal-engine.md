# Horde Authentication Tutorial

https://dev.epicgames.com/documentation/en-us/unreal-engine/horde-authentication-tutorial-for-unreal-engine?application_version=5.9

> A tutorial for authenticating Horde for use with Unreal Engine.

[image: Horde Authentication Tutorial]

## Introduction

Horde ships with authentication disabled by default to make it easier to demonstrate and experiment with. Most production deployments will probably want users to log in, and restrict the actions they can perform based on their role.

To do this, Horde supports **OAuth2** and **OIDC**, which is supported by most third party identity providers - including Okta, AWS, Azure, and Google. Configuring an external identity provider is out of scope for this documentation, though the relevant configuration points are touched on in the Deployment > Server (-> horde-server-for-unreal-engine) page.

If you don't have an existing OIDC-compatible identity provider, Horde includes its own - which this guide covers.

## Prerequisites

- Horde Server installation (see the Horde Installation Tutorial (-> horde-installation-tutorial-for-unreal-engine)).

- A valid certificate, and HTTPS support (-> horde-server-for-unreal-engine) enabled on your server.

## Steps

- In your server.json (-> horde-orientation-for-unreal-engine) file set the `AuthMode` property to `Horde`, and restart the server.

- The first time you launch the server, you'll be prompted to enter an administrator password.

- After logging in, there will be an `Accounts` menu item in the `Server` menu. From here, you can manage the users allowed to log in to the server, and the claims (-> horde-glossary-for-unreal-engine) that they have. Horde's account system uses the `http://epicgames.com/ue/horde/group` claim for groups that a user belongs to, and the dashboard will suggest and autocomplete any groups found in the deployment's configuration files.

There are two standard groups defined in the server's `default.globals.json` file, which is included from the standard `globals.json` file by default: `View` and `Run`.

```
"acl": {
    "entries": [
        {
            "claim": {
                "type": "http://epicgames.com/ue/horde/group",
                "value": "View"
            },
            "profiles": [
                "default-read"
            ]
        },
        {
            "claim": {
                "type": "http://epicgames.com/ue/horde/group",
                "value": "Run"
            },
            "profiles": [
                "default-run"
            ]
        }
    ]
}
```

"acl": {
 "entries": [
 {
 "claim": {
 "type": "http://epicgames.com/ue/horde/group",
 "value": "View"
 },
 "profiles": [
 "default-read"
 ]
 },
 {
 "claim": {
 "type": "http://epicgames.com/ue/horde/group",
 "value": "Run"
 },
 "profiles": [
 "default-run"
 ]
 }
 ]
}

The `default-read` and `default-run` profiles are defined in code (`AclConfig.cs`). You can define your own profiles within the `profiles` element of each AclConfig (-> horde-schema-for-unreal-engine) object.

- horde
- bronze

On this page

- Introduction (-> horde-authentication-tutorial-for-unreal-engine)
- Prerequisites (-> horde-authentication-tutorial-for-unreal-engine)
- Steps (-> horde-authentication-tutorial-for-unreal-engine)
