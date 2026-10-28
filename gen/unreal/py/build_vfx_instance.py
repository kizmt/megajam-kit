# Create or update a material instance of M_VFX_Master from a JSON spec (gen/vfx/vfx.ts instance).
# ARGS: path (/Game/.../MI_VFX_<Name>), parent (master path), spec (JSON):
#   {"additive": true, "switches": {"SteppedAlpha": true}, "scalars": {"EmissiveStrength": 12},
#    "vectors": {"Tint": [1, 0.4, 0.1, 1]}, "textures": {"MaskTexture": "/Game/Kit/VFX/Textures/T_VFX_Spark"}}
# "additive" sets both the Blend Mode override (Additive) and the IsAdditive switch. An existing instance is updated
# in place (never deleted: emitters reference it). Prints VFXMI_JSON={...}.
import json
import unreal

mel = unreal.MaterialEditingLibrary
eal = unreal.EditorAssetLibrary

path = ARGS["path"]
spec = json.loads(ARGS.get("spec", "{}"))
parent = unreal.load_asset(ARGS["parent"])
if parent is None:
    raise RuntimeError(f"parent material not found: {ARGS['parent']} (run: node gen/vfx/vfx.ts master)")

mi = unreal.load_asset(path)
created = mi is None
if created:
    folder, name = path.rsplit("/", 1)
    mi = unreal.AssetToolsHelpers.get_asset_tools().create_asset(name, folder, unreal.MaterialInstanceConstant,
                                                                 unreal.MaterialInstanceConstantFactoryNew())
mel.set_material_instance_parent(mi, parent)

switches = dict(spec.get("switches", {}))
# Blend mode only when the spec names it, so an update of other values keeps an additive instance additive.
additive = None
if "additive" in spec or created:
    additive = bool(spec.get("additive", False))
    overrides = mi.get_editor_property("base_property_overrides")
    overrides.set_editor_property("override_blend_mode", additive)
    overrides.set_editor_property("blend_mode", unreal.BlendMode.BLEND_ADDITIVE if additive else unreal.BlendMode.BLEND_TRANSLUCENT)
    mi.set_editor_property("base_property_overrides", overrides)
    switches["IsAdditive"] = additive

# The set_material_instance_*_parameter_value setters return False whether or not they applied the value (5.8.4,
# tested on all four; docs/ue/materials.md "Read back, don't trust the bool"). So: check the name against the
# master's parameter list, set, then read the value back.
def names(getter):
    return {str(n) for n in getter(parent)}


def apply(kind, known, spec_values, convert, setter, getter, same):
    for k, v in spec_values.items():
        if k not in known:
            raise RuntimeError(f"no {kind} parameter {k!r} on the master (has: {', '.join(sorted(known))})")
        want = convert(v)
        setter(mi, k, want)
        if not same(getter(mi, k), want):
            raise RuntimeError(f"{kind} parameter {k!r} did not take the value {v!r}")


def color(v):
    c = [float(x) for x in v] + [1.0] * (4 - len(v))
    return unreal.LinearColor(*c[:4])


def texture(v):
    t = unreal.load_asset(v)
    if t is None:
        raise RuntimeError(f"texture not found: {v}")
    return t


close = lambda a, b: abs(a - b) < 1e-4
apply("static switch", names(mel.get_static_switch_parameter_names), switches, bool,
      mel.set_material_instance_static_switch_parameter_value, mel.get_material_instance_static_switch_parameter_value,
      lambda a, b: a == b)
apply("scalar", names(mel.get_scalar_parameter_names), spec.get("scalars", {}), float,
      mel.set_material_instance_scalar_parameter_value, mel.get_material_instance_scalar_parameter_value, close)
apply("vector", names(mel.get_vector_parameter_names), spec.get("vectors", {}), color,
      mel.set_material_instance_vector_parameter_value, mel.get_material_instance_vector_parameter_value,
      lambda a, b: all(close(getattr(a, c), getattr(b, c)) for c in "rgba"))
apply("texture", names(mel.get_texture_parameter_names), spec.get("textures", {}), texture,
      mel.set_material_instance_texture_parameter_value, mel.get_material_instance_texture_parameter_value,
      lambda a, b: a is not None and a.get_path_name() == b.get_path_name())

mel.update_material_instance(mi)
eal.save_loaded_asset(mi)
print("VFXMI_JSON=" + json.dumps({"path": path, "created": created, "additive": additive}))
