#!/usr/bin/env node
// Benchmark render settings against a PACKAGED build without repackaging: launches the game once per variant,
// applies the variant's cvars with -DPCVars (device-profile priority, so it beats ini + scalability), captures
// a CSV profile, kills the game, and prints a comparison table.
//   node gen/perf/bench.ts                                  # built-in render-path comparison
//   node gen/perf/bench.ts --variant "check:"               # the build as it ships
//   node gen/perf/bench.ts --variant "a:" --variant "b:r.AllowOcclusionQueries=0"
//   options: --exe <path> (default C:\dev\Builds\<Project>\Windows\<Project>.exe)  --res 3840x2160 | native
//            --frames 1200  --skip 200  --only name1,name2  --no-warmup  --force (run even if the GPU is busy)
// -DPCVars also sets game cvars registered at runtime (non-cheat), so an autoplay switch works as part of a variant.
// The game window takes the screen for ~25 s per variant. Don't touch the mouse/keyboard while it runs.
// Facts behind the defaults (docs/ue/performance.md): the first launch after packaging reads ~13% low (shader/PSO
// warm-up), so one discarded warm-up launch runs first; a fresh exe sometimes never starts (likely being scanned),
// so a launch that writes no log within 30 s is killed and retried once.
import { spawn, execFileSync, type ChildProcess } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';
import { parseArgs } from 'node:util';
import { fail, projectDir } from '../paths.ts';
import { summarise, type CsvSummary } from './csv_report.ts';

const LUMEN = 'r.DynamicGlobalIlluminationMethod=1,r.ReflectionMethod=1';
const NO_LUMEN = 'r.DynamicGlobalIlluminationMethod=0,r.ReflectionMethod=2,r.AmbientOcclusionLevels=0,r.DistanceFieldAO=0';
const SP = (pct: number): string => `r.ScreenPercentage.Default.Desktop.Mode=0,r.ScreenPercentage.Default=${pct}`;
const PRESETS: [string, string][] = [
  ['current', ''],
  ['lumen-1080p', `${LUMEN},${SP(50)}`],
  ['nolumen-1260p', `${NO_LUMEN},${SP(58.33)}`],
  ['nolumen-1440p', `${NO_LUMEN},${SP(66.67)}`],
];

const { values: o } = parseArgs({
  options: {
    exe: { type: 'string' },
    res: { type: 'string', default: '3840x2160' },
    frames: { type: 'string', default: '1200' },
    skip: { type: 'string', default: '200' },
    variant: { type: 'string', multiple: true },
    only: { type: 'string' },
    'no-warmup': { type: 'boolean', default: false },
    force: { type: 'boolean', default: false },
  },
});

const proj = basename(projectDir());
const exe = o.exe ?? join('C:\\dev\\Builds', proj, 'Windows', `${proj}.exe`);
if (!existsSync(exe)) fail(`packaged exe not found: ${exe} (run scripts\\package.ps1 or pass --exe)`);
const saved = join(exe, '..', proj, 'Saved');
const csvDir = join(saved, 'Profiling', 'CSV');
const logFile = join(saved, 'Logs', `${proj}.log`);
// --res native: pass no resolution, so the game uses its saved/default settings (what a fresh install sees).
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

/** GPU load before we start: other programs on the GPU make every number meaningless. */
function gpuReading(): { util: number; memMiB: number; text: string } | undefined {
  try {
    const out = execFileSync('nvidia-smi', ['--query-gpu=utilization.gpu,memory.used', '--format=csv,noheader,nounits'], { encoding: 'utf8' });
    const [util, mem] = (out.trim().split('\n')[0] ?? '').split(',').map((s) => Number(s.trim()));
    if (util === undefined || mem === undefined || Number.isNaN(util) || Number.isNaN(mem)) return undefined;
    return { util, memMiB: mem, text: `GPU ${util}% busy, ${mem} MiB used` };
  } catch {
    return undefined;
  }
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

function launch(name: string, cvars: string, frames: string): { child: ChildProcess; started: number; exit: { code: number | null } } {
  const started = Date.now();
  const args = [`-csvCaptureFrames=${frames}`, '-csvGpuStats', `-csvMetadata=variant=${name}`];
  if (!native) args.unshift(`-ResX=${resX}`, `-ResY=${resY}`);
  if (cvars) args.push(`-DPCVars=${cvars}`);
  const exit: { code: number | null } = { code: null };
  const child = spawn(exe, args, { stdio: 'ignore', detached: false });
  child.on('exit', (code) => { exit.code = code; });
  return { child, started, exit };
}

async function runVariant(name: string, cvars: string, frames = o.frames ?? '1200'): Promise<CsvSummary> {
  for (let attempt = 1; attempt <= 2; attempt++) {
    const { child, started, exit } = launch(name, cvars, frames);
    try {
      for (let waited = 0; waited < 240_000; waited += 1000) {
        await sleep(1000);
        if (waited >= 30_000 && !logTouchedSince(started)) {
          if (attempt === 1) { console.log(`    no log after 30 s (exit code ${exit.code ?? 'none yet'}): relaunching once`); break; }
          throw new Error(`the game never started (${name}); exit code ${exit.code ?? 'none'}`);
        }
        if (logTouchedSince(started) && readFileSync(logFile, 'utf8').includes('CSV finalize time')) {
          const csv = newestCsv(started);
          if (csv) return summarise(csv, Number(o.skip));
        }
        if (exit.code !== null && !readFileSync(logFile, 'utf8').includes('CSV finalize time')) {
          throw new Error(`the game exited early (${name}) with code ${exit.code}; see ${logFile}`);
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

const gpu = gpuReading();
console.log(gpu ? `machine check: ${gpu.text}` : 'machine check: nvidia-smi not available (check the GPU is idle yourself)');
if (gpu && gpu.util >= 40 && !o.force) {
  fail(`the GPU is already ${gpu.util}% busy: another program would distort the numbers. Close it or ask first, then rerun (or pass --force).`);
}

if (!o['no-warmup']) {
  const [wName, wCvars] = variants[0] ?? ['warmup', ''];
  process.stdout.write(`warm-up (discarded)  ${wName}\n`);
  await runVariant(`warmup-${wName}`, wCvars, '300');
}

const results: { name: string; s: CsvSummary }[] = [];
for (const [name, cvars] of variants) {
  process.stdout.write(`running ${name.padEnd(16)} ${cvars || '(no overrides)'}\n`);
  results.push({ name, s: await runVariant(name, cvars) });
}

const g = (s: CsvSummary, pass: string): string => (s.gpuPasses.find((p) => p.name === pass)?.avg ?? 0).toFixed(2).padStart(5);
const t = (s: CsvSummary, k: string, w: number): string => (s.threads[k]?.avg ?? 0).toFixed(2).padStart(w);
console.log(`\noutput ${o.res}, ${o.frames} frames, first ${o.skip} skipped${gpu ? `; before the run: ${gpu.text}` : ''}`);
console.log('(CSV "systemresolution" metadata is recorded before DPI awareness and can say 2560x1440 on a 4K screen: ignore it)');
console.log('variant            fps  p95fps   GPU ms   RT ms   GT ms   TSR  Lumen');
for (const { name, s } of results) {
  const lumen = s.gpuPasses.filter((p) => p.name.startsWith('Lumen')).reduce((a, p) => a + p.avg, 0);
  console.log(
    `${name.padEnd(16)} ${s.fps.toFixed(0).padStart(5)}  ${s.fpsLow.toFixed(0).padStart(6)}  ${t(s, 'GPUTime', 7)}  ${t(s, 'RenderThreadTime', 6)}` +
      `  ${t(s, 'GameThreadTime', 6)}  ${g(s, 'TemporalSuperResolution')}  ${lumen.toFixed(2).padStart(5)}`,
  );
}
