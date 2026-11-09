# Units of Measurement

https://dev.epicgames.com/documentation/en-us/unreal-engine/units-of-measurement-in-unreal-engine?application_version=5.9

> Measure quantities of interest.

[image: Units of Measurement]

Unreal Engine (UE) defaults to the following International System (SI) units for measurement:

| **Quantity** | **Unit** |
| --- | --- |
| Distance/Length | Centimeters (cm) |
| Mass | Kilograms (kg) |
| Time | Minutes (min), Seconds (s) |
| Angles | Degrees (deg) |
| Speed/Velocity | Meters per Second (m / s) |
| Temperature | Celsius (C) |
| Force | Newtons (N) |
| Torque | Newton Meters (N • m) |

For more information about all units available in UE, see the Available Units (-> units-of-measurement-in-unreal-engine) section below.

### Change Default Units

You can change the units for any of these quantities in your project in the Unreal Editor. To change these units, follow these steps:

- From the menu bar, select **Edit > Project Settings...** This opens a new **Project Settings** window or tab.

- Navigate to **Editor > Appearance**.

- Expand the category under **Units > Advanced**.

- You should now see all the quantities of measurement along with their units. To change a quantity, select a new unit from the dropdown menu located next to the quantity you wish to change.

View or change units in Unreal Editor.

Distance/Length, Mass, and Time can use compound units.

### Available Units

The following sections contain lists of all units of measurement available in UE, organized by measured quantity:

#### Distance and Length

| **Unit** | **Abbreviation** |
| --- | --- |
| **SI** |  |
| Micrometers | µm |
| Millimeters | mm |
| Centimeters | cm |
| Meters | m |
| Kilometers | km |
| **Imperial** |  |
| Inches | in |
| Feet | ft |
| Yards | yd |
| Miles | mi |
| Lightyear | ly |

#### Velocity and Speed

| **Unit** | **Abbreviation** |
| --- | --- |
| **SI** |  |
| Centimeters Per Second | cm/s |
| Meters Per Second | m/s |
| Kilometers Per Second | km/s |
| **Imperial** |  |
| Miles Per Hour | mph |

#### Acceleration

| **Unit** | **Abbreviation** |
| --- | --- |
| Centimeters Per Second Squared | cm/s2 |
| Meters Per Second Squared | m/s2 |

#### Angles

| **Unit** | **Abbreviation** |
| --- | --- |
| Degrees | ° , deg |
| Radians | rad |

#### Angular Velocity

| **Unit** | **Abbreviation** |
| --- | --- |
| Degrees Per Second | deg/s |
| Radians Per Second | rad/s |

#### Temperature

| **Unit** | **Abbreviation** |
| --- | --- |
| **Temperature - SI** |  |
| Celsius | C |
| Kelvin | K |
| **Temperature - Imperial** |  |
| Farenheit | F |

#### Mass

| **Unit** | **Abbreviation** |
| --- | --- |
| **Mass - SI** |  |
| Micrograms | µg |
| Milligrams | mg |
| Grams | g |
| Kilograms | kg |
| Metric Tons | t, Mg |
| **Mass - Imperial** |  |
| Ounces | oz |
| Pounds | lb |
| Stones | st |

#### Density

| **Unit** | **Abbreviation** |
| --- | --- |
| **Density - SI** |  |
| Grams Per Cubic Centimeter | g/cm3 |
| Grams Per Cubic Meter | g/m3 |
| Kilograms Per Cubic Centimeter | kg/cm3 |
| Kilograms Per Cubic Meter | kg/m3 |

#### Force

| **Unit** | **Abbreviation** | **In Base Units** |
| --- | --- | --- |
| **Force - SI** |  |  |
| Newtons | N | 1 N = 1 kg • m / s2 |
| Kilograms Force | kgf | 1 kgf = 9.80665 kg • m / s2 |
| Kilogram Centimeters Per Second Squared | kg • cm / s2 |  |
| **Force - Imperial** |  |  |
| Pounds Force | lbf | 1 lbf = 32.174049 lb • ft / s2 |

#### Torque

| **Unit** | **Abbreviation** | **In Base Units** |
| --- | --- | --- |
| **Torque - SI** |  |  |
| Newton Meters | N·m | 1 N·m = 1 kg • m2 / s2 |
| Kilogram Centimeters Squared Per Second Squared | kg • cm2 / s2 |  |

#### Momentum

| **Unit** | **Abbreviation** | **In Base Units** |
| --- | --- | --- |
| **Momentum - SI** |  |  |
| Newton Seconds | N·s | 1 N • s = 1 kg • m / s |

#### Frequency

| **Unit** | **Abbreviation** | **In Base Units** |
| --- | --- | --- |
| **Frequency - SI** |  |  |
| Hertz | Hz | 1 Hz = 1 s-1 |
| Kilohertz | kHz |  |
| Megahertz | MHz |  |
| Gigahertz | GHz |  |
| Revolutions Per Minute | rpm | 1 rpm = 1/60 s-1 |

#### Pixel Density

| **Unit** | **Abbreviation** |
| --- | --- |
| Pixels Per Inch | PPI |

#### Digital Information

| **Unit** | **Abbreviation** |
| --- | --- |
| Byte | B |
| Kilobyte | kB |
| Megabyte | MB |
| Gigabyte | GB |
| Terabyte | TB |

#### Luminous Flux

| **Unit** | **Abbreviation** |
| --- | --- |
| Lumens | lm |

#### Luminous Intensity

| **Unit** | **Abbreviation** |
| --- | --- |
| Candela | cd |

#### Illuminance

| **Unit** | **Abbreviation** | **In Base Units** |
| --- | --- | --- |
| Lux | lx | 1 lx = 1 lm/m2 |

#### Luminance

| **Unit** | **Abbreviation** |
| --- | --- |
| Candela Per Meter 2 | cd/m2 |

#### Time

| **Unit** | **Abbreviation** |
| --- | --- |
| Nanoseconds | ns |
| Microseconds | µs |
| Milliseconds | ms |
| Seconds | s |
| Minutes | min |
| Hours | hr |
| Days | d |
| Months | mo |
| Years | yr |

#### Pressure

| **Unit** | **Abbreviation** | **In Base Units** |
| --- | --- | --- |
| Pascals | Pa | 1 Pa = 1 kg / m • s2 |
| Kilo Pascals | KPa |  |
| Mega Pascals | MPa |  |
| Giga Pascals | GPa |  |

#### Other Units

| **Unit** | **Abbreviation** | **Notes** |
| --- | --- | --- |
| Exposure Value | EV | Describes how much light is in a scene. |
| Percentage | % | Numerical value between 0 and 100. |
| Multiplier |  | Unitless quantity that represents multiples of some base quantity. |
| Unspecified |  | No specified units. |

## More Information

For more information about coordinate systems, see the following resources:

- The International System of Units

On this page

- Change Default Units (-> units-of-measurement-in-unreal-engine)
- Available Units (-> units-of-measurement-in-unreal-engine)
- Distance and Length (-> units-of-measurement-in-unreal-engine)
- Velocity and Speed (-> units-of-measurement-in-unreal-engine)
- Acceleration (-> units-of-measurement-in-unreal-engine)
- Angles (-> units-of-measurement-in-unreal-engine)
- Angular Velocity (-> units-of-measurement-in-unreal-engine)
- Temperature (-> units-of-measurement-in-unreal-engine)
- Mass (-> units-of-measurement-in-unreal-engine)
- Density (-> units-of-measurement-in-unreal-engine)
- Force (-> units-of-measurement-in-unreal-engine)
- Torque (-> units-of-measurement-in-unreal-engine)
- Momentum (-> units-of-measurement-in-unreal-engine)
- Frequency (-> units-of-measurement-in-unreal-engine)
- Pixel Density (-> units-of-measurement-in-unreal-engine)
- Digital Information (-> units-of-measurement-in-unreal-engine)
- Luminous Flux (-> units-of-measurement-in-unreal-engine)
- Luminous Intensity (-> units-of-measurement-in-unreal-engine)
- Illuminance (-> units-of-measurement-in-unreal-engine)
- Luminance (-> units-of-measurement-in-unreal-engine)
- Time (-> units-of-measurement-in-unreal-engine)
- Pressure (-> units-of-measurement-in-unreal-engine)
- Other Units (-> units-of-measurement-in-unreal-engine)
- More Information (-> units-of-measurement-in-unreal-engine)
