# Add a Sprint Mechanic to the Player

https://dev.epicgames.com/documentation/en-us/unreal-engine/designer-09-sprint-input-action-in-unreal-engine?application_version=5.9

> Use Input Actions to add a sprint mechanic to the player character's move set.

[image: Add a Sprint Mechanic to the Player]

In this part of the tutorial, you will modify the Player Blueprint to add the ability to sprint while moving by holding down a specific key. You'll learn about Unreal Engine's **Enhanced Input System**, the recommended system for receiving input from the player. You'll use this system to:

- Create an **Input Action** that defines what input triggers the sprint movement.
- Connect the Input Action to the player blueprint by turning it into an Event.
- Increase the movement speed of the player while sprinting.

In the previous section, you built the enemy character logic so that enemies chase the player when they are in the enemy’s view. With a sprint mechanic, you are providing a gameplay mechanic that the player can use to evade these enemy characters.

When designing games, it's important to build challenges for the player, such as enemies, while also providing a tool or strategy the player can use to overcome these challenges.

Sprinting is a popular feature that is available in most games across many genres that enables the player to move faster. This mechanic changes how players traverse the spaces you've designed in your level.

## Before You Begin

Make sure you understand these topics covered in the previous section of the Design a Puzzle Adventure (-> design-a-puzzle-adventure-game-in-unreal-engine):

- Blueprint basics like adding nodes, functions, and events.

You’ll need the following assets from the previous documents in this tutorial serries:

- `BP_AdventureCharacter`

## Create an Input Action Asset

First, you'll create an** Input Action** asset, which defines: .

- The action's name.
- The action's value type.
- The type of trigger (pressing, holding, or releasing a key).

The Input Action is what the player character blueprint listens for before it executes new behavior.

Later, you will bind the Input Action to a specific key, also known as **mapping**, by using an **Input Mapping Context** asset that already exists in the project.

Here is a diagram showing the relationship between the different assets used in the Enhanced Input System. For more information, see the Enhanced Input (-> enhanced-input-in-unreal-engine) documentation.

[image: Enhanced Input Asset Diagram] Enhanced Input Asset Diagram

| Input Action | Input Mapping Context | Blueprint |
| --- | --- | --- |
| Defines intent and detection rules. | Maps keys and buttons to Input Actions. | Uses Input Actions to implement behavior. |

To create an** Input Action** asset for a new sprint move, follow these steps:

- Go to the Content Browser and navigate to the Input > Actions folder. In this folder, you will see the Input Action assets related to Jump, Look, MouseLook, and Move.
- Right-click in the **Content Browser** and go to **Input **and create an **Input Action** asset.
- Name this asset `IA_Sprint`.[image: Input Action Asset] Input Action Asset The naming convention is our way of defining that this is an Input Action file, but it’s not required to be named this way.
- Double-click `IA_Sprint` to open it. An Input Action is a Data Asset and it opens in a new window with a Details panel.

### Input Action Types

Let’s take a look at the **Details **panel in the `IA_Sprint`** **data window. Use the **Details **panel to modify the properties of this asset, like defining the action you would like to listen to from the player character.

First, go to the **Value Type** property. This determines what type of data is in the input action. When creating input actions, you’ll choose a **Value Type** depending on the type of movement you want to capture with the action.

By default, the input action’s type is **Digital (bool)**, meaning it has an on and off state (sprinting or not sprinting). You’ll keep the default value for `IA_Sprint`.

The **Value Type** can also be:

- **Axis1D**: The action has one value for one-dimensional movement (scrolling in and out) or a scalar adjustment (changing movement speed).
- **Axis2D**: The action has X and Y values for two-dimensional movement, such as WSAD controls.
- **Axis3D**: The action has X, Y, and Z values for three-dimensional movement, such as flying or swimming controls.

### Set Up The Input Action With a Trigger

To define what type of keypress triggers the sprint action, follow these steps:

- In the **Action **section, next to Triggers, click the **plus (+)** button to add a new element to the **Triggers **array.
- Click the dropdown field where it says **None **on the new element you added. You will see a list of options like **Combo**, **Hold**, **Down**, and even touch input like **Tap**. Sprinting is usually done while holding down a key, so select **Down **from the list.
- Click the **Save **button in the top-left corner of the window to save your changes. Close `IA_Sprint`.[image: Input Action Editor] Input Action Editor

The action uses **Down **instead of **Hold** because **Down **triggers immediately when pressing a key, while **Hold **triggers after a certain time has passed while the key is held down.

**Hold **can be useful for actions like heavy-attack abilities, where you have to charge your attack before releasing the key. You can find out more about each selection by hovering your mouse over them to read the tooltips.

Expand a trigger to see its **Actuation Threshold**, or how far an input must be pressed or moved before the action triggers. A keyboard key has an actuation of 0 when not pressed and 1 when pressed. Gamepad controls can also have fractional values between 0-1 if their inputs are partially pressed.

Now, your Input Action asset is set up. You have a name for the action, `IA_Sprint`, and you have defined what triggers the action (pressing a key or button down). Next, you'll use an Input Mapping Context to define what key triggers the action.

## Assign a Key Mapping

An Input Mapping Context asset collects the Input Action assets assigned to it, like the `IA_Sprint` you just created, to set input keys and pass values to a character blueprint like our player character `BP_AdventureCharacter`.

To map a key to the IA_Sprint action, follow these steps:

- Return to the Content Browser. From the Input > Actions folder, go up one level to the Input folder. Here, you will see two Input Mapping Context assets, `IMC_Default` and `IMC_MouseLook`. IMC stands for Input Mapping Context.
- Double click on **`IMC_Default`** to open it in a new editor window with a Details panel. `IMC_Default` is the Input Mapping Context asset we use in this project for the player’s default abilities, like moving and jumping.
- In the **Mappings **section, expand the **Mappings **list, which reveals three entries: **IA_Jump**, **IA_Move******, and **IA_Look**. These are the Input Actions you saw earlier in the **Input **> **Actions **folder.
- Next to **Mappings**, click **Add **(**+**) to add an additional entry to the list.
- For the new entry, use the dropdown to select the **IA_Sprint **asset you created earlier.
- Expand the **IA_Sprint** entry to reveal the key selection for this action. Click the **Keyboard **button and press the **Caps Lock** key on the keyboard. Alternatively, you can use the dropdown menu to assign a key to this action.[image: Input Mapping Context Editor] Input Mapping Context Editor
- Save and close the Input Mapping Context.

After defining the `IA_Sprint` Input Action key, you now have an Input Action that triggers when the player keeps that key pressed down, and that action is mapped to the **Caps Lock** key.

Some key mappings (Shift, Ctrl, Alt, etc) are used by Unreal Editor and therefore may not work when testing your game in PIE mode. If using one of these mappings, you’ll need to test in standalone mode or use a different key during development and then switch to the desired key before packaging your game. Key mappings that are usually safe in PIE mode include letter and number keys, arrow keys, Caps Lock, Enter, Backspace, Page Up/Down, and Home/End.

## Modify the Player Blueprint to Sprint

With your input action set up, now modify the Player Blueprint to sprint using the key input you have assigned.

You will create the sprinting functionality by increasing the movement speed of the player when they press `IA_Sprint`’s trigger. When the player releases the sprint key, the character returns to their default movement speed.

So to get started, give the character a default movement speed first, and then create the sprint mechanic.

### Create Movement Speed Variables

First, you'll create variables to store the player's default movement speed and sprint movement speed. The player's Movement component sets their default movement speed, but saving it in a variable saves that speed and ensures the player can return to that speed after the sprint action is over.

To set up variables that save the player's different movement speeds, follow these steps:

- Go to the Content Browser, navigate to the Content > AdventureGame > Designer > Blueprints > Characters folder, and open your `BP_AdventureCharacter` blueprint.
- Using the **My Blueprints** panel, add a new variable named **DefaultMovementSpeed**, of the type **Float**.
- Add one more variable named **SprintMovementSpeed**, also of the type **Float**.
- Click the **Compile **button at the top left corner of the Blueprint Editor.
- Then, click the **SprintMovementSpeed **variable. In the **Details **panel, change **Default Value **> **Sprint Movement Speed** to **1000**.[image: Set Variable Default Values] Set Variable Default Values

### Set the Player's Default Movement

When the game starts, capture the player's default, starting movement speed.

To save the default movement speed when the game starts, follow these steps:

- In the Event Graph, right click an empty space, and create an Event BeginPlay node. This node executes once when the game starts.
- You will use Event BeginPlay to get the default movement speed of the player when the game starts. Drag the Exec pin of this node and create a Set Default Movement Speed node.
- As you saw from creating `BP_Enemy`, the character’s movement component contains the properties that control their speed. From the Components panel, drag the Character Movement (CharMoveComp) into the Event Graph.
- Drag the pin from the Character Movement node and create a Get Max Walk Speed node.
- Connect the Max Walk Speed pin to the Set Default Movement Speed node.

This functionality sets the value of the **DefaultMovementSpeed **variable you created to the player’s default walking speed, using the **Max Walk Speed** of the **Character Movement** component of the player.

[image: Example Graph Setup] Example Graph Setup

If you select the **Character Movement** component and look in the Details panel in the **Character Movement: Walking** section, you can see that the default **Max Walk Speed** is 600 cm/s.

The **Character Movement **component contains many properties that control how the character moves, and you can use and change any of these at runtime with blueprint logic.

### Define Sprint Action Behavior

Now that the player has a starting movement speed, you can increase that speed when the player presses the sprint key.

When you add an Input Action to an event graph, Unreal Engine creates an Event node that executes when the player presses that action's mapped key as defined in the Input Mapping Context. In this case, the **IA_Sprint** event executes when they press **Caps Lock**.

To use your `IA_Sprint` Input Action to create the sprinting mechanic, follow these steps:

- Right click anywhere that’s empty in the Event Graph, search for **IA_Sprint**, and select the **IA_Sprint **node in the **Input **> **Enhanced Action Events** category.[image: Input Action event node]Click the arrow at the bottom of the node to see more pins. You’ll use the **Triggered **and **Completed **pins:**Triggered **means the player is pressing the action key, so it should make the character move at their **SprintMovementSpeed**.
- **Completed **means the player has released the key, so it should return the player to their **DefaultMovementSpeed**.

- From the **Components **panel, drag the **Character Movement (CharMoveComp)** component into the Event Graph again.
- Drag off the **Character Movement** pin and create a **Set Max Walk Speed** node.
- From the **Set Max Walk Speed** node, drag the **Max Walk Speed** pin and create a **Get Sprint Movement Speed** node.
- Connect the **Triggered **pin of the **IA_Sprint **node to the **Set Max Walk Speed** node.[image: Enhanced Input Graph Example] Enhanced Input Graph Example

This sets the movement speed of the player character to the value of the **Sprint Movement Speed**, which you set to 1000 earlier.

Finally, you need to change the movement speed back to the default value when the player lets go of the key, and this action is marked as **Completed**.

To return the character to their default movement when finished sprinting, follow these steps:

- From the **IA_Sprint **node, drag off the **Completed **pin and create another **Set Max Walk Speed** node.
- Set up the **Set Max Walk Speed** node:For **Max Walk Speed**, connect a reference to **DefaultMovementSpeed**.
- For **Target**, connect the **Character Movement** component reference node.[image: Sprint Mechanic Setup] Sprint Mechanic Setup

- **Compile **and **Save **your blueprint.

## Test Your Character

In the Unreal Editor, click the **Play **button to play the game. You will now be able to sprint when you move and hold down the mapped sprint key (**Caps Lock**).

In this video, the character starts at their default movement speed, and then sprints through the level..

Experiment with different **Max Walk Speed** and **Sprint Movement Speed** values in your player character to decide what works best for your game. Now that the player can sprint, revisit your `BP_Enemy` characters and increase their **Max Speed** value to adjust the difficulty level of the encounters in Hallway 3 and Room 3.

You can also continue adding new inputs and behaviors if you would like to expand upon what you've implemented in this tutorial and add other features to your game.

## Next Up

Now that you have successfully added all of your player character’s mechanics and functionality, you are ready to finish the level. In the final module of this series, you will add the finishing touches to your level using all the elements you have constructed so far.

- [image: Complete the Level] Complete the LevelFinish the level by completing the gameplay loop and configuring an end state for the player. (-> designer-10-complete-the-level-in-unreal-engine)

- blueprints
- movement
- character
- beginner

On this page

- Before You Begin (-> designer-09-sprint-input-action-in-unreal-engine)
- Create an Input Action Asset (-> designer-09-sprint-input-action-in-unreal-engine)
- Input Action Types (-> designer-09-sprint-input-action-in-unreal-engine)
- Set Up The Input Action With a Trigger (-> designer-09-sprint-input-action-in-unreal-engine)
- Assign a Key Mapping (-> designer-09-sprint-input-action-in-unreal-engine)
- Modify the Player Blueprint to Sprint (-> designer-09-sprint-input-action-in-unreal-engine)
- Create Movement Speed Variables (-> designer-09-sprint-input-action-in-unreal-engine)
- Set the Player's Default Movement (-> designer-09-sprint-input-action-in-unreal-engine)
- Define Sprint Action Behavior (-> designer-09-sprint-input-action-in-unreal-engine)
- Test Your Character (-> designer-09-sprint-input-action-in-unreal-engine)
- Next Up (-> designer-09-sprint-input-action-in-unreal-engine)

Related documents

Design a Puzzle Adventure

 [image: Design a Puzzle Adventure] (-> design-a-puzzle-adventure-game-in-unreal-engine)Enhanced Input

 [image: Enhanced Input] (-> enhanced-input-in-unreal-engine)
