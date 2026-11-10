#!/usr/bin/env node
// Summarise an Unreal CSV profile (run the packaged game with -csvCaptureFrames=N -csvGpuStats).
//   node gen/perf/csv_report.ts "<Build>\Saved\Profiling\CSV\Profile(...).csv" [--top 15] [--skip 120] [--target-fps 60]
// Prints frame/thread times (avg, p50, p95, p99), the pacing checks from performance.md "The bar" (1% low, hitches
// against the target), the most expensive GPU passes, and the capture metadata.
import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { isMain } from '../paths.ts';

export interface Stat { avg: number; p50: number; p95: number; p99: number; max: number }
export interface CsvSummary {
  frames: number;
  analysed: number;
  threads: Record<string, Stat>;
  fps: number;
  /** fps at the p95 frame time (the slowest 5% of frames). */
  fpsLow: number;
  /** "1% low": fps at the p99 frame time. */
  fps1Low: number;
  /** Every analysed frame time (ms), for hitch counting against a target. */
  frameMs: number[];
  /** Frames left out at the start (warm-up); frameMs[i] is capture frame skipped + i. */
  skipped: number;
  gpuPasses: { name: string; avg: number }[];
  metadata: Record<string, string>;
}

const THREADS = ['FrameTime', 'GameThreadTime', 'RenderThreadTime', 'RHIThreadTime', 'GPUTime'] as const;

function stat(v: number[]): Stat {
  if (v.length === 0) return { avg: 0, p50: 0, p95: 0, p99: 0, max: 0 };
  const s = [...v].sort((a, b) => a - b);
  const at = (p: number): number => s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))] ?? 0;
  return { avg: v.reduce((a, b) => a + b, 0) / v.length, p50: at(50), p95: at(95), p99: at(99), max: s[s.length - 1] ?? 0 };
}

/** Hitches as performance.md "The bar" defines them: frames longer than twice the target frame time. */
export function hitches(s: CsvSummary, targetFps: number): number {
  const limit = 2000 / targetFps;
  return s.frameMs.filter((ms) => ms > limit).length;
}

/** The bar's pass/fail checks for one capture. */
export function barCheck(s: CsvSummary, targetFps: number): { pass: boolean; notes: string[] } {
  const notes: string[] = [];
  const h = hitches(s, targetFps);
  if (h > 0) notes.push(`${h} hitch(es) over ${(2000 / targetFps).toFixed(1)} ms (worst ${(s.threads['FrameTime']?.max ?? 0).toFixed(1)} ms)`);
  if (s.fpsLow < targetFps) notes.push(`p95 ${s.fpsLow.toFixed(0)} fps is below the ${targetFps} fps target`);
  // Uneven pacing only shows when the slow frames fall under the target: an uncapped run far above it (129 fps
  // average, 1% low 101, target 60) is steady once the game caps or syncs at the target, so that is not a failure.
  if (s.fps > 0 && s.fps1Low < 0.8 * s.fps && s.fps1Low < targetFps) {
    notes.push(`1% low ${s.fps1Low.toFixed(0)} fps is more than 20% under the ${s.fps.toFixed(0)} fps average and under the ${targetFps} fps target`);
  }
  return { pass: notes.length === 0, notes };
}

/** Each hitch with where it happened: the capture's frame number and the seconds of measured play before it. */
export function hitchList(s: CsvSummary, targetFps: number): { frame: number; atS: number; ms: number }[] {
  const limit = 2000 / targetFps;
  const out: { frame: number; atS: number; ms: number }[] = [];
  let t = 0;
  s.frameMs.forEach((ms, i) => {
    if (ms > limit) out.push({ frame: s.skipped + i, atS: t / 1000, ms });
    t += ms;
  });
  return out;
}

/**
 * Parse a CSV profile. Cells that are not numbers (e.g. the events column) are ignored per column.
 * The capture's last frame is left out: it is the frame on which the profiler stops and writes the file (44-109 ms
 * in a practice run's logs), and it failed the hitch check on runs with no hitch in the game.
 */
export function summarise(file: string, skip = 120): CsvSummary {
  const lines = readFileSync(file, 'utf8').split(/\r?\n/).filter((l) => l.length > 0);
  const header = (lines[0] ?? '').split(',');
  const rows: string[][] = [];
  let metaLine = '';
  for (const l of lines.slice(1)) {
    if (l.startsWith('[')) { metaLine = l; continue; }
    const cells = l.split(',');
    if (cells[0] === header[0]) continue; // repeated header row at the end
    rows.push(cells);
  }
  // Skip the warm-up frames, but never more than a quarter of the capture (a short capture keeps 3/4 of its frames).
  const skipped = Math.min(skip, Math.floor(rows.length / 4));
  const data = rows.slice(skipped, rows.length > skipped + 1 ? -1 : undefined);
  const col = (i: number): number[] => {
    const out: number[] = [];
    for (const r of data) {
      const c = r[i];
      if (c === undefined || c === '') continue;
      const n = Number(c);
      if (Number.isFinite(n)) out.push(n);
    }
    return out;
  };
  const threads: Record<string, Stat> = {};
  for (const t of THREADS) {
    const i = header.indexOf(t);
    if (i >= 0) threads[t] = stat(col(i));
  }
  const gpuPasses = header
    .map((h, i) => ({ h, i }))
    .filter(({ h }) => h.startsWith('GPU/') && h !== 'GPU/Total')
    .map(({ h, i }) => ({ name: h.slice(4), avg: stat(col(i)).avg }))
    .sort((a, b) => b.avg - a.avg);
  const metadata: Record<string, string> = {};
  const m = metaLine.split(',');
  m.forEach((cell, i) => {
    if (cell.startsWith('[') && i + 1 < m.length) metadata[cell.replace(/[[\]]/g, '')] = m[i + 1] ?? '';
  });
  const ft = threads['FrameTime'] ?? stat([]);
  const ftCol = header.indexOf('FrameTime');
  return {
    frames: rows.length,
    analysed: data.length,
    threads,
    fps: ft.avg ? 1000 / ft.avg : 0,
    fpsLow: ft.p95 ? 1000 / ft.p95 : 0,
    fps1Low: ft.p99 ? 1000 / ft.p99 : 0,
    frameMs: ftCol >= 0 ? col(ftCol) : [],
    skipped,
    gpuPasses,
    metadata,
  };
}

const f = (n: number): string => n.toFixed(2).padStart(6);

export function printSummary(s: CsvSummary, top = 15, targetFps = 60): void {
  console.log(`frames analysed: ${s.analysed} of ${s.frames}`);
  console.log('                      avg     p50     p95     p99     max   (ms)');
  for (const [name, v] of Object.entries(s.threads)) console.log(`${name.padEnd(18)} ${f(v.avg)}  ${f(v.p50)}  ${f(v.p95)}  ${f(v.p99)}  ${f(v.max)}`);
  console.log(`fps: avg ${s.fps.toFixed(0)}, p95-frame ${s.fpsLow.toFixed(0)}, 1% low ${s.fps1Low.toFixed(0)}`);
  const bar = barCheck(s, targetFps);
  console.log(`the bar at ${targetFps} fps: ${bar.pass ? 'PASS' : `FAIL: ${bar.notes.join('; ')}`}`);
  for (const h of hitchList(s, targetFps).slice(0, 10)) console.log(`  hitch: frame ${h.frame}, ${h.atS.toFixed(2)} s into the measured frames, ${h.ms.toFixed(1)} ms`);
  if (s.gpuPasses.length) {
    console.log('\ntop GPU passes (avg ms):');
    for (const g of s.gpuPasses.slice(0, top)) console.log(`  ${f(g.avg)}  ${g.name}`);
  } else {
    console.log('\n(no GPU/* columns: run with -csvGpuStats)');
  }
  const keys = Object.keys(s.metadata).filter((k) => /res|rhi|gpu|commandline|device/i.test(k));
  if (keys.length) {
    console.log('\nmetadata:');
    for (const k of keys) console.log(`  ${k} = ${(s.metadata[k] ?? '').slice(0, 200)}`);
  }
}

if (isMain(import.meta.url)) {
  const { values: o, positionals } = parseArgs({
    allowPositionals: true,
    options: { top: { type: 'string', default: '15' }, skip: { type: 'string', default: '120' }, 'target-fps': { type: 'string', default: '60' } },
  });
  const file = positionals[0];
  if (!file) {
    console.log('usage: node gen/perf/csv_report.ts <profile.csv> [--top 15] [--skip 120] [--target-fps 60]');
    process.exit(2);
  }
  printSummary(summarise(file, Number(o.skip)), Number(o.top), Number(o['target-fps']) || 60);
}
