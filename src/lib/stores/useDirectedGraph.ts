import { create } from "zustand";
import { Coords, TNode } from "../types";

export type Edge = {
  value: string | null;
  fromId: TNode['id'];
  toId: TNode['id'];
}

export type TEdgeCoords = {
  startCoords: Coords,
  endCoords: Coords
}

type TUseDirectedGraph = {
  nodes: Map<string, TNode>;
  incomingEdges: Map<string, string[]>;
  outgoingEdges: Map<string, string[]>;
  addNode: (value: TNode['value'], isEndNode?: boolean) => TNode['id'];
  removeNode: (nodeId: TNode['id']) => void;
  renameNode: (nodeId: TNode['id'], newValue: TNode["value"]) => void;
  addEdge: (edge: Edge) => void;
  removeEdge: (edge: Edge) => void;
  getCoords: (nodeId: TNode['id']) => Coords;
  getAllOutgoingEdgesCoords: () => TEdgeCoords[];
  getIncomingEdges: (nodeId: TNode['id']) => TNode['id'][];
  getOutgoingEdges: (nodeId: TNode['id']) => TNode['id'][];
  updateCoords: (nodeId: TNode['id'], x: number, y: number) => void;
  isEmpty: () => boolean;
}

export const useDirectedGraph = create<TUseDirectedGraph>((set, get) => ({
  nodes: new Map<string, TNode>(),
  incomingEdges: new Map<string, string[]>(),
  outgoingEdges: new Map<string, string[]>(),
  addNode: (value, isEndNode=false) => {
    const nodeId = generateRandomId(get().nodes);
    set((state: TUseDirectedGraph) => addNode(state, value, nodeId, isEndNode))
    return nodeId;
  },
  removeNode: (nodeId) => {
    set((state) => removeNode(state, nodeId));
  },
  renameNode: (nodeId, newValue) => {
    if (newValue === null) return;
    set((state) => renameNode(state, nodeId, newValue))
  },
  addEdge: (edge) => {
    set((state) => addEdge(state, edge));
  },
  removeEdge: (edge) => {
    set((state) => removeEdge(state, edge));
  },
  getCoords: (nodeId) => {
    const coords = get().nodes.get(nodeId)?.coords;
    if (coords) return coords;
    else throw Error("Invalid Node ID");
  },
  getAllOutgoingEdgesCoords: () => {
    const nodes = get().nodes
    const outgoingEdges = get().outgoingEdges
    return getAllOutgoingEdgesCoords(nodes, outgoingEdges);
  },
  getIncomingEdges: (nodeId) => {
    const nodeEdges = get().incomingEdges.get(nodeId)
    if (nodeEdges) return nodeEdges;
    else throw Error ("Invalid Node ID");
  },
  getOutgoingEdges: (nodeId) => {
    const nodeEdges = get().outgoingEdges.get(nodeId)
    if (nodeEdges) return nodeEdges;
    else throw Error ("Invalid Node ID");
  },
  updateCoords: (nodeId, x, y) => {
    set((state) => updateCoords(state, nodeId, x, y));
  },
  isEmpty: () => {
    return get().nodes.size === 0;
  }
}));

function generateRandomString(): string {
  const length = 16;
  const array = new Uint8Array(length / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

function generateRandomId(nodes: TUseDirectedGraph['nodes']) {
  let id;
  do {
    id = generateRandomString()
  } while (nodes.has(id))
  return id;
}

function addNode(state: TUseDirectedGraph, nodeValue: TNode['value'], nodeId: string, isEndNode: boolean): Partial<TUseDirectedGraph> {
  const newNodes = new Map(state.nodes);
  newNodes.set(nodeId, {
    id: nodeId,
    value: nodeValue,
    coords: { x: 0, y: 0 },
    isEndNode: isEndNode
  });

  const newIncomingEdges = new Map(state.incomingEdges)
  const newOutgoingEdges = new Map(state.outgoingEdges)

  newIncomingEdges.set(nodeId, [])
  newOutgoingEdges.set(nodeId, [])

  return { nodes: newNodes, incomingEdges: newIncomingEdges, outgoingEdges: newOutgoingEdges }
}

function removeNode(state: TUseDirectedGraph, nodeId: string): Partial<TUseDirectedGraph> {
  const newNodes = new Map(state.nodes);
  const isNodeDeleted = newNodes.delete(nodeId);
  if (!isNodeDeleted) throw new Error("Node must exist to be deleted")

  const newOutgoingEdges = new Map(state.outgoingEdges);
  const newIncomingEdges = new Map(state.incomingEdges);

  // Remove all edges going out of node
  for (const outgoingEdgeId of newOutgoingEdges.get(nodeId)!) {
    const filteredEdges = newIncomingEdges.get(outgoingEdgeId)!.filter(edge => edge !== nodeId)
    newIncomingEdges.set(outgoingEdgeId, filteredEdges)
  }
  newOutgoingEdges.delete(nodeId)

  // Remove all edges going into node
  for (const incomingEdgeId of newIncomingEdges.get(nodeId)!) {
    const filteredEdges = newOutgoingEdges.get(incomingEdgeId)!.filter(edge => edge !== nodeId)
    newOutgoingEdges.set(incomingEdgeId, filteredEdges)
  }
  newIncomingEdges.delete(nodeId)

  return { nodes: newNodes, incomingEdges: newIncomingEdges, outgoingEdges: newOutgoingEdges }
}

function renameNode(state: TUseDirectedGraph, nodeId: TNode['id'], newValue: TNode['value']): Partial<TUseDirectedGraph> {
  const newNodes = new Map(state.nodes)
  const node = newNodes.get(nodeId)
  if (node) {
    node.value = newValue
    newNodes.set(nodeId, node)
    return { nodes: newNodes }
  }
  return state;
}

function addEdge(state: TUseDirectedGraph, edge: Edge): Partial<TUseDirectedGraph> {
  const { fromId, toId } = edge;
  if (!doNodesExist(fromId, toId, state.nodes)) throw new Error("Both nodes must exist to make an edge");
  if (doesEdgeExist(state.incomingEdges, state.outgoingEdges, fromId, toId)) throw Error(`Edge already exists from node '${fromId}' to node '${toId}'`) 

  const newIncomingEdges = new Map(state.incomingEdges)
  const newOutgoingEdges = new Map(state.outgoingEdges)
  
  // Add the new edge to the outgoing edges of the from node
  newOutgoingEdges.get(fromId)!.push(toId)
  // Add the new edge to the incoming edges of the to node
  newIncomingEdges.get(toId)!.push(fromId)
  
  return { incomingEdges: newIncomingEdges, outgoingEdges: newOutgoingEdges };
}

function removeEdge(state: TUseDirectedGraph, edge: Edge): Partial<TUseDirectedGraph> {
  const { fromId, toId } = edge;
  if (!doNodesExist(fromId, toId, state.nodes)) throw new Error("Both nodes must exist to remove an edge");
  if (!doesEdgeExist(state.incomingEdges, state.outgoingEdges, fromId, toId)) throw Error(`Cannot remove edge from node '${fromId}' to node '${toId}' as it does not exist`) 

  const newIncomingEdges = new Map(state.incomingEdges)
  const newOutgoingEdges = new Map(state.outgoingEdges)

  const filteredIncomingEdges = newIncomingEdges.get(toId)!.filter(edge => edge !== fromId)
  const filteredOutgoingEdges = newOutgoingEdges.get(fromId)!.filter(edge => edge !== toId)

  newIncomingEdges.set(toId, filteredIncomingEdges)
  newOutgoingEdges.set(fromId, filteredOutgoingEdges)

  return { incomingEdges: newIncomingEdges, outgoingEdges: newOutgoingEdges };
}

function updateCoords(state: TUseDirectedGraph, nodeId: string, x: number, y: number): Partial<TUseDirectedGraph> {
  if (!state.nodes.has(nodeId)) {
    throw new Error(`Node with id ${nodeId} does not exist`);
  }
  
  const newNodes = new Map(state.nodes)
  const node = newNodes.get(nodeId)
  newNodes.set(nodeId, {
    ...node!,
    coords: { x, y }
  })
  
  return { nodes: newNodes };
}

function getAllOutgoingEdgesCoords(nodes: TUseDirectedGraph['nodes'], outgoingEdges: TUseDirectedGraph['outgoingEdges']): TEdgeCoords[] {
  const allEdges: TEdgeCoords[] = []
  const entries = outgoingEdges.entries()
  
  for (const [nodeId, edges] of entries) {
    const startCoords = nodes.get(nodeId)!.coords
    edges.forEach(targetId => {
      const endCoords = nodes.get(targetId)!.coords
      allEdges.push({ startCoords, endCoords })
    })
  }
  
  return allEdges;
}

function doesEdgeExist(incomingEdges: TUseDirectedGraph['incomingEdges'], outgoingEdges: TUseDirectedGraph['outgoingEdges'], from: string, to: string): boolean {
    const fromOutgoingEdges = outgoingEdges.get(from)!
    if (fromOutgoingEdges.includes(to)) return true;
  
    const toIncomingEdges = incomingEdges.get(to)!;
    if (toIncomingEdges.includes(from)) return true;

    return false;
}

function doNodesExist(from: string, to: string, nodes: TUseDirectedGraph['nodes']): boolean {
  console.log(nodes, from, to)
  if (!nodes.has(from) || !nodes.has(to)) return false;
  return true;
}