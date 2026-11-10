# DPI Scaling

https://dev.epicgames.com/documentation/en-us/unreal-engine/dpi-scaling-in-unreal-engine?application_version=5.9

> This page gives an overview on adjustment of DPI Scaling Rules.

[image: DPI Scaling]

**UMG** supports automatic scaling for resolution-independent UI. There are default DPI scaling settings applied to every project. You can configure it by the **Project Settings** menu under the **User Interface** section. You can change **Application Scale** value via the input box, choose option of **DPI Scale Rule** and adjust **DPI Curve**.

You can set the **DPI Scale Rule** to one of four options:

- **Shortest Side**: Evaluates the scale curve based on the shortest side of the viewport (Most Common Setting).

- **Longest Side**: Evaluates the scale curve based on the longest side of the viewport.

- **Horizontal**: Evaluates the scale curve based on the X axis of the viewport.

- **Vertical**: Evaluates the scale curve based on the Y axis of the viewport.

Right-click on the DPI Curve graph allows you to add points to the curve by selecting the **Add Key** option. After that you can set the resolution and its corresponding scale value via the input boxes. Also, you can supply an external **Float Curve** or create a Float Curve based on the currently applied settings by expanding the **DPI Curve** option.

- ui
- umg ui designer
