# Add Post Process Volumes

https://dev.epicgames.com/documentation/en-us/unreal-engine/add-post-process-volumes?application_version=5.9

> Create post process volumes to control the look and performance of a level.

[image: Add Post Process Volumes]

In this tutorial, you’ll create a nighttime scene using the materials and assets from the previous tutorial (-> artist-03-create-materials-and-material-instances) and a selection of post-process effects including **exposure**, **bloom**, **lens flare**, and **color gradin****g**. You’ll also learn how to improve the quality of lighting and reflections in your scene using **post process volumes** and Lumen Global Illumination and Reflections (-> lumen-global-illumination-and-reflections-in-unreal-engine).

**Post process effects **non-destructively change the look and feel of a level. You can picture these effects like applying a filter to a camera, or holding a color gel in front of the lens.

[image: Camera with a pink filter] A camera looking through a pink color gel.

Post process effects can be applied in realtime, without altering assets within a level. Since these effects are non-destructive, they're useful for making visual changes without disrupting Materials or complex lighting setups.

The only difference between the levels in the images below is **color grading** — a category of post processing.

|  |  |
| --- | --- |
| [image: Room-with-amber-light] | [image: Room-with-cool-tones] |

Game developers use different types of post process effects to direct player attention, communicate gameplay information, and enhance visual storytelling. For example:

- Color Grading (-> post-process-effects-in-unreal-engine) can mimic different times of day, change the mood of a scene, or visually communicate narrative devices such as flashbacks.
- Reflections (-> post-process-effects-in-unreal-engine) can add realism and deepen immersion during gameplay.
- Bloom (-> post-process-effects-in-unreal-engine) can be used in combination with exposure (-> post-process-effects-in-unreal-engine) and lens flares (-> post-process-effects-in-unreal-engine) to emphasize glow, reflectivity, or direct attention to an asset.

Multiple post process effects can be combined to establish a consistent visual style for a game, or used in specific gameplay situations. In the demonstration below, we used multiple effects to visually communicate when a player is underwater.

Post process effects are also used to control optimization for lighting features. If you’ve ever played a AAA video game, you may have noticed options to adjust resource-intensive effects, such as **reflection quality**. Later in this tutorial, you’ll use post process volumes to balance fidelity and performance for reflection quality in Unreal Engine.

|  |  |
| --- | --- |
|  |  |

Next, let’s look at how post process effects are applied in game levels.

## The Anatomy of Post Process Volumes

Post process effects can be applied to a level by using placeable** post process volumes**. Volumes define the area that an effect applies to. These volumes are invisible to players during runtime and can be **bound** or **unbound**.

[image: A-Post-Process-Volume-and-its-visible-bounds.] A post process volume and its visible bounds.

Let’s look at an example that shows the difference between bound and unbound volumes. In the image below, we created three post process volumes that affect **Saturation**.

[image: 1-is-unbound-2-is 25%-saturation-3-is-0%-saturation] (1) Unbound, 100% Saturation (2) Bound, 25% Saturation (3) Bound, 0% Saturation

Notice two things in the video above. As the player walks down the hallway:

- The **unbound** volume’s saturation is unchanged even when the player is **not inside** the volume. This is because unbound volumes apply effects **globally**; to the entire level. The scale and location of the volume doesn’t matter.
- The **bound** volume’s saturation is only visible when the player is **inside** the volume. This is because bound volumes apply effects **locally**; to the area within their perimeter.

Later on, you’ll learn how to blend volumes to initiate effects as players approach their perimeter

Volumes can layer hierarchically, like layers in a graphic design software. Unbound, or **global volumes**, layer over smaller, bound volumes inside a level. Similarly, you can set a layering priority for bound volumes that overlap one another.

[image: Image-of-a-volume-cube-within-a-volume-cube]

Global volumes help maintain a consistent visual style throughout your game, act as a foundation for further layering, and keep your workflow organized.

For example, building up visual effects layer-by-layer can avoid unexpected results that are difficult to locate and debug. For teams that work with hundreds of effects over multiple levels, staying organized can save valuable development and debugging time.

Next, you’ll set up three post process volumes in your level and set their priority.

## Set Up Global and Local Volumes

Let’s revisit the post process volume you created in Light a Scene (-> artist-02-light-a-scene) and verify that it’s applying effects globally:

- In the **Outliner**, search for the **PostProcessVolume** and select it.
- Rename this volume `PPV_Global`.
- In the **Details** panel, expand **Post Process Volume Settings**.
- Verify that **Infinite Extent (Unbound)** is checked and **Priority** is set to `0`.[image: Post-process-volume-settings]

Next, you’ll make two new volumes; one that surrounds Room 3 and another that surrounds the Level Transition Point within Room 3.

You’ll adjust the **Priority **of each bound volume to take precedence over the global volume when the player enters it. When setting priority, higher values take precedence over lower values.

To create new volumes, follow these steps:

- In the Editor’s main toolbar, click **Create > Visual Effects > Post Process Volume**. Alternatively, you can search for it. Add two volumes.[image: Post-process-volume-option-in-the-dropdown]
- Name the first volume `PPV_Room3` and the second `PPV_LevelTransition`.[image: PPV-volume-options]
- In the **Outliner**, select `PPV_Room3` and set its **Scale** to `8.5, 10, 5`.
- Set its **Location **to `1600, -1050, 370`. This should roughly surround Room 3.[image: Room-3-with-yellow-box-of-the-volume]
- Under **Post Process Volume Settings**, set **Priority** to `100`.[image: Priority-set-to-100]Choose values with a wide range between them. This lets you insert and remove volumes without needing to update existing volume priority. For example, iterate by 10 or 100 between each value.
- Set the **Blend Radius** to `0` and verify that **Infinite Extent** is unchecked.[image: Blend-radius-and-infinite-extent]
- Select `PPV_LevelTransition` and set its **Scale** to `1.5, 1.5, 2.5`.
- Set its **Location** to `2170, -1450, 600`. This should roughly surround the Level Transition Point.[image: Arrow-to-the-transition-platform]
- Set its **Priority** to `200` and verify that **Infinite Exten****t** is unchecked.[image: Priority-at-200]

Your volumes for this tutorial are now set up.

## Experiment with Post Processing Presets

In this section, you’ll experiment with effects from the following post-processing categories:

- **Lens**Exposure
- Bloom
- Lens Flare

- **Color Grading**Offset
- Contrast

- **Global Illumination and Reflections**Lumen Scene Lighting Quality
- Lumen Scene Detail
- Reflection Quality
- Screen Traces
- Max Roughness To Trace

### Exposure

**Exposure (-> post-process-effects-in-unreal-engine)** controls the upper and lower limits of brightness in a level. Remember, post process volumes don't alter the properties of other actors within your level. In the demonstration below, the brightness of the **light source** isn’t changing. Instead, what’s changing is the **maximum amount of visible light** allowed into the camera lens.

In the real world, this effect is similar to how a camera’s aperture controls the amount of light it captures. Or, how your pupils dilate and constrict to adjust to different lighting conditions. This is why exposure in Unreal Engine is also called **Eye Adaptation**.

With exposure, you can mimic real-world optical effects and add realism to a game. For example, when a player moves from a dark area to a bright area, extending the duration of time it takes for the global exposure to adjust can mimic the time it takes for a human eye to adjust to brighter light.

Exposure is purposely delayed to reveal the geography below.

In this section, you’ll adjust the exposure for `PPV_Global` and `PPV_Room3` to create a transition to nighttime when a player walks into Room 3.

To set exposure, follow these steps:

- In the **Outliner**, select `PPV_Global`.
- In the **Details** panel, under **Exposure**, check **MIN EV100** and set it to `-10`.
- Check **MAX EV100** and set it to `20`.
- In the **Outliner**, select `PPV_Room3`.
- In the **Details** panel, under **Exposure**, check **MIN EV100** and set it to `-1.0`.

Test your level by right-clicking in the viewport and selecting **Play From Here**. As you move towards Room 3, the exposure should change but the change is too abrupt.

To extend the duration of the change, you’ll blend the global volume with the bound volume by using **Blend Radius**:

- In the **Outliner**, select `PPV_Room3`.
- Under the **Post Process Volume Settings**, set **Blend Radius** to `1500`.

Test your level. Now, as you move towards Room 3, the exposure should change gradually.

Your level may look different than ours even with the same exposure values. In the previous tutorial (-> artist-04-expanded-material-instances), we changed settings in the **Directional Light **to appear more like dusk.

Next, you’ll adjust the glow of the neon signs with bloom.

### Bloom

Bloom (-> post-process-effects-in-unreal-engine) is a lighting imperfection where light appears to bleed past the boundaries of a light source or reflection.

 [image: Bloom disabled.]

 [image: Bloom enabled.]

In film, this imperfection comes from how camera sensors and lenses capture light, but the effect can be mimicked in games for artistic purposes. For example, bloom and exposure can be used to visually communicate that a player has entered a dream sequence, flashback, or is stunned after an explosion.

In Unreal Engine, you’ve already seen bloom at work in the previous tutorial (-> artist-04-expanded-material-instances) when you increased your emissive material’s **Brightness **parameter above a value of 1.

[image: Emissive-mask-in-blueprints]

Instead of adjusting the properties of each individual asset to achieve widespread results, let’s use your post process volume to control the overall bloom in Room 3:

- In the **Outliner**, select `PPV_Room3`.
- In the **Details** panel, expand the **Lens** category.
- Expand the **Bloom** category, then check **Intensity**. Set it to `0.8` or use your own values.
- Check **Threshold **and set it to `1` or use your own values.

**Threshold** sets the minimum value at which bloom begins to have an effect on the level. You can think of this like a clamp, as seen in the previous tutorial. **Intensity** controls how strong the bloom is, once it takes effect.

Adjusting Intensity with a Threshold of 1.

A threshold of -1 allows all colors in a level to affect bloom.

Next, you’ll add lens flare to the neons signs.

### Lens Flare

A lens flare is a lighting artifact that occurs when bright light reflects off of imperfections in a lens or internal elements of a camera.

The effect can be mimicked in games for artistic purposes. For example, lens flares can direct attention to a reflective asset, promote photorealism, or emphasize the strength of the sun when a player looks into it.

[image: Image-looking-through-columns-at-a-lens-flare]

To create lens flares in your level, follow these steps:

- In the **Outliner**, select `PPV_Room3`.
- In the **Details** panel, expand **Lens > Lens Flares**.
- Check **Intensity** and set it to `0.5`.
- Check **BokehSize** and set it to `5`.Lower values produce sharper bokeh results with less dispersion and higher values produce more dispersion.
- Check **BokehShape** and search for `DefaultBokeh`.[image: Bokeh-options-in-the-menu]In film, the geometric shape of **bokeh** particles comes from the shape of a camera’s aperture. Because of its prevalence in film, this effect is mimicked in games, where there are no physical apertures.

Test out your work by moving and back forth in front of a light source or emissive Material in your level.

Next, you’ll use color grading to communicate gameplay mechanics to players.

### Color Grading

Much like in image editing software, you can use color grading to affect a level’s **Saturation**, **Contrast**, **Gamma**, **Gain**, **Offset**, **Tint**, and more.

 [image: Color grading disabled.]

 [image: Color grading enabled.]

With these tools, you can change the level’s perceived time of day, mood, or genre conventions. For example, sepia-tone is a style of color grading that suggests antiquity.

[image: Sepia-tone-color-grading-in-real-time.] Sepia-tone color grading in realtime.

For your level, you’ll use color grading to communicate to the player when they’ve entered a Level Transition Point. The Level Transition Point is a game mechanic created in Design a Puzzle Adventure (-> design-a-puzzle-adventure-game-in-unreal-engine) that takes players to a new level.

[image: Image-of-player-character-on-a-glowing-platform]

Currently, when you stand on the Level Transition Point, the Rect Light beneath you isn’t powerful enough to compete with the Directional Light and Point Lights around the room. From the player’s point of view, the change from gameplay to Level Transition could be more clearly communicated.

[image: Glowing-platform-with-glowing-cube]

If presented clearly and consistently, players learn to recognize and expect visual cues that signal game mechanics in your level.

To solve this problem with post-processing, follow these steps:

- In the **Outliner**, select `PPV_LevelTransition`.
- In the **Details **panel, expand **Color Grading > Global**, and check **Offset**.**Offset **impacts the darkest areas of a level, making it ideal for adjusting the overall hue of this dark room.
- Choose your own values or set **R** = `-1.0`, **G** = `-0.02`, **B** = `0.15`, and **Y** = `0.07`. The room should now appear blue:
- To correct the white hotspot created by the Point Light, expand **Color Grading > Highlights** and check **Contrast**.**Contrast **adjusts the difference between the darkest and lightest areas of a level. Here, reducing the contrast lowers white levels to fall within the threshold of the offset correction.
- Set the values to **R** = `0.5`, **G** = `0.8`, **B** = `0.7`, and **Y** = `1`.The hotspot should be less noticeable:

To test your work, right-click in the viewport and select **Play From Here**. When you run onto the JumpPad and land on the Level Transition Point, the screen should become blue.

Next, you’ll use post process volumes to control optimization for reflection quality.

### Global Illumination and Reflections

Post process volumes can control the quality and scope of visual effects. This can help you balance fidelity and performance when working with expensive rendering features such as dynamic lighting.

Remember that resource allocation often affects decisions made in development. In vast, exterior levels you can use post process volumes to conserve quality in areas far away from the player — where they won't notice. This saves resources for areas where quality matters, such as immediately around the player during gameplay or around a camera during a cinematic.

A volume’s **Global Illumination** and **Reflections **settings contain different lighting calculation methods suited for different development needs:

| Method | Description |
| --- | --- |
| **None** | Disables any global illumination or reflection calculations. Light sources will not create bounce light or reflections, and shadows will appear solid black. |
| **Lumen** | Lumen Global Illumination (GI) (-> lumen-global-illumination-and-reflections-in-unreal-engine) is Unreal Engine's fully-dynamic global illumination system that works with all lighting types. |
| **ScreenSpace** | Screen Space Global Illumination (SSGI) (-> screen-space-global-illumination-in-unreal-engine) is a fast, dynamic lighting system that only calculates lighting for what appears within the screen view. |

When the **Lumen **method is selected in the demonstration below, notice that the orange glow from the neon arrows dynamically contributes to the scene. This is because emissive materials (which are not a light source) are calculated when using Lumen but not when using the other methods.

In addition to controlling quality, post process volumes can control how far light and reflections are able to contribute within the scene. Lvl_Adventure is relatively small and render distance isn’t an issue. However, for larger areas (such as open-world games where large distances can cause significant resource consumption) settings like **Lumen Scene View Distance** and **Max Trace Render Distance** are useful for balancing scope and performance.

#### Adjust Reflection Quality Using Lumen GI

In this section, you’ll make adjustments to the level’s Global Illuminations and Reflections settings by solving problems in a serious of exercises. As you work, you'll learn about each setting and improve the look of reflections on the wet floor you created in the previous tutorial.

Settings you'll adjust include:

| Setting | Description |
| --- | --- |
| Global Illumination |  |
| **Lumen Scene Lighting Quality** | Calculates scene lighting fidelity. Higher values equal higher fidelity, at a performance cost. |
| **Lumen Scene Detail** | Controls the size of instances that can be represented in a scene. Higher values ensure small objects are represented, at a performance cost. |
| Reflections |  |
| **Quality** | Increases the fidelity of Lumen Reflections on surfaces. Higher values equal higher fidelity and can reduce artifacting, at a performance cost. |
| **Screen Traces** | Toggles screen space traces for Lumen Global Illumination. Turning on Screen Traces improves reflection fidelity, but it only affects what is visible on screen. |
| **Max Roughness To Trace** | Sets the maximum roughness value for which Lumen still traces reflections. |

To follow along, apply these values to `PPV_Room3`:

- **Global Illumination****Method:** None
- **Lumen Scene Lighting Quality:** `0.25`
- **Lumen Scene Detail:** `0.25`

- **Reflections****Method:** None
- **Quality:** `0.25`
- **Screen Traces**: Unchecked
- **Max Roughness to Trace:** `0.0`

To begin the exercises, follow these steps:

- In the viewport or **Outliner**, locate one of the emissive assets you created in the previous tutorial. Arrange it on the floor as you like.
- In the **Outliner**, select `PPV_Room3`.
- Navigate to the **Details **panel. To use Lumen GI, expand **Global Illumination**, check **Method**,** **and select **Lumen**.Your scene should now look like this:
- To use Lumen reflections, expand **Reflections**, check **Method, **and select **Lumen**.Your scene should now look like this:
- Reflections are more noticeable on materials with low roughness. Since `BP_Floor`’s roughness when wet is 0 (no roughness), set **Max Roughness to Trace** to `1.0`.Your scene should now looks like this:
- Some of the emissive power is lost on the wet floor. To solve this, check **Screen Traces**.Your scene should now look like this:
- While the amount of reflected light is improved, the reflection itself is not crisp. To improve the clarity of the reflections, increase **Quality** to `1.0`. Your scene should now look like this:
- The clarity of the reflections is improved, but there’s (subtle) visible artifacting behind the arrow.To resolve the artifacting, you can increase the number of samples produced by Lumen GI. Under **Lumen Global Illumination**, check **Lumen Scene Lighting Quality** and set its value to `1.0`.
- Check **Lumen Scene Detail** and set its value to `1.0`.Your final scene should now look like this:

With these settings, you've used Lumen Global Illuminations and Reflections to control the visual fidelity and performance of Lvl_Adventure. Explore these settings in your own level and consider where you might want to allocate resources for quality or conserve resources to enhance performance.

## Next Up

In the next tutorial, you’ll learn how to create post-process materials and apply an on-screen effect to indicate damage.

- [image: Post Process Materials on the UI] Post Process Materials on the UILearn how to use Materials to create gameplay-driven, on-screen post-process effects. (-> artist-06-post-process-materials-on-the-ui-in-unreal-engine)

On this page

- The Anatomy of Post Process Volumes (-> add-post-process-volumes)
- Set Up Global and Local Volumes (-> add-post-process-volumes)
- Experiment with Post Processing Presets (-> add-post-process-volumes)
- Exposure (-> add-post-process-volumes)
- Bloom (-> add-post-process-volumes)
- Lens Flare (-> add-post-process-volumes)
- Color Grading (-> add-post-process-volumes)
- Global Illumination and Reflections (-> add-post-process-volumes)
- Adjust Reflection Quality Using Lumen GI (-> add-post-process-volumes)
- Next Up (-> add-post-process-volumes)
