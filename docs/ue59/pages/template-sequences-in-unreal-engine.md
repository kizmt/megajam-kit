# Template Sequences

https://dev.epicgames.com/documentation/en-us/unreal-engine/template-sequences-in-unreal-engine?application_version=5.9

> Reuse animation data created in sequencer with Template Sequences.

[image: Template Sequences]

Learn to use this **Beta** feature, but use caution when shipping with it.

Template Sequences enable the reuse of animation data created in Sequencer for Actors of a compatible class (same or inherited). Similar to how animation sequences can be played on any compatible Skeletal Mesh, Template Sequence animation can be played on any compatible Actor.

#### Prerequisites

- You have an understanding of **Sequencer (-> how-to-make-movies-in-unreal-engine)** and its **Interface**.

- You have an understanding of **Blueprints Visual Scripting (-> blueprints-visual-scripting-in-unreal-engine)**.

## Template Sequence Asset

To start using Template Sequences, you must first create a Template Sequence asset. Do this by right-clicking the **Content Browser** and selecting **Animation > Template Sequence**.

 [image: create template sequence]

Next, select the root object class binding for the sequence.

 [image: template sequence root binding]

Once created, double-click the asset to open the Template Sequence window. You should see your root object class added to the sequence as a **Spawnable**.

 [image: open template sequence]

### Interface

The Template Sequence interface looks similar to Sequencer's interface, with the exception of certain unneeded items omitted from the toolbar.

A new **Bind Actor Class** button is added to the toolbar, which allows for rebinding the root Actor class.

 [image: template sequence bind actor class button]

### Camera Animation Sequence

Template Sequences are commonly used for creating template camera animation. You can easily create a Template Sequence with a default binding to a camera by right-clicking the **Content Browser** and selecting **Animation > Camera Animation Sequence**.

Upon opening this Template Sequence, you will see a **Cine Camera Actor (-> cinematic-cameras-in-unreal-engine)** added to the sequence. The **Bind Actor Class** button's behaviour has also changed to swap between the **Cine Camera Actor** and the **Legacy Camera Actor (-> camera-actors-in-unreal-engine)**

 [image: camera animation sequence]

## Usage

This section describes how to bind and rebind Actors to Template Sequences and assign your animations to other Actors of the same class.

### Binding Actors

Template Sequences require you bind your Actors as **Spawnables** in order to animate. Therefore, you can bind or rebind Actors to your Template Sequence by dragging them from either the Content Browser or the **Place Actors (-> placing-actors-in-unreal-engine)** panel.

 [image: template sequence drag drop]

Only a single Actor can be added to a Template Sequence, as adding another Actor from a different class will change the current binding.

### Content Setup

If the content of your Template Sequence is meant to be additive, you will need to ensure your animation sections are set to **Additive**, **Relative**, or **Additive from Base**.

Do this by right-clicking the section keyframe area and selecting one of the **Additive **options from the **Blend Type** submenu.

 [image: template sequence additive transform]

You can then create your additive animation in the Template Sequence view. In this example the animation is of a simple bouncing ball, in which the ball hits the ground at the (0, 0, 0) coordinates.

 [image: template sequence example]

### Apply Template Sequence Animation

Template Sequences are meant to be used on an Actor within a Level Sequence. The Actor's class must match the class that the Template Sequence was bound to.

In your Level Sequence, click the **+ Track** button, navigate to **Template Sequence,** and select your **Template Sequence Asset**.

 [image: template sequence track]

You can apply your Template Sequence animation to any Actor of the same class. If your template is additive, the animation will apply additively to the Actor's current position.

 [image: multiple template sequences]

### Property Multipliers

Property Multipliers can be used on the Template Sequence instance as a way to modify the intensity of properties and transforms for each template instance. The multipliers available to add to a Template Sequence is based on the **Property Tracks (-> cinematic-transform-and-property-tracks-in-unreal-engine)** that you have added to the Actor class in the Template Sequence.

To add a Property Multiplier, right-click the Template Sequence section and select your property from the **Property Multipliers** menu.

 [image: template sequence property multiplier]

Once added, you can expand the **Template Animation** track and view the multipliers, which typically have a default value of **1**. You can change the value of a multiplier and set keyframes for it.

 [image: template sequence property multiplier]

Using Property Multipliers, you can vary the intensities of each instance of your Template Sequence.

 [image: property multiplier variation]

## Blueprint Usage

Template Sequences can also be applied to Actors at runtime using the **Create Template Sequence Player** Blueprint node.

 [image: create template sequence player]

### Content Setup

- In your Blueprint, add the **Create Template Sequence Player** node. Once added, select your **Template Sequence** asset from the dropdown menu on the node. [image: assign template sequence player]

- Call **Set Binding** from the **Template Sequence Player** node and connect the **Out Actor** pin from the **Template Sequence Player** node to the **Target** pin.

- Add a reference to the Actor you want to apply the template sequence animation to and connect it to the **Set Binding **node's** Actor** pin. [image: template sequence blueprints]

- Lastly, add a **Play** node and connect from the **Create Template Sequence Player **node's **Return Value** pin. [image: template sequence blueprints]

- beta
- sequencer
- camera animation
- additive sequencer animation

On this page

- Prerequisites (-> template-sequences-in-unreal-engine)
- Template Sequence Asset (-> template-sequences-in-unreal-engine)
- Interface (-> template-sequences-in-unreal-engine)
- Camera Animation Sequence (-> template-sequences-in-unreal-engine)
- Usage (-> template-sequences-in-unreal-engine)
- Binding Actors (-> template-sequences-in-unreal-engine)
- Content Setup (-> template-sequences-in-unreal-engine)
- Apply Template Sequence Animation (-> template-sequences-in-unreal-engine)
- Property Multipliers (-> template-sequences-in-unreal-engine)
- Blueprint Usage (-> template-sequences-in-unreal-engine)
- Content Setup (-> template-sequences-in-unreal-engine)
