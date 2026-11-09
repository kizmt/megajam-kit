# Blueprint Header View

https://dev.epicgames.com/documentation/en-us/unreal-engine/an-overview-of-the-blueprint-header-view-in-unreal-engine?application_version=5.9

> The Blueprint Header View is an editor tool to provide you a method to convert Unreal Engine Blueprint Classes,Components and Variables.

[image: Blueprint Header View]

The **Blueprint Header View** converts Unreal Engine Blueprint Classes (-> blueprint-class-assets-in-unreal-engine) and Blueprint Structs (-> blueprint-struct-variables-in-unreal-engine) to C++ code.

During the conversion process, the Blueprint Header View creates C++-style declarations for the following elements of your Blueprint:

- Variables (-> blueprint-variables-in-unreal-engine)

- Functions (-> functions-in-unreal-engine)

- Actor components (-> basic-components-in-unreal-engine)

- Event dispatchers (-> event-dispatchers-in-unreal-engine)

## Use the Blueprint Header View

To use the Blueprint Header View in your project, do the following:

- Right-click a Blueprint **Class** or **Struct** in the **Content Browser**.

- From the context menu, select **Preview Equivalent C++ Header**.

 [image: preview-cpp]

### C++ Header Preview

When you select **Preview Equivalent C++ Header** from the menu, the **C++ Header Preview** window opens. The window displays your Blueprint's Variables, Functions, Actor Components, and Event Dispatchers.

 [image: cpp-header-preview]

### Settings

Click the **Settings** button to open a drop-down list of **style** and **sort** options.

 [image: settings]

#### Sort Method

The **Sort Method** provides options to sort the display of your Blueprint Classes and Properties in the C++ Header Preview window. Select from the following Sort Method values:

| Sort Method | Description |
| --- | --- |
| None | Properties appear in the same order as they appear in the Blueprint class. |
| Sort By Access Specifier | Properties are grouped together by Access Specifiers in order of visibility(public, protected, private.) |
| Sort For Optimal Padding | Properties are sorted to minimize padding in the compiled class layout. |

#### Style

**Style** is similar to syntax highlighting. You can adjust the **Font Size** and **Color RGB** of the **syntax** and **selection color**, in the C++ Header preview window. You can configure the following syntax elements:

- Comment

- Error

- Macro

- Typename

- Identifier

- Keyword

 [image: syntax-colors]

#### Selection Color

Changing the **Selection Color** controls the selection highlighting when using your mouse in the C++ Header Preview.

 [image: highlight-selection]

In the image above we set the Selection Color value to the RGB color of purple.

- blueprints
- header view

On this page

- Use the Blueprint Header View (-> an-overview-of-the-blueprint-header-view-in-unreal-engine)
- C++ Header Preview (-> an-overview-of-the-blueprint-header-view-in-unreal-engine)
- Settings (-> an-overview-of-the-blueprint-header-view-in-unreal-engine)
- Sort Method (-> an-overview-of-the-blueprint-header-view-in-unreal-engine)
- Style (-> an-overview-of-the-blueprint-header-view-in-unreal-engine)
- Selection Color (-> an-overview-of-the-blueprint-header-view-in-unreal-engine)
