# Designing and Building Worlds in Unreal Engine for Maya Users

https://dev.epicgames.com/documentation/en-us/unreal-engine/designing-and-building-worlds-in-unreal-engine-for-maya-users?application_version=5.9

> An overview of Unreal Engine's design tools to build scenes for Maya users.

Unreal Engine includes tools and features that are useful for building worlds of any size, from small confined spaces to large open worlds. The engine’s world building features are designed to work well together with other features of Unreal Engine, such as the lighting system with dynamic global illumination and cinematic quality shadows, visually dense high quality geometry with Nanite Virtualized Geometry, physics interactions with cloth and destruction, and more.

Having these tools work well together means you can build out impressively sprawling cinematic worlds down to small compact spaces with as little or as much detail as you’d like.

## How Unreal Levels Compare to Maya Scenes

When it comes to designing your world environments, everything in Unreal Engine starts with a **Level**. This, in itself, is a map asset that exists in your Content Browser. Levels are containers for anything you put in them, which can include lights, static meshes, characters, visual effects, or anything that can be added from the Content Browser or the Create menu in the main toolbar.

Maya Scenes are different in this way and are designed to meet the needs of linear composition for film, previsualization, and still shots. Whereas in Unreal Engine, you’re still assembling scenes with meshes and lights, but you do it in a real-time environment with interaction, game logic, and performance in mind — even when building out the world using a linear content workflow.

Below are some use case concepts between Maya and Unreal Engine:

| Concept | Maya Use Case | Unreal Engine Use Case |
| --- | --- | --- |
| **Primary Role** | Asset creation | Real-time world assembly |
| **Units and Scale** | Content Management-based, Strict scaling | Content Management-based, Scaling flexibility |
| **Object Focus** | Polygon modeling | Actor-based instancing system and modularity in scene construction |
| **Scene Assembly** | Static, non-real-time workflows | Dynamic with interaction, logic, and lighting using real-time workflows. |

## Level Editor Modes

You can put Unreal Engine into different modes in the level editor by using its **Modes **selection in the main toolbar. These modes focus on specific design areas with some having their own Editor workspace tools, replacing the ones in the main toolbar.

You can change the mode used in the Level Editor using the Modes dropdown selection in the main toolbar.

[image: Editor Modes]

Below are some of the modes that are most useful for building out and editing content in your levels:

| Viewport Tool Mode | Description |
| --- | --- |
| **Selection Mode** | This is the default mode in the editor. Use this mode to place and edit objects in a level. For more information on using this mode, see Selection Mode (-> select-mode-in-unreal-engine). |
| **Landscape** | This mode includes a set of tools for managing, sculpting, and painting landscape terrain. You can create terrain from scratch or import heightmaps to create a base landscape to work from. This mode also includes a spline tool to place roads or repeatable objects along a path. For more information on using this mode, see Landscape Outdoor Terrain (-> landscape-outdoor-terrain-in-unreal-engine). |
| **Foliage** | This mode includes a set of tools to paint or erase sets of static meshes on different types of geometry in a level based on filters. Each type of paintable mesh includes settings to define how it’s painted in the level. This includes settings for how it aligns to the surface of the meshing being painted on, its density, randomization options, and more. Good examples for what you can paint with this would be grass, trees, bushes, and rocks. For more information on using this mode, see Foliage Mode (-> foliage-mode-in-unreal-engine). |
| **Mesh Paint** | Use this mode to apply color and texture to meshes directly in the level viewport using painting tools. The Mesh Paint mode includes several options for how you paint to meshes, such as applying color to vertices of the mesh, or painting directly to the mesh’s texture. For more information on using this mode, see Mesh Paint Mode (-> mesh-paint-mode-in-unreal-engine). |
| **Modeling** | This is a comprehensive suite of modeling tools and functions made up of artist-friendly tools for creating and editing 3D geometry. For more information on using this mode, see Modeling Mode (-> modeling-and-geometry-scripting-in-unreal-engine). |

## Placing Objects in the World

In Unreal Engine, there are several ways you can go about placing objects in the world.

Use the table below to learn more about each of these options:

| Option | In-Editor View | Description |
| --- | --- | --- |
| **Content Browser** | [image: Content Browser Filtering] | This is the primary area of the Unreal Editor for creating, importing, organizing, viewing, and managing content within the project. Most assets here can be placed directly in levels or applied to assets that live in a level. For more information, see Content Browser (-> content-browser-in-unreal-engine). |
| **Create Toolbar Menu** | [image: Create Menu] | This menu contains a list of common actor types, recently used assets and actor types, and quick links to content you can add to your level. The actor types in this menu are level-specific actors not found as assets in the Content Browser, such as lights, volumes, and environment features like clouds. You can use this menu to drag and drop actors into the level to place them. For more information, see Unreal Editor Interface (-> unreal-editor-interface). |
| **Place Actor Panel** | [image: Place Actor Panel] | This is a dockable panel with common actor types you can drag and drop into a level. Its functionality is similar to the Create toolbar menu. For more information, see Placing Actors (-> placing-actors-in-unreal-engine). |

## Assembling Environments with Modularity and Scale in Mind

When it comes to building out your world in a real-time environment, you need to consider how your workflows could impact performance. This is true whether you’re working in the editor to build out a real-time game experience or using linear content-driven workflows. Managing how content is rendered in the level is key to this. The engine’s viewport is meant to operate in real-time enabling a “what you see is what you get workflow”.

In terms of how this can affect workflows from 3D applications, you have to think about how content is broken up in ways that lend themselves to modular workflows. Unreal Engine renders only what is visible on the screen at any given time making it best to break content up into repeatable instances. Visible large contiguous meshes are loaded entirely and stay loaded in memory despite only part of the mesh being visible on screen at any time. This adds additional draw calls to render the mesh and its materials each frame. When objects are built modularly as individual pieces that can be assembled to make larger one, the ones that aren’t visible on screen are not rendered, meaning they don't stick around in memory nor do they create draw calls.

Building with a modular mindset is best used for any repeatable content you’d use in a level, such as surfaces for walls, floors, and ceilings, or for props and building architecture, like statues, doors, railings, furniture, or any other countless number of objects. Materials can be used to enhance each through variations in a parameter-driven material instancing workflow.

When building out content in a modular way, think about the following:

| Area of Modular Design | Considerations |
| --- | --- |
| **Grid Units and Scale** | - Use the Grid in the editor to have a consistent size. For example, start with 100 or 50 centimeter snapping for things like structures. Build content with this grid snap size in mind and divide or multiply it by 2 when working with multiple grid sizes in order to maintain consistency. - Keep a uniform scale between objects, where possible. - Use power-of-two values when possible (50, 100, 200, 400) so that pieces snap together cleanly without any gaps or overlapping surfaces. |
| **Snapping and Pivot Placement** | - When building your mesh in another application, position their pivots logically to facilitate grid-friendly snapping, such as a corner or bottom-center point. - Modular pieces should snap together without gaps or overlapping parts. Each of the Transform tools for move, rotation, and scale have their own snapping settings. |
| **Texture Tiling and UVs** | - For modular pieces, use tileable textures and ensure that UVs are uniform and match across their parts. - For UVs: - Ensure that UVs are uniform and match across modular parts that should connect. - Avoid stretching or mismatched UV seams that can lead to visual discontinuity. - For areas that need added unique details, consider using decals to avoid requiring unique UVs and meshes. |
| **Materials** | - Reuse materials across modular pieces. This saves memory and reduces the number of draw calls happening every frame, improving real-time performance. - Use material instances to create variations in tiling patterns and areas that look too sterile. |

### Examples of Modular Design in Epic Games’ Sample Projects

All of the sample projects that Epic Games releases use modular design, with some being specific to the project and others using more general approaches.You can explore any of these projects to get a sense of how you can leverage modular design approaches for your own projects.

Some good starting points for modular construction of structures and material instancing used to create variation in textures are:

| [image: Sun Temple] Sun Temple | [image: Blueprints] Blueprints | [image: Lyra Starter Game] Lyra Starter Game |
| --- | --- | --- |

There are many other examples you can explore on your own at Fab created by Epic Games and freely available to download.

If you’re looking for something you can start using right away in your project without downloading a separate sample project, you can add the **Starter Content **pack that is included with the engine. This content pack includes a set of simple materials, props, and architectural walls of varying sizes.

To add Starter Content to your project at any time:

[image: Starter Content]

- Go to the Content Browser and click the **Add **button.

- Select **Add Feature or Content Pack** from the menu.

- Click the **Content **tab.

- Click **Add to Project**.

You will now have a new folder in your Content Browser called “Starter Content”. You can explore what’s there. If you’re looking for how the modular walls and floor are built, look in the **Architecture **folder.

## Next Page

- Animating in Unreal Engine for Maya Users (-> animating-in-unreal-engine-for-maya-users): An overview of Unreal Engine's animation system and its core features as they relate to a Maya user.
