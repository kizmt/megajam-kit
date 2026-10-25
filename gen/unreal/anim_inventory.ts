#!/usr/bin/env node
// Offline inventory of a project's animation content: no editor needed, reads .uasset name tables directly.
//   node gen/unreal/anim_inventory.ts --project C:\dev\AnimLibrary                 # every top-level Content folder
//   node gen/unreal/anim_inventory.ts --project C:\dev\AnimLibrary --folder ParagonKwang --list
//   options: --json <out file>  --list (print every clip path)
// Per top-level folder: sequences / montages / blend spaces, the skeleton(s) the clips use, and skeletal meshes on
// each skeleton (a valid --source-mesh for retarget_library.ts). Classification is heuristic (name-table classes,
// highest-level class wins): treat counts as approximate and confirm a skeleton in the editor before a big retarget.
import { parseArgs } from 'node:util';
import { openSync, readSync, closeSync, readdirSync, statSync, existsSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

type Kind = 'Blueprint' | 'AnimBlueprint' | 'AnimMontage' | 'BlendSpace' | 'PoseAsset' | 'AnimSequence' | 'SkeletalMesh' | 'Skeleton' | 'Other';

// Precedence: a montage imports AnimSequence, an ABP imports both, a mesh imports Skeleton, so test the top first.
const CLASS_ORDER: [Kind, string[]][] = [
  ['AnimBlueprint', ['AnimBlueprint']],
  ['Blueprint', ['Blueprint', 'WidgetBlueprint', 'ControlRigBlueprint']],
  // Data assets that reference clips and name the Skeleton class without being either (pose search, choosers, rigs).
  ['Other', ['PoseSearchSchema', 'PoseSearchDatabase', 'PoseSearchNormalizationSet', 'ChooserTable', 'IKRigDefinition', 'IKRetargeter']],
  ['AnimMontage', ['AnimMontage']],
  ['BlendSpace', ['BlendSpace', 'BlendSpace1D', 'AimOffsetBlendSpace', 'AimOffsetBlendSpace1D']],
  ['PoseAsset', ['PoseAsset']],
  ['AnimSequence', ['AnimSequence']],
  ['SkeletalMesh', ['SkeletalMesh']],
  ['Skeleton', ['Skeleton']],
];

const HEAD = 256 * 1024;

function nameEntry(s: string): Buffer {
  // FName entry: int32 length (incl. terminator), ANSI chars, \0
  const b = Buffer.alloc(4 + s.length + 1);
  b.writeInt32LE(s.length + 1, 0);
  b.write(s, 4, 'latin1');
  return b;
}
const ENTRIES = new Map(CLASS_ORDER.flatMap(([, names]) => names).map((n) => [n, nameEntry(n)]));

interface Asset { path: string; file: string; kind: Kind; refs: string[] }

function readHead(file: string): Buffer {
  const fd = openSync(file, 'r');
  try {
    const size = Math.min(statSync(file).size, HEAD);
    const buf = Buffer.alloc(size);
    readSync(fd, buf, 0, size, 0);
    return buf;
  } finally {
    closeSync(fd);
  }
}

function classify(buf: Buffer): Kind {
  for (const [kind, names] of CLASS_ORDER) {
    if (names.some((n) => buf.includes(ENTRIES.get(n)!))) return kind;
  }
  return 'Other';
}

function walk(dir: string, out: string[]): void {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (!e.name.startsWith('__External')) walk(p, out);
    } else if (e.name.endsWith('.uasset')) out.push(p);
  }
}

const { values: o } = parseArgs({
  options: {
    project: { type: 'string' },
    folder: { type: 'string' },
    json: { type: 'string' },
    list: { type: 'boolean', default: false },
  },
});
const project = o.project ?? process.env['MEGAJAM_PROJECT'];
if (!project) {
  console.error('usage: node gen/unreal/anim_inventory.ts --project <project dir> [--folder <top-level Content folder>] [--list] [--json out.json]');
  process.exit(2);
}
const content = join(project, 'Content');
if (!existsSync(content)) {
  console.error(`no Content folder at ${content}`);
  process.exit(2);
}

const files: string[] = [];
walk(o.folder ? join(content, o.folder) : content, files);

const assets: Asset[] = files.map((file) => {
  const buf = readHead(file);
  const rel = relative(content, file).split(sep).join('/').replace(/\.uasset$/, '');
  const refs = [...new Set(buf.toString('latin1').match(/\/Game\/[A-Za-z0-9_\-/]+/g) ?? [])];
  return { path: `/Game/${rel}`, file, kind: classify(buf), refs };
});

const byPath = new Map(assets.map((a) => [a.path, a]));
// A skeleton reference may point outside --folder: classify it on demand.
function kindOf(path: string): Kind | undefined {
  const known = byPath.get(path);
  if (known) return known.kind;
  const f = join(content, ...path.replace(/^\/Game\//, '').split('/')) + '.uasset';
  if (!existsSync(f)) return undefined;
  const k = classify(readHead(f));
  byPath.set(path, { path, file: f, kind: k, refs: [] });
  return k;
}
const skeletonOf = (a: Asset): string | undefined => a.refs.find((r) => r !== a.path && kindOf(r) === 'Skeleton');

interface FolderReport {
  folder: string;
  sequences: number;
  montages: number;
  blendSpaces: number;
  poseAssets: number;
  animBlueprints: number;
  skeletons: Record<string, { clips: number; meshes: string[] }>;
  clips?: string[];
}

const reports = new Map<string, FolderReport>();
for (const a of assets) {
  const top = a.path.split('/')[2] ?? '';
  const r = reports.get(top) ??
    { folder: top, sequences: 0, montages: 0, blendSpaces: 0, poseAssets: 0, animBlueprints: 0, skeletons: {} };
  reports.set(top, r);
  const sk = (s: string | undefined) => (r.skeletons[s ?? '(none found)'] ??= { clips: 0, meshes: [] });
  switch (a.kind) {
    case 'AnimSequence':
      r.sequences++;
      {
        const s = skeletonOf(a);
        sk(s).clips++;
        if (o.list || (!s && (r.clips?.length ?? 0) < 5)) (r.clips ??= []).push(s ? a.path : `${a.path}  (no skeleton found)`);
      }
      break;
    case 'AnimMontage': r.montages++; break;
    case 'BlendSpace': r.blendSpaces++; break;
    case 'PoseAsset': r.poseAssets++; break;
    case 'AnimBlueprint': r.animBlueprints++; break;
    case 'SkeletalMesh': {
      const s = skeletonOf(a);
      if (s) sk(s).meshes.push(a.path);
      break;
    }
    default: break;
  }
}

const out = [...reports.values()].filter((r) => r.sequences + r.montages + r.blendSpaces + Object.keys(r.skeletons).length > 0);
for (const r of out) {
  console.log(`\n${r.folder}: ${r.sequences} sequences, ${r.montages} montages, ${r.blendSpaces} blend spaces` +
    (r.poseAssets ? `, ${r.poseAssets} pose assets` : '') + (r.animBlueprints ? `, ${r.animBlueprints} anim BPs` : ''));
  for (const [s, v] of Object.entries(r.skeletons)) {
    console.log(`  skeleton ${s}: ${v.clips} clips; meshes: ${v.meshes.length ? v.meshes.slice(0, 3).join(', ') + (v.meshes.length > 3 ? ` (+${v.meshes.length - 3})` : '') : 'none'}`);
  }
  if (r.clips) for (const c of r.clips) console.log(`    ${c}`);
}
if (o.json) {
  writeFileSync(o.json, JSON.stringify(out, null, 2));
  console.log(`\nwrote ${o.json}`);
}
