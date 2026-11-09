# Set Spectator Screen Mode Texture Plus Eye Layout

https://dev.epicgames.com/documentation/en-us/unreal-engine/set-spectator-screen-mode-texture-plus-eye-layout-in-unreal-engine?application_version=5.9

> This node sets up the layout for the TexturePlusEye function in ESpectatorScreenMode.

[image: Set Spectator Screen Mode Texture Plus Eye Layout]

This node sets up the layout for the `TexturePlusEye` function in `ESpectatorScreenMode`.

**Inputs**

| Pin Location | Name | Description |
| --- | --- | --- |
|  | (In) Exec | Input execution pin. |
|  | Eye Rect Min | A Vector 2D Structure, setting the minimum position of the screen rectangle that the Eye will be drawn in.Values are normalized between `0.0` and `1.0`. |
|  | Eye Rect Max | A Vector 2D Structure, setting the maximum position of the screen rectangle that the Eye will be drawn in.Values are normalized between `0.0` and `1.0`. |
|  | Texture Rect Min | A Vector 2D Structure, setting the minimum position of the screen rectangle that the Texture will be drawn in.Values are normalized between `0.0` and `1.0`. |
|  | Texture Rect Max | A Vector 2D Structure, setting the maximum position of the screen rectangle that the Texture will be drawn in.Values are normalized between `0.0` and `1.0`. |
|  | Draw Eye First | If this flag is set to `True`, the Eye is drawn before the Texture; however, if this flag is set to false, the Texture will be drawn before the Eye. |
|  | Clear Black | If this flag is set to `True`, the Render Target will be drawn black before either rectangle is drawn. |

**Output**

| Pin Location | Name | Description |
| --- | --- | --- |
|  | (Out) Exec | Output execution pin. |

- vr
