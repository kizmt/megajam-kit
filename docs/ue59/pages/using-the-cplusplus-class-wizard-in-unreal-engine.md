# C++ Class Wizard

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-the-cplusplus-class-wizard-in-unreal-engine?application_version=5.9

> An overview of the C++ Class Wizard in Unreal Engine.

[image: C++ Class Wizard]

Windows
 macOS
 Linux

The **C++ Class Wizard** provides a fast and easy way to add native C++ code classes into your project for you to extend
with your own functionality, if you wish. This converts a content-only project into a code project. You can access the C++ Class Wizard and create a new C++ class by following these steps:

Check Setting Up Visual Studio to ensure that you have a compatible version of Visual Studio installed before proceeding. For information about the correct version of Xcode, refer to the Unreal Engine Release Notes (-> whats-new).

- In the main editor, select **Tools > New C++ Class...** [image: Open a new CPP class from the menu bar.]

- The **C++ Class Wizard** will appear and show **Common Classes** by default. If you do not see the class you are looking for, you can view the entire Class hierarchy listing by selecting **All Classes**. |  |  |
| --- | --- |
|  |  |
| Common Classes | All Classes |

- Choose the Class you want to add. For the purposes of this demonstration, we will choose to create a new **Actor** Class. Select the **Actor** Class, then click **Next >**.

- You will then be prompted to enter a **Name** for your new Class. Do so, then click **Create Class**. This will create the header (`.h`) and source (`.cpp`) files. Class names can only contain alphanumeric characters and cannot contain spaces. The field will notify you if you enter an invalid name.

- In Unreal Engine, **Live Coding** is now enabled by default. A Live Coding window will appear and compile the new class files that were created.

- The code will immediately open in Visual Studio, ready for editing. The code will immediately open in Xcode, ready for editing.

- programming

Related documents

Compiling Game Projects

 [image: Compiling Game Projects] (-> compiling-game-projects-in-unreal-engine-using-cplusplus)
