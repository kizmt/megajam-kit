#!/usr/bin/env node
// Minimal client for the Unreal MCP server, so pipeline scripts can drive the open editor.
// The editor must be running with the MCP server on (default http://127.0.0.1:8000/mcp).
//
//   node gen/unreal/mcp.mjs toolsets
//   node gen/unreal/mcp.mjs describe editor_toolset.toolsets.asset.AssetTools
//   node gen/unreal/mcp.mjs call <toolset> <tool> '{"arg":"value"}'
//
// Import from another script:  import { mcpCall } from './mcp.mjs';

import { pathToFileURL } from 'node:url';

const URL_ = process.env.UNREAL_MCP_URL ?? 'http://127.0.0.1:8000/mcp';
let session = null;
let nextId = 1;

async function rpc(method, params, notify = false) {
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' };
  if (session) headers['Mcp-Session-Id'] = session;
  const body = notify ? { jsonrpc: '2.0', method, params } : { jsonrpc: '2.0', id: nextId++, method, params };
  let res;
  try {
    res = await fetch(URL_, { method: 'POST', headers, body: JSON.stringify(body) });
  } catch {
    throw new Error(`cannot reach Unreal MCP at ${URL_}. Is the editor open with the MCP server running?`);
  }
  session = res.headers.get('mcp-session-id') ?? session;
  if (notify) return null;
  let text = await res.text();
  if ((res.headers.get('content-type') ?? '').includes('text/event-stream')) {
    const data = text.split('\n').filter((l) => l.startsWith('data:')).map((l) => l.slice(5).trim()).filter(Boolean);
    text = data[data.length - 1] ?? '{}';
  }
  const msg = JSON.parse(text);
  if (msg.error) throw new Error(`MCP ${method}: ${msg.error.message ?? JSON.stringify(msg.error)}`);
  return msg.result;
}

async function ensureSession() {
  if (session) return;
  await rpc('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'megajam-kit', version: '1' } });
  await rpc('notifications/initialized', undefined, true);
}

function contentText(result) {
  return (result?.content ?? []).filter((c) => c.type === 'text').map((c) => c.text).join('\n');
}

export async function listToolsets() {
  await ensureSession();
  return contentText(await rpc('tools/call', { name: 'list_toolsets', arguments: {} }));
}

export async function describeToolset(toolset) {
  await ensureSession();
  return contentText(await rpc('tools/call', { name: 'describe_toolset', arguments: { toolset_name: toolset } }));
}

// Call one tool. Returns parsed JSON when the tool returns JSON text, otherwise the raw text.
export async function mcpCall(toolset, tool, args = {}) {
  const result = await mcpCallRaw(toolset, tool, args);
  const text = contentText(result);
  try { return JSON.parse(text); } catch { return text; }
}

// Call one tool and return the raw MCP result ({content:[{type:'text'|'image', ...}]}).
export async function mcpCallRaw(toolset, tool, args = {}) {
  await ensureSession();
  const result = await rpc('tools/call', { name: 'call_tool', arguments: { toolset_name: toolset, tool_name: tool, arguments: args } });
  if (result?.isError) throw new Error(`${toolset}.${tool}: ${contentText(result)}`);
  return result;
}

// Capture the level viewport to a PNG/JPEG file. Returns the written path.
export async function captureViewport(outFile, args = {}) {
  const { writeFileSync, mkdirSync } = await import('node:fs');
  const { dirname } = await import('node:path');
  // The tool requires captureTransform; default to the viewport's current camera.
  if (!args.captureTransform) {
    const cam = await mcpCall('EditorToolset.EditorAppToolset', 'GetCameraTransform', {});
    args = { ...args, captureTransform: cam.returnValue ?? cam };
  }
  // annotations is also required; grid 0 + label distance 0 = a clean image with no overlay.
  args = {
    annotations: { gridSpacing: 0, gridExtent: 0, gridHeight: 0, maxLabelDistance: 0, classFilter: null, maxLabels: 0 },
    bShowUI: false,
    ...args,
  };
  const result = await mcpCallRaw('EditorToolset.EditorAppToolset', 'CaptureViewport', args);
  // Image arrives either as an MCP image block or inside JSON text: {"returnValue":{"image":{"mimeType","data"}}}.
  let img = (result?.content ?? []).find((c) => c.type === 'image');
  if (!img) {
    try { img = JSON.parse(contentText(result))?.returnValue?.image; } catch { /* not JSON */ }
  }
  if (!img?.data) throw new Error(`CaptureViewport returned no image: ${contentText(result).slice(0, 300)}`);
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, Buffer.from(img.data, 'base64'));
  return outFile;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [cmd, a, b, c] = process.argv.slice(2);
  try {
    if (cmd === 'toolsets') console.log(await listToolsets());
    else if (cmd === 'describe') console.log(await describeToolset(a));
    else if (cmd === 'call') {
      const out = await mcpCall(a, b, c ? JSON.parse(c) : {});
      console.log(typeof out === 'string' ? out : JSON.stringify(out, null, 2));
    } else {
      console.log('usage: mcp.mjs toolsets | describe <toolset> | call <toolset> <tool> [jsonArgs]');
      process.exit(2);
    }
  } catch (e) {
    console.error(`FAIL: ${e.message}`);
    process.exit(1);
  }
}
