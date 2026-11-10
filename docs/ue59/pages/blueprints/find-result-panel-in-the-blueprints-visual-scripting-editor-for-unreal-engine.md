# Blueprint Editor Find Result Panel

https://dev.epicgames.com/documentation/en-us/unreal-engine/find-result-panel-in-the-blueprints-visual-scripting-editor-for-unreal-engine?application_version=5.9

> Panel that is a search tool within the Blueprint Editor that allows you to quickly track down a variety of objects.

[image: Blueprint Editor Find Result Panel]

The **Find Results** panel is a powerful search tool within the Blueprint Editor that allows you to quickly track down a variety of objects based on the following criteria:

- Node name

- Pin name

- Node Comment

- Property name

- Property value

As the **Find Results** panel tracks down search matches, it will display a list of results, each of which works like a hyperlink that will jump the graph view to the resulting node. This makes it an excellent way to track down a specific node or piece of information that may be buried somewhere within a complex network of Blueprint scripting nodes.

Much like searching in a web browser, the **Find Results** panel is available by pressing **Ctrl-F** while working in the Blueprint Editor. By default, the panel will appear along the bottom of the **Graph** Panel. If the **Compiler Results** panel is showing, then the **Find Results** panel will dock alongside it.

Unlike many search fields in Unreal Engine 4, the **Find Results** panel does not filter results actively while you type, due to the sheer volume of possible results. Once you press **Enter**, the list will populate.

## Interface

- **Results list** - This lists all nodes, pins, property names, comments, and property values that match the search criteria.

- **Search filter** - This is where you type in what you are looking for.

- **Property values** - Explicitly set property values will appear in parentheses in the middle of the results.

- **Comments** - Node comments, if they exist, will appear in yellow text on the right side of the panel.

- **Find in Current Blueprint Only** - When active, the search is limited only to the current Blueprint. When deactivated, the search looks through all Blueprints in the project.

- blueprints

On this page

- Interface (-> find-result-panel-in-the-blueprints-visual-scripting-editor-for-unreal-engine)
