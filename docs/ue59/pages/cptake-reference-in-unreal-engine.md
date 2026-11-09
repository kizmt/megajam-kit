# .cptake Reference

https://dev.epicgames.com/documentation/en-us/unreal-engine/cptake-reference-in-unreal-engine?application_version=5.9

> Learn more about the required properties and types recognized values, and validation rules used by Capture Manager for .cptake files.

Below is the complete `.cptake` reference information to manage the data captured by the Capture Manager.

## Version

Identifies which schema version the file was written against. Capture Manager uses this to select the correct schema for validation.

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `Major` | integer | **Yes** | Major version number. Must be ≥ 0. |
| `Minor` | integer | **Yes** | Minor version number. Must be ≥ 0. |

No additional properties are allowed on this object. For new files, use:

```config
"Version": {
  "Major": 4,
  "Minor": 2
}
```

## UniqueId

A string in standard GUID format. Must be unique across all takes.

Format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` (hexadecimal characters).

`"UniqueId": "2b42db4d-11e5-49ab-8a4d-a78212345597"`

## DateTime

ISO 8601 date-time string with timezone offset or Z (UTC) suffix required.

`"DateTime": "2023-02-27T08:57:17.796000Z"`

## Device

Describes the hardware and software used for capture.

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `Type` | string | **Yes** | The device type identifier. See Expected Device Values (-> cptake-reference-in-unreal-engine). |
| `Model` | string | **Yes** | The device model identifier. See Expected Device Values (-> cptake-reference-in-unreal-engine). |
| `Name` | string | **Yes** | A user-defined name or identifier for this device. |
| `Platform` | object | No | The operating system platform. See Platform (-> cptake-reference-in-unreal-engine). |
| `Software` | array | No | Software used during capture. See Software (-> cptake-reference-in-unreal-engine). |

### Expected Device Values

The `Type` and `Model` fields are free-form strings, but specific values are recognized by **MetaHuman Animator** and affect how footage is processed.

**Recognized `Model` values:**

Capture Manager classifies devices based on the Model string:

| Model Value | Device Class | Description |
| --- | --- | --- |
| `"StereoHMC"` | StereoHMC | Stereo head-mounted camera captures. |
| `"iPhone<Major>,<Minor>"` | Varies by model | iPhone-based captures. Must start with the literal string iPhone followed by the Apple device identifier (for example, `"iPhone14,3`"). |
| `"iPad..."` | OtheriOSDevice | iPad-based captures. Any string starting with `iPad`. |
| (anything else) | Unspecified | (anything else) |

iPhone model classification:

| Apple Identifier Range | Device Class | Example Devices |
| --- | --- | --- |
| Major < 12 | iPhone11OrEarlier | iPhone 8 (`iPhone10,x`), iPhone X (`iPhone10,x`), iPhone XS/XR (`iPhone11,x`) |
| Major = 12, Minor ∈ {1,3,5} | iPhone11OrEarlier | iPhone 11 (`iPhone12,1`), 11 Pro (`iPhone12,3`), 11 Pro Max (`iPhone12,5`) |
| Major = 12, other Minor | OtheriOSDevice | iPhone SE 2nd gen (`iPhone12,8`) |
| Major = 13 | iPhone12 | iPhone 12 Mini/12/12 Pro/12 Pro Max (`iPhone13,x`) |
| Major = 14, Minor ∈ {2,3,4,5} | iPhone13 | iPhone 13 Mini/13/13 Pro/13 Pro Max (`iPhone14,2–iPhone14,5`) |
| Major = 14, Minor ∈ {7,8} | iPhone14OrLater | iPhone 14 (`iPhone14,7`), iPhone 14 Plus (`iPhone14,8`) |
| Major = 14, other Minor | OtheriOSDevice | iPhone SE 3rd gen (`iPhone14,6`) |
| Major ≥ 15 | iPhone14OrLater | iPhone 14 Pro and all later models |

> **warning:** The `Model` value must include the full device string with the `iPhone` prefix (for example, `"iPhone14,3"`), not just the numeric component (`"14,3"`).

**Recognized **`Type` **values:**

| Type Value | Use Case |
| --- | --- |
| `"HMC"` | Head-mounted camera (used with `StereoHMC` model). |

For iPhone-based captures, the `Type` field is typically left empty or set to a descriptive string — it is not checked by the iPhone device classification logic.

### Platform

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `Name` | string | **Yes** | Operating system name. Must be one of: `"iOS"`, `"Android"`, `"Windows",` `"Linux",` "`macOS"`. |
| `Version` | string | No | OS version string (for example, `"17.2.1"`). |

### Software

An array of objects describing software used during capture.

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `Name` | string | **Yes** | Software name (for example, `"Live Link Face"`). |
| `Version` | string | No | Software version string (for example, `"2.5.7"`). |

## Video / Depth

The `Video` and `Depth` arrays use the same structure. Each entry describes a single video stream, image sequence, or depth stream.

| Property | Type |  | Description |
| --- | --- | --- | --- |
| `Name` | string | **Yes** | A name identifying this stream (for example, `"primary"`, "`secondary"`). |
| `Path` | string | Yes | Path to the media file or folder. |
| `Format` | string | Yes | The media format identifier. See Supported Video/Depth Formats (-> cptake-reference-in-unreal-engine). |
| `FrameRate` | number | Yes | Frame rate in frames per second (for example, `30.0`, `60.0`). Must be > 0. |
| `PathType` | string | No | Whether `Pat`h points to a `"File"` or a `"Folder"`. Auto-detected if omitted. |
| `Orientation` | string | No | Image orientation. See Supported Orientations (-> cptake-reference-in-unreal-engine). Defaults to `"Original"`. |
| `FrameCount` | integer | No | Total number of frames. Must be ≥ 0. |
| `DroppedFrame` | array | No | Array of integer frame indices that were dropped during capture. |
| `FrameWidth` | integer | No | Frame width in pixels. Must be ≥ 1. If specified, `FrameHeight` must also be present. |
| `FrameHeight` | integer | No | Frame height in pixels. Must be ≥ 1. If specified, `FrameWidth` must also be present. |
| `TimecodeStart` | string | No | Timecode of the first frame. See Timecode Format (-> cptake-reference-in-unreal-engine). |
| `TimecodeRate` | number | No | Timecode rate. Must be ≥ 0. |

### Supported Video/Depth Formats

The `Format` field must contain one of the following values. These are matched against registered media readers and are **case-sensitive**.

**Video formats:**

| Format Value | Description | PathType |
| --- | --- | --- |
| `"mov"` | QuickTime video container | `"File"` |
| `"mp4"` | MPEG-4 video container | `"File"` |
| `"image_sequence"` | A folder of image files (PNG, JPG, or JPEG) | `"Folder"` |

**  Depth formats:**

|  | Description | PathType |
| --- | --- | --- |
| `"mha_depth"` | MetaHuman Animator proprietary depth format | `"File"` |

> **note:** Depth data exported as EXR image sequences during the ingest pipeline should use `"image_sequence"` as the Format value with PathType `"Folder"`. The `exr` format is used internally as an output format and is not a valid reader format for `.cptake` files.

### Supported Orientations

| Value | Description |
| --- | --- |
| `"Original"` | No rotation applied (default). |
| `"CW90"` | Rotated 90° clockwise. |
| `"CW180"` | Rotated 180°. |
| `"CW270"` | Rotated 270° clockwise (90° counter-clockwise). |

### Timecode Format

Timecodes follow the pattern `HH:MM:SS:FF` or `HH:MM:SS;FF`, with an optional millisecond suffix:

- `HH:MM:SS:FF`        (for example, `"09:01:41:01"`)

- `HH:MM:SS;FF`        (for example, `"09:01:41;01"` - drop-frame notation)

- `HH:MM:SS:FF.mmm`    (for example, `"09:01:41:01.300"`)

| Component | Range | Description |
| --- | --- | --- |
| `HH` | 00-23 | Hours |
| `MM` | 00-59 | Minutes |
| `SS` | 00-59 | Seconds |
| `FF` | 00-59 | Frames |
| `;` | -- | Semicolon separator indicates drop-frame timecode |
| `.mmm` | 0-999 | Optional fraction milliseconds |

## Audio

Each entry in the `Audio` array describes a single audio stream.

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `Name` | string | **Yes** | A name identifying this audio stream (for example, `"primary"`). |
| `Path` | string | Yes | Path to the audio file. |
| `Duration` | number | No | Duration of the audio in seconds. Must be ≥ 0. |
| `TimecodeStart` | string | No | Timecode of the first audio sample. See Timecode Format (-> cptake-reference-in-unreal-engine). |
| `TimecodeRate` | number | No | Timecode rate. Must be ≥ 0. |

### Supported Audio Formats

The audio file referenced by `Path` must be in one of the following formats:

| Format | Description |
| --- | --- |
| `wav` | Waveform audio |
| `mov` | QuickTime container with audio |
| `mp4` | MPEG-4 container with audio |

> **note:** After conversion, only `wav` is supported as an output format. Audio from `mov` and `mp4` containers is extracted and re-encoded to `wav` during the ingest pipeline.

## Calibration

Each entry in the `Calibration` array describes camera calibration data.

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `Name` | string | **Yes** | A name identifying this calibration entry. |
| `Format` | string | Yes | The calibration data format. See Supported Calibration Formats (-> cptake-reference-in-unreal-engine). |
| `Path` | string | Yes | Path to the calibration file. |

###  Supported Calibration Formats

| Format Value | Description |
| --- | --- |
| `"opencv"` | OpenCV-style JSON calibration file containing camera intrinsics and distortion parameters. |
| `"mhaical"` | MetaHuman Animator internal calibration format (`.mhaical` file). |

## Complete Example

A comprehensive example showing all available properties in a v4.2 `.cptake` file:

```config
{
  "Version": {
    "Major": 4,
    "Minor": 2
  },
  "DateTime": "2026-02-27T08:57:17.796000Z",
  "Thumbnail": "thumbnail.jpg",
  "UniqueId": "a78613f3-e660-47e4-af6a-1298cde7c947",
  "TakeNumber": 1,
  "Slate": "MyPerformanceCapture",
```
(64 more lines on the web page)

## Minimal Example with Media

A minimal example that includes one entry each for video, depth, audio, and calibration using only the required fields:

```config
{
  "Version": {
    "Major": 4,
    "Minor": 2
  },
  "UniqueId": "2b42db4d-11e5-49ab-8a4d-a78212345597",
  "TakeNumber": 1,
  "Slate": "MySlateName",
  "Device": {
    "Type": "HMC",
```
(33 more lines on the web page)

## Schema Version History

The `.cptake` format has evolved across several schema versions. Capture Manager supports all versions for backwards compatibility.

The JSON schemas used for validation are located at:

`Engine/Plugins/VirtualProduction/CaptureManager/CaptureManagerCore/Content/TakeMetadata/Schema/`

## Validation

Capture Manager validates `.cptake` files against the JSON schema matching the declared Version. If validation fails, the parser will attempt to interpret the file as a legacy format (Live Link Face `take.json` or StereoCamera metadata) before reporting an error.

Common validation errors include:

| Error | Cause |
| --- | --- |
| **Missing required fields** | `Version`, `UniqueId`, `TakeNumber`, `Slate`, and `Device` (with `Type`, `Model`, `Name`) are always required. |
| **Invalid UniqueId ****forma****t** | Must be a valid GUID pattern. |
| **TakeNumber less than 1** | Must be a positive integer (≥ 1). |
| **Invalid DateTime format** | Must follow ISO 8601 with timezone offset or Z suffix. |
| **Invalid TimecodeStart format** | Must match `HH:MM:SS:FF` or `HH:MM:SS;FF` pattern. |
| **Negative numeric values** | `FrameRate`, `FrameWidth`, `FrameHeight`, `FramesCount`,` Duration`, and `TimecodeRate` must not be negative. |
