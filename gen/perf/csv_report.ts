#!/usr/bin/env node
// Summarise an Unreal CSV profile (run the packaged game with -csvCaptureFrames=N -csvGpuStats).
//   node gen/perf/csv_report.ts "<Build>\Saved\Profiling\CSV\Profile(...).csv" [--top 15] [--skip 120]
// Prints frame/thread times (avg, p50, p95), the most expensive GPU passes, and the capture metadata.
import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { isMain } from '../paths.ts';

export interface Stat { avg: number; p50: number; p95: number }
export interface CsvSummary {
  frames: number;
  analysed: number;
  threads: Record<string, Stat>;
  fps: number;
  fpsLow: number;
  gpuPasses: { name: string; avg: number }[];
  metadata: Record<string, string>;
}

const THREADS = ['FrameTime', 'GameThreadTime', 'RenderThreadTime', 'RHIThreadTime', 'GPUTime'] as const;

function stat(v: number[]): Stat {
  if (v.length === 0) return { avg: 0, p50: 0, p95: 0 };
  const s = [...v].sort((a, b) => a - b);
  const at = (p: number): number => s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))] ?? 0;
  return { avg: v.reduce((a, b) => a + b, 0) / v.length, p50: at(50), p95: at(95) };
}

/** Parse a CSV profile. Cells that are not numbers (e.g. the events column) are ignored per column. */
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
  const data = rows.slice(Math.min(skip, Math.floor(rows.length / 4)));
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
  const ft = threads['FrameTime'] ?? { avg: 0, p50: 0, p95: 0 };
  return {
    frames: rows.length,
    analysed: data.length,
    threads,
    fps: ft.avg ? 1000 / ft.avg : 0,
    fpsLow: ft.p95 ? 1000 / ft.p95 : 0,
    gpuPasses,
    metadata,
  };
}

const f = (n: number): string => n.toFixed(2).padStart(6);

export function printSummary(s: CsvSummary, top = 15): void {
  console.log(`frames analysed: ${s.analysed} of ${s.frames}`);
  console.log('                      avg     p50     p95   (ms)');
  for (const [name, v] of Object.entries(s.threads)) console.log(`${name.padEnd(18)} ${f(v.avg)}  ${f(v.p50)}  ${f(v.p95)}`);
  console.log(`fps: avg ${s.fps.toFixed(0)}, p95-frame ${s.fpsLow.toFixed(0)}`);
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
    options: { top: { type: 'string', default: '15' }, skip: { type: 'string', default: '120' } },
  });
  const file = positionals[0];
  if (!file) {
    console.log('usage: node gen/perf/csv_report.ts <profile.csv> [--top 15] [--skip 120]');
    process.exit(2);
  }
  printSummary(summarise(file, Number(o.skip)), Number(o.top));
}
