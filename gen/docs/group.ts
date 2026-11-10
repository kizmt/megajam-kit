#!/usr/bin/env node
// Groups the extracted pages as the official table of contents does: one folder per top-level section.
//   node gen\docs\group.ts --toc out\docs59\toc.json --in out\docs59 --out docs\ue59
// --toc is table_of_content.json saved from the browser pane (gen/docs/README.md step 3). Reads <in>/pages.json and
// <in>/md/<slug>.md; writes <out>/pages/<folder>/<slug>.md, <out>/sections.json (the sections in TOC order) and
// <out>/pages.json (each page's TOC section and folder; the link lists are dropped). Pages that are not in the TOC
// go to pages/other/. Run it on an empty <out>/pages: it does not delete files a previous run left elsewhere.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

const { values: o } = parseArgs({ options: {
  toc: { type: 'string' },
  in: { type: 'string', default: 'out/docs59' },
  out: { type: 'string', default: 'docs/ue59' },
} });
if (!o.toc) { console.log('usage: group.ts --toc <table_of_content.json> [--in out/docs59] [--out docs/ue59]'); process.exit(2); }

type TocEntry = { slug: string; title?: string; sub_entries?: TocEntry[] };
type Page = { slug: string; section: string; folder?: string; links?: string[] } & Record<string, unknown>;

// Short folder names for the 5.9 top-level sections. A section not listed here gets its slug minus the
// "...-unreal-engine" ending, so a new section still lands somewhere readable.
const FOLDERS: Record<string, string> = {
  'whats-new': 'whats-new', 'get-started': 'get-started',
  'understanding-the-basics-of-unreal-engine': 'basics', 'working-with-content-in-unreal-engine': 'content',
  'building-virtual-worlds-in-unreal-engine': 'worlds',
  'designing-visuals-rendering-and-graphics-with-unreal-engine': 'rendering',
  'ai-features-tools-and-plugins-in-unreal-engine': 'ai-features',
  'creating-visual-effects-in-niagara-for-unreal-engine': 'niagara-vfx',
  'gameplay-tutorials-for-unreal-engine': 'gameplay-tutorials', 'blueprints-visual-scripting-in-unreal-engine': 'blueprints',
  'programming-with-cplusplus-in-unreal-engine': 'cpp', 'gameplay-systems-in-unreal-engine': 'gameplay-systems',
  'getting-started-with-mobile-development-in-unreal-engine': 'mobile',
  'animating-characters-and-objects-in-unreal-engine': 'animation', 'motion-design-in-unreal-engine': 'motion-design',
  'creating-user-interfaces-with-umg-and-slate-in-unreal-engine': 'ui', 'working-with-audio-in-unreal-engine': 'audio',
  'working-with-media-in-unreal-engine': 'media', 'setting-up-your-production-pipeline-in-unreal-engine': 'production-pipeline',
  'testing-and-optimizing-your-content': 'testing-and-optimizing',
  'sharing-and-releasing-projects-for-unreal-engine': 'sharing-and-releasing',
  'samples-and-tutorials-for-unreal-engine': 'samples-and-tutorials',
  'epic-staffcreated-resources-for-unreal-engine': 'epic-resources',
};
const folderFor = (slug: string) => FOLDERS[slug] ?? slug.replace(/-(in|for|with|of)-unreal-engine$/, '');

const toc = JSON.parse(readFileSync(o.toc, 'utf8')) as { entries: TocEntry[] };
const root = toc.entries[0]!;
const sections: { folder: string; slug: string; title: string }[] = [];
const sectionOf = new Map<string, string>();
const walk = (list: TocEntry[] | undefined, folder: string) => {
  for (const e of list ?? []) { if (!sectionOf.has(e.slug)) sectionOf.set(e.slug, folder); walk(e.sub_entries, folder); }
};
for (const top of root.sub_entries ?? []) {
  const folder = folderFor(top.slug);
  sections.push({ folder, slug: top.slug, title: top.title ?? top.slug });
  sectionOf.set(top.slug, folder);
  walk(top.sub_entries, folder);
}
sections.push({ folder: 'other', slug: '', title: 'Other pages (linked from the docs but not in the table of contents)' });
const slugOf = new Map(sections.map((s) => [s.folder, s.slug]));

const pages = JSON.parse(readFileSync(join(o.in!, 'pages.json'), 'utf8')) as Page[];
for (const s of sections) mkdirSync(join(o.out!, 'pages', s.folder), { recursive: true });
const counts = new Map<string, number>();
for (const p of pages) {
  const folder = sectionOf.get(p.slug) ?? 'other';
  p.folder = folder;
  p.section = slugOf.get(folder) ?? '';
  delete p.links;
  copyFileSync(join(o.in!, 'md', `${p.slug}.md`), join(o.out!, 'pages', folder, `${p.slug}.md`));
  counts.set(folder, (counts.get(folder) ?? 0) + 1);
}
writeFileSync(join(o.out!, 'sections.json'), JSON.stringify(sections, null, 1));
// One page per line: greppable, and a rerun's diff shows which pages changed.
writeFileSync(join(o.out!, 'pages.json'), '[\n' + pages.map((p) => JSON.stringify(p)).join(',\n') + '\n]\n');
console.log(`GROUP DONE: ${pages.length} pages in ${sections.length} folders (${counts.get('other') ?? 0} in other/)`);
for (const s of sections) console.log(`  ${s.folder}: ${counts.get(s.folder) ?? 0}`);
