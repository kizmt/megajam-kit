# Image Sequence Mipmapping

https://dev.epicgames.com/documentation/en-us/unreal-engine/image-sequence-mipmapping-in-unreal-engine?application_version=5.9

> This document provides an overview of using mipmapping for image sequences.

## Introduction

This document provides an overview of using mipmapping for image sequences.

> **tip:** As of 5.1, you can use the Process EXR tool (-> convert-media-into-the-exr-format-with-the-process-exr-tool-in-unreal-engine) to generate `.exr` files with the correct settings to use with the Media Plate Actor

## Mipmaps

Mipmaps are used in image sequences to reduce the amount of data loaded in.

Mipmaps are not imported into the Engine as a normal texture, therefore there will not be a UAsset created for the EXR mipmaps. Due to this behavior, the mip levels need to be generated manually before using them in the Engine. See Using Nuke and Python Scripts to Create EXR Mipmaps (-> image-sequence-mipmapping-in-unreal-engine) for how to generate your own mipmaps.

### Limitations

- Only EXR files are supported at this time.

- Anisotropic mips are not supported.

- Reduction of data loaded in is achieved by only loading the required mip levels.

- For GPU optimized streaming into Unreal, all EXR Image Sequences should be uncompressed.

- You will only get GPU acceleration for loading EXRs if they are uncompressed.

- All mip levels need to be either compressed or un-compressed. Having one level compressed and another uncompressed will break the chain.

## File Directory Structure

The mipmap file directory structure should look like this, which follows the Cineon naming convention and is the industry standard.

```cpp_programming
Smoke_Element/2048x2048/Smoke_Element.00001.exr
	Smoke_Element/1024x1024/Smoke_Element.00001.exr
	Smoke_Element/512x512/Smoke_Element.00001.exr
```

File and folder names must follow these rules:

- All folder names need to be a power of two, for example 1024x512.

- Mip level images should be named exactly the same as the source image.

## Editor Setup

To use the mipmap functionality, the `ImgMediaPlayback` component must be added to all objects that display the images. If the component is not present on an object, then the object will not be used in determining what mip levels should be used.

You can enable debugging with the following console command:

`ImgMedia.MipMapDebug 1`

This will display which mip level each image sequence is currently using.

## Mip Level Selection

Mip levels are selected based on an estimated pixel to texel density for each object displaying the image.

The camera position is used for these calculations, so fast moving cameras can introduce more errors in the estimation. Further work could improve the estimation and take camera movement into account.

The mip level selected can be manually adjusted with the **LODBias** setting on the `ImgMediaPlayback` component.

## Using Nuke and Python Scripts to Create EXR Mipmaps

Nuke and Python scripts are available to aid you in the auto-generation of your mip levels. Each script is available for both downloading and viewing on this page.

nukeMipMap.py is a Python script you can run in Nuke that will set up the proper LOD generating tree.

- To use the script, select your EXR sequence, then set the number of mip levels desired.

- At the top of the script, select the read nodes you want to create mip maps for, and execute.

- All the necessary reformats and write nodes will be created for you in Nuke.

- All the necessary resolution folders for each mip render will be created for you.

- The paths of the mip renders will be based on the selected read node on execution.

nukeMipMap.py

```cpp_programming
# All sequences need to live in a folder named after the resolution of the images.
	# Example - D:/Perforce/EXR_Sequences/Smoke/2048x2048/
	            D:/Perforce/EXR_Sequences/Smoke/1024x1024/
				D:/Perforce/EXR_Sequences/Smoke/512x512/

	# For GPU optimized streaming into Unreal all Exr image Sequences should be uncompressed.
	# You will only Get GPU acceleration for loading Exr files if they are uncompressed.
	# For faster loading into Unreal, the uncompressed format is preferable.
	# All mip levels need to be either compressed or uncompressed. Having one level compressed and another uncompressed will break the chain.
	# All mip levels need to be named exactly the same as the source.
```
(88 more lines on the web page)

Unreal_ExrMipMap_GenerationExample.nk is an example Nuke script with a tree already created for you. It demonstrates what folder structure is required for the mipmapping to generate the proper LOD scaling and displays the write node configuration without compression.

Unreal_ExrMipMap_GenerationExample.nk

```cpp_programming
#! C:/Program Files/Nuke12.0v3/nuke-12.0.3.dll -nx
	version 12.0 v3
	define_window_layout_xml {<?xml version="1.0" encoding="UTF-8"?>
	<layout version="1.0">
		<window x="-1" y="-8" w="2560" h="1377" maximized="1" screen="0">
			<splitter orientation="1">
				<split size="40"/>
					<dock id="" hideTitles="1" activePageId="Toolbar.1">
					<page id="Toolbar.1"/>
					</dock>
```
(165 more lines on the web page)

The generated image below displays an example screenshot of the `Unreal_ExrMipMap_GenerationExample.nk` script.

autoGenEXR_mipmap.py is a script for users who do not have Nuke. This Python script will automatically create the necessary folders in addition to scaling and writing out the mip levels to the disk.

> **warning:** In order for this script to work, you will need to install the following free python modules numpy,opencv, and shutil.

autoGenEXR_mipmap.py

```cpp_programming
import os
	os.environ["OPENCV_IO_ENABLE_OPENEXR"]="1"
	import cv2 as cv
	import numpy as np
	import glob
	import shutil

	setMipLevel = 3
	fileInDir = glob.glob("C:\\Users\\User\\Desktop\\smokeCards\\*.exr")
```
(56 more lines on the web page)
