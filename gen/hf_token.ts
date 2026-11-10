#!/usr/bin/env node
// Copies HUGGINGFACE_ACCESS_TOKEN from the kit's .env into Hugging Face's own token file
// (%USERPROFILE%\.cache\huggingface\token, or $HF_HOME\token), where UE 5.9's Kimodo plugin and other Hugging Face
// tools look for it when their own token setting is empty. Run once per machine, and again after changing the token:
//   node gen\hf_token.ts            (writes the file)
//   node gen\hf_token.ts --check    (says whether the file matches .env; writes nothing)
// Never prints the token: only its length and where it went.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { env, fail, isMain } from './paths.ts';

export function hfTokenFile(): string {
  return join(env('HF_HOME') ?? join(homedir(), '.cache', 'huggingface'), 'token');
}

if (isMain(import.meta.url)) {
  const token = env('HUGGINGFACE_ACCESS_TOKEN')?.trim();
  if (!token) fail("HUGGINGFACE_ACCESS_TOKEN is empty in the kit's .env (SETUP.md 10b)");
  if (!token.startsWith('hf_')) console.log('WARN: the token does not start with hf_; check it is a Hugging Face access token');
  if (env('HF_TOKEN') && env('HF_TOKEN') !== token) {
    console.log('WARN: an HF_TOKEN environment variable is set and differs: Hugging Face tools use it before the token file');
  }
  const file = hfTokenFile();
  const current = existsSync(file) ? readFileSync(file, 'utf8').trim() : undefined;
  if (process.argv.includes('--check')) {
    console.log(current === token ? `OK: ${file} matches .env` : `NOT SET: ${file} ${current === undefined ? 'is missing' : 'differs from .env'}`);
    process.exit(current === token ? 0 : 1);
  }
  mkdirSync(join(file, '..'), { recursive: true });
  writeFileSync(file, token, { mode: 0o600 });
  console.log(`DONE: wrote the token (${token.length} characters) to ${file}. Leave Kimodo's own Hugging Face Token setting empty, or it wins.`);
}
