# Mass Debugger Overview

https://dev.epicgames.com/documentation/en-us/unreal-engine/mass-debugger-overview?application_version=5.9

> Learn how to use the Mass Debugger tool in Unreal Engine.

## Overview

The **Mass Debugger** tool has been significantly improved with many new features including: real-time inspection of entity fragment data, entity-specific fragment access breakpoints, **Gameplay Debugger** integration, and improved processor inspection.

## Using the Mass Debugger

To launch the Mass Debugger select **Tools > Debug > Mass Debugger** from the editor. Note: If you have launched previous versions of the Mass Debugger you may need to reset the layout to see the new tabs (**Window > Reset Layout** in the Mass Debugger window).

### UI Workflow

To view Processor data access overlaps:

- Open the Mass Debugger.
- Use the **Environment Picker** to select the Mass runtime environment you wish to inspect.
- Open the **Processors Tab** (Window > Processors).
- Find the Processor you want to inspect in the list.
- Click the **Show Fragment Access** button on processor entry.
- Click a fragment from the **Queries** list on the expanded processor entry.

The color of the processors will change based on the access of each processor.

Green indicates read (const) access and red indicates write (mutable) access.

[image: Image of the screen to view Processor data access overlaps.]

To inspect fragment data on an entity from the Mass Debugger with an active environment selected:

- Open the **Entities Tab** (**Window > Entities**, or use any of the contextual **Show Entities** buttons throughout the debugger UI).
- Click the **Select Fragments** dropdown and check the fragments you want to inspect.Note: the list of fragments is contextual to composition of listed entities.
- Note: Only member variables of the selected fragment structs marked as UPROPERTY will be displayed. No other editor visibility metadata is required.

To set a fragment write breakpoint for a specific fragment on a specific entity:

- Show the fragment data for the desired entity in the **Entities Tab**.
- Click the **Set Write Breakpoint** button.
- Note: the breakpoint will trigger in the EntityIterator code for the MassExecutionContext::EntitiyIterator. Only code using that iterator or wrappers for that iterator will trigger breakpoints this way. The triggering code will usually be two or three levels up the callstack.
- To clear the breakpoint from the IDE and resume execution, use the watch feature in your IDE and set the bDisableThisBreakpoint variable to “true” or “1”.

[image: Image of the screen for the Select Fragments tab with fragment details for each fragment.]

To set a fragment write breakpoint for a given fragment to trigger for whichever entity is selected:

- Open the **Fragments** tab.
- Find the desired fragment.
- Click the **Break on writes for the selected entity** button.
- Use the **Entities** tab or the **Gameplay Debugger Tool** (“EnableGDT” console command) to select an entity.

[image: Image of the Fragments tab and how to select a specific entity with a circle toggle.]

## Limitations

- Breakpoints functionality has only been tested in Visual Studio 2022 and might not be supported in other IDEs
- Breakpoints only trigger for code that uses MassExecutionContext::CreateEntityIterator for entity iteration
- Fragment inspection requires UPROPERTY RTTI and thus will only show member variables with UPROPERTY markup

On this page

- Overview (-> mass-debugger-overview)
- Using the Mass Debugger (-> mass-debugger-overview)
- UI Workflow (-> mass-debugger-overview)
- Limitations (-> mass-debugger-overview)
