# gen/docs: offline Unreal Engine documentation

Builds `docs/ue59/`: the full text of every page in a docs version's table of contents, plus an index written by
agents that read every page. Rerun it when the version changes (5.9 Preview to 5.9 final, say).

| Step | What | Where it runs |
|---|---|---|
| 1 | `node gen\docs\crawl.ts --version 5.9 --out out\docs59` follows the links in each page's server-rendered HTML from the version's root page; `--resume` continues; `--seeds file` adds slugs | Director's PC (the cloud workspace can't reach dev.epicgames.com) |
| 2 | `node gen\docs\extract.ts --in out\docs59` turns each page's `<main>` into Markdown (`md/`) and writes `pages.json` (section from the link graph) | anywhere |
| 3 | Pages the crawl misses (see below) are saved from the browser pane and converted with `node gen\docs\from_api.ts --in <saved.json> --out out\docs59` | browser pane, then anywhere |
| 4 | Summariser agents read every page in batches (about 50,000 words each) and write one JSON card per page: relevance, summary, exact names, warnings, what's new in the version | agents |
| 5 | `node gen\docs\build_index.ts --pages ... --cards ... --out docs\ue59\INDEX.md` fails if any page lacks a card | anywhere |

Why step 3 exists: the site's sidebar is loaded by script, and its sitemaps and page-data API answer 403 to scripts,
so the crawl only finds pages linked from other pages' text. About 280 pages (the Unity and Maya guides, the Parrot
sample, platform pages, several pages updated for 5.9) are reachable only from the sidebar, or the server renders
them as a loading spinner. The browser pane loads them as a reader would: on a docs page, in a tab of its own that
stays in front (background tabs are throttled, and navigating the tab stops the script), fetch
`/community/api/documentation/table_of_content.json?path=/documentation/unreal-engine&lang=en-us&application_version=5.9`
for the full table of contents, compare its slugs with the crawled ones, fetch
`/community/api/documentation/document.json?path=/documentation/unreal-engine/<slug>&lang=en-us&application_version=5.9`
for each missing one about once a second, and save the results as JSON downloads every 50 pages (the director
approves the download). Never imitate a browser from a script to get past the 403: that is a bot check.

The cards' format and the summarisers' instructions are in `docs/ue59/INSTRUCTIONS.md`. Pages with the server-side
spinner come back on retry as a spinner again; `crawl.ts` retries them five times, then records them as failed.
