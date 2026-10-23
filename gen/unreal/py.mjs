#!/usr/bin/env node
// Run a Python file (or inline code) inside the open Unreal editor via MegajamTools.run_python.
//
//   node gen/unreal/py.mjs path/to/script.py [--arg key=value ...]
//   node gen/unreal/py.mjs -c "import unreal; print(unreal.SystemLibrary.get_engine_version())"
//
// --arg values are exposed to the script as the dict ARGS (strings). Prints the script's output;
// exits 1 when the script raised (the traceback is printed).

import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { mcpCall } from './mcp.mjs';

const { values: o, positionals } = parseArgs({
  allowPositionals: true,
  options: { c: { type: 'string' }, arg: { type: 'string', multiple: true, default: [] } },
});
if (!o.c && !positionals[0]) {
  console.log('usage: node gen/unreal/py.mjs script.py [--arg k=v ...] | -c "<code>"');
  process.exit(2);
}

const args = Object.fromEntries(o.arg.map((a) => { const i = a.indexOf('='); return [a.slice(0, i), a.slice(i + 1)]; }));
const body = o.c ?? readFileSync(positionals[0], 'utf8');
const code = `ARGS = ${JSON.stringify(args)}\n${body}`;

const r = await mcpCall('megajam_tools.toolsets.MegajamTools', 'run_python', { code });
const out = String(r.returnValue ?? '');
const [status, ...rest] = out.split('\n');
console.log(rest.join('\n'));
process.exit(status === 'OK' ? 0 : 1);
