#!/usr/bin/env node
// The tripo CLI with the kit's .env loaded (TRIPO_API_KEY, TRIPO_REGION): the bare `tripo` in a session shell has no
// key ("no API key configured", exit 3) and the key must never appear on a command line. Arguments pass through
// unchanged; output and exit code are tripo's own.
//   node gen\tripo.ts balance --json
//   node gen\tripo.ts history --limit 5
//   node gen\tripo.ts task watch <id> --download -o C:\dev\<Project>\Generated\assets\<name>\tripo
// Paid commands (make, generate, model, anim) cost credits like any other route: quote them first (CLAUDE.md).
// Arguments with cmd.exe metacharacters are refused on Windows (the CLI is a .cmd shim): pass prompts through the
// kit scripts, not here.
import { spawn } from 'node:child_process';
import './paths.ts';   // loads the kit .env

const CMD_UNSAFE = /[%"^&|<>\r\n]/;
const args = process.argv.slice(2);
if (!args.length) {
  console.log('usage: node gen/tripo.ts <tripo arguments>   (e.g. balance --json, history --limit 5)');
  process.exit(2);
}
let p;
if (process.platform === 'win32') {
  const bad = args.find((a) => CMD_UNSAFE.test(a));
  if (bad !== undefined) {
    console.error(`FAIL: refusing an argument with a cmd.exe metacharacter: ${bad.slice(0, 80)}`);
    process.exit(2);
  }
  p = spawn(['tripo', ...args.map((a) => (/[\s()]/.test(a) ? `"${a}"` : a))].join(' '), { shell: true, env: process.env, stdio: 'inherit' });
} else {
  p = spawn('tripo', args, { env: process.env, stdio: 'inherit' });
}
p.on('error', (e) => { console.error(`FAIL: ${e.message}`); process.exit(1); });
p.on('close', (code) => process.exit(code ?? 1));
