# MIDI in Unreal Engine

https://dev.epicgames.com/documentation/en-us/unreal-engine/midi-in-unreal-engine?application_version=5.9

> An overview of how to stream MIDI data to your projects.

[image: MIDI in Unreal Engine]

Learn to use this **Beta** feature, but use caution when shipping with it.

## MIDI Device Support

 [image: Enable the MIDI Device Support Plugin]

The **MIDI Device Support** plugin adds the ability to send and receive **MIDI (Musical Instrument Digital Interface)** protocol messages. This is most frequently used to communicate between Unreal Engine and external hardware such as MIDI keyboards. However, because MIDI is a data protocol, a user can use data parsed from messages to drive non-audio related parameters, as well.

Currently, Unreal Engine only supports streamed MIDI data. Reading MIDI files is not supported.

## What Is MIDI?

MIDI is a data protocol designed for communicating between different audio hardware devices, using MIDI messages. A MIDI message starts with a byte containing the type of message it is (a "status" byte), followed by data bytes.

For example, one of the most common MIDI messages is a **Note On** message, which consists of a status byte that both signifies it as a Note On message and communicates the channel it is intended for (a value from 0 - 15), followed by a byte of pitch data, and then a byte of velocity data. Because the most significant bit of each data byte is used to signify that it is a data byte, both the pitch and velocity data can only contain a value between 0 and 127.

The MIDI protocol also specifies how to interpret bytes of data, such as how to translate a pitch value of 0 to 127 into a unit such as Hz. While Unreal does not directly translate MIDI data this way, which potentially allows users to use MIDI messages to drive behavior other than audio, our **Sound Utilities** plugin includes several functions that can be used to perform MIDI data conversions.

 [image: Enable the Sound Utilities Plugin]

## Workflows

### MIDI Output

To get **MIDI Output** functioning in Unreal Engine, follow the workflow described below:

- Find the ID of the device you want to send the MIDI signal to. You can do this by: Selecting the default MIDI device.

- Iterating through all available MIDI devices

- Searching for a specific MIDI device by name.

The relevant **Blueprint** functions are **Get Default MIDI Output Device ID**, **Find MIDI Devices**, and **Get MIDI Output Device ID by Name**.

- Create your **MIDI Output UObject** using the Blueprint function, **Create MIDIDevice Output Controller**. This function takes an ID as input, and returns either a reference to the MIDI Output, or a null reference if it was unsuccessful in connecting to the MIDI Device. It's important to make sure you cache your MIDI Device Output Controller into a variable. Otherwise, your MIDI Controller is at risk of being unexpectedly garbage collected.

- Send over your MIDI commands! These are going to be the functions under **MIDI Device Manager **that act on a **MIDIDevice Output Controller**. Generally, the functions used most often are **Send MIDINote On**, **Send MIDINote Off**, and Send **MIDIPitch Bend**.

- If you're more experienced with MIDI protocols, you also have the option of constructing raw MIDI Event data using **Send MIDIEvent**.

A basic Blueprint implementation for MIDI Output will resemble the image below, though likely with more elaborate instructions for what MIDI data to send:

 [image: A basic MIDI Output Blueprint]

### MIDI Input

To set up **MIDI Input**, follow the workflow described below:

- Get your **MIDI Input Device** set up and cached in a variable; this will look almost identical to the first two steps in setting up MIDI Output listed above, with the exception that the function names will contain **Input** instead of **Output**.

- Register to delegates for the **MIDI Events** you care about, through actions such as **Assign To On MIDI Note On** on your MIDI Input Device

- Use the resulting data from these MIDI Events to drive parameters in your project, such as the pitch or velocity of a playing sound. Some of the functions in the Sound Utilities Plugin can translate MIDI's (0 - 127) integral data points into units more readily interpreted by the Audio engine, such as frequency and volume scalars.

- For more advanced users, you may want to experiment with interpreting MIDI data such as **Control Change** messages, or with creating a polyphonic music system by using multiple **Audio Components** and keeping track of which notes are active.

A basic MIDI Input system Blueprint implementation might look like this, although likely with more complex uses for the incoming MIDI data:

 [image: A basic MIDI Input Blueprint]

- beta
- audio
- midi

On this page

- MIDI Device Support (-> midi-in-unreal-engine)
- What Is MIDI? (-> midi-in-unreal-engine)
- Workflows (-> midi-in-unreal-engine)
- MIDI Output (-> midi-in-unreal-engine)
- MIDI Input (-> midi-in-unreal-engine)
