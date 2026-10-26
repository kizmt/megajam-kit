# Procedural environment assets: Blender 5.2 Python -> UE 5.8

Read this before generating architecture or simple props with code (walls, floors, arches, doorways, stairs,
pillars, crates, simple buildings). Generated during the jam, these are the game's own art and are scored; Fab kits
are sourced and are not (`CLAUDE.md` compliance). Write the generators **during the jam** from this recipe; the kit
holds knowledge, not generators for specific content.

**Status:** Blender side tested on Blender 5.2.2 LTS (headless): API facts probed, and a smoke test generated an
arched wall with bevels, wear colours, box UV0 and three `UCX_` hulls, exported it with the settings in section 6 and
passed `gen/blender/inspect.py` (4.0 x 0.2 x 3.0 m, pivot at the corner). The Unreal import side is not yet tested:
confirm it on first use (see Import).

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
- **Silhouette:** `bmesh.ops.bevel(bm, geom=edges, offset=0.015-0.03 (m), segments=1-2, affect='EDGES',
  profile=0.5, clamp_overlap=True, harden_normals=True)` on outer convex edges only, never on faces that touch
  another piece. (5.2 signature: `bevel(bmesh, geom, offset, offset_type, profile_type, segments, profile, affect,
  clamp_overlap, material, loop_slide, mark_seam, mark_sharp, harden_normals, face_strength_mode, miter_outer,
  miter_inner, spread, custom_profile, vmesh_method)`; `affect` defaults to 'VERTICES', so set it.)
- **Panels and bricks:** `inset_region` / `inset_individual` (~5 cm) then `extrude_face_region` + translate (-2 cm).
  Bricks and planks: `bisect_plane` slices plus a seeded per-face extrude.
- **Cheap wear:** a corner colour attribute (`mesh.color_attributes.new("Wear", 'BYTE_COLOR', 'CORNER')`): white on
  bevelled convex loops, black on flat areas, times seeded noise. In UE, lerp an edge-wear layer by
  `VertexColor.R` (Nanite supports vertex colour). Optional: G = dirt, B = tint mask.
- **Variants:** `rng = random.Random(f"{piece}_{seed}")` per piece, never the global `random`. Put the seed in the
  name (`SM_Wall_400x300_v03`).
- **Before writing:** `remove_doubles(dist=0.0001)`, `recalc_face_normals`, `dissolve_degenerate`; optionally
  `triangulate` so Blender and UE agree. Then `bm.to_mesh(me); bm.free(); me.update()`.

## 3. UVs and materials

- **Architecture: skip UV work.** Use world-aligned materials in UE (`WorldAlignedTexture` / `WorldAlignedNormal`,
  `TextureSize` in world units): identical texel density and no seams across pieces. Target ~512 px/m (1024 for
  close cameras). World-aligned textures swim on moving objects: give moving props (crates that get knocked) real
  UVs or `LocalAlignedTexture`.
- **Still write a sane UV0:** per face, project on the dominant normal axis at world position / 100 cm. Simple in
  bmesh, gives correct tangents. `bpy.ops.uv.smart_project` needs Edit Mode and an active object headless: avoid.
- **No lightmap UVs** with dynamic lighting (Lumen or not): turn off Generate Lightmap UVs (`worldbuilding.md`).
- **Materials:** in Blender, only name slots, exactly as the UE material instances (`MI_Stone`, `MI_Trim`), in a
  fixed order per piece type. Build the look in UE (master material, `materials.md`). Bake in Blender only for a hero
  piece; not worth it in a jam.

## 4. Normals and smoothing (Blender 4.1+ / 5.2)

- `use_auto_smooth`, `auto_smooth_angle` and `calc_normals_split()` are gone (AttributeError). Meshes behave like
  the old auto smooth at 180 degrees; sharpness lives in the `sharp_edge` / `sharp_face` attributes.
- Headless: `me.shade_smooth()` then `me.set_sharp_from_angle(angle=math.radians(30))` (both exist in 5.2), or mark
  `edge.smooth = False` in bmesh on 90-degree edges. Bevel with `harden_normals=True` for clean bevel shading.
- Export with `mesh_smooth_type='FACE'`: the default `'OFF'` writes normals only and UE then warns "no smoothing
  groups". In UE keep imported normals and MikkTSpace tangents.

## 5. Collision

- One FBX per piece, collision hulls in the same file: `UCX_<RenderMeshName>_00`, `_01`... closed, convex, not
  intersecting (`UBX_` for boxes). Epic: with several meshes per file only the first mesh's custom collision imports.
- Wall: one box. Doorway: 3 boxes (jambs + lintel). Stairs: one sloped convex ramp (smoother movement than per-step
  boxes). Arch: two boxes plus a few stepped along the curve.
- Set names explicitly after creation: Blender's `.001` suffixes break the UCX match.
- Alternative: no UCX; add simple collision after import (below). Prefer simple collision for player movement; with
  Nanite, complex collision uses the fallback mesh.

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
  `ob.select_set(True)`). Check one piece faces +X in UE.

## 7. Import into UE 5.8

- Import with `AssetImportTask` (`automated=True`, `replace_existing=True`), then a **post-import pass on every new
  StaticMesh** whatever importer ran: Nanite on (`nanite_settings.enabled`), simple box collision if no UCX
  (`StaticMeshEditorSubsystem.add_simple_collisions`), material instances by slot name, then save with
  `only_if_is_dirty=False` and check `git status` (`editor-scripting.md`).
- **Unverified:** whether 5.8 imports FBX through Interchange or the legacy importer by default (Epic's Interchange
  page still calls Interchange FBX experimental). Check the first import's log; the post-import pass makes the result
  the same either way. Interchange pipeline properties if needed: `build_nanite`, `import_collision_according_to_mesh_name`,
  `combine_static_meshes_behavior`, `generate_lightmap_u_vs`.
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
