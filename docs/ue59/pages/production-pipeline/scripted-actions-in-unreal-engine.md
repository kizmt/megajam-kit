# Scripted Actions

https://dev.epicgames.com/documentation/en-us/unreal-engine/scripted-actions-in-unreal-engine?application_version=5.9

> Create Blueprints that you can invoke by right-clicking an Asset in the Content Browser or an Actor in the Level.

[image: Scripted Actions]

Learn to use this **Beta** feature, but use caution when shipping with it.

**Scripted Actions** are **Editor Utility Blueprints** that you launch in the **Unreal Editor** by right-clicking Assets in the **Content Browser**, or by right-clicking Actors either in the **Level Viewport** (shown above) or in the **World Outliner**.

This kind of workflow is especially useful any time you need your Blueprint logic to have contextual awareness about a certain set of **Assets** or **Actors**. Typically, a **Scripted Action** gets the list of Assets or Actors that are selected at the time you run the action, then modifies those objects or otherwise takes them into consideration in its graph.

The instructions on this page show you how to create and launch these kinds of Editor Utility Blueprints, and how you can customize them to apply only to specific types of Assets or Actors.

## Steps

In this procedure, we'll create a new Editor Utility Blueprint class from one of the parent classes that support Scripted Actions, and we'll set up a new event graph for that class that will show up as a Scripted Action.

- In the **Content Browser**, right-click the folder where you want to create your new class, and choose **Editor Utilities > Editor Utility Blueprint** from the context menu. [image: Create Editor Utility Blueprint]

- Decide whether you want your Scripted Action to operate on Assets that you select in the **Content Browser**, or on Actors that you select in the **Level Viewport** or **World Outliner**. If you want your Scripted Action to operate on Assets, choose **AssetActionUtility** as the parent class, then press **Select**.

- If you want your Scripted Action to operate on Actors, choose **ActorActionUtility** as the parent class, then press **Select**.

 [image: Choose ActorActionUtility or AssetActionUtility]

- Give your new class a descriptive name in the **Content Browser**. [image: Name your new class] You won't see this class name when you run its Scripted Actions. You'll need it only to distinguish this class from the other Blueprint classes in your Project if you need to modify your Scripted Actions or add new ones later.

- Double-click your new class to open it in the Blueprint Editor.

- To create a Scripted Action for this class, you can either create a new function, or create a new **Custom Event** node in the Event Graph for the class. Make sure that the **Call In Editor** box is checked on the function entry node or the Custom Event node. This is automatically done for you when you create a new function, but you'll have to do it yourself if you choose to use a Custom Event. For example, this new function on an **AssetActionUtility** iterates through the list of Assets that are selected in the Content Browser, and prints the name of each one in the **Level Viewport**. The image below shows a similar function implemented on an **ActorActionUtility**. You'll find some useful Blueprint nodes for your Scripted Actions under the **Development > Editor** category, including the nodes shown in the examples above that return a list of the objects selected at the time your Scripted Action is run: **Get Selected Assets**, which returns an array of references to all the Assets selected in the **Content Browser**, and **Get Selection Set**, which returns an array of Actors that are currently selected in the Level. You also will want to install the **Editor Scripting Utilities** Plugin, if you haven't already, to get access to additional function libraries for working with Assets and Level Actors. See Scripting and Automating the Editor (-> scripting-and-automating-the-unreal-editor).

- **Save** and **Compile** your Blueprint class.

## End Result

Once your Blueprint class is saved and compiled, you should see a new **Scripted Actions** sub-menu in the context menu for either Assets or Actors, depending on the parent class you chose for your Blueprint class. This sub-menu contains each of the functions or Custom Events that you set up in your Blueprint class.

For example, when you right-click one or more Assets in the **Content Browser**:

 [image: Run a Scripted Action on selected Assets]

Or when you right-click one or more Actors in the **Level Viewport** or **World Outliner**:

 [image: Run a Scripted Action on selected Actors]

Each function and Custom Event that you set up on your **AssetActionUtility** or **ActorActionUtility** class becomes available as a separate option in the context menu. You can create as many different Scripted Actions as you need within a single Blueprint class, or you can create multiple Blueprint classes and distribute your Scripted Actions across those classes.

## Restricting an Action to a Specific Class

If you compile and save your Blueprint, and then begin right-clicking actors in the level, you may notice the **Scripted Actor Actions** option appear in the context menu. The script is available for any actor class, which can cause confusion if the script is not designed for multiple classes. To control what actors artists can affect, you can restrict the scripted action to a specific class.

To adjust the supported class:

- In the top toolbar, click **Class Defaults**.

- On the **Supported Classes** bar, click the plus **(+)** icon.

- Search for and click **Static Mesh Actor**. [image: Class Defaults]

- **Compile** (Ctrl + Alt) and **Save** (Ctrl + S).

## Dynamic Inputs

You can set up your Scripted Actions to require information from the user who invokes them. If you add one or more **Inputs** to your function entry node or Custom Event node, you'll be prompted to supply that input each time you run the Scripted Action in the editor. This can be useful any time your script needs some extra information that may be different each time you call the action.

For example, this function has three inputs: a string, an Actor Object Reference, and a Material Object Reference:

 [image: A function with inputs]

When you run the Scripted Action for this function, the editor pops up a small window for you to set these input values:

 [image: Set input values]

The editor validates that each input matches the type of value it is supposed to be. However, it doesn't guarantee that the inputs will have values at all, or that those values will make sense in any particular context. Keep in mind that your script should handle unspecified input values and validate the input values the user does provide.

- editor
- blueprints
- beta
- scripting
- blueprint utilities

On this page

- Steps (-> scripted-actions-in-unreal-engine)
- End Result (-> scripted-actions-in-unreal-engine)
- Restricting an Action to a Specific Class (-> scripted-actions-in-unreal-engine)
- Dynamic Inputs (-> scripted-actions-in-unreal-engine)
