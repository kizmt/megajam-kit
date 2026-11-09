# Using Sub Anim Instances

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-sub-anim-instances-in-unreal-engine?application_version=5.9

> Showcases how you can use Sub Animation Blueprint Instances within other Animation Blueprints.

[image: Using Sub Anim Instances]

As you start to create more and more complex Animation Blueprints for your characters, there may be times when you want to re-use portions of an Animation Blueprint within another Animation Blueprint.
Rather than re-creating the node network, you can split that network off into its own Animation Blueprint and use a **Sub Anim Instance** to access the Animation Blueprint when it is needed.

In this how-to we create an Animation Blueprint with logic to affect our playable character, then use a Sub Anim Instance inside the template's Animation Blueprint to call that logic.

For this guide, we are using the **Blueprint Third Person** template with **Starter Content** enabled.

## Steps

- In the **Content/Mannequin/Animations** folder, **Right-click** on and **Duplicate** the **ThirdPerson_AnimBP** and call it **AltAnimBP**. This AltAnimBP will be used as our Sub Anim Instance that will be called from the ThirdPerson_AnimBP. When creating an Animation Blueprint to use as a Sub Anim Instance, you must use the same Skeleton Asset as the one in the Animation Blueprint you plan to incorporate it in. In our example, we duplicated the template's Animation Blueprint, however, when creating Animation Blueprints from scratch you will need to select a Skeleton.

- In the **AnimGraph** of **AltAnimBP**, **Right-click** and add a **Sub-Graph Input** node. This will create an **In Pose** on the Sub Anim Instance, allowing us to pass through external pose data to this Animation Blueprint.

- **Right-click** again and add a **FABRIK** skeletal control node. For this example, we will use IK to push the character's arms up into the air as they run around during gameplay.

- Assign the following settings to the **FABRIK** node from the **Details** panel. Uncheck the **(As Pin) Effector Transform**

- Set **Location** to **100, 0, 200**.

- Set **Tip Bone** to **index_01_l**.

- Set **Root Bone** to **clavicale_l**.

- Copy the **FABRIK** node in the graph and make the following changes to it from the **Details** panel. Set **Location** to **-100, 0, 200**.

- Set **Tip Bone** to **index_01_r**.

- Set **Root Bone** to **clavicale_r**.

This will ensure that both the Left and Right arms are affected.

- **Right-click** on the **Alpha** pin of a **FABRIK** node and **Promote to Variable** called **Effect Alpha**.

- Recreate the node network shown below (the **Local to Component** and **Component to Local** nodes will be automatically created). If you **Compile** the Animation Blueprint, the character in the preview window will put their arms up.

- Inside the **Content Browser** under **Content/Mannequin/Animations**, open the **ThirdPerson_AnimBP**.

- Inside the **AnimGraph**, **Right-click** and add the **Sub Anim Instance** node. This is the node that we use to gain access to our Animation Blueprint we created.

- In the **Details** panel for the **Sub Anim Instance** node, set the **Instance Class** to **AltAnimBP**.

- Click the **Expose** checkbox next to **EffectAlpha** to expose the property. By exposing properties, you can update those properties with data from the parent Animation Blueprint.

- From the **MyBlueprint** panel, drag in the **Speed** variable and divide it by **600** then plug that into the **Effect Alpha**. Here we divide the character's movement speed by a value to produce a blend between the amount of Skeletal Control applied.

- **Compile** then **Play in the Editor**.

## End Result

Below, as our character's speed increases it is divided by the specified amount before being used to drive the amount of Skeletal Control applied inside our Sub Anim Instance network.
In this example we used the **Sub-Graph** input node to determine the resulting pose data, however, you can create an Animation Blueprint with its own State Machine and logic to generate the resulting pose data as well.

- animation
- animation blueprint
- skeletal controls

On this page

- Steps (-> using-sub-anim-instances-in-unreal-engine)
- End Result (-> using-sub-anim-instances-in-unreal-engine)
