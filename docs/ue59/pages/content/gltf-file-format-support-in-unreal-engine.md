# glTF Support in Unreal Engine

https://dev.epicgames.com/documentation/en-us/unreal-engine/gltf-file-format-support-in-unreal-engine?application_version=5.9

> Overview of what gTF features Unreal Engine supports

**GL Transmission Format (glTF™)** is an extensible, open-standard file format developed and maintained by Khronos Group. It is designed to create compact files that load quickly, and represent scenes completely. The glTF format is used to share rich 3D content between a wide variety of applications, including Unreal Engine, Twinmotion, and Fab, which can import and export glTF content.

## Supported glTF Specification

The Unreal Engine glTF exporter supports the glTF 2.0 specification. In this documentation, "glTF" refers specifically to glTF 2.0.

glTF 2.0 is more run-time independent than previous versions. It relies only on well-established physically-based rendering (PBR) workflows. Much of the glTF software ecosystem supports glTF 2.0 exclusively.

## glTF File Formats

You can import and export the following glTF formats:

| Format | Description |
| --- | --- |
| JSON `.gltf` | Includes the following elements, saved separately in a directory you specify: - **Full scene description:** saved as a JSON-formatted, human-readable UTF-8 text file with the `.gltf` extension. - **Texture files:** saved to the format you specify, `.png`, `.jpeg`, and so on. - **Binary data files:** saved separate files with a `.bin` file extension. |
| Binary `.glb` | Combines the full scene description, all binary data, and all textures into a single self-contained binary file. |

## glTF Extensions

It is impossible for a format like glTF to support every feature of every game engine by default. Instead you can extend the glTF base model with extensions that provide support for specific features (see About glTF Extensions, in the glTF GitHub repository, for more information).

Each glTF extension has a unique name. These names allow applications to identify all of the extensions that a glTF file requires, regardless of whether the application supports all of those extensions.

Every extension name has a prefix that indicates how well-supported the extension is:

| Prefix | Support | Description |
| --- | --- | --- |
| KHR | Khronos ratified | Broadly supported. The KHR prefix is reserved for Kronos ratified extensions. |
| EXT | Multi-vendor | Supported by more than one vendor (a company or application). |
| Various | Vendor | Supported primarily by one vendor (a company or application). Use a vendor-specific registered prefix such as `ADOBE` or `MSFT`. Other companies or applications might support these extensions, but it's not guaranteed. |

### Extension Limitations

Not all applications implement every glTF extension. If an application does not support an extension, it might be able to load and show parts of the glTF file that do not use that extension. However, if the glTF file explicitly requires the extension, the application cannot load the file.

### Extensions Supported by the Unreal Engine glTF Exporter

To support many of Unreal Engine's features the glTF exporter implements the following extensions. You can toggle any of them on and off using various settings in the glTF export options. For details, see the glTF Export Options Reference (-> exporting-unreal-engine-content-to-gltf)

#### Khronos Extensions

| Extension | Provides support for |
| --- | --- |
| **KHR_lights_punctual** | Point, spot, and directional lights |
| **KHR_materials_unlit** | Materials that use the Unlit shading model |
| **KHR_materials_clearcoat** | Materials that use the Clear Coat shading model |
| **KHR_materials_variants** | Compact multiple Material variants per Asset |
| **KHR_mesh_quantization** | Reducing the size and precision of vertex data |
| **KHR_texture_transform** | Tiling and mirroring texture coordinates |
