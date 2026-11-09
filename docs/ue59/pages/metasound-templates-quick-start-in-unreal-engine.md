# MetaSound Templates Quick Start

https://dev.epicgames.com/documentation/en-us/unreal-engine/metasound-templates-quick-start-in-unreal-engine?application_version=5.9

> Learn how to use a MetaSound Template to customize procedural sounds, such as footsteps with effects, randomized weapon fire, ambient layers, and more.

Learn to use this **Experimental** feature, but use caution when shipping with it.

All APIs in this guide are marked experimental. Signatures, flags, and editor surfaces may change in a future release. Pin your code to a specific engine revision if you depend on them.

This feature was previously named **MetaSound Configurations**. It was renamed to **MetaSound Templates** to avoid collision with the unrelated Node Configurations system in MetaSounds. `…Configuration…` type, header, and interface has been renamed to `…Template…`.

A **MetaSound Template** is a `USTRUCT` that lives on a MetaSound asset and procedurally generates or mutates the asset's graph, interface, and properties whenever a designer edits the template's exposed fields — and again at cook time. By isolating a small set of `UPROPERTY` fields that drive the template's `ConfigureDocument()` call, a template author shields end-users from the full MetaSound graph and exposes only the knobs that matter.

Templates enable developers to templatize procedural sounds (footsteps with effects, randomized weapon fire, ambient layers), let non-audio programmers or designers tweak variations without touching the graph, automate repetitive audio setups, hide implementation details that should not be edited, and version template behavior so fixes and deprecations can roll out without touching individual assets. The existing **MetaSound Preset** system is now itself a template (`FMetaSoundFrontendPresetTemplate`) — Presets are just a more sophisticated template characterization.

If your sound design is trivial (one or two nodes), authoring a regular MetaSound by hand is still faster. Templates shine when graph logic gets cumbersome or repetitive to maintain across many assets.

## Workflows

This guide offers two self-contained workflows:

| Workflow | Audience | Use if: |
| --- | --- | --- |
| Using Templates in the MetaSound Editor | Sound Designers | You want to use templates that ships with the engine or a plugin. No C++ required. |
| Authoring a Template in Code | Plugin / Project Developers | You want to create a new template (optionally with custom MVVM/UMG UI) in C++. |

## Using Templates in MetaSound Editor

Audience: Sound Designers. No C++ required. Every step is an editor action.

 The MetaSound Editor toolbar Template dropdown opened over a MetaSound Source asset, with Randomizer selected. The Details panel exposes the Randomizer's `Is One Shot`, `Sounds`, and `Pitch` properties.

### Create a MetaSound from a Template

- In the **Content Browser**, right-click and choose **Audio → MetaSound Source** (or **MetaSound Patch**).
- When the asset is created, open it. New MetaSounds start with an unset **Template**.A Template can be registered to appear directly in the Content Browser right-click menu, and creation of a MetaSound (with that template already applied) can be done in a single step.

### Apply or Switch a Template on an Existing Asset

Open the MetaSound asset and click the **Template** dropdown in the top-left of the toolbar. You will see up to two sections:

- **Set Template**: Replaces the current template with the one you select. This **discards** the current graph content so that the new template can regenerate the graph from scratch using its `ConfigureDocument()` rules. Use this when you know you want the new template's topology.
- **Convert Template**: Appears only when a Template is set. Clears template, preserving the underlying MetaSound in its last state as applied by the Template, preserving designer intent while exposing the underlying MetaSound for further manipulation and customization otherwise hidden by the Template settings.If a menu entry is greyed out or missing, the current template author has restricted which templates can be set on this asset class — see Troubleshooting.

### Edit Template Properties

Once a Template is applied, you have up to three editor surfaces to interact with, depending on what the template author opted into:

- **Details panel**** → Template category**: The template's exposed `UPROPERTY` fields appear here by default. This is your primary edit location for most templates.
- **Custom Template tab**: If the template ships a custom UMG widget, a dedicated **Template** tab appears (alongside the graph editor if the graph has not been hidden by the template author), giving you a purpose-built UI (sliders, previews, array editors) for that template.
- **Graph editor, Interfaces panel, Members panel**: These traditional MetaSound panels and tabs may be hidden, read-only, or fully editable (depending on `FEditorOptions` flags set by the author). A template that hides the graph editor is doing so intentionally — it expects the designer to drive behavior purely through properties.Any edit to a template property rebuilds the underlying MetaSound graph, inputs, etc. procedurally. You do not need to hit **Save** to observe changes — just audition.

### Worked example: the Randomizer Template

The Randomizer is a reference template. It is hidden by default.

Because this is also an Unreal Engine feature and can be compiled with code there, the "Hidden" keyword must be removed in code and the project recompiled to enable the "Randomizer". Keep in mind, this struct is only included in Unreal Engine 5.8 (-> unreal-engine-5-8-documentation), this example has not been tested in a production-ready environment.

- Create a new MetaSound Source.
- Toolbar → Template dropdown → under Set Template, pick Randomizer.
- In the Details panel, locate the Randomizer Options category and:Toggle **Is One Shot** — off plays a continuous loop, on triggers a single pick per play.
- Expand **Sounds** and add `USoundWave` references. The Randomizer will discard anything that is not exactly a `USoundWave` (e.g. `USoundSourceBus`, derived `UMetaSoundSource`) the next time the template runs.
- **Adjust Pitch** — the X component is the minimum semitone offset, the Y the maximum. Defaults are `-3.0` to `3.0`. The template clamps to `-36 / +36`.

- Audition. Each play picks a random sound from the list and applies a random pitch offset inside your range.

Under the hood, every property change you make invokes `FMetaSoundRandomizerTemplate::ConfigureDocument()`, which rewrites the MetaSound graph topology to match. Users never need to open or interact with the graph editor.

### Presets are Templates

The MetaSound **Preset** system is now fully integrated with the template system as `FMetaSoundFrontendPresetTemplate`. When you apply a Preset, you are applying a specialized template whose job is to inherit from a parent MetaSound and let you override a curated subset of its inputs. Everything you know about Presets still works — see the existing MetaSound Reference Guide for Preset-specific details.

### Troubleshooting for designers

| Symptom | Likely Cause |
| --- | --- |
| Template dropdown is empty. | No template shipped for this MetaSound asset class. Templates opt in via `FEditorOptions::MetaSoundClasses`. |
| Desired template is missing from **Set Template**. | The template author restricted it to a different asset class (e.g. Patch only). |
| **Convert Template** is greyed out. | No conversion path exists between the current and target template. Use **Set Template** instead (destructive). |
| Custom **Template** tab disappeared. | The current template does not ship a custom widget, or `FEditorOptions::bCustomTabEnabled` is `false` on the author side. |
| Details panel properties are read-only. | The template author intentionally exposed them read-only; or you are inspecting a cooked/imported asset. |
| Graph editor is missing. | The current template has `bGraphEditorVisible = false`. Developer escape hatch: set CVar `au.MetaSound.Editor.IgnoreTemplateVisibilitySettings 1` to force all surfaces visible. |
| Properties do nothing when I change them. | `ConfigureDocument()` is erroring on the template side; ask the template author to check their logs. |

## Authoring a Template in Code

Audience: plugin and project developers. Requires C++.

All of the public symbols below are marked `UE_EXPERIMENTAL`. Expect breaking changes in a future release and guard yourself against header drift.

### Prerequisites

- A C++ toolchain set up for your project (Visual Studio on Windows, etc.).
- A module that can depend on `MetasoundFrontend` for the runtime portion of your template (the `USTRUCT` and `ConfigureDocument()` override).
- If you want custom editor UI, additionally:A module that can depend on `MetasoundEditor`.
- The Model View Viewmodel plugin enabled in your .uproject (ModelViewViewModel).

### The “Minimum Viable Template”

Create a `USTRUCT` that inherits from `FMetaSoundFrontendDocumentTemplate`, declare the `UPROPERTY` fields you want to expose to designers, and override `ConfigureDocument()`. The following excerpt is adapted from the shipped Randomizer at `MetasoundRandomizerTemplate.h:18-53`:

 C++

```
// YourModule/Public/DocumentTemplates/MyProceduralTemplate.h
#pragma once
#include "DocumentTemplates/MetasoundFrontendDocumentTemplate.h"
#include "Sound/SoundWave.h"
#include "UObject/ObjectPtr.h"
#include "MyProceduralTemplate.generated.h"
USTRUCT(BlueprintType, meta = (Hidden, DisplayName = "My Procedural"))
struct FMyProceduralTemplate : public FMetaSoundFrontendDocumentTemplate
{
    GENERATED_BODY()
```

Implement `ConfigureDocument()` using the `FMetaSoundFrontendDocumentBuilder` API (see the MetaSound Builder API reference for the full set of operations — adding nodes, wiring inputs, setting defaults, etc.). The builder is the only way you should mutate the document: direct pointer manipulation is not supported.

`ConfigureDocument()` is called both interactively when the user edits a property and at cook time. It must be deterministic for identical input properties, otherwise cooked output will delta differently between patches.

Two further virtuals you may override:

- `OnAssetInitialized(TArray SelectedObjects, FMetaSoundFrontendDocumentBuilder&)` — called once when a new MetaSound is created from this template via Content Browser drag/drop. SelectedObjects contains whatever the user had highlighted at the moment of creation, useful for seeding defaults (e.g. pre-populating Sounds from selected `USoundWave` assets).
- `OnPropertyChanged(const FPropertyChangedEvent&, FMetaSoundFrontendDocumentBuilder&)` — called before `ConfigureDocument()` on each property change. Use this for validation or to mutate state before the rebuild (e.g. the Randomizer uses this to strip invalid entries from `Sounds` via a helper `RemoveInvalidSounds`).

### Controlling the editor UI via GetEditorOptions()

Override `GetEditorOptions()` to return a configured `FEditorOptions` that tailors the MetaSound Editor experience for your template. Defaults below come from `MetasoundFrontendDocumentTemplate.h:45-89`.

| Field | Type | Default | When to set |
| --- | --- | --- | --- |
| `AssetActionClasses` | `TArray<TSoftClassPtr<UObject>>` | all MetaSound types | Restrict which Content Browser right-click Create MetaSound with `<Template>` actions show your template. |
| `MetaSoundClasses` | `TArray<TSoftClassPtr<UObject>>` | all MetaSound types | Restrict which MetaSound asset classes your template can be applied to (e.g. MetaSoundSource only). |
| `ToolTip` | `FText` | empty | Hover text shown next to your template in the **Set Template** picker. |
| `bCustomTabEnabled` | `bool` | `true` | Set to `false` to suppress the custom Template tab even if a matching widget exists. |
| `bInterfaceEditingEnabled` | `bool` | `false` | true if your designers should edit MetaSound interfaces while your template is active. |
| `bMemberEditingEnabled` | `bool` | `false` | `true` if designers should add/rename graph members. |
| `bPageGraphEditingEnabled` | `bool` | `false` | `true` if designers should edit page graphs (multi-graph MetaSounds). |
| `bGraphEditorVisible` | `bool` | `false` | `true` to show the graph editor by default. Useful for templates that seed a graph as a starting point but leave editing open. |
| `bTemplatePropertiesVisible` | `bool` | `true` | Set to `false` if your template has no user-editable properties and the Details category would be empty. |

Return a `static` local `FEditorOptions` configured once:

 C++

```
const FMetaSoundFrontendDocumentTemplate::FEditorOptions& FMyProceduralTemplate::GetEditorOptions() const
{
    static const FEditorOptions Options = []
    {
        FEditorOptions Opts;
        Opts.ToolTip = NSLOCTEXT("MyTemplates", "MyProcedural_Tip",
            "Randomly selects a sound from a list with pitch variation.");
        Opts.bGraphEditorVisible = false;  // hide the graph — designers only touch properties
        return Opts;
    }();
```

**Debug Tip**: The console variable `au.MetaSound.Editor.IgnoreTemplateVisibilitySettings` (declared at MetasoundEditor.cpp:136-139) forces every visibility flag to `true` at runtime. Useful when debugging a template that has hidden your graph.

### Topology-Manipulating Templates

For templates that do non-trivial graph manipulation, two utilities are available:

- `MetasoundDocumentConfigurator.h` — higher-level builder helper for common graph shapes. Start here before reaching for raw `FMetaSoundFrontendDocumentBuilder` calls. Code for the Document Configurator is easily reflected from existing MetaSound content by selecting nodes in the MetaSound Asset Editor and using the right-click option “Copy Selected As Configurator Code to Clipboard".
- `FMetaSoundFrontendDocumentVertexTemplate` (header) — extend from this instead of FMetaSoundFrontendDocumentTemplate when your template needs to attach **per-vertex** metadata (one payload per input or per output). It stores a `TMap` keyed by vertex GUID and exposes `OnDefaultReset` / `OnDefaultUpdated` hooks so your template can react when a vertex's default value is modified. The shipped Preset template extends this variant.

Prefer the base `FMetaSoundFrontendDocumentTemplate` unless you specifically need per-vertex data — it's lighter weight and avoids the vertex-lifecycle complexity.

### Custom UI via MVVM

Shipping custom in-editor UI for your template is a three-layer task: the template struct (Model), a ViewModel, and a UMG Widget. The ViewModel base bridges your template data onto a `UMVVMViewModelBase` so UMG's `FieldNotify` bindings can talk to it. The shipped Randomizer is the canonical reference implementation.

#### The Template struct (Model)

Use the `USTRUCT` from Minimum Viable Template (-> metasound-templates-quick-start-in-unreal-engine). Every property you want bound into the UI must be a `UPROPERTY`.

#### The ViewModel

Subclass `UMetaSoundTemplateViewModelBase` (header). The base owns a `UMetaSoundBuilderBase*` reference, listens for template-change events, and exposes `GetConstTemplate<T>()` so you can read your template's state type-safely. It also declares a pure-virtual-style `IsSupportedTemplate(const UScriptStruct&)` that you must override to declare which template struct your ViewModel is for.

The Randomizer at `RandomizerConfigurationViewModel.h:18-70` shows two binding patterns:

- `UFUNCTION(FieldNotify)`-**based reads** for derived values (e.g. `GetPitchMin()` returns `Pitch.X`). Widgets bind to the function and get a broadcast whenever the VM invalidates the field.
- `UPROPERTY(FieldNotify, Getter=, Setter=)`-**based two-way** for straight-through fields (e.g. the `bIsOneShot` bool mirrors onto a C++ getter/setter pair).

Excerpted from the Randomizer:

 C++

```
UCLASS(MinimalAPI, DisplayName = "MetaSound Randomizer ViewModel")
class UMetaSoundRandomizerViewModel : public UMetaSoundTemplateViewModelBase
{
    GENERATED_BODY()

public:
    UFUNCTION(BlueprintPure, FieldNotify, Category = "MetaSound|Randomizer")
    float GetPitchMin() const;

    UFUNCTION(BlueprintCallable, Category = "MetaSound|Randomizer")
```

In your `.cpp`:

 C++

```
bool UMetaSoundRandomizerViewModel::IsSupportedTemplate(const UScriptStruct& InStruct) const
{
    return InStruct.IsChildOf(FMetaSoundRandomizerTemplate::StaticStruct());
}

float UMetaSoundRandomizerViewModel::GetPitchMin() const
{
    if (const FMetaSoundRandomizerTemplate* Template = GetConstTemplate<FMetaSoundRandomizerTemplate>())
    {
        return Template->Pitch.X;
```

The pattern: **getters read from **`GetConstTemplate<T>()`**; setters write back through **`Builder->SetTemplateProperties<T>(…)` so that the Template's `ConfigureDocument()` runs and the asset is marked dirty.

#### The Widget

Create a `UUserWidget` (typically an **Editor Utility Widget** so it can live in-editor content) and implement `IMetaSoundTemplateWidgetInterface`. All events are `BlueprintImplementableEvent` — you can implement in Blueprint or C++. The interface defines five events:

| Event | Required | Purpose |
| --- | --- | --- |
| `IsSupportedTemplate(ConfigName, Builder, out bIsSupported)` | **Required** | Return `true` if this widget should display for the current template. This is the only visibility gate — the editor calls it to decide whether to spawn your tab. |
| `OnInitializingViewModel(out Class)` | Recommended | Return the `TSubclassOf<UMetaSoundTemplateViewModelBase>` you want instantiated. The editor then auto-binds the VM to your widget via `UMVVMView::SetViewModelByClass()`. |
| `OnInitializingTab(out FMetaSoundTemplateWidgetTabInfo)` | Optional | Fill in `TabName`, `TabDisplayName`, `StyleName`, `TabIcon`, `ToolTip`. Defaults inherit from the template's display name. |
| `OnBuilderSet(Builder)` | Optional | Called before `PreConstruct`. Receive the live `UMetaSoundBuilderBase*`. |
| `OnAuditionStateChanged(AudioComponent, bIsAuditioning)` | Optional | Notified when audition starts/stops; the `AudioComponent` is valid while auditioning, `nullptr` after stop. Useful for driving live-preview widgets. |

Once your widget is running, bind its inputs (sliders, spinboxes, array editors, text blocks) to the ViewModel's `FieldNotify` properties using UMG's standard MVVM panel. Edits flow through the VM's setters into the template, `ConfigureDocument()` runs, and the MetaSound rebuilds — live.

### No Explicit Registration

You do **not** register your template, ViewModel, or widget anywhere. The editor discovers:

- **Templates** automatically because they are reflected `USTRUCT`s extending `FMetaSoundFrontendDocumentTemplate`.
- **Widgets** by scanning `UClasses` that implement `IMetaSoundTemplateWidgetInterface`.
- **ViewModels** by whatever class the widget returns from `OnInitializingViewModel`.

The single visibility gate is `IsSupportedTemplate`, implemented in two places: on the widget (for tab visibility) and on the ViewModel (for `GetConstTemplate<T>` type safety). Both should return `true` for the same template struct type.

### Testing your Template

- Rebuild your runtime + editor modules.
- Open an existing or new **MetaSound Source**.
- Toolbar → **Template** → your new entry should appear under **Set Template**.
- Apply it and verify:If you shipped a widget, the **Template** tab opens with your UMG content.
- Your `UPROPERTY` fields appear in the Details panel under the category name you set.

- For bring-up, drop a `UE_LOG` at the top of `ConfigureDocument()` so you can see it fire on every property edit. Remove before shipping.
- Cook-time test: package the project with an asset that uses your template and confirm the cooked `.uasset` plays identically to the editor preview. A drift here means your `ConfigureDocument()` is nondeterministic.

### Troubleshooting for Authors

| Symptom | Check |
| --- | --- |
| Template missing from Set Template. | Is your struct reflected (`GENERATED_BODY()`, reflected module)? Is `GetEditorOptions().MetaSoundClasses` restricting to a class your test asset isn't? |
| Widget never appears. | Does your widget's `IsSupportedTemplate` return true? Is `FEditorOptions::bCustomTabEnabled = true`? Is `ModelViewViewModel` plugin enabled? |
| ConfigureDocument() never runs on edit. | Is the property actually a `UPROPERTY` marked `EditAnywhere`? `OnPropertyChanged` runs before `ConfigureDocument` — add a log there to isolate. |
| ViewModel binding shows stale value. | Did you call `UE_MVVM_BROADCAST_FIELD_VALUE_CHANGED` after mutating the template? Is the `UFUNCTION/UPROPERTY` marked `FieldNotify`? |
| Runtime asset differs from editor preview. | `ConfigureDocument()` is nondeterministic. Remove any non-input state (RNG without a seed, time-based branching, pointer-order dependencies). |
| Widget appears but bindings don't push into the template. | Your VM setter isn't routing through `Builder->SetTemplateProperties<T>()` — direct writes bypass the undo/redo + dirty pipeline. |

## Reference Appendix

### Appendix 1 — Rename map

| UE 5.7 and earlier (Configuration) | UE 5.8+ (Template) |
| --- | --- |
| `FMetaSoundFrontendDocumentConfiguration` | `FMetaSoundFrontendDocumentTemplate` |
| `MetasoundFrontendDocumentConfiguration.h` | `MetasoundFrontendDocumentTemplate`.h |
| `IMetaSoundDocumentConfigurationWidgetInterface` | `IMetaSoundTemplateWidgetInterface` |
| `UMetaSoundDocumentConfigurationViewModelBase` | `UMetaSoundTemplateViewModelBase` |
| "Configuration" toolbar button | "Template" toolbar button |
| "Set Configuration" / "Convert Configuration" | "Set Template" / "Convert Template" |
| `SetDocumentConfiguration()` (builder) | `SetTemplate()` / `SetTemplateProperties<T>()` |

### Appendix 2 — Header quick-reference

| Header | Module | Use when: |
| --- | --- | --- |
| `DocumentTemplates/MetasoundFrontendDocumentTemplate.h` | `MetasoundFrontend` | Authoring any template — base `USTRUCT`, `FEditorOptions`, virtuals. |
| `DocumentTemplates/MetasoundFrontendDocumentVertexTemplate.h` | `MetasoundFrontend` | Authoring a template that attaches per-input/output metadata. |
| `DocumentTemplates/MetasoundFrontendPresetTemplate.h` | `MetasoundFrontend` | Extending or composing against the Preset template. |
| `MetasoundFrontendDocumentBuilder.h` | `MetasoundFrontend` | Inside `ConfigureDocument()` — `SetTemplate`, `SetTemplateProperties`, graph builder calls. |
| `TemplateViewModels/MetasoundTemplateViewModelBase.h` | `MetasoundEditor` | Authoring a ViewModel subclass for custom UI. |
| `MetasoundTemplateWidgetInterface.h` | `MetasoundEditor` | Implementing the 5 widget events (including `OnAuditionStateChanged`). |
| `DocumentTemplates/MetasoundRandomizerTemplate.h` | `MetasoundEngine` | Reference implementation of a shipped template. |
| `TemplateViewModels/RandomizerConfigurationViewModel.h` | `MetasoundEditor` | Reference implementation of a template ViewModel. |

### Appendix 3 — FEditorOptions full flag reference

Repeat of Controlling the Editor UI via GetEditorOptions() for quick look-up.

| Field | Default | Effect when set from default |
| --- | --- | --- |
| `AssetActionClasses` | all MetaSound types | Limits Content Browser right-click creation entries for this template. |
| `MetaSoundClasses` | all MetaSound types | Limits which MetaSound asset classes can host this template. |
| `ToolTip` | empty | Shown next to the template in the **Set Template** picker. |
| `bCustomTabEnabled` | `true` | Set to `false` to suppress custom tab creation even if a matching widget exists. |
| `bInterfaceEditingEnabled` | `false` | Enable the Interfaces panel while the template is active. |
| `bMemberEditingEnabled` | `false` | Enable adding / renaming graph members. |
| `bPageGraphEditingEnabled` | `false` | Enable page-graph editing (multi-graph MetaSounds). |
| `bGraphEditorVisible` | `false` | Show the graph editor by default. |
| `bTemplatePropertiesVisible` | `true` | Set to `false` to hide the Details category when your template has no user-editable properties. |

Debug CVar: `au.MetaSound.Editor.IgnoreTemplateVisibilitySettings 1` forces all flags to `true`.

### Appendix 4 — Further reading

- **MetaSound Reference Guide** — core graph/node concepts, Presets, built-in nodes.
- **MetaSound Builder API** — the `FMetaSoundFrontendDocumentBuilder` surface used inside `ConfigureDocument()`.
- **Model View Viewmodel plugin** — UMG's MVVM documentation covers binding syntax, `FieldNotify`, and the `UE_MVVM_*` macros used throughout the ViewModel layer.

- templates
- sound
- metasound
- unreal
- ue
- sound design

On this page

- Workflows (-> metasound-templates-quick-start-in-unreal-engine)
- Using Templates in MetaSound Editor (-> metasound-templates-quick-start-in-unreal-engine)
- Create a MetaSound from a Template (-> metasound-templates-quick-start-in-unreal-engine)
- Apply or Switch a Template on an Existing Asset (-> metasound-templates-quick-start-in-unreal-engine)
- Edit Template Properties (-> metasound-templates-quick-start-in-unreal-engine)
- Worked example: the Randomizer Template (-> metasound-templates-quick-start-in-unreal-engine)
- Presets are Templates (-> metasound-templates-quick-start-in-unreal-engine)
- Troubleshooting for designers (-> metasound-templates-quick-start-in-unreal-engine)
- Authoring a Template in Code (-> metasound-templates-quick-start-in-unreal-engine)
- Prerequisites (-> metasound-templates-quick-start-in-unreal-engine)
- The “Minimum Viable Template” (-> metasound-templates-quick-start-in-unreal-engine)
- Controlling the editor UI via GetEditorOptions() (-> metasound-templates-quick-start-in-unreal-engine)
- Topology-Manipulating Templates (-> metasound-templates-quick-start-in-unreal-engine)
- Custom UI via MVVM (-> metasound-templates-quick-start-in-unreal-engine)
- The Template struct (Model) (-> metasound-templates-quick-start-in-unreal-engine)
- The ViewModel (-> metasound-templates-quick-start-in-unreal-engine)
- The Widget (-> metasound-templates-quick-start-in-unreal-engine)
- No Explicit Registration (-> metasound-templates-quick-start-in-unreal-engine)
- Testing your Template (-> metasound-templates-quick-start-in-unreal-engine)
- Troubleshooting for Authors (-> metasound-templates-quick-start-in-unreal-engine)
- Reference Appendix (-> metasound-templates-quick-start-in-unreal-engine)
- Appendix 1 — Rename map (-> metasound-templates-quick-start-in-unreal-engine)
- Appendix 2 — Header quick-reference (-> metasound-templates-quick-start-in-unreal-engine)
- Appendix 3 — FEditorOptions full flag reference (-> metasound-templates-quick-start-in-unreal-engine)
- Appendix 4 — Further reading (-> metasound-templates-quick-start-in-unreal-engine)
