# Analyzers and Output Metering in Audio Insights

https://dev.epicgames.com/documentation/en-us/unreal-engine/analyzers-and-output-metering-in-audio-insights-in-unreal-engine?application_version=5.9

> Check your final mix against industry loudness standards and inspect its waveform and frequency content.

[image: Analyzers and Output Metering in Audio Insights]

The **Output Metering** and **Analyzers **panels contain six real-time visualizations of the engine’s main audio output, some of which are only available in the editor. Where Routing, Mixing, and Metering in Audio Insights (-> routing-mixing-in-metering-with-audio-insights-in-unreal-engine) tracks levels for individual submixes and buses, these six analyzers focus on the final mixed output as a whole.

Select the visualizations from the options menu in the upper-right corner of the panel:

- **Loudness**
- **Meter**
- **Oscilloscope**
- **Vectorscope**
- **Spectrogram**
- **Spectrum Analyzer**

## Loudness Meters

The **Loudness Meters** tab is only available in the editor. It displays the main output loudness measurements in LUFS values. This is measured over three different window lengths of audio data:

- **Momentary**: 400 ms
- **Short Term**: 3 seconds
- **Integrated**: Up to 60 minutes

The Loudness display also shows loudness range and true peak values with target and max displays.

The loudness measurements use ITU-R BS.1770 standard for perceptual weighting.

The Loudness Meters shows the following information:

| Value | Description |
| --- | --- |
| **Integrated Loudness Timer** | At the top of the panel. A time length in minutes and seconds showing how long the current integrated measurement has been running. |
| **Reset** | Resets all loudness measurements and starts new windows. |
| **Target Loudness** | Read-only target loudness value, customizable in the **Settings **menu. Measurements under the target value are green, measurements over the target value are red. You can customize these colors in the **Settings **menu. |
| **True Peak Limit** | Read-only True Peak value, customizable in the **Settings **menu. |
| **Loudness Values** | Numerical readouts for all measurements (visibility set in settings). True Peak, Short Term, and Momentary each have a Max button showing the current max; clicking it resets the max. Displays can be dragged and dropped to reorder. |
| **Loudness Meters** | Similar to Loudness Values, but shown as meters instead of numbers. Measurements can also be dragged between the meter and values sections. |

 The **Settings **menu has options to display each of the different Loudness measurements as a meter, a numerical value, or both. This menu also has the following display options:

- **Range **and **Offset**: Adjust to focus on a specific range in your loudness metering.
- **Relative Scale**: Refers all loudness measurements to the target value (LU) as opposed to absolute values (LUFS)

## RMS Meter

In the **Analyzers **panel, the **RMS Meter **displays the main output RMS amplitude in a logarithmic dB scale. The number of channels matches the channel configuration of the audio device. There are no additional controls for this analyzer.

## Oscilloscope

The Oscilloscope is only available in the editor. It displays a time domain sample amplitude plot of the most recent 0.5 seconds of audio coming from the main audio output. The scale is a linear float from -1.0 to a max of 1.0. There are no additional controls for this analyzer.

## Vectorscope

The **Vectorscope **is only available in the editor. It displays a linear time domain amplitude of the left channel on the horizontal axis against the right channel on the vertical axis. This is good for observing phase relationships and channel coherence. There are no additional controls for this analyzer.

## Spectrogram

The **Spectrogram **is only available in the editor. It displays a frequency domain plot of the most recent audio output mixed into a mono channel. Time is on the horizontal axis and audio frequency is on the vertical. Each vertical line in the plot represents a single timed window of audio and the color of the pixel represents the power of the audio signal at that frequency. There are several controls for the plot, selected by right clicking anywhere on the analyzer:

| Spectrogram Control | Description |
| --- | --- |
| Analyzer Settings |  |
| **Analyzer Type** | You can choose between two options for how to represent the audio signal in the frequency domain. Options are:**Fast Fourier Transform (FFT)****Constant Q Transform (CQT)** |
| **FFT Size** | Controls the number of audio samples used in each windowed transformation. A larger size gives greater frequency resolution, at the trade off of lower time resolution. |
| Display Options |  |
| **Pixel Plot Mode** | You can choose how the samples are weighted to display signal strength. You can use this to emphasize transient frequencies or not. Options are:**Sample****Peak****Average** |
| **Frequency Scale** | You can choose the scale to see different details in the spectrum. Options are:**Linear****Logarithmic** |
| **Color Map** | You can choose what color represents a greater signal strength. Options are:**White****Black** |
| **Orientation** | Choose between a horizontal orientation (pictured above) or a vertical orientation, which swaps the axes so time is vertical and frequency is horizontal. |

## Spectrum Analyzer

The **Spectrum Analyzer** is only available in the editor. It displays an instantaneous frequency domain plot of the main output mixed into a mono channel with audio frequency on the horizontal axis and signal strength on the vertical axis. Moving the mouse to a specific frequency will display the signal strength at that band of the spectrum. There are several display options for this analyzer.

| Spectrum Analyzer Control | Description |
| --- | --- |
| Analyzer Settings |  |
| **Ballistics** | You can choose between Analog or Digital, which simulates the signal persistence between audio windows to have the appearance of analog or digital professional audio meters. This determines how smooth (analog) or precise (digital) the transition between frames can be. |
| **Analyzer Type** | You can choose between two options for how to represent the audio signal in the frequency domain. Options are: **Fast Fourier Transform (FFT)** **Constant Q Transform (CQT)** |
| **FFT Size** | Controls the number of audio samples used in each windowed transformation. A larger size gives greater frequency resolution, at the trade off of lower time resolution. |
| Display Options |  |
| **Tilt Spectrum** | You can attenuate each frequency to flatten out the graph of a spectrum weighted on the lower frequencies. |
| **Pixel Plot Mode** | You can choose how the samples are weighted to display signal strength. You can use this to emphasize transient frequencies or not. Options are:**Sample****Peak****Average** |
| **Frequency Scale** | You can choose the scale to see different details in the spectrum. Options are:LinearLogarithmic |
| **Display Frequency Axis Labels** | When enabled, labels the horizontal graph grid lines with numerical values in Hertz. |
| **Display Sound Level Axis Labels** | When enabled, labels the vertical graph grid lines with numerical values in decibels. |

On this page

- Loudness Meters (-> analyzers-and-output-metering-in-audio-insights-in-unreal-engine)
- RMS Meter (-> analyzers-and-output-metering-in-audio-insights-in-unreal-engine)
- Oscilloscope (-> analyzers-and-output-metering-in-audio-insights-in-unreal-engine)
- Vectorscope (-> analyzers-and-output-metering-in-audio-insights-in-unreal-engine)
- Spectrogram (-> analyzers-and-output-metering-in-audio-insights-in-unreal-engine)
- Spectrum Analyzer (-> analyzers-and-output-metering-in-audio-insights-in-unreal-engine)

Related documents

Profiling with Audio Insights

 [image: Profiling with Audio Insights] (-> audio-insights-in-unreal-engine)
