#!/usr/bin/env node
// Capture the current level viewport to a PNG:  node gen/unreal/shot.mjs out/shot.png [--wait 20]
// --wait N seconds first (shader compiles after imports/material changes; see PIPELINE.md).
import { parseArgs } from 'node:util';
import { resolve } from 'node:path';
import { captureViewport } from './mcp.mjs';

const { values: o, positionals } = parseArgs({ allowPositionals: true, options: { wait: { type: 'string', default: '0' } } });
const file = resolve(positionals[0] ?? 'out/shot.png');
const wait = Number(o.wait) || 0;
if (wait > 0) await new Promise((r) => setTimeout(r, wait * 1000));
await captureViewport(file);
console.log(file);
