#!/usr/bin/env node
// Builds the 5.9 documentation index from the summarisers' cards and the extracted pages.
//   node gen\docs\build_index.ts --pages docs\ue59\pages.json --sections docs\ue59\sections.json --cards docs\ue59\cards --notes docs\ue59\notes.md --out docs\ue59\INDEX.md
// Pages are grouped as the official table of contents groups them: one folder per top-level section
// (sections.json, in the TOC's order), so a page's text is docs/ue59/pages/<folder>/<slug>.md.
// Every page in pages.json must have a card: the build fails and lists the missing slugs otherwise.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

const { values: o } = parseArgs({ options: {
  pages: { type: 'string', default: 'docs/ue59/pages.json' },
  sections: { type: 'string', default: 'docs/ue59/sections.json' },
  cards: { type: 'string', default: 'docs/ue59/cards' },
  notes: { type: 'string', default: '' },
  out: { type: 'string', default: 'docs/ue59/INDEX.md' },
  version: { type: 'string', default: '5.9' },
} });

type Page = { slug: string; url: string; title: string; summary: string; section: string; folder: string; parent: string; words: number };
type Section = { folder: string; slug: string; title: string };
type Card = { slug: string; relevance: 'core' | 'useful' | 'skip'; summary: string; keys?: string[]; gotchas?: string[]; new_in_59?: string };

const pages = JSON.parse(readFileSync(o.pages!, 'utf8')) as Page[];
const cards = new Map<string, Card>();
for (const f of readdirSync(o.cards!).filter((f) => f.endsWith('.jsonl'))) {
  for (const line of readFileSync(join(o.cards!, f), 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try { const c = JSON.parse(line) as Card; if (c.slug) cards.set(c.slug, c); } catch { console.log(`bad card line in ${f}: ${line.slice(0, 80)}`); }
  }
}

const missing = pages.filter((p) => !cards.has(p.slug)).map((p) => p.slug);
if (missing.length) {
  console.log(`FAIL: ${missing.length} pages have no card:\n${missing.join('\n')}`);
  process.exit(1);
}

const sectionList = JSON.parse(readFileSync(o.sections!, 'utf8')) as Section[];
const titleOf = new Map<string, string>(sectionList.map((s) => [s.folder, s.title]));
const unknown = pages.filter((p) => !titleOf.has(p.folder)).map((p) => `${p.slug} (${p.folder})`);
if (unknown.length) {
  console.log(`FAIL: ${unknown.length} pages have no folder in ${o.sections}:\n${unknown.join('\n')}`);
  process.exit(1);
}
const bySection = new Map<string, Page[]>();
for (const p of pages) bySection.set(p.folder, [...(bySection.get(p.folder) ?? []), p]);
const order = { core: 0, useful: 1, skip: 2 } as const;
const sections = sectionList.map((s) => s.folder).filter((f) => bySection.has(f));

const counts = { core: 0, useful: 0, skip: 0 };
for (const c of cards.values()) counts[c.relevance] = (counts[c.relevance] ?? 0) + 1;
const new59 = [...cards.values()].filter((c) => c.new_in_59?.trim()).length;
const lines: string[] = [];
lines.push(`# Unreal Engine ${o.version} documentation index`, '');
lines.push('> **Search this file, never open it whole** (it is about 2 MB, roughly 500k tokens): `rg -i "<term>" docs/ue59/INDEX.md | head -30`, then open only the page a hit names (`docs/ue59/pages/<section>/<slug>.md`). `docs/ue59/cards/` is the source data this file is built from: sessions don\'t need it.', '');
lines.push(`Every page of the ${o.version} documentation's table of contents (see Coverage notes at the end), crawled ${new Date().toISOString().slice(0, 10)} by \`gen/docs/crawl.ts\`, extracted to \`docs/ue59/pages/<section>/<slug>.md\` (one folder per top-level section of the official table of contents) by \`gen/docs/extract.ts\`, and read by summariser agents (the console-variable table and long pasted node graphs checked by search) whose cards (\`docs/ue59/cards/*.jsonl\`) this index is built from (\`gen/docs/build_index.ts\`).`, '');
lines.push(`How to use: search this file for the topic or an exact name (a setting, console variable, class, function or plugin: each entry lists them after "keys:"), then open the page's text (the link: \`docs/ue59/pages/<section>/<slug>.md\`, the full page, offline) or its URL. **[core]** = a small single-player jam game is likely to need it; [useful] = depth or a less common system; [skip] = not for this kind of project. **5.9:** = what the page itself says is new, changed or removed in ${o.version} (grep "5.9:" for all of them). Gotchas are the page's own warnings and limits.`, '');
lines.push(`${pages.length} pages: ${counts.core} core, ${counts.useful} useful, ${counts.skip} skip; ${new59} say something is new or changed in ${o.version}. API reference is not crawled: [C++ API](https://dev.epicgames.com/documentation/en-us/unreal-engine/API?application_version=${o.version}) | [Blueprint API](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI?application_version=${o.version}) | [Python API](https://dev.epicgames.com/documentation/en-us/unreal-engine/python-api/?application_version=${o.version}).`, '');
lines.push('Sections, in the official table of contents order (folder in brackets): ' + sections.map((s) => `${titleOf.get(s)} (\`${s}/\`, ${bySection.get(s)!.length})`).join(' | '), '');
for (const s of sections) {
  lines.push(`## ${titleOf.get(s)} (\`pages/${s}/\`)`, '');
  const list = (bySection.get(s) ?? []).slice().sort((a, b) => {
    const ca = cards.get(a.slug)!, cb = cards.get(b.slug)!;
    return order[ca.relevance] - order[cb.relevance] || a.title.localeCompare(b.title);
  });
  for (const p of list) {
    const c = cards.get(p.slug)!;
    const tag = c.relevance === 'core' ? '**[core]**' : `[${c.relevance}]`;
    let e = `- ${tag} [${p.title}](pages/${p.folder}/${p.slug}.md) ([web](${p.url})) - ${c.summary.trim()}`;
    if (c.new_in_59?.trim()) e += ` **5.9:** ${c.new_in_59.trim()}`;
    if (c.keys?.length) e += ` keys: ${c.keys.map((k) => '`' + k.replace(/`/g, '') + '`').join(', ')}.`;
    if (c.gotchas?.length) e += ` Gotchas: ${c.gotchas.map((g) => g.trim().replace(/\.$/, '')).join('; ')}.`;
    lines.push(e);
  }
  lines.push('');
}
if (o.notes) lines.push(readFileSync(o.notes, 'utf8').trim(), '');
writeFileSync(o.out!, lines.join('\n'));
console.log(`INDEX DONE: ${pages.length} pages, ${sections.length} sections -> ${o.out}`);
