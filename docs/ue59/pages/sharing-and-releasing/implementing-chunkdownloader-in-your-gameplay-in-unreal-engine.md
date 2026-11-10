# Implementing ChunkDownloader Ingame

https://dev.epicgames.com/documentation/en-us/unreal-engine/implementing-chunkdownloader-in-your-gameplay-in-unreal-engine?application_version=5.9

> How to integrate ChunkDownloader into your project, using Visual Studio and Blueprints, and how to test out the system on your local machine.

[image: Implementing ChunkDownloader Ingame]

**ChunkDownloader** is a patching solution for **Unreal Engine (UE)**. It downloads assets from a remote service and mounts them in memory for use in your games, enabling you to provide updates and assets easily. This guide shows you how to implement ChunkDownloader in your own projects. By the end of this guide you will be able to:

- Initialize and shutdown of the ChunkDownloader, using Visual Studio.

- Download packaging files from your host web site, using Visual Studio.

- Set up **Game Mode Blueprint** for implementing ChunkDownloader in UE.

- Display the downloaded content in **Level Editor Viewport** or in your game.

- Access content from mounted packaging files safely.

- Test adjusted system in UE project on your local machine.

## 1. Required Setup and Recommended Assets

Before proceeding any further, you should review the following guides and follow each of their steps:

- Setting Up the ChunkDownloader Plugin (-> setting-up-the-chunkdownloader-plugin-in-unreal-engine)

- Preparing Assets for Chunking (-> preparing-assets-for-chunking-in-unreal-engine)

- Hosting a Manifest and Assets for ChunkDownloader (-> hosting-a-manifest-and-assets-for-chunkdownloader-in-unreal-engine)

As described in reference quides, you need:

- Create **C++ project** based on a **Blank template**. Name this project **PatchingDemo**.

- Enable **ChunkDownloader** plugin in the **Plugins** menu.

- Enable **Use Pak File** and **Generate Chunks** in **Project Settings > Project > Packaging**.

- Edit your project's `[ProjectName]Build.cs` file in **Visual Studio**.

- Generate Visual Studio project files.

- Build your project in Visual Studio.

- Add to this project the **Paragon** assets for **Boris**, **Crunch**, and **Khaimera**.

- Adjust **Data Asset** based on **Primary Asset Label** for each asset you added.

- Cook or package project and have packaging files in your build folder.

- Distribute packaging files to your locally hosted web site.

- Create Manifest File called `BuildManifest-Windows.txt`.

- Define `DefaultGame.ini` file for your project.

## 2. Initializing and Shutting Down ChunkDownloader

ChunkDownloader is an implementation of the `FPlatformChunkInstall` interface, one of many interfaces that can interchangeably load different modules depending on what platform your game is running on. All modules need to be loaded and initialized before they can be used, and they also need to be shut down and cleaned up.

The simplest way to do this with ChunkDownloader is through a custom **GameInstance** class. Not only GameInstance have appropriate initialization and shutdown functions you can tie into, it also will provide continuous access to ChunkDownloader while your game is running. The following steps will walk you through this implementation.

Create a **New C++ Class** using **GameInstance** as the base class. Name it **PatchingDemoGameInstance**.

Click image to enlarge.

When the compilation process is complete, the files `PatchingDemoGameInstance.h` and `PatchingDemoGameInstance.cpp` will open automatically in Visual Studio.

### Working on PatchingDemoGameInstance.h

When files will open, code in the `PatchingDemoGameInstance.h` should looks as following:

PatchingDemoGameInstance.h

```
	#pragma once

	#include "CoreMinimal.h"
	#include "Engine/GameInstance.h"
	#include "PatchingDemoGameInstance.generated.h"

	UCLASS()
	class UPatchingDemoGameInstance : public UGameInstance
	{
		GENERATED_BODY()
	};
```

#pragma once

 #include "CoreMinimal.h"
 #include "Engine/GameInstance.h"
 #include "PatchingDemoGameInstance.generated.h"

 UCLASS()
 class UPatchingDemoGameInstance : public UGameInstance
 {
 GENERATED_BODY()
 };

- Change string `class UPatchingDemoGameInstance : public UGameInstance` to PatchingDemoGameInstance.h ```
     class PATCHINGDEMO_API UPatchingDemoGameInstance : public UGameInstance
``` class PATCHINGDEMO_API UPatchingDemoGameInstance : public UGameInstance All subsequent variables, functions and properties, that you will declare in the `PatchingDemoGameInstance.h` file, will need to be added under `UPatchingDemoGameInstance` class.

- Declare the following function overrides under a `public` header: PatchingDemoGameInstance.h ```
     public:
     // Overrides
         virtual void Init() override;
         virtual void Shutdown() override;
``` public: // Overrides virtual void Init() override; virtual void Shutdown() override; The `Init` function runs when your game starts up, making it an ideal place to initialize ChunkDownloader. Similarly, the `Shutdown` function runs when your game stops, so you can use it to shut down the ChunkDownloader module.

- Declare the following variable under a `protected` header: PatchingDemoGameInstance.h ```
     protected:
     //Tracks if our local manifest file is up to date with the one hosted on our website
     bool bIsDownloadManifestUpToDate;
``` protected: //Tracks if our local manifest file is up to date with the one hosted on our website bool bIsDownloadManifestUpToDate;

- Declare the following function under a `protected` header: PatchingDemoGameInstance.h ```
     protected:
     //Called when the chunk download process finishes
     void OnManifestUpdateComplete(bool bSuccess);
``` protected: //Called when the chunk download process finishes void OnManifestUpdateComplete(bool bSuccess);

### Working on PatchingDemoGameInstance.cpp

- Open `PatchingDemoGameInstance.cpp`. Add the following `#includes` at the top of the file under `#include "PatchingDemoGameInstance.h"`: PatchingDemoGameInstance.cpp ```
     #include "PatchingDemoGameInstance.h"

     #include "ChunkDownloader.h"
     #include "Misc/CoreDelegates.h"
     #include "AssetRegistryModule.h"
``` #include "PatchingDemoGameInstance.h" #include "ChunkDownloader.h" #include "Misc/CoreDelegates.h" #include "AssetRegistryModule.h" This will give you access to ChunkDownloader and some useful tools for managing assets and delegates.

- Create the following implementation for the `Init` function: PatchingDemoGameInstance.cpp ```
     void UPatchingDemoGameInstance::Init()
     {
         Super::Init();
         const FString DeploymentName = "PatchingDemoLive";
         const FString ContentBuildId = "PatchingDemoKey";

         // initialize the chunk downloader with chosen platform
         TSharedRef<FChunkDownloader> Downloader = FChunkDownloader::GetOrCreate();
         Downloader->Initialize("Windows", 8);

         // load the cached build ID
         Downloader->LoadCachedBuild(DeploymentName);

         // update the build manifest file
         TFunction<void(bool bSuccess)> UpdateCompleteCallback = [&](bool bSuccess) {bIsDownloadManifestUpToDate = true; };
         Downloader->UpdateBuild(DeploymentName, ContentBuildId, UpdateCompleteCallback);
     }
``` void UPatchingDemoGameInstance::Init() { Super::Init(); const FString DeploymentName = "PatchingDemoLive"; const FString ContentBuildId = "PatchingDemoKey"; // initialize the chunk downloader with chosen platform TSharedRef Downloader = FChunkDownloader::GetOrCreate(); Downloader->Initialize("Windows", 8); // load the cached build ID Downloader->LoadCachedBuild(DeploymentName); // update the build manifest file TFunction UpdateCompleteCallback = [&](bool bSuccess) {bIsDownloadManifestUpToDate = true; }; Downloader->UpdateBuild(DeploymentName, ContentBuildId, UpdateCompleteCallback); } Let's summarize what this code does: The function defines `DeploymentName` and `ContentBuildID` to match the values used in `DefaultGame.ini`. These are currently fixed values for testing, but in a full build you would use an HTTP request to fetch the `ContentBuildID`. The function uses the information in these variables to make a request to your web site for the manifest.

- The function calls `FChunkDownloader::GetOrCreate` to set up ChunkDownloader and get a reference to it, then stores it in a `TSharedRef`. This is the preferred way to get references to this or similar platform interfaces.

- The function calls `FChunkDownloader::Initialize` using the desired platform name, in this case, Windows. This example gives it a value of **8** for TargetDownloadsInFlight, which sets the maximum number of downloads that ChunkDownloader will handle at once.

- The function calls `FChunkDownloader::LoadCachedBuild` using the `DeploymentName`. This will check if there are already downloaded files on disk, which enables ChunkDownloader to skip downloading them a second time if they are up to date with the newest Manifest File.

- The function calls `FChunkDownloader::UpdateBuild` to download an updated version of the Manifest File. This is how the system supports update patches without requiring an entirely new executable.

- `UpdateBuild` takes the `DeploymentName` and `ContentBuildID` alongside a callback that outputs whether or not the operation succeeded or failed.

- It also uses `OnManifestUpdateComplete` to set `bIsDownloadManifestUpToDate` so that the GameInstance can globally recognize that this phase of patching is done.

Following these steps ensures that ChunkDownloader is initialized and ready to start downloading content, and informs other functions of the Manifest's status.

- Create the following implementation for the `Shutdown` function: PatchingDemoGameInstance.cpp ```
     void UPatchingDemoGameInstance::Shutdown()
     {
         Super::Shutdown();
         // Shut down ChunkDownloader
         FChunkDownloader::Shutdown();
     }
``` void UPatchingDemoGameInstance::Shutdown() { Super::Shutdown(); // Shut down ChunkDownloader FChunkDownloader::Shutdown(); } Calling `FChunkDownloader::Shutdown` will stop any downloads ChunkDownloader currently has in progress, then clean up and unload the module.

- Create the following implementation for the `OnManifestUpdateComplete` function: PatchingDemoGameInstance.cpp ```
     void UPatchingDemoGameInstance::OnManifestUpdateComplete(bool bSuccess)
     {
         bIsDownloadManifestUpToDate = bSuccess;
     }
``` void UPatchingDemoGameInstance::OnManifestUpdateComplete(bool bSuccess) { bIsDownloadManifestUpToDate = bSuccess; } This function will be used as an asynch callback, when the Manifest updating finishes.

## 3. Downloading Packaging Files

Now that you have appropriate initialization and shutdown functions for ChunkDownloader, you can expose its functionality for downloading packaging files.

### Working on PatchingDemoGameInstance.h

- In `PatchingDemoGameInstance.h`, below your `#includes`, add the following dynamic multicast delegate: PatchingDemoGameInstance.h ```
     DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FPatchCompleteDelegate, bool, Succeeded);
``` DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FPatchCompleteDelegate, bool, Succeeded); This delegate outputs a boolean that will tell you whether or not a patch download operation succeeded. Delegates are commonly used to respond to asynchronous operations like downloading or installing files.

- In your `UPatchingDemoGameInstance` class add the following function declaration for `GetLoadingProgress` under a `public` header: PatchingDemoGameInstance.h ```
     public:
         UFUNCTION(BlueprintPure, Category = "Patching|Stats")
         void GetLoadingProgress(int32& BytesDownloaded, int32& TotalBytesToDownload, float& DownloadPercent, int32& ChunksMounted, int32& TotalChunksToMount, float& MountPercent) const;
``` public: UFUNCTION(BlueprintPure, Category = "Patching|Stats") void GetLoadingProgress(int32& BytesDownloaded, int32& TotalBytesToDownload, float& DownloadPercent, int32& ChunksMounted, int32& TotalChunksToMount, float& MountPercent) const;

- Add the following delegate declaration under a `public` header: PatchingDemoGameInstance.h ```
     public:
         // Delegates
         // Fired when the patching process succeeds or fails
         UPROPERTY(BlueprintAssignable, Category="Patching");
         FPatchCompleteDelegate OnPatchComplete;
``` public: // Delegates // Fired when the patching process succeeds or fails UPROPERTY(BlueprintAssignable, Category="Patching"); FPatchCompleteDelegate OnPatchComplete; These give you a place to hook into with Blueprint, when a patching operation is finished.

- Add the following declaration for `ChunkDownloadList` under a `protected` header: PatchingDemoGameInstance.h ```
     protected:
         // List of Chunk IDs to try and download
         UPROPERTY(EditDefaultsOnly, Category="Patching")
         TArray<int32> ChunkDownloadList;
``` protected: // List of Chunk IDs to try and download UPROPERTY(EditDefaultsOnly, Category="Patching") TArray ChunkDownloadList; You will use this list to hold all the Chunk IDs that you want to download later. In the development setting, you would initialize this with a list of assets, as needed. But for testing purposes, you will simply expose the defaults so you can fill them, using the **Blueprint Editor**.

- Add the following declaration for `PatchGame` under a `public` header: PatchingDemoGameInstance.h ```
     public:
         // Starts the game patching process. Returns false if the patching manifest is not up to date. */
         UFUNCTION(BlueprintCallable, Category = "Patching")
         bool PatchGame();
``` public: // Starts the game patching process. Returns false if the patching manifest is not up to date. */ UFUNCTION(BlueprintCallable, Category = "Patching") bool PatchGame(); This function provides a Blueprint-exposed way to start the patching process. It returns a boolean indicating whether or not it succeeded or failed. This is a typical pattern in download management and other kinds of asynchronous tasks.

- Add the following function declarations under a `protected` header: PatchingDemoGameInstance.h ```
     protected:
         // Called when the chunk download process finishes
         void OnDownloadComplete(bool bSuccess);

         // Called whenever ChunkDownloader's loading mode is finished
         void OnLoadingModeComplete(bool bSuccess);

         // Called when ChunkDownloader finishes mounting chunks
         void OnMountComplete(bool bSuccess);
``` protected: // Called when the chunk download process finishes void OnDownloadComplete(bool bSuccess); // Called whenever ChunkDownloader's loading mode is finished void OnLoadingModeComplete(bool bSuccess); // Called when ChunkDownloader finishes mounting chunks void OnMountComplete(bool bSuccess); You will use these to respond to async callbacks in the download process.

### Working on PatchingDemoGameInstance.cpp

- Create the following implementation for the `GetLoadingProgress` function: PatchingDemoGameInstance.cpp ```
     void UPatchingDemoGameInstance::GetLoadingProgress(int32& BytesDownloaded, int32& TotalBytesToDownload, float& DownloadPercent, int32& ChunksMounted, int32& TotalChunksToMount, float& MountPercent) const
     {
         //Get a reference to ChunkDownloader
         TSharedRef<FChunkDownloader> Downloader = FChunkDownloader::GetChecked();

         //Get the loading stats struct
         FChunkDownloader::FStats LoadingStats = Downloader->GetLoadingStats();

         //Get the bytes downloaded and bytes to download
         BytesDownloaded = LoadingStats.BytesDownloaded;
         TotalBytesToDownload = LoadingStats.TotalBytesToDownload;

         //Get the number of chunks mounted and chunks to download
         ChunksMounted = LoadingStats.ChunksMounted;
         TotalChunksToMount = LoadingStats.TotalChunksToMount;

         //Calculate the download and mount percent using the above stats
         DownloadPercent = ((float)BytesDownloaded / (float)TotalBytesToDownload) * 100.0f;
         MountPercent = ((float)ChunksMounted / (float)TotalChunksToMount) * 100.0f;
     }
``` void UPatchingDemoGameInstance::GetLoadingProgress(int32& BytesDownloaded, int32& TotalBytesToDownload, float& DownloadPercent, int32& ChunksMounted, int32& TotalChunksToMount, float& MountPercent) const { //Get a reference to ChunkDownloader TSharedRef Downloader = FChunkDownloader::GetChecked(); //Get the loading stats struct FChunkDownloader::FStats LoadingStats = Downloader->GetLoadingStats(); //Get the bytes downloaded and bytes to download BytesDownloaded = LoadingStats.BytesDownloaded; TotalBytesToDownload = LoadingStats.TotalBytesToDownload; //Get the number of chunks mounted and chunks to download ChunksMounted = LoadingStats.ChunksMounted; TotalChunksToMount = LoadingStats.TotalChunksToMount; //Calculate the download and mount percent using the above stats DownloadPercent = ((float)BytesDownloaded / (float)TotalBytesToDownload) * 100.0f; MountPercent = ((float)ChunksMounted / (float)TotalChunksToMount) * 100.0f; }

- Create the following implementation for `PatchGame`: PatchingDemoGameInstance.cpp ```
     bool UPatchingDemoGameInstance::PatchGame()
     {
         // make sure the download manifest is up to date
         if (bIsDownloadManifestUpToDate)
         {
             // get the chunk downloader
             TSharedRef<FChunkDownloader> Downloader = FChunkDownloader::GetChecked();

             // report current chunk status
             for (int32 ChunkID : ChunkDownloadList)
             {
                 int32 ChunkStatus = static_cast<int32>(Downloader->GetChunkStatus(ChunkID));
                 UE_LOG(LogTemp, Display, TEXT("Chunk %i status: %i"), ChunkID, ChunkStatus);
             }

             TFunction<void (bool bSuccess)> DownloadCompleteCallback = [&](bool bSuccess){OnDownloadComplete(bSuccess);};
             Downloader->DownloadChunks(ChunkDownloadList, DownloadCompleteCallback, 1);

             // start loading mode
             TFunction<void (bool bSuccess)> LoadingModeCompleteCallback = [&](bool bSuccess){OnLoadingModeComplete(bSuccess);};
             Downloader->BeginLoadingMode(LoadingModeCompleteCallback);
             return true;
         }

         // you couldn't contact the server to validate your Manifest, so you can't patch
         UE_LOG(LogTemp, Display, TEXT("Manifest Update Failed. Can't patch the game"));

         return false;
     }
``` bool UPatchingDemoGameInstance::PatchGame() { // make sure the download manifest is up to date if (bIsDownloadManifestUpToDate) { // get the chunk downloader TSharedRef Downloader = FChunkDownloader::GetChecked(); // report current chunk status for (int32 ChunkID : ChunkDownloadList) { int32 ChunkStatus = static_cast(Downloader->GetChunkStatus(ChunkID)); UE_LOG(LogTemp, Display, TEXT("Chunk %i status: %i"), ChunkID, ChunkStatus); } TFunction DownloadCompleteCallback = [&](bool bSuccess){OnDownloadComplete(bSuccess);}; Downloader->DownloadChunks(ChunkDownloadList, DownloadCompleteCallback, 1); // start loading mode TFunction LoadingModeCompleteCallback = [&](bool bSuccess){OnLoadingModeComplete(bSuccess);}; Downloader->BeginLoadingMode(LoadingModeCompleteCallback); return true; } // you couldn't contact the server to validate your Manifest, so you can't patch UE_LOG(LogTemp, Display, TEXT("Manifest Update Failed. Can't patch the game")); return false; } This function goes through the following steps: First, it checks if the Manifest is currently up to date. If you have not initialized ChunkDownloader and successfully gotten a fresh copy of the Manifest, `bIsDownloadManifestUpToDate` will be false, and this function will return false, indicating a failure to start patching.

- Next, if the patching process can continue, the function gets a reference to ChunkDownloader. It then iterates through the download list and checks the status of each chunk.

- Two callbacks are defined: The `DownloadCompleteCallback` will be called, when each individual chunk finishes downloading. It will output a message, when each of them successfully downloads or fails to download.

- The `LoadingModeCompleteCallback` will fire, when all chunks have been downloaded.

- The function calls `FChunkDownloader::DownloadChunks` to begin downloading desired chunks, which are listed in `ChunkDownloadList`. This list must be filled with the chunk IDs you want before calling this function. It also passes the `DownloadCompleteCallback`.

- The function calls `FChunkDownloader::BeginLoadingMode` with the callback you defined earlier. Loading Mode will tell ChunkDownloader to start monitoring its download status.

- While chunks can download passively in the background without calling Loading Mode, using it will output download stats, enabling you to create a UI that can track download progress for the user.

- You can also use the callback function to run specific functionality, when an entire batch of chunks is downloaded.

- Create the following implementations for `OnDownloadComplete` and `OnLoadingModeBegin` functions: PatchingDemoGameInstance.cpp ```
     void UPatchingDemoGameInstance::OnLoadingModeComplete(bool bSuccess)
     {
         OnDownloadComplete(bSuccess);
     }

     void UPatchingDemoGameInstance::OnMountComplete(bool bSuccess)
     {
         OnPatchComplete.Broadcast(bSuccess);
     }
``` void UPatchingDemoGameInstance::OnLoadingModeComplete(bool bSuccess) { OnDownloadComplete(bSuccess); } void UPatchingDemoGameInstance::OnMountComplete(bool bSuccess) { OnPatchComplete.Broadcast(bSuccess); } `OnLoadingModeComplete` will pass through to `OnDownloadComplete`, which will proceed to mount chunks in a later step. `OnMountComplete` will indicate that all chunks have finished mounting, and the content is ready to use.

- Create the following implementation for `OnDownloadComplete` function: PatchingDemoGameInstance.cpp ```
     void UPatchingDemoGameInstance::OnDownloadComplete(bool bSuccess)
     {
     if (bSuccess)
         {
             UE_LOG(LogTemp, Display, TEXT("Download complete"));

             // get the chunk downloader
             TSharedRef<FChunkDownloader> Downloader = FChunkDownloader::GetChecked();
             FJsonSerializableArrayInt DownloadedChunks;

             for (int32 ChunkID : ChunkDownloadList)
             {
                 DownloadedChunks.Add(ChunkID);
             }

             //Mount the chunks
             TFunction<void(bool bSuccess)> MountCompleteCallback = [&](bool bSuccess){OnMountComplete(bSuccess);};
             Downloader->MountChunks(DownloadedChunks, MountCompleteCallback);

             OnPatchComplete.Broadcast(true);
         }
         else
         {
             UE_LOG(LogTemp, Display, TEXT("Load process failed"));

             // call the delegate
             OnPatchComplete.Broadcast(false);
         }
     }
``` void UPatchingDemoGameInstance::OnDownloadComplete(bool bSuccess) { if (bSuccess) { UE_LOG(LogTemp, Display, TEXT("Download complete")); // get the chunk downloader TSharedRef Downloader = FChunkDownloader::GetChecked(); FJsonSerializableArrayInt DownloadedChunks; for (int32 ChunkID : ChunkDownloadList) { DownloadedChunks.Add(ChunkID); } //Mount the chunks TFunction MountCompleteCallback = [&](bool bSuccess){OnMountComplete(bSuccess);}; Downloader->MountChunks(DownloadedChunks, MountCompleteCallback); OnPatchComplete.Broadcast(true); } else { UE_LOG(LogTemp, Display, TEXT("Load process failed")); // call the delegate OnPatchComplete.Broadcast(false); } } This is another complex function, so you will break down what it is doing. This runs when your packaging files have been successfully downloaded to a user's device. It gets a reference to ChunkDownloader.

- The function sets up a Json array and fills it with information from `ChunkDownloadList`. This will be used to make your request.

- The function uses `MountCompleteCallback` to output whether or not the patch was successfully applied.

- The function calls `ChunkDownloader::MountChunks` using the Json list and `MountCompleteCallback` to start mounting the downloaded chunks.

- If the download was successful, the function activates the `OnPatchComplete` delegate with a value of true. If it wasn't successful, it activates with a value of `false`. `UE_LOG` outputs error messages according to the point of failure.

## 4. Setting Up a Patching Game Mode

To initiate the patching process, you can make a **Level** and **Game Mode** specifically to call `PatchGame` and output patching stats to the screen.

- In Unreal Editor, create a new **Blueprints** folder in the **Content Browser**. Then, create a **New Blueprint** using **PatchingDemoGameInstance** as the base class. Name the new Blueprint class **CDGameInstance**. You will use this Blueprint as a more accessible way to edit settings and track the chunk download process.

- Create a new **Game Mode** Blueprint called **PatchingGameMode**.

- Create a **Maps** folder, then create two new Levels called **PatchingDemoEntry** and **PatchingDemoTest**. The PatchingDemoEntry Level should be based on an Empty Map, and the PatchingDemoTest Level should be based on the Default Map.

- Open your **Project Settings** and navigate to **Project > Maps & Modes**. Set the following parameters: Click image to enlarge. | ID | Parameter | Value |
| --- | --- | --- |
| 1 | Game Instance Class | CDGameInstance |
| 2 | Editor Startup Map | PatchingDemoTest |
| 3 | Game Default Map | PatchingDemoEntry |

- Open **CDGameInstance** in the **Blueprint editor**. In the **Defaults** panel, add three entries to the **Chunk Download List**. Give them values of **1001**, **1002**, and **1003**. These are your Chunk IDs.

### Working on Patching Game Mode

- Open **PatchingGameMode** in the **Blueprint Editor** and navigate to the **EventGraph**.

- Create a **Get Game Instance** node, then cast it to **CDGameInstance**.

- Drag **As CDGameInstance** pin, then click **Promote to Variable** to create a reference to the game instance. Call the new variable **Current Game Instance**.

- Drag the output pin of **Set Current Game Instance**, then create a call to **Patch Game**.

- Drag the **Return Value** of **Patch Game**, then click **Promote to Variable** to create a boolean in which to store its value. Call the new variable **Is Patching In Progress**. Click image to enlarge.

- Create an integer variable with the name **Try Patch Count** and drag **Get Try Patch Count** node to the **Graph**.

- Drag the output pin of the **Get Try Patch Count** node and Create **Increament Int** node.

- Drag the output pin of the **Is Patching In Progress** and create **Branch** node, connect its **False** pin to the **Increament Int** node.

- Drag the output pin of the **Increament Int** node and create another **Branch** node, drag its **False** pin and create a **Delay** node.

- Connect **Complited** pin of the **Delay** node with input pin of the **Patch Game** node.

- Create **Greater** node. Connect its **A Input** pin to the **Result** pin of the **Increament Int** node. Connect its **Return** input to the **Condition** pin of the second **Branch** node. Click image to enlarge.

- Drag the **Tick** Event and create a new **Branch** node. Attach **Is Patching In Progress** to its **Condition** input.

- Drag the **True** pin on your **Branch** node, then create a **Print String** node, which you will use for displaying of the download percent, and a **Print String** node, which you will use for displaying of the mount percent.

- Create a **Get Current Game Instance** node, then drag its output pin and create a call to **Get Loading Progress**.

- Drag from the **Download Percent** pin of **Get Loading Progress** node and create a **Build String (float)** node.

- Input **Current Loading Progress** in the text field of the **Prefix** pin and input **%** in the text field of the **Suffix** pin.

- Drag from the **Mount Percent** pin of **Get Loading Progress** node and create a **Build String (float)** node.

- Input **Current Mount Progress** in the text field of the **Prefix** pin and input **%** in the text field of the **Suffix** pin.

- Connect **Return Value** of the **Build String (Float)** for loading progress with the first **Print String** node.

- Connect **Return Value** of the **Build String (Float)** for mounting progress with the second **Print String** node.

- From the **Print String** node, create a **Branch** node, then create an **AND** node and connect it to the **Condition** pin.

- Create a **Greater Equal** node to check if **Download Percent** is **100.0** or higher, then do the same thing for **Mount Percent**. Connect both of these to the **AND** node. If both of these conditions are true, use **Open Level** to open your **PatchingGameTest** Level. Click image to enlarge.

Now when your game runs, it will open the Entry Map, run ChunkDownloader, and output the progress on downloading and mounting the chunks in your Chunk Download list. When the download finishes, it will then transition to your Test Map.

If you try to run this using **Play In Editor**, the download will not start. You need to test ChunkDownloader with packaged builds.

## 5. Displaying the Downloaded Content

To display our character meshes, you will need to get references to them. This section will walk you through a simple example of how to spawn actors.

- Open the **PatchingDemoTest** Level, then open the **Level Blueprint**.

- Create a new variable called **Meshes**. For its **Variable Type**, choose **Skeletal Mesh**.

- Hover over the entry in the types list and select **Object Reference**.

- Click the icon next to the **Variable Type** of **Meshes** to change it to an **Array**. Compile your Blueprint to apply the change.

- In the **Default Value** for **Meshes**, add three entries and select the skeletal meshes for **Boris**, **Crunch**, and **Khaimera**.

- In the **EventGraph** for the Level, drag from the **BeginPlay** Event, then create a **For Each Loop** and connect it to your **Meshes** array.

- Drag the **Array Element** pin on your **For Each Loop**, then create an **Is Valid** node.

- Create a **Spawn Actor From Class** node and connect it to the **Is Valid** pin for the **Is Valid** node. Choose **Skeletal Mesh Actor** for the **Class**.

- Drag the **Array Index** in the **For Each Loop** and create an **Multiply** node. Set the float value to **256**.

- Create one more **Multiply** node. Connect **Return value** pin of previous **Multiply** node to the **B Input Value** pin of created **Multiply Node**. Convert **B Input Value** pin of this **Multiply** node to the **Vector** by right-clicking on the **B Input Value** pin and selecting **Convert to > Vector**. Give the Vector a value of **(1.0, 0.0, 0.0)**. This will make a coordinate 256 units away from the origin for each time you go through the **For Each Loop**. This will give each of your meshes some space when you spawn them.

- Use the vector from the previous step as the **Location** in a **Make Transform** node, then connect the **Return Value** to the **Spawn Transform** input of the **Spawn Actor** node.

- Drag the **Return Value** of the **Spawn Actor** node, then get a reference to its **Skeletal Mesh Component**. Use that to call **Set Skeletal Mesh**.

- Drag the **Array Element** pin of the **For Each Loop** node and connect the output of this node to the **New Mesh** input pin for **Set Skeletal Mesh**. Click image to enlarge.

- Move the **Player Start** inside the level to **(256.0, 800.0, 100.0)**. Click image to enlarge.

- Save your progress and compile your Blueprints.

When the Level loads, the skeletal meshes for each of your characters will spawn. If the object reference does not work, then the chunks for each character are not yet mounted, their assets will not be available, and they will not spawn.

## 6. Testing Your Game

Finally, you need to test your project in a standalone build. Pak mounting does not work in PIE mode, so this is a necessary step to test your patching functionality.

- Package your project.

- Copy the packaging files and manifest to corresponding folders on your **IIS test website**.

- Make sure the IIS process and website are both running.

- Run your packaged executable.

## End Result

You should see a black screen with the patching output in the upper-left side of the screen, then, when both the patching and mounting status reach 100%, your game should load into the default map and display Boris, Crunch, and Khaimera. If something goes wrong with the patching or mounting process, none of them will appear.

## On Your Own

From here, there are several next steps you can take to flesh out your chunk download scheme:

- Build a UI that appears during loading mode and displays progress bars and prompts for the player.

- Build UI prompts for errors such as timeouts and installation failures.

- Create a custom subclass of PrimaryAssetLabel to include additional metadata about your assets. For example, Battle Breakers' custom PrimaryAssetLabel class includes a Parent Chunk that must be loaded as a prerequisite to use the current chunk.

- patching
- chunkdownloader
- platform delivery

On this page

- 1. Required Setup and Recommended Assets (-> implementing-chunkdownloader-in-your-gameplay-in-unreal-engine)
- 2. Initializing and Shutting Down ChunkDownloader (-> implementing-chunkdownloader-in-your-gameplay-in-unreal-engine)
- Working on PatchingDemoGameInstance.h (-> implementing-chunkdownloader-in-your-gameplay-in-unreal-engine)
- Working on PatchingDemoGameInstance.cpp (-> implementing-chunkdownloader-in-your-gameplay-in-unreal-engine)
- 3. Downloading Packaging Files (-> implementing-chunkdownloader-in-your-gameplay-in-unreal-engine)
- Working on PatchingDemoGameInstance.h (-> implementing-chunkdownloader-in-your-gameplay-in-unreal-engine)
- Working on PatchingDemoGameInstance.cpp (-> implementing-chunkdownloader-in-your-gameplay-in-unreal-engine)
- 4. Setting Up a Patching Game Mode (-> implementing-chunkdownloader-in-your-gameplay-in-unreal-engine)
- Working on Patching Game Mode (-> implementing-chunkdownloader-in-your-gameplay-in-unreal-engine)
- 5. Displaying the Downloaded Content (-> implementing-chunkdownloader-in-your-gameplay-in-unreal-engine)
- 6. Testing Your Game (-> implementing-chunkdownloader-in-your-gameplay-in-unreal-engine)
- End Result (-> implementing-chunkdownloader-in-your-gameplay-in-unreal-engine)
- On Your Own (-> implementing-chunkdownloader-in-your-gameplay-in-unreal-engine)
