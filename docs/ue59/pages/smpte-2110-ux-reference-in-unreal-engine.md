# SMPTE 2110 UX Reference

https://dev.epicgames.com/documentation/en-us/unreal-engine/smpte-2110-ux-reference-in-unreal-engine?application_version=5.9

> A UX refence for using SMPTE 2110 in Unreal Engine

[image: SMPTE 2110 UX Reference]

This page provides a guide to the UX for SMPTE 2110 with NVIDIA Rivermax in Unreal Engine.

## Settings

### Project Settings

You can configure the following settings in your **Project Settings **under **Plugins - NVIDIA Rivermax**.

[image: image alt text] Settings for the NVIDIA Rivermax plugin.

| Setting | Description |
| --- | --- |
| **Time Source** | This setting controls the clock source (timing reference) of the Rivermax library. **** **PTP:** On Windows, when using a BlueField-2 card, you can configure Rivermax’s clock to be PTP, handled by the DPU on the NIC. **System:** When used, Rivermax will use system time for its cloc.**Engine:** When used, Rivermax will use Unreal Engine’s time returned by `FPlatformTime::Seconds`. |
| **PTP Interface Address** | Only used for PTP Time Source. This is the interface address where PTP is coming from. |

### Assets

The following sections describe asset types for NVIDIA Rivermax, which you can create and access in the Content Browser.

The Media Source Details panel settings are shared for all capture cards, so some of the settings will be nonfunctional. Check carefully what settings are appropriate for your Rivermax capture card.

#### Rivermax Media Source

[image: Rivermax Media Source settings.] Rivermax Media Source settings.

Use the Rivermax media source settings to configure a stream you want to receive in Unreal Engine. Here’s a description of each setting:

| Setting | Description |
| --- | --- |
| Video |  |
| **Video Stream** | An expandable section that contains all the settings for the inbound ST 2110-20 video stream. This includes:Frame RateResolutionPixel FormatUse GPU DirectInterface AddressStream AddressPort |
| **Frame Rate** | The frame rate of the video stream. |
| **Resolution** | **If enabled**, the resolution entered is compared against the incoming video stream. If it doesn’t match, errors are logged. ******If not enabled**, media automatically adjusts to the incoming stream detecting its resolution using RTP headers. |
| **Pixel Format** | The pixel format of the video stream. A subset of the formats supported in the 2110-20 standard are supported in Unreal Engine. Options are:8bit YUV42210bit YUV4228bit RGB10bit RGB16bit Float RGB[image: Supported pixel formats]When using 10 bit streams, make sure to disable the **Receivers Apply OCIO** feature, otherwise you might encounter issues with clipping. |
| **Use GPU Direct** | When enabled and if supported, sample memory will go directly from the network card memory to GPU memory, bypassing system memory. Currently globally disabled using a CVAR because of performance problems when receiving more than one stream. |
| **Interface Address (Video)** | This is the IP address of the network interface you want to use. That is, the IP address where the video stream will be coming in. Wildcards (`*` and `?`) are supported so the system can reuse configurations from different machines with different interface IPs. |
| **Stream Address (Video)** | This is the IP address the stream is read from. This is usually a multicast address to which the sender is broadcasting. |
| **Port (Video)** | The port number the stream is sent to. |
| **Deinterlacer** | This property is not supported for Rivermax. Leave it set to **None**. |
| **Interlace Field Order** | This property is not supported for Rivermax. Leave it set to the default setting. |
| ANC |  |
| **ANC Streams** | An array property that contains a list of ST 2110-40 ancillary data streams to receive alongside the video stream. Each entry is an independent UDP flow. Currently supports **ST 2110-40** (Timecode), which decodes ATC LTC timecode (DID `0x60`, SDID `0x60` per SMPTE ST 291-1) and applies it to the corresponding video sample. Add one entry and set its Stream Type to receive timecode. Leave the array empty to disable ANC reception entirely.Each array entry has its own properties. See the other property descriptions in this section for details. |
| **Stream Type** | Determines the stream type. Currently supports only ST 2110-40 (Timecode). Set to None to disable the stream. |
| **Interface Address (ANC)** | The local NIC address for this ANC flow. Can differ from the video stream's interface. |
| **Stream Address (ANC)** | The multicast or unicast destination address for this ANC flow. Must use a different address or port from the video stream. |
| **Port (ANC)** | The UDP port for this ANC flow. |
| Color Management |  |
| **OpenColorIO Override ** | An expandable section that contains all the settings for OpenColorIO. This includes:Configuration SourceTransform SourceTransform Destination |
| **Configuration Source** | Use this property to define your OCIO configuration. See the OCIO documentation (-> color-management-with-opencolorio-in-unreal-engine) for more information. |
| **Transform Source** | Use this property to define your OCIO transform source. See the OCIO documentation (-> color-management-with-opencolorio-in-unreal-engine) for more information. |
| **Transform Destination** | Use this property to define your OCIO transform destination. See the OCIO documentation (-> color-management-with-opencolorio-in-unreal-engine) for more information. |
| **Encoding** **Override** | Only use this property if you are not using OCIO Encoding. See the OCIO documentation (-> color-management-with-opencolorio-in-unreal-engine) for more information. |
| **Color Space** **Override** | Only use this property if you are not using OCIO Encoding. See the OCIO documentation (-> color-management-with-opencolorio-in-unreal-engine) for more information. |
| **Chromatic Adaptation Method** | Not available when using Rivermax. |
| Synchronization |  |
| **Time Synchronization** | This property must be enabled to use Rivermax. When enabled, media sources rely on ptp/frame time data to synchronize incoming streams. Rivermax synchronizes based on the frame number. |
| **Frame Delay** | Leave at 0. Rivermax always uses the latest frame. |
| **Time Delay** | This property is not supported for Rivermax. It should always be grayed out. |
| Synchronization - Advanced |  |
| **Just in Time Rendering** | Enabling this option defers the processing of the media source’s pixels to the last possible point in the current frame pipeline, which provides more time for pixels to arrive from external sources and be rendered in the current frame on the playback device. This is always on by default, and is the only type of rendering Rivermax media support. |
| **Framelock** | Enable to ensure the frame number of the sender to match the frame number of the receiver. For the Rivermax source and output to match, this property must be enabled, but see below about using third-party media sources (-> smpte-2110-ux-reference-in-unreal-engine). |
| **Sample Evaluation Type** | For use with Rivermax, you must set this property to Timecode. |

##### Streaming from Media Servers

Using Rivermax, you can stream media from external sources such as Media Server. When streaming from external sources, you have the option to not use framelocking, and instead have your external media source use timecode-based synchronization. If the external media source encodes a timestamp into RTP headers, then you can disable the **Framelock property**, and select the **Timecode** option for the **Sample Evaluation Type** property. The streamed media will then be synchronized based on the RTP timestamp.

When you stream media from external sources such as Media Server, you can choose to apply color conversion on reception.

- You can use the Override Source Encoding and Override Source Color Space properties if you aren't using OCIO.
- You can apply OCIO color conversion which overrides the above settings.

#### Rivermax Media Output

[image: Rivermax Media Output settings.] Rivermax Media Output settings.

| Setting | Description |
| --- | --- |
| Output |  |
| **Alignment Mode** | Controls the timing of the output frame scheduling. The options are:**Alignment Point:** In this mode, you use Rivermax time to schedule the timing of the output frames (‘alignment’ point) based on ST2059. Each frame will be scheduled to be sent on these alignment points.**Frame Creation:** In this mode, the scheduler will start scheduling each frame when one has been created. Then, at the specified frame interval it will activate to send another one. If none is available, it will wait for the next one and send it out right away. This is useful for ICVFX streaming in nDisplay to reduce latency when sending Inner Frustum render to other nodes. |
| **Do Continuous Output** | Only supported when the **Alignment Mode** is using the **Alignment Point** method. Use this option to constantly output a frame on each alignment point even if no frame is available to send. In that case, the previous frame is repeated. If this option is disabled and no frame is available at a given alignment point, it is skipped and the scheduler tries again at the next alignment point. |
| **Frame Locking Mode** | Only supported when the **Alignment Mode** is using the **Alignment Point** method. Options control what happens when a frame is captured:**Free Run:** If there is no space in the presentation queue, it is dropped.**Block on Reservation:** If there is no space in the presentation queue, the RHI thread is blocked until there is space in the queue. If the engine is running faster than the configured output stream (60fps vs 24fps for example), the engine is locked to the presentation frame rate. |
| **Do Frame Counter Timestamping** | Only applicable when **Alignment Mode** is using the **Frame Creation** method. It converts the engine’s frame number generated when a frame was created, and uses that as the timestamp for this sample. Use it in conjunction with the Framelock player mode of RivermaxMediaSource in a UE-UE setup, mainly for nDisplay. |
| Output - Advanced |  |
| **Number of Texture Buffers** | Base MediaCapture settings controlling textures pre-allocated by MediaCapture. |
| Video |  |
| **Video Stream** | An expandable section that contains all the settings for the inbound ST 2110-20 video stream. This includes:Frame RateResolutionPixel FormatUse GPU DirectInterface AddressStream AddressPort |
| **Frame Rate** | The frame rate of the video stream. |
| **Resolution** | If **enabled**, the captured texture size will be validated against the desired output resolution. If it doesn’t match, it will error out. If **disabled**, output stream resolution will be configured based on the incoming captured texture automatically. |
| **Pixel Format** | The pixel format of the video stream. A subset of the formats supported in the 2110-20 standard are supported in Unreal Engine.[image: Supported pixel formats]When using 10 bit streams, make sure to disable the **Receivers Apply OCIO** feature, otherwise you might encounter issues with clipping. |
| **Use GPUDirect** | When enabled and if supported, sample memory will go directly from GPU memory to the network card memory, bypassing system memory. |
| **Interface Address (Video)** | This is the IP address of the network interface you want to use. That is, the IP address where the video stream will come from. Wildcards (`*` and `?`) are supported so the system can reuse configurations from different machines with different interface IPs. |
| **Stream Address (Video)** | This is the IP address the stream is sent to. This is usually a multicast address where it will be broadcasted to. To really differentiate multicast groups, the address should be made different, not only the port. |
| **Port (Video)** | The port number the stream is sent on. |
| ANC |  |
| **ANC Streams** | An array property that contains a list of ST 2110-40 ancillary data streams to transmit alongside the video stream. Each entry is an independent UDP flow. Currently supports **ST 2110-40** (Timecode), which encodes ATC LTC timecode (DID `0x60`, SDID `0x60` per SMPTE ST 291-1) and sends it in sync with the video stream using the same 90 kHz PTP RTP clock. Add one entry and set its Stream Type to transmit timecode.Each array entry has its own properties. See the other property descriptions in this section for details. |
| **Stream Type** | Determines the stream type. Currently supports only ST 2110-40 (Timecode). Set to None to disable the stream. |
| **Interface Address (ANC)** | The local NIC address for this ANC transmission. Can differ from the video stream's interface. |
| **Stream Address (ANC)** | The multicast or unicast source address for this ANC flow. Must use a different address or port from the video stream. |
| **Port (ANC)** | The UDP port for this ANC transmission. |

#### Rivermax Custom Timestep

You can configure the Engine’s custom timestep from a MediaProfile or from the project settings, and you can now use Rivermax.

[image: Rivermax Custom Timestep settings.] Rivermax Custom Timestep settings.

The custom timestep uses the same alignment method as the Rivermax output when using the Alignment Point method. This means that you can genlock the Engine for a specific frame rate and align it based on the ST2059 alignment point formulas.

The custom timestep requires the PTP clock, because it uses the Time Source settings configured in Rivermax’s project settings, and it is aligned with standard genlock signals that might be used by other devices.An expandable section that contains all the settings for the inbound ST 2110-20 video stream.

- rendering
- graphics

On this page

- Settings (-> smpte-2110-ux-reference-in-unreal-engine)
- Project Settings (-> smpte-2110-ux-reference-in-unreal-engine)
- Assets (-> smpte-2110-ux-reference-in-unreal-engine)
- Rivermax Media Source (-> smpte-2110-ux-reference-in-unreal-engine)
- Streaming from Media Servers (-> smpte-2110-ux-reference-in-unreal-engine)
- Rivermax Media Output (-> smpte-2110-ux-reference-in-unreal-engine)
- Rivermax Custom Timestep (-> smpte-2110-ux-reference-in-unreal-engine)
