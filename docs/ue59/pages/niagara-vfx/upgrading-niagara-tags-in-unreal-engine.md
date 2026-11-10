# Upgrading Niagara Tags

https://dev.epicgames.com/documentation/en-us/unreal-engine/upgrading-niagara-tags-in-unreal-engine?application_version=5.9

> A short overview of upgrading existing Niagara systems and emitters to use the new Tagged Asset Browser Configuration assets.

[image: The Tagged Asset Browser]

[image: Comparing tags in an asset to tags in the Asset Browser]

The update of the **Niagara Asset Browser** with the release of Unreal Engine 5.7 means you need to upgrade existing Niagara systems and emitters that use Niagara asset tags to use the new **Tagged Asset Browser Configuration** assets.

For projects that make use of Niagara Asset Tags, we advise resaving existing Niagara systems and emitters. Tags will automatically transfer to the new User Asset Tag system once loaded.

If you defined your own tags in a now-deprecated **Niagara Asset Tag Definition** asset, we added a new context action. This action finds all Niagara assets containing the tags defined inside, and asks you to resave them.

[image: New context action to migrate tagged assets to user asset tags.]

For internal tags defined in C++, you can navigate to the folders with the assets you want to update, and use the console command `fx.Niagara.MigrateInternalTagsToUserAssetTags`.
