"""Bake a style mask for a generated mesh, so every prop can share one look whatever texture the generator gave it.

  blender -b --factory-startup --python gen/blender/bake_style.py -- <mesh.fbx|glb> <texDir> <Name>
        [--size 1024] [--samples 16] [--edge 1.0]

Writes <texDir>/T_<Name>_style.png in the mesh's own UVs (linear data, import as TC_Masks, sRGB off):
  R = convex edges and corners (0 flat, 1 sharp edge): edge highlights and wear
  G = occlusion (1 open, 0 deep in a crevice): cavity colour
  B = height (0 at the base, 1 at the top): ground-to-top gradient
M_PBR_Master (v4) reads it as StyleMask and MPC_Style sets how strongly each channel shows, for all props at once
(gen/unreal/materials.ts, `style` command). Run on the prepped FBX (gen/blender/prep.py output): the pivot is at the
base there, so B starts at the ground. --edge scales the edge contrast (dense, bumpy meshes may want 0.6-0.8).
Needs non-overlapping UVs (Tripo's are). Prints STYLE_JSON={...}.
"""
import bpy, sys, os, json, argparse

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
ap = argparse.ArgumentParser(prog="bake_style.py")
ap.add_argument("src"); ap.add_argument("texdir"); ap.add_argument("name")
ap.add_argument("--size", type=int, default=1024)
ap.add_argument("--samples", type=int, default=16)
ap.add_argument("--edge", type=float, default=1.0)
a = ap.parse_args(argv)
src = os.path.abspath(a.src)
out = os.path.join(os.path.abspath(a.texdir), f"T_{a.name}_style.png")
os.makedirs(os.path.dirname(out), exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
ext = os.path.splitext(src)[1].lower()
if ext == ".fbx": bpy.ops.import_scene.fbx(filepath=src)
elif ext in (".glb", ".gltf"): bpy.ops.import_scene.gltf(filepath=src)
else: print(f"unsupported format {ext}"); sys.exit(2)

meshes = [o for o in bpy.context.scene.objects if o.type == "MESH"]
if not meshes: print("no mesh found"); sys.exit(1)
bpy.ops.object.select_all(action="DESELECT")
for o in meshes: o.select_set(True)
bpy.context.view_layer.objects.active = meshes[0]
if len(meshes) > 1: bpy.ops.object.join()
obj = bpy.context.view_layer.objects.active
# World-space geometry with no parent: the height gradient and the occlusion distance are measured in metres.
mw = obj.matrix_world.copy(); obj.parent = None; obj.matrix_world = mw
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
if not obj.data.uv_layers: print("mesh has no UVs"); sys.exit(1)

zs = [v.co.z for v in obj.data.vertices]
xs = [v.co.x for v in obj.data.vertices]; ys = [v.co.y for v in obj.data.vertices]
z0, z1 = min(zs), max(zs)
height = max(z1 - z0, 1e-6)
biggest = max(max(xs) - min(xs), max(ys) - min(ys), height)

# One emission material: R = pointiness ramp, G = ambient occlusion, B = height.
mat = bpy.data.materials.new("StyleBake")
mat.use_nodes = True
nt = mat.node_tree
for n in list(nt.nodes): nt.nodes.remove(n)
N = nt.nodes.new
geo = N("ShaderNodeNewGeometry")
ramp = N("ShaderNodeMapRange")           # pointiness: 0.5 = flat, above = convex
w = 0.07 / max(a.edge, 0.05)
ramp.inputs["From Min"].default_value = 0.5 + 0.012
ramp.inputs["From Max"].default_value = 0.5 + w
ramp.clamp = True
nt.links.new(geo.outputs["Pointiness"], ramp.inputs["Value"])
ao = N("ShaderNodeAmbientOcclusion")
ao.samples = a.samples; ao.only_local = True
ao.inputs["Distance"].default_value = biggest * 0.15
hgt = N("ShaderNodeMapRange")
hgt.inputs["From Min"].default_value = z0; hgt.inputs["From Max"].default_value = z1; hgt.clamp = True
sep = N("ShaderNodeSeparateXYZ")
nt.links.new(geo.outputs["Position"], sep.inputs["Vector"])
nt.links.new(sep.outputs["Z"], hgt.inputs["Value"])
comb = N("ShaderNodeCombineColor")
nt.links.new(ramp.outputs["Result"], comb.inputs["Red"])
nt.links.new(ao.outputs["AO"], comb.inputs["Green"])
nt.links.new(hgt.outputs["Result"], comb.inputs["Blue"])
emit = N("ShaderNodeEmission")
nt.links.new(comb.outputs["Color"], emit.inputs["Color"])
outn = N("ShaderNodeOutputMaterial")
nt.links.new(emit.outputs["Emission"], outn.inputs["Surface"])

img = bpy.data.images.new(f"T_{a.name}_style", a.size, a.size, alpha=False, is_data=True)
img.colorspace_settings.name = "Non-Color"
tex = N("ShaderNodeTexImage"); tex.image = img
nt.nodes.active = tex

obj.data.materials.clear()
obj.data.materials.append(mat)

scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.cycles.device = "CPU"
scene.cycles.samples = a.samples
scene.cycles.use_denoising = False
scene.render.bake.margin = 8
scene.render.bake.use_clear = True
bpy.ops.object.select_all(action="DESELECT")
obj.select_set(True); bpy.context.view_layer.objects.active = obj
bpy.ops.object.bake(type="EMIT")

img.filepath_raw = out; img.file_format = "PNG"; img.save()

# Channel means over the whole image (a rough check: an all-black R means the mesh is too smooth for --edge 1).
px = img.pixels[:]
n = len(px) // 4
means = [round(sum(px[c::4]) / n, 3) for c in range(3)]
print("STYLE_JSON=" + json.dumps({
    "file": out, "size": [a.size, a.size], "height_m": round(height, 3), "blender": bpy.app.version_string,
    "mean": {"edge": means[0], "occlusion": means[1], "height": means[2]},
}))
