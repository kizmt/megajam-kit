# In-Camera VFX Recommended Hardware

https://dev.epicgames.com/documentation/en-us/unreal-engine/recommended-hardware-for-in-camera-vfx-in-unreal-engine?application_version=5.9

> Details on the hardware recommendations for an in-camera VFX setup with Unreal Engine

[image: In-Camera VFX Recommended Hardware]

An in-camera VFX setup using Unreal Engine requires multiple machines to communicate with each other and drive the LED volume display. This page covers the hardware to consider for your in-camera VFX setup.

An example hardware layout with three render nodes. Click image for full size.

Most LED processors have the option to receive sync either from an external genlock source or from the incoming video signal from the graphics cards. Check what options are available with the LED processors you're using. In the hardware diagram, an external genlock source is providing the sync for the LED processors.

### Recommended Machine Hardware

| Workstation | When you select a workstation, it is important that you have adequate space and power for your memory, storage, and graphics hardware. Make sure your workstation has enough space and can support NVLink if you want to utilize multi-GPU, available starting in Unreal Engine 4.26. |
| --- | --- |
| CPU | In general, you should favor faster clock speeds over more cores. Beyond eight cores, the benefits of additional cores will be more noticeable in the compile time for code and shaders than other use cases. It is recommended that you have at least a three gigahertz (Ghz) clock speed as a starting point. Common examples of CPUs used for the in-camera VFX scenario include the Intel Xeon and Intel Core i9 processors, as well as the AMD Ryzen 9 3950X, AMD Threadrippers, and AMD Threadripper Pro. |
| RAM | 64GB of DDR-4 memory is the recommended minimum for most in-camera VFX scenarios. Additional RAM may be required if your production uses large files. |
| GPU | **Artist workstations**: For artists using ray tracing and other advanced rendering features in Unreal Engine, we recommend the professional-level NVIDIA RTX cards: NVIDIA RTX A6000 NVIDIA RTX A5000 NVIDIA Quadro RTX 8000 NVIDIA Quadro RTX 6000 Artists with lighter rendering needs may be able to use the consumer-level NVIDIA RTX cards: NVIDIA GeForce RTX 3080Ti NVIDIA GeForce RTX 3090 **Render nodes**: NVIDIA Quadro Sync is required to synchronize displays across an LED volume. Each render node machine must have this card in addition to its graphics card. You can find more details in NVIDIA's Quadro Sync II User Guide. For render nodes with either single or dual GPU, we recommend the following NVIDIA RTX cards: NVIDIA RTX A6000 NVIDIA Quadro RTX 8000 NVIDIA Quadro RTX 6000 For a complete list of compatible graphics cards with NVIDIA Quadro Sync, refer to the NVIDIA page for Quadro Sync. If you plan to make use of nDisplay's support for rendering to multiple GPUs on a single computer, all graphics cards must also support NVLINK. We generally recommend using the latest drivers from NVIDIA. In particular, when using multiple GPUs on a single workstation, make sure to use **version R512.59 or later**. You can find the recommended driver for Virtual Production on NVIDIA"s Download Drivers page. Select your card type and OS and set **Download Type** to **Production Branch / Studio** to find the recommended driver. |
| Video Card | If you plan to use live green-screen compositing, you will need a SDI video card to handle camera input, compositing output, and timecode synchronization. SDI video cards such as the AJA Kona 5 and the Blackmagic DeckLink are recommended for live compositing. |
| Storage | Because your project data is localized to each computer, fast local storage is necessary for optimal performance. It is recommended that you use M.2 Solid State Drives (SSDs), such as the Samsung 970 Pro, as the secondary data drives from the machine's boot drive. |
| Storage Network Card | A 10-Gigabit Ethernet (GbE) Network Interface Controller (NIC) is recommended to maintain high-speed data transfer between operator systems and render machines. |

### Additional Recommended Hardware

| Network Switch | Most 10 GbE Layer 2 or Layer 3 type network switches, such as the Netgear Smart Switch, should be sufficient for this scenario. |
| --- | --- |
| Sync Generators | There are wired and wireless options available for sync generators, and it is common to use both for an in-camera VFX set. For example, you can use a wired box to send signals to a wireless one. In the hardware diagram above, the orange line represents the wireless connection from a sync generator to the camera. The following is a list of recommended sync generators: Wired options: Blackmagic Design Mini Converter Sync Generator AJA GEN10 HD/SD/AES Sync Generator ESE HD-488E/SD HD/SD-SDI Timecode Reader/Generator/Inserter Evertz 5601MSC Master Sync and Clock Generator Courtyard CY460 Master Synce Generator Wireless options: Ambient Master Lockit for Master Sync Ambient Lockit for Remote Sync |
| Display Adapters | See the NVIDIA list of standard display adapters recommended for the NVIDIA GeForce and Quadro cards. See Club-3D CAC 1080 for connecting Display Port 1.4 to HDMI 2.0 on LED processors. See the Lightware MX2 Series for connecting Display Port 1.2 to HDMI 2.0 on LED processors. Use fiber extenders for longer, uncompressed HDMI connections, such as connecting graphics cards to display ports. The Lightware fiber extender is recommended for uncompressed HDMI 2.0 4K signals. |
| Video Distribution Amplifier (VDA) | For an in-camera VFX setup, VDAs are typically used to distribute the genlock signal into multiple channels to the render nodes, camera tracking system, the live compositing machine, and sometimes the camera itself. In the diagram above, you can see the lines from the genlock sync are distributed through the distribution amplifier to various other devices in the setup. The following is a list of recommended VDAs: Shinybow Composite DAs Kramer VAC |

- in-camera vfx
- synchronization

On this page

- Recommended Machine Hardware (-> recommended-hardware-for-in-camera-vfx-in-unreal-engine)
- Additional Recommended Hardware (-> recommended-hardware-for-in-camera-vfx-in-unreal-engine)
