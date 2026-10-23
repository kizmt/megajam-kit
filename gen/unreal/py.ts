#!/usr/bin/env node
// Run a Python file (or inline code) inside the open Unreal editor via MegajamTools.run_python.
//
//   node gen/unreal/py.ts path/to/script.py [--arg key=value ...]
//   node gen/unreal/py.ts -c "import unreal; print(unreal.SystemLibrary.get_engine_version())"
//
// --arg values are exposed to the script as the dict ARGS (strings). Prints the script's output;
// exits 1 when the script raised (the traceback is printed).

import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { errorMessage } from '../paths.ts';
import { callTool } from './mcp.ts';

const { values: o, positionals } = parseArgs({
  allowPositionals: true,
  options: { c: { type: 'string' }, arg: { type: 'string', multiple: true, default: [] } },
});
const file = positionals[0];
if (o.c === undefined && file === undefined) {
  console.log('usage: node gen/unreal/py.ts script.py [--arg k=v ...] | -c "<code>"');
  process.exit(2);
}

const args: Record<string, string> = {};
for (const a of o.arg) {
  const i = a.indexOf('=');
  if (i < 1) { console.error(`FAIL: --arg must be key=value, got "${a}"`); process.exit(2); }
  args[a.slice(0, i)] = a.slice(i + 1);
}
const body = o.c ?? readFileSync(file ?? '', 'utf8');
const code = `ARGS = ${JSON.stringify(args)}\n${body}`;

try {
  // run_python returns "OK\n<output>" or "ERROR\n<output + traceback>".
  const out = await callTool<string>('megajam_tools.toolsets.MegajamTools', 'run_python', { code });
  const [status, ...rest] = String(out).split('\n');
  console.log(rest.join('\n'));
  process.exit(status === 'OK' ? 0 : 1);
} catch (e) {
  console.error(`FAIL: ${errorMessage(e)}`);
  process.exit(1);
}
