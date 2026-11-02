#!/usr/bin/env node
// Run a Python file (or inline code) inside the open Unreal editor via MegajamTools.run_python.
//
//   node gen/unreal/py.ts path/to/script.py [--arg key=value ...]
//   node gen/unreal/py.ts -c "import unreal; print(unreal.SystemLibrary.get_engine_version())"
//
// --arg values are exposed to the script as the dict ARGS (strings). Prints the script's output;
// exits 1 when the script raised (the traceback is printed).

import { parseArgs } from 'node:util';
import { errorMessage } from '../paths.ts';
import { runPythonCode, runPythonFile } from './python.ts';

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

// Asset creation, duplication and saves fail during PIE with only a LogUtils error in the Output Log (the script's
// own output says nothing). Warn, don't refuse: read-only probes and PIE capture scripts are fine during PIE.
const PIE_CHECK = 'import unreal\nprint("PIE_RUNNING=" + str(unreal.get_editor_subsystem(unreal.UnrealEditorSubsystem).get_game_world() is not None))';

try {
  const pie = await runPythonCode(PIE_CHECK);
  if (pie.output.includes('PIE_RUNNING=True')) {
    console.error('WARN: PIE is running (the director may be playing): asset edits and saves will fail. Wait or ask; never stop their PIE.');
  }
  const r = o.c !== undefined ? await runPythonCode(o.c, args) : await runPythonFile(file ?? '', args);
  console.log(r.output);
  process.exit(r.ok ? 0 : 1);
} catch (e) {
  console.error(`FAIL: ${errorMessage(e)}`);
  process.exit(1);
}
