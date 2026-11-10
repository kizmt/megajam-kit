# Managing the Active Culture at Runtime

https://dev.epicgames.com/documentation/en-us/unreal-engine/managing-the-active-culture-at-runtime?application_version=5.9

> This page describes querying, applying and overriding the active culture. It also discusses the localization preview, culture remapping, and culture restrictions.

[image: Managing the Active Culture at Runtime]

## Querying and Applying Cultures

The **Active Culture** in **Unreal Engine (UE)** can actually refer to one of three things:

- The **language** - The language is used to work out which localization data should be used.

- The **locale** - The locale is used to control how numbers/dates/times/etc are formatted within our internationalization library.

- An **Asset group culture** - Asset groups (-> asset-localization-in-unreal-engine) allow you to create a group of Asset classes that can be assigned a different culture than the main project language.

It is possible set all of these at once by changing the Active Culture. However, if your project intends to use Asset groups, then you'll want to treat the language and locale (which games often set to the same value) and Asset groups as separate settings.

UE makes this separation simple, and also provides some utilities that you can use in both C++ and Blueprints to help manage the settings.

### Getting the Active Culture

The underlying active culture information is stored in the `FInternationalization` singleton, but `UKismetInternationalizationLibrary` provides a small set of wrapper functions that let you consistently access the information from both C++ and Blueprints.

| Function | Description |
| --- | --- |
| **GetCurrentLanguage** | Get the active language as an IETF language tag. |
| **GetCurrentLocale** | Get the active locale as an IETF language tag. |
| **GetCurrentAssetGroupCulture** | Get the culture for a named asset group as an IETF language tag. |

### Setting the Active Culture

The underlying Active Culture information is stored in the `FInternationalization` singleton, but `UKismetInternationalizationLibrary` provides a small set of wrapper functions that let you set the values from both C++ and Blueprints. They also provide a way to optionally persist the new settings to the per-user config file.

| Function | Description |
| --- | --- |
| **SetCurrentCulture** | Set the Active Culture (language, locale, and all asset groups) from an IETF language tag. |
| **SetCurrentLanguage** | Set the active language from an IETF language tag. |
| **SetCurrentLocale** | Set the active locale from an IETF language tag. |
| **SetCurrentLanguageAndLocale** | Set the active language and locale from an IETF language tag. |
| **SetCurrentAssetGroupCulture** | Set the culture for a named asset group from an IETF language tag. |
| **ClearCurrentAssetGroupCulture** | Clear the culture for a named asset group (will revert back to using the active language). |

The culture can also be changed in non-shipping builds using engine console commands.

**Example:**

```
	culture=fr
	language=fr
	locale=fr
```

culture=fr
 language=fr
 locale=fr

### Querying the Available Languages

The underlying available language information is stored in the `FTextLocalizationManager` singleton, but `UKismetInternationalizationLibrary` provides a small set of wrapper functions that lets you consistently access the information from both C++ and Blueprints.

| Function | Description |
| --- | --- |
| **GetNativeCulture** | Get the native culture of a localization category as an IETF language tag. |
| **GetLocalizedCultures** | Get the list of cultures that have localization data available as IETF language tags. |
| **GetSuitableCulture** | Get the most suitable culture from a list of available cultures. |
| **GetCultureDisplayName** | Get the display name of a culture from its IETF language tag. |

### Overriding the Default Culture

UE determines the default culture by querying the underlying platform layer for the active language and locale. If the platform language isn't supported, UE falls back to the native language of your Localization Target. In a shipped project, you probably won't override this behavior. However, during development these overrides can be useful for testing other languages.

The default settings for your project will typically be defined in your `DefaultGame.ini`. This example shows setting the culture to French.

**Example:**

```
	[Internationalization]
	culture=fr
```

[Internationalization]
 culture=fr

This example shows setting the language and locale to French, while setting the Audio Asset group to Japanese.

**Example:**

```
	[Internationalization]
	language=fr
	locale=fr
	[Internationalization.AssetGroupCultures]
	+Audio=ja
```

[Internationalization]
 language=fr
 locale=fr
 [Internationalization.AssetGroupCultures]
 +Audio=ja

The settings can also be overridden using command line flags.

**Example:**

```
	-culture=fr
	-language=fr
	-locale=fr
```

-culture=fr
 -language=fr
 -locale=fr

## Localization Preview

The localization preview provides a way to preview your project localization data without leaving the Editor, and is configured by the **Preview Game Language** setting. To change these settings, follow these steps.

- In the menu bar of the Editor, click **Edit > Editor Preferences.**

- In the **Editor Preferences** dialog, under **General**, click **Region and Language**.

- Click the dropdown next to **Preview Game Language** and select the language you want to preview.

The preview is automatically activated when **Play in Editor (PIE)** is running, as well as being passed to any standalone instances that are launched in the Editor. This preview can also be used in the **UMG Editor** to preview widgets in different languages. While a preview is running, all editable text fields are made read-only to prevent accidentally overwriting source data with translation data.

The PIE and UMG previews are not always fully accurate representations of what your project will look like at runtime, because they only load the localization data without affecting the language or locale settings. If you want an accurate representation, run a standalone instance in the Editor (which is the same as running the editor with `-game`).

## Culture Remapping

Culture re-mapping provides a way to map one culture code onto another, and can be useful in dealing with regional variance that can't be handled by a script or country code. Culture re-mappings go inside your `DefaultGame.ini` file, and are a pair of IETF language tags separated by semi-colons.

**Example:**

```
	[Internationalization]
	+CultureMappings="es-MX;es-419"
```

[Internationalization]
 +CultureMappings="es-MX;es-419"

## Culture Restrictions

Culture restrictions provide a way to enable or disable certain cultures, which you can do on a per-build configuration basis. Culture restrictions can be useful if you want to disable languages that are required for testing, but should not be in the shipped version of your project.

Culture restrictions typically go inside your `DefaultGame.ini` file, and are set with an IETF language tag. You can include a list of build configurations to apply the restriction to (no listed build configurations implies that the restrictions apply to all build configurations).

**Example:**

```
	[Internationalization]
	;Enable only French in all build configurations
	+EnabledCultures="fr"
	[Internationalization]
	;Enable only French in the test and shipping build configurations
	+EnabledCultures="fr;Test,Shipping"
	[Internationalization]
	;DisableGerman in the shipping build configuration
```

[Internationalization]
 ;Enable only French in all build configurations
 +EnabledCultures="fr"
 [Internationalization]
 ;Enable only French in the test and shipping build configurations
 +EnabledCultures="fr;Test,Shipping"
 [Internationalization]
 ;DisableGerman in the shipping build configuration

+DisabledCultures="de;Shipping"

- localization
- active culture
- culture remapping

On this page

- Querying and Applying Cultures (-> managing-the-active-culture-at-runtime)
- Getting the Active Culture (-> managing-the-active-culture-at-runtime)
- Setting the Active Culture (-> managing-the-active-culture-at-runtime)
- Querying the Available Languages (-> managing-the-active-culture-at-runtime)
- Overriding the Default Culture (-> managing-the-active-culture-at-runtime)
- Localization Preview (-> managing-the-active-culture-at-runtime)
- Culture Remapping (-> managing-the-active-culture-at-runtime)
- Culture Restrictions (-> managing-the-active-culture-at-runtime)
