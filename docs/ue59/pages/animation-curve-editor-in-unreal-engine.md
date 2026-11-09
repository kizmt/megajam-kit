# Curve Editor

https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-curve-editor-in-unreal-engine?application_version=5.9

> Tweak your keyframes and curves by using the Curve Editor and tools within it.

[image: Curve Editor]

When you want more control over the way your objects are animated, the Curve Editor can be used to modify and fine-tune your keyframes. Using the Curve Editor's graph, you can create new keyframes, edit tangents, and use various built-in tools to adjust your animation curves.

The Curve Editor is used in other tools across the Unreal Editor, such as Niagara (-> creating-visual-effects-in-niagara-for-unreal-engine), Curve Assets, and Animation Curves (-> animation-curves-in-unreal-engine). This guide provides an overview of how to use the Curve Editor within Sequencer, however, many of the features and functions shown will still be compatible within other areas of the editor as well.

#### Prerequisites

- You have an understanding of Sequencer (-> how-to-make-movies-in-unreal-engine) and its Interface.

- You have an understanding of Keyframing in Sequencer (-> creating-animation-keyframes-in-unreal-engine).

## Curve Editor Overview

The Curve Editor can be opened from Sequencer by clicking the **Curve Editor** button in the Sequencer Toolbar (-> sequencer-cinematic-toolbar-in-unreal-engine).

 [image: open curve editor sequencer]

Once the Curve Editor is opened, you will see the following view:

 [image: curve editor]

- Toolbar (-> animation-curve-editor-in-unreal-engine)

- Outliner (-> animation-curve-editor-in-unreal-engine)

- Graph (-> animation-curve-editor-in-unreal-engine)

### Toolbar

The Curve Editor Toolbar contains various commands, tools, and options. These can be found listed in the table below.

 [image: curve editor toolbar]

| Name | Icon | Description |
| --- | --- | --- |
| **Save** | [image: save] | Saves the current sequence and any subscenes or shots. |
| **View Modes** | [image: view mode] | Opens a dropdown menu for the Curve Editor View Modes (-> animation-curve-editor-in-unreal-engine). |
| **Zoom to Fit** | [image: zoom to fit] | Frames and zooms in on the selected keyframes. If no keyframes are selected, then all viewable keyframes within the Graph view will be framed. You can also use the **F** hotkey for this command. |
| **Focus Playhead** | [image: focus playhead] | Focuses the graph view on the Playhead without changing zoom level. You can also use the **A** hotkey for this command. |
| **Zoom to Playback Range** | [image: zoom to playback range] | Focuses the graph view so that all keyframes are visible, including the start and end frames of the sequence. |
| **Curve Options** | [image: curve options] | Opens a menu where you can set the following commands: **Tangent Visibility**, which controls how Tangents (-> animation-curve-editor-in-unreal-engine) are drawn in the graph. You can choose from: **All Tangents**, which causes all keyframes to display their tangents, regardless of whether they are selected or not. **Selected Keys**, which only displays tangents on selected keyframes. **No Tangents**, which disables all drawing of tangents. **Auto Frame Curves**, which causes automatic framing and zooming of all visible keyframes on a curve when it is selected from the Outliner (-> animation-curve-editor-in-unreal-engine). **Snap Time to Selection**, which moves the Playhead to the selected keyframe's time. If multiple keyframes are selected, the Playhead moves to the left-most keyframe. **Buffered Curves**, which enables or disables drawing buffered curves (-> animation-curve-editor-in-unreal-engine) in the graph. **Curve Tooltips**, which shows a tooltip for a curve's name, time, and value when hovering your cursor over it in the graph. [image: curve tooltips] |
| **Time and Value Fields** | [image: time and value] | These property fields display the **Time** and **Value** of the selected keyframe. You can edit these properties directly by typing in new values. |
| **Selection Mode** | [image: select] | Enables normal keyframe and tangent selection and editing. You can also use the **Q** hotkey for this command. |
| **Transform Mode** | [image: transform] | Enables the Transform Tool (-> animation-curve-editor-in-unreal-engine) for editing keyframes. You can also use the **Ctrl + T** hotkey for this command. |
| **Retime Mode** | [image: retime] | Enables the Retime Tool (-> animation-curve-editor-in-unreal-engine), which activates a lattice manipulation mode for adjusting keyframe times. You can also use the **Ctrl + E** hotkey to enable this command. |
| **Multi Select Mode** | [image: multi select] | Enables the Multi Select Tool (-> animation-curve-editor-in-unreal-engine), which activates a scaling mode for selected groups of keyframes based on an adjustable pivot. You can also use the **Ctrl + M** hotkey to enable this command. |
| **Time Snapping** | [image: time snap] | Enables keyframe snapping (-> sequencer-cinematic-toolbar-in-unreal-engine) on horizontal (time) increments in the graph. The snap increments are based on Sequencer's Frames Per Second (-> sequencer-cinematic-toolbar-in-unreal-engine) if you are using the Curve Editor from Sequencer. Otherwise, you can click the nearby dropdown menu to select a custom time-based snapping increment. [image: curve editor time snapping] |
| **Value Snapping** | [image: value snap] | Enables keyframe snapping (-> sequencer-cinematic-toolbar-in-unreal-engine) on vertical (value) increments in the graph. You can select the nearby dropdown menu to select a custom value-based snapping increment, as well as adjust the display of the graph lines. [image: curve editor value snapping] |
| **Lock Axis** | [image: lock axis] | Opens a dropdown menu for selecting which axis to lock keyframe movements to. **Both** is the default value and allows keyframe movement in all directions in the graph. **X Only** restricts keyframe movement along the horizontal (time) axis only. **Y Only** restricts keyframe movement along the vertical (value) axis only. |
| **Cubic (Auto) Tangent** | [image: auto tangent] | Sets the selected keyframes to interpolate automatically, causing the curve's tangents to adjust based on the location of neighboring keyframes in the graph. [image: curve editor cubic auto tangent] |
| **Cubic (User) Tangent** | [image: custom tangent] | Sets the selected keyframes to use user-defined tangent angles. Whenever you adjust a tangent angle, the keyframe will automatically switch to this mode. [image: curve editor cubic user tangent] |
| **Cubic (Break) Tangent** | [image: broken tangent] | Sets the selected keyframes tangents to use broken tangent angles, allowing for keyframes that have different incoming and outgoing tangent angles. [image: curve editor broken tangent] |
| **Linear Tangent** | [image: linear tangent] | Sets the selected keyframes to use linear tangent angles. This causes the incoming and outgoing tangents to always face their respective neighbors, resulting in abrupt changes when reaching each keyframe. [image: curve editor linear tangent] |
| **Constant Tangent** | [image: stepped tangent] | Sets the selected keyframe to use stepped tangent angles, causing keyframes to maintain their value until reaching the next keyframe. [image: curve editor constant tangent] |
| **Weighted Tangents** | [image: weighted tangent] | Sets the selected keyframe to use weighted tangent angles, causing tangents to use user-defined lengths which determines the influence that tangent angle exerts over its neighboring keyframe tangents. [image: curve editor weighted tangent] |
| **Pre Infinity Settings** | [image: pre infinity] | Opens a dropdown menu for selecting the Pre-Infinity (-> animation-curve-editor-in-unreal-engine) behavior of the selected keyframe or curve. |
| **Post Infinity Settings** | [image: post infinity] | Opens a dropdown menu for selecting the Post-Infinity (-> animation-curve-editor-in-unreal-engine) behavior of the selected keyframe or curve. |
| **Flatten Tangent** | [image: flatten tangent] | Flattens the tangents of the selected keyframes horizontally. [image: curve editor flatten tangent] |
| **Straighten Tangent** | [image: straighten tangent] | When using **Broken Tangents** on a keyframe, selecting this will straighten the tangent angles, but not unbreak them. The angles will straighten along an average angle between the two broken tangents. |
| **Filter Tool** | [image: filter] | Opens the Filter Tool (-> animation-curve-editor-in-unreal-engine) window, where you can **bake**, **simplify**, and perform other curve functions. |

### Outliner

The Curve Editor Outliner contains header information for all animatable tracks added to your sequence, as well as a track filter and playback controls.

 [image: curve editor outliner]

Selecting entries from the list automatically filters and frames the Graph View (-> animation-curve-editor-in-unreal-engine) to only display curves from that selection and any children. You can disable the auto-framing behavior by disabling **Auto Frame Curves** from the **Curve Options** toolbar menu.

 [image: outliner filter selection]

You can also use the search bar to search for entries to narrow down the list. Any returned results will also include children tracks.

 [image: outliner search]

Contents displayed in the outliner are determined by what tracks you have selected from Sequencer. Selecting tracks in the Sequencer window will cause only the selected tracks to appear in the Curve Editor Outliner. Deselecting all tracks in Sequencer will cause all contents to appear in the Curve Editor.

 [image: outliner sequencer select filter]

You can disable this selection matching and filtering behavior by disabling **Synchronize Curve Editor Selection** and **Isolate Curve Editor to Selection** in the Sequencer Editor Preferences (-> cinematic-editor-and-project-settings-in-unreal-engine) window.

### Graph

The Curve Editor Graph contains a two-dimensional display of your keyframes, and the interpolated curves generated. The graph plots both **Time **and **Value **on the **Horizontal** and **Vertical** axes, respectively, and keyframes are positioned in the graph according to those properties.

 [image: curve editor graph]

## Graph Navigation

There are several ways to navigate within the graph, as well as different View Modes (-> animation-curve-editor-in-unreal-engine) you can use for representing curve data.

### Panning

Use **RMB **to pan the graph view freely.

 [image: graph pan]

Holding **Shift + RMB** will pan along either the horizontal or vertical axis, depending on the initial direction of your cursor.

 [image: graph pan single axis]

Holding **Alt + MMB** will pan only along the horizontal axis.

 [image: graph pan horizontal]

### Zooming

Scrolling the mouse wheel will zoom the graph relative to the Playhead.

 [image: graph zoom scroll]

Holding **Alt + RMB** will smoothly zoom the graph according to your cursor movement. The zoom pivot is relative to your cursor position upon pressing **RMB**.

 [image: graph zoom cursor smooth]

Holding **Alt + Shift + RMB** will freely zoom the graph according to your cursor movement, which enables scaling time and value axes separately. Moving your cursor up and down will scale the value axis, and moving it left and right will scale the time axis.

 [image: graph zoom free]

### View Modes

The **View Modes** menu contains different options to visualize your curves.

 [image: curve editor view mode]

**Absolute View Mode** is the default view mode, in which all curves and keyframes are displayed at their exact values in the graph. This mode functions similarly to most animation curve editors.

 [image: absolute view mode]

**Stacked View Mode** will separate each curve into its own group, and stack them in the graph. Each group's value range is normalized between **-1** and **1**.

 [image: stacked view mode]

**Normalized View Mode** will display all curve and keyframe values overlapping along a normalized value range of **-1** and **1**. This view can be useful if you are wanting to universally scale curve amounts proportionally.

 [image: normalized view mode]

## Curve Editing

The Curve Editor is primarily used for editing your **keyframes **and **tangents**. You can add, remove, or change keyframe locations which affect the curve. You can also edit a keyframe's tangent, and control the incoming and outgoing curve vectors of a keyframe, which also affects the curve. There are also a variety of features and behaviors to help with your editing.

### Editing Keyframes

Keyframes can be moved by using **LMB **and dragging them around the graph. Depending on your **Snap **settings, it should be possible to move a keyframe anywhere along the time and value axes. You can also use **MMB **to move selected keyframes relative to your cursor position. This provides an easier way for manipulating keyframes without needing selection accuracy.

 [image: curve editor move keyframe]

Holding **Shift **and dragging a keyframe will cause it to lock on either the horizontal or vertical axes as it moves, depending on the initial direction of your cursor.

 [image: move key axis]

Clicking a curve segment will select all keyframes for that curve. With these selected, you can move entire curves by dragging a keyframe or by using **MMB **to move the curve relative to your cursor.

 [image: curve editor move entire curve]

### Creating New keyframes

Keyframes can be added along a curve by clicking **MMB **when your cursor is hovered over a curve segment.

 [image: add key to curve]

You can also create keyframes without disturbing the curve structure by holding **Ctrl** and clicking **MMB** on any curve segment.

 [image: add key to curve without disruption]

### Copy and Paste

Keyframes can be **cut **(Ctrl + X), **copied **(Ctrl + C), and **pasted **(Ctrl + V) on the same curve and across different curves. There are also certain rules and contexts that determine the paste behavior.

When copying and pasting keys, they will paste at their original value and relative to the Playhead. Pasting multiple keys will cause the starting (left-most) keyframe to be placed at the **playhead**, and all other keys relative to that point.

 [image: copy paste curve keys]

Depending on which curve you have selected and filtered in the Outliner (-> animation-curve-editor-in-unreal-engine), the paste operation will occur on all curves within the current view.

 [image: copy paste all curves]

If multiple curves are within the current view and you want to paste on only one of them, you can click the curve segment, which will select all keyframes for that curve, and press **Ctrl + V**.

 [image: copy paste single curve]

### Editing Tangents

When selecting your keyframes, they will display their **tangent **information. Tangents are lines that control the incoming and outgoing direction of the curve as it reaches the keyframe. You can select either side of the tangent handle and edit them to control the curve trajectory from that keyframe.

 [image: tangents]

Depending on your **Tangent Visibility** settings in the **Curve Options** menu, your tangents may be displayed differently. Ensure this is set to **Selected Keys** for the default behavior.

 [image: tangent visibility]

To edit a Tangent, first select a keyframe, then select the tangent handle and drag it around in the graph. Similar to moving keyframes, you can also use the **MMB **to move the tangent relative to your cursor position.

 [image: edit tangent curve editor]

Multiple tangents can be adjusted at the same time by multi-selecting them and using **MMB **to edit them.

 [image: edit multiple tangents]

If multiple keyframes are selected, clicking a single tangent will select all tangent handles of the same side.

 [image: select all tangent handles]

Holding the **Shift **key while moving your tangents will snap them to the nearest 45 degree increment.

 [image: snap tangent angle]

Various tangent modes are located in the **toolbar**, and can be used to change the tangent angle of the selected keyframe. Reference the Toolbar (-> animation-curve-editor-in-unreal-engine) section in this document to view their behaviors.

 [image: tangent mode]

### Weighted Tangents

With a keyframe selected, clicking the **Weighted Tangents** toolbar button will enable weighted tangent angles. This causes tangents to have user-defined lengths which determines the influence that tangent angle exerts over its neighboring keyframe tangents.

Once **Weighted Tangents** is enabled, you can stretch the tangent to increase its influence on the curve, or shrink it to decrease its influence.

 [image: weighted tangent]

### Buffer Curves

Curves can be temporarily saved and stored (known as buffering), which is useful when making experimental changes to your curves as these curves can be reverted to their stored state. While a curve is buffered, it will display an after-image on the graph for your reference.

To store a curve, right-click a part of the curve segment and select **Buffer Curves**.

 [image: store curves]

After a curve is stored, you can make any edits you want to the curve. Keyframes and tangents can be added, edited, or removed. To revert your curve back to the original stored version, right-click the curve segment and select **Apply 1 Buffered Curves**. Buffered curve data is locked to the curve it is stored on, so you cannot buffer for one curve and then apply that buffered data to a different curve.

 [image: apply stored curve]

You can also **Swap** your curves, which restores the curve but also stores the changes you just made. To do this, right-click the curve and select **Swap Buffered Curves onto Selected Curves**.

 [image: swap buffered curve]

Stored curves are lost whenever you close the Sequencer window.

### Pre and Post Infinity

Curves also contain rules for how they should behave in the timeframes before and after their keyframe segments. This is known as **Pre **and **Post Infinity**, and can be useful in order to extend the animation on a curve without needing to create additional keyframes. **Pre-Infinity** affects the curve region before the first keyframe, and **Post-Infinity** affects the curve region after the last keyframe.

 [image: pre post infinity]

You can access the Pre and Post Infinity settings for your curves by clicking the **Pre **or **Post Infinity** buttons in the **Toolbar** (-> animation-curve-editor-in-unreal-engine), or by right-clicking a curve segment and selecting **Pre-Infinity** and **Post-Infinity**. Both methods require you have a keyframe selected from the curve you want to adjust .

 [image: pre post infinity menu]

You can choose from the following infinity types:

| Name | Description |
| --- | --- |
| **Constant** | This is the default value for all new curves, and will cause the curve to retain its value leading up to the first key, and after the final key. [image: constant infinity] |
| **Cycle** | The curve will repeat, using the absolute values of the keyframes for each loop segment. [image: cycle infinity] |
| **Cycle with Offset** | Similar to **Cycle**, the curve will repeat, however each loop segment's value will be set relative to the previous, causing the curve to compound for each loop. [image: cycle with offset infinity] |
| **Linear** | The curve will project the first and last keyframe's tangent angle outward. [image: linear infinity] |
| **Oscillate (Ping Pong)** | Similar to **Cycle**, the curve will repeat, however each loop segment will mirror the previous, going backward and forward for each loop. [image: oscillate ping pong infinity] |

For looping-based infinity modes, such as Cycle and Oscillate, the loop length is defined by the number of keyframes used. Therefore, it will adjust as you add or adjust the length of your keyframe segments.

 [image: cycle length infinity]

### Custom Curve Colors

If you want to alter the displayed color of a curve, which can be useful when you want to visually differentiate property curves, you can use the following commands from the **Curve Options** toolbar menu:

- **Set Random Curve Colors**, which applies a random color to all visible curves.

- **Set Curve Color For Selected**, which opens a Color Picker where you can apply a specific color to a curve. Select a color and click **OK** to apply the color to the curve.

Custom curve colors are saved on the specific property or channel curve, enabling them to be re-used throughout your project. To view or change curve color data, open **Editor Preferences** by clicking **Edit > Preferences** in the main Unreal Engine menu. Navigate to the **Content Editors > Curve Editor** section and locate the **Custom Colors** property array. Here you can add, edit, or remove custom color data. Deleting entries will restore the default color for that curve.

## Curve Tools

When editing curves, **Selection Mode** is the default behavior for interacting with keyframes. There are also a variety of other tools you can enable to assist in scaling, transforming, and warping your keyframes.

 [image: curve editor select mode]

### Transform Tool

The Transform Tool enables a lattice interface when you select your keyframes. You can use the various controls on this lattice to adjust your keyframes' times and values.

To activate the Transform Tool, click the **Transform Tool** button in the toolbar, then select multiple keyframes.

 [image: curve editor transform tool]

Various points on the lattice can be manipulated, which scales the entire selection relative to the center point. You can drag the **Corners**, **Edges**, and **Central **areas to adjust the curve.

 [image: transform tool controls]

The pivot point of the transform can also be dragged and changed. It will snap to the edges, corners, and center of the lattice, when moving close to those points.

 [image: transform tool pivot]

When the Transform Tool is active, you can also use the **Tool Options** properties to set explicit values for the lattice. These properties affect specific areas of the lattice and display in absolute **Seconds**.

| Name | Description |
| --- | --- |
| **Upper / Lower Bound** | These properties control the locations of the upper and lower bounds of the lattice. [image: upper bound lower bound] |
| **Left / Right Bound** | These properties control the locations of the left and right bounds of the lattice. [image: left bound right bound] |
| **Scale Center X / Y** | These properties control the location of the scale pivot point. [image: transform tool pivot] |

### Retime Tool

The Retime Tool enables a one-dimensional lattice tool, with which you can specify arbitrary anchor points along the time graph in order to retime your keyframes relative to those points.

To enable the Retime Tool, click the **Retime Tool** button in the toolbar. This will cause two vertical green lines to appear, which are **Retime Anchors**.

 [image: retime tool]

Drag either of the Retime Anchors to retime your keys. When you select one, it will show its influence between its adjacent anchors, which is a linear falloff.

 [image: retime tool edit]

Double-click in the graph to add new anchor points, and click the **Delete (X)** button below the anchor lines to remove anchors.

 [image: retime tool add delete]

### Multi Select Tool

The Multi Select Tool enables a pivot-based scaling tool, with which you can scale your curve along either the value or time axes relative to a set pivot point.

To enable the Multi Select Tool, click the **Multi Select Tool** button in the toolbar, then select multiple keyframes.

 [image: multi select tool]

Dragging either the vertical or horizontal handles will stretch the selected keyframes along the time or value axes. The horizontal handle corresponds to the **XScale **property, and the vertical handle corresponds to **YScale**.

 [image: multi select tool edit]

The **Pivot Type** property controls the placement of the scale pivot point, which is denoted with a crosshair overlay on the graph. You can select the following options from it:

- **Average**, which will place the pivot at the average location between all selected keyframe points and values.

- **Bound Center**, which will place the pivot at the center point of the bounding box of all selected keyframes.

- **First Key**, which will place the pivot at the location of the left-most selected keyframe.

- **Last Key**, which will place the pivot at the location of the right-most selected keyframe.

 [image: multi select tool pivot type]

### Filter Tool

The Filter Tool contains various filters and commands with which you can **Bake**, **Smooth**, and perform other operations to your curves. To open the Filter Tool window, click the **Filter Tool** button in the toolbar.

 [image: curve editor filter tool]

When performing filter commands, the commands will only apply to the keyframes and curves you have selected in the graph.

#### Bake

Baking causes new linear keyframes to be created along your curve selection at a specified interval when clicking **Apply**.

 [image: curve editor bake keyframes]

When baking a curve section, only the section between your keyframe selections will be baked. In the above example you can see curve sections outside of the selection are not being baked.

Bake has the following properties:

| Name | Description |
| --- | --- |
| **Use Frame Bake** | If this is enabled, then keyframes will be baked according to the Frames Per Second (-> sequencer-cinematic-toolbar-in-unreal-engine) value of the sequence. |
| **Bake Interval in Frames** | The interval to bake keyframes relative to the framerate of the sequence. A value of **1** will bake every frame, and higher number values will skip that number of frames. |
| **Bake Interval in Seconds** | If **Use Frame Bake** is disabled, then this will be the seconds-based interval to bake keyframes. |

#### Euler

The Euler filter is used to correct rotational frame jumps. Typically these can occur when working with imported raw motion capture data.

 [image: curve editor fix rotation 360 180 euler filter]

#### Fourier Transform (FFT)

The Fourier Transform filter is used to smooth keyframes with a lot of divergences or noise between them. The smoothing effect is achieved without deleting keyframes, and is based on intelligent low or high pass smoothing with frequency parameters. Typically you would use this if you are cleaning up raw imported motion capture animation, or smoothing a noisy curve with many keyframes.

 [image: curve editor fourier transform fft filter]

Select **Fourier Transform (FFT)** in the filters window to view its properties.

 [image: fourier filter properties]

| Name | Description |
| --- | --- |
| **Cutoff Frequency** | This property controls the strength of the filtering effect. If **Type** is set to **Lowpass**, then you will need to set this value lower in order to produce a smoother result. If **Type** is set to **Highpass**, then you will need to set this value higher. |
| **Type** | Which types of frequencies are to be allowed through. If **Lowpass** is specified, then low frequency noise will be ignored and filtering will only occur on high frequency noise. |
| **Response** | The type of Fourier filter to use. **Butterworth** filter removes noise from data without affecting the curve's minimum or maximum values. **Chebyshev** filter removes noise from the data and can affect the curve's minimum or maximum values, but it will have a sharper cutoff at the specified frequency, and will improve accuracy in some cases. |
| **Order** | The number of samples to use when filtering in the time domain, which affects how steep the roll-off is for the filter. |

In this example, a **Butterworth **filter type is being used to remove high frequency noise along a curve when clicking **Apply**.

 [image: fourier butterworth filter]

#### Simplify

The Simplify filter removes redundant keyframes based on a tolerance amount, while still maintaining the overall curve. You can also set the following properties to customize the Simplify operation:

| Name | Description |
| --- | --- |
| **Tolerance** | The higher the **Tolerance** value, the more the filtered curve is allowed to deviate from the original, which causes more keyframes to be removed. |
| **Try Remove User Set Tangent Keys** | Enables using **Sample Rate** as the method to sample between evaluated keyframes, which includes keyframes with user tangents to be possibly removed during simplification. |
| **Sample Rate** | The frame rate at which the curve should be sampled to compare against **Tolerance**. |

Click **Apply** to execute the Simplify command on all selected keyframes.

 [image: curve editor simplify curve filter]

- sequencer
- animation curves
- curve

On this page

- Prerequisites (-> animation-curve-editor-in-unreal-engine)
- Curve Editor Overview (-> animation-curve-editor-in-unreal-engine)
- Toolbar (-> animation-curve-editor-in-unreal-engine)
- Outliner (-> animation-curve-editor-in-unreal-engine)
- Graph (-> animation-curve-editor-in-unreal-engine)
- Graph Navigation (-> animation-curve-editor-in-unreal-engine)
- Panning (-> animation-curve-editor-in-unreal-engine)
- Zooming (-> animation-curve-editor-in-unreal-engine)
- View Modes (-> animation-curve-editor-in-unreal-engine)
- Curve Editing (-> animation-curve-editor-in-unreal-engine)
- Editing Keyframes (-> animation-curve-editor-in-unreal-engine)
- Creating New keyframes (-> animation-curve-editor-in-unreal-engine)
- Copy and Paste (-> animation-curve-editor-in-unreal-engine)
- Editing Tangents (-> animation-curve-editor-in-unreal-engine)
- Weighted Tangents (-> animation-curve-editor-in-unreal-engine)
- Buffer Curves (-> animation-curve-editor-in-unreal-engine)
- Pre and Post Infinity (-> animation-curve-editor-in-unreal-engine)
- Custom Curve Colors (-> animation-curve-editor-in-unreal-engine)
- Curve Tools (-> animation-curve-editor-in-unreal-engine)
- Transform Tool (-> animation-curve-editor-in-unreal-engine)
- Retime Tool (-> animation-curve-editor-in-unreal-engine)
- Multi Select Tool (-> animation-curve-editor-in-unreal-engine)
- Filter Tool (-> animation-curve-editor-in-unreal-engine)
- Bake (-> animation-curve-editor-in-unreal-engine)
- Euler (-> animation-curve-editor-in-unreal-engine)
- Fourier Transform (FFT) (-> animation-curve-editor-in-unreal-engine)
- Simplify (-> animation-curve-editor-in-unreal-engine)
