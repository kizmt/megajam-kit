# Archicad

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-datasmith-with-archicad-in-unreal-engine?application_version=5.9

> How to import Datasmith scenes from Graphisoft Archicad into Unreal Engine.

[image: Archicad]

This page describes how **Datasmith** imports scenes from **Graphisoft Archicad** into **Unreal Engine**. It follows the basic process outlined in the Datasmith Overview (-> datasmith-plugins-overview) and Datasmith Import Process (-> datasmith-import-process-in-unreal-engine), but it provides additional details on the Direct Link workflow and translation behaviors specific to Archicad. If you are planning to use Datasmith to import scenes from Archicad to Unreal Engine, reading this page can help you understand how your scene is translated, and how you can work with the imported scene in Unreal Editor.

## Archicad Workflows

### Datasmith DirectLink

With the DirectLink workflow, you can set up a Datasmith DirectLink between Archicad and Unreal Engine or Twinmotion. This link updates your Unreal Engine level or Twinmotion model, removing the need to re-export a `*.udatasmith` file from your Archicad scene every time you make a change.

### Export Workflow

Using the Export workflow, a `.udatasmith` file can be exported from Archicad for use in Unreal Engine or Twinmotion. For more information on exporting Datasmith content from Archicad, see Exporting Datasmith Content from Archicad (-> exporting-datasmith-content-from-archicad-to-unreal-engine).

For more information importing `.udatasmith` files into Unreal Engine, see Importing Datasmith Content into Unreal Engine (-> importing-datasmith-content-into-unreal-engine).

## Using the Datasmith Toolbar

The Datasmith plugin adds the Datasmith toolbar option to the **Windows > Palettes** menu.

 [image: image alt text]

Datasmith DirectLink toolbar.

| Action | Button | Description |
| --- | --- | --- |
| Synchronize with Direct Link |  | Pushes the selected models to Unreal Engine or Twinmotion through the Direct Link connection. |
| Manage Connections |  | Launches the Connection Status dialog. |
| Export to Datasmith File |  | Launches the existing `.udatasmith` exporter, used to save a `.udatasmith` file to disk. |
| Show Messages |  | Launches the messages and logging window. This is useful for reporting errors, missing textures, and other information. |

## Geometry, Layers, and Scene Hierarchy

Archicad objects are imported into Unreal Engine as a single Actor composed of several nested Static Mesh components.

 [image: World Outliner showing the hierarchy of an imported Archicad file.]

World Outliner showing the hierarchy of an imported Archicad file.

Each Actor in the World Outliner represents a Layer in Archicad and is visible from the Layers panel in Unreal Editor.

 [image: Layers represented by Actors in the World Outliner are also represented as layers in the Layer panel.]

Layers represented by Actors in the World Outliner are also represented as layers in the Layer panel.

Object pivot points are imported into Unreal Engine and they retain their same locations from Archicad. However, in some cases due to Archicad SDK limitations, it is possible that pivot locations will not be correctly defined resulting in a mismatch like the one shown below.

 [image: Notice that the pivot point for the chair is different in the Editor than in Archicad.]

Notice that the pivot point for the chair is different in the Editor than in Archicad.

## HotLinks Modules

Unreal Engine retains your Archicad HotLink external references that contain 3D elements by importing them as an extra Actor with nested Static Meshes into the Level.

## Materials

Unreal Engine builds Materials in the Datasmith scene using a Physically Based Rendering (PBR) graph, where the Master materials are built in realtime by the Datasmith Importer. This process retains the look of the Archicad materials when importing them into Unreal Engine.

 [image: The export plugin retains the look of Materials from Archicad when importing into Unreal Engine.]

The export plugin retains the look of Materials from Archicad when importing into Unreal Engine.

There are two types of materials in Archicad:

- Standard materials derived from surface attributes.

- Materials derived from GDL objects.

### Standard Archicad Materials

Materials from Archicad are exported as PBR materials and imported into Unreal Engine with the following attributes being retained:

- Base color

- Texture transparency

- UV size and more

 [image: Properties highlighted in green are considered by the Datasmith exporter.]

Properties highlighted in green are considered by the Datasmith exporter.

### GDL and Two-Sided Materials

All architectural objects within Archicad are considered closed objects and are exported with materials that are one-sided.

Objects that are thin, such as GDL and Morph objects, export with materials that are two-sided. When this happens, the material name will be appended with a `_DS` suffix to maintain separation in Unreal Engine from single-sided materials.

 [image: The highlighted material is double sided and the name contains the _DS suffix.]

The highlighted material is double sided and the name contains the _DS suffix.

## Lights

The Datasmith exporter supports basic light types and their parameters. Area lights are imported into Unreal Engine as point lights. Environment and parallel lights are not supported.

 [image: A variety of light types imported from Archicad into Unreal Engine.]

A variety of light types imported from Archicad into Unreal Engine.

| Archicad Light Type | Unreal Engine Light Class | Supported Parameters | Unsupported Parameters |
| --- | --- | --- | --- |
| **General Light** | Point Light | Intensity Color Falloff Distance Absolute Light Intensity | Shadow casting parameters (Opacity and Quality) |
| **Spot Light** | Spot Light | Intensity Color Falloff Distance Absolute Light Intensity Fade out between inner and outer angles | Shadow casting parameters (Opacity and Quality) Spot light geometry (limited to circle) |
| **IES Light** | Point Light with IES profile | Intensity Color Falloff Distance Absolute Light Intensity IES Shape IES Intensity | Shadow casting parameters (Opacity and Quality) Use Area Shape and Size given in Photometric file IES Light Quality/Grainy Illumination |
| **Area Light** | Datasmith Area Light | Intensity Color Falloff Distance Absolute Light Intensity Size Length/Width | Shadow casting parameters (Opacity and Quality) Use Area Shape and Size given in Photometric file IES Light Quality/Grainy Illumination |
| **Parallel Light** | Not Supported | Not Supported | Not Supported |
| **Sun Object** | Not Supported | Not Supported | Not Supported |
| **Window Light** | Not Supported | Not Supported | Not Supported |

## Cameras

The current viewpoint in Archicad at the time of export is imported into Unreal Engine as a Camera Actor named "Current View." The following camera properties are supported:

- Transform

- Sensor Width and Height

- Focal Length Min and Max

- FStop Min and Max

- Focus Distance

- Current Focal Length

- Current Aperture

 [image: Archicad camera settings retained during the import into Unreal Engine.]

Archicad camera settings retained during the import into Unreal Engine.

Unreal Engine also supports Path Cameras. They are imported as Camera Actors under a Scene Actor using the Path name in Archicad.

 [image: Path Cameras in Archicad.]
 [image: Camera Actors in the World Outliner.]

Path Cameras are supported and are imported into the World Outliner as Camera Actors.

## Metadata and Classifications

Most properties within Archicad are exported to Unreal Engine as MetaData when:

- The element name Key ID value is the same as the element's name. For example, the ID value for a door is "Wooden_Door".

- The key value uses a specific classifications, including: Key value uses the classification System suffixed with "_ID".

- Key value uses the classification System suffixed with "_Name". This is generally empty.

- Key value uses the classification System suffixed with "_Description". This is generally empty.

- Categories key values contain the prefix "CAT_Xyz"

- IFCProperties key values contain the prefix "IFC_Xyz"

- IFCAttributes key values contain the prefix "IFC_Attribute_Xyz"

Undefined metadata will not be exported.

For example, if you were to export a Door from Archicad:

 [image: Properties of a wooden door in Archicad.]

Properties of a wooden door in Archicad.

It would export as:

```

<MetaData name="MetaData_95D3E85A-69DE-4E5D-993D-74480D3FBDBA" reference="Actor.95D3E85A-69DE-4E5D-993D-74480D3FBDBA">
	<KeyValueProperty name="ID" type="String" val="Porte_Bois"/>
	<KeyValueProperty name="ARCHICAD_Classification_ID" type="String" val="Door"/>
	<KeyValueProperty name="CAT_Position" type="String" val="Interior"/>
	<KeyValueProperty name="CAT_Renovation_Status" type="String" val="Existing"/>
	<KeyValueProperty name="CAT_Show_On_Renovation_Filter" type="String" val="All Relevant Filters"/>
	<KeyValueProperty name="CAT_Structural_Function" type="String" val="Non-Load-Bearing Element"/>
	<KeyValueProperty name="IFC_ProductionYear" type="String" val="2021"/>
	<KeyValueProperty name="IFC_AcousticRating" type="String" val="patate"/>
	<KeyValueProperty name="IFC_FireRating" type="String" val="radis"/>
	<KeyValueProperty name="IFC_IsExternal" type="String" val="False"/>
	<KeyValueProperty name="IFC_FireResistanceRating" type="String" val="pastop"/>
	<KeyValueProperty name="IFC_IsCombustible" type="String" val="False"/>
	<KeyValueProperty name="IFC_SerialNumber" type="String" val="serialnumber"/>
	<KeyValueProperty name="IFC_Renovation_Status" type="String" val="Existing"/>
	<KeyValueProperty name="IFC_Attribute_GlobalId" type="String" val="2Lq_XQQTvENPazT4WDFxsw"/>
	<KeyValueProperty name="IFC_Attribute_Name" type="String" val="TestCustomName"/>
	<KeyValueProperty name="IFC_Attribute_Tag" type="String" val="95D3E85A-69DE-4E5D-993D-74480D3FBDBA"/>
	<KeyValueProperty name="IFC_Attribute_OverallHeight" type="String" val="210.00"/>
	<KeyValueProperty name="IFC_Attribute_OverallWidth" type="String" val="90.00"/>
</MetaData>
```

<MetaData name="MetaData_95D3E85A-69DE-4E5D-993D-74480D3FBDBA" reference="Actor.95D3E85A-69DE-4E5D-993D-74480D3FBDBA">
 <KeyValueProperty name="ID" type="String" val="Porte_Bois"/>
 <KeyValueProperty name="ARCHICAD_Classification_ID" type="String" val="Door"/>
 <KeyValueProperty name="CAT_Position" type="String" val="Interior"/>
 <KeyValueProperty name="CAT_Renovation_Status" type="String" val="Existing"/>
 <KeyValueProperty name="CAT_Show_On_Renovation_Filter" type="String" val="All Relevant Filters"/>
 <KeyValueProperty name="CAT_Structural_Function" type="String" val="Non-Load-Bearing Element"/>
 <KeyValueProperty name="IFC_ProductionYear" type="String" val="2021"/>
 <KeyValueProperty name="IFC_AcousticRating" type="String" val="patate"/>
 <KeyValueProperty name="IFC_FireRating" type="String" val="radis"/>
 <KeyValueProperty name="IFC_IsExternal" type="String" val="False"/>
 <KeyValueProperty name="IFC_FireResistanceRating" type="String" val="pastop"/>
 <KeyValueProperty name="IFC_IsCombustible" type="String" val="False"/>
 <KeyValueProperty name="IFC_SerialNumber" type="String" val="serialnumber"/>
 <KeyValueProperty name="IFC_Renovation_Status" type="String" val="Existing"/>
 <KeyValueProperty name="IFC_Attribute_GlobalId" type="String" val="2Lq_XQQTvENPazT4WDFxsw"/>
 <KeyValueProperty name="IFC_Attribute_Name" type="String" val="TestCustomName"/>
 <KeyValueProperty name="IFC_Attribute_Tag" type="String" val="95D3E85A-69DE-4E5D-993D-74480D3FBDBA"/>
 <KeyValueProperty name="IFC_Attribute_OverallHeight" type="String" val="210.00"/>
 <KeyValueProperty name="IFC_Attribute_OverallWidth" type="String" val="90.00"/>
</MetaData>

Classifications can be added and edited within Archicad using the Classification Manager:

 [image: The Classification Manager within Archicad is used to add additional Classifications.]

The Classification Manager within Archicad is used to add additional Classifications.

This menu can be found by clicking the **Classification Manager** option in the **Windows** menu.

## Actor Tags

Archicad technical data can be exported to Unreal Engine by leveraging Actor Tags within the editor. The data stored within Actor Tags can then be used to perform a variety of operations using Visual Dataprep, Python scripting, and more.

Currently the Datasmith plugin exports:

- ID

- Type

- LibPart (Main, Rev, Name)

 [image: Tag values are imported into Unreal as Actor Tags.]

Tag values are imported into Unreal as Actor Tags.

- datasmith
- archicad

On this page

- Archicad Workflows (-> using-datasmith-with-archicad-in-unreal-engine)
- Datasmith DirectLink (-> using-datasmith-with-archicad-in-unreal-engine)
- Export Workflow (-> using-datasmith-with-archicad-in-unreal-engine)
- Using the Datasmith Toolbar (-> using-datasmith-with-archicad-in-unreal-engine)
- Geometry, Layers, and Scene Hierarchy (-> using-datasmith-with-archicad-in-unreal-engine)
- HotLinks Modules (-> using-datasmith-with-archicad-in-unreal-engine)
- Materials (-> using-datasmith-with-archicad-in-unreal-engine)
- Standard Archicad Materials (-> using-datasmith-with-archicad-in-unreal-engine)
- GDL and Two-Sided Materials (-> using-datasmith-with-archicad-in-unreal-engine)
- Lights (-> using-datasmith-with-archicad-in-unreal-engine)
- Cameras (-> using-datasmith-with-archicad-in-unreal-engine)
- Metadata and Classifications (-> using-datasmith-with-archicad-in-unreal-engine)
- Actor Tags (-> using-datasmith-with-archicad-in-unreal-engine)
