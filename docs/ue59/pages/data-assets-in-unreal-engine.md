# Data Assets

https://dev.epicgames.com/documentation/en-us/unreal-engine/data-assets-in-unreal-engine?application_version=5.9

> Information on Data Assets in Unreal Engine.

[image: Data Assets]

A **Data Asset** is an asset that stores data related to a particular system in an instance of its class.

- **Assets **can be made in the Content Browser (-> content-browser-in-unreal-engine) using native classes that inherit from UDataAsset (-> API). If you want data inheritance or a more complex hierarchy, we recommend creating Data Only Blueprint Classes.
- Inheriting from a Primary Data Asset (-> API) implements a **Primary Asset Id** and has asset bundle support, which allows it to be manually loaded and unloaded from the Asset Manager (-> asset-management-in-unreal-engine).
- Instances of native subclasses can be created directly as Data Assets in the Unreal editor and will use the name of the native class as the **PrimaryAssetType**. In the image above, when creating a new data asset in the editor, you will be prompted to choose from a list of native subclasses.
- Blueprint (-> blueprints-visual-scripting-in-unreal-engine) subclasses can be created to add variables and then subclassed again by Data Only Blueprint that sets those variables. With Blueprint subclasses, we recommend using Data Only Blueprints instead of the Data Asset instance to handle data inheritance and update the parent class.

## Creating a Data Asset

To inherit or create your own **Data Asset**, follow the steps below:

- Navigate to **Tools** > **New C++ Class** then create a new class based on a **DataAsset**.
- Add your class data members. C++ ```
USTRUCT()
        struct FMyAssetInfo {
            GENERATED_BODY()

            UPROPERTY(EditAnywhere)
            FString AssetName;

            UPROPERTY(EditAnywhere)
            UTexture2D* AssetThumbnail;

```
- Build your project.
- In the Unreal editor, right-click on the **Content Browser**, then select **Miscellaneous** > **Data Asset**.
- When prompted to choose your class for the data asset instance, your asset should be populated in the list.
- Open your **Data Asset Blueprint** to observe the member variables.

When using Property Specifiers (-> unreal-engine-uproperties), you can observe all of your member variables in an asset so designers can modify the data directly from the editor.

## Primary Data Asset

A **Primary Data Asset** is a Data Asset that implements a `GetPrimaryAssetId` function and has asset bundle support, which allows it to be manually loaded/unloaded from the Asset Manager.

The **PrimaryAssetType** is equal to the name of the first native class going up the hierarchy or the highest-level Blueprint class. For example, if you have a `UPrimaryDataAsset` **->** `UParentNativeClass` **->** `UChildNativeClass` **->** `DataOnlyBlueprintClass`, then the type will be a `ChildNativeClass`.

Alternatively, if you have a `UPrimaryDataAsset` **->** `ParentBlueprintClass` **->** `DataOnlyBlueprintClass`, then the type will be a `ParentBlueprintClass`.

To change this behavior, you can override the `GetPrimaryAssetId` function in your native class or copy those functions into a different native base class.

### Creating a Primary Data Asset

To inherit or create your own Primary Data Asset, follow the steps below:

- Navigate to **Tools** > **New C++ Class,** then create a new class based on a PrimaryDataAsset.
- Add your class members and override the **GetPrimaryAssetID** function. C++ ```
UCLASS()
         class PROJECTExample_API UExampleDataAsset : public UPrimaryDataAsset {
             GENERATED_BODY()

             UPROPERTY(EditAnywhere)
             FString AssetName;

             UPROPERTY(EditAnywhere)
             UTexture2D* AssetThumbnail;

```

## Loading and Unloading Assets

**Unreal Engine** automatically handles Asset (-> assets-and-content-packs-in-unreal-engine) loading and unloading to provide developers a method to communicate with the Engine when each asset is needed. However, you may want precise control over when assets are discovered, loaded, and audited. For these cases, we recommend using the Asset Manager (-> asset-management-in-unreal-engine).

### Asynchronous Asset Loading

Unreal Engine simplifies the process of asynchronously loading asset data. These methods work identically in development and with cooked data on devices, so you do not need to maintain two code paths for loading data on demand.

See Asynchronous Asset Loading (-> asynchronous-asset-loading-in-unreal-engine) for documentation.

- programming

On this page

- Creating a Data Asset (-> data-assets-in-unreal-engine)
- Primary Data Asset (-> data-assets-in-unreal-engine)
- Creating a Primary Data Asset (-> data-assets-in-unreal-engine)
- Loading and Unloading Assets (-> data-assets-in-unreal-engine)
- Asynchronous Asset Loading (-> data-assets-in-unreal-engine)
