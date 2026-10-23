# megajam-kit — standing rules

Pipeline and agent setup for a 93-hour solo Unreal Engine 5.8 jam entry (2026 Epic AI MegaJam).
Scott is the director: he owns concept, feel, art direction and sign-off. Claude owns implementation, tooling and verification.

## The two rules that matter most

1. **Small scope, always.** One playable space, a 5–10 minute experience, finished and polished.
   Never an open world, never "systems first, content later". If a feature isn't visible in the
   60-second video, it's cut. When in doubt, cut.
2. **Lock the look before building the game.** No gameplay work starts until `art/style-lock.md`
   is approved by Scott (see `prompts/style-lock.md`). Every visual change is judged by screenshot
   against `art/reference/`, never by description.

## Working model

- **One main session.** A single Opus 5.5 session on high effort leads all design, code and editor
  work. No predefined agent teams or role subagents. Claude may spin up a helper agent on its own
  judgement (research, docs lookups), but only the main session calls Unreal MCP (tool calls run
  one at a time on the game thread anyway).
- **Repeatable pipeline jobs are plain scripts, not agents**: asset generation, import, package,
  zip and upload live in `scripts/` and are run by the session. Deterministic and re-runnable.
- **Keep context fresh.** At the end of each round, write state to `PROGRESS.md` (what exists,
  what's next, open problems). When the session gets long or slow, start a new one from
  CLAUDE.md + PROGRESS.md rather than pushing on.
- **Rounds, not marathons.** Each round: plan (≤5 bullets) → build → capture screenshots/video →
  stop for Scott's review. No round longer than ~2 hours without a review.

## Engine conventions

- Gameplay in **C++**. Blueprints only as thin data/asset wrappers (subclass a C++ class, assign
  meshes/sounds/tunables). Never put logic in Blueprint graphs.
- **Data-driven tuning.** Speeds, damage, timings, spawn tables live in DataAssets or JSON, not
  hard-coded. Scott tunes feel without a recompile.
- Live Coding for function bodies only. New UPROPERTY/UFUNCTION/UCLASS = close editor, full build.
- Fix compile errors before anything else. Never work around a broken build.
- Target the RTX 4060 (8 GB VRAM): 1440p internal at 60 fps in a packaged build. Prefer a stylized
  look; keep Lumen and Nanite scenes modest; check `stat unit` and `stat gpu` after big visual changes.

## Verification ("done" means seen)

- After any visual or level change: capture screenshots from the fixed camera set in
  `art/camera-set.md` and compare against `art/reference/`. Report differences honestly.
- After gameplay changes: run PIE, capture a short clip or screenshot sequence, check the Output
  Log for errors and warnings.
- Never claim something works without a capture or a log line proving it.

## Shipping

- Package a Win64 development build at least once per day from day 2 (`scripts/package.ps1`).
- Zip as `TeamName_GameName.zip`, under 1 GB, push with butler.
- Video: 30–60 s, 1920×1080 or higher, gameplay in the first 5 seconds, English only.

## Jam compliance

- Only this kit (tools, agent configs, MCP settings, prompts, scripts) predates the jam. Game repo,
  assets, levels and gameplay code are created after 2026-11-12 14:00 JST.
- Practice projects are throwaway. Nothing from them goes into the jam game.
- Log every sourced (non-generated, non-original) asset in `SOURCED_ASSETS.md` with its licence.
  Sourced assets are not scored, so hero visuals and audio should be generated or made.
- Content must be Teen-appropriate, contain no third-party IP, and show no trademarks except the
  Unreal Engine logo. All in-game text and audio in English.

## Devlog (Glass Box)

- At the end of each round, append to `devlog/YYYY-MM-DD.md`: what was asked, what was built,
  what broke, one or two screenshots, and the prompts that mattered.
