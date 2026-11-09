# Normal Calculation Methods

https://dev.epicgames.com/documentation/en-us/unreal-engine/normal-calculation-methods-with-the-proxy-geometry-tool-in-unreal-engine?application_version=5.9

> Adjusting the Normal Calculation Method for the simplified geometry.

[image: Normal Calculation Methods]

The Proxy Geometry tool will allow you to specify which method should be used when computing the Vertex Normals of a given Static Mesh. In the following How-To we will take a look at how you can change the Vertex Normal calculation method and the effect that will have on your generated Static Meshes.

## Steps

In the following section, we will take a look at how you can adjust the method that is used to calculate the Normals that are used for a Static Mesh.

- First, locate a Static Mesh or group of Static Meshes that you want to generate new geometry for and select the Mesh or Meshes inside the Viewport.

- Next, open the **Merge Actor** tool by going to **Window > Developer Tools > Merge Actors**.

- In the Merge Actor tool, click the **second icon** to access the **Proxy Geometry** tool and then expand the **Proxy Settings**.

- Set the **Screen Size** value to **50** and make sure that the **Normal Calculation Method** is set to **Angle Weighted**. By setting the Screen Size to a value of 50 we are telling the Proxy Geometry tool to reduce the amount of triangles used in the selected Static Mesh.

- Next, click the **Merge Actors** button and input a name and location in the **Content Browser** for the newly created Static Mesh. Then click the **Save** button to start the merging process.

- Once that has completed, double-click the Static Mesh to open it in the **Static Mesh Editor**, where you can see the results.

## End Results

Getting the best results is going to take some time and iteration as each object could require a different Normal Calculation Method to achieve the desired results. The results can also be very subtle depending on the type of object that you are using. The following image comparison shows how the Static Mesh used in this example looks when the Normal Calculation Method is set to Angle Weighted, Area Weighted and Equal Weighted.

The following image slider shows the results that each of the three Normal Calculation Methods can achieve. First you will see Angle Weighted then Area Weighted and finally Equal Weighted.

-

On this page

- Steps (-> normal-calculation-methods-with-the-proxy-geometry-tool-in-unreal-engine)
- End Results (-> normal-calculation-methods-with-the-proxy-geometry-tool-in-unreal-engine)
