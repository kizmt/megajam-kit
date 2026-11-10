# Landscape Retopologize Tool

https://dev.epicgames.com/documentation/en-us/unreal-engine/landscape-retopologize-tool-in-unreal-engine?application_version=5.9

> This is an overview of the Retopologize painting tool.

The **Retopologize** tool automatically adjusts Landscape vertices with an X/Y offset map to improve vertex density in areas that need it, like steep cliffs. This allows for reduced texture stretching in
these types of areas by spreading the vertices into these areas that are less dense.

An X/Y offset map will make the Landscape slower to render and paint on with other tools, so only use the Retopologize tool if needed.

## Using the Retopologize Tool

In this example, we have a steep incline that was created by flattening an area, however, it left these vertical areas with fewer Landscape vertices spread across the surface which caused the textures to
appear stretched and some jagged artifacts around the edges of the flattened area. By using the Retopologize tool the surrounding vertices have been pulled and redistributed without significantly altering the
work that was done to make the flattened area. This reduces the stretching and jagged edges that appear.

Use the following controls to paint an X/Y offset map to retopologize your Landscape heightmap:

| **Controls** | **Operation** |
| --- | --- |
| **Left Mouse Button** | Heightens or increases the heightmap or selected layer's weight. |

**Retopologize Lit View**

 [image: Before]

 [image: After]

**Retopologize Wireframe View**

 [image: Before]

 [image: After]

In these comparison examples, you can see how the texture stretching has been reduced in these sharp inclines for the lit view and with the wireframe view you can see how the vertices have been redistributed
to be more evenly spaced in these steep inclines.

### Tool Settings

 [image: Retopologize Tool]

There are no tool settings specific to Retopologize that can be adjusted. Simply select the tool from the selection and paint the areas in your Landscape that need to have their vertex density redistributed.
