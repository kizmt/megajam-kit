#!/usr/bin/env node
// Four views for Tripo's multiview-to-3D: a turnaround sheet cut into front, left, back and right images.
// With only a front view Tripo guesses the back and sides; four consistent views fix the hidden side's shape.
//
//   node gen/views.ts <sheet.png> [--out dir] [--layout grid|row]
//
// The sheet is a 2x2 grid by default (top-left front, top-right left, bottom-left back, bottom-right right) or a row
// of four (front, left, back, right). The cut lines go through the emptiest band near each expected split, so cells
// don't have to be exactly equal. Each view is trimmed to its figure, padded square on the sheet's background colour
// and saved as <sheet>_front.png etc. character.ts and asset.ts call this for --sheet and --turnaround.
// "left" is the subject's own left side: in that view a character faces the image's left edge.
import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { fail, findFfmpeg, isMain } from './paths.ts';

export const VIEW_ORDER = ['front', 'left', 'back', 'right'] as const;
export type Layout = 'grid' | 'row';

/** The layout part of a turnaround prompt: four views, plain background, nothing held. */
export const TURNAROUND_RULES = (layout: Layout): string =>
  (layout === 'grid'
    ? 'Exactly four views of the SAME subject in a 2x2 grid of equal cells: top-left FRONT view; top-right LEFT ' +
      'side view: its front points to the LEFT edge of the image; bottom-left BACK view; bottom-right RIGHT side ' +
      'view: its front points to the RIGHT edge of the image. The two side views face opposite ways. '
    : 'Exactly four views of the SAME subject in one row, left to right: FRONT, LEFT side (faces the image\'s left ' +
      'edge), BACK, RIGHT side (faces the image\'s right edge). ') +
  'Orthographic camera at the same height and the same scale in every view; identical design, colours, ' +
  'proportions and details in all four. Each view whole and centred in its cell with wide empty margins; nothing ' +
  'crosses between cells. Plain flat light-grey background everywhere, soft even lighting, no shadow, no ground, ' +
  'no labels, no text, no arrows, no dividing lines.';

export interface ViewsResult { sheet: string; layout: Layout; size: number[]; views: Record<(typeof VIEW_ORDER)[number], string> }

function ffmpeg(): string {
  const f = findFfmpeg();
  if (!f) throw new Error('ffmpeg not found (winget install Gyan.FFmpeg)');
  return f;
}

function dims(file: string): [number, number] {
  const r = spawnSync(ffmpeg(), ['-hide_banner', '-i', file], { encoding: 'utf8' });
  const m = /Video:.*?, (\d{2,5})x(\d{2,5})/.exec(r.stderr ?? '');
  if (!m) throw new Error(`could not read the image size of ${file}`);
  return [Number(m[1]), Number(m[2])];
}

const A = 512; // analysis size (the sheet is squashed to A x A RGB to find the gaps)

/** Cut a turnaround sheet into four view images. */
export function splitSheet(sheet: string, outDir?: string, layout: Layout = 'grid'): ViewsResult {
  const src = resolve(sheet);
  const [W, H] = dims(src);
  const raw = spawnSync(ffmpeg(), ['-v', 'error', '-i', src, '-vf', `scale=${A}:${A}`, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
    { maxBuffer: A * A * 3 + 1024 });
  const px = raw.stdout as Buffer;
  if (raw.status !== 0 || px.length < A * A * 3) throw new Error(`ffmpeg could not read ${src}: ${raw.stderr?.toString() ?? ''}`);
  const at = (x: number, y: number, c: number): number => px[(y * A + x) * 3 + c] ?? 0;
  // Background: the median of the border pixels, per channel.
  const border: number[][] = [[], [], []];
  for (let i = 0; i < A; i++) for (const [x, y] of [[i, 0], [i, A - 1], [0, i], [A - 1, i]] as const)
    for (let c = 0; c < 3; c++) border[c]!.push(at(x, y, c));
  const bg = border.map((v) => v.sort((a, b) => a - b)[v.length >> 1] ?? 0);
  const fg = new Uint8Array(A * A);
  for (let y = 0; y < A; y++) for (let x = 0; x < A; x++) {
    const d = Math.abs(at(x, y, 0) - bg[0]!) + Math.abs(at(x, y, 1) - bg[1]!) + Math.abs(at(x, y, 2) - bg[2]!);
    fg[y * A + x] = d > 36 ? 1 : 0;
  }
  const count = (x0: number, x1: number, y0: number, y1: number, axis: 'x' | 'y', i: number): number => {
    let n = 0;
    if (axis === 'x') for (let y = y0; y < y1; y++) n += fg[y * A + i]!;
    else for (let x = x0; x < x1; x++) n += fg[i * A + x]!;
    return n;
  };
  /** The emptiest line within +-15% of `expect` (centre of the emptiest run, so it lands mid-gap). */
  const cut = (expect: number, axis: 'x' | 'y', lo: number, hi: number): number => {
    const r = Math.round(A * 0.15);
    let best = Infinity;
    const scores: number[] = [];
    for (let i = Math.max(1, expect - r); i <= Math.min(A - 2, expect + r); i++) {
      const s = count(lo, hi, lo, hi, axis, i);
      scores.push(s);
      best = Math.min(best, s);
    }
    const start = Math.max(1, expect - r);
    const idx = scores.map((s, k) => (s === best ? k : -1)).filter((k) => k >= 0);
    // the run of best lines closest to the expected split
    const near = idx.reduce((a, b) => (Math.abs(start + b - expect) < Math.abs(start + a - expect) ? b : a), idx[0] ?? 0);
    let a = near, b = near;
    while (idx.includes(a - 1)) a--;
    while (idx.includes(b + 1)) b++;
    return start + Math.round((a + b) / 2);
  };
  let cells: [number, number, number, number][]; // x0, y0, x1, y1 in analysis pixels
  if (layout === 'grid') {
    const cx = cut(A / 2, 'x', 0, A), cy = cut(A / 2, 'y', 0, A);
    cells = [[0, 0, cx, cy], [cx, 0, A, cy], [0, cy, cx, A], [cx, cy, A, A]];
  } else {
    const xs = [0, ...[1, 2, 3].map((k) => cut(Math.round((A * k) / 4), 'x', 0, A)), A];
    cells = [0, 1, 2, 3].map((k) => [xs[k]!, 0, xs[k + 1]!, A]);
  }
  const hex = bg.map((v) => v.toString(16).padStart(2, '0')).join('');
  const dir = resolve(outDir ?? dirname(src));
  mkdirSync(dir, { recursive: true });
  const stem = basename(src, extname(src));
  const views = {} as ViewsResult['views'];
  cells.forEach(([x0, y0, x1, y1], k) => {
    // Trim to the figure inside the cell (ignore specks: a line needs 2+ foreground pixels), then add a margin.
    const rows = new Array<number>(y1 - y0).fill(0), cols = new Array<number>(x1 - x0).fill(0);
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) if (fg[y * A + x]) {
      rows[y - y0] = (rows[y - y0] ?? 0) + 1; cols[x - x0] = (cols[x - x0] ?? 0) + 1;
    }
    const solid = (n: number): boolean => n >= 2;
    let bx0 = x0 + cols.findIndex(solid), bx1 = x0 + cols.findLastIndex(solid) + 1;
    let by0 = y0 + rows.findIndex(solid), by1 = y0 + rows.findLastIndex(solid) + 1;
    if (!cols.some(solid) || !rows.some(solid) || bx1 <= bx0 || by1 <= by0) {
      throw new Error(`the ${VIEW_ORDER[k]} cell of ${src} is empty: check the sheet's layout`);
    }
    const m = Math.round(Math.max(bx1 - bx0, by1 - by0) * 0.06) + 2;
    bx0 = Math.max(x0, bx0 - m); by0 = Math.max(y0, by0 - m); bx1 = Math.min(x1, bx1 + m); by1 = Math.min(y1, by1 + m);
    const sx = W / A, sy = H / A;
    const cw = Math.round((bx1 - bx0) * sx), ch = Math.round((by1 - by0) * sy);
    const side = Math.max(cw, ch);
    const file = join(dir, `${stem}_${VIEW_ORDER[k]}.png`);
    const r = spawnSync(ffmpeg(), ['-y', '-v', 'error', '-i', src, '-vf',
      `crop=${cw}:${ch}:${Math.round(bx0 * sx)}:${Math.round(by0 * sy)},pad=${side}:${side}:(ow-iw)/2:(oh-ih)/2:color=0x${hex}`,
      '-frames:v', '1', '-update', '1', file], { encoding: 'utf8' });
    if (r.status !== 0) throw new Error(`ffmpeg crop failed for ${file}: ${r.stderr}`);
    views[VIEW_ORDER[k]!] = file;
  });
  return { sheet: src, layout, size: [W, H], views };
}

/** --views a,b,c,d (front, left, back, right) as absolute paths. */
export function parseViews(arg: string): string[] {
  const v = arg.split(',').map((s) => s.trim()).filter(Boolean).map((s) => resolve(s));
  if (v.length !== 4) throw new Error(`--views needs four files, front,left,back,right (got ${v.length})`);
  return v;
}

if (isMain(import.meta.url)) {
  const { values: o, positionals } = parseArgs({
    allowPositionals: true,
    options: { out: { type: 'string' }, layout: { type: 'string', default: 'grid' }, help: { type: 'boolean', short: 'h', default: false } },
  });
  const sheet = positionals[0];
  if (o.help || !sheet) {
    console.log('usage: node gen/views.ts <sheet.png> [--out dir] [--layout grid|row]');
    process.exit(o.help ? 0 : 2);
  }
  if (o.layout !== 'grid' && o.layout !== 'row') fail('--layout is grid or row');
  try {
    const r = splitSheet(sheet, o.out, o.layout);
    for (const v of VIEW_ORDER) console.log(`  ${v.padEnd(5)} ${r.views[v]}`);
    console.log(`VIEWS_JSON=${JSON.stringify(r)}`); // KEY=json, the form parseMarkedJson reads
  } catch (e) {
    fail(e instanceof Error ? e.message : String(e));
  }
}
