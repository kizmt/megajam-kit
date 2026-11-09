# Legacy Composure Quick Start

https://dev.epicgames.com/documentation/en-us/unreal-engine/realtime-compositing-quick-start-for-unreal-engine?application_version=5.9

> Product documentation including reference and guides for Unreal Engine

[image: Legacy Composure Quick Start]

Learn to use this **Beta** feature, but use caution when shipping with it.

The most basic of composites is the three piece comp: a CG background, a middle media (video) plate, and a CG foreground. In this topic, we'll demonstrate how to use composure to build a basic three piece comp.

## 1 - Load Composure

### Steps

- Enable the **Composure Plugin**.[image: Enable plugin]
- Open the compositing tree panel (listed as **Composure Compositing** in the **Window** menu under **Virtual Production** section).[image: Open the compositing tree panel]

## 2 - Add a Root Comp Element

Next, add a root Element to the compositing tree.

### Steps

- Right-click in the compositing tree panel, and select **Create New Comp** from the menu. Then, select **Empty Comp Shot** from the **Pick a Comp Class** dialog. [image: Create New Comp]This Element will not render anything immediately as it represents your final composite. This Element will be responsible for combining all of the other Elements.For portability, make sure your Elements are added to their own sub-level. Since Elements are level actors, this lets you load your compositing tree in other maps.

## 3 - Add a Media/Video Element

Once you have a top-level comp Element, you need to add child Elements. Child Elements feed into their parent (for compositing).

### Steps

- Add a **Media Plate** to the comp tree. Right-click on the comp Element in the compositing tree panel, and then select **Add Layer Element** from the menu. When prompted to pick a Element type, select **Media Plate**.[image: Add a Media Plate]Without a media source, the **Media Plate Element** will be blank. You can set up a default still image (like we have in the GIF above), in your game config file: `[/Script/Composure.ComposureGameSettings] StaticVideoPlateDebugImage="/Game/Path/To/My/TextureAsset"`
- Set your **Media Source**. By default, your media Element will not be connected to a media source (such as a streaming video). You can apply a media texture to act as an input In the Element's details. Select the new media Element. Then, in the details panel, find the **Media Source** section (under **Composure**→**Inputs**). The **MediaSource** texture property will be empty.[image: Set a Media Source]Feeding a live video feed into the engine via capture card produces a **Media Texture**. So you hook that into the compositing system in the exact same way. For more details on how to set that up, look into using capture cards with Media Bundles in Unreal Engine.
- Configure the **Chroma Key Color**. The **Media Plate** Element has a set of predefined transform Passes on it. Those Passes are for adjusting the media image before it gets composited. The first of those passes is for **Chroma Keying**. To pick a **Chroma Key Color**, under **Transform Passes** navigate to the keying Pass, then find the one named **Chroma Keying**. After expanding **Chroma Keying**, you'll find a **Key Colors** property. Add a new **Key Color** using the picker button next to the color box.[image: Configure the Chroma Key Color]Clicking the picker button will open up a large picker window to enable you to select a color. To pick a color, click the mouse anywhere on the image to sample that pixel. Click and dragging will average the sampled pixels together, so you can get a more homogenous chroma color. Once you're happy with the result, click **Accept**.You can add as many key colors as you wish. This helps when you have multiple shades of green across the backdrop, and keying one color isn't enough. However, for each **Key Color** you add, the Element performs a full Pass, running the keying material once for each color in the list. This may be a performance concern for some.Along with the key color, there are many other settings that can be adjusted to perfect the keying. Review the **Material Parameters** section inside the Pass.[image: Material Parameters]The built-in keyer expects the image to be in linear color space. If your image is coming in in a different color format (such as logC), then you will have to add a colorspace transform before the keying is done. Alternatively, you can replace the keyer with a material of your own.In addition to the **Chroma Keying Pass**, there is a separate **Despill Pass** for removing green bounce on your subject. For more details on chroma keying and despill, see the blog post here.
- Preview the Results. Sometimes it's hard to get a sense of how good of a job your keyer is doing. For every Element, you can open up a larger preview window, and look at individual color channels for that image.[image: Preview the Results]The **Key Picker** window and the **Level Editor** preview pane also both have this functionality.At this point in the process, don't worry if it's not perfect. You can always adjust it later when you preview the whole composited scene.

## 4 - Add CG Elements

Similar to adding the media Element, we want to add Elements for foreground and background layers.

### Steps

- Add a **CG Layer**. Right-click on the top-level comp Element in the tree panel, and then select **Add Layer Element** from the menu and pick **CG Layer**.Add two CG Elements – one for foreground objects, another for background objects, and name them appropriately: fg_element, and bg_element.
- Link to a Scene Camera. CG Elements requires a camera in the world to cue off of – the camera tells them the viewpoint to render from. Without a camera in your scene, CG Elements will display a "Missing Camera" warning message. To resolve this, simply add a camera actor to your scene.[image: Add Cine Camera Actor]If there are multiple cameras in your scene, you can specify which one to reference in the Element's details (under **Input**, look for **Camera Source**).
- Setup Actor Layers. Now that you have two CG Elements (one for foreground, and one for background), you need to specify what scene actors should be rendered to each. For this, we will leverage the level editor's layer system. In our test scene, we've added some basic primitives – a cube, a cone, a sphere, and a cylinder. In this case, the cone and cylinder are in the foreground, and everything else in the background. To start, create an editor layer for just the cone and cylinder.[image: Add Actor Layers]Now, in the foreground Element (fg_element), find the **Capture Actors** property (under **Composure**→**Inputs**), and add an entry to it. The **Capture Actors** list specifies what the CG Element should render.[image: Capture Actors]In the new **Capture Actors** entry, set the **ActorSet** property to the **ConeAndCylinder** layer that we created earlier. Because the entry's **InclusionType** is set to **Include**, it will render only those actors. | Property | Description |
| --- | --- |
| **Include** | Render only the actors in the specified layer. |
| **Exclude** | Render everything except the actors in the specified layer. | You can add as many **Capture Actor** layers to the Element as you wish. You can mix/match includes and excludes. For the background Element, we want everything except the **ConeAndCylinder** layer. So we use the same layer, but switch the **InclusionType** to **Exclude**.For your CG renders to have the proper opacity for compositing, you will need to set **Enable alpha channel support in post processing** to **Linear color space only enable** in project settings:[image: Enable alpha channel support in post processing]Click image to expand

## 5 - Setup a Compositing Material

Now that you have four Elements (the top-level comp, a **Media Plate**, and two CG Elements), you can layer them all to produce your comp. The top-level comp Element is responsible for merging all of the other Elements. We're going to add a transform Pass to the comp Element and set it up to composite the other three layers.

[image: Compositing Elements]

### Steps

- Add a Comp Transform Pass. Select the comp Element, and then in details find the **Transform Passes** property. Add an entry to the **Transform Passes** list. The default entry is **Custom Material Pass**, which is what we want.[image: Add a Comp Transform Pass]
- Create a Comp Material.The new Pass expects a material for rendering. Expand the Pass's details and create a new material for its **Material** property.
- Set the new material to be a **Post Process** material – this ensures that you're outputting the result to the correct channel.[image: Set a Post Process]
- In the new material, we need texture samplers for each of the three sub-Elements. To do this, create three texture sampler parameters and name them to match the child Elements. These texture params will get automatically filled out with the results from the three child Elements. To combine the three Elements all you need are a couple **Over** nodes. The **Over** node takes **input A** and layers it over **input B**, using **input** **A**'s alpha. We want to sandwich the media plate between our two CG layers.

- Set one Over node so the media plate (**A**) renders over the bg Element (**B**).
- Next, use the result from that Over node and plug it into **B** on another Over node.
- Lastly, put the **fg** Element on top by plugging it into **A** on that second Over node.
- The second Over node's output should be plugged into the material's **Emissive Color** channel.
- Save and apply the material.

/ul>

Review your results back in the compositing window. You should have a single image with all three Elements composited together.

The Over node expects a **float4** input, so use the texture sampler's **RGBA** output pin, not its top **RGB** pin.

The Over node uses input **A**'s alpha for Blending. By default, projects are not set up to pipe alpha data through the post process pipeline. So for the CG layers to work, you have to enable this project setting.

[image: Enable alpha channel support in post processing]

Click image to expand

## 6 - Output Your Comp

If you're happy previewing your comp in the editor, then ignore this last step. However, if you want to route the result of your comp to disk or run it out through a capture card, then you will want to use an **Output Pass**.

In this example, we want our comp to be broadcast via a capture card.

### Steps

- In the top-level comp Element's details, find the **Outputs** property and add an entry to that list. The default is **Media Capture**, which is what we want.
- In the new output Pass, you will need to specify the target in the Pass's **Capture Output** property, and create a new asset for it.[image: Specify the Target]Configure this asset for your capture target, and you should be all set. The comp Element should start broadcasting.

### Using Sequencer

Alternatively, you can render out comps and AOVs with Sequencer (-> unreal-engine-sequencer-movie-tool-overview), our in-engine cinematic editor. For more information, see Real-Time Compositing with Sequencer (-> real-time-compositing-with-sequencer-in-unreal-engine).

[image: Using with Sequencer]

- getting started
- beta
- virtual sets

On this page

- 1 - Load Composure (-> realtime-compositing-quick-start-for-unreal-engine)
- Steps (-> realtime-compositing-quick-start-for-unreal-engine)
- 2 - Add a Root Comp Element (-> realtime-compositing-quick-start-for-unreal-engine)
- Steps (-> realtime-compositing-quick-start-for-unreal-engine)
- 3 - Add a Media/Video Element (-> realtime-compositing-quick-start-for-unreal-engine)
- Steps (-> realtime-compositing-quick-start-for-unreal-engine)
- 4 - Add CG Elements (-> realtime-compositing-quick-start-for-unreal-engine)
- Steps (-> realtime-compositing-quick-start-for-unreal-engine)
- 5 - Setup a Compositing Material (-> realtime-compositing-quick-start-for-unreal-engine)
- Steps (-> realtime-compositing-quick-start-for-unreal-engine)
- 6 - Output Your Comp (-> realtime-compositing-quick-start-for-unreal-engine)
- Steps (-> realtime-compositing-quick-start-for-unreal-engine)
- Using Sequencer (-> realtime-compositing-quick-start-for-unreal-engine)
