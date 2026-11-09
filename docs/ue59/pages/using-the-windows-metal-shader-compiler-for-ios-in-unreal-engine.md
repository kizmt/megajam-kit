# Windows Metal Shader Compiler

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-the-windows-metal-shader-compiler-for-ios-in-unreal-engine?application_version=5.9

> Use the Windows Metal Shader Compiler for iOS

[image: Windows Metal Shader Compiler]

The Windows Metal shader compiler currently does not work in UE 5.1 through UE 5.4.

**Unreal Engine** can compile shaders for Apple's **Metal** API on a Windows machine, greatly simplifying the workflow for iOS applications. To enable this functionality, you need to install Apple's **Metal Developer Tools for Windows**. Unreal Engine will automatically use this toolset once it is set up.

## Steps

To install Metal Developer Tools for Windows, follow these steps:

- Sign in to your **Apple Developer Account** in your web browser, then navigate to the **Downloads** section.
- In the tabs on the upper-right of the Downloads page, click the **Release** tab.[image: The Beta Downloads page]
- In the Software Downloads page, click the **Applications** button.[image: The Applications button]
- Scroll down the page until you find the entry for **Metal Developer Tools for Windows**, then click the **Download** button to download the installer.[image: The entry for Metal Developer Tools for Windows] The download entry for the Metal Developer Tools for Windows. Click to enlarge image. Different versions of UE require different versions of the Metal Developer Tools.UE 5.5: As shown.
- UE 5.6: Use version 4.4
- UE 5.7: Use version 5.3

- Run the installer to install the Metal Developer Tools.

## Final Result

Once you have completed setup for the Metal Developer Tools for Windows, your Windows installation of Unreal Engine will be able to compile shaders for Metal 2.0. No additional setup is required.

- shaders
- ios
- tvos
- ipados
- metal
- shader compiler
- metal shader compiler
- platform delivery

On this page

- Steps (-> using-the-windows-metal-shader-compiler-for-ios-in-unreal-engine)
- Final Result (-> using-the-windows-metal-shader-compiler-for-ios-in-unreal-engine)
