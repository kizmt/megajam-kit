# X-Rite AxF as Substrate Materials

https://dev.epicgames.com/documentation/en-us/unreal-engine/xrite-axf-as-substrate-materials-in-unreal-engine?application_version=5.9

> Learn how to export and import AxF materials as Substrate materials.

Work with measured materials created with X-Rite tools (.axf files) by importing them as Substrate-based materials. The X-Rite **Pantora** plugin provides a way to work effectively with real-world material data by leveraging Substrate to enhance rendering of materials that feature clear coat, sheen, alpha transparency, displacement, and Parallax Occlusion Mapping.

X-Rite collaborated in the development of the Pantora plugin and Interchanges plugin to improve the usability of Substrate materials and achieve high visual fidelity. These plugins also address the limitations of Unreal Engine’s (UE) current AxF importer—which often produces overly complex material graphs and leads to suboptimal results.

The following workflows integrate directly with Pantora exports for ease of use. You can batch-export AxF materials and import them into UE with minimal setup, bridging material measurement, authoring, and real-time visualization.

## Download the Pantora Plugin

Download the **AxF Plugin for Unreal Engine v0.1.0** to export data used to create Substrate graphs. You can download the latest plugin version from the X-Rite site here.

> **warning:** The plugin has the following system requirements:
> - Windows 11
> - Unreal Engine 5.6 or later

### Limitations

Currently the Pantora plugin only supports AxF’s **GGX SVBRDF** materials, including alpha transparency, displacement (where applicable), and the clear-coat and sheen extensions.

[image: An example of GGX SVBRDF materials supported materials.]

It also supports the **CPA2** representation, however, metal flakes (glints) are not available at this time.

[image: An example of the CPA2 supported materials.]

> **alert:** The legacy SVBRDF model based on the Ward BRDF isn't supported. Volumetric materials, defined by spectral scattering and absorption coefficients, are currently out of scope but may be considered in a future release.

## Pantora Set Up

The Pantora plugin must have specific project settings and plugins enabled in UE to create Substrate based materials.  Follow the steps below to enable the specific project settings and plugins to work with Pantora.

### Enable Substrate Settings

- From **Project Settings** enable the following **Substrate** settings. Without these settings you won't be able to import files using the Pantora plugin.

[image: An example of the necessary Substrate settings that need to be enabled: Substrate materials, Adaptive GBuffer, 4 Substrate Closure Per Pixel, Min of project's platform's closure count, 180 Bytes Per Pixel, Substrate Opaque material rough refraction, Substrate translucent material rough refraction, and Substrate advanced visualization shader.]

### Enable Engine Rendering Settings

- From **Project Settings** > **Engine - Rendering** enable **Order Independent Transparency**. This is necessary for materials that contain alpha, such as textiles and woven fabrics

[image: Enable the Engine - Rendering project setting Enable Order Independent Transparency experimental.]

> **warning:** When Order Independent Transparency isn't enabled, materials that make use of alpha transparency do not render correctly:
> [image: An example of improperly rendered materials.]

### Enable the Interchange AxF Plugin

- From the **Edit** menu select **Plugins** > **Interchange AxF**.

## Importing AxF Materials as Substrate Materials

Importing X-Rite AxF materials as Substrate-based materials provides a way of preserving the measured appearance of `.axf` files using UE’s native rendering architecture. GGX SVBRDF and CPA2 AxF material representations are necessary for an accurate reproduction of real-world materials such as automotive paints, textiles, leathers, and interior surfaces. AxF parameters map to curated Substrate master materials, ensuring compatibility with Lumen and Path Tracing.

Imported materials expose controls for scale, rotation, alignment, and triplanar projection, providing a way for fast adaptation to production assets while preserving physical characteristics. This replaces the legacy AxF importer’s complex graphs with standardized Substrate master materials, resulting in cleaner content, predictable performance, and consistent behavior across rendering paths and platforms.

### Using Pantora to Import Materials

To import AxF materials into UE, you’ll follow the basic workflow:

- Select and inspect your materials for import in Pantora.

- Export intermediary files along with textures as `.axf2ue`.

- Import `.axf2ue` files into UE.

> **alert:** This plugin is different from the existing AXF Importer plugin that ships with Unreal Engine. If you import `.axf` files directly into your project, you're using the wrong plugin and won't achieve the expected results using the workflows outlined in this document.

### Exporting .axf2ue Files from Pantora

- Open the **Pantora** plugin.

- Select **Export** from the project menu.

- Select a set of materials for exporting. > **tip:** You can also select materials from the material tray.

- Select a destination folder on your PC.

- Select **Export** from the **Start Export** section (section 5) of the page.

### Import .axf2ue Files in UE

To import the `.axf2ue` files into your project use one of the following methods:

- Drag and drop the `.axf2ue` files into the content browser.

- Click **Import **on the content Browser menu and select which materials to import.

[image: An example of importing AxF materials using the Import button on the content browser.]

> **note:** While materials import, the Interchange dialog opens. Select **Import** to dismiss the dialog window.

When the files successfully import, they appear in the content browser:

[image: An example of a successful import of .axf files.]

### Batch Exporting .axf2ue Files

For automated workflows, use the command-line tool `AxF2Textures` to batch export `.axf` files to `.axf2ue` using the same export logic as Pantora.

> **tip:** The command-line tool also supports the **Substrate Resource Exporter**, which prepares materials for UE's AxF import pipeline.

To export a material for UE:

- `AxF2Textures --in "Path/To/Material.axf" -t SubstrateResource`

The Substrate exporter supports an optional flag:

- `--approximate-carpaint-color-table`

This command approximates car paint color travel using two primary hues mapped to Substrate’s FlipFlop material node. It’s similar to selecting FlipFlop as the color table format in Pantora.

For full usage info, run:

- `AxF2Textures --help`

## AxF to Substrate Materials Conversion

UE doesn’t render raw AxF data directly. Instead, AxF shading model parameters and textures are fitted to the Substrate shading model during export from Pantora.

The UE plugin doesn’t perform additional fitting; it simply reads the parameters from the `.axf2ue` file and maps them to predefined Substrate master materials included with the Interchange plugin.

[image: Master Materials included with the Interchange AxF Content plugin]

[image: SVBRDF Substrate Graph]

[image: SVBRDF Substrate Material Instance]

Unlike approaches that implement AxF shading models as custom shaders (for example, VRED or V-Ray), this method leverages Unreal’s standard Substrate system, ensuring compatibility with Path Tracing, VR, and other rendering platforms.

As a result, minor rendering discrepancies compared to Pantora’s reference rendering are expected, but the workflow benefits from full integration into Unreal Engine’s native rendering architecture.

### Special Features

#### Material Scale & Alignment

The materials provide utility features to change its scale, rotation, and option to triplanar projection.  It supports all map types that might be used by the imported material (albedo, roughness, normal, and so on.)

[image: AxF materials support all map types that might be used by the imported material (albedo, roughness, normal, and so on.)]

#### Relief Mapping (Normal Map, Parallax Occlusion)

Normal Maps and POM are supported by the Interchange plugin.

[image: A material example utilizing Normal Maps and POM.]

[image: An example of the Normal and Parallax Occlusion settings used in the material above.]

Nanite Displacement was deliberately avoided. Given the typical scale of these materials (~10 cm × 10 cm), Nanite Displacement would introduce unnecessary memory overhead and complexity for relatively small surface detail.

## Example Results
