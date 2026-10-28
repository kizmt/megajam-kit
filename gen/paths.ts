// Where generated files go. The kit holds tools only; every generated file belongs to the active project:
//   <MEGAJAM_PROJECT>\Generated\<images|assets|audio|characters|shots|vfx>\
// Set MEGAJAM_PROJECT=C:\dev\<ProjectName> in the kit's .env (or the environment). Scripts refuse to run
// without it rather than writing into the kit. --out on any script still overrides.
import { existsSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const KIT: string = resolve(dirname(fileURLToPath(import.meta.url)), '..');
if (existsSync(join(KIT, '.env'))) process.loadEnvFile(join(KIT, '.env'));

export type GeneratedKind = 'images' | 'assets' | 'audio' | 'characters' | 'shots' | 'vfx';

export function fail(msg: string): never {
  console.error(`FAIL: ${msg}`);
  process.exit(1);
}

/** 'heavy wooden chest' -> 'HeavyWoodenChest' (asset names). maxWords keeps names short when built from a prompt. */
export function pascal(s: string, maxWords = Infinity): string {
  return s.replace(/[^a-zA-Z0-9]+/g, ' ').trim().split(' ').slice(0, maxWords)
    .map((w) => (w[0]?.toUpperCase() ?? '') + w.slice(1)).join('');
}

/** Message of anything thrown (catch variables are `unknown`). */
export function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

export function env(name: string): string | undefined {
  const v = process.env[name];
  return v === undefined || v === '' ? undefined : v;
}

export function projectDir(): string {
  const p = env('MEGAJAM_PROJECT');
  if (!p) fail(`MEGAJAM_PROJECT is not set. Add MEGAJAM_PROJECT=C:\\dev\\<ProjectName> to ${join(KIT, '.env')}`);
  const dir = resolve(p);
  if (!existsSync(dir) || !readdirSync(dir).some((f) => f.endsWith('.uproject')))
    fail(`MEGAJAM_PROJECT=${p} is not an Unreal project folder (no .uproject).`);
  if (dir.toLowerCase().startsWith(KIT.toLowerCase())) fail('MEGAJAM_PROJECT must not be inside the kit.');
  return dir;
}

export function generatedDir(kind: GeneratedKind): string {
  return join(projectDir(), 'Generated', kind);
}

/** True when this module is the script Node was started with (CLI entry point). */
export function isMain(importMetaUrl: string): boolean {
  const entry = process.argv[1];
  return entry !== undefined && fileURLToPath(importMetaUrl) === resolve(entry);
}
