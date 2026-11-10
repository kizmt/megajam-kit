# Rider Setup Guide

https://dev.epicgames.com/documentation/en-us/unreal-engine/rider-setup-guide?application_version=5.9

> Step through some of the basic steps when you first launch Rider.

Rider is a fast and fully-featured IDE for Unreal Engine. It delivers insights on code and Blueprints, assists with reflection specifiers, provides safe refactorings, and offers advanced code completion. Try Rider for Unreal! Compared to Visual Studio, Rider has:

- Better code navigation and auto-completion
- Better performance (less freezing)
- Better debugging and console support

## Step-by-step guide

- Install RiderGet the latest version from the Jetbrains website .

- Visit the Jetbrains MarketplaceInstall the EzArgs plugin.

- Apply these setting for your RAM setupSet your RAM to 64 gb (Rider will not function with its default RAM settings).**Help > Edit Custom VM Options**
- Then enter `-Xmx64g`
- **Save** your modifications as a file[image: Edit-custom-vm-options-command-line]

- Configure your **dotnet.exe** and **MSBuild** version paths (these settings are not the default settings).Go to **Settings > Build, Execution, Deployment > Toolset and Build**
- Adjust your file paths (see step e for an example MSBuild file path)
- Under **Build**, set parallel process to **1**
- Under **Design Time Build**, set parallel processes to **64**[image: Toolset-and-Build-options] Click image to expand.
- Select the **path** for the MSBuild version[image: Selecting-the-MSbuild-path-file] Click image to expand.
- Unlike with some tools, you need to explicitly save your settings changes. **Save to This computer** so that your settings carry over to all your work streams.[image: Save-to-this-computer]
- Enable indexing on plugins so that you get full code support (syntax, refactoring, completion, finding definitions, dependency analysis etc.) in the Harmonic and other plugins. From **Settings > Languages & Frameworks > C++ > Unreal Engine**, under **Code Indexing**, select the checkbox for **Index plugins**.[image: Enable-indexing-plugins]

## Remove Warning when Editing Files in a Changelist

By default Rider will warn you about editing files that are not in the **default** changelist. You can disable it by:

- Unchecking **Highlight files with changelist conflict**. (**Settings > Version Control > Changelists**)[image: highlight-files-with-changelists]
- Alternately, use the Active/Inactive changelist system in Rider. Go to the Perforce icon in the lower left panel to see all your open changelists. Set one of them to be the “active” one, and only work within those files.

## Open Code in Rider from the Unreal Editor

When you click on a BP node in the editor or a C++ class from the Content Browser, you want it to open Rider, rather than MSVC (Microsoft Visual C+ compiler).

In the Unreal Editor, go to **Edit > Editor Preferences… > search for: source code editor**, and set the dropdown to **Rider**.

[image: General-source-code-editor-in-search-bar]

## Additional Options

### Show Whitespace and Set the Color

In **Rider’**s opening dialog box, go to **Configure > Settings > Editor** to access whitespace and text settings:

- Show/hide whitespace (and other text settings): **Color Scheme > General > Text > Whitespaces**[image: Text-options-in-rider-menu]
- Go to **Color Scheme > Color Scheme Font** to select from a menu of color options[image: Color-scheme-fonts]

### Show Selected in Explorer

In **Rider**, view where your currently open file is in the directory structure.

- Select the **Folder icon** in the left side-menu for Explorer View.
- (Usually) You can find your file in the left panel, two folders down in the file tree.[image: Viewing-a-file-in-the-directory]
- When an editor tab is selected, you can use this setting to have the corresponding file in Project view be selected. From **Project View Options > Behavior > Always Select Opened File**, toggle the setting to **ON**.[image: Always-select-open-file-option-toggled-on]

### Highlighting

By default this is turned off, and files have minimal syntax highlighting.

In Rider’s opening dialog box, go to **Settings > Editor > Inspection Settings > Enable Code Analysis**

### Does Unreal Game Sync run into problems with Unreal Build Tool already running (while Rider is open)?

By default, Rider regenerates the project when it detects a change to the project files or configuration. This will invoke UBT at some point, and UBT will usually still be running when UGS gets to building post-sync.

**Settings > Languages & Frameworks > C/C++ > Unreal Engine**, under Project model, select/deselect (as needed) **Regenerate project properties on project files change**.

[image: Regenerate-project-properties-checkbox]

On this page

- Step-by-step guide (-> rider-setup-guide)
- Remove Warning when Editing Files in a Changelist (-> rider-setup-guide)
- Open Code in Rider from the Unreal Editor (-> rider-setup-guide)
- Additional Options (-> rider-setup-guide)
- Show Whitespace and Set the Color (-> rider-setup-guide)
- Show Selected in Explorer (-> rider-setup-guide)
- Highlighting (-> rider-setup-guide)
- Does Unreal Game Sync run into problems with Unreal Build Tool already running (while Rider is open)? (-> rider-setup-guide)
