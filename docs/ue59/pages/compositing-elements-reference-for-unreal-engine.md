# Compositing Elements Reference

https://dev.epicgames.com/documentation/en-us/unreal-engine/compositing-elements-reference-for-unreal-engine?application_version=5.9

> Product documentation including reference and guides for Unreal Engine

Elements are the individual building blocks used to construct a composite. Each Element represents either a layer of a comp, or the comp itself. They are level actors individually responsible for rendering a piece of the composited scene.

 [image: Composure Window]

There are many different Element types. All of which, you can configure and change. Elements are Blueprintable, and you can create your own custom Elements inheriting from by `ACompositingElement` (or its sub-classes).

## Basic Compositing Elements

### Empty Comp Shot

This acts as the starting point for most comps. It doesn't contain any Passes, and requires the user to fill it out.

 [image: Empty Comp Shot]

### Media Plate Element

This preset Element comes with all the Passes needed to pipe a video into the compositing system, and apply **Chroma Keying** on top of it.

 [image: Media Plate Element]
 [image: Details panel]

### CG Layer Element

This preset Element is responsible for rendering actor objects from the virtual scene. Use the **Capture Actors** property to specify which actors you want to include/exclude.

 [image: CG Layer Element]
 [image: Capture Actors]

### CG Matte Element

This Element is like a plain **CG Layer** Element, but it renders the CG objects into a black/white mask texture. This is helpful for garbage matting, or setting up a holdout mask to be used with a keyer.

 [image: CG Matte Element]
 [image: Matte Type]

Change the Element's **Matte Type** property to invert the mask.

## Advanced Element Types

The Advanced Elements are available via the **All Classes** toggle in the **New Element** dialog. These additional Elements were created via Blueprints, and can be modified to suit specific use cases.

For the Advanced Elements to be listed, your first have to load their respective Blueprints. You can find the Advanced Element Blueprints in the content browser under the Composure Plugin's Blueprints/CompositingElements folder (make sure your content browser is set to view Engine and Plugin content).

### Texture Element

This Element is a utility Element for introducing an external texture into the compositing system.

 [image: Texture Element]

### Depth Element

The Depth Element is similar to the CG Layer element, but produces an image which expresses the depth of the included actors.

 [image: Depth Element]
 [image: Details panel]

### Radial Element

 [image: Radial Element]
 [image: Details panel]

### Ramp Element

 [image: Ramp Element]
 [image: Details panel]

### Roto Paint Element

 [image: Roto Paint Element]

 [image: Details panel]
