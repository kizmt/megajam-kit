# Lighting and look (UE 5.8.4, RTX 4060 8 GB, 1440p internal, 60 fps)

Visuals are judged. This note is how we get a good-looking, fully dynamic image without blowing the 16.6 ms frame.
Kit decisions (see `worldbuilding.md`): **Lumen GI + Lumen reflections, Virtual Shadow Maps, all lights Movable,
no Lightmass/baking, Nanite on static props, one opaque master material, few shadow-casting lights.**

## Before any outdoor lighting work

- **Load Epic's agent skill `default_outdoor_lighting` first** (`AgentSkillToolset.GetSkills` ->
  `.../editor_toolset/skills/default_outdoor_lighting_PY.DefaultOutdoorLightingSkill`). Its rules, distilled:
  - The **Directional Light (sun) drives everything**. Sun intensity 0 = black Sky Atmosphere and invisible clouds.
    Change the sun first; everything else follows.
  - **Set properties on the COMPONENT, never the actor**: `get_components` first, then `get_properties`/`set_properties`.
  - Sun rotation: Pitch (Y) 0 = horizon, -90 = overhead; Yaw (Z) 0 = North, 180 = South.
  - Use **physical lux** for the sun: 80,000-120,000 direct sun, 300-1,000 sunset. Engine default is far too low.
  - **Sky colour looks wrong? Check cloud Global Coverage first** (default ~-0.2; >0.1 blankets the sky).
  - Don't fight the atmosphere's sunset colour with light Temperature or PPV White Balance; keep Temperature
    5500-6500 K, nudge +-500 K only as a last step.
  - Height fog is near-ground depth only; horizon haze is Sky Atmosphere aerial perspective. Sunset fog density
    0.000002-0.00002, Start Distance 2000-5000.
  - Never edit the engine cloud material: duplicate to `/Game/...` (e.g. `MI_VolumetricCloud_Overcast`), assign, tweak.
  - Overcast recipe = cloud MI (coverage 0.5-0.75, density 0.02-0.04) + low thick cloud layer + soft sun
    (Source Angle 2-5, up to 15-30; Soft Angle 40-70) + Mie 0.01-0.05 + cooler Rayleigh colour.
  - Loop: screenshot + read values -> change -> screenshot + assess; **max 3 cycles**, then stop and report.
- Exposure: see "Exposure" below; the skill's two modes (auto vs manual) decide what bias value is sane.

## Project Settings (Rendering) - verify on the jam project, don't assume

| Setting (cvar) | Want | Note |
|---|---|---|
| Dynamic Global Illumination Method (`r.DynamicGlobalIlluminationMethod`) | `1` Lumen | Engine code default is 0; new projects write 1 to DefaultEngine.ini |
| Reflection Method (`r.ReflectionMethod`) | `1` Lumen | Code default 2 (SSR) |
| Shadow Map Method (`r.Shadow.Virtual.Enable`) | `1` VSM | Template writes 1 |
| Generate Mesh Distance Fields (`r.GenerateMeshDistanceFields`) | True | Needed for Lumen SW tracing + Movable Sky Light shadows; editor restart |
| Allow Static Lighting (`r.AllowStaticLighting`) | False | Template writes False; also makes material AO work with Lumen |
| Support Hardware Ray Tracing (`r.RayTracing`) | True | Lets Lumen use HWRT on the 4060 |
| Use Hardware Ray Tracing when available (`r.Lumen.HardwareRayTracing`) | 1 (default) | Falls back to SW RT if unsupported |
| Ray Lighting Mode (`r.Lumen.HardwareRayTracing.LightingMode`) | Surface Cache (default) | Hit Lighting = higher quality, much more cost |
| Software Ray Tracing Mode (`r.Lumen.TraceMeshSDFs`) | Detail Tracing | Only matters if HWRT is off |
| Extend default luminance range in Auto Exposure (`r.DefaultFeature.AutoExposure.ExtendDefaultLuminanceRange`) | True | Needed for physical lux; PPV fields become EV100 |
| MegaLights (`r.MegaLights.EnableForProject`) | 0 (default) | See MegaLights below |

- SmokeTest (5.8 project on GIZMO) already has all of the above, plus `r.Substrate=True` and local-exposure
  contrast 0.8. Check `Config/DefaultEngine.ini` `[/Script/Engine.RendererSettings]` on the jam project.

## Lumen: how it works (just enough)

- Lumen traces rays against a simplified **Lumen Scene** (a "surface cache" of cards around each mesh) and the screen.
  Screen traces first, then SW (distance fields) or HW (BVH) rays, then the sky. GI and reflections share it.
- Lumen Scene covers **200 m** from camera by default (PPV `Lumen Scene View Distance`, up to 800 m). Beyond: screen only.
- Lighting changes take a few frames to converge (temporal). Judge screenshots after it settles.
- **Static-mobility lights are not supported** by Lumen. Use Movable (our rule anyway).
- Emissive materials light the scene for free via the final gather, but **small, very bright emissives = noise**
  and small meshes are culled from the Lumen Scene. For a light the player must see, place a real light;
  use emissive for glow + bloom, not as the main light source.

## Hardware vs software ray tracing on the RTX 4060

- **Use HWRT (default), Surface Cache lighting mode.** RTX 2000+ supports it; Epic recommends HWRT as the default on
  current-gen consoles at both 30 and 60 fps, and a 4060 is in that class. Quality is higher (no distance-field
  blobbiness, better reflections, no SW thin-wall issues).
- HWRT cost scales with **ray-tracing instance count** (TLAS rebuilt every frame). Keep well under ~100,000 instances
  after culling (`stat SceneRendering` -> "Ray tracing active instances"). Use instancing (ISM/PCG).
- Turn off **Visible In Ray Tracing** on skydomes and huge overlapping background meshes.
- Nanite meshes are ray traced via a **fallback mesh** (Static Mesh `Fallback Relative Error`). Self-shadow/leak
  artifacts on Nanite props in HWRT: raise Fallback Relative Error accuracy or check `Show > Advanced > Nanite Meshes`.
- A/B: if Lumen passes exceed ~4 ms at 1440p, try `r.Lumen.HardwareRayTracing 0` (SW RT, Global Tracing is the
  fastest path; cost doesn't scale with instance count). Keep whichever is faster *in the packaged build*.

## Scalability (sg.*) - what each level means for Lumen/VSM

Groups: `sg.ResolutionQuality` (= screen percentage), `sg.ViewDistanceQuality`, `sg.AntiAliasingQuality`,
`sg.ShadowQuality`, `sg.GlobalIlluminationQuality`, `sg.ReflectionQuality`, `sg.PostProcessQuality`,
`sg.TextureQuality`, `sg.EffectsQuality`, `sg.FoliageQuality`, `sg.ShadingQuality`. Levels 0 Low, 1 Medium,
2 High, 3 Epic, 4 Cinematic. `scalability auto` prints this machine's perf index.

| Level | GI (`sg.GlobalIlluminationQuality`) | Reflections (`sg.ReflectionQuality`) | Shadows (`sg.ShadowQuality`) |
|---|---|---|---|
| 0 Low | Lumen GI off, skylight dimmed (0.8) | Lumen off, SSR off | VSM pool 512, no SMRT, no volumetric fog |
| 1 Medium | Lumen **Irradiance** final gather (`r.Lumen.FinalGatherMethod=0`), cheaper surface cache | **SSR** (Lumen refl off) | pool 512, volumetric fog off |
| 2 High | Screen Probe Gather, downsample 32, no mesh-SDF tracing | Lumen, half res (`DownsampleFactor=2`) | pool 2048, volumetric fog on |
| 3 Epic | Screen Probe Gather, downsample 16, hit lighting allowed | Lumen, full res | pool 4096, sharper directional |

- **Target High (2) for GI, Reflections and Shadows** on the 4060 at 60 fps: Epic: High = 60 fps budget, Epic = 30 fps.
  Lumen GI+reflections+translucency+volumetric fog budget at 60 fps is **~4 ms** (console 1080p figure).
- Ship a settings default of High for these three groups (via `DefaultScalability.ini` or GameUserSettings), not Epic.
  Other groups can stay Epic if `stat unit` allows.
- Resolution: 1440p internal on a 4K output = TSR at ~66.7% ("Quality" preset in `[ResolutionQuality]`).

## Post Process Volume (one, Infinite Extent (Unbound) ticked)

- One unbound PPV per level for the global look; smaller bound PPVs (higher Priority, Blend Radius) for rooms/moods.
- Lumen GI (PPV fields): `Lumen Scene Lighting Quality`, `Lumen Scene Detail`, `Lumen Scene View Distance`,
  `Final Gather Quality`, `Max Trace Distance` (default 200 m), `Lumen Scene Lighting Update Speed`,
  `Final Gather Lighting Update Speed`, `Diffuse Color Boost` (keep < 2), `Skylight Leaking`.
  C++/Python names: `LumenSceneLightingQuality`, `LumenSceneDetail`, `LumenSceneViewDistance`, `LumenFinalGatherQuality`,
  `LumenMaxTraceDistance`, `LumenDiffuseColorBoost`, `LumenSkylightLeaking`, `LumenSkylightLeakingTint`.
- Lumen Reflections: `LumenReflectionQuality`, `LumenMaxRoughnessToTraceReflections` (higher = much more cost),
  `LumenMaxReflectionBounces` (keep 1; >1 needs hit lighting).
- Leave quality sliders at 1 by default. Raise one only to fix a specific artifact, then re-measure.

## Common Lumen artifacts and fixes

| Symptom | Fix |
|---|---|
| Light leaking through walls/corners | Walls **>= 10 cm thick**; walls/floors/ceilings as **separate meshes** (no one-mesh rooms) |
| Leak in caves / big interiors | Raise PPV `Max Trace Distance` + `Lumen Scene Detail` |
| Interior pitch black | PPV `Skylight Leaking` (small, e.g. 0.05-0.2) as an art control, or add a fill light |
| Noisy/boiling indirect light | `Final Gather Quality` up (cost); avoid tiny super-bright emissives; place real lights |
| Black areas in reflections / no bounce on a mesh | Surface cache gaps (pink in View Modes > Lumen > **Surface Cache**): raise Static Mesh `Max Lumen Mesh Cards` (default 12) or split mesh |
| Blobby/wrong SW tracing | Static Mesh `Distance Field Resolution Scale` (1.5-2); don't import tiny and scale up; Show > Visualize > Mesh Distance Fields |
| Slow update after big light change (sun off) | Raise `Lumen Scene Lighting Update Speed` / `Final Gather Lighting Update Speed` briefly |

- Debug views: View Modes > Lumen > Overview / Lumen Scene / Surface Cache / Reflection View.

## Virtual Shadow Maps

- 16k virtual shadow map split into 128x128 pages; only pages visible pixels need are rendered. Directional = clipmaps.
- **Cached**: pages re-render only when invalidated. Invalidators: moving/rotating the light (all its pages),
  moving/adding/removing casters, **World Position Offset / Pixel Depth Offset** materials, skeletal animation.
  -> **Never animate the sun's rotation every frame** (time-of-day) unless measured; it re-renders every page.
  -> Keep WPO (wind, wobble) off the master material by default; set `World Position Offset Disable Distance`.
- **Non-Nanite casters cost far more** (separate pass per light). Nanite everything that can be (our rule);
  non-Nanite meshes need LODs.
- Soft shadows: Directional `Source Angle` / local `Source Radius` (0 = hard). Bigger = softer and costlier;
  reduce angle/radius before reducing ray counts.
- Page pool overflow (on-screen warning, checkerboard/missing shadows): too many VSM lights or too much resolution.
  Fewer shadowed lights first; `r.Shadow.Virtual.MaxPhysicalPages` (2048 at High) second.
- Debug: View Modes > Virtual Shadow Map (Cached Page: green cached, red invalidated);
  `r.ShaderPrintEnable 1` + `r.Shadow.Virtual.Stats 1`. Turn visualizers off before profiling.

## Lights (all Movable)

- Sun: Directional Light, `Atmosphere Sun Light` on (`bAtmosphereSunLight`), `Cast Cloud Shadows` for cloud shadows.
- Local: Point/Spot/Rect. **Turn Cast Shadows off** on fill/accent lights; only key lights cast. Tight Attenuation Radius.
- Per-light: `Indirect Lighting Intensity` (Lumen bounce), `Affect Global Illumination`,
  `Volumetric Scattering Intensity` + `Cast Volumetric Shadow` (volumetric fog cost), `Use Temperature`/`Temperature`.
- No Static or Stationary lights, no Lightmass Importance Volume, no Build Lighting.

## MegaLights (5.8: Experimental) - don't use by default

- Cvar help text in 5.8 source says "Experimental feature"; default `r.MegaLights.EnableForProject=0`.
- Stochastic many-light shadowing with near-constant cost. Recommended with HWRT; **directional lights not supported by
  default**; not for water/clouds/heterogeneous volumes; Forward renderer incompatible.
- Only consider it if a scene genuinely needs dozens of shadowed local lights (night town, neon). Measure first;
  per-light `Allow MegaLights`, `MegaLights Shadow Method` (Ray Tracing preferred). Kill switch `r.MegaLights.Allow 0`.

## Environment (outdoor stack, all in the Basic level)

- **Sky Atmosphere**: physically based sky + aerial perspective, driven by the sun. Rayleigh = blue sky, Mie = haze.
- **Sky Light**: `Real Time Capture` on (`bRealTimeCapture`), source = captured scene. Fills shadows; Lumen uses it
  for sky occlusion. Real-time capture follows sun/time-of-day changes.
- **Exponential Height Fog**: `Fog Density`, `Fog Height Falloff`, `Start Distance` (also saves cost), `Second Fog Data`.
  **Volumetric Fog** (off by default) for god rays: `Scattering Distribution` (~0 for side-visible shafts, ~0.9 toward
  light), `Albedo`, `Extinction Scale`, `View Distance`. Needs sg.ShadowQuality >= 2. Costs GPU; tint for mood.
- **Volumetric Cloud**: look comes from its material instance (see skill). Expensive at high res; profile.
  Known 5.8.0 report (forum, unconfirmed by Epic): jagged edges where opaque meshes overlap clouds when height-fog
  Falloff ~0 and Density low. Workaround: raise falloff/density, or `r.VolumetricRenderTarget 0` (costly) (unverified on 5.8.4).

## Exposure

- Decide one mode per level and write it down. Read the PPV first (skill rule).
- **Auto** (`AutoExposureMethod` = Auto Exposure Histogram, default): set `AutoExposureMinBrightness` and
  `AutoExposureMaxBrightness` (EV100 when Extend range is on) to a narrow range (e.g. 8-12 outdoors) so it can't
  wander; `AutoExposureBias` (Exposure Compensation) only -2..+2. Speed Up high, Speed Down low.
- **Fixed**: Min = Max (disables adaptation) or Method = Manual. With physical sun lux and no auto range, large
  negative bias is needed (direct sun -10 to -14 EV, sunset -1 to -3; table in the skill).
  `AutoExposureApplyPhysicalCameraExposure` off unless you set camera ISO/shutter/aperture.
- Recommended for a game: auto with a tight EV100 clamp; it handles indoor/outdoor transitions.
- **Local Exposure** (PPV > Lens > Local Exposure): Epic recommends always setting it up with Lumen. Highlight/Shadow
  Contrast 0.6-1.0, Detail Strength 1.

## Post-process look (stylized)

- Tonemapper (Film): `FilmSlope` (higher = darker/contrastier), `FilmToe` (shadows), `FilmShoulder` (highlights);
  leave `FilmBlackClip`/`FilmWhiteClip`.
- Colour grading: `ColorSaturation`, `ColorContrast`, `ColorGamma`, `ColorGain` per Global/Shadows/Midtones/Highlights;
  `WhiteTemp`; `SceneColorTint`. Push saturation/contrast slightly for a punchy, readable look.
- **LUT**: `ColorGradingLUT` + `ColorGradingIntensity`. Fastest route to a strong graded look: screenshot -> grade
  the neutral LUT strip in an image editor -> import as LUT texture (`TC_ColorLookupTable`, no mips) (unverified for 5.8 steps).
- Bloom: `BloomIntensity`, `BloomThreshold`; Standard method is cheap, Convolution is expensive (skip).
- Vignette: `VignetteIntensity` (5.8 also has `VignetteType`, `VignetteColor`, `VignetteSoftness`).
- Film grain / chromatic aberration: tiny amounts or none; they fight TSR clarity.
- Stylized recipes that stay Lumen-friendly: strong sun colour + coloured fog/Sky Atmosphere; low sun for long shadows;
  saturated LUT; post-process material (Domain = Post Process) for outlines/posterize - one material, keep cheap.
- Don't use Lumen `Diffuse Color Boost` above 2 to fake vibrancy (brightens reflections too).

## Measuring

- `stat unit` first, then `stat gpu`. Lumen shows as **Lumen Scene Lighting**, **Lumen Screen Probe Gather**,
  **Lumen Reflections**; VSM as **Shadow Depths** (Nanite vs Non-Nanite) and **Shadow Projection** (exact stat strings unverified).
  `ProfileGPU` for detail; `stat SceneRendering` for ray tracing instance count.
- Rough targets at 1440p internal (ours, not Epic's): Lumen total <= 4 ms, shadows <= 2 ms, fog+clouds <= 1.5 ms.
- For isolated Lumen timings, `r.Lumen.AsyncCompute 0` while profiling only.
- Final numbers come from the **packaged** build on GIZMO.

## Verified against

- Agent skill: `C:\Program Files\Epic Games\UE_5.8\Engine\Plugins\Experimental\Toolsets\EditorToolset\Content\Python\editor_toolset\skills\default_outdoor_lighting.py` (all skill rules above).
- Project Settings cvar names: `C:\Program Files\Epic Games\UE_5.8\Engine\Source\Runtime\Engine\Classes\Engine\RendererSettings.h`.
- Code defaults (`r.DynamicGlobalIlluminationMethod` 0, `r.ReflectionMethod` 2, `r.Shadow.Virtual.Enable` 0,
  `r.Lumen.HardwareRayTracing` 1, `r.MegaLights.EnableForProject` 0 "Experimental"): `Engine\Source\Runtime\Renderer\Private\`
  `IndirectLightRendering.cpp`, `VirtualShadowMaps\VirtualShadowMapArray.cpp`, `Lumen\LumenHardwareRayTracingCommon.cpp`, `MegaLights\MegaLights.cpp`.
- Template defaults: `C:\Program Files\Epic Games\UE_5.8\Templates\TP_Blank\Config\DefaultEngine.ini`; project values: `C:\dev\SmokeTest\Config\DefaultEngine.ini`.
- Scalability table: `C:\Program Files\Epic Games\UE_5.8\Engine\Config\BaseScalability.ini`.
- PPV field names: `C:\Program Files\Epic Games\UE_5.8\Engine\Source\Runtime\Engine\Classes\Engine\Scene.h`.
- Light property names: `Engine\Source\Runtime\Engine\Classes\Components\` `SkyLightComponent.h`, `DirectionalLightComponent.h`, `LightComponent.h`.

## Sources (5.8)

- Lumen GI and reflections: https://dev.epicgames.com/documentation/en-us/unreal-engine/lumen-global-illumination-and-reflections-in-unreal-engine?application_version=5.8
- Lumen technical details: https://dev.epicgames.com/documentation/en-us/unreal-engine/lumen-technical-details-in-unreal-engine?application_version=5.8
- Lumen performance guide: https://dev.epicgames.com/documentation/en-us/unreal-engine/lumen-performance-guide-for-unreal-engine?application_version=5.8
- Virtual Shadow Maps: https://dev.epicgames.com/documentation/en-us/unreal-engine/virtual-shadow-maps-in-unreal-engine?application_version=5.8
- MegaLights: https://dev.epicgames.com/documentation/en-us/unreal-engine/megalights-in-unreal-engine?application_version=5.8
- Exponential Height Fog: https://dev.epicgames.com/documentation/en-us/unreal-engine/exponential-height-fog-in-unreal-engine?application_version=5.8
- Post process effects: https://dev.epicgames.com/documentation/en-us/unreal-engine/post-process-effects-in-unreal-engine?application_version=5.8
- Auto exposure: https://dev.epicgames.com/documentation/en-us/unreal-engine/auto-exposure-in-unreal-engine?application_version=5.8
- Forum (community, not Epic) 5.8.0 cloud/opaque edge bug: https://forums.unrealengine.com/t/ue5-8-volumetric-cloud-opaque/2746561
