# Bent Normal Maps

https://dev.epicgames.com/documentation/en-us/unreal-engine/bent-normal-maps-in-unreal-engine?application_version=5.9

> An overview of using Bent Normal maps in Unreal Engine.

[image: Bent Normal Maps]

 [image: Non Bent Normal]

 [image: Bent Normal]

Using Bent normals within Materials can help improve how they react to lighting and shading. In the following document, you will find all the information you need to start using Bent normals in your Unreal Engine projects.

## Benefits to Using Bent Normals

Below, you will find some of the benefits to using Bent normals.

- One of the biggest impacts Bent normals tend to have is to reduce the amount of light leaking that happens after a light build.

- Bent normals can also be used with Ambient Occlusion (AO) to improve Diffuse indirect lighting. It does this by making the Diffuse indirect light closer match Global illumination (GI) by using the Bent normals for indirect lighting instead of the Normals.

 [image: Diffuse indirect lighting using AO]

 [image: Diffuse indirect lighting using Bent normal ]

## Bent Normal Creation

To get the highest quality Bent Normal map, and to match Unreal Engine's assumptions on how Bent Normal maps should be calculated, make sure to adhere to the following information when creating your Bent Normal maps:

- Use **Cosine Distribution** when creating the Bent Normal map.

- You can use Substance Designer 6 to generate the Bent Normal map just like a standard normal map or an AO map.

- When generating your Bent normal, make sure your character is in a T-Pose.

- The Bent normal and the AO should use the same **distance** setup.

- The Bent normal should be in the same space as your Normal map. Consult the following chart for more information: | World Space Type | Normal Map Type | Bent Normal Type |
| --- | --- | --- |
| World | World | World |
| Tangent | Tangent | Tangent |

## Using Bent Normals in Unreal Engine

Using Bent Normal maps inside of a Material is very similar to setting up and using Normal maps. All you need to do is add the **Bent Normal** custom output node to the Material graph and then connect your Bent Normal map to the input like in the following image. Also, make sure that there is an AO map input into the **Ambient Occlusion** input.

Click for full image.

## Reflection Occlusion

Bent Normal maps are also used in a powerful but less traditional way, and that is for Reflection Occlusion / Specular Occlusion. An Ambient Occlusion (AO) map occludes Diffuse indirect light, while Reflection Occlusion is a similar concept, but applied to Specular indirect lighting. Reflection Occlusion works by intersecting the Specular lobe with the visible cone or a cone representing the unoccluded part of the hemisphere described by the Bent normal as the cone axis and the AO amount as the cone angle. This results in significantly reduced Specular light leaking especially when Screen Space Reflection (SSR) data is not available.

Multi-bounce approximation for occlusion is also supported. This means that instead of AO or Reflection Occlusion shadowing the first bounce, we can use an approximation of what many bounces will produce. With multi-bounce approximation, brighter Materials will lose less light, and colored Materials will be made more saturated.

 [image: AO]

 [image: Bent Normal]

- materials
- rendering
- lighting

On this page

- Benefits to Using Bent Normals (-> bent-normal-maps-in-unreal-engine)
- Bent Normal Creation (-> bent-normal-maps-in-unreal-engine)
- Using Bent Normals in Unreal Engine (-> bent-normal-maps-in-unreal-engine)
- Reflection Occlusion (-> bent-normal-maps-in-unreal-engine)
