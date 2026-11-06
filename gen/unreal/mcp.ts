#!/usr/bin/env node
// Minimal client for the Unreal MCP server, so pipeline scripts can drive the open editor.
// The editor must be running with the MCP server on (default http://127.0.0.1:8000/mcp).
//
//   node gen/unreal/mcp.ts toolsets
//   node gen/unreal/mcp.ts describe editor_toolset.toolsets.asset.AssetTools
//   node gen/unreal/mcp.ts call <toolset> <tool> '{"arg":"value"}'
//
// Import from another script:  import { callTool } from './unreal/mcp.ts';
//
// Typing: tool results arrive as JSON text {"returnValue": ...}. `callTool<T>` returns returnValue typed as T.
// That is an unchecked boundary: T must match what the tool actually returns (check with `describe`, then
// with a real call). The shared shapes below were verified against UE 5.8.4 on 2026-10-24.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { env, errorMessage, isMain, jsonArg } from '../paths.ts';

// ---------- verified Unreal value shapes ----------

/** UObject / UClass reference as the toolsets pass it. */
export interface ObjectRef { refPath: string }
export interface Vec3 { x: number; y: number; z: number }
export interface Rotator { pitch: number; yaw: number; roll: number }
export interface CameraTransform { location: Vec3; rotation: Rotator }
/** ActorTools.get_actor_bounds */
export interface Box { min: Vec3; max: Vec3; isValid: boolean }

export type ToolArgs = Record<string, unknown>;

// ---------- MCP protocol ----------

type McpContent =
  | { type: 'text'; text: string }
  | { type: 'image'; data: string; mimeType: string }
  | { type: string };

interface McpToolResult { content?: McpContent[]; isError?: boolean }
interface JsonRpcResponse { result?: unknown; error?: { message?: string } }

const MCP_URL = env('UNREAL_MCP_URL') ?? 'http://127.0.0.1:8000/mcp';
// Node's fetch gives up waiting for response headers after 300 s anyway, so stay just under it and report it clearly.
// A single tool call that needs longer must be split (e.g. retarget_library.ts --limit batches).
const CALL_TIMEOUT_MS = Math.min(Number(env('UNREAL_MCP_TIMEOUT_S')) || 290, 290) * 1000;
let session: string | null = null;
let nextId = 1;

export class McpUnreachableError extends Error {}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

async function rpc(method: string, params: unknown, notify = false): Promise<unknown> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' };
  if (session) headers['Mcp-Session-Id'] = session;
  const body = notify ? { jsonrpc: '2.0', method, params } : { jsonrpc: '2.0', id: nextId++, method, params };
  let res: Response;
  try {
    res = await fetch(MCP_URL, { method: 'POST', headers, body: JSON.stringify(body), signal: AbortSignal.timeout(CALL_TIMEOUT_MS) });
  } catch (e) {
    // Only a refused connection means "no editor". A timeout or a dropped connection means the editor is there but
    // busy or blocked (e.g. a modal dialog): that is a failure, never "editor not running, try later".
    const code = isRecord(e) && isRecord(e['cause']) ? e['cause']['code'] : undefined;
    if (code === 'ECONNREFUSED') {
      throw new McpUnreachableError(`cannot reach Unreal MCP at ${MCP_URL}. Is the editor open with the MCP server running?`);
    }
    const timedOut = isRecord(e) && e['name'] === 'TimeoutError';
    throw new Error(`Unreal MCP ${method}: ${timedOut ? `no answer in ${CALL_TIMEOUT_MS / 1000} s` : errorMessage(e)}. ` +
      'The editor may be busy or blocked by a dialog: look at it before retrying.');
  }
  session = res.headers.get('mcp-session-id') ?? session;
  if (notify) return null;
  let text = await res.text();
  if ((res.headers.get('content-type') ?? '').includes('text/event-stream')) {
    const data = text.split('\n').filter((l) => l.startsWith('data:')).map((l) => l.slice(5).trim()).filter(Boolean);
    text = data.at(-1) ?? '{}';
  }
  let msg: JsonRpcResponse;
  try {
    msg = JSON.parse(text) as JsonRpcResponse;
  } catch {
    // e.g. a 404 "session not found" after an editor restart, or a proxy page: report the status, not a parse error.
    throw new Error(`Unreal MCP ${method}: HTTP ${res.status}, not a JSON-RPC answer: ${text.slice(0, 300)}`);
  }
  if (msg.error) throw new Error(`MCP ${method}: ${msg.error.message ?? JSON.stringify(msg.error)}`);
  return msg.result;
}

async function ensureSession(): Promise<void> {
  if (session) return;
  await rpc('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'megajam-kit', version: '1' } });
  await rpc('notifications/initialized', undefined, true);
}

function asToolResult(v: unknown): McpToolResult {
  return isRecord(v) ? (v as McpToolResult) : {};
}

function contentText(result: McpToolResult): string {
  return (result.content ?? [])
    .flatMap((c) => (c.type === 'text' && 'text' in c ? [c.text] : []))
    .join('\n');
}

async function metaCall(name: string, args: ToolArgs): Promise<McpToolResult> {
  await ensureSession();
  return asToolResult(await rpc('tools/call', { name, arguments: args }));
}

export async function listToolsets(): Promise<string> {
  return contentText(await metaCall('list_toolsets', {}));
}

export async function describeToolset(toolset: string): Promise<string> {
  return contentText(await metaCall('describe_toolset', { toolset_name: toolset }));
}

/** Call one tool and return the raw MCP result. Throws on tool errors. */
export async function mcpCallRaw(toolset: string, tool: string, args: ToolArgs = {}): Promise<McpToolResult> {
  const result = await metaCall('call_tool', { toolset_name: toolset, tool_name: tool, arguments: args });
  if (result.isError) throw new Error(`${toolset}.${tool}: ${contentText(result)}`);
  return result;
}

/** Call one tool. Returns parsed JSON when the tool returns JSON text, otherwise the raw text. */
export async function mcpCall(toolset: string, tool: string, args: ToolArgs = {}): Promise<unknown> {
  const text = contentText(await mcpCallRaw(toolset, tool, args));
  try { return JSON.parse(text) as unknown; } catch { return text; }
}

/** Call one tool and return its `returnValue`, typed by the caller (see the typing note at the top). */
export async function callTool<T>(toolset: string, tool: string, args: ToolArgs = {}): Promise<T> {
  const parsed = await mcpCall(toolset, tool, args);
  if (isRecord(parsed) && 'returnValue' in parsed) return parsed['returnValue'] as T;
  return parsed as T;
}

export interface CaptureArgs extends ToolArgs { captureTransform?: CameraTransform }

/** Capture the level viewport to an image file. Returns the written path. */
export async function captureViewport(outFile: string, args: CaptureArgs = {}): Promise<string> {
  // The tool requires captureTransform; default to the viewport's current camera.
  const captureTransform = args.captureTransform ?? await callTool<CameraTransform>('EditorToolset.EditorAppToolset', 'GetCameraTransform');
  // annotations is also required; grid 0 + label distance 0 = a clean image with no overlay.
  const full: ToolArgs = {
    annotations: { gridSpacing: 0, gridExtent: 0, gridHeight: 0, maxLabelDistance: 0, classFilter: null, maxLabels: 0 },
    bShowUI: false,
    ...args,
    captureTransform,
  };
  const result = await mcpCallRaw('EditorToolset.EditorAppToolset', 'CaptureViewport', full);
  // Image arrives either as an MCP image block or inside JSON text: {"returnValue":{"image":{"mimeType","data"}}}.
  let data: string | undefined;
  for (const c of result.content ?? []) if (c.type === 'image' && 'data' in c) data = c.data;
  if (!data) {
    try {
      const parsed: unknown = JSON.parse(contentText(result));
      const rv = isRecord(parsed) ? parsed['returnValue'] : undefined;
      const image = isRecord(rv) ? rv['image'] : undefined;
      if (isRecord(image) && typeof image['data'] === 'string') data = image['data'];
    } catch { /* not JSON */ }
  }
  if (!data) throw new Error(`CaptureViewport returned no image: ${contentText(result).slice(0, 300)}`);
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, Buffer.from(data, 'base64'));
  return outFile;
}

if (isMain(import.meta.url)) {
  const [cmd, a, b, c] = process.argv.slice(2);
  try {
    if (cmd === 'toolsets') console.log(await listToolsets());
    else if (cmd === 'describe' && a) console.log(await describeToolset(a));
    else if (cmd === 'call' && a && b) {
      const out = await mcpCall(a, b, c ? jsonArg<ToolArgs>(c) : {});
      console.log(typeof out === 'string' ? out : JSON.stringify(out, null, 2));
    } else {
      console.log('usage: mcp.ts toolsets | describe <toolset> | call <toolset> <tool> [jsonArgs | \'@args.json\' (quoted in PowerShell)]');
      process.exit(2);
    }
  } catch (e) {
    console.error(`FAIL: ${errorMessage(e)}`);
    process.exit(1);
  }
}
