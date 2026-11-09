# Complete the Level

https://dev.epicgames.com/documentation/en-us/unreal-engine/designer-10-complete-the-level-in-unreal-engine?application_version=5.9

> Finish the level by completing the gameplay loop and configuring an end state for the player.

[image: Complete the Level]

In this tutorial series, you’ve used level design and game mechanics to engineer gameplay for your players. The puzzles, keys, and doors that you’ve built are all parts of a **gameplay loop**.

A gameplay loop is a series of actions that the player repeats, making up the core of your gameplay.

[image: Infographic-of-gameplay-reward-loop]

You still need to close the loop for the level you’ve built. In this tutorial, you’ll build a win screen that communicates to the player that they’ve completed the current level. You’ll also build a level transition point that verifies a **win conditio****n** and takes the player to the next level.

Once your level is complete, you’ll explore ways to expand on everything you’ve learned in this track.

A **win condition** is an objective the player must meet in order to complete a gameplay task, quest, level, or game. Your gameloop must provide the means to meet the win condition. In nonlinear games, you might have more than one win condition.

## Before You Begin

This tutorial assumes you already have an understanding of the following topics, which are covered in the previous sections of Design a Puzzle Adventure (-> design-a-puzzle-adventure-game-in-unreal-engine):

- Widget Blueprints
- Blueprints
- Variables
- Collision Volumes
- Play-In-Editor Mode
- Parent and child assets

You’ll need the following assets from Traps and Damage (-> designer-07-traps-and-damage-in-unreal-engine):

- `WBP_EliminatedScreen` Widget Blueprint
- `BP_Key` Blueprint Class
- `Enum_KeyType` Enumeration

## Build the Level End

 [image: Gif-clip-of-player-using-jump-pad-onto-a-platform]

Even though you’ve finished building your level’s core gameplay, the transition point is a good opportunity to give players an interesting way to finish your level. In this case, you’ll build a jump pad to launch players onto a raised platform. Later on, you’ll place the level transition point on the platform.

### Build a Platform

To build an elevated platform in one of your rooms, use the `SM_Cube` and `SM_Cylinder` static meshes in the **LevelPrototyping > Meshes** folder.

The tutorial sample level uses a 3.5m square platform with four columns that looks like this:

[image: Platform-raised-with-4-columns-surrounding-it]

If you’d like to copy these blockout pieces into your level, copy the snippet below. If you’ve been following along with the sample level, these shapes will appear near the back corner of Room 3. You can move them as desired.

To copy the platform, follow these steps:

- Click **Copy Full Snippet**. Command Line ```
Begin Map
   Begin Level
      Begin Actor Class=/Script/Engine.StaticMeshActor Name=StaticMeshActor_785 Archetype="/Script/Engine.StaticMeshActor'/Script/Engine.Default__StaticMeshActor'" ExportPath="/Script/Engine.StaticMeshActor'/Game/AdventureGame/Designer/Lvl_Adventure.Lvl_Adventure:PersistentLevel.StaticMeshActor_785'"
         Begin Object Class=/Script/Engine.StaticMeshComponent Name="StaticMeshComponent0" Archetype="/Script/Engine.StaticMeshComponent'/Script/Engine.Default__StaticMeshActor:StaticMeshComponent0'" ExportPath="/Script/Engine.StaticMeshComponent'/Game/AdventureGame/Designer/Lvl_Adventure.Lvl_Adventure:PersistentLevel.StaticMeshActor_785.StaticMeshComponent0'"
         End Object
         Begin Object Name="StaticMeshComponent0" ExportPath="/Script/Engine.StaticMeshComponent'/Game/AdventureGame/Designer/Lvl_Adventure.Lvl_Adventure:PersistentLevel.StaticMeshActor_785.StaticMeshComponent0'"
            StaticMesh="/Script/Engine.StaticMesh'/Game/LevelPrototyping/Meshes/SM_Cylinder.SM_Cylinder'"
            StaticMeshImportVersion=1
            bUseDefaultCollision=False
            StaticMeshDerivedDataKey="STATICMESH_FD1BFC73B5510AD60DFC65F62C1E933E_228332BAE0224DD294E232B87D83948FQuadricMeshReduction_V2$2e1_6D3AF6A2$2d5FD0$2d469B$2dB0D8$2dB6D9979EE5D2_CONSTRAINED0_100100000000000000000000000100000000000080FFFFFFFFFFFFFFFFFFFFFFFF000000000000803F00000000000000803F0000803F00000000000000003D19FC1626C9B2485E57DB4B8EC731318B8215AE8D46FAD400000000010000000100000000000000010000000100000000000000000000000100000001000000400000000000000001000000000000000000F03F000000000000F03F000000000000F03F0000803F00000000050000004E6F6E65000C00000030000000803FFFFFFFFF0000803FFFFFFFFF0000000000000041000000000000A0420303030000000000000000_RT00_0"
```
- In Unreal Editor, ensure the viewport or **Outliner** is the active panel, and press **Ctrl + V**.

Next, you’ll add a jump pad that launches the player up onto the platform.

### Use the Jump Pad

While you could build a jump pad from scratch, this would cost you time. In a development environment, where time is often limited, it can be useful to import **prefabricated (prefab)** assets instead of making your own. Choosing prefab that aligns with the visual style of your game can speed up development without standing out.

For this tutorial, you’ll use an asset that comes with the First Person Template, `BP_JumpPad`.

To integrate `BP_JumpPad`, follow these steps:

- In the **Content Browser**, navigate to **LevelPrototyping > Interactable > JumpPad**.[image: Image-of-jump-pad-asset]
- Drag an instance of `BP_JumpPad` into your level, in front of the platform. If you want to match the exact location shown in this tutorial, set `BP_JumpPad`’s **Location** to `1790`, `-1460`, `10`.

Your level should now look similar to this:

[image: Image-of-raised-platform-with-jump-pad]

It’s time to test your work. First, make sure any `BP_Enemy` has a **Max Speed** of `0`. This ensures you’re not dealing with moving enemies while testing.

Right-click in the viewport and select **Play From Here** to playtest your level from your current location. Step onto the jump pad and try to reach the platform.

Notice that even with the jump pad’s boost, your player character can’t reach the platform. You can solve this by adjusting the jump pad’s **Velocity** parameter.

Like the many editable variables you’ve created in your blueprints, the Velocity parameter is a premade, instance-editable variable for the jump pad asset.

To adjust the **Velocity**, follow these steps:

- Select `BP_JumpPad` in the viewport.
- In the **Details** panel, set **Velocity** (**Z**) to `1000`.[image: Image-of-jump-pad-variable-in-details-tab]

Now, test your level again. You should be able to jump onto the platform.

Next, you’ll create a win screen that displays when the player completes the level.

## Create a Win Screen

You’ll create a win screen by using a widget blueprint, similar to the `WBP_EliminatedScreen` game-over screen you created in Traps and Damage (-> designer-07-traps-and-damage-in-unreal-engine). Since these two screens are so similar, you’ll use `WBP_EliminatedScreen` as a starting point.

To create a win screen by duplicating your game-over screen, follow these steps:

- In the **Content Browser**, navigate to **AdventureGame > Designer > Blueprints > Widgets**.
- Right-click `WBP_EliminatedScreen` and click **Duplicate**.
- Name the new widget blueprint `WBP_WinScreen` and double-click it to open it in the Widget Editor. Your **Widgets folder** should now look like this:[image: A-win-bp-asset-in-the-widget-folder]
- To change the message, click the **Text** widget in the **Hierarchy**.
- In the **Details** panel, under the **Content** heading, next to **Text**, enter `Level Complete! …Loading the Next Level.` in the text field.
- Under the **Appearance** heading, next to **Color** and **Opacity**, click the color swatch to open the color picker. Choose a color you like, or set the **Hex sRGB** value to `FFE000FF` to follow along.
- The win-screen text is shorter, so you can increase its size to fill the screen better. Under the **Font** heading, change the **Size** to `72` or a size you feel is most readable.
- **Save**, **Compile**, and close the widget editor.

Next, you’ll create a level transition point.

## Create a Level Transition

[image: Image-of-a-level-trigger-component]

A **level transition** loads the next level. You can trigger a level transition in many ways; when a player finishes a cutscene, collects a pickup, or reaches the end of a level.

In this tutorial, the level transition will be a Blueprint that triggers when two things occur:

- The player overlaps the level transition.
- The win condition is met.

To create a new Blueprint, follow these steps:

- In the **Content Browser**, navigate to** A****dventureGame > Designer > Blueprints**.
- Right-click and select **New Folder**. Name this folder `LevelTransition`.[image: New-level-transition-folder]
- Inside the **Level Transition** folder, right-click and select **Blueprint Class** to create a new Blueprint.
- Select **Actor** as the parent class.
- Name this new Blueprint `BP_LevelTransition` and double-click it to open it in the Blueprint Editor.

Your Level Transition folder should now look like this:

[image: New-level-transition-blueprint-class-asset]

Much like the other blueprints you’ve created so far, your level transition needs the following:

- A **static mesh** that the player can see during runtime.
- A **collision shape** to detect when the player collides with it.
- **Logic** to power the interaction.

Let’s build out the mesh and box collision first, and then move onto the logic.

To create a static mesh and collision shape, follow these steps:

- In the **Components** tab of `BP_LevelTransition`, click the **Add** button and search for `cube` to create a new static mesh.
- Name this static mesh `TransitionPoint`.[image: Static-mesh-transition-type]
- With **TransitionPoint** selected, in the **Details** panel, set its **Scale** to `3.0`, `3.0`, `0.1`. This is sized to fit the sample level’s end platform; you can resize yours to what works best in your level.
- Back in the **Components** tab, select **DefaultSceneRoot**. Click the **Add** button and search for `box collision` to create a collision shape.
- Name the box collision `LevelTrigger`.[image: Level-trigger-box-collision]
- With **LevelTrigger** selected, in the **Details** panel, set its **Scale** to `4.0`, `4.0`, `2.0`. Set its **Z** location to `55.0`.[image: Collision-box-outline]If the box collision isn’t appearing as the correct shape, make sure it’s not a child of **TransitionPoint**.
- **Save** and **Compile**.

## Build with Logic

`BP_LevelTransition` should do five things in sequence:

- Check for overlap.
- Verify the win condition.
- Disable player input.
- Display the win screen.
- Load the next level.

Step by step, let’s create the logic that powers these interactions.

### Check for Overlap

To build logic that checks for overlap, follow these steps:

- In the **MyBlueprint** tab of `BP_LevelTransition`, In the **Variables** section, click the **+** button to create a new variable and name it `OtherActor`.
- Set the pin type to **Actor** (**Object Reference**).[image: Image-of-other-actor-variable]
- In the **EventGraph**, delete the three existing event nodes. You won’t need them.
- In the **Components** tab, right-click on **LevelTrigger** and click **Add** **Event > Add OnComponentBeginOverlap**. This function checks when an object overlaps the collision shape.
- From the **Exec** pin, drag out and create **Set Other Actor**.
- Connect both **Other Actor** pins.[image: Blueprint-of-other-actor-pins-connected]

Next, you’ll build logic that verifies the win condition.

### Verify the Win Condition

In this tutorial, the win condition will be collecting all three keys. The reason for choosing this particular condition is to anticipate and prevent game-breaking player actions.

For example, if the win condition was “player overlaps the level transition” and a player finds a way over the room walls, they could bypass your entire level. By using the keys as a win condition, the player must complete your game loop — even if they find a way past the walls and doors.

While it's impossible to predict every bug, design that thinks ahead can prevent players from breaking your game.

To create an array to store the key data, follow these steps:

- In the **MyBlueprint** tab of `BP_LevelTransition`, click the **+** button to create a new variable and name it `HeldKeys`.
- Set the pin type to **Enum Key Type** and the container type to **Array**.[image: Variable-type-enum-key]
- From the **Exec** pin of the **Set** node, drag out and create **fnBPIGetKeys**.
- From the **Target** pin, drag out and create **Get Other Actor**.
- From the **Exec** pin on **fnBPIGetKeys**, drag out and create **Set Held Keys**.
- Connect both **Held Keys** array pins.[image: BP-showing-held-key-array-pins-connected]

To create an enum key type to set a win condition, follow these steps:

- Create a new variable and name it `RequiredKeys`. This is your win condition.
- Make sure the pin type is **Enum Key Type** and the container type is **Array**.
- In the **Details** panel, enable **Instance Editable** and set the **Category** to `Setup`.
- **Compile** the Blueprint to gain access to the **Default Value**. Click the **+** button to add three new elements to the array.
- Click the index dropdown menus and set the indexes to **Yellow**, **Blue**, and **Red**.[image: Array-elements-indexed-as-yellow-blue-red]

You’ll create a boolean to verify whether the condition is met or not. A **For Each Loop** **with Break** will cycle through the `HeldKeys` array to check for each key — and break if there are keys missing.

To build logic that checks for missing keys, follow these steps:

- Create a new variable and name it `FoundAllKeys`.
- Set the pin type to **Boolean** and the container type to **Single**.[image: Found-all-keys-as-boolean]
- From the **Exec** pin of **SetHeldKeys**, drag out and create a **For Each Loop with Break**.
- From the **Array** pin of the **For Each Loop**, drag out and create a **Get Required Keys** node.
- From the **Loop Body** pin on the loop, drag out and create a **Branch**.
- From the **Condition** pin, drag out and create a **Contains Item (Array)** node.
- From the **Target Array** pin on the **Contains** node, drag out and create **Get Held Keys**.
- Connect the** Item to Find** pin on the **Condition** node to the **Array Element** pin on the loop node.[image: BP-of-array-element-node-to-condition-pin]
- From the **True** pin of the **Branch** node, drag out and create **Set Found All Keys**. Click the checkbox next to **FoundAllKeys** to set it to true.
- From the **False** pin of the **Branch** node, drag out and create **Set Found All Keys**. Leave the checkbox empty and connect the **Exec** pin to the **Break** pin on the **For Each Loop**.[image: BP-of-for-each-loop]

You have three more steps to do in the sequence we looked at earlier, but only if the player has all keys:

- Disable player input.
- Display the win screen.
- Load the next level.

To use the **FoundAllKeys** result to start a sequence of logic, follow these steps:

- From the **Completed** pin of the **For Each Loop**, drag out and create a **Branch**.
- Drag out from the **Condition** pin and create **Get FoundAllKeys**.
- From the **True** pin of the **Branch** node, drag out and create a **Sequence** node.
- Since you need to build three actions in this sequence, click the **Add Pin** button.[image: BP-showing-the-sequence-node-with-add-pin]

Let’s move onto the next step in the sequence; disabling player input.

### Disable Player Input

While displaying the win screen, disabling player input prevents players from moving around and receiving unintended damage.

To disable player input, follow these steps:

- From the **Then 0** pin of **Sequence**, drag out and create a **Disable Input** node.
- From the **Target** pin of the **Disable Input** node, create **Get Other Actor**.
- From the **Player Controller** pin, drag out and create a **Get Player Controller** node.[image: Get-player-controller-node-to-player-controller-pin]

Next, you’d build logic to display the win screen.

### Display the Win Screen

To display your `WBP_Winscreen` widget, follow these steps:

- From the **Then 1** pin of the **Sequence** node, drag out and create a **Create Widget** node.
- Set the **Class** to **WBP_WinScreen**.
- From the **Exec** node on the **Create Widget** node, drag out and create an **Add to Viewpor****t** node.
- Connect the **Return Value** pin on **Create Widget** to the **Target** node on **Add to Viewport**.[image: Add-to-viewport-node-in-blueprint]

Do you see an issue with this logic? For now, you’ll move on and build the final step without fixing the issue. Later on, you’ll playtest the level to discover the problem and build a solution.

### Load the Next Level

For this tutorial, you’ll use your current level as a placeholder for the next level. When you're designing your own game, the transition point should take players to a brand new level.

To build logic that loads the current level, follow these steps:

- From the **Then 2** pin of the **Sequence** node, drag out and create an **Open Level (by Object Reference)** node.
- From the **Level** pin of **Open Level**, drag out and search for **Promote** to **Variable**. This will force the creation of a **World**-type variable.[image: Open-level-node-to-next-level]You can also create this variable through the MyBlueprints tab, but the World pin type can be difficult to locate.
- With the World variable selected, in the **Details** panel, rename the variable to `NextLevel`.
- Add it to the **Setup** category and enable **Instance Editable**.
- **Compile** your Blueprint to gain access to the variable’s **Default Value** and set it to the level you’d like to load. If you’re following along with this tutorial, set it to `Lvl_Adventure` to loop the current level.[image: Details-tab-showing-next-level]
- **Save** and **Compile**.

It’s time to test your work. Drag an instance of `BP_LevelTransition` onto the raised platform. Then, give yourself easy access to the keys to meet the win condition. You can do this by placing instances of the yellow, blue, and red keys you created in Create a Key (-> designer-02-create-a-key-in-unreal-engine) into the same room.

Your level should now look something like this:

[image: High-level-view-of-the-level]

Right-click in the viewport and select **Play From Here** to playtest your level from your current location. If you jump onto the platform and activate the level transition, you’ll notice the screen freezes and the next level opens without giving the player time to read the win screen message.

 [image: View-of-player-jumping-to-platform-and-clipped-message]

You’ll solve this issue in the next section.

### Create a Delay

This tutorial uses **Open Level** to close the current level and open the next as a new game instance. During loading, Open Level freezes the game. Depending on the player’s system, that freeze might be too short (to read your win screen), or too long (appearing as if the game has crashed).

Many games, even those using Level Streaming (-> level-streaming-overview-in-unreal-engine), utilize loading screens to let the player know that the game is working properly and that they should wait. Loading screens also solve another problem; long, frequent, or boring wait times can break immersion and cause frustration. Loading screens often include tips, animation, or audio to retain the player’s attention while they aren’t playing.

To solve this technical issue with design, you’ll create an intentional delay that achieves the following:

- Equalize the loading times for all players.
- Ensure the player has enough time to read the win screen.
- Disguise loading times by giving the player something to look at.

To insert a delay, follow these steps:

- Open up `BP_LevelTransition`. In the **MyBlueprint** tab, click **+** to add a new variable and name it `LevelLoadDelay`.
- Set the pin type to **Float**.
- In the **Details** panel, enable **Instance Editable** and set the **Category** to **Setup**.
- **Compile** the blueprint to gain access to the **Default Value**. **Level Load Delay** will set the amount of time you want the delay to last. To follow along, set it to `5.0` seconds.[image: Level-load-delay-as-variable-name]
- In the **EventGraph**, navigate to the **Sequence** node. To insert a delay, drag out from the **Then 2** pin and create a **Delay** node.
- From the **Duration** pin, drag out and create **Get LevelLoadDelay**.[image: Level-load-delay-in-blueprints]
- **Save**, **Compile**, and close your blueprint.

Your final `BP_LevelTransition` **EventGraph** should look like this:

 Blueprint

 Level Transition

Begin Object Class=/Script/BlueprintGraph.K2Node_ComponentBoundEvent Name="K2Node_ComponentBoundEvent_0" ExportPath="/Script/BlueprintGraph.K2Node_ComponentBoundEvent'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition:EventGraph.K2Node_ComponentBoundEvent_0'"
 DelegatePropertyName="OnComponentBeginOverlap"
 DelegateOwnerClass="/Script/CoreUObject.Class'/Script/Engine.PrimitiveComponent'"
 ComponentPropertyName="LevelTrigger"
 EventReference=(MemberParent="/Script/CoreUObject.Package'/Script/Engine'",MemberName="ComponentBeginOverlapSignature__DelegateSignature")
 bInternalEvent=True
 CustomFunctionName="BndEvt__BP_LevelTransition_LevelTrigger_K2Node_ComponentBoundEvent_0_ComponentBeginOverlapSignature__DelegateSignature"
 NodePosY=241
 NodeGuid=79BD3CD7489A10305E2381AEAC0AAC45
 CustomProperties Pin (PinId=FB5146F84712F8DE722CF986390F603A,PinName="OutputDelegate",Direction="EGPD_Output",PinType.PinCategory="delegate",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(MemberParent="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition_C'",MemberName="BndEvt__BP_LevelTransition_LevelTrigger_K2Node_ComponentBoundEvent_0_ComponentBeginOverlapSignature__DelegateSignature"),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=00CE9CDE4EF7D3BD2917BEA086C9733D,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_0 C50909A04718DF5043802B95294116B8,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=1353E44B4C76C53A6FD13995BE928004,PinName="OverlappedComponent",PinToolTip="Overlapped Component\nPrimitive Component Object Reference",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.PrimitiveComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=8DB8B7D5483B92D3830AC497F22B6543,PinName="OtherActor",PinToolTip="Other Actor\nActor Object Reference",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_0 965DA6D243217C25C87A46B9C7120087,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=BF13405F42139B7DFEA3DAA5A46859A2,PinName="OtherComp",PinToolTip="Other Comp\nPrimitive Component Object Reference",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.PrimitiveComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=C63DC845457F948F65991688F76B2F44,PinName="OtherBodyIndex",PinToolTip="Other Body Index\nInteger",Direction="EGPD_Output",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0",AutogeneratedDefaultValue="0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=90C5CE944961D88333266C839D76F984,PinName="bFromSweep",PinToolTip="From Sweep\nBoolean",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=2511F33A4232AABA359E15AF18D273EA,PinName="SweepResult",PinToolTip="Sweep Result\nHit Result Structure (by ref)",Direction="EGPD_Output",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/Engine.HitResult'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=True,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableSet Name="K2Node_VariableSet_0" ExportPath="/Script/BlueprintGraph.K2Node_VariableSet'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition:EventGraph.K2Node_VariableSet_0'"
 VariableReference=(MemberName="OtherActor",MemberGuid=EC9F8FD54DDEC474F68858B1FD264F77,bSelfContext=True)
 NodePosX=624
 NodePosY=256
 NodeGuid=62ACA208491535F09073D08D1C0004B2
 CustomProperties Pin (PinId=C50909A04718DF5043802B95294116B8,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_ComponentBoundEvent_0 00CE9CDE4EF7D3BD2917BEA086C9733D,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=B035214642D6E1EBE0A44EA8AF337575,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Message_0 411CF050432B1C9A1AC2F68F2DAC40BF,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=965DA6D243217C25C87A46B9C7120087,PinName="OtherActor",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_ComponentBoundEvent_0 8DB8B7D5483B92D3830AC497F22B6543,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=115C67F942E2E32EB1BBEFA92531F2EB,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=5CB65F204EA90064E44FE285E781DC38,PinName="Output_Get",PinToolTip="Retrieves the value of the variable, can use instead of a separate Get node",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_Message Name="K2Node_Message_0" ExportPath="/Script/BlueprintGraph.K2Node_Message'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition:EventGraph.K2Node_Message_0'"
 FunctionReference=(MemberParent="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Core/BPI_PlayerKeys.BPI_PlayerKeys_C'",MemberName="fnBPIGetKeys",MemberGuid=16DC5E52458A28BAFE6D809BF1E2E381)
 NodePosX=944
 NodePosY=224
 NodeGuid=CE80854B425136C725B4B98FDB7D117A
 CustomProperties Pin (PinId=411CF050432B1C9A1AC2F68F2DAC40BF,PinName="execute",PinToolTip="\nExec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_0 B035214642D6E1EBE0A44EA8AF337575,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=4005DCA64F682FB20B516A929B4C3B43,PinName="then",PinToolTip="\nExec",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_1 7CC6716F421CDEB9CE76BC891D8DD97E,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=2CDB92DD460FBA51618B7A9278891829,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nObject Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/CoreUObject.Object'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_0 004D1D3F483B0E39234857A3159ADFE8,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=1688363C440E9B05BA6ADAB33D8603A2,PinName="Held Keys",PinToolTip="Held Keys\nArray of Enum_KeyType Enums",Direction="EGPD_Output",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",LinkedTo=(K2Node_VariableSet_1 D8EC9D5D4B0808AF20074AA7CE20B4E8,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableSet Name="K2Node_VariableSet_1" ExportPath="/Script/BlueprintGraph.K2Node_VariableSet'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition:EventGraph.K2Node_VariableSet_1'"
 VariableReference=(MemberName="HeldKeys",MemberGuid=ACB2149F473071318D7D33AFACF35127,bSelfContext=True)
 NodePosX=1280
 NodePosY=256
 NodeGuid=8D5FD1A246FD16FBC88A27B21F5CFAC7
 CustomProperties Pin (PinId=7CC6716F421CDEB9CE76BC891D8DD97E,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Message_0 4005DCA64F682FB20B516A929B4C3B43,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=255FDF5140E1B6D3627BB78CEC61EBBA,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_0 E05EACA14FB8A74D7F2AE58D9D9B537B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D8EC9D5D4B0808AF20074AA7CE20B4E8,PinName="HeldKeys",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",LinkedTo=(K2Node_Message_0 1688363C440E9B05BA6ADAB33D8603A2,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=7A71ACA649B0E2DD825C089DE821B863,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=6C28153A4BD284078D2C2491858F85EA,PinName="Output_Get",PinToolTip="Retrieves the value of the variable, can use instead of a separate Get node",Direction="EGPD_Output",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_0" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition:EventGraph.K2Node_VariableGet_0'"
 VariableReference=(MemberName="OtherActor",MemberGuid=EC9F8FD54DDEC474F68858B1FD264F77,bSelfContext=True)
 NodePosX=768
 NodePosY=384
 NodeGuid=1EC90C9E48A7FA71544ED69833099140
 CustomProperties Pin (PinId=004D1D3F483B0E39234857A3159ADFE8,PinName="OtherActor",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Message_0 2CDB92DD460FBA51618B7A9278891829,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=CCF65CA54C0EA4CDA3D6829DD698494C,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_MacroInstance Name="K2Node_MacroInstance_0" ExportPath="/Script/BlueprintGraph.K2Node_MacroInstance'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition:EventGraph.K2Node_MacroInstance_0'"
 MacroGraphReference=(MacroGraph="/Script/Engine.EdGraph'/Engine/EditorBlueprintResources/StandardMacros.StandardMacros:ForEachLoopWithBreak'",GraphBlueprint="/Script/Engine.Blueprint'/Engine/EditorBlueprintResources/StandardMacros.StandardMacros'",GraphGuid=F07560274C5742E391E84B8F394CFB36)
 NodePosX=1632
 NodePosY=240
 NodeGuid=F64D7982455C4AAE37B79FADD225DA8D
 CustomProperties Pin (PinId=E05EACA14FB8A74D7F2AE58D9D9B537B,PinName="Exec",PinType.PinCategory="Exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_1 255FDF5140E1B6D3627BB78CEC61EBBA,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=707B43B84A92A5044BDE46BE778810A7,PinName="Array",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_1 CD64D11B46BB8A415D094DB2ABDF51E3,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=480B977D4AD3EFEC147AA6B746FD1254,PinName="Break",PinType.PinCategory="Exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_2 E7C0C1B64FCC427F091CC788EA219D5C,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=AD01C6DA4DBA0431AE1E3882A6D25E27,PinName="LoopBody",Direction="EGPD_Output",PinType.PinCategory="Exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_0 219FCB6840A3A18737987EB4EB29FB10,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=5C528AFD4E4D95A2E68F87A80C3969C2,PinName="Array Element",Direction="EGPD_Output",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallArrayFunction_0 92B86BDD493DC065B25B8383A8753597,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=68CF00BE463DCB5C8E32AE8EA4B0B95E,PinName="Array Index",Direction="EGPD_Output",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=FA8C84DF4C200D3E772E8D80D3E1E917,PinName="Completed",Direction="EGPD_Output",PinType.PinCategory="Exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_1 54F9593A4F0DBE1CC7A736AF923ACAA6,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_1" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition:EventGraph.K2Node_VariableGet_1'"
 VariableReference=(MemberName="RequiredKeys",MemberGuid=92968B984B2904B04F40C2BA6547A061,bSelfContext=True)
 NodePosX=1456
 NodePosY=384
 NodeGuid=327704884B2DD4142949848724A3735D
 CustomProperties Pin (PinId=CD64D11B46BB8A415D094DB2ABDF51E3,PinName="RequiredKeys",Direction="EGPD_Output",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",LinkedTo=(K2Node_MacroInstance_0 707B43B84A92A5044BDE46BE778810A7,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=392C35E74063FE3373DC49962999531A,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_IfThenElse Name="K2Node_IfThenElse_0" ExportPath="/Script/BlueprintGraph.K2Node_IfThenElse'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition:EventGraph.K2Node_IfThenElse_0'"
 NodePosX=2704
 NodePosY=240
 NodeGuid=36AD009D40B1F349847A01BB75C5C8BF
 CustomProperties Pin (PinId=219FCB6840A3A18737987EB4EB29FB10,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_0 AD01C6DA4DBA0431AE1E3882A6D25E27,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=16BB5A744DC0E01FCA29C0978510609D,PinName="Condition",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",AutogeneratedDefaultValue="true",LinkedTo=(K2Node_CallArrayFunction_0 4CF5CD21407D41DF18AF759462A3056E,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=0D50A1414EE634ECC58B769AC8C0A3E1,PinName="then",PinFriendlyName=NSLOCTEXT("K2Node", "true", "true"),Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_5 71B69F8F43F1952936F3D58542F708C0,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=9F02E1C741C53E1F46CCB6A2DB193014,PinName="else",PinFriendlyName=NSLOCTEXT("K2Node", "false", "false"),Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_4 71B69F8F43F1952936F3D58542F708C0,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallArrayFunction Name="K2Node_CallArrayFunction_0" ExportPath="/Script/BlueprintGraph.K2Node_CallArrayFunction'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition:EventGraph.K2Node_CallArrayFunction_0'"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetArrayLibrary'",MemberName="Array_Contains")
 NodePosX=2288
 NodePosY=416
 NodeGuid=A72916BB47715AD4B20A8ABEFF2E5073
 CustomProperties Pin (PinId=BF0AC8464A2A6F3900B2CFA4B51006FE,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nKismet Array Library Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.KismetArrayLibrary'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__KismetArrayLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=647BCB274C9C2D7F54F0EDBCFABC1C83,PinName="TargetArray",PinToolTip="Target Array\nArray of Enum_KeyType Enums\n\nThe array to search for the item *",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=True,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_2 394CB9934FEEEC96E140A6AC9B78C8BC,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=92B86BDD493DC065B25B8383A8753597,PinName="ItemToFind",PinToolTip="Item to Find\nEnum_KeyType Enum (by ref)\n\nThe item to look for *",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=True,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",LinkedTo=(K2Node_MacroInstance_0 5C528AFD4E4D95A2E68F87A80C3969C2,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=4CF5CD21407D41DF18AF759462A3056E,PinName="ReturnValue",PinToolTip="Return Value\nBoolean\n\nTrue if the item was found within the array",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",LinkedTo=(K2Node_IfThenElse_0 16BB5A744DC0E01FCA29C0978510609D,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_2" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition:EventGraph.K2Node_VariableGet_2'"
 VariableReference=(MemberName="HeldKeys",MemberGuid=ACB2149F473071318D7D33AFACF35127,bSelfContext=True)
 NodePosX=2128
 NodePosY=336
 NodeGuid=4FA888814A569E8A9D1C5D897A714784
 CustomProperties Pin (PinId=394CB9934FEEEC96E140A6AC9B78C8BC,PinName="HeldKeys",Direction="EGPD_Output",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",LinkedTo=(K2Node_CallArrayFunction_0 647BCB274C9C2D7F54F0EDBCFABC1C83,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=98FC48584D842A21C4DBFEB3FA6C2CD6,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_Knot Name="K2Node_Knot_1" ExportPath="/Script/BlueprintGraph.K2Node_Knot'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition:EventGraph.K2Node_Knot_1'"
 NodePosX=3184
 NodePosY=144
 NodeGuid=C43E2C13410BD7A9AEB796829025127A
 CustomProperties Pin (PinId=E3FF8227439EE4E3172211BD6051992F,PinName="InputPin",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_4 ADC3BE5B477C026E897063841D872D8E,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=C96FE65F4C780D9970C467AB2835EB5B,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_2 3ACCDA204EF882A386DCB1BD61EB76DF,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_Knot Name="K2Node_Knot_2" ExportPath="/Script/BlueprintGraph.K2Node_Knot'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition:EventGraph.K2Node_Knot_2'"
 NodePosX=1568
 NodePosY=144
 NodeGuid=33DAA638498BCBBF72F813B8829661B0
 CustomProperties Pin (PinId=3ACCDA204EF882A386DCB1BD61EB76DF,PinName="InputPin",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_1 C96FE65F4C780D9970C467AB2835EB5B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=E7C0C1B64FCC427F091CC788EA219D5C,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_0 480B977D4AD3EFEC147AA6B746FD1254,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableSet Name="K2Node_VariableSet_5" ExportPath="/Script/BlueprintGraph.K2Node_VariableSet'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition:EventGraph.K2Node_VariableSet_5'"
 VariableReference=(MemberName="FoundAllKeys",MemberGuid=764F6D9144DE9A7712A6FCBF3B3B52B8,bSelfContext=True)
 NodePosX=3008
 NodePosY=256
 NodeGuid=F8F835B64814E20F808B8B8FFE8B11C6
 CustomProperties Pin (PinId=71B69F8F43F1952936F3D58542F708C0,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_0 0D50A1414EE634ECC58B769AC8C0A3E1,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=ADC3BE5B477C026E897063841D872D8E,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=205FDC5E45ACBC9A441604B465568C9F,PinName="FoundAllKeys",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",AutogeneratedDefaultValue="false",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=13AB6D194CFC4DCF1A851194ADD84152,PinName="Output_Get",PinToolTip="Retrieves the value of the variable, can use instead of a separate Get node",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=751CC565439B596625DE7CBAE56BF989,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableSet Name="K2Node_VariableSet_4" ExportPath="/Script/BlueprintGraph.K2Node_VariableSet'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition:EventGraph.K2Node_VariableSet_4'"
 VariableReference=(MemberName="FoundAllKeys",MemberGuid=764F6D9144DE9A7712A6FCBF3B3B52B8,bSelfContext=True)
 NodePosX=3008
 NodePosY=400
 NodeGuid=2B4AD9A044370344B06EDDB497D4DC5F
 CustomProperties Pin (PinId=71B69F8F43F1952936F3D58542F708C0,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_0 9F02E1C741C53E1F46CCB6A2DB193014,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=ADC3BE5B477C026E897063841D872D8E,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_1 E3FF8227439EE4E3172211BD6051992F,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=205FDC5E45ACBC9A441604B465568C9F,PinName="FoundAllKeys",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=13AB6D194CFC4DCF1A851194ADD84152,PinName="Output_Get",PinToolTip="Retrieves the value of the variable, can use instead of a separate Get node",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=751CC565439B596625DE7CBAE56BF989,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_IfThenElse Name="K2Node_IfThenElse_1" ExportPath="/Script/BlueprintGraph.K2Node_IfThenElse'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition:EventGraph.K2Node_IfThenElse_1'"
 NodePosX=2176
 NodePosY=592
 NodeGuid=4A242933406C2E4D45F3218ED4D6E13E
 CustomProperties Pin (PinId=54F9593A4F0DBE1CC7A736AF923ACAA6,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_0 FA8C84DF4C200D3E772E8D80D3E1E917,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=C1FFCCD14E3F1116D80F1E8C2A804613,PinName="Condition",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",AutogeneratedDefaultValue="true",LinkedTo=(K2Node_VariableGet_3 C22C67344833EF3416B367BDA26C4C7B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=6D348C124DE5DC7AD1B45EBB8CF48DE5,PinName="then",PinFriendlyName=NSLOCTEXT("K2Node", "true", "true"),Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_ExecutionSequence_0 A5CA616E4516ADC7AF95BE80645E31C6,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=6883760E4A4022645E3C7580293BF769,PinName="else",PinFriendlyName=NSLOCTEXT("K2Node", "false", "false"),Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_3" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition:EventGraph.K2Node_VariableGet_3'"
 VariableReference=(MemberName="FoundAllKeys",MemberGuid=764F6D9144DE9A7712A6FCBF3B3B52B8,bSelfContext=True)
 NodePosX=1968
 NodePosY=688
 NodeGuid=BB16283C44A3E91BE74361A7366B20DF
 CustomProperties Pin (PinId=C22C67344833EF3416B367BDA26C4C7B,PinName="FoundAllKeys",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",LinkedTo=(K2Node_IfThenElse_1 C1FFCCD14E3F1116D80F1E8C2A804613,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=3060695F447A10732C61CD8F63AE0897,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_ExecutionSequence Name="K2Node_ExecutionSequence_0" ExportPath="/Script/BlueprintGraph.K2Node_ExecutionSequence'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition:EventGraph.K2Node_ExecutionSequence_0'"
 NodePosX=2496
 NodePosY=592
 NodeGuid=ECEDEE0944FDE44FBFB3178C880BCFCF
 CustomProperties Pin (PinId=A5CA616E4516ADC7AF95BE80645E31C6,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_1 6D348C124DE5DC7AD1B45EBB8CF48DE5,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=9B7BA43746E05344D30FE78354A19B68,PinName="then_0",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_0 9D2E81044D3B5E0DF01D2D8A56EA361D,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=ABAF1FA7497A95FE87FA68B44BCA5A3E,PinName="then_1",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_4 6A6F0CD24BE623722092E7ACD0B51B4C,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=BB4FDEF34B0EBA216ECDA2A538A3B340,PinName="then_2",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_4 811ADB1546C0D2686B22B3A875524BE5,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_0" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition:EventGraph.K2Node_CallFunction_0'"
 FunctionReference=(MemberName="DisableInput",bSelfContext=True)
 NodePosX=3136
 NodePosY=576
 NodeGuid=2BB021CF4599D03639E498AC7CB33F51
 CustomProperties Pin (PinId=9D2E81044D3B5E0DF01D2D8A56EA361D,PinName="execute",PinToolTip="\nExec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_ExecutionSequence_0 9B7BA43746E05344D30FE78354A19B68,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=6A7FE8EC4296219E907B858CDDF9C0BB,PinName="then",PinToolTip="\nExec",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=DE84EB764F6494AAD28BA8A49ADF5123,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nActor Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_4 F83FB354498427F232376FAB5829BA34,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=966A7F544F6EE527AC19309570AC6491,PinName="PlayerController",PinToolTip="Player Controller\nPlayer Controller Object Reference\n\nThe PlayerController whose input events we no longer want to receive. If null, this actor will stop receiving input from all PlayerControllers.",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.PlayerController'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_1 861465044CD17FA13D1898A9FB98732D,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_4" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition:EventGraph.K2Node_VariableGet_4'"
 VariableReference=(MemberName="OtherActor",MemberGuid=EC9F8FD54DDEC474F68858B1FD264F77,bSelfContext=True)
 NodePosX=2960
 NodePosY=672
 NodeGuid=3C91FE994E97955B1B400C8ADB647737
 CustomProperties Pin (PinId=F83FB354498427F232376FAB5829BA34,PinName="OtherActor",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_0 DE84EB764F6494AAD28BA8A49ADF5123,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=C7E01E914D76CA1A87EEAE83DD3CC4DC,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_1" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition:EventGraph.K2Node_CallFunction_1'"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.GameplayStatics'",MemberName="GetPlayerController")
 NodePosX=2848
 NodePosY=736
 NodeGuid=EB8DDA204479EF223716D99A12E1BA2E
 CustomProperties Pin (PinId=48C1078D43CDD04D7B049B84113D6E93,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nGameplay Statics Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.GameplayStatics'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__GameplayStatics",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=4D1C38E9457AB4B6F57C4EA8B566C552,PinName="WorldContextObject",PinToolTip="World Context Object\nObject Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/CoreUObject.Object'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=718FFAC241AE12C737E26B8909B3BC1B,PinName="PlayerIndex",PinToolTip="Player Index\nInteger\n\nIndex in the player controller list, starting first with local players and then available remote ones",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0",AutogeneratedDefaultValue="0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=861465044CD17FA13D1898A9FB98732D,PinName="ReturnValue",PinToolTip="Return Value\nPlayer Controller Object Reference",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.PlayerController'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_0 966A7F544F6EE527AC19309570AC6491,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UMGEditor.K2Node_CreateWidget Name="K2Node_CreateWidget_0" ExportPath="/Script/UMGEditor.K2Node_CreateWidget'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition:EventGraph.K2Node_CreateWidget_0'"
 NodePosX=3136
 NodePosY=912
 NodeGuid=7890B66E4389357F42A8C49DB06C6C0F
 CustomProperties Pin (PinId=7A6FEADC4D78EBF3F6F83190A056B5B8,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_4 8BB0EDF142B20F11AF4E4283DEBCA981,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=05A3F52E48F18D8684639C9EDE6EDC5A,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_2 C745837446B91C74C65E03B03666ADC9,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=66536E9B427E16E98EA9AEB46B77F36E,PinName="Class",PinToolTip="User Widget Class Reference Class\nThe object class you want to construct",PinType.PinCategory="class",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/UMG.UserWidget'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_WinScreen.WBP_WinScreen_C",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=723AEBBA451978BFC91BE9830442908B,PinName="ReturnValue",PinToolTip="WBP Win Screen Object Reference Return Value\nThe constructed object",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/UMG.WidgetBlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_WinScreen.WBP_WinScreen_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_2 7500EB1C4A83CF78BEA4D6830BF0DAC4,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=CB5FBB0242F2D1E2E4CF11B553BB5F1C,PinName="OwningPlayer",PinToolTip="Player Controller Object Reference Owning Player\nThe player that \'owns\' the widget.",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.PlayerController'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_2" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition:EventGraph.K2Node_CallFunction_2'"
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/UMG.UserWidget'",MemberName="AddToViewport")
 NodePosX=3616
 NodePosY=896
 AdvancedPinDisplay=Hidden
 NodeGuid=F958AFEA47B0B43D85877B92CB992086
 CustomProperties Pin (PinId=C745837446B91C74C65E03B03666ADC9,PinName="execute",PinToolTip="\nExec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CreateWidget_0 05A3F52E48F18D8684639C9EDE6EDC5A,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=0B96531C473C28D47DEAD992980DFCB7,PinName="then",PinToolTip="\nExec",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=7500EB1C4A83CF78BEA4D6830BF0DAC4,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nUser Widget Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/UMG.UserWidget'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CreateWidget_0 723AEBBA451978BFC91BE9830442908B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=61DF13704EE639A05028108AD94B284E,PinName="ZOrder",PinToolTip="ZOrder\nInteger\n\nThe higher the number, the more on top this widget will be.",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0",AutogeneratedDefaultValue="0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_3" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition:EventGraph.K2Node_CallFunction_3'"
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.GameplayStatics'",MemberName="OpenLevelBySoftObjectPtr")
 NodePosX=3136
 NodePosY=1120
 AdvancedPinDisplay=Hidden
 NodeGuid=3306BC1A4C3072F60B02E78D99F7D9DE
 CustomProperties Pin (PinId=B6E7E9AC4ABC19CABF4E7E82D9BF5BEB,PinName="execute",PinToolTip="\nExec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_4 3B6E953640E547383B0FA28D6C080BA2,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=A299D06D45E2631E0C9C178E84517E97,PinName="then",PinToolTip="\nExec",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=4DC4D64842F8B9AA88DF91A178FB2E69,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nGameplay Statics Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.GameplayStatics'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__GameplayStatics",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D21AC68247D68A36F7AB819C698D12B8,PinName="WorldContextObject",PinToolTip="World Context Object\nObject Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/CoreUObject.Object'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=EBC3E1EA45579456B3C90A98AA77E565,PinName="Level",PinToolTip="Level\nWorld Soft Object Reference\n\nthe level to open",PinType.PinCategory="softobject",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.World'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=True,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_5 DAB0FD674C55571192C68F86AA3637A4,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=335162C54CB23FD82C9310AC1AE92DA0,PinName="bAbsolute",PinToolTip="Absolute\nBoolean\n\nif true options are reset, if false options are carried over from current level",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",AutogeneratedDefaultValue="true",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)
 CustomProperties Pin (PinId=453FD22A4ED1F6F2157A2D86E4065960,PinName="Options",PinToolTip="Options\nString\n\na string of options to use for the travel URL",PinType.PinCategory="string",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_5" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition:EventGraph.K2Node_VariableGet_5'"
 VariableReference=(MemberName="NextLevel",MemberGuid=324E94AF42604650144DFDAEC8FF9B3E,bSelfContext=True)
 NodePosX=2976
 NodePosY=1296
 NodeGuid=2DF066A54F1541A8E3CC5AA1B6EA3D33
 CustomProperties Pin (PinId=DAB0FD674C55571192C68F86AA3637A4,PinName="NextLevel",Direction="EGPD_Output",PinType.PinCategory="softobject",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.World'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=True,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_3 EBC3E1EA45579456B3C90A98AA77E565,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=84F1A9ED414816C7D688E486D1C1BAF3,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_Knot Name="K2Node_Knot_4" ExportPath="/Script/BlueprintGraph.K2Node_Knot'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition:EventGraph.K2Node_Knot_4'"
 NodePosX=2944
 NodePosY=944
 NodeGuid=D35DDF4F49BEC07F83DB9EB6C4B9A94A
 CustomProperties Pin (PinId=6A6F0CD24BE623722092E7ACD0B51B4C,PinName="InputPin",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_ExecutionSequence_0 ABAF1FA7497A95FE87FA68B44BCA5A3E,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=8BB0EDF142B20F11AF4E4283DEBCA981,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CreateWidget_0 7A6FEADC4D78EBF3F6F83190A056B5B8,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_4" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition:EventGraph.K2Node_CallFunction_4'"
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetSystemLibrary'",MemberName="Delay")
 NodePosX=2784
 NodePosY=1120
 NodeGuid=BD94D037431A4A12C66DD5873528C35E
 CustomProperties Pin (PinId=811ADB1546C0D2686B22B3A875524BE5,PinName="execute",PinToolTip="\nExec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_ExecutionSequence_0 BB4FDEF34B0EBA216ECDA2A538A3B340,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=3B6E953640E547383B0FA28D6C080BA2,PinName="then",PinFriendlyName="Completed",PinToolTip="Completed\nExec",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_3 B6E7E9AC4ABC19CABF4E7E82D9BF5BEB,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=18BB7EF348421800202759B971E98AA4,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nKismet System Library Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.KismetSystemLibrary'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__KismetSystemLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D30CDD1C405748653DF7AA94B20F3FD1,PinName="WorldContextObject",PinToolTip="World Context Object\nObject Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/CoreUObject.Object'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=605ECD82497CADD695A86596D67EFB46,PinName="Duration",PinToolTip="Duration\nFloat (single-precision)\n\nlength of delay (in seconds).",PinType.PinCategory="real",PinType.PinSubCategory="float",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.2",AutogeneratedDefaultValue="0.2",LinkedTo=(K2Node_VariableGet_6 BBD3C7A1413FF5FEEBB8DAB7E16C7E5B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=9CDAC60348066FA1F7178C90A7F99482,PinName="LatentInfo",PinToolTip="Latent Info\nLatent Action Info Structure\n\nThe latent action.",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/Engine.LatentActionInfo'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="LatentInfo",AutogeneratedDefaultValue="LatentInfo",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_6" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition:EventGraph.K2Node_VariableGet_6'"
 VariableReference=(MemberName="LevelLoadDelay",MemberGuid=8A1F8EFF417D5850273E7B9993408576,bSelfContext=True)
 NodePosX=2592
 NodePosY=1216
 NodeGuid=B27442CF47DD02056C4CD895CC38AA3D
 CustomProperties Pin (PinId=BBD3C7A1413FF5FEEBB8DAB7E16C7E5B,PinName="LevelLoadDelay",Direction="EGPD_Output",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_CallFunction_4 605ECD82497CADD695A86596D67EFB46,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=8327E31345CAB944052EEEB529B4724C,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/LevelTransition/BP_LevelTransition.BP_LevelTransition_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object

Now, test your level again. When you overlap the level transition point, the win screen should display, the background should blur, and player input should be disabled for five seconds before your player character appears in the next level.

 [image: Level-complete-with-accurately-timed-end-message]

Before you playtest your level for the final time, remember to remove the keys from Room 3 and set `BP_Enemy`’s **Max Speed** back to `200`.

## From Concept to Creation

Let's take a look at the blockout we created in Project Setup and Level Blockout (-> designer-01-project-setup-and-level-blockout-in-unreal-engine) compared to the final level. From its initial design, our level design and gameplay loop changed to address bugs, create new features, or work around limitations that playtesters discovered during development.

By blocking out your level, working modularly, solving technical problems with design, and keeping your assets organized, you can stay flexible when limitations or new features change the course of your game’s development.

|  |  |
| --- | --- |
|  |  |

By completing this track, you've taken a level from concept to playable demo. You now have the building blocks to design more than just one level. You can combine switches, traps, keys, doors, and enemies in unlimited ways to design new gameplay loops in your own style. When connected together, each level becomes part of a much larger project; an entire game.

## Example Project

Below is a link to download the final project that you can build using this tutorial series of documentation. You can use this example project to see what your final project might look like, or as a reference to see how we built and designed the project.

Download the Designer Track here

(Download size: 75 MB)

To open the project, unzip the file and move the adventuredesigner folder to your Unreal Projects directory (by default, find this in `C:\Users\UserName\Documents\Unreal Projects`).

## Next Up

To continue working on your level by adding materials, lighting, post-process effects, sound, and visual effects, try the Artist Track Tutorial Series:

- [image: Art Pass for a Puzzle Adventure Game] Art Pass for a Puzzle Adventure GameLearn how you can apply art workflows with materials, sounds, and visual effects to the Puzzle Adventure game. (-> art-pass-for-a-puzzle-adventure-game)

If you'd like to walk through building another blueprint, continue to this bonus module of the Designer Track Tutorial Series:

- [image: Bonus: Spawn New Cubes] Bonus: Spawn New CubesAdd a new mechanic to your puzzle adventure game where BP_Cube actors spawn to a specified limit. (-> designer-11-spawn-new-cubes-mechanic-in-unreal-engine)

If you are interested in packaging your project, as a standalone program to test and share, see the following documentation:

- [image: Packaging Unreal Engine Projects] Packaging Unreal Engine ProjectsPackaging Unreal game projects for distribution. (-> packaging-your-project)

- blueprints
- hud
- beginner
- end stated
- gameplay loop

On this page

- Before You Begin (-> designer-10-complete-the-level-in-unreal-engine)
- Build the Level End (-> designer-10-complete-the-level-in-unreal-engine)
- Build a Platform (-> designer-10-complete-the-level-in-unreal-engine)
- Use the Jump Pad (-> designer-10-complete-the-level-in-unreal-engine)
- Create a Win Screen (-> designer-10-complete-the-level-in-unreal-engine)
- Create a Level Transition (-> designer-10-complete-the-level-in-unreal-engine)
- Build with Logic (-> designer-10-complete-the-level-in-unreal-engine)
- Check for Overlap (-> designer-10-complete-the-level-in-unreal-engine)
- Verify the Win Condition (-> designer-10-complete-the-level-in-unreal-engine)
- Disable Player Input (-> designer-10-complete-the-level-in-unreal-engine)
- Display the Win Screen (-> designer-10-complete-the-level-in-unreal-engine)
- Load the Next Level (-> designer-10-complete-the-level-in-unreal-engine)
- Create a Delay (-> designer-10-complete-the-level-in-unreal-engine)
- From Concept to Creation (-> designer-10-complete-the-level-in-unreal-engine)
- Example Project (-> designer-10-complete-the-level-in-unreal-engine)
- Next Up (-> designer-10-complete-the-level-in-unreal-engine)

Related documents

Code a First-Person Adventure Game

 [image: Code a First-Person Adventure Game] (-> code-a-firstperson-adventure-game-in-unreal-engine)Packaging Unreal Engine Projects

 [image: Packaging Unreal Engine Projects] (-> packaging-your-project)Art Pass for a Puzzle Adventure Game

 [image: Art Pass for a Puzzle Adventure Game] (-> art-pass-for-a-puzzle-adventure-game)Your First Hour in Unreal Engine

 [image: Your First Hour in Unreal Engine] (-> first-hour-in-unreal-engine)
