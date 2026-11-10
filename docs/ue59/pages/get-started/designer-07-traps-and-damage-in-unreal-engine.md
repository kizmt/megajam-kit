# Traps and Damage

https://dev.epicgames.com/documentation/en-us/unreal-engine/designer-07-traps-and-damage-in-unreal-engine?application_version=5.9

> Learn to build environmental blueprints that damage the player and build a game-over loop that triggers when the player is eliminated.

[image: Traps and Damage]

Environmental hazards play a big role in shaping gameplay. By using hazards and traps, you add consequences for the player and escalate the difficulty and tension as they progress through a puzzle or level.

In this part of the tutorial series, you’ll create a spike trap and a fire trap that can damage the player. Then you’ll connect your fire trap and switch gameplay objects to create a new gameplay mechanic and puzzle.

Now that the player can take damage and lose all their health, you’ll also set up a fail condition that ends and restarts the game, giving players the chance to try again.

## Before You Begin

Make sure you understand these topics covered in previous sections of Design a Puzzle Adventure (-> design-a-puzzle-adventure-game-in-unreal-engine):

- Blueprint basics like variables, functions, event graphs, and adding nodes.
- Using blueprint interface events to make a switch toggle another gameplay object.

You’ll need the following assets from Create a Key (-> designer-02-create-a-key-in-unreal-engine) and Puzzles: Switches and Cubes (-> designer-05-puzzles-switches-and-cubes-in-unreal-engine):

- `M_BasicColor` Material and `M_BasicColor_Red` Material Instance
- `BPI_Interaction` Blueprint Interface
- `BP_Switch` Blueprint Class

## Build a Set of Related Blueprint Classes

Throughout this tutorial series, you’ve encountered Unreal Engine assets that use parent-child relationships and inheritance. **Inheritance **means creating a new child class that reuses and extends the features of an existing parent class. The child class can expand upon those features without altering the parent. Inheritance saves you time by reusing useful features across many assets instead of manually adding them to each new asset.

Your Material Instance assets inherit features from their parent Materials. In many of your blueprints, you created components that inherit transform data from a parent component.

Games use different types of hazards, but they often share the same core features. A parent trap blueprint can define those shared features, while each child trap blueprint extends those features, adding different visuals and behaviors.

Your base (parent) trap needs to detect player overlap and use the damage game mechanic to decrease player health over time. Then, you’ll create (or subclass) child traps to extend the base trap’s features and add additional visuals or behaviors. The spike trap adds additional static meshes to its appearance, and the fire trap adds a fire effect and behavior that makes it toggle on and off.

Your level is still in the blockout stage, so focus on creating a simplified version of each trap that still informs the future visual design.

## Create the Base Trap Blueprint

First, create the base trap blueprint class as a parent of and foundation for your specialized traps.

To create a blueprint that defines common trap features, follow these steps:

- In the **Content Browser**, go to the **Content > AdventureGame > Designer > Blueprints** folder, and create a new folder named `Traps`.
- In the **Traps **folder, right-click or click **Add**, and create a new **Blueprint Class**.
- In the `Pick Parent Class` window, click **Actor**.
- Name this class `BP_TrapBase` and open it.

### Add Components

For the base trap, you’ll create a blockout-style static mesh to show the trap’s boundaries. All traps also need a collision volume to know when the player steps on them.

To create the physical components of the base trap, follow these steps:

- In the **Components **tab, click **Add**, and search for and add a **Cube** static mesh shape.
- Name the mesh component `TrapBase`.
- In the **Details **panel under **Transform**, change the cube’s **Scale **to `2`, `2`, `0.1` to create a flat square base.
- In the **Components **tab, with **TrapBase **selected, click **Add**, and search for and select a **Box Collision **component.
- Name the collision component `TrapTrigger`. This is the collision volume you’ll use to detect when the player is standing on the trap.Just like with `BP_Switch`, you’re attaching the collision component to the mesh, so if you want to change the size of the trap, the trigger area automatically adjusts.
- In the **Details **panel under **Transform**, change the following properties to create a large collision box above the base mesh:Set **Location **to `0`, `0`, `400`.
- Set **Scale **to `1.5`, `1.5`, `12`.

### Add Variables

All traps also need editable properties that let you customize:

- If the hazard is active or inactive.
- The damage the trap does to the player.
- The damage interval, or time between hits.

And, the trap needs to know who collided with it.

To add common properties to the base trap, follow these steps:

- In the **My Blueprint **tab, create the following variables: |  |  |  |  |
| --- | --- | --- | --- |
| **Variable Name** | **Type** | **Category** | **Default Value** |
| Active | Boolean | Setup | True |
| BaseDamage | Float | Setup | 5.0 |
| DamageInterval | Float | Setup | 1.0 | After creating a variable, compile your blueprint to add a default value.
- Click each variable’s eye icon so the eye is open, making all three variables editable and public.
- Add a variable named `OtherActor` and change the type to **Actor (Object Reference)**.

### Create a Function to Apply Damage

Now that your trap has its base properties, you can start creating the trap’s behavior. All traps should lower the player’s hit points (HP) at a regular interval when the player overlaps the collision volume.

Unreal Engine has built-in solutions for many common gameplay mechanics, including applying and receiving damage.

For the trap, you’ll use the built-in **Apply Damage** function node. To organize the damage-handling logic, you’ll create your own function that calls **Apply Damage** on all characters touching the trap if the trap is active.

To create a function that applies trap damage to the player, follow these steps:

- In the **Functions **section, click **Add**. Name this function `fnApplyDamageToTargets` and open its graph.
- You only want to apply damage if the trap is turned on and active, so add a **Branch **node where the **Condition **is a reference (Get) to the **Active **variable.
- Later in this tutorial, you’ll add some NPC enemies, so it’s possible that many actors could be on the trap at once. So, when the trap is active, loop through an array of all actors touching the trap:Connect the **Branch **node’s **True **pin to a **For Each Loop **node.
- For the loop’s **Array **input, you need to create an array of all overlapping actors. Unreal Engine does this for you — add a **Get Overlapping Actors (TrapTrigger)** node. The node comes with a reference to **TrapTrigger **as its **Target**.
- In the **Get Overlapping Actors **node, change the **Class Filter** to **Character **so player and NPC characters can be added to the array.

- For each array element, or each iteration of the loop, apply the amount of damage set in the **BaseDamage **variable to the actor in that array element. To do this, connect an **Apply Damage** node to the** Loop Body**.The **Apply Damage **function comes from the Unreal Engine Game Statics library. The icon in the top-right corner means the function can be used in networked games and can run on the server.
- Set up the **Apply Damage** node:For the **Damaged Actor **pin, connect the loop’s **Array Element**.
- For the **Base Damage **pin, connect a reference to the **BaseDamage **variable.

6. **Save **and **Compile **your blueprint.

Your complete **fnApplyDamageToTarget **function should look like the following:

 Blueprint

Begin Object Class=/Script/BlueprintGraph.K2Node_FunctionEntry Name="K2Node_FunctionEntry_0" ExportPath="/Script/BlueprintGraph.K2Node_FunctionEntry'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase:fnApplyDamageToTarget.K2Node_FunctionEntry_0'"
 ExtraFlags=201457664
 FunctionReference=(MemberName="fnApplyDamageToTarget")
 bIsEditable=True
 NodePosX=-48
 NodeGuid=E1CF5C484C4C50F88A9982B16C525D7A
 CustomProperties Pin (PinId=5C7FA8294420931C87976FA91D3CDB6C,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_0 48687F24457D16B84F0A97ACBBA9307B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_IfThenElse Name="K2Node_IfThenElse_0" ExportPath="/Script/BlueprintGraph.K2Node_IfThenElse'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase:fnApplyDamageToTarget.K2Node_IfThenElse_0'"
 NodePosX=384
 NodeGuid=2329C9BE42EA59BB32126680BB87FE5E
 CustomProperties Pin (PinId=48687F24457D16B84F0A97ACBBA9307B,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_FunctionEntry_0 5C7FA8294420931C87976FA91D3CDB6C,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=E10536234FCED1E3F766DC89CF80DF11,PinName="Condition",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",AutogeneratedDefaultValue="true",LinkedTo=(K2Node_VariableGet_0 0116829D49A294115BBCB584B4B3E9D9,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=B578BF224988AE3D9A9106ACAAB3240C,PinName="then",PinFriendlyName=NSLOCTEXT("K2Node", "true", "true"),Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_0 A79483694A42B4866CCFD0BCF672E844,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=E3485BC94137D83512AAD79617DE1033,PinName="else",PinFriendlyName=NSLOCTEXT("K2Node", "false", "false"),Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_0" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase:fnApplyDamageToTarget.K2Node_VariableGet_0'"
 VariableReference=(MemberName="Active",MemberGuid=C47B742F4E5A6345ACD855B9BF051CA6,bSelfContext=True)
 NodePosX=224
 NodePosY=80
 NodeGuid=FBB9CB5544E7BE418834CFBB8530A382
 CustomProperties Pin (PinId=0116829D49A294115BBCB584B4B3E9D9,PinName="Active",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",LinkedTo=(K2Node_IfThenElse_0 E10536234FCED1E3F766DC89CF80DF11,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=5D793A0943ED6D4B71C53C80F1C9F525,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_MacroInstance Name="K2Node_MacroInstance_0" ExportPath="/Script/BlueprintGraph.K2Node_MacroInstance'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase:fnApplyDamageToTarget.K2Node_MacroInstance_0'"
 MacroGraphReference=(MacroGraph="/Script/Engine.EdGraph'/Engine/EditorBlueprintResources/StandardMacros.StandardMacros:ForEachLoop'",GraphBlueprint="/Script/Engine.Blueprint'/Engine/EditorBlueprintResources/StandardMacros.StandardMacros'",GraphGuid=99DBFD5540A796041F72A5A9DA655026)
 NodePosX=1168
 NodeGuid=1B48A6A943E4DC86D488679482F6F708
 CustomProperties Pin (PinId=A79483694A42B4866CCFD0BCF672E844,PinName="Exec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_0 B578BF224988AE3D9A9106ACAAB3240C,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=89FD10DD4A71D58BB179829D8F3595A2,PinName="Array",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_2 AA7627E04B0C0978DAAE06BA489CA11F,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=14C2AE334767C3B2767049B8BCB7E1A3,PinName="LoopBody",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_4 BD8074D04EEE72399B1266A8F0CE8ED0,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=16595E414C7A3EDAA59F5783F8E99450,PinName="Array Element",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_4 780FE73B406D59A5F9790F9F6C394A13,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=57D2A8A44C12BE01C215F38508192851,PinName="Array Index",Direction="EGPD_Output",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=2F3B3BBB461F406E0890D4A0ED0F6070,PinName="Completed",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_2" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase:fnApplyDamageToTarget.K2Node_CallFunction_2'"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.PrimitiveComponent'",MemberName="GetOverlappingActors")
 NodePosX=800
 NodePosY=64
 NodeGuid=5896674E4A9EBE044EDCE5AF03E9D775
 CustomProperties Pin (PinId=25F5F6B34F922B4FA0C820B9E156E6D6,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.PrimitiveComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_3 5682B50A44A52A251E2D068A34A125E0,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=AA7627E04B0C0978DAAE06BA489CA11F,PinName="OverlappingActors",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_0 89FD10DD4A71D58BB179829D8F3595A2,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=FD6CA91E41A3D059F86BC89CF37613D8,PinName="ClassFilter",PinType.PinCategory="class",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=True,PinType.bSerializeAsSinglePrecisionFloat=False,AutogeneratedDefaultValue="None",DefaultObject="/Script/Engine.Character",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_3" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase:fnApplyDamageToTarget.K2Node_VariableGet_3'"
 VariableReference=(MemberName="TrapTrigger",bSelfContext=True)
 NodePosX=640
 NodePosY=112
 NodeGuid=587601004C7AF127BFAB00B74231E396
 CustomProperties Pin (PinId=5682B50A44A52A251E2D068A34A125E0,PinName="TrapTrigger",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.BoxComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_2 25F5F6B34F922B4FA0C820B9E156E6D6,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=057C51D2404237892639FB8CC98D1B17,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_4" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase:fnApplyDamageToTarget.K2Node_CallFunction_4'"
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.GameplayStatics'",MemberName="ApplyDamage")
 NodePosX=1424
 NodeGuid=CF0D228847A72846529A3D8CD4035CA6
 CustomProperties Pin (PinId=BD8074D04EEE72399B1266A8F0CE8ED0,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_0 14C2AE334767C3B2767049B8BCB7E1A3,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=477D750645BFB51697BF92B14AFDEC93,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=EECCDC394E11737A094968B259369263,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.GameplayStatics'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__GameplayStatics",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=780FE73B406D59A5F9790F9F6C394A13,PinName="DamagedActor",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_0 16595E414C7A3EDAA59F5783F8E99450,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=46E81B204AE7F60D31ACB7B2F3752AC7,PinName="BaseDamage",PinType.PinCategory="real",PinType.PinSubCategory="float",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_VariableGet_5 915438754B7DD89B8FB36AA93998BEC8,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=886F32A64073001B9F5B6AA282298372,PinName="EventInstigator",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Controller'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=263FA01E4B5DB3E0BFAEE7B1F6B854B7,PinName="DamageCauser",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=07B291AA4E2C496F54A3ABA56D69BB69,PinName="DamageTypeClass",PinType.PinCategory="class",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.DamageType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=True,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=FCD89C0148C62F221E1093A0B479602A,PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="real",PinType.PinSubCategory="float",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_5" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase:fnApplyDamageToTarget.K2Node_VariableGet_5'"
 VariableReference=(MemberName="BaseDamage",MemberGuid=C9A277AB4AC3C68D56533D94444FED50,bSelfContext=True)
 NodePosX=1232
 NodePosY=176
 NodeGuid=2E47774842ECCC9DC1A55DAD32B90415
 CustomProperties Pin (PinId=915438754B7DD89B8FB36AA93998BEC8,PinName="BaseDamage",Direction="EGPD_Output",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_CallFunction_4 46E81B204AE7F60D31ACB7B2F3752AC7,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=59598AEB47F3DB1EB3A2ED85A10F6E89,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_32" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase:fnApplyDamageToTarget.EdGraphNode_Comment_32'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=208
 NodePosY=-64
 NodeWidth=384
 NodeHeight=208
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Check the trap is Active"
 NodeGuid=5B918A0541B11E0C59F325BD7F476819
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_33" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase:fnApplyDamageToTarget.EdGraphNode_Comment_33'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=624
 NodePosY=-64
 NodeWidth=1136
 NodeHeight=336
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Loop through all overlapping actors and apply the BaseDamage amount of damage"
 NodeGuid=0ECE18E64F47182CA99624A69BEA6C38
End Object

If you copy and paste this snippet into the corresponding graph in your project, connect the function entry node to the **Branch **node.

### Create a Timer That Applies Damage Over Time

Next, you need to make the trap call the apply-damage function at regular time intervals. To do this, you’ll use one of Unreal Engine’s timer functions to create a timer.

In this blueprint, you’ll use **Set Timer by Function Name**:

This node creates a timer and binds a function to that timer so that when the timer expires, the node calls the function, executing all the actions in that function.

To set up a timer when the game starts, follow these steps:

- Go to `BP_TrapBase`’s **EventGraph **tab. Delete the provided **Event ActorBeginOverlap **and **Event Tick** nodes.
- Before the trap performs any actions, you want to check if it’s active. From the **Event BeginPlay **node, add a **Branch **node where the **Condition **is a reference to the **Active **variable.
- From the **Branch **node’s **True **pin, create a **Set Timer by Function Name** node.
- Set up the timer node:For the **Time **pin, connect a reference to the **DamageInterval **variable.
- Click the text box next to **Function Name**, and enter `fnApplyDamageToTarget`.Ensure you’ve spelled the function name correctly or the logic won’t execute properly.
- Enable **Looping**.

- **Set Timer** nodes output a return value called a **Timer Handle** that acts like a tracking number or controller for the timer. To stop, pause, or resume the timer, you’ll reference this timer handle, so save it in a new variable:In the **My Blueprint** panel, create a new variable named `TimerHandler`. Change its type to** Timer Handle**.
- Add a **Set Timer Handler** node and connect it to **Set Timer by Event**’s return value and exec pins.

- When Unreal Engine creates a timer, it starts running immediately, so you need to pause the timer until a character steps on the trap. Connect a **Pause Timer by Handle** node and give it your **TimerHandler**.
- **Save **and **Compile **your blueprint.

You can also create timers with a **Set Timer by Event** node. Here, you’d use the node actions list to **Add Custom Event** and use it as a **delegate **to bind actions to the timer.

Custom events are reusable, named blocks of logic similar to functions. Unlike functions, they can contain delays, timeline nodes, and other latent actions — so you may need to use this method as your game grows in complexity.

Connect an event’s square delegate pin to pass a reference of that event to the timer node. This isn’t triggering the event, but instead storing the event and its actions for later (when the time interval expires).

### Start and Stop Damage

You’ve created and paused the damage timer so it’s ready and waiting. Now, make the damage resume when a character steps on the trap’s collision volume, and pause the damage when characters stop overlapping the volume.

To add logic that starts the damage, follow these steps:

- In the **Components **panel, right-click the **TrapTrigger **component, go to **Add Event**, and select **Add OnComponentBeginOverlap**.
- After the event, connect a **Set Other Actor** node to save the overlapping actor in the variable.
- Connect the event and **Set **node’s **Other Actor** pins.
- Connect an **fnApplyDamageToTarget **node so the character receives damage immediately when touching the trap.
- Connect an **Unpause Timer by Handle** node to resume the timer and damage intervals. For its **Handle input**, connect a reference to the **TimerHandler **variable.

To add logic that stops the damage over time, follow these steps:

- Right-click the **TrapTrigger **component, go to **Add Event > On Component End Overlap**.
- After the event, connect a **Pause Timer by Handle** node, again giving it a reference to **TimerHandler**.
- **Save **and **Compile **your blueprint.

The trap now creates, starts, and pauses a damage timer.

The finished `BP_TrapBase` event graph should look like the following:

 Blueprint

Begin Object Class=/Script/BlueprintGraph.K2Node_Event Name="K2Node_Event_0" ExportPath="/Script/BlueprintGraph.K2Node_Event'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase:EventGraph.K2Node_Event_0'"
 EventReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.Actor'",MemberName="ReceiveBeginPlay")
 bOverrideFunction=True
 NodePosX=-64
 NodePosY=-32
 bCommentBubblePinned=True
 NodeGuid=5BDFD8574CC68464A5F78EBB7DDB1657
 CustomProperties Pin (PinId=A42FA84644FDAD68CD31B5A3CAC8D3F4,PinName="OutputDelegate",Direction="EGPD_Output",PinType.PinCategory="delegate",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.Actor'",MemberName="ReceiveBeginPlay"),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=1EB6CDC74CA58D93EEE18E82EB381D93,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_0 0D5D8B7F42141C47CA9BBA8D09BCB710,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_IfThenElse Name="K2Node_IfThenElse_0" ExportPath="/Script/BlueprintGraph.K2Node_IfThenElse'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase:EventGraph.K2Node_IfThenElse_0'"
 NodePosX=352
 NodePosY=-32
 NodeGuid=8A758287451AE6D1855A2CBF67661E89
 CustomProperties Pin (PinId=0D5D8B7F42141C47CA9BBA8D09BCB710,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Event_0 1EB6CDC74CA58D93EEE18E82EB381D93,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=87A167404B91CAD864B125A1CCE9FCE2,PinName="Condition",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",AutogeneratedDefaultValue="true",LinkedTo=(K2Node_VariableGet_0 F3099A5D47DC7B7ED3A3D3AFDC1C2CF3,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D2EB346745F7906DBEBEF392B3BFF4F3,PinName="then",PinFriendlyName=NSLOCTEXT("K2Node", "true", "true"),Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_0 52E6EEC749112A57CEBC0A8EA57BFB05,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=3101DB174D3BCD9F13A2CFA4AC133449,PinName="else",PinFriendlyName=NSLOCTEXT("K2Node", "false", "false"),Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_0" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase:EventGraph.K2Node_VariableGet_0'"
 VariableReference=(MemberName="Active",MemberGuid=C47B742F4E5A6345ACD855B9BF051CA6,bSelfContext=True)
 NodePosX=192
 NodePosY=48
 NodeGuid=6901745648B6E059378A05852A03901F
 CustomProperties Pin (PinId=F3099A5D47DC7B7ED3A3D3AFDC1C2CF3,PinName="Active",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",LinkedTo=(K2Node_IfThenElse_0 87A167404B91CAD864B125A1CCE9FCE2,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=1D9112C44EF77E18DCBE478002E311E7,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_0" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase:EventGraph.K2Node_CallFunction_0'"
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetSystemLibrary'",MemberName="K2_SetTimer")
 NodePosX=802
 NodePosY=-30
 AdvancedPinDisplay=Hidden
 NodeGuid=CC6FEFFD4EC5985BB64E81ABB513E0E5
 CustomProperties Pin (PinId=52E6EEC749112A57CEBC0A8EA57BFB05,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_0 D2EB346745F7906DBEBEF392B3BFF4F3,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=2659219C426F76B06ED34696CA63F1D0,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_2 941525224254535F9F43A1A248954A0A,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=DCB6664E475C61680B94EA9B72B813C3,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.KismetSystemLibrary'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__KismetSystemLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=60CE219A419B9C9DED27E1942F2F8EB3,PinName="Object",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/CoreUObject.Object'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=200EE41141FF6ABF74B9E19C39E66041,PinName="FunctionName",PinType.PinCategory="string",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="fnApplyDamageToTarget",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=90A301254849122CA909CCAE83FEB40A,PinName="Time",PinType.PinCategory="real",PinType.PinSubCategory="float",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_VariableGet_2 B22961954685B1EA26602584B13A1239,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=A164A30A4F9F8C68966E6E8AD9589A0D,PinName="bLooping",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",AutogeneratedDefaultValue="false",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=488845034877F6467F6B0DB3E35630FD,PinName="bMaxOncePerFrame",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=9758DC3B4775E06594B07080042EBF28,PinName="InitialStartDelay",PinType.PinCategory="real",PinType.PinSubCategory="float",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.000000",AutogeneratedDefaultValue="0.000000",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)
 CustomProperties Pin (PinId=E9F20B104AD927434191E1B8B9590467,PinName="InitialStartDelayVariance",PinType.PinCategory="real",PinType.PinSubCategory="float",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.000000",AutogeneratedDefaultValue="0.000000",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)
 CustomProperties Pin (PinId=EE71CA4D49AE1B69A32671B7D361BB75,PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/Engine.TimerHandle'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_2 06A13B6C458FD82E61491D8BC7DC111B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_2" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase:EventGraph.K2Node_VariableGet_2'"
 VariableReference=(MemberName="DamageInterval",MemberGuid=F45E7CC74F1E97530FD0A2A84615BC83,bSelfContext=True)
 NodePosX=626
 NodePosY=114
 NodeGuid=526567AC420D643C99309AA0024BD7BE
 CustomProperties Pin (PinId=B22961954685B1EA26602584B13A1239,PinName="DamageInterval",Direction="EGPD_Output",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_CallFunction_0 90A301254849122CA909CCAE83FEB40A,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=9CB05D354FB919695F372AA01F29E590,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableSet Name="K2Node_VariableSet_2" ExportPath="/Script/BlueprintGraph.K2Node_VariableSet'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase:EventGraph.K2Node_VariableSet_2'"
 VariableReference=(MemberName="TimerHandler",MemberGuid=0B3CA01A4E1380A1C76951B0C712595F,bSelfContext=True)
 NodePosX=1154
 NodePosY=-14
 NodeGuid=52BFBA3F4FB64F71ED8157A1769773AF
 CustomProperties Pin (PinId=941525224254535F9F43A1A248954A0A,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_0 2659219C426F76B06ED34696CA63F1D0,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=1A838EB244B84A2619BA568A8AEC2370,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_5 5F7333A84E9D6004496118849A024B69,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=06A13B6C458FD82E61491D8BC7DC111B,PinName="TimerHandler",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/Engine.TimerHandle'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_0 EE71CA4D49AE1B69A32671B7D361BB75,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=46DAE841499981C2F7843D807D84E2CF,PinName="Output_Get",PinToolTip="Retrieves the value of the variable, can use instead of a separate Get node",Direction="EGPD_Output",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/Engine.TimerHandle'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_5 9FFBD841490F0035283EEBA52B4A6DE8,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=A2610B0C4EF20F12B946DF96739F7892,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_5" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase:EventGraph.K2Node_CallFunction_5'"
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetSystemLibrary'",MemberName="K2_PauseTimerHandle")
 NodePosX=1378
 NodePosY=-30
 NodeGuid=596DE4E247F802D4BC0CAE9398FE3ADF
 CustomProperties Pin (PinId=5F7333A84E9D6004496118849A024B69,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_2 1A838EB244B84A2619BA568A8AEC2370,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=608745634C7F3854D950E0BD320C1605,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=57A76CDD482976B04BA75B9786BD0E7D,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.KismetSystemLibrary'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__KismetSystemLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=713D37A14B2F8BE38D4A2CB0BFFC8DEC,PinName="WorldContextObject",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/CoreUObject.Object'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=9FFBD841490F0035283EEBA52B4A6DE8,PinName="Handle",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/Engine.TimerHandle'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_2 46DAE841499981C2F7843D807D84E2CF,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_ComponentBoundEvent Name="K2Node_ComponentBoundEvent_0" ExportPath="/Script/BlueprintGraph.K2Node_ComponentBoundEvent'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase:EventGraph.K2Node_ComponentBoundEvent_0'"
 DelegatePropertyName="OnComponentBeginOverlap"
 DelegateOwnerClass="/Script/CoreUObject.Class'/Script/Engine.PrimitiveComponent'"
 ComponentPropertyName="TrapTrigger"
 EventReference=(MemberParent="/Script/CoreUObject.Package'/Script/Engine'",MemberName="ComponentBeginOverlapSignature__DelegateSignature")
 bInternalEvent=True
 CustomFunctionName="BndEvt__BP_TrapBase_TrapTrigger_K2Node_ComponentBoundEvent_0_ComponentBeginOverlapSignature__DelegateSignature"
 NodePosX=-32
 NodePosY=384
 NodeGuid=F80BBB774635977C34DFEBA2F74BD4F2
 CustomProperties Pin (PinId=E70E53244193A3191106B79D44DA2264,PinName="OutputDelegate",Direction="EGPD_Output",PinType.PinCategory="delegate",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(MemberParent="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase_C'",MemberName="BndEvt__BP_TrapBase_TrapTrigger_K2Node_ComponentBoundEvent_0_ComponentBeginOverlapSignature__DelegateSignature"),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=6E9471BC4733149C025A059592A7B0BF,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_1 A27B1F52430D84688F61FA9D1494F843,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=A10DABEB49B7E0FD80A393B19F57858F,PinName="OverlappedComponent",PinToolTip="Overlapped Component\nPrimitive Component Object Reference",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.PrimitiveComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=629CE52441BCBDE31578459A1E3EAFDF,PinName="OtherActor",PinToolTip="Other Actor\nActor Object Reference",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_1 72E72AE5453F9A6907F4F1A9E6AA7D1E,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=82E0825F4399FE6884DA32A85BEF889E,PinName="OtherComp",PinToolTip="Other Comp\nPrimitive Component Object Reference",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.PrimitiveComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=B86A79C646405153996671BEB22B84A3,PinName="OtherBodyIndex",PinToolTip="Other Body Index\nInteger",Direction="EGPD_Output",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0",AutogeneratedDefaultValue="0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=4968E07648431AB7184A2FB498BFBE86,PinName="bFromSweep",PinToolTip="From Sweep\nBoolean",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=06770BAA4D2E7155C04D62A5AE96A98A,PinName="SweepResult",PinToolTip="Sweep Result\nHit Result Structure (by ref)",Direction="EGPD_Output",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/Engine.HitResult'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=True,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_ComponentBoundEvent Name="K2Node_ComponentBoundEvent_1" ExportPath="/Script/BlueprintGraph.K2Node_ComponentBoundEvent'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase:EventGraph.K2Node_ComponentBoundEvent_1'"
 DelegatePropertyName="OnComponentEndOverlap"
 DelegateOwnerClass="/Script/CoreUObject.Class'/Script/Engine.PrimitiveComponent'"
 ComponentPropertyName="TrapTrigger"
 EventReference=(MemberParent="/Script/CoreUObject.Package'/Script/Engine'",MemberName="ComponentEndOverlapSignature__DelegateSignature")
 bInternalEvent=True
 CustomFunctionName="BndEvt__BP_TrapBase_TrapTrigger_K2Node_ComponentBoundEvent_1_ComponentEndOverlapSignature__DelegateSignature"
 NodePosX=-32
 NodePosY=720
 NodeGuid=B51B4E3B45D2DACC3541B09CACBC6BB7
 CustomProperties Pin (PinId=F13B29A946E820ED0DD5F997B97B6665,PinName="OutputDelegate",Direction="EGPD_Output",PinType.PinCategory="delegate",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(MemberParent="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase_C'",MemberName="BndEvt__BP_TrapBase_TrapTrigger_K2Node_ComponentBoundEvent_1_ComponentEndOverlapSignature__DelegateSignature"),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=163A629048FECF37DB8FA5B4D1D75153,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_8 A2E110894FDB96F810C145928BBF2504,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=036AF1E4436EF00DBD58A7AC734F25BF,PinName="OverlappedComponent",PinToolTip="Overlapped Component\nPrimitive Component Object Reference",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.PrimitiveComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=5E212A09488E857169C4CAB2FC1266B3,PinName="OtherActor",PinToolTip="Other Actor\nActor Object Reference",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F770435F4CA2339EFF9CE5ABFC1F2D8E,PinName="OtherComp",PinToolTip="Other Comp\nPrimitive Component Object Reference",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.PrimitiveComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=E0A390D9454A3F8777C7818D262545E5,PinName="OtherBodyIndex",PinToolTip="Other Body Index\nInteger",Direction="EGPD_Output",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0",AutogeneratedDefaultValue="0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableSet Name="K2Node_VariableSet_1" ExportPath="/Script/BlueprintGraph.K2Node_VariableSet'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase:EventGraph.K2Node_VariableSet_1'"
 VariableReference=(MemberName="OtherActor",MemberGuid=69CDE2FD46FEBDC2A3E5848B7DA07F45,bSelfContext=True)
 NodePosX=400
 NodePosY=400
 NodeGuid=8D72A9B44553BC052260E3983D1A0F0B
 CustomProperties Pin (PinId=A27B1F52430D84688F61FA9D1494F843,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_ComponentBoundEvent_0 6E9471BC4733149C025A059592A7B0BF,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=9FA66814428DF168FBCFF2877F31256E,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_6 8F2278AE47EFCBE61EC4398AE0FA0540,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=72E72AE5453F9A6907F4F1A9E6AA7D1E,PinName="OtherActor",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_ComponentBoundEvent_0 629CE52441BCBDE31578459A1E3EAFDF,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=A6688848418CB023059F26B1ECB6FBB2,PinName="Output_Get",PinToolTip="Retrieves the value of the variable, can use instead of a separate Get node",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=9BCF6CD84648E99E74F172AEE7A57B33,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_6" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase:EventGraph.K2Node_CallFunction_6'"
 FunctionReference=(MemberName="fnApplyDamageToTarget",MemberGuid=C46B3DA14CA4C6D39D5760A7E958C0B4,bSelfContext=True)
 NodePosX=720
 NodePosY=368
 NodeGuid=51E22B2A47EC0B79D91E739A1894B526
 CustomProperties Pin (PinId=8F2278AE47EFCBE61EC4398AE0FA0540,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_1 9FA66814428DF168FBCFF2877F31256E,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=1D530240469CC98ED4A2D39257280DDB,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_7 5511AB9A401A29ADA2E3C7BE452953E5,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=4D77D9834CF36D2A27B007B9A4BCDEE7,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="self",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_7" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase:EventGraph.K2Node_CallFunction_7'"
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetSystemLibrary'",MemberName="K2_UnPauseTimerHandle")
 NodePosX=1248
 NodePosY=384
 NodeGuid=2B1D1C324CBEAF3EAFE3E3A2212FEB5C
 CustomProperties Pin (PinId=5511AB9A401A29ADA2E3C7BE452953E5,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_6 1D530240469CC98ED4A2D39257280DDB,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=93F6153B4DC769744964B185D2D43C33,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=895AEC0B473AD7980F019984409EAF53,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.KismetSystemLibrary'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__KismetSystemLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=80D6F7AB430E70D2DC626E9B6339AF5E,PinName="WorldContextObject",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/CoreUObject.Object'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=E5E45D44430CA029FDFF7085070105CA,PinName="Handle",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/Engine.TimerHandle'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_4 364EC1D74FA5A57D471C26B991B8D2D6,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_4" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase:EventGraph.K2Node_VariableGet_4'"
 VariableReference=(MemberName="TimerHandler",MemberGuid=0B3CA01A4E1380A1C76951B0C712595F,bSelfContext=True)
 NodePosX=1072
 NodePosY=448
 NodeGuid=488372024F59CFAE335F5A9E75B199E8
 CustomProperties Pin (PinId=364EC1D74FA5A57D471C26B991B8D2D6,PinName="TimerHandler",Direction="EGPD_Output",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/Engine.TimerHandle'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_7 E5E45D44430CA029FDFF7085070105CA,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F785B0384E48CF3FEF30169451C12604,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_8" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase:EventGraph.K2Node_CallFunction_8'"
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetSystemLibrary'",MemberName="K2_PauseTimerHandle")
 NodePosX=592
 NodePosY=720
 NodeGuid=9786E2194EC53402D4FB57890A378D51
 CustomProperties Pin (PinId=A2E110894FDB96F810C145928BBF2504,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_ComponentBoundEvent_1 163A629048FECF37DB8FA5B4D1D75153,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=93B8B3C0419E73AF3C3E958DC2D660B4,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=C33DEBEE4B1E282F27C672AA72025FAD,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.KismetSystemLibrary'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__KismetSystemLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F82C0DA8436B012E8B579BA37ABFBB20,PinName="WorldContextObject",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/CoreUObject.Object'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=345C6BEF4F972D37DA3985843D12DA2D,PinName="Handle",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/Engine.TimerHandle'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_5 364EC1D74FA5A57D471C26B991B8D2D6,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_5" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase:EventGraph.K2Node_VariableGet_5'"
 VariableReference=(MemberName="TimerHandler",MemberGuid=0B3CA01A4E1380A1C76951B0C712595F,bSelfContext=True)
 NodePosX=400
 NodePosY=784
 NodeGuid=8BE3ED16484F55D07F959B821110D2BB
 CustomProperties Pin (PinId=364EC1D74FA5A57D471C26B991B8D2D6,PinName="TimerHandler",Direction="EGPD_Output",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/Engine.TimerHandle'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_8 345C6BEF4F972D37DA3985843D12DA2D,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F785B0384E48CF3FEF30169451C12604,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_32" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase:EventGraph.EdGraphNode_Comment_32'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=160
 NodePosY=-80
 NodeHeight=192
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Check the trap is Active"
 NodeGuid=C8F09CA0419C94BB68418395B35165C5
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_0" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase:EventGraph.EdGraphNode_Comment_0'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=592
 NodePosY=-128
 NodeWidth=1024
 NodeHeight=384
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Create a looping timer with fnApplyDamageToTarget, save the timer handle, and pause the timer"
 NodeGuid=65DE398F472424C7E0572E92BC77419B
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_28" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase:EventGraph.EdGraphNode_Comment_28'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=672
 NodePosY=288
 NodeWidth=336
 NodeHeight=224
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Immediately apply damage to OtherActor"
 NodeGuid=FF5EFAD446312E2E37A7439DF3DC9F36
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_1" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase:EventGraph.EdGraphNode_Comment_1'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=336
 NodePosY=320
 NodeWidth=304
 NodeHeight=192
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Save the overlapping actor"
 NodeGuid=2C2E567040377F8614C8EAA940C88A87
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_29" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase:EventGraph.EdGraphNode_Comment_29'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=1040
 NodePosY=288
 NodeWidth=464
 NodeHeight=224
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Unpause the timer, applying damage over time"
 NodeGuid=AE0B3F204AEDB098EE5BB5B590E3C3B0
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_30" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase:EventGraph.EdGraphNode_Comment_30'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=368
 NodePosY=656
 NodeWidth=528
 NodeHeight=208
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Pause the timer, stopping damage over time"
 NodeGuid=EB62BFB04BAEC775757183AC153E7411
End Object

For more information about timers and timer management, see Gameplay Timers (-> gameplay-timers-in-unreal-engine).

### Test the Base Trap

To test the trap, add a Print String message that reports on-screen when the trap applies damage.

To print a message on screen that shows the trap is working as intended, follow these steps:

- In `BP_TrapBase`, go to the **fnApplyDamageToTarget **tab.
- In the function’s graph, connect a **Print String** node after the **Apply Damage** node.
- Change the **In String **to `Player hit!`
- Click the arrow at the bottom of the **Print String** node to show more options, and change the **Duration **to `5`. This makes it easier to see the damage hits over time.
- **Compile **and **Save **the blueprint. In the **Content Browser**, drag an instance of `BP_TrapBase` into your level.
- Play the level and step on the trap. A new “Player hit!” message should appear every second.

## Subclass a Spike Trap

Now that you’ve completed your parent class, it’s time to start subclassing!

First, you’ll create a spike trap that modifies the base trap’s appearance, adding some shape language. A plain flat trap doesn’t look dangerous, but the player will interpret a spikey object as something that could hurt them.

To create a spike trap, follow these steps:

- In the **Content Browser**, in the **Traps **folder, right-click `BP_TrapBase` and select **Create Child Blueprint Class**.
- Name the blueprint class `BP_TrapSpikes` and open it.
- In the **Components **tab, with **DefaultSceneRoot **selected, click **Add**, and search for and select **Cone**.You’ll resize and position the cones to fit four rows of four cones each (or 16 in total).
- In the cone’s **Details **panel, in the **Transform **section, change the following properties:Change the **Location **to `-75`, `-75`, `25`.
- Change the **Scale **to `0.5`, `0.5`, `0.4`.

Now there’s a smaller spike in the corner of the base mesh.

- For some visual contrast, in the **Materials **section, use the dropdown menu to change the cone’s material to `M_BasicColor_Red`.
- Select and duplicate (**Ctrl + D**) the cone three times, translating each cone over by 50 units so they line up in a row across one side of the base mesh.You can reposition cones in the Details panel or in the Viewport. For faster adjustments with the gizmo, change your translate snap settings to 50 units.
- Hold **Ctrl **to select all four cones and duplicate them. In the **Components **panel, select the four new cones (they’ll have the largest number suffixes), and move them over 50 units. Repeat this two more times to create a 4x4 grid of cones.
- The slopes and angles in the spikes could make it awkward for the player to move off the trap. To prevent the player from landing between the spikes, add an invisible floor at the top of the spikes:In the **Components **tab, duplicate the **TrapBase **mesh and name it `InvisFloor`.
- Move the floor up so only the tips of the spikes are visible above the floor.
- In the **Details **panel, in the **Collision **section, ensure **Collision Presets **is set to **BlockAllDynamic**. This blocks all actors from passing through the mesh.
- In the **Rendering **section, disable **Visible**. This hides the mesh in the viewports and during gameplay.

- In the **Components **tab, select the **TrapBase **mesh. In the **Details **panel, in the **Rendering **section, enable **Hidden in Game**. This keeps the mesh visible in viewports, but hides it during gameplay, so you’ll only see the spikes.
- **Save **and **Compile **your blueprint.

The spike trap subclass has all the behavior of your base trap, so it also prints the “Player hit!” messages when the trap is working. Drag an instance of `BP_TrapSpikes` into your level and test it out!

## Subclass a Fire Trap

Next, you’ll create a trap that extends the base trap’s behavior. A fire trap adds a hazard that the player can turn off with a switch, which is a gameplay mechanic you can turn into a new puzzle.

In Puzzles: Switches and Cubes (-> designer-05-puzzles-switches-and-cubes-in-unreal-engine), you created the `BPI_Interaction` blueprint interface that a switch can use to turn other gameplay objects on and off. You can also use this interface in a trap blueprint so a switch can change the trap’s Active variable during gameplay.

First, you’ll need a new material to use when the trap is deactivated.

To create a black material for the fire trap, follow these steps:

- In the **Content Browser**, go to the **AdventureGame > Designer > Materials** folder.
- Right-click `M_BasicColor` and select **Create Material Instance**.
- Name the material instance `M_BasicColor_Black` and open it.
- Expand **Global Vector Parameter Values**, enable **Color**, and click the color swatch to change it to dark grey (Hex sRGB = `3D3B3BFF`). This looks better in-game than pure black.
- Save and close the material instance.

To subclass a fire trap, follow these steps:

- In the **Content Browser**, right-click `BP_TrapBase` and select **Create Child Blueprint Class**.
- Name the blueprint `BP_TrapFire` and open it.
- Change the base mesh's color to make it represent a fire trap. Select the **TrapBase **component and, in the **Details **panel, in the **Materials **section, change the material to `M_BasicColor_Red`.
- Above the viewport, click **Class Settings**.
- In the **Details **panel, in the **Interfaces **section, next to **Implemented Interfaces**, click **Add**, and search for and select `BPI_Interaction`. In the **My Blueprint **panel, the **fnBPISwitchOff **and **fnBPISwitchOn **event functions appear in the Interfaces section.
- Just like with `BP_Switch`, set up customizable materials for the fire trap:In the **Variables **section of the **My Blueprint** panel, create two variables named `OffMaterial` and `OnMaterial`.
- Change their type to **Material Interface (Object Reference)**.
- Click their eye icons to make them public and editable.
- Change their **Category **to **Setup**.
- Compile and set the following default values:**OffMaterial**: `M_BaseColor_Black`
- **OnMaterial**: `M_BaseColor_Red`

- **Save **and **Compile **the blueprint so you can use the interface events in the trap’s event graph.

### Extend the Trap's Behavior

Just like when you made the moving platform in Puzzles: Moving Platforms (-> designer-06-puzzles-moving-platforms-in-unreal-engine), you need to set up the trap’s event graph to take the following actions when a switch calls **fnBPISwitchOn **and **fnBPISwitchOff**:

- Activate or deactivate the trap.
- Change the trap’s material.

With the moving platform, you needed the platform to start moving when the player activates the switch. For the trap, you need the opposite — the trap is active when the level starts and should turn off when the player activates the switch.

To add logic that deactivates fire traps when the player presses a switch, follow these steps:

- Go to the fire trap’s **EventGraph **tab. In the **My Blueprint** panel, in the **Interfaces **list, double-click **fnBPIButtonOn **to add an event node to the graph.
- `BP_TrapBase` variables don’t appear in the **My Blueprint **panel, but you can access them with the node actions list. Drag off the **Event fnBPISwitchOn **node’s **exec **pin, search for `active variable`, and select **Set Active**. Keep **Active **disabled.
- After the **Set **node, connect a** Set Material (TrapBase)** node (in the **Rendering > Material** section of the actions list).
- In the **Set Material** node, connect a reference to the **OffMaterial **variable to the **Material **pin.

To add logic that activates fire traps if a switch is deactivated, follow these steps:

- In the **Interfaces **section, double-click **Event fnBPISwitchOff** to add that node.
- After the event, connect a **Set Active** variable node, but this time enable **Active**.
- After the **Set **node, connect a **Set Material (TrapBase)** node and connect a reference to **OnMaterial**.
- **Save **and **Compile **your blueprint.

Your complete fire trap event graph should look like the following:

 Blueprint

Begin Object Class=/Script/BlueprintGraph.K2Node_Event Name="K2Node_Event_3" ExportPath="/Script/BlueprintGraph.K2Node_Event'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapFire.BP_TrapFire:EventGraph.K2Node_Event_3'"
 EventReference=(MemberParent="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Core/BPI_Interaction.BPI_Interaction_C'",MemberName="fnBPISwitchOn",MemberGuid=96F89F23418461AD68E625858D3987FB)
 bOverrideFunction=True
 NodePosY=672
 NodeGuid=4284B9E5484100C52E96AF9B8CB2176F
 CustomProperties Pin (PinId=C0C16DC143082D7DE58473959B8EFF1E,PinName="OutputDelegate",Direction="EGPD_Output",PinType.PinCategory="delegate",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(MemberParent="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Core/BPI_Interaction.BPI_Interaction_C'",MemberName="fnBPISwitchOn",MemberGuid=96F89F23418461AD68E625858D3987FB),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F85333EC49AAC8F21D88F0935E787A89,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_0 98010EE844603B522DE12283BA1CAE14,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableSet Name="K2Node_VariableSet_0" ExportPath="/Script/BlueprintGraph.K2Node_VariableSet'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapFire.BP_TrapFire:EventGraph.K2Node_VariableSet_0'"
 VariableReference=(MemberName="Active",MemberGuid=C47B742F4E5A6345ACD855B9BF051CA6,bSelfContext=True)
 NodePosX=304
 NodePosY=704
 NodeGuid=7CC4A19F42FC06BB294767BEDBEC8C34
 CustomProperties Pin (PinId=98010EE844603B522DE12283BA1CAE14,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Event_3 F85333EC49AAC8F21D88F0935E787A89,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=980C87BF4F5FC2173FAA47939D9CCCD4,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_0 CCEFDE5E4066C319FDD425A0C1C59DC5,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=AEF54B4B44845E46542E13BA3D060968,PinName="Active",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=FD04B9304D255EC4DB2879B914A0C5C2,PinName="Output_Get",PinToolTip="Retrieves the value of the variable, can use instead of a separate Get node",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=116436B0447FEAE4FCA29D9446B83EA9,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_0" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapFire.BP_TrapFire:EventGraph.K2Node_CallFunction_0'"
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.PrimitiveComponent'",MemberName="SetMaterial")
 NodePosX=832
 NodePosY=672
 NodeGuid=395D30844A75DBB0DD2653A99A35831E
 CustomProperties Pin (PinId=CCEFDE5E4066C319FDD425A0C1C59DC5,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_0 980C87BF4F5FC2173FAA47939D9CCCD4,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D651AF4942C298BDF35071B531DB13BD,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=BFC6A34D495223AEFD8549A9F9F210A1,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.PrimitiveComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_0 6D866A384D9F39020A0719AA77B1B806,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=89F20846480067A08CE6ED8A61CE3481,PinName="ElementIndex",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0",AutogeneratedDefaultValue="0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=54C4BE73456875B1F008A6BFBEAC04A4,PinName="Material",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.MaterialInterface'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_2 C6F4404343943ED63E3C7582A5D00F60,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_0" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapFire.BP_TrapFire:EventGraph.K2Node_VariableGet_0'"
 VariableReference=(MemberName="TrapBase",bSelfContext=True)
 NodePosX=672
 NodePosY=752
 NodeGuid=6F10A48642C621F0561887BC47173451
 CustomProperties Pin (PinId=6D866A384D9F39020A0719AA77B1B806,PinName="TrapBase",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMeshComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_0 BFC6A34D495223AEFD8549A9F9F210A1,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=669554E94C36072F8B25DA8D3A3F9F16,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_Event Name="K2Node_Event_4" ExportPath="/Script/BlueprintGraph.K2Node_Event'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapFire.BP_TrapFire:EventGraph.K2Node_Event_4'"
 EventReference=(MemberParent="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Core/BPI_Interaction.BPI_Interaction_C'",MemberName="fnBPISwitchOff",MemberGuid=8286294A4178C98F815676A7330061B2)
 bOverrideFunction=True
 NodePosY=992
 NodeGuid=CF8AF73C4EA35D1A9E113E93727BA003
 CustomProperties Pin (PinId=D24A4F7548F3835A9CB1E68F87EB2202,PinName="OutputDelegate",Direction="EGPD_Output",PinType.PinCategory="delegate",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(MemberParent="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Core/BPI_Interaction.BPI_Interaction_C'",MemberName="fnBPISwitchOff",MemberGuid=8286294A4178C98F815676A7330061B2),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=5C789F784A6D0741339C0BA78490C24C,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_1 EBF9CF2347B799340AE66BB4BAA8871F,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableSet Name="K2Node_VariableSet_1" ExportPath="/Script/BlueprintGraph.K2Node_VariableSet'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapFire.BP_TrapFire:EventGraph.K2Node_VariableSet_1'"
 VariableReference=(MemberName="Active",MemberGuid=C47B742F4E5A6345ACD855B9BF051CA6,bSelfContext=True)
 NodePosX=304
 NodePosY=1024
 NodeGuid=4D29E9B04489974B910EE6A28B20DC80
 CustomProperties Pin (PinId=EBF9CF2347B799340AE66BB4BAA8871F,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Event_4 5C789F784A6D0741339C0BA78490C24C,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=FB7CF5C44D700509840A1A97F0A408C3,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_1 A9C9A2814855527D2B7B158421E4A5C3,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=241E67F6430008C29FAC14BEB788CACA,PinName="Active",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",AutogeneratedDefaultValue="false",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=5A1AE2C841BCE524B732C6908C92DC3D,PinName="Output_Get",PinToolTip="Retrieves the value of the variable, can use instead of a separate Get node",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=4D8C65F64C7006D889F5568CCB24A5AC,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_1" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapFire.BP_TrapFire:EventGraph.K2Node_CallFunction_1'"
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.PrimitiveComponent'",MemberName="SetMaterial")
 NodePosX=800
 NodePosY=992
 NodeGuid=F849B342471F59CB67B71FBA02C09D92
 CustomProperties Pin (PinId=A9C9A2814855527D2B7B158421E4A5C3,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_1 FB7CF5C44D700509840A1A97F0A408C3,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=FF2306694167B30504607C9F6C845AAA,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=B27029DF4593C991DDAC9E97D7872516,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.PrimitiveComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_1 158CD05F49DC1DB2691911A0E4A4101A,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=9B6F951D4D3091CD2F0BB8945367607D,PinName="ElementIndex",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0",AutogeneratedDefaultValue="0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=9220498541B930C7E3BCE281F4B68AF5,PinName="Material",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.MaterialInterface'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_3 54BBC28945EBC1A077D4E591CD56ABE8,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_1" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapFire.BP_TrapFire:EventGraph.K2Node_VariableGet_1'"
 VariableReference=(MemberName="TrapBase",bSelfContext=True)
 NodePosX=640
 NodePosY=1072
 NodeGuid=50AF0C5148B0721477F470B46B56C5B9
 CustomProperties Pin (PinId=158CD05F49DC1DB2691911A0E4A4101A,PinName="TrapBase",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMeshComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_1 B27029DF4593C991DDAC9E97D7872516,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=02DD5B764F3865333B6A13BAFCB74F3C,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapBase.BP_TrapBase_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_2" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapFire.BP_TrapFire:EventGraph.K2Node_VariableGet_2'"
 VariableReference=(MemberName="OffMaterial",MemberGuid=8F7138184C9CEA269F432996BE5DBEB5,bSelfContext=True)
 NodePosX=672
 NodePosY=816
 NodeGuid=1ECB3A4E4E98F9A11F3CEC82D5FF80D6
 CustomProperties Pin (PinId=C6F4404343943ED63E3C7582A5D00F60,PinName="OffMaterial",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.MaterialInterface'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_0 54C4BE73456875B1F008A6BFBEAC04A4,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=EB9E74384EE07F4F86327C8457E53126,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapFire.BP_TrapFire_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_3" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapFire.BP_TrapFire:EventGraph.K2Node_VariableGet_3'"
 VariableReference=(MemberName="OnMaterial",MemberGuid=34FF874D4582792A566BF9903DCB68A9,bSelfContext=True)
 NodePosX=640
 NodePosY=1136
 NodeGuid=52A9BA66424410EDE198148A68AE6F6A
 CustomProperties Pin (PinId=54BBC28945EBC1A077D4E591CD56ABE8,PinName="OnMaterial",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.MaterialInterface'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_1 9220498541B930C7E3BCE281F4B68AF5,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=773BA9404C82178F6C8446B45B6157F3,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapFire.BP_TrapFire_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_1" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapFire.BP_TrapFire:EventGraph.EdGraphNode_Comment_1'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=240
 NodePosY=624
 NodeWidth=352
 NodeHeight=192
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="When player activates switch, set trap to inactive"
 NodeGuid=9D77CE4440C9F9F8D28EE293B5FA848B
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_0" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapFire.BP_TrapFire:EventGraph.EdGraphNode_Comment_0'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=240
 NodePosY=944
 NodeWidth=336
 NodeHeight=192
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="When switch is off, trap is active"
 NodeGuid=A868BAC44AB35D46F9B878B686970F8A
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_3" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapFire.BP_TrapFire:EventGraph.EdGraphNode_Comment_3'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=640
 NodePosY=560
 NodeWidth=448
 NodeHeight=336
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="When trap is off, change TrapBase\'s material"
 NodeGuid=9768850C4D234A78A13CDD891A5DADFF
End Object

Add an instance of `BP_TrapFire` to your level and give it a try!

## Update the HUD With Player HP

Time to replace those Print String nodes with some real feedback for the player. You’ll change your HUD to report the player’s HP in real time.

### Add an HP Variable to the HUD

To add dynamic player health to your HUD, follow these steps:

- In the **Content Browser**, open your `WBP_PlayerHUD` widget blueprint. Ensure you’re in **Designer **view.
- In the **Hierarchy**, click the **txtHP **widget. In the **Details **panel, enable **Is Variable** and delete **100** from the **Text **property.
- Go to the **Graph **view and set up a new function that sets the value of **txtHP**:In the **Functions **section, add a new function named **fnSetHP**.
- With the function selected, in the **Details **panel, click **+** next to **Inputs**.
- Name the input `NewHP` and change its type to **Float**. Later, you’ll change the player character to call this function when they take damage.

- In the **fnSetHP **function’s graph, after the function entry node, connect a **SetText (Text)** node.[image: 500]If you can’t find a node in the node actions list, disable **Context Sensitive**.
- Set up the **SetText (Text)** node:For the **Target**, connect a reference to the **txtHP** variable. This is the text widget that displays the player’s health.
- For the **In Text**, connect the function entry node’s **New HP **input pin. Unreal Engine automatically adds a **To Text (Float)** node to convert the value.
- **Save **and **Compile **the widget blueprint.

The complete **fnSetHP **function’s graph looks like the following:

 Blueprint

Begin Object Class=/Script/BlueprintGraph.K2Node_FunctionEntry Name="K2Node_FunctionEntry_0" ExportPath="/Script/BlueprintGraph.K2Node_FunctionEntry'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD:fnSetHP.K2Node_FunctionEntry_0'"
 ExtraFlags=201457664
 FunctionReference=(MemberName="fnSetHP")
 bIsEditable=True
 NodeGuid=CF7DF8CC44179A93CD210CB579665D1B
 CustomProperties Pin (PinId=EFB06DD842042C805F47E0A91FF33871,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_0 97DAEA714D4160328EA77A9077A9169A,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=6AC15B554F0171BC7E827D945C5C70D4,PinName="NewHP",Direction="EGPD_Output",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_22 28774D1D48A6A4748453358A096F6471,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties UserDefinedPin (PinName="NewHP",PinType=(PinCategory="real",PinSubCategory="double"),DesiredPinDirection=EGPD_Output)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_0" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD:fnSetHP.K2Node_CallFunction_0'"
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/UMG.TextBlock'",MemberName="SetText")
 NodePosX=416
 NodePosY=-16
 NodeGuid=D4080CED43AAD3D6B5CF89ABDF6A7CD6
 CustomProperties Pin (PinId=97DAEA714D4160328EA77A9077A9169A,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_FunctionEntry_0 EFB06DD842042C805F47E0A91FF33871,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=4A3767924E2E08757ED3DEB82B314686,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=3F47E9F2416A013445591EA890DF4C6B,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/UMG.TextBlock'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_0 1200C87F468A35A7385B47AE1C7A5517,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D697763E43145D40605A2383D00EB5FB,PinName="InText",PinType.PinCategory="text",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_22 E958EB154F08A7CE485E56A13BCB94DD,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_0" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD:fnSetHP.K2Node_VariableGet_0'"
 VariableReference=(MemberName="txtHP",MemberGuid=F22BE53245541CDD901518B9B587E9C9,bSelfContext=True)
 NodePosX=256
 NodePosY=64
 NodeGuid=ECA48040400F644173A9199E23C3B20B
 CustomProperties Pin (PinId=1200C87F468A35A7385B47AE1C7A5517,PinName="txtHP",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/UMG.TextBlock'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_0 3F47E9F2416A013445591EA890DF4C6B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=BC20B74F4688B5699F00889D7C3EF22E,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/UMG.WidgetBlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_22" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD:fnSetHP.K2Node_CallFunction_22'"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetTextLibrary'",MemberName="Conv_DoubleToText")
 NodePosX=160
 NodePosY=128
 AdvancedPinDisplay=Hidden
 NodeGuid=F296A2E64B4396A628B54188DFBEC93A
 CustomProperties Pin (PinId=CB3CDD79432D2F1ACAF085AE97781495,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.KismetTextLibrary'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__KismetTextLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=28774D1D48A6A4748453358A096F6471,PinName="Value",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_FunctionEntry_0 6AC15B554F0171BC7E827D945C5C70D4,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=E1FAFDEE42255FB82CCBEBA61B125200,PinName="RoundingMode",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Enum'/Script/Engine.ERoundingMode'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="HalfToEven",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)
 CustomProperties Pin (PinId=94AB0F074274AACAD7E44F8B40E686A8,PinName="bAlwaysSign",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D7C7B4AB43A8724EB41660BDBA4E4D20,PinName="bUseGrouping",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",AutogeneratedDefaultValue="true",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)
 CustomProperties Pin (PinId=C4366AEC4C9BEC10D9558CA8BB1C0A22,PinName="MinimumIntegralDigits",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="1",AutogeneratedDefaultValue="1",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)
 CustomProperties Pin (PinId=EA5F5B8547AD6841FF44AB8E86E60A24,PinName="MaximumIntegralDigits",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="324",AutogeneratedDefaultValue="324",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)
 CustomProperties Pin (PinId=6ADECD274E922F55B0886886FCB982FE,PinName="MinimumFractionalDigits",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0",AutogeneratedDefaultValue="0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)
 CustomProperties Pin (PinId=3C4B57F647CF561AA197CC8C73C49596,PinName="MaximumFractionalDigits",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="3",AutogeneratedDefaultValue="3",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)
 CustomProperties Pin (PinId=E958EB154F08A7CE485E56A13BCB94DD,PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="text",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_0 D697763E43145D40605A2383D00EB5FB,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object

If you copy this blueprint snippet into your graph, you need to connect the function entry node to the **SetText **and** To Text** nodes.

### Display the Player’s Starting HP

Set up any available HUD variables before displaying them. In this case, you know the player’s starting HP, so you can display that information when the game starts.

To update the player character blueprint to display their HP on the HUD, follow these steps:

- In the **Content Browser**, open your `BP_AdventureCharacter` blueprint. In the event graph, find the **Event Possessed** logic.In the **My Blueprint** panel, expand **Graphs **> **EventGraph **and double-click **Event Possessed** to focus on it in the graph.
- In between the **Set **node and **Add to Viewport** node, connect a **fnSetHP **node:For the **Target**, use the **Set **node’s output pin to make the HUD the target.
- For** New HP**, connect a reference to the player’s **Health **variable.

- Ensure the **Add to Viewport** node’s **Target **pin also connects to a **HUD **variable node.
- In the **My Blueprint** panel, click the **Health **variable. In the **Details **panel, change (or keep) the default value. This tutorial uses **100** starting hit points.
- **Save **and **Compile**.

The player’s new **Event Possessed** logic should look like the following:

 Blueprint

Begin Object Class=/Script/BlueprintGraph.K2Node_Event Name="K2Node_Event_13" ExportPath="/Script/BlueprintGraph.K2Node_Event'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_Event_13'"
 EventReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.Pawn'",MemberName="ReceivePossessed")
 bOverrideFunction=True
 NodePosX=-368
 NodePosY=-880
 NodeGuid=6FC96A0F4CB45192EFE45D9690E67C92
 CustomProperties Pin (PinId=891AB8864E2D5BCEEFD19EBF23111E0D,PinName="OutputDelegate",Direction="EGPD_Output",PinType.PinCategory="delegate",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.Pawn'",MemberName="ReceivePossessed"),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=FFD595A34357F8494617F0896DC2F705,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallParentFunction_0 5BF0745B4A91AED224ECF98A90386E67,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=5D00B34345D6D77FB0950E847706611B,PinName="NewController",PinToolTip="New Controller\nController Object Reference",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Controller'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallParentFunction_0 4DAEAF1A4F8175A84D65D1B24E2FAD5A,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallParentFunction Name="K2Node_CallParentFunction_0" ExportPath="/Script/BlueprintGraph.K2Node_CallParentFunction'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_CallParentFunction_0'"
 FunctionReference=(MemberParent="/Script/Engine.BlueprintGeneratedClass'/Game/FirstPerson/Blueprints/BP_FirstPersonCharacter.BP_FirstPersonCharacter_C'",MemberName="ReceivePossessed",MemberGuid=2A42AC3644D77D6702BCA3A4144F182D)
 NodePosX=-176
 NodePosY=-880
 NodeGuid=6BB02C6A44D960ECA220009C77DACCAD
 CustomProperties Pin (PinId=5BF0745B4A91AED224ECF98A90386E67,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Event_13 FFD595A34357F8494617F0896DC2F705,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=DFECF09642144E5FAB50BA81540335A5,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CreateWidget_0 537EFA4B4A2EA2ACF047F2A745B01D3D,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D30E44DA44DAC2B5E4A8D2AA717FB149,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Pawn'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=4DAEAF1A4F8175A84D65D1B24E2FAD5A,PinName="NewController",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Controller'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Event_13 5D00B34345D6D77FB0950E847706611B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UMGEditor.K2Node_CreateWidget Name="K2Node_CreateWidget_0" ExportPath="/Script/UMGEditor.K2Node_CreateWidget'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_CreateWidget_0'"
 NodePosX=32
 NodePosY=-880
 NodeGuid=20DA0CA54BD0EA8F03093FA1334AC68D
 CustomProperties Pin (PinId=537EFA4B4A2EA2ACF047F2A745B01D3D,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallParentFunction_0 DFECF09642144E5FAB50BA81540335A5,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=326C22E34AD0AC3C0B5B7CB57BB204B1,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_0 A43C281742BA20BFCF530F84E4785297,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=7D5CDF444F3A457B0042369B515ECCF5,PinName="Class",PinToolTip="User Widget Class Reference Class\nThe object class you want to construct",PinType.PinCategory="class",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/UMG.UserWidget'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD_C",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D979BCD6494D22E8F294CB948A37AAEF,PinName="ReturnValue",PinToolTip="WBP Player HUD Object Reference Return Value\nThe constructed object",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/UMG.WidgetBlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_0 41964B9940CA1D72A243BFA900B1B460,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=CE6361494AF492694EA0C08BA3CA8771,PinName="OwningPlayer",PinToolTip="Player Controller Object Reference Owning Player\nThe player that \'owns\' the widget.",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.PlayerController'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableSet Name="K2Node_VariableSet_0" ExportPath="/Script/BlueprintGraph.K2Node_VariableSet'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_VariableSet_0'"
 VariableReference=(MemberName="HUD",MemberGuid=1AB7991E44211BD63129D48A479FB7D9,bSelfContext=True)
 NodePosX=368
 NodePosY=-864
 NodeGuid=26BAD09D4A8FBF4346B483BDE6536789
 CustomProperties Pin (PinId=A43C281742BA20BFCF530F84E4785297,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CreateWidget_0 326C22E34AD0AC3C0B5B7CB57BB204B1,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=9F4610E44C13C0994D6C3890F7C96FEE,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_11 0C4C1A6242B994B2FD2E0B8080F969A5,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=41964B9940CA1D72A243BFA900B1B460,PinName="HUD",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/UMG.WidgetBlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CreateWidget_0 D979BCD6494D22E8F294CB948A37AAEF,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=0E8337824C696DF99F2457A8390BC6EA,PinName="Output_Get",PinToolTip="Retrieves the value of the variable, can use instead of a separate Get node",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/UMG.WidgetBlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_11 80E5529B49AD9CE26EBA1AA9015EF1CA,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F7B3061E4A8BC6D4B1EB508F103891BE,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_10" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_CallFunction_10'"
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/UMG.UserWidget'",MemberName="AddToViewport")
 NodePosX=784
 NodePosY=-896
 AdvancedPinDisplay=Hidden
 NodeGuid=41F2DEA04560A09C8357F18113628641
 CustomProperties Pin (PinId=82A4AC7B4AAB1BC81A570F83915158AE,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_11 13AAEBB447847803719DC7AF55010364,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=037962AC43E4D5414A3E68B9D71099CE,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=3D9C259A462D3DB1085680B7E0651707,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/UMG.UserWidget'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_6 575F199F44A71C62EBB78E90E927C60E,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=53336C004ECBE7ED527D8986DE7A68B3,PinName="ZOrder",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0",AutogeneratedDefaultValue="0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_6" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_VariableGet_6'"
 VariableReference=(MemberName="HUD",MemberGuid=1AB7991E44211BD63129D48A479FB7D9,bSelfContext=True)
 NodePosX=608
 NodePosY=-736
 NodeGuid=8712EAB84D94A19D0B3989A01CD8F8EF
 CustomProperties Pin (PinId=575F199F44A71C62EBB78E90E927C60E,PinName="HUD",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/UMG.WidgetBlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_10 3D9C259A462D3DB1085680B7E0651707,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=AAC48F87495491D9C2A17C87A58DC162,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_4" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.EdGraphNode_Comment_4'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=-400
 NodePosY=-992
 NodeWidth=1408
 NodeHeight=336
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="(DT) Create and display the HUD when the player spawns"
 NodeGuid=43E27C5748EA770C2E13FF9179DD54CA
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_11" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_CallFunction_11'"
 FunctionReference=(MemberParent="/Script/UMG.WidgetBlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD_C'",MemberName="fnSetHP",MemberGuid=BED3B904408C6B08BD18ACB80A556F3D)
 NodePosX=528
 NodePosY=-896
 NodeGuid=E93CA3A245B602EC3A2AE7B7B07C188A
 CustomProperties Pin (PinId=0C4C1A6242B994B2FD2E0B8080F969A5,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_0 9F4610E44C13C0994D6C3890F7C96FEE,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=13AAEBB447847803719DC7AF55010364,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_10 82A4AC7B4AAB1BC81A570F83915158AE,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=80E5529B49AD9CE26EBA1AA9015EF1CA,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/UMG.WidgetBlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_0 0E8337824C696DF99F2457A8390BC6EA,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=3A76B46A41E10FEE48E05FAACD71D193,PinName="NewHP",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_VariableGet_7 D7F27F8D4898425600351E94BDFB4B37,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_7" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_VariableGet_7'"
 VariableReference=(MemberName="Health",MemberGuid=28FB3B2F4AF7198442C192931CE0517D,bSelfContext=True)
 NodePosX=368
 NodePosY=-768
 NodeGuid=704785514119BFCFBFDD26BA2EFA4D2B
 CustomProperties Pin (PinId=D7F27F8D4898425600351E94BDFB4B37,PinName="Health",Direction="EGPD_Output",PinType.PinCategory="real",PinType.PinSubCategory="float",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_CallFunction_11 3A76B46A41E10FEE48E05FAACD71D193,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=CCBBE2224BCA953E2DE90D88AE816DDB,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object

If copying this logic into your project, first delete the existing **Event Possessed **logic group.

Now, the HUD displays the player’s health when the game starts. The last piece of logic you need is to update the HUD when the player is damaged. To do this, you’ll modify the character’s existing damage-handling logic to work with your HUD.

### Update the Player’s HP After Taking Damage

To handle damage to the player, follow these steps:

- In the bottom-left corner of `BP_AdventureCharacter`’s event graph, find the section of logic labelled “**Damage and death handling**” that starts with an **Event AnyDamage** node. You’re going to modify this section to execute your own logic instead.
- Delete all nodes that come after the **Branch **node. Keep the **Branch **node.This section of logic uses **operator nodes** to perform calculations. When the character receives damage, the** Event AnyDamage** node triggers, passing information about the damage dealt, the type of damage, and the controller and actor that instigated the damage. Next, the damage is subtracted from the character’s **Health **variable. Once the health is subtracted, the **Branch **node checks if the player’s health has reached 0.
- For now, you want to build logic that updates the HUD when the player’s health is greater than 0. So, from the **False **pin, connect an **FnSetHP **node to send the new health value to the HUD.
- Set up the **fnSetHP **node:For the **Target**, connect a reference to the character’s **HUD **variable.
- For the **New HP **input, connect a reference to the **Health **variable.

- **Save **and **Compile **your blueprint.

Now the HUD displays the player’s current health and updates that health value when the player takes damage.

Go back to your `BP_TrapBase` blueprint and delete any** Print String **nodes you added to the base trap’s event graph.

Play your game again and test it out!

## Create a Fail and Respawn Condition

When the player runs out of health and is eliminated, you’ll want to stop the game and give them a chance to try again. In this tutorial, you’ll disable the player’s controls, communicate to the player that they’ve lost the game, and load the level.

First, you’ll create a game-over widget blueprint that tells the player they have been eliminated.

### Add a Game-Over Screen

To create a widget blueprint for your game-over screen, follow these steps:

- In the **Content Browser**, in the** AdventureGame > Designer > Blueprints > Widgets** folder, right-click, go to **User Interface**, and select **Widget Blueprint**.
- In the** Pick Parent Class** window, click** User Widget**.
- Name the widget blueprint `WBP_EliminatedScreen` and open it.

To set up the game-over UI, follow these steps:

- In the **Palette **tab, search for canvas and drag a **Canvas Panel** onto **[WBP_EliminatedScreen]** in the **Hierarchy**. Just like with your HUD, the canvas is your root widget.
- The canvas will have a game-over message layered over a blur effect that makes the text easier to read. From the **Palette **tab, drag an **Overlay **to become a child of the canvas.
- With the overlay selected, in the **Details **panel, in the Slot (Canvas Panel Slot) section, expand **Anchors**, and change both **Maximum **values (**X** and **Y**) to `1`. The other Slot properties (below **Anchors**) change to **Offset **settings.When you built the HUD, you kept all anchor points in one corner so if the screen size changed, those objects stay anchored to the anchor point. Now, the overlay is anchored to the entire canvas bounding box, so the overlay shrinks or stretches to match the screen size.
- When you changed the anchor settings, the editor changed some offset values to maintain the overlay panel’s default shape. To remove this, change **Offset Right **and **Offset Bottom **to `0`. Now the overlay fills the screen.
- From the **Palette **tab, drag a** Background Blur** widget to become a child of the **Overlay **panel.
- With the blur effect selected, in the **Details **panel, in the **Slot (Overlay Slot)** section, change:**Horizontal Alignment **to **Fill Horizontally**.
- **Vertical Alignment **to **Fill Vertically**.

- In the **Appearance **section, change **Blur** **Strength **to `5`.
- From the **Palette **tab, add a **Text **widget as a child of the **Overlay**.
- With the **Text **widget selected, in the **Details **panel, in the **Slot (Overlay Slot)** section, change:**Horizontal Alignment** to **Center Align Horizontally**.
- **Vertical Alignment** to **Center Align Vertically**.

- In the **Content **section, change the **Text **to `You are eliminated…restarting the level.`
- In the **Appearance **section, make the text larger and easier to read by configuring the following properties:Click the color swatch next to **Color and Opacity**, and pick a color for your text. This tutorial uses pink (Color **Hex sRGB** = `FF4D7AFF`).
- Expand the **Font **header, and change **Size **to `60`.
- Expand **Font > Outline Settings**, and change **Outline **Size to `1`.

12. **Save **and **Compile **your blueprint.

### Build Logic for a Fail Condition

Now that you have a game-over screen, you can modify the character class to display it when the player runs out of HP. When this happens, execution passes through the True result of that Branch node you were working with earlier.

To handle player defeat, you’ll need to:

- Disable player input so the player can’t move.
- Show the game-over screen.
- Restart the level after a set amount of time.

To stop and load the game when the player is eliminated, follow these steps:

- In `BP_AdventurePlayer`, go back to the damage-handling logic (beginning with **Event AnyDamage**) in your character blueprint.
- After the **Branch **node’s **True **execution pin, connect a **Do Once** node and **Disable Input** node.The player can continue to get hit after they run out of health, so the Do Once node ensures that the logic after it only executes once.
- For the **Disable Input** node’s **Player Controller **pin, connect a **Get Player Controller** node (in the **Game > Player** section of the node actions list).There are a few nodes named **Get Player Controller**. Ensure the node has a **Player Index** input pin. An index of **0** is the default index for the first player character spawned into the level.
- After disabling the player controller, create and display the game-over screen:Connect a **Create Widget** node. In the node, change the **Class **to `WBP_EliminatedScreen`.
- Connect the widget node’s **exec **and **Return Value **pins to an **Add to Viewport** node.

- Add a time delay, get the current level name, and then load that level:After the** Add to Viewport** node, connect a **Delay **node and change the **Duration **to `5` seconds.
- After the **Delay**, connect a** Get Current Level Name** node.
- After **Get Current Level Name**, connect an **Open Level (by Name)** node.
- Connect the **Return Value** pin to the **Level Name** pin. The editor automatically adds a string-to-name conversion node.

- **Save **and **Compile **your player blueprint.

This section of the `BP_AdventureCharacter` event graph should now look like the following:

 Blueprint

Begin Object Class=/Script/BlueprintGraph.K2Node_Event Name="K2Node_Event_3" ExportPath="/Script/BlueprintGraph.K2Node_Event'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_Event_3'"
 EventReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.Actor'",MemberName="ReceiveDestroyed")
 bOverrideFunction=True
 NodePosX=-3040
 NodePosY=-160
 NodeGuid=FDAD5404464C65D84E295CB4213BFFE9
 CustomProperties Pin (PinId=8FDDB4684C6E909AC2628AA4FBDA138A,PinName="OutputDelegate",Direction="EGPD_Output",PinType.PinCategory="delegate",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.Actor'",MemberName="ReceiveDestroyed"),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=B02A414344C970B2AED40AAEAB1530F4,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_2 8FA342764E7838956EDF7784E011594D,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_9" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_CallFunction_9'"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.GameplayStatics'",MemberName="GetGameMode")
 NodePosX=-2544
 NodePosY=-32
 NodeGuid=77F8DC9A410DC7B64E3545B1D5AEB216
 CustomProperties Pin (PinId=48422E0343CA84B7870B6AA463D19518,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.GameplayStatics'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__GameplayStatics",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=AD097300404D18FCA9C5E0A8C9FB0EE3,PinName="WorldContextObject",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/CoreUObject.Object'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=2E6BA4624D30757E8F50A3B4BF837504,PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.GameModeBase'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Message_1 9469B31B4C010CB89E1A78BE0D3EC46D,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_Message Name="K2Node_Message_1" ExportPath="/Script/BlueprintGraph.K2Node_Message'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_Message_1'"
 FunctionReference=(MemberParent="/Script/Engine.BlueprintGeneratedClass'/Game/Variant_Shooter/Blueprints/FirstPerson/BPI_Shooter.BPI_Shooter_C'",MemberName="IncrementTeamScore",MemberGuid=816030024668928B0F1EF1B3DBF8EE52)
 NodePosX=-2560
 NodePosY=-176
 NodeGuid=11721A424B0B7B4B5A13E1A10225E079
 CustomProperties Pin (PinId=C100DFC3455D485B6F73958E3417DBDC,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_2 1F219E464705501163AB5AA0451DAC7D,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F4E71F1442E6FF4B3B013FBA16648761,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=9469B31B4C010CB89E1A78BE0D3EC46D,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/CoreUObject.Object'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_9 2E6BA4624D30757E8F50A3B4BF837504,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=20C7A1984A4FC408EDEA188735DF1254,PinName="TeamByte",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0",AutogeneratedDefaultValue="0",LinkedTo=(K2Node_VariableGet_12 0D78DF694FE0489C3FA77AB1A756030D,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_MacroInstance Name="K2Node_MacroInstance_2" ExportPath="/Script/BlueprintGraph.K2Node_MacroInstance'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_MacroInstance_2'"
 MacroGraphReference=(MacroGraph="/Script/Engine.EdGraph'/Engine/EditorBlueprintResources/StandardMacros.StandardMacros:DoOnce'",GraphBlueprint="/Script/Engine.Blueprint'/Engine/EditorBlueprintResources/StandardMacros.StandardMacros'",GraphGuid=1281F54248A2ECB5B8B2C5B24AE6FDF4)
 NodePosX=-2848
 NodePosY=-160
 NodeGuid=549790484993EC047E65BDB64E5113F0
 CustomProperties Pin (PinId=8FA342764E7838956EDF7784E011594D,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Event_3 B02A414344C970B2AED40AAEAB1530F4,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=FD2A335C47C22B9B75CB128183729C6A,PinName="Reset",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=256F2C424E2678324B139FB7E11E104D,PinName="Start Closed",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=1F219E464705501163AB5AA0451DAC7D,PinName="Completed",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Message_1 C100DFC3455D485B6F73958E3417DBDC,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_Event Name="K2Node_Event_4" ExportPath="/Script/BlueprintGraph.K2Node_Event'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_Event_4'"
 EventReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.Actor'",MemberName="ReceiveAnyDamage")
 bOverrideFunction=True
 NodePosX=-3040
 NodePosY=-480
 NodeGuid=6EBA5EFD4CA73EF8E515BDBB77134290
 CustomProperties Pin (PinId=1CC24E8A4F3F2A0672C3209F329FD235,PinName="OutputDelegate",Direction="EGPD_Output",PinType.PinCategory="delegate",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.Actor'",MemberName="ReceiveAnyDamage"),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=150ED5C742D9D9D54B20E5A16ED4FB87,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_1 C81AB1B64306E84B77177EA5A5751081,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=4E8046F843BF001E112C718333A396C2,PinName="Damage",PinToolTip="Damage\nFloat (single-precision)",Direction="EGPD_Output",PinType.PinCategory="real",PinType.PinSubCategory="float",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_PromotableOperator_7 50C1E5BF40494E718B962FB10ABDB64E,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=4DC2F7CA469FA3B5943C0CB73D55F187,PinName="DamageType",PinToolTip="Damage Type\nDamage Type Object Reference",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.DamageType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=9B42E8BD4FC72C94B94F43BC9D47E271,PinName="InstigatedBy",PinToolTip="Instigated By\nController Object Reference",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Controller'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=0F2C6E674161C449C3C878AE2EEC3FD4,PinName="DamageCauser",PinToolTip="Damage Causer\nActor Object Reference",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableSet Name="K2Node_VariableSet_1" ExportPath="/Script/BlueprintGraph.K2Node_VariableSet'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_VariableSet_1'"
 VariableReference=(MemberName="Health",MemberGuid=28FB3B2F4AF7198442C192931CE0517D,bSelfContext=True)
 NodePosX=-2592
 NodePosY=-480
 NodeGuid=A33E677746F009CA85FFCB9E56CD16A3
 CustomProperties Pin (PinId=C81AB1B64306E84B77177EA5A5751081,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Event_4 150ED5C742D9D9D54B20E5A16ED4FB87,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=A5EC2657498C795B5EA8AAA9B8B7788A,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_2 DC4F6810442CEB1A663EA2AB0297D3C2,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=1FF9AE084E0A525079439EB11BCBFC96,PinName="Health",PinType.PinCategory="real",PinType.PinSubCategory="float",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_PromotableOperator_7 8F188E4D4638F90C20E34381A87E6832,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=1C6F763240BFEF6D6E59C9AEE6706C27,PinName="Output_Get",PinToolTip="Retrieves the value of the variable, can use instead of a separate Get node",Direction="EGPD_Output",PinType.PinCategory="real",PinType.PinSubCategory="float",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_PromotableOperator_5 52F55638459B54F7F52FDB9859FF6749,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=057C8A4D45CD1EC57DBB809574C2B400,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_PromotableOperator Name="K2Node_PromotableOperator_7" ExportPath="/Script/BlueprintGraph.K2Node_PromotableOperator'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_PromotableOperator_7'"
 OperationName="Subtract"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetMathLibrary'",MemberName="Subtract_DoubleDouble")
 NodePosX=-2752
 NodePosY=-384
 NodeGuid=A1B6D6C44D95761E6DB4CD9226EF69DF
 CustomProperties Pin (PinId=CBE6444B4222220BA614A49C90DBDD67,PinName="A",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_14 44CCF5C646F744F0B0A338BF06C8EF32,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=50C1E5BF40494E718B962FB10ABDB64E,PinName="B",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Event_4 4E8046F843BF001E112C718333A396C2,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=8F188E4D4638F90C20E34381A87E6832,PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_1 1FF9AE084E0A525079439EB11BCBFC96,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_14" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_VariableGet_14'"
 VariableReference=(MemberName="Health",MemberGuid=28FB3B2F4AF7198442C192931CE0517D,bSelfContext=True)
 NodePosX=-2752
 NodePosY=-432
 NodeGuid=7B81B69645D36006C387CD838358F7BB
 CustomProperties Pin (PinId=44CCF5C646F744F0B0A338BF06C8EF32,PinName="Health",Direction="EGPD_Output",PinType.PinCategory="real",PinType.PinSubCategory="float",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_PromotableOperator_7 CBE6444B4222220BA614A49C90DBDD67,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=79880B1641D3449D5E0C678EE9D0F420,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_PromotableOperator Name="K2Node_PromotableOperator_5" ExportPath="/Script/BlueprintGraph.K2Node_PromotableOperator'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_PromotableOperator_5'"
 OperationName="LessEqual"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetMathLibrary'",MemberName="LessEqual_DoubleDouble")
 NodePosX=-2416
 NodePosY=-432
 NodeGuid=49C3B41F42375D2BCE347C97ED1B3116
 CustomProperties Pin (PinId=52F55638459B54F7F52FDB9859FF6749,PinName="A",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_1 1C6F763240BFEF6D6E59C9AEE6706C27,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=C1F97A11442AFB0E805FDCA9671268ED,PinName="B",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=732D3C8E44A178DF22933FA9DA95293C,PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_2 063AE1D44F9C2872274749AECC29D3DF,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D9F1AE1E4AC1E9E4E4E199A31039A43F,PinName="ErrorTolerance",PinType.PinCategory="",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_IfThenElse Name="K2Node_IfThenElse_2" ExportPath="/Script/BlueprintGraph.K2Node_IfThenElse'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_IfThenElse_2'"
 NodePosX=-2176
 NodePosY=-496
 NodeGuid=4CB0697249AEDBF0772DA3A60C11B19C
 CustomProperties Pin (PinId=DC4F6810442CEB1A663EA2AB0297D3C2,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_1 A5EC2657498C795B5EA8AAA9B8B7788A,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=063AE1D44F9C2872274749AECC29D3DF,PinName="Condition",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",AutogeneratedDefaultValue="true",LinkedTo=(K2Node_PromotableOperator_5 732D3C8E44A178DF22933FA9DA95293C,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=AD289C654B72AA308488B2A976DC2074,PinName="then",PinFriendlyName=NSLOCTEXT("K2Node", "true", "true"),Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_1 7FD6743E4D81680B2204B79A71452B78,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F56D614A4FB0CB8AF49D22976D959C23,PinName="else",PinFriendlyName=NSLOCTEXT("K2Node", "false", "false"),Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_12 B1C5C54B448D1EBFF524AFA89E4D0AA5,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_12" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_VariableGet_12'"
 VariableReference=(MemberName="Team Byte",MemberGuid=9A506EF24F0BFA3E9E90E988CEBD8CED,bSelfContext=True)
 NodePosX=-2512
 NodePosY=32
 NodeGuid=456B8B7E4D392108C0B80191119449D4
 CustomProperties Pin (PinId=0D78DF694FE0489C3FA77AB1A756030D,PinName="Team Byte",Direction="EGPD_Output",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0",AutogeneratedDefaultValue="0",LinkedTo=(K2Node_Message_1 20C7A1984A4FC408EDEA188735DF1254,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=3CF76AE5425415026F7B588AF97A16ED,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_50" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.EdGraphNode_Comment_50'"
 CommentColor=(R=0.171875,G=0.171875,B=0.171875,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 CommentDepth=-2
 NodePosX=-3088
 NodePosY=-624
 NodeWidth=3536
 NodeHeight=768
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="(DT) Damage and defeat handling"
 NodeGuid=7236AF474C818AA2756B52B0720D38E4
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_12" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_CallFunction_12'"
 FunctionReference=(MemberParent="/Script/UMG.WidgetBlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD_C'",MemberName="fnSetHP",MemberGuid=BED3B904408C6B08BD18ACB80A556F3D)
 NodePosX=-1856
 NodePosY=-176
 NodeGuid=A37E9F1F42D26D8FBF8B8A8A30950943
 CustomProperties Pin (PinId=B1C5C54B448D1EBFF524AFA89E4D0AA5,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_2 F56D614A4FB0CB8AF49D22976D959C23,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=B1E1FFBD470A95D287A9F797066FD01D,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=BDE5872444C475B93E01B693CDBBBDE5,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/UMG.WidgetBlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_9 2B4ED21B4FBC30E8A0B22AA9775008A3,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=0BF51C484FAC0E82A0BE3EAABFC31A4C,PinName="NewHP",PinType.PinCategory="real",PinType.PinSubCategory="double",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_VariableGet_11 BDF08FDC4F0EDFB5D31456A83E664071,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_9" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_VariableGet_9'"
 VariableReference=(MemberName="HUD",MemberGuid=1AB7991E44211BD63129D48A479FB7D9,bSelfContext=True)
 NodePosX=-2048
 NodePosY=-112
 NodeGuid=78E1E6E8495E5E441E1AECADC0A561DF
 CustomProperties Pin (PinId=2B4ED21B4FBC30E8A0B22AA9775008A3,PinName="HUD",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/UMG.WidgetBlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_12 BDE5872444C475B93E01B693CDBBBDE5,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=B1CB84734BD655BC40A2D0AEE48104D1,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_11" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_VariableGet_11'"
 VariableReference=(MemberName="Health",MemberGuid=28FB3B2F4AF7198442C192931CE0517D,bSelfContext=True)
 NodePosX=-2048
 NodePosY=-48
 NodeGuid=5BD796B1473D043A01C91DA1A0A3BE8E
 CustomProperties Pin (PinId=BDF08FDC4F0EDFB5D31456A83E664071,PinName="Health",Direction="EGPD_Output",PinType.PinCategory="real",PinType.PinSubCategory="float",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0.0",AutogeneratedDefaultValue="0.0",LinkedTo=(K2Node_CallFunction_12 0BF51C484FAC0E82A0BE3EAABFC31A4C,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=C846BE62416D955D466C25A8FBD2DE0A,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_MacroInstance Name="K2Node_MacroInstance_1" ExportPath="/Script/BlueprintGraph.K2Node_MacroInstance'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_MacroInstance_1'"
 MacroGraphReference=(MacroGraph="/Script/Engine.EdGraph'/Engine/EditorBlueprintResources/StandardMacros.StandardMacros:DoOnce'",GraphBlueprint="/Script/Engine.Blueprint'/Engine/EditorBlueprintResources/StandardMacros.StandardMacros'",GraphGuid=1281F54248A2ECB5B8B2C5B24AE6FDF4)
 NodePosX=-1920
 NodePosY=-496
 NodeGuid=787659104B92FD9B292E96B090881642
 CustomProperties Pin (PinId=7FD6743E4D81680B2204B79A71452B78,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_2 AD289C654B72AA308488B2A976DC2074,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=A475B7F749C08F0F8DBD858A65EB6FE3,PinName="Reset",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=E92E81EA4A95394E6B688CB2817CE81F,PinName="Start Closed",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=1649CE7847FF956C202389ADDD78B330,PinName="Completed",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_13 E91B26A74CC9E0637229BFA4699D131A,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_13" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_CallFunction_13'"
 FunctionReference=(MemberName="DisableInput",bSelfContext=True)
 NodePosX=-1328
 NodePosY=-512
 NodeGuid=39019BCF41F3E19E5F2644B50D13BB1E
 CustomProperties Pin (PinId=E91B26A74CC9E0637229BFA4699D131A,PinName="execute",PinToolTip="\nExec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_1 1649CE7847FF956C202389ADDD78B330,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=7BF4D69D4C763CBEB8157E87812FE967,PinName="then",PinToolTip="\nExec",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CreateWidget_1 6D7AA906400698FD9E69A7BD5CDE272C,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=5DA40BF64D6D64C6E7AC7FA4B3851F8B,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nActor Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=354DCDAD453E1782FDDBF4BF5B91BF3E,PinName="PlayerController",PinToolTip="Player Controller\nPlayer Controller Object Reference\n\nThe PlayerController whose input events we no longer want to receive. If null, this actor will stop receiving input from all PlayerControllers.",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.PlayerController'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_24 E90F83964384CF681CB73A82C3080A28,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UMGEditor.K2Node_CreateWidget Name="K2Node_CreateWidget_1" ExportPath="/Script/UMGEditor.K2Node_CreateWidget'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_CreateWidget_1'"
 NodePosX=-1088
 NodePosY=-496
 NodeGuid=F401C8E04049BACC103FE8ABD1040835
 CustomProperties Pin (PinId=6D7AA906400698FD9E69A7BD5CDE272C,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_13 7BF4D69D4C763CBEB8157E87812FE967,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F060755F4C7A70E4469989A5B6F57342,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_16 F274545944A4361EEC5F58930E5F06D5,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=923EF7DF42654FFEC75434BA03118DDE,PinName="Class",PinType.PinCategory="class",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/UMG.UserWidget'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_EliminatedScreen.WBP_EliminatedScreen_C",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=DC8F4C024693A3F90DE9C599E1BF672B,PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/UMG.WidgetBlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_EliminatedScreen.WBP_EliminatedScreen_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_16 DCB409104AFEB8AACB6DBB87ECAEA4BA,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=A9FFBCF04A18F0EB226584A58F07AA2B,PinName="OwningPlayer",PinToolTip="Player Controller Object Reference Owning Player\nThe player that \'owns\' the widget.",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.PlayerController'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_16" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_CallFunction_16'"
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/UMG.UserWidget'",MemberName="AddToViewport")
 NodePosX=-736
 NodePosY=-496
 AdvancedPinDisplay=Hidden
 NodeGuid=00BF9D0748BA1DA05A666287B744D640
 CustomProperties Pin (PinId=F274545944A4361EEC5F58930E5F06D5,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CreateWidget_1 F060755F4C7A70E4469989A5B6F57342,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D638D8F64E804EA41A27CBBAF6B773D8,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_17 499252AA49BEF2DDEEDD059308598F8F,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=DCB409104AFEB8AACB6DBB87ECAEA4BA,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/UMG.UserWidget'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CreateWidget_1 DC8F4C024693A3F90DE9C599E1BF672B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=19BD808943E6231DBF329EA7991AFA7F,PinName="ZOrder",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0",AutogeneratedDefaultValue="0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_17" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_CallFunction_17'"
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetSystemLibrary'",MemberName="Delay")
 NodePosX=-496
 NodePosY=-480
 NodeGuid=4C5C9E964A4C02C3F157B6950BBD1A1A
 CustomProperties Pin (PinId=499252AA49BEF2DDEEDD059308598F8F,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_16 D638D8F64E804EA41A27CBBAF6B773D8,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=375D830540CF1913BB3E12A5612D8A07,PinName="then",PinFriendlyName="Completed",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_18 F076CD7E49DD38B3B81BA4BF89773C28,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=1BECAC2849C79472344A8DA52A66A76F,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.KismetSystemLibrary'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__KismetSystemLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D821953B4A7FDFBE5517A4965A913364,PinName="WorldContextObject",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/CoreUObject.Object'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=FE58DF9345166182DCE51E8F129E5635,PinName="Duration",PinType.PinCategory="real",PinType.PinSubCategory="float",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="5.000000",AutogeneratedDefaultValue="0.2",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=C2AF6A4B470DA7F58B4EFCBFF23E3498,PinName="LatentInfo",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/Engine.LatentActionInfo'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="(Linkage=-1,UUID=-1,ExecutionFunction=\"\",CallbackTarget=None)",AutogeneratedDefaultValue="LatentInfo",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_18" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_CallFunction_18'"
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.GameplayStatics'",MemberName="GetCurrentLevelName")
 NodePosX=-224
 NodePosY=-480
 AdvancedPinDisplay=Hidden
 NodeGuid=C6F242854FB2D7C90529E9ABFA97318D
 CustomProperties Pin (PinId=F076CD7E49DD38B3B81BA4BF89773C28,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_17 375D830540CF1913BB3E12A5612D8A07,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=3F20DA394E89DAE263CBC49AD9A1E964,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_20 B953893B490656C23D55F4809DD9015A,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=4A96852A448B017EA034848CED8D9D2C,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.GameplayStatics'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__GameplayStatics",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=5721215741428873CE8FA184C8CA1EAE,PinName="WorldContextObject",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/CoreUObject.Object'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=0DF55EC7432C64DD7552178C0E32D0CC,PinName="bRemovePrefixString",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",AutogeneratedDefaultValue="true",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)
 CustomProperties Pin (PinId=C2E0646A4B78F090141DB996BAC63B61,PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="string",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_22 709D1051422C8DA7578711BC8A933B30,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_20" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_CallFunction_20'"
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.GameplayStatics'",MemberName="OpenLevel")
 NodePosX=176
 NodePosY=-480
 AdvancedPinDisplay=Hidden
 NodeGuid=3D1EDA8241D2B56EED0C6AA9AE6A3B14
 CustomProperties Pin (PinId=B953893B490656C23D55F4809DD9015A,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_18 3F20DA394E89DAE263CBC49AD9A1E964,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=253E0A5343AD105CA9D3329A3794A6D6,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=C43C33A7443A93D172681D9AB7DF3BA8,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.GameplayStatics'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__GameplayStatics",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=07DBC7ED4C54864E909D56BA80FB221D,PinName="WorldContextObject",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/CoreUObject.Object'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=B37BC7924BE43C0B8602399EC6803C14,PinName="LevelName",PinType.PinCategory="name",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="None",AutogeneratedDefaultValue="None",LinkedTo=(K2Node_CallFunction_22 517823E04D77992C5CBE439AF695403E,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=5027CA054838C4792C5815997DDD4B59,PinName="bAbsolute",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",AutogeneratedDefaultValue="true",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)
 CustomProperties Pin (PinId=3CBC94AC4B88582BE87CC78BB1C783E2,PinName="Options",PinType.PinCategory="string",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_22" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_CallFunction_22'"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetStringLibrary'",MemberName="Conv_StringToName")
 NodePosX=16
 NodePosY=-416
 NodeGuid=14B9738044A83B1CA89872884B93A86D
 CustomProperties Pin (PinId=7276436B4EF1607ED3A4FFB686E0CBE3,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.KismetStringLibrary'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__KismetStringLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=709D1051422C8DA7578711BC8A933B30,PinName="InString",PinType.PinCategory="string",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_18 C2E0646A4B78F090141DB996BAC63B61,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=517823E04D77992C5CBE439AF695403E,PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="name",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="None",AutogeneratedDefaultValue="None",LinkedTo=(K2Node_CallFunction_20 B37BC7924BE43C0B8602399EC6803C14,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_24" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_CallFunction_24'"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.GameplayStatics'",MemberName="GetPlayerController")
 NodePosX=-1616
 NodePosY=-416
 NodeGuid=E194D92A47E046BD51CE16AD0EC1482A
 CustomProperties Pin (PinId=951780F7461617125C1CAEB0CA92B06F,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.GameplayStatics'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__GameplayStatics",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=0F16A68A4545E5919BB21B8286519D04,PinName="WorldContextObject",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/CoreUObject.Object'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=7468855640B9057BF4E3AE96D13EB456,PinName="PlayerIndex",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0",AutogeneratedDefaultValue="0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=E90F83964384CF681CB73A82C3080A28,PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.PlayerController'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_13 354DCDAD453E1782FDDBF4BF5B91BF3E,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_5" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.EdGraphNode_Comment_5'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=-2816
 NodePosY=-560
 NodeWidth=608
 NodeHeight=256
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Subtract damage from health, save the new health value, and check if it\'s less than or equal to 0."
 NodeGuid=2471EBE845ECF656DC944AABE1D0A3B8
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_16" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.EdGraphNode_Comment_16'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=-2096
 NodePosY=-256
 NodeWidth=497
 NodeHeight=266
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="If health is greater than 0, send new health value to the HUD"
 NodeGuid=40419F2B421E10EDA1A359902989ACB7
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_17" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.EdGraphNode_Comment_17'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=-1637
 NodePosY=-570
 NodeWidth=512
 NodeHeight=256
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Disable player controls"
 NodeGuid=0080E58E44E4C694B39B2992A8E00657
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_8" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.EdGraphNode_Comment_8'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=-1096
 NodePosY=-556
 NodeWidth=560
 NodeHeight=240
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Create and display game-over screen"
 NodeGuid=A247E7704F8975C2A7626BABFD263DD5
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_9" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.EdGraphNode_Comment_9'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=-504
 NodePosY=-542
 NodeWidth=896
 NodeHeight=208
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="After 5 seconds, restart the level"
 NodeGuid=90DD8B2741F3FD791E34AE8ED219060B
End Object

If copying this logic into your project, delete the existing **Damage handling** group of nodes (including **Event AnyDamage** and** Event Destroyed** logic) first.

Play your level to test it out. Step on a trap, let your character lose all their HP, and make sure the game resets as intended.

## Add Hazards to Your Puzzles

In Puzzles: Switches and Cubes (-> designer-05-puzzles-switches-and-cubes-in-unreal-engine), you learned about designing gameplay mechanics that add difficulty, tension, consequences, and risk-reward decisions. Environmental hazards that damage the player are one mechanic that introduces these consequences. You can use the spike traps to add danger and additional consequences to earlier puzzles and obstacles in the level, and switch-powered fire traps can create more dynamic puzzles that make the player interact with the environment to reveal safe paths.

When designing games, a key part of reducing overhead and improving development speed is finding multiple different ways to use and combine gameplay objects. In a previous section of this tutorial series, the switch powered platforms to create a path forward. Here, the same switch can disable fire traps to reveal a path for the player. This adds variety to the level without needing an endless number of unique systems.

Similar to the door-and-key game mechanic you created earlier in this tutorial series, your fire trap becomes another mechanic to manage the player's pacing and access to the environment.

### Create a Maze Puzzle with Fire Traps

In Room 2, you’ll combine switches and fire traps to build a maze puzzle where the player must carefully disable hazards to discover and collect the last key.

It often helps to sketch puzzles on paper first. Since the traps are 1m x 1m, our sample Room 2 can fit a 7 x 9 grid of traps. Start by drawing a path through the grid that ends at the key. Then, divide the path up into segments and place switches to control each segment.

To add difficulty and create more reveals and surprises, add architectural features that block sightlines. For example, place switches behind walls or pillars so the player has to discover them along the path.

This looping path gives the player a glance at the key so they discover the goal while traversing the first segment of the path.

With your plan complete, start blocking out the puzzle in the level editor.

Once you create the path to the key and new blockout shapes, fill in the rest of the room with fire traps to obscure the correct route.

Rename your level objects in the **Outliner **so it’s clear which fire traps each switch controls. For example, if `BP_Switch1` turns off three traps, name them `BP_FireTrap_S1_0`, `BP_FireTrap_S1_1`, and `BP_FireTrap_S1_2`. Rename the extra fire traps something like `BP_FireTrap_Extra` to show they aren’t part of the puzzle.

If desired, you can help the player exit when they complete the puzzle by adding a final switch under the key that disables some traps along the way out.

Test your puzzle often, paying attention to sightlines, frustration points, and possible shortcuts. Recruit a friend to help; they may find loopholes you didn’t expect. During playtesting, you may realize you need to make adjustments to stop or deter the player from skipping parts of the puzzle.

If you do discover an exploit, you have a couple of options:

- Rearrange the path or puzzle.
- Add more architectural blockers.
- Increase the fire damage so straying off the path has harsher consequences.

Leaving an exploit but increasing the cost gives the player a choice and autonomy. They can choose between spending more time to reveal the safe path or sacrificing their HP to rush to the key.

In the sample level’s puzzle, we added some rubble under the archway to the key so the player can see the key, but can’t skip directly to it. We also hid the switches not only for some rewarding reveals, but also to prevent skipping that part of the path.

### Add Spikes to Past Obstacles

Let’s add spikes to past puzzles to add consequences for falling

Start with Room 1’s puzzle. For the first moving platform, keep the stakes low so if the player falls, they just climb back up and try again. When you introduce a new mechanic, give the player room to learn in a safe space so they can focus on learning

Similarly, in the Start Room, you can add some spikes to the pit under the first key. The player can practice jumping on the first two platforms to prepare them for the final, riskier jump over to the key. Now, grabbing the first key unscathed becomes a bit more exciting.

Once the player understands the basics and has some practice moving blocks on platforms and switches, it’s time to add consequences. Under the second platform or third button, place some spike traps. Now you’ve raised the tension since the player takes damage if they fall, but they can quickly move off the trap to minimize that damage and continue.

Finally, for the last platform and switch, keep raising the danger. Cover the area below with spikes so they have to run further to get out of the spikes and therefore take more damage. At this point, the player should be more competent with the mechanic, and the consequence for mistakes feels fairer because they’ve already practiced.

This design follows this popular structure for introducing gameplay mechanics to players:

- **Introduce**: The first platform teaches the game mechanic safely.
- **Develop**: The second platform and cube tests the player’s growing skill with moderate risk.
- **Twist**: The final platform escalates the danger and adds a new direction of movement, turning the mechanic into a tense challenge.

Like you learned in the Gameplay Design lesson in Puzzles: Moving Platforms (-> designer-06-puzzles-moving-platforms-in-unreal-engine), by ramping up the consequences across the puzzle, you balance fairness and excitement.

### Change a Trap’s Damage

You may decide to change the difficulty level by increasing or decreasing the damage of one type of trap. You could do this in one of two ways:

- In the **Outliner**, search for “spike” or “fire”, and select all traps of that type. In the **Details **panel, change **Setup > Base Damage** as desired. With this method, you’d need to remember to also change the **Base Damage** of any new instances of that trap you add to your level. Or, add new trap instances to the level by duplicating existing traps to avoid having to edit each new instance.**OR**
- Open one of your child trap blueprints and go to its **Construction Script** tab. You can’t edit inherited variables in the My Blueprint panel, but you can set variables in the graph. After the two **Construction Script** nodes, connect a **Set Base Damage** node. In the node, change the **Base Damage** value as desired.

To ensure your gameplay objects are predictable for the player, ensure all traps of one type deal the same damage.

In the tutorial’s sample level, fire traps do 5 damage per second, and spike trap instances are modified to do 10 damage per second.

## Try the Sample Level

If you’d like to use pieces of the room designed in this part of the tutorial instead of creating your own, copy the snippets below.

### Room 2’s Blockout

This text snippet contains Room 2’s floor, walls, and the new blockout shapes added to create this room’s puzzle. In the **Outliner**, all shapes are in a folder named Room2.

 Command Line

```
Begin Map
   Begin Level
      Begin Actor Class=/Script/Engine.TextRenderActor Name=TextRenderActor_19 Archetype="/Script/Engine.TextRenderActor'/Script/Engine.Default__TextRenderActor'" ExportPath="/Script/Engine.TextRenderActor'/Game/AdventureGame/Designer/Lvl_Adventure.Lvl_Adventure:PersistentLevel.TextRenderActor_19'"
         Begin Object Class=/Script/Engine.TextRenderComponent Name="NewTextRenderComponent" Archetype="/Script/Engine.TextRenderComponent'/Script/Engine.Default__TextRenderActor:NewTextRenderComponent'" ExportPath="/Script/Engine.TextRenderComponent'/Game/AdventureGame/Designer/Lvl_Adventure.Lvl_Adventure:PersistentLevel.TextRenderActor_19.NewTextRenderComponent'"
         End Object
         Begin Object Class=/Script/Engine.BillboardComponent Name="Sprite" Archetype="/Script/Engine.BillboardComponent'/Script/Engine.Default__TextRenderActor:Sprite'" ExportPath="/Script/Engine.BillboardComponent'/Game/AdventureGame/Designer/Lvl_Adventure.Lvl_Adventure:PersistentLevel.TextRenderActor_19.Sprite'"
         End Object
         Begin Object Name="NewTextRenderComponent" ExportPath="/Script/Engine.TextRenderComponent'/Game/AdventureGame/Designer/Lvl_Adventure.Lvl_Adventure:PersistentLevel.TextRenderActor_19.NewTextRenderComponent'"
            Text=NSLOCTEXT("[3C535F7772EB3B3657484B5E2D5B925D]", "2347F80B407C68C27836E990A20143CF", "Room 2")
            HorizontalAlignment=EHTA_Center
```

To copy all of Room 2’s blockout, follow these steps:

- Remove anything already in Room 2 (or anything at the end of Hallway 2):Use the **Outliner **to select the existing contents of Room 2: Right-click the `Room2` folder, and select **Select > Immediate Children**. Press **Delete**.
- Or, switch the viewport to **Top **orthographic view to select and delete the existing room manually.

- Click** Copy Full Snippet**.
- In Unreal Editor, ensure the viewport is the active panel (click anywhere in the viewport or **Outliner **and press **Esc**), and then press **Ctrl + V**.

Your level and **Outliner **should look like the following:

### Room 2’s Switches, Traps, and Key

This text snippet contains the puzzle’s switches, traps, and red key. In the Outliner, all objects are in a folder named Room2.

To copy blueprint instances between projects, the parent blueprint assets must be completely identical and have the same file names and locations. If you’ve changed the blueprint’s components, variable names, or properties in your project, the snippet may not copy as expected, and you’ll need to set up these level objects manually.

 Command Line

```
Begin Map
   Begin Level
      Begin Actor Class=/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapFire.BP_TrapFire_C Name=BP_FireTrap_C_261 Archetype="/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapFire.BP_TrapFire_C'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapFire.Default__BP_TrapFire_C'" ExportPath="/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapFire.BP_TrapFire_C'/Game/AdventureGame/Designer/Lvl_Adventure.Lvl_Adventure:PersistentLevel.BP_FireTrap_C_261'"
         Begin Object Class=/Script/Engine.SceneComponent Name="DefaultSceneRoot" Archetype="/Script/Engine.SceneComponent'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapFire.BP_TrapFire_C:ICH-DefaultSceneRoot_GEN_VARIABLE'" ExportPath="/Script/Engine.SceneComponent'/Game/AdventureGame/Designer/Lvl_Adventure.Lvl_Adventure:PersistentLevel.BP_FireTrap_C_261.DefaultSceneRoot'"
         End Object
         Begin Object Class=/Script/Engine.StaticMeshComponent Name="TrapBase" Archetype="/Script/Engine.StaticMeshComponent'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapFire.BP_TrapFire_C:TrapBase_GEN_VARIABLE'" ExportPath="/Script/Engine.StaticMeshComponent'/Game/AdventureGame/Designer/Lvl_Adventure.Lvl_Adventure:PersistentLevel.BP_FireTrap_C_261.TrapBase'"
         End Object
         Begin Object Class=/Script/Engine.BoxComponent Name="TrapTrigger" Archetype="/Script/Engine.BoxComponent'/Game/AdventureGame/Designer/Blueprints/Traps/BP_TrapFire.BP_TrapFire_C:TrapTrigger_GEN_VARIABLE'" ExportPath="/Script/Engine.BoxComponent'/Game/AdventureGame/Designer/Lvl_Adventure.Lvl_Adventure:PersistentLevel.BP_FireTrap_C_261.TrapTrigger'"
         End Object
         Begin Object Name="DefaultSceneRoot" ExportPath="/Script/Engine.SceneComponent'/Game/AdventureGame/Designer/Lvl_Adventure.Lvl_Adventure:PersistentLevel.BP_FireTrap_C_261.DefaultSceneRoot'"
```

To set up the puzzle’s blueprint pieces, follow these steps:

- Click **Copy Full Snippet**.
- In Unreal Editor, ensure the viewport or **Outliner **is the active panel, and press **Ctrl + V**.
- Check each switch's **Setup **properties and, if necessary, reconnect each switch to its fire traps:In the **Outliner**, in the `Room2` folder, click `BP_Switch4`.
- In the **Details **panel, in the **Setup **section, expand the **Interact Object List**.
- For each element in the list, click the dropdown, search for `S4`, and select one of the `S4`-labelled fire traps.
- Repeat these steps for each switch:`BP_Switch5` triggers `BP_FireTrap_S5_0-7`
- `BP_Switch6` triggers `BP_FireTrap_S6_0-3`
- `BP_Switch7` triggers `BP_FireTrap_S7_0-4`
- `BP_Switch8` triggers `BP_FireTrap_S8_0-3`
- `BP_Switch9`, under the key, triggers `BP_FireTrap_S9_0-4`

Your level and **Outliner **should look like the following:

## Next Up

Next, you’ll learn how to add another popular hazard to your game — enemy NPCs! Learn how to create an AI enemy character and add Navigation Mesh to your level so the enemies can find and damage the player.

- [image: Create an Enemy] Create an EnemyBuild game logic to create Enemy Characters that deal and receive damage. (-> designer-08-create-an-enemy-in-unreal-engine)

On this page

- Before You Begin (-> designer-07-traps-and-damage-in-unreal-engine)
- Build a Set of Related Blueprint Classes (-> designer-07-traps-and-damage-in-unreal-engine)
- Create the Base Trap Blueprint (-> designer-07-traps-and-damage-in-unreal-engine)
- Add Components (-> designer-07-traps-and-damage-in-unreal-engine)
- Add Variables (-> designer-07-traps-and-damage-in-unreal-engine)
- Create a Function to Apply Damage (-> designer-07-traps-and-damage-in-unreal-engine)
- Create a Timer That Applies Damage Over Time (-> designer-07-traps-and-damage-in-unreal-engine)
- Start and Stop Damage (-> designer-07-traps-and-damage-in-unreal-engine)
- Test the Base Trap (-> designer-07-traps-and-damage-in-unreal-engine)
- Subclass a Spike Trap (-> designer-07-traps-and-damage-in-unreal-engine)
- Subclass a Fire Trap (-> designer-07-traps-and-damage-in-unreal-engine)
- Extend the Trap's Behavior (-> designer-07-traps-and-damage-in-unreal-engine)
- Update the HUD With Player HP (-> designer-07-traps-and-damage-in-unreal-engine)
- Add an HP Variable to the HUD (-> designer-07-traps-and-damage-in-unreal-engine)
- Display the Player’s Starting HP (-> designer-07-traps-and-damage-in-unreal-engine)
- Update the Player’s HP After Taking Damage (-> designer-07-traps-and-damage-in-unreal-engine)
- Create a Fail and Respawn Condition (-> designer-07-traps-and-damage-in-unreal-engine)
- Add a Game-Over Screen (-> designer-07-traps-and-damage-in-unreal-engine)
- Build Logic for a Fail Condition (-> designer-07-traps-and-damage-in-unreal-engine)
- Add Hazards to Your Puzzles (-> designer-07-traps-and-damage-in-unreal-engine)
- Create a Maze Puzzle with Fire Traps (-> designer-07-traps-and-damage-in-unreal-engine)
- Add Spikes to Past Obstacles (-> designer-07-traps-and-damage-in-unreal-engine)
- Change a Trap’s Damage (-> designer-07-traps-and-damage-in-unreal-engine)
- Try the Sample Level (-> designer-07-traps-and-damage-in-unreal-engine)
- Room 2’s Blockout (-> designer-07-traps-and-damage-in-unreal-engine)
- Room 2’s Switches, Traps, and Key (-> designer-07-traps-and-damage-in-unreal-engine)
- Next Up (-> designer-07-traps-and-damage-in-unreal-engine)

Related documents

Code a First-Person Adventure Game

 [image: Code a First-Person Adventure Game] (-> code-a-firstperson-adventure-game-in-unreal-engine)Create an Enemy

 [image: Create an Enemy] (-> designer-08-create-an-enemy-in-unreal-engine)Blueprint Foundations

 [image: Blueprint Foundations] (-> blueprint-foundations)
