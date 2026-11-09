# Rendering to Multiple Displays with nDisplay

https://dev.epicgames.com/documentation/en-us/unreal-engine/rendering-to-multiple-displays-with-ndisplay-in-unreal-engine?application_version=5.9

> nDisplay renders your Unreal Engine scene on multiple synchronized display devices.

[image: Rendering to Multiple Displays with nDisplay]

Interactive content isn't limited to being displayed on a single screen, or even a single dual-screen device like a VR headset. An increasing number of visualization systems aim to immerse the viewer more effectively in the game environment by rendering real-time content through multiple simultaneous displays. These systems may be made up of multiple adjacent physical screens, such as a Powerwall display; or they may use multiple projectors to project the 3D environment onto physical surfaces like domes, tilted walls, or curved screens, such as in a Cave virtual environment.

Unreal Engine supports these usage scenarios through a system called **nDisplay**. This system addresses some of the most important challenges in rendering 3D content simultaneously to multiple displays:

- It eases the process of deploying and launching multiple instances of your Project across different computers in the network, each rendering to one or more display devices.
- It manages all the calculations involved in computing the viewing frustum for each screen at every frame, based on the spatial layout of your display hardware.
- It ensures that the content being shown on the various screens remains exactly in sync, with deterministic content across all instances of the Engine.
- It offers passive and active stereoscopic rendering.
- It can be driven by input from VR tracking systems, so that the viewpoint in the displays accurately follows the point of view of a moving viewer in real life.
- It is flexible enough to support any number of screens in any relative orientation, and can be easily reused across any number of Projects.

For additional background information about nDisplay, a more in-depth look at the real-life applications and display systems it was designed to support, and the future vision for the technology, download the white paper here.

nDisplay was an integral part of the visuals for Childish Gambino's award-winning 2018 Pharos show. See the project spotlight video below!

### Getting Started

- [image: nDisplay Overview] nDisplay OverviewDescribes how multiple computers work together in an nDisplay rendering network. (-> ndisplay-overview-for-unreal-engine)
- [image: Creating Secondary UVs for nDisplay] Creating Secondary UVs for nDisplayGuide for creating a second UV channel for the nDisplay projection meshes so that the In-Camera VFX editor can take full advantage of all of its features. (-> creating-secondary-uvs-for-ndisplay-for-unreal-engine)
- [image: nDisplay Quick Start] nDisplay Quick StartA guide to your first steps getting up and running with nDisplay. (-> ndisplay-quick-start-for-unreal-engine)
- [image: Unreal Stage App] Unreal Stage AppAn application designed to utilize a tablet as a wireless control panel for specific Unreal Engine features in a physical space. (-> unreal-stage-app-for-unreal-engine)
- [image: nDisplay Configuration File Reference] nDisplay Configuration File ReferenceA reference companion for all the settings available in the nDisplay configuration file. (-> ndisplay-configuration-file-reference-for-unreal-engine)
- [image: nDisplay Quick Launch Local Tool] nDisplay Quick Launch Local ToolHow to set up and use the nDisplay Launch plugin for local nDisplay project rendering. (-> ndisplay-quick-launch-local-tool-in-unreal-engine)

### Guides

- [image: Adding nDisplay to an Existing Project] Adding nDisplay to an Existing ProjectDescribes how to set up any existing Project to be ready for nDisplay. (-> adding-ndisplay-to-an-existing-project-in-unreal-engine)
- [image: Using Calibration Test Patterns with nDisplay] Using Calibration Test Patterns with nDisplayHow to make nDisplay show test patterns that you can use to validate your setup. (-> using-calibration-test-patterns-with-ndisplay-in-unreal-engine)
- [image: nDisplay Actor Replication] nDisplay Actor ReplicationAn overview of how to control Actor replication across your nDisplay cluster. (-> ndisplay-actor-replication-in-unreal-engine)
- [image: Using Cluster Events with nDisplay] Using Cluster Events with nDisplayDescribes how to send events to your nDisplay cluster, and how to respond to those events in Blueprints. (-> using-cluster-events-with-ndisplay-in-unreal-engine)

- [image: Multi-Process Rendering] Multi-Process RenderingLearn about multi-process rendering and how it differs from multi-GPU rendering. (-> multiprocess-rendering-with-unreal-engine)

- [image: Creating Secondary UVs for nDisplay] Creating Secondary UVs for nDisplayGuide for creating a second UV channel for the nDisplay projection meshes so that the In-Camera VFX editor can take full advantage of all of its features. (-> creating-secondary-uvs-for-ndisplay-for-unreal-engine)

### Reference

- [image: Camera Motion Blur with nDisplay] Camera Motion Blur with nDisplayUse Camera Motion Blur with your nDisplay virtual production project. (-> camera-motion-blur-with-ndisplay-in-unreal-engine)

- [image: Color Management in nDisplay] Color Management in nDisplayUsing nDisplay color management tools. (-> color-management-in-ndisplay-in-unreal-engine)

- [image: nDisplay Template] nDisplay TemplateUse the nDisplay Template as the starting point for your nDisplay projects. (-> ndisplay-template-in-unreal-engine)

- [image: nDisplay Root Actor Reference] nDisplay Root Actor ReferenceA reference for the nDisplay Root Actor (-> ndisplay-root-actor-reference-for-unreal-engine)

- [image: nDisplay Overscan] nDisplay OverscanUse Overscan to achieve pixel perfect render continuity across multiple render nodes when cluster rendering with nDisplay and with post effects enabled. (-> ndisplay-overscan-in-unreal-engine)

- [image: Projection Policies in nDisplay] Projection Policies in nDisplayReference for policies supported in Unreal Engine for multiple screen displays (-> projection-policies-in-ndisplay-in-unreal-engine)

- [image: Stereoscopic Rendering with nDisplay] Stereoscopic Rendering with nDisplayOptions for making nDisplay render stereoscopic images. (-> stereoscopic-rendering-with-ndisplay-in-unreal-engine)

- [image: Synchronization in nDisplay] Synchronization in nDisplayAn overview of how synchronization works across multiple displays (-> synchronization-in-ndisplay-in-unreal-engine)

- [image: Changing nDisplay Communication Ports] Changing nDisplay Communication PortsDescribes the different communication ports nDisplay uses on each computer to communicate with other computers in the cluster. (-> changing-ndisplay-communication-ports-in-unreal-engine)

- rendering
- graphics

On this page

- Getting Started (-> rendering-to-multiple-displays-with-ndisplay-in-unreal-engine)
- Guides (-> rendering-to-multiple-displays-with-ndisplay-in-unreal-engine)
- Reference (-> rendering-to-multiple-displays-with-ndisplay-in-unreal-engine)
