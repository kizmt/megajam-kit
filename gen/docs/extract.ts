#!/usr/bin/env node
// Turns the pages crawl.ts saved into plain Markdown: the <main> body only (title, summary, headings, paragraphs,
// lists, tables, code, image alt text, links as text), one file per page plus pages.json for the summarisers.
//   node gen\docs\extract.ts --in out\docs59
// Output: <in>\md\<slug>.md and <in>\pages.json ([{slug, url, title, summary, words, links}]).
import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
const { values: o } = parseArgs({ options: { in: { type: 'string', default: 'out/docs' } } });
const inDir = o.in!;
const htmlDir = join(inDir, 'html');
const mdDir = join(inDir, 'md');
mkdirSync(mdDir, { recursive: true });

import { toMarkdown, inline } from './html.ts';

function between(html: string, open: RegExp, closeTag: string): string {
  const m = open.exec(html);
  if (!m) return '';
  const start = m.index + m[0].length;
  const end = html.lastIndexOf(closeTag);
  return end > start ? html.slice(start, end) : html.slice(start);
}


type Crawled = { slug: string; url: string; status: number; title: string; links: string[] };
const crawled = new Map<string, Crawled>();
const jsonl = join(inDir, 'pages.jsonl');
if (existsSync(jsonl)) for (const l of readFileSync(jsonl, 'utf8').split('\n')) if (l.trim()) { const p = JSON.parse(l) as Crawled; if (p.status === 200) crawled.set(p.slug, p); }

// The server-rendered breadcrumb has no hierarchy, so each page's section comes from the link graph: a breadth-first
// walk from the root, each page's section being the root's child it was first reached through.
const rootSlug = [...crawled.keys()].find((s) => /^unreal-engine-\d+-\d+-documentation$/.test(s));
const sectionOf = new Map<string, string>();
const parentOf = new Map<string, string>();
if (rootSlug) {
  const q: string[] = [];
  for (const s of crawled.get(rootSlug)?.links ?? []) if (crawled.has(s) && !sectionOf.has(s)) { sectionOf.set(s, s); parentOf.set(s, rootSlug); q.push(s); }
  sectionOf.set(rootSlug, rootSlug);
  while (q.length) {
    const cur = q.shift()!;
    for (const s of crawled.get(cur)?.links ?? []) if (crawled.has(s) && !sectionOf.has(s)) { sectionOf.set(s, sectionOf.get(cur)!); parentOf.set(s, cur); q.push(s); }
  }
}
const FOOTER = /^(Ask questions and help your peers.*|Write your own tutorials or read those from others.*)$/gm;

const index: { slug: string; url: string; title: string; summary: string; section: string; parent: string; words: number; links: string[] }[] = [];
for (const f of readdirSync(htmlDir).filter((f) => f.endsWith('.html'))) {
  const slug = f.slice(0, -5);
  const html = readFileSync(join(htmlDir, f), 'utf8');
  const main = between(html, /<main\b[^>]*>/i, '</main>') || html;
  const title = inline(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? slug).trim();
  const summary = inline(main.match(/<header\b[^>]*>[\s\S]*?<p\b[^>]*>([\s\S]*?)<\/p>/i)?.[1] ?? '').trim();
  // Drop the header (breadcrumb, title, summary): they go in the front matter.
  const body = main.replace(/<header\b[\s\S]*?<\/header>/i, '');
  const md = toMarkdown(body).replace(FOOTER, '').replace(/\n{3,}/g, '\n\n').trim() + '\n';
  const p = crawled.get(slug);
  const url = p?.url ?? `https://dev.epicgames.com/documentation/en-us/unreal-engine/${slug}`;
  const section = sectionOf.get(slug) ?? '(unreached)';
  writeFileSync(join(mdDir, `${slug}.md`), `# ${title}\n\n${url}\n\n> ${summary}\n\n${md}`);
  index.push({ slug, url, title, summary, section, parent: parentOf.get(slug) ?? '', words: md.split(/\s+/).length, links: p?.links ?? [] });
}
index.sort((a, b) => a.slug.localeCompare(b.slug));
writeFileSync(join(inDir, 'pages.json'), JSON.stringify(index, null, 1));
console.log(`EXTRACT DONE: ${index.length} pages, ${index.reduce((n, p) => n + p.words, 0)} words -> ${mdDir}`);
