# Using Calibration Test Patterns with nDisplay

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-calibration-test-patterns-with-ndisplay-in-unreal-engine?application_version=5.9

> How to make nDisplay show test patterns that you can use to validate your setup.

[image: Using Calibration Test Patterns with nDisplay]

When you set up a new installation that uses nDisplay, partucularly with multiple viewports spread across multiple LED screens, you may sometimes have subtle display problems that are challenging to detect and diagnose when rendering a 3D virtual world. For example, you may experience tearing between adjacent viewports, display synchronization issues, seams between adjacent viewports, or slight color variations between adjacent display devices.

To make detecting these problems easier, nDisplay offers several different 2D test patterns that tile across your display devices. The regularity of these test patterns helps draw your eye to any problems. If you ensure that your nDisplay installation renders test patterns cleanly without any visible tearing or sync issues, you can be more confident that your devices will also be locked in sync when you use them to display your 3D virtual worlds.

## Activating Test Patterns

- The nDisplay Plugin includes a **Display Cluster Test Patterns Actor**. Find this Actor in the **Place Actors** panel and drag it into your Level Viewport. [image: Add the Test Patterns Actor]

- Activate your choice of test patterns by issuing the `nDisplay.Calibration.Pattern` console command, or by sending a cluster event to the network. See the Console Command Syntax (-> using-calibration-test-patterns-with-ndisplay-in-unreal-engine) and Cluster Event Syntax (-> using-calibration-test-patterns-with-ndisplay-in-unreal-engine) sections below for details. In both cases, you need to specify the name of the pattern you want to activate, the viewports that you want to show the test pattern. Each pattern also offers additional optional parameters to control aspects like the scale of the pattern and rate of motion across the viewports.

### Console Command Syntax

The `nDisplay.Calibration.Pattern` console command has the following syntax:

```
	nDisplay.Calibration.Pattern [pattern ID] [viewport IDs] [material parameter 1] … [material parameter N]
```

nDisplay.Calibration.Pattern [pattern ID] [viewport IDs] [material parameter 1] … [material parameter N]

with the following parameters:

| Parameter | Description |
| --- | --- |
| **pattern ID** | Specifies the test pattern you want to activate. This name should match the name assigned to one of the test patterns registered with the **Display Cluster Test Patterns Actor**. If it does not match one of those test patterns, the current test pattern will be removed. |
| **viewport IDs** | Specifies the nDisplay viewports that should show the test pattern. This must be one of the following values: The ID of a viewport section in your nDisplay calibration flle. A comma-separated list of viewport IDs that match viewport sections in your nDisplay configuration file. The special value `*`, which applies the test pattern to all viewports. |
| **material parameter** | A list of parameters and values that override default settings for the chosen pattern. Each parameter should be in the form `<name>:<type>:<value>`, where `<name>` is the name of the parameter you want to set, `<type>` is the type of data managed by that parameter, and `<value>` is the actual value you want to set. Use the table in the Test Patterns and Parameters (-> using-calibration-test-patterns-with-ndisplay-in-unreal-engine) section below as a reference to the names and types. Parameters with type `scalar` require values that are a single floating-point number. Parameters with type `color` require values that are made up of four floating-point numbers separated by commas. These numbers are interpreted in **RGBA** order: red, green, blue, alpha. |

For example, this console command sets all viewports to show the `TPSCircles` pattern:

```
	nDisplay.Calibration.Pattern TPSCircles *
```

nDisplay.Calibration.Pattern TPSCircles *

This console command shows the `TPSCircles` pattern only on three viewports, named `vp1`, `vp2`, and `vp3`:

```
	nDisplay.Calibration.Pattern TPSCircles vp_1,vp_2,vp_3
```

nDisplay.Calibration.Pattern TPSCircles vp_1,vp_2,vp_3

This console command is the same as above, but also overrides the default values for the width and color of the lines in the pattern:

```
	nDisplay.Calibration.Pattern TPSCircles vp_1,vp_2,vp_3 LineWidth:scalar:0.2 LineColor:color:1,0,0,0
```

nDisplay.Calibration.Pattern TPSCircles vp_1,vp_2,vp_3 LineWidth:scalar:0.2 LineColor:color:1,0,0,0

### Cluster Event Syntax

To activate a test pattern by sending a cluster event to your nDisplay network, set up your cluster event as follows:

|  | Description |
| --- | --- |
| **Event category** | `nDisplay` |
| **Event type** | `Calibration` |
| **Event name** | `Pattern` |
| **Parameter 1** | `PatternId = <pattern ID>` Where `<pattern ID>` specifies the test pattern you want to activate. This name should match the name assigned to one of the test patterns registered with the **Display Cluster Test Patterns Actor**. If it does not match one of those test patterns, the current test pattern will be removed. |
| **Parameter 2** | `ViewportId = <viewport IDs>` Specifies the nDisplay viewports that should show the test pattern. `<viewport IDs>` must be one of the following values: The ID of a viewport section in your nDisplay calibration flle. A comma-separated list of viewport IDs that match viewport sections in your nDisplay configuration file. The special value `*`, which applies the test pattern to all viewports. |
| **Additional parameters** | You can pass additional parameters to the cluster event to override default settings exposed by the chosen pattern. Each parameter you pass should be in the form `<name> = <type>:<value>`, where `<name>` is the name of the parameter you want to set, `<type>` is the type of data managed by that parameter, and `<value>` is the actual value you want to set. Use the table in the Test Patterns and Parameters (-> using-calibration-test-patterns-with-ndisplay-in-unreal-engine) section below as a reference to the names and types. Parameters with type `scalar` require values that are a single floating-point number. Parameters with type `color` require values that are made up of four floating-point numbers separated by commas. These numbers are interpreted in **RGBA** order: red, green, blue, alpha. |

## Test Patterns and Parameters

This section describes the test patterns that come pre-installed with nDisplay, along with the parameters you can specify for each.

If you select your **Display Cluster Test Patterns Actor** in the Level Viewport or the **World Outliner**, you'll see the list of all available calibration patterns in the **Details** panel under the **Display Cluster > Calibration Patterns** property.

### TPSCircles

 [image: TPSCircles]

| Name | Type |
| --- | --- |
| Repeats | scalar |
| LineWidth | scalar |
| LineColor | color |

### TPSColoredBars

 [image: TPSColoredBars]

| Name | Type | Notes |
| --- | --- | --- |
| Shades | scalar |  |
| Direction | scalar | Sets the direction of the bars. Accepts the following values: `0`: vertical `1`: horizontal |

### TPSGrayBars

 [image: TPSGrayBars]

| Name | Type | Notes |
| --- | --- | --- |
| Shades | scalar |  |
| Direction | scalar | Sets the direction of the bars. Accepts the following values: `0`: vertical `1`: horizontal |

### TPSGridCircles

 [image: TPSGridCircles]

| Name | Type |
| --- | --- |
| Repeats | scalar |
| LineWidth | scalar |
| LineColor | scalar |

### TPAChevron

 [image: TPAChevron]

| Name | Type |
| --- | --- |
| Repeats | scalar |
| LineWidth | scalar |
| LineColor | scalar |
| Speed | scalar |

### TPAGrid

 [image: TPAGrid]

| Name | Type |
| --- | --- |
| Repeats | scalar |
| LineWidth | scalar |
| LineColor | scalar |
| Speed | scalar |

### TPAMirroredChevron

 [image: TPAMirroredChevron]

| Name | Type |
| --- | --- |
| Repeats | scalar |
| Color1 | color |
| Color2 | color |
| Speed | scalar |

### TPARadar

 [image: TPARadar]

| Name | Type |
| --- | --- |
| Speed | scalar |
| Power | color |

### TPAStrips

 [image: TPAStrips]

| Name | Type | Notes |
| --- | --- | --- |
| Repeats | scalar |  |
| LineWidth | scalar |  |
| LineColor | scalar |  |
| Speed | scalar |  |
| Direction | scalar | Accepts the following values: `0`: vertical `1`: horizontal |

You can also use your own custom test pattern. Create a new Post-Process Material in your Project, and add it to the **Calibration Patterns** property of your **Display Cluster Test Patterns Actor**. Once you do this, you'll be able to trigger your own test pattern across your nDisplay cluster using either the console command or the cluster event methods shown above.

- rendering
- vfx
- graphics
- guide
- ndisplay

On this page

- Activating Test Patterns (-> using-calibration-test-patterns-with-ndisplay-in-unreal-engine)
- Console Command Syntax (-> using-calibration-test-patterns-with-ndisplay-in-unreal-engine)
- Cluster Event Syntax (-> using-calibration-test-patterns-with-ndisplay-in-unreal-engine)
- Test Patterns and Parameters (-> using-calibration-test-patterns-with-ndisplay-in-unreal-engine)
- TPSCircles (-> using-calibration-test-patterns-with-ndisplay-in-unreal-engine)
- TPSColoredBars (-> using-calibration-test-patterns-with-ndisplay-in-unreal-engine)
- TPSGrayBars (-> using-calibration-test-patterns-with-ndisplay-in-unreal-engine)
- TPSGridCircles (-> using-calibration-test-patterns-with-ndisplay-in-unreal-engine)
- TPAChevron (-> using-calibration-test-patterns-with-ndisplay-in-unreal-engine)
- TPAGrid (-> using-calibration-test-patterns-with-ndisplay-in-unreal-engine)
- TPAMirroredChevron (-> using-calibration-test-patterns-with-ndisplay-in-unreal-engine)
- TPARadar (-> using-calibration-test-patterns-with-ndisplay-in-unreal-engine)
- TPAStrips (-> using-calibration-test-patterns-with-ndisplay-in-unreal-engine)
