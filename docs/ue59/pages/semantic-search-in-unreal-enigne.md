# Semantic Search

https://dev.epicgames.com/documentation/en-us/unreal-engine/semantic-search-in-unreal-enigne?application_version=5.9

> An editor plugin that adds an AI search mode to the Content Browser.

Learn to use this **Experimental** feature, but use caution when shipping with it.

**Semantic Search** is an editor plugin that adds an artificial intelligence (AI) search mode to the Content Browser. Instead of matching asset names and tags literally, it can rank assets by visual and contextual meaning.

For example, searching "rusted metal barrel" can return an asset named `M_OldOilDrum` even if those words do not appear in the asset name.

## How It Works

The plugin works by creating an in-memory vector search index of content browser assets. When an asset is being indexed, the plugin builds a short AI-generated description of the asset, embeds that description as a vector, and stores the result in a hybrid keyword plus vector index. Content browser search queries then surface semantic matches using this index.

At a high level:

- The plugin gathers supported asset data, usually including the cached thumbnail, asset path, asset class, and selected metadata.
- A configured OpenAI-compatible chat completions endpoint generates tags and a caption for an asset
- A configured OpenAI-compatible embeddings endpoint creates a vector embedding for the caption.
- The plugin stores the caption, tags, and embedding in Derived Data Cache and adds the asset to the in-memory search index.
- Text searches embed the search query and compare it against the indexed asset embeddings. If hybrid search is enabled (the default behavior), exact keyword-based matches are fused with semantic matches.

## Enabling the Plugin

- Open **Edit > Plugins**.
- Search for **Semantic Search**.
- Enable the plugin under the **experimental plugins** list.
- Restart the editor.

[image: Semantic Search plugin] Semantic Search plugin

After the editor restarts, each Content Browser search bar has an AI toggle to its right. Click it to enable AI search mode for the Content Browser. The button turns cyan while AI mode is active.

## Main User Interface

The plugin adds the following editor UI:

| UI | Location | Purpose |
| --- | --- | --- |
| **AI toggle** | Right side of each Content Browser search bar | Turns Semantic Search mode on or off. |
| **Index status** | Content Browser navigation bar, visible while AI mode is on | Shows indexed, unindexed, and failed counts, with inline refresh, retry, and cancel buttons. |
| **Stats dialog** | Tools > Semantic Search | Shows index stats and lets you switch index type between flat and quantized index. |
| **Settings** | Edit > Editor Preferences > Plugins > Semantic Search | Configures provider, indexing, HTTP, vector index, and search behavior. |
| **Find Similar** | Right-click a single asset in the Content Browser while AI mode is on | Searches for assets similar to the selected asset. |

## Configure the Provider

A provider is the backend service the plugin calls to turn asset thumbnails and metadata into captions, and captions or search text into embeddings.

Open **Edit > Editor Preferences > Plugins > Semantic Search **and configure the **Provider **section.

The plugin currently ships with one provider type: **OpenAI-compatible API**.

It calls:

- `/chat/completions` for asset captioning
- `/embeddings` for text embeddings

| Setting | Default | Notes |
| --- | --- | --- |
| **Provider** | OpenAI-compatible API | Backend used for captioning and embeddings. |
| **Captioning Base URL** | https://api.openai.com/v1 | Base URL of the OpenAI-compatible API. The plugin sends caption requests to **<Captioning Base URL>/chat/completions**. |
| **Captioning API Key** | empty | Sent as **Authorization: Bearer <key>** in the request. |
| **Captioning Model** | **gpt-5.4-mini** | Model used to generate caption and tags for an asset. Must be vision-capable because supported visual assets send thumbnails or screenshots. |
| **Embedding Base URL** | https://api.openai.com/v1 | Embedding requests are sent to **<Embedding Base URL>/embeddings**. Can differ from the captioning URL. |
| **Embedding API Key** | empty | Sent as **Authorization: Bearer <key>**. Can be the same as the captioning key. |
| **Embedding Model** | **text-embedding-3-small** | Model used to create embeddings for asset captions and search queries. |
| **Embedding Dimension** | **512** | Size of the embedding. Sent as the **dimensions** parameter in the embedding request. |

Provider settings are stored in the project's editor per-user settings config under `[/Script/SemanticSearch.SemanticSearchSettings]`.

API keys will get stored in clear text, even though the editor field is displayed as a password field.

Changing any **Provider **setting re-registers the provider, cancels active indexing, and rebuilds the vector index as **Flat **at the configured dimension. Re-index after changing provider values.

## Build the Index

- Open a Content Browser.
- Click the **AI** button so it turns cyan.
- Look for **Semantic Search Index:** in the Content Browser navigation bar.
- If assets are listed as unindexed, click the refresh button next to the unindexed count.

The index status bar can show:

| Status | Meaning |
| --- | --- |
| `{N} indexed` | Assets currently in the semantic index. The refresh button beside this count re-indexes all supported assets from scratch. |
| `{M} unindexed` | Supported assets in indexed paths that are not currently indexed. The refresh button beside this count indexes only those assets. |
| `{K} failed` | Retryable provider failures, such as HTTP errors or rate limits. The refresh button beside this count retries failed assets. |
| **X button** | Visible while indexing is active. Cancels queued indexing work and pending provider requests. |

Indexing runs in the background and shows a progress notification. You can keep working in the editor while it runs.

For each uncached indexed asset, expect one captioning request and one embedding request to be sent to the configured backend.

## Supported Asset Types

Currently only the following asset types are supported

- Static Mesh
- Skeletal Mesh
- Material
- Material Instance
- Texture
- Blueprint (only those which have an associated thumbnail)

For any asset belonging to one of the asset types, we use its editor-cached thumbnail, the asset path and class, and some metadata tags to create the captioning request for the asset.

Unsupported assets are ignored during indexing.

For any semantic search query, unindexed or unsupported assets will not appear in the AI search results, even if they are visible in the Content Browser normally.

## Search

With AI mode enabled and the index populated:

- Type a natural-language query in the Content Browser search bar.
- Press Enter.

Semantic Search results are fetched when you submit the query. They do not update continuously on every keystroke like the standard Content Browser search.

Example searches:

- wooden crate
- rusted metal barrel
- glowing neon sign
- low-poly rock
- red metallic surface
- large industrial machine

The Semantic Search plugin is compatible with all Content Browser filters. Folder, collection, and class filters determine the candidate set before semantic ranking is applied. Use the normal Content Browser filters to narrow searches to meshes, materials, textures, or a specific folder.

When AI mode is on, but the search field is empty, the Content Browser passes items through normally so you can still browse folders.

## Find Similar

Find Similar searches for assets “near” a selected reference asset in embedding space.

- Enable AI mode in the Content Browser.
- Right-click one asset.
- Choose **Find Similar**.

The plugin fills the search box with `/find-similar <AssetObjectPath>` and returns semantically similar indexed assets.

The right-click menu item is only shown when AI mode is active, exactly one asset is selected, and the index has at least one vector. If the selected asset itself is not indexed, the search returns no results.

By default, Find Similar will only find similar assets within your current folder. To find similar assets across your entire project, change the root folder to /All in the content browser folder selector.

## Limit the Indexed Paths

By default, Indexed Paths contains /, which means the plugin considers all Content Browser package roots that match that prefix.

To limit indexing:

- Open **Edit > Editor Preferences > Plugins > Semantic Search**.
- Under **Indexing**, remove the **/** entry.
- Add one or more package paths, such as `/Game/Props/` or `/Game/Environments/Forest/`.
- Re-index from the Content Browser status bar.

Restricting indexed paths is the simplest way to reduce indexing time, provider usage, and cost.

## Index Types

Open **Tools > Semantic Search** to see index stats and switch index type.

| Index Type | Behavior |
| --- | --- |
| **Flat (Exact)** | Stores full-precision embeddings and gives exact nearest-neighbor vector results. It is simple and accurate, but memory grows linearly with indexed asset count. |
| PQ (Compressed) | Uses Product Quantization to store compressed vector codes. It uses much less editor memory at large scale, with some recall loss. |

By default, the index is **Flat**. For small to medium projects, **Flat **is usually fine and slightly more exact. **PQ **becomes more useful when indexing tens or hundreds of thousands of assets. Switching from a flat to PQ index performs a one-time training step using vectors already in the index.

In addition to allowing to switch between index types, the stats dialog shows:

- index type
- vector count
- BM25 keyword index count
- embedding dimension
- estimated vector memory
- estimated BM25 memory
- whether the current index is trained
- supported, indexed, skipped, and failed counts

## Other Settings

These are the other available settings that are found in **Edit > Editor Preferences > Plugins > Semantic Search**.

### Indexing

| Setting | Default | Notes |
| --- | --- | --- |
| Indexed Paths | / | Content Browser package paths included in the index. |
| Auto Index Cached On Startup | off | At startup, automatically loads DDC-cached embeddings into the index. |
| Auto Index Uncached On Startup | off | Also sends uncached assets to the provider at startup. Only meaningful when cached startup indexing is on. |
| Auto Index On Save | on | Saving or updating an asset on disk re-indexes that asset if it is in an indexed path. |

### HTTP

| Setting | Default | Notes |
| --- | --- | --- |
| **Max Retries** | 1 | Retries HTTP caption/embed requests on retryable failures such as 429 and 5xx. |
| **Retry Timeout Seconds** | 300 | Maximum wall-clock retry window for one request. |
| **Max Concurrent Caption Requests** | 256 | Caps in-flight captioning requests; excess requests queue locally. |
| **Max Concurrent Embed Requests** | 256 | Caps in-flight embedding requests; excess requests queue locally. |

Lower the concurrent request counts if your provider returns rate-limit errors.

### Search

| Setting | Default | Notes |
| --- | --- | --- |
| **Enable Hybrid Search** | on | Combines vector search with keyword BM25 ranking. |
| **RRF Constant** | 60 | Reciprocal Rank Fusion tuning. Higher values reduce the effect of rank differences. |
| **RRF Oversample** | 3 | Fetches extra candidates from each search source before fusion. |
| **BM25 Min Should Match Percent** | 75 | Controls how many query terms a keyword match should contain. |
| **Vector Distance Cutoff** | 1.0 | L2 distance threshold for the vector search. Lower values are stricter. A result must pass this semantic threshold or have a keyword match. |
| **Similarity Distance Cutoff** | 0.5 | L2 Distance cutoff used by Find Similar. Lower values are stricter. |

## Caching and Persistence

Caption and embedding outputs are stored in Derived Data Cache. If your project uses a shared remote DDC, the team can reuse generated data instead of each user paying to caption and embed the same asset again.

The in-memory search index is also saved locally under the project’s `Saved/SemanticSearch` directory and loaded on the next editor startup.

## Cost and Privacy Notes

Indexing sends asset-derived data to the configured captioning provider. For visual asset types, that usually includes the cached thumbnail plus asset path, class, and selected metadata.

Text search sends the search query to the configured embedding provider. Find Similar uses existing indexed vectors and does not send the selected asset to the provider at search time.

Before indexing a large project, check your provider pricing and rate limits. For a rough first-pass estimate, count one captioning request plus one embedding request per uncached supported asset.

## Troubleshooting

| Symptom | Things to Check |
| --- | --- |
| **No AI button appears** | Confirm the plugin is enabled, restart the editor, and reopen the Content Browser. |
| **Index stays at 0 indexed after refresh** | Check the Output Log for **LogSemanticSearch**. Common causes are missing API keys, an unreachable base URL, or a server that is not OpenAI-compatible. |
| **Many assets move to failed** | Check for HTTP 401, 429, or 5xx errors. Verify the captioning model supports vision and structured JSON schema output, and the embedding model supports the requested dimension. |
| **Search returns no results even with indexed assets** | Confirm AI mode is on, submit the query with Enter, and check active Content Browser filters. Also try a less strict vector distance cutoff. |
| **Find Similar returns nothing** | The selected asset may not be indexed, or the similarity distance cutoff may be too strict. |
| **Results seem stale after changing provider/model/dimension** | Re-index all assets from scratch using the refresh button beside the indexed count. |
| **Indexing is too slow or expensive** | Limit **Indexed Paths**, lower concurrency if the provider rate-limits, or use cheaper/faster captioning and embedding models. |
| **API keys appear in config** | This is expected. Store keys accordingly; they are written in clear text in editor per-user settings config. |

- plugin
- search
- ai

On this page

- How It Works (-> semantic-search-in-unreal-enigne)
- Enabling the Plugin (-> semantic-search-in-unreal-enigne)
- Main User Interface (-> semantic-search-in-unreal-enigne)
- Configure the Provider (-> semantic-search-in-unreal-enigne)
- Build the Index (-> semantic-search-in-unreal-enigne)
- Supported Asset Types (-> semantic-search-in-unreal-enigne)
- Search (-> semantic-search-in-unreal-enigne)
- Find Similar (-> semantic-search-in-unreal-enigne)
- Limit the Indexed Paths (-> semantic-search-in-unreal-enigne)
- Index Types (-> semantic-search-in-unreal-enigne)
- Other Settings (-> semantic-search-in-unreal-enigne)
- Indexing (-> semantic-search-in-unreal-enigne)
- HTTP (-> semantic-search-in-unreal-enigne)
- Search (-> semantic-search-in-unreal-enigne)
- Caching and Persistence (-> semantic-search-in-unreal-enigne)
- Cost and Privacy Notes (-> semantic-search-in-unreal-enigne)
- Troubleshooting (-> semantic-search-in-unreal-enigne)
