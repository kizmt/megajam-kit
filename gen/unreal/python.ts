// Run Python inside the open Unreal editor (MegajamTools.run_python). Scripts receive `ARGS: dict[str, str]`.
import { readFileSync } from 'node:fs';
import { callTool } from './mcp.ts';

export interface PythonResult { ok: boolean; output: string }

export async function runPythonCode(code: string, args: Record<string, string> = {}): Promise<PythonResult> {
  // run_python returns "OK\n<output>" or "ERROR\n<output + traceback>".
  const out = String(await callTool<string>('megajam_tools.toolsets.MegajamTools', 'run_python', { code: `ARGS = ${JSON.stringify(args)}\n${code}` }));
  const [status, ...rest] = out.split('\n');
  return { ok: status === 'OK', output: rest.join('\n') };
}

export async function runPythonFile(file: string, args: Record<string, string> = {}): Promise<PythonResult> {
  return runPythonCode(readFileSync(file, 'utf8'), args);
}

/** Run a script and throw (with its output) if it raised. */
export async function runPythonFileOrThrow(file: string, args: Record<string, string> = {}): Promise<string> {
  const r = await runPythonFile(file, args);
  if (!r.ok) throw new Error(`${file} raised:\n${r.output.slice(-1500)}`);
  return r.output;
}
