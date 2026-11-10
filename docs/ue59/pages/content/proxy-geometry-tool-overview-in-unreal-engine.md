# Proxy Geometry Tool Overview

https://dev.epicgames.com/documentation/en-us/unreal-engine/proxy-geometry-tool-overview-in-unreal-engine?application_version=5.9

> Overview of the Proxy Geometry system in Unreal Engine 4.

[image: Proxy Geometry Tool Overview]

## Proxy Geometry Tool

The goal of the Proxy Geometry tool is to help reduce the runtime rendering cost of Static Meshes and their corresponding Materials and Textures. The Proxy Geometry tool achieves this by combining multiple Static Meshes and their corresponding Materials into one single Static Mesh with one single set of Textures and Materials that still matches the original Static Mesh's shape and look but with a reduced number of triangles. This reduced result can be used as a proxy for the original geometry in cases were the difference in quality is either acceptable or not appreciable, for example structures that are distant from the camera.

 [image: Proxy_Geometry_OV_01.png]

### Proxy Geometry Tool Static Mesh Generation

The results that you get when using the Proxy Geometry tool can vary depending on the settings used in the tool. The images below where created using just the default settings of the Proxy Geometry tool.

 [image: Before Using Proxy Geo]

 [image: After Using Proxy Geo]

| **Before Proxy** |  | **After Proxy** |  |
| --- | --- | --- | --- |
| **Object Count** | 22 | **Object Count** | 1 |
| **Triangle Count** | 27,308 | **Triangle Count** | 4,032 |
| **Material Count** | 6 | **Material Count** | 1 |

While the Static Mesh might not look exactly like the original object, the savings that you get from using the Proxy Geometry tool are quite significant. In this testing scene, we took 22 Static Meshes with six Materials and over 27k triangles and transformed that into a single Static Mesh with one Material and a triangle count of 4k.

### Proxy Geometry Tool Texture Generation

The Proxy Geometry Tool will also generate a new set of Textures that correspond to the new Static Mesh geometry that was created. The image below shows an example of what this generated Texture looks like when compared to the original Textures that where used.

 [image: Before Using Proxy Geometry]

 [image: After Using Proxy Geometry]

### A Brief Note on Tool Performance

The first time the proxy system processes an item of geometry, a shader cache on the game thread is populated, incurring a one-time cost. This means that subsequent iterations (For example, changing some parameter and rebuilding that proxy) can be much faster. When comparing against the existing 3rd party options, a 2x to 3x speed improvement is seen with this new system on modest spatial sized geometry clusters, but on very large geometry the time to completion is similar.

Please note that the above information on speed improvements only relates to generating proxies inside of the UE4 Editor, not their use in game. In game performance benefits from the use of proxies will depend on quantities such as the final polygon count and texture sizes.

- optimization
- proxygeometrytool
- proxygeo

On this page

- Proxy Geometry Tool (-> proxy-geometry-tool-overview-in-unreal-engine)
- Proxy Geometry Tool Static Mesh Generation (-> proxy-geometry-tool-overview-in-unreal-engine)
- Proxy Geometry Tool Texture Generation (-> proxy-geometry-tool-overview-in-unreal-engine)
- A Brief Note on Tool Performance (-> proxy-geometry-tool-overview-in-unreal-engine)
