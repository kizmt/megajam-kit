# Procedural environment assets: Blender 5.2 Python -> UE 5.8

Read this before generating architecture or simple props with code (walls, floors, arches, doorways, stairs,
pillars, crates, simple buildings). Generated during the jam, these are the game's own art and are scored; Fab kits
are sourced and are not (`CLAUDE.md` compliance). Write the generators **during the jam** from this recipe; the kit
holds knowledge, not generators for specific content.

**Status:** tested end to end. Blender 5.2.2 LTS headless (API probe; an arched wall smoke test) and a prototype that
generated crates and shelves with a baked timber texture (5 meshes + texture set in ~7 s), imported them into UE
5.8.4 through Interchange and replaced 27 placeholders. Its corrections are folded in below.

## 1. Kit design

- **Grid:** 100 cm snap, 400 cm module. Floors 400x400; walls 400 W x 300 H x 20 D; half walls 200 W; doorways
  ~120x220 to 200x300; pillars 50x50x300. Stairs rise exactly floor to floor (300 cm = 15 steps of 20 cm rise x 30 cm
  tread). Every tiling dimension is a whole or half module.
- **Pivot at a corner** (bottom-back-left of the footprint at the origin), the same for every piece, transforms
  applied before export. Centred pivots cause half-module offsets (Epic's FBX static mesh pipeline: pivot at 0,0,0,
  ideally at a corner).
- **No randomness on joining edges.** Keep exact dimensions where pieces meet; jitter only inside a 2-5 cm inset.
- **Walls 20 cm thick or more** (never under 10): Lumen leaks light through thin geometry. Keep walls, floors and
  ceilings **separate meshes**: merged buildings get poor distance fields and surface-cache coverage. A "building" is
  an assembly of kit pieces (Level Instance or Packed Level Actor), not one mesh.
- **Ornament grows outward** from the gameplay plane, never into walkable space.

## 2. Generating with bmesh (no operators, no booleans)

- **Profile, then extrude once.** Write the piece's outline as a 2D polygon (for a wall with a doorway or arch that
  reaches the floor: go round the opening, arc vertices included), `bm.faces.new(...)`, `extrude_face_region`,
  translate the new verts by the thickness. One watertight mesh, no internal faces (tested on 5.2.2: a 400x300x20 arch
  wall, 132 tris). Don't assemble a piece from touching boxes: the shared faces stay inside the mesh and shade badly
  (seen in the same test). Plain blocks (crates, pillars, steps): `bmesh.ops.create_cube` + `scale` / `translate`.
  Windows (holes that don't reach an edge): build the frame as the outline plus an inner loop and bridge them
  (`bridge_loops`), or split the wall into an outline that wraps the hole. Avoid booleans headless (n-gons, bad
  normals).
- **Silhouette:** `bmesh.ops.bevel(bm, geom=edges, offset=0.015-0.03 (m), segments=1-2, affect='EDGES', profile=0.5,
  clamp_overlap=True)` on outer convex edges only, never on faces that touch another piece. Leave `harden_normals`
  off: its custom normals streak flat faces once more geometry is added (seen on a prototype). **The bevel replaces
  the faces it touches**, so anything written to faces collected earlier (UVs, materials) is lost: bevel first, then
  collect faces. (5.2 signature: `bevel(bmesh, geom, offset, offset_type, profile_type, segments, profile, affect,
  clamp_overlap, material, loop_slide, mark_seam, mark_sharp, harden_normals, face_strength_mode, miter_outer,
  miter_inner, spread, custom_profile, vmesh_method)`; `affect` defaults to 'VERTICES', so set it.)
- **Panels and bricks:** `inset_region` / `inset_individual` (~5 cm) then `extrude_face_region` + translate (-2 cm).
  Bricks and planks: `bisect_plane` slices plus a seeded per-face extrude.
- **Cheap wear:** a corner colour attribute (`mesh.color_attributes.new("Wear", 'BYTE_COLOR', 'CORNER')`): white on
  bevelled convex loops, black on flat areas, times seeded noise. In UE, lerp an edge-wear layer by
  `VertexColor.R` (Nanite supports vertex colour). Optional: G = dirt, B = tint mask. **Only if the material reads
  vertex colour:** the kit's `M_PBR_Master` (v3) doesn't, so without a material change this step does nothing.
- **Variants:** `rng = random.Random(f"{piece}_{seed}")` per piece, never the global `random`. Put the seed in the
  name (`SM_Wall_400x300_v03`).
- **Before writing:** `remove_doubles(dist=0.0001)`, `recalc_face_normals`, `dissolve_degenerate`; optionally
  `triangulate` so Blender and UE agree. Then `bm.to_mesh(me); bm.free(); me.update()`.

## 3. UVs and materials

- **Default today: box-projected UV0.** `M_PBR_Master` has no world-aligned option yet (`materials.md`, item 10;
  a master upgrade is planned), so architecture needs real UVs: per face, project on the dominant normal axis at
  world position / tile size (e.g. 100-200 cm per tile; ~512 px/m texel density, 1024 for close cameras). Simple in
  bmesh, gives correct tangents and consistent density across pieces.
- **Once the master gains a world-aligned option, prefer it for architecture** (`WorldAlignedTexture` /
  `WorldAlignedNormal`, `TextureSize` in world units): identical texel density and no seams across pieces, and keep
  the box-projected UV0 as the fallback. World-aligned textures swim on moving objects: moving props (crates that get
  knocked) always use real UVs.
- **Writing UV0:** `bpy.ops.uv.smart_project` needs Edit Mode and an active object headless: avoid it.
  Order: build, transform, bevel, **then** collect `bm.faces`, call `f.normal_update()` (transforms leave normals
  stale) and write UVs. **Call `bm.normal_update()` before `bmesh.ops.triangulate`** (and any op that projects faces):
  faces made with `bm.faces.new` have no normal until then, and concave n-gons wrapped round door and window openings
  were triangulated across the holes (428 covered openings on 35 meshes; 0 after the fix). Check walls with openings
  by ray-casting through each opening's centre on the finished mesh, not by eye. Check that the largest faces have a
  UV extent above 0; a zero extent renders as flat colour.
- **Proud trim needs its own UVs or material.** With one shared projection (box-projected or world-aligned), piers,
  jambs and frames standing out from a wall line up with the wall's blocks and read as see-through, especially
  without contact shading (no SSAO/DFAO). Give trim a different scale and offset, or a different (slightly darker)
  material instance.
- **No lightmap UVs** with dynamic lighting (Lumen or not): turn off Generate Lightmap UVs. It matters for custom
  data too: the import writes its generated lightmap UVs into UV1 and overwrites the FBX's own UV1 (a fade stored there
  vanished; proven by re-importing with it off). Script it with `StaticMeshEditorSubsystem.get_lod_build_settings(mesh,
  0)`, `generate_lightmap_u_vs = False`, `set_lod_build_settings(mesh, 0, bs)`, then re-import.
- **Linear 0-1 data (fades, masks) goes in a UV channel, not vertex colour.** The same fade as vertex-colour bytes
  arrived darker (0.5 read as ~0.2), as if decoded as sRGB (suspected, not proven).
- **Materials:** in Blender, only name slots, exactly as the UE material instances (`MI_Stone`, `MI_Trim`), in a
  fixed order per piece type. Build the look in UE (master material, `materials.md`).
- **Baking a tileable texture set in Blender is cheap** (Cycles CPU, 8 samples, 1024 px, 4D noise on a torus for
  seamless tiling: a set plus five meshes took ~7 s). Use it for any material that has no texture yet. Two checks:
  Blender tangent normals are OpenGL, so set `flip_green_channel = True` on the UE normal texture; and compare the
  base colour's mean against the style-lock albedo (correct with the material's Tint).

## 4. Normals and smoothing (Blender 4.1+ / 5.2)

- `use_auto_smooth`, `auto_smooth_angle` and `calc_normals_split()` are gone (AttributeError). Meshes behave like
  the old auto smooth at 180 degrees; sharpness lives in the `sharp_edge` / `sharp_face` attributes.
- Headless: `me.shade_smooth()` then `me.set_sharp_from_angle(angle=math.radians(30))` (both exist in 5.2), or mark
  `edge.smooth = False` in bmesh on 90-degree edges. For hard-surface pieces with 45-degree bevels, `me.shade_flat()`
  is simplest (every edge is hard anyway); for smooth bevels use a Weighted Normal modifier, not `harden_normals`.
- Export with `mesh_smooth_type='FACE'`: the default `'OFF'` writes normals only and UE then warns "no smoothing
  groups". In UE keep imported normals and MikkTSpace tangents.

## 5. Collision

- One FBX per piece, collision hulls in the same file: `UCX_<RenderMeshName>_00`, `_01`... closed, convex, not
  intersecting (`UBX_` for boxes). Epic: with several meshes per file only the first mesh's custom collision imports.
- Wall: one box. Doorway: 3 boxes (jambs + lintel). Stairs: one sloped convex ramp (smoother movement than per-step
  boxes). Arch: two boxes plus a few stepped along the curve.
- Set names explicitly after creation: Blender's `.001` suffixes break the UCX match.
- Alternative: no UCX; add simple collision after import (below). Long or curved pieces without UCX hulls use
  complex-as-simple instead of one auto hull (`physics.md`); with Nanite, complex collision uses the fallback mesh.
- UCX hulls survive only a fresh import: a reimport over the asset keeps its old collision (`editor-scripting.md` A,
  "Reimports keep the old asset's settings").

## 6. Export (verified option names and defaults in 5.2.2)

```python
bpy.ops.export_scene.fbx(filepath=out, use_selection=True, object_types={'MESH'},
    apply_scale_options='FBX_SCALE_NONE',   # 5.2 default; the other modes import at the wrong scale (PIPELINE.md)
    axis_forward='-Z', axis_up='Y',          # defaults
    mesh_smooth_type='FACE', use_tspace=True, use_triangles=True, use_mesh_modifiers=True,
    add_leaf_bones=False, bake_anim=False, colors_type='SRGB')
```

- 5.2 defaults to note: `mesh_smooth_type='OFF'`, `use_tspace=False`, `use_triangles=False`, `add_leaf_bones=True`,
  `bake_anim=True`, `object_types` = everything: set all of them explicitly.
- Select and activate exactly the piece and its UCX hulls before exporting (`view_layer.objects.active = ob`,
  `ob.select_set(True)`).
- **As UE 5.8 sees it** (tested): sizes exact (0.7 m arrives as 70 cm), Z up, no rotation, the Blender object origin
  becomes the pivot, and **Blender +Y lands on UE -Y** (a crate built from (0,0,0) into +X +Y spans UE y -72..2).
  Place pieces from the imported mesh's `get_bounding_box()`, not from assumed extents.

## 7. Import into UE 5.8

- **5.8.4 imports FBX (and PNG) through Interchange** (tested): `Interchange.FeatureFlags.Import.FBX` is True, the log
  says `Translation (FBXSDK)`, and `asset.get_editor_property('asset_import_data').get_class().get_name()` is
  `InterchangeAssetImportData`. `destination_name` is ignored: assets take the FBX mesh name or the PNG file name, so
  name them right in Blender. Pipeline properties if needed: `build_nanite`,
  `import_collision_according_to_mesh_name`, `combine_static_meshes_behavior`, `generate_lightmap_u_vs`.
- Import with `AssetImportTask` (`automated=True`, `replace_existing=True`), then a **post-import pass on every new
  StaticMesh**:
  - Nanite on (`nanite_settings.enabled`).
  - **Collision:** check `mesh.get_editor_property('body_setup').get_editor_property('agg_geom')` for `convex_elems`
    and `box_elems` before adding any. `StaticMeshEditorSubsystem.get_simple_collision_count` ignores convex hulls
    and reports 0 even when the UCX imported, so trusting it adds a duplicate box. Only with no hull at all:
    `add_simple_collisions`.
  - **Materials:** Interchange creates a material asset per slot name **in the mesh's folder**. Assign the real
    material instance by slot name, then delete the extra non-mesh assets listed in the task's
    `imported_object_paths`. Keep material instances in a different folder from imported meshes so names can't
    collide.
  - Assert every `load_asset` (`editor-scripting.md`): a grey checker that survives a recapture is a missing parent
    or texture, not shader compilation.
  - Save with `only_if_is_dirty=False` and check `git status` (`editor-scripting.md`).
- Nanite on for all opaque/masked architecture; glass and other translucent parts go in a separate non-Nanite mesh.
- LOD group "Level Architecture" for walls and floors.

## 8. Blender 5.x changes that break older snippets (checked on 5.2.2)

- Auto smooth removed (above). `MeshLoop.normal` is read-only; read `mesh.corner_normals`.
- Principled BSDF inputs renamed (4.0): `Subsurface Weight`, `Specular IOR Level`, `Transmission Weight`,
  `Coat Weight`, `Sheen Weight`, `Emission Color`; `Specular Tint` is a colour. Find nodes by `node.type`
  (`'BSDF_PRINCIPLED'`) and sockets by name, never by index.
- `material.use_nodes` / `world.use_nodes` are deprecated (removed in 6.0): materials always have a node tree.
- Node group sockets: `node_tree.interface.new_socket(name, in_out='INPUT', socket_type=...)` (no `.inputs.new`).
- Armature layers are bone collections: `armature.collections`.
- Geometry Nodes modifier inputs (5.2): `mod.properties.inputs.<identifier>.value`, not `mod["Socket_2"]`.
- Context override dicts are gone: `with bpy.context.temp_override(...): bpy.ops...`.
- Add-on properties: attribute access (`scene.cycles`), not `scene["cycles"]`.
- OBJ/STL/PLY live under `bpy.ops.wm.*`; Collada export is removed. Python is 3.13 (rebuild compiled wheels).
- Bake: Cycles only, with an active Image Texture node per material; `gpu.init()` exists for background GPU use.
- Log `bpy.app.version_string` in every script's output; pass FBX/glTF kwargs only from
  `bpy.ops.export_scene.fbx.get_rna_type().properties.keys()` (an unknown kwarg raises TypeError).

## 9. Pitfalls

- Headless has no window or 3D view: prefer bmesh and data API over operators.
- Apply scale and rotation before export (all objects scale 1): distance-field resolution depends on scale.
- Coincident bevels make zero-area faces: `clamp_overlap=True` + `dissolve_degenerate`.
- Irregular meshes (arches, curved stairs) can show Lumen surface-cache gaps: raise Max Lumen Mesh Cards above 12 or
  split the mesh.
- Check every new piece in UE from the gameplay camera next to its neighbours: seams, scale, light leaks.

## Sources

- Blender 5.2 manual, FBX: https://docs.blender.org/manual/en/latest/files/import_export/fbx.html
- Blender release notes (Python API, 4.0 to 5.2): https://developer.blender.org/docs/release_notes/ (4.1 modeling:
  .../4.1/modeling/; 5.0 python_api; 5.2 python_api)
- Epic, FBX Static Mesh Pipeline: https://dev.epicgames.com/documentation/en-us/unreal-engine/fbx-static-mesh-pipeline-in-unreal-engine
- Epic, Lumen Technical Details: https://dev.epicgames.com/documentation/en-us/unreal-engine/lumen-technical-details-in-unreal-engine
- Epic, Nanite: https://dev.epicgames.com/documentation/en-us/unreal-engine/nanite-virtualized-geometry-in-unreal-engine
- Epic, Texturing material functions: https://dev.epicgames.com/documentation/en-us/unreal-engine/texturing-material-functions-in-unreal-engine
- Epic, Interchange import reference: https://dev.epicgames.com/documentation/en-us/unreal-engine/interchange-import-reference-in-unreal-engine
