# Lightmass Portals

https://dev.epicgames.com/documentation/en-us/unreal-engine/lightmass-portals-in-unreal-engine?application_version=5.9

> Help increase the quality of baked interior lighting.

[image: Lightmass Portals]

[image: Banner image]

When gathering lighting, Lightmass can backtrack to Point, Spot and Directional light sources using photons from the Photon Mapping technique.
This means that it can find small windows where light is entering from these light types and resolve the incoming lighting with high-quality.
However, SkyLights and Emissive meshes don't support photon emission efficiently, so Lightmass can only find the small important lighting features with brute force.
This manifests as splotchy artifacts around indoor corners. To help Lightmass better understand where the light should be coming from, you can place **Lightmass Portals** Actors around the areas that are critical to lighting.
In the following document, we will take a look at setting up and using Lightmass Portals in your Unreal Engine projects.

## How It Works

From a high-level, Lightmass Portals work in the following manner:

- Lightmass Portals are most useful when a scene is lit using a Skylight (-> sky-lights-in-unreal-engine), HDR image or a Static Mesh that is set to Use Emissive for Static Lighting checked.[image: Setting up Lights options for Skylights]Click for full image.
- Lightmass Portals are placed and in the level and scaled to fit any open areas that are important to the final lighting.[image: Example of the scene with Lightmass Portals]
- When Lightmass is building the light, the Lightmass Portals tell Lightmass that more light rays should come from this area yielding higher quality light and shadows. [image: Scene without Portals] [image: Scene with Portals]

## Steps

To use Lightmass Portals in your projects, you will need to do the following.

- From the **Place Actors** panel, search for **Lightmass Portal** and then drag the **Lightmass Portal Actor** into your **Level** to place it.[image: Adding the Lightmass Portal Actor]Click for full image.
- Using the **Move**, **Rotate** and **Scale** tools, position and scale the Lightmass Portal to be about the same size or slightly smaller than the opening or area you want Lightmass to focus more rays towards.[image: Adjusting position and scaleof the Lightmass Portal Actor]
- Click the **Build** in the **Main** menu panel, select **Build** and change the **Lighting Quality** to **Production**.[image: Enable production lighting quality]
- When that has all been completed, click the **Build** in the **Main** menu panel and select **Build All Levels** to start the Lightmass lighting build.[image: Build the Lightmass lighting]

## End Result

Once your Lightmass build has completed, you will have something similar to the following image.

 [image: Scene without Portals]

 [image: Scene with Portals]

If you take a close look at the **Without Portals** image, you will notice that there is a lot of noise in the image, especially in the darker areas when compared to the **With Portals** image.

## Known Issues and Limitations

- Lightmass Portals work by forcing Lightmass to send rays toward the portal. Because of this, you should only use Lightmass Portals on small levels and only for lighting that is critical to the scene. Failing to do this (and adding too many Lightmass Portals) can drastically increase your Lightmass build times.
- Only use Lightmass Portals on very small levels as Lightmass Portals are not occluded by anything. Using them in big open world-type levels will result in longer-than-needed light baking times.
- If you are using Static Meshes for Emissive light casters and the results are noisy, place a Lightmass Portal around the area where the Static Meshes' light is supposed to be emitted from.

- rendering
- lighting
- global illumination

On this page

- How It Works (-> lightmass-portals-in-unreal-engine)
- Steps (-> lightmass-portals-in-unreal-engine)
- End Result (-> lightmass-portals-in-unreal-engine)
- Known Issues and Limitations (-> lightmass-portals-in-unreal-engine)
