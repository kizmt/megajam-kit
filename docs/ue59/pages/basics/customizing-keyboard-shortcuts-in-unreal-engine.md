# Customizing Keyboard Shortcuts

https://dev.epicgames.com/documentation/en-us/unreal-engine/customizing-keyboard-shortcuts-in-unreal-engine?application_version=5.9

> Change keyboard shortcuts for common commands in Unreal Engine and create new shortcuts to suit your workflows.

[image: Customizing Keyboard Shortcuts]

**Keyboard shortcuts**, also known as **keybinds**, are combinations of key presses on your keyboard that execute specific commands or actions. You can configure the shortcuts for common commands, as well as some tool-specific commands, to suit your workflow and personal preferences. To do this, open the **Editor Preferences** window: from the main menu, go to **Edit > Editor Preferences**, then select the **Keyboard Shortcuts** section.

 [image: Keyboard Shortcuts editor in Unreal Engine]

The Keyboard Shortcuts editor in the Editor Preferences window.

Commands are grouped by functional area. Each command can have up to two keyboard shortcuts associated with it.

## Creating a New Keyboard Shortcut

- Click inside the **text field** for the command you want to bind to a keyboard shortcut.

- Press the combination of keys you want to use to execute the command. [image: Adding a new keyboard shortcut]

Unreal Engine will automatically save the new shortcut when you click anywhere outside the text field.

If the combination of keys you pressed is already bound to another command, you will see a warning.

 [image: Keyboard shortcut already exists]

If you want to remove the existing binding and assign the keyboard shortcut to the new command, click the **Override** button. If you want to keep the existing binding and cancel the new one, click anywhere outside the text field.

## Removing an Existing Keyboard Shortcut

To remove an existing keyboard shortcut, click the **Delete** (**X**) button next to it.

 [image: Removing a keyboard shortcut]

## Importing and Exporting Keyboard Shortcuts

You can migrate your custom keybinds between different installations of Unreal Engine by exporting them as an `.ini` file that you can then import into another UE installation. This is useful, for example, if you work on different computers, or if you rebuild or reinstall Unreal Engine often.

To save your custom keybinds as an `.ini` file, click the **Export** button. To import a set of custom keybinds from an `.ini` file, click the **Import** button. Both of these buttons are located at the top of the **Keyboard Shortcuts** editor.

 [image: Export and Import buttons in the Keyboard Shortcuts editor]

Location of the Export and Import buttons.

-

On this page

- Creating a New Keyboard Shortcut (-> customizing-keyboard-shortcuts-in-unreal-engine)
- Removing an Existing Keyboard Shortcut (-> customizing-keyboard-shortcuts-in-unreal-engine)
- Importing and Exporting Keyboard Shortcuts (-> customizing-keyboard-shortcuts-in-unreal-engine)
