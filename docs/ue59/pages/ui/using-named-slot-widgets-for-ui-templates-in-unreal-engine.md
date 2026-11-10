# Named Slot Widgets

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-named-slot-widgets-for-ui-templates-in-unreal-engine?application_version=5.9

> Create easily templated widgets using Named Slots.

[image: Named Slot Widgets]

When creating a complex user interface, you might need to re-use heavily templated widgets. As an example, you could display a character's status alongside different sets of information depending on which UI or HUD it is used in. One version could need a large character portrait, another version could need a name-only bar for a more compact display, and another may need to show additional information about the character's statistics.

**Named Slot Widgets** are specialized for acting as placeholders in templated UI like the above example. When you add a Named Slot to a widget's hierarchy, it appears in the hierarchy of any child classes of that widget. This makes it possible to easily create multiple versions of a widget with different sub-widgets injected into them.

Example of using Named Slots to create multiple derivatives of the same UMG widget.

Alternatively, you can use your Named Slot to easily preview what your widget will look like with different sub-widgets added in, then fill the Named Slot at runtime depending on where it appears in your UI. In either case, Named Slots reduce the need for duplication in your UMG widget classes.

## Behavior

Named Slots are containers that support only one child widget. When not holding a child, Named Slots display with their name in the center, surrounded by a dotted outline around their bounds.

 [image: Example of Named Slot Widgets]

This makes it easy to visualize the location and size of the Named Slot, and makes it easier to distinguish between multiple Named Slots.

You can drag and drop any widget as a child of your Named Slot to display it directly in the **UMG Designer** view. Additionally, unlike other widgets, Named Slots appear in the hierarchy of any widgets extended from their parent widget. This makes it easier to reference them and provides you with consistent visibility in the UMG Designer tab, no matter how deep in your widgets classes' hierarchy you are.

 [image: Example of how Named Slots appear in child classes]

Alternatively, you can use the **Pre Construct **event to add a child widget through code.

 [image: Adding a child widget to a Named Slot with pre construct]

Because Pre Construct runs when the widget displays in the UMG designer, you can also preview child widgets added with this method.

## How to Use Named Slot Widgets

The following sections provide instructions on how to add a Named Slot to a widget and how to fill it in derived widgets. This example uses a template for a dialog box, usable for pop-up menus such as warnings or prompts.

### 1. Create a Template Widget Using Named Slots

First, create a simple dialog box widget using two Named Slots. One will hold interactive elements, while the other will hold content such as messages.

- Create a new UMG Widget in the **Content Browser**. Name it `UI_DialogBox_Template`.

- Open `UI_DialogBox_Template`, then change the **Screen Size** setting to **Custom**. Set the size to a width of **750 **and a height of **175**. [image: Screen size settings for UI_DialogBox_Template]

- Add a **Border** to the hierarchy. Set its **Appearance **> **Brush Color **to solid black ( 0.0, 0.0, 0.0 ). [image: Border color settings for the Dialog Box]

- Add a **Vertical Box** inside your Border.

- Add two **Named Slot **widgets to your Vertical Box. Name the first one `Slot_Content`** **and the second one `Slot_Interaction`.

- In each of your Named Slots, apply the following settings: **Size:** Fill

- **Vertical Alignment**: Fill Vertically

- **Horizontal Alignment**: Fill Horizontally.

If you followed the instructions above, your widget should look like this:

The UI_DialogBox_Template widget as handled in the instructions above. Two Named Slots occupy a vertical box inside a border.

This serves as a base for other versions of the widget.

### 2. Fill Named Slots Using Drag-and-Drop

Next, create a derived widget and fill it with the needed elements for a warning prompt. This prompt needs do the following:

- Display a warning about an operation the user is doing.

- Provides Confirm and Cancel buttons so the user can choose whether to continue the operation.

As an example, this type of prompt would be used if the user changed their screen resolution, and would ask if they want to keep or discard changes. This section will guide you through building the layout for this type of widget using drag-and-drop operations in your Named Slots.

- Create a new Blueprint derived from `UI_DialogBox_Template`. Call it `UI_DialogBox_Warning`.

- Open the Designer tab for `UI_DialogBox_Warning`.

- Add a **Horizontal Box** to `Slot_Content`.

- Add an **Image** widget named `Content_Image` to `Slot_Content`'s Horizontal Box. Give it the following settings: **Size:** Auto

- **Horizontal Alignment:** Left

- **Vertical Alignment:** Top

- **Image Size:** 64 x 64 The images shown use an icon created for this tutorial as an example. This is not included with the engine, and it is not required to follow along with the essential information in this tutorial, but you can make your own and apply it to `Content_Image`.

- Add a **Text** widget named `Content_Text` to `Slot_Content`'s Horizontal Box. Give it the following settings: **Size: **Fill

- **Horizontal Alignment: **Fill Horizontally

- **Vertical Alignment: **Fill Vertically

- **Font > Size: **18

- Set the **Text** field of `Content_Text` to say "Do you want to keep these changes?"

- Put a **Spacer** between `Content_Image` and `Content_Text` and give it a width of **10**.

- Compile and save your widget. It should appear as follows: The UI_DialogBox_Warning with a warning icon and text. Note that the original vertical box from the template is hidden, but the named slots are all visible.

### 3. Fill Named Slots With the Pre Construct Event

Finally, to provide the buttons for the warning dialog box, create a sub-widget with two buttons, then add it in the Pre Construct Event for `UI_DialogBox_Warning`.

#### 3a. Create the Binary Prompt Buttons

The prompt's buttons consist of two buttons with text labels added to them. The following steps will walk you through constructing them in a way that will align them to the center of the prompt.

- Create a new **User Widget** called `UI_BinaryPromptButtons`, then open it.

- Change the **Screen** type to **Custom**, then set the **Width** to **500** and the **Height** to **75**. [image: The Screen Size settings for UI_BinaryPromptButtons]

- Add a **Horizontal Box**, then add two **Size Box** widgets inside it. Name them `SizeBox_Button_Left` and `SizeBox_Button_Right`.

- Add a **Spacer** between `SizeBox_Button_Left` and `SizeBox_Button_Right`. Set its width to **40**.

- Give `SizeBox_Button_Left`** **and `SizeBox_Button_Right`** **the following settings: `SizeBox_Button_Left` **Size:** Fill

- **Horizontal Alignment:** Right

- **Vertical Alignment:** Center

- `SizeBox_Button_Right` **Size:** Fill

- **Horizontal Alignment:** Left

- **Vertical Alignment:** Center

- **Both SizeBox widgets** **Width Override:** 150

- **Height Override:** 50

This will center both boxes in the middle of the prompt.

- Add a **Button Widget** to both Size Boxes. Name the left button **ConfirmButton** and the right button **CancelButton**.

- Add a **Text Widget** to both buttons. Give both of them the following settings: **Font Size: **16

- **Color: **Black ( 0.0, 0.0, 0.0 )

- Set the text for ConfirmButton to say "**Confirm**" and set the text for CancelButton to say "**Cancel**."

- Compile and save your widget. It should appear as follows:

#### 3b. Add the Binary Prompt Buttons Using Pre Construct

- Create an instance of the binary prompt widget on the Pre Construct Event in `UI_DialogBox_Warning`, then add it as a child of Slot_Interaction.

- Open` UI_DialogBox_Warning`, then open the **Graph** tab to edit its Blueprint graph.

- Add a **Create Widget** node. Set its **Widget Class** to `UI_BinaryPromptButtons`** **and connect it to the **Pre Construct** function.

- Add a **Get Owning Player **node and connect it to the **Owning Player** pin for the Create Widget node.

- Drag from the **Output **pin and **Promote **it to a variable. Name it **PromptButtonWidget**.

- Create a **Get **node for `Slot_Interaction`. Drag off its pin and create an **Add Child** node.

- Connect **PromptButtonWidget** to the **Add Child** node. The full Blueprint code used in the instructions above.

- Compile and save your Widget Blueprint, then switch back to the **Designer **tab. The completed UI_DialogBox_Warning widget.

Your button widget appears in place of the Named Slot as if its contents were added to the hierarchy.

### Expose on Instance Only

 [image: The Expose on Instance Only setting in the Details panel]

The **Expose on Instance Only** setting is `false` by default. When you set it to `true`, you can access the Named Slot in any instances of your widget through code, but it will not appear in the hierarchy for any derived widgets.

As an example, in the `UI_DialogBox_Template` widget detailed above, if you set `Slot_Interaction`'s Expose on Instance Only property to `true`, you can still access the Named Slot in the base Widget Blueprint normally. However, in derived classes such as `UI_DialogBox_Warning`, `Slot_Interaction` will not appear in the Hierarchy in the Designer tab.

However, you can still access Slot_Interaction through code. This can be useful if you want to enforce a specific function, event, or callback for populating the Named Slot.

If you set Expose on Instance Only to True on a Named Slot widget that is already being used in derived classes, the widgets you added will remain where you put them, but the Named Slot will not be visible in the hierarchy.

## On Your Own

To explore more of the utility of Named Slots, try creating your own widget derived from `UI_DialogBox_Template`. The following screenshot shows an example of a prompt with a message and a single "Continue" button. This provides a way to tell the user that an operation – such as saving their game – is complete.

Alternatively, you can intentionally leave slots open for child classes to fill later. For example, instead of constructing the warning prompt all at once, you could construct a binary prompt with the Cancel and Confirm buttons in `Slot_Interaction`, but leave the `Slot_Content` slot open. You could then create derivatives that fill `Slot_Content` with different message layouts.

- ui
- umg
- widget
- named slots
- widget slots
- widget reference

On this page

- Behavior (-> using-named-slot-widgets-for-ui-templates-in-unreal-engine)
- How to Use Named Slot Widgets (-> using-named-slot-widgets-for-ui-templates-in-unreal-engine)
- 1. Create a Template Widget Using Named Slots (-> using-named-slot-widgets-for-ui-templates-in-unreal-engine)
- 2. Fill Named Slots Using Drag-and-Drop (-> using-named-slot-widgets-for-ui-templates-in-unreal-engine)
- 3. Fill Named Slots With the Pre Construct Event (-> using-named-slot-widgets-for-ui-templates-in-unreal-engine)
- 3a. Create the Binary Prompt Buttons (-> using-named-slot-widgets-for-ui-templates-in-unreal-engine)
- 3b. Add the Binary Prompt Buttons Using Pre Construct (-> using-named-slot-widgets-for-ui-templates-in-unreal-engine)
- Expose on Instance Only (-> using-named-slot-widgets-for-ui-templates-in-unreal-engine)
- On Your Own (-> using-named-slot-widgets-for-ui-templates-in-unreal-engine)
