# Create Action Utilities With Geometry Scripting

https://dev.epicgames.com/documentation/en-us/unreal-engine/create-action-utilities-with-geometry-scripting--in-unreal-engine?application_version=5.9

> Build a fundamental understanding of using Geometry Scripting through Blueprints by creating action utilities.

[image: Create Action Utilities With Geometry Scripting]

Learn to use this **Beta** feature, but use caution when shipping with it.

When you're creating or editing geometry in a level, you might need to perform repetitive tasks. You can use action utilities to alleviate these types of repetitive tasks. You can also couple action utilities with **Geometry Scripting** to create efficient mesh editing workflows. You can create right-clicking actions that can help quickly change the style of meshes, recompute UVs, adjust pivot locations, and much more.

This guide shows you how to:

- Create scripted action utilities to help automate tasks.

- Setup core Geometry Scripting nodes.

- Use Geometry Scripting to create a utility for reducing triangle density in a mesh.

Although the guide focuses on simplifying (reducing triangle count) a mesh, you can use the script as a template to create more complex workflows.

## Prerequisite Knowledge

To understand and use the content of this page, make sure you:

- Have a fundamental understanding of Blueprints (-> introduction-to-blueprints-visual-scripting-in-unreal-engine).

- Are familiar with the introductory topic of Geometry Scripting (-> geometry-scripting-users-guide-in-unreal-engine), specifically the new object types introduced.

- Understand the use of scriptable action utilities (-> scripted-actions-in-unreal-engine) and how to contextually apply them.

You can use any project to follow along. To create proxy geometry for testing purposes, use one of the primitive shapes in **Modeling Mode**. To learn more about this editor mode, see Modeling Mode Overview (-> modeling-mode-in-unreal-engine).

## Enable Plugin

Geometry Scripting requires that the associated plugin is enabled.

To enable the plugin or verify that it is already enabled:

- In the **Menu Bar (-> level-editor-in-unreal-engine)**, click **Edit** > **Plugins**.

- In the search bar, type "geometry script". [image: Enable Geometry Scripting Plugin]

- Enable **Geometry Script** plugin, and click **Yes** in the dialog popup.

- Restart the engine.

## Create a Utility Class

To get started, you must create a Blueprint class to build your action utility. This guide uses **Actor Action Utility** to right-click actors in the **Level Editor** to perform a scripted action. You can also choose the **Asset Action Utility** to right-click an asset in the **Content Browser**.

To create the utility class:

- In the **Content Browser**, click **Add** or right-click, then click **Editor Utilities** > **Editor Utility Blueprint**.

- Search and click **Actor Action Utility**.

- In the **Content Browser**, give your new class a descriptive name, such as `ActorAU_Simplify`.

### Create a Function

After creating your utility class, the next step is to create a function. The goal of the script is to simplify a mesh to a given triangle count.

To create a function:

- Double-click your new Blueprint to open it in the **Blueprint Editor**.

- In the **My Blueprint** panel, click the plus icon in the **Functions** category and name the function **Simplify Mesh**. Double check **Call In Editor** is enabled in the **Details** panel.

- In the **Details** panel, click the plus **(+)** icon in the **Inputs** category to add a parameter.

- Make the parameter an integer and name it **Triangle Count**. This input parameter triggers a prompt when the script is activated, letting artists enter a target triangle count for the simplification method.

- Promote **Triangle Count** to a local variable by right-clicking its output pin and clicking **Promote to Local Variable**.

- Name the variable **Triangle Count**.

 [image: Creating a Simplify function]

### Restrict to a Specific Actor Class

If you compile and save your Blueprint, and then begin right-clicking actors in the level, you may notice the **Scripted Actor Actions** option appear in the context menu. The script is available for any actor class, which can cause confusion if the script is not designed for multiple classes. To control what actors artists can affect, you can restrict the scripted action to a specific class.

To adjust the supported class:

- In the top toolbar, click **Class Defaults**.

- On the **Supported Classes** bar, click the plus **(+)** icon.

- Search for and click **Static Mesh Actor**. [image: Class Defaults]

- **Compile** (Ctrl + Alt) and **Save** (Ctrl + S).

## Core Geometry Scripting Setup

Now that you have established your script with a function & supported class, you can begin implementing geometry scripting nodes.

A core step in setting up your script is to create a dynamic mesh for editing. The dynamic mesh acts as a temporary mesh that you can perform your operations before applying them to your static mesh. This temporary process avoids unnecessary geometry in the editor, helping save on computer processing.

### Dynamic Mesh Pool

To create a dynamic mesh, you must request it from a dynamic mesh pool. For asset actions, you can request a temporary mesh from the following:

- Creating a variable from the **Create a Dynamic Mesh Pool** node and then calling and returning the mesh after some steps with the **Request and Release Compute Mesh** node.

- Using the **Request and Release from Global Pool** to automatically request and release a temporary dynamic mesh from the pool.

For this example, the Request and Release from Global Pool node is used in the Create a Dynamic Mesh (-> create-action-utilities-with-geometry-scripting--in-unreal-engine) section on this page.

### Get Actor's Asset

Since Geometry Scripting operates on `UDynamicMesh`, the static mesh asset of the selected actor is needed. In addition, for each chosen actor, you must ensure any shared static mesh assets are operated on only once. Although this function executes based on a target count (avoiding duplicate operations), it will run unnecessary computations if the selected actors use the same static mesh asset.

To get a unique static mesh asset:

- Drag off the **Triangle Count Set's** execution pin and create a **Get Selected Actors** node.

- Drag off the **Return Value** pin, create a **For Each Loop** node, and connect the execution pins. These connected nodes iterate through the selected actors.

- Drag off the **Array Element** pin, create a **Cast to StaticMeshActor**, and connect the execution (**Loop Body**) pins. **Cast to Static Mesh Actor** ensures you are using static mesh actors only.

- Drag off the **As Static Mesh Actor** pin and create a **Get Static Mesh Component** node.

- Drag off the component pin and create a **Get Static Mesh** node.

- Drag off the Static Mesh pin and create an **Add Unique** node. This node appends each unique static mesh to an array.

- Connect the **Cast to StaticMeshActor's** execution pin to **Add Unique**.

- In the **My Blueprint** panel, click the plus **(+)** icon in the **Local Variables** category to create a new variable.

- Name the variable **SM_Array**.

- In the **Details** panel set the variable type to **Static Mesh** and the container type to **Array**.

- Drag the variable into the graph and click **Get SM_Array** to make it a getter. Connect the array pin to **Add Unique**.

 [image: Get Selected Actor]

With the new list of unique static mesh assets, the for loop is completed.

### Create a Dynamic Mesh

To convert to a dynamic mesh:

- In the **For Each Loop**, drag off the **Completed** execution pin, then create another **For Each Loop** node.

- Drag the **SM_Array** variable into the graph and make it a getter.

- Connect the array output to the **For Each Loop** node.

- Drag off the **Loop Body** execution pin and create a **Request and Release from Global Pool** node. This node pulls a dynamic mesh from the pool.

- With the dynamic mesh acquired, you can convert your static mesh. Drag off the **Mesh** pin, create a **Copy Mesh from Static Mesh** node, and connect the execution pins.

- Connect the **Array Element** output pin to the **From Static Mesh Asset** input pin.

 [image: Create Dynamic Mesh]

## Geometry Editing

With the dynamic mesh created, you can perform all your desired procedures and manipulations before applying them to your static mesh. In this script, you only use one node to perform mesh editing.

- Drag off the **Success** execution pin from **Copy Mesh from Static Mesh** and create a **Apply Simplify to TriangleCount** node. The simplify node attempts to reduce the triangle count to the given input value.

- Connect the **Dynamic Mesh** output pin to the **Target Mesh** input pin.

- Drag the **Triangle Count** variable into the graph and make it a getter.

- Connect the variable's output pin to the **Triangle Count** input pin.

- **Compile** (Ctrl + Alt) and **Save** (Ctrl + S).

 [image: Simplify Triangle Count Node]

To learn more about the various functions for selecting and editing a mesh, see Geometry Scripting Reference.

## Convert to Static Mesh

After finishing the edits, you must convert the dynamic mesh back to a static mesh to apply the modifications appropriately.

To convert back to a static mesh:

- Drag off **Apply Simplify to Triangle Count's** execution pin and add a **Copy Mesh to Static Mesh** node.

- Connect the **Target Mesh** output pin to the **From Dynamic Mesh** input pin.

- Connect the **Array Element** output pin from **For Each Loop** to the **To Static Mesh Asset** input pin. The changes you applied to the dynamic mesh are transferred to the selected static mesh.

- **Compile** (Ctrl + Alt) and **Save** (Ctrl + S).

 [image: Converting to Static Mesh]

## End Results

Begin Object Class=/Script/BlueprintGraph.K2Node_FunctionEntry Name="K2Node_FunctionEntry_3" ExportPath="/Script/BlueprintGraph.K2Node_FunctionEntry'/Game/GeometryScripting/ActorAU_Simplify.ActorAU_Simplify:Simplify Mesh.K2Node_FunctionEntry_3'"
MetaData=(ToolTip=NSLOCTEXT("", "4D6746D844632AC61B27CEB0D1766AC9", "Input goal triangle count"),CompactNodeTitle=NSLOCTEXT("", "FDA984354C3EFF9C28C56AAF663F0FA0", "Input goal triangle count"),bCallInEditor=True)
LocalVariables(0)=(VarName="DM_Pool",VarGuid=D8C926394459D364E666959C38DE25DD,VarType=(PinCategory="object",PinSubCategoryObject="/Script/CoreUObject.Class'/Script/GeometryFramework.DynamicMeshPool'"),FriendlyName="DM Pool",Category=NSLOCTEXT("KismetSchema", "Default", "Default"),PropertyFlags=5)
LocalVariables(1)=(VarName="SM_Array",VarGuid=D406D44F4390AC382945F19C80394E4C,VarType=(PinCategory="object",PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMesh'",ContainerType=Array),FriendlyName="SM Array",Category=NSLOCTEXT("KismetSchema", "Default", "Default"),PropertyFlags=5)
LocalVariables(2)=(VarName="SM_Unique",VarGuid=42C5EBB3457D00E0B738D5A3082CA3F7,VarType=(PinCategory="object",PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMesh'"),FriendlyName="SM Unique",Category=NSLOCTEXT("KismetSchema", "Default", "Default"),PropertyFlags=5)
ExtraFlags=201457664
FunctionReference=(MemberName="Simplify Mesh")
bIsEditable=True
NodePosX=-2816
NodePosY=96
NodeGuid=DE6855934AACF1EBD69EA182E2E0E0B2
CustomProperties Pin (PinId=CEFB9E9C43892ABCB129A3B0A03E07B3,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_25 43D2DCF6452148C196AF28AE964951EA,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=6155457440B5A2B53ACA9BBB43B8A497,PinName="Triangle Count",Direction="EGPD_Output",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_20 01EFEA744EF12AB2CC5054AE0736767E,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties UserDefinedPin (PinName="Triangle Count",PinType=(PinCategory="int"),DesiredPinDirection=EGPD_Output)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_25" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/GeometryScripting/ActorAU_Simplify.ActorAU_Simplify:Simplify Mesh.K2Node_CallFunction_25'"
FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/GeometryScriptingCore.GeometryScriptLibrary_SceneUtilityFunctions'",MemberName="CreateDynamicMeshPool")
NodePosX=-2624
NodePosY=96
NodeGuid=BA9B167A4479C10436AD9CB945C6A0C6
CustomProperties Pin (PinId=43D2DCF6452148C196AF28AE964951EA,PinName="execute",PinToolTip="\nExec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_FunctionEntry_3 CEFB9E9C43892ABCB129A3B0A03E07B3,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=C3065E1B4D8062326B2844A194A40FC6,PinName="then",PinToolTip="\nExec",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_26 A7E6E3084EC817988704119B28DD0E85,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=6F1C7C37446D69E05B88149B0D95EF73,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nGeometry Script Library Scene Utility Functions Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/GeometryScriptingCore.GeometryScriptLibrary_SceneUtilityFunctions'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/GeometryScriptingCore.Default__GeometryScriptLibrary_SceneUtilityFunctions",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=72F3295C4FF378372BD08E888E9C9A2E,PinName="ReturnValue",PinFriendlyName=INVTEXT("Dynamic Mesh Pool"),PinToolTip="Dynamic Mesh Pool\nDynamic Mesh Pool Object Reference\n\nCreate a new UDynamicMeshPool object.\nCaller needs to create a UProperty reference to the returned object, or it will be garbage-collected.",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/GeometryFramework.DynamicMeshPool'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_26 14B2DD1A4869E8E76BB67CA84F33B1BA,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_MacroInstance Name="K2Node_MacroInstance_4" ExportPath="/Script/BlueprintGraph.K2Node_MacroInstance'/Game/GeometryScripting/ActorAU_Simplify.ActorAU_Simplify:Simplify Mesh.K2Node_MacroInstance_4'"
MacroGraphReference=(MacroGraph="/Script/Engine.EdGraph'/Engine/EditorBlueprintResources/StandardMacros.StandardMacros:ForEachLoop'",GraphBlueprint="/Script/Engine.Blueprint'/Engine/EditorBlueprintResources/StandardMacros.StandardMacros'",GraphGuid=99DBFD5540A796041F72A5A9DA655026)
ResolvedWildcardType=(PinCategory="object",PinSubCategoryObject="/Script/CoreUObject.Class'/Script/CoreUObject.Object'",ContainerType=Array)
NodePosX=-1744
NodePosY=144
NodeGuid=EB857B56400DBB980B0F09BC2555CDEA
CustomProperties Pin (PinId=D5A22E2E49FA28A89007CE9499E1ADA8,PinName="Exec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_31 A6369F814B0997CFC86E5F904182ADFB,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=44BF76624C11DB747F1C1B9C2C39471A,PinName="Array",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/CoreUObject.Object'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_31 FC4ACC7845A57540A51FBF890E004482,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=B047C99241F194BD31C89D9586E2C827,PinName="LoopBody",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_DynamicCast_2 5DEAE70145F7CD315A6168B945D1F16B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=9956676741BEE3F37DDC0E9AF8D3329D,PinName="Array Element",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/CoreUObject.Object'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_DynamicCast_2 93FF01F64E7FBD00A92967AC074AB979,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=AD82C9104C27934BBA7C238216535588,PinName="Array Index",Direction="EGPD_Output",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=8F9BC25D4D8649563E469D9FDA8E3219,PinName="Completed",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_5 69D6E31B488992830414C58292C49166,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_27" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/GeometryScripting/ActorAU_Simplify.ActorAU_Simplify:Simplify Mesh.K2Node_CallFunction_27'"
bWantsEnumToExecExpansion=True
FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/GeometryScriptingCore.GeometryScriptLibrary_StaticMeshFunctions'",MemberName="CopyMeshFromStaticMesh")
NodePosX=-1776
NodePosY=528
NodeGuid=A0240A5544E45E50318D21A6677B720D
CustomProperties Pin (PinId=D68A2CF74DA0A14EEADCACB49068A3C7,PinName="Failure",PinToolTip="Failure\nExec",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=34738377430A5FC54EA97BA21DA9B1C6,PinName="Success",PinToolTip="Success\nExec",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_30 99CC5E09435BF1F995767487A513AA70,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=8B725AD8443D62F3601E28905083C773,PinName="execute",PinToolTip="\nExec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_0 A59C557C4F94A7D0D3B550A684C25EEB,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=80DA02514812361A6CF064AB1EAAF3F0,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nGeometry Script Library Static Mesh Functions Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/GeometryScriptingCore.GeometryScriptLibrary_StaticMeshFunctions'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/GeometryScriptingCore.Default__GeometryScriptLibrary_StaticMeshFunctions",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=D134C5F74EBAD12AE86A26B30CF3671A,PinName="FromStaticMeshAsset",PinToolTip="From Static Mesh Asset\nStatic Mesh Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMesh'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_22 C1FCF1474AF32DE46DF626A60F0DEC3C,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=9EB91EAC40967B208B3B9FB182D7C79D,PinName="ToDynamicMesh",PinToolTip="To Dynamic Mesh\nDynamic Mesh Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/GeometryFramework.DynamicMesh'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_0 7AC95BD5435150EC51FD09BA0B6F5457,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=2EBBC3D541C12345A2F122B77C5685CE,PinName="AssetOptions",PinToolTip="Asset Options\nGeometry Script Copy Mesh From Asset Options Structure",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/GeometryScriptingCore.GeometryScriptCopyMeshFromAssetOptions'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=6EFD77444746F61FCA2566907B7AC409,PinName="RequestedLOD",PinToolTip="Requested LOD\nGeometry Script Mesh Read LOD Structure",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/GeometryScriptingCore.GeometryScriptMeshReadLOD'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=B1A186044DF6566116DB77802ADD895D,PinName="Outcome",PinToolTip="Outcome\nEGeometryScriptOutcomePins Enum",Direction="EGPD_Output",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Enum'/Script/GeometryScriptingCore.EGeometryScriptOutcomePins'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="Failure",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=281EAC614CF5A689023D5EA05D70390C,PinName="Debug",PinToolTip="Debug\nGeometry Script Debug Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/GeometryScriptingCore.GeometryScriptDebug'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,AutogeneratedDefaultValue="None",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=423E56B847BEEE886B260BA4E500A677,PinName="ReturnValue",PinFriendlyName=INVTEXT("Dynamic Mesh"),PinToolTip="Dynamic Mesh\nDynamic Mesh Object Reference\n\nExtracts a Dynamic Mesh from a Static Mesh Asset, using section indices for the material IDs -- use GetSectionMaterialListFromStaticMesh to get the corresponding materials.\n\nNote that the LOD Index in RequestedLOD will be silently clamped to the available number of LODs (SourceModel or RenderData)",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/GeometryFramework.DynamicMesh'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_30 3DC2DDCE40542BA2C5B0408EBD5951EE,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_28" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/GeometryScripting/ActorAU_Simplify.ActorAU_Simplify:Simplify Mesh.K2Node_CallFunction_28'"
bWantsEnumToExecExpansion=True
FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/GeometryScriptingCore.GeometryScriptLibrary_StaticMeshFunctions'",MemberName="CopyMeshToStaticMesh")
NodePosX=-624
NodePosY=496
 NodeGuid=E530E0FB4B7BF377D7B7F195FDAF50E5
CustomProperties Pin (PinId=B3ED1CD3495A1D134D489DB1FA49FE8C,PinName="Failure",PinToolTip="Failure\nExec",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=18FB80234BF178D7A48FB7B9E5E72774,PinName="Success",PinToolTip="Success\nExec",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=EDC6DE484BDF1496DEEF6CBE555B4A73,PinName="execute",PinToolTip="\nExec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_30 E6730AB449D3DABB8E10CEB47E750CF0,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=4FAF275B488E9FB48C36528BDA27AC08,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nGeometry Script Library Static Mesh Functions Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/GeometryScriptingCore.GeometryScriptLibrary_StaticMeshFunctions'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/GeometryScriptingCore.Default__GeometryScriptLibrary_StaticMeshFunctions",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=21A28B1F461A646DE308CFB3A5016FF5,PinName="FromDynamicMesh",PinToolTip="From Dynamic Mesh\nDynamic Mesh Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/GeometryFramework.DynamicMesh'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_30 0951DCBE4A3EC477849595BD6F4F6740,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=1AD98F734A70377FD7386DA8E3BD4A4C,PinName="ToStaticMeshAsset",PinToolTip="To Static Mesh Asset\nStatic Mesh Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMesh'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_19 21E95ED44504C12591E95FBEF1EC2471,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=15E21B0646F02A31B8BC689CB05B9640,PinName="Options",PinToolTip="Options\nGeometry Script Copy Mesh To Asset Options Structure",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/GeometryScriptingCore.GeometryScriptCopyMeshToAssetOptions'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=35C23B074A22F32260E841BC4FC4BD98,PinName="TargetLOD",PinToolTip="Target LOD\nGeometry Script Mesh Write LOD Structure",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/GeometryScriptingCore.GeometryScriptMeshWriteLOD'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=80A82B3446DBE6F99FE65DAADD770AF9,PinName="Outcome",PinToolTip="Outcome\nEGeometryScriptOutcomePins Enum",Direction="EGPD_Output",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Enum'/Script/GeometryScriptingCore.EGeometryScriptOutcomePins'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="Failure",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=EE26628F4D67D7EDBAEBDFA25058C5D0,PinName="bUseSectionMaterials",PinToolTip="Use Section Materials\nBoolean\n\nWhether to assume Dynamic Mesh material IDs are section indices in the target Static Mesh. Should match the value passed to CopyMeshFromStaticMesh. Has no effect if replacing the asset materials.",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",AutogeneratedDefaultValue="true",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=854722EA4818E59A4C9104A01E2C58C8,PinName="Debug",PinToolTip="Debug\nGeometry Script Debug Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/GeometryScriptingCore.GeometryScriptDebug'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,AutogeneratedDefaultValue="None",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=81A748EF4961A73053D82CBBEC3C043C,PinName="ReturnValue",PinFriendlyName=INVTEXT("Dynamic Mesh"),PinToolTip="Dynamic Mesh\nDynamic Mesh Object Reference",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/GeometryFramework.DynamicMesh'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableSet Name="K2Node_VariableSet_26" ExportPath="/Script/BlueprintGraph.K2Node_VariableSet'/Game/GeometryScripting/ActorAU_Simplify.ActorAU_Simplify:Simplify Mesh.K2Node_VariableSet_26'"
VariableReference=(MemberScope="Simplify Mesh",MemberName="DM_Pool",MemberGuid=D8C926394459D364E666959C38DE25DD)
NodePosX=-2368
NodePosY=112
NodeGuid=8E5779034600860F40453BB06ED02D8A
CustomProperties Pin (PinId=A7E6E3084EC817988704119B28DD0E85,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_25 C3065E1B4D8062326B2844A194A40FC6,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=0CB28C3049B45DE3781A739B9A367428,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_27 35465B3044062105483BDCBD20D99790,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=14B2DD1A4869E8E76BB67CA84F33B1BA,PinName="DM_Pool",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/GeometryFramework.DynamicMeshPool'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_25 72F3295C4FF378372BD08E888E9C9A2E,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=EBAA13F54CA0CD45181E31AC5ACE1B52,PinName="Output_Get",PinToolTip="Retrieves the value of the variable, can use instead of a separate Get node",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/GeometryFramework.DynamicMeshPool'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_30" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/GeometryScripting/ActorAU_Simplify.ActorAU_Simplify:Simplify Mesh.K2Node_CallFunction_30'"
FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/GeometryScriptingCore.GeometryScriptLibrary_MeshSimplifyFunctions'",MemberName="ApplySimplifyToTriangleCount")
NodePosX=-1072
NodePosY=528
NodeGuid=56A27D4249063932AA4244805DF2813E
CustomProperties Pin (PinId=99CC5E09435BF1F995767487A513AA70,PinName="execute",PinToolTip="\nExec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_27 34738377430A5FC54EA97BA21DA9B1C6,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=E6730AB449D3DABB8E10CEB47E750CF0,PinName="then",PinToolTip="\nExec",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_28 EDC6DE484BDF1496DEEF6CBE555B4A73,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=0E59329C42FBA7A4079EEDA9D4E5FD97,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nGeometry Script Library Mesh Simplify Functions Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/GeometryScriptingCore.GeometryScriptLibrary_MeshSimplifyFunctions'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/GeometryScriptingCore.Default__GeometryScriptLibrary_MeshSimplifyFunctions",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=3DC2DDCE40542BA2C5B0408EBD5951EE,PinName="TargetMesh",PinToolTip="Target Mesh\nDynamic Mesh Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/GeometryFramework.DynamicMesh'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_27 423E56B847BEEE886B260BA4E500A677,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=57E9794949580AA67491BB892DB80012,PinName="TriangleCount",PinToolTip="Triangle Count\nInteger",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0",AutogeneratedDefaultValue="0",LinkedTo=(K2Node_VariableGet_15 8D010CB540388E3315EBB7BFAAE782A2,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=0F0BC9C04230D182BAC7EAAB064CF1C8,PinName="Options",PinToolTip="Options\nGeometry Script Simplify Mesh Options Structure",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/GeometryScriptingCore.GeometryScriptSimplifyMeshOptions'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=D05AD07043A9651A9024CA9BDF05BFDB,PinName="Debug",PinToolTip="Debug\nGeometry Script Debug Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/GeometryScriptingCore.GeometryScriptDebug'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,AutogeneratedDefaultValue="None",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=0951DCBE4A3EC477849595BD6F4F6740,PinName="ReturnValue",PinFriendlyName=INVTEXT("Target Mesh"),PinToolTip="Target Mesh\nDynamic Mesh Object Reference\n\nSimplifies the mesh until a target triangle count is reached. Behavior can be additionally controlled with the Options.",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/GeometryFramework.DynamicMesh'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_28 21A28B1F461A646DE308CFB3A5016FF5,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_31" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/GeometryScripting/ActorAU_Simplify.ActorAU_Simplify:Simplify Mesh.K2Node_CallFunction_31'"
FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/VREditor.VRScoutingInteractor'",MemberName="GetSelectedActors")
NodePosX=-1984
NodePosY=112
NodeGuid=082945AA4F0852D2D73744B26879C061
CustomProperties Pin (PinId=3CC9B804444638B3DBEA5A84A98B27F5,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_27 A024E85145952B2BE99301A028CF337C,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=A6369F814B0997CFC86E5F904182ADFB,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_4 D5A22E2E49FA28A89007CE9499E1ADA8,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=CC1869D84604589C846BB884614DFBB1,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/VREditor.VRScoutingInteractor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/VREditor.Default__VRScoutingInteractor",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=FC4ACC7845A57540A51FBF890E004482,PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Actor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_4 44BF76624C11DB747F1C1B9C2C39471A,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableSet Name="K2Node_VariableSet_27" ExportPath="/Script/BlueprintGraph.K2Node_VariableSet'/Game/GeometryScripting/ActorAU_Simplify.ActorAU_Simplify:Simplify Mesh.K2Node_VariableSet_27'"
VariableReference=(MemberName="Triangle Count",MemberGuid=C13AA7DF446F312D026A8E82743B246A,bSelfContext=True)
NodePosX=-2192
NodePosY=224
ErrorType=1
NodeGuid=97D7663F4E2A49B2951FBAA1509EF85D
CustomProperties Pin (PinId=35465B3044062105483BDCBD20D99790,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_26 0CB28C3049B45DE3781A739B9A367428,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=A024E85145952B2BE99301A028CF337C,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_31 3CC9B804444638B3DBEA5A84A98B27F5,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=BEB01FE04DDBD76CB4BE2489CE0A97FB,PinName="Triangle Count",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0",AutogeneratedDefaultValue="0",LinkedTo=(K2Node_Knot_20 D231422A4B99A22AF1BFADB2E7C124D4,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=2219279E40ED23FCE90FDFAE5AC181B8,PinName="Output_Get",PinToolTip="Retrieves the value of the variable, can use instead of a separate Get node",Direction="EGPD_Output",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0",AutogeneratedDefaultValue="0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=BC48A03346779124170FBEB2B409CAC9,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/GeometryScripting/ActorAU_Simplify.ActorAU_Simplify_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_15" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/GeometryScripting/ActorAU_Simplify.ActorAU_Simplify:Simplify Mesh.K2Node_VariableGet_15'"
VariableReference=(MemberName="Triangle Count",MemberGuid=C13AA7DF446F312D026A8E82743B246A,bSelfContext=True)
NodePosX=-1264
NodePosY=480
NodeGuid=9783B36A4EC8EBB443B1A290FC5FBE1A
CustomProperties Pin (PinId=8D010CB540388E3315EBB7BFAAE782A2,PinName="Triangle Count",Direction="EGPD_Output",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0",AutogeneratedDefaultValue="0",LinkedTo=(K2Node_CallFunction_30 57E9794949580AA67491BB892DB80012,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=C6FF03564EE7C594AAF7F2A21FA9702E,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/GeometryScripting/ActorAU_Simplify.ActorAU_Simplify_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_DynamicCast Name="K2Node_DynamicCast_2" ExportPath="/Script/BlueprintGraph.K2Node_DynamicCast'/Game/GeometryScripting/ActorAU_Simplify.ActorAU_Simplify:Simplify Mesh.K2Node_DynamicCast_2'"
TargetType="/Script/CoreUObject.Class'/Script/Engine.StaticMeshActor'"
NodePosX=-1215
NodePosY=86
NodeGuid=F8AB201A4C22CE2D2A1716864BD7E0AF
CustomProperties Pin (PinId=5DEAE70145F7CD315A6168B945D1F16B,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_4 B047C99241F194BD31C89D9586E2C827,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=3FCD7E374B09C2CD20015BB1300B32A8,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallArrayFunction_2 9AD3BFC840515F5D0EA2B691E377845D,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=396BED1E429A94BA45A1758901AADCAB,PinName="CastFailed",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=93FF01F64E7FBD00A92967AC074AB979,PinName="Object",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/CoreUObject.Object'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_4 9956676741BEE3F37DDC0E9AF8D3329D,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=A52F36D2459331F14AB359BBF7E188A9,PinName="AsStatic Mesh Actor",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMeshActor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_16 643B229B409D8AC2B95EBE81423572E6,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=6475807040CF46CBCEEE58916B78D335,PinName="bSuccess",Direction="EGPD_Output",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_16" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/GeometryScripting/ActorAU_Simplify.ActorAU_Simplify:Simplify Mesh.K2Node_VariableGet_16'"
VariableReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.StaticMeshActor'",MemberName="StaticMeshComponent")
SelfContextInfo=NotSelfContext
NodePosX=-1231
NodePosY=246
NodeGuid=7574A8DC40F093E7E0029A9827B89498
CustomProperties Pin (PinId=614A61084A049FD4FABFD2A799DD9C19,PinName="StaticMeshComponent",PinFriendlyName=NSLOCTEXT("UObjectDisplayNames", "StaticMeshActor:StaticMeshComponent", "Static Mesh Component"),Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMeshComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=True,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_17 9DCB20864E441EF8A7F3129047956D88,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=643B229B409D8AC2B95EBE81423572E6,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMeshActor'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_DynamicCast_2 A52F36D2459331F14AB359BBF7E188A9,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_17" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/GeometryScripting/ActorAU_Simplify.ActorAU_Simplify:Simplify Mesh.K2Node_VariableGet_17'"
VariableReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.StaticMeshComponent'",MemberName="StaticMesh")
SelfContextInfo=NotSelfContext
NodePosX=-1199
NodePosY=326
NodeGuid=1C14C49B49FA65DEE4F486ABAEF46131
CustomProperties Pin (PinId=BAAADB7541CB6C8E966C759D18F06796,PinName="StaticMesh",PinFriendlyName=NSLOCTEXT("UObjectDisplayNames", "StaticMeshComponent:StaticMesh", "Static Mesh"),Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMesh'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=True,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallArrayFunction_2 D5CC070B4BB0C4CA8967DBB032FABEE9,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=9DCB20864E441EF8A7F3129047956D88,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMeshComponent'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_16 614A61084A049FD4FABFD2A799DD9C19,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallArrayFunction Name="K2Node_CallArrayFunction_2" ExportPath="/Script/BlueprintGraph.K2Node_CallArrayFunction'/Game/GeometryScripting/ActorAU_Simplify.ActorAU_Simplify:Simplify Mesh.K2Node_CallArrayFunction_2'"
FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetArrayLibrary'",MemberName="Array_AddUnique")
NodePosX=-879
NodePosY=102
NodeGuid=300914FA4C9834A965762A977E3C38E0
CustomProperties Pin (PinId=9AD3BFC840515F5D0EA2B691E377845D,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_DynamicCast_2 3FCD7E374B09C2CD20015BB1300B32A8,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=1581682446A7E309707F9EA02095D220,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=5A144A7844C1D855EA3E5C9CD48F2E01,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.KismetArrayLibrary'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__KismetArrayLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=5329E3A34FDCE0DFA05D5AA7224D2AAE,PinName="TargetArray",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMesh'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=True,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_18 B4DAD5564BB526DEB2C6D4A454B1C6CA,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=D5CC070B4BB0C4CA8967DBB032FABEE9,PinName="NewItem",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMesh'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=True,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_17 BAAADB7541CB6C8E966C759D18F06796,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=B38F14684698446DC6FE008B2470F89D,PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0",AutogeneratedDefaultValue="0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_MacroInstance Name="K2Node_MacroInstance_5" ExportPath="/Script/BlueprintGraph.K2Node_MacroInstance'/Game/GeometryScripting/ActorAU_Simplify.ActorAU_Simplify:Simplify Mesh.K2Node_MacroInstance_5'"
MacroGraphReference=(MacroGraph="/Script/Engine.EdGraph'/Engine/EditorBlueprintResources/StandardMacros.StandardMacros:ForEachLoop'",GraphBlueprint="/Script/Engine.Blueprint'/Engine/EditorBlueprintResources/StandardMacros.StandardMacros'",GraphGuid=99DBFD5540A796041F72A5A9DA655026)
ResolvedWildcardType=(PinCategory="object",PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMesh'",ContainerType=Array)
NodePosX=-2464
NodePosY=448
NodeGuid=6EC67A934B6B256417345CA7FE9D6CCB
CustomProperties Pin (PinId=69D6E31B488992830414C58292C49166,PinName="Exec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_4 8F9BC25D4D8649563E469D9FDA8E3219,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=A1D5ABB740345090A1AB46B1ADCD06BD,PinName="Array",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMesh'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_19 5EFACDA54673966A0BAAF68B551ED096,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=D7C902BC4C9062871D1715AB87DCE6BB,PinName="LoopBody",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_0 9F851C9D487CAB490A47F080A5AA6337,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=DA256ADB457AE8EC460D14A1CBCD0BE0,PinName="Array Element",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMesh'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_22 2C6838AB48920A9AB3C0BDB1CB5666AF,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=9136E0E74EDCC764726922BF6B4BE8B5,PinName="Array Index",Direction="EGPD_Output",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=1A033E41454E76ADB4577885093D7FF7,PinName="Completed",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_18" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/GeometryScripting/ActorAU_Simplify.ActorAU_Simplify:Simplify Mesh.K2Node_VariableGet_18'"
VariableReference=(MemberScope="Simplify Mesh",MemberName="SM_Array",MemberGuid=D406D44F4390AC382945F19C80394E4C)
NodePosX=-927
NodePosY=294
NodeGuid=00BF873347AF3272779D1BA2A9B386EE
CustomProperties Pin (PinId=B4DAD5564BB526DEB2C6D4A454B1C6CA,PinName="SM_Array",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMesh'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallArrayFunction_2 5329E3A34FDCE0DFA05D5AA7224D2AAE,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_19" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/GeometryScripting/ActorAU_Simplify.ActorAU_Simplify:Simplify Mesh.K2Node_VariableGet_19'"
VariableReference=(MemberScope="Simplify Mesh",MemberName="SM_Array",MemberGuid=D406D44F4390AC382945F19C80394E4C)
NodePosX=-2624
NodePosY=384
NodeGuid=536B29C94F06EBB324F3129C9AC34668
CustomProperties Pin (PinId=5EFACDA54673966A0BAAF68B551ED096,PinName="SM_Array",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMesh'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_5 A1D5ABB740345090A1AB46B1ADCD06BD,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_Knot Name="K2Node_Knot_19" ExportPath="/Script/BlueprintGraph.K2Node_Knot'/Game/GeometryScripting/ActorAU_Simplify.ActorAU_Simplify:Simplify Mesh.K2Node_Knot_19'"
NodePosX=-800
NodePosY=832
NodeGuid=B2C77A374802AA4CBE276C83D66B2A4C
CustomProperties Pin (PinId=85DAB4C048A2A1906A52FDACCC21A30E,PinName="InputPin",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMesh'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_21 A6E327D44C6EAD85516E51BFE1C93B45,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=21E95ED44504C12591E95FBEF1EC2471,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMesh'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_28 1AD98F734A70377FD7386DA8E3BD4A4C,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_Knot Name="K2Node_Knot_20" ExportPath="/Script/BlueprintGraph.K2Node_Knot'/Game/GeometryScripting/ActorAU_Simplify.ActorAU_Simplify:Simplify Mesh.K2Node_Knot_20'"
NodePosX=-2656
NodePosY=272
NodeGuid=5FDA79AD4BB3FE46A6EDC788D6F628AD
CustomProperties Pin (PinId=01EFEA744EF12AB2CC5054AE0736767E,PinName="InputPin",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_FunctionEntry_3 6155457440B5A2B53ACA9BBB43B8A497,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=D231422A4B99A22AF1BFADB2E7C124D4,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_27 BEB01FE04DDBD76CB4BE2489CE0A97FB,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_Knot Name="K2Node_Knot_21" ExportPath="/Script/BlueprintGraph.K2Node_Knot'/Game/GeometryScripting/ActorAU_Simplify.ActorAU_Simplify:Simplify Mesh.K2Node_Knot_21'"
NodePosX=-2080
NodePosY=816
NodeGuid=0A05928D49A0C29650EB7D80AD1C827F
CustomProperties Pin (PinId=36CADFD04304A7A1BBC3809F0BE59DA0,PinName="InputPin",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMesh'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_22 C1FCF1474AF32DE46DF626A60F0DEC3C,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=A6E327D44C6EAD85516E51BFE1C93B45,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMesh'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_19 85DAB4C048A2A1906A52FDACCC21A30E,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_6" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/GeometryScripting/ActorAU_Simplify.ActorAU_Simplify:Simplify Mesh.EdGraphNode_Comment_6'"
CommentColor=(R=0.950346,G=0.210375,B=1.000000,A=1.000000)
bCommentBubbleVisible_InDetailsPanel=False
NodePosX=-656
NodePosY=416
NodeHeight=384
bCommentBubblePinned=False
bCommentBubbleVisible=False
NodeComment="Core End - Converting back to Static Mesh "
NodeGuid=0646DB4A41C0F54CD355C09A57238354
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_7" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/GeometryScripting/ActorAU_Simplify.ActorAU_Simplify:Simplify Mesh.EdGraphNode_Comment_7'"
CommentColor=(R=0.207115,G=1.000000,B=0.588831,A=1.000000)
bCommentBubbleVisible_InDetailsPanel=False
NodePosX=-1296
NodePosY=416
NodeWidth=608
NodeHeight=384
bCommentBubblePinned=False
bCommentBubbleVisible=False
NodeComment="Specific Geometry Scripting Editing"
NodeGuid=17D7AC69467B4A30223FC896DC3B3051
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_2" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/GeometryScripting/ActorAU_Simplify.ActorAU_Simplify:Simplify Mesh.EdGraphNode_Comment_2'"
CommentColor=(R=1.000000,G=0.408526,B=0.511890,A=1.000000)
bCommentBubbleVisible_InDetailsPanel=False
NodePosX=-1296
NodePosY=16
NodeWidth=672
NodeHeight=384
bCommentBubblePinned=False
bCommentBubbleVisible=False
NodeComment="Creating Unique Static Mesh Array"
NodeGuid=D9CDFB69415FFB67BB6B9EAF8240AB17
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_3" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/GeometryScripting/ActorAU_Simplify.ActorAU_Simplify:Simplify Mesh.EdGraphNode_Comment_3'"
bCommentBubbleVisible_InDetailsPanel=False
NodePosX=-2639
NodePosY=12
NodeWidth=1312
NodeHeight=784
bCommentBubblePinned=False
bCommentBubbleVisible=False
NodeComment="Core Geometry Scripting Setup - Converting to Dynamic Mesh"
NodeGuid=F8AC64A84F3EBEF44DFE50BE040499B3
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_Knot Name="K2Node_Knot_22" ExportPath="/Script/BlueprintGraph.K2Node_Knot'/Game/GeometryScripting/ActorAU_Simplify.ActorAU_Simplify:Simplify Mesh.K2Node_Knot_22'"
NodePosX=-2160
NodePosY=592
NodeGuid=65EFCE8842DEAC9737BA588B20A9F0F2
CustomProperties Pin (PinId=2C6838AB48920A9AB3C0BDB1CB5666AF,PinName="InputPin",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMesh'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_5 DA256ADB457AE8EC460D14A1CBCD0BE0,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=C1FCF1474AF32DE46DF626A60F0DEC3C,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.StaticMesh'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_27 D134C5F74EBAD12AE86A26B30CF3671A,K2Node_Knot_21 36CADFD04304A7A1BBC3809F0BE59DA0,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_MacroInstance Name="K2Node_MacroInstance_0" ExportPath="/Script/BlueprintGraph.K2Node_MacroInstance'/Game/GeometryScripting/ActorAU_Simplify.ActorAU_Simplify:Simplify Mesh.K2Node_MacroInstance_0'"
MacroGraphReference=(MacroGraph="/Script/Engine.EdGraph'/GeometryScripting/GeometryScriptMacroLibrary.GeometryScriptMacroLibrary:RequestAndReleaseComputeMeshFromGlobalPool'",GraphBlueprint="/Script/Engine.Blueprint'/GeometryScripting/GeometryScriptMacroLibrary.GeometryScriptMacroLibrary'",GraphGuid=56880B4447EDDD6C51D5CD9F5826D748)
NodePosX=-2224
NodePosY=448
NodeGuid=C5E4F67F4C6C47ACAF7813B4001CD022
CustomProperties Pin (PinId=9F851C9D487CAB490A47F080A5AA6337,PinName="Exec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_5 D7C902BC4C9062871D1715AB87DCE6BB,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=A59C557C4F94A7D0D3B550A684C25EEB,PinName="With Mesh",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_27 8B725AD8443D62F3601E28905083C773,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=7AC95BD5435150EC51FD09BA0B6F5457,PinName="Mesh",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/GeometryFramework.DynamicMesh'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_27 9EB91EAC40967B208B3B9FB182D7C79D,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties Pin (PinId=34F9C2584524D3CBD952EB90821DC09B,PinName="After Release",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object

With your Blueprint saved and compiled, the **Scripted Asset Actions** > **Simplify Mesh** option should appear in the context menu when you right-click a static mesh in the level. Clicking the **Simplify** script reduces the number of triangles in a mesh until it reaches the target count. This script creates a workflow for applying edits to multiple assets and updating your level quickly.

## On Your Own

You can continue to build upon this script or use it as a foundation for another function.

Instead of copying all the nodes in a new function, you can turn the setup and end nodes into macros (-> making-macros-in-unreal-engine). Make sure to recreate the local variables properly.

Using what you learned, try making the following adjustments:

- Apply deformation to the mesh using the **Apply Bend Warp to Mesh** node.

- Flip the normals of the mesh using the **Flip Normals** node.

- Convert the script to an **Asset Action Utility** class. Use the **Get Selected Assets** node instead of **Get Selected Actor**.

To continue learning about action utilities, see 33 Scripted Action Utilities on the Epic Developer Community portal.

- animation
- landscape
- modeling
- beta
- geometry scripting
- action utility

On this page

- Prerequisite Knowledge (-> create-action-utilities-with-geometry-scripting--in-unreal-engine)
- Enable Plugin (-> create-action-utilities-with-geometry-scripting--in-unreal-engine)
- Create a Utility Class (-> create-action-utilities-with-geometry-scripting--in-unreal-engine)
- Create a Function (-> create-action-utilities-with-geometry-scripting--in-unreal-engine)
- Restrict to a Specific Actor Class (-> create-action-utilities-with-geometry-scripting--in-unreal-engine)
- Core Geometry Scripting Setup (-> create-action-utilities-with-geometry-scripting--in-unreal-engine)
- Dynamic Mesh Pool (-> create-action-utilities-with-geometry-scripting--in-unreal-engine)
- Get Actor's Asset (-> create-action-utilities-with-geometry-scripting--in-unreal-engine)
- Create a Dynamic Mesh (-> create-action-utilities-with-geometry-scripting--in-unreal-engine)
- Geometry Editing (-> create-action-utilities-with-geometry-scripting--in-unreal-engine)
- Convert to Static Mesh (-> create-action-utilities-with-geometry-scripting--in-unreal-engine)
- End Results (-> create-action-utilities-with-geometry-scripting--in-unreal-engine)
- On Your Own (-> create-action-utilities-with-geometry-scripting--in-unreal-engine)
