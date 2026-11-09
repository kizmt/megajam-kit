# nDisplay Overscan

https://dev.epicgames.com/documentation/en-us/unreal-engine/ndisplay-overscan-in-unreal-engine?application_version=5.9

> Use Overscan to achieve pixel perfect render continuity across multiple render nodes when cluster rendering with nDisplay and with post effects enabled.

[image: nDisplay Overscan]

Achieve pixel perfect render continuity across multiple render nodes when cluster rendering with nDisplay and with post effects enabled. By overscanning in configurable direction(s), and then cropping out the extra rendered pixels with an exposed amount, users can decide on a (visual accuracy vs performance) ratio that works best for their project.

Visually impactful effects such as bloom, ambient occlusion or motion blur can now be enabled to some extent when range is kept relatively small in most nDisplay projects - at some configurable performance cost.

## Limitations

- Auto-exposure should remain disabled as overscan cannot fix this.

- This technique works well when the range of the post effect doesn't exceed the set overscan percentage. It is designed to help reduce or minimise visual discrepancy since the percentage is arbitrary.

- This implementation works with all projection policies.

## Supported Rendering Features

| Feature | nDisplay Compatibility | Solution | Notes* | Visual Impact | Accumulation Buffer | In-Camera VFX Compatible |
| --- | --- | --- | --- | --- | --- | --- |
| Rendering / Post Effects |  |  |  |  |  |  |
| Bloom (-> bloom-in-unreal-engine) | Yes* | Overscan | Keep radius small | High | No | Yes |
| Lens Flare (-> post-process-effects-in-unreal-engine) | No | Avoid |  | High | No | Yes |
| Auto Exposure (Eye Adaptation) (-> auto-exposure-in-unreal-engine) | No | Avoid | Will separate type of logic. | High | Yes | Yes |
| Motion Blur (-> content-examples-sample-project-for-unreal-engine) | Yes* | Overscan |  | Medium | No | Yes but not working well for cinematography. |
| Depth of Field (DoF) (-> depth-of-field-in-unreal-engine) | No | Avoid |  |  |  |  |
| Screen Space Ambient Occlusion (SSAO) (-> post-process-effects-in-unreal-engine) | Yes* | Overscan | Keep radius small | Medium | No | Yes |
| Temporal Anti Aliasing (TAA) (-> post-process-effects-in-unreal-engine) | Yes* | Overscan |  | Low | Yes | Yes |
| Screen Space Reflections (SSR) (-> screen-space-reflections-in-unreal-engine) | No | Avoid |  | High | Yes | Yes |
| Screen Space Global Illumination (SSGI) | No | Avoid |  | High | Yes | Yes |
| Vignetting (-> post-process-effects-in-unreal-engine) | Yes* | N/A |  | Medium | No | Yes |
| Scene Fringe (Chromatic Aberrations) (-> post-process-effects-in-unreal-engine) | Yes* | Avoid | Keep radius small | Low | No | Yes |
| Raytracing (Denoiser) | No |  |  | Low | No | Should work but noise is non-deterministic. |
| Rendering / Other |  |  |  |  |  |  |
| Planar Reflections (-> planar-reflections-in-unreal-engine) | Yes* | N/A | Users can customize the FOV setting. | High | No | Yes |
| Sky Atmosphere | Yes | N/A | Fixed | High | No | Yes |
| Material (shader) time based animations (-> constant-material-expressions-in-unreal-engine) | Yes |  |  |  | Sometimes |  |
| Shadows (-> shadowing-in-unreal-engine) | Yes |  |  |  | No |  |
| Culling (-> visibility-and-occlusion-culling-in-unreal-engine) | Yes |  |  |  | No |  |
| UMG - 2D (-> umg-editor-reference-for-unreal-engine) | No |  |  |  | No |  |
| Gameplay |  |  |  |  |  |  |
| Sequencer (-> real-time-compositing-with-sequencer-in-unreal-engine) | Yes | N/A | N/A | High | No | Yes |
| Blueprints (-> blueprints-visual-scripting-in-unreal-engine) | Yes/No | Avoid randoms | Works if using seeded randoms. There is also the BeginPlay issue not running when BP is reconstructed. | High | Sometimes | Yes |
| Physics (Chaos solver) IKRigid bodiesCloth (-> clothing-tool-in-unreal-engine) | Yes | Yes |  | High | No | Yes |
| Particle System Cascade / Niagara (-> creating-visual-effects-in-niagara-for-unreal-engine) | Yes | N/A | Deterministic setting must be set to ON for emitters. | High | Sometimes | Yes |
| Media / Playback |  |  |  |  |  |  |
| Video / Image sequence (-> media-framework-in-unreal-engine) | N/A | N/A | Video engine currently not frame accurate. | High | No |  |
| Video I/O, BM, Aja (-> professional-video-io-in-unreal-engine) | N/A | N/A | N/A | High | No |  |
| NDI/SMPTE 2110 (-> media-framework-overview-for-unreal-engine) | N/A | N/A | Need to test for frame accuracy. | High | No |  |

* The feature functions within limits. For example, Bloom functions for small/medium bloom radiuses as opposed to large blooms which would not make sense or function well in terms of the performance - visual ratio. Refer to the Notes for further details for individual features.

On this page

- Limitations (-> ndisplay-overscan-in-unreal-engine)
- Supported Rendering Features (-> ndisplay-overscan-in-unreal-engine)
