# Grappling Hook Movement Mode

https://dev.epicgames.com/documentation/en-us/unreal-engine/mover-03-grappling-hook-movement-mode?application_version=5.9

> Build a Movement Mode in C++ that gives a character the ability to grapple towards a target.

[image: Grappling Hook Movement Mode]

Learn to use this **Experimental** feature, but use caution when shipping with it.

When you created the sprinting movement modifier in Sprint Movement Modifier (-> mover-02-sprint-movement-modifier), you only needed to temporarily change an existing movement mode to make the character run faster. For grappling, you need the character to move in a completely new way: fly towards a grapple point in the environment and then fall once reaching that grapple point. To make the character move in this way, you’ll create a new Movement Mode that defines how the player character moves when using the Grappling Hook action.

When the player activates the Grappling Hook action, the new Movement Mode tests if the player is looking at a grapple point in range and starts interpolating the location of the player to the grapple point.

## Create the Grapple Point Blueprint

The grapple point Blueprint is the Actor spawned in the level that the player grapples towards. Your grapple point will have an emissive Material that lights up when the player is looking at it and it’s in grappling range.

### Create an Emissive Material

First, you’ll create a Material and Material Instance to use in the grapple point Blueprint.

A Material asset defines how a level object is rendered and a Material Instance is a lightweight version of that Material where you can customize exposed Material parameters. Grapple points use a Material Instance so Blueprints can increase the emissive intensity at runtime to indicate the player can grapple to that point.

To create the emissive Material and Material Instance, follow these steps:

- In the **Content Browser**, in the **Content > Parkour** folder, create a new folder named `Materials`.
- In the new **Materials **folder, right-click and create a new Material, and name it `M_Emissive`. This will be the parent of the Material Instance used in the Grappling Hook.
- Open the Material. In the **Material Graph**, in the Material root node, change **Roughness **and **Specular **to **0**.
- Create a **VectorParameter **node and name it `BaseColor`.
- Connect the **BaseColor **parameter node’s **RGB **value to the Material root node’s **Base Color** pin.
- Create another **VectorParameter **and name it `EmissiveColor`.
- Create a **ScalarParameter** and name it `Intensity`. Set its **Default Value** to **3**.
- Add a **Multiply **node to multiply **EmissiveColor **and **Intensity**. Connect the result to the Material root node’s **Emissive Color** pin.
- Click the **BaseColor **parameter node. In the **Details **panel, expand the** Default Value** section and set **R**, **G**, and **B **to **1**. Do the same for **EmissiveColor**.The final Material Graph should look like this:
- Click **Apply **and **Save**, and close the Material.
- Return to the **Content Browser**. Right-click **M_Emissive** and select **Create Material Instance**. Name it `MI_EmissiveBlue`.
- Open the Material Instance. Override and change these parameter values: Set **EmissiveColor **to a blue color.
- Set **Intensity **to **0**. The grapple point should start dull and white and only become emissive and blue when active.

- Save and close the Material Instance.

### Set up Grapple Point Appearance

In this tutorial, the grapple point is a simple rectangular prism. You can follow this design or create your own look for the grapple points.

To set up the Grapple Point Blueprint, follow these steps:

- In the **Content Browser**, in the **Content > Parkour > Blueprints** folder, right-click and create a new Blueprint Class.
- Select **Actor **as the parent class.
- Name the Blueprint `BP_GrapplePoint` and open it.
- In the Blueprint Editor, in the **Components **panel, select **DefaultSceneRoot**, click **Add**, and add a **Static Mesh** component. The mesh should be a child of the scene root.
- Name the mesh component `GrapplePoint`.
- In the **Details **panel, set the **Static Mesh** to **SM_Ramp**.
- Click **Compile**.If you can’t see the mesh in the Viewport, zoom out.
- In the **Materials **section, set **Element 0** to **MI_EmissiveBlue**.
- Transform the prism shape so the flat, square side is facing up and is a 0.5m square:Set the **Rotation X** value to **-45**.
- Set the **Scale X**, **Y**, and **Z** values to **0.5**.

### Add Grapple Point Logic

The grapple point should test its distance from the player and if the player camera is pointed at the grapple point. If the conditions pass, it should increase its Material’s emissive intensity and start to glow.

#### Store the Player Pawn as a Variable

To get and save the player Pawn, follow these steps:

- Go to BP_GrapplePoint’s **EventGraph **tab.
- From** Event BeginPlay**, drag off the exec pin and create a **Get Player Controller from Input Device** node.
- Drag off the** Return Value** pin and add a **Get Controlled Pawn** node.
- Before saving the Pawn object, check if it’s the expected Pawn type. Drag off the **Get Controlled Pawn** node’s **Return Value** pin and add a **Cast to BaseAnimatedMannyPawn** node.You cast to the Pawn’s parent `BaseAnimatedMannyPawn` class here because it’s the most general Pawn type that exposes the components you need in this Blueprint (the direction of the Pawn’s camera component in this case).
- Connect the exec flow from **Get Player Controller** to the **Cast To** node.
- If the **Cast To** succeeds, store the typed reference to the Pawn:In the **Cast To** node, right-click the **As Base Animated Manny Pawn** pin and select **Promote to Variable**.
- In the **My Blueprint** panel, rename the new variable `PlayerPawn`.

#### Change a Grapple Point’s Glow

Every frame, the Blueprint should lower or raise emissive intensity depending on whether the grapple point is within range and in the player’s line of sight.

To make the grapple point stop glowing when grappling conditions aren’t met, follow these steps:

- In the My Blueprint panel, create a new variable of type float named CurrentIntensity. You’ll use this variable to store the grapple point Material’s current state.
- From **Event Tick**, create a **Branch **node. This Branch will check if the distance between the grapple point Actor and player is less than 20 meters and returns False if out of range. You’ll set up its Condition later.
- From the **False **exec pin, add a **Set Current Intensity** node and keep the value **0**.
- Drag off the **Set **node’s exec pin and add a **Set Scalar Parameter Value on Materials** node:The **Target **should be the **Grapple Point** mesh.
- For the **Parameter Value** pin, connect the **Set **node’s output pin.
- For the **Parameter Name**, enter **Intensity**.

To make the grapple point glow when both grappling conditions are met, follow these steps:

- From the **Branch **node’s **True **pin, add another **Branch **node.This second Branch node compares the vectors of the grapple point and player camera. It returns True if the vectors are roughly aligned (player is looking at the grapple point) and False if they are not aligned (player is looking away). You’ll set up the condition later.
- Connect the second **Branch **node’s **False **pin to the **Set Current Intensity = 0.0** node so the **False **result of both Branch nodes turns off the grapple point’s glow.
- Select the **Set Current Intensity**, **Set Scalar Parameter**, and **Grapple Point **nodes. Press** Ctrl + D** to duplicate them and move the copies above the originals, after the second **Branch **node.
- Connect the second **Branch **node’s **True **pin to the new **Set Current Intensity** node, and change the value to `3.0`.

#### Check for Distance to Player

Now you’ll build the conditions for each Branch node.

To test if the player is in range of the grapple point, subtract the player’s location from the grapple point’s location, get the length of that vector, and check if it is less than 20 meters (2000 units).

Instead of using a **Distance (Vector)** node, these instructions split the distance calculation into two steps so you can use the result of the subtraction operation for a future calculation.

To add the condition that tests player distance from a grapple point Actor, follow these steps:

- To the left of the** Event Tick** node, add two** Get Actor Location** nodes, placing one above the other.
- For the second **Get Actor Location** node, from the **My Blueprint** panel, drag the **Player Pawn** variable onto the **Target **pin.
- Connect both** Get Actor Location** nodes to a new **Subtract **node.
- Drag the **Subtract **node’s output pin and add a **Vector Length** node to calculate the distance.
- Drag off the** Return Value** pin and add a **Less (
- Drag off the **Subtract **node’s output pin and add a **Normalize **node above your **Event Tick** logic.Normalizing the vector converts it to a direction only, no length.
- Get the direction of the player camera:Under the **Normalize **node, add a **Get Player Pawn** variable reference.
- Drag off **Player Pawn**’s pin, search for `get camera variable`, and add a **Get Camera** node.
- Drag off the **Camera **pin and add a **Get Forward Vector** node (in the **Transformation **section of the node actions list).

- To compare two vector directions, get the dot product of those vectors. Add a** Dot Product** node and connect the **Normalize **and** Get Forward Vector** nodes to the **Dot **node’s inputs.
- The dot product returns a 1 if the vectors are perfectly aligned, 0 if perpendicular, and -1 if the vectors point in the opposite direction. To make the grapple point activate when the player is roughly looking at it rather than aiming directly at it, add some tolerance to the dot product result. Drag off the dot product’s result and add a **Greater (>) **node. Enter `0.88` as the node’s second input.
- Connect the Greater node’s output pin to the second Branch node’s Condition pin. If the dot product of the player and grapple point direction vectors is greater than 0.88, the Branch returns true.
- Save and compile the Blueprint.

The finished event graph should look like this:

 Blueprint

Begin Object Class=/Script/BlueprintGraph.K2Node_Event Name="K2Node_Event_0" ExportPath="/Script/BlueprintGraph.K2Node_Event'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook:EventGraph.K2Node_Event_0'"
 EventReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.Actor'",MemberName="ReceiveBeginPlay")
 bOverrideFunction=True
 NodePosX=-16
 NodePosY=192
 bCommentBubblePinned=True
 NodeGuid=CF0FDEEC4A336B491755D6B9D0389300
 CustomProperties Pin (PinId=E25B56AA4FC60E13586CBAA085D6A493,PinName="OutputDelegate",Direction="EGPD_Output",PinType.PinCategory="delegate",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.Actor'",MemberName="ReceiveBeginPlay"),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=7DC92DFE46CE4899253AF6AA070B522C,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_0 61EBB875407EA58DBEBD90BD00D195F9,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_Event Name="K2Node_Event_2" ExportPath="/Script/BlueprintGraph.K2Node_Event'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook:EventGraph.K2Node_Event_2'"
 EventReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.Actor'",MemberName="ReceiveTick")
 bOverrideFunction=True
 NodePosX=112
 NodePosY=768
 bCommentBubblePinned=True
 NodeGuid=CA4966A841379C460A4916B5026917E2
 CustomProperties Pin (PinId=B1EB715945974ADD01F931800D597B09,PinName="OutputDelegate",Direction="EGPD_Output",PinType.PinCategory="delegate",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.Actor'",MemberName="ReceiveTick"),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=8ED59B8E41127245CDEE1FBE06F6AA87,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_0 F267BDA54533D5F1280C5DBF25C2075B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=7D12689F4A67CE8C937AE08DA1D31008,PinName="DeltaSeconds",PinToolTip="Delta Seconds\nFloat (single-precision)",Direction="EGPD_Output",PinType.PinCategory="real",PinType.PinSubCategory="float",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_0" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook:EventGraph.K2Node_CallFunction_0'"
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.InputDeviceLibrary'",MemberName="GetPlayerControllerFromInputDevice")
 NodePosX=240
 NodePosY=192
 NodeGuid=EDA62E7F4F6FA28456E5AD99189970C3
 CustomProperties Pin (PinId=61EBB875407EA58DBEBD90BD00D195F9,PinName="execute",PinToolTip="\nExec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Event_0 7DC92DFE46CE4899253AF6AA070B522C,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=383ACD3A46912D7F8D87AB83450D35FA,PinName="then",PinToolTip="\nExec",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_DynamicCast_0 C4CC77AB46E0E7FBA9171BA80036B163,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=984274194CC3F969723BF1B56B0872FA,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nInput Device Library Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.InputDeviceLibrary'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__InputDeviceLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=81063A4E4216375BBD1F74A8AF6E19C7,PinName="DeviceId",PinToolTip="Device Id\nInput Device Id Structure",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/CoreUObject.InputDeviceId'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=8240A3F6406F41FF042DE587FE2CFA5D,PinName="ReturnValue",PinToolTip="Return Value\nPlayer Controller Object Reference",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.PlayerController'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_1 76FB347848A7FE563AFDC1AAA713F383,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_1" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook:EventGraph.K2Node_CallFunction_1'"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.Controller'",MemberName="K2_GetPawn")
 NodePosX=576
 NodePosY=256
 NodeGuid=D6C447964F08CCEAA7AFCA8904B1A0A4
 CustomProperties Pin (PinId=76FB347848A7FE563AFDC1AAA713F383,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nController Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Controller'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_0 8240A3F6406F41FF042DE587FE2CFA5D,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=AEAEDC5C48CB3D4E83AED3A9402AE90E,PinName="ReturnValue",PinToolTip="Return Value\nPawn Object Reference",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Pawn'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_DynamicCast_0 D9D8F9EF4DC4DF0D6F1990AACA5467CF,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_DynamicCast Name="K2Node_DynamicCast_0" ExportPath="/Script/BlueprintGraph.K2Node_DynamicCast'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook:EventGraph.K2Node_DynamicCast_0'"
 TargetType="/Script/Engine.BlueprintGeneratedClass'/MoverExamples/Pawns/BaseAnimatedMannyPawn.BaseAnimatedMannyPawn_C'"
 NodePosX=832
 NodePosY=192
 NodeGuid=1D45E2A7456F7B376B5637BF91775EBD
 CustomProperties Pin (PinId=C4CC77AB46E0E7FBA9171BA80036B163,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_0 383ACD3A46912D7F8D87AB83450D35FA,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=56DE54A04080A2CDA5812FBF3BFC94EE,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_0 461C3CB54D0D4580B983CE85694AFDE5,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=BA73F4A34CB743B709A7A78C123CCD29,PinName="CastFailed",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D9D8F9EF4DC4DF0D6F1990AACA5467CF,PinName="Object",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/CoreUObject.Object'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_1 AEAEDC5C48CB3D4E83AED3A9402AE90E,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D3C98665492633092755A0A0140DFD3E,PinName="AsBase Animated Manny Pawn",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/MoverExamples/Pawns/BaseAnimatedMannyPawn.BaseAnimatedMannyPawn_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_0 6CA05CA2463E5CE52F6CC4BD68C19DCD,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=A9B3AD024ABF0916E63CFDA3BE9E64A1,PinName="bSuccess",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableSet Name="K2Node_VariableSet_0" ExportPath="/Script/BlueprintGraph.K2Node_VariableSet'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook:EventGraph.K2Node_VariableSet_0'"
 VariableReference=(MemberName="PlayerPawn",MemberGuid=DDA09DA84605B768E98B26834B572D79,bSelfContext=True)
 NodePosX=1184
 NodePosY=208
 NodeGuid=A8B9F60E42573288AE1192AFB7DFE94D
 CustomProperties Pin (PinId=461C3CB54D0D4580B983CE85694AFDE5,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_DynamicCast_0 56DE54A04080A2CDA5812FBF3BFC94EE,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=498266B24DBD3A49BF61408861B0809A,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=6CA05CA2463E5CE52F6CC4BD68C19DCD,PinName="PlayerPawn",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/MoverExamples/Pawns/BaseAnimatedMannyPawn.BaseAnimatedMannyPawn_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_DynamicCast_0 D3C98665492633092755A0A0140DFD3E,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=E6D86C37405E638A4A83DEB73C3E384C,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=7400DC0441AE992640A4C89187556355,PinName="Output_Get",PinToolTip="Retrieves the value of the variable, can use instead of a separate Get node",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/MoverExamples/Pawns/BaseAnimatedMannyPawn.BaseAnimatedMannyPawn_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_IfThenElse Name="K2Node_IfThenElse_0" ExportPath="/Script/BlueprintGraph.K2Node_IfThenElse'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook:EventGraph.K2Node_IfThenElse_0'"
 NodePosX=320
 NodePosY=800
 NodeGuid=F80157224F2B8B7D500226BAC2363C88
 CustomProperties Pin (PinId=F267BDA54533D5F1280C5DBF25C2075B,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Event_2 8ED59B8E41127245CDEE1FBE06F6AA87,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=57B8172149AB661886EBAD96DC31EDE6,PinName="Condition",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",AutogeneratedDefaultValue="true",LinkedTo=(K2Node_PromotableOperator_1 7F5592CC4F63672C4702808109028E82,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=A24A16A74C2DE056A4ED14B644510650,PinName="then",PinFriendlyName=NSLOCTEXT("K2Node", "true", "true"),Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_1 726232714C36D5CFE07BF590315547A5,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F8B74670477749AB81957CA77B8EC999,PinName="else",PinFriendlyName=NSLOCTEXT("K2Node", "false", "false"),Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_2 F927F7BF4B52DD0D3BBA39BB5C7ACBDD,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableSet Name="K2Node_VariableSet_2" ExportPath="/Script/BlueprintGraph.K2Node_VariableSet'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook:EventGraph.K2Node_VariableSet_2'"
 VariableReference=(MemberName="CurrentIntensity",MemberGuid=208C8AF34D75D936D28C8FB6B9EB4A34,bSelfContext=True)
 NodePosX=912
 NodePosY=848
 NodeGuid=33BBCA1643D8E63729F170AFCA773B63
 CustomProperties Pin (PinId=F927F7BF4B52DD0D3BBA39BB5C7ACBDD,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_0 F8B74670477749AB81957CA77B8EC999,K2Node_IfThenElse_1 F4DF17204FD403E7E31FC3BF40B07A49,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=FD16787C478B031BDC314B9107282F48,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_11 5DA5970A475652BA241EB89BD1BA97A3,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=FEF84AA145C4EAE952B073B351634572,PinName="CurrentIntensity",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=744A8B61483C71E4174B2DA9EC5961F2,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=24CD17864B1FAD825A4565BB74ED1059,PinName="Output_Get",PinToolTip="Retrieves the value of the variable, can use instead of a separate Get node",Direction="EGPD_Output",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_Knot_1 450C98A84D5A30529AB4FCB1144E2DE1,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_11" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook:EventGraph.K2Node_CallFunction_11'"
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.MeshComponent'",MemberName="SetScalarParameterValueOnMaterials")
 NodePosX=1344
 NodePosY=816
 NodeGuid=E42F6CDA4BDDF3F5FA16EB97060BAD0D
 CustomProperties Pin (PinId=5DA5970A475652BA241EB89BD1BA97A3,PinName="execute",PinToolTip="\nExec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_2 FD16787C478B031BDC314B9107282F48,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F457EC0A497252906CD2D382679ED6AE,PinName="then",PinToolTip="\nExec",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=98C30EBB4EB43EE80BAE86A0328E9011,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nMesh Component Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.MeshComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_4 1A7D47894609EF81150547A4982696C8,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=76CDE815413DEE51994E99AAF25AFA83,PinName="ParameterName",PinToolTip="Parameter Name\nName",PinType.PinCategory="name",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="Intensity",AutogeneratedDefaultValue="None",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=1842AA3048BA0CFEEF3607B5165F39E5,PinName="ParameterValue",PinToolTip="Parameter Value\nFloat (single-precision)",PinType.PinCategory="real",PinType.PinSubCategory="float",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_Knot_1 7552179B4F93B0D1FF53FD84AF6DAA47,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_4" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook:EventGraph.K2Node_VariableGet_4'"
 VariableReference=(MemberName="GrapplePoint",bSelfContext=True)
 NodePosX=1184
 NodePosY=896
 NodeGuid=81132D294FBD9C44C71EFDBFCA2AFF21
 CustomProperties Pin (PinId=1A7D47894609EF81150547A4982696C8,PinName="GrapplePoint",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMeshComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_11 98C30EBB4EB43EE80BAE86A0328E9011,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=328DBFBB437E165590E2D5989AA6508B,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_Knot Name="K2Node_Knot_1" ExportPath="/Script/BlueprintGraph.K2Node_Knot'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook:EventGraph.K2Node_Knot_1'"
 NodePosX=1168
 NodePosY=979
 NodeGuid=B2E29C604CFD626478614D85306D851D
 CustomProperties Pin (PinId=450C98A84D5A30529AB4FCB1144E2DE1,PinName="InputPin",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_2 24CD17864B1FAD825A4565BB74ED1059,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=7552179B4F93B0D1FF53FD84AF6DAA47,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_11 1842AA3048BA0CFEEF3607B5165F39E5,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_4" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook:EventGraph.K2Node_CallFunction_4'"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberName="K2_GetActorLocation",bSelfContext=True)
 NodePosX=-627
 NodePosY=961
 NodeGuid=19B9A2B4451467809C3BE4B732861B93
 CustomProperties Pin (PinId=2B18608947AC47FD63B3E08ACEE2DBA7,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nActor Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=8B96DC444FC77C9CEA999880956DA953,PinName="ReturnValue",PinToolTip="Return Value\nVector",Direction="EGPD_Output",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/CoreUObject.Vector'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0, 0, 0",AutogeneratedDefaultValue="0, 0, 0",LinkedTo=(K2Node_PromotableOperator_0 D4A30E4F4A348ADE321E69BBBF76467B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_3" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook:EventGraph.K2Node_CallFunction_3'"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberName="K2_GetActorLocation",bSelfContext=True)
 NodePosX=-611
 NodePosY=1121
 NodeGuid=BB8468E14D464A01479D0CB8C92D831C
 CustomProperties Pin (PinId=2B18608947AC47FD63B3E08ACEE2DBA7,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nActor Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_1 D6E753B442763E86167373A1EB25E879,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=8B96DC444FC77C9CEA999880956DA953,PinName="ReturnValue",PinToolTip="Return Value\nVector",Direction="EGPD_Output",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/CoreUObject.Vector'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0, 0, 0",AutogeneratedDefaultValue="0, 0, 0",LinkedTo=(K2Node_PromotableOperator_0 E669313941DA204787F20EB0207A4AC3,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_1" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook:EventGraph.K2Node_VariableGet_1'"
 VariableReference=(MemberName="PlayerPawn",MemberGuid=DDA09DA84605B768E98B26834B572D79,bSelfContext=True)
 NodePosX=-771
 NodePosY=1153
 NodeGuid=F6F11C704539F1F0DCD074A76C4DC024
 CustomProperties Pin (PinId=D6E753B442763E86167373A1EB25E879,PinName="PlayerPawn",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/MoverExamples/Pawns/BaseAnimatedMannyPawn.BaseAnimatedMannyPawn_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_3 2B18608947AC47FD63B3E08ACEE2DBA7,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=97413630485B40313716F7BDE9B42844,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_PromotableOperator Name="K2Node_PromotableOperator_0" ExportPath="/Script/BlueprintGraph.K2Node_PromotableOperator'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook:EventGraph.K2Node_PromotableOperator_0'"
 OperationName="Subtract"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetMathLibrary'",MemberName="Subtract_VectorVector")
 NodePosX=-371
 NodePosY=1041
 NodeGuid=0C8444B04F47A10DDF660BAD27A0B185
 CustomProperties Pin (PinId=D4A30E4F4A348ADE321E69BBBF76467B,PinName="A",PinToolTip="A\nVector",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/CoreUObject.Vector'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_4 8B96DC444FC77C9CEA999880956DA953,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=E669313941DA204787F20EB0207A4AC3,PinName="B",PinToolTip="B\nVector",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/CoreUObject.Vector'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_3 8B96DC444FC77C9CEA999880956DA953,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=227F0B4F42F3A3868BB6DAAB2096EFBC,PinName="ReturnValue",PinToolTip="Return Value\nVector",Direction="EGPD_Output",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/CoreUObject.Vector'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_5 A91B25D2408F75F29EBF248FDE3BDA36,K2Node_CallFunction_6 1A6568864AF8C801EA61B2A44B90C9A7,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_5" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook:EventGraph.K2Node_CallFunction_5'"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetMathLibrary'",MemberName="VSize")
 NodePosX=-195
 NodePosY=1073
 NodeGuid=19C066EB43798B81633BD095622A5DF0
 CustomProperties Pin (PinId=55066740429E156776C915AA013421D3,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nKismet Math Library Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.KismetMathLibrary'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__KismetMathLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=A91B25D2408F75F29EBF248FDE3BDA36,PinName="A",PinToolTip="A\nVector",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/CoreUObject.Vector'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0, 0, 0",AutogeneratedDefaultValue="0, 0, 0",LinkedTo=(K2Node_PromotableOperator_0 227F0B4F42F3A3868BB6DAAB2096EFBC,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=2AA75A744A715241C90597B945EF64F5,PinName="ReturnValue",PinToolTip="Return Value\nFloat (double-precision)",Direction="EGPD_Output",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_PromotableOperator_1 B490350A4CE908A2301774954675A8A3,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_PromotableOperator Name="K2Node_PromotableOperator_1" ExportPath="/Script/BlueprintGraph.K2Node_PromotableOperator'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook:EventGraph.K2Node_PromotableOperator_1'"
 OperationName="Less"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetMathLibrary'",MemberName="Less_DoubleDouble")
 NodePosX=29
 NodePosY=1105
 NodeGuid=6556D343487E97A889BFAE8632E6502B
 CustomProperties Pin (PinId=B490350A4CE908A2301774954675A8A3,PinName="A",PinToolTip="A\nFloat (double-precision)",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_5 2AA75A744A715241C90597B945EF64F5,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=DEA3E616448BE21FF2970D9901F85CD7,PinName="B",PinToolTip="B\nFloat (double-precision)",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="2000.000000",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=7F5592CC4F63672C4702808109028E82,PinName="ReturnValue",PinToolTip="Return Value\nBoolean",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_0 57B8172149AB661886EBAD96DC31EDE6,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=EEB879EF4DA4859A27E067B254A5569D,PinName="ErrorTolerance",PinToolTip="Error Tolerance\n",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_0" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook:EventGraph.EdGraphNode_Comment_0'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=-784
 NodePosY=896
 NodeWidth=1024
 NodeHeight=336
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Is the player less than 20 meters from the grapple point?"
 NodeGuid=1B215A2846154343C4CFF1A4FA322CCD
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_IfThenElse Name="K2Node_IfThenElse_1" ExportPath="/Script/BlueprintGraph.K2Node_IfThenElse'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook:EventGraph.K2Node_IfThenElse_1'"
 NodePosX=656
 NodePosY=672
 NodeGuid=16EE471A4AEFBCC424FB549BAB952F8A
 CustomProperties Pin (PinId=726232714C36D5CFE07BF590315547A5,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_0 A24A16A74C2DE056A4ED14B644510650,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=7E65EBAC4C13ED5D9F46CDBCC28E6014,PinName="Condition",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",AutogeneratedDefaultValue="true",LinkedTo=(K2Node_PromotableOperator_2 8996FB374A6D1F944993D694DAF523D9,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=A837F60D4D38D512FE33B084DB90272B,PinName="then",PinFriendlyName=NSLOCTEXT("K2Node", "true", "true"),Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_3 F927F7BF4B52DD0D3BBA39BB5C7ACBDD,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F4DF17204FD403E7E31FC3BF40B07A49,PinName="else",PinFriendlyName=NSLOCTEXT("K2Node", "false", "false"),Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_2 F927F7BF4B52DD0D3BBA39BB5C7ACBDD,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_6" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook:EventGraph.K2Node_CallFunction_6'"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetMathLibrary'",MemberName="Normal")
 NodePosX=-144
 NodePosY=480
 NodeGuid=B2DFCAB4492BBA30F08330B375A20D4A
 CustomProperties Pin (PinId=9046C2C148F3EA9D7B00E2963F8C0CAE,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nKismet Math Library Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.KismetMathLibrary'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__KismetMathLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=1A6568864AF8C801EA61B2A44B90C9A7,PinName="A",PinToolTip="A\nVector",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/CoreUObject.Vector'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0, 0, 0",AutogeneratedDefaultValue="0, 0, 0",LinkedTo=(K2Node_PromotableOperator_0 227F0B4F42F3A3868BB6DAAB2096EFBC,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=0F0D34724F9F269F4ACE1293B1A58826,PinName="Tolerance",PinToolTip="Tolerance\nFloat (single-precision)\n\nMinimum squared vector length.",PinType.PinCategory="real",PinType.PinSubCategory="float",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.000100",AutogeneratedDefaultValue="0.000100",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=456C77CA4A22CEF3814629A6B72DAAE0,PinName="ReturnValue",PinToolTip="Return Value\nVector\n\nA normalized copy if safe, (0,0,0) otherwise.",Direction="EGPD_Output",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/CoreUObject.Vector'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0, 0, 0",AutogeneratedDefaultValue="0, 0, 0",LinkedTo=(K2Node_CallFunction_8 ABF03BBA442DA6C7BBB90DB67C102020,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_2" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook:EventGraph.K2Node_VariableGet_2'"
 VariableReference=(MemberName="PlayerPawn",MemberGuid=DDA09DA84605B768E98B26834B572D79,bSelfContext=True)
 NodePosX=-448
 NodePosY=640
 NodeGuid=80CB4ADB4227E3803DAD6B825487E2ED
 CustomProperties Pin (PinId=D36818234BCC8E952897519F17A6EF9B,PinName="PlayerPawn",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/MoverExamples/Pawns/BaseAnimatedMannyPawn.BaseAnimatedMannyPawn_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_3 C30DDBB84AB9F73BBED892A5567612D1,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F1186432401397E92C80328B2D7EE27B,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_3" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook:EventGraph.K2Node_VariableGet_3'"
 VariableReference=(MemberParent="/Script/Engine.BlueprintGeneratedClass'/MoverExamples/Pawns/BaseAnimatedMannyPawn.BaseAnimatedMannyPawn_C'",MemberName="Camera")
 SelfContextInfo=NotSelfContext
 NodePosX=-288
 NodePosY=640
 NodeGuid=897DAF034D1A906F46938C8A548B8D3D
 CustomProperties Pin (PinId=98D5CC4B4FCF258BC3A28DAF0E9FB492,PinName="Camera",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.CameraComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_10 4548B6E542B7FF3CF144CD953F6A3BEB,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=C30DDBB84AB9F73BBED892A5567612D1,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/MoverExamples/Pawns/BaseAnimatedMannyPawn.BaseAnimatedMannyPawn_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_2 D36818234BCC8E952897519F17A6EF9B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_8" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook:EventGraph.K2Node_CallFunction_8'"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetMathLibrary'",MemberName="Dot_VectorVector")
 NodePosX=176
 NodePosY=560
 NodeGuid=14223D9940050B7F3DAA2BABACE499F4
 CustomProperties Pin (PinId=9FBCB84042280141F1BB42A3A91662AC,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nKismet Math Library Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.KismetMathLibrary'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__KismetMathLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=ABF03BBA442DA6C7BBB90DB67C102020,PinName="A",PinToolTip="A\nVector",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/CoreUObject.Vector'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0, 0, 0",AutogeneratedDefaultValue="0, 0, 0",LinkedTo=(K2Node_CallFunction_6 456C77CA4A22CEF3814629A6B72DAAE0,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=9E3D47D94A3539D4376E79B8E8D6E946,PinName="B",PinToolTip="B\nVector",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/CoreUObject.Vector'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0, 0, 0",AutogeneratedDefaultValue="0, 0, 0",LinkedTo=(K2Node_CallFunction_10 0675FA764B94B9A38788F8B130B0976A,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=C8E3CC674334A2B3A23644AAAC1EAF6D,PinName="ReturnValue",PinToolTip="Return Value\nFloat (double-precision)",Direction="EGPD_Output",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_PromotableOperator_2 013CB4FB409EDB9FDB09748B41DFB771,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_10" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook:EventGraph.K2Node_CallFunction_10'"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.SceneComponent'",MemberName="GetForwardVector")
 NodePosX=-80
 NodePosY=608
 NodeGuid=A147DC864242CC97CFB31497E052A559
 CustomProperties Pin (PinId=4548B6E542B7FF3CF144CD953F6A3BEB,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nScene Component Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.SceneComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_3 98D5CC4B4FCF258BC3A28DAF0E9FB492,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=0675FA764B94B9A38788F8B130B0976A,PinName="ReturnValue",PinToolTip="Return Value\nVector",Direction="EGPD_Output",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/CoreUObject.Vector'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0, 0, 0",AutogeneratedDefaultValue="0, 0, 0",LinkedTo=(K2Node_CallFunction_8 9E3D47D94A3539D4376E79B8E8D6E946,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_PromotableOperator Name="K2Node_PromotableOperator_2" ExportPath="/Script/BlueprintGraph.K2Node_PromotableOperator'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook:EventGraph.K2Node_PromotableOperator_2'"
 OperationName="Greater"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetMathLibrary'",MemberName="Greater_DoubleDouble")
 NodePosX=400
 NodePosY=576
 NodeGuid=B2582F95445E2234CF85F5B45F1700CC
 CustomProperties Pin (PinId=013CB4FB409EDB9FDB09748B41DFB771,PinName="A",PinToolTip="A\nFloat (double-precision)",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_8 C8E3CC674334A2B3A23644AAAC1EAF6D,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F156D8E04C22FF2817F0BA89BDF11EA4,PinName="B",PinToolTip="B\nFloat (double-precision)",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.880000",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=8996FB374A6D1F944993D694DAF523D9,PinName="ReturnValue",PinToolTip="Return Value\nBoolean",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_1 7E65EBAC4C13ED5D9F46CDBCC28E6014,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=BEF5FFAF44461FA233DDEC907E44C0E3,PinName="ErrorTolerance",PinToolTip="Error Tolerance\n",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableSet Name="K2Node_VariableSet_3" ExportPath="/Script/BlueprintGraph.K2Node_VariableSet'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook:EventGraph.K2Node_VariableSet_3'"
 VariableReference=(MemberName="CurrentIntensity",MemberGuid=208C8AF34D75D936D28C8FB6B9EB4A34,bSelfContext=True)
 NodePosX=912
 NodePosY=544
 NodeGuid=E98C25774878CB6779052193A1ED2C31
 CustomProperties Pin (PinId=F927F7BF4B52DD0D3BBA39BB5C7ACBDD,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_1 A837F60D4D38D512FE33B084DB90272B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=FD16787C478B031BDC314B9107282F48,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_12 5DA5970A475652BA241EB89BD1BA97A3,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=FEF84AA145C4EAE952B073B351634572,PinName="CurrentIntensity",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="3.000000",AutogeneratedDefaultValue="0.0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=24CD17864B1FAD825A4565BB74ED1059,PinName="Output_Get",PinToolTip="Retrieves the value of the variable, can use instead of a separate Get node",Direction="EGPD_Output",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_Knot_2 450C98A84D5A30529AB4FCB1144E2DE1,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=744A8B61483C71E4174B2DA9EC5961F2,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_12" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook:EventGraph.K2Node_CallFunction_12'"
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.MeshComponent'",MemberName="SetScalarParameterValueOnMaterials")
 NodePosX=1344
 NodePosY=512
 NodeGuid=22B11E58475907817BD278BD6E997F40
 CustomProperties Pin (PinId=5DA5970A475652BA241EB89BD1BA97A3,PinName="execute",PinToolTip="\nExec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_3 FD16787C478B031BDC314B9107282F48,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F457EC0A497252906CD2D382679ED6AE,PinName="then",PinToolTip="\nExec",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=98C30EBB4EB43EE80BAE86A0328E9011,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nMesh Component Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.MeshComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_5 1A7D47894609EF81150547A4982696C8,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=76CDE815413DEE51994E99AAF25AFA83,PinName="ParameterName",PinToolTip="Parameter Name\nName",PinType.PinCategory="name",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="Intensity",AutogeneratedDefaultValue="None",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=1842AA3048BA0CFEEF3607B5165F39E5,PinName="ParameterValue",PinToolTip="Parameter Value\nFloat (single-precision)",PinType.PinCategory="real",PinType.PinSubCategory="float",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_Knot_2 7552179B4F93B0D1FF53FD84AF6DAA47,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_5" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook:EventGraph.K2Node_VariableGet_5'"
 VariableReference=(MemberName="GrapplePoint",bSelfContext=True)
 NodePosX=1184
 NodePosY=592
 NodeGuid=93ECE79F411A5F424FA18B94A8490810
 CustomProperties Pin (PinId=1A7D47894609EF81150547A4982696C8,PinName="GrapplePoint",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMeshComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_12 98C30EBB4EB43EE80BAE86A0328E9011,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=328DBFBB437E165590E2D5989AA6508B,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_Knot Name="K2Node_Knot_2" ExportPath="/Script/BlueprintGraph.K2Node_Knot'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook:EventGraph.K2Node_Knot_2'"
 NodePosX=1168
 NodePosY=672
 NodeGuid=852F95E94A411D369151AC8904C3F987
 CustomProperties Pin (PinId=450C98A84D5A30529AB4FCB1144E2DE1,PinName="InputPin",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_3 24CD17864B1FAD825A4565BB74ED1059,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=7552179B4F93B0D1FF53FD84AF6DAA47,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_12 1842AA3048BA0CFEEF3607B5165F39E5,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_1" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook:EventGraph.EdGraphNode_Comment_1'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=-480
 NodePosY=416
 NodeWidth=1072
 NodeHeight=288
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Is the player approximately facing the same direction as the grapple point?"
 NodeGuid=C0EA54524873BC3FF455A19BB0DB17A2
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_2" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook:EventGraph.EdGraphNode_Comment_2'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=871
 NodePosY=445
 NodeWidth=816
 NodeHeight=288
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Activate grapple point glow"
 NodeGuid=1BA0FE7248E276AB11E72A886312B324
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_3" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook:EventGraph.EdGraphNode_Comment_3'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=871
 NodePosY=751
 NodeWidth=816
 NodeHeight=288
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Deactivate grapple point glow"
 NodeGuid=E265260041A9F657758C518AFF1FB615
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_4" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/Parkour/Blueprints/BP_GrapplingHook.BP_GrapplingHook:EventGraph.EdGraphNode_Comment_4'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=-80
 NodePosY=128
 NodeWidth=1472
 NodeHeight=241
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Save the player pawn"
 NodeGuid=69FC0082420287EB7D8FAC835C6DEAD9
End Object

### Test the Grapple Point

Return to the level editor, add a **BP_GrapplePoint** to your level, and play the level and check that it's a plain color when looking away, and emissive when looking at it.

## Build the Grappling Hook Actor Component

When implementing mechanics with Mover, keep in mind that only one Movement Mode can be active at a time. When a Movement Mode isn’t active, its code isn’t running, so it can’t continuously check for the conditions it requires to activate. To switch between Movement Modes, you need another system that can act as a link between the game, player, and a Movement Mode. You can build a new Actor Component class and add it to your character to act as this link. The Actor Component checks for the conditions required to queue a Movement Mode.

Here, the Grappling Hook Actor Component checks whether the player is aiming at a grapple point in range. If they are, the character can queue the Grappling Hook Movement Mode with the grapple point information gathered by the Actor Component.

When building characters in Unreal Engine, implement character gameplay abilities as Actor Components to keep them modular and reusable across various characters.

### Create the Actor Component Class

To set up a new Grappling Hook component, follow these steps:

- In Unreal Editor, go to **Tools > New C++ Class**.
- For the parent class, select **Actor Component**.
- Name the class `GrapplingHookActorComponent` and click **Create Class**.
- Similar to BP_GrapplePoint, the Actor Component also needs to check the player’s range and line of sight to the grapple point. In `GrapplingHookActorComponent.h`, declare the following public variables:`TSubclassOf GrapplePointClass`: The type of Actor the component should search for when looking for valid grapple targets in range.`TSubclassOf` is a variable that stores a class type that inherits from Type. You’ll set this to **BP_GrapplePoint** in the Pawn Blueprint.
- `float MaxGrappleRange`: How far away the component can detect a BP_GrapplePoint. The default value is `2000.f` to match BP_GrapplePoint.
- `float DotProductThreshold`: Adjusts how aligned the player camera view has to be with the grapple point for the Movement Mode to activate. Set to `0.87f`.

- Add a `UPROPERTY` macro to all three properties with `EditAnywhere`, `BlueprintReadWrite`, and a category named `“Grapple”` to expose each to the level editor and Blueprints. C++ ```
UCLASS( ClassGroup=(Custom), meta=(BlueprintSpawnableComponent) )
class PARKOURGAME_API UGrapplingHookActorComponent : public UActorComponent
{
	GENERATED_BODY()

public:
	// Sets default values for this component's properties
	UGrapplingHookActorComponent();

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Grapple")
```
- Declare a public function named `FindClosestGrappleTarget`. Give it a `UFUNCTION` macro with `BlueprintCallable` and `Category = "Grapple"`. C++ ```
public:
	// Sets default values for this component's properties
	UGrapplingHookActorComponent();

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Grapple")
	TSubclassOf<AActor> GrapplePointClass;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Grapple")
	float MaxGrappleRange = 2000.f;
```

Your final `GrapplingHookActorComponent.h` should look like this:

 C++

```
// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "GrapplingHookActorComponent.generated.h"

UCLASS(ClassGroup = (Custom), meta = (BlueprintSpawnableComponent))
```

### Implement the FindClosestGrappleTarget Function

The Grappling Hook component is responsible for finding a grapple point in range, so all of its logic is handled in the `FindClosestGrappleTarget` function. Like BP_GrapplePoint, this function calculates the distance and line of sight between the player and grapple points. It returns false if there is no valid grapple target, or it returns information about the closest valid grapple target it found.

#### Check for Valid Input and Gather Actor Information

- In `GrapplingHookActorComponent.cpp` file, add the following `#include` statements: C++ ```
#include "Camera/CameraComponent.h"
#include "Kismet/GameplayStatics.h"
``` #include "Camera/CameraComponent.h" #include "Kismet/GameplayStatics.h"
- Inside the `FindClosestGrappleTarget` function, add an `if` statement to check if the `GrapplePointClass` isn’t set in the component’s properties.
- In the `if` statement, print a log message to warn the user there is no `GrapplePointClass`, and then return `false`. C++ ```
bool UGrapplingHookActorComponent::FindClosestGrappleTarget(FVector& TargetLocation, AActor*& TargetGrapple) const
{
    if (!GrapplePointClass)
    {
        UE_LOG(LogTemp, Warning, TEXT("GrappleTargetFinderComponent: GrapplePointClass not set!"));
        return false;
    }
``` bool UGrapplingHookActorComponent::FindClosestGrappleTarget(FVector& TargetLocation, AActor*& TargetGrapple) const { if (!GrapplePointClass) { UE_LOG(LogTemp, Warning, TEXT("GrappleTargetFinderComponent: GrapplePointClass not set!")); return false; }
- Add an `if` statement to check that the component is attached to an owning `AActor`. If it doesn’t have an owner, return `false`. C++ ```
bool UGrapplingHookActorComponent::FindClosestGrappleTarget(FVector& TargetLocation, AActor*& TargetGrapple) const
{
    if (!GrapplePointClass)
    {
        UE_LOG(LogTemp, Warning, TEXT("GrappleTargetFinderComponent: GrapplePointClass not set!"));
        return false;
    }

    AActor* Owner = GetOwner();
    if (!Owner)
```
- Get the forward vector of the player’s camera component or the player itself:Declare a new `FVector` named `Forward`.
- Call `Owner->FindComponentByClass()` on the `CameraComponent` and save a pointer to it.
- Add an `if` statement to check if the camera component you saved is valid.
- If the camera component is valid, call `GetForwardVector().GetSafeNormal()` on the camera component and assign that value to Forward.
- If the camera component isn’t valid, call `GetActorForwardVector().GetSafeNormal()` on the owning character instead.

 C++

```
 // Try to get the camera component
    UCameraComponent* Camera = Owner->FindComponentByClass<UCameraComponent>();
    FVector Forward;
    if (Camera)
    {
        Forward = Camera->GetForwardVector().GetSafeNormal();
    }
    else
    {
        // Fallback to Actor forward vector
```

- To find the closest grapple point, you’ll need to also save the player’s location and a list of all BP_GrapplePoint instances:Declare a const `FVector` named `OwnerLoc` to store the owning character’s location. Call `GetActorLocation()` to set the value.
- Declare a `TArray` of `AActor` pointers named `GrapplePoints`.
- To populate the array, call `UGameplayStatics::GetAllActorsOfClass(UWorld, SearchClass, StorageArray)`. Use `GetWorld()` to retrieve the current `UWorld`, and pass the `GrapplePointClass` and `GrapplePoints` array.

 C++

```
// Get owner location
const FVector OwnerLoc = Owner->GetActorLocation();

// Gather grapple points
TArray<AActor*> GrapplePoints;
UGameplayStatics::GetAllActorsOfClass(GetWorld(), GrapplePointClass, GrapplePoints);
```

// Get owner location
const FVector OwnerLoc = Owner->GetActorLocation();

// Gather grapple points
TArray<AActor*> GrapplePoints;
UGameplayStatics::GetAllActorsOfClass(GetWorld(), GrapplePointClass, GrapplePoints);

- Before you loop through all grapple points in the array, declare variables you’ll use and update inside the loop:An `AActor` pointer named `ClosestGrapple`. You’ll update this in the loop when you first find a grapple point in range and any time you find a closer grapple point.
- A `float` named `ClosestDistSq`. Instead of using square root calculations to find the distance to each grapple point in the array, you’ll use the distance squared. Each time you find a new closest grapple point in the array, you’ll update `ClosestDistSq`. Since you haven’t found a grapple point yet, use the `MaxGrappleRange` as the closest distance. You’ll compare the distance to each element in the array with `ClosestDistSq`.

 C++

```
    AActor* ClosestGrapple = nullptr;
    float ClosestDistSq = MaxGrappleRange * MaxGrappleRange;
```

 AActor* ClosestGrapple = nullptr;
 float ClosestDistSq = MaxGrappleRange * MaxGrappleRange;

#### Check all Grapple Points

To loop through all grapple points and check each for distance and line of sight, follow these steps:

- Add a `for` loop that loops through each element in the `AActor*` grapple point array. C++ ```
 for (AActor* GrapplePoint : GrapplePoints)
    {
``` for (AActor* GrapplePoint : GrapplePoints) {
- Inside the loop, first check that the `GrapplePoint` element is valid. If it’s not valid, skip that iteration of the loop.
- Just like with BP_GrapplePoint, you’ll need to calculate the dot product between the direction the player is facing and the direction from the player to the grapple point:Declare a `const FVector` to subtract the player’s location from the `GrapplePoint’`s location and then get the safe normal of the result. C++ ```
const FVector ToGrapplePoint = (GrapplePoint->GetActorLocation() - OwnerLoc).GetSafeNormal();
``` const FVector ToGrapplePoint = (GrapplePoint->GetActorLocation() - OwnerLoc).GetSafeNormal();
- Use F`Vector::DotProduct()` to calculate the dot product between `Forward` and `ToGrapplePoint` and save the result. C++ ```
const float Dot = FVector::DotProduct(Forward, ToGrapplePoint);
``` const float Dot = FVector::DotProduct(Forward, ToGrapplePoint);

- Get the `FVector::DistSquared()` from `OwnerLoc` to this `GrapplePoint`. C++ ```
const float DistSq = FVector::DistSquared(OwnerLoc, GrapplePoint->GetActorLocation());
``` const float DistSq = FVector::DistSquared(OwnerLoc, GrapplePoint->GetActorLocation());
- Move to the next iteration of the loop if either:`Dot` (the alignment of player camera versus grapple point) is less than the `DotProductThreshold`.
- The distance to this grapple point is greater than the distance to the closest grapple point you’ve found so far.

 C++

```
// Dot product closer to 1 = looking directly at grappling point. 0.87 -> Arbitrary number that is more forgiving
if (Dot < DotProductThreshold) continue;
if (DistSq > ClosestDistSq) continue;
```

// Dot product closer to 1 = looking directly at grappling point. 0.87 -> Arbitrary number that is more forgiving
if (Dot < DotProductThreshold) continue;
if (DistSq > ClosestDistSq) continue;

- Check if there are any obstructing objects like walls between the player and the grapple point:Declare a `FHitResult` named `Hit` to store line trace hit result information.`FHitResult` is a struct in UE that stores information about the result of a collision query, including the Actor or component that was hit and where you hit it.
- Declare a `FCollisionQueryParams` struct instance named `Params` to configure how the line trace behaves.The `FCollisionQueryParams` constructor takes the following arguments:`FCollisionQueryParams Params(TraceName, UseComplexCollision, IgnoreActor)``TraceName`: Add a debug tag with `SCENE_QUERY_STAT(GrappleTrace)`.
- `UseComplexCollision`: Use true for more precise collision detection because grappling requires additional accuracy.
- `IgnoreActor`: Use `Owner` to make the line trace ignore the character when performing the trace.

 C++

```
        // Line trace to check whether there's a wall
        FHitResult Hit;
        FCollisionQueryParams Params(SCENE_QUERY_STAT(GrappleTrace), true, Owner);
```

 // Line trace to check whether there's a wall
 FHitResult Hit;
 FCollisionQueryParams Params(SCENE_QUERY_STAT(GrappleTrace), true, Owner);

- Perform a line trace from the character’s location to this grapple point’s location. Use `GetWorld()->LineTraceSingleByChannel()` passing:`Hit`: The FHitResult to store hit result information in:
- `OwnerLoc`: The start of the trace
- `GrapplePoint->GetActorLocation()`: The end of the trace.
- The collision channel for the trace: `ECC_Visibility`Use `ECC_Visibility` for line-of-sight camera checks.
- A `FCollisionQueryParams` object: `Params`

Save the result in a `bool` named `bHit`.

 C++

```
     bool bHit = GetWorld()->LineTraceSingleByChannel(
            Hit,
            OwnerLoc,
            GrapplePoint->GetActorLocation(),
            ECC_Visibility,
            Params
        );
```

 bool bHit = GetWorld()->LineTraceSingleByChannel(
 Hit,
 OwnerLoc,
 GrapplePoint->GetActorLocation(),
 ECC_Visibility,
 Params
 );

- Add an `if` statement that checks if the line trace hit an object and that object is not this grapple point:If `true`, skip to the next loop iteration.
- If `false`, that means you’ve found a close grapple point that is visible. Update `ClosestDistSq` to this grapple point’s distance and update `ClosestGrapple` to this grapple point Actor.

 C++

```
 if (bHit && Hit.GetActor() != GrapplePoint)
        {
            // Something blocking (wall)
            continue;
        }

        // Grapple Point valid and visible
        ClosestDistSq = DistSq;
        ClosestGrapple = GrapplePoint;
```

 if (bHit && Hit.GetActor() != GrapplePoint)
 {
 // Something blocking (wall)
 continue;
 }

 // Grapple Point valid and visible
 ClosestDistSq = DistSq;
 ClosestGrapple = GrapplePoint;

- If no grapple points are found in range, `ClosestGrapple` is still null after the loop finishes. Add an `if` statement to check if `ClosestGrapple` has a value:If it has a value, set the `TargetLocation` and `TargetGrapple` output variables, and return true. You’ll use these variables later in Blueprints to queue the Grappling Hook Movement Mode.
- Otherwise, return `false`.

 C++

```
 if (ClosestGrapple)
    {
        TargetLocation = ClosestGrapple->GetActorLocation();
        TargetGrapple = ClosestGrapple;
        return true;
    }

    return false;
```

 if (ClosestGrapple)
 {
 TargetLocation = ClosestGrapple->GetActorLocation();
 TargetGrapple = ClosestGrapple;
 return true;
 }

 return false;

- Save and compile your code.

Now, the `FindClosestGrappleTarget()` function returns false if there are no targets in range, if the player is not looking at any targets, or if there’s a wall blocking all potential targets.

Your finished `GrapplingHookActorComponent.cpp` file should look like this:

 C++

```
// Copyright Epic Games, Inc. All Rights Reserved.

#include "GrapplingHookActorComponent.h"
#include "Camera/CameraComponent.h"
#include "Kismet/GameplayStatics.h"

// Sets default values for this component's properties
UGrapplingHookActorComponent::UGrapplingHookActorComponent()
{
	// Set this component to be initialized when the game starts, and to be ticked every frame.
```

## Create the Grappling Hook Movement Mode

The Grappling Hook Movement Mode is where the actual movement code resides, and it gets activated when the Grappling Hook component returns a valid grapple point and target location.

When active, this Movement Mode interpolates the location of the player to the target location, and then launches them in the direction of the movement. It also attaches the player’s Cable Component to the grapple point instance while grappling.

To see how the default Walking and Falling Movement Modes are implemented, you can find their classes in `/All/EngineData/Plugins/Classes_Mover/Mover/Public/DefaultMovementSet/Modes`. They provide a base template to work with when implementing custom movement modes. In the Grappling Hook Movement Mode, the player won’t have much control over the player character, so it functions somewhat similar to the Falling Movement Mode.

### Create and Set Up a New Movement Mode Class

First, create the Movement Mode class and add the necessary includes, forward declarations, and overrides.

To set up a new Movement Mode class, follow these steps:

- In Unreal Editor, go to **Tools > New C++ Class**.
- In the **Choose Parent Class** window, click **All Classes**, search for `BaseMovementMode`, and select that as the parent class.
- Name the class `GrapplingHookMovementMode` and click **Create Class**.
- In the header file, add an include for `CableComponent`: C++ ```
#include "CoreMinimal.h"
#include "MovementMode.h"
#include "CableComponent.h"
#include "GrapplingHookMovementMode.generated.h"
``` #include "CoreMinimal.h" #include "MovementMode.h" #include "CableComponent.h" #include "GrapplingHookMovementMode.generated.h" The Cable Component attaches itself to the grapple point when grappling.
- To support the Movement Mode functionality, include a forward declaration for Legacy Movement Settings: C++ ```
class UCommonLegacyMovementSettings;
``` class UCommonLegacyMovementSettings; Movement Modes use Common Legacy Movement Settings to access shared movement configuration values, such as acceleration, gravity, and movement speed.
- In the class declaration, add `Blueprintable` and `BlueprintType` specifiers to the `UClass` macro.
- Add a `public` section and declare a constructor. C++ ```
UCLASS(Blueprintable, BlueprintType)
class PARKOURGAME_API UGrapplingHookMovementMode : public UBaseMovementMode
{
	GENERATED_BODY()

public:
UGrapplingHookMovementMode(const FObjectInitializer& ObjectInitializer);
};
``` UCLASS(Blueprintable, BlueprintType) class PARKOURGAME_API UGrapplingHookMovementMode : public UBaseMovementMode { GENERATED_BODY() public: UGrapplingHookMovementMode(const FObjectInitializer& ObjectInitializer); }; Tip: The constructor includes `FObjectInitializer` so the Movement Mode can register shared movement settings during initialization.
- Override `BaseMovementMode`’s core Movement Mode functions:`GenerateMove_Implementation`: Builds the movement intent (what movement should happen).
- `SimulationTick_Implementation`: Applies the actual movement simulation each frame.

 C++

```
public:
UGrapplingHookMovementMode(const FObjectInitializer& ObjectInitializer);

virtual void GenerateMove_Implementation(const FMoverSimContext& SimContext, const FMoverTickStartData& StartState, const FMoverTimeStep& TimeStep, FProposedMove& OutProposedMove) const override;

	virtual void SimulationTick_Implementation(const FSimulationTickParams& Params, FMoverTickEndData& OutputState) override;
```

public:
UGrapplingHookMovementMode(const FObjectInitializer& ObjectInitializer);

virtual void GenerateMove_Implementation(const FMoverSimContext& SimContext, const FMoverTickStartData& StartState, const FMoverTimeStep& TimeStep, FProposedMove& OutProposedMove) const override;

 virtual void SimulationTick_Implementation(const FSimulationTickParams& Params, FMoverTickEndData& OutputState) override;

In this Movement Mode, Simulation Tick will handle all movement since grappling input is only processed when the Movement Mode is activated, and no other input should affect the character when grappling.

`GenerateMove_Implementation` isn’t used for movement here, but is still required because Mover expects Movement Modes to define their own generate-move step.

- Add a `protected` section and declare the following properties and overrides: C++ ```
protected:
	UPROPERTY()
	TObjectPtr<const UCommonLegacyMovementSettings> CommonLegacySettings;

	virtual void Deactivate(const FMoverEventContext& Context, FName NextModeName, const FMoverSimContext& SimContext) override;
	virtual void OnRegistered(const FName ModeName, const FMoverSimContext& SimContext) override;
	virtual void OnUnregistered(const FMoverSimContext& SimContext) override;
``` protected: UPROPERTY() TObjectPtr CommonLegacySettings; virtual void Deactivate(const FMoverEventContext& Context, FName NextModeName, const FMoverSimContext& SimContext) override; virtual void OnRegistered(const FName ModeName, const FMoverSimContext& SimContext) override; virtual void OnUnregistered(const FMoverSimContext& SimContext) override; The protected section of the Movement Mode’s header contains internal state and engine functions that are used by the Movement Mode.
- In `GrapplingHookMovementMode.cpp`, add the following includes: C++ ```
#include "GrapplingHookMovementMode.h"
#include "MoveLibrary/MovementUtils.h"
#include "MoveLibrary/FloorQueryUtils.h"
#include "MoverComponent.h"
#include "DefaultMovementSet/Settings/CommonLegacyMovementSettings.h"
#include "DefaultMovementSet/InstantMovementEffects/BasicInstantMovementEffects.h"

#include UE_INLINE_GENERATED_CPP_BY_NAME(GrapplingHookMovementMode)
``` #include "GrapplingHookMovementMode.h" #include "MoveLibrary/MovementUtils.h" #include "MoveLibrary/FloorQueryUtils.h" #include "MoverComponent.h" #include "DefaultMovementSet/Settings/CommonLegacyMovementSettings.h" #include "DefaultMovementSet/InstantMovementEffects/BasicInstantMovementEffects.h" #include UE_INLINE_GENERATED_CPP_BY_NAME(GrapplingHookMovementMode) `UE_INLINE_GENERATED_CPP_BY_NAME` ensures Unreal Engine includes the generated code for this class as part of this compilation unit. It’s a modern UE build pattern that manages .gen.cpp files for you.
- Add the constructor for the Movement Mode. C++ ```
UGrapplingHookMovementMode::UGrapplingHookMovementMode(const FObjectInitializer& ObjectInitializer)
	: Super(ObjectInitializer)
{
	SharedSettingsClasses.Add(UCommonLegacyMovementSettings::StaticClass());
	GameplayTags.AddTag(Mover_IsOnGround);
}
``` UGrapplingHookMovementMode::UGrapplingHookMovementMode(const FObjectInitializer& ObjectInitializer) : Super(ObjectInitializer) { SharedSettingsClasses.Add(UCommonLegacyMovementSettings::StaticClass()); GameplayTags.AddTag(Mover_IsOnGround); } The constructor initializes the Movement Mode by registering shared settings and adding default gameplay tags. Here, you are registering this movement mode as “grounded” in the Mover system for state checks.

### Implement GenerateMove

For your grappling Movement Mode, this function should retrieve the Pawn’s Mover Component, input data, current sync state, and delta time before any grapple-specific logic runs. GenerateMove runs every frame.

To implement the `GenerateMove_Implementation` override, follow these steps:

- Implement the function and add the following standard set up for any Movement Mode: C++ ```
//Movement will be handled by simulation tick
void UGrapplingHookMovementMode::GenerateMove_Implementation(const FMoverSimContext& SimContext, const FMoverTickStartData& StartState, const FMoverTimeStep& TimeStep, FProposedMove& OutProposedMove) const
{
	const UMoverComponent* MoverComp = GetMoverComponent();
	const FCharacterDefaultInputs* CharacterInputs = StartState.InputCmd.InputCollection.FindDataByType<FCharacterDefaultInputs>();
	const FMoverDefaultSyncState* StartingSyncState = StartState.SyncState.SyncStateCollection.FindDataByType<FMoverDefaultSyncState>();
	check(StartingSyncState);

	const float DeltaSeconds = TimeStep.StepMs * 0.001f;
}
``` //Movement will be handled by simulation tick void UGrapplingHookMovementMode::GenerateMove_Implementation(const FMoverSimContext& SimContext, const FMoverTickStartData& StartState, const FMoverTimeStep& TimeStep, FProposedMove& OutProposedMove) const { const UMoverComponent* MoverComp = GetMoverComponent(); const FCharacterDefaultInputs* CharacterInputs = StartState.InputCmd.InputCollection.FindDataByType(); const FMoverDefaultSyncState* StartingSyncState = StartState.SyncState.SyncStateCollection.FindDataByType(); check(StartingSyncState); const float DeltaSeconds = TimeStep.StepMs * 0.001f; }

### Add Standard Setup Code to SimulationTick

`SimulationTick_Implementation` is where movement is handled. To start implementing this function, you’ll first need to add the following block of code that sets up any type of Movement Mode:

 C++

```
void UGrapplingHookMovementMode::SimulationTick_Implementation(const FSimulationTickParams& Params, FMoverTickEndData& OutputState)
{
	/*
	// --- Standard Movement Mode Setup Code STARTS ---
	*/
	UMoverComponent* MoverComp = GetMoverComponent();
	const FMoverTickStartData& StartState = Params.StartState;
	// The component this Movement Mode is responsible for moving
USceneComponent* UpdatedComponent = Params.MovingComps.UpdatedComponent.Get();
	UPrimitiveComponent* UpdatedPrimitive = Params.MovingComps.UpdatedPrimitive.Get();
```

This code gathers the standard Movement Mode context, validates required components, pulls the starting sync and input data, converts delta time, and prepares working variables for movement and orientation updates. You’ll use this block of code again when setting up your wall running Movement Mode in the next module of this tutorial series.

This tutorial shows all standard setup code; however, after you’ve finished implementing the Movement Mode, you can optionally trim any local variables you don’t end up using.

### Set Up and Validate Grappling-Specific Properties

Next, in `SimulationTick_Implementation`, perform a one-time initialization of the class’ properties when the Movement Mode becomes active. This initialization sets some variables only once at the start of the movement.

Because of how the Movement Mode is queued in Blueprints, the first frame is evaluated by the `SimulationTick` function before the `TargetLocation` is initialized. Therefore, it’s useful to have a boolean tracking if `TargetLocation` has already been initialized.

To declare and initialize grappling-related properties and components, follow these steps:

- In the header file, declare the following public variables:A `bool` to track if initialization has been completed: C++ ```
// Tracks if grapple setup has already run
bool bIsLocationInitialized = false;
``` // Tracks if grapple setup has already run bool bIsLocationInitialized = false;
- A `UPROPERTY` for the location of the target, the grapple point Actor at that target, and the character’s grapple Cable Component: C++ ```
// The location to move the character towards. Blueprints sets this to the target grapple point's location when switching to this Movement Mode.
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Mover")
FVector TargetLocation = FVector::ZeroVector;

// The BP_GrapplePoint Actor to attach the cable component to. Blueprints sets this when switching to this movement.
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Mover")
AActor* TargetGrapplePoint;

// The character's grapple cable component
UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Grapple")
```
- Two `FVectors` for the character’s starting position and direction towards the grapple point. C++ ```
// The character's position when the grapple begins
FVector StartLocation = FVector(0, 0, 0);

// Normalized direction from start location to grapple target
FVector GrappleDirection = FVector(0, 0, 0);
``` // The character's position when the grapple begins FVector StartLocation = FVector(0, 0, 0); // Normalized direction from start location to grapple target FVector GrappleDirection = FVector(0, 0, 0);
- Two `float` values to control the speed and time of the grapple movement. C++ ```
// The character's travel speed (cm/s) while grappling
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Mover")
float GrappleSpeed = 6000.f;

// Total time of the grapple movement (or the time it takes for the Alpha to go from 0 to 1).
float TotalTime = 0.5f;
``` // The character's travel speed (cm/s) while grappling UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Mover") float GrappleSpeed = 6000.f; // Total time of the grapple movement (or the time it takes for the Alpha to go from 0 to 1). float TotalTime = 0.5f;

You won’t use `TotalTime`’s default value, but it’s best practice to set one to ensure the variable is initialized.

- In the `.cpp` file, at the end of `SimulationTick_Implementation`, add an `if` statement to check if `TargetLocation` is set and not 0. C++ ```
void UGrapplingHookMovementMode::SimulationTick_Implementation(const FSimulationTickParams& Params, FMoverTickEndData& OutputState)
{
	/*
	// --- Standard Movement Mode Setup Code STARTS ---
	*/
	UMoverComponent* MoverComp = GetMoverComponent();
	const FMoverTickStartData& StartState = Params.StartState;
	// The component this Movement Mode is responsible for moving
	USceneComponent* UpdatedComponent = Params.MovingComps.UpdatedComponent.Get();
	UPrimitiveComponent* UpdatedPrimitive = Params.MovingComps.UpdatedPrimitive.Get();
``` When the Movement Mode is queued, `TargetLocation` and similar variables won’t be set in the first frame, so make sure values are set before changing movement.
- Add another `if` statement to handle one-time variable initialization when the Movement Mode is first activated. C++ ```
if (TargetLocation != FVector::ZeroVector)
{
	// Initialize grapple state, storing start location and direction to the target
	if (!bIsLocationInitialized)
	{
	}
}
``` if (TargetLocation != FVector::ZeroVector) { // Initialize grapple state, storing start location and direction to the target if (!bIsLocationInitialized) { } }
- Set the player’s `StartLocation` by calling `GetActorLocation()` on the Mover Component’s owner.
- Set the player’s `GrappleCable` by calling `FindComponentByClass()`. C++ ```
if (TargetLocation != FVector::ZeroVector)
{
	// Initialize grapple state, storing start location and direction to the target
	if (!bIsLocationInitialized)
	{
		StartLocation = MoverComp->GetOwner()->GetActorLocation();
		GrappleCable = MoverComp->GetOwner()->FindComponentByClass<UCableComponent>();

	}
}
``` if (TargetLocation != FVector::ZeroVector) { // Initialize grapple state, storing start location and direction to the target if (!bIsLocationInitialized) { StartLocation = MoverComp->GetOwner()->GetActorLocation(); GrappleCable = MoverComp->GetOwner()->FindComponentByClass(); } }
- In a new `if` statement, check that the `GrappleCable` is valid. C++ ```
if (TargetLocation != FVector::ZeroVector)
{
	// Initialize grapple state, storing start location and direction to the target
	if (!bIsLocationInitialized)
	{
		StartLocation = MoverComp->GetOwner()->GetActorLocation();
		GrappleCable = MoverComp->GetOwner()->FindComponentByClass<UCableComponent>();

		// --- New Code Start ---
		if (!GrappleCable)
```
- Add another `if` statement to check that the `TargetGrapplePoint` is valid. C++ ```
if (TargetLocation != FVector::ZeroVector)
{
	// Initialize grapple state, storing start location and direction to the target
	if (!bIsLocationInitialized)
	{
		StartLocation = MoverComp->GetOwner()->GetActorLocation();
		GrappleCable = MoverComp->GetOwner()->FindComponentByClass<UCableComponent>();

		if (!GrappleCable)
		{
```
- Use a Time = Distance/Speed calculation to calculate the `TotalTime`. Add `0.1` to the result as a minimum duration and ensure the grapple always takes a small amount of time to prevent snapping. C++ ```
if (!TargetGrapplePoint)
{
	if (GEngine) GEngine->AddOnScreenDebugMessage(-1, 2.f, FColor::Red, TEXT("No valid grapple target found!"));
	return;
}

// --- New Code Start ---
TotalTime = 0.1f + (TargetLocation - StartLocation).Size() / GrappleSpeed;
// --- New Code End ---
``` if (!TargetGrapplePoint) { if (GEngine) GEngine->AddOnScreenDebugMessage(-1, 2.f, FColor::Red, TEXT("No valid grapple target found!")); return; } // --- New Code Start --- TotalTime = 0.1f + (TargetLocation - StartLocation).Size() / GrappleSpeed; // --- New Code End ---
- Set `GrappleDirection` to the safe normal of the vector from `StartLocation` to `TargetLocation`. C++ ```
TotalTime = 0.1f + (TargetLocation - StartLocation).Size() / GrappleSpeed;

// --- New Code Start ---
GrappleDirection = (TargetLocation - StartLocation).GetSafeNormal();
// --- New Code End ---
``` TotalTime = 0.1f + (TargetLocation - StartLocation).Size() / GrappleSpeed; // --- New Code Start --- GrappleDirection = (TargetLocation - StartLocation).GetSafeNormal(); // --- New Code End ---
- Finish setting up the `GrappleCable` so the player can see the cable attaching to the grapple point:Set the visibility of `GrappleCable` to true.
- Call `SetAttachEndToComponent` on the `GrappleCable` to set the `TargetGrapplePoint`’s root component as the attachment point.

 C++

```
TotalTime = 0.1f + (TargetLocation - StartLocation).Size() / GrappleSpeed;

GrappleDirection = (TargetLocation - StartLocation).GetSafeNormal();

// --- New Code Start ---
GrappleCable->SetVisibility(true);
GrappleCable->SetAttachEndToComponent(TargetGrapplePoint->GetRootComponent());
// --- New Code End ---
```

TotalTime = 0.1f + (TargetLocation - StartLocation).Size() / GrappleSpeed;

GrappleDirection = (TargetLocation - StartLocation).GetSafeNormal();

// --- New Code Start ---
GrappleCable->SetVisibility(true);
GrappleCable->SetAttachEndToComponent(TargetGrapplePoint->GetRootComponent());
// --- New Code End ---

- You’ve finished setting up and validating grappling variables, so at the end of if `(!bIsLocationInitialized)`, set `bIsLocationInitialized` to true so this code only runs once when the player first enters the Grappling Hook Movement Mode. C++ ```
if (TargetLocation != FVector::ZeroVector)
{
	// Initialize grapple state, storing start location and direction to the target
	if (!bIsLocationInitialized)
	{
		StartLocation = MoverComp->GetOwner()->GetActorLocation();
		GrappleCable = MoverComp->GetOwner()->FindComponentByClass<UCableComponent>();

		if (!GrappleCable)
		{
```

### Implement Grappling-Specific Movement Logic

To advance and track the grapple movement, follow these steps:

- In the header file, in the `public` section, declare two more `float` variables: C++ ```
// How long the current grapple movement has been active
float ElapsedTime = 0.f;

// Velocity (cm/s) applied after grappling is complete
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Mover")
float GrappleExitVelocity = 2500.f;
``` // How long the current grapple movement has been active float ElapsedTime = 0.f; // Velocity (cm/s) applied after grappling is complete UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Mover") float GrappleExitVelocity = 2500.f;
- In the `.cpp` file, outside of the if (!bIsLocationInitialized) statement, update ElapsedTime, adding DeltaSeconds (the time that has passed since the last frame).
- You’ll use linear interpolation (lerp) to move the player from their start location to the grapple point over time. Declare a `float` named `Alpha` to represent the blend value of the Lerp. The player is at their start position when the time is 0, and at the grapple point when the time is `TotalTime`. C++ ```
if (TargetLocation != FVector::ZeroVector)
{
	// Initialize grapple state, storing start location and direction to the target
	if (!bIsLocationInitialized)
	{
		StartLocation = MoverComp->GetOwner()->GetActorLocation();
		GrappleCable = MoverComp->GetOwner()->FindComponentByClass<UCableComponent>();

		if (!GrappleCable)
		{
```
- Declare an FVector named `LocationToPlaceActor`. Use the `Lerp` function from Unreal Engine’s `FMath` utility library to calculate where the player should be in this frame. C++ ```
// Lerping location based on Alpha (Elapsed Time over Total Time)
ElapsedTime += DeltaSeconds;
float Alpha = ElapsedTime / TotalTime;
// --- New Code Start ---
FVector LocationToPlaceActor = FMath::Lerp(StartLocation, TargetLocation, Alpha);
// --- New Code End ---
``` // Lerping location based on Alpha (Elapsed Time over Total Time) ElapsedTime += DeltaSeconds; float Alpha = ElapsedTime / TotalTime; // --- New Code Start --- FVector LocationToPlaceActor = FMath::Lerp(StartLocation, TargetLocation, Alpha); // --- New Code End ---
- The setup code at the beginning of `SimulationTick` declared a scene component named `UpdatedComponent`, which is the component the Movement Mode is responsible for moving (usually the Pawn’s root collision component). Call `SetWorldLocation()` on `UpdatedComponent` to move it to `LocationToPlaceActor`. C++ ```
// Lerping location based on Alpha (Elapsed Time over Total Time)
ElapsedTime += DeltaSeconds;
float Alpha = ElapsedTime / TotalTime;
FVector LocationToPlaceActor = FMath::Lerp(StartLocation, TargetLocation, Alpha);
// --- New Code Start ---
UpdatedComponent->SetWorldLocation(LocationToPlaceActor);
// --- New Code End ---
``` // Lerping location based on Alpha (Elapsed Time over Total Time) ElapsedTime += DeltaSeconds; float Alpha = ElapsedTime / TotalTime; FVector LocationToPlaceActor = FMath::Lerp(StartLocation, TargetLocation, Alpha); // --- New Code Start --- UpdatedComponent->SetWorldLocation(LocationToPlaceActor); // --- New Code End ---
- Set `UpdatedComponent’`s `ComponentVelocity` to `GrappleDirection * GrappleExitVelocity`. C++ ```
// Lerping location based on Alpha (Elapsed Time over Total Time)
ElapsedTime += DeltaSeconds;
float Alpha = ElapsedTime / TotalTime;
FVector LocationToPlaceActor = FMath::Lerp(StartLocation, TargetLocation, Alpha);
UpdatedComponent->SetWorldLocation(LocationToPlaceActor);

// --- New Code Start ---
UpdatedComponent->ComponentVelocity = GrappleDirection * GrappleExitVelocity;
// --- New Code End ---
``` // Lerping location based on Alpha (Elapsed Time over Total Time) ElapsedTime += DeltaSeconds; float Alpha = ElapsedTime / TotalTime; FVector LocationToPlaceActor = FMath::Lerp(StartLocation, TargetLocation, Alpha); UpdatedComponent->SetWorldLocation(LocationToPlaceActor); // --- New Code Start --- UpdatedComponent->ComponentVelocity = GrappleDirection * GrappleExitVelocity; // --- New Code End ---
- Now that you’ve moved the component, you have to report that movement to Mover using the `OutputSyncState`. The position, rotation and velocity of `UpdatedComponent` and `OutputSyncState` must match so the visual component and the Mover system’s internal state stay in sync.Call `OutputSyncState.SetTransforms_WorldSpace`, which has the following mandatory arguments:`OutputSyncState.SetTransforms_WorldSpace(FVector Location, FRotator Orientation, FVector WorldVelocity, FVector AngularVelocity, UPrimitiveComponent *RelativeBase = (UPrimitiveComponent*)nullptr)` C++ ```
// Lerping location based on Alpha (Elapsed Time over Total Time)
ElapsedTime += DeltaSeconds;
float Alpha = ElapsedTime / TotalTime;
FVector LocationToPlaceActor = FMath::Lerp(StartLocation, TargetLocation, Alpha);
UpdatedComponent->SetWorldLocation(LocationToPlaceActor);

UpdatedComponent->ComponentVelocity = GrappleDirection * GrappleExitVelocity;

// --- New Code Start ---
OutputSyncState.SetTransforms_WorldSpace(LocationToPlaceActor,
``` For multiplayer games, `OutputSyncState` keeps the server synced with clients.

### End the Grappling Movement

To finish and transition out of the grapple movement when the player reaches the target, follow these steps:

- After moving the player and updating `OutputSyncState`, check if the player has reached the grapple point. Add an `if` statement that checks if `Alpha` is close to `1`. C++ ```
// Lerping location based on Alpha (Elapsed time over Total Time)
ElapsedTime += DeltaSeconds;
float Alpha = ElapsedTime / TotalTime;
FVector LocationToPlaceActor = FMath::Lerp(StartLocation, TargetLocation, Alpha);
UpdatedComponent->SetWorldLocation(LocationToPlaceActor);

UpdatedComponent->ComponentVelocity = GrappleDirection * GrappleExitVelocity;

OutputSyncState.SetTransforms_WorldSpace(LocationToPlaceActor,
	UpdatedComponent->GetComponentRotation(),
```
- Inside the `if` statement, reset the following variables:`ElapsedTime`
- `bIsLocationInitialized`
- `TargetLocation`

- Set the visibility of `GrappleCable` to `false` to hide the cable in game when the player has finished using it. You only want the cable to be visible when using the grappling hook.Normally, you’d also want to stop cable simulations and updates when it isn’t visible to reduce unnecessary calculations.
- Queue the Falling Movement Mode. C++ ```
//If Alpha is close to 1, Queue "Falling" Movement Mode and reset variables.
if (Alpha >= 0.99f)
{
	// --- New Code Start ---
ElapsedTime = 0.f;
	bIsLocationInitialized = false;
	TargetLocation = FVector::ZeroVector;
	GrappleCable->SetVisibility(false);
	MoverComp->QueueNextMode("Falling", false);
	// --- New Code End ---
```

Your finished `SimulationTick_Implementation` function should look like this:

 C++

```
void UGrapplingHookMovementMode::SimulationTick_Implementation(const FSimulationTickParams& Params, FMoverTickEndData& OutputState)
{
	/*
	// --- Standard Movement Mode Setup Code STARTS ---
	*/
	UMoverComponent* MoverComp = GetMoverComponent();
	const FMoverTickStartData& StartState = Params.StartState;
	// The component this Movement Mode is responsible for moving
	USceneComponent* UpdatedComponent = Params.MovingComps.UpdatedComponent.Get();
	UPrimitiveComponent* UpdatedPrimitive = Params.MovingComps.UpdatedPrimitive.Get();
```

### Implement Deactivate()

`Deactivate()` runs when the Movement Mode stops being active, or when the player switches to another Movement Mode. Use this function to clean up any state or references the Movement Mode was using.

If the game or player interrupts the grappling movement, you want to perform the same variable cleanup you did when the grapple movement finished successfully.

To implement `Deactivate()`, follow these steps:

- Add the function header and call `Super::Deactivate();` inside the function.
- Copy and paste the same four properties you reset at the end of `SimulationTick`. C++ ```
// Reset variables when Movement Mode stops being active
void UGrapplingHookMovementMode::Deactivate(const FMoverEventContext& Context, FName NextModeName, const FMoverSimContext& SimContext) // Same thing as if Alpha gets close to 1 - Cleaning references and resetting variables
{
	Super::Deactivate(Context, NextModeName, SimContext);

TargetLocation = FVector::ZeroVector;
	ElapsedTime = 0.f;
	GrappleCable->SetVisibility(false);
	bIsLocationInitialized = false;
}
``` // Reset variables when Movement Mode stops being active void UGrapplingHookMovementMode::Deactivate(const FMoverEventContext& Context, FName NextModeName, const FMoverSimContext& SimContext) // Same thing as if Alpha gets close to 1 - Cleaning references and resetting variables { Super::Deactivate(Context, NextModeName, SimContext); TargetLocation = FVector::ZeroVector; ElapsedTime = 0.f; GrappleCable->SetVisibility(false); bIsLocationInitialized = false; }

### Implement OnRegistered() and OnUnregistered()

`OnRegistered()` runs once when the Movement Mode is connected to the Mover system and ready to use. Use it to perform one-time set up of references like shared settings.

To implement `OnRegistered()`, follow these steps:

- Add the function header and call `Super::OnRegistered(ModeName)` inside the function.
- Get a reference to `CommonLegacyMovementSettings`.
- Get a reference to the player character’s `MoverComponent`. C++ ```
void UGrapplingHookMovementMode::OnRegistered(const FName ModeName, const FMoverSimContext& SimContext)
{
	Super::OnRegistered(ModeName, SimContext);

	CommonLegacySettings = GetMoverComponent()->FindSharedSettings<UCommonLegacyMovementSettings>();
		ensureMsgf(CommonLegacySettings, TEXT("Failed to find instance of CommonLegacyMovementSettings on %s. Movement may not function properly."), *GetPathNameSafe(this));
}
``` void UGrapplingHookMovementMode::OnRegistered(const FName ModeName, const FMoverSimContext& SimContext) { Super::OnRegistered(ModeName, SimContext); CommonLegacySettings = GetMoverComponent()->FindSharedSettings(); ensureMsgf(CommonLegacySettings, TEXT("Failed to find instance of CommonLegacyMovementSettings on %s. Movement may not function properly."), *GetPathNameSafe(this)); }

`OnUnregistered()` runs when the Movement Mode is removed from the `MoverComponent`, such as when the `MoverComponent` is destroyed. Use it for final cleanup, such as unbinding events or clearing external references. For example, if this Movement Mode had subscribed to an event on another component, you would unbind it here. The grappling Movement Mode doesn’t require any cleanup here, but this is an example to show the full Movement Mode lifecycle.

To implement `OnUnregistered()`, follow these steps:

- Call the parent function.
- Reset any references set in `OnRegistered()` (like `CommonLegacySettings`). C++ ```
void UGrapplingHookMovementMode::OnUnregistered(const FMoverSimContext& SimContext)
{
	CommonLegacySettings = nullptr;
	Super::OnUnregistered(SimContext);

}
``` void UGrapplingHookMovementMode::OnUnregistered(const FMoverSimContext& SimContext) { CommonLegacySettings = nullptr; Super::OnUnregistered(SimContext); }
- Compile and save your code.

### Complete Code

Your finished `GrapplingHookMovementMode.h` file should look like this:

 C++

```
// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "MovementMode.h"
#include "CableComponent.h"
#include "GrapplingHookMovementMode.generated.h"

class UCommonLegacyMovementSettings;
```

Your finished `GrapplingHookMovementMode.cpp` file should look like this:

 C++

```
// Copyright Epic Games, Inc. All Rights Reserved.

#include "GrapplingHookMovementMode.h"
#include "MoveLibrary/MovementUtils.h"
#include "MoveLibrary/FloorQueryUtils.h"
#include "MoverComponent.h"
#include "DefaultMovementSet/Settings/CommonLegacyMovementSettings.h"
#include "DefaultMovementSet/InstantMovementEffects/BasicInstantMovementEffects.h"
```

## Add Grapple to the Character Blueprint

Now that you’ve implemented the movement behavior, you can add the Movement Mode to BP_ParkourPawn.

### Add the Movement Mode

To add the grappling Movement Mode to the player character, follow these steps:

- In Unreal Editor, open your Pawn Blueprint.
- In the **Components **panel, click **Add **to add a **GrapplingHookActor** component.
- Select the **ExtendedCharacterMoverComponent**.
- In the **Details** panel, in the **Mover** section, expand **Movement Modes**.
- Click (**+**) next to the **Movement Modes** category heading to add another map element.
- Enter `GrapplingHook` as the mode name. You’ll reference this name in Event Graph logic.
- In the new map element’s dropdown list, select **Grappling Hook Movement Mode**.

### Connect the Grapple Point Class

Your character’s Grappling Hook Actor Component handles finding grapple targets. When you implemented this Actor Component, you exposed a **Grapple Point Class** property to Blueprints to tell the component what type of Actor and level object to use for grappling.

To tell the Grappling Hook Actor Component to search for BP_GrapplePoint level objects, follow these steps:

- In the **Components **panel, select **GrapplingHookActor**.
- In the **Details **panel, in the **Grapple **section, for **Grapple Point Class**, select **BP_GrapplePoint**.

### Add the Cable Component

To add the Cable Component to the character, follow these steps:

- In the **Components **panel, select the **SK_Mannequin** component.
- Click **+ Add**, and select **Cable**. Name it `GrapplingCable`.
- With the Cable Component selected, in the **Details **panel, in the **Sockets **section, for **Parent Socket**, click the folder search icon and select the **hand_r** bone.
- In the **Cable **section, set:**Cable Length** to `300`.
- **Num Segments** to `5`.
- **Cable > Advanced > Skip Cable Update when Not Visible** to **True**.

- In the **Cable Rendering** section, set **Cable Width** to `8`.
- In the **Rendering **section, turn off **Visible by default**.

### Queue the Movement Mode

The input action logic in the Pawn’s event graph should search for a valid grapple target and queue the `GrapplingHookMovementMode` if `FindClosestGrappleTarget()` finds a target.

When working in node graphs, ensure **Context Sensitive** is enabled in the node actions list as often as possible so Unreal Engine can automatically add appropriate targets to function nodes for you.

To queue the Movement Mode, follow these steps:

- Go to the Pawn’s **EventGraph **tab and go to the groups of nodes that capture various movement inputs.
- Right-click in the empty area of the graph, search for `IA_GrapplingHook`, and create a new **IA_GrapplingHook **node (in the **Enhanced Action Event** category).
- Click the arrow at the bottom of the node to see more pin options. From the **Started **exec pin, create a **Branch **node. You only want to queue grappling if there is a valid grapple point in range.
- Drag off the **Condition **pin and add a **Find Closest Grapple Target** function node. Unreal Engine automatically adds the **GrapplingHookActor** component as the Target.You created `FindClosestGrappleTarget()` in the `GrapplingHookActor` component class.
- Drag off the **Branch **node’s **True **pin and add a **Queue Next Movement Mode** node. Unreal Engine automatically adds the Pawn’s **Mover Component** as the **Target**.
- For the **Desired Mode Name** pin, enter `GrapplingHook`. This must match the name you entered in the **Movement Modes** list in the Mover Component’s **Details **panel.
- Save and compile the Blueprint.

### Send Grapple Point Information to the Movement Mode

Your game can now queue the new Movement Mode, but before the first frame of the Movement Mode runs, you’ll need to tell it about the grapple target. Use the **OnMovementModeChanged** event to set up a Movement Mode instance with the information it needs to perform the movement behavior.

To execute logic when the Grappling Hook Movement Mode becomes active, follow these steps:

- In the **My Blueprint** panel, in the **Graphs** section, expand **EventGraph **and double-click **Event OnMovementModeChanged_Event** to go to that node in the graph.
- Delete all nodes connected to the event node.
- Drag off the event node’s exec pin and add a **Switch on Name** node.
- Set up the **Switch on Name** node to have an output for your Grappling Hook movement mode:In the node, click **Add pin**.
- In the **Details **panel, uncheck **Has Default Pin**.
- Expand the **Pin Names** array and rename the first element to `GrapplingHook`.

With a **Switch on Name** node, you can branch off to different configurations depending on which Movement Mode has activated. You’ll add a Wall Running option to this Switch in the next part of this tutorial series.

- Connect the event’s **New Movement Mode Name** pin to the **Switch **node’s **Selection **pin.

Now that you know grappling is active, first get the character’s Grappling Hook Movement Mode object from the Mover Component so you can access that instance’s `TargetLocation` and `TargetGrapplePoint` variables. `FindMovementModeByName` returns a base class Movement Mode object, so you need to use a **Cast To** node on that object to treat it as a Grappling Hook Movement Mode object and access variables specific to that Movement Mode class.

To access the character’s Grappling Hook Movement Mode object, follow these steps:

- Drag off the **Switch **node’s **Grappling Hook** pin and add a **Cast To GrapplingHookMovementMode** node.
- To the left of the** Cast To **node, add a **Find Movement Mode by Name** function node (where the Target is your** Extended Character Mover Component**).
- Set up the** Find Movement Mode by Name **node:Connect the **Return Value** to the **Cast To** node’s **Object **pin.
- For the** Movement Mode Name**, enter `GrapplingHook`.

To find the closest grapple target and send its information to the Movement Mode instance, follow these steps:

- Below the **Cast To** node, add a **Find Closest Grapple Target **function node (where the target is **GrapplingHookActor**).
- Right-click the **Target Location** pin and click **Split Struct Pin**.You’ll need to apply an offset to the location’s Z value to lower the character relative to the grapple point, so split the vector into three separate values.
- Drag off the **Cast To**’s top exec pin and add a **Set TargetLocation** node (under **Class > Grappling Hook Movement Mode** in the node actions list).
- Set up the **Set TargetLocation** node:Right-click the **Target Location** pin and select **Split Struct Pin**.
- Connect the **Cast To** node’s **As Grappling Hook Movement Mode** pin to the **Set **node’s **Target **pin.
- Connect the **Find Closest Grapple Target** node’s **Target Location X** and **Y** pins to the corresponding pins in the **Set **node.
- Connect the function node’s **Target Location Z** pin to a new **Subtract **node, and connect the result to the **Set **node’s **Z** pin.
- In the **My Blueprint** panel, create a new **float** variable named **GrappleZAxisOffset**. Compile the Blueprint, set its default value to `100`, and drag the variable onto the **Subtract **node’s second input pin.This offset should lower the target location the character is flying towards so that their head lines up with the grapple point Actor instead of the middle of their body.

- Drag off the **Set Target Location** node’s exec output pin and add a** Set TargetGrapplePoint** node.
- Set up the new **Set TargetGrapplePoint **node:Connect the **Cast To** node’s **As Grappling Hook Movement Mode** pin to the new **Set **node’s **Target **pin.
- Connect the** Find Closest Grapple Target** node’s **Target Grapple** output to the **Set **node.

- Save and compile the Blueprint.

The final OnMovementModeChanged_Event logic should look like this:

 Blueprint

Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_4" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn:EventGraph.EdGraphNode_Comment_4'"
 CommentColor=(R=0.000000,G=1.000000,B=0.886645,A=1.000000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=-2192
 NodePosY=624
 NodeWidth=1952
 NodeHeight=608
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Listening to mode switch"
 NodeGuid=54AAF3CC48984909FAEA5BBD4D917885
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CustomEvent Name="K2Node_CustomEvent_7" ExportPath="/Script/BlueprintGraph.K2Node_CustomEvent'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn:EventGraph.K2Node_CustomEvent_7'"
 CustomFunctionName="OnMovementModeChanged_Event"
 NodePosX=-2144
 NodePosY=1024
 NodeGuid=2BF19D9C4DE453A18101B59B550B88B5
 CustomProperties Pin (PinId=AB76F8A5400C0564A5610380560AF708,PinName="OutputDelegate",Direction="EGPD_Output",PinType.PinCategory="delegate",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(MemberParent="/Script/Engine.BlueprintGeneratedClass'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn_C'",MemberName="OnMovementModeChanged_Event",MemberGuid=2BF19D9C4DE453A18101B59B550B88B5),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=6993DB854B8F6B504728EF9A1CEEE239,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_SwitchName_0 2A87793A41274FF285A02EA2D6AAB75B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=6F964C7F4B4516CB45F6249759F46DB2,PinName="PreviousMovementModeName",Direction="EGPD_Output",PinType.PinCategory="name",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=True,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=B218B3F84CB797BCAC14EBA578523DD4,PinName="NewMovementModeName",Direction="EGPD_Output",PinType.PinCategory="name",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=True,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_SwitchName_0 1489C72245E616ED7D4321944BCBAA7B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties UserDefinedPin (PinName="PreviousMovementModeName",PinType=(PinCategory="name",bIsReference=True,bIsConst=True),DesiredPinDirection=EGPD_Output)
 CustomProperties UserDefinedPin (PinName="NewMovementModeName",PinType=(PinCategory="name",bIsReference=True,bIsConst=True),DesiredPinDirection=EGPD_Output)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_SwitchName Name="K2Node_SwitchName_0" ExportPath="/Script/BlueprintGraph.K2Node_SwitchName'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn:EventGraph.K2Node_SwitchName_0'"
 PinNames(0)="GrapplingHook"
 PinNames(1)="WallRun"
 bHasDefaultPin=False
 NodePosX=-1776
 NodePosY=1040
 NodeGuid=7FE97A9640FD2A97E6289795C4DC23FD
 CustomProperties Pin (PinId=2A87793A41274FF285A02EA2D6AAB75B,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CustomEvent_7 6993DB854B8F6B504728EF9A1CEEE239,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=1489C72245E616ED7D4321944BCBAA7B,PinName="Selection",PinType.PinCategory="name",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="None",AutogeneratedDefaultValue="None",LinkedTo=(K2Node_CustomEvent_7 B218B3F84CB797BCAC14EBA578523DD4,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=61A0B18246FCE0DA77F484AD6049345A,PinName="NotEqual_NameName",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.KismetMathLibrary'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__KismetMathLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=True,bDefaultValueIsReadOnly=True,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=1C78DB0242767113E7C47D8B76A3A98C,PinName="GrapplingHook",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_DynamicCast_0 58C73B5A4DB8E93837B35D989F6C7201,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=C7BB87034D6973681C5241B4543BA7B4,PinName="WallRun",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_DynamicCast Name="K2Node_DynamicCast_0" ExportPath="/Script/BlueprintGraph.K2Node_DynamicCast'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn:EventGraph.K2Node_DynamicCast_0'"
 TargetType="/Script/CoreUObject.Class'/Script/ParkourGame.GrapplingHookMovementMode'"
 PureState=Impure
 NodePosX=-1424
 NodePosY=784
 NodeGuid=BB11DA564D7670A600769BA9A2805169
 CustomProperties Pin (PinId=58C73B5A4DB8E93837B35D989F6C7201,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_SwitchName_0 1C78DB0242767113E7C47D8B76A3A98C,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=C5BB9B404337746620F3B099F461DF5A,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_10 EB31B16B491CB1DF77534C905C671A0A,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=DA161D8940D02739BE72F99FD7468B9D,PinName="CastFailed",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=3FF6EEDB4966D775EC3E5DAA74293AD2,PinName="Object",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/CoreUObject.Object'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_32 A05E41A9491FE9D338319780CF8A4581,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=563F986145FFD597323EE38229CD1FF5,PinName="AsGrappling Hook Movement Mode",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/ParkourGame.GrapplingHookMovementMode'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_10 BE2CB9DA4D188A52C7CDA5A9CC0B9F4A,K2Node_VariableSet_19 853CD80D4EDEC8F52BF1A8A5F83AFC4D,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=FEB7C6944FDF447C39B2C1A9042BE0FC,PinName="bSuccess",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_32" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn:EventGraph.K2Node_CallFunction_32'"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Mover.MoverComponent'",MemberName="FindMovementModeByName")
 NodePosX=-1824
 NodePosY=784
 NodeGuid=88C43382434191E9E665758D64AE63DD
 CustomProperties Pin (PinId=CBEA820B478061670474EE9BC1440720,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Mover.MoverComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_42 083FE462492E8E20D409B2A7C5C08FEB,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=E9982F364A71032EBF95E58DFB0B32A8,PinName="MovementModeName",PinType.PinCategory="name",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="GrapplingHook",AutogeneratedDefaultValue="None",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=A05E41A9491FE9D338319780CF8A4581,PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Mover.BaseMovementMode'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_DynamicCast_0 3FF6EEDB4966D775EC3E5DAA74293AD2,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_42" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn:EventGraph.K2Node_VariableGet_42'"
 VariableReference=(MemberName="ExtendedCharacterMoverComponent",bSelfContext=True)
 NodePosX=-2160
 NodePosY=816
 NodeGuid=395832F941D38DE733AF85A152B303F2
 CustomProperties Pin (PinId=083FE462492E8E20D409B2A7C5C08FEB,PinName="ExtendedCharacterMoverComponent",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/MoverExamples/Components/ExtendedCharacterMoverComponent.ExtendedCharacterMoverComponent_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_32 CBEA820B478061670474EE9BC1440720,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D554EFCE4723C02650977E808D21DE26,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_37" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn:EventGraph.K2Node_CallFunction_37'"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/ParkourGame.GrapplingHookActorComponent'",MemberName="FindClosestGrappleTarget")
 NodePosX=-1344
 NodePosY=992
 NodeGuid=F6D80FB34BD2F80902BA9C809AF4B683
 CustomProperties Pin (PinId=34DF151C436845779A661E8FCD583257,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/ParkourGame.GrapplingHookActorComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_43 00CD9EE84AB18B6748664AB621419D6E,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=A4EF2B874E8A7F8787B1F5A4747C24CA,PinName="TargetLocation",Direction="EGPD_Output",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/CoreUObject.Vector'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0, 0, 0",AutogeneratedDefaultValue="0, 0, 0",SubPins=(K2Node_CallFunction_37 92EEEEE944576820BE2BC8B53D45E24B,K2Node_CallFunction_37 6C358D3341568A87327CBC84E106BE3D,K2Node_CallFunction_37 DC2A12124EE9F7B0B11B8DB2559FFE78,),PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=92EEEEE944576820BE2BC8B53D45E24B,PinName="TargetLocation_X",PinFriendlyName=LOCGEN_FORMAT_NAMED(NSLOCTEXT("KismetSchema", "SplitPinFriendlyNameFormat", "{PinDisplayName} {ProtoPinDisplayName}"), "PinDisplayName", INVTEXT("Target Location"), "ProtoPinDisplayName", INVTEXT("X")),Direction="EGPD_Output",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_VariableSet_10 31027B3B4EC13E99C4E01886A04EBB4F,),ParentPin=K2Node_CallFunction_37 A4EF2B874E8A7F8787B1F5A4747C24CA,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=6C358D3341568A87327CBC84E106BE3D,PinName="TargetLocation_Y",PinFriendlyName=LOCGEN_FORMAT_NAMED(NSLOCTEXT("KismetSchema", "SplitPinFriendlyNameFormat", "{PinDisplayName} {ProtoPinDisplayName}"), "PinDisplayName", INVTEXT("Target Location"), "ProtoPinDisplayName", INVTEXT("Y")),Direction="EGPD_Output",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_VariableSet_10 00D5642A43F01BAD0A688F8ADDE1A0F7,),ParentPin=K2Node_CallFunction_37 A4EF2B874E8A7F8787B1F5A4747C24CA,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=DC2A12124EE9F7B0B11B8DB2559FFE78,PinName="TargetLocation_Z",PinFriendlyName=LOCGEN_FORMAT_NAMED(NSLOCTEXT("KismetSchema", "SplitPinFriendlyNameFormat", "{PinDisplayName} {ProtoPinDisplayName}"), "PinDisplayName", INVTEXT("Target Location"), "ProtoPinDisplayName", INVTEXT("Z")),Direction="EGPD_Output",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_PromotableOperator_2 C7CA42DC41DB881B4C4BBAA0A85B57C0,),ParentPin=K2Node_CallFunction_37 A4EF2B874E8A7F8787B1F5A4747C24CA,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=32196F394308EAA1787AC3ABA655B90F,PinName="TargetGrapple",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_19 481AFD9E4AF54948D40B76B051C28D29,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=8824EC8249EB9011838D2AAA52EEDC73,PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_43" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn:EventGraph.K2Node_VariableGet_43'"
 VariableReference=(MemberName="GrapplingHookActor",bSelfContext=True)
 NodePosX=-1560
 NodePosY=959
 NodeGuid=53BD73794FBB82CEE4A96493455F78D2
 CustomProperties Pin (PinId=00CD9EE84AB18B6748664AB621419D6E,PinName="GrapplingHookActor",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/ParkourGame.GrapplingHookActorComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_37 34DF151C436845779A661E8FCD583257,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=E21FC1AE4F91AD239A7FA79DB8801E4B,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableSet Name="K2Node_VariableSet_10" ExportPath="/Script/BlueprintGraph.K2Node_VariableSet'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn:EventGraph.K2Node_VariableSet_10'"
 VariableReference=(MemberParent="/Script/CoreUObject.Class'/Script/ParkourGame.GrapplingHookMovementMode'",MemberName="TargetLocation")
 SelfContextInfo=NotSelfContext
 NodePosX=-800
 NodePosY=800
 NodeGuid=8EA309564034D7C09D569588EAF8E065
 CustomProperties Pin (PinId=EB31B16B491CB1DF77534C905C671A0A,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_DynamicCast_0 C5BB9B404337746620F3B099F461DF5A,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=124B9D7B4B116343424F01985873D9B6,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_19 DA7E862E488B1B5621B37DA824B6EFBA,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=6EB9186B4D77756BD68A188BDA6A1AA9,PinName="TargetLocation",PinFriendlyName=NSLOCTEXT("UObjectDisplayNames", "GrapplingHookMovementMode:TargetLocation", "Target Location"),PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/CoreUObject.Vector'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0, 0, 0",AutogeneratedDefaultValue="0, 0, 0",SubPins=(K2Node_VariableSet_10 31027B3B4EC13E99C4E01886A04EBB4F,K2Node_VariableSet_10 00D5642A43F01BAD0A688F8ADDE1A0F7,K2Node_VariableSet_10 4367964D44774987E7F599AB49C9978E,),PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=31027B3B4EC13E99C4E01886A04EBB4F,PinName="TargetLocation_X",PinFriendlyName=LOCGEN_FORMAT_NAMED(NSLOCTEXT("KismetSchema", "SplitPinFriendlyNameFormat", "{PinDisplayName} {ProtoPinDisplayName}"), "PinDisplayName", INVTEXT("Target Location"), "ProtoPinDisplayName", INVTEXT("X")),PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_CallFunction_37 92EEEEE944576820BE2BC8B53D45E24B,),ParentPin=K2Node_VariableSet_10 6EB9186B4D77756BD68A188BDA6A1AA9,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=00D5642A43F01BAD0A688F8ADDE1A0F7,PinName="TargetLocation_Y",PinFriendlyName=LOCGEN_FORMAT_NAMED(NSLOCTEXT("KismetSchema", "SplitPinFriendlyNameFormat", "{PinDisplayName} {ProtoPinDisplayName}"), "PinDisplayName", INVTEXT("Target Location"), "ProtoPinDisplayName", INVTEXT("Y")),PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_CallFunction_37 6C358D3341568A87327CBC84E106BE3D,),ParentPin=K2Node_VariableSet_10 6EB9186B4D77756BD68A188BDA6A1AA9,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=4367964D44774987E7F599AB49C9978E,PinName="TargetLocation_Z",PinFriendlyName=LOCGEN_FORMAT_NAMED(NSLOCTEXT("KismetSchema", "SplitPinFriendlyNameFormat", "{PinDisplayName} {ProtoPinDisplayName}"), "PinDisplayName", INVTEXT("Target Location"), "ProtoPinDisplayName", INVTEXT("Z")),PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_PromotableOperator_2 B84B897F49909FC3623A67AE496B8BFA,),ParentPin=K2Node_VariableSet_10 6EB9186B4D77756BD68A188BDA6A1AA9,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F0B920A045F6691E908CBD8F42A84263,PinName="Output_Get",PinFriendlyName=NSLOCTEXT("UObjectDisplayNames", "GrapplingHookMovementMode:TargetLocation", "Target Location"),PinToolTip="Retrieves the value of the variable, can use instead of a separate Get node",Direction="EGPD_Output",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/CoreUObject.Vector'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0, 0, 0",AutogeneratedDefaultValue="0, 0, 0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=BE2CB9DA4D188A52C7CDA5A9CC0B9F4A,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/ParkourGame.GrapplingHookMovementMode'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_DynamicCast_0 563F986145FFD597323EE38229CD1FF5,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_PromotableOperator Name="K2Node_PromotableOperator_2" ExportPath="/Script/BlueprintGraph.K2Node_PromotableOperator'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn:EventGraph.K2Node_PromotableOperator_2'"
 OperationName="Subtract"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetMathLibrary'",MemberName="Subtract_DoubleDouble")
 NodePosX=-960
 NodePosY=1088
 NodeGuid=E9E8CFA044DAE9BF8ECED9AD682BF1CB
 CustomProperties Pin (PinId=C7CA42DC41DB881B4C4BBAA0A85B57C0,PinName="A",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_37 DC2A12124EE9F7B0B11B8DB2559FFE78,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=CE565E25404A8258329F4594BB26E955,PinName="B",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_44 0CDC27E74888448D3E4B3D8EFBB937B1,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=B84B897F49909FC3623A67AE496B8BFA,PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_10 4367964D44774987E7F599AB49C9978E,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_44" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn:EventGraph.K2Node_VariableGet_44'"
 VariableReference=(MemberName="GrappleZAxisOffset",MemberGuid=653364614FBF2B7A92D893A2B313A5C3,bSelfContext=True)
 NodePosX=-976
 NodePosY=1152
 NodeGuid=75E6B92B48756027A99309851EEACD10
 CustomProperties Pin (PinId=0CDC27E74888448D3E4B3D8EFBB937B1,PinName="GrappleZAxisOffset",Direction="EGPD_Output",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_PromotableOperator_2 CE565E25404A8258329F4594BB26E955,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=C9E5C926494DEECDA7A466A0CDD0837B,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableSet Name="K2Node_VariableSet_19" ExportPath="/Script/BlueprintGraph.K2Node_VariableSet'/Game/Parkour/Blueprints/BP_ParkourPawn.BP_ParkourPawn:EventGraph.K2Node_VariableSet_19'"
 VariableReference=(MemberParent="/Script/CoreUObject.Class'/Script/ParkourGame.GrapplingHookMovementMode'",MemberName="TargetGrapplePoint")
 SelfContextInfo=NotSelfContext
 NodePosX=-496
 NodePosY=800
 NodeGuid=B2F843254776AEB0079158A4B87CBC23
 CustomProperties Pin (PinId=DA7E862E488B1B5621B37DA824B6EFBA,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_10 124B9D7B4B116343424F01985873D9B6,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=9D78CFB0411C78224AADFD810F75C9E8,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=481AFD9E4AF54948D40B76B051C28D29,PinName="TargetGrapplePoint",PinFriendlyName=NSLOCTEXT("UObjectDisplayNames", "GrapplingHookMovementMode:TargetGrapplePoint", "Target Grapple Point"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_37 32196F394308EAA1787AC3ABA655B90F,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=CF177AD64330D9CF1AA2AFB9421CF259,PinName="Output_Get",PinFriendlyName=NSLOCTEXT("UObjectDisplayNames", "GrapplingHookMovementMode:TargetGrapplePoint", "Target Grapple Point"),PinToolTip="Retrieves the value of the variable, can use instead of a separate Get node",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=853CD80D4EDEC8F52BF1A8A5F83AFC4D,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/ParkourGame.GrapplingHookMovementMode'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_DynamicCast_0 563F986145FFD597323EE38229CD1FF5,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object

## Test the Grapple Hook Movement

Play your game, aim the camera at your grapple point, and press **G** to test the grappling movement. You may need to adjust the size of the floor or height of your walls to keep the character in the level.

Watch how the cable attaches to the grapple point. You may need to open BP_GrapplePoint, select the mesh component, and translate the mesh up or down the X axis until the grapple cable always hits the mesh. For example, in the sample level shown in this tutorial, the grapple point’s mesh has a Location transform of (60, 0, 0).

As you test the grappling movement, also pay attention to how the character moves towards the grapple point. Check that the Z offset lines the cable up with the grapple point, and pay attention to the feel of the grappling speed and distance.

If you decide to change the maximum grappling range, remember to update the calculation in BP_GrapplePoint that changes the emissive intensity of the grapple point to indicate when it’s in or out of range of the player.

### Adjust Grapple Hook Behavior

To adjust grapple speed and exit velocity, select your Pawn’s **ExtendedCharacterMoverComponent** and expand the **GrappleHook Movement Mode** properties.

## Next Up

Next, you’ll create a Wall Running Component and Movement Mode that performs line traces to the right and left of the character to search for walls, checks if the player is approaching a wall at an appropriate speed, and then moves the player along the wall.

- [image: Wall Running Movement Mode] Wall Running Movement ModeBuild a Movement Mode in C++ that gives a character the ability to run along walls and jump from wall to wall. (-> mover-04-wall-running-movement-mode)

On this page

- Create the Grapple Point Blueprint (-> mover-03-grappling-hook-movement-mode)
- Create an Emissive Material (-> mover-03-grappling-hook-movement-mode)
- Set up Grapple Point Appearance (-> mover-03-grappling-hook-movement-mode)
- Add Grapple Point Logic (-> mover-03-grappling-hook-movement-mode)
- Store the Player Pawn as a Variable (-> mover-03-grappling-hook-movement-mode)
- Change a Grapple Point’s Glow (-> mover-03-grappling-hook-movement-mode)
- Check for Distance to Player (-> mover-03-grappling-hook-movement-mode)
- Check for Player Camera Direction (-> mover-03-grappling-hook-movement-mode)
- Test the Grapple Point (-> mover-03-grappling-hook-movement-mode)
- Build the Grappling Hook Actor Component (-> mover-03-grappling-hook-movement-mode)
- Create the Actor Component Class (-> mover-03-grappling-hook-movement-mode)
- Implement the FindClosestGrappleTarget Function (-> mover-03-grappling-hook-movement-mode)
- Check for Valid Input and Gather Actor Information (-> mover-03-grappling-hook-movement-mode)
- Check all Grapple Points (-> mover-03-grappling-hook-movement-mode)
- Create the Grappling Hook Movement Mode (-> mover-03-grappling-hook-movement-mode)
- Create and Set Up a New Movement Mode Class (-> mover-03-grappling-hook-movement-mode)
- Implement GenerateMove (-> mover-03-grappling-hook-movement-mode)
- Add Standard Setup Code to SimulationTick (-> mover-03-grappling-hook-movement-mode)
- Set Up and Validate Grappling-Specific Properties (-> mover-03-grappling-hook-movement-mode)
- Implement Grappling-Specific Movement Logic (-> mover-03-grappling-hook-movement-mode)
- End the Grappling Movement (-> mover-03-grappling-hook-movement-mode)
- Implement Deactivate() (-> mover-03-grappling-hook-movement-mode)
- Implement OnRegistered() and OnUnregistered() (-> mover-03-grappling-hook-movement-mode)
- Complete Code (-> mover-03-grappling-hook-movement-mode)
- Add Grapple to the Character Blueprint (-> mover-03-grappling-hook-movement-mode)
- Add the Movement Mode (-> mover-03-grappling-hook-movement-mode)
- Connect the Grapple Point Class (-> mover-03-grappling-hook-movement-mode)
- Add the Cable Component (-> mover-03-grappling-hook-movement-mode)
- Queue the Movement Mode (-> mover-03-grappling-hook-movement-mode)
- Send Grapple Point Information to the Movement Mode (-> mover-03-grappling-hook-movement-mode)
- Test the Grapple Hook Movement (-> mover-03-grappling-hook-movement-mode)
- Adjust Grapple Hook Behavior (-> mover-03-grappling-hook-movement-mode)
- Next Up (-> mover-03-grappling-hook-movement-mode)

Related documents

Build a Parkour Platforming Game with Mover

 [image: Build a Parkour Platforming Game with Mover] (-> mover-00-build-a-platformer-course-with-mover)Mover

 [image: Mover] (-> mover-in-unreal-engine)Line Trace Single (-> BlueprintAPI)Traces Tutorials

 [image: Traces Tutorials] (-> traces-tutorials-in-unreal-engine)Materials

 [image: Materials] (-> unreal-engine-materials)
