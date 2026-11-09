# Setting Up SMPTE 2110

https://dev.epicgames.com/documentation/en-us/unreal-engine/setting-up-smpte-2110-in-unreal-engine?application_version=5.9

> A guide to setting up and deploying SMPTE 2110 in Unreal Engine

[image: Setting Up SMPTE 2110]

### Setting Up SMPTE 2110 in Unreal Engine

This page contains everything you need to know to set up and deploy SMPTE 2110 in Unreal Engine using Nvidia Rivermax. This guide is intended for users who require high bandwidth SMPTE 2110 functionality, including the Broadcast and Film industry.

## Prerequisites

The following are the hardware and licensing requirements to integrate SMPTE 2110 using NVidia Rivermax:

### Hardware

Rivermax is an SDK developed by NVIDIA that works with Mellanox Connect-X network cards.

Although there are other 2110 producers, Unreal Engine 5.4 SMPTE 2110 features (at the time of publication) specifically require NVIDIA Rivermax.

#### Supported Network Cards

Driving an LED wall requires Bluefield for PTP (precision time protocol) accuracy. The list below describes the network cards (NICs) currently supported by Unreal Engine:

| Network Card (NIC) | Information |
| --- | --- |
| **Connect-X 6 BlueField-2** | We recommend this family of supported NICs, as it has PTP (precision time protocol) accuracy on Windows systems. PTP is required if driving an LED wall. |
| **Connect-X 6** | This family of NICs is supported, but is limited because it does not have PTP accuracy on Windows systems. |
| **Connect-X 5** | This family of NICs is supported by Rivermax SDK, but we do not recommend it for new installations. |

For a more detailed view, see the NVIDIA website (you need an NVIDIA account to view the site).

GPUDirect capabilities are restricted to professional GPUs starting from the 4000 class and up, and require Ampere architecture or a future architecture generation (for example, RTX 6000 Ada, RTX 5000 Ada, RTX 4500 Ada, or RTX 4000 Ada). For a full list of GPUs that support GPUDirect, please refer tothe NVIDIA website.

Additionally, you need a motherboard supporting a resizable bar option, which may require a BIOS firmware update.

### Software

To use Rivermax with Unreal Engine, we recommend you follow the deployment guide found onthe NVIDIA Rivermax website, Windows DPU Deployment (version 2.51).

Bluefield-2 cards are slowly being phased out as of August 2025, and will soon reach end of life.

Bluefield 3 cards work with Rivermax version 1.41.11 and 1.60.6 (Starting from UE 5.5 and 5.6). However, they require a different version of the DPU deployment scripts, and new firmware is installed automatically with the DPU scripts using a Bluefield Bootstream (BFB) file.

#### Bluefield 2

| Unreal Engine Version | Rivermax SDK Version | WinOF-2 Version | DPU Version | Firmware Version |
| --- | --- | --- | --- | --- |
| 5.3 | 1.20.10 | 3.10.52010 | 2.21 | 24.35.1012 |
| 5.4 | 1.41.11 | 24.1.50000 | 2.51 | 24.40.1000 |
| 5.5 | 1.41.11 | 24.1.50000 | 2.51 | 24.40.1000 |
| 5.6 | 1.60.6 | 24.10.50010 | 2.51 | 24.43.1014 |
| 5.7 | 1.71.30 | 24.10.50010 - 25.7.50000 | 2.6.0, 3.0.0, 3.1.0 | 24.43.1014, 24.46.1006 |
| 5.8 | 1.90.18 | 25.7.50000 or later | 3.1.0, 3.3.0 | 24.46.1006 or later |

#### Bluefield 3

| Unreal Engine Version | Rivermax SDK Version | WinOF-2 Version | DPU Scripts Version |
| --- | --- | --- | --- |
| 5.5 | 1.41.11 | 25.4.50020 | 3.0.0 |
| 5.6 | 1.60.6 | 25.4.50020 | 3.0.0 |
| 5.7 | 1.71.30 | 25.7.50000 | 3.0.0, 3.1.0 |
| 5.8 | 1.90.18 | 25.7.50000 or later | 3.1.0, 3.3.0 |

#### Rivermax SDK Installation Path

The default installation path for the RIvermax SDK is ‘C:\Program Files\Mellanox\Rivermax\lib’.

In Unreal Engine **5.4** and onward, in addition to using the default path, you can specify the installation path for the Rivermax SDK using the environment variable `$RIVERMAX_PATH`.

Starting with Unreal Engine **5.6,** you must set an environment variable that specifies an explicit path to your version of the Rivermax SDK.

| nreal Engine Version | Supported Rivermax Version | Environment Variable |
| --- | --- | --- |
| Unreal Engine 5.4 | 1.41.11 | RIVERMAX_PATH |
| Unreal Engine 5.5 | 1.41.11 | RIVERMAX_PATH |
| Unreal Engine 5.6 | 1.60.6 | RIVERMAX_PATH_1_60_6 |
| Unreal Engine 5.7 | 1.71.30 | RIVERMAX_PATH_1_71_30 |
| Unreal Engine 5.8 | 1.90.18 | RIVERMAX_PATH_1_90_18 |

### License

You need a license to use NVIDIA’s Rivermax SDK with Unreal Engine. Contact NVIDIA to obtain a license.

By default, the system expects to find the license next to Rivermax DLL. You can use the environment variable `$RIVERMAX_LICENSE_PATH` to specify a different location (such as a network drive) to look for the license.

## Deployment Steps

When setting up your Rivermax deployment, please refer to Nvidia's official documentation provided with your DPU, and with the Rivermax SDK.

### Optional: GPUDirect Setup

When setting up GPUDirect, make sure that the GPU and the DPU (Mellanox card) are on the same root complex. If they aren't, the SMPTE 2110 packets can be lost, especially if there are multiple input streams.

- Enable the resizable bar option in your BIOS.
- For optimal performance, you should place the Network Card and GPU on the same root complex.
- Validate the BAR1 available memory.Use the Nvidia Control Panel - System information to validate it’s enabled.

- Create a new environment variable to use CUDA with Rivermax.`RIVERMAX_ENABLE_CUDA`
- Set its value to 1.

- During initialization, if the system finds a compatible GPUDirect device, it will initialize the library with this support. If not, it will fall back to the system memory path.

By default, GPU Direct is disabled on input and enabled on output when you are using the Rivermax Plugin.

GPU Direct is supported on both input and output and generally helps reduce the copy time between GPU and CPU. However, in certain hardware configurations it might affect the performance in an adverse way. To enable GPU direct set the following Console Variables:

| GPU Direct Option | Console Variable |
| --- | --- |
| **Global GPUDirect switch** | `Rivermax.GPUDirect=1` |
| **GPUDirect on Input** | `Rivermax.GPUDirectInput=1` |
| **GPUDirect on Output** | `Rivermax.GPUDirectOutput=1` |

- rendering
- graphics

On this page

- Setting Up SMPTE 2110 in Unreal Engine (-> setting-up-smpte-2110-in-unreal-engine)
- Prerequisites (-> setting-up-smpte-2110-in-unreal-engine)
- Hardware (-> setting-up-smpte-2110-in-unreal-engine)
- Supported Network Cards (-> setting-up-smpte-2110-in-unreal-engine)
- Software (-> setting-up-smpte-2110-in-unreal-engine)
- Bluefield 2 (-> setting-up-smpte-2110-in-unreal-engine)
- Bluefield 3 (-> setting-up-smpte-2110-in-unreal-engine)
- Rivermax SDK Installation Path (-> setting-up-smpte-2110-in-unreal-engine)
- License (-> setting-up-smpte-2110-in-unreal-engine)
- Deployment Steps (-> setting-up-smpte-2110-in-unreal-engine)
- Optional: GPUDirect Setup (-> setting-up-smpte-2110-in-unreal-engine)
