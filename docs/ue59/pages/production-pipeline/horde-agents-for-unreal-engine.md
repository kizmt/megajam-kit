# Horde Agents

https://dev.epicgames.com/documentation/en-us/unreal-engine/horde-agents-for-unreal-engine?application_version=5.9

> An overview of Horde Agents.

[image: Horde Agents]

## Installing the Horde Agent

For information about deploying new agents, see Horde > Deployment > Agent (-> horde-agent-deployment-for-unreal-engine).

## Pools

Pools are groups of machines that can be used interchangeably, typically due to being a particular platform or hardware class. Pools simplify the management of build pipelines by allowing DevOps engineers to configure a mapping from agent types to physical machines.

Pools are defined in the .globals.json (-> horde-schema-for-unreal-engine) file, via the `pools` property. Agents may be added to a pool manually through the Horde Dashboard or automatically by matching a particular condition. For example, the following configuration block defines a pool that automatically includes all Windows machines:

```
{
    "name": "WinLargeRam",
    "condition": "Platform == 'Win64' && RAM > 64gb"
}
```

{
 "name": "WinLargeRam",
 "condition": "Platform == 'Win64' && RAM > 64gb"
}

See also: Condition expression syntax (-> horde-conditions-for-unreal-engine)

## Remoting to Agents

If you have a fleet of machines that require identical login credentials, you can configure UnrealGameSync to open Remote Desktop sessions from links in the Horde dashboard.

To enable this functionality, open **Credential Manager** from the Windows Control Panel and select **Windows Credentials**. Click the **Add a new generic credential...** link to create a new entry and name it `UnrealGameSync:RDP`. Enter the login username and password as appropriate.

The **Remote Desktop** button on agent dialogs in Horde will open a URL of the form `ugs://rdp?host=[NameOrIP]`. UnrealGameSync is configured to handle `ugs://` links by default, intercepts these links, and adds a Windows login entry for the given `NameOrIP` before launching the remote desktop application.

- horde
- bronze

On this page

- Installing the Horde Agent (-> horde-agents-for-unreal-engine)
- Pools (-> horde-agents-for-unreal-engine)
- Remoting to Agents (-> horde-agents-for-unreal-engine)
