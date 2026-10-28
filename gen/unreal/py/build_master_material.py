# Build (or upgrade in place) the kit master material M_PBR_Master, version 3 (v3 adds the UseTintMask switch).
# Run by gen/unreal/materials.ts ensureMaster(); default textures are imported there first and passed in ARGS.
# Rebuilds the graph INSIDE the existing asset (delete_all_material_expressions) because material instances
# reference it: deleting a referenced asset opens a modal dialog that blocks the editor (PIPELINE.md).
#
# Parameters (group: name = default):
#   Textures: BaseColor, Normal, ORM (R=AO, G=Roughness, B=Metallic; TC_Masks, linear), EmissiveTexture
#   Color:    Tint = (1,1,1), Saturation = 1, UseTintMask = false (static switch: tint only where BaseColor alpha = 1;
#             off = whole texture tinted, identical to v2)
#   Surface:  RoughnessScale = 1, RoughnessOffset = 0, MetallicOverride = 0 (lerp to MetallicValue), MetallicValue = 0,
#             NormalStrength = 1, AOStrength = 1
#   Emissive: EmissiveColor = (1,1,1), EmissiveStrength = 0, UseEmissiveTexture = false (static switch)
#   Feedback: FlashAmount (Custom Primitive Data index 0; C++: Mesh->SetCustomPrimitiveDataFloat(0, x)),
#             FlashColor = (1,1,1), FlashStrength = 20
# ARGS: path, tex_basecolor, tex_normal, tex_orm, tex_black, [force=1]. Prints MASTER_JSON={...}.
# No exit()/SystemExit here: run_python would report it as ERROR. Finish through normal control flow.
import json
import unreal

VERSION = "3"
mel = unreal.MaterialEditingLibrary
eal = unreal.EditorAssetLibrary
MP = unreal.MaterialProperty
ST = unreal.MaterialSamplerType


def node(mat, cls, x, y, **props):
    n = mel.create_material_expression(mat, cls, x, y)
    for k, v in props.items():
        n.set_editor_property(k, v)
    return n


def link(a, a_out, b, b_in):
    if not mel.connect_material_expressions(a, a_out, b, b_in):
        raise RuntimeError(f"connect failed: {a.get_name()}.{a_out!r} -> {b.get_name()}.{b_in!r}")


def out(a, a_out, prop):
    if not mel.connect_material_property(a, a_out, prop):
        raise RuntimeError(f"connect to {prop} failed: {a.get_name()}.{a_out!r}")


def clear_graph(mat):
    # delete_all_material_expressions removes only about half the nodes per call in 5.8.4 (tested): repeat until empty.
    while (n := mel.get_num_material_expressions(mat)) > 0:
        mel.delete_all_material_expressions(mat)
        if mel.get_num_material_expressions(mat) >= n:
            raise RuntimeError(f"could not clear the graph of {mat.get_path_name()} ({n} nodes left)")


def build(mat):
    clear_graph(mat)

    def tex_param(name, tex_path, sampler, x, y, group="Textures"):
        return node(mat, unreal.MaterialExpressionTextureSampleParameter2D, x, y, parameter_name=name, group=group,
                    texture=unreal.load_asset(tex_path), sampler_type=sampler)

    def scalar(name, value, x, y, group, **extra):
        return node(mat, unreal.MaterialExpressionScalarParameter, x, y, parameter_name=name, default_value=value,
                    group=group, **extra)

    def vector(name, rgb, x, y, group):
        return node(mat, unreal.MaterialExpressionVectorParameter, x, y, parameter_name=name, group=group,
                    default_value=unreal.LinearColor(rgb[0], rgb[1], rgb[2], 1.0))

    def op(cls, x, y, **props):
        return node(mat, cls, x, y, **props)

    # Base colour: BaseColor.rgb * Tint, then Desaturation(1 - Saturation)
    bc = tex_param("BaseColor", ARGS["tex_basecolor"], ST.SAMPLERTYPE_COLOR, -1400, -600)
    tint = vector("Tint", (1, 1, 1), -1400, -380, "Color")
    bc_mul = op(unreal.MaterialExpressionMultiply, -1100, -560)
    link(bc, "RGB", bc_mul, "A")
    link(tint, "", bc_mul, "B")
    sat = scalar("Saturation", 1.0, -1400, -260, "Color")
    sat_inv = op(unreal.MaterialExpressionOneMinus, -1100, -260)
    link(sat, "", sat_inv, "")
    # v3 tint mask: lerp(BaseColor.rgb, BaseColor.rgb * Tint, BaseColor.a) behind a static switch (off = v2 behaviour).
    tm_lerp = op(unreal.MaterialExpressionLinearInterpolate, -1000, -760)
    link(bc, "RGB", tm_lerp, "A")
    link(bc_mul, "", tm_lerp, "B")
    link(bc, "A", tm_lerp, "Alpha")
    tm_switch = op(unreal.MaterialExpressionStaticSwitchParameter, -900, -640, parameter_name="UseTintMask",
                   group="Color", default_value=False)
    link(tm_lerp, "", tm_switch, "True")
    link(bc_mul, "", tm_switch, "False")
    desat = op(unreal.MaterialExpressionDesaturation, -850, -520)
    link(tm_switch, "", desat, "")
    link(sat_inv, "", desat, "Fraction")
    out(desat, "", MP.MP_BASE_COLOR)

    # Normal: FlattenNormal(Normal, 1 - NormalStrength)
    nrm = tex_param("Normal", ARGS["tex_normal"], ST.SAMPLERTYPE_NORMAL, -1400, -100)
    nstr = scalar("NormalStrength", 1.0, -1400, 120, "Surface")
    nstr_inv = op(unreal.MaterialExpressionOneMinus, -1100, 120)
    link(nstr, "", nstr_inv, "")
    flatten = op(unreal.MaterialExpressionMaterialFunctionCall, -850, -60)
    flatten.set_material_function(unreal.load_asset("/Engine/Functions/Engine_MaterialFunctions01/Texturing/FlattenNormal"))
    link(nrm, "RGB", flatten, "Normal")
    link(nstr_inv, "", flatten, "Flatness")
    out(flatten, "", MP.MP_NORMAL)

    # ORM: AO = lerp(1, R, AOStrength); Roughness = saturate(G * Scale + Offset); Metallic = lerp(B, Value, Override)
    orm = tex_param("ORM", ARGS["tex_orm"], ST.SAMPLERTYPE_MASKS, -1400, 300)
    ao_str = scalar("AOStrength", 1.0, -1100, 520, "Surface")
    ao = op(unreal.MaterialExpressionLinearInterpolate, -850, 300, const_a=1.0)
    link(orm, "R", ao, "B")
    link(ao_str, "", ao, "Alpha")
    out(ao, "", MP.MP_AMBIENT_OCCLUSION)

    r_scale = scalar("RoughnessScale", 1.0, -1100, 640, "Surface")
    r_off = scalar("RoughnessOffset", 0.0, -1100, 740, "Surface")
    r_mul = op(unreal.MaterialExpressionMultiply, -850, 600)
    link(orm, "G", r_mul, "A")
    link(r_scale, "", r_mul, "B")
    r_add = op(unreal.MaterialExpressionAdd, -650, 620)
    link(r_mul, "", r_add, "A")
    link(r_off, "", r_add, "B")
    r_sat = op(unreal.MaterialExpressionSaturate, -450, 620)
    link(r_add, "", r_sat, "")
    out(r_sat, "", MP.MP_ROUGHNESS)

    m_val = scalar("MetallicValue", 0.0, -1100, 880, "Surface")
    m_ovr = scalar("MetallicOverride", 0.0, -1100, 980, "Surface")
    metal = op(unreal.MaterialExpressionLinearInterpolate, -650, 860)
    link(orm, "B", metal, "A")
    link(m_val, "", metal, "B")
    link(m_ovr, "", metal, "Alpha")
    out(metal, "", MP.MP_METALLIC)

    # Emissive: EmissiveColor * EmissiveStrength [* EmissiveTexture] + FlashColor * FlashAmount(CPD 0) * FlashStrength
    e_col = vector("EmissiveColor", (1, 1, 1), -1400, 1200, "Emissive")
    e_str = scalar("EmissiveStrength", 0.0, -1400, 1420, "Emissive")
    e_mul = op(unreal.MaterialExpressionMultiply, -1100, 1250)
    link(e_col, "", e_mul, "A")
    link(e_str, "", e_mul, "B")
    e_tex = tex_param("EmissiveTexture", ARGS["tex_black"], ST.SAMPLERTYPE_COLOR, -1400, 1540, group="Emissive")
    e_tex_mul = op(unreal.MaterialExpressionMultiply, -850, 1400)
    link(e_mul, "", e_tex_mul, "A")
    link(e_tex, "RGB", e_tex_mul, "B")
    e_switch = op(unreal.MaterialExpressionStaticSwitchParameter, -600, 1300, parameter_name="UseEmissiveTexture",
                  group="Emissive", default_value=False)
    link(e_tex_mul, "", e_switch, "True")
    link(e_mul, "", e_switch, "False")

    f_amt = scalar("FlashAmount", 0.0, -1400, 1800, "Feedback", use_custom_primitive_data=True, primitive_data_index=0)
    f_col = vector("FlashColor", (1, 1, 1), -1400, 1920, "Feedback")
    f_str = scalar("FlashStrength", 20.0, -1400, 2140, "Feedback")
    f_mul1 = op(unreal.MaterialExpressionMultiply, -1100, 1850)
    link(f_col, "", f_mul1, "A")
    link(f_amt, "", f_mul1, "B")
    f_mul2 = op(unreal.MaterialExpressionMultiply, -850, 1900)
    link(f_mul1, "", f_mul2, "A")
    link(f_str, "", f_mul2, "B")
    e_add = op(unreal.MaterialExpressionAdd, -350, 1500)
    link(e_switch, "", e_add, "A")
    link(f_mul2, "", e_add, "B")
    out(e_add, "", MP.MP_EMISSIVE_COLOR)

    # Usage flags up front (a missing flag shows the default material in a packaged build).
    for usage in (unreal.MaterialUsage.MATUSAGE_NANITE, unreal.MaterialUsage.MATUSAGE_SKELETAL_MESH,
                  unreal.MaterialUsage.MATUSAGE_INSTANCED_STATIC_MESHES):
        mel.set_material_usage(mat, usage)

    # recompile_material returns nothing (no error list): a broken graph shows up as the default material, so
    # check the result renders (shot) after a change.
    mel.recompile_material(mat)
    eal.set_metadata_tag(mat, "MegajamMasterVersion", VERSION)
    eal.save_loaded_asset(mat)
    return {"expressions": mel.get_num_material_expressions(mat)}


path = ARGS["path"]
material = unreal.load_asset(path)
if material is None:
    folder, asset_name = path.rsplit("/", 1)
    material = unreal.AssetToolsHelpers.get_asset_tools().create_asset(asset_name, folder, unreal.Material, unreal.MaterialFactoryNew())

if eal.get_metadata_tag(material, "MegajamMasterVersion") == VERSION and ARGS.get("force") != "1":
    print("MASTER_JSON=" + json.dumps({"path": path, "version": VERSION, "rebuilt": False}))
else:
    print("MASTER_JSON=" + json.dumps({"path": path, "version": VERSION, "rebuilt": True, **build(material)}))
