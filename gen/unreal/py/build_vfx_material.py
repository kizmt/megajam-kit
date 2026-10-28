# Build (or upgrade in place) the kit master VFX material M_VFX_Master. Run by gen/vfx/vfx.ts (master); the default
# textures are imported there first and passed in ARGS. Rebuilt INSIDE the existing asset because instances
# reference it (deleting a referenced asset opens a blocking modal dialog).
#
# One unlit, two-sided, translucent material for Niagara sprites, ribbons and mesh particles; instances pick the look
# (gen/vfx/vfx.ts instance). Parameters (group: name = default):
#   Textures:  MaskTexture (shape, Clamp), NoiseTexture (tileable, Wrap), FlipbookTexture (SubUV sheet); linear masks,
#              R channel
#   Noise:     NoiseTiling = 1, NoisePanU = 0, NoisePanV = 0.1 (UV/s), DistortionStrength = 0 (noise warps the mask UVs;
#              ~0.05-0.15 for heat, flames, magic)
#   Dissolve:  Erosion = 0 (0 whole .. 1 gone), ErosionSoftness = 0.15 (edge width),
#              ErosionFromAlpha = false (static switch: particle colour alpha drives the dissolve instead of fading
#              opacity: alpha 1 = whole, 0 = fully eaten. Use it with Lightweight emitters, which have no Dynamic
#              Parameter module, and whenever "dissolve over life" should come from the colour curve)
#   Colour:    Tint = (1,1,1), EmissiveStrength = 5, Opacity = 1, DepthFadeDistance = 30 (cm, soft contact with
#              geometry), SteppedAlpha = false (static switch: hard toon edge at StepThreshold = 0.5)
#   Flipbook:  UseFlipbook = false (static switch: mask from FlipbookTexture through the particle SubUV; set the
#              renderer's Sub Image Size to the sheet's grid and add a SubUV Animation module; no distortion),
#              FlipbookColor = false (static switch, with UseFlipbook: a colour sheet in FlipbookColorTexture, e.g. a
#              Baker bake prepared with `vfx.ts flipbook`; alpha = shape, RGB x particle colour x Tint = colour)
#   Mesh:      EdgeFade = 0 (0..1: fade the silhouette where a mesh particle turns edge-on; ~1 for swirls, shields,
#              shockwave meshes), EdgeFadeExponent = 2 (higher = only the outermost edge fades)
#   Blend:     IsAdditive = false (static switch). Additive instances also override Blend Mode to Additive (vfx.ts
#              instance does both): additive ignores opacity, so the colour is multiplied by alpha instead.
# Per particle: Particle Color = colour and alpha. Dynamic Parameter index 0 (Niagara "Dynamic Material Parameters"
# module): x = extra erosion, y = emissive multiplier, z = distortion multiplier, w unused. Defaults (0, 1, 1, 0) when
# the emitter has no such module. Adding the module writes 0 to all four by default (y = 0 hides the particles):
# set Index 0 to (0, 1, 1, 0) first. A wrong index or channel is silently ignored by Niagara: check it renders.
# Scripted links from a Dynamic Parameter use channel letters R/G/B/A; its pin names (Param1..4) fail to connect.
# ARGS: path, tex_mask, tex_noise, [force=1]. Prints VFXMASTER_JSON={...}.
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
    mat.set_editor_property("material_domain", unreal.MaterialDomain.MD_SURFACE)
    mat.set_editor_property("blend_mode", unreal.BlendMode.BLEND_TRANSLUCENT)
    mat.set_editor_property("shading_model", unreal.MaterialShadingModel.MSM_UNLIT)
    mat.set_editor_property("two_sided", True)

    def scalar(name, value, x, y, group):
        return node(mat, unreal.MaterialExpressionScalarParameter, x, y, parameter_name=name, default_value=value, group=group)

    def switch(name, x, y, group, on_true, on_false, true_out="", false_out=""):
        s = node(mat, unreal.MaterialExpressionStaticSwitchParameter, x, y, parameter_name=name, group=group,
                 default_value=False)
        link(on_true, true_out, s, "True")
        link(on_false, false_out, s, "False")
        return s

    def op(cls, x, y, **props):
        return node(mat, cls, x, y, **props)

    def mul(a, b, x, y, a_out="", b_out=""):
        m = op(unreal.MaterialExpressionMultiply, x, y)
        link(a, a_out, m, "A")
        link(b, b_out, m, "B")
        return m

    def tex(name, path, x, y):
        return node(mat, unreal.MaterialExpressionTextureSampleParameter2D, x, y, parameter_name=name, group="Textures",
                    texture=unreal.load_asset(path), sampler_type=ST.SAMPLERTYPE_MASKS)

    dyn = op(unreal.MaterialExpressionDynamicParameter, -2400, 900)
    dyn.set_editor_property("default_value", unreal.LinearColor(0.0, 1.0, 1.0, 0.0))
    pc = op(unreal.MaterialExpressionParticleColor, -2400, 600)
    uv = op(unreal.MaterialExpressionTextureCoordinate, -2400, -400)

    # Noise UV = TexCoord * NoiseTiling + Time * (NoisePanU, NoisePanV)
    tiling = scalar("NoiseTiling", 1.0, -2400, -300, "Noise")
    uv_t = mul(uv, tiling, -2150, -380)
    pan_u = scalar("NoisePanU", 0.0, -2400, -180, "Noise")
    pan_v = scalar("NoisePanV", 0.1, -2400, -80, "Noise")
    pan = op(unreal.MaterialExpressionAppendVector, -2150, -160)
    link(pan_u, "", pan, "A")
    link(pan_v, "", pan, "B")
    time = op(unreal.MaterialExpressionTime, -2150, -40)
    pan_t = mul(pan, time, -1950, -140)
    nuv = op(unreal.MaterialExpressionAdd, -1750, -300)
    link(uv_t, "", nuv, "A")
    link(pan_t, "", nuv, "B")
    noise = tex("NoiseTexture", ARGS["tex_noise"], -1550, -320)
    link(nuv, "", noise, "UVs")

    # Mask UV = TexCoord + (noise - 0.5) * DistortionStrength * dyn.z
    dist = scalar("DistortionStrength", 0.0, -1550, -60, "Noise")
    centred = op(unreal.MaterialExpressionSubtract, -1250, -280, const_b=0.5)
    link(noise, "R", centred, "A")
    d1 = mul(centred, dist, -1050, -220)
    d2 = mul(d1, dyn, -850, -200, b_out="B")
    muv = op(unreal.MaterialExpressionAdd, -650, -380)
    link(uv, "", muv, "A")
    link(d2, "", muv, "B")
    mask = tex("MaskTexture", ARGS["tex_mask"], -450, -460)
    link(muv, "", mask, "UVs")
    # Flipbook: the SubUV sample uses the particle's sub-image index (renderer Sub Image Size + SubUV Animation module).
    fb = node(mat, unreal.MaterialExpressionTextureSampleParameterSubUV, -450, -220, parameter_name="FlipbookTexture",
              group="Textures", texture=unreal.load_asset(ARGS["tex_mask"]), sampler_type=ST.SAMPLERTYPE_MASKS)
    fb.set_editor_property("blend", True)
    # Colour flipbook (a Baker sheet: fire, explosions): its own parameter, because a texture parameter's sampler type
    # must match the texture's compression (a Masks sampler refuses a colour sheet). Alpha = shape, RGB = colour.
    fbc = node(mat, unreal.MaterialExpressionTextureSampleParameterSubUV, -450, -60, parameter_name="FlipbookColorTexture",
               group="Textures", texture=unreal.load_asset("/Engine/EngineResources/DefaultTexture"),
               sampler_type=ST.SAMPLERTYPE_COLOR)
    fbc.set_editor_property("blend", True)
    fb_shape = switch("FlipbookColor", -300, -280, "Flipbook", fbc, fb, "A", "R")
    shape = switch("UseFlipbook", -200, -360, "Flipbook", fb_shape, mask, "", "R")

    # Erosion source: dyn.x, or (1 - particle alpha) with ErosionFromAlpha
    inv_a = op(unreal.MaterialExpressionOneMinus, -1550, 560)
    link(pc, "A", inv_a, "")
    e_src = switch("ErosionFromAlpha", -1350, 520, "Dissolve", inv_a, dyn, "", "R")
    erosion = scalar("Erosion", 0.0, -1550, 200, "Dissolve")
    soft = scalar("ErosionSoftness", 0.15, -1550, 320, "Dissolve")
    e_add = op(unreal.MaterialExpressionAdd, -1150, 220)
    link(erosion, "", e_add, "A")
    link(e_src, "", e_add, "B")
    e_sat = op(unreal.MaterialExpressionSaturate, -1000, 220)
    link(e_add, "", e_sat, "")
    # keep = saturate((noise - e * (1 + soft) + soft) / soft): whole at e = 0, gone at e = 1, noisy edge in between
    soft_c = op(unreal.MaterialExpressionMax, -1150, 340, const_b=0.001)
    link(soft, "", soft_c, "A")
    one_plus = op(unreal.MaterialExpressionAdd, -1000, 340, const_b=1.0)
    link(soft_c, "", one_plus, "A")
    e_scaled = mul(e_sat, one_plus, -850, 260)
    k1 = op(unreal.MaterialExpressionSubtract, -700, 200)
    link(noise, "R", k1, "A")
    link(e_scaled, "", k1, "B")
    k2 = op(unreal.MaterialExpressionAdd, -550, 220)
    link(k1, "", k2, "A")
    link(soft_c, "", k2, "B")
    k3 = op(unreal.MaterialExpressionDivide, -400, 240)
    link(k2, "", k3, "A")
    link(soft_c, "", k3, "B")
    keep = op(unreal.MaterialExpressionSaturate, -250, 240)
    link(k3, "", keep, "")

    # Alpha = shape * keep * (particle alpha, unless it drives erosion) * Opacity, optionally stepped, then DepthFade
    one = op(unreal.MaterialExpressionConstant, -1350, 700, r=1.0)
    pa = switch("ErosionFromAlpha", -1150, 640, "Dissolve", one, pc, "", "A")
    a1 = mul(shape, keep, 0, -100)
    a2 = mul(a1, pa, 150, 0)
    opac = scalar("Opacity", 1.0, 0, 150, "Colour")
    a3o = mul(a2, opac, 300, 40)
    # Edge fade for mesh particles: alpha *= lerp(1, 1 - (1 - |N.V|)^EdgeFadeExponent, EdgeFade). Softens the silhouette
    # where the surface turns edge-on (swirls, shields, shockwave meshes). 0 = off; camera-facing sprites are unaffected.
    # |N.V| from the vertex normal, not the Fresnel node: Fresnel hid the whole mesh here (two-sided unlit, tested), and
    # the abs() makes it work whichever way the normals face.
    vn = op(unreal.MaterialExpressionVertexNormalWS, -400, 300)
    cam = op(unreal.MaterialExpressionCameraVectorWS, -400, 380)
    ndv = op(unreal.MaterialExpressionDotProduct, -250, 320)
    link(vn, "", ndv, "A")
    link(cam, "", ndv, "B")
    facing = op(unreal.MaterialExpressionAbs, -100, 320)
    link(ndv, "", facing, "")
    grazing = op(unreal.MaterialExpressionOneMinus, 0, 320)
    link(facing, "", grazing, "")
    edge_exp = scalar("EdgeFadeExponent", 2.0, -100, 420, "Mesh")
    fres = op(unreal.MaterialExpressionPower, 100, 320)
    link(grazing, "", fres, "Base")
    link(edge_exp, "", fres, "Exp")
    inv_f = op(unreal.MaterialExpressionOneMinus, 150, 300)
    link(fres, "", inv_f, "")
    edge_amt = scalar("EdgeFade", 0.0, 150, 400, "Mesh")
    edge = op(unreal.MaterialExpressionLinearInterpolate, 300, 320, const_a=1.0)
    link(inv_f, "", edge, "B")
    link(edge_amt, "", edge, "Alpha")
    a3 = mul(a3o, edge, 450, 40)
    step_t = scalar("StepThreshold", 0.5, 300, 200, "Colour")
    st1 = op(unreal.MaterialExpressionSubtract, 450, 140)
    link(a3, "", st1, "A")
    link(step_t, "", st1, "B")
    st2 = op(unreal.MaterialExpressionMultiply, 600, 140, const_b=50.0)
    link(st1, "", st2, "A")
    st3 = op(unreal.MaterialExpressionSaturate, 750, 140)
    link(st2, "", st3, "")
    a4 = switch("SteppedAlpha", 900, 60, "Colour", st3, a3)
    fade_dist = scalar("DepthFadeDistance", 30.0, 900, 220, "Colour")
    fade = op(unreal.MaterialExpressionDepthFade, 1100, 80)
    link(a4, "", fade, "Opacity")
    link(fade_dist, "", fade, "FadeDistance")
    out(fade, "", MP.MP_OPACITY)

    # Colour = ParticleColor.rgb * Tint * EmissiveStrength * dyn.y, times alpha when additive
    tint = node(mat, unreal.MaterialExpressionVectorParameter, 300, 520, parameter_name="Tint", group="Colour",
                default_value=unreal.LinearColor(1.0, 1.0, 1.0, 1.0))
    # Colour source: particle colour, times the sheet's RGB with FlipbookColor (use it together with UseFlipbook).
    pc_fb = mul(pc, fbc, 350, 640, a_out="RGB", b_out="RGB")
    col = switch("FlipbookColor", 400, 560, "Flipbook", pc_fb, pc, "", "RGB")
    c1 = mul(col, tint, 500, 560, b_out="RGB")
    e_str = scalar("EmissiveStrength", 5.0, 500, 700, "Colour")
    c2 = mul(c1, e_str, 650, 600)
    c3 = mul(c2, dyn, 800, 640, b_out="G")
    c_add = mul(c3, fade, 1100, 720)
    additive = switch("IsAdditive", 1300, 640, "Blend", c_add, c3)
    out(additive, "", MP.MP_EMISSIVE_COLOR)

    # Usage flags up front (a missing flag shows the default material in a packaged build).
    for usage in (unreal.MaterialUsage.MATUSAGE_NIAGARA_SPRITES, unreal.MaterialUsage.MATUSAGE_NIAGARA_RIBBONS,
                  unreal.MaterialUsage.MATUSAGE_NIAGARA_MESH_PARTICLES):
        mel.set_material_usage(mat, usage)

    # recompile_material returns nothing (no error list): a broken graph shows up as the default material, so
    # check the result renders (shot) after a change.
    mel.recompile_material(mat)
    eal.set_metadata_tag(mat, "MegajamVfxVersion", VERSION)
    eal.save_loaded_asset(mat)
    return {"expressions": mel.get_num_material_expressions(mat)}


path = ARGS["path"]
material = unreal.load_asset(path)
if material is None:
    folder, asset_name = path.rsplit("/", 1)
    material = unreal.AssetToolsHelpers.get_asset_tools().create_asset(asset_name, folder, unreal.Material, unreal.MaterialFactoryNew())

if eal.get_metadata_tag(material, "MegajamVfxVersion") == VERSION and ARGS.get("force") != "1":
    print("VFXMASTER_JSON=" + json.dumps({"path": path, "version": VERSION, "rebuilt": False}))
else:
    print("VFXMASTER_JSON=" + json.dumps({"path": path, "version": VERSION, "rebuilt": True, **build(material)}))
