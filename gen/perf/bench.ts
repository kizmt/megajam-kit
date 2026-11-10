#!/usr/bin/env node
// Benchmark render settings against a PACKAGED build without repackaging: launches the game once per variant,
// applies the variant's cvars with -DPCVars (device-profile priority, so it beats ini + scalability), captures
// a CSV profile, kills the game, and prints a comparison table.
//   node gen/perf/bench.ts                                  # built-in render-path comparison
//   node gen/perf/bench.ts --variant "check:"               # the build as it ships (or --only current)
//   node gen/perf/bench.ts --variant "a:" --variant "b:r.AllowOcclusionQueries=0"
//   options: --exe <path> (default C:\dev\Builds\<Project>\Windows\<Project>.exe, else <Project>\Builds\...)
//            --res native (default: the game's own window, what a fresh install opens) | 1920x1080 (a window of that
//              size: -windowed -ResX -ResY; without -windowed a borderless game ignores the size)
//            --frames 1200  --skip 200  --only name1,name2  --no-warmup  --force (run even if the GPU is busy)
//            --target-fps 60 (the game's target from DECISIONS.md; sets the hitch limit and the PASS/FAIL column)
//            --runs N (each variant N times: tells a repeatable hitch from one stray frame)
//            --keep-settings (bench with the build's saved GameUserSettings.ini instead of setting it aside)
// The output size printed is MEASURED from the game's window (gen/perf/window_size.ps1), never the request: a
// practice run reported five "1080p" runs that were 4K, and 4K numbers that were a stretched 1440p (SETUP 7b).
// The build folder's Saved\Config\...\GameUserSettings.ini survives packaging and holds whatever an earlier test
// run of the game saved (a quality preset there set native 4K: 75 fps where a fresh install got 124). So it is set
// aside for the bench and put back afterwards, unless --keep-settings.
// -DPCVars also sets game cvars registered at runtime (non-cheat), so an autoplay switch works as part of a variant.
// The game window takes the screen for ~25 s per variant. Don't touch the mouse/keyboard while it runs.
// Facts behind the defaults (PIPELINE.md "Hard-won facts"): the first launch after packaging reads ~13% low
// (shader/PSO warm-up), so one discarded warm-up launch runs first; a fresh exe sometimes never starts (likely being
// scanned), so a launch that writes no log within 30 s, or no capture within 240 s, is killed and retried once.
import { spawn, execFileSync, type ChildProcess } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, renameSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';
import { parseArgs } from 'node:util';
import { KIT, fail, projectDir } from '../paths.ts';
import { barCheck, hitchList, hitches, summarise, type CsvSummary } from './csv_report.ts';

const LUMEN = 'r.DynamicGlobalIlluminationMethod=1,r.ReflectionMethod=1';
const NO_LUMEN = 'r.DynamicGlobalIlluminationMethod=0,r.ReflectionMethod=2,r.AmbientOcclusionLevels=0,r.DistanceFieldAO=0';
// Lumen Lite: what sg.GlobalIlluminationQuality=1 + sg.ReflectionQuality=1 set (BaseScalability.ini, 5.8.4): the
// Irradiance final gather, the smaller surface cache, and SSR in place of Lumen reflections.
const LUMEN_LITE = `${LUMEN},r.Lumen.FinalGatherMethod=0,r.LumenScene.SurfaceCache.AtlasSize=2048,` +
  'r.LumenScene.SurfaceCache.CardTexelDensityScale=50,r.LumenScene.SurfaceCache.CardMinResolution=2,' +
  'r.LumenScene.SurfaceCache.CardMaxResolution=256,r.Lumen.Reflections.Allow=0,r.SSR.Quality=2,r.SSR.HalfResSceneColor=1';
const SP = (pct: number): string => `r.ScreenPercentage.Default.Desktop.Mode=0,r.ScreenPercentage.Default=${pct}`;
const PRESETS: [string, string][] = [
  ['current', ''],
  ['lumen-1080p', `${LUMEN},${SP(50)}`],
  ['lumenlite-1080p', `${LUMEN_LITE},${SP(50)}`],
  ['nolumen-1260p', `${NO_LUMEN},${SP(58.33)}`],
  ['nolumen-1440p', `${NO_LUMEN},${SP(66.67)}`],
];

const { values: o } = parseArgs({
  options: {
    exe: { type: 'string' },
    res: { type: 'string', default: 'native' },
    runs: { type: 'string', default: '1' },
    'keep-settings': { type: 'boolean', default: false },
    frames: { type: 'string', default: '1200' },
    skip: { type: 'string', default: '200' },
    variant: { type: 'string', multiple: true },
    only: { type: 'string' },
    'no-warmup': { type: 'boolean', default: false },
    force: { type: 'boolean', default: false },
    'target-fps': { type: 'string', default: '60' },
  },
});
const targetFps = Number(o['target-fps']) || 60;

// With --exe the project name comes from the exe (<Project>.exe sits next to <Project>\Saved), so MEGAJAM_PROJECT
// is only needed for the default path.
// Default build folder: package.ps1's -BuildRoot C:\dev\Builds, or <Project>\Builds when it packaged into the project.
const defaultExe = (): string => {
  const p = basename(projectDir());
  const a = join('C:\\dev\\Builds', p, 'Windows', `${p}.exe`);
  const b = join(projectDir(), 'Builds', p, 'Windows', `${p}.exe`);
  return existsSync(a) || !existsSync(b) ? a : b;
};
const exe = o.exe ?? defaultExe();
const proj = basename(exe).replace(/\.exe$/i, '');
if (!existsSync(exe)) fail(`packaged exe not found: ${exe} (run scripts\\package.ps1 or pass --exe)`);
const saved = join(exe, '..', proj, 'Saved');
const csvDir = join(saved, 'Profiling', 'CSV');
const logFile = join(saved, 'Logs', `${proj}.log`);
// --res native: pass no resolution, so the game opens the window a fresh install would.
const native = o.res === 'native';
const [resX, resY] = (o.res ?? '').split('x');
if (!native && (!resX || !resY)) fail('--res must look like 3840x2160, or be "native"');

let variants: [string, string][] = o.variant
  ? o.variant.map((v): [string, string] => {
      const i = v.indexOf(':');
      return i < 0 ? [v, ''] : [v.slice(0, i), v.slice(i + 1)];
    })
  : PRESETS;
if (o.only) {
  const keep = new Set(o.only.split(','));
  variants = variants.filter(([n]) => keep.has(n));
}
if (variants.length === 0) fail('no variants to run');

const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

/**
 * GPU load before we start: other programs on the GPU make every number meaningless.
 * One `utilization.gpu` read is noisy at idle clocks (a 4K desktop alone jumped 6-31% in P5 at 210 MHz), so take
 * several samples, report the lowest, and treat a GPU in an idle power state (P5 or higher) as free.
 */
async function gpuReading(samples = 5): Promise<{ util: number; memMiB: number; idle: boolean; text: string } | undefined> {
  const reads: { util: number; mem: number; pstate: number; clock: number }[] = [];
  for (let i = 0; i < samples; i++) {
    try {
      const out = execFileSync('nvidia-smi', ['--query-gpu=utilization.gpu,memory.used,pstate,clocks.gr', '--format=csv,noheader,nounits'], { encoding: 'utf8' });
      const [u, m, p, c] = (out.trim().split('\n')[0] ?? '').split(',').map((x) => x.trim());
      const util = Number(u);
      const mem = Number(m);
      if (Number.isNaN(util) || Number.isNaN(mem)) return undefined;
      reads.push({ util, mem, pstate: Number((p ?? '').replace(/^P/i, '')), clock: Number(c) });
    } catch {
      return undefined;
    }
    if (i < samples - 1) await sleep(500);
  }
  const low = reads.reduce((a, b) => (b.util < a.util ? b : a));
  const idle = reads.every((r) => !Number.isNaN(r.pstate) && r.pstate >= 5);
  const utils = reads.map((r) => r.util).join('/');
  const last = reads[reads.length - 1] ?? low;
  return {
    util: low.util,
    memMiB: low.mem,
    idle,
    text: `GPU ${utils}% busy (lowest ${low.util}%), P${last.pstate} at ${last.clock} MHz, ${low.mem} MiB used${idle ? ' (idle power state)' : ''}`,
  };
}

function newestCsv(after: number): string | undefined {
  if (!existsSync(csvDir)) return undefined;
  return readdirSync(csvDir)
    .filter((f) => f.endsWith('.csv'))
    .map((f) => join(csvDir, f))
    .filter((f) => statSync(f).mtimeMs >= after)
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0];
}

function killTree(pid: number | undefined): void {
  if (pid === undefined) return;
  try { execFileSync('taskkill', ['/PID', String(pid), '/T', '/F'], { stdio: 'ignore' }); } catch { /* already gone */ }
}

const logTouchedSince = (t: number): boolean => existsSync(logFile) && statSync(logFile).mtimeMs >= t;
const logText = (): string => (existsSync(logFile) ? readFileSync(logFile, 'utf8') : '');

function launch(name: string, cvars: string, frames: string): { child: ChildProcess; started: number; exit: { code: number | null } } {
  const started = Date.now();
  const args = [`-csvCaptureFrames=${frames}`, '-csvGpuStats', `-csvMetadata=variant=${name}`];
  if (!native) args.unshift('-windowed', `-ResX=${resX}`, `-ResY=${resY}`);
  if (cvars) args.push(`-DPCVars=${cvars}`);
  const exit: { code: number | null } = { code: null };
  const child = spawn(exe, args, { stdio: 'ignore', detached: false });
  child.on('exit', (code) => { exit.code = code; });
  return { child, started, exit };
}

interface WindowInfo { client: [number, number]; display: [number, number]; borderless: boolean }
let windowInfo: WindowInfo | null = null;
/** The running game's real window size (physical pixels). Read once per variant, a few seconds into the run. */
function readWindow(): WindowInfo | null {
  try {
    const out = execFileSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', join(KIT, 'gen', 'perf', 'window_size.ps1'), '-Dir', join(exe, '..')], { encoding: 'utf8' });
    const line = out.split(/\r?\n/).find((l) => l.startsWith('WINDOW_JSON='));
    return line ? (JSON.parse(line.slice('WINDOW_JSON='.length)) as WindowInfo | null) : null;
  } catch {
    return null;
  }
}

// Saved settings of the packaged game (see the header). Set aside for the bench, restored at the end and on a crash.
const userSettings = join(saved, 'Config', 'Windows', 'GameUserSettings.ini');
const userSettingsAside = `${userSettings}.bench-aside`;
function restoreSettings(): void {
  if (!existsSync(userSettingsAside)) return;
  try { renameSync(userSettingsAside, userSettings); } catch { /* the game rewrote it: keep the aside copy */ }
}
function savedResolutionQuality(): string | undefined {
  if (!existsSync(userSettings)) return undefined;
  return /^sg\.ResolutionQuality=(.+)$/m.exec(readFileSync(userSettings, 'utf8'))?.[1]?.trim();
}

async function runVariant(name: string, cvars: string, frames = o.frames ?? '1200'): Promise<CsvSummary> {
  for (let attempt = 1; attempt <= 2; attempt++) {
    const { child, started, exit } = launch(name, cvars, frames);
    let measuredThisRun = false;
    try {
      for (let waited = 0; waited < 240_000; waited += 1000) {
        await sleep(1000);
        if (waited >= 30_000 && !logTouchedSince(started)) {
          if (attempt === 1) { console.log(`    no log after 30 s (exit code ${exit.code ?? 'none yet'}): relaunching once`); break; }
          throw new Error(`the game never started (${name}); exit code ${exit.code ?? 'none'}`);
        }
        // Early, so the PowerShell start-up falls in the skipped warm-up frames; retried until the window exists.
        if (!measuredThisRun && waited >= 3000 && waited % 2000 === 1000) {
          const w = readWindow();
          if (w) { windowInfo = w; measuredThisRun = true; }
        }
        if (logTouchedSince(started) && logText().includes('CSV finalize time')) {
          const csv = newestCsv(started);
          if (csv) return summarise(csv, Number(o.skip));
        }
        if (exit.code !== null && !logText().includes('CSV finalize time')) {
          throw new Error(`the game exited early (${name}) with code ${exit.code}; ${existsSync(logFile) ? `see ${logFile}` : `no log at ${logFile}`}`);
        }
      }
      if (attempt === 2) throw new Error(`timed out waiting for the CSV capture (${name})`);
    } finally {
      killTree(child.pid);
      await sleep(2000); // let the GPU/driver settle before the next launch
    }
  }
  throw new Error(`no capture (${name})`);
}

const gpu = await gpuReading();
console.log(gpu ? `machine check: ${gpu.text}` : 'machine check: nvidia-smi not available (check the GPU is idle yourself)');
if (gpu && gpu.util >= 40 && !gpu.idle && !o.force) {
  fail(`the GPU is already ${gpu.util}% busy: another program would distort the numbers. Close it or ask first, then rerun (or pass --force).`);
}

// A previous bench that was killed left the settings aside: put them back before looking at them.
restoreSettings();
const rq = savedResolutionQuality();
if (rq !== undefined && Number(rq) !== 0) {
  console.log(`saved settings: sg.ResolutionQuality=${rq} in ${userSettings} (an earlier run of the game saved it; a fresh install has none)`);
}
if (!o['keep-settings'] && existsSync(userSettings)) {
  renameSync(userSettings, userSettingsAside);
  console.log('saved settings set aside for the bench (restored at the end; --keep-settings benches with them)');
} else if (o['keep-settings'] && existsSync(userSettings)) {
  console.log('benching WITH the saved settings (--keep-settings): not what a fresh install runs');
}
process.on('exit', restoreSettings);
process.on('SIGINT', () => { restoreSettings(); process.exit(130); });

if (!o['no-warmup']) {
  const [wName, wCvars] = variants[0] ?? ['warmup', ''];
  process.stdout.write(`warm-up (discarded)  ${wName}\n`);
  await runVariant(`warmup-${wName}`, wCvars, '300');
}

const results: { name: string; s: CsvSummary }[] = [];
// Say which runs are the shipped game: a director watching a comparison path otherwise judges its artifacts as the game's.
const runs = Math.max(1, Number(o.runs) || 1);
for (const [i, [name, cvars]] of variants.entries()) {
  const kind = cvars ? 'a comparison render path, not what ships' : 'the game as it ships';
  for (let r = 1; r <= runs; r++) {
    const label = runs > 1 ? `${name}#${r}` : name;
    process.stdout.write(`run ${i + 1} of ${variants.length}${runs > 1 ? ` (${r}/${runs})` : ''}: ${label.padEnd(16)} ${cvars || '(no overrides)'}  [${kind}]\n`);
    results.push({ name: label, s: await runVariant(label, cvars) });
  }
}

const g = (s: CsvSummary, pass: string): string => (s.gpuPasses.find((p) => p.name === pass)?.avg ?? 0).toFixed(2).padStart(5);
const t = (s: CsvSummary, k: string, w: number): string => (s.threads[k]?.avg ?? 0).toFixed(2).padStart(w);
const w = windowInfo as WindowInfo | null;
const measured = w ? `${w.client[0]}x${w.client[1]}${w.borderless ? ' borderless' : ' window'}` : 'NOT MEASURED (no game window found: treat the numbers as unlabelled)';
console.log(`\noutput ${measured} (measured; asked for ${o.res}), display ${w ? w.display.join('x') : '?'}, ${o.frames} frames, first ${o.skip} and the last one left out${gpu ? `; before the run: ${gpu.text}` : ''}`);
if (w && native && (w.client[0] !== w.display[0] || w.client[1] !== w.display[1])) {
  console.log(`WARNING: the game's window is ${w.client.join('x')} on a ${w.display.join('x')} display: these are not full-resolution numbers. ` +
    'Check SETUP 7b (bAllowHighDPIInGameMode=True) and the saved window settings.');
}
if (w && !native && (String(w.client[0]) !== resX || String(w.client[1]) !== resY)) {
  console.log(`WARNING: asked for ${o.res}, the window is ${w.client.join('x')}: label the numbers with the measured size.`);
}
console.log('(the CSV "systemresolution" metadata and the log\'s "LogWindows: resolution" are requests or the scaled desktop, not the window: ignore them)');
console.log(`the bar (docs/ue/performance.md) at the game's target of ${targetFps} fps: p95 >= ${targetFps}, 1% low within 20% of avg, ` +
  `no hitch (frame > ${(2000 / targetFps).toFixed(1)} ms)`);
console.log('variant            fps  p95fps  1%low  hitches   GPU ms   RT ms   GT ms   TSR  Lumen  bar');
for (const { name, s } of results) {
  const lumen = s.gpuPasses.filter((p) => p.name.startsWith('Lumen')).reduce((a, p) => a + p.avg, 0);
  const bar = barCheck(s, targetFps);
  console.log(
    `${name.padEnd(16)} ${s.fps.toFixed(0).padStart(5)}  ${s.fpsLow.toFixed(0).padStart(6)}  ${s.fps1Low.toFixed(0).padStart(5)}  ${String(hitches(s, targetFps)).padStart(7)}` +
      `  ${t(s, 'GPUTime', 7)}  ${t(s, 'RenderThreadTime', 6)}  ${t(s, 'GameThreadTime', 6)}  ${g(s, 'TemporalSuperResolution')}  ${lumen.toFixed(2).padStart(5)}` +
      `  ${bar.pass ? 'PASS' : 'FAIL'}`,
  );
}
for (const { name, s } of results) {
  const bar = barCheck(s, targetFps);
  if (!bar.pass) console.log(`  ${name}: ${bar.notes.join('; ')}`);
  // Where each hitch fell, to match it to a game event without adding a logger to the game.
  for (const h of hitchList(s, targetFps).slice(0, 8)) console.log(`    hitch at capture frame ${h.frame} (${h.atS.toFixed(2)} s into the measured frames): ${h.ms.toFixed(1)} ms`);
}
if (runs > 1) {
  for (const [name] of variants) {
    const mine = results.filter((r) => r.name.startsWith(`${name}#`));
    const withHitch = mine.filter((r) => hitches(r.s, targetFps) > 0).length;
    console.log(`  ${name}: a hitch in ${withHitch} of ${mine.length} runs${withHitch > 0 && withHitch < mine.length ? ' (not repeatable: compare the hitch frames above before chasing it)' : ''}`);
  }
}
