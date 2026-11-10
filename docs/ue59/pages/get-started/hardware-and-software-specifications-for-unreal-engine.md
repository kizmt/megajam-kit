# Hardware and Software Specifications

https://dev.epicgames.com/documentation/en-us/unreal-engine/hardware-and-software-specifications-for-unreal-engine?application_version=5.9

> Minimum and recommended hardware specifications and necessary software for developing with Unreal Engine.

This page covers the hardware and software requirements for Unreal Engine (UE5).

## Recommended Hardware

**windows:**

|  |  |
| --- | --- |
| **Operating System** | Windows 11 |
| **Processor** | Quad-core Intel or AMD, 2.5 GHz or faster |
| **Memory** | 32 GB RAM |
| **Graphics RAM** | 8 GB or more |
| **Graphics Card** | DirectX 12 compatible graphics card with the latest drivers. |

> **tip:** Although some features have a minimum requirement of DirectX 11, we recommend DirectX 12 for most games.

**macos:**

| **Recommended Operating System** | Latest macOS Sequoia 14 |
| --- | --- |
| **Recommended Processor** | Apple Silicon M3 |
| **Minimum Processor** | M1 or M2 depending on rendering features |
| **Recommended Memory** | 32 GB or more |
| **Minimum Memory** | 16 GB |
| **Video Card** | Metal 1.2 Compatible Graphics Card |

**linux:**

| **Recommended Operating System** | Ubuntu 22.04 |
| --- | --- |
| **Processor** | Quad-core Intel or AMD, 2.5 GHz or faster |
| **Memory** | 32 GB RAM |
| **Graphics Card** | GeForce 2080 |
| **Graphics RAM** | 8 GB or more |
| **RHI Version** | Vulkan: AMD (RADV minimum 24.2.8+, recommended 25.0.0+) and NVIDIA (570+) |

> **note:** To get the most out of rendering features of Unreal Engine 5, such as Nanite and Lumen, see the Requirements for UE5 Rendering Features section of this page.

## Minimum Software Requirements

Minimum requirements for running the engine or editor are listed below.

**windows:**

| Running the Engine |  |
| --- | --- |
| **Operating System** | Windows 10 Version 22H2 (64-bit) or Windows 10 Enterprise Version 21H2 (64-bit) |
| **DirectX Runtime** | DirectX End-User Runtimes (June 2010) |

**macos:**

| Running the Engine |  |
| --- | --- |
| **Minimum Operating System** | Sonoma 14.5 |

**linux:**

| Running the Engine |  |
| --- | --- |
| **Operating System** | Rocky Linux 8 / Redhat Linux 8 or newer |
| **Linux Kernel Version** | kernel 4.18 or newer |
| **Additional Dependencies** | glibc 2.28 or newer |

> **note:** If either Unreal Editor or installations of UE games take a very long time on startup, check that your `glibc` is version 2.35 or newer, as earlier versions have a slow implementation of `dlopen`.

The requirements for programmers developing with the engine are listed below.

**windows:**

| Developing with the engine |  |
| --- | --- |
| All 'Running the Engine' requirements (automatically installed) |  |
| Visual Studio Version | Use Visual Studio 2026 for general development. Use Visual Studio 2022 for Nintendo development and AGDE below v26.1.102 |

| iOS App Development |  |
| --- | --- |
| iTunes Version | iTunes 12 or higher |

> **tip:** Although Visual Studio is recommended for Windows development, Unreal Engine also supports VS Code and Rider.

## Prerequisite Software Installers

Unreal Engine includes installers for everything you need to run the editor and engine, such as the **Microsoft Visual C++ 2015-2022 Redistributable**.

When you install Unreal Engine through the Epic Games Launcher, the launcher automatically installs these prerequisites for you. However, you may need to run the installers yourself if you build Unreal Engine from source, or if you must prepare a computer with all the Unreal Engine prerequisites for a specific purpose. For example, if you are set up a fresh computer to act as a Swarm Agent (-> unreal-swarm-in-unreal-engine).

You can find the installers in the `Engine/Extras/Redist/en-us` folder under your Unreal Engine installation location.

> **note:** Support for 32-bit platforms was removed in Unreal Engine 5.

If you use Perforce to get the Unreal Engine source code, you can find binaries in the `Engine/Extras/Redist/en-us` folder of the Perforce repository.

To learn more about Visual Studio, see Setting Up Visual Studio (-> setting-up-visual-studio-development-environment-for-cplusplus-projects-in-unreal-engine).

**macos:**

| Developing with the Engine |  |
| --- | --- |
| **Recommended Xcode Version** | Xcode 26.1.1 |
| **Minimum Xcode Version** | Xcode 26.0 |

> **warning:** Xcode 26.4 is not compatible with Unreal Engine.

> **tip:** Although Xcode is preferred for macOS development, Unreal Engine also supports VS Code and Rider.

**linux:**

| Developing with the Engine |  |
| --- | --- |
| **Operating System** | Ubuntu 22.04, Rocky Linux 8 |
| **Compiler** | clang 20.1.8 |
| Optional |  |
| **IDE** | Visual Studio Code, Rider |

## Graphics Card Drivers

We currently recommend using the latest stable releases from each card manufacturer:

- Download NVIDIA drivers here

- Download AMD drivers here

- Download Intel drivers here

**windows:**

## Performance Notes

The spec below represents a typical system used at Epic Games (a Lenovo P620 Content Creation Workstation, standard version). This provides a reasonable guideline for developing games with Unreal Engine 5.

- Operating System: Windows 11

- Power Supply: 1400W Power supply unit

- RAM: 256 GB DDR5-4800MHz (RDIMM, ECC)

- Processor: AMD Ryzen™ Threadripper™ PRO 7985WX Processor (3.20 GHz up to 5.10 GHz)

- OS Drive: 2 TB SSD M.2 2280 PCIe Gen4 Performance TLC Opal

- DATA Drive: 4 TB SSD M.2 2280 PCIe Gen4 Performance TLC Opal

- GPU: NVIDIA RTX™ 4080 16GB GDDR6

- NIC: AMD RZ616

- TPM Compliant

**linux:**

## Performance Notes

The spec below represents a typical system used at Epic (a Lenovo P620 Content Creation Workstation, standard version). This provides a reasonable guideline for developing games with Unreal Engine 5:

- Operating System: Ubuntu 22.04

- Power Supply: 1000W power supply unit

- RAM: 128GB DDR4-3200

- Processor: AMD Ryzen Threadripper Pro 3975WX Processor - 128MB Cache, 3.5 GHz base / 4.2 GHz turbo, 32 Cores / 64 Threads, 280w TDP

- OS Drive 1 TB M.2 NVMe3 x4 PCI-e SSD

- DATA Drive 4 TB Raid Array - 2 x 2TB NVMe3 x4 PCI-e SSD in Raid 0

- GPU: Nvidia RTX 3080 - 10GB

- NIC 1GBPS on-board + Intel X550-T1 10G PCI-e Ethernet adapter

- TPM Compliant

> **note:** We recommend Unreal Build Accelerator (UBA) for distributed compilation. UBA can be used alongside other distributed build providers. If you're not using a distributed build solution, a machine with at least 12 to 16 cores is a practical local-compile baseline — additional cores continue to help, which is part of why the reference workstation above uses a significantly higher core count to support full editor, asset, and build workflows.

## Requirements for UE5 Rendering Features

Some rendering features of Unreal Engine have different requirements than the minimum specifications.

**windows:**

| UE5 Feature | System Requirements |
| --- | --- |
| **Lumen Global Illumination, Lumen Reflections, and MegaLights** | - Windows 10 build 1909.1350 and newer with DirectX 12 support. - **SM6** must be enabled in the Project Settings. - One of the following graphics cards: - AMD RX-6000 series or newer. - Intel® Arc™ A-Series Graphics Cards or newer. - NVIDIA RTX-2000 series or newer. > **note:** Lumen Hardware Ray Tracing now requires SM6 to be set in Project Settings. To learn more, see Lumen Technical Details (-> lumen-technical-details-in-unreal-engine). |
| **Nanite Virtualized Geometry and Virtual Shadow Maps** | - All versions of Windows 10 build 1909.1350 and newer, and Windows 11 with support forDirectX 12 Agility SDK are supported. - Windows 10 version 2004 and 20H2 — The revision number should exceed or be equal to .789. - DirectX 12 (with Shader Model 6.6 atomics), or Vulkan (VK_KHR_shader_atomic_int64). - **SM6** must be enabled in the Project Settings. (On by default in new projects.) - Windows 10 version 1909 — The revision number should exceed or be equal to .1350. - Latest graphics drivers. To learn more, see Nanite Virtualized Geometry (-> nanite-virtualized-geometry-in-unreal-engine) and Virtual Shadow Maps (-> virtual-shadow-maps-in-unreal-engine). |
| **Temporal Super Resolution** | Runs on any video card that supports Shader Model 5, but the limit of 8UAVs per shader has performance implications. Temporal Super Resolution shaders compile with 16bit types enabled on D3D12 that supports Shader Model 6. To learn more, see Temporal Super Resolution (-> temporal-super-resolution-in-unreal-engine). |

**macos:**

| UE5 Feature | System Requirements |
| --- | --- |
| **Lumen Global Illumination and Reflections with Software Ray Tracing** | Apple computers with an Intel and AMD Based GPU and/or Apple Silicon M1+. To learn more, see Lumen Technical Details (-> lumen-technical-details-in-unreal-engine). |
| **Lumen Global Illumination and Reflections with Hardware Ray Tracing and MegaLights** | Not currently supported. To learn more, see Lumen Technical Details (-> lumen-technical-details-in-unreal-engine). |
| **Nanite Virtualized Geometry and Virtual Shadow Maps** | Apple Silicon M2+ (beta support). To learn more, see Nanite Virtualized Geometry (-> nanite-virtualized-geometry-in-unreal-engine). |
| **Temporal Super Resolution** | Apple computers with an Intel and AMD Based GPU and/or Apple Silicon M1+. To learn more, see Temporal Super Resolution (-> temporal-super-resolution-in-unreal-engine). |

To learn more about macOS development in Unreal Engine, see MacOS (-> developing-macos-projects-in-unreal-engine).

**linux:**

| UE5 Feature | System Requirements |
| --- | --- |
| **Lumen Global Illumination, Lumen Reflections, and MegaLights** | - **SM6** must be enabled in the Project Settings. - One of the following graphics cards: - NVIDIA RTX-2000 series or newer. - AMD RX-6000 series or newer. - Intel® Arc™ A-Series Graphics Cards or newer. > **note:** Lumen Hardware Ray Tracing now requires SM6 to be set in Project Settings. To learn more see, Lumen Technical Details (-> lumen-technical-details-in-unreal-engine). |
| **Path Tracing** | - **SM6** must be enabled in the Project Settings. - One of the following graphics cards: - NVIDIA RTX-2000 series or newer. - AMD RX-6000 series or newer. To learn more, see Path Tracer (-> path-tracer-in-unreal-engine). |
| **Nanite Virtualized Geometry and Virtual Shadow Maps** | - GPU which supports the VK_KHR_shader_atomic_int64 Vulkan extension. - **SM6** must be enabled in the Project Settings. (On by default in new projects.) - Latest Graphics Drivers. To learn more see, Nanite Virtualized Geometry (-> nanite-virtualized-geometry-in-unreal-engine) and Virtual Shadow Maps (-> virtual-shadow-maps-in-unreal-engine). |

To learn more about Linux development in Unreal Engine, see Linux Development Requirements (-> linux-development-requirements-for-unreal-engine)
