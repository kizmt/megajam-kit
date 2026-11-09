# Player HUD

https://dev.epicgames.com/documentation/en-us/unreal-engine/designer-04-player-hud-in-unreal-engine?application_version=5.9

> Create a simple heads-up-display (HUD) that updates when the player picks up an item.

[image: Player HUD]

A game’s user interface (UI) is anything the player interacts with visually, like menus, pause screens, inventory, dialogue boxes, and the player’s heads-up display, or HUD. The HUD is any part of the UI that stays visible on screen during gameplay, like the player’s health, equipment, or objective indicators.

Now that your character can pick up items, you’ll learn how to use Unreal Engine’s UMG (Unreal Motion Graphics) system to build a HUD that shows the player what keys they have picked up. With UMG, you can design a HUD by dragging and arranging UI elements in a visual editor, so you’ll know exactly what the player will see in game.

## Before You Begin

Make sure you understand these topics covered in previous sections of Design a Puzzle Adventure (-> design-a-puzzle-adventure-game-in-unreal-engine):

- Blueprint basics like variables, functions, event graphs, and adding nodes.

You’ll need the following assets from Create a Key (-> designer-02-create-a-key-in-unreal-engine):

- `BP_Key` Blueprint Class
- `BP_AdventureCharacter` Blueprint Class
- `Enum_KeyType` Enumeration

## Create a Widget Blueprint

UMG includes a special type of blueprint called a Widget that you’ll use to build various UI elements. To start building your HUD, create a new **Widget Blueprint** asset.

To create a new widget blueprint, do the following:

- In the **Content Browser**, go to C**ontent > AdventureGame > Designer > Blueprints**, and create a folder named `Widgets` to store your UI assets.
- In the new **Widgets **folder, create a new asset by right-clicking an empty area in the folder and selecting **User Interface > Widget Blueprint**.
- In the **Pick Parent Class** window, click **User Widget**.
- Enter a name for your widget. This tutorial uses `WBP_PlayerHUD`.
- Double-click the blueprint to open it.

## Explore the Widget Blueprint Editor

Widget Blueprints open in a special widget editor that has two modes: **Designer **and **Graph**. To switch between modes, use the buttons near the top-right corner of the editor.

In **Designer **mode, you can add and edit individual parts of your UI.

On the left side of the widget editor, the **Palette **contains all the different widget types you can add to your UI. The **Hierarchy **panel shows the structure of your UI components. The order and nesting of widgets in this panel affects the layout and rendering of your UI.

The grid in the middle of the window is the **visual designer**. Just like in your blueprint event graphs, use the mouse scroll wheel to zoom in and out, and use the right mouse button to pan around your design.

The zoom level in the top-left corner of the grid updates as you zoom in or out. **Zoom 1:1** means you’re viewing your UI at 100% scale, showing how your UI elements will appear in-game on a screen of that resolution. If a player runs your game on a smaller screen, Unreal Engine uses **DPI scaling** to scale your UI to fit that screen.

The bottom-left corner of the grid contains information about the current screen size preset. This is the screen size your widget blueprint is previewing. By default, it’s set to a 720p television screen.

## Start With a Canvas Panel

In the **Palette **tab, widgets are sorted by type. **Panel**-type widgets don’t display anything on-screen; they are like containers that control the layout and positioning of widgets placed inside them. Panels are useful for automatically scaling the UI to fit different TV screen sizes and monitor resolutions.

**Canvas **panels are the most flexible type of panel widget and are perfect for HUDs. While other panels arrange widgets in a certain layout or orientation, canvas panels use anchors to place widgets exactly where you want them on the screen, ensuring everything stays in place if the screen changes size.

To create a Canvas Panel, follow these steps:

- In the **Palette **tab, search for `Canvas`, and drag a **Canvas Panel** into the **Hierarchy **panel on top of **[WBP_PlayerHUD]** so it becomes nested underneath. A rectangle appears in the visual designer area in the middle of the window.

This canvas is the UI’s** root widget**. Every widget blueprint must have one root widget, the top-level UI element that holds all other widgets. When you place another widget inside the canvas, there’s a hierarchical relationship between the two where the canvas is the parent and the other widget is a child.

By default, a canvas panel is 1920x1080 pixels and represents the entire screen. This is a common resolution and a great starting point to work with, so keep this canvas size. At runtime, Unreal Engine scales the UI to fit the player’s screen.

## Build the Layout for Your HUD

Now that you have a canvas, you’ll anchor areas for player health and inventory to the top-left corner of the UI.

When a person looks at a screen, they tend to look near the top-left corner first, so this is the best place for critical information such as player health.

To define the areas for text on the canvas, follow these steps:

- In the **Palette**, search for `Overlay`, and drag an **Overlay **panel into the Hierarchy so it’s nested as a child widget under the **Canvas Panel**.Overlays are a type of panel that layers multiple widgets on top of each other in the same space. They are useful for adding a background image behind UI elements, or a static icon or text label on top of UI elements. For this HUD, you’ll layer a blur effect behind the UI text so it’s easier to read.
- Select the new **Overlay**. This panel is a child of the canvas, so it gets an anchor point in the top-left corner of the canvas.For this tutorial, you’ll leave the anchor point there, but in the Details panel, you can use the Anchors property to move the anchor point.
- In the **Details **panel, set the **Position X** and **Position Y** to `20`. This is the number of pixels the overlay panel is positioned away from the anchor. Adding an offset improves the UI’s look and prevents text from being cut off the edge of the screen.
- To define the area you’ll draw your UI text in, drag the handles on the overlay panel’s bounding box to resize it until it’s about 250 pixels wide and 200 pixels tall. Or, in the **Details **panel, use **Size X **and **Size Y** to resize the panel.This area will display the player’s health (HP) and names of the keys they’ve collected.
- In the **Palette**, search for and drag a **Vertical Box** panel to be a child under the **Overlay**. This type of panel arranges UI elements inside it vertically, like in a column of a table.
- Add two **Horizontal Box** panels as children of the **Vertical Box**. Horizontal boxes arrange any UI elements inside it horizontally, like in a row of a table. One horizontal box is a container for the player’s health information and the other horizontal box is a container for a Keys Collected label.

Vertical and horizontal boxes are layout widgets. These panels are like invisible organizers — they don’t have a visible frame in the designer and automatically resize themselves to fit their contents.

Each type of box aligns and organizes the text you’ll add to the UI:

- The Overlay panel enables overlapping, so the vertical box forces the horizontal boxes to align vertically instead of stacking on top of each other.
- You’ll have two text boxes in the first row, so by adding Horizontal Boxes, you can control the alignment and spacing of each text box in the row.

## Add Text Labels

Now that you’ve defined the HUD’s structure, you can add the static text that won’t change based on what happens in the game.

You’ll need an `HP` label before the player’s health and a `Keys Collected` label before the list of key names. For now, you’ll also add placeholder text for the player’s current HP value. In a later section of this tutorial series, you’ll change this placeholder to a variable to reflect the player’s real health.

To add text labels for the player’s health (HP), follow these steps:

- In the **Palette**, search for `text`, and drag two Text widgets into the **Hierarchy **as children of the first **Horizontal Box**. Ensure you add a **Text **widget, not a **Text Box**.
- Select the first **Text **widget under the **Horizontal Box**. In the **Details **panel, in the **Slot (Horizontal Box Slot)** section, set the **Padding **to `5`. This sets the text 5 pixels in from the edge of the horizontal box.
- In the **Content **section, set the **Text **to `HP :`.
- In the **Appearance **section, click the color swatch next to **Color and Opacity**, and pick a color for your text. This tutorial uses green (**Hex sRGB **= `78FF3FFF`).
- Select the second **Text **widget. At the top of the **Details **panel, rename the widget from `TextBlock` to `txtHP`. In future parts of this tutorial, you’ll need to refer to this widget, so give it a unique and descriptive variable name now.
- Change the **Padding **to `5` and the **Text **to `100`.

To add a text label for the keys the player has collected, follow these steps:

- In the **Palette**, drag a **Text **widget to become a child of the second **Horizontal Box**.
- Change its **Padding **to `5` and the **Text **to `Keys Collected :`.
- For `Color and Opacity`, pick a color. This tutorial uses orange (**Hex sRGB** = `FF6200FF`).

Now that there’s some text in each horizontal box, you can see the flexible structure of this layout. If you select a horizontal box or text widget, arrow buttons appear on the edges of that widget. Click the arrows to reorganize the widgets. By using each text widget’s alignment and padding options, you have a lot of control over the spacing between elements in the same row and across different rows.

## Add Space for a Variable

In a game, most of the player’s HUD needs to update during gameplay because of the actions you take, such as taking damage, receiving or using items, or getting a power up. To do this in your project, you’ll connect the HUD to a variable that tracks the player’s keys, so it can update as the player collects them.

To add an input text box for displaying the list of keys, follow these steps:

- In the **Palette**, search for and drag a **Text Box (Multi-Line)** to become the last child of the **Vertical Box**. This input widget takes multiple lines of user-entered text. However, you can use event graph logic to add text to this widget when the user collects a key.
- In the **Hierarchy**, select the textbox. In the **Details **panel, rename it `txtKeys`.You can also view and change a widget’s name by right-clicking it in the **Hierarchy**.
- In the visual designer, you’ll see the input textbox comes with a default background, so remove it:Near the top of the **Details **panel, expand **Padding **and set the following values to pad the text box with an indent:Left: `15`
- **Top**, **Right**, and **Bottom**: `4`

- In the **Style **section, expand **Style > Background Image Normal**, and click the color swatch next to **Tint**.
- Change **Hex sRGB** to `FFFFFF00` to make the background transparent, then click OK.

- This widget doesn’t come with a default font style, so you’ll need to set the font properties yourself. In the Style section, expand Text Style > Font, and set the following:Change **Font Family** to **Roboto**.
- Change **Typeface** to **Bold**.
- Change **Size **to `24`.
- Change the **Color **to white.

With **txtKeys** selected, at the top of the **Details **panel, you’ll see **Is Variable** is enabled. Textboxes expect user-entered text, so they’re automatically set up as variables. With **Is Variable** enabled, you’ll be able to reference and use **txtKeys **in your widget blueprint’s event graph.

## Layer in a Special Effect

You can make your HUD text easier to read by blurring the background of the overlay’s bounding box. Use the layering feature of the overlay panel to place a blur effect behind the vertical and horizontal boxes.

To use a widget to blur the area of the screen behind your HUD text, follow these steps:

- In the **Palette**, search for `blur`, and drag a **Background Blur **widget into the **Hierarchy **as a child of the **Overlay**.
- The editor adds the **Background Blur** to the bottom of the list, so drag it to be the first child under the **Overlay**, above the **Vertical Box**.
- In the Details panel, in the Appearance section, set the Blur Strength to `2`.Using large blur effects incurs a higher runtime cost on the GPU. For a cheaper alternative, you could also use an opaque **Border** widget or apply a texture with an **Image **widget.
- Make the effect fill the overlay widget’s dimensions:In the **Slot (Overlay Slot)** section, next to **Horizontal Alignment**, click **Fill Horizontally**.
- Next to **Vertical Alignment**, select **Fill Vertically**.

Here’s an example of how the UI text appears without a blurred background and with an exaggerated blur effect:

## Build the HUD’s Logic

To finish your widget blueprint, you’ll build the logic that displays the name of any key the player picks up.

### Set Up Building Blocks for Key Pickups

Before you can start building the logic that adds key names to the HUD, you’ll need:

- An array variable that tracks the player’s keys.
- A function that your character’s blueprint can call when the player finds a new key.

To trigger the execution of the HUD’s logic from other blueprints, you’ll use a function instead of the event graph. The function will take the key the player has collected, save it in the named variable, and enter the names of the keys in that variable into the txtKeys box.

To add a new variable and function that tracks the player’s keys, follow these steps:

- Near the top-right corner of the window, click **Graph **to edit the widget blueprint’s event graph. This graph functions the same as the other blueprints you’ve been working on so far.Your `txtKeys` variable is listed in the panel on the left side of the window.
- Create a function that will execute all HUD logic when called:In the **Functions **section, click the **plus (+) **button to add a function. A new tab for that function appears above the graph.
- Name the function `fnAddKeyHUD`.
- With the function selected, in the **Details **panel, in the **Inputs **section, click **+ **to add a new function input.
- Name the input `KeyType` and change its type to **Enum Key Type**.

- In the **My Blueprint** panel, create an array variable to store the player’s keys:In the **Variables **section, click **+** to create a new variable.
- Name the variable `KeysToDisplay`.
- Change its type to **Enum Key Type**. This is the enum you made with Red, Yellow, and Blue key type options.
- Right-click the variable type to turn it into an array. Or, use the **Details **panel to change its container type.You could pass the character blueprint’s keys array into the function instead of rebuilding it here, but keeping track of the keys independently in the HUD gives you more flexibility if you wanted to perform any HUD-specific logic like displaying images for each key.

- To print the key names in the multi-line textbox, you’ll need to combine them all in a string.In the** Local Variables** section, click the **+** button to add a new variable. Name it `Keys` and change its type to **String **and its container type to **Single**.

### Print the Player’s Keys On Screen

Now you can start adding logic to the **fnAddKeyHUD **function.

When this function is called, it will start with a red, yellow, or blue **KeyType**. You need to add that key type to your **KeysToDisplay **array, add all the keys to your string variable, and then convert that string to text so you can display it on screen.

First, to build the **KeysToDisplay **array, follow these steps:

- In the widget blueprint’s **Graph **view, make sure you’re viewing the **fnAddKeyHUD **tab.
- To build the **KeysToDisplay **array, add an** Add Unique** node after the function entry node.
- For its **Target Array**, connect a reference to the **KeysToDisplay **variable.
- For its second input, connect the **Key Type** function input.The **Add Unique** node takes an array and a new value and adds that value to the array (if it’s not already in the array). This node ensures that key names won’t appear on the HUD more than once.

To combine all collected keys into the Keys string, follow these steps:

- Loop through each item in the **KeysToDisplay **array. After the **Add Unique** node, add a **For Each Loop **node.
- Connect another **KeysToDisplay **reference to the loop’s **Array **input. For each item (or element) in the array, or each iteration of the loop, you need to convert that element to a string, add it to the Keys string variable, and then add a new line after that key name (like pressing Enter on your keyboard). Remember, any logic you connect to the **Loop Body** execution pin runs once per array item. When the loop is done, execution will pass through the **Completed **pin.
- Right-click in the node graph, search for `Append String`, and add a string-type **Append **node. This combines string inputs together to form a single string return value.
- Set up the **Append **node to take the current contents of the **Keys **variable, add the new array element, and then add a line break:For its **A** input, connect a reference to **Keys**.
- For its **B** input, connect the loop node’s **Array Element** pin. Unreal Engine adds an **Enum to String** node to convert the value.
- Click **Add pin** to add a **C** input. Click into the textbox and press **Shift + Enter** to add a new line.

- Drag off the **Append **node’s **Return Value** pin and add a **Set Keys** node.
- Connect the loop’s execution output pin to the** Set Keys** node.

When the loop body completes, you’ll have one long string with the names of all the player’s keys.

To pass the **Keys **string to the HUD’s **TxtKeys **text box, follow these steps:

- Drag off the loop’s **Completed **execution pin and add a **SetText (Multi-Line Text Box)** node.If you can’t find this node, disable **Context Sensitive** near the top-right corner of the node actions list. The **SetText **node takes text-type input and displays it in a target text box.
- Set up the **SetText (Multi-Line Text Box**) node:For the **Target**, connect a reference to **TxtKeys**.
- For the **In Text**, connect a reference to **Keys**. Unreal Engine adds a **To Text (String)** node that converts the **Keys **string to text. Text is a separate data type. While strings are for programming and debugging, text is designed for user-facing text and supports translation and formatting.

- **Compile **and **Save **your blueprint.

Your complete **fnAddKeyHUD **function should look like the following:

 Blueprint

Begin Object Class=/Script/BlueprintGraph.K2Node_FunctionEntry Name="K2Node_FunctionEntry_0" ExportPath="/Script/BlueprintGraph.K2Node_FunctionEntry'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD:fnAddKeyHUD.K2Node_FunctionEntry_0'"
 LocalVariables(0)=(VarName="Keys",VarGuid=7CFB4DE2472FB89562B43DA4067A4B19,VarType=(PinCategory="string"),FriendlyName="Keys",Category=NSLOCTEXT("KismetSchema", "Default", "Default"),PropertyFlags=5)
 ExtraFlags=201457664
 FunctionReference=(MemberName="fnAddKeyHUD")
 bIsEditable=True
 NodePosX=-144
 NodeGuid=4ECB65CA4D6AC7845C07B58BCAA0CC3E
 CustomProperties Pin (PinId=0E4F48E14D945C747BB3B7BB32B106B5,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallArrayFunction_0 947B29634A44E616483F9094D92CE754,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=CFE8C37F434814AB5DE2B5BE3C41BBB1,PinName="Key Type",Direction="EGPD_Output",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",AutogeneratedDefaultValue="NewEnumerator0",LinkedTo=(K2Node_Knot_0 08C2243645687F98862A67B2DD49127F,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties UserDefinedPin (PinName="Key Type",PinType=(PinCategory="byte",PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'"),DesiredPinDirection=EGPD_Output,PinDefaultValue="NewEnumerator0")
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallArrayFunction Name="K2Node_CallArrayFunction_0" ExportPath="/Script/BlueprintGraph.K2Node_CallArrayFunction'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD:fnAddKeyHUD.K2Node_CallArrayFunction_0'"
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetArrayLibrary'",MemberName="Array_AddUnique")
 NodePosX=240
 NodePosY=16
 NodeGuid=6EE0B0FE4317F46F91C03BA083EA0ABC
 CustomProperties Pin (PinId=947B29634A44E616483F9094D92CE754,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_FunctionEntry_0 0E4F48E14D945C747BB3B7BB32B106B5,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=ABE7A2E44AEDEFDADD2E5D9F43A3F435,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_0 E36C4DBC4E119EF684CEA6872A58D590,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=58E81C3E431D76AE914747A22165966B,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.KismetArrayLibrary'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__KismetArrayLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=62405F1645872D25E26348AC9CF62821,PinName="TargetArray",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=True,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_0 A42D12BB453E2140470F4EAFB4B1C774,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=0023FAEA4CBA90CBE81DD58061384698,PinName="NewItem",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=True,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",LinkedTo=(K2Node_Knot_0 D66035A94FC073620AFE30BD70C8034D,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=0CA4EC274E4757D2DF78A5B11517E6EE,PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0",AutogeneratedDefaultValue="0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_0" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD:fnAddKeyHUD.K2Node_VariableGet_0'"
 VariableReference=(MemberName="KeysToDisplay",MemberGuid=34886F0F439C3DC3F919BB9EEABAABDE,bSelfContext=True)
 NodePosX=80
 NodePosY=64
 NodeGuid=9FFD72B045318FF871A0048A55D184BA
 CustomProperties Pin (PinId=A42D12BB453E2140470F4EAFB4B1C774,PinName="KeysToDisplay",Direction="EGPD_Output",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",LinkedTo=(K2Node_CallArrayFunction_0 62405F1645872D25E26348AC9CF62821,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=9A2A07C34B9C5146DA6E8284F9F307CA,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/UMG.WidgetBlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_MacroInstance Name="K2Node_MacroInstance_0" ExportPath="/Script/BlueprintGraph.K2Node_MacroInstance'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD:fnAddKeyHUD.K2Node_MacroInstance_0'"
 MacroGraphReference=(MacroGraph="/Script/Engine.EdGraph'/Engine/EditorBlueprintResources/StandardMacros.StandardMacros:ForEachLoop'",GraphBlueprint="/Script/Engine.Blueprint'/Engine/EditorBlueprintResources/StandardMacros.StandardMacros'",GraphGuid=99DBFD5540A796041F72A5A9DA655026)
 NodePosX=704
 NodePosY=-16
 NodeGuid=3255CE7943D3E53105A003AC7781F1E9
 CustomProperties Pin (PinId=E36C4DBC4E119EF684CEA6872A58D590,PinName="Exec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallArrayFunction_0 ABE7A2E44AEDEFDADD2E5D9F43A3F435,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=3CCC7CD24598B1AF35CAAEA6CE4474AA,PinName="Array",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",LinkedTo=(K2Node_VariableGet_1 9B62D3634E3AB73F244CB9BAF50B23FA,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=C5746EB5416B4FE296427286BAEBAB1E,PinName="LoopBody",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_2 3CB38697444E0A16E9C9DCA026F5F896,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=A54D131047D7021F75ADC9AC35E939E7,PinName="Array Element",Direction="EGPD_Output",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_GetEnumeratorNameAsString_0 1C5CE83041C15274C9531BB20EA1CECB,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=B0AA2A3747FD00F94354C1B063FB82C6,PinName="Array Index",Direction="EGPD_Output",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=B20B6B23429C7E3CF5AB67AA1405336C,PinName="Completed",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_1 DDF2A20E4100D2F7D9BD929C858B9DA7,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_1" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD:fnAddKeyHUD.K2Node_VariableGet_1'"
 VariableReference=(MemberName="KeysToDisplay",MemberGuid=34886F0F439C3DC3F919BB9EEABAABDE,bSelfContext=True)
 NodePosX=528
 NodePosY=48
 NodeGuid=35488B2B45DEF311676C4FA7A662241C
 CustomProperties Pin (PinId=9B62D3634E3AB73F244CB9BAF50B23FA,PinName="KeysToDisplay",Direction="EGPD_Output",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",LinkedTo=(K2Node_MacroInstance_0 3CCC7CD24598B1AF35CAAEA6CE4474AA,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=B0B78C824065095B9D49FA9C43AA84D8,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/UMG.WidgetBlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableSet Name="K2Node_VariableSet_0" ExportPath="/Script/BlueprintGraph.K2Node_VariableSet'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD:fnAddKeyHUD.K2Node_VariableSet_0'"
 VariableReference=(MemberScope="fnAddKeyHUD",MemberName="Keys",MemberGuid=7CFB4DE2472FB89562B43DA4067A4B19)
 NodePosX=1520
 NodePosY=-112
 NodeGuid=46369B74428A680AB9246A98B3313B08
 CustomProperties Pin (PinId=971C45FD4465204369F33C8270D06C93,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_2 BE033B11415A97583E2F4F9D9F349A20,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=66E07482449716086AEF1B82267EF8AD,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=9D46632C4E67619A4A3380B7D620AF60,PinName="Keys",PinType.PinCategory="string",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CommutativeAssociativeBinaryOperator_0 B4F4A0FF4042D1F25751E5AE45269E11,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=06B3DF4D480BD2171EE108A541478069,PinName="Output_Get",PinToolTip="Retrieves the value of the variable, can use instead of a separate Get node",Direction="EGPD_Output",PinType.PinCategory="string",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_GetEnumeratorNameAsString Name="K2Node_GetEnumeratorNameAsString_0" ExportPath="/Script/BlueprintGraph.K2Node_GetEnumeratorNameAsString'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD:fnAddKeyHUD.K2Node_GetEnumeratorNameAsString_0'"
 NodePosX=1024
 NodePosY=-16
 NodeGuid=3EE054124F95FFED4A4576998CE8079F
 CustomProperties Pin (PinId=1C5CE83041C15274C9531BB20EA1CECB,PinName="Enumerator",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_0 A54D131047D7021F75ADC9AC35E939E7,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=8E03974C42D45EBB2645B3B3A628D5DA,PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="string",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CommutativeAssociativeBinaryOperator_0 7D6A09A44835BDC755FA80ABD7BAE706,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_2" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD:fnAddKeyHUD.K2Node_VariableGet_2'"
 VariableReference=(MemberScope="fnAddKeyHUD",MemberName="Keys",MemberGuid=7CFB4DE2472FB89562B43DA4067A4B19)
 NodePosX=1120
 NodePosY=-64
 NodeGuid=D3EF27554BB58BFE446FF7B385658CE1
 CustomProperties Pin (PinId=B76BDEEC4B7E18C1103303BBF3EB3D3C,PinName="Keys",Direction="EGPD_Output",PinType.PinCategory="string",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CommutativeAssociativeBinaryOperator_0 5C2029524618396AA82049A868479558,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CommutativeAssociativeBinaryOperator Name="K2Node_CommutativeAssociativeBinaryOperator_0" ExportPath="/Script/BlueprintGraph.K2Node_CommutativeAssociativeBinaryOperator'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD:fnAddKeyHUD.K2Node_CommutativeAssociativeBinaryOperator_0'"
 NumAdditionalInputs=1
 bDefaultsToPureFunc=True
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetStringLibrary'",MemberName="Concat_StrStr")
 NodePosX=1296
 NodePosY=-64
 NodeGuid=3E9B76DB4B7C0A22B731F1B0B5753720
 CustomProperties Pin (PinId=A002617F4DA0FA010EDCD4BC99AB7F0F,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.KismetStringLibrary'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__KismetStringLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=5C2029524618396AA82049A868479558,PinName="A",PinType.PinCategory="string",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_2 B76BDEEC4B7E18C1103303BBF3EB3D3C,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=7D6A09A44835BDC755FA80ABD7BAE706,PinName="B",PinType.PinCategory="string",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_GetEnumeratorNameAsString_0 8E03974C42D45EBB2645B3B3A628D5DA,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=B4F4A0FF4042D1F25751E5AE45269E11,PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="string",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_0 9D46632C4E67619A4A3380B7D620AF60,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=9ADE928446F0199BAC25E7A1346D3044,PinName="C",PinType.PinCategory="string",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="\r\n",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_3" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD:fnAddKeyHUD.K2Node_VariableGet_3'"
 VariableReference=(MemberName="txtKeys",MemberGuid=2D71B9A84117271E17A45A88C6A52D68,bSelfContext=True)
 NodePosX=1248
 NodePosY=288
 NodeGuid=681C04544433F1F0B86A28AAE42A4594
 CustomProperties Pin (PinId=37E920104EC1970553E7B1B7A0F1A100,PinName="txtKeys",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/UMG.MultiLineEditableTextBox'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_3 EBDBE65642718C3AFE6C4DA555BBE75A,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=AA2CC9614396C3817CB7C4ABB0AF4C0C,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/UMG.WidgetBlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_3" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD:fnAddKeyHUD.K2Node_CallFunction_3'"
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/UMG.MultiLineEditableTextBox'",MemberName="SetText")
 NodePosX=1424
 NodePosY=208
 NodeGuid=C19844504A783BECAAEE538469097CD5
 CustomProperties Pin (PinId=41B7A8F748D25E44B71202A38CEEF4E9,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Knot_1 FCC2BA7C49BC70BCB08799B19A816192,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=B4AA845F4A3B378A430DEE970EA21160,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=EBDBE65642718C3AFE6C4DA555BBE75A,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/UMG.MultiLineEditableTextBox'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_3 37E920104EC1970553E7B1B7A0F1A100,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=0114427445D5BF882BD021A0ADA7ABDE,PinName="InText",PinType.PinCategory="text",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_4 C5A2540E42F40155E57F0BB8ABCE03E7,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_4" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD:fnAddKeyHUD.K2Node_VariableGet_4'"
 VariableReference=(MemberScope="fnAddKeyHUD",MemberName="Keys",MemberGuid=7CFB4DE2472FB89562B43DA4067A4B19)
 NodePosX=992
 NodePosY=352
 NodeGuid=A3270FFC4465EF5481AF48B00F5471BA
 CustomProperties Pin (PinId=6A48667A431556322F3260BCE07BF9D4,PinName="Keys",Direction="EGPD_Output",PinType.PinCategory="string",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_4 88D7DA8F4B63D050D0CE9DBA14C24612,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_4" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD:fnAddKeyHUD.K2Node_CallFunction_4'"
 bDefaultsToPureFunc=True
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetTextLibrary'",MemberName="Conv_StringToText")
 NodePosX=1168
 NodePosY=336
 NodeGuid=E8EBF7034A600C4555313992BEA56038
 CustomProperties Pin (PinId=90FEC70C49BE0D3AA8F86AA010E742A7,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.KismetTextLibrary'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__KismetTextLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=88D7DA8F4B63D050D0CE9DBA14C24612,PinName="InString",PinType.PinCategory="string",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_4 6A48667A431556322F3260BCE07BF9D4,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=C5A2540E42F40155E57F0BB8ABCE03E7,PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="text",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_3 0114427445D5BF882BD021A0ADA7ABDE,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_Knot Name="K2Node_Knot_1" ExportPath="/Script/BlueprintGraph.K2Node_Knot'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD:fnAddKeyHUD.K2Node_Knot_1'"
 NodePosX=1264
 NodePosY=256
 NodeGuid=A620EF5D4E23E3FD60A8059D79207698
 CustomProperties Pin (PinId=DDF2A20E4100D2F7D9BD929C858B9DA7,PinName="InputPin",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_0 B20B6B23429C7E3CF5AB67AA1405336C,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=FCC2BA7C49BC70BCB08799B19A816192,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_3 41B7A8F748D25E44B71202A38CEEF4E9,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_Knot Name="K2Node_Knot_0" ExportPath="/Script/BlueprintGraph.K2Node_Knot'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD:fnAddKeyHUD.K2Node_Knot_0'"
 NodePosX=128
 NodePosY=144
 NodeGuid=266A278A4B40A59D5564AEBEEC9ACD1D
 CustomProperties Pin (PinId=08C2243645687F98862A67B2DD49127F,PinName="InputPin",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_FunctionEntry_0 CFE8C37F434814AB5DE2B5BE3C41BBB1,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D66035A94FC073620AFE30BD70C8034D,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallArrayFunction_0 0023FAEA4CBA90CBE81DD58061384698,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_Knot Name="K2Node_Knot_2" ExportPath="/Script/BlueprintGraph.K2Node_Knot'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD:fnAddKeyHUD.K2Node_Knot_2'"
 NodePosX=1088
 NodePosY=-96
 NodeGuid=4D7C165A4A1425AF858D68B3E077F40F
 CustomProperties Pin (PinId=3CB38697444E0A16E9C9DCA026F5F896,PinName="InputPin",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_MacroInstance_0 C5746EB5416B4FE296427286BAEBAB1E,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=BE033B11415A97583E2F4F9D9F349A20,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_0 971C45FD4465204369F33C8270D06C93,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_4" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD:fnAddKeyHUD.EdGraphNode_Comment_4'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=32
 NodePosY=-48
 NodeWidth=462
 NodeHeight=220
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Add new key to the array"
 NodeGuid=6CE1811146FE43A29CC268994B6C6779
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_5" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD:fnAddKeyHUD.EdGraphNode_Comment_5'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=512
 NodePosY=-64
 NodeWidth=432
 NodeHeight=256
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Loop through all of the player\'s keys"
 NodeGuid=663AD8B1469A0C8993A56995DFA0A564
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_6" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD:fnAddKeyHUD.EdGraphNode_Comment_6'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=960
 NodePosY=-176
 NodeWidth=784
 NodeHeight=288
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Create a string variable that adds the name of each key and a new line"
 NodeGuid=0E5B9005483075F2AF4D85B6F5F0BF6F
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_7" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD:fnAddKeyHUD.EdGraphNode_Comment_7'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=960
 NodePosY=144
 NodeWidth=736
 NodeHeight=288
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="Add the text to the txtKeys textbox"
 NodeGuid=09459CA6430EB7E98C5E719EF33382D4
End Object

If you copy this snippet into your project, you need to connect the function entry node’s pins to the **Add Unique** node.

Your HUD is ready to go! Now you need to add it to your player character so that it displays on screen when you start the game.

## Update the Player Character

To finish setting up your HUD, you need to add logic to your character blueprint that adds the HUD widget when the game begins, and updates it when the player picks up a key.

### Call FnAddKeyHUD from the Character Blueprint

Connect the key logic in `BP_AdventureCharacter` to the HUD’s logic so that adding a key to the player also adds a key to the HUD.

To trigger the HUD when the player gets a key, follow these steps:

- Open your `BP_AdventureCharacter` blueprint. In the **My Blueprint** panel, in the **Variables **section, click **+** to add a new variable.
- Name the variable `HUD` and change the type to **WBP Player HUD (Object Reference)**. This stores the HUD widget you’ll create in the character’s event graph.
- Go to the section of the Event Graph where **Event fnBPIAddKey** adds a new key to the player’s **HeldKeys **array.In the **Graphs **section of the** My Blueprint** panel, expand **EventGraph **and double-click an event to go to that area of the graph.
- After the **Add **node, connect an **FnAddKeyHUD **node.
- Set up the **FnAddKeyHUD **node:For the **Target**, connect a reference to the **HUD **variable.
- For **Key Type**, connect the pin to the **Event fnBPIAddKey** node’s **Key Type** pin.

Now, this takes the player’s new key and calls the **FnAddKeyHUD **function in the HUD widget blueprint.

- **Save **and **Compile **your blueprint.

### Display the HUD When the Game Starts

To create a HUD when the player spawns in the level, follow these steps:

- Find an empty space in your character’s event graph and add an **Event Possessed **node. This is the event that broadcasts when the player takes control of, or possesses, the player character.
- Right-click the **Event Possessed** node and select **Add Call To Parent Function** to ensure the **Event Possessed **logic in the parent character class still executes. Connect each node’s **exec **and **New Controller** pins.In the top-right corner of your character blueprint, you’ll see it’s derived from the `BP_FirstPersonCharacter` blueprint class. This means your character uses logic from itself and the parent. If you add an event to your character blueprint that already exists in the parent, you’ll override it. When overriding an event, make sure to also call the parent’s version so its logic runs before adding your own.
- To create the HUD, connect a** Create Widget **node, and change its **Class **to **WBP Player HUD**. This creates an instance of your widget blueprint.
- After the **Create Widget** node, add a **Set HUD** node, connecting both pins. This saves the new widget blueprint to your variable.
- To display the HUD object on the screen, add an **Add to Viewport** node. Set its **Target **to your **HUD **variable.While you could connect the** Create Widget** node directly to the **Add to Viewport** node, this tutorial separates creating the widget and drawing it on screen. This is useful when you want the widget ready but hidden until a certain moment, like a combo alert that appears after the player lands several hits. If a widget has a lot of animations, effects, and sounds, it may be best to load it ahead of time to avoid gameplay lag.
- **Compile **and **Save**.

Your new character blueprint logic should look like the following:

 Blueprint

Begin Object Class=/Script/BlueprintGraph.K2Node_Event Name="K2Node_Event_1" ExportPath="/Script/BlueprintGraph.K2Node_Event'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_Event_1'"
 EventReference=(MemberParent="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Core/BPI_PlayerKeys.BPI_PlayerKeys_C'",MemberName="fnBPIAddKey",MemberGuid=5DDCBD08481325B5AB238394857DBDAF)
 bOverrideFunction=True
 NodePosX=-160
 NodePosY=-1120
 NodeGuid=EF46CB6E430961CF70F537BA672FB989
 CustomProperties Pin (PinId=9BA72DAC4678F98FDD59039F467E3E64,PinName="OutputDelegate",Direction="EGPD_Output",PinType.PinCategory="delegate",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(MemberParent="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Core/BPI_PlayerKeys.BPI_PlayerKeys_C'",MemberName="fnBPIAddKey",MemberGuid=5DDCBD08481325B5AB238394857DBDAF),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=7BD469F64A8C918E8B4573908669C6F2,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallArrayFunction_1 D6AC984149E8867DA63F7A84ED1EA506,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F18AD5E443622BDDF51B9EBA89FC7256,PinName="Key Type",PinToolTip="Key Type\nEnum_KeyType Enum",Direction="EGPD_Output",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",LinkedTo=(K2Node_Knot_9 453D81D14171C65AAA2370A7E293E707,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallArrayFunction Name="K2Node_CallArrayFunction_1" ExportPath="/Script/BlueprintGraph.K2Node_CallArrayFunction'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_CallArrayFunction_1'"
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.KismetArrayLibrary'",MemberName="Array_Add")
 NodePosX=288
 NodePosY=-1088
 NodeGuid=4E506DD14BDA1DCD2DACE1B5D9B1A28E
 CustomProperties Pin (PinId=D6AC984149E8867DA63F7A84ED1EA506,PinName="execute",PinToolTip="\nExec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Event_1 7BD469F64A8C918E8B4573908669C6F2,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=9C3593EE4D44E97FC7C5E39CE859153B,PinName="then",PinToolTip="\nExec",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_2 346E22F440A467F3D16E4D9B2A1DEA09,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=EACE828340CF4FE8DF9297B9626E5543,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nKismet Array Library Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.KismetArrayLibrary'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__KismetArrayLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=595FBBAE477B30C98A428DB81CD8F9B6,PinName="TargetArray",PinToolTip="Target Array\nArray of Enum_KeyType Enums\n\nThe array to add item to",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=True,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_5 8EF8D7724EC672D8161CB5BC46D98A5F,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=343DCD734AFE273FBB8B37A59ACB0634,PinName="NewItem",PinToolTip="New Item\nEnum_KeyType Enum (by ref)\n\nThe item to add to the array",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=True,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",LinkedTo=(K2Node_Knot_9 D41656334F60C972E878B59CBC57444C,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=275B0A3340A1BF87EC24B0A63A3669B1,PinName="ReturnValue",PinToolTip="Return Value\nInteger\n\nThe index of the newly added item",Direction="EGPD_Output",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0",AutogeneratedDefaultValue="0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_5" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_VariableGet_5'"
 VariableReference=(MemberName="Held Keys",MemberGuid=02370FF8426FD4E48C7B6D9D50DAE618,bSelfContext=True)
 NodePosX=96
 NodePosY=-1040
 NodeGuid=A597D2C0477E8C4D73EF03AE2229F1FA
 CustomProperties Pin (PinId=8EF8D7724EC672D8161CB5BC46D98A5F,PinName="Held Keys",Direction="EGPD_Output",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=Array,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",LinkedTo=(K2Node_CallArrayFunction_1 595FBBAE477B30C98A428DB81CD8F9B6,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=DCF031F54FC9A709372CAEB99954BB03,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_Knot Name="K2Node_Knot_9" ExportPath="/Script/BlueprintGraph.K2Node_Knot'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_Knot_9'"
 NodePosX=128
 NodePosY=-960
 NodeGuid=9EA340C24CA85FF1522A728783B29DA3
 CustomProperties Pin (PinId=453D81D14171C65AAA2370A7E293E707,PinName="InputPin",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Event_1 F18AD5E443622BDDF51B9EBA89FC7256,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=True,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D41656334F60C972E878B59CBC57444C,PinName="OutputPin",Direction="EGPD_Output",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallArrayFunction_1 343DCD734AFE273FBB8B37A59ACB0634,K2Node_CallFunction_2 2467F46548E4A64DDB3CFCB927A98588,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_4" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.EdGraphNode_Comment_4'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=-224
 NodePosY=-1184
 NodeWidth=1088
 NodeHeight=288
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="(N) When the player gets a key, add it to HeldKeys and the HUD"
 NodeGuid=4AD889D34B3227A6D5B3D7A839A2C763
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_2" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_CallFunction_2'"
 FunctionReference=(MemberParent="/Script/UMG.WidgetBlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD_C'",MemberName="fnAddKeyHUD",MemberGuid=FD29CC12473F258E855875B120C04540)
 NodePosX=624
 NodePosY=-1120
 NodeGuid=202C57114B656130423B059B32CA4535
 CustomProperties Pin (PinId=346E22F440A467F3D16E4D9B2A1DEA09,PinName="execute",PinToolTip="\nExec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallArrayFunction_1 9C3593EE4D44E97FC7C5E39CE859153B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=9D0535CF43CFD48F4BEBD8A0153217D4,PinName="then",PinToolTip="\nExec",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=FB50936C453AF4352BDA7C8A3AE7FE4F,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nWBP Player HUD Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/UMG.WidgetBlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableGet_6 061E879A4A14C317C4344298E529A5E6,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=2467F46548E4A64DDB3CFCB927A98588,PinName="KeyType",PinToolTip="Key Type\nEnum_KeyType Enum",PinType.PinCategory="byte",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.UserDefinedEnum'/Game/AdventureGame/Designer/Blueprints/Core/Enum_KeyType.Enum_KeyType'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="NewEnumerator0",AutogeneratedDefaultValue="NewEnumerator0",LinkedTo=(K2Node_Knot_9 D41656334F60C972E878B59CBC57444C,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="K2Node_VariableGet_6" ExportPath="/Script/BlueprintGraph.K2Node_VariableGet'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_VariableGet_6'"
 VariableReference=(MemberName="HUD",MemberGuid=D5C300AD4E29A6343BAD8689F894D144,bSelfContext=True)
 NodePosX=464
 NodePosY=-1040
 NodeGuid=F0FC52F04FB475A1F730739AAAE755A9
 CustomProperties Pin (PinId=061E879A4A14C317C4344298E529A5E6,PinName="HUD",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/UMG.WidgetBlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_2 FB50936C453AF4352BDA7C8A3AE7FE4F,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=A12310294851DD6DE3C24C930D786EB3,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_Event Name="K2Node_Event_13" ExportPath="/Script/BlueprintGraph.K2Node_Event'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_Event_13'"
 EventReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.Pawn'",MemberName="ReceivePossessed")
 bOverrideFunction=True
 NodePosX=-224
 NodePosY=-784
 NodeGuid=78A1AD7D4E6FAD3664F2B88923AFEF3A
 CustomProperties Pin (PinId=8FEED7DB4B033D4D03FABD962B06F08E,PinName="OutputDelegate",Direction="EGPD_Output",PinType.PinCategory="delegate",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(MemberParent="/Script/CoreUObject.Class'/Script/Engine.Pawn'",MemberName="ReceivePossessed"),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=8B159FB34B611A623F561E8A72C96CFD,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallParentFunction_0 F3220F844D254A26B0DCEF8DB8F6A5AD,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=844EDF0943FC0E05B4F64B92F2752AD5,PinName="NewController",PinToolTip="New Controller\nController Object Reference",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Controller'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallParentFunction_0 3AF0E8C940B1D19E904A759F4CE0EA45,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallParentFunction Name="K2Node_CallParentFunction_0" ExportPath="/Script/BlueprintGraph.K2Node_CallParentFunction'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_CallParentFunction_0'"
 FunctionReference=(MemberParent="/Script/Engine.BlueprintGeneratedClass'/Game/FirstPerson/Blueprints/BP_FirstPersonCharacter.BP_FirstPersonCharacter_C'",MemberName="ReceivePossessed",MemberGuid=2A42AC3644D77D6702BCA3A4144F182D)
 NodePosY=-784
 NodeGuid=12FC749B45CAE014317EA9859390FA1D
 CustomProperties Pin (PinId=F3220F844D254A26B0DCEF8DB8F6A5AD,PinName="execute",PinToolTip="\nExec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Event_13 8B159FB34B611A623F561E8A72C96CFD,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=F16A6AF546480408D73396A5CC0099A6,PinName="then",PinToolTip="\nExec",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CreateWidget_0 55A6D7FE4304CCBAA1C2AEB382A5E125,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=D97919244EF7018C15008B8A86CF5CAF,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nPawn Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Pawn'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=3AF0E8C940B1D19E904A759F4CE0EA45,PinName="NewController",PinToolTip="New Controller\nController Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.Controller'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Event_13 844EDF0943FC0E05B4F64B92F2752AD5,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UMGEditor.K2Node_CreateWidget Name="K2Node_CreateWidget_0" ExportPath="/Script/UMGEditor.K2Node_CreateWidget'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_CreateWidget_0'"
 NodePosX=240
 NodePosY=-784
 NodeGuid=75D3B45041537D81E113DFA67D768B23
 CustomProperties Pin (PinId=55A6D7FE4304CCBAA1C2AEB382A5E125,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallParentFunction_0 F16A6AF546480408D73396A5CC0099A6,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=DEEAB73745D8736F5EDB38998D19F3B0,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_0 32D780714578BB4BB46DCB983EE1613D,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=79BA7CA2446CF5C6D1AC9EA1AF856F8A,PinName="Class",PinToolTip="User Widget Class Reference Class\nThe object class you want to construct",PinType.PinCategory="class",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/UMG.UserWidget'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD_C",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=847F903740946FE470038E912EC9113E,PinName="ReturnValue",PinToolTip="WBP Player HUD Object Reference Return Value\nThe constructed object",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/UMG.WidgetBlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_0 DC875F2A4A1572A28875B7BAF8990C7C,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=36D8E84D4A799AFF955B81BA6E6F4433,PinName="OwningPlayer",PinToolTip="Player Controller Object Reference Owning Player\nThe player that \'owns\' the widget.",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/Engine.PlayerController'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableSet Name="K2Node_VariableSet_0" ExportPath="/Script/BlueprintGraph.K2Node_VariableSet'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_VariableSet_0'"
 VariableReference=(MemberName="HUD",MemberGuid=D5C300AD4E29A6343BAD8689F894D144,bSelfContext=True)
 NodePosX=592
 NodePosY=-768
 NodeGuid=250BF8FD4B6EFE308C78C59EDF76BDBC
 CustomProperties Pin (PinId=32D780714578BB4BB46DCB983EE1613D,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CreateWidget_0 DEEAB73745D8736F5EDB38998D19F3B0,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=B3702DD94DF229F48F0122A5ECFD406B,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_10 919350024A9602F2833A4F970691C058,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=DC875F2A4A1572A28875B7BAF8990C7C,PinName="HUD",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/UMG.WidgetBlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CreateWidget_0 847F903740946FE470038E912EC9113E,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=52C3818948BD31812A65509492A3F36A,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/Engine.BlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=7FDCB2B34B1DDFE784C3DC89F633B94A,PinName="Output_Get",PinToolTip="Retrieves the value of the variable, can use instead of a separate Get node",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/UMG.WidgetBlueprintGeneratedClass'/Game/AdventureGame/Designer/Blueprints/Widgets/WBP_PlayerHUD.WBP_PlayerHUD_C'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_10 4F2D493A49303A4BE3FB59825CC8F8FB,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_10" ExportPath="/Script/BlueprintGraph.K2Node_CallFunction'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.K2Node_CallFunction_10'"
 FunctionReference=(MemberParent="/Script/CoreUObject.Class'/Script/UMG.UserWidget'",MemberName="AddToViewport")
 NodePosX=752
 NodePosY=-800
 AdvancedPinDisplay=Hidden
 NodeGuid=CBA041AE48ACB46570C5A0B93E725448
 CustomProperties Pin (PinId=919350024A9602F2833A4F970691C058,PinName="execute",PinToolTip="\nExec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_0 B3702DD94DF229F48F0122A5ECFD406B,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=BE8D594045EFC1C3102664A4D249A76D,PinName="then",PinToolTip="\nExec",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=4F2D493A49303A4BE3FB59825CC8F8FB,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\nUser Widget Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.Class'/Script/UMG.UserWidget'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_VariableSet_0 7FDCB2B34B1DDFE784C3DC89F633B94A,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
 CustomProperties Pin (PinId=4DA9AE7C475F395771DBB7BD84650596,PinName="ZOrder",PinToolTip="ZOrder\nInteger\n\nThe higher the number, the more on top this widget will be.",PinType.PinCategory="int",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="0",AutogeneratedDefaultValue="0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,)
End Object
Begin Object Class=/Script/UnrealEd.EdGraphNode_Comment Name="EdGraphNode_Comment_3" ExportPath="/Script/UnrealEd.EdGraphNode_Comment'/Game/AdventureGame/Designer/Blueprints/Characters/BP_AdventureCharacter.BP_AdventureCharacter:EventGraph.EdGraphNode_Comment_3'"
 CommentColor=(R=0.150000,G=0.150000,B=0.150000,A=0.500000)
 bCommentBubbleVisible_InDetailsPanel=False
 NodePosX=-265
 NodePosY=-873
 NodeWidth=1248
 NodeHeight=272
 bCommentBubblePinned=False
 bCommentBubbleVisible=False
 NodeComment="(N) Create and display the HUD when the player spawns"
 NodeGuid=1C67EBD240C545FD8F49C29AC42E7664
End Object

## Test the HUD

Click **Play **to test out your game. When the game begins, you should see the player’s HP and Keys Collected labels displayed on the HUD. Touching a key should add the name of that key to the HUD.

Make adjustments to the HUD if you wish. Some things you could try on your own are:

- Adjust the overlay panel’s size.
- Change font sizes and styles.
- Move the placement to other areas than the top-left.
- Add different widgets for backgrounds, such as textures or materials.

To take your HUD further, try experimenting with replacing the text labels with icons. To do this, import an image into the Content Browser and add it to your HUD with an Image widget. For more information about importing assets into Unreal Editor, see Importing Assets Directly (-> importing-assets-directly-into-unreal-engine).

## Designing Effective HUDs

Here are some more design strategies to create a clean, player-friendly HUD.

**Make It Easy to Read:**

Use high-contrast text, clean fonts, and appropriate font sizes. Ensure your HUD is readable at a typical viewing distance from the screen and when the player is moving through a busy environment, not just while standing still.

**Keep it Clear and Concise:**

Only show what the player needs right now and hide or minimize less relevant information until it’s needed. However, the player should always be able to see what they need at a glance so they can make confident decisions.

**Add Feedback:**

When the HUD updates (like picking up a key), use a short animation, color change, or sound to make the player aware of the change.

**Prioritize with Size and Position:**

Important information should stand out — use bigger text, bold colors, or place this information near the top-left or center where players naturally look first.

## Next Up

In the next section, you’ll keep adding more gameplay elements to your level and learn how to program a switch to perform an action when pressed.

- [image: Puzzles: Switches and Cubes] Puzzles: Switches and CubesIn the first part of the platformer puzzle section, use materials, physics, and blueprints to create a switch that’s activated by a cube. (-> designer-05-puzzles-switches-and-cubes-in-unreal-engine)

- ui
- user interface
- blueprints
- beginner

On this page

- Before You Begin (-> designer-04-player-hud-in-unreal-engine)
- Create a Widget Blueprint (-> designer-04-player-hud-in-unreal-engine)
- Explore the Widget Blueprint Editor (-> designer-04-player-hud-in-unreal-engine)
- Start With a Canvas Panel (-> designer-04-player-hud-in-unreal-engine)
- Build the Layout for Your HUD (-> designer-04-player-hud-in-unreal-engine)
- Add Text Labels (-> designer-04-player-hud-in-unreal-engine)
- Add Space for a Variable (-> designer-04-player-hud-in-unreal-engine)
- Layer in a Special Effect (-> designer-04-player-hud-in-unreal-engine)
- Build the HUD’s Logic (-> designer-04-player-hud-in-unreal-engine)
- Set Up Building Blocks for Key Pickups (-> designer-04-player-hud-in-unreal-engine)
- Print the Player’s Keys On Screen (-> designer-04-player-hud-in-unreal-engine)
- Update the Player Character (-> designer-04-player-hud-in-unreal-engine)
- Call FnAddKeyHUD from the Character Blueprint (-> designer-04-player-hud-in-unreal-engine)
- Display the HUD When the Game Starts (-> designer-04-player-hud-in-unreal-engine)
- Test the HUD (-> designer-04-player-hud-in-unreal-engine)
- Designing Effective HUDs (-> designer-04-player-hud-in-unreal-engine)
- Next Up (-> designer-04-player-hud-in-unreal-engine)

Related documents

Puzzles: Switches and Cubes

 [image: Puzzles: Switches and Cubes] (-> designer-05-puzzles-switches-and-cubes-in-unreal-engine)
