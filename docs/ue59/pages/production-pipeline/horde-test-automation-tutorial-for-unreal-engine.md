# Horde Test Automation Tutorial

https://dev.epicgames.com/documentation/en-us/unreal-engine/horde-test-automation-tutorial-for-unreal-engine?application_version=5.9

> A tutorial on setting up Horde test automation for Unreal Engine.

[image: Horde Test Automation Tutorial]

## Introduction

The Horde Automation Hub surfaces individual and suite Gauntlet (-> gauntlet-automation-framework-in-unreal-engine) test results. Horde efficiently generates searchable metadata for streams, platforms, configurations, rendering apis, etc. The automation hub is used at Epic by QA, release managers, and code owners to quickly view and investigate the latest test results across platforms and streams. It provides historical data and views which drill into specific test events which can include screenshots, logging, and callstacks.

## Prerequisites

- The Horde Server installed (see the Horde Installation Tutorial (-> horde-installation-tutorial-for-unreal-engine)).

- A Horde Agent with AutoSDK configured (see Engine\Extras\AutoSDK\README.md in the Engine sources)

- The Horde Build example project configured (see the Horde Build Automation Tutorial (-> horde-build-automation-tutorial-for-unreal-engine)).

- An Android phone or tablet added to the Device Manager (see the Horde Device Manager Tutorial (-> horde-device-manager-tutorial-for-unreal-engine)).

## Steps

- The Horde example UE5 project includes a reference template for building, packaging, and testing the Lyra example game project. The build graph for this example is intended to be general purpose and extensible and is a good source of a real world graph used at Epic for automated testing. [image: New Build] From the UE5 project stream view, select the Packaged Build category, and click `New Build`, and then select `Packaged Lyra Build`. Add the Android target platform and click `Start Job` [image: Select Android] Please note that the Device Manager URL field is for example purposes and you would generally set this in the related Gauntlet build graph configuration.

- The job will build, cook, and run a Lyra Boot Test on the Android device, reserving it from the device manager during the process. [image: Automation Labels]

- Once completed the test results will be availble in the Automation Hub (-> horde-automation-hub-for-unreal-engine) which features finely grained filters and views that can cross compare platforms and streams. [image: Test Results]

- horde
- bronze

On this page

- Introduction (-> horde-test-automation-tutorial-for-unreal-engine)
- Prerequisites (-> horde-test-automation-tutorial-for-unreal-engine)
- Steps (-> horde-test-automation-tutorial-for-unreal-engine)
