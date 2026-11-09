#!/usr/bin/env node
// Crawls the Unreal Engine documentation for one engine version, breadth-first from the version's root page, and
// saves every page's server-rendered HTML so the text can be extracted and summarised offline (extract.ts).
//   node gen\docs\crawl.ts --version 5.9 --out out\docs59
//   node gen\docs\crawl.ts --version 5.9 --out out\docs59 --resume       (skips pages already saved)
// Why a crawl: the site's sidebar is loaded by script, and the sitemaps and the documentation API answer 403 to
// scripts, so the page links in the server-rendered body are the only map. API reference trees (C++, Blueprint,
// Python) are not crawled: they are listed as roots in the index.
// Run it on the director's PC: the cloud workspace can't reach dev.epicgames.com.
// Output: <out>\html\<slug>.html, <out>\pages.jsonl (one line per page: slug, url, status, title, links, bytes).
import { mkdirSync, existsSync, writeFileSync, appendFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

const { values: o } = parseArgs({
  options: {
    version: { type: 'string', default: '5.9' },
    out: { type: 'string', default: 'out/docs' },
    root: { type: 'string', default: '' },
    concurrency: { type: 'string', default: '3' },
    delay: { type: 'string', default: '400' },
    max: { type: 'string', default: '20000' },
    resume: { type: 'boolean', default: false },
    // A file of extra slugs to fetch (one per line), e.g. the previous version's pages that no 5.9 page links to:
    // the sidebar is the only link to some pages, and it isn't in the server-rendered HTML.
    seeds: { type: 'string', default: '' },
  },
});
const version = o.version!;
const root = o.root || `unreal-engine-${version.replace('.', '-')}-documentation`;
const outDir = o.out!;
const htmlDir = join(outDir, 'html');
mkdirSync(htmlDir, { recursive: true });
const pagesFile = join(outDir, 'pages.jsonl');
const SITE = 'https://dev.epicgames.com/documentation/en-us/unreal-engine/';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';

// Slugs that start the generated API reference trees, or aren't documentation pages.
const SKIP = /^(API|BlueprintAPI|python-api|node|assets)$/i;

function slugsIn(html: string): string[] {
  const out = new Set<string>();
  const re = /href="(?:https:\/\/dev\.epicgames\.com)?\/documentation\/(?:[a-z]{2}-[a-z]{2}\/)?unreal-engine\/([A-Za-z0-9._-]+)/g;
  for (const m of html.matchAll(re)) {
    const s = m[1];
    if (s && !SKIP.test(s)) out.add(s);
  }
  return [...out];
}

function titleOf(html: string): string {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  return (m?.[1] ?? '').replace(/\s*\|\s*Unreal Engine.*$/i, '').replace(/&amp;/g, '&').replace(/&#39;/g, "'").trim();
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
// Node 24's fetch (undici) can throw an internal assertion from a socket event after a response, outside any await
// (seen on this site under load). Log it and keep crawling: the page that hit it is retried on --resume.
process.on('uncaughtException', (e) => console.log(`  uncaught (continuing): ${String(e).split('\n')[0]}`));

async function fetchPage(slug: string): Promise<{ status: number; html: string }> {
  const url = `${SITE}${slug}?application_version=${version}`;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html' }, signal: AbortSignal.timeout(30000) });
      if (r.status === 429 || r.status === 403 || r.status >= 500) {
        // Back off hard on throttling: being blocked costs more than going slowly.
        const wait = 15000 * (attempt + 1);
        console.log(`  ${r.status} on ${slug}: waiting ${wait / 1000} s`);
        await sleep(wait);
        continue;
      }
      const html = await r.text();
      // Under load the server can give up rendering and send the loading spinner with an empty title: retry.
      if (r.status === 200 && /<h1>(?:<!--[^>]*-->)?<\/h1>/.test(html) && html.includes('<spinner')) {
        console.log(`  unrendered page (spinner) on ${slug}: retrying`);
        await sleep(8000 * (attempt + 1));
        continue;
      }
      return { status: r.status, html };
    } catch (e) {
      await sleep(5000 * (attempt + 1));
      if (attempt === 4) return { status: 0, html: String(e) };
    }
  }
  return { status: 429, html: '' };
}

const seen = new Set<string>();
const queue: string[] = [];
if (o.resume && existsSync(pagesFile)) {
  // Rebuild the frontier from saved pages: every saved page is seen, every link it had is queued unless saved.
  const lines = readFileSync(pagesFile, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l) as { slug: string; links: string[]; status: number });
  for (const p of lines) if (p.status === 200) seen.add(p.slug);
  for (const p of lines) for (const s of p.links ?? []) if (!seen.has(s)) { seen.add(s); queue.push(s); }
  console.log(`resume: ${lines.length} pages saved, ${queue.length} queued`);
}
if (!seen.has(root)) { seen.add(root); queue.unshift(root); }
if (o.seeds) {
  let added = 0;
  for (const s of readFileSync(o.seeds, 'utf8').split(/\r?\n/).map((l) => l.trim()).filter(Boolean)) {
    if (!seen.has(s) && !SKIP.test(s)) { seen.add(s); queue.push(s); added++; }
  }
  console.log(`seeds: ${added} slugs added`);
}

let done = 0;
let inFlight = 0;
const max = Number(o.max);
const delay = Number(o.delay);
async function worker(id: number) {
  // A worker waits while others are fetching: their pages may add to the queue.
  while (done < max && (queue.length || inFlight)) {
    const slug = queue.shift();
    if (!slug) { await sleep(500); continue; }
    inFlight++;
    try {
      const { status, html } = await fetchPage(slug);
      done++;
      const links = status === 200 ? slugsIn(html) : [];
      if (status === 200) writeFileSync(join(htmlDir, `${slug}.html`), html);
      for (const s of links) if (!seen.has(s)) { seen.add(s); queue.push(s); }
      appendFileSync(pagesFile, JSON.stringify({ slug, url: `${SITE}${slug}?application_version=${version}`, status, title: titleOf(html), links, bytes: html.length }) + '\n');
      if (done % 25 === 0 || status !== 200) console.log(`[w${id}] ${done} done, ${queue.length} queued: ${status} ${slug}`);
    } finally { inFlight--; }
    await sleep(delay);
  }
}
const n = Math.max(1, Number(o.concurrency));
await Promise.all(Array.from({ length: n }, (_, i) => worker(i)));
console.log(`CRAWL DONE: ${done} pages fetched, ${seen.size} slugs seen, ${queue.length} left in queue (max ${max})`);
