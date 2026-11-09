# Animators

https://dev.epicgames.com/documentation/en-us/unreal-engine/animators-in-unreal-engine?application_version=5.9

> All about Animators for use in your Motion Design projects.

[image: Animators]

**Animators **provide a variety of ways to do loopable, sequencer-controllable, and one-off animations, defined by parameters rather than keyframes.

For example, animating something like a bouncing ball using standard Sequencer (-> cinematics-and-movie-making-in-unreal-engine) techniques requires creating multiple keyframes and manipulating animation curves. Using animators, you can select from a list of templated presets with customizable parameters to achieve the same effect.

You can access the animators from the Operator Stack (-> operator-stack-in-unreal-engine) window, along with the modifiers (-> modifiers-in-unreal-engine).

## Adding Animators

There are two methods for adding animators. First, you can add animators by clicking **+Add Animators** in the Operator Stack window, which displays the full menu of animators you can use.

[image: Animators in the Operator Stack window]

You can click any of these animators to add it to your currently-selected actor in the **Motion Design Outliner**. If you already know the name of the animator you want to use, you can search for it by name in the search bar near the top.

Second, you can also add an animator by right-clicking an actor in the** Motion Design Outliner** panel, selecting **Add Animators** in the context menu, then picking the property to affect. Once added, the new animator appears in the Operator Stack panel in exactly the same way as when you add an animator there directly.

Here is an example of adding an Oscillate animator to the Scale property of a sphere actor.

[image: Adding an Oscillate animator.]

Before:

[image: Before adding an animator]

After:

[image: After adding an animator]

## Global Properties

The basic operation of any animator is defined by two global settings: **Global Magnitude** and **Global Time Source Name**.

### Global Magnitude

This property determines how much movement the animations you create show when applied to actors in your level. The value is a float with a range from 0.0 and 1.0. If you have several animators, this global setting affects all of them. The higher the value, the more all your animations move the actors you apply them to.

Global magnitude stacks multiplicatively with the magnitude properties of animators and with the magnitude of the linked properties of those animators.

### Global Time Source Name

This property is how you manage the time source that drives the animators. Several options are available in the dropdown menu, some of which enable additional properties.

The dropdown menu options are:

- **World**
- **Manual**
- **Sequencer**
- **System**

#### World

The **World **option starts the animator the moment the level loads. For example, if you have a pulsing sphere (as in the examples below), it begins to pulse immediately.

#### Manual

The **Manual **option provides you access to methods to directly control the animation timing using several properties.

[image: Global Time Source Name Manual option]

##### Custom Time

The **Custom Time** property provides a way for you to drive the overall animation from Sequencer or Remote Control by keyframing your selected time value using the keyframe icon.

[image: Manual option Custom Time property]

##### Playback State

Alongside Custom Time, you gain access to the **Playback State** property. This provides you a full playhead, which you can manipulate directly or by exposing it to **Remote Control**.

[image: Manual option Playback State property]

[image: Playback State mapped to Remote Control]

#### Sequencer

You can control the animation from Sequencer by clicking **Create Track**.

[image: Sequencer option and Create track button]

When you click Create Track, a sequencer track is created, and you can now drive the animator.

 [image: Sequencer track driving animator]

#### System

The **System** option works primarily with the text animators (the Clock animator mainly but not exclusively), and offers little additional functionality for the numeric animators. You have a few options for using it, depending on your selection in the **Mode** property dropdown menu.

##### Local Time

The **Local Time** mode option shows the time according to your current device's time zone.

[image: System Local Time mode]

##### Countdown

The **Countdown **mode option includes subproperties where you can set the countdown format (target or duration) and time.

 [image: System Countdown mode option]

###### Countdown Format

The **Countdown Format** subproperty provides you with two options for how to track the countdown: **Duration **and **Target**.

- **Duration**: The countdown time is tracked in absolute terms. For example, if the current time is 10:00:00, and the countdown time is 12:00:00, then your countdown will run for 12 hours, and end at 22:00:00. This is the default option.
- **Target**: The countdown time is tracked relative to the current time. For example, if the current time is 10:00:00, and the countdown time is 12:00:00, then your countdown will run for 2 hours, and end at 12:00:00.

###### Countdown Time

The **Countdown Time** subproperty is how you determine the time value used to calculate how long the countdown runs, as described above. The default value is 23:59:59, one second short of a full day.

##### Stopwatch

The **Stopwatch **mode option records how long the animation has been running since you started it.

[image: System Stopwatch mode option]

#### Use UTC

When using the System option, you can enable the **Use ****UTC **property to show the time according to Coordinated Universal Time (UTC).

[image: Use UTC property]

| Global Time Source Mode Options and Properties | Description |
| --- | --- |
| **World** | Animators run continuously while the level is loaded. |
| **Manual** | Direct control of animators. Provides access to the following subproperties::**Custom Time****Playback State****Frame Rate** |
| **Sequencer** | Animators are controlled by Sequencer. |
| **System** | Animators are controlled by system time. Also provides access to the Mode and Use UTC properties. |
| **Mode** | Only available when the Mode property is set to System. Options are:**Local time****Countdown****Stopwatch** |
| **Use UTC** | Enable to use Coordinated Universal Time. Only available when the Mode property is set to System. |

### Frame Rate

You can enable the **Frame Rate** global property to control the frame rate of your animations separately from the general frame rate of your project. Adjusting the frame rate can give your animations a smoother or choppier appearance, depending on the frame rate you choose.

[image: Frame Rate global property]

The functional value of this property is limited by the maximum frame rate of your project and hardware, regardless of the numerical value you enter. You can make it slower than your project's maximum, but not faster.

## Numeric Common Properties

This section describes the shared properties common to Numeric animators, including functionality and basic examples.

A given Numeric animator does not necessarily use all of the common properties. However, those common properties an animator does use will always function in a similar way. Refer to the description for each specific animator to see which of the common properties it uses.

### Magnitude

The **Magnitude** property determines how much movement your animation shows. The value is a float with a range from 0.0 to 1.0. The higher the value, the more the animation moves the actor to which you apply it. For example, here is a ball bouncing with the magnitude value at 1.0.

 [image: Animator magnitude value at 1.0]

Here is the ball bouncing with a .5 value for magnitude.

 [image: Animator magnitude at 0.5]

Remember the magnitude setting for a particular animation is different from the global magnitude, and they affect your animation together multiplicatively. For example, setting both the global magnitude and the magnitude of a specific animation to 0.5 results in an animation with a magnitude of 0.25, a quarter of its normal effect.

### Cycle Mode

The **Cycle Mode** property controls the number of times an animator runs its process.

#### Do Once

When you use the **Do Once** option, the animation runs a single time. In the example below, the ball bounces once.

 [image: Animator do once cycle mode]

#### Loop

When you use the **Loop** option, the animation runs as long as it can. In the example shown below, the ball bouncing is limited only by the Sequencer timeline running.

 [image: Animator loop cycle mode]

#### Ping Pong

When you use the **Ping Pong** option, the animation runs, and then runs in reverse. In the example, the ball bouncing then "un-bouncing" is limited only by the sequencer timeline running.

 [image: Animator ping pong cycle mode]

### Cycle Duration

The **Cycle Duration** property is how you control how long a single complete animation loop takes to run. Below are two examples to demonstrate:

1 Second

 [image: Animator 1 sec cycle duration]

0.5 Seconds

### Cycle Gap Duration

The **Cycle Gap** **Duration **property provides a way for you to control the duration when using the Loop or Ping Pong cycle modes. It adds a delay between each replay of the animation, whether forward or backward.

### Seed

The **Seed **property adds variation to the overall effect of the animator when the referenced actor has many parts. Using this with **Text **actors is a prime example.

Here is an example of moving Text actors with a seed value of 0:

Here is the same example, but with a seed value of 1. The general timing is the same, but the animation offsets different characters to rise and fall in a unique way:

This effect is deterministic. Provided all the other values also remain the same, a given seed value always produces the same set of animation offsets.

### Time Source Name

The **Time Source Name** property controls when your animation plays. There are multiple time source options available to determine how your animation plays.

#### World

When you use the **World** option for your time source, your animation plays without further input from the user. For example, if you have an animation like something bouncing around, it bounces around for as long as your level is open.

#### Manual

If you want to use entirely manual controls for your animation, there are two subproperties available when you select the **Manual** option that you can use to control the timing of your animation directly.

[image: Time Source Name Manual option]

##### Custom Time

Using the **Custom Time** subproperty, you can jump to any point in your animation by defining the time in seconds during the animation runtime for your selected point.

##### Playback State

The **Playback State** subproperty gives you access to playback controls you can expose to remote control or set manually.

**Playback State Controls**

- **Play**: Play the animation forward.
- **Rewind**: Rewind the animation backward.
- **Pause**: Pause the animation playback.
- **Stop**: Stop the animation playback, and reset the playhead.

#### Sequencer

Using the **Sequencer **option provides a way to control the animation timing using a Sequencer track. Click the** Create track** button to get started, then use Sequencer to control the time in your animation, including exposing it to remote control as usual.

An example of using a Sequencer track to control an animation.

#### Frame Rate

When you enable the Time Source Name property, you can also choose to enable the **Frame Rate** subproperty. This provides a way for you to set the frame rate of your time source, independently of the frame rate set in the global animation settings or the frame rate of your project.

| Numeric Common Properties | Description |
| --- | --- |
| **Magnitude** | Determines how much movement the animation shows relative to the animation's default. Stacks multiplicatively with the General Magnitude global setting. |
| **Cycle Mode** | Determines how the animation plays. Options are:Do OnceLoopPing Pong |
| **Cycle Duration** | Determines the duration of a single animation playback. |
| **Cycle Gap Duration** | Determines the duration of the gap between animation playbacks for the Loop and Ping Pong cycle modes. |
| **Seed** | Determines variation in the animation playback. |
| **Time Source Name** | Determines how the timing of the animation is tracked. Options are:WorldManualSequencer |
| **Frame Rate** | Determines the frame rate of the animation, separate from the global frame rate and project frame rate. |

## Linked Properties

**Linked Properties** is a feature shared by all animators, which determines how you animate the actor you added the animator to. When you link a property or properties from the actor's **Details **panel, the animator drives those properties. If you don’t have anything linked, you get a warning message, **No properties are currently linked to this animator**, as shown in the image below.

[image: Animator linked properties error message]

### Working with Linked Properties

There are two ways to assign properties:

- Click the **+** icon under the **Animators** menu and select a property. In the example, the selected property is RelativeLocation Z, that is, the location of the animated actor on the Z axis.[image: Linked properties from the Animators menu]
- Right-click the actor in your **Motion Design Rundown** and select the property or properties that you want under the **Add Animators** menu. You then need to select the **Animator** again, and select which property or properties that you want to manipulate. This method has an advantage in that you can proceed immediately to linking the property.[image: Linked properties from the Motion Design Rundown]

Once you are browsing inside the property you linked, consider the following settings:

[image: Example linked properties]

By default, you won’t see much of a change. If you're duplicating the example, add a Bounce animator to a shape and link its position on the Z axis, then use the settings below:

- **Amplitude Min**: 0.0
- **Amplitude Max**: 800.0
- **Magnitude**: 1.0
- **Time Offset**: 0.0s
- **Mode**: Absolute

You should produce a result similar to the example below:

 [image: Linked properties animator example]

### Amplitude Min

You can use the **Amplitude Min** property to control the minimum effect of an animation. In this example, it is a bounce. A zero setting will basically have it land at the zero point and bounce. Giving this property a negative value will cause your actor to sink into the floor, as in the example below:

 [image: Animator amplitude min negative value]

### Amplitude Max

The **Amplitude Max** property provides you with control of the maximum effect of the animation. In the bounce animation example, this is how high the ball will reach during the bounce.

### Magnitude

The **Magnitude **property provides a way for you to regulate how much your linked property affects your animation. Each linked property can have a different magnitude value, which you can use to make fine changes to your animation.

Remember the magnitude of a linked property is affected by both the global magnitude setting and the magnitude property of the animator, multiplicatively.

### Time Offset

When set for a group of animated actors, the **Time Offset** property sets the total duration required to iterate through the animation for all of those actors. Compare this with the **Cycle Duration** property, which determines the duration required for each element in a group (such as a series of text characters) to animate.

In the examples below, the animation for the bouncy text initially takes 1 second to play, which is set by the Cycle Duration property of the animator. The animation plays at a slower pace after setting the Time Offset property's value to 3 seconds.

Here is the example with the Time Offset property value set to 0.0:

 [image: Animator time offset 0]

Here is an example with the Time Offset property value set to 3.0:

### Mode

The **Mode **property gives you the choice of two options: **Additive **and **Absolute**.

#### Absolute

The **Absolute **option for an animator means it uses the exact amplitude values you input into the field. In the example below, the animated arc moves in a range from exactly 0 to 90 degrees.

 [image: Animator absolute mode]

#### Additive

The **Additive **option takes the amplitude min and max values, and adds them to the existing value on the exposed field. In this example, the animated arc moves in a range from 180 to 270 degrees, adding on to the half-circle already present.

 [image: Animator additive mode]

### Range

The **Range **linked property provides a way for you to determine how many elements in the linked actor (for example, letters in a text actor) are animated. You can define how this is assessed using the **Unit **subproperty options.

[image: Animator range linked property]

#### Unit

The **Unit **subproperty determines how the range is measured. The options are:

- **Percentage**: The range is measured as a percentage of the elements in the actor.
- **Character**: The range is measured using individual characters in a text actor.

#### Percentage

The **Percentage **option assesses the entire range and, based on the values of the **Start**, **End**, and **Offset **subproperties, animates the actor elements within those bounds. In the example below, setting the value to 50% wiggles half of the string.

 [image: Animator 50 percent range]

##### Start and End

The **Start **and **End **subproperties determine the percentage values at which your animator's effects start and stop applying to the linked actor.

##### Offset

The **Offset **subproperty shifts the range affected by your animation by a given percentage, increasing it with a positive value, decreasing it with a negative value. This stacks with the Start and End property value percentages.

#### Character

The **Character **option has various subproperties that provide you with tools to define precisely which characters you animate in a text actor.

##### Character Start and Character End

You can define the **Character Start** and **Character End** subproperties to pick which specific characters are animated. In the example below, only the R and V characters are animated because the Character Start value is 2, and the Character End value is 4.

 [image: Animator range defined by character start and end]

##### Character Offset

You can use the **Character Offset** subproperty to shift the range to the right or left. This stacks with the Character Start and Character End property values. For example, another way to achieve the same result shown in the previous example would be to start the range from 0, but then use a Character Offset value of 2.

#### Direction

The **Direction **subproperty determines the order in which the actor elements are evaluated. All the examples below use a Character Start property value of 0, and a Character End property value of 2, but the subproperty functions similarly when using percentages.

- **Left to Right** [image: Animator range right to left]
- **Right to Left** [image: Animator range left to right]
- **From Center** [image: Animator range from center]

| Numeric Linked Properties | Description |
| --- | --- |
| **Amplitude Min** | Determines the minimum movement of the animation. |
| **Amplitude Max** | Determines the maximum movement of the animation. |
| **Magnitude** | Determines the magnitude of the linked property. |
| **Time Offset** | Determines how long it takes to play a group of linked animations. |
| **Mode** | Determines how the animator interprets values in the properties affecting the animation. Options are:**Absolute****Additive** |
| **Range** | Determines what elements of a group actor are animated. See the Range table below. |

| Range Sub-Properties | Description |
| --- | --- |
| **Unit** | Determines how to measure the range for applying the animation. Options are:**Percentage****Character** |
| **Start** | Determines at what percentage of the actor group to start applying the animation. Only available when the Unit property is set to Percentage. |
| **End** | Determines at what percentage of the actor group to stop applying the animation. Only available when the Unit property is set to Percentage. |
| **Offset** | Determines an offset applied to the percentage of the actor group for applying the animation. Only available when the Unit property is set to Percentage. |
| **Character Start** | Determines at what character of the text actor to start applying the animation. Only available when the Unit property is set to Character. |
| **Character End** | Determines at what character of the text actor to stop applying the animation. Only available when the Unit property is set to Character. |
| **Character Offset** | Determines an offset applied to the characters of the text actor for applying the animation. Only available when the Unit property is set to Character. |
| Direction | Determines the direction used when calculating the range. Options are:**Left to Right****Right to Left****From Center** |

## Individual Numeric Animators

Here, you can find a description of each of the Numeric animators.

### Bounce

The **Bounce **animator has several properties you can use to control its effect. The default behavior is for the animation target to fall, then bounce.

 [image: Bounce animator]

#### Invert Effect

Enabling the **Invert Effect** property changes the behavior. Rather than falling down and bouncing, the ball will bounce, then rise up.

[image: Bounce animator inverted]

#### Bounce Common Properties

Refer to the Common Properties (-> animators-in-unreal-engine) section for details.

- Magnitude
- Cycle Mode
- Cycle Duration
- Cycle Gap Duration
- Seed
- Linked Properties
- Time Source Name

| Bounce Properties | Description |
| --- | --- |
| **Invert Effect** | Reverses the effect of the bounce animation. |

### Curve

The **Curve **animator is versatile and has many customizable options you can use to achieve various effects. In particular, you can use the Curve animator to recreate the effects of the Bounce, Oscillate, and Pulse animators, see the Presets section for more information.

#### Loop Curve

You can use the **Loop Curve** property to determine the shape of the main part of your curve. In the example below, we used Loop Curve to create a simple curve. We linked the Loop Curve to the **RelativeRotation.Z** property of the text actor, and set the values of the **Amplitude Min** and **Amplitude Max** properties to -90 and 90, respectively. The result is that the animation follows a curve, rotating back and forth on the Z axis between the minimum and maximum amplitude values.

 [image: Animator loop curve]

##### Loop Curve Types

There are many different curves available for use with the Loop Curve property, some based on mathematical functions. See the list of curves below.

| Icon | Name | Icon | Name |
| --- | --- | --- | --- |
|  | **Bounce** |  | **Noise_High** |
|  | **Constant** |  | **Pulse** |
|  | **Cosine** |  | **Sawtooth** |
|  | **Elastic** |  | **Sine** |
|  | **Linear** |  | **Square** |
|  | **Noise** |  | **Triangle** |

#### In and Out

You can use the **In** and **Out** properties to define how the animator behaves as the curve begins and ends. You can enable both properties and assign a **Curve **type for each one. For this example, to simplify the curve, we set the Loop Curve to constant so that the only influence on the curve comes from the In and Out properties.

 [image: Animator curve in and out]

##### Duration

The **Duration **subproperty of the In and Out properties determines how much time to give to each part of the loop. In the example above, the Duration is longer on the Out animation, which causes the text to rotate counter-clockwise at a slower pace.

[image: Animator In and Out Duration subproperty]

##### In and Out Curve Types

There are many different curves available for use with the In and Out properties, mostly based on mathematical functions. See the list of curves below.

| Icon | Name | Icon | Name |
| --- | --- | --- | --- |
|  | Bounce |  | InSine |
|  | InBack |  | Jiggle1 |
|  | InCircular |  | Jiggle2 |
|  | InCubic |  | Jiggle3 |
|  | InExponential |  | Jiggle4 |
|  | InOutBack |  | Jiggle5 |
|  | InOutCircular |  | Linear |
|  | InOutCubic |  | OutBack |
|  | InOutExponential |  | OutCircular |
|  | InOutOvershoot |  | OutCubic |
|  | InOutQuadratic |  | OutExponential |
|  | InOutQuartic |  | OutOvershoot |
|  | InOutQuintic |  | OutQuadratic |
|  | InOutSine |  | OutQuartic |
|  | InOvershoot |  | OutQuintic |
|  | InQuadratic |  | OutSine |
|  | InQuartic |  | Squared |
|  | InQuintic |  |  |

#### Curve Common Properties

Refer to the Common Properties (-> animators-in-unreal-engine) section for details.

- Magnitude
- Cycle Mode
- Cycle Duration
- Cycle Gap Duration
- Seed
- Linked Properties
- Time Source Name
- Range

#### Working with Curve Animators

You can emphasize the motion of your curve using the Magnitude property. Setting it to 1.0 produces results similar to the example animations above, but increasing it slightly creates a swing with a larger windup. Here is an example where we set Magnitude to 1.4.

 [image: Curve animator with modified magnitude]

You can create interesting effects by applying a **Time Offset** on specific text characters, and then rotating individual characters with or without the Seed property enabled. Notice that without using the **Seed** property, the characters rotate in order from right to left, but with the Seed property enabled, they rotate in a random order. Changing the Seed value changes the rotation order.

Without Seed:

 [image: Curve animator without seed]

With Seed:

 [image: Curve animator with seed]

| Curve Properties | Description |
| --- | --- |
| **In** | Optional. Defines a curve for the start of the curve animation. Requires you to select a curve type, and a duration in seconds. |
| **Loop Curve** | Defines the curve used for the main animation. |
| **Out** | Optional. Defines a curve for the end of the curve animation. Requires you to select a curve type, and a duration in seconds. |

### Oscillate

You can use the **Oscillate **animator to have your animated actor alternate between minimum and maximum values for the property it is attached to.

#### Oscillate Function

To achieve this effect, the animator has one unique property, the **Oscillate Function**, which controls how the animation moves between the minimum and maximum across time. The examples shown below all have the Oscillate animator applied to the RelativeLocation.Z property of sphere actors.

##### Sine and Cosine

The **Sine **and **Cosine **functions produce a smooth oscillation that decelerates at the minimum and maximum values before reversing.

##### Square and Inverted Square

The Square and Inverted Square functions oscillate between the minimum and maximum values, never in-between.

 [image: oscillate animator square and inverted square]

##### Sawtooth

The Sawtooth function moves from minimum to maximum, and then resets before the next oscillation.

 [image: Oscillate animator sawtooth]

##### Triangle

The Triangle function oscillates back and forth between the minimum and maximum values at a consistent speed, with an instant reversal at each transition.

 [image: Oscillate animator triangle]

#### Oscillate Common Properties

Refer to the Common Properties (-> animators-in-unreal-engine) section for details.

- Magnitude
- Cycle Mode
- Cycle Duration
- Cycle Gap Duration
- Seed
- Linked Properties
- Time Source Name

| Oscillate Properties | Description |
| --- | --- |
| **Oscillate Function** | Determines how the Oscillate animator moves the animated actors. Options are:SineCosineSquareInverted SquareSawtoothTriangle |

### Pulse

The **Pulse **animator moves a curve through the actors you are animating, creating a wavelike effect using a curve of your choosing.

#### Easing Function

The **Easing Function** property is how you choose the animation curve type for your Pulse animation. The default curve option is Linear. See below for examples of the curve options.

##### Linear

 [image: Pulse linear easing function]

##### Sine

 [image: Pulse sine easing function]

##### Quad

 [image: Pulse quad easing function]

##### Cubic

 [image: Pulse cubic easing function]

##### Quart

 [image: Pulse quart easing function]

##### Quint

 [image: Pulse quint easing function]

##### Expo

 [image: Pulse expo easing function]

##### Circ

 [image: Pulse circ easing function]

##### Back

 [image: Pulse back easing function]

##### Elastic

 [image: Pulse elastic easing function]

##### Bounce

 [image: Pulse bounce easing type]

#### Easing Type

The **Easing Type** property gives you control over how the curve is applied to your actors. Your options are:

- **In**: The curve is applied more at the beginning of the animation.
- **Out**: The curve is applied more at the end of the animation.
- **In Out**: Combines the functions of the other two options.

The video below shows some comparisons between using the In and Out Easing Type options for various curves.

#### Pulse Common Properties

Refer to the Common Properties (-> animators-in-unreal-engine) section for details.

- Magnitude
- Cycle Mode
- Cycle Duration
- Cycle Gap Duration
- Seed
- Linked Properties
- Time Source Name

| Pulse Properties | Description |
| --- | --- |
| **Easing Function** | Determines the curve used for the animation. Options are:LinearSineQuadCubicQuartQuintExpoCircBackElasticBounce |
| **Easing Type** | Determines when during the animation the curve applies most. Options are:InOutIn Out |

### Soundwave

You can use the **Soundwave **animator to drive the properties of an actor in your level using an audio source.

#### Sampled Sound Wave

The **Sampled Sound Wave** property is how you choose what sound to drive the animation.

[image: Soundwave animator sampled soundwave property]

When you expand the dropdown menu, you are presented with several options. You can create a new MetaSound (-> metasounds-in-unreal-engine) or Source Bus (-> audio-bus-overview) asset, or select any of the existing sounds available in Unreal Engine, either by selecting them from the list or browsing for one using the search bar. You can adjust your search parameters using the available settings by clicking the gear icon.

[image: Soundwave animator sound source options]

#### Loop

You can loop your soundwave animation by enabling the **Loop **property.

#### Soundwave Common Properties

Refer to the Common Properties (-> animators-in-unreal-engine) section for details.

- Magnitude
- Seed
- Linked Properties
- Time Source Name

#### Working with Soundwave Animators

To use the animator, start by adding it to one of your actors. In the example below, we used a sphere actor.

[image: Soundwave animator on sphere]

In the example, the sphere already has a material applied to it using the Material Designer.

[image: Soundwave animator sphere material]

Because we already added the modifier, right-clicking the green value shows the following menu:

[image: Selecting the value for the soundwave animator]

In the example, we selected **Value.G (Float)** from the **Existing Animators** section. This added the property to the **Linked Properties** in the **Animators **panel. Next, we set the **Sampled Sound Wave** to an audio file. When creating your own animations, you can expose other properties to amplify the effect. In the example below, we added a scale property to make the sphere expand while the sound plays. You’ll notice that it gets brighter as it expands.

Here is the effect of combining scale with the color to make it glow and expand.

 [image: Soundwave example using scale and brightness]

If you have several actors using this animator, and you want to make sure they aren’t synchronized, you can change the **Seed **property.

### Time

When you want to animate an object property and define how long it takes to do a complete cycle through the animation, you can use the **Time **animator to control it.

In the example below, the property animated is the rotation:

 [image: Time animator]

Notice the range of values from the Amplitude Min property value of -180 to the Amplitude Max property value of 180 results in a rotation of 360 total degrees. Values of 0 and 360 respectively would accomplish the same goal.

#### Time Common Properties

Refer to the Common Properties (-> animators-in-unreal-engine) section for details.

- Magnitude
- Cycle Mode
- Cycle Duration
- Cycle Gap Duration
- Seed
- Linked Properties
- Time Source Name

### Wiggle

The **Wiggle **animator randomizes the value of a property (such as a transform) between two values: the **Amplitude Min** and **Amplitude Max**.

 [image: Wiggle animator]

#### Frequency

The Wiggle animator has one unique property, **Frequency**, measured in Hz. The higher your frequency, the faster your actor will wiggle. If you have several actors using this animator, and you want to make sure they aren’t wiggling in an identical fashion, you can change the Seed property.

#### Wiggle Common Properties

Refer to the Common Properties (-> animators-in-unreal-engine) section for details.

- Magnitude
- Seed
- Linked Properties
- Time Source Name

| Wiggle Properties | Description |
| --- | --- |
| Frequency | Determines how quickly the animated actor wiggles. |

## Presets

The Bounce, Oscillate, and Pulse animators are functionally specialized implementations of the Curve animator. It is possible to achieve the same results as those animators using only specific parameters for the Curve animator properties. The numeric animator presets provide exactly those specific parameters.

There are three presets:

- **Pulse (Curve)**
- **Oscillate (Curve)**
- **Bounce (Curve)**

All of these function in similar ways. When added to an actor, each is a Curve animator with the properties set up so that the parameters create the effects of the standard Pulse, Oscillate, and Bounce animators, respectively.

[image: Animator presets]

This provides you with a starting point to make more complex animations than you can with the standard animators, by modifying those parameters to produce animation effects different from what is possible with the standard animators.

## Text

Text animators are designed to change the content of Text actors, according to the effects you want to apply, rather than animating the characters themselves as with the numeric animators. Here you can find a description of the common properties for text animators, and the functionality of each text animator.

### Time Source Name

Similar to the numeric animators, you can drive your text animator from a variety of time sources using the **Time Source Name** property, but there are differences in how the property functions, compared to numeric animators. The **World**, **Manual**, and **Sequencer **options are similar, but you also have access to the **System **option.

#### World

Setting your time source to **World **displays the total amount of time in seconds you’ve had your level open, as shown in the example image below.

[image: Text animator world time]

#### Manual

For text animators using the **Manual **option for the Time Source Name property, the Custom Time and Playback State subproperties function identically to how they behave for numeric animators.

#### Sequencer

You can drive your text animator using a **Sequencer** track, in the same way as numeric animators. Click **Create Track** to drive your counter using the Sequencer playhead.

You can do something like this:

#### System

Setting your time source to **System **displays a count of the time in seconds based on the system clock. The System option also provides a **Mode **subproperty, where you can choose between three display options for the system time.

- **Local Time**
- **Countdown**
- **Stopwatch**

##### Local Time

The **Local Time** option is the default for system time. Unlike the World option, which counts how long your level has been open, the Local Time option displays how your system tracks time from zero. As this is based on the current calendar year, with the zero point being 0 AD, the default value shown is a large number, almost 64 billion seconds.

[image: System time default value]

##### Countdown

The **Countdown **option, as the name reveals, counts down from the time you enabled the Time Source Name property. The Countdown option provides access to two additional subproperties, **Countdown Format** and **Countdown Time**. These function identically to how they function for the Global Time Source Name Countdown (-> animators-in-unreal-engine) option, except limited to only their respective text animator.

[image: Countdown subproperties]

##### Stopwatch

The **Stopwatch **option counts up from the time you enabled the Time Source Name property. By default, the count is displayed in seconds.

##### UTC

When using the System option, you can enable the **UTC time** property to show the time according to Coordinated Universal Time (UTC).

### Linked Properties

Text animators use linked properties to control the text of text actors. The first step to using any text animator is to link its properties to the text actor you added it to.

The example here uses a Clock animator, but the workflow applies to Counter animators as well.

After you add a text animator to a text actor, you see the same error message as for numeric animators, **No properties are currently linked to this animator**, as shown in the image below.

[image: Linked Properties error message]

In this example, we placed a standard Text actor from the Motion Design palette, then added the Clock animator to it.

[image: Motion Design text actor]

After adding the animator, click the **+** button next to** Linked Properties**, then under **Presets **select **Text**, then **Text (FText)**

[image: Linked Properties for text animator]

After you link the Text(FText) to your text animator, the text animator now controls how the text displays, depending on the value of the properties for your text animator.

#### Mode

For text animators, only the **Mode** linked property becomes available when you link your text animator to your text actor. However, compared to the numeric animators, it gives you different functionality for the Absolute and Additive options.

##### Absolute

The Absolute option for the Mode property replaces the displayed text of the text actor with the output of the text animator.

##### Additive

The Additive option appends the output of the text animator to the existing text of the actor. The effects of the Additive option create results similar to the Display Format or Display Pattern properties, but by modifying the text actor instead of the text animator.

We don't recommend using both the Display Format or Display Pattern and Additive Mode to modify the text simultaneously, as this is likely to have inconsistent or unpredictable results.

### Clock

The **Clock** animator provides a way for you to display time in a variety of configurations. This is useful when trying to use a digital clock in your designs (such as in a sports scoreboard or a countdown). Because of this focus, the Clock animator has only one unique property, the **Display Format**, and the customization options are focused on how to display the date and time.

#### Display Format

The **Display Format** property gives you a way to decide what to display, by combining text characters with variables. By default, the Display Format property of the clock is set up to display hours, minutes, and seconds (%H:%M:%S). There are a large number of variables you can use to customize how your Clock animator displays the time and date, which you can combine freely with text characters.

| Display Format Date / Time Variable | Description |
| --- | --- |
| %a | Weekday, abbreviated. For example, Sun. |
| %A | Weekday, full. For example, Sunday. |
| %w | Weekday, 0–6, Sunday is 0. |
| %y | Year, last 2 digits, YY. |
| %Y | Year, four digits, YYYY. |
| %b | Month, abbreviated. For example, Jan. |
| %B | Month, full. For example, January. |
| %m | Month, 01–12 |
| %n | Month, 1–12 |
| %d | Day, 01–31 |
| %e | Day, 1–31 |
| %] | Day of the Year, 001–366 |
| %J | Day of the Year, 1–366 |
| %I (lowercase L) | 12h Hour, 1–12 |
| %l (capital i) | 12h Hour, 01–12 |
| %H | 24h Hour, 00–23 |
| %h | 24h Hour, 0–23 |
| %M | Minute, 00–59 |
| %N | Minute, 0–59 |
| %S | Second, 00–60 |
| %s | Second, 0–60 |
| %f | Millisecond, 000–999 |
| %F | Millisecond, 0–999 |
| %p | AM or PM |
| %P | am or pm |
| %t | Ticks since midnight, January 1, 0001 |

[image: Clock animator properties]

#### Working with Clock Animators

When you first add the Clock animator to your text actor, you must set up its Linked Properties, as described above.

After linking the Clock animator to your text actor's Text(FText) property, your result should resemble the image below. The Clock animator uses the World time by default, so it reflects how long the level has been open. In this example, it’s been open for 1 minute and 10 seconds.

[image: Clock animator using the World time source]

If your goal is to control the time value shown on the clock rather than display the time, set the Time Source Name property to Sequencer, then click Create Track.

[image: Clock animator Sequencer Create Track]

After creating a track, you can directly control the displayed time by scrubbing in Sequencer (as shown above in the Text Common Properties under Sequencer (-> animators-in-unreal-engine)).

| Clock Properties | Description |
| --- | --- |
| **Display Format** | Determines the date and time format of the Clock animator using variables and text characters. |

### Counter

The **Counter **animator provides a way for you to display a numerical value as it counts, similar to a stopwatch. Unlike the Clock animator, the properties of the Counter animator are broad and customizable.

When you first add a Counter animator to your text actor, you see the following interface:

[image: Counter animator initial state]

You must set up the Counter animator's Linked Properties, as described above.

After linking the Counter animator to your text actor's Text(FText) property, you should immediately see the text update to show your counter:

[image: Counter animator after setting Linked Properties]

You can now proceed in two ways:

- Select a preset for your counter animator using the **Preset Format Name** dropdown menu.
- Enable **Use Custom Format** to customize your counter's properties manually.

In either case, you can customize your counter's display using the **Display Pattern **property.

#### Display Pattern

You can customize your timer's format using the **Display Pattern** property by placing text before and after the count value.

[image: Display pattern property default]

The default setting, with no additional text, produces a result similar to the image below:

[image: Counter animator default display]

In the example below, we added additional text:

[image: Counter animator modified Display Pattern property]

The added text produces a result like in the image below:

[image: Counter animator modified display]

#### Use Custom Format

If you don't want to use a preset, enable **Use Custom Format**.

[image: Use Custom Format property]

When you enable Use Custom Format, the **Custom Format** property replaces the Preset Format Name property. Expand the property to see the available subproperties you can modify to customize your Counter animator.

#### Preset Format Name

The **Preset Format Name** property provides a dropdown menu you can use to select a counter preset from those you have available. When you first start working with counter animators, you only have access to the Default preset. You need to create and save additional presets to have them available to use with counter animators in your projects.

[image: Preset Format Name menu default list]

#### Custom Format

The **Custom Format** property expands to show a list of subproperties you can use to customize your counter.

[image: Custom Format subproperty list]

##### Format Name

Use the **Format Name** subproperty to give your format a name, which determines how it appears in the list of presets in the Project Settings.

##### Min Integer Count

The **Min Integer Count** subproperty determines the number of integers before the decimal. The example in the first image below shows a value of 3. The functioning of the **Padding Character** and **Truncate **subproperties also depend on the value of the Min Integer Count subproperty.

[image: Min Integer Count subproperty value of 3]

The example below shows a value of 10.

[image: Min Integer Count subproperty value of 3]

##### Max Decimal Count

The **Max Decimal Count** subproperty determines the number of decimal places, functioning in the same way as the Min Integer Count does for the integers.

##### Grouping Size

The **Grouping Size** subproperty Increases the number of digits necessary to display something as a thousand. The default value is 0, which means no grouping.

The image below shows an example with a count of 900.3, with the Grouping Size value set to 1.

[image: Grouping Size set to 1]

Here is an example with a count of 1031.3, with the Grouping Size value set to 3, which creates the standard 3-digit grouping by thousands.

[image: Grouping Size set to 3]

For clarification, this is a further example with a count in the thousands (1075.6) with the Grouping Size value set to 1

[image: Grouping size set to 1 with a 4 digit number]

##### Decimal Character

The **Decimal Character** subproperty replaces the character representing a decimal with the character you select. The example below shows a question mark used instead.

[image: Decimal Character using question mark]

##### Grouping Character

The **Grouping Character** subproperty functions in the same way as the Decimal Character property, except it instead replaces the comma used for grouping with the character you select.

##### Padding Character

You can use the **Padding Character** subproperty to determine how to fill the empty spaces in your counter, using the character you select. In the example shown below, the Min Integer Count value is 9, the counter is counting seconds, but several fields are empty because the seconds count isn't high enough, so the empty spots are replaced with dashes.

[image: Padding Character using the dash character]

If you leave the Padding Character subproperty empty, the empty spots are not shown, and you see something like the example below:

[image: Padding Character property with no value]

##### Rounding Mode

The **Rounding Mode** subproperty provides the option to round the value up or down. The options are:

- **None**: No rounding (default).
- **Round**: Round off, which means down for rounded values below 5, and up for rounded values greater than 5.
- **Floor**: Round down.
- **Ciel**: Round up.

##### Use Sign

The **Use Sign** subproperty adds a **+** or **-** character to the count, depending on whether the value of the Custom Time property is positive or negative.

[image: Use Sign subproperty]

[image: Use Sign subproperty display]

##### Truncate

The **Truncate **subproperty provides a way for you to cap the number of displayed characters to the value set in the Min Integer Count property. For example, if you have the Min Integer Count property set to 2, you will see this:

[image: Min Integer Count subproperty setting at 2]

If you have the Min Integer Count set to 1, you will see this:

[image: Min Integer Count subproperty setting at 1]

[image: Truncate display with Min Integer Count at 1]

#### Saving Presets

If, after creating a custom format, you want to save it for reuse, click **Save Custom Format as Preset**. The values of your custom format subproperties populate the preset properties in the **Property Animator** settings. For this example, we entered 11 for the values of several subproperties, as a demonstration:

[image: Sample Custom Format subproperties]

We saved the subproperty values as described above, then disabled **Use Custom Format**:

[image: Disabled Use Custom Format property]

We then click **Open Property Animator Settings**, and can now see the saved property values as a new preset, second in the list of preset options.

[image: Motion Design Property Animator presets]

#### Creating Presets

If you want to create presets directly without using the Custom Format property, you can click **Open Property Animator Settings** to create presets for your counter animators.

[image: Motion Design Property Animator presets default list]

The properties are the same as the subproperties available under the Custom Format property in the counter animator. Click the + icon to add a new set element to the list Counter Format Presets, then enter the preset values you choose. Make sure to give your preset a unique name to identify it.

You can optionally:

- Click **Set as Default** to make your current preset your new default for your counter animators.
- **Export **or **Import **a saved preset.
- Click **Reset to Defaults** to wipe out your current preset values to start over.

| Counter Properties | Description |
| --- | --- |
| **Display ******Pattern | Determines the text that precedes and follows the counter. |
| **Use Custom Format** | Enable to use the Custom Format property and its subproperties. |
| **Preset Format Name** | Determines the preset used for the counter animator. Only available when Use Custom Format is disabled. |
| **Custom Format** | Provides access to various subproperties for customizing the counter animator's functionality. See the table below for the list of subproperties. |

| Custom Format Subproperties | Description |
| --- | --- |
| **Format Name** | Determines the name used to identify the custom format. |
| **Min Integer Count** | Determines the minimum number of integers shown on the counter. |
| **Max Decimal Count** | Determines the maximum number of decimal places shown on the counter. |
| **Grouping Size** | Determines how many digits to group together before showing a grouping character. |
| **Decimal Character** | Determines the character used for the decimal point. |
| **Grouping Character** | Determines the character used to separate groupings. |
| **Padding Character** | Determines the character used to fill empty spaces when using a high Min Integer Value. |
| **Rounding Mode** | Determines the method used for rounding the decimal places value. Options are:NoneRoundFloorCiel |
| **Use Sign** | Enable to display the sign of the value (+ or -). |
| **Truncate** | Enable to cap the number of integers shown to the Min Integer Value. |

- animators
- motion design

On this page

- Adding Animators (-> animators-in-unreal-engine)
- Global Properties (-> animators-in-unreal-engine)
- Global Magnitude (-> animators-in-unreal-engine)
- Global Time Source Name (-> animators-in-unreal-engine)
- World (-> animators-in-unreal-engine)
- Manual (-> animators-in-unreal-engine)
- Custom Time (-> animators-in-unreal-engine)
- Playback State (-> animators-in-unreal-engine)
- Sequencer (-> animators-in-unreal-engine)
- System (-> animators-in-unreal-engine)
- Local Time (-> animators-in-unreal-engine)
- Countdown (-> animators-in-unreal-engine)
- Countdown Format (-> animators-in-unreal-engine)
- Countdown Time (-> animators-in-unreal-engine)
- Stopwatch (-> animators-in-unreal-engine)
- Use UTC (-> animators-in-unreal-engine)
- Frame Rate (-> animators-in-unreal-engine)
- Numeric Common Properties (-> animators-in-unreal-engine)
- Magnitude (-> animators-in-unreal-engine)
- Cycle Mode (-> animators-in-unreal-engine)
- Do Once (-> animators-in-unreal-engine)
- Loop (-> animators-in-unreal-engine)
- Ping Pong (-> animators-in-unreal-engine)
- Cycle Duration (-> animators-in-unreal-engine)
- Cycle Gap Duration (-> animators-in-unreal-engine)
- Seed (-> animators-in-unreal-engine)
- Time Source Name (-> animators-in-unreal-engine)
- World (-> animators-in-unreal-engine)
- Manual (-> animators-in-unreal-engine)
- Custom Time (-> animators-in-unreal-engine)
- Playback State (-> animators-in-unreal-engine)
- Sequencer (-> animators-in-unreal-engine)
- Frame Rate (-> animators-in-unreal-engine)
- Linked Properties (-> animators-in-unreal-engine)
- Working with Linked Properties (-> animators-in-unreal-engine)
- Amplitude Min (-> animators-in-unreal-engine)
- Amplitude Max (-> animators-in-unreal-engine)
- Magnitude (-> animators-in-unreal-engine)
- Time Offset (-> animators-in-unreal-engine)
- Mode (-> animators-in-unreal-engine)
- Absolute (-> animators-in-unreal-engine)
- Additive (-> animators-in-unreal-engine)
- Range (-> animators-in-unreal-engine)
- Unit (-> animators-in-unreal-engine)
- Percentage (-> animators-in-unreal-engine)
- Start and End (-> animators-in-unreal-engine)
- Offset (-> animators-in-unreal-engine)
- Character (-> animators-in-unreal-engine)
- Character Start and Character End (-> animators-in-unreal-engine)
- Character Offset (-> animators-in-unreal-engine)
- Direction (-> animators-in-unreal-engine)
- Individual Numeric Animators (-> animators-in-unreal-engine)
- Bounce (-> animators-in-unreal-engine)
- Invert Effect (-> animators-in-unreal-engine)
- Bounce Common Properties (-> animators-in-unreal-engine)
- Curve (-> animators-in-unreal-engine)
- Loop Curve (-> animators-in-unreal-engine)
- Loop Curve Types (-> animators-in-unreal-engine)
- In and Out (-> animators-in-unreal-engine)
- Duration (-> animators-in-unreal-engine)
- In and Out Curve Types (-> animators-in-unreal-engine)
- Curve Common Properties (-> animators-in-unreal-engine)
- Working with Curve Animators (-> animators-in-unreal-engine)
- Oscillate (-> animators-in-unreal-engine)
- Oscillate Function (-> animators-in-unreal-engine)
- Sine and Cosine (-> animators-in-unreal-engine)
- Square and Inverted Square (-> animators-in-unreal-engine)
- Sawtooth (-> animators-in-unreal-engine)
- Triangle (-> animators-in-unreal-engine)
- Oscillate Common Properties (-> animators-in-unreal-engine)
- Pulse (-> animators-in-unreal-engine)
- Easing Function (-> animators-in-unreal-engine)
- Linear (-> animators-in-unreal-engine)
- Sine (-> animators-in-unreal-engine)
- Quad (-> animators-in-unreal-engine)
- Cubic (-> animators-in-unreal-engine)
- Quart (-> animators-in-unreal-engine)
- Quint (-> animators-in-unreal-engine)
- Expo (-> animators-in-unreal-engine)
- Circ (-> animators-in-unreal-engine)
- Back (-> animators-in-unreal-engine)
- Elastic (-> animators-in-unreal-engine)
- Bounce (-> animators-in-unreal-engine)
- Easing Type (-> animators-in-unreal-engine)
- Pulse Common Properties (-> animators-in-unreal-engine)
- Soundwave (-> animators-in-unreal-engine)
- Sampled Sound Wave (-> animators-in-unreal-engine)
- Loop (-> animators-in-unreal-engine)
- Soundwave Common Properties (-> animators-in-unreal-engine)
- Working with Soundwave Animators (-> animators-in-unreal-engine)
- Time (-> animators-in-unreal-engine)
- Time Common Properties (-> animators-in-unreal-engine)
- Wiggle (-> animators-in-unreal-engine)
- Frequency (-> animators-in-unreal-engine)
- Wiggle Common Properties (-> animators-in-unreal-engine)
- Presets (-> animators-in-unreal-engine)
- Text (-> animators-in-unreal-engine)
- Time Source Name (-> animators-in-unreal-engine)
- World (-> animators-in-unreal-engine)
- Manual (-> animators-in-unreal-engine)
- Sequencer (-> animators-in-unreal-engine)
- System (-> animators-in-unreal-engine)
- Local Time (-> animators-in-unreal-engine)
- Countdown (-> animators-in-unreal-engine)
- Stopwatch (-> animators-in-unreal-engine)
- UTC (-> animators-in-unreal-engine)
- Linked Properties (-> animators-in-unreal-engine)
- Mode (-> animators-in-unreal-engine)
- Absolute (-> animators-in-unreal-engine)
- Additive (-> animators-in-unreal-engine)
- Clock (-> animators-in-unreal-engine)
- Display Format (-> animators-in-unreal-engine)
- Working with Clock Animators (-> animators-in-unreal-engine)
- Counter (-> animators-in-unreal-engine)
- Display Pattern (-> animators-in-unreal-engine)
- Use Custom Format (-> animators-in-unreal-engine)
- Preset Format Name (-> animators-in-unreal-engine)
- Custom Format (-> animators-in-unreal-engine)
- Format Name (-> animators-in-unreal-engine)
- Min Integer Count (-> animators-in-unreal-engine)
- Max Decimal Count (-> animators-in-unreal-engine)
- Grouping Size (-> animators-in-unreal-engine)
- Decimal Character (-> animators-in-unreal-engine)
- Grouping Character (-> animators-in-unreal-engine)
- Padding Character (-> animators-in-unreal-engine)
- Rounding Mode (-> animators-in-unreal-engine)
- Use Sign (-> animators-in-unreal-engine)
- Truncate (-> animators-in-unreal-engine)
- Saving Presets (-> animators-in-unreal-engine)
- Creating Presets (-> animators-in-unreal-engine)
