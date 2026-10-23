// Where generated files go. The kit holds tools only; every generated file belongs to the active project:
//   <MEGAJAM_PROJECT>\Generated\<images|assets|audio|characters|shots>\
// Set MEGAJAM_PROJECT=C:\dev\<ProjectName> in the kit's .env (or the environment). Scripts refuse to run
// without it rather than writing into the kit. --out on any script still overrides.
import { existsSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const KIT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
if (existsSync(join(KIT, '.env'))) process.loadEnvFile(join(KIT, '.env'));

export function projectDir() {
  const p = process.env.MEGAJAM_PROJECT;
  if (!p) fail(`MEGAJAM_PROJECT is not set. Add MEGAJAM_PROJECT=C:\\dev\\<ProjectName> to ${join(KIT, '.env')}`);
  const dir = resolve(p);
  if (!existsSync(dir) || !readdirSync(dir).some((f) => f.endsWith('.uproject')))
    fail(`MEGAJAM_PROJECT=${p} is not an Unreal project folder (no .uproject).`);
  if (dir.toLowerCase().startsWith(KIT.toLowerCase())) fail('MEGAJAM_PROJECT must not be inside the kit.');
  return dir;
}

export function generatedDir(sub) {
  return join(projectDir(), 'Generated', sub);
}

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exit(1);
}
