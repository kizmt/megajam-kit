#!/usr/bin/env node
// Remove the foot-IK Control Rig node from a retargeted copy of Epic's ABP_Unarmed (it twists the feet on
// non-Manny skeletons): delete the Control Rig node and the NOT / Is Falling nodes feeding it, wire
// Slot 'DefaultSlot' -> Output Pose, compile and save (forced). Uses the editor's BlueprintTools over MCP (AnimGraphs can't be
// read with read_graph_dsl, but find_nodes / delete_node / connect_pins work on them). UE 5.9 replaced Epic's Python
// BlueprintTools with the C++ BlueprintToolsets.BlueprintToolset (same tools, CamelCase names and arguments).
//   node gen/unreal/abp.ts strip-footik /Game/Characters/<Name>/Anims/ABP_Unarmed_<Name>
// Idempotent: does nothing if the Control Rig node is already gone. character.ts runs it as step 6b.
import { errorMessage, fail, isMain } from '../paths.ts';
import { hasNewToolSearch, mcpCall } from './mcp.ts';
import { runPythonCode } from './python.ts';

const BP58 = 'editor_toolset.toolsets.blueprint.BlueprintTools';
const BP59 = 'BlueprintToolsets.BlueprintToolset';

type Ref = { refPath: string };
type Pin = { node: Ref; index: number; dir: 'EGPD_Input' | 'EGPD_Output' };
/** The four BlueprintTools calls this script makes, in each engine's names and argument shapes. */
async function bp(): Promise<{
  findNodes(graph: Ref): Promise<unknown>; deleteNode(node: Ref): Promise<unknown>;
  connect(out: Pin, inp: Pin): Promise<unknown>; compile(blueprint: Ref): Promise<unknown>;
}> {
  if (await hasNewToolSearch()) {
    const pin = (p: Pin) => ({ node: p.node, indexId: p.index, direction: p.dir });
    return {
      findNodes: (graph) => mcpCall(BP59, 'FindNodes', { graph, title: '', bEntryPointsOnly: false }),
      deleteNode: (node) => mcpCall(BP59, 'DeleteNode', { node }),
      connect: (o, i) => mcpCall(BP59, 'ConnectPins', { outputPin: pin(o), inputPin: pin(i) }),
      compile: (blueprint) => mcpCall(BP59, 'CompileBlueprint', { blueprint, bWarningsAsErrors: false }),
    };
  }
  const pin = (p: Pin) => ({ direction: p.dir, index_id: p.index, node: p.node });
  return {
    findNodes: (graph) => mcpCall(BP58, 'find_nodes', { graph, title: '', node_class: null, entry_points_only: false }),
    deleteNode: (node) => mcpCall(BP58, 'delete_node', { node }),
    connect: (o, i) => mcpCall(BP58, 'connect_pins', { output_pin: pin(o), input_pin: pin(i) }),
    compile: (blueprint) => mcpCall(BP58, 'compile_blueprint', { blueprint, warnings_as_errors: false }),
  };
}

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
  const tools = await bp();
  const found = await tools.findNodes({ refPath: graph });
  const controlRig = namesFrom(found, 'AnimGraphNode_ControlRig');
  if (controlRig.length === 0) return { abp: abpPath, changed: false, deleted: [], compiled: null };
  if (controlRig.length > 1) throw new Error(`expected one Control Rig node in ${abpPath}, found ${controlRig.join(', ')}`);
  const slot = namesFrom(found, 'AnimGraphNode_Slot');
  const root = namesFrom(found, 'AnimGraphNode_Root');
  if (slot.length !== 1 || root.length !== 1) throw new Error(`expected one Slot and one Output Pose node in ${abpPath} (found ${slot.length} / ${root.length})`);
  // In the retargeted ABP_Unarmed AnimGraph, the only K2 nodes are the NOT and Is Falling inputs of the Control Rig
  // node. Refuse if there are more than those two: this ABP has been edited, and deleting by class would take
  // someone's nodes with it.
  const inputs = [...namesFrom(found, 'K2Node_CallFunction'), ...namesFrom(found, 'K2Node_VariableGet')];
  if (inputs.length > 2) {
    throw new Error(`${abpPath}: ${inputs.length} K2 nodes in the AnimGraph (expected only NOT and Is Falling): ` +
      'the graph was edited, so remove the foot-IK Control Rig node by hand');
  }
  const deleted: string[] = [];
  for (const n of [...controlRig, ...inputs]) {
    await tools.deleteNode(nodeRef(graph, n));
    deleted.push(n);
  }
  await tools.connect({ node: nodeRef(graph, slot[0] ?? ''), index: 0, dir: 'EGPD_Output' },
    { node: nodeRef(graph, root[0] ?? ''), index: 0, dir: 'EGPD_Input' });
  // compile_blueprint raises on compile errors ("Compile Errors: ..."), so a failed compile stops here, unsaved.
  const compiled = await tools.compile({ refPath: obj });
  // Force the save: scripted edits don't always mark an asset dirty, and a skipped save loses the change.
  const saved = await runPythonCode(
    "import unreal\nprint('SAVED', unreal.EditorAssetLibrary.save_asset(ARGS['abp'], only_if_is_dirty=False))", { abp: abpPath });
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
