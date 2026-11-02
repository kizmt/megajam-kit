#!/usr/bin/env node
// Capture the current level viewport to a PNG:  node gen/unreal/shot.ts [file.png] [--wait 20] [--converge]
// Default file: <Project>/Generated/shots/shot-<timestamp>.png; a relative file name also goes in that folder (never
// the kit, which is the usual working directory). --wait N seconds first (shader compiles).
// --converge sets the Lumen surface cache update factors to 8 first (editor session only, not saved): under High
// scalability a background editor otherwise shows black shade for minutes (docs/ue/debugging.md F). Combine it
// with --wait so the cache has time to settle.
import { mkdirSync } from 'node:fs';
import { isAbsolute, join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { parseArgs } from 'node:util';
import { errorMessage, generatedDir } from '../paths.ts';
import { captureViewport, mcpCall } from './mcp.ts';

const { values: o, positionals } = parseArgs({
  allowPositionals: true,
  options: { wait: { type: 'string', default: '0' }, converge: { type: 'boolean', default: false } },
});

const MT = 'megajam_tools.toolsets.MegajamTools';
const CONVERGE = ['r.LumenScene.DirectLighting.UpdateFactor 8', 'r.LumenScene.Radiosity.UpdateFactor 8'];

let file = positionals[0];
if (!file || !isAbsolute(file)) {
  const dir = generatedDir('shots');
  mkdirSync(dir, { recursive: true });
  file = join(dir, file ?? `shot-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.png`);
}
const wait = Number(o.wait) || 0;
try {
  if (o.converge) for (const command of CONVERGE) await mcpCall(MT, 'run_console_command', { command });
  if (wait > 0) await sleep(wait * 1000);
  console.log(await captureViewport(file));
} catch (e) {
  console.error(`FAIL: ${errorMessage(e)}`);
  process.exit(1);
}
