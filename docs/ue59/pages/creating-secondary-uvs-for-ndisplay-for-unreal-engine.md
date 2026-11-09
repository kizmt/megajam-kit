# Creating Secondary UVs for nDisplay

https://dev.epicgames.com/documentation/en-us/unreal-engine/creating-secondary-uvs-for-ndisplay-for-unreal-engine?application_version=5.9

> Guide for creating a second UV channel for the nDisplay projection meshes so that the In-Camera VFX editor can take full advantage of all of its features.

[image: Creating Secondary UVs for nDisplay]

This guide is meant for UV1 of the projection meshes. The UV channel 0 is used for warp mapping with a mesh projection policy in nDisplay. (-> projection-policies-in-ndisplay-in-unreal-engine)

Because of how **nDisplay** applies ‘2D style’ effects to the projection meshes, we utilize the second UV channel and expect all UV shells across meshes to have been given the same texel density, and for each UV shell to have no overlap.

Consideration also needs to be given to the shape of the stage. For example, a very wide continuous LED wall, though likely made of separate meshes, should always be one continuous set of UVs as the wall would stand in reality. We will use the stage mesh from the **ICVFXExample Project**. If you wish to follow along, go to `/Content/nDisplayConfigs/Meshes` to export the relevant static mesh actors to **FBX** and follow along in your DCC of choice.

Though this may seem like a poor use of UV space, it is more important for the shells in this second UV set to be representative of their real-life counterpart’s construction. In this example, the seam of these two meshes is in the center of the curved wall. In this configuration, the checkerboard texture flows correctly. This is important for the **Chroma Key mode** of **nDisplay**, as incorrect layout and uneven texel density can cause markers to be cut off and have different sizes across the Volume.

The example above makes better use of UV space but is unsuitable for the needs of the In-Camera VFX Editor. You can see the checkerboard no longer flows correctly. **UV Light Cards** passing through the middle seam will look incorrect.

For **common-plane sets of panels**, such as the ceiling, it’s a good idea to do a **plane projection** if they have any standout characteristics, such as the gap. The gap must be proportional to how it is in reality, otherwise, **UV space effects** won’t translate across correctly. In the example below you can see how the **UV Light Card** is able to maintain its correct proportions in the Editor viewport nDisplay preview.

Before: The UV Light Card does not maintain correct proportions when moved in the viewport nDisplay preview.

After: The UV Light Card maintains the correct proportions when moved in the viewport nDisplay preview.

It’s also important to consider how the layout and orientation of the UV shells will be. Having shells flipped in UV can cause unintuitive feedback, such as the controls feeling “backward”.

See above how where the light card “comes out” of the top of the curved wall, it shows up partially on the ceiling. It would be better to move the UV1 shell of the ceiling further away from the walls in UV1 so there is space for the UV Light Card to become ‘hidden’ when it’s hanging off the edges of the wall UV shell.

These meshes should remain separate, so do not combine them when exporting. You can work on them simultaneously by selecting each mesh when opening your DCC’s UV layout editor.

- getting started
- virtual production
- ndisplay
- icvfx
- virtual sets
- bronze
- uvs
