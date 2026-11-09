# Color Management with OpenColorIO

https://dev.epicgames.com/documentation/en-us/unreal-engine/color-management-with-opencolorio-in-unreal-engine?application_version=5.9

> Ensure color consistency across projects with OpenColorIO.

[image: Color Management with OpenColorIO]

Unreal Engine 5 supports OCIO v2. For more information about the features included in OCIO v2, refer to the OCIO documentation.

OpenColorIO (**OCIO**) is a color management system used primarily in film and virtual production. OCIO guarantees the colors of captured video remain consistent through the entire film pipeline. This pipeline includes initial camera capture, all the compositing applications that need to work with the captured media, and the final render.

**Unreal Engine** (UE) offers support for using OCIO to convert the colors of linear media in several ways:

- When you use media sources like captured clips or live feeds in your project, you can apply color conversion to make those media sources match your computer-generated elements in UE.
- You can use OCIO to apply color conversions to your Viewport and Play in Editor (PIE) windows. This means your reference frames in the editor will be consistent with your chosen color space.
- You can re-apply another color conversion to the composited feed you output from Composure (-> realtime-compositing-with-composure-in-unreal-engine). This helps make your CG elements and live frames blend more convincingly, while preserving the colors of the original shots faithfully.
- You can use Displays and Views to apply color conversions to multiple physical or virtual display devices from the same OCIO configuration.
- You can apply color space transformations to nDisplay (-> rendering-to-multiple-displays-with-ndisplay-in-unreal-engine) renders on monitors and LED walls.
- When you export a video through Movie Render Queue (-> movie-render-pipeline-in-unreal-engine), you can apply a color space transformation to your output video or image sequence.

All OCIO features in the engine rely on an **OpenColorIO Configuration Asset**, which you use to manage the color profiles that you want to work with.

The OpenColorIO Configuration Asset references an OCIO configuration (`.ocio`) file, which contains detailed specifications about multiple color profiles and how to transform between them. UE currently supports OCIO v2. For more details on OCIO configuration files, refer to the OpenColorIO v2 documentation.

This page contains links to documentation about creating an OpenColorIO Configuration Asset and applying color transformations in the engine.

## Quick Start

This page guides you through creating an OpenColorIO Configuration Asset.

- [image: OpenColorIO Quick Start] OpenColorIO Quick StartCreate OpenColorIO Configuration Assets from OpenColorIO configuration files. (-> opencolorio-quick-start-for-unreal-engine)

## Converting Colors in the Viewport

The Editor supports applying OCIO color conversions to the Level Viewport through **Viewport View Modes** and to Play in Editor mode through Blueprints. This page shows how to apply color transformations to the Level Viewport and Play in Editor mode.

- [image: Convert Colors in the Viewport and Play in Editor mode] Convert Colors in the Viewport and Play in Editor modeApply color conversion to the Level Viewport and Play in Editor with OpenColorIO in Unreal Engine (-> apply-color-conversion-to-the-level-viewport-and-play-in-editor-with-opencolorio-in-unreal-engine)

## Converting Colors in Blueprints

This page describes how to use **Blueprints** to apply color transformations.

- [image: Converting Colors in Blueprints] Converting Colors in BlueprintsApply color transformation using Blueprints with OpenColorIO in Unreal Engine (-> converting-colors-in-unreal-engine-blueprints)

## Converting Colors in nDisplay

nDisplay (-> rendering-to-multiple-displays-with-ndisplay-in-unreal-engine) supports applying OCIO color conversions to nDisplay renders for the entire cluster, the inner frustum, or individual cluster nodes. This can be useful for managing the color spaces of specific displays. This page explains how to use OCIO with nDisplay.

- [image: Color Management in nDisplay] Color Management in nDisplayUsing nDisplay color management tools. (-> color-management-in-ndisplay-in-unreal-engine)

## Converting Colors in Movie Render Queue

Movie Render Queue (-> movie-render-pipeline-in-unreal-engine) supports applying OCIO color conversions to media exports. This page shows how to set the color conversion in Movie Render Queue.

- [image: Image Settings] Image SettingsAdjust the picture quality of your render with Movie Render Queue's Image Settings (-> cinematic-rendering-image-quality-settings-in-unreal-engine)

## Converting Colors in Composure

Composure (-> realtime-compositing-with-composure-in-unreal-engine) supports applying OCIO color conversions to input and output media. This page explains how to apply color transformations in Composure.

- [image: Converting Colors in Composure with OpenColorIO] Converting Colors in Composure with OpenColorIOApply color transformation to a Composure Element and to the composited output with OpenColorIO in Unreal Engine. (-> converting-colors-in-composure-with-opencolorio-in-unreal-engine)

- vfx

On this page

- Quick Start (-> color-management-with-opencolorio-in-unreal-engine)
- Converting Colors in the Viewport (-> color-management-with-opencolorio-in-unreal-engine)
- Converting Colors in Blueprints (-> color-management-with-opencolorio-in-unreal-engine)
- Converting Colors in nDisplay (-> color-management-with-opencolorio-in-unreal-engine)
- Converting Colors in Movie Render Queue (-> color-management-with-opencolorio-in-unreal-engine)
- Converting Colors in Composure (-> color-management-with-opencolorio-in-unreal-engine)
