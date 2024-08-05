import { create } from "zustand";

export type Coords = {
  x: number,
  y: number
}

export type TNode = {
  id: string;
  value: string | number | null;
  coords: Coords;
  isEndNode: boolean;
}

export type TEdgeCoords = {
  startCoords: Coords,
  endCoords: Coords
}

function generateRandomString(): string {
  const length = 16;
  const array = new Uint8Array(length / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

function generateRandomId(state: TUseDirectedGraph) {
  let id;
  do {
    id = generateRandomString()
  } while (state.nodes.has(id))
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

function addEdge(state: TUseDirectedGraph, from: string, to: string): Partial<TUseDirectedGraph> {
  if (!doNodesExist(from, to, state.nodes)) throw new Error("Both nodes must exist to make an edge");
  if (doesEdgeExist(state.incomingEdges, state.outgoingEdges, from, to)) throw Error(`Edge already exists from node '${from}' to node '${to}'`) 

  const newIncomingEdges = new Map(state.incomingEdges)
  const newOutgoingEdges = new Map(state.outgoingEdges)
  
  // Add the new edge to the outgoing edges of the from node
  newOutgoingEdges.get(from)!.push(to)
  // Add the new edge to the incoming edges of the to node
  newIncomingEdges.get(to)!.push(from)
  
  return { incomingEdges: newIncomingEdges, outgoingEdges: newOutgoingEdges };
}

function removeEdge(state: TUseDirectedGraph, from: string, to: string): Partial<TUseDirectedGraph> {
  if (!doNodesExist(from, to, state.nodes)) throw new Error("Both nodes must exist to remove an edge");
  if (!doesEdgeExist(state.incomingEdges, state.outgoingEdges, from, to)) throw Error(`Cannot remove edge from node '${from}' to node '${to}' as it does not exist`) 

  const newIncomingEdges = new Map(state.incomingEdges)
  const newOutgoingEdges = new Map(state.outgoingEdges)

  const filteredIncomingEdges = newIncomingEdges.get(to)!.filter(edge => edge !== from)
  const filteredOutgoingEdges = newOutgoingEdges.get(from)!.filter(edge => edge !== to)

  newIncomingEdges.set(to, filteredIncomingEdges)
  newOutgoingEdges.set(from, filteredOutgoingEdges)

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
  if (!nodes.has(from) || !nodes.has(to)) return false;
  return true;
}

type TUseDirectedGraph = {
  nodes: Map<string, TNode>;
  incomingEdges: Map<string, string[]>;
  outgoingEdges: Map<string, string[]>;
  addNode: (value: TNode['value'], isEndNode?: boolean) => string;
  removeNode: (nodeId: string) => void;
  addEdge: (from: string, to: string) => void;
  removeEdge: (from: string, to: string) => void;
  getCoords: (nodeId: string) => Coords;
  getAllOutgoingEdgesCoords: () => TEdgeCoords[];
  getIncomingEdges: (nodeId: string) => string[];
  getOutgoingEdges: (nodeId: string) => string[];
  updateCoords: (nodeId: string, x: number, y: number) => void;
  isEmpty: () => boolean;
}

export const useDirectedGraph = create<TUseDirectedGraph>((set, get) => ({
  nodes: new Map<string, TNode>(),
  incomingEdges: new Map<string, string[]>(),
  outgoingEdges: new Map<string, string[]>(),
  addNode: (value, isEndNode=false) => {
    let nodeId = '';
    set((state: TUseDirectedGraph) => {
      nodeId = generateRandomId(state);
      return addNode(state, value, nodeId, isEndNode);
    });
    return nodeId;
  },
  removeNode: (nodeId) => {
    set((state: TUseDirectedGraph) => removeNode(state, nodeId));
  },
  addEdge: (from: string, to: string) => {
    set((state: TUseDirectedGraph) => addEdge(state, from, to));
  },
  removeEdge: (from, to) => {
    set((state: TUseDirectedGraph) => removeEdge(state, from, to));
  },
  getCoords: (nodeId: string) => {
    const coords = get().nodes.get(nodeId)?.coords;
    if (coords) return coords;
    else throw Error("Invalid Node ID");
  },
  getAllOutgoingEdgesCoords: () => {
    const nodes = get().nodes
    const outgoingEdges = get().outgoingEdges

    return getAllOutgoingEdgesCoords(nodes, outgoingEdges);
  },
  getIncomingEdges: (nodeId: string) => {
    const nodeEdges = get().incomingEdges.get(nodeId)
    if (nodeEdges) return nodeEdges;
    else throw Error ("Invalid Node ID");
  },
  getOutgoingEdges: (nodeId: string) => {
    const nodeEdges = get().outgoingEdges.get(nodeId)
    if (nodeEdges) return nodeEdges;
    else throw Error ("Invalid Node ID");
  },
  updateCoords: (nodeId: string, x: number, y: number) => {
    set((state: TUseDirectedGraph) => updateCoords(state, nodeId, x, y));
  },
  isEmpty: () => {
    return get().nodes.size === 0;
  }
}));
