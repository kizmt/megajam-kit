# Celestial Vault

https://dev.epicgames.com/documentation/en-us/unreal-engine/celestial-vault-plugin-for-unreal-engine?application_version=5.9

> You can use the Celestial Vault plugin to implement a time of day system using an accurate representation of the day and night sky including the solar system.

[image: Celestial Vault]

Learn to use this **Beta** feature, but use caution when shipping with it.

The Sun Moon Day Sequence Actor provided in the **Day Sequence (-> day-sequence-time-of-day-plugin-for-unreal-engine)** plugin is ideal for artistic skies, but it lacks the exact locations of the celestial bodies, which are required for more accurate simulation or architectural projects.

This plugin is an implementation of a Day Sequence with more scientific considerations. Ensure you are familiar with Day Sequence (-> day-sequence-time-of-day-plugin-for-unreal-engine) before using this plugin.

The **Celestial Vault** plugin offers the following additional considerations for more accurate representations of the sky:

- A Celestial Vault background considering the Earth's rotation.
- A Starfield where the stars' locations and magnitude are data-driven from official catalogs, or from arbitrary fictional locations.
- Solar System Planets, accurately placed using the VSOP87 equations.
- The Moon, with its appropriate phases based on the Ephemeris. (Manual Control is still possible.)
- All lighting units are set according to the real-life physical units, with a large luminance difference between Day and Night.

The focus has been set on the Solar System as seen from the Earth, using the same Geocentric approach as Plato. A Heliocentric approach allowing travel between planets has not yet been considered.

## Enabling Celestial Vault Day Sequence in a Project

To start using the Celestial Vault Day Sequence Actor in your scene, you must first enable the Celestial Vault plugin for your project. You can find it in the Plugins browser located in the Edit menu.

[image: Enable the Celestial Vault Plugin] Enable the Celestial Vault Plugin

This plugin can be enabled on its own. It does not require also enabling the DaySequence plugin.

You can enable the GeoReferencing (-> georeferencing-a-level-in-unreal-engine) plugin to use in conjunction with the Celestial Vault plugin. When doing so, be sure to set them to the same referenced locations.

## Working with the Day Sequence Actor

The Celestial Vault Day Sequence Actor is based on the same concept as a Day Sequence Collection Asset. You can control any property using the sequence associated with the actor. The sky and celestial bodies are automatically animated by the actor at the frequency defined by the sequence update interval.

The Sequence associated with the actor will loop over each day, but the celestial bodies' motions are not concerned by this loop. They will automatically increment the day count from the beginning and maintain their proper locations over multiple days.

The actor will automatically make sure that:

- The Celestial Vault rotates around the Earth's rotation axis in 24 hours.
- The Sun is following its trajectory in the sky.
- The Moon is following its sidereal motion — moves eastward by about 13 degrees against the background stars and rises about 50 minutes later each day — its phase is dynamically adjusted.
- The Planets are located at the right position. Because of their slow motion and to save computation time, the assumption is made that they won't be moving in the sky over several days.
- The Stars have a fixed location relative to the Vault, moving with the observer to have a parallax-free behavior.

## Celestial Vault Day Sequence Actor

### Adding the Actor to the World

The Celestial Vault Day Sequence Actor is a preconfigured complete day and night cycle that you can drag and drop into your level. It requires no additional setup to be fully functioning.

Follow these steps to get started:

- Create a new blank level or open an existing level. If your level already has environment lighting components—directional lights, Sky Light, Sky Atmosphere, Volumetric Clouds, and Global Post-Process Volume—these should be removed.
- From the main toolbar of the level editor, click Create and drag a Celestial Vault Day Sequence Actor into the scene from the All rollout category.

[image: Create Celestial Vault Day Sequence Actor] Create Celestial Vault Day Sequence Actor

This system uses physically accurate units for the lights' intensities and bodies' luminances. There is a huge dynamic range between night and Day (EV100 ranging from -7 to 14).

To accommodate this, special values of the HDR Eye adaptation and Local Exposure settings are needed. The actor already includes a preconfigured Postprocess Volume Component of infinite extent.

You can use it for your project, but if you want to have your own, make sure that you disable this one. Either the actor or the various materials allows you to work with other fake units.

|  |  |
| --- | --- |
|  |  |

And because the eye adaptation will take a while to adjust, consider increasing the Speed Up and Speed Down values when working.

### Working with the Actor Properties

Once the Celestial Vault Day Sequence Actor has been added to the level, you’re free to change any value from its components.

Likewise, the Celestial Vault Day Sequence Actor always needs to be located at the World Origin. You should not change its location.

All the properties driving that you need to control are part of the actor itself:

#### Date & Daylight Savings

The entered date will be the initial date considered on BeginPlay() — when the game starts. The property itself won't change over time, so sequence control actions like Play(), Pause(), and Stop() are performed at runtime. The system maintains a count of elapsed days, and a call to Stop() resets the date to the initial date.

The current DateTime can be queried on the actor using GetDateAndTime().

The system automatically determines whether the current date falls within the DST period, based on the hemisphere and switch rules specific to your country.

| Property | Description |
| --- | --- |
| Date |  |
| ** Use Current Date** | When checked, the system will be initialized with the Year, Month, and Day of your computer. It won’t consider your Time Zone or Daylight Saving time, though. |
| **Year** | A Year to display the sky for. |
| **Month** | A Month to display the sky for. |
| **Day** | A Day to display the sky for.A time is not required since it’s defined by the TOD Time scrubber. This is supposed to be the Local Time at the location. |
| **Sequence Loop Count** | The number of days elapsed since the called to Play(). This is Read Only. |
| **GMT Time Zone** | Manually enter your Time Zone here; it’s not automatically populated from the location. |
| Daylight Savings |  |
| **Daylight Savings Mode** | Define how the Daylight Savings are taken into consideration:**None:** No DST is applied. **Automatic:** Use the Latitude property to determine the hemisphere you are in.**Northern Hemisphere: ** Manually set the hemisphere rules. DST typically observed during April - October.Southern: Manually set the hemisphere rules. DST typically observed October - March. The following year is used to compute the end date. |
| **Starts On** | Displays the result of the rules to compute the beginning of the DST period. Expand this to set the various rules. |
| **Rule** | The rule defining the day to choose for the Day Light Saving start and end. You can choose from: **Nth Day**, **Last Day**, or **Fixed Date**. |
| **Nth** | The numbered weekday to consider when the rule is **Nth Day**. For example, 3 for the third Sunday of January. |
| **Week Day** | The reference weekday for the Rules when set to **Nth Day** or **Last Day**. |
| **Month** | Select the month the Rule should apply to for Daylight Saving. |
| **End On** | Displays the result of the rules to compute the ending of the DST period. Expand this to set the various rules. |
| **Rule** | The rule defining the day to choose for the Day Light Saving start and end. You can choose from: Nth Day, Last Day, or Fixed Date. |
| **Nth** | The numbered weekday to consider when the rule is Nth Day. For example, 3 for the third Sunday of January. |
| **Week Day** | The reference weekday for the Rules when set to Nth Day or Last Day. |
| **Month** | Select the month the Rule should apply to for Daylight Saving. |
| **Switch Hour** | The time of day when the DST applies. Often this is 2am. |

 The sky on April 25, 2025 at 5:00 am. "The Smiley Face."

#### Location

| Property | Description |
| --- | --- |
| **GMT Time Zone** | Manually enter your Time Zone here; it’s not automatically populated from the location since time zones are not exactly aligned with Latitudes. |
| **Geocentric** | Check this box if you have chosen to use a Level Origin at the center of the planet. In this case, Latitude and Longitude are ignored. |
| **Latitude** | Latitude on Earth of the point corresponding to your World Origin. |
| **Longitude** | Longitude on Earth of the point corresponding to your World Origin. |
| **North Offset** | Add a rotational offset to the vault, if your level is not properly aligne to the North. This value is most of the time set to zero, with the North being Y-, but in Architecture, some models can be oriented along a building direction and not to the north. |
| **Planet Center Transform** | To simplify the animations, all components are parented to a SceneComponent with a properly configured Transform, which is located at the planet's center and oriented towards its rotation axis.The rotation of this component will simulate the planet's rotation. |

#### Stars

| Property | Description |
| --- | --- |
| **Celestial Stars Catalog** | The input data table to use for actual stars with celestial properties. |
| **Fictional Stars Catalog** | The input data table to use for fictional stars with basic properties. |
| **Max Visible Magnitude** | All stars whose magnitude is higher than this threshold will be ignored at generation time. Low magnitudes mean bright stars. The naked eye can normally see only up to magnitude 6. A higher threshold will generate more stars, but they might not be visible, unless you artificially boost their visibility with the Stars Material. |
| **Keep Stars Info** | When checked, a Table will be generated and kept in memory to allow for querying the stars' data. If you’re only interested in the visual representation, keep it unchecked. |

At generation time, both Catalogs are merged into one single ISM Component for rendering. However, because fictional stars don’t have the same details, each has a different DataTable Format:

- Data Tables for Celestial Stars must be of **CelestialStarInputData **Type
- Data Tables for Fictional Stars must be of **StarInputData **Type

If you use the wrong format, you’ll have a Warning in the Message log, and the corresponding stars won’t be generated.

Some base Data Tables are provided in the `Engine/Plugins/CelestialVault/Data` folder.

[image: Data Folder] Data Folder

##### Celestial Stars

Celestial stars are stars coming from official catalogs. They contain lots of information that can be queried later. A Celestial Star catalog can be imported from CSV files, as long as it contains the fields of the CelestialStarInputData type:

- **ID**: Unique ID [1 to n]
- **Name**: Star Name - Can be empty
- **RA**: Right Ascension - Expressed in Hours (1 Hour = 15°)
- **DEC**: Declination - Expressed in Degrees
- **DistanceInPC**: Distance - Expressed in Parsec
- **Magnitude**: Generally [-2 to 13]
- **ColorIndex**: Also known as B-V, it represents the Star Color [-0.33 to 2.0]
- **HipparcosID**: Star ID in the Hipparcos Catalog - Can be empty
- **HenryDraperID**: Star ID in the Henry Draper Catalog - Can be empty
- **YaleBrightStarID**: Star ID in the Yale Bright Star Catalog - Can be empty

Two Data Tables are provided with the plugin

- DT_HYGCatalog_Full - The full HYG catalog of the Astronomy Nexus page. It contains 120000 star records.
- DT_HYGCatalog_10K - Same HYG catalog, but limited to the 10000 brightest stars (up to magnitude 6). Sufficient for most use cases.

[image: Example Result] The Full HYG Catalog over a desert landscape.

##### Fictional Stars

Fictional stars are meant to be simpler and user-crafted. They use the same concept of a Catalog, but as only the visual part is needed, the Data Table needs to contain only a simplified set of fields, of the StarInputData Type:

- **ID**: Unique ID [1 to n]
- **Name**: Star Name - Can be empty
- **RA**: Right Ascension - Expressed in Hours (1 Hour = 15°)
- **DEC**: Declination - Expressed in Degrees
- **Magnitude**: Generally [-2 to 13]
- **Color**: Linear RGB Color String formatted as “(R=0.924,G=0.114,B=1.)”

Two Data Tables are provided with the plugin

- DT_FictionalStars - A simple example for randomly-placed stars
- DT_FictionalEasterEgg - A more advanced example of a constellation with an easter-egg shape.

Creating your own catalog of fictional stars is outside the scope of this documentation, but some open-source computer vision software can easily extract pixel coordinates from a set of dots, and with a little bit of spreadsheet magic, CSV files can be created, allowing you to do fancy experiments.

##### Importing your own CSV File

Star catalogs can be imported with CSV files like these:

##### Exporting Data Tables as CSV

You can also export one of the provided Data Tables as CSV to have a starting template.

- Drag and drop the CSV File onto your content browser.
- Make sure you select the appropriate **CelestialStarInputData/StarInputData** Row Type corresponding to the content you’re importing.
- Check the various input options if you have other fields in your dataset.
- Make sure you name the proper field that will be used as the primary key. (here ID)

#### Planets

| Property | Description |
| --- | --- |
| **Planets Catalog** | The input data table contains the planets' properties. |
| **Planets Scale** | An artificial scale factor to apply to planets |
| **Keep Planets info** | When checked, a Table will be generated and kept in memory to allow for querying the planets’ data. If you’re only interested in the visual representation, keep it unchecked. |

Currently, the focus is on the Solar System planets. The VSOP87 ephemeris simulates their exact trajectories. The system also allows for arbitrary planets, using Elliptical trajectories, but it has not been implemented yet.

A Data Table for Planets needs to contain the following fields:

- **ID**: Unique ID [1 to n]
- Name: Planet Name - Can be empty
- **OrbitType**: Enum for Solar Planets orbits. Elliptic is unused yet.
- **Radius**: Planet radius (km)
- **TextureColumnIndex**: Index of the planet texture in the global planets Atlas.

The planets are rendered using plane impostors, with a shader scaling them so that they always have a minimum size in pixels on screen. The Planets Scale property effect is visible only if the planet's true size is above this pixel size, depending on its radius, distance, and camera FOV.

[image: Results] Saturn with some stars in the background

#### Advanced

The sky is rendered as a Sphere, with a set of different layers of smaller radii for the different celestial bodies, by decreasing range: The vault background, the stars, the planets, and the moon.

They need to be far from the planet to avoid parallax effects, but far away enough together to avoid depth-fighting. The advanced properties allow tuning the various object ranges.

It also enables you to set the base values for Sun and Moon directional lights.

| Property | Description |
| --- | --- |
| **Celestial Vault MPC** | Set a Material Parameter Collection here with a TimeOfDay scalar property. The Celestial Vault will write it every frame. This MPC is currently referenced by the cloud material and is used to animate the clouds based on the current time, allowing for timelapses. |
| **Celestial Vault Distance** | Radius (km) of the sphere that will be mapped with the background texture (Milky Way, constellations, or celestial grid lines) |
| **Stars Vault Percentage** | Percentage of the Vault Sphere radius where the Stars will be generated. |
| **Planets Vault Percentage** | Percentage of the Vault Sphere radius where the Planets will be generated. |
| **Moon Vault Percentage** | Percentage of the Vault Sphere radius where the Moon will be generated. |
| **Observer-based Movement Threshold** | Some effects are based on the Observer location. (SkyAtmosphere Radius, Light Directions, DeepSky Parallax-avoidance Location).We don't need to adjust them every frame, so we trigger an update only if the observer has moved by more than this threshold since the last update. |
| **Adjust Sky Atmosphere To Local Radius** | When checked, the SkyAtmosphere radius is adjusted to the earth ellipsoid radius for the current observer's latitude and Longitude. Not needed for applications staying close to the Origin. |
| **Adjust Sky Atmosphere Fade Min Altitude** | When the observer is in space, we need to use the major ellipsoid radius for the atmosphere to avoid artifacts. This min value control the altitudes at which we’ll progressively fade the radius to its maximum. |
| **Adjust Sky Atmosphere Fade Max Altitude** | When the observer is in space, we need to use the major ellipsoid radius for the atmosphere to avoid artifacts. This max value control the altitudes at which we’ll progressively fade the radius to its maximum. |
| **Sun Light Intensity** | Physically correct Sun light intensity (default: 120000 Lux). |
| **Moon Light Intensity** | Physically correct Moon light intensity (default: 0.1Lux). |

Notes on Lights and Eye Adaptation:

- This system has been designed with physical accuracy in mind, with default values having been set automatically.
- The Sun and Moon lights have been defined as **Atmosphere Lights** in their settings. Index 0 represents the Sun, and Index 1 represents the Moon.
- The Sun intensity of 120000 Lux implies a white surface luminance on the ground of around 8-12k cd/m² at 12 noon.
- The Moon's base intensity has been set to 0.1 Lux, which is the average for a full moon. The literature gives ranges between 0.5 and 01 Lux, up to 0.32 Lux for a Super Moon. You can adjust this to fit your project's needs. These values also implies a white surface luminance on the ground of around 0.01 to 0.02 cd/m².
- Depending on the phase, base intensity is reduced so it can go very low when no artificial light is present.
- The Moon's surface is usually bright (approximately 1k - 2.5k cd/m²). Because of this significant range, default values for Eye Adaptation are tuned to account for this.
- The **MinEV100** is set to -2 so that you see a clear night when there is a Full Moon, and a dark environment when there is a New Moon.
- The histogram-based eye adaptation is not enough to cope with such a significant brightness range, especially if the moon size on screen is small. Because of this, Local Exposure Highlight Contrast Curve is used to accommodate the Moon's brightness.
- Changes to all settings listed above are part of a Global Post Process Volume associated with the Celestial Vault Day Sequence actor.
- Cloud coverage for lighting, shadowing, and fog is handled by the system. Both Sun and Moon lights are set to Cast Shadows and Cloud Shadows, which does have some performance cost associated with it. Both of these can be disabled, if too costly or not needed.

#### Moon

The system is currently limited to Earth’s moon only, so options are limited.

| Property | Description |
| --- | --- |
| **Moon Scale** | An artificial scale factor to apply to the Moon |
| **Manual Control** | By default, Moon location and Phase are computed from the Date and Location Values. By checking this box, you can enable additional options (see note below) |
| **Moon Age** | Correspond to the Moon’s lunar age: 0 = New Moon, 0.25 = First Quarter, 0.5 = Full Moon, 1.0 = Next New Moon. |
| **Moon offset to Sun’s Right Ascension ** | Horizontal offset of the Moon location relative to the sun, in hours. (1 hour = 15°). If this offset is 3h, the Moon will follow the Sun with a 45° offset, passing the horizon 3 hours after the Sun. |
| **Moon offset to Sun’s Declination ** | Vertical offset of the Moon location relative to the sun, in Degrees. |

By default, the Moon location and phase are automatically computed, and nothing has to be done. But in some Training & Simulation use cases, it’s important to control the brightness at night, because visibility during a dark night or during a light night is very different!

Finding the exact day on a calendar that would put the Moon in the right phase and at the right position is often cumbersome, so the Manual Control option helps to cover this use case.

Having an offset to the Sun is the easiest way to do this from a user perspective. It’s intuitive, whatever your hemisphere, your latitude, the current day duration…

But note that it can have uncontrolled visual effects that you should be aware of: Let’s say you set an offset of 3h. The Moon will be on “the left side” of the Sun. In this case, the Sun light should produce a waxing crescent. So, avoid setting a Moon age value over 0.75. In the extreme case, you could have a full Moon located close to the Sun, which never happens. Take care of this if you want to have a minimum of realism.

Because of the requirement for Manual control, the Moon is rendered using a plane with a custom material rather than a 3D Sphere.

 A Waning crescent over the Alps

### Tuning the Sky's appearance

The system is provided with Material Instances for all components, which you’re free to replace with your own. This paragraph will describe the properties of the Material instances.

Note that changing the brightness/intensity values of Materials will probably imply changing the Eye Adaptation or Exposure settings.

If you plan to change these materials, please use copies in your project content rather than

changing the originals.

#### Celestial Vault

The **MI_CelestialVault** material is a multi-texture material that also contains the sun halo.

| Property | Description |
| --- | --- |
| Global Intensity | Brightness factor of the whole Celestial Vault (Background + Constellations + Celestial Grid) |
| Background Intensity | Brightness factor of the sole Background texture (Milky Way) |
| Background Texture | Replacement texture for the Vault background. Needs to be in Celestial Coordinates. |
| Show Constellations | Enables an additional texture layer with a Constellation Map (white) |
| Constellations Color | Tint color of the constellation |
| Constellations Intensity | Brightness factor of the sole Constellations texture |
| Constellations Texture | Replacement texture for the Constellations. Needs to be in Celestial Coordinates. |
| Show Celestial Grid | Enables an additional texture layer with a Celestial Grid Map (white) |
| Grid Color | Tint color of the Celestial Grid |
| Grid Intensity | Brightness factor of the sole Celestial Grid texture |
| Grid Texture | Replacement texture for the Celestial Grid. Needs to be in Celestial Coordinates. |

Medium textures a provided with the system, but you can find higher resolutions here: https://svs.gsfc.nasa.gov/4851/

 Constellation lines and Celestial Grid

#### Stars

Two example materials are provided for the stars:

- MI_Stars_EnergyConserative (Default material)
- MI_Stars (Previous default for 5.7 and earlier)

##### MI_Stars_EnergyConservative Material

The MI_Stars_EnergyConservative material is used to texture the Stars' individual planes rendering them as an Instanced Static Mesh component. It contains options for the stars' appearance and size.

This material is improved over the previous iteration MI_Stars. It offers dynamic star sizing based on viewport resolution, while maintaining a minimum pixel size for Temporal Super Resolution (TSR) effects. It also computes an accurate star brightness so that the integral of the luminance over the mask pixels equals the star's exact energy, computed from the magnitude.

Ultimately, it has a more scientifically accurate result, and looks better, whatever your screen resolution is.

| Property | Description |
| --- | --- |
| **Desaturation** | Stars are all rendered using a per-instance color, manually set for the fictional stars, computed from the B-V value for celestial stars. This setting allows to desaturate the Value of the color (0=untouched, 1=grayscale only) |
| **Magnitude Offset** | The star's brightness is computed from its Magnitude. This parameter allows for artificially increasing the star's brightness by shifting its theoretical magnitude. Negative values lower the magnitude and therefore increase brightness. Brightness is an exponential factor of Magnitude. |
| **Mask** | Texture Mask used for the Stars. See T_StarMask_* for more masks |
| **Mask Average Falloff** | To be adjusted for each mask. See note below. |
| **Mask Falloff ** | Exponential value applied to the Mask color and alpha to increase/decrease the contrast |
| **Base Angular Size** | The Stars' size in 1/10th of a degree. This is used to compute a solid angle and to apply a proper scale factor based on the screen resolution. The star size is **not** dependent on the magnitude. Only the pixel's brightness is. |
| **Maximum Pixel Size** | The upper clamping value for the star size (in pixels). |
| **Minimum Pixel Size** | The lower clamping value for the star size (in pixels. Keep a minimum size of a few pixels to avoid TSR effects. |

Additional notes about this material:

- To distribute the energy across the stars' pixel brightness, the average luminance of the mask needs to be known. A full white square will be 1, whereas a round will be lower, in the range of 0.4.
- An editor utility widget is provided in `/CelestialVault Content/UI/EUW_Utilities` that computes the mask mean luminance. Use it to compute the value to set in the **Mask Average Luminance** property.

##### MI_Stars Material

The MI_Stars material is used to texture the Stars' individual planes, rendering them as an Instanced Static Mesh component. It contains options for the stars' appearance and size.

| Property | Description |
| --- | --- |
| **Desaturation** | Stars are all rendered using a per-instance color, manually set for the fictional stars, computed from the B-V value for celestial stars. This setting allows to desaturate the Value of the color (0=untouched, 1=grayscale only) |
| **Magnitude Offset** | The star's brightness is computed from its Magnitude. This parameter allows for artificially increasing the star's brightness by shifting its theoretical magnitude. Negative values lower the magnitude and therefore increase brightness. Brightness is an exponential factor of Magnitude. |
| **Mask** | Texture Mask used for the Stars. See T_StarMask_* for more masks |
| **Mask Falloff ** | Exponential value applied to the Mask color and alpha to increase/decrease the contrast |

##### Base Size

Stars' brightness is not sufficient to see them; they need to be of a minimal size on screen, possibly above 1 pixel, to avoid upscaling artifacts.

Whereas Brightness is an exponential factor of Magnitude, the star size on screen can be a linear function, defined by magnitude/size pairs. (Clamped over the range limits)

| Property | Description |
| --- | --- |
| **Brightest Star Magnitude** | Reference magnitude of the Brightest star. Stars below this magnitude will still have the maximum size. |
| **Brightest Star Size (In Pixels)** | Reference Pixel Size for Stars of Brightest magnitude. Lower magnitude stars will have an interpolated size towards the faintest Star settings. |
| **Faintest Star Magnitude** | Reference magnitude of the Faintest star. Stars above this magnitude will still have the minimum size. |
| **Faintest Star Size (in Pixels)** | Reference Pixel Size for Stars of Faintest magnitude. Higher magnitude stars will have an interpolated size towards the brightest Star settings. Make sure you adjust this limit if you plan to use a high “Max Visible Magnitude” value for the Stars Catalog properties. |
| **Global Size Factor** | Scaling factor globally applied to all stars, on top of their above-computed value. |
| **Size is After Upscaling** | Star sizes are computed in pixels. Depending on your scalability settings and resolution, the upscaling factor can vary. If unchecked, the star is rendered at its resolution before being upscaled. For example, a 2px star with 70% upscaling will be 2.85px on the final render target. If checked, the star size is reduced so that the final render target contains the wanted size. Ideally, use a size before upscaling (unchecked) and above 1px. Otherwise, you could see TSR artifacts like blinking stars. |

##### FOV-related Effects

Stars are really far away. If you've ever looked into a telescope, you'll see many more stars, but you'll always see points. The size effect that we see on deep sky photos is coming from the long exposure time and sensor saturation to reveal these stars.

By default, the system makes sure that stars always have the same pixel size, whatever your field of view happens to be. You can have more artistic control by by checking the property **FOV Impacts Appearance**.

| Property | Description |
| --- | --- |
| **FOV Impacts Appearance?** | Enables the narrow-FOV related effects. |
| **5° FOV Brightness factor** | Brightness factor applied for a 5° FOV. Base brightness properties are defined for a 90° FOV, and interpolated toward this new value when zooming. |
| **5° FOV Size factor** | Size factor applied for a 5° FOV. Base Size properties are defined for a 90° FOV, and interpolated toward this new value when zooming. |

 Landscape with exaggerated Moon and Star sizes.

#### Planets

The MI_SolarSystemPlanets material is used to texture the Planets' individual planes, rendered as an Instanced Static Mesh component.

This material expects a single-row atlas texture containing all the planets and will index into it depending on each planet's **TextureColumnIndex **property in the data table.

The sizing algorithm is simpler because the planet has a real size. It just uses a minimal size to ensure it stays visible at all times.

| Property | Description |
| --- | --- |
| **Magnitude Offset** | The planet's brightness is computed from its Magnitude, which is itself computed from its location in the solar system. (distance and phase). This parameter allows for artificially increasing its brightness by shifting the theoretical magnitude. Negative values lower the magnitude and therefore increase brightness. Brightness is an exponential factor of Magnitude. |
| **Min Pixel Size** | Minimum pixel size that a planet will have, whatever its Distance, artificial scale, or Camera FOV. |
| **Planets Texture** | One-row only planets texture atlas. |
| **TileCountX** | Number of planets column in the atlas. Needs to be consistent with the texture atlas. |

#### Moon

The Moon is rendered using a plane, and we reconstruct its volume on the MI_Moon material to allow for custom control.

| Property | Description |
| --- | --- |
| **Moon Age** | Phase input parameter that will be overridden by the Celestial Vault Day Sequence Actor, using a Material Dynamic Instance. Use the Moon Age property of the actor in Manual Control to change it. |
| **Brightness** | Moon’s surface brightness due to the Sun's light. Usually high: 900-2500 cd/m². |
| **Contrast** | Reinforce the contrast of the Albedo texture |
| **Earth Light Contribution** | The unlit part of the moon is still slightly visible because of the sun’s reflection on Earth. This small Ambient factor contributes to the lighting of this part. |
| **Moon Albedo** | Surface of the Moon Texture. In equirectangular coordinates. Because we only see the same side of the moon from the Earth, it’s only half of the moon (longitudes between -90 and +90). |
| **LightDark Transition Smoothness** | Artistic coefficient to control the smoothness of the lighting transition between the lit and unlit parts of the Moon's surface. |
| **Normal Map Intensity** | Artistic coefficient to strengthen/soften the crater effects. |

Medium textures are provide with this system for the Moon. But, you can find higher resolution options NASA Scientific Visualization Studio CGI Moon Kit.

### Blueprint Functions and Queries

 All the mathematical calculations used by the system are exposed inside a blueprint function library.

|  |  |  |
| --- | --- | --- |
|  |  |  |
| Utilities & Converters, and Angles / Color Blueprint nodes | Earth, Planetary Boundaries, and Queries (Sun, Planetary Boundaries, Stars) Blueprint nodes | Data and Times Blueprint nodes |

The most noteworthy ones are those related to querying the actor for information about Stars and Celestial Bodies:

**GetClosestStarInfo** and **GetClosestPlanetaryBody** will return the computed information for the Star or Planetary Body (Moon+Planets), which is the closest one to a direction. It can be used with mouse queries. Note that this information is kept in memory and accessible only if the Keep Star Infos and/or Keep PlanetaryBodies Info options have been checked in the Celestial Vault Day Sequence Actor.

On this page

- Enabling Celestial Vault Day Sequence in a Project (-> celestial-vault-plugin-for-unreal-engine)
- Working with the Day Sequence Actor (-> celestial-vault-plugin-for-unreal-engine)
- Celestial Vault Day Sequence Actor (-> celestial-vault-plugin-for-unreal-engine)
- Adding the Actor to the World (-> celestial-vault-plugin-for-unreal-engine)
- Working with the Actor Properties (-> celestial-vault-plugin-for-unreal-engine)
- Date & Daylight Savings (-> celestial-vault-plugin-for-unreal-engine)
- Location (-> celestial-vault-plugin-for-unreal-engine)
- Stars (-> celestial-vault-plugin-for-unreal-engine)
- Celestial Stars (-> celestial-vault-plugin-for-unreal-engine)
- Fictional Stars (-> celestial-vault-plugin-for-unreal-engine)
- Importing your own CSV File (-> celestial-vault-plugin-for-unreal-engine)
- Exporting Data Tables as CSV (-> celestial-vault-plugin-for-unreal-engine)
- Planets (-> celestial-vault-plugin-for-unreal-engine)
- Advanced (-> celestial-vault-plugin-for-unreal-engine)
- Moon (-> celestial-vault-plugin-for-unreal-engine)
- Tuning the Sky's appearance (-> celestial-vault-plugin-for-unreal-engine)
- Celestial Vault (-> celestial-vault-plugin-for-unreal-engine)
- Stars (-> celestial-vault-plugin-for-unreal-engine)
- MI_Stars_EnergyConservative Material (-> celestial-vault-plugin-for-unreal-engine)
- MI_Stars Material (-> celestial-vault-plugin-for-unreal-engine)
- Base Size (-> celestial-vault-plugin-for-unreal-engine)
- FOV-related Effects (-> celestial-vault-plugin-for-unreal-engine)
- Planets (-> celestial-vault-plugin-for-unreal-engine)
- Moon (-> celestial-vault-plugin-for-unreal-engine)
- Blueprint Functions and Queries (-> celestial-vault-plugin-for-unreal-engine)
