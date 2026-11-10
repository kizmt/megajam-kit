# Take Archive Device

https://dev.epicgames.com/documentation/en-us/unreal-engine/take-archive-device?application_version=5.9

> An overview of the Take Archive device provided by Capture Manager.

The **Take Archive** device enables the ingest of arbitrary video, audio, depth, and calibration data identified using a take metadata file (`.cptake`). You can use the device for more control over how the data is represented and handle incompatible take content that does not with the other **Capture Manager** devices.

This device is backwards compatible with takes created for use with Capture Manager and **MetaHuman Animator **in **Unreal Engine** 5.5 and earlier.

[image: Device Manager Take Archive Ingest]

- **Display Name**: The name of the device as it will appear in the **Devices **list.

- **Take Directory**: the path to the root folder containing the `.cptake` metadata file. This folder can contain subfolders.

### Directory Structure

The Take Archive device expects the **Take Directory** to contain one or more `.cptake` metadata files alongside their referenced media files. Media file paths inside the `.cptake` can be absolute or relative to the directory containing the `.cptake` file itself.

```console_output
+-- take_1
|   +-- top.mov
|   |-- bot.mov
|   \-- metadata.cptake
|
|-- metadata.cptake
\-- take_2.mov
```

## Take Metadata Files (.cptake)

Take metadata files (.cptake) are JSON files that describe the contents of a take. They provide a way for the Capture Manager to work with data that does not meet the expectations of other devices, or to give you more control over how data is represented.The

format adheres to a JSON schema located in:

- `\Engine\Plugins\VirtualProduction\CaptureManager\CaptureManagerCore\Content\TakeMetadata\Schema`

The current schema version is **4.2**. Earlier versions are supported for backwards compatibility.

Below is a minimal example `.cptake` file for a mono video take:

```console_output
{
  "Version": {
    "Major": 4,
    "Minor": 2
  },
  "UniqueId": "2b42db4d-11e5-49ab-8a4d-a78212345597",
  "TakeNumber": 1,
  "Slate": "MySlateName",
  "Device": {
    "Name": "MyDeviceName",
```
(11 more lines on the web page)

### Supported Device types

The supported device types compatible with MetaHuman Animator are:

- StereoHMC

- iPhone

> **note:** If converting a **Live Link Face** take into the `.cptake` format, set the `Model `to the numerical component of the `deviceModel`found in the original `take.json` file. For example, if the `deviceModel`in the `take.json` file is `iPhone14`,`3`, set `Model`in the new `.cptake` metadata file to `14`,`3`.

### Supported Formats

The supported `Format` values for a `Video` section are:

- mov

- mp4

- png

- jpg

- jpeg

The supported `Format` values for a `Depth` section are:

- mha_depth

- exr

The supported `Format` values for an `Audio` section are:

- wav

- mov

- mp4

The supported `Format` values for a `Calibration` section are:

- opencv

- mhaical

## Top-Level Structure

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `Version` | object | **Yes** | Schema version. See Version. |
| `UniqueID` | string | **Yes** | A GUID that uniquely identifies this take. |
| `TakeNumber` | integer | **Yes** | The take number. Must be ≥ 1. |
| `Slate` | string | **Yes** | The slate name for this take. |
| `Device` | object | **Yes** | Information about the capture device. See Device. |
| `DateTime` | string | No | ISO 8601 date-time with timezone (for example, `"2023-02-27T08:57:17.796000Z"`). |
| `Thumbnail` | string | No | Relative path to a thumbnail image file for this take. |
| `Video` | array | No | Array of video content entries. See Video / Depth. |
| `Depth` | array | No | Array of depth content entries. Same structure as Video. |
| `Audio` | array | No | Array of audio content entries. See Audio. |
| `Calibration` | array | No | Array of calibration data entries. See Calibration. |

## References

- .cptake Reference (-> cptake-reference-in-unreal-engine): Learn more about the required properties and types recognized values, and validation rules used by Capture Manager for .cptake files.
