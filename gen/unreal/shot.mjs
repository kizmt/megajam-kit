#!/usr/bin/env node
// Capture the current level viewport to a PNG:  node gen/unreal/shot.mjs [file.png] [--wait 20]
// Default file: <Project>/Generated/shots/shot-<timestamp>.png. --wait N seconds first (shader compiles).
import { parseArgs } from 'node:util';
import { join, resolve } from 'node:path';
import { mkdirSync } from 'node:fs';
import { captureViewport } from './mcp.mjs';
import { generatedDir } from '../paths.mjs';

const { values: o, positionals } = parseArgs({ allowPositionals: true, options: { wait: { type: 'string', default: '0' } } });
let file = positionals[0];
if (!file) {
  const dir = generatedDir('shots');
  mkdirSync(dir, { recursive: true });
  file = join(dir, `shot-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.png`);
}
file = resolve(file);
const wait = Number(o.wait) || 0;
if (wait > 0) await new Promise((r) => setTimeout(r, wait * 1000));
await captureViewport(file);
console.log(file);
