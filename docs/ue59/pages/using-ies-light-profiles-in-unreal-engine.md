# IES Light Profiles

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-ies-light-profiles-in-unreal-engine?application_version=5.9

> An overview of setting up and using IES textures with lights.

[image: IES Light Profiles]

The Illuminating Engineering Society (IES) has defined a file format which describes a light's distribution from a light source using real world measured data. These IES Photometric files, or **IES Profiles**, are a lighting industry standard method of diagramming the brightness and falloff of light as it exists a particular real world light fixture. It enables them to account for reflective surfaces in the light fixture, the shape of the light bulb, and any lensing effects that happens. This type of photometric lighting is primarily used in Enterprise fields (such as Media and Entertainment or Architecture and Manufacturing), but is often used in games production to achieve realistic lighting effects, too.

IES Light Profiles are a 1D texture (gradient). However, they are not actual texture files. The curve defines light intensity in an arc that "sweeps" around an axis to make Point, Spot, and Rect Lights appear to be casting light realistically based on the provided real-world data. The curve works like a multiplier for the overall brightness of the light, as if you were projecting a texture from a light, but without the overhead of using a texture, or the errors that can occur at some angles.

In the examples below, the IES Profile is assigned to a Point Light and the diagram in the top left of each panel shows the shape of the given IES Profile.

[image: Examples of using IES Profiles]

Click the image for full size.

If you were to open an IES Profile in a text editor, you would find that it is an ASCII file containing a wide array of metadata, like this example for a Lithonia TE_150S_E17_C:

 C++

```
IESNA:LM-63-2002
	[TEST] 11915
	[TESTDATE] 1/31/2008
	[ISSUEDATE] 1/24/2014
	[TESTLAB] ACUITY BRANDS LIGHTING CONYERS LAB
	[TESTMETHOD] IES LM-46:2004
	[MANUFAC] Lithonia Lighting
	[LUMCAT] TE 150S E17 C (SC=1.0)
	[LUMINAIRE] PREMIUM ENCLOSED HIGHBAY INDUSTRIAL WITH ALUMINUM REFLECTOR, CLEAR TEMPERED GLASS LENS, AND CONCENTRATING DISTRIBUTION
	[LAMPCAT] LU150
```

## Usage

Use the following steps to use your own IES Profiles:

### Importing and Assigning to Lights

- Import an IES Profile by using one of the available import methods for textures (-> datasmith-import-options-in-unreal-engine): using the **Add** button, drag-and-drop, or context menu.
- Select a Point (-> point-lights-in-unreal-engine), Spot, or Rect Light (-> rectangular-area-lights-in-unreal-engine) from your scene. Under the **Details** panel, assign the light profile to the **IES Texture** slot under **Light Profiles**.[image: Assigning the light profile to the IES Texture]

Using a light profile with precomputed **Static** lighting builds can potentially produce poor results due to the light profile's mask and a low lightmap resolution. Increasing the lightmap resolution of the receiving surface or using **Stationary** or **Movable** Lights produce the best result.

### Profile Light Intensity

Optionally, you can choose to use IES Profile's light intensity over the Light's **Intensity**:

[image: Setting up IES intensity options]

- **Use IES Intensity** uses the light brightness from the profile, and when disabled will use the selected light's intensity value.
- **IES Intensity Scale** globally scales the profile's brightness contribution. This value can only be set when **Ues IES Intensity** is enabled.

### Texture Properties

When opening an IES Profile, the Texture Editor provides a couple of options under **Texture Light Profiles** that you can set:

[image: Setting up Texture Editor options]

Click the image for full size.

| Property | Description |
| --- | --- |
| **Brightness** | The light brightness in candelas imported from the IES Profile. When enabling **Use IES Intensity** on the light and this value is less than or equal to 0, the profile will be used for masking only, causing the light to be completely masked by the profile. Also, this should be used in conjunction with the light's setting for **Inverse Squared Falloff**. |
| **Texture Multiplier** | This uneditable value is the multiplier used to map texture value to a result that is integrated over a sphere to 1.0f. |

### 3D Light Profile Visualization

When selecting a light that has an IES Texture assigned, a visualization of the light's representation will be shown.

 [image: Without Light Selected]

 [image: With Light Selected]

## Additional Notes

### Performance

IES Profiles render very fast and do not have a significant effect on performance, making them a more ideal option for shaping your light than a Light Function.

### Spot Lights

Using IES Profiles on any Point or Rect Lights turns them—visually speaking—into Spot Lights and using them on a Spot Light will operate the same way except the Spot Light's cones will mask the IES Profile effect. However, since the projection area of a Spot Light is a 179 degree arc (at its maximum), any IES data past that point is lost.

 [image: Lights Selected]

 [image: Lights Unselected]

In this comparison, the IES profile emits light in all directions. When used by a Spot Light, the IES data is clipped to the Spot Light's **Cone Angle**. When used by a Point Light, the IES profile is unclipped.

### Acquiring and Previewing Light Profiles

The easiest way to acquire IES Profiles is to visit the manufacturer's website and download them, as almost all major lighting manufacturers provide them free of charge. A couple of links are provided below:

- Lithonia Lighting
- Philips

To visualize the light's IES Profile, you can use photometric viewers, such as IESviewer, which is freely available. With it, you can select a light profile, visualize the profile and preview what it would look like before you decide to import it.

[image: IESviewer]

Image credit to Andrey Legotin.

Some manufacturer sites, such as Lithonia's site, have a built-in profile viewer that can be used in your web broswer without needing to download the profile to preview it.

- rendering
- lighting
- shadows

On this page

- Usage (-> using-ies-light-profiles-in-unreal-engine)
- Importing and Assigning to Lights (-> using-ies-light-profiles-in-unreal-engine)
- Profile Light Intensity (-> using-ies-light-profiles-in-unreal-engine)
- Texture Properties (-> using-ies-light-profiles-in-unreal-engine)
- 3D Light Profile Visualization (-> using-ies-light-profiles-in-unreal-engine)
- Additional Notes (-> using-ies-light-profiles-in-unreal-engine)
- Performance (-> using-ies-light-profiles-in-unreal-engine)
- Spot Lights (-> using-ies-light-profiles-in-unreal-engine)
- Acquiring and Previewing Light Profiles (-> using-ies-light-profiles-in-unreal-engine)
