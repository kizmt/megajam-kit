# File Logging Analytics Provider

https://dev.epicgames.com/documentation/en-us/unreal-engine/file-logging-analytics-provider-for-unreal-engine?application_version=5.9

> The file logging provider can be used to debug your analytics process during development.

This provider is used to write analytics API calls to disk in JSON format. The reason to use this provider is for debugging the analytics process. It writes the data to the
`Saved/Analytic`s folder giving each file a unique name that ends in `.analytics`. You can then compare the data saved in that file to the events on your analytics provider's dashboard to
make sure all of the data is being processed. There aren't any special configuration settings for this provider.

This provider writes each session's data to disk which will cause ever-growing data in a released game or app. We recommend that you only use this provider for development and
don't include it in your released product.

The image below shows files created when testing the 4.8 API additions.
