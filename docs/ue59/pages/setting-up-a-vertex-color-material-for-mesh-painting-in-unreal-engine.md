# Setting Up a Vertex Color Material for Mesh Painting

https://dev.epicgames.com/documentation/en-us/unreal-engine/setting-up-a-vertex-color-material-for-mesh-painting-in-unreal-engine?application_version=5.9

> A guide to setting up a material for vertex color painting.

When you use the Vertex Color mode with mesh painting, the vertex color data is used with a material to color the mesh. To do this, you use the **Vertex Color** material expression in a material graph with some logic to effectively use this color data.

Vertex Color Material Expression.

There are many ways in which you can use this color-painted data with a Vertex Color material expression. The sections below demonstrate how to add vertex-painted color to an existing material to tint that color in some way. This is one way you can use the Vertex Color expression with your materials with the mesh painting system.

To learn more about vertex color materials and how you can use them to blend textures layers together for painting on a mesh, see Setting Up a Texture Blended Material for Mesh Painting (-> setting-up-a-texture-blended-material-for-vertex-weights-painting-in-unreal-engine).

## The Mesh and its Material

The example mesh and its material below demonstrate how to integrate vertex color workflows into your existing materials.

|  |  |
| --- | --- |
| [image: Base Static Mesh] | [image: Base material applied to a static mesh.] |
| Base Static Mesh | Base material applied to the mesh. |

## Vertex Color Material Setup

To set up a paintable material that takes in painted vertex color to tint an existing base color in a material, add a **VertexColor** material expression that plugs the RGB color channel into the **A** input of a **Multiply** node.

 [image: Simple Vertex Color Example]

Next, plug the material logic for your Base Color (Albedo) into the **B** input of the **Multiply** node, and then plug the output of the Multiply into the **Main Material** node.

The material should look similar to the image below with its paintable vertex color setup.

 [image: Example of a vertex color node in a material graph.]

## Using a Vertex Color Material to Paint on a Mesh

When you switch to the **Mesh Paint** mode in the level viewport, select the **Vertex Color** tab in the mode toolbar.

 [image: Vertex Color paint mode selection.]

To get started, use this workflow:

- Use the **Select** tool to click on your mesh that has a material setup to use vertex color painting.

- Switch to the **Paint** tool and choose a **Paint Color** to apply to your mesh.

- Use the **Color View Mode** dropdown selection to inspect the painted colors, as needed.

With this change to your material, you can paint a color that tints the base material.

- materials
- reference
- building virtual worlds
- mesh paint tool
- vertex color

On this page

- The Mesh and its Material (-> setting-up-a-vertex-color-material-for-mesh-painting-in-unreal-engine)
- Vertex Color Material Setup (-> setting-up-a-vertex-color-material-for-mesh-painting-in-unreal-engine)
- Using a Vertex Color Material to Paint on a Mesh (-> setting-up-a-vertex-color-material-for-mesh-painting-in-unreal-engine)
