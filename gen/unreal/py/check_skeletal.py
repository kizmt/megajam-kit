# Check an imported SkeletalMesh is retarget-safe: root bone scale 1, sensible height, bone offsets in cm.
#   node gen/unreal/py.mjs gen/unreal/py/check_skeletal.py --arg mesh=/Game/Characters/X/SK_X
# Prints CHECK_SKELETAL ok/FAIL. Root scale != 1 means retargeted animations will collapse or explode.
import unreal
mesh = unreal.load_asset(ARGS["mesh"])
actors = unreal.get_editor_subsystem(unreal.EditorActorSubsystem)
a = actors.spawn_actor_from_class(unreal.SkeletalMeshActor, unreal.Vector(0, 0, -100000), unreal.Rotator(0, 0, 0))
try:
    c = a.skeletal_mesh_component
    c.set_skeletal_mesh_asset(mesh)
    names = [str(n) for n in c.get_all_socket_names()]
    root = c.get_bone_name(0)
    rs = c.get_socket_transform(root, unreal.RelativeTransformSpace.RTS_COMPONENT).scale3d
    pelvis = "pelvis" if "pelvis" in names else c.get_bone_name(1)
    pl = c.get_socket_transform(pelvis, unreal.RelativeTransformSpace.RTS_PARENT_BONE_SPACE).translation
    head_z = c.get_socket_transform("head", unreal.RelativeTransformSpace.RTS_COMPONENT).translation.z if "head" in names else None
    e = mesh.get_bounds().box_extent
    ok = abs(rs.x - 1) < 1e-3 and abs(rs.y - 1) < 1e-3 and abs(rs.z - 1) < 1e-3
    print(f"root={root} root_scale=({rs.x:.3f},{rs.y:.3f},{rs.z:.3f}) {pelvis}_local=({pl.x:.2f},{pl.y:.2f},{pl.z:.2f}) head_z_cm={head_z} mesh_size_cm=({e.x*2:.0f},{e.y*2:.0f},{e.z*2:.0f})")
    print("CHECK_SKELETAL", "ok" if ok else "FAIL (root bone scale is not 1)")
finally:
    actors.destroy_actor(a)
