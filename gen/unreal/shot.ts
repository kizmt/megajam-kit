#!/usr/bin/env node
// Capture the current level viewport to a PNG:  node gen/unreal/shot.ts [file.png] [--wait 20]
// Default file: <Project>/Generated/shots/shot-<timestamp>.png. --wait N seconds first (shader compiles).
import { mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { parseArgs } from 'node:util';
import { errorMessage, generatedDir } from '../paths.ts';
import { captureViewport } from './mcp.ts';

const { values: o, positionals } = parseArgs({ allowPositionals: true, options: { wait: { type: 'string', default: '0' } } });

let file = positionals[0];
if (!file) {
  const dir = generatedDir('shots');
  mkdirSync(dir, { recursive: true });
  file = join(dir, `shot-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.png`);
}
const wait = Number(o.wait) || 0;
try {
  if (wait > 0) await sleep(wait * 1000);
  console.log(await captureViewport(resolve(file)));
} catch (e) {
  console.error(`FAIL: ${errorMessage(e)}`);
  process.exit(1);
}
