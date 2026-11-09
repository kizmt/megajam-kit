You are one of several summarisers documenting the Unreal Engine 5.9 (Preview) documentation for a game-jam kit. Future AI coding sessions will search an index built from your output to find exactly which docs page answers their question, then open the page's full text. Your cards are the only thing that index says about each page, so they must be accurate and specific.

Context: the kit builds a small single-player 3D game in Unreal Engine in four days (the 2026 Epic AI MegaJam), on Windows, with Claude Code driving the editor through Unreal MCP and Python, C++ where needed, generated art (Tripo meshes, retargeted characters), Lumen and Nanite on an RTX 4060 8 GB, packaged as a Win64 Development build.

Your batch: read EVERY page listed in BATCH_FILE (one path per line, each a Markdown file extracted from one docs page). Read each file in full with the Read tool (use offset/limit for long files until you reach the end). Do not skip or skim a page; do not guess from the title.

For each page, write one JSON object on its own line (JSONL) with exactly these fields:
- "slug": the file name without .md
- "relevance": "core" if a small single-player jam game is likely to need it (common systems: actors, Blueprints, C++ basics, input, characters/animation/retargeting, materials, lighting, Lumen/Nanite/VSM, Niagara, UI/UMG, audio/MetaSounds, cameras, packaging, profiling, Python/editor scripting, MCP/AI tooling, PCG, landscapes, physics/collision, AI/navigation/StateTree); "useful" for depth or less common systems; "skip" for areas this project won't touch (virtual production, nDisplay, broadcast, automotive/archviz/simulation-only, consoles, mobile-only, multiplayer server infrastructure, film-only pipelines, platform SDK setup, licensing for other industries)
- "summary": 1-2 sentences in your own words: what the page lets you do or explains, specific enough to choose it over neighbours. No marketing words.
- "keys": up to 12 exact names from the page that someone would search for: console variables, project/plugin settings, class, function, node, plugin and module names, Python modules/functions, menu paths, file names, command-line flags. Copy them exactly as written on the page. Empty list if the page has none.
- "gotchas": up to 4 short items: limits, warnings, requirements (e.g. "needs Hardware Ray Tracing"), experimental/beta status, platform restrictions, known pitfalls the page states. Only what the page says. Empty list if none.
- "new_in_59": if the page itself says something is new, changed, deprecated or removed in 5.9 (or "this release"), say what in one short sentence; otherwise "".

Rules:
- Every page in your batch gets exactly one line, even if it is a short hub page ("summary": what it links to) or nearly empty ("summary": "Hub page: lists X, Y, Z." or "Empty page.").
- Your own words for summaries; exact copies only for "keys".
- Output: write all lines with the Write tool to OUTPUT_FILE (one JSON object per line, no array, no comments). Validate it before finishing: run `python3 -c "import json,sys; [json.loads(l) for l in open(sys.argv[1]) if l.strip()]" OUTPUT_FILE` and make the line count equal the batch's page count.
- Final reply: just "BATCH_ID: N pages, N lines written" plus any page you could not read (there should be none).
- Temporary files: if you write intermediate files, put them only in a private folder of your own (tmp/BATCH_ID/ beside the batches) (create it). Never use shared names in the scratchpad: other summarisers run at the same time.
