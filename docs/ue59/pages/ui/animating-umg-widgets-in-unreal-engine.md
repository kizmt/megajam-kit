# Animating UMG Widgets

https://dev.epicgames.com/documentation/en-us/unreal-engine/animating-umg-widgets-in-unreal-engine?application_version=5.9

> How to create animated UI elements in UMG.

[image: Animating UMG Widgets]

 [image: Banner Image]

Located along the bottom of the **Widget Blueprint Editor** are two windows which allow you to implement and control animations for your UI Widgets. The first, the **Animations** window, allows you to create essentially animation tracks which are used to drive the animation of your Widgets. The second, the **Timeline** window, is how an animation is applied to a Widget over time which is done by placing **Keyframes** at specified times then defining how the attached Widget should appear at that Keyframe (this could be size, shape, location, or even coloring options).

## Adding Animations

In order to get started with animations in UMG, you will need to first add an animation track. This can be done by clicking the **+Animation** button in the **Animations** window. Once you add an animation (yellow box below), you will be prompted to enter a name for the animation track.

 [image: Adding an animation track]

After adding an animation track, the **Timeline** will become active and you can begin adding **Animation Keys** that are associated with values that shift over time for your Widgets. It should also be noted that you can have multiple animation tracks for each Widget, for example, having a button move across the screen and flash at the same time.

## Adding Animation Keys

There are two methods in which you can add Keys to an animation track. The first is by using the **Auto Key** checkbox located inside the **Timeline** window. This will automatically add Keys to the Timeline when you make adjustments to a value that supports Keyframing.

 [image: Enabling the Auto Key checkbox]

The currently selected animation track is highlighted at the top of the **Timeline** (indicated by the yellow box above).

The general workflow for adding Keys via the **Auto Key** option is to specify a time in which you want to reach your desired value for your Widget, then moving the **Timeline Bar** to that time and setting the value via the **Details** panel or by using the Grid (mostly used for location, rotation, or scale). Once you have set your end result, scrub to the beginning of your sequence and set the default state for your Widget. When scrubbing the Timeline bar between the two time periods, you should see your change occur gradually over the time period.

The second method in which you can add Keys is by clicking the **Add Key** button next to a setting that supports Keyframing.

 [image: Example of Add Key buttons]

In the image above, the icon next to each of the settings can be clicked on and doing so will result in a Key for the value being added to the Timeline at its current position. In the image below, Keyframes for **Background Color** have been added at 0.00 and 2.00 where the Background Color of a Button Widget is changed from White to Yellow over 2 seconds.

 [image: Example of the animation track]

## Changing Key Values

You can change the value for multiple Keys at a particular time on the Timeline by holding **Ctrl** and clicking on the Keys.

 [image: Selecting multiple Keys]

Above, we have selected each of the Keys associated with the position of a Vertical Box containing Buttons so that we may set them manually via the **Details** panel. Manually entering values allows for more precise control (for example) over moving Widgets as we only want to move the object along one axis.

## Calling Animations

When you create an animation, a variable for it is also created. If you look on the **Graph** tab under the **Animation** dropdown menu in the **MyBlueprint** window, you will see all your animation tracks you have created. By holding **Ctrl** and dragging the animation into the graph, you will be able to issue commands to it such as Play or Stop.

 [image: Adding animation variable to the Graph]

Here we are telling our **Start Animation** to Play when the Widget Blueprint is constructed.

 [image: Example of the script for Play animation]

And here we are telling our **Blinking Button** animation to Stop playing when our **Start_Button** is clicked on.

 [image: Example of the script for Stop animation]

## Example: Animated Main Menu

Get familiar with the following example of using animations in a simple **Main Menu** screen. In the first animation Buttons move from the bottom of the screen to its center. In the second animation **Start** Button blinks.
Follow the steps below to get result similar to the example.

This example is for demonstrating how to set up animation in UMG only as the Buttons do not do anything when clicked on.

- Set up your Main Menu layout. This layout has two **Vertical Box**. The first **Vertical Box** includes **Text "GAME TITLE"**, the second **Vertical Box** includes two Buttons named **START** and **QUIT**. The following image shows this layout and its structure. Click image for full view.

- Select the second **Vertical Box** that contains **Buttons**. Navigate to its properties in the **Details** panel and set **Anchor** as shown in the following image. Click image for full view.

- Set properties for selected **Vertical Box** that contains **Buttons** under **Slot (Canvas Panel Slot)** section. **Position X**: -300.0;

- **Position Y**: 500.0;

- **Size X**: 600.0;

- **Size Y**: 200.0.

Click image for full view.

- Set **Position Y** to **1200.0** for selected **Vertical Box** that contains **Buttons** under **Slot (Canvas Panel Slot)** section. Click image for full view.

- Click the **+Animation** button in the **Animations** window and name it **StartAnimation**. [image: Create StartAnimation]

- Click the **Add Key** button next to the **Position Y** option in the **Animations** window and give the Animation a name such as **StartAnimation**. [image: Create the Key for the Position Y option]

- Move the **Timeline Bar** to **1.00** on the Timeline. [image: Move the Timeline Bar to 1.00]

- Set **Top** to **500.0** and click the **Add key to the current time**. [image: Set Top to 500.0]

- Click the **+Animation** button in the **Animations** window and name it **BlinkingButton**. Move the **Timeline Bar** to **1.00** on the Timeline. [image: Create BlinkingButton and set Timeline Bar]

- Select the **Start** Button in the layout of the widget. Navigate to the **Details** panel and click the **Add Key** button next to the **Background Color** under **Appearance** section. Click image for full view.

- Move the **Timeline Bar** to **1.50** on the Timeline. [image: Move the Timeline Bar to 1.50]

- Set **Background Color** properties in the **Animations** window: Set **R** to **0.1**; Set **R** to **1.0**; *Set **R** to **0.1**. [image: Set Background Color properties]

- Move the **Timeline Bar** to **2.00** on the Timeline. Set **Background Color** properties in the **Animations** window: Set **R** to **1.0**; Set **R** to **1.0**; *Set **R** to **1.0**. [image: Set Background Color properties]

- Click the **Graph** tab to create a Blueprint script for this widget. [image: Navigate to the Graph window]

- Create Blueprint Script as following image shows. [image: Blueprint Script of the Main Menu widget] In this script when Widget Blueprint is constructed, it plays the **Start Animation** (Buttons move from the bottom of the screen to its center). Then it uses the **Set Timer** node to call a **Custom Event** called **StartBlinking** every 2 seconds (the Set Timer node is set to Looping). **StartBlinking** Custom Event plays the **Blinking Button** animation every 2 seconds (which is color shift over time from white to green for Start Button).

- Finally, create the Widget Blueprint from either the **Level Blueprint** or your playable Character Blueprint. [image: Blueprint Script of the Level] In the **MyCharacter** Blueprint, we are creating the Widget containing the animations and UI layout of our Main Menu and adding it to the viewport by using the **Add to Viewport** node.

- ui
- animations
- blueprint
- umg ui designer

On this page

- Adding Animations (-> animating-umg-widgets-in-unreal-engine)
- Adding Animation Keys (-> animating-umg-widgets-in-unreal-engine)
- Changing Key Values (-> animating-umg-widgets-in-unreal-engine)
- Calling Animations (-> animating-umg-widgets-in-unreal-engine)
- Example: Animated Main Menu (-> animating-umg-widgets-in-unreal-engine)
