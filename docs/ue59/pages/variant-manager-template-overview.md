# Variant Manager Template Overview

https://dev.epicgames.com/documentation/en-us/unreal-engine/variant-manager-template-overview?application_version=5.9

> What the Variant Manager is and how it works.

[image: Variant Manager Template Overview]

The **Variant Manager** is a specialized UI panel in the Unreal Editor that you can use to set up multiple different configurations of the actors in your level. Each of these configurations is referred to as a variant. The Variant Manager helps you to:

- Set up these **variants**.
- Organize the variants into categories called **variant sets**.
- Define what actor properties each variant should control, or what functions the variants should invoke.
- Activate or "switch on" different variants in the Unreal Editor.

To use the Variant Manager, you must have the **Editor > Variant Manager** plugin enabled for your project.

If you start from a template in either the **Architecture, Engineering, and Construction** or **Automotive, Manufacturing, and Product Design** category, this plugin may be enabled for you by default.

- To enable the Variant Manager, use **Edit > Plugins** to open the Plugins browser. Search for the Variant Manager plugin and check its box to enable it.[image: The Variant Manager plugin]
- Right-click in the **Content Drawer** and select **Level Variant Set** from the **Miscellaneous** list.[image: Level Variant Sets]
- When this is complete, you will have something that looks like this:[image: Level Variant Set Asset]
- Click the **+ Variant Set** button and name the new set:[image: Variant Set]
- After you create the variant set, click the **Add (+)** button next to its name to create a variant.[image: Adding Variant]
- Right-click on the variant to rename it. Select **Set from viewport** in the menu to show it from the viewport.[image: Set from Viewport]

## The Variant Manager Panel

The Variant Manager UI is an editor for a specialized type of asset called a **level variant sets asset**. Every time you double-click a level variant sets asset, the Variant Manager panel opens up for you to set up and work with the variants managed by that asset.

[image: The Variant Manager UI]

The UI of the Variant Manager is divided into four columns.

- **Variants** panel: The panel on the left lists all the variants and variant sets being managed by this level variant sets asset. For example, the image above shows two variant sets: **Plant** and **Folder**. The Plant variant set contain several variants; visible in the image are variants named **Blue** and **Strip**.
- **Actors** panel: Whenever you have a variant selected in the leftmost panel, the second panel (**Actors**) lists all of the actors that are bound to that variant. In the image above, the **Plant > Blue** variant is selected, so the actors list includes the static mesh actors for all the painted parts of the plant.When you create a binding between an Actor and a Variant, you create a link between them. Activating the Variant causes the bound Actor to respond in a certain way: either by changing the value of a data property, or by calling a function.
- **Properties** panel: When you select one or more bound Actors in the second column, the third panel (**Properties**) shows you what properties of those actors are captured in this variant. In the image above, the variant captures the **Static Mesh** property.To capture a property of an Actor means to store a desired value for that property in the Variant.
- **Values** panel: The rightmost panel (**Values**) shows the value saved in the variant for each property visible in the **Properties** panel.
- **Dependencies** panel: Finally, the bottom panel (**Dependencies**) shows any constraints that are part of the selected variant. A dependency is a constraint that switches on other variants when the current variant is enabled. The current variant does not have any dependencies but does show that it is a part of the **Default** variant in the **Packages** variant set.

### Setting Up Variants

The overall workflow for setting up scene variants typically follows the columns described above from left to right.

- Decide on what variants you'll need in your scene, and how to categorize your variants into variant sets. Based on those decisions, you use the controls offered by the left-hand column to set up the Variant Manager with these same variant sets and variants. By right-clicking and selecting options from the context menu, you can:Edit existing variants.
- Add new variants and variant sets.
- Move variants from one set to another.
- Assign thumbnail images to variants and variant sets. These thumbnail images can later be used as part of a user interface like the one seen in the Product Configurator (-> product-configurator-template-in-unreal-engine) template.
- Add any necessary dependencies.

- For each of the variants you created above, you can bind one or more actors. Bind a new actor to a variant by clicking the **Add (+)** button in the header of the Actors column. You can also drag actors from the World Outliner panel on to the list of bound actors, or on to the variant in the left-hand column. It is also possible to bind and unbind actors by right-clicking the list in the Actors panel and using the context menu.
- For each bound actor, choose which properties you want the Variant Manager to change.Every time you bind a new actor, the Variant Manager automatically opens a window that invites you to choose which properties you want to capture. For example:[image: Choose properties to capture]You can capture any property that is exposed to Blueprints. If the actor you've bound is a Blueprint actor, this includes any variables that you've created in the class and that are marked as instance editable.Capture additional properties at any time by clicking the **Add (+)** button in the header of the **Properties** panel, or right-clicking a bound actor at any time to capture additional properties. Right-click a captured property to remove it from the list.[image: Adding properties]You can also set up the Variant Manager to call functions exposed by the bound actor when the variant activates. For details on this, see Calling Functions on Variant Activation (-> calling-functions-on-variant-activation).
- For each captured property, you set the value that you want the Variant Manager to apply when the variant activates. You can set captured values at any time by editing them directly in the Values column of the Variant Manager. Alternatively, you can modify the property values elsewhere in the Unreal Editor UI, then update the saved value to match the property's current value by doing any of the following:Click the **Record the current value** icon next to the property value.[image: Record the Current Value icon]
- Right-click the property or its captured value and choose **Record Current Value** from the context menu.[image: Record Current Value]

When you update a captured value directly in the **Values** panel for a variant that you have already switched on, you won't see your change reflected immediately in the level Viewport. To see the effect of your change, switch on the variant again. Or, right-click either the property or its captured value, then choose **Apply recorded value** from the context menu.

[image: Apply Recorded Value]

If you use Datasmith to import scenes from third-party applications that support setting up variants, including Autodesk VRED and 3DExcite Deltagen, and you have variants already set up in your source scenes, Datasmith will automatically set up a **Level Variant Sets** asset and actor for you. All you'll have to do is create the Blueprint logic or UMG widgets in your project that can switch your variants on in response to user interaction.

### Automatic Binding and Capturing

As an alternative to binding actor properties one-by-one using the approach outlined in the previous section, you can bind actors and capture their properties automatically as you modify them in the level.

To toggle automatic binding and capturing, use the toggle button at the top of the **Variants** column on the left of the Variant Manager UI.

|  |  |
| --- | --- |
| [image: Auto-capture disabled] Auto-capture deactivated | [image: Auto-capture enabled] Auto-capture activated |

While automatic capturing is active, the Variant Manager listens for every change that you make to the actors in your level. Whenever you change a property that the Variant Manager can capture, it automatically captures the new value you have set for the modified property and saves it in the variant that you currently have selected. If the actor you modified was not already bound to the selected variant, it is bound automatically.

Automatic binding and capturing can make it faster and easier to set up your variants. Typically, you use it as follows:

- Click the variant you want to modify in the left-hand **Variants** column to select it. Or, double-click the variant if you want to switch on its current state before you make changes.
- Toggle the auto-capture button to its activated state.
- Modify the actors that you want to bind to the variant you have selected. As you work, you should see the Variant Manager automatically bind every actor you modify and capture every new property value you set.
- When your variant is set up the way you want it, you can either:Continue capturing properties for another variant by clicking or double-clicking the new variant in the left-hand **Variants** column.
- Stop capturing changes by toggling the auto-capture button back to its disabled state.

Be aware when you activate auto-capture mode. If you forget that you have it activated while you work in your Level, you may accidentally record undesired changes to the currently selected Variant.

### Activating Variants in the Editor

Whenever you activate a variant, either at runtime or in the Unreal Editor, the Variant Manager iterates through the list of actors that you've bound to that variant. For each of these actors, it sets all captured properties to the values stored in the variant. It also calls any functions that you've configured the bound actor to call.

You can activate variants in the Unreal Editor when you have the Variant Manager UI open. Use either of the following methods:

- Double-click the variant you want to activate in the leftmost column.
- Right-click the variant you want to activate in the leftmost column, and choose **Switch on** from the context menu.[image: Switch On]

The Variant Manager uses a small status indicator to show which variants are switched on: that is, ones whose captured properties all match the values that are currently applied to the bound actors in the level. This happens when you switch on the variant, and it also can happen if you set the same property values manually in the level.

|  |  |
| --- | --- |
| [image: Deactivated Variant] A deactivated variant | [image: Activated Variant] An activated variant |

For details on activating variants at runtime, see Runtime Blueprint API (-> variant-manager-template-overview) below.

### Setting Up Dependencies

Once the variants and variant sets are established, you can create optional dependencies for any Variant. A dependency is a constraint you can add to a variant that switches on other dependent variants when it is enabled, such as creating a Default variant that will set other variants back to their initial setting:

[image: Example of Dependencies]

Here is how to setup new dependencies for your Variants:

[image: Steps to create a dependency]

- Select one of your variants and click the **Add (+)** button in the Dependencies panel to create a new dependency.
- A dependency needs to know the variant set and the variant that you want to enable when your current selection switches on. Click the drop-down box under **Variant Set** and select the variant set that contains the variant you want to add to the dependency.
- Select the variant to enable from the **Variant** drop-down.

The variant chosen for a dependency does not need to contain any bound actors

[image: Dependencies example]

Here we can see dependencies used to create a variety of package setting options. Notice that the variant shown contains only dependencies and does not have any actor bindings.

## About the Level Variant Sets Asset and Actor

Each level variant sets asset stores information about actors that live in a specific level. While you have that level open in the Unreal Editor, you can use the Variant Manager UI to activate different Variants. As you do, the bound actors in the Unreal Editor immediately update the values of their captured properties.

If you only need to activate variants in the Unreal Editor, but not at runtime, then the level variant sets asset is the only thing you need to set up.

However, variants are often most useful at runtime in a packaged project. For example, suppose you have a 150% BOM model of a car in an Unreal Engine level, with multiple variants that represent different trims. It may be useful to be able to switch between these different trim options in the editor. But if your goal is to create a car configurator that lets end users choose the trim they want, you'll also need to make your variants controllable by a viewer at runtime.

To do this, you'll need to drag your level variant sets asset into your level. This creates a new level variant sets actor in the level that links to the asset you used to create it. This special kind of actor offers a Blueprint interface that you can use to interact with your variants from Blueprint gameplay logic and UMG interfaces that you create in your project. For more information on using the Variant Manager to create a configurator, please see the Product Configurator (-> product-configurator-template-in-unreal-engine) template documentation.

Each level variant sets asset works only with the actors in a single Level. If you open a different level, the Variant Manager UI will no longer affect the objects in that new level.

If you need to control actors in multiple different levels, you'll need to create a separate level variant sets asset for each level, and set each one up separately. Or, if you want them to control the same actors in the same ways, you can put all the actors that you need the level variants sets asset to control into a single sublevel, and add that sublevel to both of the levels that need those variants.

## Runtime Blueprint API

The level variant sets actor offers a Blueprint API that you can use to interact with your variants and variant sets at runtime. This API supports two main uses:

- Switching on variants that you identify by name or by index. See Activating a Variant (-> variant-manager-template-overview) below.
- Querying data about the variant sets and variants that you have configured, including their display names. See Accessing Variant Data (-> variant-manager-template-overview) below.

### Activating a Variant

You can switch on any variant in your level variant set if you know either the name or the index value of both the variant and its parent variant set.

The simplest way to switch on a variant is to drag right from a reference to the level variant set actor, find the **Level Variant Sets** category, and choose either **Switch on Variant by Index** or **Switch on Variant by Name**.

[image: Switch on a Variant by index or by name]

### Accessing Variant Data

You can access the structure of all variant sets and variants that you've configured in the Variant Manager.

- Drag right from a reference to the level variant set actor, find the **Level Variant Sets** category, and choose **Get Level Variant Sets**.[image: Get Level Variant Sets]
- Once you have a reference to the level variant sets asset, drag right from the **Return Value** port and find the **Level Variant Sets** category to access the variant sets set up in the asset.[image: Access the Variant Sets]Use the **Get Variant Set** or **Get Variant Set By Name** node to retrieve a variant set from its index or its name. **Get Num Variant Sets** returns the total number of variant sets configured in the level variant sets asset. You can combine this with the **Get Variant Set** node to loop through all the variant sets:[image: Iterate through all configured Variant Sets]
- Once you have retrieved a reference to a variant set, drag right from its **Return Value** port and find the **Variant Set category** to work with the data the variant set contains.[image: Access data in the Variant Set]You can use the **Get Display Text** node to retrieve the name you set for the variant set in the Variant Manager UI.You can also access the variants within the variant set using a set of nodes similar to the ones you used to access the variant sets themselves. Use the **Get Variant** or **Get Variant By Name** node to retrieve a variant from its index or its name. **Get Num Variants **returns the total number of variants configured in this variant set. You can combine this with the **Get Variant** node to loop through all the variants in the variant set, just as shown above for looping through variant sets.[image: Iterate through all Variants configured in the Variant Set]
- Once you have retrieved a reference to a variant, drag right from its **Return Value** port and find the **Variant** category to get its display name, switch it on, and access its bound actors.[image: Access data in the variant]

This sample Blueprint graph uses the approach outlined above to iterate through all configured variant sets and variants. It prints the name of each variant set and each variant in order to the screen and the output log.

 Blueprint

 accessallvariantdata

Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_0"

 VariableReference=(MemberName="LevelVariantSetsActor",MemberGuid=52B0394D42785F96B24A3E91547CD032,bSelfContext=True)

 NodePosX=2640

 NodePosY=784

 NodeGuid=DE7352A9462BF2FBD4AA3DBB3DD49825

 CustomProperties Pin (PinId=38E93D804BC6884C376E8C8EF6CDCCD8,PinName="LevelVariantSetsActor",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/VariantManagerContent.LevelVariantSetsActor"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_0 16FD036B4D8BD417BE73C99219BB3DB4,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=6770B63E452E86A53F725895DEB10A06,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/Engine.BlueprintGeneratedClass'"/Game/VariantManager.VariantManager_C"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

End Object

Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_0"

 FunctionReference=(MemberParent=/Script/CoreUObject.Class'"/Script/VariantManagerContent.LevelVariantSetsActor"',MemberName="GetLevelVariantSets")

 NodePosX=2864

 NodePosY=656

 NodeGuid=89904E6A4FD6624B0C6B4995886074BA

 CustomProperties Pin (PinId=3A822FE0415F805F99F1349F674B317C,PinName="execute",PinToolTip="\nExec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CustomEvent_0 6F16F9EA4EF5E12CE32B789686874BFB,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=3CC60D03446A92F2DD7080A9F308D9F4,PinName="then",PinToolTip="\nExec",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_3 D582D24F4CE75F18600111BAD7CE0D78,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=16FD036B4D8BD417BE73C99219BB3DB4,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nLevel Variant Sets Actor Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/VariantManagerContent.LevelVariantSetsActor"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_0 38E93D804BC6884C376E8C8EF6CDCCD8,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=9425C45E427D368E8635478E1104C2DE,PinName="bLoad",PinToolTip="Load\nBoolean",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="false",AutogeneratedDefaultValue="false",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=17D4CE2E418F6744B7ECB9B27E033199,PinName="ReturnValue",PinToolTip="Return Value\nLevel Variant Sets Object Reference\n\nReturns the LevelVariantSets asset, optionally loading it if necessary",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/VariantManagerContent.LevelVariantSets"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_2 2CB39E47498E2AD7551583816B79456A,K2Node_Knot_15 ED53E47D4CD1636590A17C92C4BF0AC0,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

End Object

Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_2"

 bIsPureFunc=True

 FunctionReference=(MemberParent=/Script/CoreUObject.Class'"/Script/VariantManagerContent.LevelVariantSets"',MemberName="GetNumVariantSets")

 NodePosX=3200

 NodePosY=736

 NodeGuid=E22C0C9A47054A830DBD3A8934E07A4C

 CustomProperties Pin (PinId=2CB39E47498E2AD7551583816B79456A,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nLevel Variant Sets Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/VariantManagerContent.LevelVariantSets"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_0 17D4CE2E418F6744B7ECB9B27E033199,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=277F3DE842DEC3C077D913BAAC24B01D,PinName="ReturnValue",PinToolTip="Return Value\nInteger\n\nGet Num Variant Sets",Direction="EGPD_Output",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0",AutogeneratedDefaultValue="0",LinkedTo=(K2Node_MacroInstance_3 DC8BF48F473B723ACBB451BA533F8248,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

End Object

Begin Object Class=/Script/BlueprintGraph.K2Node_MacroInstance Name="K2Node_MacroInstance_1"

 MacroGraphReference=(MacroGraph=/Script/Engine.EdGraph'"/Engine/EditorBlueprintResources/StandardMacros.StandardMacros:ForLoop"',GraphBlueprint=/Script/Engine.Blueprint'"/Engine/EditorBlueprintResources/StandardMacros.StandardMacros"',GraphGuid=55C904AF4B45FE1761FB55A8DB9FB801)

 NodePosX=3632

 NodePosY=672

 NodeGuid=858645474627C41BC5B66CB904665607

 CustomProperties Pin (PinId=C38EB482419D112B28A9F3973A51DA52,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_3 25B8310C4ED31A2624AA9D82D87A73EE,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=7FD5FF7545BC67FF7930F3BD47AAB499,PinName="FirstIndex",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=C893A965405D02431F3A00BFE4E06626,PinName="LastIndex",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_3 49DA97B14BF5113CDE00659008AA3EAC,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=D12CB5F549DF427A48A18F9FF6CB3EE6,PinName="LoopBody",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_20 BECF36064B44199648BEF28D740A5F3F,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=25788B6F484A13D9D61C458AF4165D0B,PinName="Index",Direction="EGPD_Output",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_3 A2E0D7AF4E41AB08B26617B905CFF938,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=14DD39CA4C033240571D54A440BB9C7A,PinName="Completed",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

End Object

Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_3"

 bIsPureFunc=True

 FunctionReference=(MemberParent=/Script/CoreUObject.Class'"/Script/VariantManagerContent.LevelVariantSets"',MemberName="GetVariantSet")

 NodePosX=3968

 NodePosY=736

 NodeGuid=1267387F4D192827781345B944956065

 CustomProperties Pin (PinId=873AF7494FC9FA8D908A439FCB8C81A0,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nLevel Variant Sets Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/VariantManagerContent.LevelVariantSets"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_14 4BA4F36B49D3AA6C8914B2A327AF7DA8,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=A2E0D7AF4E41AB08B26617B905CFF938,PinName="VariantSetIndex",PinToolTip="Variant Set Index\nInteger",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0",AutogeneratedDefaultValue="0",LinkedTo=(K2Node_MacroInstance_1 25788B6F484A13D9D61C458AF4165D0B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=9F9204A044E79A0ED7A7EA99B042C6BE,PinName="ReturnValue",PinToolTip="Return Value\nVariant Set Object Reference\n\nGet Variant Set",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/VariantManagerContent.VariantSet"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_20 B5E040194D8DB0EF72614EA9E0F2A7DE,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

End Object

Begin Object Class=/Script/BlueprintGraph.K2Node_MacroInstance Name="K2Node_MacroInstance_2"

 MacroGraphReference=(MacroGraph=/Script/Engine.EdGraph'"/Engine/EditorBlueprintResources/StandardMacros.StandardMacros:ForLoop"',GraphBlueprint=/Script/Engine.Blueprint'"/Engine/EditorBlueprintResources/StandardMacros.StandardMacros"',GraphGuid=55C904AF4B45FE1761FB55A8DB9FB801)

 NodePosX=3712

 NodePosY=928

 NodeGuid=08EB1B0347E83C8829364797F5A98E8C

 CustomProperties Pin (PinId=69A7B63A4A2F245F358466BFF0C5C62B,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_4 1CDE3A2B4F525CFDE46C17AF0E93885B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=702CAF424207E744860835ABC4D2D4E6,PinName="FirstIndex",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=527FCDF1402C3DAE91555482456402B8,PinName="LastIndex",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_4 CD82FFA548A835703BC7F2A4301DA1CA,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=7B72C5CE4B9AFAB52DF0F2B97DAE194E,PinName="LoopBody",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_14 ECD4A8DE4EC99B68A7686880ACD90A06,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=560A7A734C4DF5E390A46298DDEF3C4E,PinName="Index",Direction="EGPD_Output",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_7 8463CC674B32C1A1998D84A1BE599697,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=C2EB307143C0D3C15590AEA552BD6F4B,PinName="Completed",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

End Object

Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_6"

 bIsPureFunc=True

 bIsConstFunc=True

 FunctionReference=(MemberParent=/Script/CoreUObject.Class'"/Script/VariantManagerContent.VariantSet"',MemberName="GetNumVariants")

 NodePosX=2960

 NodePosY=1088

 ErrorType=1

 NodeGuid=0E9BF5C244FB07CEDF4E02ABDA8B6A8E

 CustomProperties Pin (PinId=B318BF56415D7FA1ED9D1FA247F397A6,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nVariant Set Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/VariantManagerContent.VariantSet"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_3 E6B14C8E4154652D0140BA8F1B6B99B8,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=4167CDE7459ACD33CFAF8884D93B9214,PinName="ReturnValue",PinToolTip="Return Value\nInteger\n\nGet Num Variants",Direction="EGPD_Output",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0",AutogeneratedDefaultValue="0",LinkedTo=(K2Node_Knot_34 9BC3C27D4177B4A96C96B983DE0FEDD5,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

End Object

Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_7"

 bIsPureFunc=True

 FunctionReference=(MemberParent=/Script/CoreUObject.Class'"/Script/VariantManagerContent.VariantSet"',MemberName="GetVariant")

 NodePosX=4016

 NodePosY=1008

 NodeGuid=DEFB028549610070F6BCF28757E93E86

 CustomProperties Pin (PinId=D50494904C99D49E75D340BAACB29BC5,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nVariant Set Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/VariantManagerContent.VariantSet"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_4 F63EA24F41FA78A7B0CBBCA5054D0DDB,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=8463CC674B32C1A1998D84A1BE599697,PinName="VariantIndex",PinToolTip="Variant Index\nInteger",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0",AutogeneratedDefaultValue="0",LinkedTo=(K2Node_MacroInstance_2 560A7A734C4DF5E390A46298DDEF3C4E,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=A9586D54408EEDF821606D8ABF2CB26B,PinName="ReturnValue",PinToolTip="Return Value\nVariant Object Reference\n\nGet Variant",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/VariantManagerContent.Variant"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_13 AD3CBB22472B41E7D8064E9224F2B2E7,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

End Object

Begin Object Class=/Script/BlueprintGraph.K2Node_Knot Name="K2Node_Knot_3"

 NodePosX=2816

 NodePosY=1168

 NodeGuid=5AB8BE07479451DC7367A9A62F9C9C3D

 CustomProperties Pin (PinId=E20E6B2E4D1D966BE18EE2A6F439AB98,PinName="InputPin",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/VariantManagerContent.VariantSet"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CustomEvent_3 B8A329D248B20FA675D74FB7E628F37F,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=E6B14C8E4154652D0140BA8F1B6B99B8,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/VariantManagerContent.VariantSet"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_4 1B859C674DA07A63EB0B8BBE67EC3A69,K2Node_CallFunction_6 B318BF56415D7FA1ED9D1FA247F397A6,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

End Object

Begin Object Class=/Script/BlueprintGraph.K2Node_Knot Name="K2Node_Knot_4"

 NodePosX=3760

 NodePosY=1168

 NodeGuid=567A212B462434C24299319AB1D23632

 CustomProperties Pin (PinId=1B859C674DA07A63EB0B8BBE67EC3A69,PinName="InputPin",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/VariantManagerContent.VariantSet"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_3 E6B14C8E4154652D0140BA8F1B6B99B8,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=F63EA24F41FA78A7B0CBBCA5054D0DDB,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/VariantManagerContent.VariantSet"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_7 D50494904C99D49E75D340BAACB29BC5,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

End Object

Begin Object Class=/Script/BlueprintGraph.K2Node_CustomEvent Name="K2Node_CustomEvent_0"

 bCallInEditor=True

 CustomFunctionName="PrintVariantData"

 NodePosX=2560

 NodePosY=656

 NodeGuid=E4B9CF4D4A331C3E21CC4B940B309947

 CustomProperties Pin (PinId=60DE56D44762EAE16B6F29A6F5ADB3F8,PinName="OutputDelegate",Direction="EGPD_Output",PinType.PinCategory="delegate",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(MemberParent=/Script/Engine.BlueprintGeneratedClass'"/Game/VariantManager.VariantManager_C"',MemberName="PrintVariantData",MemberGuid=E4B9CF4D4A331C3E21CC4B940B309947),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=6F16F9EA4EF5E12CE32B789686874BFB,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_0 3A822FE0415F805F99F1349F674B317C,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

End Object

Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_10"

 FunctionReference=(MemberParent=/Script/CoreUObject.Class'"/Script/Engine.KismetSystemLibrary"',MemberName="PrintString")

 NodePosX=3248

 NodePosY=928

 AdvancedPinDisplay=Hidden

 EnabledState=DevelopmentOnly

 NodeGuid=BA79909C4E0E6F1EDB9E5F86055171FE

 CustomProperties Pin (PinId=9873C79A482C77F657151BA4A952F625,PinName="execute",PinToolTip="\nExec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_33 DCA45A574F4B7F44100C2B8F597C7F19,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=D18950CA442215FF13CF41972835E682,PinName="then",PinToolTip="\nExec",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_4 3B7EF99E4E6DDC306E2F56B2D6592CB9,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=0075A17B4486F24650A6BB884F1310E6,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nKismet System Library Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/Engine.KismetSystemLibrary"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__KismetSystemLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=057CB6374768D9DFBD0F86B6CD2133C9,PinName="WorldContextObject",PinToolTip="World Context Object\nObject Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/CoreUObject.Object"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=0606096342E9BC49041E808F892937BF,PinName="InString",PinToolTip="In String\nString\n\nThe string to log out",PinType.PinCategory="string",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="Hello",AutogeneratedDefaultValue="Hello",LinkedTo=(K2Node_CallFunction_12 687D57F24A44273A5BFA018BB208C946,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=278C7644473AEDAC96E8778C738775F7,PinName="bPrintToScreen",PinToolTip="Print to Screen\nBoolean\n\nWhether or not to print the output to the screen",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",AutogeneratedDefaultValue="true",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)

 CustomProperties Pin (PinId=2076A1124E4EFF85673B94A52E42AFCB,PinName="bPrintToLog",PinToolTip="Print to Log\nBoolean\n\nWhether or not to print the output to the log",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",AutogeneratedDefaultValue="true",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)

 CustomProperties Pin (PinId=20B7B2BC432850032D7F83B849867BDC,PinName="TextColor",PinToolTip="Text Color\nLinear Color Structure\n\nThe color of the text to display",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.ScriptStruct'"/Script/CoreUObject.LinearColor"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="(R=0.000000,G=0.660000,B=1.000000,A=1.000000)",AutogeneratedDefaultValue="(R=0.000000,G=0.660000,B=1.000000,A=1.000000)",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)

 CustomProperties Pin (PinId=1A20AB1741FB8D708C705C8AC5028E14,PinName="Duration",PinToolTip="Duration\nFloat (single-precision)\n\nThe display duration (if Print to Screen is True). Using negative number will result in loading the duration time from the config.",PinType.PinCategory="real",PinType.PinSubCategory="float",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="2.000000",AutogeneratedDefaultValue="2.000000",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)

 CustomProperties Pin (PinId=1ABD9909498F401007FA98B2F2C562F0,PinName="Key",PinToolTip="Key\nName\n\nIf a non-empty key is provided, the message will replace any existing on-screen messages with the same key.",PinType.PinCategory="name",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="None",AutogeneratedDefaultValue="None",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)

End Object

Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_11"

 bIsPureFunc=True

 bIsConstFunc=True

 FunctionReference=(MemberParent=/Script/CoreUObject.Class'"/Script/VariantManagerContent.VariantSet"',MemberName="GetDisplayText")

 NodePosX=2832

 NodePosY=992

 ErrorType=1

 NodeGuid=618E0379414278DF875E3EA58D1BD4C3

 CustomProperties Pin (PinId=67D80E644D54918A5D75A8AA8E051FF8,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nVariant Set Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/VariantManagerContent.VariantSet"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CustomEvent_3 B8A329D248B20FA675D74FB7E628F37F,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=69C2A2EA43F265217CBF3E8F26B4C5A3,PinName="ReturnValue",PinToolTip="Return Value\nText\n\nGet Display Text",Direction="EGPD_Output",PinType.PinCategory="text",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_12 1F2A620B4861374FD0E9398B58739224,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

End Object

Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_12"

 bIsPureFunc=True

 FunctionReference=(MemberParent=/Script/CoreUObject.Class'"/Script/Engine.KismetTextLibrary"',MemberName="Conv_TextToString")

 NodePosX=3072

 NodePosY=1024

 bCommentBubbleVisible=True

 NodeComment="Convert to String"

 NodeGuid=A8D4E1BF460F8446904548B10C0F9978

 CustomProperties Pin (PinId=3FC9A53E444A20093404388B5DABC029,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nKismet Text Library Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/Engine.KismetTextLibrary"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__KismetTextLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=1F2A620B4861374FD0E9398B58739224,PinName="InText",PinToolTip="In Text\nText (by ref)",PinType.PinCategory="text",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=True,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_11 69C2A2EA43F265217CBF3E8F26B4C5A3,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=687D57F24A44273A5BFA018BB208C946,PinName="ReturnValue",PinToolTip="Return Value\nString\n\nConverts localizable text to the string",Direction="EGPD_Output",PinType.PinCategory="string",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_10 0606096342E9BC49041E808F892937BF,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

End Object

Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_13"

 bIsPureFunc=True

 bIsConstFunc=True

 FunctionReference=(MemberParent=/Script/CoreUObject.Class'"/Script/VariantManagerContent.Variant"',MemberName="GetDisplayText")

 NodePosX=4304

 NodePosY=1008

 NodeGuid=D03366444211A8E5E29291B8CDD8B3A8

 CustomProperties Pin (PinId=AD3CBB22472B41E7D8064E9224F2B2E7,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nVariant Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/VariantManagerContent.Variant"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_7 A9586D54408EEDF821606D8ABF2CB26B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=1869AA6844C133EDA38FEBA3E70104F5,PinName="ReturnValue",PinToolTip="Return Value\nText\n\nGet Display Text",Direction="EGPD_Output",PinType.PinCategory="text",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_15 899BB4664F88FB51C43D72AA556B57A7,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

End Object

Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_14"

 FunctionReference=(MemberParent=/Script/CoreUObject.Class'"/Script/Engine.KismetSystemLibrary"',MemberName="PrintString")

 NodePosX=4720

 NodePosY=928

 AdvancedPinDisplay=Hidden

 EnabledState=DevelopmentOnly

 NodeGuid=8E066FC84C6A224FA6CAB3A88650F92B

 CustomProperties Pin (PinId=ECD4A8DE4EC99B68A7686880ACD90A06,PinName="execute",PinToolTip="\nExec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_2 7B72C5CE4B9AFAB52DF0F2B97DAE194E,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=C2C1CBE8449029DD805C4881D92584DC,PinName="then",PinToolTip="\nExec",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=0F8B46564F4333D75106F98ACE1316E6,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nKismet System Library Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/Engine.KismetSystemLibrary"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__KismetSystemLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=7DF3CDA343014F98B5050F98586F164B,PinName="WorldContextObject",PinToolTip="World Context Object\nObject Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/CoreUObject.Object"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=8439BD144F1686B35E38C9B7C6CBD4E4,PinName="InString",PinToolTip="In String\nString\n\nThe string to log out",PinType.PinCategory="string",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="Hello",AutogeneratedDefaultValue="Hello",LinkedTo=(K2Node_CallFunction_15 DB63FBBC42A0CEDA8A5E14A23D4C29EC,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=3D079A51442708028798CCA0AA4A0B62,PinName="bPrintToScreen",PinToolTip="Print to Screen\nBoolean\n\nWhether or not to print the output to the screen",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",AutogeneratedDefaultValue="true",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)

 CustomProperties Pin (PinId=848E7FE941882A5EEDEA8384793FFE77,PinName="bPrintToLog",PinToolTip="Print to Log\nBoolean\n\nWhether or not to print the output to the log",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",AutogeneratedDefaultValue="true",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)

 CustomProperties Pin (PinId=03B93FEB492C778FF4DFEE91F190E59B,PinName="TextColor",PinToolTip="Text Color\nLinear Color Structure\n\nThe color of the text to display",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.ScriptStruct'"/Script/CoreUObject.LinearColor"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="(R=0.000000,G=0.660000,B=1.000000,A=1.000000)",AutogeneratedDefaultValue="(R=0.000000,G=0.660000,B=1.000000,A=1.000000)",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)

 CustomProperties Pin (PinId=70C0EB1D44F56791FB0836978FE6CF62,PinName="Duration",PinToolTip="Duration\nFloat (single-precision)\n\nThe display duration (if Print to Screen is True). Using negative number will result in loading the duration time from the config.",PinType.PinCategory="real",PinType.PinSubCategory="float",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="2.000000",AutogeneratedDefaultValue="2.000000",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)

 CustomProperties Pin (PinId=50F73CC34F13AB12774B6DA0E8B6F3FF,PinName="Key",PinToolTip="Key\nName\n\nIf a non-empty key is provided, the message will replace any existing on-screen messages with the same key.",PinType.PinCategory="name",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="None",AutogeneratedDefaultValue="None",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)

End Object

Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_15"

 bIsPureFunc=True

 FunctionReference=(MemberParent=/Script/CoreUObject.Class'"/Script/Engine.KismetTextLibrary"',MemberName="Conv_TextToString")

 NodePosX=4544

 NodePosY=1024

 bCommentBubbleVisible=True

 NodeComment="Convert to String"

 NodeGuid=263B9114498504F90CAE4FA639BA5109

 CustomProperties Pin (PinId=193319D141838CD3B6614BB8BA5217D6,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nKismet Text Library Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/Engine.KismetTextLibrary"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__KismetTextLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=899BB4664F88FB51C43D72AA556B57A7,PinName="InText",PinToolTip="In Text\nText (by ref)",PinType.PinCategory="text",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=True,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_13 1869AA6844C133EDA38FEBA3E70104F5,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=DB63FBBC42A0CEDA8A5E14A23D4C29EC,PinName="ReturnValue",PinToolTip="Return Value\nString\n\nConverts localizable text to the string",Direction="EGPD_Output",PinType.PinCategory="string",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_14 8439BD144F1686B35E38C9B7C6CBD4E4,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

End Object

Begin Object Class=/Script/BlueprintGraph.K2Node_MacroInstance Name="K2Node_MacroInstance_3"

 MacroGraphReference=(MacroGraph=/Script/Engine.EdGraph'"/Engine/EditorBlueprintResources/StandardMacros.StandardMacros:DecrementInt"',GraphBlueprint=/Script/Engine.Blueprint'"/Engine/EditorBlueprintResources/StandardMacros.StandardMacros"',GraphGuid=313497C74768FD0B41B3D18DA5D1DAA4)

 NodePosX=3456

 NodePosY=688

 bCommentBubbleVisible=True

 NodeComment="Decrement"

 NodeGuid=A9B377904F3E462197B8288787431154

 CustomProperties Pin (PinId=D582D24F4CE75F18600111BAD7CE0D78,PinName=" ",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_0 3CC60D03446A92F2DD7080A9F308D9F4,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=DC8BF48F473B723ACBB451BA533F8248,PinName="Value",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=True,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_2 277F3DE842DEC3C077D913BAAC24B01D,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=25B8310C4ED31A2624AA9D82D87A73EE,PinName=" ",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_1 C38EB482419D112B28A9F3973A51DA52,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=49DA97B14BF5113CDE00659008AA3EAC,PinName="Result",Direction="EGPD_Output",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_1 C893A965405D02431F3A00BFE4E06626,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

End Object

Begin Object Class=/Script/BlueprintGraph.K2Node_MacroInstance Name="K2Node_MacroInstance_4"

 MacroGraphReference=(MacroGraph=/Script/Engine.EdGraph'"/Engine/EditorBlueprintResources/StandardMacros.StandardMacros:DecrementInt"',GraphBlueprint=/Script/Engine.Blueprint'"/Engine/EditorBlueprintResources/StandardMacros.StandardMacros"',GraphGuid=313497C74768FD0B41B3D18DA5D1DAA4)

 NodePosX=3536

 NodePosY=944

 bCommentBubbleVisible=True

 NodeComment="Decrement"

 NodeGuid=4E0F8DA8465337B5D623A3AD8457BA71

 CustomProperties Pin (PinId=3B7EF99E4E6DDC306E2F56B2D6592CB9,PinName=" ",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_10 D18950CA442215FF13CF41972835E682,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=CBBA11E74E64812EC4A92C90E0537ADF,PinName="Value",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=True,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_34 C58117634CC7CD6BCB695C9D9982FD99,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=1CDE3A2B4F525CFDE46C17AF0E93885B,PinName=" ",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_2 69A7B63A4A2F245F358466BFF0C5C62B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=CD82FFA548A835703BC7F2A4301DA1CA,PinName="Result",Direction="EGPD_Output",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_2 527FCDF1402C3DAE91555482456402B8,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

End Object

Begin Object Class=/Script/BlueprintGraph.K2Node_CustomEvent Name="K2Node_CustomEvent_3"

 CustomFunctionName="HandleVariantSet"

 NodePosX=2560

 NodePosY=960

 NodeGuid=68D1D21F408E8F420A1BE2851EBB38F8

 CustomProperties Pin (PinId=39CBEBB44651D716398CC18E2D79E486,PinName="OutputDelegate",Direction="EGPD_Output",PinType.PinCategory="delegate",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(MemberParent=/Script/Engine.BlueprintGeneratedClass'"/Game/VariantManager.VariantManager_C"',MemberName="HandleVariantSet",MemberGuid=C5E4C89A407CD2159773AA97773102CB),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=703ED296435C307C18FAE39B50C3A547,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_33 A5EF4A8D4A8FE7DE560C9A9BA18B0933,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=B8A329D248B20FA675D74FB7E628F37F,PinName="VariantSet",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/VariantManagerContent.VariantSet"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_3 E20E6B2E4D1D966BE18EE2A6F439AB98,K2Node_CallFunction_11 67D80E644D54918A5D75A8AA8E051FF8,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties UserDefinedPin (PinName="VariantSet",PinType=(PinCategory="object",PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/VariantManagerContent.VariantSet"'),DesiredPinDirection=EGPD_Output)

End Object

Begin Object Class=/Script/BlueprintGraph.K2Node_Knot Name="K2Node_Knot_14"

 NodePosX=3760

 NodePosY=832

 NodeGuid=B71862684FEAC006F0B80E908E7C083B

 CustomProperties Pin (PinId=3823978945DCCB2CF47103B5393BEF22,PinName="InputPin",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/VariantManagerContent.LevelVariantSets"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_15 14DC580A4988CA9FAC463299DD0A863F,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=4BA4F36B49D3AA6C8914B2A327AF7DA8,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/VariantManagerContent.LevelVariantSets"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_3 873AF7494FC9FA8D908A439FCB8C81A0,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

End Object

Begin Object Class=/Script/BlueprintGraph.K2Node_Knot Name="K2Node_Knot_15"

 NodePosX=3168

 NodePosY=832

 NodeGuid=8D89883640E58DEE92020B8F434EA6E2

 CustomProperties Pin (PinId=ED53E47D4CD1636590A17C92C4BF0AC0,PinName="InputPin",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/VariantManagerContent.LevelVariantSets"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_0 17D4CE2E418F6744B7ECB9B27E033199,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=14DC580A4988CA9FAC463299DD0A863F,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/VariantManagerContent.LevelVariantSets"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_14 3823978945DCCB2CF47103B5393BEF22,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

End Object

Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_20"

 FunctionReference=(MemberName="HandleVariantSet",MemberGuid=C5E4C89A407CD2159773AA97773102CB,bSelfContext=True)

 NodePosX=4320

 NodePosY=656

 NodeGuid=215E144A41F4BC47D6AE249458270571

 CustomProperties Pin (PinId=BECF36064B44199648BEF28D740A5F3F,PinName="execute",PinToolTip="\nExec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_1 D12CB5F549DF427A48A18F9FF6CB3EE6,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=487B5C8F425B0575992F6BAC6D4F91B3,PinName="then",PinToolTip="\nExec",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=37E5DF8C4383878B16FEE1A269E431D4,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nSelf Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="self",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=B5E040194D8DB0EF72614EA9E0F2A7DE,PinName="VariantSet",PinToolTip="Variant Set\nVariant Set Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/VariantManagerContent.VariantSet"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_3 9F9204A044E79A0ED7A7EA99B042C6BE,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

End Object

Begin Object Class=/Script/BlueprintGraph.K2Node_Knot Name="K2Node_Knot_33"

 NodePosX=2816

 NodePosY=960

 NodeGuid=5D17EC084375731CE21FBE9829AAB112

 CustomProperties Pin (PinId=A5EF4A8D4A8FE7DE560C9A9BA18B0933,PinName="InputPin",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CustomEvent_3 703ED296435C307C18FAE39B50C3A547,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=DCA45A574F4B7F44100C2B8F597C7F19,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_10 9873C79A482C77F657151BA4A952F625,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

End Object

Begin Object Class=/Script/BlueprintGraph.K2Node_Knot Name="K2Node_Knot_34"

 NodePosX=3408

 NodePosY=1136

 NodeGuid=98D06D704E1C20C2174C798DCA336460

 CustomProperties Pin (PinId=9BC3C27D4177B4A96C96B983DE0FEDD5,PinName="InputPin",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_6 4167CDE7459ACD33CFAF8884D93B9214,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)

 CustomProperties Pin (PinId=C58117634CC7CD6BCB695C9D9982FD99,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_4 CBBA11E74E64812EC4A92C90E0537ADF,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

End Object

You could use the same kind of approach to iterate through your variant sets and variants to do something different. With a little imagination and general UMG knowledge, you can use this information to write a UI system that automatically creates UI widgets that reflect the variant sets and variants you have configured in your level variant sets asset.

For background information about working in Blueprints, see Blueprint Visual Scripting (-> blueprints-visual-scripting-in-unreal-engine). For more about creating user interfaces with UMG, see the UMG UI Designer documentation (-> creating-user-interfaces-with-umg-and-slate-in-unreal-engine).

- getting started
- datasmith
- enterprise
- manufacturing
- variants
- variant manager

On this page

- The Variant Manager Panel (-> variant-manager-template-overview)
- Setting Up Variants (-> variant-manager-template-overview)
- Automatic Binding and Capturing (-> variant-manager-template-overview)
- Activating Variants in the Editor (-> variant-manager-template-overview)
- Setting Up Dependencies (-> variant-manager-template-overview)
- About the Level Variant Sets Asset and Actor (-> variant-manager-template-overview)
- Runtime Blueprint API (-> variant-manager-template-overview)
- Activating a Variant (-> variant-manager-template-overview)
- Accessing Variant Data (-> variant-manager-template-overview)
