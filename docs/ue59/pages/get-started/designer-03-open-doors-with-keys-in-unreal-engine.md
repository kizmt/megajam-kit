# Open Doors with Keys

https://dev.epicgames.com/documentation/en-us/unreal-engine/designer-03-open-doors-with-keys-in-unreal-engine?application_version=5.9

> Configure the BP_DoorFrame blueprint so the doors can change color and only open with the matching BP_Key.

[image: Open Doors with Keys]

Now that the player can pick up keys in the game, you’ll add the functionality to unlock and open doors when the player has picked up the required key. In this part of the tutorial, you will modify the `BP_DoorFrame` blueprint and explore **Functions **in Blueprints.

Unlockable doors provide a way to control the flow of the game and provide a sense of progression to the player. The project we are currently working on is divided into rooms. Therefore, picking up keys to unlock doors provides a logical progression path to the player.

## Before You Begin

Make sure you understand these topics covered in the previous sections of the Design a Puzzle Adventure (-> design-a-puzzle-adventure-game-in-unreal-engine) tutorial series:

- Blueprint basics (-> blueprint-foundations), including Blueprint Interfaces (-> blueprint-interface-in-unreal-engine).
- Creating variants of an object using a Map variable.

You’ll need the following assets created in the previous tutorial, Create a Key (-> designer-02-create-a-key-in-unreal-engine):

- `BP_Key`
- `BPL_FPGame` Blueprint Function library
- `BPI_PlayerKeys` Blueprint Interface
- Three `BP_DoorFrame` instances placed in your level between rooms or hallways.

## Add Color Options to the Door

Since the first-person template already has a door blueprint, you can modify the existing blueprint to add the functionality of unlocking doors with a key.

Your door needs a few things to work with the key system you defined in the previous part of this tutorial. Just like the key, your door needs to know that the actor interacting with it implements the `BPI_PlayerKeys` interface.

The door should change its color to match the key that it accepts, meaning it needs to know what Key Type can unlock it. Last, it needs the same KeyMap variable with red, yellow, and blue color combinations.

### Create Variables for Interacting with the Player and Keys

To add new variables to the `BP_DoorFrame` blueprint, follow these steps

- Go to the **Content Browser**, navigate to the **LevelPrototyping** > **Interactable **> **Door **folder, and open the `BP_DoorFrame` blueprint.
- In the **My Blueprint** panel, in the **Variables** section, add a new variable named **UseKey**, with the type **Boolean**. This determines if the door needs a key to open it.
- Create another variable named **RequiredKey **of the type **Enum Key Type**. This determines the key required to open the door. [image: Add Variables] Add Variables
- Click the **Eye **icon next to both variables so the eye is open, making them **editable**.
- Select the **UseKey **variable. In the **Details **panel, enter `Setup`** **as its **Category**.
- Select **RequiredKey **and change its **Category **to **Setup**.
- Create a new variable named **Other Actor** of the type **Actor **> **Object Reference**. This stores the actor interacting with the door and you'll use it to check if the player has overlapped with the door volume.

### Build the Key Map Variable

Just like you did in `BP_Key`, you’ll add the map variable that maps key types to material colors. However, with the door, you don’t want the door meshes to change shape, so you won’t add new mesh shapes to the map.

To build the door’s KeyMap variable, follow these steps:

- Create a variable named **KeyMap**, of the type **Enum Key Type**.
- Click this variable, and in the **Details **panel, click the **Container **dropdown and select **Map**.
- Change the map’s value type to **Struct Key Data**.[image: Set Struct Key Data Type] Set Struct Key Data Type
- **Compile **the blueprint to add KeyMap values.
- Under the map’s **Default Value** section, **Add **(**+**) 3 new elements to the **Key Map**. When you add the first entry, change the type to another color so you can keep adding new entries, you can’t add the same entry more than once.[image: Add Key Map Entries] Add Key Map Entries
- For each map element, add the corresponding **Key Material**:`M_BasicColor_Yellow`
- `M_BasicColor_Red`
- `M_BasicColor_Blue`

[image: Add materials to corresponding Key Map Index] Add materials to corresponding Key Map Index

- For each element, ensure the **Key Mesh** says **None**. To remove a mesh, click the dropdown and select **Clear **at the top of the list.
- **Save **and **Compile **the door blueprint.

### Add Color-Changing Blueprint Logic

With your variables set up, you can add the color-changing functionality by modifying the blueprint graph.

First, you need to change the door to have red, blue, and yellow color options that are controlled by the new **RequiredKey **variable you added. The door should change its color as you set it up in the level, not when the gameplay starts. Therefore, you will use the **Construction Script** tab to create this functionality.

To add the door’s color options, follow these steps:

- Navigate to the door’s **Construction Script** tab, where you can create functionality for when the door is created. In the graph, find the purple **Construction Script** node that starts off the logic in this function.
- On the **Sequence **node that’s connected to the **Construction Script**, use **Add pin **(**+**) to create one more pin, named **Then 2**, which you can use to build upon the chain.[image: Sequence Node Add Pin] Sequence Node Add Pin The **Sequence **node is used to build a sequence of actions, where **Then 0** gets executed first, **Then 1 **after that, and so on, depending on how many pins you choose to add. They help organize your graph and prevent one chain of logic from getting too long.
- Drag the **Then 2 **pin to an empty part of the graph and create a **Branch **node.
- Drag the **Condition **pin of the **Branch **node and create a **Get Use Key** node. Now, the Branch tests if the door should use keys or not. [image: Branch Node Logic] Branch Node Logic
- Drag the **True **pin of the **Branch **node and create a **Fn BPLSet** Key node. This is the library function that applies a new material color (and mesh, if provided) to an array of static meshes.
- Drag the **Fn BPLSet Key **node’s **Static Mesh Array** pin and create a **Make Array **node.
- Click the **Add pin (+)** button on the **Make Array **node.
- From the **Make Array **node, drag the first pin, **[0]**, and create a **Get Door** node. If you look in the **Variables **> **Components **list in the **My Blueprint** panel, you’ll see the door has **Door **and **Door2 **static mesh components. These are what you want to change color.
- Drag the second pin,** [1]**, and create a** Get Door 2** node. This makes an array based on the two static mesh components, **Door **and **Door 2**.
- From the **Fn BPLSet Key** node, drag the **Key Map** pin and create a **Get Key Map** node. This is a reference to the door’s **KeyMap **variable.
- Then, drag the **Key **pin and create a **Get Required Key **node, which is a reference to the **RequiredKey **variable you added earlier.
- **Compile **and **Save **the blueprint.

The door’s Construction Script should now have the following after the **Then 3** pin of the **Sequence **node:

[image: Final Door Blueprint Logic] Final Door Blueprint Logic

Here's a copyable version of this logic:

 Blueprint

 Door Construction Script

Begin Object Class=/Script/BlueprintGraph.K2Node_IfThenElse Name="K2Node_IfThenElse_3" ExportPath="/Script/BlueprintGraph.K2Node_IfThenElse'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame:UserConstructionScript.K2Node_IfThenElse_3'"
 NodePosX=736
 NodePosY=896
 NodeGuid=8BC6340843BC9EA444C6CBAA0C9620B9
 CustomProperties Pin (PinId=6A8C24B540716DD50D3CE5A007B8032E,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_ExecutionSequence_0 7D281C82433DA16FF2012FA4045C79FD,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=FD72D7314D271B22C0A1ABB2140DDADA,PinName="Condition",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",AutogeneratedDefaultValue="true",LinkedTo=(K2Node_VariableGet_24 51C968E1470C3A2E625E099DD8BCAFC9,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=01BE085446295FD6D9585FA992951BE9,PinName="then",PinFriendlyName=NSLOCTEXT("K2Node", "true", "true"),Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_46 72FE519C4CD513F31B8203AD286B0262,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F1B08B5943B47918D9E5889193F900F0,PinName="else",PinFriendlyName=NSLOCTEXT("K2Node", "false", "false"),Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_24" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame:UserConstructionScript.K2Node_VariableGet_24'"
 VariableReference=(MemberName="UseKey",MemberGuid=989283604841F3BC59919E9002F84E8A,bSelfContext=True)
 NodePosX=560
 NodePosY=960
 NodeGuid=8025B5A94EFF7333991BAAA36759DAFB
 CustomProperties Pin (PinId=51C968E1470C3A2E625E099DD8BCAFC9,PinName="UseKey",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",LinkedTo=(K2Node_IfThenElse_3 FD72D7314D271B22C0A1ABB2140DDADA,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=BB7230F3418C9FE8EF284CA60B2FF010,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_46" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame:UserConstructionScript.K2Node_CallFunction_46'"
 FunctionReference=(MemberParent="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Core/BPL_FPGame.BPL_FPGame_C'",MemberName="fnBPLSetKey",MemberGuid=7AF3D58C4C63BF2B73042CBAB0D00407)
 NodePosX=1360
 NodePosY=880
 NodeGuid=9748CD7647DB512F4B024CBC7C0E5735
 CustomProperties Pin (PinId=72FE519C4CD513F31B8203AD286B0262,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_3 01BE085446295FD6D9585FA992951BE9,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=FBA800794D98848FB63ABFAE65864A9F,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=495FD40B4A93B058784C239E71EA503B,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Core/BPL_FPGame.BPL_FPGame_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Game/AdventureGame/Designer/Blueprints/Core/BPL_FPGame.Default__BPL_FPGame_C",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=E532B1F741BF1C68AFB3D9B75F47FB23,PinName="Static Mesh Array",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMeshComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=True,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MakeArray_0 DB62EF8E4379A8B3101BEBA2FAB30D62,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=1C1F6D5F460295A49E94D9A1105B818E,PinName="KeyMap",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(TerminalCategory="struct",TerminalSubCategoryObject="/Script/CoreUObject.UserDefinedStruct'/Game/AdventureGame/Designer/Blueprints/Core/Struct_KeyData.Struct_KeyData'"),PinType.ContainerType=Map,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",LinkedTo=(K2Node_VariableGet_27 96A14D49414D4A0A6166C18D711B7C25,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=AE91F2BB41A7A80DD694E48F76844CB4,PinName="Key",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",AutogeneratedDefaultValue="NewEnumerator0",LinkedTo=(K2Node_VariableGet_28 A3C91FEC41C5EAB305C21DA93CB555EE,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=02925BBF437C4B698DAF17B476AC69C4,PinName="__WorldContext",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/CoreUObject.Object'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_MakeArray Name="K2Node_MakeArray_0" ExportPath="/Script/BlueprintGraph.K2Node_MakeArray'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame:UserConstructionScript.K2Node_MakeArray_0'"
 NumInputs=2
 NodePosX=1104
 NodePosY=960
 NodeGuid=F2BFF0E542F73C01E8C328B51C277493
 CustomProperties Pin (PinId=DB62EF8E4379A8B3101BEBA2FAB30D62,PinName="Array",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMeshComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=True,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_46 E532B1F741BF1C68AFB3D9B75F47FB23,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F1F5720140A2EEBA2E66C8AA4C0837D7,PinName="[0]",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMeshComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_25 BDE74A1D41F1E661207B44B7CD40C13A,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=AE5DB6F14D3F349BCE387FB47CE53547,PinName="[1]",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMeshComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_26 3631AAFB4C2236355F3793A3F72BC4E0,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_25" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame:UserConstructionScript.K2Node_VariableGet_25'"
 VariableReference=(MemberName="Door",MemberGuid=AC3DDC974971FF692DE3DFBAFFF561B5,bSelfContext=True)
 NodePosX=928
 NodePosY=976
 NodeGuid=827E75214D482FE085150A924E3B51C4
 CustomProperties Pin (PinId=BDE74A1D41F1E661207B44B7CD40C13A,PinName="Door",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMeshComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MakeArray_0 F1F5720140A2EEBA2E66C8AA4C0837D7,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=0261038A4AA3C210B62134B08D232DDB,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_26" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame:UserConstructionScript.K2Node_VariableGet_26'"
 VariableReference=(MemberName="Door2",MemberGuid=AA2355324452C0D7FE8329AA2D9D0FC8,bSelfContext=True)
 NodePosX=928
 NodePosY=1040
 NodeGuid=B5E28A8A455AFB34E4EC84B4DB8037AC
 CustomProperties Pin (PinId=3631AAFB4C2236355F3793A3F72BC4E0,PinName="Door2",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMeshComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MakeArray_0 AE5DB6F14D3F349BCE387FB47CE53547,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=A917565E44B81203BEF1B682858DBD13,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_27" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame:UserConstructionScript.K2Node_VariableGet_27'"
 VariableReference=(MemberName="KeyMap",MemberGuid=E4661CA548AF5F96C73A83AC42A4F8DE,bSelfContext=True)
 NodePosX=1120
 NodePosY=1072
 NodeGuid=F711348E49D0B584D257B2A18A586088
 CustomProperties Pin (PinId=96A14D49414D4A0A6166C18D711B7C25,PinName="KeyMap",Direction="EGPD_Output",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(TerminalCategory="struct",TerminalSubCategoryObject="/Script/CoreUObject.UserDefinedStruct'/Game/AdventureGame/Designer/Blueprints/Core/Struct_KeyData.Struct_KeyData'"),PinType.ContainerType=Map,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",LinkedTo=(K2Node_CallFunction_46 1C1F6D5F460295A49E94D9A1105B818E,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=B58611A54978D25C85142D86F799FEEE,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_28" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame:UserConstructionScript.K2Node_VariableGet_28'"
 VariableReference=(MemberName="RequiredKey",MemberGuid=83AF8550454C85300EBE78BD938AF857,bSelfContext=True)
 NodePosX=1120
 NodePosY=1136
 NodeGuid=CDC4F58A4BE3AB5FD47842B68D18AF73
 CustomProperties Pin (PinId=A3C91FEC41C5EAB305C21DA93CB555EE,PinName="RequiredKey",Direction="EGPD_Output",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",LinkedTo=(K2Node_CallFunction_46 AE91F2BB41A7A80DD694E48F76844CB4,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=0FCF51144EFC063FA8549FA130B9A0D9,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_7" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame:UserConstructionScript.EdGraphNode_Comment_7'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=496
 NodePosY=816
 NodeWidth=1083
 NodeHeight=393
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="If the door uses keys, change the door color to match RequiredKey key type"
 NodeGuid=95D2FCDD4F41CB3EFEB03E9FBAAB149C
End Object

If copying and pasting this snippet into `BP_DoorFrame’s Construction Script`, you’ll need to add a third pin to the existing **Sequence **node and then connect that pin to the **Branch** node’s exec pin.

### Test the Door Colors

After color-coding the door game object, you can set the doors to not open unless the player has the correct key.

In your level, select one of your `BP_DoorFrame` instances.

In the **Details **panel, enter Key in the search field at the top. This reveals two options: **Use Key** and **Required Key**. Change the **Required Key** to a different key type. The door’s color should change to match the key type.

If you toggle** Use Key** to **false**, the door’s color won’t update, since you set that as a condition in the blueprint.

Modifying the Door Color

As a reminder, this is the benefit of using the **Construction Script** graph tab in the Blueprint Editor. You can see changes happen in the level editor instead of having to wait to enter game mode.

## Build Key-Based Door Logic

Next, you can build the functionality to check what keys the player has. For this, you will define a custom function named **fnHasKey** in the `BP_DoorFrame` blueprint that checks if the player has the required key.

 A function is a reusable set of blueprint nodes that performs a specific task.

### Create a Function That Checks for Keys

This function will compare the door's required key with the player character's array of keys and return a true or false (boolean) value. You'll use a local variable for that boolean return value.

To create a function with a local variable, follow these steps:

- In the `BP_DoorFrame`** **blueprint, in the **My Blueprint** panel, use **Add **(**+**) next to the **Functions **section. This is similar to adding a variable, but instead, you’re adding a function.
- Name the new function **fnHasKey**. [image: Name the Function FnHasKey] Name the Function FnHasKey
- Since a function can have its own set of nodes, it opens in its own **fnHasKey** tab with a separate node graph. If you close this tab and need to re-open it, double-click the function in the **Functions **list.
- In the **My Blueprint** panel, you will see a new section at the bottom that’s called **Local Variables (FnHasKey)**. Create a new **Local Variable** using **Add** (**+**) next to that section.
- Name the variable **HasRequiredKey **and set its type to **Boolean**.[image: Has Required Key Variable] Has Required Key Variable Local variables are similar to regular variables, but local to a particular function. They are useful for storing temporary values while the function runs. You can then pass this value back to the rest of the blueprint by using a **Return Node**.

With the function set up, you can add logic that checks if the player has the right key.

To check if the actor in the door’s volume has the required key, follow these steps:

- Drag the pin of the **fnHasKey **function entry node and create a **Sequence **node. This organizes the function’s logic into a sequence of actions that run in order.
- Drag the Then 0 pin of the Sequence node and create an **Fn BPIGet Keys (Message)** node. This is the interface function that returns an array of keys the player has already found.
- Drag the **Target **pin of the **Fn BPIGet Keys** node and create a **Get Other Actor** node. Once you set up the door’s event graph, this variable will store the actor overlapping the door’s volume.[image: FnKeys Logic] FnKeys Logic
- Drag the **HasRequiredKey **local variable near the **Fn BPIGet Keys** node and select **Set**.
- Drag the **Exec **pin of the** FN BPIGet Keys** node and connect it to the **Set** **HasRequiredKey **node.
- From the Set **HasRequiredKey **node, drag the **HasRequiredKey **pin and create a **Contains Item **node, listed under the **Array **section of the search. This node checks if a specific item is in an array and returns true or false.You can also search for **Array Contains Item** to narrow down the search to that particular option.
- From the **Contains Item** node, drag the **Target Array **pin (the square pin) and connect it to the **Held Keys **pin of the **Fn BPIGet Keys** node.
- Drag the **Item to Find** pin (that looks like a circle) of the **Contains Item **node, and create a** Get Required Key **node.

 This is what your function’s graph should look like so far:

[image: FnHasKey Function Logic] FnHasKey Function Logic

This sequence of actions checks if the keys held by the **OtherActor **(variable) contain the **RequiredKey **(variable). If so, it will set **HasRequiredKey **to **true**.

Now, pass the **HasRequiredKey **result to the rest of the blueprint. To do this, use a **Return **node, which stops the execution of a function and returns a value to the blueprint that called the function.

To end the function with a **Return **node, follow these steps:

- From the **Sequence **node, drag the **Then 1** pin, search for **Return **in the node actions list, and select **Add Return Node**.
- To make the function return a value, it needs an output. Click the **Return Node** to highlight it.
- In the **Details **panel, use **Add** (**+**) next to the **Outputs **section at the bottom. This adds a new output, which is the value it passes out of this function.
- Name this output **KeyFound **and change its type to **Boolean**.
- Back in the graph, drag the **Key Found** pin of the **Return** node, and create a **Get HasRequiredKey** node.

The complete FnHasKey function graph should now look like the following:

 Blueprint

 FnHasKey Function

Begin Object Class=/Script/BlueprintGraph.K2Node_FunctionEntry Name="K2Node_FunctionEntry_0" ExportPath="/Script/BlueprintGraph.K2Node_FunctionEntry'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame:FnHasKey.K2Node_FunctionEntry_0'"
 LocalVariables(0)=(VarName="HasRequiredKey",VarGuid=BA52789E4082458C407C30ACB00E7DDA,VarType=(PinCategory="bool"),FriendlyName="Has Required Key",Category=NSLOCTEXT("KismetSchema", "Default", "Default"),PropertyFlags=5)
 ExtraFlags=201457664
 FunctionReference=(MemberName="FnHasKey")
 bIsEditable=True
 NodePosX=112
 NodePosY=-80
 NodeGuid=4FDCED0544DF70071CD1C8A8D384960C
 CustomProperties Pin (PinId=88EB78FE4E03E70DC96ED9AEBB181C66,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_ExecutionSequence_0 AF2806494E835CAF86D028A700D36C0D,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_ExecutionSequence Name="K2Node_ExecutionSequence_0" ExportPath="/Script/BlueprintGraph.K2Node_ExecutionSequence'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame:FnHasKey.K2Node_ExecutionSequence_0'"
 NodePosX=272
 NodePosY=-80
 NodeGuid=7698428547B0CE7B4A94829AD45E8A57
 CustomProperties Pin (PinId=AF2806494E835CAF86D028A700D36C0D,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_FunctionEntry_0 88EB78FE4E03E70DC96ED9AEBB181C66,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=57854AD14105EFA07F70A1BAEB5D5C71,PinName="then_0",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Message_0 F23B6E3E41C67C8D09C205847DEBBC30,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=26F4FE8240CDFAF18F44B38FFED6C0A4,PinName="then_1",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_FunctionResult_0 BF4C93F048AAFB5451D93DB2A6467545,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_Message Name="K2Node_Message_0" ExportPath="/Script/BlueprintGraph.K2Node_Message'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame:FnHasKey.K2Node_Message_0'"
 FunctionReference=(MemberParent="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Core/BPI_PlayerKeys.BPI_PlayerKeys_C'",MemberName="fnBPIGetKeys",MemberGuid=16DC5E52458A28BAFE6D809BF1E2E381)
 NodePosX=753
 NodePosY=-201
 NodeGuid=25844A4443A2F6CA87A770A6285EB7C5
 CustomProperties Pin (PinId=F23B6E3E41C67C8D09C205847DEBBC30,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_ExecutionSequence_0 57854AD14105EFA07F70A1BAEB5D5C71,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=ECA4DF9942591370A63839B41A070603,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_0 2573F88841B87E816A0B91AA4B8763BB,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=6902596E486DEB234E8BF9A353D07BF1,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/CoreUObject.Object'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_0 04C751934C0D903B868D7D90A9C35F44,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=8C6815EA4D0DE7A8CA0004B23F361E2A,PinName="Held Keys",Direction="EGPD_Output",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",LinkedTo=(K2Node_CallArrayFunction_1 22E0E677478E3D911B28E8A8108A5DAD,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_0" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame:FnHasKey.K2Node_VariableGet_0'"
 VariableReference=(MemberName="OtherActor",MemberGuid=7FB4F6B240A9326FC9A0DBA3F24E6FC6,bSelfContext=True)
 NodePosX=592
 NodePosY=-64
 NodeGuid=AF4A4C5A42766F00AE6AC8A26FA6F64B
 CustomProperties Pin (PinId=04C751934C0D903B868D7D90A9C35F44,PinName="OtherActor",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Message_0 6902596E486DEB234E8BF9A353D07BF1,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=4E3571084B2BE96D6955ADB75879EA23,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableSet Name="K2Node_VariableSet_0" ExportPath="/Script/BlueprintGraph.K2Node_VariableSet'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame:FnHasKey.K2Node_VariableSet_0'"
 VariableReference=(MemberScope="FnHasKey",MemberName="HasRequiredKey",MemberGuid=BA52789E4082458C407C30ACB00E7DDA)
 NodePosX=1281
 NodePosY=-169
 NodeGuid=AB78B94749640D2507A2929737603E9B
 CustomProperties Pin (PinId=2573F88841B87E816A0B91AA4B8763BB,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Message_0 ECA4DF9942591370A63839B41A070603,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=0E187A23465FED55AEF8B98EF263444A,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=0CEC6C394D16CBA1B8CC3BB241E02FA4,PinName="HasRequiredKey",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",LinkedTo=(K2Node_CallArrayFunction_1 4D4F4CC44CCCB629F24C108644E92C33,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=B2DF06DE46ADA9FD6852B998BF96632B,PinName="Output_Get",PinToolTip="Retrieves the value of the variable, can use instead of a separate Get node",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallArrayFunction Name="K2Node_CallArrayFunction_1" ExportPath="/Script/BlueprintGraph.K2Node_CallArrayFunction'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame:FnHasKey.K2Node_CallArrayFunction_1'"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetArrayLibrary'",MemberName="Array_Contains")
 NodePosX=993
 NodePosY=-105
 NodeGuid=0B2B9D0A4C7A6EBBFFCF559DD7FD71A9
 CustomProperties Pin (PinId=98DDCD93424DA130431430987A05A458,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.KismetArrayLibrary'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__KismetArrayLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=22E0E677478E3D911B28E8A8108A5DAD,PinName="TargetArray",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=True,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Message_0 8C6815EA4D0DE7A8CA0004B23F361E2A,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=67C5437C4864D9B0B33A4F91F2EEDE3F,PinName="ItemToFind",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=True,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",LinkedTo=(K2Node_VariableGet_1 8DEFE77F46D743D18D0B499378625C81,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=4D4F4CC44CCCB629F24C108644E92C33,PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",LinkedTo=(K2Node_VariableSet_0 0CEC6C394D16CBA1B8CC3BB241E02FA4,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_1" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame:FnHasKey.K2Node_VariableGet_1'"
 VariableReference=(MemberName="RequiredKey",MemberGuid=83AF8550454C85300EBE78BD938AF857,bSelfContext=True)
 NodePosX=817
 NodePosY=-41
 NodeGuid=D82413E2415EA9CC10EBA6B748B6B0FB
 CustomProperties Pin (PinId=8DEFE77F46D743D18D0B499378625C81,PinName="RequiredKey",Direction="EGPD_Output",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",LinkedTo=(K2Node_CallArrayFunction_1 67C5437C4864D9B0B33A4F91F2EEDE3F,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=FC62E53D47EE8FF86F68F8A75B4AA36D,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_0" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame:FnHasKey.EdGraphNode_Comment_0'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=448
 NodePosY=-256
 NodeWidth=1072
 NodeHeight=288
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="If OtherActor\'s key array contains the door\'s required key, set HasRequiredKey to true"
 NodeGuid=66CEE47C4D8E6A46767D1AA15CDA810A
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_FunctionResult Name="K2Node_FunctionResult_0" ExportPath="/Script/BlueprintGraph.K2Node_FunctionResult'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame:FnHasKey.K2Node_FunctionResult_0'"
 FunctionReference=(MemberName="FnHasKey")
 bIsEditable=True
 NodePosX=720
 NodePosY=144
 NodeGuid=A574FD1C4AED903CFA452D88A268F941
 CustomProperties Pin (PinId=BF4C93F048AAFB5451D93DB2A6467545,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_ExecutionSequence_0 26F4FE8240CDFAF18F44B38FFED6C0A4,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=738C413B4B2AD3BEEF7D2FBB76A862B9,PinName="KeyFound",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",LinkedTo=(K2Node_VariableGet_2 5D6AB5474C67FA790243269D84DF2328,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties UserDefinedPin (PinName="KeyFound",PinType=(PinCategory="bool"),DesiredPinDirection=EGPD_Input,PinDefaultValue="false")
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_2" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame:FnHasKey.K2Node_VariableGet_2'"
 VariableReference=(MemberScope="FnHasKey",MemberName="HasRequiredKey",MemberGuid=BA52789E4082458C407C30ACB00E7DDA)
 NodePosX=512
 NodePosY=208
 NodeGuid=6B87E919447594718C1E078A386C79A6
 CustomProperties Pin (PinId=5D6AB5474C67FA790243269D84DF2328,PinName="HasRequiredKey",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",LinkedTo=(K2Node_FunctionResult_0 738C413B4B2AD3BEEF7D2FBB76A862B9,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_1" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame:FnHasKey.EdGraphNode_Comment_1'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=448
 NodePosY=80
 NodeWidth=816
 NodeHeight=192
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Returns true if OtherActor has the required key"
 NodeGuid=01168DA64BF61D49EE1903A18EEC0D0B
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_FunctionEntry Name="K2Node_FunctionEntry_0" ExportPath="/Script/BlueprintGraph.K2Node_FunctionEntry'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame:FnHasKey.K2Node_FunctionEntry_0'"
 LocalVariables(0)=(VarName="HasRequiredKey",VarGuid=BA52789E4082458C407C30ACB00E7DDA,VarType=(PinCategory="bool"),FriendlyName="Has Required Key",Category=NSLOCTEXT("KismetSchema", "Default", "Default"),PropertyFlags=5)
 ExtraFlags=201457664
 FunctionReference=(MemberName="FnHasKey")
 bIsEditable=True
 NodePosX=112
 NodePosY=-80
 NodeGuid=4FDCED0544DF70071CD1C8A8D384960C
 CustomProperties Pin (PinId=88EB78FE4E03E70DC96ED9AEBB181C66,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_ExecutionSequence_0 AF2806494E835CAF86D028A700D36C0D,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_ExecutionSequence Name="K2Node_ExecutionSequence_0" ExportPath="/Script/BlueprintGraph.K2Node_ExecutionSequence'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame:FnHasKey.K2Node_ExecutionSequence_0'"
 NodePosX=272
 NodePosY=-80
 NodeGuid=7698428547B0CE7B4A94829AD45E8A57
 CustomProperties Pin (PinId=AF2806494E835CAF86D028A700D36C0D,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_FunctionEntry_0 88EB78FE4E03E70DC96ED9AEBB181C66,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=57854AD14105EFA07F70A1BAEB5D5C71,PinName="then_0",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Message_0 F23B6E3E41C67C8D09C205847DEBBC30,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=26F4FE8240CDFAF18F44B38FFED6C0A4,PinName="then_1",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_FunctionResult_0 BF4C93F048AAFB5451D93DB2A6467545,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_Message Name="K2Node_Message_0" ExportPath="/Script/BlueprintGraph.K2Node_Message'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame:FnHasKey.K2Node_Message_0'"
 FunctionReference=(MemberParent="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Core/BPI_PlayerKeys.BPI_PlayerKeys_C'",MemberName="fnBPIGetKeys",MemberGuid=16DC5E52458A28BAFE6D809BF1E2E381)
 NodePosX=753
 NodePosY=-201
 NodeGuid=25844A4443A2F6CA87A770A6285EB7C5
 CustomProperties Pin (PinId=F23B6E3E41C67C8D09C205847DEBBC30,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_ExecutionSequence_0 57854AD14105EFA07F70A1BAEB5D5C71,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=ECA4DF9942591370A63839B41A070603,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_0 2573F88841B87E816A0B91AA4B8763BB,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=6902596E486DEB234E8BF9A353D07BF1,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/CoreUObject.Object'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_0 04C751934C0D903B868D7D90A9C35F44,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=8C6815EA4D0DE7A8CA0004B23F361E2A,PinName="Held Keys",Direction="EGPD_Output",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",LinkedTo=(K2Node_CallArrayFunction_1 22E0E677478E3D911B28E8A8108A5DAD,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_0" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame:FnHasKey.K2Node_VariableGet_0'"
 VariableReference=(MemberName="OtherActor",MemberGuid=7FB4F6B240A9326FC9A0DBA3F24E6FC6,bSelfContext=True)
 NodePosX=592
 NodePosY=-64
 NodeGuid=AF4A4C5A42766F00AE6AC8A26FA6F64B
 CustomProperties Pin (PinId=04C751934C0D903B868D7D90A9C35F44,PinName="OtherActor",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Message_0 6902596E486DEB234E8BF9A353D07BF1,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=4E3571084B2BE96D6955ADB75879EA23,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableSet Name="K2Node_VariableSet_0" ExportPath="/Script/BlueprintGraph.K2Node_VariableSet'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame:FnHasKey.K2Node_VariableSet_0'"
 VariableReference=(MemberScope="FnHasKey",MemberName="HasRequiredKey",MemberGuid=BA52789E4082458C407C30ACB00E7DDA)
 NodePosX=1281
 NodePosY=-169
 NodeGuid=AB78B94749640D2507A2929737603E9B
 CustomProperties Pin (PinId=2573F88841B87E816A0B91AA4B8763BB,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Message_0 ECA4DF9942591370A63839B41A070603,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=0E187A23465FED55AEF8B98EF263444A,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=0CEC6C394D16CBA1B8CC3BB241E02FA4,PinName="HasRequiredKey",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",LinkedTo=(K2Node_CallArrayFunction_1 4D4F4CC44CCCB629F24C108644E92C33,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=B2DF06DE46ADA9FD6852B998BF96632B,PinName="Output_Get",PinToolTip="Retrieves the value of the variable, can use instead of a separate Get node",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallArrayFunction Name="K2Node_CallArrayFunction_1" ExportPath="/Script/BlueprintGraph.K2Node_CallArrayFunction'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame:FnHasKey.K2Node_CallArrayFunction_1'"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetArrayLibrary'",MemberName="Array_Contains")
 NodePosX=993
 NodePosY=-105
 NodeGuid=0B2B9D0A4C7A6EBBFFCF559DD7FD71A9
 CustomProperties Pin (PinId=98DDCD93424DA130431430987A05A458,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.KismetArrayLibrary'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__KismetArrayLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=22E0E677478E3D911B28E8A8108A5DAD,PinName="TargetArray",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=True,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Message_0 8C6815EA4D0DE7A8CA0004B23F361E2A,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=67C5437C4864D9B0B33A4F91F2EEDE3F,PinName="ItemToFind",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=True,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",LinkedTo=(K2Node_VariableGet_1 8DEFE77F46D743D18D0B499378625C81,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=4D4F4CC44CCCB629F24C108644E92C33,PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",LinkedTo=(K2Node_VariableSet_0 0CEC6C394D16CBA1B8CC3BB241E02FA4,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_1" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame:FnHasKey.K2Node_VariableGet_1'"
 VariableReference=(MemberName="RequiredKey",MemberGuid=83AF8550454C85300EBE78BD938AF857,bSelfContext=True)
 NodePosX=817
 NodePosY=-41
 NodeGuid=D82413E2415EA9CC10EBA6B748B6B0FB
 CustomProperties Pin (PinId=8DEFE77F46D743D18D0B499378625C81,PinName="RequiredKey",Direction="EGPD_Output",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",LinkedTo=(K2Node_CallArrayFunction_1 67C5437C4864D9B0B33A4F91F2EEDE3F,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=FC62E53D47EE8FF86F68F8A75B4AA36D,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_0" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame:FnHasKey.EdGraphNode_Comment_0'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=448
 NodePosY=-256
 NodeWidth=1072
 NodeHeight=288
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="If OtherActor\'s key array contains the door\'s required key, set HasRequiredKey to true"
 NodeGuid=66CEE47C4D8E6A46767D1AA15CDA810A
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_FunctionResult Name="K2Node_FunctionResult_0" ExportPath="/Script/BlueprintGraph.K2Node_FunctionResult'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame:FnHasKey.K2Node_FunctionResult_0'"
 FunctionReference=(MemberName="FnHasKey")
 bIsEditable=True
 NodePosX=720
 NodePosY=144
 NodeGuid=A574FD1C4AED903CFA452D88A268F941
 CustomProperties Pin (PinId=BF4C93F048AAFB5451D93DB2A6467545,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_ExecutionSequence_0 26F4FE8240CDFAF18F44B38FFED6C0A4,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=738C413B4B2AD3BEEF7D2FBB76A862B9,PinName="KeyFound",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",LinkedTo=(K2Node_VariableGet_2 5D6AB5474C67FA790243269D84DF2328,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties UserDefinedPin (PinName="KeyFound",PinType=(PinCategory="bool"),DesiredPinDirection=EGPD_Input,PinDefaultValue="false")
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_2" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame:FnHasKey.K2Node_VariableGet_2'"
 VariableReference=(MemberScope="FnHasKey",MemberName="HasRequiredKey",MemberGuid=BA52789E4082458C407C30ACB00E7DDA)
 NodePosX=512
 NodePosY=208
 NodeGuid=6B87E919447594718C1E078A386C79A6
 CustomProperties Pin (PinId=5D6AB5474C67FA790243269D84DF2328,PinName="HasRequiredKey",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",LinkedTo=(K2Node_FunctionResult_0 738C413B4B2AD3BEEF7D2FBB76A862B9,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_1" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/LevelPrototyping/Interactable/Door/BP_DoorFrame.BP_DoorFrame:FnHasKey.EdGraphNode_Comment_1'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=448
 NodePosY=80
 NodeWidth=816
 NodeHeight=192
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Returns true if OtherActor has the required key"
 NodeGuid=01168DA64BF61D49EE1903A18EEC0D0B
End Object

If you copy this snippet into your project, you need to connect the **FnHasKey** function entry node to the **Sequence **node.

### Lock and Unlock Doors With Keys

Now you can modify the door to open if all the necessary conditions are true.

Just like with the key, you’ll need to check if the character implements the `BPI_PlayerKeys` interface (the player’s “permission slip”) before they can try to open a door that uses keys.

So before it opens, the door must check for the following conditions:

- The door is set up to use keys (UseKey = True).
- The overlapping actor is the player (it implements BPI_PlayerKeys).
- The player has the required key type.

To test if the actor interacting with the door is the player, follow these steps:

- In `BP_DoorFrame`’s Event Graph, find the **Event ActorBeginOverlap** node. This collection of nodes controls what happens when a character steps into the door’s collision volume. You’ll add a blueprint interface and key requirement to this logic so the door won’t open unless the actor is the player and they have the right key. You can use **Ctrl **+ **F** to search for the name of a node. Click on the search result to go directly to it.
- Disconnect the **Event ActorBeginOverlap** node from the **Door Control** node by holding** Alt **and clicking the wire between the two nodes. Move the **Event **node back so you have space for more node actions before the **Door Control**.Disconnect Blueprint Nodes
- From the **Event ActorBeginOverlap** node, drag its pin and add a **Set Other Actor** node. Connect the **Other Actor **pin of the **Event **node to the **Other Actor** pin of the **Set **node.[image: Event Actor Begin Overlap Set Other Actor Variable] Event Actor Begin Overlap Set Other Actor Variable This stores the actor that overlapped with the door area.
- From the** Set Other Actor** node, drag the blue** Value** pin and create a **Does Object Implement Interface** node. Set the **Interface **value to `BPI_PlayerKeys`.[image: Does Object Implement Interface Node] Does Object Implement Interface Node
- From the **Set Other Actor** node, drag the **Exec **pin and create a new **Branch **node.

To check that the door uses keys, follow these steps:

- Drag the **True **pin of the **Branch **node and create an **Fn Has Key **node, which is the function that you created earlier in this tutorial. It takes the key type required to open the door and checks the player’s **Held Keys** array for that key type. Calling this function here will execute the nodes in it.
- From the** Fn Has Key** node, drag the **Exec **pin and create a new **Branch** node.
- Connect the **Key Found** pin of the **Fn Has Key** node to the **Condition **pin of the **Branch **node.
- Connect the new **Branch **node’s **True **pin to the** Door Control** node’s **Play **pin.[image: Door Control Node] Door Control Node

So far, this logic only allows the door to open when the player has the right key. The door should also open when:

- The door doesn’t require keys, or
- A non-player character tries to get through the door.

The first **Branch **node and **And **node tests for both of these conditions. If either is **false**, the **Branch **is also **false**.

To ensure the door opens for NPCs and when keys aren’t required, follow these steps:

- Connect the **False **pin of the first **Branch **node directly to the **Door Control **node’s **Play **pin. You can use connectors by double-clicking on a wire between two nodes to organize your blueprint.[image: Blueprint Connections Logic] Blueprint Connections Logic
- **Compile **and **Save **the blueprint.

Now, when the actor does not implement the key interface, or the door does not require keys (**UseKeys **= False), the door still opens.

In this tutorial, we designed the doors to allow NPCs to pass through them. If you’d like your game to work differently, go ahead and try to change the graph yourself.

The new `BP_DoorFrame ` Event Graph logic should look like the following:

[image: BP_DoorFrame Event Graph Logic] BP_DoorFrame Event Graph Logic

## Add Comments to a Blueprint

You can add comment blocks in your blueprints to create visual-only notes that group nodes together and explain what each part of the blueprint does. Comments help you and your team members know at a glance what functionality your nodes are performing and keep your blueprints organized.

When building blueprint logic, first focus on creating the functionality, and then highlight the nodes you have added and add a comment to contain and describe them.

To add a comment in a blueprint, follow these steps:

- Click the graph to ensure it's the active panel.
- Press **C** on your keyboard. This adds a comment box.
- Double-click the text field at the top of the box to enter a comment.
- To resize the comment, ensure the comment is selected (highlighted with a yellow outline), and drag an edge or corner.
- To group notes within a comment, drag those nodes inside the bounds of the comment.

You can also select one or multiple nodes and press **C** to add a comment that contains the selected nodes.

Creating Comments in Blueprints

## Test Your Doors

Go back to your level in the **Level Editor**. Use your doors’ Required Key property to set them up with different colors and add a **BP_Key **for each color.

Now, play the game. If you walk up to the door without picking up a key, the door will not open.

But if you pick up the key, the door opens when you approach it. When you move far enough away, it’ll close automatically.

After picking up one key color, try to open a door that’s a different color. The door should stay closed.

Testing Door Functionality

If you're working with this tutorial's sample level, select the door that leads to **Hallway 2 **and change its required key to the blue key. Next, select the door that leads to **Hallway 3 **and change its required key to the red key. Make the door to **Hallway 1** yellow.

[image: Color Coded Doors and Keys] Color Coded Doors and Keys

### Add Feedback with Debug Messages

If you want to check what’s happening in a blueprint during gameplay, you can use** Print String** nodes to display messages on screen. Unreal Engine doesn’t display these messages in a final game.

Try adding a** Print String **node to confirm the type of key the player has picked up.

To display a debug message with Print String nodes, follow these steps:

- In the `BP_AdventureCharacter` Event Graph, go to the set of nodes that starts with **Event fnBPIAddKey **and adds keys to the **HeldKeys **array.
- Drag from the **Add **node’s **Exec **pin and add a **Print String** node.
- The **In String **is the text that appears on-screen. Enter custom text, or connect the **Event **node’s **Key Type** pin to **In String**. This displays the key the player is picking up.[image: Debug Logic] Debug Logic
- **Compile **the blueprint.
- Play your game again and pick up the keys. You’ll see debug text confirming each key color as you pick them up.
- When you’re done, go back to the node graph and delete the **Print String** and **Enum to String** nodes. **Compile **and **Save **the blueprint.

If something isn’t working as expected in a blueprint, you can add Print String nodes after calculations, event calls, or function calls to help track what’s happening with values and flow.

You can also open a blueprint while the game is playing, its wires light up to show the logic running in real time. This **Execution Tracing** is a quick way to spot what’s happening alongside your Print String messages.

## Place Pickup Items

So far, you’ve been placing keys on the floor. To make this more interesting and engaging for the player, try introducing a platforming element.

In this tutorial’s sample level, we added some verticality by placing the key in a high place so the player has to jump to the key. Here, there’s a minor risk of falling and having to start over.

[image: Level Layout with Functional Keys] Level Layout with Functional Keys

The player practices jumping on the first and second platforms before they are put to the test with the more difficult final jump to the pillar.

## Try the Sample Level

If you’d like to add the new pieces of the room designed in this part of the tutorial series instead of creating your own, copy the snippets below.

### Start Room’s Blockout

This text snippet contains the ramp, recessed floor, column, and two platform meshes added to create the path to the yellow key.

 C++

 Starting Room Layout

```
Begin Map
   Begin Level
      Begin Actor Class=/Script/Engine.StaticMeshActor Name=Floor_168 Archetype="/Script/Engine.StaticMeshActor'/Script/Engine.Default__StaticMeshActor'" ExportPath="/Script/Engine.StaticMeshActor'/Game/AdventureGame/Designer/Lvl_Adventure.Lvl_Adventure:PersistentLevel.Floor_168'"
         Begin Object Class=/Script/Engine.StaticMeshComponent Name="StaticMeshComponent0" Archetype="/Script/Engine.StaticMeshComponent'/Script/Engine.Default__StaticMeshActor:StaticMeshComponent0'" ExportPath="/Script/Engine.StaticMeshComponent'/Game/AdventureGame/Designer/Lvl_Adventure.Lvl_Adventure:PersistentLevel.Floor_168.StaticMeshComponent0'"
         End Object
         Begin Object Name="StaticMeshComponent0" ExportPath="/Script/Engine.StaticMeshComponent'/Game/AdventureGame/Designer/Lvl_Adventure.Lvl_Adventure:PersistentLevel.Floor_168.StaticMeshComponent0'"
            StaticMesh="/Script/Engine.StaticMesh'/Engine/MapTemplates/SM_Template_Map_Floor.SM_Template_Map_Floor'"
            bUseDefaultCollision=False
            StaticMeshDerivedDataKey="STATICMESH_34081786561B425A9523C94540EA599D_359a029847e84730ba516769d0f19427Simplygon_5_5_2156_18f808c3cf724e5a994f57de5c83cc4b_680318F3495BDBDEBE4C11B39CD497CE000000000100000001000000000000000000803F0000803F00000000000000000000344203030300000000"
            MaterialStreamingRelativeBoxes(0)=4294901760
```

To Start Room’s new blockout shapes, follow these steps:

- In Unreal Editor, remove all keys from **Start Room** so they don’t get lost in the new geometry.
- Click **Copy Full Snippet**.
- In Unreal Editor, ensure the viewport is the active panel (click anywhere in the viewport or **Outliner **and press **Esc**), and then press **Ctrl **+ **V.**If you moved any of the blockout rooms from the previous part of this tutorial, the new meshes may not appear in the right place. Move them as needed.
- Three floor pieces are covering the new recessed floor. In the viewport, click each and press **Delete**. [image: Sample Copy Paste Demo] Sample Copy Paste Demo

## Next Up

Your player character can pick up keys, but there’s no feedback to tell them what they have picked up so far. In the next section, you’ll create a heads-up display (HUD) for the player that shows them the keys in their inventory.

- [image: Player HUD] Player HUDCreate a simple heads-up-display (HUD) that updates when the player picks up an item. (-> designer-04-player-hud-in-unreal-engine)

- types
- blueprints
- collision
- attributes
- beginner

On this page

- Before You Begin (-> designer-03-open-doors-with-keys-in-unreal-engine)
- Add Color Options to the Door (-> designer-03-open-doors-with-keys-in-unreal-engine)
- Create Variables for Interacting with the Player and Keys (-> designer-03-open-doors-with-keys-in-unreal-engine)
- Build the Key Map Variable (-> designer-03-open-doors-with-keys-in-unreal-engine)
- Add Color-Changing Blueprint Logic (-> designer-03-open-doors-with-keys-in-unreal-engine)
- Test the Door Colors (-> designer-03-open-doors-with-keys-in-unreal-engine)
- Build Key-Based Door Logic (-> designer-03-open-doors-with-keys-in-unreal-engine)
- Create a Function That Checks for Keys (-> designer-03-open-doors-with-keys-in-unreal-engine)
- Lock and Unlock Doors With Keys (-> designer-03-open-doors-with-keys-in-unreal-engine)
- Add Comments to a Blueprint (-> designer-03-open-doors-with-keys-in-unreal-engine)
- Test Your Doors (-> designer-03-open-doors-with-keys-in-unreal-engine)
- Add Feedback with Debug Messages (-> designer-03-open-doors-with-keys-in-unreal-engine)
- Place Pickup Items (-> designer-03-open-doors-with-keys-in-unreal-engine)
- Try the Sample Level (-> designer-03-open-doors-with-keys-in-unreal-engine)
- Start Room’s Blockout (-> designer-03-open-doors-with-keys-in-unreal-engine)
- Next Up (-> designer-03-open-doors-with-keys-in-unreal-engine)

Related documents

Design a Puzzle Adventure

 [image: Design a Puzzle Adventure] (-> design-a-puzzle-adventure-game-in-unreal-engine)
