# Text To Speech Quickstart

https://dev.epicgames.com/documentation/en-us/unreal-engine/text-to-speech-quickstart-in-unreal-engine?application_version=5.9

> How to create and enable a simple Text To Speech widget.

This guide describes how to create and enable a simple **Text To Speech** widget with two buttons. Each button vocalizes a text string when a user clicks it.

## Required Knowledge and Setup

Before you can complete the steps outlined on this page:

- Make sure you're familiar with the basic principles of the Unreal Motion Graphics (UMG) UI Editor.

- Create a new Unreal Engine project. You can use any template you like.

- Enable the Text To Speech plugin for your project. If you need more help with completing this step, refer to the Working with Plugins (-> working-with-plugins-in-unreal-engine) page.

## Create a New Widget Blueprint

In this step, you will create a widget that displays on-screen.

- In the **Content Browser** or **Content Drawer**, right-click an empty area. In the **context menu**, select **User Interface > Widget Blueprint**. [image: Create a new Widget Blueprint]

- Select the **User Widget** class, then click **Select** to create your widget. [image: Select widget class]

- Name your new widget **MyWidget**.

- Double-click the **Widget Blueprint** to open it in the **Widget Editor**, then create a simple layout with two buttons, as shown below. The size and placement of the buttons is not important for the purpose of this tutorial, as long as you can click them easily. [image: An example widget layout]

- **Compile** and **Save** your Widget, then minimize the Widget Editor.

## Add Your Widget to the Level Blueprint

Next, add your widget to the Level Blueprint so that it will be drawn on-screen when the game starts.

- From the **Main Toolbar**, open the **Level Blueprint**. [image: Open the Level Blueprint]

- In the **Level Blueprint**, drag from the **Event BeginPlay** node's execute pin. Search for and select **Create Widget**, then press the **Enter** key to create the node. [image: Create a new widget node] [image: Create a new widget node]

- Drag from the **Create Widget** node's execute pin and create an **Add to Viewport** node. [image: Create a new Add to Viewport node]

- Drag from the **Add to Viewport** node's execute pin and create a **Set Input Mode UI Only** node. [image: Create a Set Input Mode UI Only node] This node tells your Widget the only game element that responds to player input is the UI. Any other input from the user will not translate to gameplay actions, even if an action is bound to that control.

- Right-click in a free area of the **Blueprint Editor** and create a **Get Player Controller** node. [image: Create a Get Player Controller node]

- Connect the **Return Value** pin of the **Construct Widget** node you created in step 2 to the following pins: **Target **on the **Add to Viewport** node.

- **In Widget to Focus** on the **Set Input Mode UI Only** node.

- Connect the **Return Value** pin of the **Get Player Controller** node you created in step 5 to the **Player Controller** pin on the **Set Input Mode UI Only** node. At this stage, your Level Blueprint should look like the image below. [image: Partial Level Blueprint]

- Drag from the **Return Value** pin of the **Get Player Controller** node and create a **Set Show Mouse Cursor** node. Enable the **Show Mouse Cursor** checkbox for this node.

- Connect the **Set Input Mode UI Only** node output pin to the **Set Show Mouse Cursor** node input pin. [image: Connect the Set Show Mouse Cursor node]

- Set the **Class** value of the **Create Widget** node to the **MyWidget** widget you created in the previous section. [image: Set widget class to MyWidget]

- **Compile** and **Save** your Blueprint.

Your finished Level Blueprint should look like this:

Click the image for full size.

You can now close the Level Blueprint.

## Add Text to Speech Strings

Next, create a channel for each button to "speak" on, and enter the text strings that will be vocalized.

- Return to the **Widget Editor** for your widget. If you closed it, double-click the **MyWidget** widget in the **Content Browser** to open it again.

- Click one of the buttons you created. Then, in the **Details** panel on the right, scroll down to **Events** and click **(+) plus** to add a new **On Clicked** event. [image: Add OnClicked event] This action will open the Widget's **Graph** and create a new **On Clicked** node for this button.

- Right-click in the graph and create a new **Get TextToSpeechEngineSubsystem** node. [image: Create a Get Text To Speech Engine Subsystem node] If you can't see this node, make sure that the **Text To Speech** plugin is enabled for your project.

- Drag from the **Text to Speech Engine Subsystem** node and create a new **Add Default Channel** node. Connect the** On Clicked** event to the **Add Default Channel** node **input** pin. [image: Create an Add Default Channel node]

- In the **Add Default Channel** node, right-click the **New Channel ID** property and select **Promote to Variable** from the context menu. [image: Promote the New Channel ID property to a variable]

- In the **Details** panel on the right, using the **Variable Name** property, name the variable **Channel One**. [image: Rename the variable]

- Drag again from the **Text to Speech Engine Subsystem** node and create a new **Activate Channel** node. Connect the **Add Default Channel** node output pin to the **Activate Channel** node input pin. [image: Create an Activate Channel node]

- Connect the **Channel One** variable you created in step 4 to the **Channel ID** pin on the **Activate Channel** node. At this stage, your Blueprint should look like this: Click the image for full size.

- Drag again from the **Text to Speech Engine Subsystem** node and create a new **Speak on Channel** node. Connect the **Activate Channel** node output pin to the **Speak on Channel** node input pin. [image: Create a Speak on Channel node]

- Connect the **Channel One** variable you created in step 4 to the **Channel ID** pin on the **Activate Channel** node.

- Drag from the **String to Speak** pin on the **Speak on Channel** node and create a new **To String (Text)** node. [image: Create a String to Speak node]

- Drag from the input pin of the **to String (Text)** node you created in the previous step and create a new **Format Text** node. [image: Create a Format Text node]

- In the **Format** box of the **Format Text** node, enter the text you want to be spoken. [image: Enter the string to be spoken]

- Repeat steps 1-12 above for the second button you created, changing Channel One to Channel Two where appropriate. You can click and drag to select multiple Blueprint nodes, then copy and paste them. This reduces the need for manual step duplication.

- **Compile** and **Save** the Blueprint.

Your finished Widget Blueprint should now look like this:

Click the image for full size.

## Test your Widget

Now, it's time to test your widget.

In the **Level Viewport**, on the **Main toolbar**, click the **Play** button to enter **Play in Editor** mode.

 [image: Play button on the Main Toolbar]

You should now see your widget drawn inside the viewport. Click a button to hear its string vocalized.

 [image: Completed widget in the Level Viewport]
