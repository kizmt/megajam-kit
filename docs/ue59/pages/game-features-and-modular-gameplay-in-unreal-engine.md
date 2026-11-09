# Game Features and Modular Gameplay

https://dev.epicgames.com/documentation/en-us/unreal-engine/game-features-and-modular-gameplay-in-unreal-engine?application_version=5.9

> Build standalone features that you can quickly activate or deactivate.

[image: Game Features and Modular Gameplay]

Programming Language

×C++

Select an option from the dropdown to see content relevant to it.

The **Game Features** and **Modular Gameplay** plugins help developers create standalone features for their projects. Building features with these plugins offers some of these benefits:

- Keep your project's codebase clean and readable.
- Avoid accidental interactions or dependencies between unrelated features. This is particularly important when developing live products that change feature sets over time.

## Setup

The following steps will put your project into a state where you can add one or more standalone, plugin-based features. Begin by activating the Game Features and Modular Gameplay plugins.

- In Unreal Engine, Navigate to **Edit** > **Plugins**. Once the **Plugins** window opens, search for and enable the Game Features and Modular Gameplay plugins.[image: enabling-the-modular-plugin]You can find both the Game Features and Modular Gameplay plugins in the Gameplay category.
- After enabling these plugins, the editor will inform you it needs to restart. Click **Restart Now**.[image: restart-plugin]
- When the Editor restarts, navigate to the Plugins window, then click **Add** to launch the **New Plugin** window.[image: creating-a-new-plugin]
- Create a new plugin containing the feature you are building. Select **Game Feature**(**Content Only**), then name the plugin.[image: new-plugin-window]
- Use the **Content Browser** to navigate to your plugin's top-level content folder. Make sure that your plugin is saved under the `/Plugins/GameFeatures/` directory within your project.[image: content-browser-plugin-folder]In our example, we have named the plugin MyStandAloneFeature
- Create a new **Data** Asset by right-clicking in the **Content Browser**, expanding **Miscellaneous** within the context menu, and selecting **Data Asset**. From the list of classes, choose `GameFeatureData` and name the new Asset whatever you named your plugin.

Once you have completed these steps, your standalone feature will be set up to load when the engine (or editor) starts. You can now begin developing the feature itself, and adding the **Actions** that will implement it.

## Game Feature Actions

Your standalone feature is now set up to load when the engine starts. You can now begin developing the feature by adding the **Actions** to implement it.

| Action | Description |
| --- | --- |
| **Add Cheats** | Extend the Cheat Manager by creating new "cheat codes" or extending existing ones. Cheat codes are helpful for debugging and are automatically removed from shipping builds. The `~` (tilde) key opens the console where you can enter these codes while running your project. |
| **Add Components** | Take a list of Actor subclasses and add a set of Components to them on an opt-in basis. This is the most common way to use the Game Features and Modular Gameplay plugins because Components are well-suited to encapsulating a wide range of behaviors. |
| **Add Data Registry** | Add one or more Data Registries to the project. Data Registries are efficient places to store and retrieve globally-registered data. |
| **Add Data Registry Source** | Add one or more Data Tables (-> data-driven-gameplay-elements-in-unreal-engine) to existing Data Registries. This action requires a DataTable Meta Source in the base registry. This action's name field is the unique name of the registry as defined in the registry asset and not its soft object path or asset name. |
| **Add World Partition Content** | Add World Partition Content to the feature. |

## Adding an Action

To add an Action, open the Data Asset you just created. Expand the **ACTIONS** category to reveal an array called **Actions**. Add an element to that array and set it to the appropriate Action type. You can find further guidance for each Action type in the sections below.

[image: add-actions-window]

Pictured above is one of each type of Action. You can have as many Actions as you need for any given plugin.

After adding Actions, if your Game Feature does not function as expected, you may need to restart the editor once. GameFeatureData Assets load during editor startup, meaning that failure to restart after creating a new GameFeatureData Asset will result in that Asset not functioning. You will only need to do this after initially creating the Asset; updating it during later sessions will not require a restart.

### Adding Cheats

An Add Cheats Action registers a **Cheat Manager Extension** with the game. Developers can create their own debug commands (or "cheat codes") as part of a standalone feature, and make these commands available whenever the feature is in effect.

Cheat Managers and Cheat Manager Extensions are debugging tools, as a result they do not instantiate in Shipping builds.

### Adding Components

An Add Components Action goes through the list of paired Actor and Component classes you provide and attempts to add an instance of each Component to each matching Actor. You can specify whether the Components should be added on clients, servers, or both; by default, Components will be added in both cases.

To keep your feature fully encapsulated within the plugin, the Component(s) you add will come from the plugin itself. The Actor class will be a built-in Engine class, like **Pawn**, or a project-specific child of an Engine class, like a typical **MyPawn**. The Component(s) should handle all program logic and data storage related to your feature.

When you keep the required interaction with the project's Actor subclass to a minimum, it is easier to implement your feature in another project.

Using the base Actor class for an Add Components Action is unsupported. The system will ignore that part of the Action. Instead, we recommend you identify the most narrow subset of the Actor subclasses that require your Component and specify that class. If multiple classes should receive the Component and they do not have a common parent, then you can set up multiple Add Components Actions to cover all the appropriate base classes.

To receive Components from Add Components Actions, your Actor must register itself with the `UGameFrameworkComponentManager` singleton instance, and pass itself into the `AddReceiver` function. This is generally done in `BeginPlay`. The code should look like this:

 C++

```
if (UGameFrameworkComponentManager* ComponentManager = GetGameInstance()->GetSubsystem<UGameFrameworkComponentManager>())
	{
		ComponentManager->AddReceiver(this);
	}
```

if (UGameFrameworkComponentManager* ComponentManager = GetGameInstance()->GetSubsystem<UGameFrameworkComponentManager>())
 {
 ComponentManager->AddReceiver(this);
 }

### Adding Data Registries

The Add Data Registry Action can add an entire Data Registry to your project. Configure the Action with the path to the Data Registry Asset you want to add. For more information about Data Registries, see the Data Registries page.

### Adding Data Registry Sources

To add a data source that streams into a Data Registry, use an Add Data Registry Source Action. This action requires a DataTable Meta Source in the base registry. This action's name field is the unique name of the registry as defined in the registry asset and not its soft object path or asset name.

You must configure the paths to each data source, the name of the Data Registry that will load them, and the relevant priority and usage flags.

If the Game Feature is loaded at startup, the appropriate identifiers will populate dropdown lists.

For more information, see the Data Registry Sources section of the Data Registries page.

- blueprints
- programming
- plugin
- game features
- modular gameplay
- data pipeline

On this page

- Setup (-> game-features-and-modular-gameplay-in-unreal-engine)
- Game Feature Actions (-> game-features-and-modular-gameplay-in-unreal-engine)
- Adding an Action (-> game-features-and-modular-gameplay-in-unreal-engine)
- Adding Cheats (-> game-features-and-modular-gameplay-in-unreal-engine)
- Adding Components (-> game-features-and-modular-gameplay-in-unreal-engine)
- Adding Data Registries (-> game-features-and-modular-gameplay-in-unreal-engine)
- Adding Data Registry Sources (-> game-features-and-modular-gameplay-in-unreal-engine)
