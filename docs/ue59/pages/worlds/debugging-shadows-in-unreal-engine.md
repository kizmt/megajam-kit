# Debugging Shadows

https://dev.epicgames.com/documentation/en-us/unreal-engine/debugging-shadows-in-unreal-engine?application_version=5.9

> Use view modes, show flags, console variables, and stats to find and fix shadow problems.

When a shadow looks wrong, the first job is to find out which system is drawing it and what that system is doing. Unreal Engine has view modes, show flags, console variables and stats that show you which shadowing method casts a shadow, which cascade or clipmap level covers a pixel, what's cached from earlier frames, and where the shadow cost goes. This page groups those tools by the problem you're trying to solve.

Most tools apply to one shadowing method. Projects that use Virtual Shadow Maps (-> virtual-shadow-maps-in-unreal-engine), the default for new projects, mostly use the **Virtual Shadow Map** view modes. Projects that use conventional **Shadow Maps**, for example on mobile or lower-end hardware, use the cascaded shadow map tools. To check which method your project uses, see **Shadow Map Method** in the **Direct Lighting** section of **Project Settings > Engine > Rendering**.

## Enabling the Shadow Debug Views

The shadow debug tools need no setup, but they're only available in builds that include debug view modes, so you can't use them in Shipping builds. You'll find them in three places in the Level Editor viewport:

- The **View Modes** menu, which is labeled with the current view mode, such as **Lit**. It has the **Virtual Shadow Map** submenu, **Lighting Only** and **Detail Lighting**, and the **Optimization Viewmodes** submenu with **Light Complexity** and **Stationary Light Overlap**.

- The **Show** menu, where the **Lighting Components**, **Lighting Features**, **Visualize**, **Advanced** and **Developer** submenus toggle individual shadow features and overlays.

- The console, for the views that have no menu entry. `ShowFlag.<Name> 1` turns a show flag on in the editor or in a game, and `ShowFlag.<Name> 2` returns it to its default.

## Finding Which Method Draws a Shadow

A pixel can be shadowed by several methods at once: shadow maps, distance field shadows, contact shadows and capsule shadows. To find which one causes a problem, turn them off one at a time in the **Show** menu:

| **Show flag** | **What it turns off** |
| --- | --- |
| **Show > Lighting Components > Dynamic Shadows** | All shadows that aren't baked into lightmaps. |
| **Show > Lighting Features > Distance Field Shadows** | Ray traced distance field shadows. |
| **Show > Lighting Features > Screen Space Contact Shadows** | Contact Shadows (-> contact-shadows-in-unreal-engine). |
| **Show > Lighting Features > Capsule Shadows** | Capsule Shadows (-> capsule-shadows-in-unreal-engine). |

The **Lighting Only** view mode removes material color so shadows are easier to see, and **Detail Lighting** does the same but keeps normal maps.

To see which objects cast shadows at all, use **View Modes > Virtual Shadow Map > Shadow Casters**. It colors each object by how it casts shadows and shows a legend. With Virtual Shadow Maps, the colors also show which objects invalidate cached shadow pages (see Checking What's Cached (-> debugging-shadows-in-unreal-engine)). Objects that only cast contact shadows are yellow. Without Virtual Shadow Maps, the view falls back to three colors: **Casts Shadow**, **Contact Shadow Only** and **No Shadow**.

## Finding Which Cascade Covers a Pixel

Shadow resolution depends on how far a pixel is from the camera. Conventional shadow maps use cascades for this, and Virtual Shadow Maps use clipmap levels (for Directional Lights) or mip levels (for local lights).

### With Virtual Shadow Maps

Use **View Modes > Virtual Shadow Map > Clipmap/Mip Level**, which colors each pixel by the clipmap or mip level it samples. For how clipmaps work, see Clipmaps for Directional Light (-> virtual-shadow-maps-in-unreal-engine).

### With Shadow Maps

Set `r.Shadow.VisualizeCSMOverlay 1` to tint the scene by the Directional Light cascade each pixel uses. The first four cascades are red, yellow, green and blue. The first four far shadow cascades are cyan, orange, violet and white. Pink shows pixels beyond all cascades, where only distance field shadows or no dynamic shadows apply. A legend lists the colors, and a few lines of text give the number of cascades and far cascades and the distance at which each one ends.

To see what each cascade actually contains, set `r.Shadow.VisualizeCSMDepthBuffers 1`. This draws each cascade's shadow depth map as a row of labeled tiles across the top of the screen, such as **Cascade 0** and **Far Cascade 0**. Use it to check that the objects you expect are in a cascade, and how much detail it has.

For the settings that place the cascades, see Cascaded Shadow Maps (-> directional-lights-in-unreal-engine) on the Directional Lights page.

## Fixing Blurry or Low-Detail Shadows

Some softness is intended: a larger **Source Angle** or **Source Radius** gives softer shadows. For other blur, check how much resolution the pixel gets:

- **Virtual Shadow Maps:** **Clipmap/Mip Level** shows whether a distant level covers the area. **Virtual Page** shows how pages are laid out. For the resolution bias settings and page limits, see Virtual Shadow Maps (-> virtual-shadow-maps-in-unreal-engine).

- **Shadow Maps:** the CSM overlay shows whether a later, larger cascade covers the area, and the depth buffer tiles show how much detail that cascade has. To bring more detail closer, change the cascade count, the dynamic shadow distance or **Distribution Exponent** on the Directional Light.

- **Distance field shadows:** pink in the CSM overlay means the area is past the cascades. On a Directional Light, distance field shadows take over there, and their quality depends on each mesh's distance field. **Show > Visualize > Mesh DistanceFields** shows those distance fields. See Mesh Distance Fields (-> mesh-distance-fields-in-unreal-engine).

## Finding Missing Shadows

If an object doesn't cast a shadow, check these in order:

- **Is shadow casting on?** Check **Cast Shadows** on the light and **Cast Shadow** on the object's component. The Shadow Casters view shows which objects cast shadows.

- **Is the object past the dynamic shadow distance?** Beyond a Directional Light's dynamic shadow distance, only objects with **Far Shadow** enabled render into the far cascades. With Virtual Shadow Maps, non-Nanite objects past that distance are also culled unless **Far Shadow** is on. See Checking Far Shadows (-> debugging-shadows-in-unreal-engine).

- **Is the object very small on screen?** Non-Nanite objects whose bounds are tiny on screen are culled from shadow rendering.

- **Is it a Stationary light?** No more than four Stationary lights can overlap. Lights over the limit lose their precomputed shadows and fall back to more expensive dynamic shadows. **View Modes > Optimization Viewmodes > Stationary Light Overlap** shows the overlap, and **Select > Lights > Stationary Lights Exceeding Overlap** selects the lights that are over the limit. See Stationary Light Mobility (-> stationary-light-mobility-in-unreal-engine).

- **Is it a contact shadow?** Contact shadows are traced in screen space, so they disappear when the occluder is off screen.

## Checking What's Cached

### Virtual Shadow Map Caching

**View Modes > Virtual Shadow Map > Cached Page** tints cached pages green, and uncached pages red. Blue pages have only the static page cached. **Shadow Casters** shows which objects invalidate the cache. To compare against no caching, set `r.Shadow.Virtual.Cache 0`. For how to reduce invalidations, see Caching (-> virtual-shadow-maps-in-unreal-engine).

The new **Overview** mode, at the top of the **Virtual Shadow Map** submenu, is a good place to start. It shows six views side by side: **Shadow Mask**, **Clipmap/Mip Level**, **Virtual Page**, **Cached Page**, **Nanite Overdraw** and **SMRT Ray Count**. **SMRT Ray Count** isn't otherwise in the menu unless you enable the advanced modes with `r.Shadow.Virtual.Visualize.Advanced 1`. In the console or a packaged development build, use `r.Shadow.Virtual.Visualize Overview`. The console variable only takes effect while the viewport is already in the Virtual Shadow Map view mode; in the Lit view it does nothing.

### Cascade Depth Reuse

Conventional cascades can reuse their shadow depths from earlier frames instead of re-rendering every frame (see Reusing Cascade Depths Between Frames (-> directional-lights-in-unreal-engine) on the Directional Lights page). While reuse is on, the CSM overlay shows how stale each cascade is: its tint fades as its depths age, and returns to full strength when the cascade re-renders. In the depth buffer tiles, cascades that render movable objects separately appear as extra tiles marked **(dynamic)**.

## Checking Far Shadows

Far shadow cascades extend a Directional Light's shadows beyond the dynamic shadow distance, out to **Far Shadow Distance**. Only objects with **Far Shadow** enabled (in the advanced section of the component's **Lighting** category) render into them, so the cost depends on how many objects have it.

To see which objects cast far shadows, set `ShowFlag.VisualizeFarShadowCasters 1`. Objects that cast far shadows are green, and other objects are gray, with a legend. There's no viewport menu entry for this view. In a running game or Play In Editor session, `viewmode FarShadowCasters` does the same. For Nanite meshes, **View Modes > Nanite Visualization** also has a **Far Shadow Casters** mode once you set `r.Nanite.Visualize.Advanced 1`.

To reduce far shadow cost:

- Turn **Far Shadow** off for objects that are too small to matter at that distance. To change it at runtime, for example when an object is streamed in or swapped for a low-detail version, call the new **Set Cast Far Shadow** Blueprint function on the primitive component.

- Lower **Far Shadow Cascade Count** on the Directional Light.

- With cascade depth reuse on, set `r.Shadow.CSMShadowDepthReuse.FarInterval` so the far cascades re-render less often than the near ones. Distant shadows change less on screen, so they can usually wait longer. By default, far cascades use the same interval as the others.

## Measuring Shadow Cost

| **Tool** | **What it shows** |
| --- | --- |
| `stat GPU` | GPU time by pass. **ShadowDepths** is the cost of rendering shadow maps, and shadow projection is part of **Lights**. |
| `stat ShadowRendering` | CPU time for shadow depth and projection passes, counts of whole-scene, per-object and cached shadows, shadow map memory, and Virtual Shadow Map counters. |
| **Show Statistics** | In the **Virtual Shadow Map** submenu. Shows page statistics on screen. See Understanding the Number of Pages Being Drawn (-> virtual-shadow-maps-in-unreal-engine). |
| **Light Complexity** | In **Optimization Viewmodes**. Colors pixels by how many non-static lights affect them. |
| **Show > Advanced > Shadow Frustums** | Draws the frustums of visible conventional shadow maps as wireframes. Set `r.Shadow.DrawPreshadowFrustums 1` to see preshadow frustums instead. |
| **Show > Developer > Static Shadow Skeletal Meshes** | Highlights Skeletal Meshes that have **Render Shadow Static** enabled, so their shadows render from a static reference pose. |

Visualization modes cost a little GPU time themselves, so turn them off before you profile.

## Limitations

- **CSM views don't run on mobile devices.** `r.Shadow.VisualizeCSMOverlay` and `r.Shadow.VisualizeCSMDepthBuffers` aren't compiled for Android or iOS. They do work in the editor's mobile preview.

- **The CSM views only apply to conventional shadow maps.** Projects using Virtual Shadow Maps don't render cascades, so use the **Virtual Shadow Map** view modes there.

- **Console overrides the menu.** If `r.Shadow.Virtual.Visualize` is set, it overrides the mode you pick in the **Virtual Shadow Map** submenu. Set it to `none` to give control back to the menu.

## More Information

- Shadowing (-> shadowing-in-unreal-engine)

- Virtual Shadow Maps (-> virtual-shadow-maps-in-unreal-engine)

- Directional Lights (-> directional-lights-in-unreal-engine)

- Contact Shadows (-> contact-shadows-in-unreal-engine)

- Stationary Light Mobility (-> stationary-light-mobility-in-unreal-engine)

- Mesh Distance Fields (-> mesh-distance-fields-in-unreal-engine)
