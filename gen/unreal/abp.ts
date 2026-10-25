#!/usr/bin/env node
// Remove the foot-IK Control Rig node from a retargeted copy of Epic's ABP_Unarmed (it twists the feet on
// non-Manny skeletons): delete the Control Rig node and the NOT / Is Falling nodes feeding it, wire
// Slot 'DefaultSlot' -> Output Pose, compile and save (forced). Uses the editor's BlueprintTools over MCP (AnimGraphs can't be
// read with read_graph_dsl, but find_nodes / delete_node / connect_pins work on them).
//   node gen/unreal/abp.ts strip-footik /Game/Characters/<Name>/Anims/ABP_Unarmed_<Name>
// Idempotent: does nothing if the Control Rig node is already gone. character.ts runs it as step 6b.
import { errorMessage, fail, isMain } from '../paths.ts';
import { mcpCall } from './mcp.ts';
import { runPythonCode } from './python.ts';

const BP = 'editor_toolset.toolsets.blueprint.BlueprintTools';

export interface StripResult { abp: string; changed: boolean; deleted: string[]; compiled: unknown }

const nodeRef = (graph: string, node: string): { refPath: string } => ({ refPath: `${graph}.${node}` });

/** Node names in the graph whose name matches `prefix` followed by _<n>. */
function namesFrom(found: unknown, prefix: string): string[] {
  const text = typeof found === 'string' ? found : JSON.stringify(found);
  return [...new Set(text.match(new RegExp(`\\b${prefix}_\\d+\\b`, 'g')) ?? [])];
}

export async function stripFootIk(abpPath: string): Promise<StripResult> {
  const obj = `${abpPath}.${abpPath.split('/').pop() ?? ''}`;
  const graph = `${obj}:AnimGraph`;
  const found = await mcpCall(BP, 'find_nodes', { graph: { refPath: graph }, title: '', node_class: null, entry_points_only: false });
  const controlRig = namesFrom(found, 'AnimGraphNode_ControlRig');
  if (controlRig.length === 0) return { abp: abpPath, changed: false, deleted: [], compiled: null };
  if (controlRig.length > 1) throw new Error(`expected one Control Rig node in ${abpPath}, found ${controlRig.join(', ')}`);
  const slot = namesFrom(found, 'AnimGraphNode_Slot');
  const root = namesFrom(found, 'AnimGraphNode_Root');
  if (slot.length !== 1 || root.length !== 1) throw new Error(`expected one Slot and one Output Pose node in ${abpPath} (found ${slot.length} / ${root.length})`);
  // In the retargeted ABP_Unarmed AnimGraph, the only K2 nodes are the NOT and Is Falling inputs of the Control Rig node.
  const inputs = [...namesFrom(found, 'K2Node_CallFunction'), ...namesFrom(found, 'K2Node_VariableGet')];
  const deleted: string[] = [];
  for (const n of [...controlRig, ...inputs]) {
    await mcpCall(BP, 'delete_node', { node: nodeRef(graph, n) });
    deleted.push(n);
  }
  await mcpCall(BP, 'connect_pins', {
    output_pin: { direction: 'EGPD_Output', index_id: 0, node: nodeRef(graph, slot[0] ?? '') },
    input_pin: { direction: 'EGPD_Input', index_id: 0, node: nodeRef(graph, root[0] ?? '') },
  });
  const compiled = await mcpCall(BP, 'compile_blueprint', { blueprint: { refPath: obj }, warnings_as_errors: false });
  // Force the save: scripted edits don't always mark an asset dirty, and a skipped save loses the change.
  const saved = await runPythonCode(`import unreal\nprint('SAVED', unreal.EditorAssetLibrary.save_asset('${abpPath}', only_if_is_dirty=False))`);
  if (!saved.ok || !saved.output.includes('SAVED True')) throw new Error(`save failed for ${abpPath}: ${saved.output.trim()}`);
  return { abp: abpPath, changed: true, deleted, compiled };
}

if (isMain(import.meta.url)) {
  const [cmd, abp] = process.argv.slice(2);
  if (cmd !== 'strip-footik' || !abp) fail('usage: node gen/unreal/abp.ts strip-footik /Game/.../ABP_Unarmed_<Name>');
  try {
    const r = await stripFootIk(abp);
    console.log(r.changed ? `ABP_STRIP done: deleted ${r.deleted.join(', ')}; compile: ${JSON.stringify(r.compiled)}` : `ABP_STRIP nothing to do: no Control Rig node in ${abp}`);
  } catch (e) {
    fail(errorMessage(e));
  }
}
