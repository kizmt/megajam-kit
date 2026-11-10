# Paper 2D Flipbooks

https://dev.epicgames.com/documentation/en-us/unreal-engine/paper-2d-flipbooks-in-unreal-engine?application_version=5.9

> Description of Paper 2D Flipbooks and how to create them.

[image: Paper 2D Flipbooks]

 [image: The best way to think of Paper 2D Flipbooks is in the form of hand-drawn animation]

The best way to think of **Paper 2D Flipbooks** (or **Flipbooks** for short) is in the form of hand-drawn animation, where a series of images that are slightly different are "flipped" through to produce what appears to be motion. In Unreal Engine, Flipbooks consist of a series of keyframes, each of which contains a Sprite (-> how-to-import-and-use-paper-2d-sprites-in-unreal-engine) to be displayed and a duration (in frames) to display it.
A **Frames Per Second** option determines how fast the frames will be displayed, indicating how many animation "beats" will occur in a second and the keyframes themselves can be edited in the **Details** panel or by using a **Timeline** which can be found at the bottom of the **Flipbook Editor**.

## Creating a Flipbook

There are a couple of ways you can go about creating a Flipbook. You can either create a blank Flipbook that you populate with sprites yourself or you can auto-generate a Flipbook based off a series of selected sprites.

You can import a JSON-formatted sprite sheet description, which will import associated textures and create sprites and a Flipbook for the described frames as well. See Paper 2D Import Options (-> import-sprites-in-unreal-engine) for more information.

### Blank Flipbooks

Creating a blank Flipbook can be achieved by following the steps below.

**From the Content Drawer**:

- Click the **+Add** button, then in the context menu under Animation, select the **Paper Flipbook** option. [image: In the context menu under Animation select the Paper Flipbook option] You can also **Right-click** inside the **Content Drawer** to open the context menu instead of clicking **Add New**.

- You will then be prompted to enter a name for your new Flipbook. [image: New Flipbook]

- After you select a name, your Flipbook asset has been created. [image: Your Flipbook asset has been created] The asterisk symbol in the lower-left corner indicates that the asset has not been saved yet and will go away when you save it.

### Auto-Generated Flipbooks

To create an automatically generated Flipbook, follow the steps below.

**From the Content Drawer**:

- Locate and select each of the sprites you would like to include in the Flipbook in the **Content Drawer**. [image: Locate and select each of the sprites you would like to include in the Flipbook in the Content Drawer]

- **Right-click** on any of the sprites, then select the **Create Flipbook** option from the context menu. [image: Select the Create Flipbook option from the context menu]

- You will then be prompted to enter a name for your new Flipbook. [image: You will then be prompted to enter a name for your new Flipbook]

- After you select a name, your Flipbook asset has been created. [image: Your Flipbook asset has been created] When you mouse over the Flipbook in the **Content Drawer**, you will also be able to preview the Flipbook animation.

When auto-generating a Flipbook, the naming convention you use for the sprites included is **very important** as the sprites will be added to the Flipbook in alphabetical order. In the example above, we've named each of our sprites for creating an Idle to **Idle_x** where X is the order in which we want the sequence to appear.

On this page

- Creating a Flipbook (-> paper-2d-flipbooks-in-unreal-engine)
- Blank Flipbooks (-> paper-2d-flipbooks-in-unreal-engine)
- Auto-Generated Flipbooks (-> paper-2d-flipbooks-in-unreal-engine)
