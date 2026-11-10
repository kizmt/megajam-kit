# Timeline Nodes

https://dev.epicgames.com/documentation/en-us/unreal-engine/timelines-nodes-in-unreal-engine?application_version=5.9

> Nodes that are used to handle specific functionality of Blueprint Timelines.

## Get Play Rate

The **Get Play Rate** node returns the current playback rate of the input Timeline. The number is returned as a float value.

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| **Inputs** |  |  |
| **Target** | Timeline Component | Takes in a Timeline variable. |
| **Outputs** |  |  |
| **Return Value** | Float | Outputs the current playback rate for the Timeline. |

## Get Playback Position

The **Get Playback Position** node returns the current playback position, or the current moment in time along the input Timeline. The number is returned as a float value.

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| **Inputs** |  |  |
| **Target** | Timeline Component | Takes in a Timeline variable. |
| **Outputs** |  |  |
| **Return Value** | Float | Outputs the current playback position for the Timeline. |

## Get Timeline Length

The **Get Timeline Length** node returns the total length of the input Timeline as a float value.

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| **Inputs** |  |  |
| **Target** | Timeline Component | Takes in a Timeline variable. |
| **Outputs** |  |  |
| **Return Value** | Float | Outputs the total playback length for the Timeline. |

## Is Looping

The **Is Looping** node returns a boolean value which will be true if the input Timeline is looping, false if it is not.

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| **Inputs** |  |  |
| **Target** | Timeline Component | Takes in a Timeline variable. |
| **Outputs** |  |  |
| **Return Value** | Boolean | Outputs the value of the Looping property. |

## Is Playing

The **Is Playing** node returns a boolean value which will be true if the input Timeline is currently playing, false if it is not.

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| **Inputs** |  |  |
| **Target** | Timeline Component | Takes in a Timeline variable. |
| **Outputs** |  |  |
| **Return Value** | Boolean | Outputs whether the Timeline is currently playing. |

## Is Reversing

The **Is Reversing** node returns a boolean value which will be true if the input Timeline is currently reversing (or playing in reverse), false if it is not.

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| **Inputs** |  |  |
| **Target** | Timeline Component | Takes in a Timeline variable. |
| **Outputs** |  |  |
| **Return Value** | Boolean | Outputs whether the Timeline is currently reversing. |

## Play

The **Play** node tells the input Timeline to begin playing from the current playback position.

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| **Inputs** |  |  |
| **Target** | Timeline Component | Takes in a Timeline variable. |

## Play from Start

The **Play from Start** node tells the input Timeline to begin playing from the start of the Timeline.

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| **Inputs** |  |  |
| **Target** | Timeline Component | Takes in a Timeline variable. |

## Reverse

The **Reverse** node tells the input Timeline to begin reversing (playing in reverse) from the current playback position.

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| **Inputs** |  |  |
| **Target** | Timeline Component | Takes in a Timeline variable. |

## Reverse from End

The **Reverse from End** node tells the input Timeline to begin reversing (playing in reverse) from the end of the Timeline.

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| **Inputs** |  |  |
| **Target** | Timeline Component | Takes in a Timeline variable. |

## Set Looping

The **Set Looping** node takes in an input Timeline and a boolean value. It sets the Timeline's Looping property to the value of the boolean.

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| **Inputs** |  |  |
| **Target** | Timeline Component | Takes in a Timeline variable. |
| **New Looping** | Boolean | Used to set the Timeline's looping value. |

## Set New Time

The **Set New Time** node takes in an input Timeline and a float value. It sets the Timeline's New Time property to the value of the float.

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| **Inputs** |  |  |
| **Target** | Timeline Component | Takes in a Timeline variable. |
| **New Time** | Float | Used to set a new playback position. |

## Set Play Rate

The **Set Play Rate** node takes in an input Timeline and a float value. It sets the Timeline's Play Rate property to the value of the float.

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| **Inputs** |  |  |
| **Target** | Timeline Component | Takes in a Timeline variable. |
| **New Rate** | Float | Used to set a new playback rate. |

## Set Playback Position

The **Set Playback Position** node takes in an input Timeline, a float value, and a boolean. It jumps the Timeline's Playback Position property to the value of the float. If there are any event tracks within the Timeline, the value of the Boolean is used to determine if they will fire or not.

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| **Inputs** |  |  |
| **Target** | Timeline Component | Takes in a Timeline variable. |
| **New Position** | Float | Used to jump to a new playback position. |
| **Fire Events** | Boolean | Used to control whether any events (from any Event Tracks) that were jumped will be fired. |

## Set Timeline Length

The **Set Timeline Length** node sets the length of the Timeline's total playback.

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| **Inputs** |  |  |
| **Target** | Timeline Component | Takes in a Timeline variable. |
| **New Length** | Float | Used to set a new playback length. |

## Set Timeline Length Mode

The **Set Timeline Length Mode** node sets the Length Mode property of the Timeline. This allows you to switch between playing the full Timeline length and just playing to the last keyframe.

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| **Inputs** |  |  |
| **Target** | Timeline Component | Takes in a Timeline variable. |
| **New Length Mode** | Byte | Sets the playback mode to either "Timeline Length" or "Last Keyframe." |

## Stop

The **Stop** node stops playback for the input Timeline node.

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| **Inputs** |  |  |
| **Target** | Timeline Component | Takes in a Timeline variable. |
