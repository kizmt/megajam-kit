# Bonus: Spawn New Cubes

https://dev.epicgames.com/documentation/en-us/unreal-engine/designer-11-spawn-new-cubes-mechanic-in-unreal-engine?application_version=5.9

> Add a new mechanic to your puzzle adventure game where BP_Cube actors spawn to a specified limit.

[image: Bonus: Spawn New Cubes]

In this tutorial, you’ll learn to create a blueprint that spawns new cubes in the level when the player stands on top of a switch. Use this gameplay object to allow players to get new cubes in any puzzle room where cubes can be lost or destroyed.

For the cube spawner, you’ll create a blueprint that only contains the spawning functionality, so you have the flexibility to use any piece of geometry or art asset to create the effect of cubes falling out of that geometry.

Creating this blueprint isn’t mandatory if you’ve followed along with the sample level, but you may want to include this cube-regeneration mechanic in your project if you continue expanding the puzzle adventure game.

## Before You Begin

Make sure you understand these topics covered in the previous sections of the Design a Puzzle Adventure (-> design-a-puzzle-adventure-game-in-unreal-engine) tutorial series:

- Blueprint basics, including Blueprint Interfaces, custom events, and variables.

You’ll need the following assets created in Puzzles: Switches and Cubes (-> designer-05-puzzles-switches-and-cubes-in-unreal-engine):

- `BP_Cube` Blueprint
- `BP_Switch` Blueprint
- `BPI_Interaction` Blueprint Interface

## Create a New Blueprint

First, create a new blueprint asset for the cube spawner. This blueprint will implement the `BPI_Interaction` Blueprint Interface so it can respond to `BP_Switch`, which uses the events in that interface.

To set up a new blueprint, follow these steps:

- In the **Content Browser**, go to the **Content > Adventure Game > Designer > Blueprints > Activation** folder.
- Right-click and select **Blueprint Class**. In the class-selection window, select the **Actor **class.
- Name this blueprint `BP_CubeSpawn` and open the blueprint.
- In the Blueprint Editor, go to the **EventGraph **tab.
- At the top portion of the blueprint editor, click the **Class Settings** button.
- In the **Details **panel, under the **Interfaces **section, click the **Add **dropdown next to **Implemented Interfaces **and select **BPI Interaction**.
- Click **Compile **and **Save**.

After adding the `BPI_Interaction` interface, under the **My Blueprint** panel, you’ll see a new section named Interfaces. This section contains the **fnBPISwitchOff **and **fnBPISwitchOn **events that are part of the BPI Interaction interface.

In `BP_CubeSpawn`, you’ll use the **fnBPISwitchOn **event to define what happens when the player steps on a switch and triggers this event.

## Build the Cube-Spawning Logic

Before implementing the logic to spawn the cubes, consider how the cube spawning system should work:

- To spawn a cube, the player must activate the switch, which uses the interface you added in the previous section.
- There should be a maximum number of cubes the player can spawn so they don’t overfill the area with cubes.
- If the player tries to spawn more cubes than the maximum amount, destroy the first spawned cube. You’ll keep track of the spawned cubes with an array variable.
- The cube spawner should use a short cooldown timer so the player can not spawn new cubes too quickly.

### Check Cube-Spawning Conditions

To start the cube spawner’s event graph, first check if a new cube can spawn and if the player has created the maximum number of cubes.

To check if a new cube can spawn, follow these steps:

- In the **My Blueprint **panel, under the **Interfaces **category, double-click the **fnBPISwitchOn **interface to add it to the graph.
- From the **fnBPISwitchOn **node, drag the **exec **pin and add a **Branch **node.
- On the **Branch **node, drag the **Condition **pin, select **Promote to variable**, and name this variable `CanSpawn`. You’ll use this variable to check if the cooldown has passed or not.
- In the **My Blueprint** panel, create a new variable named `CubesSpawned` of type **Integer**. This keeps track of the spawned cubes in the level.
- Create another variable named `MaxNumCubes`. This variable sets the maximum number of cubes that the player can spawn.
- Set up **MaxNumCubes**:Set its type to **Integer**.
- Click its **eye **icon to make it public and editable.
- In the **Details **panel, click the **Category field and enter** `Setup`.
- Click **Compile **and set the variable’s **Default Value **to `3`.So far, your variables list should look like this:

- From the **Branch **node, drag off the **True **pin and add a second **Branch **node.
- From the second **Branch **node, drag the **Condition **pin and add a **Less Than (

### Count Spawned Cubes and Destroy Extra Cubes

If the current number of cubes the player has spawned is less than the maximum, execution passes through the second Branch node's True pin. In this case, you can skip directly to the logic that adds 1 to the cube count before spawning a cube.

To increment the number of spawned cubes, follow these steps:

- From the second **Branch **node, drag the **True **pin and add an **Increment Int **node. Move the new node to add extra space between it and the **Branch **node.
- From the **Variables **list, drag **CubesSpawned **onto the **Increment Int **node’s input pin.

Next, add the logic for the opposite scenario — where the** Cubes Spawned **value is greater than the **Max Num Cubes **value, or when execution passes through the Branch's False pin. If the player has reached the maximum number of cubes, destroy the oldest cube before spawning a new one.

To destroy a cube to make room for a new cube, follow these steps:

- From the second **Branch **node, drag the **False **pin and add a **Destroy Actor **node.
- From the **Destroy Actor** node, drag the **Target **pin and add a **Get (a copy)** node.
- Keep the **Get **node’s second input pin set to **0**, since an array’s list begins at 0 and you want to retrieve the first element.
- From the **Get **node, drag off the **Array **input node and select **Promote to variable**.
- Name the new variable `SpawnedCubes`. You’ll use this array to store every cube the player spawns into the level.
- From the **Destroy Actor **node, drag the **exec **pin and add a **Remove Index **node.
- Drag its **Array **input and add a **Get Spawned Cubes **reference node.
- Double-click the wire between the second **Branch **node and the **Increment Int **node to create a movable **reroute **node. Drag the **reroute **node closer to the **Increment Int **node.
- Connect the **Remove Index **node’s output **exec **pin to the **reroute **node.(You can also connect the **Remove Index **node directly to the **Increment Int **node.)

Now, before a cube spawns, the blueprint either increments the **CubesSpawned **counter or deletes a cube and then increments the **CubesSpawned **counter. Next, you’ll add the logic that spawns a new cube.

### Spawn a Cube

Now that you’ve checked if the player can create a cube and ensured there aren’t too many cubes in the level, you can spawn a new `BP_Cube` actor.

To spawn a new cube, follow these steps:

- From the **Add **node, drag the **exec **pin and add a **Spawn Actor from Class** node.
- Set up the **SpawnActor **node: Click the dropdown menu next to the **Class **pin, search for, and then select `BP_Cube`. The node’s name changes from **SpawnActor NONE **to **SpawnActor BP Cube**.
- Right-click on the orange **Spawn Transform **pin and select **Split Struct Pin**. Three new pins replace the Spawn Transform pin: **Spawn Transform Location**, **Spawn Transform Rotation**, and **Spawn Transform Scale**. You have to right-click the circular **Spawn Transform** pin specifically, not the entire node.
- Right click in the Event Graph and search for then select a **Get Actor Transform** node. Right click on the **Return Value** pin and select **Split Struct**. Connect the **Location **and **Rotation pins** to the corresponding pins in the **Spawn Actor** node.

- From the **SpawnActor **node, drag the **exec **pin and add an **Add **node under the **Array **category (you can also search for `Add Array` and select the **Add **node).
- On the **Add Array **node, do the following:Drag the **Array **input pin and add a **Get Spawned Cubes** node.
- Connect the node's bottom input pin to the **SpawnActor **node’s **Return Value **pin.

- When the player spawns a cube, they shouldn’t be able to spawn one again until a cooldown timer expires. Drag the **Add Array** node’s exec pin and add a **Set Can Spawn** node. Keep** Can Spawn **set to false (does not have a checkmark).

### Implement a Cooldown Timer

Use the **CanSpawn **variable and a **Delay **node to prevent the player from spawning another cube until a set amount of time has passed.

To create and trigger an event that resets the cube-spawn cooldown timer, follow these steps:

- Right-click somewhere empty in the EventGraph, and search for and select **Add Custom Event**.
- Name the new event `EvResetSpawn` and move it under the **Event fnBPISwirchOn **node.
- Drag the **EvResetSpawn **event node’s **exec **pin and add a **Delay **node.
- On the **Delay **node, drag the **Duration **pin and select **Promote to variable**. Name the variable `SpawnCooldown`.
- Set up the new **SpawnCooldown **variable:Ensure its type is **Float**.
- Click its eye icon to make it public and editable.
- Change its **Category **to **Setup**.
- Click **Compile **and then set its default value to `1`. Your complete list of variables should look like this:

- From the **Delay **node, drag the **Completed **pin and add a **Set Can Spawn** node. Make sure to toggle this node’s **Can Spawn** value to true.
- Return to the **Set Can Spawn** node at the end of your cube-spawning logic. Drag the **Set Can Spawn** node’s exec pin and add an **EvResetSpawn** node to trigger the event and spawn cooldown delay.
- Click **Save **and **Compile**.

Now, your EventGraph should look like this:

If you use the snippet below, ensure your blueprint has the custom variables, event, and BP interface mentioned in the instructions above.

To copy these nodes into your blueprint, click **Copy Snippet**, go to your event graph, and press **Ctrl+V**. After copying the logic into your blueprint editor, you may need to delete the blue** Ev Reset Spawn** node and re-add it manually after the **Set Can Spawn** node.

 Blueprint

Begin Object Class=/Script/BlueprintGraph.K2Node_CustomEvent Name="K2Node_CustomEvent_1" ExportPath="/Script/BlueprintGraph.K2Node_CustomEvent'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.K2Node_CustomEvent_1'"
 CustomFunctionName="EvResetSpawn"
 NodePosX=-1728
 NodePosY=400
 NodeGuid=BC7DF61D40D79CBF550AECA80ABACC95
 CustomProperties Pin (PinId=A2AF852D4ABF45DBF9EA8798A5A568C8,PinName="OutputDelegate",Direction="EGPD_Output",PinType.PinCategory="delegate",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(MemberParent="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn_C'",MemberName="EvResetSpawn",MemberGuid=BC7DF61D40D79CBF550AECA80ABACC95),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F679A3914AACC1A5A1E642BBEA784923,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_6 DAC6A0244B615147C7F644B00349C3D7,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_SpawnActorFromClass Name="K2Node_SpawnActorFromClass_0" ExportPath="/Script/BlueprintGraph.K2Node_SpawnActorFromClass'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.K2Node_SpawnActorFromClass_0'"
 NodePosX=1680
 NodePosY=48
 AdvancedPinDisplay=Hidden
 NodeGuid=ABFC8C754E5846950E0E0D983F9CFA5D
 CustomProperties Pin (PinId=C635F4954628E86A4E763BBB973C02D0,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_0 607D17BF46100DF5D30E32A501177E76,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=DE60BB0A4177662622F26A9F8DA76F8A,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallArrayFunction_1 6C370B83494712C72C183E858E2D9770,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D4C95F434561BCB827455BA651F2B64A,PinName="Class",PinToolTip="Actor Class Reference Class\nThe object class you want to construct",PinType.PinCategory="Class",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Game/AdventureGame/Designer/Blueprints/Activation/BP_Cube.BP_Cube_C",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=BB0494EF47490EA37C8E8F985CA51973,PinName="ReturnValue",PinToolTip="BP Cube Object Reference Return Value\nThe constructed object",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Activation/BP_Cube.BP_Cube_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_2 D466A92B4CCF54092044A7A59A90AC6A,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=167EFEBA427D6AE5147B4CBAD0D4AE79,PinName="SpawnTransform",PinToolTip="Spawn Transform\nTransform\n\nThe transform to spawn the Actor with",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/CoreUObject.Transform'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,SubPins=(K2Node_SpawnActorFromClass_0 02E6E315491169DC4EAA848D4B86A13B,K2Node_SpawnActorFromClass_0 E6AC9BDC44BF9F528718C8878DAEAFAD,K2Node_SpawnActorFromClass_0 EE0F4458497BE318AF8154A05EC5DB54,),PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=02E6E315491169DC4EAA848D4B86A13B,PinName="SpawnTransform_Location",PinFriendlyName=LOCGEN_FORMAT_NAMED(NSLOCTEXT("KismetSchema", "SplitPinFriendlyNameFormat", "{PinDisplayName} {ProtoPinDisplayName}"), "PinDisplayName", INVTEXT("Spawn Transform"), "ProtoPinDisplayName", INVTEXT("Location")),PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/CoreUObject.Vector'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0, 0, 0",AutogeneratedDefaultValue="0, 0, 0",LinkedTo=(K2Node_CallFunction_1 3E1303D241C1F6C5531E929FDD957FE7,),ParentPin=K2Node_SpawnActorFromClass_0 167EFEBA427D6AE5147B4CBAD0D4AE79,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=E6AC9BDC44BF9F528718C8878DAEAFAD,PinName="SpawnTransform_Rotation",PinFriendlyName=LOCGEN_FORMAT_NAMED(NSLOCTEXT("KismetSchema", "SplitPinFriendlyNameFormat", "{PinDisplayName} {ProtoPinDisplayName}"), "PinDisplayName", INVTEXT("Spawn Transform"), "ProtoPinDisplayName", INVTEXT("Rotation")),PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/CoreUObject.Rotator'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0, 0, 0",AutogeneratedDefaultValue="0, 0, 0",ParentPin=K2Node_SpawnActorFromClass_0 167EFEBA427D6AE5147B4CBAD0D4AE79,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=EE0F4458497BE318AF8154A05EC5DB54,PinName="SpawnTransform_Scale",PinFriendlyName=LOCGEN_FORMAT_NAMED(NSLOCTEXT("KismetSchema", "SplitPinFriendlyNameFormat", "{PinDisplayName} {ProtoPinDisplayName}"), "PinDisplayName", INVTEXT("Spawn Transform"), "ProtoPinDisplayName", INVTEXT("Scale")),PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/CoreUObject.Vector'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="1.000000,1.000000,1.000000",AutogeneratedDefaultValue="1.000000,1.000000,1.000000",ParentPin=K2Node_SpawnActorFromClass_0 167EFEBA427D6AE5147B4CBAD0D4AE79,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=B2AE643846911E68461C9DA83F81ECFA,PinName="CollisionHandlingOverride",PinToolTip="Collision Handling Override\nESpawnActorCollisionHandlingMethod Enum\n\nSpecifies how to handle collisions at the spawn point. If undefined, uses actor class settings.",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Enum'/Script/Engine.ESpawnActorCollisionHandlingMethod'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="Undefined",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=120A009C451161822D3CABB94445B81D,PinName="TransformScaleMethod",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Enum'/Script/Engine.ESpawnActorScaleMethod'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="MultiplyWithRoot",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)
 CustomProperties Pin (PinId=EE8E87714DCA25B90789FBA40EFB796C,PinName="Owner",PinToolTip="Owner\nActor Object Reference\n\nCan be left empty; primarily used for replication (bNetUseOwnerRelevancy and bOnlyRelevantToOwner), or visibility (PrimitiveComponent\'s bOwnerNoSee/bOnlyOwnerSee)",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)
 CustomProperties Pin (PinId=2351EA8641BB190F6DA479A3BB298B50,PinName="Instigator",PinToolTip="Instigator\nPawn Object Reference\n\nPawn responsible for damage and other gameplay events caused by this actor.",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Pawn'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=True,PinType.bSerializeAsSinglePrecisionFloat=False,AutogeneratedDefaultValue="None",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_1" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.K2Node_CallFunction_1'"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberName="K2_GetActorLocation",bSelfContext=True)
 NodePosX=1392
 NodePosY=128
 NodeGuid=8CF523F54C4F5DF4B080A8AF1FDB04FA
 CustomProperties Pin (PinId=B27CB8814BA9AAFE07957D95A25DD9DE,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=3E1303D241C1F6C5531E929FDD957FE7,PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/CoreUObject.Vector'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0, 0, 0",AutogeneratedDefaultValue="0, 0, 0",LinkedTo=(K2Node_SpawnActorFromClass_0 02E6E315491169DC4EAA848D4B86A13B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_Event Name="K2Node_Event_5" ExportPath="/Script/BlueprintGraph.K2Node_Event'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.K2Node_Event_5'"
 EventReference=(MemberParent="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Core/BPI_Interaction.BPI_Interaction_C'",MemberName="fnBPISwitchOn",MemberGuid=96F89F23418461AD68E625858D3987FB)
 bOverrideFunction=True
 NodePosX=-1744
 NodePosY=32
 NodeGuid=4EFA5E404A21EEDA664C5CA90CF1C21E
 CustomProperties Pin (PinId=3A790667402F3174AD049B898E780157,PinName="OutputDelegate",Direction="EGPD_Output",PinType.PinCategory="delegate",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(MemberParent="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Core/BPI_Interaction.BPI_Interaction_C'",MemberName="fnBPISwitchOn",MemberGuid=96F89F23418461AD68E625858D3987FB),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D434236B42C1236FB6A2559FAE4E905B,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_1 929A926041A70F0AF07EF5A02230838F,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_IfThenElse Name="K2Node_IfThenElse_0" ExportPath="/Script/BlueprintGraph.K2Node_IfThenElse'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.K2Node_IfThenElse_0'"
 NodePosX=-624
 NodePosY=48
 NodeGuid=7E3E60834195C16CAECC3EAC9A781448
 CustomProperties Pin (PinId=BEC05982443C67DB3A78F6A001127BE3,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_1 46E2DBD34A09A48BB9FF4C98CA6DD2B4,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=BD12DFB64620E33248257CB2EF1575E7,PinName="Condition",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",AutogeneratedDefaultValue="true",LinkedTo=(K2Node_PromotableOperator_1 595AE5434ABCF9655C82DA9EFDED341A,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=5BE5BD15449844F1D21056B392A21725,PinName="then",PinFriendlyName=NSLOCTEXT("K2Node", "true", "true"),Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_0 138E1210497668EB4F7BF1BB38985A52,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=A1BA5D0440450C31791429945F85A53B,PinName="else",PinFriendlyName=NSLOCTEXT("K2Node", "false", "false"),Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_1 D162E60843E0E355C182409F91617E2C,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_PromotableOperator Name="K2Node_PromotableOperator_1" ExportPath="/Script/BlueprintGraph.K2Node_PromotableOperator'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.K2Node_PromotableOperator_1'"
 OperationName="Less"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetMathLibrary'",MemberName="Less_IntInt")
 NodePosX=-768
 NodePosY=112
 NodeGuid=1E61D4154479B1F75E3E5C9AEC1A66F3
 CustomProperties Pin (PinId=3FA5D03946F4F895DA6CD98D1636E0B1,PinName="A",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_4 9EB789054FF54EEC93D65188879245A1,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=4214319B43CDE841A8875EB5938192E6,PinName="B",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_3 3D27FB79422CE202E5B93C947A8A918B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=595AE5434ABCF9655C82DA9EFDED341A,PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_0 BD12DFB64620E33248257CB2EF1575E7,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D5C1CCA74E0ECBE20E935CB6E0C32847,PinName="ErrorTolerance",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_0" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.K2Node_VariableGet_0'"
 VariableReference=(MemberName="SpawnCooldown",MemberGuid=FAC06572420517A6A44AE5BA15141A0E,bSelfContext=True)
 NodePosX=-1456
 NodePosY=496
 NodeGuid=3758241846409EC68EA861845AEC00EE
 CustomProperties Pin (PinId=992E9AB241D3E28DE6F48E91CF80F73D,PinName="SpawnCooldown",Direction="EGPD_Output",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_CallFunction_6 4528BA704CEC7E820F9C5A8340D25CB3,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=59F48C364892846C5122C9A6479628F6,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_IfThenElse Name="K2Node_IfThenElse_1" ExportPath="/Script/BlueprintGraph.K2Node_IfThenElse'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.K2Node_IfThenElse_1'"
 NodePosX=-1280
 NodePosY=48
 NodeGuid=A6AD3C57498053052DEA38B0F3A4C607
 CustomProperties Pin (PinId=929A926041A70F0AF07EF5A02230838F,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Event_5 D434236B42C1236FB6A2559FAE4E905B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F27920864A33C49FC1F84FAE57C11087,PinName="Condition",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",AutogeneratedDefaultValue="true",LinkedTo=(K2Node_VariableGet_1 BAC9D165485293B40821CCABB82DC81D,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=46E2DBD34A09A48BB9FF4C98CA6DD2B4,PinName="then",PinFriendlyName=NSLOCTEXT("K2Node", "true", "true"),Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_0 BEC05982443C67DB3A78F6A001127BE3,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=5DB2ACFD4A50DC83DD28A4873F1B5481,PinName="else",PinFriendlyName=NSLOCTEXT("K2Node", "false", "false"),Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_1" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.K2Node_VariableGet_1'"
 VariableReference=(MemberName="CanSpawn",MemberGuid=F764B4BD4B914FA9B1D1C090F5B3C31D,bSelfContext=True)
 NodePosX=-1440
 NodePosY=128
 NodeGuid=829AE6054DD820E514E58CBF44A3067D
 CustomProperties Pin (PinId=BAC9D165485293B40821CCABB82DC81D,PinName="CanSpawn",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",LinkedTo=(K2Node_IfThenElse_1 F27920864A33C49FC1F84FAE57C11087,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=11BE9C434C2D3161A89D5C87D68DCC95,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_4" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.K2Node_VariableGet_4'"
 VariableReference=(MemberName="CubesSpawned",MemberGuid=A7E2D2734DEBEDF9C806069D189157E4,bSelfContext=True)
 NodePosX=-928
 NodePosY=112
 NodeGuid=1AB64ACB4F1B50E265CBE5B19B7A4B7B
 CustomProperties Pin (PinId=9EB789054FF54EEC93D65188879245A1,PinName="CubesSpawned",Direction="EGPD_Output",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0",AutogeneratedDefaultValue="0",LinkedTo=(K2Node_PromotableOperator_1 3FA5D03946F4F895DA6CD98D1636E0B1,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=937F92024858AB8C59F8C78B174040A7,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_3" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.K2Node_VariableGet_3'"
 VariableReference=(MemberName="MaxNumCubes",MemberGuid=7E9D532F4003875897846985CFC481A4,bSelfContext=True)
 NodePosX=-928
 NodePosY=160
 NodeGuid=7C74DE6D430B552EE9488985CE72329C
 CustomProperties Pin (PinId=3D27FB79422CE202E5B93C947A8A918B,PinName="MaxNumCubes",Direction="EGPD_Output",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0",AutogeneratedDefaultValue="0",LinkedTo=(K2Node_PromotableOperator_1 4214319B43CDE841A8875EB5938192E6,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=568446D349F4AE29E53DE3A6FCAA840B,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_2" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.K2Node_VariableGet_2'"
 VariableReference=(MemberName="CubesSpawned",MemberGuid=A7E2D2734DEBEDF9C806069D189157E4,bSelfContext=True)
 NodePosX=1008
 NodePosY=112
 NodeGuid=E0BF37314C1BA993B9992F9F41148226
 CustomProperties Pin (PinId=9EB789054FF54EEC93D65188879245A1,PinName="CubesSpawned",Direction="EGPD_Output",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0",AutogeneratedDefaultValue="0",LinkedTo=(K2Node_MacroInstance_0 79EDC67947FE1CD18B08D2B017F0ACE7,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=E66D0FBF485500A2B5A79EB52F0B9C8B,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_MacroInstance Name="K2Node_MacroInstance_0" ExportPath="/Script/BlueprintGraph.K2Node_MacroInstance'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.K2Node_MacroInstance_0'"
 MacroGraphReference=(MacroGraph="/Script/Engine.EdGraph'/Engine/EditorBlueprintResources/StandardMacros.StandardMacros:IncrementInt'",GraphBlueprint="/Script/Engine.Blueprint'/Engine/EditorBlueprintResources/StandardMacros.StandardMacros'",GraphGuid=ABF609A74436C3ED7357E59E21A41B9A)
 NodePosX=1168
 NodePosY=64
 NodeGuid=A543F95543E9811664DC9AB18A63EDD8
 CustomProperties Pin (PinId=775D237C494949417A6315BEB580C48B,PinName=" ",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_0 09BE4F9E413BD59530564798ED65C112,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=79EDC67947FE1CD18B08D2B017F0ACE7,PinName="Value",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=True,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_2 9EB789054FF54EEC93D65188879245A1,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=607D17BF46100DF5D30E32A501177E76,PinName=" ",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_SpawnActorFromClass_0 C635F4954628E86A4E763BBB973C02D0,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=2BABE20141C960B2B4164A90B1495A79,PinName="Result",Direction="EGPD_Output",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_Knot Name="K2Node_Knot_0" ExportPath="/Script/BlueprintGraph.K2Node_Knot'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.K2Node_Knot_0'"
 NodePosX=896
 NodePosY=80
 NodeGuid=82E07E2949BEC9895FC8108AC29D27E8
 CustomProperties Pin (PinId=138E1210497668EB4F7BF1BB38985A52,PinName="InputPin",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_0 5BE5BD15449844F1D21056B392A21725,K2Node_CallArrayFunction_3 98C097794096C43DF3412AA0FE58E911,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=09BE4F9E413BD59530564798ED65C112,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_0 775D237C494949417A6315BEB580C48B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_5" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.K2Node_VariableGet_5'"
 VariableReference=(MemberName="SpawnedCubes",MemberGuid=3D29F7D741AF95DB98E90AA0A7F7B1B4,bSelfContext=True)
 NodePosX=2080
 NodePosY=112
 NodeGuid=3E7D069B4517A48ACF009896FCDE99DD
 CustomProperties Pin (PinId=04CB3ADD4E56FEECD6C2BAAA73229D77,PinName="SpawnedCubes",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Activation/BP_Cube.BP_Cube_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallArrayFunction_1 B68872224250A28A053D119F63B04BC1,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=B6A0B38E42DC453C296D6A9D157D577C,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallArrayFunction Name="K2Node_CallArrayFunction_1" ExportPath="/Script/BlueprintGraph.K2Node_CallArrayFunction'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.K2Node_CallArrayFunction_1'"
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetArrayLibrary'",MemberName="Array_Add")
 NodePosX=2256
 NodePosY=64
 NodeGuid=37AFA1504E1DF7F85E4A75945939FB12
 CustomProperties Pin (PinId=6C370B83494712C72C183E858E2D9770,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_SpawnActorFromClass_0 DE60BB0A4177662622F26A9F8DA76F8A,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=7897451D490999AF50D3899E92E5073B,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_0 B2326E4842F03BDBE1F1338C38D9BC96,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=2F23FB514A5E7210734964A282277903,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.KismetArrayLibrary'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__KismetArrayLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=B68872224250A28A053D119F63B04BC1,PinName="TargetArray",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Activation/BP_Cube.BP_Cube_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=True,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_5 04CB3ADD4E56FEECD6C2BAAA73229D77,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=4F440C554CFCB638B66637A9D114A88A,PinName="NewItem",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Activation/BP_Cube.BP_Cube_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=True,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_3 A3D1BB2F4A61F04C736A6297430BE32D,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=6D094FA34609E8EBC8F5E0A5E7D3C9E1,PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0",AutogeneratedDefaultValue="0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableSet Name="K2Node_VariableSet_0" ExportPath="/Script/BlueprintGraph.K2Node_VariableSet'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.K2Node_VariableSet_0'"
 VariableReference=(MemberName="CanSpawn",MemberGuid=F764B4BD4B914FA9B1D1C090F5B3C31D,bSelfContext=True)
 NodePosX=2512
 NodePosY=64
 NodeGuid=C2AADF9148006626690F1EAEFFA6FB5A
 CustomProperties Pin (PinId=B2326E4842F03BDBE1F1338C38D9BC96,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallArrayFunction_1 7897451D490999AF50D3899E92E5073B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=149C3A564F13F766EC300C98EBF0FFFA,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_3 F7D67FBE441AAE4DDD798E8ADE0DA1FA,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D580F48549F7D92068DF9AAF095C2101,PinName="CanSpawn",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=0C3C17EE4EFDBDADB331DDACDE99D8D8,PinName="Output_Get",PinToolTip="Retrieves the value of the variable, can use instead of a separate Get node",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=12F1173845F36764538403A6A871AF0F,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_3" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.K2Node_CallFunction_3'"
 FunctionReference=(MemberName="EvResetSpawn",MemberGuid=BC7DF61D40D79CBF550AECA80ABACC95,bSelfContext=True)
 NodePosX=2864
 NodePosY=32
 ErrorType=1
 ErrorMsg="Could not find a function named \"EvResetSpawn\" in \'BP_CubeSpawn_C\'.\nMake sure \'BP_CubeSpawn_C\' has been compiled for Ev Reset Spawn"
 NodeGuid=43ACD0594A9D9F09C9A21AB5A6A72B80
 CustomProperties Pin (PinId=F7D67FBE441AAE4DDD798E8ADE0DA1FA,PinName="execute",PinToolTip="\nExec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_0 149C3A564F13F766EC300C98EBF0FFFA,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=04FBA0194B61CDBFF6A93CABB38EED8F,PinName="then",PinToolTip="\nExec",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=968C402344BB40CF661CF3AAF5FB036B,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nSelf Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="self",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_7" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.K2Node_VariableGet_7'"
 VariableReference=(MemberName="SpawnedCubes",MemberGuid=3D29F7D741AF95DB98E90AA0A7F7B1B4,bSelfContext=True)
 NodePosX=-288
 NodePosY=272
 NodeGuid=65DF653B49DEF858D28B108C8A67ACE8
 CustomProperties Pin (PinId=2656221340802C41494AA0BC1E304EC7,PinName="SpawnedCubes",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Activation/BP_Cube.BP_Cube_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_GetArrayItem_0 9EE145F84CDEFAEF538D8B828AB18660,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=0E05034C41446266B6C9CBB6193E5EC8,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_GetArrayItem Name="K2Node_GetArrayItem_0" ExportPath="/Script/BlueprintGraph.K2Node_GetArrayItem'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.K2Node_GetArrayItem_0'"
 bReturnByRefDesired=False
 NodePosX=-128
 NodePosY=272
 NodeGuid=9BF6B93F449E8FD11A2BD3B25F9FD1BD
 CustomProperties Pin (PinId=9EE145F84CDEFAEF538D8B828AB18660,PinName="Array",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Activation/BP_Cube.BP_Cube_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_7 2656221340802C41494AA0BC1E304EC7,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=CC6450B24E00227DBEE0C295CCAC4692,PinName="Dimension 1",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0",AutogeneratedDefaultValue="0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=7E8CE7294FC78F74B04DF0A755843D67,PinName="Output",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Activation/BP_Cube.BP_Cube_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_5 A43F23444F9D70A80E9BD0B930FF6EE0,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_5" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.K2Node_CallFunction_5'"
 FunctionReference=(MemberName="K2_DestroyActor",bSelfContext=True)
 NodePosX=80
 NodePosY=192
 NodeGuid=04B2FDA74C3E0A7F053C24B1C7D6E886
 CustomProperties Pin (PinId=B0F5588840AF9F00CCBF04B952CCFA04,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_1 715670104C80C633B3506EBB91946766,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=553D014943C22F958DFD4FADD33B1C0B,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallArrayFunction_3 AFDB62834649BE905C6317A84706DF07,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=A43F23444F9D70A80E9BD0B930FF6EE0,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_GetArrayItem_0 7E8CE7294FC78F74B04DF0A755843D67,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_Knot Name="K2Node_Knot_1" ExportPath="/Script/BlueprintGraph.K2Node_Knot'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.K2Node_Knot_1'"
 NodePosX=-352
 NodePosY=240
 NodeGuid=E09084E0416C5D9EADA41CAEEBC70DA2
 CustomProperties Pin (PinId=D162E60843E0E355C182409F91617E2C,PinName="InputPin",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_0 A1BA5D0440450C31791429945F85A53B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=715670104C80C633B3506EBB91946766,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_5 B0F5588840AF9F00CCBF04B952CCFA04,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_6" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.K2Node_VariableGet_6'"
 VariableReference=(MemberName="SpawnedCubes",MemberGuid=3D29F7D741AF95DB98E90AA0A7F7B1B4,bSelfContext=True)
 NodePosX=336
 NodePosY=272
 NodeGuid=FBCC3D03439B7BB1EEF1829AC48F9D84
 CustomProperties Pin (PinId=2656221340802C41494AA0BC1E304EC7,PinName="SpawnedCubes",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Activation/BP_Cube.BP_Cube_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallArrayFunction_3 4F0D0C1E42F568616BB9F1A30C39A2D6,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=81FAC4CF4B63460D630A5E90EBDFB3F4,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallArrayFunction Name="K2Node_CallArrayFunction_3" ExportPath="/Script/BlueprintGraph.K2Node_CallArrayFunction'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.K2Node_CallArrayFunction_3'"
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetArrayLibrary'",MemberName="Array_Remove")
 NodePosX=496
 NodePosY=224
 NodeGuid=0CBD81914678E826227F2D8DC3008F98
 CustomProperties Pin (PinId=AFDB62834649BE905C6317A84706DF07,PinName="execute",PinToolTip="\nExec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_5 553D014943C22F958DFD4FADD33B1C0B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=98C097794096C43DF3412AA0FE58E911,PinName="then",PinToolTip="\nExec",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_0 138E1210497668EB4F7BF1BB38985A52,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=0E1C4707456DBCD72B5F0EB976EDFB2B,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nKismet Array Library Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.KismetArrayLibrary'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__KismetArrayLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=4F0D0C1E42F568616BB9F1A30C39A2D6,PinName="TargetArray",PinToolTip="Target Array\nArray of BP Cube Object References\n\nThe array to remove from *",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Activation/BP_Cube.BP_Cube_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=True,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_6 2656221340802C41494AA0BC1E304EC7,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=799D6A684687470D9B4BEC93C2529097,PinName="IndexToRemove",PinToolTip="Index to Remove\nInteger\n\nThe index into the array to remove from",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0",AutogeneratedDefaultValue="0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_6" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.K2Node_CallFunction_6'"
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetSystemLibrary'",MemberName="Delay")
 NodePosX=-1280
 NodePosY=416
 NodeGuid=C8F13C56456A8BB58A16F8B1875E1F81
 CustomProperties Pin (PinId=DAC6A0244B615147C7F644B00349C3D7,PinName="execute",PinToolTip="\nExec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CustomEvent_1 F679A3914AACC1A5A1E642BBEA784923,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=1E4187274C9A0351578EFC83E6FF6025,PinName="then",PinFriendlyName=NSLOCTEXT("", "86441A314DE424F1C80A6A9CA2B893FE", "Completed"),PinToolTip="Completed\nExec",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_1 6DA725E842DAFF6AF5DA47B5CB3CD8F0,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=8E9AE0EE4FD218F7A1E779AA85347081,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nKismet System Library Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.KismetSystemLibrary'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__KismetSystemLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=4DD977174447C35E9D91468B48D99BE0,PinName="WorldContextObject",PinToolTip="World Context Object\nObject Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/CoreUObject.Object'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=4528BA704CEC7E820F9C5A8340D25CB3,PinName="Duration",PinToolTip="Duration\nFloat (single-precision)\n\nlength of delay (in seconds).",PinType.PinCategory="real",PinType.PinSubCategory="float",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.2",AutogeneratedDefaultValue="0.2",LinkedTo=(K2Node_VariableGet_0 992E9AB241D3E28DE6F48E91CF80F73D,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=753D81B948C1EAAA392211838B58D2B5,PinName="LatentInfo",PinToolTip="Latent Info\nLatent Action Info Structure\n\nThe latent action.",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/Engine.LatentActionInfo'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="(Linkage=-1,UUID=-1,ExecutionFunction=\"\",CallbackTarget=None)",AutogeneratedDefaultValue="LatentInfo",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableSet Name="K2Node_VariableSet_1" ExportPath="/Script/BlueprintGraph.K2Node_VariableSet'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.K2Node_VariableSet_1'"
 VariableReference=(MemberName="CanSpawn",MemberGuid=F764B4BD4B914FA9B1D1C090F5B3C31D,bSelfContext=True)
 NodePosX=-1024
 NodePosY=432
 NodeGuid=A8A876AC4AE8575FCDCB96BE1945E5BE
 CustomProperties Pin (PinId=6DA725E842DAFF6AF5DA47B5CB3CD8F0,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_6 1E4187274C9A0351578EFC83E6FF6025,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=3F9FD57F452266113BB204B0530B16FE,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=BE3F87134ACCC8CA1F0D6EB471A8A4AE,PinName="CanSpawn",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",AutogeneratedDefaultValue="false",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=4DC6A46D4F6C447E03F4A18FD98EBFD8,PinName="Output_Get",PinToolTip="Retrieves the value of the variable, can use instead of a separate Get node",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=6F2B46F34A5046161287F692DCFEE5E4,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_2" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.EdGraphNode_Comment_2'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=-1504
 NodePosY=352
 NodeWidth=707
 NodeHeight=218
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Wait for the SpawnCooldown and then set CanSpawn to True"
 NodeGuid=CA3C050448578AE47D83AEB2B11B7537
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_3" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.EdGraphNode_Comment_3'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=-1504
 NodePosY=-16
 NodeWidth=442
 NodeHeight=218
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Can we spawn a cube?"
 NodeGuid=FA4D53144AB54468258532A3E78FDF42
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_4" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.EdGraphNode_Comment_4'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=-1008
 NodePosY=-48
 NodeWidth=592
 NodeHeight=272
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Are the number of cubes spawned less than the max number of cubes that can spawn?"
 NodeGuid=C5AB85CB4DB39AED16EE998B8C02B14B
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_5" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.EdGraphNode_Comment_5'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=2800
 NodePosY=-48
 NodeWidth=320
 NodeHeight=224
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Reset the ability to spawn a cube"
 NodeGuid=0127FDEB4105EE4FF1C3389842DCC1BF
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_6" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.EdGraphNode_Comment_6'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=2448
 NodeWidth=291
 NodeHeight=181
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Set CanSpawn to False"
 NodeGuid=6815F88A45BE2B47C2A16E810F425694
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_7" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.EdGraphNode_Comment_7'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=1360
 NodePosY=-16
 NodeWidth=1067
 NodeHeight=445
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Spawn a cube and add the Actor reference to the SpawnedCubes array"
 NodeGuid=9214ABD04D55883F4B104095FF74042A
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_8" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.EdGraphNode_Comment_8'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=928
 NodePosY=-16
 NodeWidth=384
 NodeHeight=192
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Increase the CubeSpawned value by 1"
 NodeGuid=CA313D5346FAC28E6B58BBB552F652B5
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_9" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.EdGraphNode_Comment_9'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=-352
 NodePosY=128
 NodeWidth=615
 NodeHeight=256
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Destroy the first cube referenced in the array"
 NodeGuid=91EF4053492AE0912A97928CD67B5E7C
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_10" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.EdGraphNode_Comment_10'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=304
 NodePosY=144
 NodeWidth=512
 NodeHeight=224
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Remove the cube\'s reference from the array"
 NodeGuid=543E3CC344A2DA79A44A5BA3F2138908
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_Knot Name="K2Node_Knot_2" ExportPath="/Script/BlueprintGraph.K2Node_Knot'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.K2Node_Knot_2'"
 NodePosX=2080
 NodePosY=160
 NodeGuid=E1907D024D405A06ED947F8CE6F6A4F3
 CustomProperties Pin (PinId=D466A92B4CCF54092044A7A59A90AC6A,PinName="InputPin",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Activation/BP_Cube.BP_Cube_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_SpawnActorFromClass_0 BB0494EF47490EA37C8E8F985CA51973,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=A70230194208B85B5C1B05B8012C5128,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Activation/BP_Cube.BP_Cube_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_3 FEFBBDB847F7C22B1969679B5EDF0E1D,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_Knot Name="K2Node_Knot_3" ExportPath="/Script/BlueprintGraph.K2Node_Knot'/Game/AdventureGame/Designer/Blueprints/Activation/BP_CubeSpawn.BP_CubeSpawn:EventGraph.K2Node_Knot_3'"
 NodePosX=2176
 NodePosY=160
 NodeGuid=FD43AA974A5C6749C5F4A9A40B4E1D2D
 CustomProperties Pin (PinId=FEFBBDB847F7C22B1969679B5EDF0E1D,PinName="InputPin",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Activation/BP_Cube.BP_Cube_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_2 A70230194208B85B5C1B05B8012C5128,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=A3D1BB2F4A61F04C736A6297430BE32D,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Activation/BP_Cube.BP_Cube_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallArrayFunction_1 4F440C554CFCB638B66637A9D114A88A,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object

You can now exit the blueprint editor and return to the level editor.

## Add the Cube Spawn Blueprint to the Level

Next, you’ll set up a `BP_CubeSpawn` and a `BP_Switch` to the level.

The cube-spawner blueprint has no visual components, so you can place it within any geometry or art assets to create the effect of a cube falling out of that geometry.

Pick a location in your level and use the meshes in the **Content > LevelPrototyping > Meshes** folder to block out some geometry to represent the cube spawner.

If you’re using the sample level, you can place it in the space at the back of Room 1. For this example, we’ll use a cylinder to represent a pipe that the cubes can spawn inside and fall out of.

Then, to set up a `BP_CubeSpawn` in a level, follow these steps:

- In the **Content Browser**, navigate to the **Content > Adventure Game > Designer > Blueprints > Activation** folder.
- Drag the `BP_CubeSpawn` blueprint into a desired location in the level.
- From the **Content Browser**, drag the `BP_Switch` blueprint into the level within line of sight of the cube spawner.
- Select the `BP_Switch` actor in the level.
- In the **Details **panel, under the **Setup **section, add a new array element to the **Interact Object List**.
- Use the dropdown next to **Index [0]** to select the `BP_CubeSpawn` actor. This passes the **fnBPISwitchOn **event from this switch to the `BP_CubeSpawn` actor.
- Select the `BP_CubeSpawn` actor. Optionally change the **Max Cubes Allowed **variable to the number of cubes you want to allow in the level.

Now, if you play the game, you can step on the switch to spawn new cubes.

## Next Up

To continue working on your level by adding materials, lighting, post-process effects, sound, and visual effects, try the Artist Track Tutorial Series:

- [image: Art Pass for a Puzzle Adventure Game] Art Pass for a Puzzle Adventure GameLearn how you can apply art workflows with materials, sounds, and visual effects to the Puzzle Adventure game. (-> art-pass-for-a-puzzle-adventure-game)

If you are interested in packaging your project, as a standalone program to test and share, see the following documentation:

- [image: Packaging Unreal Engine Projects] Packaging Unreal Engine ProjectsPackaging Unreal game projects for distribution. (-> packaging-your-project)

On this page

- Before You Begin (-> designer-11-spawn-new-cubes-mechanic-in-unreal-engine)
- Create a New Blueprint (-> designer-11-spawn-new-cubes-mechanic-in-unreal-engine)
- Build the Cube-Spawning Logic (-> designer-11-spawn-new-cubes-mechanic-in-unreal-engine)
- Check Cube-Spawning Conditions (-> designer-11-spawn-new-cubes-mechanic-in-unreal-engine)
- Count Spawned Cubes and Destroy Extra Cubes (-> designer-11-spawn-new-cubes-mechanic-in-unreal-engine)
- Spawn a Cube (-> designer-11-spawn-new-cubes-mechanic-in-unreal-engine)
- Implement a Cooldown Timer (-> designer-11-spawn-new-cubes-mechanic-in-unreal-engine)
- Add the Cube Spawn Blueprint to the Level (-> designer-11-spawn-new-cubes-mechanic-in-unreal-engine)
- Next Up (-> designer-11-spawn-new-cubes-mechanic-in-unreal-engine)

Related documents

Design a Puzzle Adventure

 [image: Design a Puzzle Adventure] (-> design-a-puzzle-adventure-game-in-unreal-engine)Art Pass for a Puzzle Adventure Game

 [image: Art Pass for a Puzzle Adventure Game] (-> art-pass-for-a-puzzle-adventure-game)
