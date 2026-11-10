# ANC Timecode

https://dev.epicgames.com/documentation/en-us/unreal-engine/anc-timecode-in-unreal-engine?application_version=5.9

> How to use the SMPTE ANC timecode feature with Nvidia Rivermax.

[image: ANC Timecode]

## Introduction

Unreal Engine's Rivermax plugin now supports **ancillary (ANC) timecode** based synchronization. The **ST 2110-40** protocol carries a SMPTE ATC LTC timecode alongside an ST 2110-20 video stream. The video and ANC streams share a 90 kHz RTP clock, so the receiver can match each ANC packet to the corresponding video frame and stamp the resulting media sample with an exact timecode.

This guide covers the broadcast scenario, a PTP-synchronized sender (camera, switcher, or another UE instance) feeding a UE receiver, where ANC carries the sender's timecode for frame-accurate alignment.

As a prerequisite, set `RivermaxTimecodeProvider` using a Media Profile or the project's Timecode Provider setting (**Project Settings** → **Engine **→ **General **→ **Timecode Provider**). If you don't set the prerequisite, `GetCurrentPTPTimeOfDay()` skips the TAI to UTC offset and logs a warning.

## Media Output (Sender)

In the **Nvidia Rivermax Output** asset, configure the settings as described below:

- **Video Stream**: Input the values for the following properties:**Address**
- **Port**
- **Frame Rate**
- **Resolution**
- **Pixel Format**

- **ANC Streams**: Add one entry to the array, configured as follows:**Stream Type**: ST 2110-40 (Timecode)
- **Interface Address**: Use the same NIC as the video stream (for example, `192.168.0.10`)
- **Stream Address**: You must distinguish the ANC stream from the video stream. For example, if the video stream uses port `50000`, set the ANC port to `50001`.
- If both streams share the exact same address and port, Rivermax cannot separate the two flows.
- Use either a different multicast group or, if reusing the group, a different port.

- **Port**: Set according to the requirements described above.

### Recommended Media Output Settings

| Property | Value | Explanation |
| --- | --- | --- |
| Output |  |  |
| **Alignment Mode** | Alignment Point | PTP-locked scheduling; required for receiver-side sync. |
| **Do Continuous Output** | Enabled | Keeps the stream alive between rendered frames. |
| **Frame Locking Mode** | Block on Reservation | Prevents dropped timecodes under load; only stalls if the GPU falls behind. |
| **Do Frame Counter Timestamping** | Disabled | Only used for nDisplay workflows. Encodes Engine Frame number into the stream timestamp making Unreal Engine Frame locked synchronization possible. For more information, refer to the nDisplay workflows for SMPTE 2110 (-> ndisplay-workflows-for-smpte-2110-in-unreal-engine) documentation. |
| Video |  |  |
| **Video oStream** → **Use GPU Direct** | Enabled | Reduces latency and CPU load. |

## Media Source (Receiver)

In the **Nvidia Rivermax Source** asset, configure the settings as described below:

- **Video Stream**: Match the sender's settings for the following properties:**Address**
- **Port**
- **Frame Rate**
- **Resolution**
- **Pixel Format**

- **ANC Streams**: Add one entry to array, with the following properties:**Stream Type**: ST 2110-40 (Timecode)
- **Interface Address, Stream Address, Port**: Match the sender's ANC entry.

The player decodes each ANC packet, finds the video sample that shares the same RTP timestamp, and attaches the timecode to it. Frames without a matching ANC packet are not dropped, they are delivered with no timecode.

### Recommended Media Source Settings

| Property | Value | Explanation |
| --- | --- | --- |
| Video |  |  |
| **Video Stream → Use GPU Direct** | Enabled | Avoids using system memory when receiving the stream. |
| Synchronization |  |  |
| **Time Synchronization** | Enabled | Required for time-sync to engage. The player checks `bRenderJIT && EvaluationType == Timecode && bUseTimeSynchronization`; if any are false, sync is bypassed. |
| **Frame Delay** | 1 | Provides a one-frame latency budget for jitter and decode. Set this value to 0 only if your network and PTP setup have negligible jitter. |
| **Advanced → Framelock** | Disabled | Do not enable for broadcast UE.This is specific to Unreal Engine (nDisplay) and used to transport UE’s Frame number. |
| **Advanced → Sample Evaluation Type** | Timecode | Drives playback using the ANC timecode instead of the wall-clock. |

## Fallback Behaviour

Every video sample records two PTP wall-clock timestamps regardless of whether ANC is enabled:

- `FrameReceptionStart` (when the first packet of the frame arrived)
- `FrameReceptionEnd` (when the last packet of the frame arrived)

The player reads these from the Rivermax PTP clock, and uses them as a fallback window for sample selection:

- **Latest evaluation mode**: In this mode the player uses the latest received sample regardless of the time it was received or the timecode.
- **Timecode evaluation mode**: In this mode, the preferred path uses the sender's ANC timecode. If no buffered sample has an ANC timecode (the ANC stream is not configured or stalled), the player falls back to the reception window for sample selection.
- **No RivermaxTimecodeProvider**: In this mode, the sample synchronization across different nodes isn’t guaranteed.

In a PTP locked setup, this is a good approximation of the timecode path. The reception-window fallback gives near-equivalent sync to ANC timecode as long as PTP is locked on both ends.

For best results, configure ANC on both ends and use `RivermaxTimecodeProvider`. The ANC path is the only one that guarantees frame-accurate alignment to the sender's render timecode.

## Verifying Sync

- In the receiver's level, the active timecode should match the sender's render timecode.
- Enable `LogRivermaxMedia` at `VeryVerbose` to see decoded ANC timecodes per RTP timestamp: Console Output ```
ANC Timecode ts=2147483648: 10:30:15:23
``` ANC Timecode ts=2147483648: 10:30:15:23
- The decoded timecode appears on every video sample that had a matching ANC packet: `FMediaIOCoreTextureSample::GetTimecode()`.

On this page

- Introduction (-> anc-timecode-in-unreal-engine)
- Media Output (Sender) (-> anc-timecode-in-unreal-engine)
- Recommended Media Output Settings (-> anc-timecode-in-unreal-engine)
- Media Source (Receiver) (-> anc-timecode-in-unreal-engine)
- Recommended Media Source Settings (-> anc-timecode-in-unreal-engine)
- Fallback Behaviour (-> anc-timecode-in-unreal-engine)
- Verifying Sync (-> anc-timecode-in-unreal-engine)
