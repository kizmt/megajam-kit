# Materials

https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-materials?application_version=5.9

> Controlling the appearance of surfaces in the world using shaders.

[image: Materials]

**Materials** in Unreal Engine define the surface properties of the objects in your scene. In the broadest sense, you can think of a Material as the "paint" that is applied to a mesh to control its visual appearance.

In more technical terms, Materials tell the render engine exactly how a surface should interact with the light in your scene. Materials define every aspect of the surface including color, reflectivity, bumpiness, transparency, and so on. These calculations are done using data that is input to the Material from a variety of images (textures) and node-based **Material expressions**, as well as from various property settings (-> unreal-engine-material-properties) inherent to the Material itself.

## Getting Started

Material creation is a broad topic, and the node-based workflow allows you to create an almost infinite variety of surface types. Beginners are recommended to start with with the pages linked in this section. The Essential Material Concepts and Physically Based Materials pages introduce the theory and ideas that form the foundation of Material creation in Unreal. The Material Editor User Guide is a set of tool-based documentation that teaches practical aspects of using the Material Editor.

- [image: Essential Material Concepts] Essential Material ConceptsAn introductory document on Materials in Unreal Engine. (-> essential-unreal-engine-material-concepts)

- [image: Designing Visuals, Rendering, and Graphics] Designing Visuals, Rendering, and GraphicsRendering subsystem including lighting and shadowing, materials and textures, visual effects, and post processing. (-> designing-visuals-rendering-and-graphics-with-unreal-engine)

- [image: Physically Based Materials] Physically Based MaterialsAn overview of the primary physically based Material inputs and how best to use them. (-> physically-based-materials-in-unreal-engine)

- [image: Material Editor Guide] Material Editor GuideLearn about Unreal Engine's node-based material editor to create materials which define the appearance and surface properties of objects in your scene. (-> unreal-engine-material-editor-user-guide)

- [image: Material Properties] Material PropertiesAn introductory document on Material Properties in Unreal Engine. (-> unreal-engine-material-properties)

- [image: Material Inputs] Material InputsAn in-depth look at the various inputs available on a Material and how they are used. (-> material-inputs-in-unreal-engine)

- [image: Material Data Types] Material Data TypesAn introduction to the four types of float data in the Material Editor (-> material-data-types-in-unreal-engine)

## Substrate Material Framework

- [image: Substrate Materials] Substrate MaterialsTopics and reference about using the Substrate Materials framework. (-> substrate-materials-in-unreal-engine)

- [image: Substrate Materials] Substrate MaterialsTopics and reference about using the Substrate Materials framework. (-> substrate-materials-in-unreal-engine)

- [image: Substrate Materials] Substrate MaterialsTopics and reference about using the Substrate Materials framework. (-> substrate-materials-in-unreal-engine)

## Material Workflow Concepts

Once you understand the basic principles behind Material creation, the documents in this section are strongly recommended as a next step. **Material Instances** and **Material Functions** are foundational topics in Material creation, and help you optimize your workflow to save time and avoid doing the same work twice. Material Instances allow you or other artists on your team to quickly and easily customize Materials to produce multiple variations (or instances) from a single parent Material. Material Functions allow you to package parts of a Material graph into a single node, and share it to a common library for reuse in other Materials.

- [image: Material Instances] Material InstancesHierarchical Material relationships help you alter the behavior and appearance of child Materials without recompiling the shader. (-> instanced-materials-in-unreal-engine)

- [image: Material Functions] Material FunctionsSnippets of Material that you can save in packages and reuse across multiple Materials. (-> material-functions-in-unreal-engine)

- [image: Layered Materials] Layered MaterialsTwo methods for layering Materials to create complex, unique surfaces. (-> layering-materials-in-unreal-engine)

## Tutorials Index

The pages in this section are step-by-step, project based documents that walk you through some specific aspect of Material creation in Unreal. For example: Animating UV Coordinates (-> animating-uv-coordinates-in-unreal-engine), or Using Texture Masks (-> using-texture-masks-in-unreal-engine).

- [image: Materials Tutorials] Materials TutorialsTutorials demonstrating various aspects of Material creation in Unreal Engine. (-> unreal-engine-materials-tutorials)

## Material Reference Pages

The Material Editor (-> unreal-engine-material-editor-user-guide) provides dozens of **Material Expressions** and **Functions**, each meant to perform some specific task in your Material graph. If you are looking for information about how and when to use a specific node, start with the pages linked below. The Material Expression and Function reference pages are organized according to their categories in the Materials palette — for example, Blends, Gradients, Math, Coordinates, and so on.

- [image: Material Expressions Reference] Material Expressions ReferenceReference for all Material expressions available for use in the Material Editor. (-> unreal-engine-material-expressions-reference)

- [image: Material Functions Reference] Material Functions ReferenceReference pages for each of the default Material Functions, organized by category. (-> unreal-engine-material-functions-reference)

- [image: Material Editor UI] Material Editor UIA breakdown of the Material Editor user interface. (-> unreal-engine-material-editor-ui)

- [image: Material Instance Editor UI] Material Instance Editor UIGuide to using the Material Instance Editor for modifying MaterialInstanceConstants. (-> unreal-engine-material-instance-editor-ui)

## Additional Concepts and Tools

Materials pages that do not fit more precisely into another category are found below. Many of these are intermediate to advanced topics that allow you to progress beyond the basics of Material creation and begin to develop more sophisticated Materials for your projects.

- [image: Bent Normal Maps] Bent Normal MapsAn overview of using Bent Normal maps in Unreal Engine. (-> bent-normal-maps-in-unreal-engine)

- [image: Bump Mapping Without Tangent Space] Bump Mapping Without Tangent SpaceHow to achieve bump mapping from 3D procedural shaders where classic tangent space does not work. (-> bump-mapping-without-tangent-space-in-unreal-engine)

- [image: Curve Atlases in Materials] Curve Atlases in MaterialsCurve Atlases store a combination of Curve assets that enables you to access Curve Linear Color data through your Materials. (-> curve-atlases-in-unreal-engine-materials)

- [image: Customized UVs] Customized UVsFeature that allows running calculations in the vertex shader to increase performance over running them per-pixel. (-> customized-uvs-in-unreal-engine-materials)

- [image: Material Analyzer] Material AnalyzerThis page describes how to locate and use the Material Analyzer tool. (-> unreal-engine-material-analyzer-tool)

- [image: Refraction Using Pixel Normal Offset] Refraction Using Pixel Normal OffsetOverview of the Refraction Mode for Pixel Normal Offset in your Materials. (-> refraction-using-pixel-normal-offset-in-unreal-engine)

- [image: Storing Custom Data in Materials Per-Primitive] Storing Custom Data in Materials Per-PrimitiveAn overview of the Custom Primitive Data workflow for storing custom data per primitive that's accessible through Blueprint. (-> storing-custom-data-in-unreal-engine-materials-per-primitive)

- [image: Lit Translucency] Lit TranslucencyExplanation of how translucent surfaces are lit and cast shadows including self-shadows. (-> lit-translucency-in-unreal-engine)

- materials
- shaders

On this page

- Getting Started (-> unreal-engine-materials)
- Substrate Material Framework (-> unreal-engine-materials)
- Material Workflow Concepts (-> unreal-engine-materials)
- Tutorials Index (-> unreal-engine-materials)
- Material Reference Pages (-> unreal-engine-materials)
- Additional Concepts and Tools (-> unreal-engine-materials)
