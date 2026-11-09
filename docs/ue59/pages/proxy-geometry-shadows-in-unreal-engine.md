# Proxy Geometry Shadows

https://dev.epicgames.com/documentation/en-us/unreal-engine/proxy-geometry-shadows-in-unreal-engine?application_version=5.9

> Optimize your shadow performance costs with proxy geometry shadows

[image: Proxy Geometry Shadows]

Calculating dynamic shadows for dense geometry or many small meshes combined can have a high performance cost. Using shadows cast by proxy geometry is a method to reduce that cost, by creating a single, simplified mesh to cast the shadow rather than calculating the individual shadows for more complex meshes or multiple smaller meshes.

An example use case is an apartment building that's made up of many different windows, walls, balconies and other high detail features.

To optimize dynamic shadows using proxy shadows:

- In the **Details** panel under **Lighting**, disable **Cast Shadows** on all your meshes for which you want the proxy geometry to cast shadows instead. [image: Disable Cast Shadows under Lighting in the Detail panel]

- Add a lower-detail version of the meshes. A proxy shadow caster mesh can be created with the **Merge Actor** tool (using the **Proxy Mesh** tab) if the shape is more organic or complex, but for a square building a regular scaled-up cube will work fine. Refer to the Proxy Geometry Overview (-> proxy-geometry-tool-overview-in-unreal-engine) for more information. [image: The Merge Actor tool Proxy Mesh tab]

- Leave **Cast Shadows** enabled on the proxy shadow caster.

- In the **Details** panel under **Rendering**, disable **Render in Main Pass** on the proxy shadow caster. [image: Disable Render in Main Pass under Rendering in the Detail panel]

- Make sure the proxy shadow caster is properly aligned with the visible, higher-detail original.

This technique can also work very well for distant objects with **Far Cascade** shadow maps enabled.

Now, the building will appear as if it's casting a shadow but it will be much cheaper and faster to render than before.

- optimization
- proxy geometry tool
