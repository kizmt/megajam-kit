# How to Add Lighting and Actors to a Scene

https://dev.epicgames.com/documentation/en-us/unreal-engine/how-to-add-lighting-and-effects-to-a-scene?application_version=5.9

> How to add lights and other actors to a scene while working in real-time.

> **info:** This part of the guide is purely exploratory and subjective to what you’d like to see. Aside from changing the visuals of the scene, the changes you make here won't affect any previous steps or completing this guide in the next and final step.

Now that you’ve got a basic animation in place using Sequencer and a control rigged prop, let’s take a look at how you can add some interesting rendering elements to your scene. The basic scene already has some basic rendering elements with a Directional Light, atmosphere and clouds, and fog. Let’s look at some of these elements and look at some others you can add to make this scene uniquely your own.

For this exercise, we’ll look at how you can:

- Add lighting and other objects to the scene, such as lighting, volumes, and props.

- Select scene actors and edit some of their properties.

- Add and configure post process settings with a Volume and Cine Camera.

- Add a Cine Camera to the Scene and Sequencer

With all these elements, you’ll see how they come together in the end to make edits and changes to your scene in real-time and what that can mean for your work in Unreal Engine.

### Starter Content

This content pack is built into the engine, and it includes a variety of simple assets that include, scene props, architecture props, visual effects, and materials you can use to decorate your scene.

If you didn’t install it to your project but want to do so now, perform the following steps:

- In the Content Browser, click **Add > Add Feature** **or** **Content Pack**.

- In the Add Content to the Project window, select the **Content **tab. [image: Add Content to the Project window]

- Select **Starter Content** and click **Add to Project**. [image: Starter Content pack]

Once added, you’ll find its folder in the Content Browser under **Content > StarterContent.

**

## Adding Lighting and Other Components to the Scene

Your scene should look similar to this: you have your animated box you’ve completed and the scene that you created at the beginning of this guide. While this is interesting on its own, it’s not very inspiring. So, let’s have you add some other lighting elements and props to the scene to create something interesting that we can use later in this guide.

[image: Open World starter level.]

Let’s look at what’s already included in this starter scene that you can make edits to. It includes:

- Editable terrain

- Directional (Sun) light

- Sky and Atmosphere

- Volumetric Clouds

All of these are real-time elements with their own properties and settings that can be adjusted to create interesting looks.

For objects that aren’t in the scene you want to add, you do so in the following ways depending on the type of object it is:

- For objects that are scene actors, like Lights, Volumes, Clouds, Fog, Cameras, and others, you’ll use the **Create **dropdown menu under the **Place Actors** category to access these objects. [image: The Create dropdown menu.]

- For assets that you have in your project, these are stored in the **Content Browser** and can be dragged directly into the scene. These would include objects like props, materials, control rigs, and other such assets. [image: The Content Browser]

From either of these places in the Unreal Editor, you can click and drag objects into the scene.

[video]

Go ahead and add some objects of your own to the scene to create something interesting. What you add is up to you as this will not directly affect the animation you’ve already created. Try adding some lights to the scene. We’ll show you how to edit some of their properties in the next section.

### Making Changes to Lighting Components

Now that you have a better understanding of objects in your scene and how to add some from the Content Browser, we’ll take a look at how you can edit some of their properties to create interesting looks with only a few settings.

#### Outliner and Details Panel

For any objects placed in your scene, you can start by selecting them directly in the scene or using the Outliner to search for them or select them directly. The **Outliner **is located in the top-right corner of the Unreal Editor interface.

[image: Level Editor Outliner]

When an actor in the Outliner or scene is selected, the Details panel populates its properties and configurable settings.

[image: Level Actor Details Panel]

Any property that has had its default value changed is indicated by the **Reset Arrow**. You can click this arrow to reset the property to its default value.

[image: Reset a property back to its default value.]

Any scene actor can be added to Sequencer. In fact, individual properties of an actor can be added to the timeline to be keyframed. Clicking the **Diamond **automatically adds this actor to the timeline.

[video]

#### Editing Actor Properties

Now that you have selected some objects and seen where you can make edits to their properties, let’s look at some of the lighting components in the scene to make changes to. These actor properties are going to help you make changes that have a bigger impact on the look of the scene.

Start by selecting the **Directional Light** from the **Outliner **panel.

Now, you can use the hotkey **Right Ctrl + L** and drag the mouse to rotate and change the lights direction. Because the light affects the atmosphere, you will see the scene’s color change as it gets closer to the horizon line.

[video]

In the Details panel, you can change properties and settings to affect the look of this light in the scene. Some settings worth exploring and trying out on your own are:

- **Intensity:** - Set a value in lux for how bright the light is.

- **Light Color:** - Click the color box and use the color picker to set a color for the light source.

- **Color Temperature:** - Set a value for **Temperature**. Lower values use cooler colors, and higher values produce warmer colors. - Enable Use Temperature

- **Light Shafts:** - Enable **Light Shaft Bloom** - Click the color box next to** Bloom Tint** to change the color of the light shaft bloom in the scene. - Change **Bloom Scale **to increase or decrease the amount of light bloom from the light shafts of this light source. - Enable **Light Shaft Occlusion**

- **Visibility:** - You can disable a light in a couple of ways without removing it from the scene or changing its properties. - In the **Details **panel, uncheck the box next to **Affects World**. This has the same effect as deleting the light and is useful for non-destructive experiments. - In the **Outliner**, click the **Eye **icon next to the actor.

> **tip:** You can right-click on any property in the **Details **panel and add it to the **Favorites **section of this panel. This makes it easier to access these particular properties and change them.
> [image: Add individual properties to a Details panel favorites for quicker access to them.]

Other light actors have similar features, and while all lights generally have the same properties, there are some properties that are unique to the type of light source it is.

**For Point, Spot, and Rect Lights:**

- **Soft Area Shadows: ** - On Rect lights, the Source Width and Source Height contribute to the softness of the shadows. - On Spot and Point Lights, use the Source Radius to change how hard or soft shadows are from contact locations. [video] - **Volumetric Shadow Contribution: ** - Adjust the value for **Volumetric Scattering Intensity** to change how much this light's intensity and light color contribute to volumetric fog. - Check the box for **Cast Volumetric Shadow** to have this light contribute to volumetric fog shadows. - **Visibility: ** - You can disable a light in a couple of ways without removing it from the scene or changing its properties. - In the Details panel, uncheck the box next to Affects World. This has the same effect as deleting the light and is useful for non-destructive experiments. - In the Outliner, click the Eye icon next to the actor.

The **Exponential Height Fog** actor, you can adjust a handful of properties to get some dense and interesting fog with volumetric shadows when changing these settings:

[video]

- **Volumetric Fog: ** - Check the box for **Volumetric Fog**. - Adjust **Extinction Scale** to control how much fog particles absorb light. - Change the color of the fog reflectivity using the **Albedo** color picker. - **Height Fog: ** - Adjust the **Fog Height Falloff** to increase the density as height decreases. Smaller values make the visible transition of fog larger. - Adjust the **Fog Density** to a higher value to increase the amount of fog in the scene. The slider only goes so high, but you can manually type in larger values. - **Visibility:** - You can disable a light in a couple of ways without removing it from the scene or changing its properties. - In the **Details **panel, uncheck the box next to **Visible**. - In the **Outliner**, click the **Eye **icon next to the actor.

Adding even a few lights to the scene and adjusting their settings can dramatically change the scene you looking at in the Unreal Editor. Because everything is working and rendering in real-time, any changes you make are reflected immediately for you to see. You can use this to your advantage for composition and layout of a scene without waiting for it to render.

## Adding a Camera to the Scene

Now that you have some lighting in your scene — whether you’re using what is already in the level or have added your own lights — let’s add a camera to the scene and set that up with Sequencer. This camera will be used to focus on the animation and to render out our final images in the last section of this getting started guide.

Use the **Create **dropdown menu in the main toolbar to drag in a **Cine Camera Actor** from the **Cinematics **rollout menu.

[video]

Follow these suggestions to line up your shot:

- In Sequencer, use the Playhead to scrub through your box animation. Rotate and line up the camera so that you can capture the cardboard box prop entirely.

- With the Cine Camera selected, use the **Details **panel to change these camera settings to get more in the shot: - Click the **Pin **icon in the lower-left corner of the camera preview window to keep this camera view pinned to the level editor, even if you click off the camera. [image: Use the Pin to keep the Camera Preview Window present at all times.] - Under the **Crop Settings**, change the** Current Focal Length** to a lower value to see more of the scene. [image: Adjust the Crop Settings Current Focal Length to get more action in the scene without moving the camera away from the animated subject.]

Now that you’ve got your camera lined up to see your animated object, let’s add the camera to Sequencer, and let’s keyframe some subtle camera movement and change some of the properties of the camera at the same time.

You can add the Cine Camera actor to Sequencer in a couple of ways.

- You can select it in the **Outliner **and drag and drop it into the **Sequencer Animation Outliner**. [video]

- You can click the **Add (+) **icon and under the **Add Actor Track**, select the actor you want to add from the list. [image: Add actor to sequencer track]

You'll now see the camera track in Sequencer. The view will automatically posses the camera to see what it sees. Scrubbing the timeline shows this in the level editor viewport.

[image: New Camera track added to Sequencer.]

With your camera added to Sequencer, let's take a moment and set some keys to animate its movement and change a couple of the properties of the camera.

- In Sequencer, on the Camera's Transform track, click the Add Keyframe icon to register a key for this actor's location, rotation, and scale. [image: Add a keyframe for the camera actor]

- Move the **Playhead** forward to a location on the timeline to somewhere in the middle of the animation of the prop.

- Because the camera is being "piloted", you can move the camera in the scene to a new location and rotate it to focus on the prop.

- When you've done this, press the **Add Keyframe** button next to **Transform** to add a key for it. [video]

- Click the **Add Keyframe** button next to any of the properties listed under the **Camera Component**. This will ensure that in the next steps, they start from this value and then transition to the value you'll choose later. Alternatively, you can enable **Auto Key** to automatically register changes for most things. [image: Auto Key toggle]

- Move the Playhead forward again to where the prop lands on the ground.

- Turn your camera towards the prop and adjust the **Current Focal Length** and **Manual Focus Distance** to values that work for your scene. [video]

## Using Post Process in Your Scene

Unreal Engine’s post processing effects enable artists and designers to define the overall look of the scene through a combined selection of properties and features that affect coloring, tonemapping, lighting, and more. You can use these in any scene through a placed volume or through a camera. You can use multiple volumes which can be blended together or having one take priority over the other.

The post process system also supports Unreal Engine’s Material system, meaning that you can create custom looks and effects driven by a material created in the editor.

[image: Examples of post process materials applied to a scene.]

Use the **Create **dropdown menu in the main toolbar to drag in a **Post Process Volume **from the **Visual Effects **rollout.

[video]

When placing a Post Process Volume, you can see their effects by:

- Scaling the volume to cover an area and moving the camera view within the volume.

- In the **Details **panel, place a check next to **Infinite Extent (Unbound). **This will apply any changes you make globally to the level whether the camera is within the volume or not. [image: Set a Post Process Volume to affect the scene globbally.]

Another way you can access and change post post process settings is through any camera actor. Each camera actor includes post process settings in its settings. Post Process settings applied to the camera are only visible by this camera while being piloted or rendered from in Sequencer.

In this example scene, you can see what the camera sees in the preview window and how the post process settings have been changed to be different from those in the rest of the scene.

[image: And example of how to use post process with a camera to look different than the scene when it's being used.]

For more information on using post processing and its various properties, see Post Process Effects (-> post-process-effects-in-unreal-engine) documentation.

## Making Changes in a Real-Time Editor

Because you're working in a real-time scene you can make changes at anytime during the process and what you see is what you get.

If you've followed along up to this point and added some different lights, props, and other actors to the scene to make it your own you can possibly see how powerful and flexible the Unreal Editor is at adapting to your workflow and creativity.

This exercise should give you some agency in allowing you to work more freely and creatively to achieve your goals, whether you're working on a team or as a solo animator.

Below is a scene built using the steps and suggestions in this guide up to this point. It's using two different lighting set ups, one with the level's base components lit by a Directional Light and another where we're only using spot and rect lights with some added height fog for effect.

[video]

### Next Step

In the next and final step of this getting started guide, we'll take a look at how you can render out what you've made so far. We'll show you the Movie Render Pipelines that Unreal Engine offers and how you can use these to generate final images.

- How to use the Movie Render Pipeline for Final Images and Video (-> how-to-render-out-final-images-and-video): Learn about Unreal Engine's Movie Render Pipeline and how to use it to render out images and video.
