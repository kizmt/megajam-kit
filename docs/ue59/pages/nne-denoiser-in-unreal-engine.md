# NNE Denoiser

https://dev.epicgames.com/documentation/en-us/unreal-engine/nne-denoiser-in-unreal-engine?application_version=5.9

> The default denoiser for path tracing using different versions of Intel's Open Image Denoiser or that can be used with custom models.

[image: NNE Denoiser]

The **NNE Denoiser** is a path tracer denoiser that allows importing and running custom neural denoiser networks through the NNE runtimes. Models are imported as regular **UNNEModelData** assets and the denoising inference can be run on CPU, GPU or RDG depending on the capabilities of the selected runtime.

The plugin ships with different versions of Intel’s Open Image Denoiser (fast, balanced and high quality, each with and without alpha) that can be used instead of a custom model.

## Changing Presets

The NNEDenoiser plugin settings allow the user to select a denoiser asset for spatial denoising, whether they are run on CPU, GPU or RDG and which runtime to be used. To let the path tracer use the neural networks defined in these settings, you need to set `r.PathTracing.Denoiser.Name` to `NNEDenoiser`.

### Denoiser Asset

Models together with their input and output mapping are described inside data assets. Changing the data asset will change the model to be used for denoising.

Make sure that both checkboxes for **Show Engine Content** and **Show Plugin Content** are ticked inside the **Browse Settings** (the gear icon), if the assets for Intel’s Open Image Denoiser do not show up in the drop down.

### Runtime Type

This dropdown defines where the denoising will be done. Depending on the runtime selected and whether it is available on the current platform or not, different options will work or not. Please refer to the capabilities of the individual runtimes to see what configurations are valid.

#### CPU

This will copy the noisy results to CPU, run inference there, and upload results back to the GPU. Note that the two device copies can slow down the denoising.

#### GPU

This will copy the noisy results to CPU, pass it to the runtime, which will copy it to GPU for inference and back, so it will finally be copied to GPU again.

Due to the 4 device copies, it is not recommended to use this setting, unless there is no other runtime available to run the model, or running the model on CPU is slower.

#### RDG

This setting is the most efficient, since the noisy image is denoised on device, without copying to CPU. It is the recommended setting if a corresponding runtime is available.

### Runtime Name Override

This field can be used to override the NNE runtime that is used. Please refer to the individual runtimes for the names to be used here. Also note that the plugin containing the runtime must be enabled manually to make it work. Additionally, the runtime selected must be compatible with the **Runtime Type** and able to run the selected model.

## Custom Neural Denoiser Networks

To use a custom neural network as denoiser, a neural network model, the definition of input and output mappings as well as a NNEDenoiser asset are needed.

### Model

A neural network can simply be added by dragging and dropping a neural network file into the content editor, which will create a **UNNEModelData** asset. Please note that different runtimes support different file formats. The runtime that supports the format needs to be enabled to be able to import the neural network successfully.

### Input/Output Mapping

A neural network can have multiple input and output tensors and each tensor can have multiple channels. To map the data provided by the path tracer (for example, Color, Normal, Albedo, and so on) to the input tensors and channels of the neural network, a mapping file needs to be defined.

To create a new mapping:

- Right-click in the content window of the editor and select **Data Table** from the **Miscellaneous** menu.

- Search in the opening dialogue for **NNEDenoiserInputMappingData** and select it.

- For each channel of each input tensor of the neural network, add a new line for each.

Similarly, another asset for defining the output mappings can be created.

| Property | Description |
| --- | --- |
| **Row Name Selection Box** | This is an arbitrary name that you can choose to describe your model input channel. It does not have to relate to the actual input name of the model. |
| **Resource** | The resource indicates from which path tracer resource the data is mapped from. |
| **Frame Index** | This index defines from which frame the path tracer data is mapped from. Index 0 will take the data from the current frame, negative numbers will map data from previous frames while positive indices will access future frames. |
| **Tensor Index** | This is the index of the input tensor of the model. Index i will map the data to the i-th input tensor of the model. |
| **Tensor Channel** | This is the index of the channel of the input tensor of the model. Index i will map the data to the i-th channel of the input tensor of the model. |
| **Resource Channel** | This is the index of the channel of the path tracer resource. Index i will map the data from the i-th channel of the path tracer resource. |

### Asset

NNEDenoiser assets define a model, input and output mappings as well as tiling configurations and are then used in the plugin settings to select which model will be used by the path tracer. To create a new custom asset right click into the content window of the editor, select Miscellaneous and then Data Asset. Search in the opening dialogue for NNEDenoiser Asset and select it. Select the model you imported and the mappings you defined in the corresponding dropdowns.

Then define the tiling configuration according to your model characteristics.

| Property | Description |
| --- | --- |
| **Size Alignment** | Tile sizes are chosen so that they are divisible by this number. Some operators of some runtimes can run faster if certain alignment criteria are met. This only has an effect if the model supports dynamic sizes. |
| **Overlap** | Defines how much neighboring tiles need to overlap to account for the receptive field of the model. This is defined by the radius of pixels in the input that contribute to an output pixel. |
| **Max Size** | The maximum size of each tile. This only has an effect if the model supports dynamic sizes. |
| **Min Size** | The minimum size of each tile. This only has an effect if the model supports dynamic sizes. |

- path tracing
- path tracer
- artificial intelligence
- machine learning
- neural networks
- nne
- denoiser
- denoising

On this page

- Changing Presets (-> nne-denoiser-in-unreal-engine)
- Denoiser Asset (-> nne-denoiser-in-unreal-engine)
- Runtime Type (-> nne-denoiser-in-unreal-engine)
- CPU (-> nne-denoiser-in-unreal-engine)
- GPU (-> nne-denoiser-in-unreal-engine)
- RDG (-> nne-denoiser-in-unreal-engine)
- Runtime Name Override (-> nne-denoiser-in-unreal-engine)
- Custom Neural Denoiser Networks (-> nne-denoiser-in-unreal-engine)
- Model (-> nne-denoiser-in-unreal-engine)
- Input/Output Mapping (-> nne-denoiser-in-unreal-engine)
- Asset (-> nne-denoiser-in-unreal-engine)
