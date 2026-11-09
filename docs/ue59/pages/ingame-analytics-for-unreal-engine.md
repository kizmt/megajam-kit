# In-Game Analytics

https://dev.epicgames.com/documentation/en-us/unreal-engine/ingame-analytics-for-unreal-engine?application_version=5.9

> Use in-game analytics to track player engagement and find balance issues.

In order to get data on how your game is performing, you must use an analytics provider to capture and process the data. For those without a homegrown solution, there are plenty of
options available, from free services to paid ones. Unreal Engine provides an abstract interface for communicating with one or more analytics providers. Your game uses the interface, and analytics providers offer a backing implementation. In some cases, Epic has built the backing provider already. Previously, Epic Games provided an implementation to multicast analytics events, relaying them to multiple providers. For providers, there is support of providers that support Swrve, a paid service, and support for Flurry.

More provider plugins will become available over time, and it is also feasible to add your own provider if needed.

## Implementing Game Analytics

- Instrumenting Your Game (-> instrumenting-your-game-with-analytics-in-unreal-engine): Using in-game analytics to track player engagement and find balance issues.

- Blueprint Analytics Plugin (-> blueprint-analytics-plugin-for-unreal-engine): A set of Blueprint nodes for communicating with analytics services.

## Providers

- File Logging Analytics Provider (-> file-logging-analytics-provider-for-unreal-engine): The file logging provider can be used to debug your analytics process during development.

- Flurry Analytics Provider (-> flurry-analytics-provider-for-unreal-engine): A set of Blueprint nodes provided to allow you to communicate with analytics services

- Multicast Analytics Provider (-> multicast-analytics-provider-for-unreal-engine): A set of Blueprint nodes provided to allow you to communicate with analytics services.
