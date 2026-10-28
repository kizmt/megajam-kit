// Procedural VFX textures: grayscale masks and tileable noise, rendered in code (no generator, no credits), so every
// effect texture is the game's own content and the set is consistent. Used by gen/vfx/vfx.ts (generate + import).
//
// Shapes are centred and fall to 0 at the edges (import with Clamp addressing); noise and voronoi tile seamlessly
// (Wrap addressing) so the master VFX material can pan them. All values are linear 0..1.
import { writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

export interface VfxTexture {
  name: string;
  /** Wrap for tileable textures (noise), Clamp for shapes that must not bleed at the edges. */
  tiles: boolean;
  what: string;
  render: (size: number) => Float32Array;
}

// ---------- PNG (8-bit grayscale) ----------

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (const b of buf) c = (CRC_TABLE[(c ^ b) & 0xff] ?? 0) ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

/** Writes values (0..1, row-major, size x size) as an 8-bit grayscale PNG. */
export function writeGrayPng(file: string, size: number, v: Float32Array): void {
  const raw = Buffer.alloc(size * (size + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size + 1)] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const val = v[y * size + x] ?? 0;
      raw[y * (size + 1) + 1 + x] = Math.round(Math.min(1, Math.max(0, val)) * 255);
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 0; // colour type: grayscale
  writeFileSync(file, Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0)),
  ]));
}

// ---------- helpers ----------

const clamp01 = (x: number): number => Math.min(1, Math.max(0, x));
const smooth = (e0: number, e1: number, x: number): number => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

/** Fills a size x size field from f(u, v) with u, v in -1..1 (centre 0), sampling pixel centres. */
function field(size: number, f: (u: number, v: number) => number): Float32Array {
  const out = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) out[y * size + x] = clamp01(f(((x + 0.5) / size) * 2 - 1, ((y + 0.5) / size) * 2 - 1));
  }
  return out;
}

/** Deterministic hash of integer lattice coords -> 0..1 (seeded). */
function hash(ix: number, iy: number, seed: number): number {
  let h = (Math.imul(ix, 374761393) + Math.imul(iy, 668265263) + Math.imul(seed, 2147483647)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

/** Tileable gradient (Perlin-style) noise with period p cells, at u, v in 0..1. Quintic fade; about -0.7..0.7.
 * Gradient noise, not value noise: value noise shows blocky, grid-aligned blobs in dissolves. */
function gradientNoise(u: number, v: number, p: number, seed: number): number {
  const x = u * p, y = v * p;
  const x0 = Math.floor(x), y0 = Math.floor(y);
  const fx = x - x0, fy = y - y0;
  const sx = fx * fx * fx * (fx * (fx * 6 - 15) + 10), sy = fy * fy * fy * (fy * (fy * 6 - 15) + 10);
  const w = (i: number): number => ((i % p) + p) % p;
  const g = (ix: number, iy: number, dx: number, dy: number): number => {
    const ang = hash(w(ix), w(iy), seed) * Math.PI * 2;
    return Math.cos(ang) * dx + Math.sin(ang) * dy;
  };
  const a = g(x0, y0, fx, fy), b = g(x0 + 1, y0, fx - 1, fy);
  const c = g(x0, y0 + 1, fx, fy - 1), d = g(x0 + 1, y0 + 1, fx - 1, fy - 1);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}

/** Tileable fBm: octaves of gradient noise, normalised to 0..1 over the texture. */
function fbm(size: number, basePeriod: number, octaves: number, seed: number): Float32Array {
  const out = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size, v = y / size;
      let sum = 0, amp = 0.5, p = basePeriod;
      for (let o = 0; o < octaves; o++) { sum += amp * gradientNoise(u, v, p, seed + o * 17); amp *= 0.5; p *= 2; }
      out[y * size + x] = sum;
    }
  }
  return remap01(out);
}

/** Tileable Voronoi (period p cells) at u, v in 0..1: [F1, F2] distances in cell units. */
function voronoi(u: number, v: number, p: number, seed: number): [number, number] {
  const x = u * p, y = v * p;
  const cx = Math.floor(x), cy = Math.floor(y);
  let f1 = 9, f2 = 9;
  for (let j = -1; j <= 1; j++) {
    for (let i = -1; i <= 1; i++) {
      const gx = cx + i, gy = cy + j;
      const wx = ((gx % p) + p) % p, wy = ((gy % p) + p) % p;
      const px = gx + hash(wx, wy, seed), py = gy + hash(wx, wy, seed + 101);
      const d = Math.hypot(px - x, py - y);
      if (d < f1) { f2 = f1; f1 = d; } else if (d < f2) f2 = d;
    }
  }
  return [f1, f2];
}

function remap01(a: Float32Array): Float32Array {
  let lo = Infinity, hi = -Infinity;
  for (const x of a) { lo = Math.min(lo, x); hi = Math.max(hi, x); }
  return a.map((x) => (x - lo) / (hi - lo || 1));
}

/** u, v in -1..1 -> 0..1 for the tileable functions. */
const t01 = (c: number): number => (c + 1) / 2;

// ---------- the set ----------

export const VFX_TEXTURES: VfxTexture[] = [
  { name: 'T_VFX_SoftCircle', tiles: false, what: 'soft round sprite (dust, smoke base, generic particle)',
    render: (s) => field(s, (u, v) => 1 - smooth(0.0, 1.0, Math.hypot(u, v))) },
  { name: 'T_VFX_Glow', tiles: false, what: 'bright core with a long falloff (spark heads, flares, magic)',
    render: (s) => field(s, (u, v) => { const r = Math.hypot(u, v); return (1 / (1 + 40 * r * r)) * (1 - smooth(0.6, 1, r)); }) },
  { name: 'T_VFX_Ring', tiles: false, what: 'soft ring (pickups, auras)',
    render: (s) => field(s, (u, v) => Math.exp(-(((Math.hypot(u, v) - 0.65) / 0.08) ** 2))) },
  { name: 'T_VFX_Shockwave', tiles: false, what: 'ring with a hard outer edge and an inner fade (impact shockwaves)',
    render: (s) => field(s, (u, v) => { const r = Math.hypot(u, v); return smooth(0.55, 0.82, r) * (1 - smooth(0.84, 0.9, r)); }) },
  // Vertical: Niagara's Velocity Aligned sprites point the texture's V axis along the velocity (tested 2026-10-28; a
  // horizontal streak drew every spark at 90 degrees to its motion). Head at the top (V = 0).
  { name: 'T_VFX_Spark', tiles: false, what: 'vertical streak with a bright head at the top (Velocity Aligned sprite sparks)',
    render: (s) => field(s, (u, v) => Math.exp(-((u / 0.07) ** 2)) * smooth(-1, 0.6, -v) * (1 - smooth(0.6, 1, -v))) },
  { name: 'T_VFX_Star4', tiles: false, what: '4-point star flare (hits, glints)',
    render: (s) => field(s, (u, v) => {
      const r = Math.hypot(u, v);
      const arms = Math.exp(-((u / 0.04) ** 2)) * (1 - smooth(0, 1, Math.abs(v)))
        + Math.exp(-((v / 0.04) ** 2)) * (1 - smooth(0, 1, Math.abs(u)));
      return (arms + 1 / (1 + 60 * r * r)) * (1 - smooth(0.85, 1, r));
    }) },
  { name: 'T_VFX_Arc', tiles: false, what: 'crescent over the top half, thick in the middle, fading at both ends (slashes, swipes)',
    render: (s) => field(s, (u, v) => {
      const a = Math.atan2(-v, u); // image y points down: -v is up
      if (a <= 0) return 0;
      const width = 0.02 + 0.12 * Math.sin(a);
      const along = smooth(0, 0.4, a) * (1 - smooth(Math.PI - 0.4, Math.PI, a));
      return Math.exp(-(((Math.hypot(u, v) - 0.7) / width) ** 2)) * along;
    }) },
  { name: 'T_VFX_Trail', tiles: true, what: 'ribbon strip: soft across V, even along U (weapon trails, tracers); pan U for flow',
    render: (s) => field(s, (_u, v) => Math.exp(-((v / 0.45) ** 4))) },
  { name: 'T_VFX_Gradient', tiles: false, what: 'linear ramp 0 -> 1 along U (wipes, masks)',
    render: (s) => field(s, (u) => t01(u)) },
  { name: 'T_VFX_Noise', tiles: true, what: 'tileable fBm noise (dissolve, distortion, smoke breakup); pan it',
    render: (s) => fbm(s, 4, 6, 7) },
  { name: 'T_VFX_NoiseFine', tiles: true, what: 'tileable high-frequency fBm (fine breakup, flicker)',
    render: (s) => fbm(s, 16, 4, 31) },
  { name: 'T_VFX_VoronoiCells', tiles: true, what: 'tileable cells with bright centres (energy, magic, caustics)',
    render: (s) => remap01(field(s, (u, v) => 1 - voronoi(t01(u), t01(v), 6, 3)[0])) },
  { name: 'T_VFX_VoronoiEdges', tiles: true, what: 'tileable cell edges as bright lines (cracks, shields, lightning webs)',
    render: (s) => field(s, (u, v) => { const [f1, f2] = voronoi(t01(u), t01(v), 6, 3); return 1 - smooth(0, 0.12, f2 - f1); }) },
  { name: 'T_VFX_SmokePuff', tiles: false, what: 'cloudy puff: noise inside a soft disc (smoke, dust clouds)',
    render: (s) => {
      const n = fbm(s, 4, 5, 53);
      const disc = field(s, (u, v) => 1 - smooth(0.2, 1, Math.hypot(u, v)));
      return disc.map((d, i) => clamp01(d * (0.35 + 0.9 * (n[i] ?? 0)) * 1.4 - 0.15));
    } },
];
