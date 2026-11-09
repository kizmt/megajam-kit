// HTML to plain Markdown for documentation pages: headings, paragraphs, lists, tables, code, image alt text, and
// links to other docs pages as "text (-> slug)". Shared by extract.ts (crawled pages) and from_api.ts (page data).
const ENT: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'", hellip: '...', ndash: '-', mdash: '-', rsquo: "'", lsquo: "'", rdquo: '"', ldquo: '"', copy: '(c)', reg: '(R)', trade: '(TM)', times: 'x', rarr: '->', larr: '<-' };
export function decode(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+\d*);/gi, (m, e: string) => {
    if (e[0] === '#') { const n = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10); return Number.isFinite(n) ? String.fromCodePoint(n) : m; }
    return ENT[e.toLowerCase()] ?? m;
  });
}

export function inline(s: string): string {
  return decode(s
    .replace(/<img[^>]*alt="([^"]*)"[^>]*>/gi, (_m, a: string) => (a ? ` [image: ${a}] ` : ''))
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, '**$2**')
    .replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, '`$1`')
    .replace(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_m, h: string, t: string) => {
      const text = t.replace(/<[^>]+>/g, '').trim();
      const slug = h.match(/\/unreal-engine\/([A-Za-z0-9._-]+)/)?.[1];
      return slug ? `${text} (-> ${slug})` : text;
    })
    .replace(/<[^>]+>/g, ''))
    .replace(/[ \t]+/g, ' ');
}

export function toMarkdown(body: string): string {
  let s = body
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|svg|button|nav)\b[\s\S]*?<\/\1>/gi, '');
  // Code blocks first, kept verbatim.
  const blocks: string[] = [];
  s = s.replace(/<pre\b[^>]*>([\s\S]*?)<\/pre>/gi, (_m, c: string) => {
    blocks.push('```\n' + decode(c.replace(/<[^>]+>/g, '')).replace(/\n+$/, '') + '\n```');
    return `\n\n@@BLOCK${blocks.length - 1}@@\n\n`;
  });
  // Tables as pipe rows.
  s = s.replace(/<table\b[^>]*>([\s\S]*?)<\/table>/gi, (_m, t: string) => {
    const rows = [...t.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map((r) =>
      [...(r[1] ?? '').matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)].map((c) => inline(c[1] ?? '').replace(/\s*\n\s*/g, ' ').replace(/\|/g, '/').trim()));
    const head = rows[0];
    if (!head) return '';
    const w = Math.max(...rows.map((r) => r.length));
    const line = (r: string[]) => '| ' + Array.from({ length: w }, (_, i) => r[i] ?? '').join(' | ') + ' |';
    const md = [line(head),'|' + ' --- |'.repeat(w), ...rows.slice(1).map(line)].join('\n');
    blocks.push(md);
    return `\n\n@@BLOCK${blocks.length - 1}@@\n\n`;
  });
  s = s
    .replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_m, n: string, t: string) => `\n\n${'#'.repeat(Number(n))} ${inline(t).trim()}\n\n`)
    .replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_m, t: string) => `\n- ${inline(t).replace(/\s*\n\s*/g, ' ').trim()}`)
    .replace(/<\/(p|div|ul|ol|section|header|figure|blockquote)>/gi, '\n\n')
    .replace(/<p\b[^>]*>/gi, '\n\n');
  s = inline(s);
  s = s.replace(/@@BLOCK(\d+)@@/g, (_m, i: string) => blocks[Number(i)] ?? '');
  return s.split('\n').map((l) => l.trimEnd()).join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}
