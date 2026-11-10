# Geographically Accurate Sun Positioning Tool

https://dev.epicgames.com/documentation/en-us/unreal-engine/geographically-accurate-sun-positioning-tool-in-unreal-engine?application_version=5.9

> A tool giving you fine control over the Sun's geographic location based on latitude, longitude, date, and time.

[image: Geographically Accurate Sun Positioning Tool]

In some contexts, the position of the Sun in the sky is not an aesthetic choice. Instead, it is a critical design factor.

This is often true in large architectural and construction projects, but it may apply any time you need to produce true-to-life renderings that show realistic patterns of sunlight and shadow.

In these cases, you need to be able to place the Sun in your Unreal Engine Level precisely, according to the same mathematical equations that govern the position of the Sun in the real sky of Earth. These complex equations incorporate a number of settings that include the geographical location of the observer on the globe, the date, and the time of day.

The **Sun Position Calculator** Plugin solves these mathematical equations for you in the Unreal Engine. You define the latitude, longitude, cardinal points, date, and time of day. Then, the Sun Position Calculator works in tandem with the default sky sphere in the Unreal Engine to place the Sun disk in the sky sphere and to orient the main Directional Light in the Level.

## Getting Started

**Prerequisite**: The Sun Positioner works with the default **BP_SkySphere** that you'll find already set up for you in most new levels you create in the Unreal Editor. You must make sure that your Level contains a **BP_SkySphere** instance.

To get started:

- From the **main menu**, choose **Edit > Plugins**.
- Find the **Sun Position Calculator** plugin under the **Misc** category, and check its **Enabled** checkbox.[image: Enable the Sun Position Calculator plugin] Enable the Sun Position Calculator plugin Click for full image.
- Click **Restart Now** to apply your changes and re-open the Unreal Editor.[image: Restart Unreal Editor Now] Restart Unreal Editor Now Click for full image.
- Navigate to the **Content Browser**, open the **Settings** and enable both **Show Engine Content** and **Show Plugin Content**.[image: Adjusting settings of the Content Browser]
- Find the **BP_SunPosition** Asset in the **SunPosition Content** folder, and drag it into the **Viewport**.[image: Drag and drop the BP_SunPosition]It is represented by a gizmo that looks like the cardinal points of a compass. (This gizmo only appears in the Unreal Editor, not when you run your Project.)
- Select the gizmo in the **Viewport**, or the **BP_SunPosition** Actor in the **Outliner**.[image: Select the BP_SunPosition] Select the BP_SunPosition Click for full image.
- In the **Details** panel, set up the properties of your scene that govern the Sun placement:[image: Set the location, date, and time] | Setting | Description |
| --- | --- |
| **Latitude** | Use negative values for coordinates South of the equator, and positive values for coordinates North of the equator. |
| **Longitude** | Use negative values for coordinates West of the meridian, and positive values for coordinates East of the meridian. |
| **Time Zone** | Set this value to indicate the number of hours your scene is offset from Coordinated Universal Time (UTC) or Greenwich Mean Time (GMT). |
| **North Offset** | Controls the relation between the objects in your Level and the cardinal points of the compass. Changing this control also rotates the visual placement of the **BP_SunPosition** gizmo in your Level. Adjust this value until the cardinal points shown on the gizmo point are oriented correctly with respect to the objects in your Level.Don't rotate the gizmo itself in the Level Viewport using the Rotate tool. Only use this North Offset setting to control the cardinal points. |
| **Date** and **Time** | Set the time of year and the time of day you want to simulate. |

As you change the values of these properties, you should see the Sun move around in your sky and the shadows change in the Unreal Editor.

## Modifying Settings at Runtime

You can change the settings for the **BP_SunPosition** Actor at runtime. This allows you to drive the position and light angle of the Sun based on UI widgets or other gameplay events.

- In order to be able to change the angle of the sunlight at runtime, you need to make the main Directional Light in your Level Movable. Select the Directional Light in the **Outliner** or the **Level Viewport**, find the **Mobility** setting in the **Details** panel, and set it to **Movable**.[image: Setting the Light Mobility]
- When you want to modify a value at runtime in a Blueprint script, you need an Object Reference to the **BP_SunPosition** Actor contained in your Level. You can retrieve it dynamically using the **Get All Actors of Class** node as shown below:[image: Get a reference to the BP_SunPosition Actor]Because **Get All Actors of Class** can be expensive, it's best to do this once (say, when the level is loaded or your widget is constructed) and saving the result to a variable, rather than doing it each time you need to get or set a value.
- Once you have the Object Reference, drag right from its output port and expand the **Variables** category to find the list of **Get** and **Set** nodes that you can use to retrieve and set the same values exposed in the **Details** panel in the Unreal Editor.[image: Get and Set API for the BP_SunPosition Actor]
- Set as many values as you need to their new values. When you're done, drag right from the output port of the **BP_SunPosition** variable and invoke its **Update Sun** node.[image: Update Sun function]

For example, the following snippets from a Widget Blueprint set up a UI slider that changes the hour to any value between 6am and 10pm.

[image: Example of changing the sun position at runtime] Example of changing the sun position at runtime

Click for full image.

In action, the slider looks like this:

- rendering
- artist tool
- lighting
- visualization

On this page

- Getting Started (-> geographically-accurate-sun-positioning-tool-in-unreal-engine)
- Modifying Settings at Runtime (-> geographically-accurate-sun-positioning-tool-in-unreal-engine)
