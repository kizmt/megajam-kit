# Subtitles and Closed Captions Plugin

https://dev.epicgames.com/documentation/en-us/unreal-engine/subtitles-and-closed-captions-plugin-in-unreal-engine?application_version=5.9

> An engine plugin that is designed to support subtitles, closed captions, and scene descriptions decoupled from audio.

## What is it?

An Unreal Engine plugin that is designed to support subtitles, closed captions, and scene descriptions decoupled from audio. For example, these new subtitles can be cued from any other system, independent of any related audio asset duration or playback state. This new subtitle system will ultimately supersede and deprecate the existing system which does not support independent use of subtitles from sounds. One may customize subtitles' display timing, fonts, colors, etc.

[image: Subtitle plugin shown in use in the Sequencer tab.]

## Where is it?

`\Engine\Plugins\SubtitlesAndClosedCaptions`

Include: `#include SubtitlesSubsystem.h`****

To load the plugin in Unreal Editor, go to **Edit > Plugins**, in the tab that opens type the name or scroll to **Subtitles and Closed Captions**, select the **checkbox**, and click **Restart the Editor**.

[image: Image of the plugin in the plugins menu.]

In Unreal Engine, you must enable the before you can use it. In Fortnite, it is enabled by default.

## How Do I Use It?

Each subtitle is stored as a `USubtitleAssetUserData` UCLASS derived from UAssetUserData (-> API) and can be subclassed to store additional custom data on any Unreal asset object.

### USubtitleAssetUserData Members

**Text**: The localizable FText (-> ftext-in-unreal-engine) to appear in the subtitle.

- Multiple lines of text are supported using Shift + Enter or by including \n in the text to specify new lines.

- The FTexts are localized to the current language on the client using the localization system's hashkey implementation – localization occurs before and independent of the subtitle system.

**Duration**: Time to display subtitle in seconds.

- Default: 3 seconds.

- Must be >= 0.05 seconds.

- Only enabled when Duration Type is set to `UseDurationProperty`.

**Duration Type: **Can be set to `UseDurationProperty`, which enables the Duration property, or to `UseSoundDuration` to automatically stop when an attached sound finishes.

- `UseSoundDuration` only works when the subtitle is added as an `AssetUserData` to a `SoundBase` asset.

- Default: `UseSoundDuration`.

**StartOffset**: Time offset in seconds to start displaying the subtitle line.

- This may be used to simplify displaying multiple subtitles per audio asset, e.g. a long `SoundWave` with multiple sentences could use multiple subtitles, each with `StartOffset` set to the time offset of the start of each sentence.

- Default: 0 seconds.

**Priority**: If multiple subtitles are played concurrently, only the ones with **highest** (largest value) priority will play instead of those with lower values.

- This applies even if the subtitles only partially overlap. Overlap is determined from `StartOffset` and duration.

- If a new subtitle is set to display immediately or via `StartOffset` while a higher priority subtitle is being displayed, the lower priority subtitle will not be displayed.

- Only one of each category (subtitle, audio description, etc.) will display at a time.

- If two competing subtitles have the same priority, the oldest one queued will continue to display. Whenever a queued subtitle isn’t displayed due to a priority conflict, a warning is sent to the debug log.

- Default: 1.

**SubtitleType**: Specifies if the asset is a `Subtitle`, `ClosedCaption`, or `AudioDescription`.  This is a descriptive field set by game developers.

- This enables the caller to determine if a subtitle line should be displayed by checking this value.

- Each `SubtitleType` has independent display parameters set via a `TextBlock` widget documented below.

- When displayed, different subtitles types are positioned so they don’t overlap.

> **note:** As an alternative to adding a `SubtitleAssetUserData`, you can right-click on a `SoundWave` and select **Scripted Actions > Sound > Add Blank Subtitle** to automatically create a new Subtitle asset and make the selected sound reference it in its Asset User Data. If the Sound already references a Subtitle asset, that asset will have a new Subtitle added to its array.

### Display Parameters

Subtitles are displayed using a `TextBlock` widget:

- In Unreal Editor, go to **Edit > Project Settings**, scroll to **Game**, click on **Subtitles and Closed Captions**.

- In the menu, use the dropdown to select `DefaultSubtitleWidget`.

- Click the **Browse to Asset** icon to view the widget. [image: Image of the Project Settings menu for the Subtitles menu.]

- **Double-click** the widget to open it.

- The default subtitle widget allows for independent display parameters (e.g. placement, font, color, opacity, etc.) for subtitles, closed captions, and audio descriptions. **Double-click** in the subtitles text box to open the **Details** tab. [image: Image of the Details tab for the subtitle text box.]

> **note:** By default, subtitles are displayed using white font while `ClosedCaptions` and `AudioDescriptions` use grey.

### Blueprint Access

In addition to `USubtitleAssetUserData` and the `TextBlock` widget parameters, the following API is exposed for use by C++ and Blueprints:

> **note:** For thread safety, Queueing and Stopping subtitles are marshaled onto the Game Thread. Their corresponding API calls are immediately returned and be run asynchronously.

#### QueueSingleSubtitle

`QueueSingleSubtitle(const FText Text, const float Duration, const float StartOffset, const float Priority, const ESubtitleType SubtitleType, const ESubtitleTiming Timing = ESubtitleTiming::InternallyTimed)`

Where Text, Duration, StartOffset, Priority, and SubtitleType are the respective properties for a single subtitle.

> **info:** If the subtitle is already being actively displayed, the active subtitle will have its duration updated to the specified duration.

When queueing multiple subtitles, the first of the highest priority is displayed first (see the Priority property).

Timing: Set to `ESubtitleTiming::ExternallyTimed` to control the queuing and expiration of a subtitle manually, instead of using the Subtitle’s duration.  Externally-timed subtitles will remain active indefinitely, until manually removed with `StopSubtitle()`.  For scenarios involving time dilation or warping, it’s best to use `ESubtitleTiming::ExternallyTimed` and manually queue and stop subtitles.

| Code | Result |
| --- | --- |
| **IsSubtitleActive** (const `UAssetUserData& Data`) | Returns true if the given subtitle asset is being displayed. |
| **StopSubtitle** (const `UAssetUserData& Data`) | Stops the given subtitle asset being displayed. This includes subtitles not yet being displayed due to their `StartOffset`. |
| **StopSubtitle()** | Stops all queued subtitles from being displayed. This includes subtitles not yet being displayed due to their `StartOffset`. |

#### QueueSubtitlesFromAsset

`QueueSubtitlesFromAsset(TSoftObjectPtr<USubtitleAsset> SubtitleAsset)`

Subtitle assets can hold more than one subtitle; all of them can be queued automatically with their timings correctly offset from this one Blueprint call.

#### IsSubtitleActive

`IsSubtitleActive(const FSubtitleAssetData& Subtitle) const`

Returns true if the given subtitle asset is being displayed.

#### StopSubtitle

`StopSubtitle(const FSubtitleAssetData& Subtitle);`

Stops the given subtitle asset being displayed.  This includes subtitles not yet being displayed due to their StartOffset.

#### StopAllSubtitles

`StopAllSubtitles();`

Stops all queued subtitles from being displayed.  This includes subtitles not yet being displayed due to their StartOffset.

#### QueueSubtitlesFromAsset

`StopSubtitlesInAsset(TSoftObjectPtr<USubtitleAsset> SubtitleAsset)`

Immediately stops and unqueues all the subtitles in the provided asset.

#### Displaying Dynamically Generated Subtitles

FText from arbitrary sources (e.g. dynamically replicated from a multiplayer server) can be displayed as subtitles.

Example:

```cpp_programming
USubtitlesSubsystem* Subsystem = NewObject<USubtitlesSubsystem>(pWorld, NAME_None, RF_Transient);

check(Subsystem != nullptr);

FSubtitleAssetData Subtitle;

check(Subtitle != nullptr);
Subtitle.Text = <arbitrary FText input>;

constexpr float InfiniteDuration = FLT_MAX;
```
(2 more lines on the web page)

**Subsystem->QueueSubtitle**(SubtitleParameters, ESubtitleTiming::ExternallyTimed);

### Sequencer

Drag your subtitle asset onto a subtitle track in the **Sequencer**. Subtitle properties can then be edited by right-clicking on the subtitle and selecting **Properties**. In the sequencer, subtitle duration is controlled by the selection range start and end rather than its duration property.

[image: GIF showing media track options while working with a track.]

Time warping, time dilation, and scrubbing through the sequence are all supported: the subtitles are queued in small temporal chunks and regularly re-queued until playback is outside of their respective section’s scope in the sequence.

### Localization

The subtitle system supports localization via its localizable FText (-> text-localization-in-unreal-engine) property.  The FTexts are localized to the current language on the client using the localization system's hashkey implementation – localization occurs before and independent of the subtitle system.  See Localization (-> localizing-content-in-unreal-engine).

For DialogueWaves, the duration is taken from the related locale-specific sound wave. For class types derived from SoundBase, if the asset is localized, the localized sound’s duration is used. In this case, the original sound should have its subtitle set first. When a localized variant of a Sound is imported, it will automatically copy over the subtitle reference from the source version.

Subtitles embedded as AssetUserData in localized Waves in Unreal Engine 5.8 or earlier must be migrated with a 2-step process:

- Right-click the source Wave asset and select **Migrate Embedded Subtitles to Asset**.

- Select and right-click all loc variant Waves and select **Fix Localized Subtitle Waves**.

### Importing Bulk Subtitles

External subtitles in the SRT format are imported as Basic Overlay assets when added to an Unreal project. To use these assets with the plugin, you can convert them to a Subtitle asset: Right-click the asset, go to **Scripted Asset Actions**, and click **Convert Basic Overlays to Subtitles**.

[image: Context menu when right-clicking on an imported subtitle file in Unreal Editor (Scripted Asset Actions selected)]

## Migration Guide

The **Migration Tool** copies the subtitle data in a given `DialogueWave` or `SoundWave` into the new `Subtitle` asset type. It puts the new asset into the given `DialogueWave` or `SoundWave`'s `AssetUserData`. Already-migrated subtitles are updated if the given `DialogueWave` or `SoundWave` is migrated again.  However, if the remigration results in no change, the target asset isn’t marked dirty and need not be resaved to disk.

Migration is non-destructive; old and new subtitles will be displayed automatically by default, letting the user control which content is used.

Display parameter settings (e.g. font, color, etc.) are not currently part of the migration tool.  These are set by category via the `TextBlock` widget settings documented above.

### Migrating SoundWaves

To use the tool, select one or more `SoundWave` assets in the Content Browser. Then, right-click, go to **Scripted Editor Actions**, and select **Create Subtitle**.  This creates a new `USubtitleAssetUserData` to the `SoundWave`s that contain the migrated subtitle data.

To remove data from the old subtitle system when necessary, follow these steps:

- Select one or more `SoundWave` assets in the **Content Browser**.

- Right-click and go to **Scripted Editor Actions**.

- Select **Remove Legacy Subtitles**, which empties the old subtitle array. Note this action will not remove old subtitles in the case they haven’t yet been migrated to the new system. [image: GIF using the right click menu on a sound wave file to remove a subtitle.]

### Migrating DialogueWaves

After migrating the `SoundWave` associated with a `DialogueWave`, use the console command `au.UseNewSubtitles 1` to see it with this subtitles plugin. You can switch back to using the original content and subtitle system by setting the console variable back to its default of **0**. The cvar only takes effect on new DialogueWaves played.

### Performance Notes

Disk usage varies slightly between the old and new system, with subtitles migrated to the new system requiring approximately **16 bytes** more per subtitle (80 bytes in the old system, to 96 bytes in the new one) when queued for display.

Before (80 bytes per queued subtitle):

- `FQueueSubtitleParams`: 56 bytes

- `FSubtitleCue`: Multiples of 24 bytes. Assuming only one of these for this comparison.

After (96 bytes per queued subtitle):

- `FQueueSubtitleParameters`: 16 bytes

- `USubtitleAssetUserData`: 80 bytes

Unqueued subtitles sitting in memory do not use the `FQueueSubtitleParameters` structs, so "bulk" subtitles show a bigger difference at 24 bytes (old) to 80 bytes (new), with a difference of **56 bytes **due to the additional properties and features.

### Migration Tool Source

If modifications to the migration tool are necessary, it can be found in the subtitle plugin’s folder: `SubtitlesAndClosedCaptions/Content/EditorUtilities/MakeAssetUserDataFromLegacySubtitles.uasset`

Like the rest of the new subtitle plugin, the migration tool is currently in Beta.
