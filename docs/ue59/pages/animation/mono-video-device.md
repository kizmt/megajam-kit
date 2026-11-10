# Mono Video Device

https://dev.epicgames.com/documentation/en-us/unreal-engine/mono-video-device?application_version=5.9

> An overview of the Mono Video device provided by Capture Manager.

The **Mono Video** device enables the ingest of individual video files as mono takes. If the video contains an audio track it will also be extracted during ingest.

[image: Capture Manager Device Details]

- **Display Name**: The name of the device as it will appear in the **Devices** list.

- **Take Directory**: The path to the root folder containing video files. This folder can contain subfolders.

- **Video Discovery Expression**: Tokens (-> mono-video-device) that can be extracted from the folder and file name to identify the take.

A visual example of the content expected to be found by the **Mono Video** device in the **Take Directory** is shown below:

```console_output
+-- takes
|   +-- take_1.mov
|   \-- take_2.mov
|
\-- take_3.mov
```

## Discovery Expression Tokens

The **Video Discovery Expression** is used to define the naming convention for video files in your takes. The available tokens are:

| `<Slate>` | The slate name. |
| --- | --- |
| **`<Name>`** | The identifier for the camera. |
| **`<Take>`** | The take number. |
| **`<Any>`** | Any valid string. |
| `<Auto>` | Used without any other tokens to automatically identify takes based on the directory structure. |

Tokens can be separated using the following delimiters: `_-.\`

> **note:** When not using the `<Auto>` token, both `<Slate>` and `<Name>` must be present.

For example, consider the following take: `MyTakeFolder/MySlate_MyName_SomeString-005.mov`. If the Video Discovery Expression is set to the default value of `<Auto>`, the following tokens will be identified:

| **Slate** | `MySlate_MyName_SomeString` |
| --- | --- |
| **Name** | `video `(the default value) |
| **Take** | `1 `(the default value) |

However, if the Video Discovery Expression is set to `<Slate>_<Name>_<Any>-<Take>` the following tokens will be extracted instead:

| **Slate** | `MySlate` |
| --- | --- |
| **Name** | `MyName` |
| **Take** | `5` |
| **Any** | `SomeString` |

In both cases, the extension `.mov` is ignored.
