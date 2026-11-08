#!/usr/bin/env node
// Every paid service's balance and key status in one call, no key printed. Run at setup, before a paid batch and at
// each round close (PROGRESS keeps the spend).
//   node gen\balances.ts            (one line per service)
//   node gen\balances.ts --json     (BALANCES_JSON={...})
// Tripo: credits and frozen holds. ElevenLabs: credits left this cycle and the reset time. Uthana: pay-as-you-go USD.
// Gemini and OpenAI have no balance API for these keys: checked with a free model lookup (key valid, model
// available); spend there is counted from prices (PIPELINE.md), and the remaining prepay is read in their consoles.
// A shared account's balance can move without this project's calls: count a run's spend from its own calls (the
// manifests and audio logs), and treat balances as a floor.
import { parseArgs } from 'node:util';
import { env, errorMessage, isMain } from './paths.ts';
import { run } from './proc.ts';

type Row = Record<string, unknown> & { service: string; ok: boolean };

async function get(url: string, init?: RequestInit): Promise<{ status: number; body: any }> {
  const r = await fetch(url, { ...init, signal: AbortSignal.timeout(20000) });
  const t = await r.text();
  try { return { status: r.status, body: JSON.parse(t) }; } catch { return { status: r.status, body: t.slice(0, 200) }; }
}

async function tripo(): Promise<Row> {
  if (!env('TRIPO_API_KEY')) return { service: 'tripo', ok: false, note: 'no TRIPO_API_KEY in .env' };
  try {
    const out = await run('tripo', ['balance', '--json'], 'tripo balance');
    const line = out.trim().split(/\r?\n/).reverse().find((l) => l.trimStart().startsWith('{')) ?? '{}';
    const j = JSON.parse(line) as { balance?: number; frozen?: number };
    return { service: 'tripo', ok: typeof j.balance === 'number', credits: j.balance, frozen: j.frozen ?? 0 };
  } catch (e) { return { service: 'tripo', ok: false, note: errorMessage(e).split('\n')[0] }; }
}

async function elevenlabs(): Promise<Row> {
  const key = env('ELEVENLABS_API_KEY');
  if (!key) return { service: 'elevenlabs', ok: false, note: 'no ELEVENLABS_API_KEY in .env' };
  const r = await get('https://api.elevenlabs.io/v1/user/subscription', { headers: { 'xi-api-key': key } });
  if (r.status !== 200) return { service: 'elevenlabs', ok: false, note: `HTTP ${r.status} (the key may lack the user_read permission)` };
  const b = r.body;
  return { service: 'elevenlabs', ok: true, tier: b.tier, credits_left: b.character_limit - b.character_count,
    used: b.character_count, limit: b.character_limit,
    resets: b.next_character_count_reset_unix ? new Date(b.next_character_count_reset_unix * 1000).toISOString() : null };
}

async function uthana(): Promise<Row> {
  const key = env('UTHANA_API_KEY');
  if (!key) return { service: 'uthana', ok: false, note: 'no UTHANA_API_KEY in .env' };
  const r = await get('https://uthana.com/graphql', {
    method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Basic ' + Buffer.from(`${key}:`).toString('base64') },
    body: JSON.stringify({ query: '{ org { payg_total_usd } }' }),
  });
  const usd = r.body?.data?.org?.payg_total_usd;
  return usd !== undefined ? { service: 'uthana', ok: true, usd: Number(usd) } : { service: 'uthana', ok: false, note: `HTTP ${r.status}` };
}

async function gemini(): Promise<Row> {
  const key = env('GEMINI_API_KEY');
  if (!key) return { service: 'gemini', ok: false, note: 'no GEMINI_API_KEY in .env' };
  const r = await get('https://generativelanguage.googleapis.com/v1beta/models?pageSize=1', { headers: { 'x-goog-api-key': key } });
  return { service: 'gemini', ok: r.status === 200, key: r.status === 200 ? 'valid' : `HTTP ${r.status}`,
    note: 'no balance API: prepay in AI Studio; an empty prepay shows as HTTP 402 on the first image' };
}

async function openai(): Promise<Row> {
  const key = env('OPENAI_API_KEY');
  if (!key) return { service: 'openai', ok: false, note: 'no OPENAI_API_KEY in .env' };
  const r = await get('https://api.openai.com/v1/models/gpt-image-2', { headers: { authorization: `Bearer ${key}` } });
  return { service: 'openai', ok: r.status === 200, key: r.status === 200 ? 'valid, gpt-image-2 available' : `HTTP ${r.status}`,
    note: 'no balance API for project keys: see the OpenAI dashboard' };
}

export async function balances(): Promise<Row[]> {
  const jobs = [tripo, elevenlabs, uthana, gemini, openai].map(async (f) => {
    try { return await f(); } catch (e) { return { service: f.name, ok: false, note: errorMessage(e).split('\n')[0] }; }
  });
  return Promise.all(jobs);
}

if (isMain(import.meta.url)) {
  const { values: o } = parseArgs({ options: { json: { type: 'boolean', default: false } } });
  const rows = await balances();
  if (o.json) {
    console.log(`BALANCES_JSON=${JSON.stringify({ at: new Date().toISOString(), rows })}`);
  } else {
    for (const r of rows) {
      const { service, ok, ...rest } = r;
      console.log(`${ok ? 'OK  ' : 'FAIL'} ${service.padEnd(10)} ${Object.entries(rest).map(([k, v]) => `${k}=${v}`).join('  ')}`);
    }
  }
}
