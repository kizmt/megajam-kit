# Audio Glossary

https://dev.epicgames.com/documentation/en-us/unreal-engine/audio-glossary-in-unreal-engine?application_version=5.9

> A glossary of audio terms relevant to Unreal Engine (UE).

[image: Audio Glossary]

 adaptive differential pulse-code modulation (ADPCM)

An audio codec that converts analog signals into digital information by quantizing the differences between the actual analog signal and a predicted signal.

 air absorption

As sound travels through the air, high frequencies are absorbed more than lower frequencies. The amount of this absorption can vary with temperature and humidity. In UE, air absorption can be modeled under a sound's attenuation settings to create a more realistic decay as a listener moves away from a source.

 ambient sound actor

An actor that can be placed directly into the level editor and contains an audio component.

 ambisonics

A spherical audio format that involves placing an array of coincident soundfield or ambisonic microphones during the recording process. Raw ambisonic recordings, also known as B-format, must be decoded to be used. UE supports FuMA and Ambix first-order ambisonic formats.

 amplitude

The relative strength of sound waves (transmitted vibrations) that is perceived as loudness or volume. Amplitude is measured in decibels (dB), which refers to the sound pressure level or intensity.

 attack time

Refers to how quickly an effect or process is applied to a signal. This is often represented in milliseconds (ms).

 attenuation

A decrease in the volume and quality of a sound. In UE, sound attenuation can be set on any sound and includes options for distance attenuation, air absorption, spatialization, reverb, occlusion, focus, priority, and submix sends.

 audio bus

An asset type that operates similarly to a patch cable by providing a signal path that combines individual audio signals into a single asset. Audio buses function similarly to sound submixes but do not have a graph, are not audible by default, and cannot have digital signal processing (DSP) effects applied to them directly.

 audio component

Attaches to an actor to provide a sound source.

 audio gameplay volume

An extensible, modular component approach for area-based sound processing. This system is intended to replace Audio Volumes.

 audio gameplay volume proxy

A component type used to interact with the Audio Gameplay Volume system without a traditional Audio Gameplay Volume object.

 Audio Mixer

The Audio Mixer is the multi-platform audio renderer in UE.

 Audio Modulation Glossary

An audio engine system for controlling audio parameters from Blueprint and Component Systems. This system is intended to replace Sound Class Mixes.

 Audio Synesthesia

A plugin that exposes automatically extracted audio metadata for gameplay scripting with Blueprint. This feature can be used to drive animations, effects, and other elements tightly coupled to sounds.

 audio volume

A volume actor that can be placed in the level editor to control effects on sound objects inside and outside of a spatialized area. This system is intended to be replaced by Audio Gameplay Volumes.

 AudioLink (API)

An API that connects Unreal Audio Engine to external software, such as other audio engines.

 band pass filter (BPF)

A filter that passes frequencies within a given range and attenuates frequencies outside of that range.

 binaural audio

Audio that has been recorded in such a way as to consider the position of a person's ears and shoulders or has been synthesized using HRTFs (Head-Related Transfer Functions). It is intended to be more realistic but requires headphones for accurate playback.

 Bink Audio

A performance-oriented audio codec that is capable of perceptually lossless 10:1 compression with decode speeds closer to ADPCM than MP3 or Vorbis.

 bit crusher

An audio effect that produces distortion by reducing the resolution or bandwidth of digital audio data.

 bit depth

The number of bits per sample in a digital signal. Audio files with higher bit depths will have a higher resolution. The audio engine supports importing 16-bit files on all editor platforms, and supports 24-bit files on Windows.

 bit rate

The amount of bits a digital audio file contains per second. It's most commonly used to convey the quality of compressed audio formats, such as MP3. For example, a 320 Kbps bit rate recording is processed at 320,000 bits per second.

 codec

A device or computer program that encodes or decodes a data stream or signal. The term codec is a portmanteau of coder/decoder.

 compression format

Any digital audio format that reduces the amount of data from the recorded signal. Compression formats may be lossy or lossless.

 compressor

Reduces the overall dynamic range of a piece of audio by detecting when it exceeds a specified threshold and then attenuating it by a specified amount (the ratio).

 control bus

A modulation source that can be added to an audio source or effect. Assets sent to the same control bus can be modulated as a group by using a control bus mix.

 control bus mix

An array of mix stages used to drive values utilized by Control Buses.

 convolution reverb

A type of reverberation effect that uses digital recordings of physical spaces or other reverb effects, known as impulse responses, to recreate the reverb.

 delay (audio)

An audio signal processing technique that records an input signal to a storage medium and then plays it back after a set period of time.

 digital signal processing (DSP)

Any computation manipulation applied to a digital signal, such as audio or video signals. DSP is often applied to audio analysis or to create audio effects, such as delay or reverb.

 dry level

The volume of the unprocessed audio before any effects or processing.

 envelope follower

Follows the amplitude shape of the incoming signal and sends out a control value based on that shape.

 equalization (EQ)

The process of adjusting the volume of different frequency bands within an audio signal.

 filter

Audio filters are designed to amplify or attenuate a specific range of frequencies. Filters can be used for noise reduction, color, or effect. Low-pass, high-pass, and band-pass are common types of filters.

 Foley

The art of performing sound effects to match movement in a film or interactive experience. Footsteps and cloth movement sounds are common examples of foley.

 frequency

The rate at which a vibration occurs that constitutes a wave, either in a material (as in sound waves) or in an electromagnetic field (as in radio waves and light). Frequency is measured in Hertz (Hz). An audio frequency or audible frequency is a periodic vibration whose frequency is in the band audible to the average human (20–20,000 Hz). It is the property of sound that most determines pitch.

 gain

The amount of amplification applied to a signal by any process that increases its strength. Gain can be measured linearly or in decibels (dB).

 high-pass filter (HPF)

Passes frequencies above a given cutoff frequency to pass through while attenuating frequencies below it.

 limiter

A type of compressor with a very high ratio. A limiter is often used to control spikes in loudness in an audio signal and prevent unwanted distortion.

 listener

A microphone-like decisive point that "hears" sound from a particular point. In UE, this is on the camera by default.

 low-pass filter (LPF)

Passes frequencies below a given cutoff frequency to pass through, while attenuating frequencies above it.

 MetaSound

A high-performance audio system that provides audio designers with complete control over a digital signal processing (DSP) graph for the generation of sound sources.

 modulation destination

Any endpoint that provides a modifiable float value to an audio source or effect.

 modulation parameter

A modulation parameter provides context for how a value associated with a control bus is displayed, mixed, and transformed to and from unit and normalized (unitless) [0.0, 1.0] values. For example, the volume default modulation parameter has a default value of 1.0f in normalized space (0 dB in unit space), and when mixed multiplicatively, this leads to no change in the output.

 modulation source (audio)

Any audio source that modulates a parameter.

 non-spatialized audio

Sound that is not panned in respect to the listener's position. Music, UI sounds, and narration are often non-spatialized. Also known as 2D audio.

 Ogg Vorbis

An open-source audio compression format developed as a replacement for proprietary digital audio encoding formats, such as MP3, VQF, and AAC.

 one-shot (audio)

A non-looping sound.

 panning (audio)

The processes in which a sound source is positioned in a stereo or surround field.

 phase (audio)

Audio waveforms are cyclical; that is, they proceed through regular cycles or repetitions. Phase is defined as how far along its cycle a given waveform is. The phase measurement is given in degrees, with 360 degrees being one complete cycle.

 pulse-code modulation (PCM)

An audio codec that converts analog signals into digital information by sampling and quantizing an analog signal.

 Quartz

An audio engine system for sample-accurate scheduling of audio events.

 release time

Refers to how quickly a signal returns to an unprocessed state after an effect or process has been applied to a signal.

 reverberation (reverb)

The persistence of a sound after the sound is produced. Reverb is created when a sound is reflected off of a surface causing reflections to build up and they decay as the reflections are absorbed by the surfaces of the objects around it. Reverb is often characterized as "echo". However, the effect can be much more subtle. Reverb provides acoustic information about the size and shape of a space. Unreal Engine has a reverb effect asset type, a simple reverb submix effect, and a convolution reverb effect.

 sample rate

The number of samples per second taken from a continuous signal to make a discrete or digital signal.

 semitone

The smallest interval used in classical Western music, which is equal to a twelfth of an octave or half a tone.

 sound class

An organizational asset type for grouping multiple sounds together. Sound classes contain some routing options required for sending sounds to the master reverb submix.

 sound class mix

An asset type that a user can use to group multiple sounds together and then alter the parameters of all relevant Sound Waves at once. This is intended to be replaced by the Audio Modulation system.

 sound concurrency

Defines the limits of how many sounds a given group can play simultaneously and what to do when that limit is reached. The primary cost for an audio engine is decoding and rendering sound sources, so one of the primary tools for reducing CPU cost is limiting the number of sounds that can play simultaneously.

 sound occlusion

Simulates the effect of sound reduction in high-frequency content or amplitude due to object interference between a source and a listener. An example is hearing a person talking in the room next to the one you're in. In UE, occlusion can be set in the Sound Attenuation settings.

 sound submix

A digital signal processing (DSP) graph used to mix audio generated from individual sounds into a single output buffer and efficiently apply effects to multiple sound sources simultaneously.

 sound wave

A fundamental audio asset that is created upon importing an audio file into the editor. Sound waves can be added to audio components, MetaSound graphs, and sound cues.

 soundscape

A system that procedurally generates ambient sounds as the player moves around a level.

 source (audio)

The origin of a sound.

 source bus

Mixes together multiple sources into a single audio buffer, which can be used as a source within the level. Source buses function similarly to an aux bus in a mixer.

 source effect

A digital signal processing (DSP) effect, such as flanger or delay, which can be added to a Source Effect Preset Chain to define a sequence of per-source effects. Source effects function similarly to an insert effect on a mixing console.

 spatialization (audio)

The simulation of location-based sound phenomena such as orientation, attenuation, propagation, obstruction, and reverb.

 stinger

A short musical phrase that's played on top of the music to signal a game event to the player. Stingers are often played when a goal is reached, a player dies, or treasure is found. In addition to music, stingers can also incorporate voiceover or sound effects.

 voice

An active sound source. The maximum number of concurrent voices can be managed in the Project Settings.

 wave tables

WaveTables store periodic wave data in lookup tables and provide a way to perform wavetable synthesis and sampling in MetaSounds.

 wet level

The volume of the processed audio after any effects or processing.

- audio
