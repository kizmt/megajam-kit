#!/usr/bin/env node
// Summarise an Unreal CSV profile (run the packaged game with -csvCaptureFrames=N -csvGpuStats).
//   node gen/perf/csv_report.ts "<Build>\Saved\Profiling\CSV\Profile(...).csv" [--top 15]
// Prints frame/thread times (avg, p50, p95), the most expensive GPU passes, and the capture metadata.
import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';

const { values: o, positionals } = parseArgs({ allowPositionals: true, options: { top: { type: 'string', default: '15' } } });
const file = positionals[0];
if (!file) {
  console.log('usage: node gen/perf/csv_report.ts <profile.csv> [--top 15]');
  process.exit(2);
}

const lines = readFileSync(file, 'utf8').split(/\r?\n/).filter((l) => l.length > 0);
const header = (lines[0] ?? '').split(',');
const rows: number[][] = [];
let metadata = '';
for (const l of lines.slice(1)) {
  if (l.startsWith('[')) { metadata = l; continue; }
  const cells = l.split(',');
  if (cells.length !== header.length) continue; // trailing header row / partial
  const nums = cells.map(Number);
  if (nums.every((n) => Number.isFinite(n))) rows.push(nums);
}
// Skip the first 60 frames (loading / shader warm-up).
const data = rows.slice(Math.min(60, Math.floor(rows.length / 4)));

const col = (name: string): number[] => {
  const i = header.indexOf(name);
  return i < 0 ? [] : data.map((r) => r[i] ?? 0);
};
const pct = (v: number[], p: number): number => {
  if (v.length === 0) return 0;
  const s = [...v].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))] ?? 0;
};
const avg = (v: number[]): number => (v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0);
const f = (n: number): string => n.toFixed(2).padStart(6);

console.log(`frames analysed: ${data.length} of ${rows.length}`);
console.log('                      avg     p50     p95   (ms)');
for (const name of ['FrameTime', 'GameThreadTime', 'RenderThreadTime', 'RHIThreadTime', 'GPUTime']) {
  const v = col(name);
  if (v.length) console.log(`${name.padEnd(18)} ${f(avg(v))}  ${f(pct(v, 50))}  ${f(pct(v, 95))}`);
}
const ft = col('FrameTime');
if (ft.length) console.log(`fps: avg ${(1000 / avg(ft)).toFixed(0)}, p5-low ${(1000 / pct(ft, 95)).toFixed(0)}`);

const gpuCols = header
  .map((h, i) => ({ h, i }))
  .filter(({ h }) => h.startsWith('GPU/') && h !== 'GPU/Total')
  .map(({ h, i }) => ({ name: h.slice(4), avg: avg(data.map((r) => r[i] ?? 0)) }))
  .sort((a, b) => b.avg - a.avg);
if (gpuCols.length) {
  console.log(`\ntop GPU passes (avg ms):`);
  for (const g of gpuCols.slice(0, Number(o.top))) console.log(`  ${f(g.avg)}  ${g.name}`);
} else {
  console.log('\n(no GPU/* columns: run with -csvGpuStats)');
}
if (metadata) {
  const cells = metadata.split(',');
  const pick: Record<string, string> = {};
  cells.forEach((cell, i) => {
    if (cell.startsWith('[') && i + 1 < cells.length) pick[cell.replace(/[[\]]/g, '')] = cells[i + 1] ?? '';
  });
  const keys = Object.keys(pick).filter((k) => /res|rhi|gpu|scalab|percent|commandline|device|platform/i.test(k));
  console.log('\nmetadata:');
  for (const k of keys) console.log(`  ${k} = ${(pick[k] ?? '').slice(0, 160)}`);
}
