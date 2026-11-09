# Post Process Materials on the UI

https://dev.epicgames.com/documentation/en-us/unreal-engine/artist-06-post-process-materials-on-the-ui-in-unreal-engine?application_version=5.9

> Learn how to use Materials to create gameplay-driven, on-screen post-process effects.

[image: Post Process Materials on the UI]

So far, you’ve used a Post Process Volume to adjust pre-existing settings that control the look of your scene. To add your own custom post-process effect, you can create a **post-process material**. The material can then apply that effect to the camera or add it to a Post Process Volume to affect what the player sees on screen.

In this part of the series, you’ll add an effect to visually convey damage on screen when the player takes damage. The edges of the screen will pulse in red. As the player’s health gets lower, the effect intensifies and takes up more space on the screen.

To implement this, you’ll:

- Build a parent post-process material.
- Create a Material Instance to control the parameters in the parent material.
- Display and control the on-screen effect with Blueprint Visual Scripting.
- Modify the player character’s blueprint logic so their health (HP) regenerates after a period of time, making the damaged-player visual effect disappear.

## Before You Begin

Make sure you understand these topics covered in previous sections of the Art Pass for a Puzzle Adventure Game (-> art-pass-for-a-puzzle-adventure-game) tutorial series:

- Building Materials and Material Instances.
- Adding a Post Process Volume to a level.

You’ll work with the following assets in the sample project file (-> artist-01-project-setup-and-content-import):

- `BP_AdventureCharacter` Blueprint

## Create a Material to Show Damage

First, you’ll make a material that will be the base that defines the effect’s appearance. The material will create a grayscale mask, making the in-game camera view display on the lighter parts of the mask and the pulsing-red damage effect appear on the darker parts of the mask.

[image: You'll build this set of expressions throughout this tutorial]

To create a new post-process material, follow these steps:

- In the **Content Browser**, go to the **AdventureGame > Artist > Materials** folder.
- In the **Materials **folder, create a new **Material **asset named `M_Screen_Damage`. Open the material.
- In the **Details **panel, change the material **Domain **to **Post Process**. You’ll notice this changes what pins are available on the material’s root node. For a post-process material, you’ll only control the emissive color because these materials don’t use scene lighting.

In **Surface**-type materials, the emissive color controls how much light the material gives off. When you change a material’s **Domain **to **Post Process**, it’s no longer shading a surface, but writing directly to the screen. In this case, emissive color controls the final output color for each pixel.

### Define the Damage Effect Shape

Now, you’ll start building the material’s graph, starting with the mask that defines the shape of the post-process effect. First, you’ll use a **GeneratedRoundRectNode **to draw a grayscale mask in the shape of a rounded rectangle, where the inside of the shape is white and the outside is black. Later, you’ll define what appears on each part of the mask.

 You'll add this set of expressions in this section of the tutorial.

To create the grayscale mask, follow these steps:

- In the material graph, on the left side of the material root node, add a **GeneratedRoundRect **node.You can see an example of the node’s output in the preview window if you connect it to the material root node.
- Add a ScreenPosition node.
- Connect the **ScreenPosition **node's **ViewportUV **output to the **UV Coords (V2)** input on the **GeneratedRoundRect **node.The **ViewportUV **output tells the **GeneratedRoundRect **node to draw the mask within the same space as the viewport screen’s coordinates.

To control the mask’s shape with a vector parameter, follow these steps:

- Add a **Constant4Vector **node. You can use this node to create a color value, or use it more broadly as a collection of values that can control the size and shape of the **GeneratedRoundRect **mask.Press and hold **4** on your keyboard and click the graph to add this node.
- Right-click the vector node and select **Convert to Parameter** to turn the constant into a Vector Parameter. Name it** **`Damage Mask Controls`.With Vector Parameters, you can use each channel’s value the same as you would separate single-value Constant (or Scalar Parameter) nodes, making your graph more efficient and tidier. By default, the values have RGBA color channel labels, but you can make these values represent whatever you like by renaming them in the node’s **Details **panel.
- In the **Details **panel, in the **Parameter Customization **category, expand **Channel Names** and assign names to each color channel in the vector parameter node. You’ll name these channels to correspond to the **GeneratedRoundRect **node’s inputs:**R** = `Size X`
- **G **= `Size Y`
- **B **= `Corner Radius`
- **A **= `Sharpness`

|  |  |
| --- | --- |
|  |  |
| **Details **panel parameter channel names | **Damage Mask Controls** with renamed channel names |

- In the **Material Expression Vector Parameter** category, expand **Default Value **and set the following default values for each channel: **Size X** = 1
- **Size Y** = 1
- **Corner Radius **= 0.4
- **Sharpness **= 0.2

- In the graph, drag off the constant vector node’s** Size X** pin and create an **AppendVector **node.
- Connect the **Size Y** pin to the **Append **node’s **B** input.
- Connect the **Append **node’s output pin to the **Box Dimensions **pin on the **GeneratedRoundRect **node.
- Connect the **Corner Radius **and **Sharpness **pins on the **Damage Mask Controls** and **GeneratedRoundRect **nodes.
- Add a comment block around these nodes labelled `Damage Mask Falloff`.

In the **GeneratedRoundRectNode**, **UV Coords** defines where the material draws the rectangle, and **Box Dimensions** defines how large the rectangle is within that space. **Box Dimensions** of (1, 1) make the rectangle (or white portion) take up most of the screen space, and (0.5, 0.5) make the rectangle fill half the screen’s width and height.

To view the rectangular mask, follow these steps:

- Connect the **GeneratedRoundRect **node to the** Emissive Color** input of the material root node.
- Select the **Damage Mask Controls** node and experiment with different **Size**, C**orner Radius**, and **Sharpness **values to see the effect each has on the rectangle.
- Reset the values back to the defaults you set earlier, and delete the wire between **GeneratedRoundRect **and the main material node.

### Display Visuals on Different Parts of the Mask

In Expanded Material Instances (-> artist-04-expanded-material-instances), you used **linear interpolation (lerp)** to blend between dry and wet looks on your stone floor material. The floor material’s **Lerp **node used a Timeline as the **Alpha **input to blend between two parameter values. Remember, in a **Lerp **node, the **Alpha **input controls how much the Lerp blends between **A** and **B** inputs. When Alpha is 0, you get all A. When Alpha is 1, you get all B.

The Alpha value can also come from a grayscale mask where each pixel provides a value: white areas show B, black areas show A, and gray areas blend between them. So in this section, you’ll use a **Lerp **node to blend between your unobscured game view in the middle of the screen (where the mask is white) to a red color along the edge of the screen (where the mask is black).

 You'll add these expressions in this section of the tutorial.

To blend between the game screen and the red color that represents damage taken, follow these steps:

- To the right of the **GeneratedRoundRect **node, add a LinearInterpolate (or **Lerp**) node. Hover over the node, click the **Toggle Comment Bubble** button, and enter `1`.Numbering your Lerp nodes helps you follow along with the tutorial since this graph uses several Lerp nodes. We’ll refer to this node as **Lerp (1)**.
- Connect the **GeneratedRoundRect Result **output to the **Alpha **input of the **Lerp (1)** node.
- Add a **SceneTexture **node.
- In the **Details **panel, change the **Scene Texture Id** to **PostProcessInput0**.
- Connect the **Color **output of the **SceneTexture **node to the **B** input of the **Lerp (1)** node.
- In the graph, add a **Constant3Vector**. Right-click the node and select **Convert to Parameter**. Name the parameter `Damage Color`. This parameter controls the color of the damage effect.
- Click the color swatch next to **Default Value **and change the color to red (**R = 1**).
- Connect the **Damage Color** node’s top (white) pin to the **A **input on the **Lerp (1) **node. The top pin of the damage color only outputs the three RGB color channels.
- Connect the **Lerp (1)** output to the material root node’s **Emissive Color** pin to check the results in the preview window. You’ll see an undefined arithmetic error due to a Float3-to-Float4 conversion issue.

The **Damage Color** node’s top pin outputs a Float3 value (three channels, RGB), and the **SceneTexture **node’s **Color **pin outputs a Float4 value (four channels, RGBA). To resolve this error and make the value types match, you can use a **Component Mask** to remove the **Alpha **channel from the **Color **output of the** Scene Texture**, since you only need the three channels (RGB) to match. Component Masks are a common way to solve this sort of error.

To turn the **SceneTexture **node’s color into a Float3 value and resolve the error, follow these steps:

- Add a **ComponentMask **node and connect the **SceneTexture **node’s **Color **pin to the **Mask **node.
- Connect the output of the **Mask** node to the **B** input of the **Lerp (1)** node.
- Click the arrow at the bottom of the **Mask **node to see checkboxes for each channel in the Color output.
- By default, the component mask only masks R and G channels. Add a checkmark next to **B**. This creates a Float3 component mask so both** Lerp (1)** inputs use the same channels.

The graph should look like this:

The material should look like this in your preview viewport:

### Add Noise and Variation to the Effect

In this section, you’ll build out the noise section of the material by applying a texture around the outer edge of the frame. With this, you can use material parameters to direct the final look of the effect as it relates to the character’s damage in-game.

In visual effects, noise adds controlled randomness. It’s a pattern you can use to make materials feel more organic and less perfect, like on uneven surfaces or on a flickering light.

 You'll add these expressions in this section of the tutorial.

To add noise to the material, follow these steps:

- At the bottom of the graph, add a **ScreenAlignedUVs **node. With the **ScreenAlignedUVs **node, you can map a texture or effect across the entire screen. It generates UV coordinates for the whole viewport or screen.
- Drag off the **X 100%, Y 100%** pin and add a **Multiply **node.
- Right-click and create a **Constant **node. Right-click it, select **Convert to Parameter**, and name it **Noise Tiling**. Connect it to the **B** input of the **Multiply **node.
- In the** Noise Tiling **node, set the **Default Value** to `1`.
- Drag off the **Multiply **node’s output pin and create a **TextureSample **node, with the wire connected to the **UVs** input.
- Right-click on **TextureSample**, convert it to a parameter, and name it `Noise Texture`.
- With the **Noise Texture** node selected, near the bottom of the **Details **panel in the **Material Expression Texture Base **category, set the **Noise Texture **texture assignment slot to `TilingNoise05`. This texture is a part of the Engine Content included with Unreal Engine. You can use your own, but this one is a good default to start with if you don’t have an alternative. Note that if you use a different texture, your results may differ from those shown in this tutorial.
- Drag off the **R** channel of the **Noise Texture** node and create a **Multiply **node.
- Right-click its **B** pin and select **Promote to Parameter**. Name the parameter `Noise Falloff` and set its **Default Value **to `1`.
- Drag off the **Multiply **node’s output pin and create a **Power **node.
- Right-click the **Exp **pin and select **Promote to Parameter**. Name the parameter `Noise Amount` and set its **Default Value** to `1`.
- Select the eight nodes you just created and press **C** to add a comment box around them. Label the comment box `Noise in Damage Mask`.

At this point, you can test this part of the material by connecting the **Power **node directly to the **Emissive Color** input on the `M_Screen_Damage` material root node. You should see the following in the preview window:

When you’re done testing, disconnect the material root node from the noise texture logic and reconnect it to the **Lerp (1)** node. You’ll continue to build other parts of the material before connecting everything later in this guide.

### Add Noise to the Mask

Now that you have your noise mask, you need to blend it into the damage mask falloff by combining the two using a multiply node. This applies the noise mask to the inner-edge results of the damage mask closest to the center of the screen.

 You'll add the highlighted set of expressions in this section of the tutorial.

To add the noise texture to the black areas of the mask, follow these steps:

- Move the `M_Screen_Damage` material root node to the right to create some space next to the **GeneratedRoundRect **node. Delete the wire between the **GeneratedRoundRect **node and the existing **Lerp (1)** node since you’ll be adding new logic here.
- Right-click the graph and create a new **Lerp **node. Hover over the node, click **Toggle Comment Bubble**, and enter `2` as the comment.
- Connect the **Result **pin of the **GenerateRoundRect **node to the **Alpha **pin of the **Lerp (2)** node.
- Drag the **output **of the **GenerateRoundRect **node and create a **One Minus **node.
- Drag off the **One Minus** node, create an **Add **node, and connect its output to the **Lerp (2)** node’s **B** pin.
- Drag off the **One Minus** node and add a **Multiply **node.
- Drag off the **Multiply **output, add a new **One Minus** node, and connect it to the **B** input of the **Add **node.
- After the **Lerp (2)** node, add a **Saturate **node. This clamps the output values in a **0-1** range.
- Add a comment to this logic and label it `Gets the Brightest Spots of the Mask`.

At this point, you’re material should look similar to this:

### Connect the Noise, Mask, and Damage Color Sections

To connect the Noise, Damage Mask, and Damage Color elements of the graph, follow these steps:

- In the Noise Mask logic, drag off the **Power **node and connect it to the **B** input of the **Multiply **node in the Damage Mask Area logic.Use reroute nodes on any wire to help create clearer paths and reorganize the graph. Double-click on a wire to add a reroute node, then drag it to change the wire’s path.
- Connect the **Saturate **node’s output pin to the **Lerp (1)** node’s **Alpha **pin.
- **Save **and **Apply **changes to the material.

You can connect the **Lerp (1)** node to the **Emissive Color** input on the material root node to see the result:

Now, you’ve defined a rectangular mask area, applied a color to this mask, created a noise mask using a texture, and blended them into what you see in the material editor preview window.

### Add Pulsations to the Damage Effect

In this section, you’ll build the material logic that causes the red color damage indicator around the edge to pulse as the player takes more damage. You’ll use a **Sine **node to drive the pulsing behavior, and modify the sine wave to only use positive values.

 You'll add the highlighted section of expressions in this part of the tutorial.

To make the red effect pulse as the damage increases, follow these steps:

- In an empty section at the top of your graph, add a **Time **node. The **Time** node outputs the passage of time in the editor and is helpful for animating materials and changing them over a specified period.
- Drag off its pin and add a **Multiply **node.
- Create a **Constant **node, convert it to a parameter, and name it **Pulse Speed**. In the node, set its **Default Value **to `0.5`.
- Connect **Pulse Speed **to the **B** input on the **Multiply **node.
- Drag off the **Multiply **node and add a **Sine **node.The **Sine **node converts the increasing **Time **value into a value that smoothly oscillates between -1 and 1 in a repeating wave pattern.
- Drag off the **Sine **node output and add an **Add **node. Ensure its **B** input value is set to **1.0**.
- Drag off the **Add **node and add a **Divide **node. Ensure its **B** input is **2.0**.By setting up this **Add **1 and **Divide **by 2, you’re changing the sine wave to go from 1 to 0 instead of between 1 and -1. This prevents the **Sine **node from inverting the texture’s values, causing it to flash from red to light blue (the inversion of red).
- Drag off the **Divide **node and add a **Multiply **node.
- Drag off its **B** input and create a **Constant**. Convert it to a parameter and name it `Pulse Amount`. Set its **Default Value** to `1`.
- Select the nodes in this section of the graph and press **C** to add a comment block. Label it `Damage Pulse Amount and Speed`.

Your material now contains all the primary elements that comprise the damage effect for this post-process material. Your graph should look similar to this one now:

### Connect the Pulse Logic

Now that you’ve got the pulsing logic set up, you’ll integrate this into the application of damage color to the scene texture. Then, you can change the intensity of the mask as it pulses.

 You'll add the highlighted section of expressions in this part of the tutorial.

You’ll build off the **Damage Pulse Amount and Speed** section and add expressions that connect the pulse logic to the Damage Color and Scene Texture sections of the graph.

While working in this section, you’ll be disconnecting some elements you’ve already set up in previous sections and integrating new connections. You can drag nodes around to create space when overlapping wires are difficult to follow.

To connect the pulse logic to the damage color, follow these steps:

- Right-click in the graph and create a new **Lerp **node near the **Damage Color **node and pulse logic. Label it with a `3`.
- At the end of the pulse logic, connect the **output **of the **Multiply **node to the **Alpha **pin of **Lerp (3)**. In the **Lerp (3)** node, the **Alpha **controls the amount of pulse applied to the mask and how often the pulse should happen.
- Delete the **Damage Color** wire from the **A **input of **Lerp (1)**, and connect it to the **B** input of the new **Lerp (3)** node.
- Select the Damage Color node. In the Details panel under **Parameter Customization**, expand Channel Names, and use the text field to change the A channel name to `Color Amount`.
- In the **Material Expressions Vector Parameter** category, under **Default Value**, set the **Color Amount** value to `2`.
- On the **Damage Color** node, drag off the **Color Amount** pin, add a **Divide **node, and connect its output to the **A** input of the **Lerp (3)** node.
- Create a new **Lerp **node near the** Lerp (3)** node and pulse logic. Label it with a `4`.
- Connect the **Lerp (3)** node’s output to the **Alpha **input of **Lerp (4)**.
- Connect the **RGB **(white color) pin of the **Damage Color** node to the **B** input of **Lerp (4)**.
- Return to the **Mask (RGB) **node connected to the **SceneTexture **node. Connect the **Mask **node’s output to the **A** input of **Lerp (4)**. The component mask node now has wires going to **Lerp (1) **input **B** and **Lerp (4)** input **A**.
- Connect the output of **Lerp (4)** to the **A** input of **Lerp (1)**.
- Drag and select the **Lerp (3)** and **Lerp (4)** nodes. Press **C **to create a comment box around them, and label it `Lerp Pulse and Color`.
- Click **Save **and **Apply**.

This new part of the graph should look like this:

You can connect **Lerp (3)** to the **Emissive Color** input on the material root node to see the results of the damage effect in the material preview window:

 [image: 66]

In the example above, the **Color Amount** value on the **Damage Color** node has been increased to 5.0 to make the effect clearly visible in the preview window.

In the graph, change the **Pulse Speed** and **Pulse Amount **values to see how they change the size of the effect and the speed at which the effect is applied. **Pulse Amount **must be between 0 and 1. In later steps, you’ll be able to control both of these parameters in a Material Instance.

### Control the Effect with a Damage Amount Parameter

The last thing you’ll add to your material graph is a new parameter called **Damage Amount** that controls the effect's size based on how much damage the player has received when playing the game.

This parameter will be set in the character’s Blueprint so that when the player takes damage, the parameter controls the amount of pulsing damage displayed around the outer edges of the screen. The more damage the player takes, the stronger the effect of this material becomes on the player’s screen.

To add a parameter that controls the size of the effect at runtime, follow these steps:

- Add some space between your existing material logic and the `M_Screen_Damage` material root node. Right-click the graph and add a **Lerp **node. Label this **Lerp **node with a `5`.
- Connect the **Mask (RGB)** node’s output to the **A** pin of the **Lerp (5)** node.
- Connect the** Lerp (1) **node’s output to the **B** input of **Lerp (5)**.
- On **Lerp (5)**, right-click the **Alpha **pin and select **Promote to Parameter**, name the parameter **Damage Amount**, and change its default value to `1`.Name this parameter accurately and ensure it has a default value; the player character blueprint will use this parameter to control how much this material appears on screen when the player takes and heals from damage.
- Connect the **Lerp (5)** node’s output to the **Emissive Color **input of the root node.

The **Damage Amount** value uses a value between 0 (no damage, effect off) and 1 (max damage, effect on).

This is the result you’ll see in the preview window:

In the example here, the** Color Amount** value on the **Damage Color** node has been increased to 5.0 to make the effect clearly visible in the preview window.

Next, you’ll add a new set of nodes that uses **Damage Amount** as input to affect the size of the **GeneratedRoundRect **mask. This addition makes the damage effect pulse inward toward the center of the screen as the player takes more damage, and recede as the player’s health is regenerated.

To make **Damage Amount** affect the size and intensity of the damage mask, follow these steps:

- In the material graph, go to the **Damage Mask Falloff** section. Delete the wire between the **Append **node and the **GeneratedRoundRect **node.
- Drag off the **Append **node and add a **Multiply **node.
- Connect the output of the **Multiply **node to the **Box Dimensions** input of the **GeneratedRoundRect **node.
- On the **Multiply **node, drag off input **B** and add a **Lerp **node. Label the **Lerp **node `6`.
- On the** Lerp (6)** node, leave the **A** value at **0** and set the **B** value to `0.75`.
- Right-click the **Lerp (6)** node’s **Alpha **and choose **Promote to Parameter**. Name the node **Damage Amount** to match your other **Damage Amount** node. Alternatively, you could copy and paste the original **Damage Amount** node.
- Click **Apply **and **Save**.

This is the result you’ll see in the preview window:

In the example here, the** Color Amount** value on the **Damage Color** node has been increased to 5.0 to make the effect clearly visible in the preview window.

Your `M_Screen_Damage` material graph should look like the following when everything is built:

 Blueprint

Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_152" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_152'"
 Begin Object Class=/Script/Engine.MaterialExpressionLinearInterpolate Name="MaterialExpressionLinearInterpolate_5" ExportPath="/Script/Engine.MaterialExpressionLinearInterpolate'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_152.MaterialExpressionLinearInterpolate_5'"
 End Object
 Begin Object Name="MaterialExpressionLinearInterpolate_5" ExportPath="/Script/Engine.MaterialExpressionLinearInterpolate'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_152.MaterialExpressionLinearInterpolate_5'"
 A=(Expression="/Script/Engine.MaterialExpressionReroute'MaterialGraphNode_Knot_30.MaterialExpressionReroute_3'")
 B=(Expression="/Script/Engine.MaterialExpressionLinearInterpolate'MaterialGraphNode_156.MaterialExpressionLinearInterpolate_0'")
 Alpha=(Expression="/Script/Engine.MaterialExpressionScalarParameter'MaterialGraphNode_182.MaterialExpressionScalarParameter_8'")
 MaterialExpressionEditorX=-432
 MaterialExpressionEditorY=160
 MaterialExpressionGuid=7A50A9AE479B65CD58CBC88CFBCE9B7C
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 Desc="4"
 bCommentBubbleVisible=True
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionLinearInterpolate'MaterialExpressionLinearInterpolate_5'"
 NodePosX=-432
 NodePosY=160
 bCommentBubbleVisible=True
 NodeComment="4"
 NodeGuid=1AA011E3488A829C44C3A3A2E55BAF1A
 CustomProperties Pin (PinId=03046325481EBC4D42616597B392B6FD,PinName="A",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",LinkedTo=(MaterialGraphNode_Knot_30 F919BAD043242F134BD3B99CD9AF42EA,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=DE8FF32C435F88E4F307568D07A2517E,PinName="B",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="1.0",LinkedTo=(MaterialGraphNode_156 D19CE8F3435656E83CD403988AB74C43,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=E4BDE06F4D042416C42E15A35455006F,PinName="Alpha",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.5",LinkedTo=(MaterialGraphNode_182 F09C09414F4BFF2FF95A2EA225C6BE25,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=0A4F6FB6411A5FEDFF4CE3BE36B0C05B,PinName="Output",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_Root_4 7BA851574FE4E066DCA5A29F7FAFFD2F,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_153" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_153'"
 Begin Object Class=/Script/Engine.MaterialExpressionMaterialFunctionCall Name="MaterialExpressionMaterialFunctionCall_0" ExportPath="/Script/Engine.MaterialExpressionMaterialFunctionCall'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_153.MaterialExpressionMaterialFunctionCall_0'"
 End Object
 Begin Object Name="MaterialExpressionMaterialFunctionCall_0" ExportPath="/Script/Engine.MaterialExpressionMaterialFunctionCall'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_153.MaterialExpressionMaterialFunctionCall_0'"
 MaterialFunction="/Script/Engine.MaterialFunction'/Engine/Functions/Engine_MaterialFunctions01/Gradient/GeneratedRoundRect.GeneratedRoundRect'"
 FunctionInputs(0)=(ExpressionInputId=4CAF1D4E452AC3EFEDD321823833D345,Input=(Expression="/Script/Engine.MaterialExpressionScreenPosition'MaterialGraphNode_154.MaterialExpressionScreenPosition_0'",InputName="UV Coords"))
 FunctionInputs(1)=(ExpressionInputId=6AE5B5294B8D8BDED45CE4AF5B32811B,Input=(Expression="/Script/Engine.MaterialExpressionMultiply'MaterialGraphNode_187.MaterialExpressionMultiply_3'",InputName="Box Dimensions"))
 FunctionInputs(2)=(ExpressionInputId=8C3DFD4448F8C059211B368A3522EDE0,Input=(Expression="/Script/Engine.MaterialExpressionReroute'MaterialGraphNode_Knot_25.MaterialExpressionReroute_1'",InputName="CornerRadius"))
 FunctionInputs(3)=(ExpressionInputId=F9DAA78B4123E9C59CEC73B80A2AB2E2,Input=(Expression="/Script/Engine.MaterialExpressionReroute'MaterialGraphNode_Knot_24.MaterialExpressionReroute_0'",InputName="Sharpness"))
 FunctionInputs(4)=(ExpressionInputId=16A5B9D44F43022C6CF1CDB29F3E05CA,Input=(OutputIndex=-1,InputName="Center"))
 FunctionOutputs(0)=(ExpressionOutputId=412493D24BA7A2C5E2481BB135887631,Output=(OutputName="Result"))
 MaterialExpressionEditorX=-1984
 MaterialExpressionEditorY=544
 MaterialExpressionGuid=449937084BBEF98DE5FDA29D9D365047
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 Outputs(0)=(OutputName="Result")
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionMaterialFunctionCall'MaterialExpressionMaterialFunctionCall_0'"
 NodePosX=-1984
 NodePosY=544
 NodeGuid=46E28BDC46ACB04A45DB77B056736769
 CustomProperties Pin (PinId=076C1B97452726B9D9B800848A03DE98,PinName="UV Coords (V2)",PinType.PinCategory="optional",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_154 C2D6FE734A724812A0136AAA4290E485,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F6B260D64DAE1ED2B698D298B8DFD74C,PinName="Box Dimensions (V2)",PinType.PinCategory="optional",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_187 1AD43305428323E6DDEB6FBE21DB8865,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=B0EBEA42411FA0CE5A00FBBB894FC56B,PinName="CornerRadius (S)",PinType.PinCategory="optional",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_Knot_25 F0277E304488897FD3F7319498E621F1,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=7DC4505045B17729A865229DD1DE738E,PinName="Sharpness (S)",PinType.PinCategory="optional",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_Knot_24 6948179C46901FA3AB80BBA10991F7AC,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=E18AC64C4920F17CE26B28877C6C2F7E,PinName="Center (V2)",PinType.PinCategory="optional",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=87D111744A90BF1F247D0492F68963E1,PinName="Result",Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_176 C95565EF4B965F0595214C92330B2E2C,MaterialGraphNode_Knot_26 B705A9BB45585A3C1470788D0CB1FCCE,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_154" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_154'"
 Begin Object Class=/Script/Engine.MaterialExpressionScreenPosition Name="MaterialExpressionScreenPosition_0" ExportPath="/Script/Engine.MaterialExpressionScreenPosition'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_154.MaterialExpressionScreenPosition_0'"
 End Object
 Begin Object Name="MaterialExpressionScreenPosition_0" ExportPath="/Script/Engine.MaterialExpressionScreenPosition'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_154.MaterialExpressionScreenPosition_0'"
 MaterialExpressionEditorX=-2256
 MaterialExpressionEditorY=464
 MaterialExpressionGuid=06D43A244FFA0097C358AB80F61A08DD
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionScreenPosition'MaterialExpressionScreenPosition_0'"
 NodePosX=-2256
 NodePosY=464
 NodeGuid=87983DB743247E8122457992CB9478F4
 CustomProperties Pin (PinId=C2D6FE734A724812A0136AAA4290E485,PinName="ViewportUV",Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_153 076C1B97452726B9D9B800848A03DE98,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D2DB3CED4034C223F73005A0374A60AB,PinName="PixelPosition",Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_155" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_155'"
 Begin Object Class=/Script/Engine.MaterialExpressionVectorParameter Name="MaterialExpressionVectorParameter_0" ExportPath="/Script/Engine.MaterialExpressionVectorParameter'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_155.MaterialExpressionVectorParameter_0'"
 End Object
 Begin Object Name="MaterialExpressionVectorParameter_0" ExportPath="/Script/Engine.MaterialExpressionVectorParameter'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_155.MaterialExpressionVectorParameter_0'"
 DefaultValue=(R=1.000000,G=1.000000,B=0.400000,A=0.200000)
 ChannelNames=(R=NSLOCTEXT("", "09263018431D34EABFD420AA7E42E39F", "Size X"),G=NSLOCTEXT("", "829AAE30437D57EDEAA071B7B1B7A2B2", "Size Y"),B=NSLOCTEXT("", "6FF219104CE7955466FC7596F1AF0ECB", "Corner Radius"),A=NSLOCTEXT("", "CEE2D50A49B9212CF98440ABBE3F17EE", "Sharpness"))
 ParameterName="Damage Mask Controls"
 ExpressionGUID=4CBB09044E29F5EC1345D69F8F775198
 MaterialExpressionEditorX=-2656
 MaterialExpressionEditorY=560
 MaterialExpressionGuid=C34AEF324441E9304C27AA83CEC8F5EB
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 Outputs(1)=(OutputName="Size X")
 Outputs(2)=(OutputName="Size Y")
 Outputs(3)=(OutputName="Corner Radius")
 Outputs(4)=(OutputName="Sharpness")
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionVectorParameter'MaterialExpressionVectorParameter_0'"
 NodePosX=-2656
 NodePosY=560
 bCanRenameNode=True
 NodeGuid=00A687C54D1E3F2F7603578CC5F7E1A8
 CustomProperties Pin (PinId=5293DF9C4719B54945E996A72565EB79,PinName="Default Value",PinType.PinCategory="optional",PinType.PinSubCategory="rgba",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="(R=1.000000,G=1.000000,B=0.400000,A=0.200000)",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=True,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=1D5A05554F72653F1E3DC9AAF10B5EAC,PinName="RGB",Direction="EGPD_Output",PinType.PinCategory="mask",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=1E1F62674A99F3ABED44B8B7B57E26F9,PinName="Size X",Direction="EGPD_Output",PinType.PinCategory="mask",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_158 ABA30AAB4B96ACF5A1B59D84D2CB2FFB,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=0AB6652D4BF980CF1C5DBCBB0ACBB748,PinName="Size Y",Direction="EGPD_Output",PinType.PinCategory="mask",PinType.PinSubCategory="green",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_158 ADDFAE144F69674E2427FF845352EA94,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D3C6377945D605F6C3C16AB2A28A9E25,PinName="Corner Radius",Direction="EGPD_Output",PinType.PinCategory="mask",PinType.PinSubCategory="blue",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_Knot_25 2F8FC3684D593B93C6AE6DAE925BD329,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=FB199C6949937B847622D799644B6BEA,PinName="Sharpness",Direction="EGPD_Output",PinType.PinCategory="mask",PinType.PinSubCategory="alpha",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_Knot_24 D5BD417E4C34F602616FAD9FA0318D0A,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=64B8A00549CF0F9B577458A534472612,PinName="RGBA",Direction="EGPD_Output",PinType.PinCategory="mask",PinType.PinSubCategory="rgba",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_156" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_156'"
 Begin Object Class=/Script/Engine.MaterialExpressionLinearInterpolate Name="MaterialExpressionLinearInterpolate_0" ExportPath="/Script/Engine.MaterialExpressionLinearInterpolate'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_156.MaterialExpressionLinearInterpolate_0'"
 End Object
 Begin Object Name="MaterialExpressionLinearInterpolate_0" ExportPath="/Script/Engine.MaterialExpressionLinearInterpolate'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_156.MaterialExpressionLinearInterpolate_0'"
 A=(Expression="/Script/Engine.MaterialExpressionLinearInterpolate'MaterialGraphNode_186.MaterialExpressionLinearInterpolate_3'")
 B=(Expression="/Script/Engine.MaterialExpressionComponentMask'MaterialGraphNode_160.MaterialExpressionComponentMask_2'")
 Alpha=(Expression="/Script/Engine.MaterialExpressionSaturate'MaterialGraphNode_180.MaterialExpressionSaturate_0'")
 MaterialExpressionEditorX=-960
 MaterialExpressionEditorY=192
 MaterialExpressionGuid=8729552142D4298EC44E64885540CE81
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 Desc="1"
 bCommentBubbleVisible=True
 bCollapsed=False
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionLinearInterpolate'MaterialExpressionLinearInterpolate_0'"
 NodePosX=-960
 NodePosY=192
 bCommentBubbleVisible=True
 NodeComment="1"
 NodeGuid=8E4D0C734D0101517ABFEB9C8DC275D2
 CustomProperties Pin (PinId=29D8B8F042169A4216380BBC5569CAAA,PinName="A",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",LinkedTo=(MaterialGraphNode_186 92DAFED344734EA50A5E0D925A7B555A,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=FFEE8A6C4D470F8CD354DEA5953DE641,PinName="B",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="1.0",LinkedTo=(MaterialGraphNode_160 7E3C1D4548CD6CFF2D1A848DBA6A9BF4,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=77C32218462E34D6DFBC02A2D78F761A,PinName="Alpha",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.5",LinkedTo=(MaterialGraphNode_180 126CB33E4BCAAAA8A0DD5BBC8684DC57,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D19CE8F3435656E83CD403988AB74C43,PinName="Output",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_152 DE8FF32C435F88E4F307568D07A2517E,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_157" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_157'"
 Begin Object Class=/Script/Engine.MaterialExpressionSceneTexture Name="MaterialExpressionSceneTexture_0" ExportPath="/Script/Engine.MaterialExpressionSceneTexture'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_157.MaterialExpressionSceneTexture_0'"
 End Object
 Begin Object Name="MaterialExpressionSceneTexture_0" ExportPath="/Script/Engine.MaterialExpressionSceneTexture'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_157.MaterialExpressionSceneTexture_0'"
 SceneTextureId=PPI_PostProcessInput0
 MaterialExpressionEditorX=-1888
 MaterialExpressionEditorY=208
 MaterialExpressionGuid=9654F82040A2B6CD299DDE800083DF86
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionSceneTexture'MaterialExpressionSceneTexture_0'"
 NodePosX=-1888
 NodePosY=208
 AdvancedPinDisplay=Hidden
 NodeGuid=93786AB046977796B9FAAFA72FBB335C
 CustomProperties Pin (PinId=9A3BD54842D0B37AA378FAB5EA379A1B,PinName="UVs",PinType.PinCategory="optional",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=7C18AF6D482D509FDB7E0AA1714335C3,PinName="Scene Texture Id",PinType.PinCategory="optional",PinType.PinSubCategory="byte",PinType.PinSubCategoryObject="/Script/CoreUObject.Enum'/Script/Engine.ESceneTextureId'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="PostProcessInput0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=True,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)
 CustomProperties Pin (PinId=0E81C8184484FCBD3E83DD9440A4BEFE,PinName="Filtered",PinType.PinCategory="optional",PinType.PinSubCategory="bool",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=True,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)
 CustomProperties Pin (PinId=6723B90E45C8A62D52B4A2B5C09988BC,PinName="Color",Direction="EGPD_Output",PinType.PinCategory="mask",PinType.PinSubCategory="rgba",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_160 C082F17D45BA162E60FD2EAD58292AEE,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=571BEFE74D9B1955E3213E832D6D909D,PinName="Size",Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=02CB153942C3F30FA432B683D68BCD25,PinName="InvSize",Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_158" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_158'"
 Begin Object Class=/Script/Engine.MaterialExpressionAppendVector Name="MaterialExpressionAppendVector_0" ExportPath="/Script/Engine.MaterialExpressionAppendVector'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_158.MaterialExpressionAppendVector_0'"
 End Object
 Begin Object Name="MaterialExpressionAppendVector_0" ExportPath="/Script/Engine.MaterialExpressionAppendVector'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_158.MaterialExpressionAppendVector_0'"
 A=(Expression="/Script/Engine.MaterialExpressionVectorParameter'MaterialGraphNode_155.MaterialExpressionVectorParameter_0'",OutputIndex=1,Mask=1,MaskR=1)
 B=(Expression="/Script/Engine.MaterialExpressionVectorParameter'MaterialGraphNode_155.MaterialExpressionVectorParameter_0'",OutputIndex=2,Mask=1,MaskG=1)
 MaterialExpressionEditorX=-2352
 MaterialExpressionEditorY=592
 MaterialExpressionGuid=95D1ADD9499684F6B59A1FAB4C4A1BBD
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionAppendVector'MaterialExpressionAppendVector_0'"
 NodePosX=-2352
 NodePosY=592
 NodeGuid=46F6D80B4D4964D71173F08EA1BF13D1
 CustomProperties Pin (PinId=ABA30AAB4B96ACF5A1B59D84D2CB2FFB,PinName="A",PinType.PinCategory="required",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_155 1E1F62674A99F3ABED44B8B7B57E26F9,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=ADDFAE144F69674E2427FF845352EA94,PinName="B",PinType.PinCategory="required",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_155 0AB6652D4BF980CF1C5DBCBB0ACBB748,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=3242EB564BC7F9394A959091FBAFA3F2,PinName="Output",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_187 5E86F3E840C6B7537EA8F58EB0F6AFC7,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_159" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_159'"
 Begin Object Class=/Script/Engine.MaterialExpressionVectorParameter Name="MaterialExpressionVectorParameter_2" ExportPath="/Script/Engine.MaterialExpressionVectorParameter'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_159.MaterialExpressionVectorParameter_2'"
 End Object
 Begin Object Name="MaterialExpressionVectorParameter_2" ExportPath="/Script/Engine.MaterialExpressionVectorParameter'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_159.MaterialExpressionVectorParameter_2'"
 DefaultValue=(R=1.000000,G=0.000000,B=0.000000,A=2.000000)
 ChannelNames=(R=NSLOCTEXT("", "449D398049A9B8C034DAA19C293FF21E", "R"),G=NSLOCTEXT("", "C0B44C67499484503676868F1928FA0D", "G"),B=NSLOCTEXT("", "C0DBDFF541CB659B8EB9F1A85F2ABAB4", "B"),A=NSLOCTEXT("", "89E9B9DC47F66464CD67BFAE47681F8E", "Color Amount"))
 ParameterName="Damage Color"
 ExpressionGUID=47017DFA43114A31C9157DBF22E699AF
 MaterialExpressionEditorX=-2032
 MaterialExpressionEditorY=-48
 MaterialExpressionGuid=DB381DCB4D7778288B2779B7020CB494
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 Outputs(4)=(OutputName="Color Amount")
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionVectorParameter'MaterialExpressionVectorParameter_2'"
 NodePosX=-2032
 NodePosY=-48
 bCanRenameNode=True
 NodeGuid=2820AEEE43403A7304DFA9B84E77C0B7
 CustomProperties Pin (PinId=CCEBBFDF427293A6D61C249490AD9413,PinName="Default Value",PinType.PinCategory="optional",PinType.PinSubCategory="rgba",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="(R=1.000000,G=0.000000,B=0.000000,A=2.000000)",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=True,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D9727FFF4D86B802E831A7B4602A9F1E,PinName="RGB",Direction="EGPD_Output",PinType.PinCategory="mask",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_186 A83487EE46DD0FF217BD65BAC6AEF725,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=5F98E5DB467F36FAB982D7BBA462F3B3,PinName="R",Direction="EGPD_Output",PinType.PinCategory="mask",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=536E093241882BD5BACBC6A3C2F1244F,PinName="G",Direction="EGPD_Output",PinType.PinCategory="mask",PinType.PinSubCategory="green",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=2013538140B6DC3A4587C786E26BF367,PinName="B",Direction="EGPD_Output",PinType.PinCategory="mask",PinType.PinSubCategory="blue",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=259557444E0F648CD70E77AFED927D16,PinName="Color Amount",Direction="EGPD_Output",PinType.PinCategory="mask",PinType.PinSubCategory="alpha",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_181 27C3453B40C543874FF59CB6AEA7C734,MaterialGraphNode_185 01DA2AC14AAA9CB50E43F6BBCCA55F84,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=9FE54E674F7C9B255056A6BD8027C7D4,PinName="rgba",Direction="EGPD_Output",PinType.PinCategory="mask",PinType.PinSubCategory="rgba",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode_Knot Name="MaterialGraphNode_Knot_24" ExportPath="/Script/UnrealEd.MaterialGraphNode_Knot'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Knot_24'"
 Begin Object Class=/Script/Engine.MaterialExpressionReroute Name="MaterialExpressionReroute_0" ExportPath="/Script/Engine.MaterialExpressionReroute'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Knot_24.MaterialExpressionReroute_0'"
 End Object
 Begin Object Name="MaterialExpressionReroute_0" ExportPath="/Script/Engine.MaterialExpressionReroute'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Knot_24.MaterialExpressionReroute_0'"
 Input=(Expression="/Script/Engine.MaterialExpressionVectorParameter'MaterialGraphNode_155.MaterialExpressionVectorParameter_0'",OutputIndex=4,Mask=1,MaskA=1)
 MaterialExpressionEditorX=-2096
 MaterialExpressionEditorY=736
 MaterialExpressionGuid=9F04F9CC41E23E69A0297F81130D25D7
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionReroute'MaterialExpressionReroute_0'"
 NodePosX=-2096
 NodePosY=736
 bCanRenameNode=False
 NodeGuid=E52503E7461427BEB6F14285419E40E3
 CustomProperties Pin (PinId=D5BD417E4C34F602616FAD9FA0318D0A,PinName="InputPin",PinType.PinCategory="wildcard",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_155 FB199C6949937B847622D799644B6BEA,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=6948179C46901FA3AB80BBA10991F7AC,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="wildcard",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_153 7DC4505045B17729A865229DD1DE738E,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode_Knot Name="MaterialGraphNode_Knot_25" ExportPath="/Script/UnrealEd.MaterialGraphNode_Knot'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Knot_25'"
 Begin Object Class=/Script/Engine.MaterialExpressionReroute Name="MaterialExpressionReroute_1" ExportPath="/Script/Engine.MaterialExpressionReroute'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Knot_25.MaterialExpressionReroute_1'"
 End Object
 Begin Object Name="MaterialExpressionReroute_1" ExportPath="/Script/Engine.MaterialExpressionReroute'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Knot_25.MaterialExpressionReroute_1'"
 Input=(Expression="/Script/Engine.MaterialExpressionVectorParameter'MaterialGraphNode_155.MaterialExpressionVectorParameter_0'",OutputIndex=3,Mask=1,MaskB=1)
 MaterialExpressionEditorX=-2096
 MaterialExpressionEditorY=688
 MaterialExpressionGuid=B05536804DE1216E8713B4BB0E0A1405
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionReroute'MaterialExpressionReroute_1'"
 NodePosX=-2096
 NodePosY=688
 bCanRenameNode=False
 NodeGuid=C0821193463A447D652108BD797C4246
 CustomProperties Pin (PinId=2F8FC3684D593B93C6AE6DAE925BD329,PinName="InputPin",PinType.PinCategory="wildcard",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_155 D3C6377945D605F6C3C16AB2A28A9E25,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F0277E304488897FD3F7319498E621F1,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="wildcard",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_153 B0EBEA42411FA0CE5A00FBBB894FC56B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_160" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_160'"
 Begin Object Class=/Script/Engine.MaterialExpressionComponentMask Name="MaterialExpressionComponentMask_2" ExportPath="/Script/Engine.MaterialExpressionComponentMask'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_160.MaterialExpressionComponentMask_2'"
 End Object
 Begin Object Name="MaterialExpressionComponentMask_2" ExportPath="/Script/Engine.MaterialExpressionComponentMask'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_160.MaterialExpressionComponentMask_2'"
 Input=(Expression="/Script/Engine.MaterialExpressionSceneTexture'MaterialGraphNode_157.MaterialExpressionSceneTexture_0'",Mask=1,MaskR=1,MaskG=1,MaskB=1,MaskA=1)
 R=True
 G=True
 B=True
 MaterialExpressionEditorX=-1536
 MaterialExpressionEditorY=224
 MaterialExpressionGuid=E3BD274E45D306388F26A280F1E720D3
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionComponentMask'MaterialExpressionComponentMask_2'"
 NodePosX=-1536
 NodePosY=224
 AdvancedPinDisplay=Hidden
 NodeGuid=874229C04783E9585DCF9D8D2B3E230B
 CustomProperties Pin (PinId=C082F17D45BA162E60FD2EAD58292AEE,PinName="Input",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),PinType.PinCategory="required",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_157 6723B90E45C8A62D52B4A2B5C09988BC,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=77B730484119935294982B8A3D8E5E39,PinName="R",PinType.PinCategory="optional",PinType.PinSubCategory="bool",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=True,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)
 CustomProperties Pin (PinId=55F59BE240874D29F97A6CAD9BAF74E4,PinName="G",PinType.PinCategory="optional",PinType.PinSubCategory="bool",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=True,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)
 CustomProperties Pin (PinId=E286DDD34C392A2730364B9135BF1327,PinName="B",PinType.PinCategory="optional",PinType.PinSubCategory="bool",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=True,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)
 CustomProperties Pin (PinId=67D8EAFC4373DB03719CCE9654F64437,PinName="A",PinType.PinCategory="optional",PinType.PinSubCategory="bool",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=True,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)
 CustomProperties Pin (PinId=7E3C1D4548CD6CFF2D1A848DBA6A9BF4,PinName="Output",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_156 FFEE8A6C4D470F8CD354DEA5953DE641,MaterialGraphNode_186 BAB10488436AA54CD0673BA6C314EAAB,MaterialGraphNode_Knot_29 280E468343E148A14D0E84989ED9D3B0,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_161" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_161'"
 Begin Object Class=/Script/Engine.MaterialExpressionMaterialFunctionCall Name="MaterialExpressionMaterialFunctionCall_2" ExportPath="/Script/Engine.MaterialExpressionMaterialFunctionCall'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_161.MaterialExpressionMaterialFunctionCall_2'"
 End Object
 Begin Object Name="MaterialExpressionMaterialFunctionCall_2" ExportPath="/Script/Engine.MaterialExpressionMaterialFunctionCall'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_161.MaterialExpressionMaterialFunctionCall_2'"
 MaterialFunction="/Script/Engine.MaterialFunction'/Engine/Functions/Engine_MaterialFunctions02/Texturing/ScreenAlignedUVs.ScreenAlignedUVs'"
 FunctionInputs(0)=(ExpressionInputId=171B9A424E2AFE2A77A885B10D226783,Input=(OutputIndex=-1,InputName="Texture Dimensions"))
 FunctionOutputs(0)=(ExpressionOutputId=0B62F82A4407238F0BA4FE86805D8B50,Output=(OutputName="X 100%, Y 100%"))
 FunctionOutputs(1)=(ExpressionOutputId=454DEEEF4E56FE982167C3BFB1A643DB,Output=(OutputName="X 100%, Y Scale to Ratio"))
 FunctionOutputs(2)=(ExpressionOutputId=062C44A6472525194EA716AA80688F9D,Output=(OutputName="X Scale to Ratio, Y 100%"))
 MaterialExpressionEditorX=-2240
 MaterialExpressionEditorY=1040
 MaterialExpressionGuid=AB4AEC5F474BA1A0896E269A0FDD96F6
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 Outputs(0)=(OutputName="X 100%, Y 100%")
 Outputs(1)=(OutputName="X 100%, Y Scale to Ratio")
 Outputs(2)=(OutputName="X Scale to Ratio, Y 100%")
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionMaterialFunctionCall'MaterialExpressionMaterialFunctionCall_2'"
 NodePosX=-2240
 NodePosY=1040
 NodeGuid=2BEC8113466328C9D0CF309EEAA33969
 CustomProperties Pin (PinId=19CB78B7486A3E205E6A5099D9529E5D,PinName="Texture Dimensions (V2)",PinType.PinCategory="optional",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=5F1B260C4AAAAEDF32ED3BADC89FD080,PinName="X 100%, Y 100%",Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_162 B799BA5F4F5A564D70541DA278753243,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=37EED42E4E832BC83503C3855317756C,PinName="X 100%, Y Scale to Ratio",Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=A3819AA548E327542859E193071BC92A,PinName="X Scale to Ratio, Y 100%",Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_162" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_162'"
 Begin Object Class=/Script/Engine.MaterialExpressionMultiply Name="MaterialExpressionMultiply_0" ExportPath="/Script/Engine.MaterialExpressionMultiply'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_162.MaterialExpressionMultiply_0'"
 End Object
 Begin Object Name="MaterialExpressionMultiply_0" ExportPath="/Script/Engine.MaterialExpressionMultiply'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_162.MaterialExpressionMultiply_0'"
 A=(Expression="/Script/Engine.MaterialExpressionMaterialFunctionCall'MaterialGraphNode_161.MaterialExpressionMaterialFunctionCall_2'")
 B=(Expression="/Script/Engine.MaterialExpressionScalarParameter'MaterialGraphNode_165.MaterialExpressionScalarParameter_1'")
 MaterialExpressionEditorX=-1824
 MaterialExpressionEditorY=1040
 MaterialExpressionGuid=880274044D3419D7B7D06A9E2ADA9B84
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionMultiply'MaterialExpressionMultiply_0'"
 NodePosX=-1824
 NodePosY=1040
 NodeGuid=94EDABA048EA8F1F0EC3E698B195E26B
 CustomProperties Pin (PinId=B799BA5F4F5A564D70541DA278753243,PinName="A",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",LinkedTo=(MaterialGraphNode_161 5F1B260C4AAAAEDF32ED3BADC89FD080,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=E8E4AB8247EF771023E4318CA8C5F19A,PinName="B",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="1.0",LinkedTo=(MaterialGraphNode_165 D7241E1E4C413C57D45C039815AB339F,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=3D0FDF5C40997E889EF5E2BCB0A07A99,PinName="Output",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_163 FEAD0E1E45070924491690A9DC58C3E2,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_163" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_163'"
 Begin Object Class=/Script/Engine.MaterialExpressionTextureSampleParameter2D Name="MaterialExpressionTextureSampleParameter2D_0" ExportPath="/Script/Engine.MaterialExpressionTextureSampleParameter2D'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_163.MaterialExpressionTextureSampleParameter2D_0'"
 End Object
 Begin Object Name="MaterialExpressionTextureSampleParameter2D_0" ExportPath="/Script/Engine.MaterialExpressionTextureSampleParameter2D'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_163.MaterialExpressionTextureSampleParameter2D_0'"
 ParameterName="Noise Texture"
 ExpressionGUID=80E0BF8C4562EEC469C81EB26EF9B4EB
 Coordinates=(Expression="/Script/Engine.MaterialExpressionMultiply'MaterialGraphNode_162.MaterialExpressionMultiply_0'")
 Texture="/Script/Engine.Texture2D'/Engine/MapTemplates/TilingNoise05.TilingNoise05'"
 MaterialExpressionEditorX=-1664
 MaterialExpressionEditorY=1024
 MaterialExpressionGuid=9E3EEDA34F307B3418516F8BD7CAAD9A
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionTextureSampleParameter2D'MaterialExpressionTextureSampleParameter2D_0'"
 NodePosX=-1664
 NodePosY=1024
 AdvancedPinDisplay=Hidden
 bCanRenameNode=True
 NodeGuid=401ED69942252ECE61255988DF1CC28E
 CustomProperties Pin (PinId=FEAD0E1E45070924491690A9DC58C3E2,PinName="UVs",PinType.PinCategory="optional",PinType.PinSubCategory="byte",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0",LinkedTo=(MaterialGraphNode_162 3D0FDF5C40997E889EF5E2BCB0A07A99,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=5DA9976543E0673050D7679FA6A51E70,PinName="Apply View MipBias",PinType.PinCategory="optional",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D8270E2543B65F03F327C3AE79A13C63,PinName="MipValueMode",PinType.PinCategory="optional",PinType.PinSubCategory="byte",PinType.PinSubCategoryObject="/Script/CoreUObject.Enum'/Script/Engine.ETextureMipValueMode'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="None (use computed mip level)",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=True,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)
 CustomProperties Pin (PinId=847CAA96420F2C4F0F7D998DF6FB643D,PinName="Sampler Source",PinType.PinCategory="optional",PinType.PinSubCategory="byte",PinType.PinSubCategoryObject="/Script/CoreUObject.Enum'/Script/Engine.ESamplerSourceMode'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="From texture asset",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=True,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)
 CustomProperties Pin (PinId=57981CE849DE60E18A0FE4AA5949D125,PinName="Sampler Type",PinType.PinCategory="optional",PinType.PinSubCategory="byte",PinType.PinSubCategoryObject="/Script/CoreUObject.Enum'/Script/Engine.EMaterialSamplerType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="Color",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=True,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)
 CustomProperties Pin (PinId=A8D472C2411594AC56BAC6B5A01CBC94,PinName="RGB",Direction="EGPD_Output",PinType.PinCategory="mask",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=316B44EB497E5BDF93F674B41E255B6B,PinName="R",Direction="EGPD_Output",PinType.PinCategory="mask",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_164 E09756E84172D16628674B9417218C86,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=2E57016E446ADB1388D5F486E6231BFB,PinName="G",Direction="EGPD_Output",PinType.PinCategory="mask",PinType.PinSubCategory="green",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=71852592462A86E357C97CA5C876042A,PinName="B",Direction="EGPD_Output",PinType.PinCategory="mask",PinType.PinSubCategory="blue",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=9E20952A479DDE1E105EEB80E7F50830,PinName="A",Direction="EGPD_Output",PinType.PinCategory="mask",PinType.PinSubCategory="alpha",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=03FBB78A4852171ABBFF35B3501E01BD,PinName="RGBA",Direction="EGPD_Output",PinType.PinCategory="mask",PinType.PinSubCategory="rgba",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_164" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_164'"
 Begin Object Class=/Script/Engine.MaterialExpressionMultiply Name="MaterialExpressionMultiply_1" ExportPath="/Script/Engine.MaterialExpressionMultiply'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_164.MaterialExpressionMultiply_1'"
 End Object
 Begin Object Name="MaterialExpressionMultiply_1" ExportPath="/Script/Engine.MaterialExpressionMultiply'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_164.MaterialExpressionMultiply_1'"
 A=(Expression="/Script/Engine.MaterialExpressionTextureSampleParameter2D'MaterialGraphNode_163.MaterialExpressionTextureSampleParameter2D_0'",OutputIndex=1,Mask=1,MaskR=1)
 B=(Expression="/Script/Engine.MaterialExpressionScalarParameter'MaterialGraphNode_166.MaterialExpressionScalarParameter_2'")
 MaterialExpressionEditorX=-1232
 MaterialExpressionEditorY=1072
 MaterialExpressionGuid=CDB9BD9B4B5FA10E1C67D080F088C6DB
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionMultiply'MaterialExpressionMultiply_1'"
 NodePosX=-1232
 NodePosY=1072
 NodeGuid=CB201F2F445C837847A7FA95D6849C03
 CustomProperties Pin (PinId=E09756E84172D16628674B9417218C86,PinName="A",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",LinkedTo=(MaterialGraphNode_163 316B44EB497E5BDF93F674B41E255B6B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=250AE04346DDEBD8D72C26B7592E8A66,PinName="B",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="1.0",LinkedTo=(MaterialGraphNode_166 ED8958944A910BF5DC0ABCA450AE3BC1,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=6C18545B436BA2EDD02D869FC6657BB6,PinName="Output",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_183 EA83095C476DC3057D689F8F828B37FD,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_165" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_165'"
 Begin Object Class=/Script/Engine.MaterialExpressionScalarParameter Name="MaterialExpressionScalarParameter_1" ExportPath="/Script/Engine.MaterialExpressionScalarParameter'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_165.MaterialExpressionScalarParameter_1'"
 End Object
 Begin Object Name="MaterialExpressionScalarParameter_1" ExportPath="/Script/Engine.MaterialExpressionScalarParameter'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_165.MaterialExpressionScalarParameter_1'"
 DefaultValue=1.000000
 SliderMin=-1.000000
 SliderMax=2.000000
 ParameterName="Noise Tiling"
 ExpressionGUID=1C8048014D3A6777C3B4908D4152893E
 MaterialExpressionEditorX=-2064
 MaterialExpressionEditorY=1184
 MaterialExpressionGuid=AA351F7A4202BBA17E35F1A4C7FA2809
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionScalarParameter'MaterialExpressionScalarParameter_1'"
 NodePosX=-2064
 NodePosY=1184
 bCanRenameNode=True
 NodeGuid=CB109F1C4F56408B6A17C9BD7D626292
 CustomProperties Pin (PinId=DE91EC424A168F1695DCB7BDC85C7859,PinName="Default Value",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="1.0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=True,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D7241E1E4C413C57D45C039815AB339F,PinName="Output",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_162 E8E4AB8247EF771023E4318CA8C5F19A,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_166" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_166'"
 Begin Object Class=/Script/Engine.MaterialExpressionScalarParameter Name="MaterialExpressionScalarParameter_2" ExportPath="/Script/Engine.MaterialExpressionScalarParameter'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_166.MaterialExpressionScalarParameter_2'"
 End Object
 Begin Object Name="MaterialExpressionScalarParameter_2" ExportPath="/Script/Engine.MaterialExpressionScalarParameter'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_166.MaterialExpressionScalarParameter_2'"
 DefaultValue=1.000000
 SliderMin=1.000000
 SliderMax=5.000000
 ParameterName="Noise Falloff"
 ExpressionGUID=621B340D481371A431F65FA7E6FEE910
 MaterialExpressionEditorX=-1440
 MaterialExpressionEditorY=1168
 MaterialExpressionGuid=ABD315714B92F7D652DF5995260F672A
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionScalarParameter'MaterialExpressionScalarParameter_2'"
 NodePosX=-1440
 NodePosY=1168
 bCanRenameNode=True
 NodeGuid=6C414CC942089778E52F6594BB27069C
 CustomProperties Pin (PinId=AB79E2D14079A9BA150809A8FB2AE6BF,PinName="Default Value",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="1.0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=True,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=ED8958944A910BF5DC0ABCA450AE3BC1,PinName="Output",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_164 250AE04346DDEBD8D72C26B7592E8A66,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_167" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_167'"
 Begin Object Class=/Script/Engine.MaterialExpressionTime Name="MaterialExpressionTime_0" ExportPath="/Script/Engine.MaterialExpressionTime'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_167.MaterialExpressionTime_0'"
 End Object
 Begin Object Name="MaterialExpressionTime_0" ExportPath="/Script/Engine.MaterialExpressionTime'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_167.MaterialExpressionTime_0'"
 MaterialExpressionEditorX=-2512
 MaterialExpressionEditorY=-480
 MaterialExpressionGuid=B04E59B846EEBD0E96CDCBB7638212D6
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionTime'MaterialExpressionTime_0'"
 NodePosX=-2512
 NodePosY=-480
 NodeGuid=3CAE91254A5C8F2DF66D7C96FAE573D9
 CustomProperties Pin (PinId=9DDA7238400DFD04D5AAF98B400B7EEC,PinName="Output",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_168 FF81AB1048DC06989E2D4BA093DFF104,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_168" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_168'"
 Begin Object Class=/Script/Engine.MaterialExpressionMultiply Name="MaterialExpressionMultiply_2" ExportPath="/Script/Engine.MaterialExpressionMultiply'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_168.MaterialExpressionMultiply_2'"
 End Object
 Begin Object Name="MaterialExpressionMultiply_2" ExportPath="/Script/Engine.MaterialExpressionMultiply'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_168.MaterialExpressionMultiply_2'"
 A=(Expression="/Script/Engine.MaterialExpressionTime'MaterialGraphNode_167.MaterialExpressionTime_0'")
 B=(Expression="/Script/Engine.MaterialExpressionScalarParameter'MaterialGraphNode_169.MaterialExpressionScalarParameter_3'")
 MaterialExpressionEditorX=-2336
 MaterialExpressionEditorY=-464
 MaterialExpressionGuid=6C77991B4E1E83561BA70D8B1D06BDEE
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionMultiply'MaterialExpressionMultiply_2'"
 NodePosX=-2336
 NodePosY=-464
 NodeGuid=5222EBEB4423541B4C4F978B0174B5BE
 CustomProperties Pin (PinId=FF81AB1048DC06989E2D4BA093DFF104,PinName="A",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",LinkedTo=(MaterialGraphNode_167 9DDA7238400DFD04D5AAF98B400B7EEC,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=009DEA4E41CEED1AA08387AA8BBDBF1F,PinName="B",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="1.0",LinkedTo=(MaterialGraphNode_169 5BC9B4F446641ED8FAAD23B8F96DA392,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=92E6143C46BD6E280A110FB4247FAE3F,PinName="Output",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_170 D99D8CF246E2943AC1A9139B94E40DE8,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_169" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_169'"
 Begin Object Class=/Script/Engine.MaterialExpressionScalarParameter Name="MaterialExpressionScalarParameter_3" ExportPath="/Script/Engine.MaterialExpressionScalarParameter'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_169.MaterialExpressionScalarParameter_3'"
 End Object
 Begin Object Name="MaterialExpressionScalarParameter_3" ExportPath="/Script/Engine.MaterialExpressionScalarParameter'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_169.MaterialExpressionScalarParameter_3'"
 DefaultValue=0.500000
 SliderMax=2.000000
 ParameterName="Pulse Speed"
 ExpressionGUID=09538DDF4E89135D21B6E4930D14CA72
 MaterialExpressionEditorX=-2576
 MaterialExpressionEditorY=-384
 MaterialExpressionGuid=A01CDA9244B4D61FD418A7A783B0868C
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionScalarParameter'MaterialExpressionScalarParameter_3'"
 NodePosX=-2576
 NodePosY=-384
 bCanRenameNode=True
 NodeGuid=ADFDFCA54B744DED6E1D1E99A4E15477
 CustomProperties Pin (PinId=83AD9C464757523DC7B004B591B52217,PinName="Default Value",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.5",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=True,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=5BC9B4F446641ED8FAAD23B8F96DA392,PinName="Output",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_168 009DEA4E41CEED1AA08387AA8BBDBF1F,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_170" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_170'"
 Begin Object Class=/Script/Engine.MaterialExpressionSine Name="MaterialExpressionSine_0" ExportPath="/Script/Engine.MaterialExpressionSine'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_170.MaterialExpressionSine_0'"
 End Object
 Begin Object Name="MaterialExpressionSine_0" ExportPath="/Script/Engine.MaterialExpressionSine'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_170.MaterialExpressionSine_0'"
 Input=(Expression="/Script/Engine.MaterialExpressionMultiply'MaterialGraphNode_168.MaterialExpressionMultiply_2'")
 MaterialExpressionEditorX=-2160
 MaterialExpressionEditorY=-464
 MaterialExpressionGuid=C2124BA24CF24A1446F1B3980CF2C95A
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionSine'MaterialExpressionSine_0'"
 NodePosX=-2160
 NodePosY=-464
 AdvancedPinDisplay=Hidden
 NodeGuid=8CA4D68A4557607F7F744C8B1D5065B1
 CustomProperties Pin (PinId=D99D8CF246E2943AC1A9139B94E40DE8,PinName="Input",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),PinType.PinCategory="required",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_168 92E6143C46BD6E280A110FB4247FAE3F,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=2973EA59443841F6E7A1F6876F7D091D,PinName="Period",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="1.0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=True,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D200F66D4CE51D3B30C601B52B51A110,PinName="Output",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_171 A6D49254438FFC7E261451920E840B10,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_171" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_171'"
 Begin Object Class=/Script/Engine.MaterialExpressionAdd Name="MaterialExpressionAdd_0" ExportPath="/Script/Engine.MaterialExpressionAdd'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_171.MaterialExpressionAdd_0'"
 End Object
 Begin Object Name="MaterialExpressionAdd_0" ExportPath="/Script/Engine.MaterialExpressionAdd'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_171.MaterialExpressionAdd_0'"
 A=(Expression="/Script/Engine.MaterialExpressionSine'MaterialGraphNode_170.MaterialExpressionSine_0'")
 MaterialExpressionEditorX=-2032
 MaterialExpressionEditorY=-464
 MaterialExpressionGuid=899C907F4DC4CBE4EF976C9B838BF16B
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionAdd'MaterialExpressionAdd_0'"
 NodePosX=-2032
 NodePosY=-464
 NodeGuid=627D2A2F4B1E6D1970D2E9B0D05DD1E2
 CustomProperties Pin (PinId=A6D49254438FFC7E261451920E840B10,PinName="A",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",LinkedTo=(MaterialGraphNode_170 D200F66D4CE51D3B30C601B52B51A110,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=BE8C4668488F2ABDC845F8BBB3BDB160,PinName="B",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="1.0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=E4B7522C4EBDC0A522B21793B1E8C89A,PinName="Output",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_172 2C4CCEFB45F66A6A6A8A0E96D8787444,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_172" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_172'"
 Begin Object Class=/Script/Engine.MaterialExpressionDivide Name="MaterialExpressionDivide_0" ExportPath="/Script/Engine.MaterialExpressionDivide'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_172.MaterialExpressionDivide_0'"
 End Object
 Begin Object Name="MaterialExpressionDivide_0" ExportPath="/Script/Engine.MaterialExpressionDivide'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_172.MaterialExpressionDivide_0'"
 A=(Expression="/Script/Engine.MaterialExpressionAdd'MaterialGraphNode_171.MaterialExpressionAdd_0'")
 MaterialExpressionEditorX=-1888
 MaterialExpressionEditorY=-464
 MaterialExpressionGuid=02B96FA342EBA39AA1FDB9A264C4982D
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionDivide'MaterialExpressionDivide_0'"
 NodePosX=-1888
 NodePosY=-464
 NodeGuid=179640104E1F10A593C035BE3063C705
 CustomProperties Pin (PinId=2C4CCEFB45F66A6A6A8A0E96D8787444,PinName="A",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="1.0",LinkedTo=(MaterialGraphNode_171 E4B7522C4EBDC0A522B21793B1E8C89A,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=7553386744A811C6C52D258EA3C4FAB6,PinName="B",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="2.0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=7F7190224BBA63A4473953A3AB7E71F2,PinName="Output",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_173 2FFE2A8449AF2764C2C31981680B1C4D,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_173" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_173'"
 Begin Object Class=/Script/Engine.MaterialExpressionMultiply Name="MaterialExpressionMultiply_4" ExportPath="/Script/Engine.MaterialExpressionMultiply'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_173.MaterialExpressionMultiply_4'"
 End Object
 Begin Object Name="MaterialExpressionMultiply_4" ExportPath="/Script/Engine.MaterialExpressionMultiply'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_173.MaterialExpressionMultiply_4'"
 A=(Expression="/Script/Engine.MaterialExpressionDivide'MaterialGraphNode_172.MaterialExpressionDivide_0'")
 B=(Expression="/Script/Engine.MaterialExpressionScalarParameter'MaterialGraphNode_174.MaterialExpressionScalarParameter_4'")
 MaterialExpressionEditorX=-1712
 MaterialExpressionEditorY=-464
 MaterialExpressionGuid=9FEA03AF4ACCE8177539E7900394DE5C
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionMultiply'MaterialExpressionMultiply_4'"
 NodePosX=-1712
 NodePosY=-464
 NodeGuid=C90CD0B84852320E21AF4B87FD024B80
 CustomProperties Pin (PinId=2FFE2A8449AF2764C2C31981680B1C4D,PinName="A",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",LinkedTo=(MaterialGraphNode_172 7F7190224BBA63A4473953A3AB7E71F2,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=5F704043465219BD32A631A764615AE4,PinName="B",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="1.0",LinkedTo=(MaterialGraphNode_174 8CE74DF042024B9446094DA51BFEA4C1,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=53DA8F2C459C86EFA89422B4D0F378C2,PinName="Output",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_181 322A032D48352215C7F229ABB483D8CF,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_174" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_174'"
 Begin Object Class=/Script/Engine.MaterialExpressionScalarParameter Name="MaterialExpressionScalarParameter_4" ExportPath="/Script/Engine.MaterialExpressionScalarParameter'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_174.MaterialExpressionScalarParameter_4'"
 End Object
 Begin Object Name="MaterialExpressionScalarParameter_4" ExportPath="/Script/Engine.MaterialExpressionScalarParameter'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_174.MaterialExpressionScalarParameter_4'"
 DefaultValue=1.000000
 SliderMax=1.000000
 ParameterName="Pulse Amount"
 ExpressionGUID=9BB8666941A81F26368A4D98799A32C9
 MaterialExpressionEditorX=-1952
 MaterialExpressionEditorY=-336
 MaterialExpressionGuid=E22D54F644DE45A35FB05DA8D9F10851
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionScalarParameter'MaterialExpressionScalarParameter_4'"
 NodePosX=-1952
 NodePosY=-336
 bCanRenameNode=True
 NodeGuid=55249A54423EF8456CD802956A6D548A
 CustomProperties Pin (PinId=BB006CBD4D796F4EEA5C17B4E18EF0D0,PinName="Default Value",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="1.0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=True,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=8CE74DF042024B9446094DA51BFEA4C1,PinName="Output",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_173 5F704043465219BD32A631A764615AE4,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_175" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_175'"
 Begin Object Class=/Script/Engine.MaterialExpressionLinearInterpolate Name="MaterialExpressionLinearInterpolate_1" ExportPath="/Script/Engine.MaterialExpressionLinearInterpolate'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_175.MaterialExpressionLinearInterpolate_1'"
 End Object
 Begin Object Name="MaterialExpressionLinearInterpolate_1" ExportPath="/Script/Engine.MaterialExpressionLinearInterpolate'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_175.MaterialExpressionLinearInterpolate_1'"
 B=(Expression="/Script/Engine.MaterialExpressionAdd'MaterialGraphNode_178.MaterialExpressionAdd_1'")
 Alpha=(Expression="/Script/Engine.MaterialExpressionReroute'MaterialGraphNode_Knot_26.MaterialExpressionReroute_2'")
 MaterialExpressionEditorX=-1152
 MaterialExpressionEditorY=640
 MaterialExpressionGuid=9B63D984469EA185B24D7D8037CB7911
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 Desc="2"
 bCommentBubbleVisible=True
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionLinearInterpolate'MaterialExpressionLinearInterpolate_1'"
 NodePosX=-1152
 NodePosY=640
 bCommentBubbleVisible=True
 NodeComment="2"
 NodeGuid=831DBC4E46A0B73254DA3E915E32E567
 CustomProperties Pin (PinId=01E30E2A4FD2096BF1AB1DB426FF6498,PinName="A",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=2F7E6AA74F02C44DA4FFFEBB6C51D400,PinName="B",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="1.0",LinkedTo=(MaterialGraphNode_178 08DE38174BD0876F9C2741BCF82CB58E,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=E5F935B344A6DDD7E50B88B472C16128,PinName="Alpha",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.5",LinkedTo=(MaterialGraphNode_Knot_26 23C239334099B532A3487188BA9CF271,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=868B781343812FB5E7CEBF848A7150BE,PinName="Output",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_180 DEF8EC9147195563549F2A8B178DAC90,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_176" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_176'"
 Begin Object Class=/Script/Engine.MaterialExpressionOneMinus Name="MaterialExpressionOneMinus_0" ExportPath="/Script/Engine.MaterialExpressionOneMinus'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_176.MaterialExpressionOneMinus_0'"
 End Object
 Begin Object Name="MaterialExpressionOneMinus_0" ExportPath="/Script/Engine.MaterialExpressionOneMinus'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_176.MaterialExpressionOneMinus_0'"
 Input=(Expression="/Script/Engine.MaterialExpressionMaterialFunctionCall'MaterialGraphNode_153.MaterialExpressionMaterialFunctionCall_0'")
 MaterialExpressionEditorX=-1648
 MaterialExpressionEditorY=512
 MaterialExpressionGuid=2AD4BD4F42C5F05BD04266A2E143A5AB
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionOneMinus'MaterialExpressionOneMinus_0'"
 NodePosX=-1648
 NodePosY=512
 NodeGuid=AA92F2E54A523219F505AD8AF5A56540
 CustomProperties Pin (PinId=C95565EF4B965F0595214C92330B2E2C,PinName="Input",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),PinType.PinCategory="required",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_153 87D111744A90BF1F247D0492F68963E1,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=365D502E42775A345A379A9D247B49E0,PinName="Output",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_177 1E0713EC44E5360F3ECCB6B025562CBB,MaterialGraphNode_178 E1A2AC1F4E4EB9D2360DCF922927B974,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_177" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_177'"
 Begin Object Class=/Script/Engine.MaterialExpressionMultiply Name="MaterialExpressionMultiply_5" ExportPath="/Script/Engine.MaterialExpressionMultiply'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_177.MaterialExpressionMultiply_5'"
 End Object
 Begin Object Name="MaterialExpressionMultiply_5" ExportPath="/Script/Engine.MaterialExpressionMultiply'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_177.MaterialExpressionMultiply_5'"
 A=(Expression="/Script/Engine.MaterialExpressionOneMinus'MaterialGraphNode_176.MaterialExpressionOneMinus_0'")
 B=(Expression="/Script/Engine.MaterialExpressionReroute'MaterialGraphNode_Knot_27.MaterialExpressionReroute_5'")
 MaterialExpressionEditorX=-1520
 MaterialExpressionEditorY=592
 MaterialExpressionGuid=9F976E834FAEBB00D9DAA5A1B30A5A99
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionMultiply'MaterialExpressionMultiply_5'"
 NodePosX=-1520
 NodePosY=592
 NodeGuid=B4BCF6F6462B28FD8C6487AA3E8F1B67
 CustomProperties Pin (PinId=1E0713EC44E5360F3ECCB6B025562CBB,PinName="A",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",LinkedTo=(MaterialGraphNode_176 365D502E42775A345A379A9D247B49E0,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=AB25DCEB4791291C09F34F8C703CBF4F,PinName="B",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="1.0",LinkedTo=(MaterialGraphNode_Knot_27 EAF58FB14BB8766FE57D38930237ACC8,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D21D4CAD4450D76A37A4AD9FC18021B7,PinName="Output",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_179 A8D6CDC145AD39D4261ADE85B99375F2,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode_Knot Name="MaterialGraphNode_Knot_26" ExportPath="/Script/UnrealEd.MaterialGraphNode_Knot'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Knot_26'"
 Begin Object Class=/Script/Engine.MaterialExpressionReroute Name="MaterialExpressionReroute_2" ExportPath="/Script/Engine.MaterialExpressionReroute'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Knot_26.MaterialExpressionReroute_2'"
 End Object
 Begin Object Name="MaterialExpressionReroute_2" ExportPath="/Script/Engine.MaterialExpressionReroute'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Knot_26.MaterialExpressionReroute_2'"
 Input=(Expression="/Script/Engine.MaterialExpressionMaterialFunctionCall'MaterialGraphNode_153.MaterialExpressionMaterialFunctionCall_0'")
 MaterialExpressionEditorX=-1664
 MaterialExpressionEditorY=736
 MaterialExpressionGuid=2607697B4839B0D239E417A2EE55D1DA
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionReroute'MaterialExpressionReroute_2'"
 NodePosX=-1664
 NodePosY=736
 bCanRenameNode=False
 NodeGuid=9207B30F40C9358B9A96A4B079C43EE5
 CustomProperties Pin (PinId=B705A9BB45585A3C1470788D0CB1FCCE,PinName="InputPin",PinType.PinCategory="wildcard",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_153 87D111744A90BF1F247D0492F68963E1,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=23C239334099B532A3487188BA9CF271,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="wildcard",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_175 E5F935B344A6DDD7E50B88B472C16128,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_178" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_178'"
 Begin Object Class=/Script/Engine.MaterialExpressionAdd Name="MaterialExpressionAdd_1" ExportPath="/Script/Engine.MaterialExpressionAdd'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_178.MaterialExpressionAdd_1'"
 End Object
 Begin Object Name="MaterialExpressionAdd_1" ExportPath="/Script/Engine.MaterialExpressionAdd'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_178.MaterialExpressionAdd_1'"
 A=(Expression="/Script/Engine.MaterialExpressionOneMinus'MaterialGraphNode_176.MaterialExpressionOneMinus_0'")
 B=(Expression="/Script/Engine.MaterialExpressionOneMinus'MaterialGraphNode_179.MaterialExpressionOneMinus_2'")
 MaterialExpressionEditorX=-1264
 MaterialExpressionEditorY=512
 MaterialExpressionGuid=EAFEE9BA47A0FC6F37048AA5A581150E
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionAdd'MaterialExpressionAdd_1'"
 NodePosX=-1264
 NodePosY=512
 NodeGuid=8D39CB814AF26FEB655C81B7C1428D1C
 CustomProperties Pin (PinId=E1A2AC1F4E4EB9D2360DCF922927B974,PinName="A",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",LinkedTo=(MaterialGraphNode_176 365D502E42775A345A379A9D247B49E0,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D0EEB7C045D0B58B71CC50821C23D508,PinName="B",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="1.0",LinkedTo=(MaterialGraphNode_179 8DD1353D473B379A3CDF46B6F634AE8E,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=08DE38174BD0876F9C2741BCF82CB58E,PinName="Output",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_175 2F7E6AA74F02C44DA4FFFEBB6C51D400,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_179" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_179'"
 Begin Object Class=/Script/Engine.MaterialExpressionOneMinus Name="MaterialExpressionOneMinus_2" ExportPath="/Script/Engine.MaterialExpressionOneMinus'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_179.MaterialExpressionOneMinus_2'"
 End Object
 Begin Object Name="MaterialExpressionOneMinus_2" ExportPath="/Script/Engine.MaterialExpressionOneMinus'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_179.MaterialExpressionOneMinus_2'"
 Input=(Expression="/Script/Engine.MaterialExpressionMultiply'MaterialGraphNode_177.MaterialExpressionMultiply_5'")
 MaterialExpressionEditorX=-1360
 MaterialExpressionEditorY=576
 MaterialExpressionGuid=709084E945DA74F775AD50AFA4F3C73D
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionOneMinus'MaterialExpressionOneMinus_2'"
 NodePosX=-1360
 NodePosY=576
 NodeGuid=EED07DC64BD62DD1E54D87B0684AD5F5
 CustomProperties Pin (PinId=A8D6CDC145AD39D4261ADE85B99375F2,PinName="Input",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),PinType.PinCategory="required",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_177 D21D4CAD4450D76A37A4AD9FC18021B7,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=8DD1353D473B379A3CDF46B6F634AE8E,PinName="Output",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_178 D0EEB7C045D0B58B71CC50821C23D508,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_180" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_180'"
 Begin Object Class=/Script/Engine.MaterialExpressionSaturate Name="MaterialExpressionSaturate_0" ExportPath="/Script/Engine.MaterialExpressionSaturate'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_180.MaterialExpressionSaturate_0'"
 End Object
 Begin Object Name="MaterialExpressionSaturate_0" ExportPath="/Script/Engine.MaterialExpressionSaturate'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_180.MaterialExpressionSaturate_0'"
 Input=(Expression="/Script/Engine.MaterialExpressionLinearInterpolate'MaterialGraphNode_175.MaterialExpressionLinearInterpolate_1'")
 MaterialExpressionEditorX=-1008
 MaterialExpressionEditorY=640
 MaterialExpressionGuid=458BFAF345D00549624395AB8ED38748
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionSaturate'MaterialExpressionSaturate_0'"
 NodePosX=-1008
 NodePosY=640
 NodeGuid=7C2AA4614756A2E276A240BC01CA5AA1
 CustomProperties Pin (PinId=DEF8EC9147195563549F2A8B178DAC90,PinName="Input",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),PinType.PinCategory="required",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_175 868B781343812FB5E7CEBF848A7150BE,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=126CB33E4BCAAAA8A0DD5BBC8684DC57,PinName="Output",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_156 77C32218462E34D6DFBC02A2D78F761A,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode_Knot Name="MaterialGraphNode_Knot_27" ExportPath="/Script/UnrealEd.MaterialGraphNode_Knot'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Knot_27'"
 Begin Object Class=/Script/Engine.MaterialExpressionReroute Name="MaterialExpressionReroute_5" ExportPath="/Script/Engine.MaterialExpressionReroute'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Knot_27.MaterialExpressionReroute_5'"
 End Object
 Begin Object Name="MaterialExpressionReroute_5" ExportPath="/Script/Engine.MaterialExpressionReroute'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Knot_27.MaterialExpressionReroute_5'"
 Input=(Expression="/Script/Engine.MaterialExpressionReroute'MaterialGraphNode_Knot_28.MaterialExpressionReroute_6'")
 MaterialExpressionEditorX=-1520
 MaterialExpressionEditorY=896
 MaterialExpressionGuid=7D2C26264567A328BAD3EAB0820951EB
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionReroute'MaterialExpressionReroute_5'"
 NodePosX=-1520
 NodePosY=896
 bCanRenameNode=False
 NodeGuid=A1CB2A4F41554859872831B45E2BC274
 CustomProperties Pin (PinId=38C55E4442225A2D480C94B81BB27359,PinName="InputPin",PinType.PinCategory="wildcard",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_Knot_28 F80AD95942BB656E29B3FEB203D3A330,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=EAF58FB14BB8766FE57D38930237ACC8,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="wildcard",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_177 AB25DCEB4791291C09F34F8C703CBF4F,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode_Knot Name="MaterialGraphNode_Knot_28" ExportPath="/Script/UnrealEd.MaterialGraphNode_Knot'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Knot_28'"
 Begin Object Class=/Script/Engine.MaterialExpressionReroute Name="MaterialExpressionReroute_6" ExportPath="/Script/Engine.MaterialExpressionReroute'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Knot_28.MaterialExpressionReroute_6'"
 End Object
 Begin Object Name="MaterialExpressionReroute_6" ExportPath="/Script/Engine.MaterialExpressionReroute'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Knot_28.MaterialExpressionReroute_6'"
 Input=(Expression="/Script/Engine.MaterialExpressionPower'MaterialGraphNode_183.MaterialExpressionPower_2'")
 MaterialExpressionEditorX=-896
 MaterialExpressionEditorY=896
 MaterialExpressionGuid=8382256C4D3A060161EC77A675E303C2
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionReroute'MaterialExpressionReroute_6'"
 NodePosX=-896
 NodePosY=896
 bCanRenameNode=False
 NodeGuid=4DC9123344A678E4409C3B854B780B45
 CustomProperties Pin (PinId=7C6229404D8872F1601F2988F25E42E5,PinName="InputPin",PinType.PinCategory="wildcard",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_183 45320CF6415CD719B5E6A6B7065AC557,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F80AD95942BB656E29B3FEB203D3A330,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="wildcard",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_Knot_27 38C55E4442225A2D480C94B81BB27359,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_181" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_181'"
 Begin Object Class=/Script/Engine.MaterialExpressionLinearInterpolate Name="MaterialExpressionLinearInterpolate_4" ExportPath="/Script/Engine.MaterialExpressionLinearInterpolate'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_181.MaterialExpressionLinearInterpolate_4'"
 End Object
 Begin Object Name="MaterialExpressionLinearInterpolate_4" ExportPath="/Script/Engine.MaterialExpressionLinearInterpolate'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_181.MaterialExpressionLinearInterpolate_4'"
 A=(Expression="/Script/Engine.MaterialExpressionDivide'MaterialGraphNode_185.MaterialExpressionDivide_3'")
 B=(Expression="/Script/Engine.MaterialExpressionVectorParameter'MaterialGraphNode_159.MaterialExpressionVectorParameter_2'",OutputIndex=4,Mask=1,MaskA=1)
 Alpha=(Expression="/Script/Engine.MaterialExpressionMultiply'MaterialGraphNode_173.MaterialExpressionMultiply_4'")
 MaterialExpressionEditorX=-1376
 MaterialExpressionEditorY=-112
 MaterialExpressionGuid=907FCA2F48B3E400FECA42B8FB3B717F
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 Desc="3"
 bCommentBubbleVisible=True
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionLinearInterpolate'MaterialExpressionLinearInterpolate_4'"
 NodePosX=-1376
 NodePosY=-112
 bCommentBubbleVisible=True
 NodeComment="3"
 NodeGuid=A0F8803744A93092FE2E118E4F45927F
 CustomProperties Pin (PinId=C1BD713C4EB3F0DD4CF6C3897FA78EDE,PinName="A",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",LinkedTo=(MaterialGraphNode_185 BA3C6AB245C68D8776CB679FD5D43980,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=27C3453B40C543874FF59CB6AEA7C734,PinName="B",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="1.0",LinkedTo=(MaterialGraphNode_159 259557444E0F648CD70E77AFED927D16,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=322A032D48352215C7F229ABB483D8CF,PinName="Alpha",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.5",LinkedTo=(MaterialGraphNode_173 53DA8F2C459C86EFA89422B4D0F378C2,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=CBEEB4D64642EDE96C07B7A3295F817B,PinName="Output",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_186 B90904824DEC36F21F4766A1183D441B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_182" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_182'"
 Begin Object Class=/Script/Engine.MaterialExpressionScalarParameter Name="MaterialExpressionScalarParameter_8" ExportPath="/Script/Engine.MaterialExpressionScalarParameter'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_182.MaterialExpressionScalarParameter_8'"
 End Object
 Begin Object Name="MaterialExpressionScalarParameter_8" ExportPath="/Script/Engine.MaterialExpressionScalarParameter'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_182.MaterialExpressionScalarParameter_8'"
 DefaultValue=1.000000
 SliderMax=1.000000
 ParameterName="Damage Amount"
 ExpressionGUID=84A4003C41EBC9DD070CC387B60F2725
 MaterialExpressionEditorX=-640
 MaterialExpressionEditorY=288
 MaterialExpressionGuid=44266E0745E90BEB0F814CA303B072AB
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionScalarParameter'MaterialExpressionScalarParameter_8'"
 NodePosX=-640
 NodePosY=288
 bCanRenameNode=True
 NodeGuid=0AAA64F84968AF88CDC8E0B6FFA76FD8
 CustomProperties Pin (PinId=32D49D2F4233E85E3C45F880809DB891,PinName="Default Value",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="1.0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=True,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F09C09414F4BFF2FF95A2EA225C6BE25,PinName="Output",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_152 E4BDE06F4D042416C42E15A35455006F,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_183" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_183'"
 Begin Object Class=/Script/Engine.MaterialExpressionPower Name="MaterialExpressionPower_2" ExportPath="/Script/Engine.MaterialExpressionPower'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_183.MaterialExpressionPower_2'"
 End Object
 Begin Object Name="MaterialExpressionPower_2" ExportPath="/Script/Engine.MaterialExpressionPower'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_183.MaterialExpressionPower_2'"
 Base=(Expression="/Script/Engine.MaterialExpressionMultiply'MaterialGraphNode_164.MaterialExpressionMultiply_1'")
 Exponent=(Expression="/Script/Engine.MaterialExpressionScalarParameter'MaterialGraphNode_184.MaterialExpressionScalarParameter_9'")
 MaterialExpressionEditorX=-992
 MaterialExpressionEditorY=1072
 MaterialExpressionGuid=D632F12A4448D4E8BF4DD18685F455A9
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionPower'MaterialExpressionPower_2'"
 NodePosX=-992
 NodePosY=1072
 NodeGuid=D631AB87497E175AFF5FE59F9EA3E081
 CustomProperties Pin (PinId=EA83095C476DC3057D689F8F828B37FD,PinName="Base",PinType.PinCategory="required",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_164 6C18545B436BA2EDD02D869FC6657BB6,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=BBE800E7429C0D380A68C19FBBC41822,PinName="Exp",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="2.0",LinkedTo=(MaterialGraphNode_184 BE52632B40C6CBD3A3D581BE9CF385A3,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=45320CF6415CD719B5E6A6B7065AC557,PinName="Output",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_Knot_28 7C6229404D8872F1601F2988F25E42E5,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_184" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_184'"
 Begin Object Class=/Script/Engine.MaterialExpressionScalarParameter Name="MaterialExpressionScalarParameter_9" ExportPath="/Script/Engine.MaterialExpressionScalarParameter'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_184.MaterialExpressionScalarParameter_9'"
 End Object
 Begin Object Name="MaterialExpressionScalarParameter_9" ExportPath="/Script/Engine.MaterialExpressionScalarParameter'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_184.MaterialExpressionScalarParameter_9'"
 DefaultValue=1.000000
 SliderMin=0.500000
 SliderMax=3.000000
 ParameterName="Noise Amount"
 ExpressionGUID=4E4FBDCF404EF8F0C66751BB7FC7C837
 MaterialExpressionEditorX=-1216
 MaterialExpressionEditorY=1200
 MaterialExpressionGuid=30CBE2194A7C59DE3A72C7BABFFA069F
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionScalarParameter'MaterialExpressionScalarParameter_9'"
 NodePosX=-1216
 NodePosY=1200
 bCanRenameNode=True
 NodeGuid=0797C6C44E057DB29A4139B5408D881E
 CustomProperties Pin (PinId=CFEB17E94738C6E01414D49F951FF1CB,PinName="Default Value",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="1.0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=True,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=BE52632B40C6CBD3A3D581BE9CF385A3,PinName="Output",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_183 BBE800E7429C0D380A68C19FBBC41822,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_185" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_185'"
 Begin Object Class=/Script/Engine.MaterialExpressionDivide Name="MaterialExpressionDivide_3" ExportPath="/Script/Engine.MaterialExpressionDivide'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_185.MaterialExpressionDivide_3'"
 End Object
 Begin Object Name="MaterialExpressionDivide_3" ExportPath="/Script/Engine.MaterialExpressionDivide'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_185.MaterialExpressionDivide_3'"
 A=(Expression="/Script/Engine.MaterialExpressionVectorParameter'MaterialGraphNode_159.MaterialExpressionVectorParameter_2'",OutputIndex=4,Mask=1,MaskA=1)
 MaterialExpressionEditorX=-1632
 MaterialExpressionEditorY=-112
 MaterialExpressionGuid=8AC1DC774EA07C4CE18E55A4FA0FDC5A
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionDivide'MaterialExpressionDivide_3'"
 NodePosX=-1632
 NodePosY=-112
 NodeGuid=5BFF73E645C5FD4BD0EF3BA11F04BC45
 CustomProperties Pin (PinId=01DA2AC14AAA9CB50E43F6BBCCA55F84,PinName="A",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="1.0",LinkedTo=(MaterialGraphNode_159 259557444E0F648CD70E77AFED927D16,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=3E58AD5149E28D825DE88F843209D7AB,PinName="B",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="2.0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=BA3C6AB245C68D8776CB679FD5D43980,PinName="Output",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_181 C1BD713C4EB3F0DD4CF6C3897FA78EDE,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_186" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_186'"
 Begin Object Class=/Script/Engine.MaterialExpressionLinearInterpolate Name="MaterialExpressionLinearInterpolate_3" ExportPath="/Script/Engine.MaterialExpressionLinearInterpolate'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_186.MaterialExpressionLinearInterpolate_3'"
 End Object
 Begin Object Name="MaterialExpressionLinearInterpolate_3" ExportPath="/Script/Engine.MaterialExpressionLinearInterpolate'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_186.MaterialExpressionLinearInterpolate_3'"
 A=(Expression="/Script/Engine.MaterialExpressionComponentMask'MaterialGraphNode_160.MaterialExpressionComponentMask_2'")
 B=(Expression="/Script/Engine.MaterialExpressionVectorParameter'MaterialGraphNode_159.MaterialExpressionVectorParameter_2'",Mask=1,MaskR=1,MaskG=1,MaskB=1)
 Alpha=(Expression="/Script/Engine.MaterialExpressionLinearInterpolate'MaterialGraphNode_181.MaterialExpressionLinearInterpolate_4'")
 MaterialExpressionEditorX=-1168
 MaterialExpressionGuid=FADEC8CD49BD985EC4AD18AEC6404618
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 Desc="new"
 bCommentBubbleVisible=True
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionLinearInterpolate'MaterialExpressionLinearInterpolate_3'"
 NodePosX=-1168
 bCommentBubbleVisible=True
 NodeComment="new"
 NodeGuid=6E12A6704652436FDB3E0984A2EC5F27
 CustomProperties Pin (PinId=BAB10488436AA54CD0673BA6C314EAAB,PinName="A",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",LinkedTo=(MaterialGraphNode_160 7E3C1D4548CD6CFF2D1A848DBA6A9BF4,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=A83487EE46DD0FF217BD65BAC6AEF725,PinName="B",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="1.0",LinkedTo=(MaterialGraphNode_159 D9727FFF4D86B802E831A7B4602A9F1E,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=B90904824DEC36F21F4766A1183D441B,PinName="Alpha",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.5",LinkedTo=(MaterialGraphNode_181 CBEEB4D64642EDE96C07B7A3295F817B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=92DAFED344734EA50A5E0D925A7B555A,PinName="Output",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_156 29D8B8F042169A4216380BBC5569CAAA,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode_Knot Name="MaterialGraphNode_Knot_29" ExportPath="/Script/UnrealEd.MaterialGraphNode_Knot'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Knot_29'"
 Begin Object Class=/Script/Engine.MaterialExpressionReroute Name="MaterialExpressionReroute_21" ExportPath="/Script/Engine.MaterialExpressionReroute'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Knot_29.MaterialExpressionReroute_21'"
 End Object
 Begin Object Name="MaterialExpressionReroute_21" ExportPath="/Script/Engine.MaterialExpressionReroute'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Knot_29.MaterialExpressionReroute_21'"
 Input=(Expression="/Script/Engine.MaterialExpressionComponentMask'MaterialGraphNode_160.MaterialExpressionComponentMask_2'")
 MaterialExpressionEditorX=-1296
 MaterialExpressionEditorY=368
 MaterialExpressionGuid=E3537CA84AB375D47D0514B39AC46D37
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionReroute'MaterialExpressionReroute_21'"
 NodePosX=-1296
 NodePosY=368
 bCanRenameNode=False
 NodeGuid=59EA0F894DAD192392AD5ABA1D381998
 CustomProperties Pin (PinId=280E468343E148A14D0E84989ED9D3B0,PinName="InputPin",PinType.PinCategory="wildcard",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_160 7E3C1D4548CD6CFF2D1A848DBA6A9BF4,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F00A06724847D446C715A19AB6B1D08B,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="wildcard",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_Knot_30 217E8D5E446E51E44FBCEE848E3059C4,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_187" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_187'"
 Begin Object Class=/Script/Engine.MaterialExpressionMultiply Name="MaterialExpressionMultiply_3" ExportPath="/Script/Engine.MaterialExpressionMultiply'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_187.MaterialExpressionMultiply_3'"
 End Object
 Begin Object Name="MaterialExpressionMultiply_3" ExportPath="/Script/Engine.MaterialExpressionMultiply'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_187.MaterialExpressionMultiply_3'"
 A=(Expression="/Script/Engine.MaterialExpressionAppendVector'MaterialGraphNode_158.MaterialExpressionAppendVector_0'")
 B=(Expression="/Script/Engine.MaterialExpressionLinearInterpolate'MaterialGraphNode_188.MaterialExpressionLinearInterpolate_2'")
 MaterialExpressionEditorX=-2176
 MaterialExpressionEditorY=592
 MaterialExpressionGuid=5864B2E946FFCD8EAC0F0998EBD1E69A
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionMultiply'MaterialExpressionMultiply_3'"
 NodePosX=-2176
 NodePosY=592
 NodeGuid=48919C7D4FAFC89F9C66568A309C02C7
 CustomProperties Pin (PinId=5E86F3E840C6B7537EA8F58EB0F6AFC7,PinName="A",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",LinkedTo=(MaterialGraphNode_158 3242EB564BC7F9394A959091FBAFA3F2,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=91240DE840CACCB55896A28A907C085C,PinName="B",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="1.0",LinkedTo=(MaterialGraphNode_188 720B030E476F99599CC12883DAE90BE9,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=1AD43305428323E6DDEB6FBE21DB8865,PinName="Output",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_153 F6B260D64DAE1ED2B698D298B8DFD74C,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_188" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_188'"
 Begin Object Class=/Script/Engine.MaterialExpressionLinearInterpolate Name="MaterialExpressionLinearInterpolate_2" ExportPath="/Script/Engine.MaterialExpressionLinearInterpolate'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_188.MaterialExpressionLinearInterpolate_2'"
 End Object
 Begin Object Name="MaterialExpressionLinearInterpolate_2" ExportPath="/Script/Engine.MaterialExpressionLinearInterpolate'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_188.MaterialExpressionLinearInterpolate_2'"
 Alpha=(Expression="/Script/Engine.MaterialExpressionScalarParameter'MaterialGraphNode_189.MaterialExpressionScalarParameter_0'")
 ConstA=0.100000
 ConstB=0.750000
 MaterialExpressionEditorX=-2336
 MaterialExpressionEditorY=784
 MaterialExpressionGuid=5276B2FA406A696E86C0E4B2353A7F43
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionLinearInterpolate'MaterialExpressionLinearInterpolate_2'"
 NodePosX=-2336
 NodePosY=784
 NodeGuid=77FB3EE0444A7741E59FA3B68D12797C
 CustomProperties Pin (PinId=543457C542F902492EABABB9AEF4A554,PinName="A",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.1",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D702B12D468F192993EE48818460F486,PinName="B",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.75",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=CD9C37794D48A4DF782454BB8FF0F8D5,PinName="Alpha",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.5",LinkedTo=(MaterialGraphNode_189 58D47C844D40C2E4A380E6AD2215A569,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=720B030E476F99599CC12883DAE90BE9,PinName="Output",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_187 91240DE840CACCB55896A28A907C085C,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode Name="MaterialGraphNode_189" ExportPath="/Script/UnrealEd.MaterialGraphNode'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_189'"
 Begin Object Class=/Script/Engine.MaterialExpressionScalarParameter Name="MaterialExpressionScalarParameter_0" ExportPath="/Script/Engine.MaterialExpressionScalarParameter'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_189.MaterialExpressionScalarParameter_0'"
 End Object
 Begin Object Name="MaterialExpressionScalarParameter_0" ExportPath="/Script/Engine.MaterialExpressionScalarParameter'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_189.MaterialExpressionScalarParameter_0'"
 DefaultValue=1.000000
 ParameterName="Damage Amount"
 ExpressionGUID=B6ECDCC64D557280E6F574BD067E5B9A
 MaterialExpressionEditorX=-2576
 MaterialExpressionEditorY=832
 MaterialExpressionGuid=C8194824493C8150461B7A9CFE4FA7FC
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionScalarParameter'MaterialExpressionScalarParameter_0'"
 NodePosX=-2576
 NodePosY=832
 bCanRenameNode=True
 NodeGuid=29398B5A4787072608B00B8DB9E9FEF3
 CustomProperties Pin (PinId=0AE6856142E5DB7B68F585BD518B2891,PinName="Default Value",PinType.PinCategory="optional",PinType.PinSubCategory="red",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="1.0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=True,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=58D47C844D40C2E4A380E6AD2215A569,PinName="Output",PinFriendlyName=NSLOCTEXT("MaterialGraphNode", "Space", " "),Direction="EGPD_Output",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_188 CD9C37794D48A4DF782454BB8FF0F8D5,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode_Comment Name="MaterialGraphNode_Comment_24" ExportPath="/Script/UnrealEd.MaterialGraphNode_Comment'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Comment_24'"
 Begin Object Class=/Script/Engine.MaterialExpressionComment Name="MaterialExpressionComment_0" ExportPath="/Script/Engine.MaterialExpressionComment'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Comment_24.MaterialExpressionComment_0'"
 End Object
 Begin Object Name="MaterialExpressionComment_0" ExportPath="/Script/Engine.MaterialExpressionComment'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Comment_24.MaterialExpressionComment_0'"
 SizeX=1080
 SizeY=323
 Text="Damage pulse amount and speed"
 MaterialExpressionEditorX=-2640
 MaterialExpressionEditorY=-544
 MaterialExpressionGuid=13D88290484295558BFEDCBCC7810436
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpressionComment="/Script/Engine.MaterialExpressionComment'MaterialExpressionComment_0'"
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=-2640
 NodePosY=-544
 NodeWidth=1080
 NodeHeight=323
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Damage pulse amount and speed"
 NodeGuid=054221824CCB3B04D209C0BC2602BF2B
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode_Comment Name="MaterialGraphNode_Comment_25" ExportPath="/Script/UnrealEd.MaterialGraphNode_Comment'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Comment_25'"
 Begin Object Class=/Script/Engine.MaterialExpressionComment Name="MaterialExpressionComment_1" ExportPath="/Script/Engine.MaterialExpressionComment'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Comment_25.MaterialExpressionComment_1'"
 End Object
 Begin Object Name="MaterialExpressionComment_1" ExportPath="/Script/Engine.MaterialExpressionComment'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Comment_25.MaterialExpressionComment_1'"
 SizeX=721
 SizeY=362
 Text="Lerp pulse and color"
 MaterialExpressionEditorX=-1696
 MaterialExpressionEditorY=-208
 MaterialExpressionGuid=44E81F7D4D8D98607062DF97360A3AFD
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpressionComment="/Script/Engine.MaterialExpressionComment'MaterialExpressionComment_1'"
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=-1696
 NodePosY=-208
 NodeWidth=721
 NodeHeight=362
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Lerp pulse and color"
 NodeGuid=1845CCC9426925741A6A66B81918B852
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode_Comment Name="MaterialGraphNode_Comment_26" ExportPath="/Script/UnrealEd.MaterialGraphNode_Comment'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Comment_26'"
 Begin Object Class=/Script/Engine.MaterialExpressionComment Name="MaterialExpressionComment_2" ExportPath="/Script/Engine.MaterialExpressionComment'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Comment_26.MaterialExpressionComment_2'"
 End Object
 Begin Object Name="MaterialExpressionComment_2" ExportPath="/Script/Engine.MaterialExpressionComment'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Comment_26.MaterialExpressionComment_2'"
 SizeX=417
 SizeY=307
 Text="Control effect size with Damage Amount"
 MaterialExpressionEditorX=-704
 MaterialExpressionEditorY=80
 MaterialExpressionGuid=E4B1CC414B5F36C0719EFEA6C9EB708E
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpressionComment="/Script/Engine.MaterialExpressionComment'MaterialExpressionComment_2'"
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=-704
 NodePosY=80
 NodeWidth=417
 NodeHeight=307
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Control effect size with Damage Amount"
 NodeGuid=240B8A4C4EB4543C4FDF8DA554638C0F
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode_Comment Name="MaterialGraphNode_Comment_27" ExportPath="/Script/UnrealEd.MaterialGraphNode_Comment'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Comment_27'"
 Begin Object Class=/Script/Engine.MaterialExpressionComment Name="MaterialExpressionComment_4" ExportPath="/Script/Engine.MaterialExpressionComment'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Comment_27.MaterialExpressionComment_4'"
 End Object
 Begin Object Name="MaterialExpressionComment_4" ExportPath="/Script/Engine.MaterialExpressionComment'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Comment_27.MaterialExpressionComment_4'"
 SizeX=960
 SizeY=544
 Text="Damage mask"
 MaterialExpressionEditorX=-2688
 MaterialExpressionEditorY=400
 MaterialExpressionGuid=C581CBDB4EDE6458522AFB8F838F4C78
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpressionComment="/Script/Engine.MaterialExpressionComment'MaterialExpressionComment_4'"
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=-2688
 NodePosY=400
 NodeWidth=960
 NodeHeight=544
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Damage mask"
 NodeGuid=5C5D8CAF4C3CCCEC256013AF529E0A65
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode_Comment Name="MaterialGraphNode_Comment_28" ExportPath="/Script/UnrealEd.MaterialGraphNode_Comment'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Comment_28'"
 Begin Object Class=/Script/Engine.MaterialExpressionComment Name="MaterialExpressionComment_5" ExportPath="/Script/Engine.MaterialExpressionComment'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Comment_28.MaterialExpressionComment_5'"
 End Object
 Begin Object Name="MaterialExpressionComment_5" ExportPath="/Script/Engine.MaterialExpressionComment'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Comment_28.MaterialExpressionComment_5'"
 SizeX=1455
 SizeY=356
 Text="Noise in damage mask"
 MaterialExpressionEditorX=-2304
 MaterialExpressionEditorY=960
 MaterialExpressionGuid=1BB8BC23454862BF9C38B497029B87C2
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpressionComment="/Script/Engine.MaterialExpressionComment'MaterialExpressionComment_5'"
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=-2304
 NodePosY=960
 NodeWidth=1455
 NodeHeight=356
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Noise in damage mask"
 NodeGuid=BA59A46B450080C158FED48ABBDC22A1
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode_Comment Name="MaterialGraphNode_Comment_29" ExportPath="/Script/UnrealEd.MaterialGraphNode_Comment'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Comment_29'"
 Begin Object Class=/Script/Engine.MaterialExpressionComment Name="MaterialExpressionComment_6" ExportPath="/Script/Engine.MaterialExpressionComment'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Comment_29.MaterialExpressionComment_6'"
 End Object
 Begin Object Name="MaterialExpressionComment_6" ExportPath="/Script/Engine.MaterialExpressionComment'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Comment_29.MaterialExpressionComment_6'"
 SizeX=880
 SizeY=448
 Text="Gets the brightest spots of the mask"
 MaterialExpressionEditorX=-1712
 MaterialExpressionEditorY=416
 MaterialExpressionGuid=C1272FC943B20822221E17B7EDA6A895
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpressionComment="/Script/Engine.MaterialExpressionComment'MaterialExpressionComment_6'"
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=-1712
 NodePosY=416
 NodeWidth=880
 NodeHeight=448
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Gets the brightest spots of the mask"
 NodeGuid=FF840C304B8A8315D155D1B194CCFE24
End Object
Begin Object Class=/Script/UnrealEd.MaterialGraphNode_Knot Name="MaterialGraphNode_Knot_30" ExportPath="/Script/UnrealEd.MaterialGraphNode_Knot'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Knot_30'"
 Begin Object Class=/Script/Engine.MaterialExpressionReroute Name="MaterialExpressionReroute_3" ExportPath="/Script/Engine.MaterialExpressionReroute'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Knot_30.MaterialExpressionReroute_3'"
 End Object
 Begin Object Name="MaterialExpressionReroute_3" ExportPath="/Script/Engine.MaterialExpressionReroute'/Engine/Transient.NewMaterial:MaterialGraph_0.MaterialGraphNode_Knot_30.MaterialExpressionReroute_3'"
 Input=(Expression="/Script/Engine.MaterialExpressionReroute'MaterialGraphNode_Knot_29.MaterialExpressionReroute_21'")
 MaterialExpressionEditorX=-800
 MaterialExpressionEditorY=368
 MaterialExpressionGuid=130244634609352DE64E2BB7C7BB53AA
 Material="/Script/UnrealEd.PreviewMaterial'/Engine/Transient.NewMaterial'"
 End Object
 MaterialExpression="/Script/Engine.MaterialExpressionReroute'MaterialExpressionReroute_3'"
 NodePosX=-800
 NodePosY=368
 bCanRenameNode=False
 NodeGuid=C054BE124A9251C47983D9BF7464AD39
 CustomProperties Pin (PinId=217E8D5E446E51E44FBCEE848E3059C4,PinName="InputPin",PinType.PinCategory="wildcard",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_Knot_29 F00A06724847D446C715A19AB6B1D08B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F919BAD043242F134BD3B99CD9AF42EA,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="wildcard",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(MaterialGraphNode_152 03046325481EBC4D42616597B392B6FD,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object

To copy this snippet into your project, delete any existing nodes in your material graph, click **Copy Full Snippet**, and press **Ctrl + V** in your material. Then, connect the **Lerp (5) **node to the main material node’s **Emissive Color** pin.

## Create a Material Instance to Control the Effect

Now that you have your material, create a Material Instance to control all the parameters you created in the material. You’ll use the exposed parameters in the material instance to define the final look and feel of the damage effect on screen.

To set up a Material Instance to control material parameters, follow these steps:

- In the **Content Browser**, in your **Artist > Materials** folder, right-click the material `M_Screen_Damage` and select **Create Material Instance** from the context menu.
- Name the asset `MI_Screen_Damage` and open it.
- To make the material preview run in real-time and see how changing parameters affects the material, click the yellow stopwatch button above the viewport twice.
- In the **Details **panel, expand the sections in **Parameter Groups** to see all the parameters you’ve exposed in the material. Expand the vector parameters, like **Damage Mask Controls**, to see their individual parameter values.
- Add checkmarks next to all parameters except **Noise Texture** to allow them to be overridden.Removing the checkmark from a parameter after you’ve changed its value uses the original default value set in the parent material.
- While working on your material instance, experiment with the different parameters to see how they affect the damage effect in the preview window. Try different values for **Pulse Amount**, **Noise Falloff**, **Pulse Speed**, and the **Damage Mask Controls** (vector parameter) to see how these change the effect.
- The value for **Damage Amount** is set to 1 by default, so you can see the changes happening to the material in the preview window. However, change this to `0` so that when the game starts, the effect doesn’t appear on screen until the player is damaged. In the next section, you’ll make the player character blueprint control this value.
- **Save **the Material Instance.

Later, when you’re able to test the effect in-game, you can return to the Material Instance and repeat these steps to adjust the effect.

### Set Parameter Values in the Material Instance

This tutorial’s sample level uses the following parameter values. You can use these values or adjust them as desired in your project.

|  |  |  |
| --- | --- | --- |
| Parameter | Default Values | Suggested Values |
| **Global Scalar Parameter Values** |  |  |
| Damage Amount | 0 | 0 |
| Noise Amount | 1.0 | 0.35 |
| Noise Falloff | 1.0 | 0.75 |
| Noise Tiling | 1.0 | 1.1 |
| Pulse Amount | 1.0 | 0.75 |
| Pulse Speed | 0.5 | 0.65 |
| **Global Texture Parameter Values** |  |  |
| Noise Texture | TilingNoise05 | TilingNoise05 |
| **Global Vector Parameter Values** |  |  |
| Damage Color | Hex sRGB: FF0000FF | Hex sRGB: FF0000FF |
| Damage Color: Color Amount | 2.0 | 5.0 |
| Damage Mask Controls: Size X | 1.0 | 0.75 |
| Damage Mask Controls: Size Y | 1.0 | 0.5 |
| Damage Mask Controls: Corner Radius | 0.4 | 2.0 |
| Damage Mask Controls: Sharpness | 0.2 | 2.1 |

### [Optional] Organize and Limit Parameter Values

To make the Material Instance’s parameter values simpler to navigate and use and reduce the chance of extreme values, you can organize parameters in groups and apply value ranges to keep numerical sliders within acceptable or intended values.

For example, **Damage Amount** is used to mirror the health of the player, where 0 is no damage on screen and 1 is full damage on screen, so it makes sense to set up a slider that is within this range since it can’t exceed that range.

In the parent material, select each named parameter and use the **Details **panel to set up each one’s **Group **and **Slider Min **and **Slider Max **range as follows:

|  |  |  |  |
| --- | --- | --- | --- |
| Parameter | Group | Slider Min | Slider Max |
| Damage Amount | Damage | 0 | 1 |
| Pulse Amount | Pulse | 0 | 1 |
| Pulse Speed | Pulse | 0 | 2 |
| Damage Color: Color Amount | Pulse | N/A | N/A |
| Noise Tiling | Noise | -1 | 2 |
| Noise Falloff | Noise | 1 | 5 |
| Noise Amount | Noise | 0.5 | 3 |
| Damage Mask Controls | Noise | N/A | N/A |
| Noise Texture | Noise | N/A | N/A |

In the Material Instance, you can see how this change affects this value in the parameters list. Parameters are organized into new categories depending on their Group. You can drag sliders between their min and max values without exceeding those values. However, you can override the slider’s limits by manually entering a new value.

## Add the Post-Process Material to the Character Blueprint

You now have the post-process material set up and instanced. Next, you’ll set up the character’s blueprint to create and use a **Dynamic Material Instance** (also called a Material Instance Dynamic, or MID). This will use the `MI_Screen_Damage` material instance to read the parameter named Damage Amount in the Blueprint. Using logic you set up in the blueprint graph, you can make material adjustments in real-time based on what’s happening during gameplay by injecting a value into the material instance for Damage Amount.

The character has a Health variable that changes when they are damaged. You’ll use this variable with the material instance to apply the effect to the character's screen as they take more damage and remove the effect as their health regenerates.

### Create a Dynamic Material Instance and Add it to Post-Processing

Your material instance is an asset that you can’t directly modify at runtime. Instead, in the character blueprint, you’ll create a **Dynamic Material Instance**. A Dynamic Material Instance is a runtime version of a material instance, created when the game starts, that you can change while the game is running through its named parameters. Then, you’ll assign the MID to the player’s camera so that it’s displayed on screen when the player takes damage.

To create and save an instance of your material in a variable, follow these steps:

- In the **Content Browser**, go to **Content > AdventureGame > Designer > Blueprints > Characters** and open the `BP_AdventureCharacter` blueprint.
- In the Event Graph, find the group of logic that starts with the **Event BeginPlay** node. Drag this group to an area of the graph with more space so you can add more nodes to this logic.To find an event node in the graph, in the My Blueprint panel, expand the **EventGraph **list, and double-click **Event BeginPlay**. The graph view focuses on that node.
- After the **Set Default Movement Speed **node, drag off the execution (**exec**) pin and add a **Create Dynamic Material Instance** node.
- On this **Create Dynamic Material Instance** node, set the Parent to `MI_ScreenDamage`. This is the material instance you created earlier that you’ll use to control the damage effect on the screen.
- Right-click the node’s **Return Value** pin and select **Promote to Variable**.
- In the **My Blueprint** panel, in the **Variables **list, rename **NewVar **to `MID Damage`.

Now, the **Create Dynamic Material Instance** node creates a runtime version of `MI_Screen_Damage `and saves it in the new variable, making it available to reference elsewhere in your graph.

To assign the material instance to the camera’s post-processing pass, follow these steps:

- In the **Components **panel, drag the **FirstPersonCamera **component onto the graph. This creates a reference to the player camera.
- Drag off its output and create a** Set Post Process Settings** node.
- Connect the two **Set **nodes’ **exec **pins.
- Drag off the Set Post Process Settings node’s Post Process Settings input and add a Make Post Process Settings node.
- Select the Make Post Process Settings node. In the Details panel, in the Rendering Features category, add a check mark next to Post Process Materials to add that pin to the Make Post Process Settings node.
- In the node, right-click the **Post Process Materials** input pin and select** Split Struct Pin**. The pin now takes an array as input.
- Drag off the **Post Process Materials Array** pin and add a **Make Array** node.
- Drag off the **Make Array **node’s **[0]** input and add a **Make Weighted Blendable** node.
- On the **Make Weighted Blendable** node, change **Weight **to `1`.
- Drag off the **Set MID Damage** node’s output (blue) pin and connect it to the **Make Weighted Blendable **node’s **Object **input. A **Set** node’s output pin gives a reference to that variable.
- Select the nodes you’ve added in the graph and press **C** to create a comment box around them. Label it `Create Dynamic Material Instance for Post-Process Effect and assign to Player Camera`.
- **Compile **and **Save **the blueprint.

This logic creates the Dynamic Material Instance when the game starts and applies it to the first-person camera of this blueprint.

The new section of the player’s **Event BeginPlay** logic looks like this:

Here's a snippet of the highlighted section above that you can copy into the event graph instead of building the logic yourself:

 Blueprint

Begin Object Class=/Script/BlueprintGraph.K2Node_CallMaterialParameterCollectionFunction Name="K2Node_CallMaterialParameterCollectionFunction_0" ExportPath="/Script/BlueprintGraph.K2Node_CallMaterialParameterCollectionFunction'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_CallMaterialParameterCollectionFunction_0'"
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetMaterialLibrary'",MemberName="CreateDynamicMaterialInstance")
 NodePosX=3167
 NodePosY=559
 NodeGuid=6A5581874335845CA5FA9B8DDB7BE00E
 CustomProperties Pin (PinId=4BCAD4B1430801DF2F297C8890051DB7,PinName="execute",PinToolTip="\nExec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_5 EFC44D1042265C53429B55AC20571D69,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=3FE53E074090504E81D58CACAB49C08C,PinName="then",PinToolTip="\nExec",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_10 B7385A6844ABAC4C5A9A649041989824,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=17122CCA4FC25AD692C559A5390BA60A,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nKismet Material Library Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.KismetMaterialLibrary'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__KismetMaterialLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=929B2A3E4A9F710BA3044C90C6C043EA,PinName="WorldContextObject",PinToolTip="World Context Object\nObject Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/CoreUObject.Object'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=7A4C5E414267DB1AC5F937998195287E,PinName="Parent",PinToolTip="Parent\nMaterial Interface Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.MaterialInterface'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Game/AdventureGame/Artist/Materials/MI_Screen_Damage.MI_Screen_Damage",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=EF57AAED4EE49D16B45CE1B2F0DDC3CE,PinName="OptionalName",PinToolTip="Optional Name\nName",PinType.PinCategory="name",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="None",AutogeneratedDefaultValue="None",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=8FCE5F31457ADD3A11D7EC9ED78AA105,PinName="CreationFlags",PinToolTip="Creation Flags\nEMIDCreationFlags Enum",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Enum'/Script/Engine.EMIDCreationFlags'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="None",AutogeneratedDefaultValue="None",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=4428E084469B0BD8496CA9B547428A29,PinName="ReturnValue",PinToolTip="Return Value\nMaterial Instance Dynamic Object Reference\n\nCreates a Dynamic Material Instance which you can modify during gameplay.",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.MaterialInstanceDynamic'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_10 717317674860A88316D0FAACCB696637,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableSet Name="K2Node_VariableSet_10" ExportPath="/Script/BlueprintGraph.K2Node_VariableSet'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_VariableSet_10'"
 VariableReference=(MemberName="MID Damage",MemberGuid=395F0EF34561343CB9588897648A2DF4,bSelfContext=True)
 NodePosX=3551
 NodePosY=575
 NodeGuid=72ADFE4D4802BA1554228998DAE7242B
 CustomProperties Pin (PinId=B7385A6844ABAC4C5A9A649041989824,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallMaterialParameterCollectionFunction_0 3FE53E074090504E81D58CACAB49C08C,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=E5749B1C4B30D3CD2625F5B0D12FE114,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_9 763BDDF54B2FEC9C8F107F97451F09DF,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=717317674860A88316D0FAACCB696637,PinName="MID Damage",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.MaterialInstanceDynamic'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallMaterialParameterCollectionFunction_0 4428E084469B0BD8496CA9B547428A29,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=33CB21E441E485C29F026BABDF8F0357,PinName="Output_Get",PinToolTip="Retrieves the value of the variable, can use instead of a separate Get node",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.MaterialInstanceDynamic'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MakeStruct_3 A065B35A4DF661F59BBDE9AB0433FADB,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=EC3E56864F19E29DD764FFA374A3C7A8,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_17" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_VariableGet_17'"
 VariableReference=(MemberName="FirstPersonCamera",bSelfContext=True)
 NodePosX=4415
 NodePosY=751
 NodeGuid=79AD56754320702CC02E2E8BC21413B1
 CustomProperties Pin (PinId=C45FF2E1453EEEEB00697098B82BE892,PinName="FirstPersonCamera",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.CameraComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_9 8B1FCB344E30FDEC86E3448D55B19523,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=37CC27EC4F49367B343C08A46521B45A,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/FirstPerson/Blueprints/BP_FirstPersonCharacter.BP_FirstPersonCharacter_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableSet Name="K2Node_VariableSet_9" ExportPath="/Script/BlueprintGraph.K2Node_VariableSet'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_VariableSet_9'"
 VariableReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.CameraComponent'",MemberName="PostProcessSettings")
 SelfContextInfo=NotSelfContext
 NodePosX=4639
 NodePosY=575
 NodeGuid=7BDEE77A49E245FF1698BE8CF6E49BE0
 CustomProperties Pin (PinId=763BDDF54B2FEC9C8F107F97451F09DF,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_10 E5749B1C4B30D3CD2625F5B0D12FE114,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=B7F58EE4414D485A265D5E871AD73091,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=60CCC76C4A6686341A6ECE8B70C6677E,PinName="PostProcessSettings",PinFriendlyName=NSLOCTEXT("UObjectDisplayNames", "CameraComponent:PostProcessSettings", "Post Process Settings"),PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/Engine.PostProcessSettings'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MakeStruct_0 BF9576FD49C9EBBFC3CEF996D5CCE7DE,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=FDE04924489F9C9D6C557BAECD591951,PinName="Output_Get",PinFriendlyName=NSLOCTEXT("UObjectDisplayNames", "CameraComponent:PostProcessSettings", "Post Process Settings"),PinToolTip="Retrieves the value of the variable, can use instead of a separate Get node",Direction="EGPD_Output",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/Engine.PostProcessSettings'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=8B1FCB344E30FDEC86E3448D55B19523,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.CameraComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_17 C45FF2E1453EEEEB00697098B82BE892,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_MakeStruct Name="K2Node_MakeStruct_0" ExportPath="/Script/BlueprintGraph.K2Node_MakeStruct'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_MakeStruct_0'"
 bMadeAfterOverridePinRemoval=True
 ShowPinForProperties(0)=(PropertyName="bMobileHQGaussian",PropertyFriendlyName="High Quality Gaussian DoF on Mobile",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:bMobileHQGaussian", "Enable HQ Gaussian on high end mobile platforms. (ES3_1)"),CategoryName="Lens|Mobile Depth of Field",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(1)=(PropertyName="BloomMethod",PropertyFriendlyName="Method",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:BloomMethod", "Bloom algorithm"),CategoryName="Lens|Bloom",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(2)=(PropertyName="AutoExposureMethod",PropertyFriendlyName="Metering Mode",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:AutoExposureMethod", "Luminance computation method"),CategoryName="Lens|Exposure",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(3)=(PropertyName="TemperatureType",PropertyFriendlyName="Temperature Type",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:TemperatureType", "Selects the type of temperature calculation.\nWhite Balance uses the Temperature value to control the virtual camera\'s White Balance. This is the default selection.\nColor Temperature uses the Temperature value to adjust the color temperature of the scene, which is the inverse of the White Balance operation."),CategoryName="Color Grading|Temperature",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(4)=(PropertyName="WhiteTemp",PropertyFriendlyName="Temp",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:WhiteTemp", "Controls the color temperature or white balance in degrees Kelvin which the scene considers as white light."),CategoryName="Color Grading|Temperature",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(5)=(PropertyName="WhiteTint",PropertyFriendlyName="Tint",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:WhiteTint", "Controls the color of the scene along the magenta - green axis (orthogonal to the color temperature). This feature is equivalent to color tint in digital cameras."),CategoryName="Color Grading|Temperature",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(6)=(PropertyName="ColorSaturation",PropertyFriendlyName="Saturation",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:ColorSaturation", "Control the intensity of the color(hue) for the entire image.Higher values will result in more vibrant colors."),CategoryName="Color Grading|Global",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(7)=(PropertyName="ColorContrast",PropertyFriendlyName="Contrast",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:ColorContrast", "Control the range of light and dark values in your scene. Lower values will reduce the difference between bright and dark areas while higher values will increase the difference between the bright and dark areas."),CategoryName="Color Grading|Global",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(8)=(PropertyName="ColorGamma",PropertyFriendlyName="Gamma",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:ColorGamma", "Control the luminance curve of the scene. Raising or lowering this value will result brightening or darkening the mid-tones of the entire image."),CategoryName="Color Grading|Global",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(9)=(PropertyName="ColorGain",PropertyFriendlyName="Gain",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:ColorGain", "This value multiplies the colors of the image. Raising or lowering this value will result in brightening or darkening the entire scene."),CategoryName="Color Grading|Global",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(10)=(PropertyName="ColorOffset",PropertyFriendlyName="Offset",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:ColorOffset", "This value is added to the colors of the scene. Raising or lowering this value will result in the image being more or less washed-out."),CategoryName="Color Grading|Global",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(11)=(PropertyName="ColorSaturationShadows",PropertyFriendlyName="Saturation",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:ColorSaturationShadows", "Control the intensity of the colors (hue) in the shadow region of the image. Higher values will result in more vibrant colors."),CategoryName="Color Grading|Shadows",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(12)=(PropertyName="ColorContrastShadows",PropertyFriendlyName="Contrast",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:ColorContrastShadows", "Control the range of light and dark values in your scene. Lower values will reduce the difference between bright and dark areas while higher values will increase the difference between the bright and dark areas."),CategoryName="Color Grading|Shadows",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(13)=(PropertyName="ColorGammaShadows",PropertyFriendlyName="Gamma",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:ColorGammaShadows", "Control the luminance curve of the shadow region. Raising or lowering this value will result brightening or darkening the mid-tones of the shadow region."),CategoryName="Color Grading|Shadows",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(14)=(PropertyName="ColorGainShadows",PropertyFriendlyName="Gain",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:ColorGainShadows", "This value multiplies the colors in the shadow region. Raising or lowering this value will result in brightening or darkening the affected region."),CategoryName="Color Grading|Shadows",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(15)=(PropertyName="ColorOffsetShadows",PropertyFriendlyName="Offset",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:ColorOffsetShadows", "This value is added to the colors in the shadow region. Raising or lowering this value will result in the shadows being more or less washed-out."),CategoryName="Color Grading|Shadows",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(16)=(PropertyName="ColorSaturationMidtones",PropertyFriendlyName="Saturation",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:ColorSaturationMidtones", "Control the intensity of the colors (hue) in the mid-tone region of the image. Higher values will result in more vibrant colors."),CategoryName="Color Grading|Midtones",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(17)=(PropertyName="ColorContrastMidtones",PropertyFriendlyName="Contrast",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:ColorContrastMidtones", "Control the range of light and dark values in the mid-tone region. Lower values will reduce the difference between bright and dark areas while higher values will increase the difference between the bright and dark areas."),CategoryName="Color Grading|Midtones",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(18)=(PropertyName="ColorGammaMidtones",PropertyFriendlyName="Gamma",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:ColorGammaMidtones", "Control the luminance curve of the mid-tone region of the image. Raising or lowering this value will result brightening or darkening the mid-tones of the image."),CategoryName="Color Grading|Midtones",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(19)=(PropertyName="ColorGainMidtones",PropertyFriendlyName="Gain",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:ColorGainMidtones", "This value multiplies the colors in the mid-tone region of the image. Raising or lowering this value will result in brightening or darkening the affected region."),CategoryName="Color Grading|Midtones",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(20)=(PropertyName="ColorOffsetMidtones",PropertyFriendlyName="Offset",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:ColorOffsetMidtones", "This value is added to the colors in the mid-tone region of the image. Raising or lowering this value will result in the mid-tones being more or less washed-out."),CategoryName="Color Grading|Midtones",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(21)=(PropertyName="ColorSaturationHighlights",PropertyFriendlyName="Saturation",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:ColorSaturationHighlights", "Control the intensity of the color (hue) for the highlights region of the image. Higher values will result in more vibrant colors."),CategoryName="Color Grading|Highlights",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(22)=(PropertyName="ColorContrastHighlights",PropertyFriendlyName="Contrast",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:ColorContrastHighlights", "Control the range of light and dark values in the highlights region. Lower values will reduce the difference between bright and dark areas while higher values will increase the difference between the bright and dark areas."),CategoryName="Color Grading|Highlights",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(23)=(PropertyName="ColorGammaHighlights",PropertyFriendlyName="Gamma",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:ColorGammaHighlights", "Control the luminance curve of the highlight region. Raising or lowering this value will result brightening or darkening the mid-tones of the highlight region."),CategoryName="Color Grading|Highlights",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(24)=(PropertyName="ColorGainHighlights",PropertyFriendlyName="Gain",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:ColorGainHighlights", "This value multiplies the colors in the highlight region. Raising or lowering this value will result in brightening or darkening the affected region."),CategoryName="Color Grading|Highlights",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(25)=(PropertyName="ColorOffsetHighlights",PropertyFriendlyName="Offset",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:ColorOffsetHighlights", "This value is added to the colors in the highlight region. Raising or lowering this value will result in the highlights being more or less washed-out."),CategoryName="Color Grading|Highlights",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(26)=(PropertyName="ColorCorrectionHighlightsMin",PropertyFriendlyName="HighlightsMin",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:ColorCorrectionHighlightsMin", "This value sets the lower threshold for what is considered to be the highlight region of the image."),CategoryName="Color Grading|Highlights",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(27)=(PropertyName="ColorCorrectionHighlightsMax",PropertyFriendlyName="HighlightsMax",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:ColorCorrectionHighlightsMax", "This value sets the upper threshold for what is considered to be the highlight region of the image. This value should be larger than HighlightsMin. Default is 1.0, for backwards compatibility"),CategoryName="Color Grading|Highlights",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(28)=(PropertyName="ColorCorrectionShadowsMax",PropertyFriendlyName="ShadowsMax",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:ColorCorrectionShadowsMax", "This value sets the threshold for what is considered to be the shadow region of the image."),CategoryName="Color Grading|Shadows",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(29)=(PropertyName="BlueCorrection",PropertyFriendlyName="Blue Correction",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:BlueCorrection", "Correct for artifacts with \"electric\" blues due to the ACEScg color space. Bright blue desaturates instead of going to violet."),CategoryName="Color Grading|Misc",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(30)=(PropertyName="ExpandGamut",PropertyFriendlyName="Expand Gamut",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:ExpandGamut", "Expand bright saturated colors outside the sRGB gamut to fake wide gamut rendering."),CategoryName="Color Grading|Misc",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(31)=(PropertyName="ToneCurveAmount",PropertyFriendlyName="Tone Curve Amount",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:ToneCurveAmount", "Allow effect of Tone Curve to be reduced (Set ToneCurveAmount and ExpandGamut to 0.0 to fully disable tone curve)"),CategoryName="Color Grading|Misc",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(32)=(PropertyName="FilmSlope",PropertyFriendlyName="Slope",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:FilmSlope", "Controls the overall steepness of the tonemapper curve. Larger values increase scene contrast and smaller values reduce contrast."),CategoryName="Film",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(33)=(PropertyName="FilmToe",PropertyFriendlyName="Toe",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:FilmToe", "Controls the contrast of the dark end of the tonemapper curve. Larger values increase contrast and smaller values decrease contrast."),CategoryName="Film",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(34)=(PropertyName="FilmShoulder",PropertyFriendlyName="Shoulder",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:FilmShoulder", "Sometimes referred to as highlight rolloff. Controls the contrast of the bright end of the tonemapper curve. Larger values increase contrast and smaller values decrease contrast."),CategoryName="Film",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(35)=(PropertyName="FilmBlackClip",PropertyFriendlyName="Black clip",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:FilmBlackClip", "Lowers the toe of the tonemapper curve by this amount. Increasing this value causes more of the scene to clip to black. For most purposes, this property should remain 0"),CategoryName="Film",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(36)=(PropertyName="FilmWhiteClip",PropertyFriendlyName="White clip",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:FilmWhiteClip", "Controls the height of the tonemapper curve. Raising this value can cause bright values to more quickly approach fully-saturated white."),CategoryName="Film",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(37)=(PropertyName="SceneColorTint",PropertyFriendlyName="Scene Color Tint",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:SceneColorTint", "Scene tint color"),CategoryName="Color Grading|Misc",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(38)=(PropertyName="SceneFringeIntensity",PropertyFriendlyName="Intensity",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:SceneFringeIntensity", "in percent, Scene chromatic aberration / color fringe (camera imperfection) to simulate an artifact that happens in real-world lens, mostly visible in the image corners."),CategoryName="Lens|Chromatic Aberration",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(39)=(PropertyName="ChromaticAberrationStartOffset",PropertyFriendlyName="Start Offset",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:ChromaticAberrationStartOffset", "A normalized distance to the center of the framebuffer where the effect takes place."),CategoryName="Lens|Chromatic Aberration",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(40)=(PropertyName="BloomIntensity",PropertyFriendlyName="Intensity",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:BloomIntensity", "Multiplier for all bloom contributions >=0: off, 1(default), >1 brighter"),CategoryName="Lens|Bloom",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(41)=(PropertyName="BloomThreshold",PropertyFriendlyName="Threshold",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:BloomThreshold", "minimum brightness the bloom starts having effect\n-1:all pixels affect bloom equally (physically correct, faster as a threshold pass is omitted), 0:all pixels affect bloom brights more, 1(default), >1 brighter"),CategoryName="Lens|Bloom",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(42)=(PropertyName="BloomSizeScale",PropertyFriendlyName="Size scale",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:BloomSizeScale", "Scale for all bloom sizes"),CategoryName="Lens|Bloom",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(43)=(PropertyName="Bloom1Size",PropertyFriendlyName="#1 Size",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:Bloom1Size", "Diameter size for the Bloom1 in percent of the screen width\n(is done in 1/2 resolution, larger values cost more performance, good for high frequency details)\n>=0: can be clamped because of shader limitations"),CategoryName="Lens|Bloom",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(44)=(PropertyName="Bloom2Size",PropertyFriendlyName="#2 Size",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:Bloom2Size", "Diameter size for Bloom2 in percent of the screen width\n(is done in 1/4 resolution, larger values cost more performance)\n>=0: can be clamped because of shader limitations"),CategoryName="Lens|Bloom",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(45)=(PropertyName="Bloom3Size",PropertyFriendlyName="#3 Size",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:Bloom3Size", "Diameter size for Bloom3 in percent of the screen width\n(is done in 1/8 resolution, larger values cost more performance)\n>=0: can be clamped because of shader limitations"),CategoryName="Lens|Bloom",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(46)=(PropertyName="Bloom4Size",PropertyFriendlyName="#4 Size",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:Bloom4Size", "Diameter size for Bloom4 in percent of the screen width\n(is done in 1/16 resolution, larger values cost more performance, best for wide contributions)\n>=0: can be clamped because of shader limitations"),CategoryName="Lens|Bloom",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(47)=(PropertyName="Bloom5Size",PropertyFriendlyName="#5 Size",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:Bloom5Size", "Diameter size for Bloom5 in percent of the screen width\n(is done in 1/32 resolution, larger values cost more performance, best for wide contributions)\n>=0: can be clamped because of shader limitations"),CategoryName="Lens|Bloom",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(48)=(PropertyName="Bloom6Size",PropertyFriendlyName="#6 Size",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:Bloom6Size", "Diameter size for Bloom6 in percent of the screen width\n(is done in 1/64 resolution, larger values cost more performance, best for wide contributions)\n>=0: can be clamped because of shader limitations"),CategoryName="Lens|Bloom",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(49)=(PropertyName="Bloom1Tint",PropertyFriendlyName="#1 Tint",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:Bloom1Tint", "Bloom1 tint color"),CategoryName="Lens|Bloom",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(50)=(PropertyName="Bloom2Tint",PropertyFriendlyName="#2 Tint",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:Bloom2Tint", "Bloom2 tint color"),CategoryName="Lens|Bloom",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(51)=(PropertyName="Bloom3Tint",PropertyFriendlyName="#3 Tint",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:Bloom3Tint", "Bloom3 tint color"),CategoryName="Lens|Bloom",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(52)=(PropertyName="Bloom4Tint",PropertyFriendlyName="#4 Tint",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:Bloom4Tint", "Bloom4 tint color"),CategoryName="Lens|Bloom",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(53)=(PropertyName="Bloom5Tint",PropertyFriendlyName="#5 Tint",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:Bloom5Tint", "Bloom5 tint color"),CategoryName="Lens|Bloom",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(54)=(PropertyName="Bloom6Tint",PropertyFriendlyName="#6 Tint",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:Bloom6Tint", "Bloom6 tint color"),CategoryName="Lens|Bloom",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(55)=(PropertyName="BloomConvolutionScatterDispersion",PropertyFriendlyName="Convolution Scatter Dispersion",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:BloomConvolutionScatterDispersion", "Intensity multiplier on the scatter dispersion energy of the kernel. 1.0 means exactly use the same energy as the kernel scatter dispersion."),CategoryName="Lens|Bloom",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(56)=(PropertyName="BloomConvolutionSize",PropertyFriendlyName="Convolution Scale",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:BloomConvolutionSize", "Relative size of the convolution kernel image compared to the minor axis of the viewport"),CategoryName="Lens|Bloom",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(57)=(PropertyName="BloomConvolutionTexture",PropertyFriendlyName="Convolution Kernel",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:BloomConvolutionTexture", "Texture to replace default convolution bloom kernel"),CategoryName="Lens|Bloom",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(58)=(PropertyName="BloomConvolutionCenterUV",PropertyFriendlyName="Convolution Center",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:BloomConvolutionCenterUV", "The UV location of the center of the kernel. Should be very close to (.5,.5)"),CategoryName="Lens|Bloom",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(59)=(PropertyName="BloomConvolutionPreFilterMin",PropertyFriendlyName="Convolution Boost Min",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:BloomConvolutionPreFilterMin", "Boost intensity of select pixels prior to computing bloom convolution (Min, Max, Multiplier). Max < Min disables"),CategoryName="Lens|Bloom",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(60)=(PropertyName="BloomConvolutionPreFilterMax",PropertyFriendlyName="Convolution Boost Max",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:BloomConvolutionPreFilterMax", "Boost intensity of select pixels prior to computing bloom convolution (Min, Max, Multiplier). Max < Min disables"),CategoryName="Lens|Bloom",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(61)=(PropertyName="BloomConvolutionPreFilterMult",PropertyFriendlyName="Convolution Boost Mult",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:BloomConvolutionPreFilterMult", "Boost intensity of select pixels prior to computing bloom convolution (Min, Max, Multiplier). Max < Min disables"),CategoryName="Lens|Bloom",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(62)=(PropertyName="BloomConvolutionBufferScale",PropertyFriendlyName="Convolution Buffer",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:BloomConvolutionBufferScale", "Implicit buffer region as a fraction of the screen size to insure the bloom does not wrap across the screen. Larger sizes have perf impact."),CategoryName="Lens|Bloom",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(63)=(PropertyName="BloomDirtMask",PropertyFriendlyName="Dirt Mask Texture",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:BloomDirtMask", "Texture that defines the dirt on the camera lens where the light of very bright objects is scattered."),CategoryName="Lens|Dirt Mask",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(64)=(PropertyName="BloomDirtMaskIntensity",PropertyFriendlyName="Dirt Mask Intensity",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:BloomDirtMaskIntensity", "BloomDirtMask intensity"),CategoryName="Lens|Dirt Mask",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(65)=(PropertyName="BloomDirtMaskTint",PropertyFriendlyName="Dirt Mask Tint",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:BloomDirtMaskTint", "BloomDirtMask tint color"),CategoryName="Lens|Dirt Mask",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(66)=(PropertyName="DynamicGlobalIlluminationMethod",PropertyFriendlyName="Method",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:DynamicGlobalIlluminationMethod", "Chooses the Dynamic Global Illumination method. Not compatible with Forward Shading."),CategoryName="Global Illumination",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(67)=(PropertyName="IndirectLightingColor",PropertyFriendlyName="Indirect Lighting Color",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:IndirectLightingColor", "Adjusts indirect lighting color. (1,1,1) is default. (0,0,0) to disable GI. The show flag \'Global Illumination\' must be enabled to use this property."),CategoryName="Global Illumination",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(68)=(PropertyName="IndirectLightingIntensity",PropertyFriendlyName="Indirect Lighting Intensity",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:IndirectLightingIntensity", "Scales the indirect lighting contribution. A value of 0 disables GI. Default is 1. The show flag \'Global Illumination\' must be enabled to use this property."),CategoryName="Global Illumination",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(69)=(PropertyName="LumenRayLightingMode",PropertyFriendlyName="Ray Lighting Mode",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LumenRayLightingMode", "Controls how Lumen rays are lit when Lumen is using Hardware Ray Tracing. By default, Lumen uses the Surface Cache for best performance, but can be set to \'Hit Lighting\' for higher quality."),CategoryName="Global Illumination|Lumen Global Illumination",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(70)=(PropertyName="LumenSceneLightingQuality",PropertyFriendlyName="Lumen Scene Lighting Quality",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LumenSceneLightingQuality", "Scales Lumen Scene\'s quality. Larger scales cause Lumen Scene to be calculated with a higher fidelity, which can be visible in reflections, but increase GPU cost."),CategoryName="Global Illumination|Lumen Global Illumination",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(71)=(PropertyName="LumenSceneDetail",PropertyFriendlyName="Lumen Scene Detail",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LumenSceneDetail", "Controls the size of instances that can be represented in Lumen Scene. Larger values will ensure small objects are represented, but increase GPU cost."),CategoryName="Global Illumination|Lumen Global Illumination",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(72)=(PropertyName="LumenSceneViewDistance",PropertyFriendlyName="Lumen Scene View Distance",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LumenSceneViewDistance", "Sets the maximum view distance of the scene that Lumen maintains for ray tracing against. Larger values will increase the effective range of sky shadowing and Global Illumination, but increase GPU cost."),CategoryName="Global Illumination|Lumen Global Illumination",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(73)=(PropertyName="LumenSceneLightingUpdateSpeed",PropertyFriendlyName="Lumen Scene Lighting Update Speed",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LumenSceneLightingUpdateSpeed", "Controls how much Lumen Scene is allowed to cache lighting results to improve performance. Larger scales cause lighting changes to propagate faster, but increase GPU cost."),CategoryName="Global Illumination|Lumen Global Illumination",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(74)=(PropertyName="LumenFinalGatherQuality",PropertyFriendlyName="Final Gather Quality",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LumenFinalGatherQuality", "Scales Lumen\'s Final Gather quality. Larger scales reduce noise, but greatly increase GPU cost."),CategoryName="Global Illumination|Lumen Global Illumination",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(75)=(PropertyName="LumenFinalGatherLightingUpdateSpeed",PropertyFriendlyName="Final Gather Lighting Update Speed",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LumenFinalGatherLightingUpdateSpeed", "Controls how much Lumen Final Gather is allowed to cache lighting results to improve performance. Larger scales cause lighting changes to propagate faster, but increase GPU cost and noise."),CategoryName="Global Illumination|Lumen Global Illumination",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(76)=(PropertyName="LumenFinalGatherScreenTraces",PropertyFriendlyName="Screen Traces",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LumenFinalGatherScreenTraces", "Whether to use screen space traces for Lumen Global Illumination. Screen space traces bypass Lumen Scene and instead sample Scene Depth and Scene Color. This improves quality, as it bypasses Lumen Scene, but causes view dependent lighting."),CategoryName="Global Illumination|Lumen Global Illumination",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(77)=(PropertyName="LumenMaxTraceDistance",PropertyFriendlyName="Max Trace Distance",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LumenMaxTraceDistance", "Controls the maximum distance that Lumen should trace while solving lighting. Values that are too small will cause lighting to leak into large caves, while values that are large will increase GPU cost."),CategoryName="Global Illumination|Lumen Global Illumination",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(78)=(PropertyName="LumenDiffuseColorBoost",PropertyFriendlyName="Diffuse Color Boost",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LumenDiffuseColorBoost", "Allows brightening indirect lighting by calculating material diffuse color for indirect lighting. Values above 1 (original diffuse color) aren\'t physically correct, but they can be useful as an art direction knob to increase the amount of bounced light in the scene. Best to keep below 2 as it also causes reflections to be brighter than the scene."),CategoryName="Global Illumination|Lumen Global Illumination",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(79)=(PropertyName="LumenSkylightLeaking",PropertyFriendlyName="Skylight Leaking",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LumenSkylightLeaking", "Controls what fraction of the skylight intensity should be allowed to leak. This can be useful as an art direction knob (non-physically based) to keep indoor areas from going fully black."),CategoryName="Global Illumination|Lumen Global Illumination",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(80)=(PropertyName="LumenSkylightLeakingTint",PropertyFriendlyName="Skylight Leaking Tint",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LumenSkylightLeakingTint", "Color tint for Lumen Skylight Leaking."),CategoryName="Global Illumination|Lumen Global Illumination",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(81)=(PropertyName="LumenFullSkylightLeakingDistance",PropertyFriendlyName="Full Skylight Leaking Distance",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LumenFullSkylightLeakingDistance", "Controls the distance from a receiving surface where skylight leaking reaches its full intensity. Smaller values make the skylight leaking flatter, while larger values create an Ambient Occlusion effect."),CategoryName="Global Illumination|Lumen Global Illumination",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(82)=(PropertyName="LumenSurfaceCacheResolution",PropertyFriendlyName="Scene Capture Cache Resolution Scale",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LumenSurfaceCacheResolution", "Scale factor for Lumen Surface Cache resolution, for Scene Capture. Smaller values save GPU memory, at a cost in quality. Defaults to 0.5 if not overridden."),CategoryName="Global Illumination|Lumen Global Illumination",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(83)=(PropertyName="ReflectionMethod",PropertyFriendlyName="Method",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:ReflectionMethod", "Chooses the Reflection method. Not compatible with Forward Shading."),CategoryName="Reflections",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(84)=(PropertyName="LumenReflectionQuality",PropertyFriendlyName="Quality",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LumenReflectionQuality", "Scales the Reflection quality. Larger scales reduce noise in reflections, but increase GPU cost."),CategoryName="Reflections|Lumen Reflections",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(85)=(PropertyName="LumenReflectionsScreenTraces",PropertyFriendlyName="Screen Traces",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LumenReflectionsScreenTraces", "Whether to use screen space traces for Lumen Reflections. Screen space traces bypass Lumen Scene and instead sample Scene Depth and Scene Color. This improves quality, as it bypasses Lumen Scene, but causes view dependent lighting."),CategoryName="Reflections|Lumen Reflections",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(86)=(PropertyName="LumenFrontLayerTranslucencyReflections",PropertyFriendlyName="High Quality Translucency Reflections",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LumenFrontLayerTranslucencyReflections", "Whether to use high quality mirror reflections on the front layer of translucent surfaces. Other layers will use the lower quality Radiance Cache method that can only produce glossy reflections. Increases GPU cost when enabled."),CategoryName="Reflections|Lumen Reflections",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(87)=(PropertyName="LumenMaxRoughnessToTraceReflections",PropertyFriendlyName="Max Roughness To Trace",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LumenMaxRoughnessToTraceReflections", "Sets the maximum roughness value for which Lumen still traces dedicated reflection rays. Higher values improve reflection quality, but greatly increase GPU cost."),CategoryName="Reflections|Lumen Reflections",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(88)=(PropertyName="LumenMaxReflectionBounces",PropertyFriendlyName="Max Reflection Bounces",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LumenMaxReflectionBounces", "Sets the maximum number of recursive reflection bounces. 1 means a single reflection ray (no secondary reflections in mirrors). Currently only supported by Hardware Ray Tracing with Hit Lighting."),CategoryName="Reflections|Lumen Reflections",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(89)=(PropertyName="LumenMaxRefractionBounces",PropertyFriendlyName="Max Refraction Bounces",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LumenMaxRefractionBounces", "The maximum count of refraction event to trace. When hit lighting is used, Translucent meshes will be traced when LumenMaxRefractionBounces > 0, making the reflection tracing more expenssive."),CategoryName="Reflections|Lumen Reflections",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(90)=(PropertyName="ScreenSpaceReflectionIntensity",PropertyFriendlyName="Intensity",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:ScreenSpaceReflectionIntensity", "Enable/Fade/disable the Screen Space Reflection feature, in percent, avoid numbers between 0 and 1 fo consistency"),CategoryName="Reflections|Screen Space Reflections",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(91)=(PropertyName="ScreenSpaceReflectionQuality",PropertyFriendlyName="Quality",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:ScreenSpaceReflectionQuality", "0=lowest quality..100=maximum quality, only a few quality levels are implemented, no soft transition, 50 is the default for better performance."),CategoryName="Reflections|Screen Space Reflections",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(92)=(PropertyName="ScreenSpaceReflectionMaxRoughness",PropertyFriendlyName="Max Roughness",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:ScreenSpaceReflectionMaxRoughness", "Until what roughness we fade the screen space reflections, 0.8 works well, smaller can run faster"),CategoryName="Reflections|Screen Space Reflections",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(93)=(PropertyName="bMegaLights",PropertyFriendlyName="MegaLights",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:bMegaLights", "Allows forcing MegaLights on or off for this volume, regardless of the project setting for MegaLights.\nMegaLights will stochastically sample lights, which allows many shadow casting lights to be rendered efficiently, with a consistent and low GPU cost.\nWhen MegaLights is enabled, other direct lighting algorithms like Deferred Shading will no longer be used, and other shadowing methods like Ray Traced Shadows, Distance Field Shadows and Shadow Maps will no longer be used.\nMegaLights requires Hardware Ray Tracing and Shader Model 6."),CategoryName="Rendering Features",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(94)=(PropertyName="AmbientCubemapTint",PropertyFriendlyName="Tint",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:AmbientCubemapTint", "AmbientCubemap tint color"),CategoryName="Rendering Features|Ambient Cubemap",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(95)=(PropertyName="AmbientCubemapIntensity",PropertyFriendlyName="Intensity",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:AmbientCubemapIntensity", "To scale the Ambient cubemap brightness\n>=0: off, 1(default), >1 brighter"),CategoryName="Rendering Features|Ambient Cubemap",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(96)=(PropertyName="AmbientCubemap",PropertyFriendlyName="Cubemap Texture",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:AmbientCubemap", "The Ambient cubemap (Affects diffuse and specular shading), blends additively which if different from all other settings here"),CategoryName="Rendering Features|Ambient Cubemap",bCanToggleVisibility=True)
 ShowPinForProperties(97)=(PropertyName="CameraShutterSpeed",PropertyFriendlyName="Shutter Speed (1/s)",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:CameraShutterSpeed", "The camera shutter in 1/seconds."),CategoryName="Lens|Camera",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(98)=(PropertyName="CameraISO",PropertyFriendlyName="ISO",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:CameraISO", "The camera sensor sensitivity"),CategoryName="Lens|Camera",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(99)=(PropertyName="DepthOfFieldFstop",PropertyFriendlyName="Aperture (F-stop)",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:DepthOfFieldFstop", "Defines the opening of the camera lens, Aperture is 1/fstop, typical lens go down to f/1.2 (large opening), larger numbers reduce the DOF effect"),CategoryName="Lens|Camera",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(100)=(PropertyName="DepthOfFieldMinFstop",PropertyFriendlyName="Maximum Aperture (min F-stop)",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:DepthOfFieldMinFstop", "Defines the maximum opening of the camera lens to control the curvature of blades of the diaphragm. Set it to 0 to get straight blades."),CategoryName="Lens|Camera",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(101)=(PropertyName="DepthOfFieldBladeCount",PropertyFriendlyName="Number of diaphragm blades",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:DepthOfFieldBladeCount", "Defines the number of blades of the diaphragm within the lens (between 4 and 16)."),CategoryName="Lens|Camera",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(102)=(PropertyName="AutoExposureBias",PropertyFriendlyName="Exposure Compensation",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:AutoExposureBias", "Logarithmic adjustment for the exposure. Only used if a tonemapper is specified.\n0: no adjustment, -1:2x darker, -2:4x darker, 1:2x brighter, 2:4x brighter, ..."),CategoryName="Lens|Exposure",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(103)=(PropertyName="AutoExposureApplyPhysicalCameraExposure",PropertyFriendlyName="Apply Physical Camera Exposure",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:AutoExposureApplyPhysicalCameraExposure", "Only affects Manual exposure mode."),CategoryName="Lens|Exposure",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(104)=(PropertyName="AutoExposureBiasCurve",PropertyFriendlyName="Exposure Compensation Curve",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:AutoExposureBiasCurve", "Exposure compensation based on the scene EV100.\nUsed to calibrate the final exposure differently depending on the average scene luminance.\n0: no adjustment, -1:2x darker, -2:4x darker, 1:2x brighter, 2:4x brighter, ..."),CategoryName="Lens|Exposure",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(105)=(PropertyName="AutoExposureMeterMask",PropertyFriendlyName="Exposure Metering Mask",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:AutoExposureMeterMask", "Exposure metering mask. Bright spots on the mask will have high influence on auto-exposure metering\nand dark spots will have low influence."),CategoryName="Lens|Exposure",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(106)=(PropertyName="AutoExposureLowPercent",PropertyFriendlyName="Low Percent",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:AutoExposureLowPercent", "The eye adaptation will adapt to a value extracted from the luminance histogram of the scene color.\nThe value is defined as having x percent below this brightness. Higher values give bright spots on the screen more priority\nbut can lead to less stable results. Lower values give the medium and darker values more priority but might cause burn out of\nbright spots.\n>0, <100, good values are in the range 70 .. 80"),CategoryName="Lens|Exposure",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(107)=(PropertyName="AutoExposureHighPercent",PropertyFriendlyName="High Percent",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:AutoExposureHighPercent", "The eye adaptation will adapt to a value extracted from the luminance histogram of the scene color.\nThe value is defined as having x percent below this brightness. Higher values give bright spots on the screen more priority\nbut can lead to less stable results. Lower values give the medium and darker values more priority but might cause burn out of\nbright spots.\n>0, <100, good values are in the range 80 .. 95"),CategoryName="Lens|Exposure",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(108)=(PropertyName="AutoExposureMinBrightness",PropertyFriendlyName="Min Brightness",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:AutoExposureMinBrightness", "Auto-Exposure minimum adaptation. Eye Adaptation is disabled if Min = Max.\nAuto-exposure is implemented by choosing an exposure value for which the average luminance generates a pixel brightness equal to the Constant Calibration value.\nThe Min/Max are expressed in pixel luminance (cd/m2) or in EV100 when using ExtendDefaultLuminanceRange (see project settings)."),CategoryName="Lens|Exposure",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(109)=(PropertyName="AutoExposureMaxBrightness",PropertyFriendlyName="Max Brightness",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:AutoExposureMaxBrightness", "Auto-Exposure maximum adaptation. Eye Adaptation is disabled if Min = Max.\nAuto-exposure is implemented by choosing an exposure value for which the average luminance generates a pixel brightness equal to the Constant Calibration value.\nThe Min/Max are expressed in pixel luminance (cd/m2) or in EV100 when using ExtendDefaultLuminanceRange (see project settings)."),CategoryName="Lens|Exposure",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(110)=(PropertyName="AutoExposureSpeedUp",PropertyFriendlyName="Speed Up",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:AutoExposureSpeedUp", "In F-stops per second, should be >0"),CategoryName="Lens|Exposure",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(111)=(PropertyName="AutoExposureSpeedDown",PropertyFriendlyName="Speed Down",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:AutoExposureSpeedDown", "In F-stops per second, should be >0"),CategoryName="Lens|Exposure",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(112)=(PropertyName="HistogramLogMin",PropertyFriendlyName="Histogram Log Min",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:HistogramLogMin", "Histogram Min value. Expressed in Log2(Luminance) or in EV100 when using ExtendDefaultLuminanceRange (see project settings)"),CategoryName="Lens|Exposure",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(113)=(PropertyName="HistogramLogMax",PropertyFriendlyName="Histogram Log Max",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:HistogramLogMax", "Histogram Max value. Expressed in Log2(Luminance) or in EV100 when using ExtendDefaultLuminanceRange (see project settings)"),CategoryName="Lens|Exposure",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(114)=(PropertyName="LocalExposureMethod",PropertyFriendlyName="Method",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LocalExposureMethod", "Local Exposure algorithm"),CategoryName="Lens|Local Exposure",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(115)=(PropertyName="LocalExposureHighlightContrastScale",PropertyFriendlyName="Highlight Contrast",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LocalExposureHighlightContrastScale", "Local Exposure decomposes luminance of the frame into a base layer and a detail layer.\nContrast of the base layer is reduced based on this value.\nValue less than 1 will enable local exposure.\nGood values are usually in the range 0.6 .. 1.0."),CategoryName="Lens|Local Exposure",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(116)=(PropertyName="LocalExposureShadowContrastScale",PropertyFriendlyName="Shadow Contrast",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LocalExposureShadowContrastScale", "Local Exposure decomposes luminance of the frame into a base layer and a detail layer.\nContrast of the base layer is reduced based on this value.\nValue less than 1 will enable local exposure.\nGood values are usually in the range 0.6 .. 1.0."),CategoryName="Lens|Local Exposure",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(117)=(PropertyName="LocalExposureHighlightContrastCurve",PropertyFriendlyName="Highlight Contrast Curve",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LocalExposureHighlightContrastCurve", "Local Exposure Highlight Contrast based on the scene EV100.\nUsed to calibrate Local Exposure differently depending on the average scene luminance."),CategoryName="Lens|Local Exposure",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(118)=(PropertyName="LocalExposureShadowContrastCurve",PropertyFriendlyName="Shadow Contrast Curve",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LocalExposureShadowContrastCurve", "Local Exposure Shadow Contrast based on the scene EV100.\nUsed to calibrate Local Exposure differently depending on the average scene luminance."),CategoryName="Lens|Local Exposure",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(119)=(PropertyName="LocalExposureHighlightThreshold",PropertyFriendlyName="Highlight Threshold",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LocalExposureHighlightThreshold", "Threshold used to determine which regions of the screen are considered highlights."),CategoryName="Lens|Local Exposure",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(120)=(PropertyName="LocalExposureShadowThreshold",PropertyFriendlyName="Shadow Threshold",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LocalExposureShadowThreshold", "Threshold used to determine which regions of the screen are considered shadows."),CategoryName="Lens|Local Exposure",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(121)=(PropertyName="LocalExposureDetailStrength",PropertyFriendlyName="Detail Strength",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LocalExposureDetailStrength", "Local Exposure decomposes luminance of the frame into a base layer and a detail layer.\nValue different than 1 will enable local exposure.\nThis value should be set to 1 in most cases."),CategoryName="Lens|Local Exposure",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(122)=(PropertyName="LocalExposureBlurredLuminanceBlend",PropertyFriendlyName="Blurred Luminance Blend",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LocalExposureBlurredLuminanceBlend", "Local Exposure decomposes luminance of the frame into a base layer and a detail layer.\nBlend between bilateral filtered and blurred luminance as the base layer.\nBlurred luminance helps preserve image appearance and specular highlights, and reduce ringing.\nGood values are usually in the range 0.4 .. 0.6"),CategoryName="Lens|Local Exposure",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(123)=(PropertyName="LocalExposureBlurredLuminanceKernelSizePercent",PropertyFriendlyName="Blurred Luminance Kernel Size Percent",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LocalExposureBlurredLuminanceKernelSizePercent", "Kernel size (percentage of screen) used to blur frame luminance."),CategoryName="Lens|Local Exposure",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(124)=(PropertyName="LocalExposureHighlightThresholdStrength",PropertyFriendlyName="Highlight Threshold Strength",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LocalExposureHighlightThresholdStrength", "Strength of the highlight threshold."),CategoryName="Lens|Local Exposure",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(125)=(PropertyName="LocalExposureShadowThresholdStrength",PropertyFriendlyName="Shadow Threshold Strength",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LocalExposureShadowThresholdStrength", "Strength of the shadow threshold."),CategoryName="Lens|Local Exposure",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(126)=(PropertyName="LocalExposureMiddleGreyBias",PropertyFriendlyName="Middle Grey Bias",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LocalExposureMiddleGreyBias", "Logarithmic adjustment for the local exposure middle grey.\n0: no adjustment, -1:2x darker, -2:4x darker, 1:2x brighter, 2:4x brighter, ..."),CategoryName="Lens|Local Exposure",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(127)=(PropertyName="LensFlareIntensity",PropertyFriendlyName="Intensity",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LensFlareIntensity", "Brightness scale of the image cased lens flares (linear)"),CategoryName="Lens|Lens Flares",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(128)=(PropertyName="LensFlareTint",PropertyFriendlyName="Tint",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LensFlareTint", "Tint color for the image based lens flares."),CategoryName="Lens|Lens Flares",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(129)=(PropertyName="LensFlareBokehSize",PropertyFriendlyName="BokehSize",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LensFlareBokehSize", "Size of the Lens Blur (in percent of the view width) that is done with the Bokeh texture (note: performance cost is radius*radius)"),CategoryName="Lens|Lens Flares",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(130)=(PropertyName="LensFlareThreshold",PropertyFriendlyName="Threshold",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LensFlareThreshold", "Minimum brightness the lens flare starts having effect (this should be as high as possible to avoid the performance cost of blurring content that is too dark too see)"),CategoryName="Lens|Lens Flares",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(131)=(PropertyName="LensFlareBokehShape",PropertyFriendlyName="BokehShape",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:LensFlareBokehShape", "Defines the shape of the Bokeh when the image base lens flares are blurred, cannot be blended"),CategoryName="Lens|Lens Flares",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(132)=(PropertyName="VignetteIntensity",PropertyFriendlyName="Vignette Intensity",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:VignetteIntensity", "0..1 0=off/no vignette .. 1=strong vignette"),CategoryName="Lens|Image Effects",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(133)=(PropertyName="Sharpen",PropertyFriendlyName="Sharpen",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:Sharpen", "Controls the strength of image sharpening applied during tonemapping."),CategoryName="Lens|Image Effects",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(134)=(PropertyName="FilmGrainIntensity",PropertyFriendlyName="Film Grain Intensity",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:FilmGrainIntensity", "0..1 Film grain intensity to apply. LinearSceneColor *= lerp(1.0, DecodedFilmGrainTexture, FilmGrainIntensity)"),CategoryName="Film Grain",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(135)=(PropertyName="FilmGrainIntensityShadows",PropertyFriendlyName="Film Grain Intensity Shadows",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:FilmGrainIntensityShadows", "Control over the grain intensity in the regions of the image considered shadow areas."),CategoryName="Film Grain",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(136)=(PropertyName="FilmGrainIntensityMidtones",PropertyFriendlyName="Film Grain Intensity Midtones",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:FilmGrainIntensityMidtones", "Control over the grain intensity in the mid-tone region of the image."),CategoryName="Film Grain",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(137)=(PropertyName="FilmGrainIntensityHighlights",PropertyFriendlyName="Film Grain Intensity Highlights",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:FilmGrainIntensityHighlights", "Control over the grain intensity in the regions of the image considered highlight areas."),CategoryName="Film Grain",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(138)=(PropertyName="FilmGrainShadowsMax",PropertyFriendlyName="Film Grain Shadows Max",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:FilmGrainShadowsMax", "Sets the upper bound used for Film Grain Shadow Intensity."),CategoryName="Film Grain",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(139)=(PropertyName="FilmGrainHighlightsMin",PropertyFriendlyName="Film Grain Highlights Min",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:FilmGrainHighlightsMin", "Sets the lower bound used for Film Grain Highlight Intensity."),CategoryName="Film Grain",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(140)=(PropertyName="FilmGrainHighlightsMax",PropertyFriendlyName="Film Grain Highlights Max",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:FilmGrainHighlightsMax", "Sets the upper bound used for Film Grain Highlight Intensity. This value should be larger than HighlightsMin.. Default is 1.0, for backwards compatibility"),CategoryName="Film Grain",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(141)=(PropertyName="FilmGrainTexelSize",PropertyFriendlyName="Film Grain Texel Size",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:FilmGrainTexelSize", "Controls the size of the film grain. Size of texel of FilmGrainTexture on screen."),CategoryName="Film Grain",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(142)=(PropertyName="FilmGrainTexture",PropertyFriendlyName="Film Grain Texture",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:FilmGrainTexture", "Defines film grain texture to use."),CategoryName="Film Grain",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(143)=(PropertyName="AmbientOcclusionIntensity",PropertyFriendlyName="Intensity",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:AmbientOcclusionIntensity", "0..1 0=off/no ambient occlusion .. 1=strong ambient occlusion, defines how much it affects the non direct lighting after base pass"),CategoryName="Rendering Features|Ambient Occlusion",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(144)=(PropertyName="AmbientOcclusionStaticFraction",PropertyFriendlyName="Static Fraction",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:AmbientOcclusionStaticFraction", "0..1 0=no effect on static lighting .. 1=AO affects the stat lighting, 0 is free meaning no extra rendering pass"),CategoryName="Rendering Features|Ambient Occlusion",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(145)=(PropertyName="AmbientOcclusionRadius",PropertyFriendlyName="Radius",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:AmbientOcclusionRadius", ">0, in unreal units, bigger values means even distant surfaces affect the ambient occlusion"),CategoryName="Rendering Features|Ambient Occlusion",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(146)=(PropertyName="AmbientOcclusionRadiusInWS",PropertyFriendlyName="Radius in WorldSpace",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:AmbientOcclusionRadiusInWS", "true: AO radius is in world space units, false: AO radius is locked the view space in 400 units"),CategoryName="Rendering Features|Ambient Occlusion",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(147)=(PropertyName="AmbientOcclusionFadeDistance",PropertyFriendlyName="Fade Out Distance",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:AmbientOcclusionFadeDistance", ">0, in unreal units, at what distance the AO effect disppears in the distance (avoding artifacts and AO effects on huge object)"),CategoryName="Rendering Features|Ambient Occlusion",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(148)=(PropertyName="AmbientOcclusionFadeRadius",PropertyFriendlyName="Fade Out Radius",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:AmbientOcclusionFadeRadius", ">0, in unreal units, how many units before AmbientOcclusionFadeOutDistance it starts fading out"),CategoryName="Rendering Features|Ambient Occlusion",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(149)=(PropertyName="AmbientOcclusionPower",PropertyFriendlyName="Power",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:AmbientOcclusionPower", ">0, in unreal units, bigger values means even distant surfaces affect the ambient occlusion"),CategoryName="Rendering Features|Ambient Occlusion",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(150)=(PropertyName="AmbientOcclusionBias",PropertyFriendlyName="Bias",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:AmbientOcclusionBias", ">0, in unreal units, default (3.0) works well for flat surfaces but can reduce details"),CategoryName="Rendering Features|Ambient Occlusion",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(151)=(PropertyName="AmbientOcclusionQuality",PropertyFriendlyName="Quality",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:AmbientOcclusionQuality", "0=lowest quality..100=maximum quality, only a few quality levels are implemented, no soft transition"),CategoryName="Rendering Features|Ambient Occlusion",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(152)=(PropertyName="AmbientOcclusionMipBlend",PropertyFriendlyName="Mip Blend",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:AmbientOcclusionMipBlend", "Affects the blend over the multiple mips (lower resolution versions) , 0:fully use full resolution, 1::fully use low resolution, around 0.6 seems to be a good value"),CategoryName="Rendering Features|Ambient Occlusion",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(153)=(PropertyName="AmbientOcclusionMipScale",PropertyFriendlyName="Mip Scale",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:AmbientOcclusionMipScale", "Affects the radius AO radius scale over the multiple mips (lower resolution versions)"),CategoryName="Rendering Features|Ambient Occlusion",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(154)=(PropertyName="AmbientOcclusionMipThreshold",PropertyFriendlyName="Mip Threshold",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:AmbientOcclusionMipThreshold", "to tweak the bilateral upsampling when using multiple mips (lower resolution versions)"),CategoryName="Rendering Features|Ambient Occlusion",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(155)=(PropertyName="AmbientOcclusionTemporalBlendWeight",PropertyFriendlyName="Temporal Blend Weight",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:AmbientOcclusionTemporalBlendWeight", "How much to blend the current frame with previous frames when using GTAO with temporal accumulation"),CategoryName="Rendering Features|Ambient Occlusion",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(156)=(PropertyName="RayTracingAO",PropertyFriendlyName="Enabled",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:RayTracingAO", "Enables ray tracing ambient occlusion."),CategoryName="Rendering Features|Ray Tracing Ambient Occlusion",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(157)=(PropertyName="RayTracingAOSamplesPerPixel",PropertyFriendlyName="Samples Per Pixel",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:RayTracingAOSamplesPerPixel", "Sets the samples per pixel for ray tracing ambient occlusion."),CategoryName="Rendering Features|Ray Tracing Ambient Occlusion",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(158)=(PropertyName="RayTracingAOIntensity",PropertyFriendlyName="Intensity",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:RayTracingAOIntensity", "Scalar factor on the ray-tracing ambient occlusion score."),CategoryName="Rendering Features|Ray Tracing Ambient Occlusion",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(159)=(PropertyName="RayTracingAORadius",PropertyFriendlyName="Radius",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:RayTracingAORadius", "Defines the world-space search radius for occlusion rays."),CategoryName="Rendering Features|Ray Tracing Ambient Occlusion",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(160)=(PropertyName="ColorGradingIntensity",PropertyFriendlyName="Color Grading LUT Intensity",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:ColorGradingIntensity", "Color grading lookup table intensity. 0 = no intensity, 1=full intensity"),CategoryName="Color Grading|Misc",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(161)=(PropertyName="ColorGradingLUT",PropertyFriendlyName="Color Grading LUT",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:ColorGradingLUT", "Look up table texture to use or none of not used"),CategoryName="Color Grading|Misc",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(162)=(PropertyName="DepthOfFieldSensorWidth",PropertyFriendlyName="Sensor Width (mm)",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:DepthOfFieldSensorWidth", "Width of the camera sensor to assume, in mm."),CategoryName="Lens|Depth of Field",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(163)=(PropertyName="DepthOfFieldSqueezeFactor",PropertyFriendlyName="Squeeze Factor",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:DepthOfFieldSqueezeFactor", "This is the squeeze factor for the DOF, which emulates the properties of anamorphic lenses."),CategoryName="Lens|Depth of Field",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(164)=(PropertyName="DepthOfFieldFocalDistance",PropertyFriendlyName="Focal Distance",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:DepthOfFieldFocalDistance", "Distance in which the Depth of Field effect should be sharp, in unreal units (cm)"),CategoryName="Lens|Depth of Field",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(165)=(PropertyName="DepthOfFieldDepthBlurAmount",PropertyFriendlyName="Depth Blur km for 50%",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:DepthOfFieldDepthBlurAmount", "CircleDOF only: Depth blur km for 50%"),CategoryName="Lens|Depth of Field",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(166)=(PropertyName="DepthOfFieldDepthBlurRadius",PropertyFriendlyName="Depth Blur Radius",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:DepthOfFieldDepthBlurRadius", "CircleDOF only: Depth blur radius in pixels at 1920x"),CategoryName="Lens|Depth of Field",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(167)=(PropertyName="DepthOfFieldUseHairDepth",PropertyFriendlyName="Use Hair Depth",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:DepthOfFieldUseHairDepth", "For depth of field to use the hair depth for computing circle of confusion size. Otherwise use an interpolated distance between the hair depth and the scene depth based on the hair coverage (default)."),CategoryName="Lens|Depth of Field",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(168)=(PropertyName="DepthOfFieldPetzvalBokeh",PropertyFriendlyName="Petzval Bokeh",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:DepthOfFieldPetzvalBokeh", "Simulate stretching in blur and bokeh. Positive values for sagittal (swirly bokeh), negative values for tangential."),CategoryName="Lens|Depth of Field",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(169)=(PropertyName="DepthOfFieldPetzvalBokehFalloff",PropertyFriendlyName="Petzval Bokeh Falloff",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:DepthOfFieldPetzvalBokehFalloff", "How quickly does the Petzval bokeh effect increase towards the edge of the image"),CategoryName="Lens|Depth of Field",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(170)=(PropertyName="DepthOfFieldPetzvalExclusionBoxExtents",PropertyFriendlyName="Petzval Bokeh Exclusion Box",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:DepthOfFieldPetzvalExclusionBoxExtents", "Box, centered on screen, around which the Petzval effect is applied."),CategoryName="Lens|Depth of Field",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(171)=(PropertyName="DepthOfFieldPetzvalExclusionBoxRadius",PropertyFriendlyName="Petzval Bokeh Exclusion Box Radius",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:DepthOfFieldPetzvalExclusionBoxRadius", "Corner radius"),CategoryName="Lens|Depth of Field",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(172)=(PropertyName="DepthOfFieldAspectRatioScalar",PropertyFriendlyName="Aspect Ratio Scalar",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:DepthOfFieldAspectRatioScalar", "Amount to scale the output viewport\'s aspect ratio by when computing depth of field properties."),CategoryName="Lens|Depth of Field",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(173)=(PropertyName="DepthOfFieldBarrelRadius",PropertyFriendlyName="Barrel Radius",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:DepthOfFieldBarrelRadius", "The lens barrel creates vignetting and occludes bokeh, i.e. cat\'s eye bokeh"),CategoryName="Lens|Depth of Field",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(174)=(PropertyName="DepthOfFieldBarrelLength",PropertyFriendlyName="Barrel Length",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:DepthOfFieldBarrelLength", "The lens barrel creates vignetting and occludes bokeh, i.e. cat\'s eye bokeh"),CategoryName="Lens|Depth of Field",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(175)=(PropertyName="DepthOfFieldFocalRegion",PropertyFriendlyName="Focal Region",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:DepthOfFieldFocalRegion", "Artificial region where all content is in focus, starting after DepthOfFieldFocalDistance, in unreal units (cm)"),CategoryName="Lens|Mobile Depth of Field",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(176)=(PropertyName="DepthOfFieldNearTransitionRegion",PropertyFriendlyName="Near Transition Region",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:DepthOfFieldNearTransitionRegion", "To define the width of the transition region next to the focal region on the near side (cm)"),CategoryName="Lens|Mobile Depth of Field",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(177)=(PropertyName="DepthOfFieldFarTransitionRegion",PropertyFriendlyName="Far Transition Region",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:DepthOfFieldFarTransitionRegion", "To define the width of the transition region next to the focal region on the near side (cm)"),CategoryName="Lens|Mobile Depth of Field",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(178)=(PropertyName="DepthOfFieldScale",PropertyFriendlyName="Scale",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:DepthOfFieldScale", "SM5: BokehDOF only: To amplify the depth of field effect (like aperture) 0=off\n ES3_1: Used to blend DoF. 0=off"),CategoryName="Lens|Mobile Depth of Field",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(179)=(PropertyName="DepthOfFieldNearBlurSize",PropertyFriendlyName="Near Blur Size",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:DepthOfFieldNearBlurSize", "Gaussian only: Maximum size of the Depth of Field blur (in percent of the view width) (note: performance cost scales with size)"),CategoryName="Lens|Mobile Depth of Field",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(180)=(PropertyName="DepthOfFieldFarBlurSize",PropertyFriendlyName="Far Blur Size",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:DepthOfFieldFarBlurSize", "Gaussian only: Maximum size of the Depth of Field blur (in percent of the view width) (note: performance cost scales with size)"),CategoryName="Lens|Mobile Depth of Field",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(181)=(PropertyName="DepthOfFieldOcclusion",PropertyFriendlyName="Occlusion",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:DepthOfFieldOcclusion", "Occlusion tweak factor 1 (0.18 to get natural occlusion, 0.4 to solve layer color leaking issues)"),CategoryName="Lens|Mobile Depth of Field",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(182)=(PropertyName="DepthOfFieldSkyFocusDistance",PropertyFriendlyName="Sky Distance",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:DepthOfFieldSkyFocusDistance", "Artificial distance to allow the skybox to be in focus (e.g. 200000), <=0 to switch the feature off, only for GaussianDOF, can cost performance"),CategoryName="Lens|Mobile Depth of Field",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(183)=(PropertyName="DepthOfFieldVignetteSize",PropertyFriendlyName="Vignette Size",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:DepthOfFieldVignetteSize", "Artificial circular mask to (near) blur content outside the radius, only for GaussianDOF, diameter in percent of screen width, costs performance if the mask is used, keep Feather can Radius on default to keep it off"),CategoryName="Lens|Mobile Depth of Field",bCanToggleVisibility=True,bHasOverridePin=True,bIsMarkedForAdvancedDisplay=True)
 ShowPinForProperties(184)=(PropertyName="MotionBlurAmount",PropertyFriendlyName="Amount",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:MotionBlurAmount", "Strength of motion blur, 0:off"),CategoryName="Rendering Features|Motion Blur",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(185)=(PropertyName="MotionBlurMax",PropertyFriendlyName="Max",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:MotionBlurMax", "max distortion caused by motion blur, in percent of the screen width, 0:off"),CategoryName="Rendering Features|Motion Blur",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(186)=(PropertyName="MotionBlurTargetFPS",PropertyFriendlyName="Target FPS",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:MotionBlurTargetFPS", "Defines the target FPS for motion blur. Makes motion blur independent of actual frame rate and relative\nto the specified target FPS instead. Higher target FPS results in shorter frames, which means shorter\nshutter times and less motion blur. Lower FPS means more motion blur. A value of zero makes the motion\nblur dependent on the actual frame rate."),CategoryName="Rendering Features|Motion Blur",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(187)=(PropertyName="MotionBlurPerObjectSize",PropertyFriendlyName="Per Object Size",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:MotionBlurPerObjectSize", "The minimum projected screen radius for a primitive to be drawn in the velocity pass, percentage of screen width. smaller numbers cause more draw calls, default: 4%"),CategoryName="Rendering Features|Motion Blur",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(188)=(PropertyName="TranslucencyType",PropertyFriendlyName="Translucency Method",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:TranslucencyType", "Sets the translucency type"),CategoryName="Rendering Features|Translucency",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(189)=(PropertyName="RayTracingTranslucencyMaxRoughness",PropertyFriendlyName="Max Roughness",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:RayTracingTranslucencyMaxRoughness", "Sets the maximum roughness until which ray tracing translucency will be visible (lower value is faster). Translucency contribution is smoothly faded when close to roughness threshold. This parameter behaves similarly to ScreenSpaceReflectionMaxRoughness."),CategoryName="Rendering Features|Translucency",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(190)=(PropertyName="RayTracingTranslucencyRefractionRays",PropertyFriendlyName="Max. Refraction Rays",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:RayTracingTranslucencyRefractionRays", "Sets the maximum number of ray tracing refraction rays."),CategoryName="Rendering Features|Translucency",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(191)=(PropertyName="RayTracingTranslucencySamplesPerPixel",PropertyFriendlyName="Samples Per Pixel",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:RayTracingTranslucencySamplesPerPixel", "Sets the samples per pixel for ray traced translucency."),CategoryName="Rendering Features|Translucency",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(192)=(PropertyName="RayTracingTranslucencyMaxPrimaryHitEvents",PropertyFriendlyName="Max. Primary Hit Events",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:RayTracingTranslucencyMaxPrimaryHitEvents", "Maximum number of hit events allowed on primary ray paths"),CategoryName="Rendering Features|Translucency",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(193)=(PropertyName="RayTracingTranslucencyMaxSecondaryHitEvents",PropertyFriendlyName="Max. Secondary Hit Events",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:RayTracingTranslucencyMaxSecondaryHitEvents", "Maximum number of hit events allowed on secondary ray paths"),CategoryName="Rendering Features|Translucency",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(194)=(PropertyName="RayTracingTranslucencyShadows",PropertyFriendlyName="Shadows",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:RayTracingTranslucencyShadows", "Sets the translucency shadows type."),CategoryName="Rendering Features|Translucency",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(195)=(PropertyName="RayTracingTranslucencyRefraction",PropertyFriendlyName="Refraction",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:RayTracingTranslucencyRefraction", "Sets whether refraction should be enabled or not (if not rays will not scatter and only travel in the same direction as before the intersection event)."),CategoryName="Rendering Features|Translucency",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(196)=(PropertyName="RayTracingTranslucencyUseRayTracedRefraction",PropertyFriendlyName="Use Ray Traced Refraction",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:RayTracingTranslucencyUseRayTracedRefraction", "Whether to use ray traced refraction which currently doesn\'t work well with rough refraction or simulate it using a screen space effect"),CategoryName="Rendering Features|Translucency",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(197)=(PropertyName="PathTracingMaxBounces",PropertyFriendlyName="Max. Bounces",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:PathTracingMaxBounces", "Sets the path tracing maximum bounces"),CategoryName="Path Tracing",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(198)=(PropertyName="PathTracingSamplesPerPixel",PropertyFriendlyName="Samples Per Pixel",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:PathTracingSamplesPerPixel", "Sets the samples per pixel for the path tracer."),CategoryName="Path Tracing",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(199)=(PropertyName="PathTracingMaxPathIntensity",PropertyFriendlyName="Max Path Intensity",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:PathTracingMaxPathIntensity", "Sets the maximum intensity of indirect samples to reduce fireflies. Lowering this value reduces noise at the expense of accuracy. Increasing it is more accurate but may lead to more noise."),CategoryName="Path Tracing",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(200)=(PropertyName="PathTracingEnableEmissiveMaterials",PropertyFriendlyName="Emissive Materials",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:PathTracingEnableEmissiveMaterials", "Should emissive materials contribute to scene lighting?"),CategoryName="Path Tracing",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(201)=(PropertyName="PathTracingEnableReferenceDOF",PropertyFriendlyName="Reference Depth Of Field",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:PathTracingEnableReferenceDOF", "Enables a reference quality depth-of-field which replaces the post-process effect."),CategoryName="Path Tracing",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(202)=(PropertyName="PathTracingEnableReferenceAtmosphere",PropertyFriendlyName="Reference Atmosphere",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:PathTracingEnableReferenceAtmosphere", "Enables path tracing in the atmosphere instead of baking the sky atmosphere contribution into a skylight. Any skylight present in the scene will be automatically ignored when this is enabled."),CategoryName="Path Tracing",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(203)=(PropertyName="PathTracingEnableDenoiser",PropertyFriendlyName="Denoiser",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:PathTracingEnableDenoiser", "Run the currently loaded denoiser plugin on the last sample to remove noise from the output. Has no effect if a plug-in is not loaded."),CategoryName="Path Tracing",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(204)=(PropertyName="PathTracingIncludeEmissive",PropertyFriendlyName="Emissive",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:PathTracingIncludeEmissive", "Should the render include directly visible emissive elements?"),CategoryName="Path Tracing|Lighting Components",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(205)=(PropertyName="PathTracingIncludeDiffuse",PropertyFriendlyName="Diffuse",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:PathTracingIncludeDiffuse", "Should the render include diffuse lighting contributions?"),CategoryName="Path Tracing|Lighting Components",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(206)=(PropertyName="PathTracingIncludeIndirectDiffuse",PropertyFriendlyName="Indirect Diffuse",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:PathTracingIncludeIndirectDiffuse", "Should the render include indirect diffuse lighting contributions?"),CategoryName="Path Tracing|Lighting Components",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(207)=(PropertyName="PathTracingIncludeSpecular",PropertyFriendlyName="Specular",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:PathTracingIncludeSpecular", "Should the render include specular lighting contributions?"),CategoryName="Path Tracing|Lighting Components",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(208)=(PropertyName="PathTracingIncludeIndirectSpecular",PropertyFriendlyName="Indirect Specular",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:PathTracingIncludeIndirectSpecular", "Should the render include indirect specular lighting contributions?"),CategoryName="Path Tracing|Lighting Components",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(209)=(PropertyName="PathTracingIncludeVolume",PropertyFriendlyName="Volume",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:PathTracingIncludeVolume", "Should the render include volume lighting contributions?"),CategoryName="Path Tracing|Lighting Components",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(210)=(PropertyName="PathTracingIncludeIndirectVolume",PropertyFriendlyName="Indirect Volume",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:PathTracingIncludeIndirectVolume", "Should the render include volume lighting contributions?"),CategoryName="Path Tracing|Lighting Components",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(211)=(PropertyName="UserFlags",PropertyFriendlyName="User Flags",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:UserFlags", "Per-view user flags accessible in materials via TestPostVolumeUserFlag node, allowing per-view overrides of material behavior."),CategoryName="Rendering Features",bCanToggleVisibility=True,bHasOverridePin=True)
 ShowPinForProperties(212)=(PropertyName="WeightedBlendables",PropertyFriendlyName="Post Process Materials",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "PostProcessSettings:WeightedBlendables", "Allows custom post process materials to be defined, using a MaterialInstance with the same Material as its parent to allow blending.\nFor materials this needs to be the \"PostProcess\" domain type. This can be used for any UObject object implementing the IBlendableInterface (e.g. could be used to fade weather settings)."),CategoryName="Rendering Features",bShowPin=True,bCanToggleVisibility=True)
 StructType="/Script/CoreUObject.ScriptStruct'/Script/Engine.PostProcessSettings'"
 NodePosX=4223
 NodePosY=639
 AdvancedPinDisplay=Hidden
 NodeGuid=70B1E4D743C679DE3059EC9C3F42B638
 CustomProperties Pin (PinId=BF9576FD49C9EBBFC3CEF996D5CCE7DE,PinName="PostProcessSettings",Direction="EGPD_Output",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/Engine.PostProcessSettings'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_9 60CCC76C4A6686341A6ECE8B70C6677E,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=0ECF281648F4B05A035B93B068611CD8,PinName="WeightedBlendables",PinFriendlyName=INVTEXT("Post Process Materials"),PinToolTip="Post Process Materials\nWeighted Blendables Structure\n\nAllows custom post process materials to be defined, using a MaterialInstance with the same Material as its parent to allow blending.\nFor materials this needs to be the \"PostProcess\" domain type. This can be used for any UObject object implementing the IBlendableInterface (e.g. could be used to fade weather settings).",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/Engine.WeightedBlendables'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="(Array=)",AutogeneratedDefaultValue="(Array=)",SubPins=(K2Node_MakeStruct_0 3F6A213F448AD3E125C27FA0C4A26C31,),PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=3F6A213F448AD3E125C27FA0C4A26C31,PinName="WeightedBlendables_Array",PinFriendlyName=LOCGEN_FORMAT_NAMED(NSLOCTEXT("KismetSchema", "SplitPinFriendlyNameFormat", "{PinDisplayName} {ProtoPinDisplayName}"), "PinDisplayName", INVTEXT("Post Process Materials"), "ProtoPinDisplayName", INVTEXT("Array")),PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/Engine.WeightedBlendable'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MakeArray_0 33DAAD2C4E0B047E51354B9E03AED013,),ParentPin=K2Node_MakeStruct_0 0ECF281648F4B05A035B93B068611CD8,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_MakeArray Name="K2Node_MakeArray_0" ExportPath="/Script/BlueprintGraph.K2Node_MakeArray'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_MakeArray_0'"
 NodePosX=4047
 NodePosY=639
 NodeGuid=2368A5AD445E242E6EC78AA41D28D62B
 CustomProperties Pin (PinId=33DAAD2C4E0B047E51354B9E03AED013,PinName="Array",Direction="EGPD_Output",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/Engine.WeightedBlendable'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MakeStruct_0 3F6A213F448AD3E125C27FA0C4A26C31,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=9CA735B84040C3836059B5814A4CF118,PinName="[0]",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/Engine.WeightedBlendable'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MakeStruct_3 62F290234DE22EB164A4A180D1BD8C1E,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_MakeStruct Name="K2Node_MakeStruct_3" ExportPath="/Script/BlueprintGraph.K2Node_MakeStruct'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_MakeStruct_3'"
 bMadeAfterOverridePinRemoval=True
 ShowPinForProperties(0)=(PropertyName="Weight",PropertyFriendlyName="Weight",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "WeightedBlendable:Weight", "0:no effect .. 1:full effect"),CategoryName="FWeightedBlendable",bShowPin=True,bCanToggleVisibility=True)
 ShowPinForProperties(1)=(PropertyName="Object",PropertyFriendlyName="Object",PropertyTooltip=NSLOCTEXT("UObjectToolTips", "WeightedBlendable:Object", "should be of the IBlendableInterface* type but UProperties cannot express that"),CategoryName="FWeightedBlendable",bShowPin=True,bCanToggleVisibility=True)
 StructType="/Script/CoreUObject.ScriptStruct'/Script/Engine.WeightedBlendable'"
 NodePosX=3759
 NodePosY=639
 NodeGuid=9EF8E6444AAB71414CA1648FCD36DD71
 CustomProperties Pin (PinId=62F290234DE22EB164A4A180D1BD8C1E,PinName="WeightedBlendable",Direction="EGPD_Output",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/Engine.WeightedBlendable'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MakeArray_0 9CA735B84040C3836059B5814A4CF118,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=2BB78A3241229E0573B8FDA4244F3837,PinName="Weight",PinFriendlyName=INVTEXT("Weight"),PinToolTip="Weight\nFloat (single-precision)\n\n0:no effect .. 1:full effect",PinType.PinCategory="real",PinType.PinSubCategory="float",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="1.000000",AutogeneratedDefaultValue="-1.000000",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=A065B35A4DF661F59BBDE9AB0433FADB,PinName="Object",PinFriendlyName=INVTEXT("Object"),PinToolTip="Object\nObject Reference\n\nshould be of the IBlendableInterface* type but UProperties cannot express that",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/CoreUObject.Object'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=True,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_10 33CB21E441E485C29F026BABDF8F0357,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_10" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.EdGraphNode_Comment_10'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=3136
 NodePosY=496
 NodeWidth=1760
 NodeHeight=336
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Create Dynamic Material Instance for Post-Process Effect and assign to Player Camera"
 NodeGuid=A8F23E3D413F308392079E9D6D26BB1B
End Object

 To copy this snippet into your project, click Copy Full Snippet, press Ctrl + V to paste it into BP_AdventureCharacter’s event graph, and then connect the Set Default Movement Speed node’s exec pin to the Create Dynamic Material Instance node.

### Test the Effect In-Game

In the Material Instance (`MI_Screen_Damage`), temporarily change **Damage Amount** to `1`, and click **Save**. When you play the game, you can test the effect without taking damage to dial in the look and feel you want for the effect. With **Damage Amount** set to `1`, the material is turned on continuously. When you’re done testing the material, set the **Damage Amount** back to `0`.

 The in-game result when you set Damage Amount to 1 to continually show without the player having taken damage.

Next, you’ll add the logic to the character blueprint that tells this material instance dynamic to appear when the character receives damage and recede when their health regenerates.

## Hide or Show the Effect With Damage Taken

To make the Dynamic Material Instance effect only appear when the player is damaged, you’ll extend the existing damage-handling logic in the player character.

This new logic needs to:

- Change the material’s **Damage Amount **parameter based on the character’s **Health **variable so that:There is no post-process effect on the screen when **Health **is full.
- There is a post-process effect on the screen that intensifies as Health decreases.

- Restore **Health **to full after the player doesn’t take damage for a period of time, removing the post-process effect.

### Create a Maximum Health Variable

You'll be working with the player's health value, so it's best to save the player's maximum health in a variable that you can reference throughout the damage-effect logic instead of entering a static, hard-coded value of 100. This way, if you decide to give your character more or less starting health, your blueprint logic still works properly.

To create a variable that stores the player's maximum health, follow these steps:

- In `BP_AdventureCharacter`, in the **My Blueprint **panel, in the **Variables **section, click **+** to add a new variable.
- Name it `MaxHealth` and change the type to **Float**. Compile the blueprint.
- In the event graph, in the** Event BeginPlay **group of logic you were working with in the previous section, focus on the **Event BeginPlay **and **Set Default Movement Speed** nodes.
- Drag off **Event BeginPlay **and add a **Set MaxHealth** node.
- From the **Variables **list, drag the **Health **variable onto the new **Set **node's **Max Health **pin.

Now when the game starts, the **Health** value (100 by default) is saved to **MaxHealth**. As the player plays the game and **Health **changes, **MaxHealth **stays the same, preserving the player's maximum health.

### Connect Current Player Health to the Material

First, you’ll extend the player’s damage-handling logic to control the Dynamic Material Instance using the **Damage Amount** parameter so that as the player’s health decreases, the intensity of the effect on screen increases.

To scale the **Damage Amount** up as the player loses health, follow these steps:

- In the character blueprint, go to the group of logic labelled **(DT) Damage and defeat handling** near the bottom-left section of the event graph. You’re going to add new logic between the **Set Health** and the **Branch **nodes, so add some space between these nodes.
- In the **Variables **list, drag the **MID Damage** variable onto the graph and select **Get MID Damage**.
- Drag off the **Get MID Damage** node's output pin and choose **Set Scalar Parameter Value** from the list.
- Connect **Set Health** to the **Set Scalar Parameter Value**, and then to the **Branch **node.
- On the** Set Scalar Parameter Value** node, for the **Parameter Name**, enter `Damage Amount`. This is the material parameter that controls the size and strength of the effect on-screen.This name MUST match the corresponding parameter in the material `M_Screen_Damage` for the effect to work.
- On the **Set Scalar Parameter Value **node, drag off the **Value **input and create a **Lerp **node.
- On the **Lerp **node, set** A** to `1.0` and B to `0`. This remaps the values so that when damage is applied, it goes from max health (100) to 0 as you lose health instead of the other way around.
- On the **Lerp **node, drag off the **Alpha **input and create a **Divide **node.
- From the **Variables **list, drag the character’s **Health **variable onto the top input of the **Divide **node.
- Drag the character's **MaxHealth **variable onto the bottom input of the **Divide **node.

The **Divide **node turns the player’s health into a number between 1 and 0, where 1 is full health (no damage). However, the** Damage Amount** value needs to increase as the player loses health, not decrease. The Lerp node reverses the value range. For example, if **Health **is 25, the **Lerp **returns a value of 0.75 to the **Set Scalar Parameter Value **node, resulting in an effect that is 75% of the maximum intensity.

The **(DT) Damage and defeat handling section** of the graph should look similar to this now:

### Add a Resetting Delay to Regenerate Health

For the player’s **Health **variable (or HP) to regenerate to full so the damage effect disappears, the player character should stop taking damage for a short amount of time. You’ll use a **Retriggerable Delay** node to implement a five-second delay that must complete before **Health **is restored. You can use this type of delay node to reset a cooldown — it waits for a set amount of time before executing the next node, but if it’s triggered again before the time runs out, it restarts the countdown.

To add a delay before removing the damage effect, follow these steps:

- Under the **Branch **node, drag off the **Fn Set HP** node’s **exec **pin and add a **Sequence **node. You’ll use this to add a series of actions to execute after the player takes damage and is not yet out of health.
- Drag off the **Then 0** path and add a **Retriggerable Delay** node. In the delay node, set the **Duration **to `5` seconds.
- As a best practice, check that the player is still alive after the delay:Drag off the **Retriggerable Delay** and add a **Branch **node.
- On the **Branch **node, drag off the **Condition **pin and add a **Greater (>)** node.
- In the **Variables **panel, drag a **Health **variable onto the top pin of the** Greater (>)** node.

Now, each time the player takes damage and isn’t eliminated (their health is not 0), the time delay restarts from 0. Next, you’ll set up the logic that should execute after the delay completes.

Your blueprint graph should look similar to this now:

### Set Up a Timeline for Blending Player Health

In this section of the graph, you’ll add a Timeline that you’ll use to gradually regenerate the player’s Health over a short time. The Timeline node’s controls define how it starts, stops, and what happens during the track time.

To set up a five-second-long Timeline, follow these steps:

- In the graph under the **Sequence **node’s **Then 0** logic, right-click the graph, search for `add timeline` in the node actions list, and select **Add Timeline**. Name the Timeline node `Damage Blend`.
- Double-click the **Damage Blend** node to open it in its own tab in the blueprint.
- In this tab, click** + Track > Add Float Track** to add a new track to the Timeline.
- Name the track **Blend**. This track label also appears as an output pin on the Damage Blend Timeline node.
- Next to the **+ Track** button, ensure the **Length **is **5** seconds.
- In the **Blend **track, right-click and select **Add key to CurveFloat_0**. Repeat this to add another key; you need two in total.
- Click the first key to select it and change its values to **Time** = **0** and **Value **= **0**.
- Click the second key and change its values to **Time **= **5** and V**alue **= **1**.
- Right-click the first key and select **Auto**. This changes the blend from linear blending to a smooth blend between 0 and 1.
- Using the blueprint tabs, go back to the Event Graph where the **Damage Blend** Timeline node is located.
- On the **Sequence **node, connect the **Then 1** exec pin to the Damage Blend node’s **Stop **pin.
- From the **Branch **node after the delay, drag off **True **and connect it to the **Play from Start** input on the Damage Blend node.

Now, this Timeline node outputs a value that changes from 0 to 1 over five seconds. When the **Retriggerable Delay **finishes, the Timeline plays. When the Timeline track logic finishes, execution continues through the **Then 1** path and stops the Timeline from updating.

### Restore Player Health and Remove the Post-Process Material

Now that you have a Timeline set up, you’ll build the logic that uses the five-second track to blend the player’s Health variable back to its full, starting value and lower the material’s **Damage Amount** back to 0.

To gradually restore player health using the Timeline, follow these steps:

- After the **Damage Blend** Timeline node, create a **Lerp **node. Connect the timeline's **Blend **output pin to the **Alpha **input on the **Lerp **node.
- On the **Lerp **node, drag off the **B** input and add a reference to **MaxHealth**.
- In the **Variables **list, drag the **Health **variable onto the **A** input of the **Lerp **node.
- Drag off the **Lerp **node’s **Return Value** pin and add a **Set Health** node (under **Variables **> **Default **in the node actions list).
- Drag off the Timeline’s **Update **pin and connect it to the **Set Health** node’s **exec **pin.Now, the **Lerp **node blends from the player’s current **Health **value to the maximum health they had at the start of the game (in this case, 100) over five seconds (the length of the Timeline).
- Return to the part of the Event Graph with the **Set Scalar Parameter Value** node you created before the **Branch **node. Drag to select the** Set Scalar Parameter Value**, **MID Damage**, **Lerp**, **Divide**, and **Health **nodes and press** Ctrl+C** to copy them.
- In the Event Graph, return to the **Damage Blend** Timeline and press **Ctrl+V** to paste the nodes.
- Connect the** Set Health** node's **exec **pin to the **Set Scalar Parameter Value** **exec **pin.

Now, as the player’s **Health **variable is restored to full, **Damage Amount** decreases back to 0.

Your graph should look similar to this now:

### Display Updated Health on the HUD

As the **Health **variable regenerates back to 100, it displays on the player’s UI with two decimal places. To remove this visual noise from the HUD, you’ll add logic that removes the decimal places and only displays **Health **as a whole number.

This is an example that shows the difference between using Truncate to remove decimal places:

To ensure player **Health **is a round number when displayed in the HUD, follow these steps:

- Go to the **Fn Set HP** node that executes before the **Sequence **node you created. Select the **Fn Set HP** node and its inputs (**HUD **and **Health**) and press **Ctrl + C **to copy.
- After the** Set Scalar Parameter Value** node at the end of your Timeline logic, press **Ctrl + V** to paste the three nodes.
- Connect the** Set Scalar Parameter Value** and **Fn Set HP** nodes’ **exec **pins.
- Drag the **Fn Set HP** node to the right to create some space.
- Delete the wire between the **Health **variable and the **New HP** input on the **Fn Set HP** node.
- Drag off the **Health **variable and add a **Truncate **node. This converts the float value to an integer, removing any decimal places.
- Drag off the **Truncate **node and connect it to the **Fn Set HP** node’s **New HP** input. Unreal Engine automatically adds an Integer-to-Float conversion node.
- **Compile **and **Save **the blueprint.

Your complete Blueprint should look like this now with all the additions you made:

## Test The Final Effect

When you play the game now and take damage, you should see the post-process damage effect appear and grow as you take more damage.

You can return to the Material Instance and adjust the parameter values to achieve the final look you want. The damage effect is amplified in the example below.

## Next Up

In the next section, you'll learn to enhance your level's atmospheric elements by adding denser fog in low-lying areas and adding storm clouds in the sky.

- [image: Adjust Environment Lighting Features] Adjust Environment Lighting FeaturesLearn to enhance your level's atmospheric elements by adding denser fog in low-lying areas and adding storm clouds in the sky. (-> 07-adjust-environment-lighting-features)

On this page

- Before You Begin (-> artist-06-post-process-materials-on-the-ui-in-unreal-engine)
- Create a Material to Show Damage (-> artist-06-post-process-materials-on-the-ui-in-unreal-engine)
- Define the Damage Effect Shape (-> artist-06-post-process-materials-on-the-ui-in-unreal-engine)
- Display Visuals on Different Parts of the Mask (-> artist-06-post-process-materials-on-the-ui-in-unreal-engine)
- Add Noise and Variation to the Effect (-> artist-06-post-process-materials-on-the-ui-in-unreal-engine)
- Add Noise to the Mask (-> artist-06-post-process-materials-on-the-ui-in-unreal-engine)
- Connect the Noise, Mask, and Damage Color Sections (-> artist-06-post-process-materials-on-the-ui-in-unreal-engine)
- Add Pulsations to the Damage Effect (-> artist-06-post-process-materials-on-the-ui-in-unreal-engine)
- Connect the Pulse Logic (-> artist-06-post-process-materials-on-the-ui-in-unreal-engine)
- Control the Effect with a Damage Amount Parameter (-> artist-06-post-process-materials-on-the-ui-in-unreal-engine)
- Create a Material Instance to Control the Effect (-> artist-06-post-process-materials-on-the-ui-in-unreal-engine)
- Set Parameter Values in the Material Instance (-> artist-06-post-process-materials-on-the-ui-in-unreal-engine)
- [Optional] Organize and Limit Parameter Values (-> artist-06-post-process-materials-on-the-ui-in-unreal-engine)
- Add the Post-Process Material to the Character Blueprint (-> artist-06-post-process-materials-on-the-ui-in-unreal-engine)
- Create a Dynamic Material Instance and Add it to Post-Processing (-> artist-06-post-process-materials-on-the-ui-in-unreal-engine)
- Test the Effect In-Game (-> artist-06-post-process-materials-on-the-ui-in-unreal-engine)
- Hide or Show the Effect With Damage Taken (-> artist-06-post-process-materials-on-the-ui-in-unreal-engine)
- Create a Maximum Health Variable (-> artist-06-post-process-materials-on-the-ui-in-unreal-engine)
- Connect Current Player Health to the Material (-> artist-06-post-process-materials-on-the-ui-in-unreal-engine)
- Add a Resetting Delay to Regenerate Health (-> artist-06-post-process-materials-on-the-ui-in-unreal-engine)
- Set Up a Timeline for Blending Player Health (-> artist-06-post-process-materials-on-the-ui-in-unreal-engine)
- Restore Player Health and Remove the Post-Process Material (-> artist-06-post-process-materials-on-the-ui-in-unreal-engine)
- Display Updated Health on the HUD (-> artist-06-post-process-materials-on-the-ui-in-unreal-engine)
- Test The Final Effect (-> artist-06-post-process-materials-on-the-ui-in-unreal-engine)
- Next Up (-> artist-06-post-process-materials-on-the-ui-in-unreal-engine)

Related documents

Post Process Materials

 [image: Post Process Materials] (-> post-process-materials-in-unreal-engine)Art Pass for a Puzzle Adventure Game

 [image: Art Pass for a Puzzle Adventure Game] (-> art-pass-for-a-puzzle-adventure-game)Design a Puzzle Adventure

 [image: Design a Puzzle Adventure] (-> design-a-puzzle-adventure-game-in-unreal-engine)
