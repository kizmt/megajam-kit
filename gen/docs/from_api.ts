#!/usr/bin/env node
// Converts documentation pages saved from the docs site's own page data (document.json, block format) into the same
// Markdown as extract.ts, and adds them to pages.json. Used for pages the server can't pre-render (the crawler gets
// a loading spinner for them): the browser pane loads them as a reader would and saves them in one JSON file.
//   node gen\docs\from_api.ts --in out\docs59\ue59_missing_docs.json --out out\docs59
// Input: [{slug, title, toc_parent_path, status, doc}] where doc is document.json (or {redirect_url}).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { decode, inline, toMarkdown } from './html.ts';

const { values: o } = parseArgs({ options: { in: { type: 'string' }, out: { type: 'string', default: 'out/docs' }, version: { type: 'string', default: '5.9' } } });
type Block = { type?: string; content?: unknown; level?: number; language?: unknown; code?: unknown; alt_text?: unknown; caption?: unknown;
  title?: unknown; blocks?: unknown; content_html?: unknown; code_preview?: unknown; snippet_type?: unknown; lines_of_code?: unknown; callout_type?: unknown; items?: unknown; rows?: unknown; switchable_blocks?: unknown };
type Item = { slug: string; title?: string; toc_parent_path?: string; status?: number; doc?: { title?: string; description?: string; blocks?: Block[]; redirect_url?: string } };

// Block content is HTML: paragraphs through the same converter as crawled pages.
const md = (html: string) => toMarkdown(html).trim();

function render(blocks: unknown, out: string[]): void {
  if (!Array.isArray(blocks)) return;
  for (const b of blocks as Block[]) {
    if (!b || typeof b !== 'object') continue;
    const s = (v: unknown) => (typeof v === 'string' ? v : '');
    switch (b.type) {
      case 'header': out.push(`${'#'.repeat(Math.min(6, Number(b.level ?? 2)))} ${inline(s(b.content))}`); break;
      case 'paragraph': { const t = md(s(b.content)); if (t) out.push(t); break; }
      case 'markdown': { const t = md(s(b.content_html) || s(b.content)); if (t) out.push(t); break; }
      case 'code_snippet': {
        // The page data carries the snippet's first lines as code_preview; longer snippets load from a signed URL.
        const code = decode(s(b.code_preview) || s(b.content) || s(b.code)).replace(/\n+$/, '');
        const shown = code ? code.split('\n').length : 0;
        const total = Number(b.lines_of_code ?? shown);
        out.push((s(b.title) ? `**${s(b.title)}**\n` : '') + '```' + s(b.snippet_type ?? b.language) + '\n' + code + '\n```' +
          (total > shown ? `\n(${total - shown} more lines on the web page)` : ''));
        break;
      }
      case 'image': { const a = s(b.alt_text) || s(b.caption); if (a) out.push(`[image: ${inline(a)}]`); break; }
      case 'video': out.push(`[video${b.title ? ': ' + s(b.title) : ''}]`); break;
      case 'callout': { const inner: string[] = []; render(b.blocks, inner); if (inner.length) out.push(`> **${s(b.callout_type) || 'note'}:** ` + inner.join('\n> ')); break; }
      case 'document_list': for (const it of (b.items as { title?: string; document_url?: string; description?: string }[] | undefined) ?? []) {
        const slug = it.document_url?.match(/\/unreal-engine\/([A-Za-z0-9._-]+)/)?.[1];
        out.push(`- ${it.title ?? ''}${slug ? ` (-> ${slug})` : ''}${it.description ? ': ' + inline(it.description) : ''}`);
      } break;
      case 'enhanced_table': {
        const rows = ((b.rows as Block[][][] | undefined) ?? []).map((r) => r.map((cell) => { const c: string[] = []; render(cell, c); return c.join(' ').replace(/\n+/g, ' ').replace(/\|/g, '/'); }));
        if (rows.length) {
          const w = Math.max(...rows.map((r) => r.length));
          const line = (r: string[]) => '| ' + Array.from({ length: w }, (_, i) => r[i] ?? '').join(' | ') + ' |';
          out.push([line(rows[0] ?? []), '|' + ' --- |'.repeat(w), ...rows.slice(1).map(line)].join('\n'));
        }
        break;
      }
      case 'switch': for (const [k, v] of Object.entries((b.switchable_blocks as Record<string, unknown>) ?? {})) { out.push(`**${k}:**`); render(v, out); } break;
      default: {
        // include, enhanced_list and unknown types: render any nested block arrays, and list items' blocks.
        if (typeof b.content === 'string') { const t = md(b.content); if (t) out.push(t); }
        for (const v of Object.values(b)) {
          if (Array.isArray(v) && v.some((x) => x && typeof x === 'object')) {
            if (b.type === 'enhanced_list') for (const it of v as unknown[]) { const c: string[] = []; render(Array.isArray(it) ? it : (it as Block)?.blocks ?? [it], c); if (c.length) out.push('- ' + c.join(' ').replace(/\n+/g, ' ')); }
            else render(v, out);
          }
        }
      }
    }
  }
}

const items = JSON.parse(readFileSync(o.in!, 'utf8')) as Item[];
const mdDir = join(o.out!, 'md');
mkdirSync(mdDir, { recursive: true });
const pagesFile = join(o.out!, 'pages.json');
const pages = JSON.parse(readFileSync(pagesFile, 'utf8')) as Record<string, unknown>[];
const have = new Set(pages.map((p) => p['slug']));
let added = 0, redirects = 0, failed = 0;
for (const it of items) {
  if (it.doc?.redirect_url) { redirects++; continue; }
  if (!it.doc?.blocks) { failed++; console.log(`no content: ${it.slug} (${it.status})`); continue; }
  const url = `https://dev.epicgames.com/documentation/en-us/unreal-engine/${it.slug}?application_version=${o.version}`;
  const body: string[] = [];
  render(it.doc.blocks, body);
  const md = body.join('\n\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
  const title = it.doc.title ?? it.title ?? it.slug;
  writeFileSync(join(mdDir, `${it.slug}.md`), `# ${title}\n\n${url}\n\n> ${it.doc.description ?? ''}\n\n${md}`);
  const path = (it.toc_parent_path ?? '').split('>').filter(Boolean);
  if (!have.has(it.slug)) {
    pages.push({ slug: it.slug, url, title, summary: it.doc.description ?? '', section: path[1] ?? path[0] ?? '(toc)', parent: path.at(-1) ?? '', words: md.split(/\s+/).length, links: [], source: 'api' });
    have.add(it.slug); added++;
  }
}
pages.sort((a, b) => String(a['slug']).localeCompare(String(b['slug'])));
writeFileSync(pagesFile, JSON.stringify(pages, null, 1));
console.log(`FROM_API DONE: ${added} pages added, ${redirects} redirects skipped, ${failed} without content; ${pages.length} pages total`);
