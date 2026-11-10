# Adjust Environment Lighting Features

https://dev.epicgames.com/documentation/en-us/unreal-engine/07-adjust-environment-lighting-features?application_version=5.9

> Learn to enhance your level's atmospheric elements by adding denser fog in low-lying areas and adding storm clouds in the sky.

[image: Adjust Environment Lighting Features]

In this section, you’ll take a closer look at environmental lighting. In Light a Scene (-> artist-02-light-a-scene), you learned to adjust the lighting that’s applied across the entire level. Now, you’ll learn to deepen the atmospheric elements in targeted parts of your level by:

- Adding a second layer of fog in low-lying areas, boosting the realism and atmosphere in your level.
- Adjusting the Volumetric Cloud actor's material to create stormy clouds with lightning effects.

As you complete this tutorial, you can choose to follow along with the example property values or experiment with different values to achieve the look and feel you want in your level.

## Before You Begin

Make sure you understand these topics covered in previous sections of the Art Pass for a Puzzle Adventure Game (-> art-pass-for-a-puzzle-adventure-game) tutorial series:

- Unreal Editor basics, including transforming actors and using viewports.

 You’ll work with the following assets in the sample project file (-> artist-01-project-setup-and-content-import):

- ExponentialHeightFog actor
- VolumetricCloud actor

## Add Exponential Height Fog to Low-Lying Areas

Creating thinner and thicker areas of fog in your level enhances the richness and realism of those spaces, immersing the player in realistic environments.

To create this effect, you’ll use the Exponential Height Fog actor's Second Fog Data properties to add an additional layer of fog to the level. You can use these properties to customize the height (on the Z axis) and density of the secondary fog layer.

The combination of Exponential Height Fog layers creates a consistent amount of fog across the level for very far distances and a secondary layer of fog that can independently increase fog density in low-lying areas like the valley in the example below. You can see in the first image that there is a fog layer and then see how a second layer of dense fog covering the valley changes the scene.

 [image: Exponential Height Fog: Single Fog Layer]

 [image: Exponential Height Fog: Added Second Fog Layer]

### Add a Second Fog Layer

In the sample level, you’ll use the Exponential Height Fog actor to apply a denser layer of fog in the lower pit areas with traps in Room 1. The secondary fog layer also applies to any other low areas of the level, such as the spike pit in Start Room.

You could create this effect in several ways, such as with materials or local fog volumes, but for the scale of the sample level, you’ll use only the Exponential Height Fog.

To add a second layer of fog to low areas in your level, follow these steps:

- In the **Outliner**, select the **Exponential Height Fog** actor.To find this actor, use the **Outliner **search box. Or, click **Settings **(gear icon) in the top-right corner of the **Outliner**, select **Collapse All**, and expand the **Level **folder.
- In the **Details **panel, under **Exponential Height Fog Component > Second Fog Data**, change the following values:**Fog Density**: `0.3`
- **Fog Height Falloff**: `1.8`
- **Fog Height Offset**: `7500`The **Fog Height Falloff** is how quickly the fog fades as it moves upwards, and the **Fog Height Offset** is where the fog layer sits vertically in the world.

After adjusting the secondary fog properties, the pit should look similar to this:

From a higher viewpoint, here’s a demonstration of the level before and after:

### Add Colored Light to the Fog

The secondary volumetric fog adds some atmosphere to Room 1’s pit, but is visually flat. By adding additional lighting that interacts with the fog, you can create a more dramatic and ominous feeling in this area of the room.

In this section, you’ll add a non-shadow-casting light to boost the glow within the pit and make the fog more prominent in a darker environment.

To light and color the fog, follow these steps:

- In the main toolbar, open the **Create **menu and select **Lights > Point Light**.
- Drag and place the light within or just below the pillar in the middle of the room.The height you place the light at affects how visible it is as the player walks into the room. Find a placement that works best for the look and feel of your level.
- With the **Point Light** selected, in the **Details **panel, change the following properties: |  |  |  |
| --- | --- | --- |
| **Property** | **Value** | **Notes** |
| Intensity | 10 |  |
| Light Color | HEX RGB = FF6E36FF (light orange) | If you use a different color, you may need to adjust the light Intensity depending on the color's wavelength (blues require a higher light intensity than reds and greens). |
| Attenuation Radius | 1300 | This value makes the light illuminate all of Room 1. |
| Cast Shadows | Off | The Point Light should act as a “fill” light to only light the fog and not cast shadows. |
| Advanced > Use Inverse Squared Falloff | Off | Disable this property when you want to use a light to uniformly fill an area. Turning this off removes the bright, reflective spot near the center of the light source. |
| Advanced > Light Falloff Exponent | 3.0 | Lowering the default value makes the light fill more of the area within the **Attenuation Radius**, but can make the light look less realistic (in real life, light sources can only cast light a certain distance). |
- Optional: Adjust **Volumetric Scattering Intensity** to increase or decrease the amount of light contribution added to the volumetric fog. (The default value is 1.0.)

### Fix Volumetric Intensity of Spot Lights

In Light a Scene (-> artist-02-light-a-scene), you placed Spot Lights over the key and each door in the Start Room and increased the Volumetric Scattering Intensity of those lights. Increasing their volumetric intensity made the cones of light brighter and more defined without increasing the density of fog throughout the level.

If you return to the Start Room, you’ll see that the Spot Lights are now contributing too much light to the volumetric fog, making the cones of light too bright.

To correct the Spot Lights in the Start Room and restore their softer look, follow these steps:

- Use the **Viewport **or **Outliner **to select the four **Spot Light** actors.
- In the **Details **panel, change the **Volumetric Intensity **from `50` to `4` (or other value as desired).

Using the suggested values above, the lights should look something like this:

To add fog to specific sections of a level instead, try using Local Fog Volumes (-> local-fog-volumes-in-unreal-engine).

## Create Stormy Clouds with the Volumetric Cloud Component

The sample level was created from the **Basic **level template which includes a set of lighting actors, including a Volumetric Cloud actor. This actor is controlled by its assigned Volumetric Cloud Material Instance. You can use this material to create different cloud formations and effects, including stormy clouds with lightning appearing behind the cloud layers.

In this section, you’ll create a copy of the existing Volumetric Cloud Material Instance and modify the copy to create a stormy cloud that matches the dark, atmospheric look of the level you’ve already created with environmental lighting and exponential height fog.

### Copy the Volumetric Cloud Material Instance

Because the Volumetric Cloud Material is contained in the Engine Content, make a copy of it within your own project first. This way, the original remains unchanged in the **Engine > Content** folder as a backup.

Always make a copy of assets in **Engine > Content** before working with them. Assets in this folder are shared across all of your Unreal Engine projects, so any changes to assets in this folder will affect your other projects and levels.

To create and use a copy of the Volumetric Cloud Material Instance, follow these steps:

- In the **Outliner**, select the **Volumetric Cloud** actor.
- In the **Details **panel, in the **Cloud Material** category, next to the **Material**, click the **Browse to Asset** button.
- In the **Content Browser**, drag `m_SimpleVolumetricCloud_Inst` to the **Content > AdventureGame > Artist > Materials** folder.
- Select **Copy Here** to make a copy of the original file.
- Go to the** AdventureGame > Artist > Materials** folder, and rename the material copy to `MI_MyVolumetricCloud`.
- In the **Details **panel, use the **Material **asset slot to assign `MI_MyVolumetricCloud` to your level’s Volumetric Cloud actor.

### Customize the Volumetric Cloud

Now that you have your own Volumetric Cloud Material Instance applied to your level, you can use the parameters in the Material Instance to work on the storm clouds.

To create storm clouds in the Volumetric Cloud Material, follow these steps:

- In the **Content Browser**, open `MI_MyVolumetricCloud`. The Material Instance’s parameters are divided into **Cloud Layout**, **Shape**, **Storm**, and **Multiscatter **groups. Work with the Material Instance undocked in its own window so you can observe how changing the parameter values affects the level in the viewport.
- Expand the **02 - Storm** category, enable **StormClouds**, and set its value to a number between `0.3` and `0.5` to start. You can increase or decrease this value to adjust the amount of cloud coverage in the sky. In the viewport, position the camera where the player stands so you can test the clouds’ appearance from the player’s point of view.
- Under **02-Storm**, enable **Storm_LightningMasks** and expand its parameters.
- Under **Storm_LightningMasks**, adjust the **LightingMaskBias **to a value between `1` and `0` (for example, try `0.5` to start). As the value gets closer to 0, you’ll see the lightning become more visible behind the clouds. If you’re having trouble seeing the lightning effect in the viewport, ensure **Realtime Viewport** is enabled and move the camera to point a little above the horizon as the effect tends to appear lower in the sky.

These parameter values give you a starting point for creating storm-like clouds with lightning effects behind the clouds. You can match the material parameters to the values suggested in this tutorial, or experiment with different values to create the look you want in your level.

If you’d like to keep working on your storm clouds, try adjusting the following settings:

|  |  |  |
| --- | --- | --- |
| **Category** | **Parameter** | **Description** |
| 02 - Storm > Storm_LightningAnim | All | These parameters change the lightning-flicker animation. Be conservative when changing these parameters, and remember the default values so you can revert if needed. |
| 02 - Storm > Storm_LightningClouds | FillScatterIntensity | Increase or decrease this value to adjust the intensity of the lighting flashes in the clouds. |
| 02 - Storm > Storm_LightningMasks | LightningMaskStrength | Lower values dim the lightning effect, making it less pronounced in the clouds. Use this in combination with the CloudTextureWeight for soft, rolling lightning effects in the clouds. |
| 02 - Storm > Storm_LightningMasks | Cloud TextureWeight | Lower values reduce how much the lighting illuminates the clouds and makes the flashes more subdued. |

Here’s an example of the results you can expect after changing the Volumetric Cloud Material parameters:

For more examples and information on using the Volumetric Cloud Material to create various types of cloud formations, see Volumetric Cloud Material (-> volumetric-cloud-material-in-unreal-engine).

## Adjust Light Properties with Light Mixers

Unreal Engine has two editor panels where you can adjust scene light or atmospheric light properties in one convenient place.

In the **Light Mixer **panel, you can manage localized light sources in your level. This panel is like an **Outliner **that only shows actors that contain lights.

Open the **Light Mixer **from Unreal Editor’s main menu by selecting **Window > Light Mixer**.

In the sample level's **Light Mixer**, you can see it includes standalone light actors like Spot Lights, and the Jump Pad and Fire Trap actors since their blueprints contain lights.

In the **Environmental Light Mixer** window, you can create and edit the properties of your level's environment lighting components.

Open the **Environment Light Mixer** from the main menu by selecting **Window > Env. Light Mixer**.

To learn more about working with these editor windows, see Light Mixer (-> using-the-light-mixer-in-unreal-engine) and Environment Light Mixer (-> environment-light-mixer-in-unreal-engine).

## Next Up

In the next section, you’ll start adding sound to your game. You’ll learn to create a Sound Cue and make the sample level’s fire traps play a looping sound effect.

- [image: Add Sounds to Fire Traps] Add Sounds to Fire TrapsLearn how to add a sound effect to a Blueprint. (-> artist-09-adding-sounds-to-fire-traps-artist-track-unreal-engine)

On this page

- Before You Begin (-> 07-adjust-environment-lighting-features)
- Add Exponential Height Fog to Low-Lying Areas (-> 07-adjust-environment-lighting-features)
- Add a Second Fog Layer (-> 07-adjust-environment-lighting-features)
- Add Colored Light to the Fog (-> 07-adjust-environment-lighting-features)
- Fix Volumetric Intensity of Spot Lights (-> 07-adjust-environment-lighting-features)
- Create Stormy Clouds with the Volumetric Cloud Component (-> 07-adjust-environment-lighting-features)
- Copy the Volumetric Cloud Material Instance (-> 07-adjust-environment-lighting-features)
- Customize the Volumetric Cloud (-> 07-adjust-environment-lighting-features)
- Adjust Light Properties with Light Mixers (-> 07-adjust-environment-lighting-features)
- Next Up (-> 07-adjust-environment-lighting-features)

Related documents

Art Pass for a Puzzle Adventure Game

 [image: Art Pass for a Puzzle Adventure Game] (-> art-pass-for-a-puzzle-adventure-game)Design a Puzzle Adventure

 [image: Design a Puzzle Adventure] (-> design-a-puzzle-adventure-game-in-unreal-engine)Environmental Light with Fog, Clouds, Sky and Atmosphere

 [image: Environmental Light with Fog, Clouds, Sky and Atmosphere] (-> environmental-light-with-fog-clouds-sky-and-atmosphere-in-unreal-engine)Exponential Height Fog

 [image: Exponential Height Fog] (-> exponential-height-fog-in-unreal-engine)Volumetric Cloud Material

 [image: Volumetric Cloud Material] (-> volumetric-cloud-material-in-unreal-engine)Environment Light Mixer

 [image: Environment Light Mixer] (-> environment-light-mixer-in-unreal-engine)Light Mixer (-> using-the-light-mixer-in-unreal-engine)
