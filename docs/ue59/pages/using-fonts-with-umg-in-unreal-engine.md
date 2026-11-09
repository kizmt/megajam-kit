# Using Fonts with UMG

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-fonts-with-umg-in-unreal-engine?application_version=5.9

> This guide provides information on using Fonts with the UMG UI designer tools.

[image: Using Fonts with UMG]

This guide provides information on setting up **Fonts** Assets of the Text Widget via Widget Blueprints Editor.

## Steps

Follow the steps below to see how to adjust custom Fonts and use them via UMG UI Designer of the Widget Blueprints Editor.

For this how-to guide, use **Blank Template** is used with no **Starter Content**. Settings of **Target Hardware** and **Project Settings** are used by default.

- Create a new Widget Blueprint (-> widget-blueprints-in-umg-for-unreal-engine). Click the **Add** in the **Content Browser**, then select **User Interface > Widget Blueprint**.

- **Double-click** the created **Widget Blueprint** to open it in the **Widget Blueprint Editor**.

- Find **Canvas Panel** Widget in the **Pallete** panel and drag it into the **Visual Designer** window.

- Find **Text** Widget in the **Pallete** panel and drag it into **Canvas Panel** of the **Visual Designer** window.

- Click created **Text** Widget for access the **Details** panel of this item. In the **Details** panel, under **Appearance**, find a **Font** option. With the help of this, you can adjust family type, facetype (regular, bold, itallic, and so on), size, letter spacing and so on.

- By default, the **Unreal Engine** uses the **Roboto** font. Click the dropdown menu next to **Font Family** for selecting any custom Fonts Assets, you have created. You can also choose option to create a custom Fonts via this menu and specify location of the new asset (it will be blank by default).

- Click dropdown menu next to **TypeFace** for selecting a style for selected Fonts Asset.

- You can specify the size of the Fonts Asset in the input box next to **Size**.

- Also, you can specify a space between letter in the input box next to **Letter Spacing**.

Currently, UMG only supports **Runtime** cached Fonts Assets. Also, if you have assigned Fonts using the old method, none of your existing file-based font settings will be lost, however going forward, you will need to create a Fonts Asset in order to use custom Fonts with UMG.

## End Result

You have get familiar with basics of adjusting **Fonts** Assets of the Text Widget via Widget Blueprints Editor. Moreover, you can style your **Fonts** by colors, Materials, outline properties, and so on (-> font-materials-and-outlines-in-unreal-engine).

- umg ui designer

On this page

- Steps (-> using-fonts-with-umg-in-unreal-engine)
- End Result (-> using-fonts-with-umg-in-unreal-engine)
