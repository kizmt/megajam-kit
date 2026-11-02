# Lighting and look (UE 5.8.4, RTX 4060 8 GB, 4K output)

Visuals are judged. This note is how we get a good-looking, fully dynamic image inside the frame budget
(the performance bar is defined once, in `performance.md`).
**Render path per SETUP 7b**, chosen with the style lock: full Lumen (GI + Lumen reflections, 1080p internal) for
looks that need bounce light, Lumen Lite (cheaper GI, SSR reflections) for bounce light on a tighter budget, or no
Lumen with bounce stand-ins (1260p internal) for flat/stylized looks; see "No-Lumen look" below and `performance.md`
"Render paths". Every path: **Virtual Shadow Maps, all lights
Movable, no Lightmass/baking, Nanite on static props, one opaque master material, few shadow-casting lights.**
Sections marked **(Lumen path)** apply to full Lumen; Lumen Lite ships Medium GI and reflections instead of High.

## Before any outdoor lighting work

- **Load Epic's agent skill `default_outdoor_lighting` first** (`AgentSkillToolset.GetSkills` ->
  `.../editor_toolset/skills/default_outdoor_lighting_PY.DefaultOutdoorLightingSkill`). Its rules, distilled:
  - The **Directional Light (sun) drives everything**. Sun intensity 0 = black Sky Atmosphere and invisible clouds.
    Change the sun first; everything else follows.
  - **Set properties on the COMPONENT, never the actor**: `get_components` first, then `get_properties`/`set_properties`.
  - Sun rotation: Pitch (Y) 0 = horizon, -90 = overhead; Yaw (Z) 0 = North, 180 = South.
  - Use **physical lux** for the sun: 80,000-120,000 direct sun, 300-1,000 sunset. Engine default is far too low.
  - **Sky colour looks wrong? Check cloud Global Coverage first** (default ~-0.2; >0.1 blankets the sky). The skill
    assumes a VolumetricCloud; ours has none by default (see "Environment"), so cloud rules apply only if one is opted in.
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
| Dynamic Global Illumination Method (`r.DynamicGlobalIlluminationMethod`) | `1` Lumen (Lumen path); `0` no-Lumen path | Engine code default is 0; new projects write 1 to DefaultEngine.ini |
| Reflection Method (`r.ReflectionMethod`) | `1` Lumen (Lumen path); `2` SSR no-Lumen path | Code default 2 (SSR) |
| Shadow Map Method (`r.Shadow.Virtual.Enable`) | `1` VSM | Template writes 1 |
| Generate Mesh Distance Fields (`r.GenerateMeshDistanceFields`) | True | Needed for Lumen SW tracing + Movable Sky Light shadows; editor restart |
| Allow Static Lighting (`r.AllowStaticLighting`) | False | Template writes False; also makes material AO work with Lumen |
| Support Hardware Ray Tracing (`r.RayTracing`) | True | Lets Lumen use HWRT on the 4060 |
| Use Hardware Ray Tracing when available (`r.Lumen.HardwareRayTracing`) | 1 (default) | Falls back to SW RT if unsupported |
| Ray Lighting Mode (`r.Lumen.HardwareRayTracing.LightingMode`) | Surface Cache (default) | Hit Lighting = higher quality, much more cost |
| Software Ray Tracing Mode (`r.Lumen.TraceMeshSDFs`) | Detail Tracing | Only matters if HWRT is off |
| Extend default luminance range in Auto Exposure (`r.DefaultFeature.AutoExposure.ExtendDefaultLuminanceRange`) | True | Needed for physical lux; PPV fields become EV100 |
| MegaLights (`r.MegaLights.EnableForProject`) | 0 (default) | See MegaLights below |

- The kit's test project (5.8, Blank C++) already has all of the above, plus `r.Substrate=True` and local-exposure
  contrast 0.8. Check `Config/DefaultEngine.ini` `[/Script/Engine.RendererSettings]` on the jam project.

## Lumen: how it works (just enough) (Lumen path)

- Lumen traces rays against a simplified **Lumen Scene** (a "surface cache" of cards around each mesh) and the screen.
  Screen traces first, then SW (distance fields) or HW (BVH) rays, then the sky. GI and reflections share it.
- Lumen Scene covers **200 m** from camera by default (PPV `Lumen Scene View Distance`, up to 800 m). Beyond: screen only.
- Lighting changes take a few frames to converge (temporal). Judge screenshots after it settles.
- **Static-mobility lights are not supported** by Lumen. Use Movable (our rule anyway).
- Emissive surfaces light the scene through Lumen, with limits: see `materials.md` "Emissive with Lumen".
- **Lumen reflections without Lumen GI need Hardware Ray Tracing.** Mixing paths (no-Lumen GI + Lumen reflections)
  only works with HWRT on; the kit's no-Lumen path uses SSR, so it isn't affected.
- **Clear coat under Lumen:** only the top layer can be glossy; the bottom layer is treated as rough, even at clear
  coat amount 0.
- Leftover lightmaps from an older level stay in memory and on disk until World Settings > **Force No Precomputed
  Lighting** is on and the level is rebuilt and saved. New jam levels have none.

## Hardware vs software ray tracing on the RTX 4060 (Lumen path)

- **Use HWRT (default), Surface Cache lighting mode.** RTX 2000+ supports it; Epic recommends HWRT as the default on
  current-gen consoles at both 30 and 60 fps, and a 4060 is in that class. Quality is higher (no distance-field
  blobbiness, better reflections, no SW thin-wall issues).
- HWRT cost scales with **ray-tracing instance count** (TLAS rebuilt every frame). Keep well under ~100,000 instances
  after culling (`stat SceneRendering` -> "Ray tracing active instances"). Use instancing (ISM/PCG).
- Turn off **Visible In Ray Tracing** on skydomes and huge overlapping background meshes.
- Nanite meshes are ray traced via a **fallback mesh** (Static Mesh `Fallback Relative Error`). Self-shadow/leak
  artifacts on Nanite props in HWRT: raise Fallback Relative Error accuracy or check `Show > Advanced > Nanite Meshes`.
- A/B: if Lumen passes exceed ~2 ms (4K output, 1080p internal), try `r.Lumen.HardwareRayTracing 0` (SW RT, Global Tracing is the
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

- **Lumen path: target High (2) for GI, Reflections and Shadows** on the 4060: Epic: High = 60 fps budget, Epic = 30 fps. Measured: High is +22 fps at 4K (`performance.md`).
  Lumen GI+reflections+translucency+volumetric fog budget at 60 fps is **~4 ms** (console 1080p figure).
- Lumen path: ship a settings default of High for these three groups (`DefaultGameUserSettings.ini`, SETUP step 7b), not Epic.
  Other groups can stay Epic if `stat unit` allows.
- **Lumen Lite = Medium (1) for GI and Reflections** (Epic's Lumen Performance Guide): the Irradiance final gather
  (probes around pixels, pre-calculated irradiance) plus SSR, with rough specular from the GI. Dynamic bounce light
  stays; it's softer, and reflections are screen-space only. Epic targets it at 60 fps on low-end PCs and Switch 2;
  each level costs roughly half the one above. It's a render path of its own (SETUP 7b) and also what a weaker PC
  gets from the Medium preset of a Lumen game.
- Resolution: 4K output; internal 1080p on the Lumen and Lumen Lite paths (engine default for a 4K display), 1260p
  on the no-Lumen path (SETUP 7b). Raise internal resolution only if `bench.ts` shows headroom (`performance.md`).

## Post Process Volume (one, Infinite Extent (Unbound) ticked)

- One unbound PPV per level for the global look; smaller bound PPVs (higher Priority, Blend Radius) for rooms/moods.
- Lumen GI (PPV fields, Lumen path): `Lumen Scene Lighting Quality`, `Lumen Scene Detail`, `Lumen Scene View Distance`,
  `Final Gather Quality`, `Max Trace Distance` (default 200 m), `Lumen Scene Lighting Update Speed`,
  `Final Gather Lighting Update Speed`, `Diffuse Color Boost` (keep < 2), `Skylight Leaking`.
  C++/Python names: `LumenSceneLightingQuality`, `LumenSceneDetail`, `LumenSceneViewDistance`, `LumenFinalGatherQuality`,
  `LumenMaxTraceDistance`, `LumenDiffuseColorBoost`, `LumenSkylightLeaking`, `LumenSkylightLeakingTint`.
- Lumen Reflections: `LumenReflectionQuality`, `LumenMaxRoughnessToTraceReflections` (higher = much more cost),
  `LumenMaxReflectionBounces` (keep 1; >1 needs hit lighting).
- Leave quality sliders at 1 by default. Raise one only to fix a specific artifact, then re-measure.

## Common Lumen artifacts and fixes (Lumen path)

| Symptom | Fix |
|---|---|
| Light leaking through walls/corners | Walls **>= 10 cm thick**; walls/floors/ceilings as **separate meshes** (no one-mesh rooms) |
| Leak in caves / big interiors | Raise PPV `Max Trace Distance` + `Lumen Scene Detail` |
| Interior pitch black | PPV `Skylight Leaking` (small, e.g. 0.05-0.2) as an art control, or add a fill light (no-sky recipe: "Lights") |
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
- **Lifting a dark interior evenly with no visible source (no sky light or GI):** a physical fill blows out the
  surface under it. Use a non-physical point light: `set_use_inverse_squared_falloff(False)`,
  `set_light_falloff_exponent(1.0)`, shadows and GI off, intensity far below the key lights.

## MegaLights (5.8: Experimental) - don't use by default

- Cvar help text in 5.8 source (`MegaLights.cpp`): "requires Hardware Ray Tracing, and does not support Directional
  Lights. Experimental feature."; default `r.MegaLights.EnableForProject=0`. (Off-by-default escape hatches exist:
  `r.MegaLights.SoftwareRayTracing.Allow`, `r.MegaLights.DirectionalLights`; don't rely on them.)
- Stochastic many-light shadowing with near-constant cost, for local lights only (the sun stays a normal VSM light);
  not for water/clouds/heterogeneous volumes; Forward renderer incompatible.
- Only consider it if a scene genuinely needs dozens of shadowed local lights (night town, neon). Measure first;
  per-light `Allow MegaLights`, `MegaLights Shadow Method` (Ray Tracing preferred). Kill switch `r.MegaLights.Allowed 0`.

## Environment (outdoor stack, all in the Basic level; no VolumetricCloud by default)

- **Sky Atmosphere**: physically based sky + aerial perspective, driven by the sun. Rayleigh = blue sky, Mie = haze.
  **The scattering "scale" setters take absolute coefficients, not multipliers**: `set_rayleigh_scattering_scale(0.75)`
  meant as "75%" turned the frame Mars-orange. Defaults (`SkyAtmosphereComponent.cpp`): Rayleigh scattering 0.0331,
  Mie scattering 0.003996, Mie absorption 0.000444. Scale those (`0.0331 * 0.75`).
- **Sky Light**: `Real Time Capture` on (`bRealTimeCapture`), source = captured scene. Fills shadows; Lumen uses it
  for sky occlusion. Real-time capture follows sun/time-of-day changes.
- **Exponential Height Fog**: `Fog Density`, `Fog Height Falloff`, `Start Distance` (also saves cost), `Second Fog Data`.
  **Volumetric Fog** (off by default) for god rays: `Scattering Distribution` (~0 for side-visible shafts, ~0.9 toward
  light), `Albedo`, `Extinction Scale`, `View Distance`. Needs sg.ShadowQuality >= 2. Costs GPU; tint for mood.
  **Fog colour is in physical units:** under a 20,000 lux sun a 0-1 `fog_inscattering_luminance`/colour has no visible
  effect; the colour comes from the sky atmosphere ambient (`sky_atmosphere_ambient_contribution_color_scale`). The fog
  actor's Z is the density base: check it sits at ground or sea level (a template's sat 45 m under the sea).
- **Volumetric Cloud (opt-in only)**: SETUP 7b deletes the template's (measured ~2.5 ms at 4K). Add one only if the
  look needs it, and bench it (`performance.md`). Look comes from its material instance (see skill).
  Known 5.8.0 report (forum, unconfirmed by Epic): jagged edges where opaque meshes overlap clouds when height-fog
  Falloff ~0 and Density low. Workaround: raise falloff/density, or `r.VolumetricRenderTarget 0` (costly) (unverified on 5.8.4).

## Exposure

- Decide one mode per level and write it down. Read the PPV first (skill rule).
- **Auto** (`AutoExposureMethod` = Auto Exposure Histogram, default): set `AutoExposureMinBrightness` and
  `AutoExposureMaxBrightness` (EV100 when Extend range is on) to a narrow range (e.g. 8-12 outdoors with a non-physical sun; with a physical ~100,000 lux sun the scene sits near EV100 14, so clamp around it) so it can't
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

## No-Lumen look (stylized render path)

Only relevant if the game uses the no-Lumen path. Learned on one prototype (a stylized, glossy look on a bright
floor); the problems are general, the numbers are that game's. What went wrong without Lumen and the fixes that worked:

- **Shadows take the sky's colour** (blue under a blue sky), because nothing bounces the floor colour into them. Fix:
  tint the Sky Light toward the floor/key colour and
  use a neutral post-process shadow gain, not a blue-boosting one. Judge the shadow hue against the art direction.
- **Undersides and sides of glossy objects and characters go dark and "dirty"**: no floor bounce, and surfaces facing
  sideways or down reflect a black lower hemisphere.
  - **Sky Light lower hemisphere as the bounce stand-in.** Turn on "Lower Hemisphere Is Solid Color"
    (`bLowerHemisphereIsBlack`), Real Time Capture on, and set `LowerHemisphereColor` to the floor colour scaled to
    radiance. The capture shader does `lerp(SceneColor, LowerHemisphereColor.rgb, LowerHemisphereColor.a)`
    (`ReflectionEnvironmentShaders.usf`), so the RGB is raw radiance in nits (~8000 looked right with a 100,000 lux
    sun) and **alpha is the blend weight: set A = 1** (`FLinearColor * float` also scales alpha, so set A after
    scaling). Call `RecaptureSky()` after changing it at runtime. Too strong flattens characters; tune by capture.
  - **Sphere Reflection Captures** over the play area so glossy surfaces reflect the real floor and props.
  - Slightly higher roughness on glossy characters (+0.1) hides what is left.
  - An upward-facing, non-shadowing directional fill only lights faces pointing straight down; it does little for
    vertical faces (the lower hemisphere does that). If you add one, set the sun's `forward_shading_priority = 1`,
    or the editor shows "Multiple directional lights are competing" (editor-only message, ties go to intensity).
- **Reflection captures without baking:** with no precomputed lighting, `LevelEditorSubsystem.build_light_maps(
  QUALITY_PREVIEW, True)` returns False ("Skipping Lighting Build") but still builds the reflection captures and writes
  `<Map>_BuiltData`. **Save the level afterwards**, or the captures are black in a packaged build.
- Turning Lumen GI off switches **SSAO** on (it was skipped under Lumen): `r.AmbientOcclusionLevels=0`, and
  `r.DistanceFieldAO=0`, unless you want the look.

## Lighting gotchas (found on a prototype; general UE behaviour)

- **Huge or very thin meshes break Lumen's sky occlusion.** A 40 km x 4 m backdrop disc got a distance field far
  coarser than the mesh, so Lumen treated the space above it as blocked and every shadow on it was black. Backdrop
  shapes made from overlapping spheres (interior faces, e.g. cloud puffs) do the same. Fix: Affect Distance Field
  Lighting off on those components (`affect_distance_field_lighting=False`).
- **The Basic level's height fog has black inscattering**, which draws a dark band at the horizon behind bright
  backdrops. For a bright pastel sky: fog `sky_atmosphere_ambient_contribution_color_scale` ~2.5 and SkyAtmosphere
  `sky_luminance_factor` ~2.5.
- **Aerial perspective view distance scale** (SkyAtmosphere): UI range up to 3, default 1. Higher values wash the far
  end of a level out to grey; keep 1-2 for a crisp stylized look and judge it at the far end, not at the start camera.
  Height fog density and bloom have the same effect; cutting fog density hard and turning bloom off brings the far colours back.
- **Physical sun and Lumen cached lighting:** with a ~100,000 lux sun the scene settles near EV100 14. The default
  `r.EyeAdaptation.CachedLightingPreExposure=4` covers only about EV -8..12, so Lumen's cached lighting and the sky
  capture clip (black shadows, on-screen "Cached lighting in Lumen ... clipped"). `=8` (about -4..16) fixes it.
- **Lumen reflection cap:** `LumenMaxRoughnessToTraceReflections` in the post-process volume and the cvar
  `r.Lumen.Reflections.MaxRoughnessToTrace` do the same thing, but the cvar wins whenever it is >= 0
  (`LumenReflections.cpp`). Prefer the PPV (per level, visible in the editor) and don't put the cvar in an ini.
  0.25 saved ~1 ms on a glossy scene with no visible loss of gloss.
- **Re-running a lighting script changes captures on its own** (sky recapture), by more than many real changes
  (11% of pixels vs 0.4-2.7% for the change being tested). A/B captures need identical steps and a control run.
- Python struct constructors have surprising positional orders (`unreal.Color`, `unreal.Rotator`): always pass
  keywords (`editor-scripting.md` E).
- **A light close to a wall turns proud trim into large grazing shadow shapes**: place the source in front of the
  trim and check shadows from the gameplay camera.

## Measuring

- `stat unit` first, then `stat gpu`. Lumen shows as **Lumen Scene Lighting**, **Lumen Screen Probe Gather**,
  **Lumen Reflections**; VSM as **Shadow Depths** (Nanite vs Non-Nanite) and **Shadow Projection** (exact stat strings unverified).
  `ProfileGPU` for detail; `stat SceneRendering` for ray tracing instance count.
- The pass/fail bar is `performance.md` "The bar"; the GPU frame budget for the game's target fps is in
  `performance.md` "Bench lessons" (60 fps ≈ 13 ms after TSR and margin). Rough per-pass shares of that budget (ours,
  not Epic's): Lumen ~20% (Lumen path), shadows ~20%, fog ~10%. No VolumetricCloud by default (measured ~2.5 ms).
- For isolated Lumen timings, `r.Lumen.AsyncCompute 0` while profiling only.
- Final numbers come from the **packaged** build on the target PC.

## Verified against

- Agent skill: `C:\Program Files\Epic Games\UE_5.8\Engine\Plugins\Experimental\Toolsets\EditorToolset\Content\Python\editor_toolset\skills\default_outdoor_lighting.py` (all skill rules above).
- Project Settings cvar names: `C:\Program Files\Epic Games\UE_5.8\Engine\Source\Runtime\Engine\Classes\Engine\RendererSettings.h`.
- Code defaults (`r.DynamicGlobalIlluminationMethod` 0, `r.ReflectionMethod` 2, `r.Shadow.Virtual.Enable` 0,
  `r.Lumen.HardwareRayTracing` 1, `r.MegaLights.EnableForProject` 0 "Experimental"): `Engine\Source\Runtime\Renderer\Private\`
  `IndirectLightRendering.cpp`, `VirtualShadowMaps\VirtualShadowMapArray.cpp`, `Lumen\LumenHardwareRayTracingCommon.cpp`, `MegaLights\MegaLights.cpp`.
- Template defaults: `C:\Program Files\Epic Games\UE_5.8\Templates\TP_Blank\Config\DefaultEngine.ini`; project values: `<Project>\Config\DefaultEngine.ini`.
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
