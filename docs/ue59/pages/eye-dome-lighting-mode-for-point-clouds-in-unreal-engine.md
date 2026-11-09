# Eye-Dome Lighting Mode for Point Clouds

https://dev.epicgames.com/documentation/en-us/unreal-engine/eye-dome-lighting-mode-for-point-clouds-in-unreal-engine?application_version=5.9

> Enable Eye Dome lighting to accentuate a point cloud's edges and enhance its depth.

[image: Eye-Dome Lighting Mode for Point Clouds]

**Eye-Dome Lighting (EDL) **is a lighting model that accentuates the shapes of objects within a point cloud by grouping objects that are close together and shading their outlines, which enhances depth perception. EDL is implemented as a post-process Material and requires a Post Process Volume to work. It does not use any engine light sources, so it can be used with the unlit rendering method.

EDL can be used with Ambient Occlusion but this may produce an excessively dark image.

## Steps

- Add a Post Process Volume to your Level. From the **Place Actors** panel, search for **Post Process Volume** and drag it into your Level. Click image for full size.

- Select the Post Process Volume and, in its **Details** panel, scroll to the **Rendering Features** category.

- Expand **Post Process Materials **and click the **plus (+)** icon to add a new Material to the array.

- From the drop down-menu of the new Material you added, select **Asset reference**. Click image for full size.

- Click the **None** dropdown. Then enable **Engine Content** and **Plugin Content** to be visible. Click image for full size.

- Click the **None** dropdown menu again. Then, select one of the two following options: **M_PP_EDL_MainPass** - This will apply the EDL to every object in the Level, not just point clouds. If you only display point cloud elements, this is the recommended option.

- **M_PP_EDL_CustomPass **- This will apply the EDL only to objects using **Custom Depth Pass**. This option is recommended if you want to selectively apply EDL. Enabling Custom Depth Pass will increase the performance cost.

- To apply the EDL to the whole Level, enable the **Infinite Extent (Unbound)** option on the post-processing volume. Click image for full size.

## Result

EDL has been applied to the Level. Notice the change to edges of objects in the level and how this enhances depth perception.

 [image: Before applying EDL]

 [image: After applying EDL]

- ui
- lidar

On this page

- Steps (-> eye-dome-lighting-mode-for-point-clouds-in-unreal-engine)
- Result (-> eye-dome-lighting-mode-for-point-clouds-in-unreal-engine)
