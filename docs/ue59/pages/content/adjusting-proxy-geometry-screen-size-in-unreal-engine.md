# Adjusting Proxy Geometry Screen Size

https://dev.epicgames.com/documentation/en-us/unreal-engine/adjusting-proxy-geometry-screen-size-in-unreal-engine?application_version=5.9

> Product documentation including reference and guides for Unreal Engine 5

[image: Adjusting Proxy Geometry Screen Size]

In the following How - To we, will take a look at using the **Spatial Sampling Distance** override parameter to manually adjust the feature minimum size that the system captures when it re-meshes all the Objects (before it simplifies).

## Steps

- First, inside of any Unreal Engine 5 (UE5) level, select a few Static Meshes to work with. Click image for full size.

- With the Static Meshes still selected open up the **Merge Actors** tool by going to **Tools.** Then from the displayed list, select the **Merge Actors** tool. Click image for full size.

- When the Merge Actors tool opens, click on the **2nd** icon to access the **Proxy Geometry** tools. Then under **Proxy Settings**, expand the **Material Settings** section. Click image for full size.

- Locate the **Override Spatial Sampling Distance** parameter and click on the box next to its name to enable it. Click image for full size.

- Set the value of Override Spatial Sampling Distance to 100 and then press the **Merge Actors** button. Click image for full size. By default, the system computes a guess at this size based on the bounding box of the geometry and the requested **Screen Size**. If you look in the **Window > Developer Tool > Output Log**, you will see that the actual number used by the system will be written out. The larger this number is, the less simplification will be performed. The smaller the number is, more simplification will be performed.

- Specify a name and location for the newly created Static Mesh and then press the **Save** button to begin the Proxy Geometry creation process. Click image for full size.

## End Result

When the process has completed you will now have a new Static Mesh, Material and Textures of all the Static Meshes you had selected in the first step of this How - To. The images below demonstrate the effects of setting the Override Spatial Sampling Distance to different values has on the created Static Mesh.

 [image: Override Spatial Sampling Distance Original]
 [image: Override Spatial Sampling Distance = 0.5]
 [image: Override Spatial Sampling Distance = 1]
 [image: Override Spatial Sampling Distance = 10]
 [image: Override Spatial Sampling Distance = 100]

Override Spatial Sampling Distance = 0.5 | Override Spatial Sampling Distance = 1 | Override Spatial Sampling Distance = 10 | Override Spatial Sampling Distance = 100

- ui
- optimization
- proxygeometrytool

On this page

- Steps (-> adjusting-proxy-geometry-screen-size-in-unreal-engine)
- End Result (-> adjusting-proxy-geometry-screen-size-in-unreal-engine)
