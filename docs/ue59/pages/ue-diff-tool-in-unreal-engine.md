# Unreal Diff Tool

https://dev.epicgames.com/documentation/en-us/unreal-engine/ue-diff-tool-in-unreal-engine?application_version=5.9

> An overview of using the UE Diff tool in Unreal Engine

[image: Unreal Diff Tool]

Manually tracking bugs and dissecting features can be challenging with large, complex files. Traditionally, diffed files are textual text-based. However, with **Assets** and **Blueprints**, a textual representation would not be constructive. That's why we crafted the UE diff tool.
The UE Diff Tool compares assets in Unreal Engine. It supports:

- Comparing an asset with a previous version of itself from source control.

- Comparing two different assets.

When you diff an asset or two different assets, two files are compared. The differences between the two files are highlighted, making them easier to spot.

Not all asset types are supported. The currently supported types:

- Blueprints

- Blueprint adjacent types.

## Anatomy of the Diff Tool

To diff two assets against one another, navigate to the content browser, select two assets, then right-click and choose **Diff Selected**.

### Toggle Differences

When using the Diff tool, you can use the **Next** and **Previous**(Prev) arrow buttons to quickly cycle through differences or click items in the navigation tree to observe a specific difference.

### Basic Graph Diff Navigation

You can toggle whether panning and zooming is locked between the two graphs with the **Lock/Unlock** button. To quickly find changes, zoom out using the middle mouse wheel. All unchanged nodes appear gray, while changed nodes are visible and outlined with a color code indicating the type of change.

### Color Coding

Graph changes are color coded using the following color schemes.

| Color |  | Description |
| --- | --- | --- |
| Red | Something on the left panel is missing on the right (subrtraction.) |  |
| Green | Something on the right panel is missing on the left (addition.) |  |
| Cyan | Something has changed. |  |
| Grey | Something on the left panel is missing on the right(moved nodes, comments.) |  |

## UE Review Tool

You can use the **UE Review Tool** to list all the assets in a shelved or submitted changelist. The tool also allows users to diff and review those assets. Currently, the Review tool is only supported for Perforce.

You can launch the Review tool from the **Revision Control** menu located on the bottom right of the Editor. If it's missing from the list, check that you're logged into perforce.

## Diffing Local Asset Changes Against Current Source Control Revision

One of the benefits of source control is the ability to view previous versions of files and compare or 'diff' them to see how the files have changed. Below are a few different options to Diff your local asset changes against your current source control revision.

### Option 1

Right-click on the asset in the content browser and navigate to **Source Control** > **Diff Against Depot**.

### Option 2

Right-click on the asset in the **View Changelists** tool and select **Diff Against Depot**.

### Option 3 (Blueprint Only)

From the Blueprint Editor, navigate to **Diff** > **Depot**.

## Diffing Local Asset Changes Against a Specific Source Control Revision

Follow any of the options below to diff a local asset against a specific source control revision.

### Option 1

Right-click on the asset in the content browser and navigate to **Source Control** > **History**. Right-click the revision you wish to diff against and select **Diff Against Workspace File**.

### Option 2

From the Blueprint Editor, click **Diff** and select the revision you wish to diff against.

## Diffing an Asset's old revision against its previous revision

### Option 1

Right-click on the asset in the **Content Browser**. Navigate to **Source Control** > **History**, then right-click the revision you wish to diff against and select **Diff Against Previous Revision**.

### Option 2

In the UE Review Tool, input the CL you want to diff and click the **diff button** beside the asset.

## Diffing a shelved CL against its previous revision

In the UE Review Tool, input the Changelist (CL) you want to diff, then click the **diff button** beside your asset.

- blueprints
- programming

On this page

- Anatomy of the Diff Tool (-> ue-diff-tool-in-unreal-engine)
- Toggle Differences (-> ue-diff-tool-in-unreal-engine)
- Basic Graph Diff Navigation (-> ue-diff-tool-in-unreal-engine)
- Color Coding (-> ue-diff-tool-in-unreal-engine)
- UE Review Tool (-> ue-diff-tool-in-unreal-engine)
- Diffing Local Asset Changes Against Current Source Control Revision (-> ue-diff-tool-in-unreal-engine)
- Option 1 (-> ue-diff-tool-in-unreal-engine)
- Option 2 (-> ue-diff-tool-in-unreal-engine)
- Option 3 (Blueprint Only) (-> ue-diff-tool-in-unreal-engine)
- Diffing Local Asset Changes Against a Specific Source Control Revision (-> ue-diff-tool-in-unreal-engine)
- Option 1 (-> ue-diff-tool-in-unreal-engine)
- Option 2 (-> ue-diff-tool-in-unreal-engine)
- Diffing an Asset's old revision against its previous revision (-> ue-diff-tool-in-unreal-engine)
- Option 1 (-> ue-diff-tool-in-unreal-engine)
- Option 2 (-> ue-diff-tool-in-unreal-engine)
- Diffing a shelved CL against its previous revision (-> ue-diff-tool-in-unreal-engine)
