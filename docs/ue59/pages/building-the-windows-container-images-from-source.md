# Building the Windows Container Images from Source

https://dev.epicgames.com/documentation/en-us/unreal-engine/building-the-windows-container-images-from-source?application_version=5.9

> How to build the Windows container images that are included with Unreal Engine from source.

[image: Building the Windows Container Images from Source]

Learn to use this **Beta** feature, but use caution when shipping with it.

All container images that are included with Unreal Engine have prebuilt versions available for download from GitHub Container Registry. It is only necessary to build the images from source if you want to create development images for a custom version of Unreal Engine or to make modifications to the image source code.

## Requirements

To build the Windows container images that ship with Unreal Engine, your computer will need to meet the hardware and software requirements listed in the Windows containers section of the Hardware and Software Requirements (-> hardware-and-software-requirements-for-container-deployments-in-unreal-engine) page.

## Installing Docker

Docker is the recommended tool for building the container images that are included with Unreal Engine. To install Docker, follow the instructions to install Docker Desktop for Windows.

Once Docker Desktop is installed, you will need to switch from Linux containers mode (the default) to Windows containers mode.

## Building the Images

If you have downloaded the Unreal Engine source code from GitHub then you will need to run `Setup.bat` from the root of the source tree to download the engine's binary dependencies, just as you would when building the engine from source. If you do not perform this step then the files required for building container images will be missing.

Navigate to the following subdirectory of the Unreal Engine source code:

Engine/Extras/Containers/Dockerfiles/windows

To build the Windows container images, double-click the `build.bat` file. This will build the Windows runtime image for the same version of Windows that your machine is running.

- beta
- container
- containers
- platform delivery

On this page

- Requirements (-> building-the-windows-container-images-from-source)
- Installing Docker (-> building-the-windows-container-images-from-source)
- Building the Images (-> building-the-windows-container-images-from-source)
