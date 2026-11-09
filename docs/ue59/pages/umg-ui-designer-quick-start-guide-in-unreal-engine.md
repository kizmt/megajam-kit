# UMG UI Designer Quick Start Guide

https://dev.epicgames.com/documentation/en-us/unreal-engine/umg-ui-designer-quick-start-guide-in-unreal-engine?application_version=5.9

> Getting started with using Unreal Motion Graphics.

[image: UMG UI Designer Quick Start Guide]

This **Quick Start Guide** shows you how to implement some basic in-game HUD elements using **Unreal Motion Graphics UI Designer (UMG)**. Get familiar with example of the process of creating dynamic elements: health bar, energy bar, and counter of ammo. Also learn how to add them to the **Viewport**.

All actions are described step by step and in detail. However, if you have never worked with **Unreal Engine**, then it is recommended that you first familiarize yourself with the Level Designer Quick Start (-> level-designer-quick-start-in-unreal-engine). Here you will find basic knowledge and terminology for working with UE. Also, this course contains links to more detailed information. Check them out if necessary.

## 1 - Required Project Setup

For this tutorial, use the **Blueprint First Person** template with **Starter Content** enabled.

Character appears unarmed at the start of game process. Ammo indication should appear in case Character take a weapon. For this reason, use two Widgets: HUD and HUD_AmmoCount. You should adjust HUD Widget to display health and energy of the Character from the start of game process, and HUD_AmmoCount Widget to display ammo in case taking a weapon.

- Create **Widget Blueprint**. Click the **Add New** in the **Content Browser**, then select **User Interface > Widget Blueprint**. Name this widget **HUD**. Use a Widget Blueprint to create and set up UI elements (HUD, Menus, and so on). With the help of this, you can visually layout UI elements and provide scripted functionality for it. For more information on Widget Blueprints see Widget Blueprints in UMG (-> level-designer-quick-start-in-unreal-engine).

- Create three more Widget Blueprints, name it **HUD_AmmoCount**, **MainMenu**, **PauseMenu**.

- Create new **Level**. **Right-click** in the **Content Browser** select **Level**. Name it **Main**. You will use this later in the guide for Main Menu setup.

### Adjusting BP_FirstPersonCharacter Blueprint

- In the **Content Browser**, open the **BP_FirstPersonCharacter** Blueprint located under the **Content/FirstPerson/Blueprints** folder. This is the **Character Blueprint** you control in the game. You should adjust it to construct HUD Widget and display it in a viewport.

- In the **Blueprint Editor** window, click the **Add Variable** Button.

- In the **Details** panel of this variable, select a **Float** variable type and input the name **Health**. Set the **Default Value** to **1.0**. You will use this variable for adjusting Health Bar of the character in the the HUD Widget.

- Create another variable with **Float** type and name it **Energy**. Set the **Default Value** to **1.0**. You will use this variable for adjusting Energy Bar of the character in the the HUD Widget. You should compile Blueprint by clicking the **Compile** button from the Tool Bar before input a Default Value.

- Create another variable with **Integer** type and name it **Ammo**. Set the **Default Value** to **25**.

- Create one more variable with **Integer** type and name it **MaxAmmo**. Set the **Default Value** to **25**.

- **Right-click** inside the **Graph** window, add the **Event Begin Play** node, then add a **Create Widget** node. Set the **Class** to **HUD** Widget.

- For the **Return Value** of the **Create HUD Widget**, select **Promote to Variable** and name it **HUD Reference**. With the help of this, you create HUD Widget, when the game is started, and set it as a variable for later calls. This is usefull in case you need call some functions or set properties of the HUD Widget via Blueprint. For example, if you need hide the HUD, while the game is paused, you can access the HUD through this variable.

- Add the **Add to Viewport** node to the out pin of the **Set** node. With the help of this, you've added the HUD Widget to the viewport from start of game process.

- **Compile** and **Save** the **BP_FirstPersonCharacter** Blueprint and close it.

### Adjusting BP_Rifle Blueprint

The process of adjusting BP_Rifle Blueprint is similar to adjusting BP_FirstPersonCharacter Blueprint. In case you need more detail see section above Adjusting BP_FirstPersonCharacter Blueprint (-> umg-ui-designer-quick-start-guide-in-unreal-engine).

- In the **Content Browser**, open the **BP_Rifle** Blueprint located under the **Content/FirstPerson/Blueprints** folder.

- Find the **On Component Begin Overlap (SphereCollision)** node. **Right-click** on the execution pin and select **Break All Pin Link(s)**.

- Drag the execution pin of the **On Component Begin Overlap (SphereCollision)** node and add a **Create Widget** node. Set the **Class** to **HUD_AmmoCount** Widget.

- For the **Return Value** of the **Create HUD Widget**, select **Promote to Variable** and name it **HUD Ammo Count Ref**.

- Add the **Add to Viewport** node to the out pin of the **Set** node.

- Connect the execution pin of the **Add to Viewport** node with the execution pin of the **Cast to BP_FirstPersonCharacter** node. Your script should look as following. With the help of this, you've added the HUD_AmmoCount Widget to the viewport in case Character take a weapon.

- **Compile** and **Save** the **BP_Rifle** Blueprint and close it.

### Adjusting Character Variables in BP_FirstPersonCharacter Blueprint

In this chapter you can find information about the adjusting declaired variables and adding them to the Blueprint.

- In the Blueprint Editor of the **BP_FirstPersonCharacter**, hold **Alt** and drag the **Energy** variable into **Graph** window and place it next to the Jump script.

- Hold **Ctrl** and drag a copy of the **Energy** variable into **Graph** window. Add **Substruct** operator node, connect and set to **0.25** as shown below. With the help of this script, every time the Character jumps, the Energy is reduced by 0.25 from current Energy value.

- Set up the same script for the **Health** variable but use an **F** Key Event (or any other key press event) for testing. With the help of this script, you will be able to test if Health is reduced by 0.25 from current value, every time you press **F**.

- **Compile** and **Save** the **BP_FirstPersonCharacter** Blueprint and close it. To add the ability to reload ammo do the following. Add the **R Key Event**. Hold **Alt** and drag the **Ammo** variable. Hold **Ctrl** and drag the **Max Ammo** variable. Connect it as shown in the image below.

### Adjusting Character Variables in BP_Rifle Blueprint

- Open **BP_Rifle** Blueprint. Find the **OnFireProjectile Custom Event**. **Right-click** on the execution pin and select **Break All Pin Link(s)**.

- Near this node, **Right-click** and add a **Branch** node.

- Hold **Ctrl** and drag a copy of the **FirstPersonCharacterReference** variable into **Graph** window. Drag the pin and select **Get Ammo**.

- Add **Greater** operator node, set to **0** and connect as shown below. Character you play can fire if their ammo is greater than zero, due to this script.

- At the end of the **OnFireProjectile Custom Event** script following the **Montage Play** node, hold **Ctrl** and drag a copy of the **FirstPersonCharacterReference** variable into **Graph** window. Drag the pin and select **Get Ammo**. Drag the pin again and select **Set Ammo**.

- Add **Substruct** operator and set **Ammo** to equal **Ammo - 1**. Your script should look as following. Every time Character you play fires it decreases ammo by one, due to this script.

- **Compile** and **Save** the **BP_Rifle** Blueprint and close it.

## 2 - Displaying Health, Energy & Ammo

At this step you should set up the visualization of Health, Energy and Ammo variables in the Widgets and adjust connection with game process.

### Visual: Health and Energy

To set up the visualization of HUD Widget do the following.

- Open **HUD** Widget Blueprint to access the **Widget Blueprint Editor**. With the help of this, you can create the visual layout and scripted functionality of HUD Widget. For more information on the different facets of the Widget Blueprint Editor, see Widget Blueprints in UMG (-> widget-blueprints-in-umg-for-unreal-engine).

- Find the **Horizontal Box** in the **Palette** panel under **Panel** and drag it onto the **Canvas Panel** in the **Hierarchy** panel. **Panel** Widgets are like containers for other widgets. You can provide additional functionality for the widgets that are inside it.

- Also under **Panel**, drag two **Vertical Boxes** onto the **Horizontal Box**.

- Under **Common**, drag two **Text** widgets onto the first Vertical Box and two **Progress Bars** onto the second Vertical Box.

- Select the **Horizontal Box**, find it in the **Graph**, resize the box and place it in the upper left corner of the window.

- Select both **Progress Bars**, then in the **Details** panel set both to **Fill** under **Size**.

- Select the **Vertical Box** containing the Progress Bars, then in the **Details** panel set both to **Fill** under **Size** as well.

- Select the **Horizontal Box** again and resize it so the bars line up with the text.

- Select the top-most **Text** widget in the **Hierarchy** panel, then in the **Details** panel under **Content** enter **Health:**.

- Do the same for the other **Text** widget, but enter **Energy:**. It should look as following. By default, UMG text widgets use a font from Unreal Engine. It allows you get started work in Unreal Engine quickly. However, this built-in font has some limitations. For example, it only supports a small set of languages. In most cases, it is necessary import custom fonts into Assets. For more details about setting up text widgets to use custom fonts see Creating and Assigning Fonts in Unreal Engine User Interface (-> creating-and-assigning-fonts-in-unreal-engine-user-interface).

- Select the **Progress Bar** next to **Health**, then in the **Details** panel set the **Fill Color and Opacity** to green color. Progress Bar does not change color when assigning a color. This is because the **Percent** value to fill the bar is set to 0.0. You can change this to test out different colors. Later you will link this to the Health variable value of the Character.

- Also set a Fill Color and Opacity for the **Energy** bar (For example, an orange color).

- Your HUD Widget layout should look as following.

- **Compile** and **Save** the **HUD** Widget Blueprint and close it.

### Visual: Ammo

To set up the visualization of HUD_AmmoCount Widget do the following.

- Open **HUD_AmmoCount** Widget Blueprint to access the **Widget Blueprint Editor**.

- Use the same way to add widgets to the **Hierarchy** panel. Your structure of layout should look as following.

- Select the **Horizontal Box** in the **Graph**, resize the box and place it in the upper right corner of the window.

- Select the **Horizontal Box**, then in the **Details** panel click **Anchors** and select the upper-right Anchor. With the help of this, you place the **Anchor Medallion** to the upper right corner of your screen. You fix the Horizontal Box position regardless of screen size, due to the Anchors settings. The Widget stays the same distance from the Anchor Medallion when the screen is resized. You can test different screen sizes by clicking and changing the **Preview Size** option inside the graph.

- **Compile** and **Save** the **HUD_AmmoCount** Widget Blueprint and close it.

### Script: Health and Energy

The next step is provide functionality for the **HUD** Widget elements.

- Open **HUD** Widget Blueprint to access the **Widget Blueprint Editor**.

- Click the **Graph** button in the upper right corner of the Widget Blueprint Editor window.

- In the **Graph** under the **Event Construct** node, **Right-click** and add **Get Player Character** node.

- Drag the **Return Value** pin of **Get Player Character** node and select **Cast to BP_FirstPersonCharacter**.

- Drag the **As BP First Person Character** pin and select **Promote to Variable** (name it **My Character**), then connect as shown below. With the help of this, you will be able to access the variables from **BP_FirstPersonCharacter** Blueprint.

- Click **Compile** in the toolbar to compile the script.

- Return to the **Designer** and select the **Progress Bar** next to **Health**.

- In the **Details** panel under **Progress**, click the **Bind** option next to **Percent** and click **Create Binding**. With the help of this, you can create custom bindings by adjusting function script in opened window.

- Hold **Ctrl** and drag the copy of **MyCharacter** variable into the **Graph**.

- Drag the pin **MyCharacter** and select **Get Health**.

- Connect the **Health** pin to the **Return Value** of the **Return Node**. It should look as following.

- Do the same procedure to adjust **Progress Bar** next to **Energy**. It should look as following.

- **Compile** and **Save** the **HUD** Widget Blueprint and close it.

### Script: Ammo and AmmoMax

Procedure of setting up Ammo variable is similar to setting Health and Energy variables. For more detailed information see section above Script: Health and Energy (-> umg-ui-designer-quick-start-guide-in-unreal-engine).

- Open **HUD_AmmoCount** Widget Blueprint and go to **Graph** tab.

- Create script for connection **HUD_AmmoCount** Widget Blueprint to **BP_FirstPersonCharacter** Blueprint as described before. This should look as following.

- Click **Compile** in the toolbar to compile the script.

- Return to the **Designer** and select the **25** text following the **Ammo** text. In the **Details** panel for **Text**, click **Bind** and **Create Binding**.

- In opened window, hold **Ctrl** and drag the copy of **MyCharacter** variable into the **Graph**. Drag the pin **MyCharacter** and select **Get Ammo**. Connect the **Ammo** pin to the **Return Value** of the **Return Node**. It should look as following. A conversion node **To Text** will be created automatically after connecting **Ammo** node to the **Returned Node**.

- Repeat the process above for other **25** text and creating a binding for the "AmmoMax" text. It is not necessary to do this if your max ammo is constant. However, with the help of this **AmmoMax** variable setting, you will be able to change it by creating a script in **BP_FirstPersonCharacter**.

- Click **Compile** and **Save**, then click the **Play** button to play in the Editor.

With the help of this quide, you have adjusted displaying Health and Energy Bars via HUD Widget, and displaying Ammo via HUD_AmmoCount Widget. All these Widgets display current values from your Character Blueprint. In game process, the pressing **Space** cause the jump Character, reducing Energy; pressing **F** cause the reducing of the Health; the pressing **Left Mouse Button** cause fire the weapon, reducing Ammo.

In the next section, you will find the information on creating a Main Menu, which you can use to load into game you set up. Also, there is additional information on working with **Unreal Motion Graphics** and **Blueprints**.

## 3 - Further Reading

Further reading related to the topics in this guide:

- For more information on Unreal Motion Graphics, see: UMG UI Designer (-> umg-editor-reference-for-unreal-engine).

- For more information on Blueprints, see: Blueprints Visual Scripting (-> blueprints-visual-scripting-in-unreal-engine).

- ui
- blueprint
- umg ui designer

On this page

- 1 - Required Project Setup (-> umg-ui-designer-quick-start-guide-in-unreal-engine)
- Adjusting BP_FirstPersonCharacter Blueprint (-> umg-ui-designer-quick-start-guide-in-unreal-engine)
- Adjusting BP_Rifle Blueprint (-> umg-ui-designer-quick-start-guide-in-unreal-engine)
- Adjusting Character Variables in BP_FirstPersonCharacter Blueprint (-> umg-ui-designer-quick-start-guide-in-unreal-engine)
- Adjusting Character Variables in BP_Rifle Blueprint (-> umg-ui-designer-quick-start-guide-in-unreal-engine)
- 2 - Displaying Health, Energy & Ammo (-> umg-ui-designer-quick-start-guide-in-unreal-engine)
- Visual: Health and Energy (-> umg-ui-designer-quick-start-guide-in-unreal-engine)
- Visual: Ammo (-> umg-ui-designer-quick-start-guide-in-unreal-engine)
- Script: Health and Energy (-> umg-ui-designer-quick-start-guide-in-unreal-engine)
- Script: Ammo and AmmoMax (-> umg-ui-designer-quick-start-guide-in-unreal-engine)
- 3 - Further Reading (-> umg-ui-designer-quick-start-guide-in-unreal-engine)
