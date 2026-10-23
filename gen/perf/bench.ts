#!/usr/bin/env node
// Benchmark render settings against a PACKAGED build without repackaging: launches the game once per variant,
// applies the variant's cvars with -DPCVars (device-profile priority, so it beats ini + scalability), captures
// a CSV profile, kills the game, and prints a comparison table.
//   node gen/perf/bench.ts                                  # built-in variant set
//   node gen/perf/bench.ts --variant "base:" --variant "lean:r.TSR.History.ScreenPercentage=100,r.VolumetricCloud=0"
//   options: --exe <path> (default C:\dev\Builds\<Project>\Windows\<Project>.exe)  --res 3840x2160
//            --frames 1200  --skip 200  --only name1,name2
// The game window takes the screen for ~25 s per variant. Don't touch the mouse/keyboard while it runs.
import { spawn, execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';
import { parseArgs } from 'node:util';
import { fail, projectDir } from '../paths.ts';
import { summarise, type CsvSummary } from './csv_report.ts';

const LEAN = 'r.TSR.History.ScreenPercentage=100,r.VolumetricCloud=0,r.MotionBlurQuality=0';
const MANUAL = (sp: number): string => `r.ScreenPercentage.Default.Desktop.Mode=0,r.ScreenPercentage.Default=${sp}`;
const PRESETS: [string, string][] = [
  ['base', ''],
  ['tsr100', 'r.TSR.History.ScreenPercentage=100'],
  ['lean', LEAN],
  ['lean+sp67', `${LEAN},${MANUAL(66.67)}`],
  ['lean+sp67+high', `${LEAN},${MANUAL(66.67)},sg.GlobalIlluminationQuality=2,sg.ReflectionQuality=2,sg.ShadowQuality=2`],
  ['lean+sp75', `${LEAN},${MANUAL(75)}`],
];

const { values: o } = parseArgs({
  options: {
    exe: { type: 'string' },
    res: { type: 'string', default: '3840x2160' },
    frames: { type: 'string', default: '1200' },
    skip: { type: 'string', default: '200' },
    variant: { type: 'string', multiple: true },
    only: { type: 'string' },
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

const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

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

async function runVariant(name: string, cvars: string): Promise<CsvSummary> {
  const started = Date.now();
  const args = [`-csvCaptureFrames=${o.frames}`, '-csvGpuStats', `-csvMetadata=variant=${name}`];
  if (!native) args.unshift(`-ResX=${resX}`, `-ResY=${resY}`);
  if (cvars) args.push(`-DPCVars=${cvars}`);
  const child = spawn(exe, args, { stdio: 'ignore', detached: false });
  try {
    for (let waited = 0; waited < 240_000; waited += 1000) {
      await sleep(1000);
      if (existsSync(logFile) && statSync(logFile).mtimeMs >= started && readFileSync(logFile, 'utf8').includes('CSV finalize time')) {
        const csv = newestCsv(started);
        if (csv) return summarise(csv, Number(o.skip));
      }
    }
    throw new Error(`timed out waiting for the CSV capture (${name})`);
  } finally {
    killTree(child.pid);
    await sleep(2000); // let the GPU/driver settle before the next launch
  }
}

const results: { name: string; s: CsvSummary }[] = [];
for (const [name, cvars] of variants) {
  process.stdout.write(`running ${name.padEnd(16)} ${cvars || '(no overrides)'}\n`);
  results.push({ name, s: await runVariant(name, cvars) });
}

const g = (s: CsvSummary, pass: string): string => (s.gpuPasses.find((p) => p.name === pass)?.avg ?? 0).toFixed(2).padStart(5);
console.log(`\noutput ${o.res}, ${o.frames} frames, first ${o.skip} skipped`);
console.log('variant            fps  p95fps   GPU ms   RT ms   TSR  Clouds  Lumen  res(metadata)');
for (const { name, s } of results) {
  const lumen = s.gpuPasses.filter((p) => p.name.startsWith('Lumen')).reduce((a, p) => a + p.avg, 0);
  const res = `${s.metadata['systemresolution.resx'] ?? '?'}x${s.metadata['systemresolution.resy'] ?? '?'}`;
  console.log(
    `${name.padEnd(16)} ${s.fps.toFixed(0).padStart(5)}  ${s.fpsLow.toFixed(0).padStart(6)}  ${(s.threads['GPUTime']?.avg ?? 0).toFixed(2).padStart(7)}` +
      `  ${(s.threads['RenderThreadTime']?.avg ?? 0).toFixed(2).padStart(6)}  ${g(s, 'TemporalSuperResolution')}  ${g(s, 'VolumetricCloud')}  ${lumen.toFixed(2).padStart(5)}  ${res}`,
  );
}
