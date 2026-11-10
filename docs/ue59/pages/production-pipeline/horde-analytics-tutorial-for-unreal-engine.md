# Horde Analytics Tutorial

https://dev.epicgames.com/documentation/en-us/unreal-engine/horde-analytics-tutorial-for-unreal-engine?application_version=5.9

> A tutorial for using Horde analytics with Unreal Engine.

[image: Horde Analytics Tutorial]

## Introduction

**Horde** implements a telemetry collector which can receive and process events sent by the Unreal Editor.

Horde aggregates telemetry events into **metrics** for discrete time intervals, which can then be charted by the Horde dashboard to give valuable insights into the bottlenecks experienced by your team.

 [image: Analytics]

## Prerequisites

- Horde Server installation (see Getting Started: Install Horde (-> horde-installation-tutorial-for-unreal-engine)).

- An Unreal Engine project targetting Unreal Engine 5.5 or later.

## Steps

- Open your project in the Unreal Editor and go to the `Edit > Plugins` menu. Search for the `Studio Telemetry` plugin and make sure it is enabled. It should be enabled by default.

- Open your project's `DefaultEngine.ini` file (in the `Config` folder next to your `.uproject` file) and add the following lines: ```
     [StudioTelemetry.Provider.HordeAnalytics]
     Name=HordeAnalytics
     ProviderModule=AnalyticsET
     UsageType=EditorAndClient
     APIKeyET=HordeAnalytics.Dev
     APIServerET="http://localhost:13340/"
     APIEndpointET="api/v1/telemetry/engine"
``` [StudioTelemetry.Provider.HordeAnalytics] Name=HordeAnalytics ProviderModule=AnalyticsET UsageType=EditorAndClient APIKeyET=HordeAnalytics.Dev APIServerET="http://localhost:13340/" APIEndpointET="api/v1/telemetry/engine" Make sure to replace the value for `APIServerET` with the address of your Horde Server.

- Configure a telemetry store to aggregate metrics from your telemetry events. There are some default metrics and charts included with the Horde installation, which can be added by adding the following snippet to your globals.json (-> horde-orientation-for-unreal-engine) file: ```
         // Define the 'Engine' telemetry store and create some standard metrics within it.
         "telemetryStores": [
             {
                 "id": "engine",
                 "include": [
                     {
                         "path": "$(HordeDir)/Defaults/default-metrics.telemetry.json"
                     }
                 ]
             }
         ],

         // Configure a default dashboard to render them
         "dashboard": {
             "include": [
                 {
                     "path": "$(HordeDir)/Defaults/default-analytics.dashboard.json"
                 }
             ]
         },
``` // Define the 'Engine' telemetry store and create some standard metrics within it. "telemetryStores": [ { "id": "engine", "include": [ { "path": "$(HordeDir)/Defaults/default-metrics.telemetry.json" } ] } ], // Configure a default dashboard to render them "dashboard": { "include": [ { "path": "$(HordeDir)/Defaults/default-analytics.dashboard.json" } ] },

## See Also

- Configuration > Analytics (-> horde-analytics-for-unreal-engine)

- horde
- bronze

On this page

- Introduction (-> horde-analytics-tutorial-for-unreal-engine)
- Prerequisites (-> horde-analytics-tutorial-for-unreal-engine)
- Steps (-> horde-analytics-tutorial-for-unreal-engine)
- See Also (-> horde-analytics-tutorial-for-unreal-engine)
