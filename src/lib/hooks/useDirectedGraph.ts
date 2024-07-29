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
  incomingEdges: string[];
  outgoingEdges: string[];
}

export type TEdge = {
  from: string;
  to: string;
}

type TUseDirectedGraph = {
  nodes: Map<string, TNode>;
  addNode: (value: TNode['value'], isEndNode?: boolean) => string;
  removeNode: (nodeId: string) => void;
  addEdge: (edge: TEdge) => void;
  removeEdge: (from: string, to: string) => void;
  getCoords: (nodeId: string) => Coords;
  updateCoords: (nodeId: string, x: number, y: number) => void;
  isEmpty: () => boolean;
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

function addNode(state: TUseDirectedGraph, nodeValue: TNode['value'], nodeId: string, isEndNode: boolean) {
  const newNodes = new Map(state.nodes);
  newNodes.set(nodeId, {
    id: nodeId,
    value: nodeValue,
    coords: { x: 0, y: 0 },
    isEndNode: isEndNode,
    incomingEdges: [],
    outgoingEdges: []
  });

  return { nodes: newNodes }
}

function removeNode(state: TUseDirectedGraph, nodeId: string) {
  const newNodes = new Map(state.nodes);
  const isNodeDeleted = newNodes.delete(nodeId);
  if (!isNodeDeleted) throw new Error("Node must exist to be deleted")

  // Remove all edges going out of node
  newNodes.get(nodeId)!.outgoingEdges = []

  // Remove all edges going into node
  for (const id of newNodes.keys()) {
    const node = newNodes.get(id)
    const filteredEdges = node!.outgoingEdges.filter(edge => edge === nodeId)
    newNodes.set(id, { ...node!, outgoingEdges: filteredEdges })
  }

  return { nodes: newNodes }
}

function addEdge(state: TUseDirectedGraph, edge: TEdge) {
  const { from, to } = edge;
  doNodesExist(from, to, state.nodes);

  const newNodes = new Map(state.nodes);
  newNodes.get(from)!.outgoingEdges.push(to);
  newNodes.get(to)!.incomingEdges.push(from);
  
  return { nodes: newNodes };
}

function removeEdge(state: TUseDirectedGraph, from: string, to: string) {
  const newNodes = new Map(state.nodes);
  doNodesExist(from, to, state.nodes);
  
  const fromNode = newNodes.get(from)
  const toNode = newNodes.get(to)

  const fromFilteredEdges = fromNode!.outgoingEdges.filter(edge => edge !== to);
  const toFilteredEdges = toNode!.incomingEdges.filter(edge => edge !== from);

  newNodes.set(from, { ...fromNode!, outgoingEdges: fromFilteredEdges })
  newNodes.set(to, { ...toNode!, incomingEdges: toFilteredEdges })

  return { nodes: newNodes };
}

function updateCoords(state: TUseDirectedGraph, nodeId: string, x: number, y: number) {
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

function doNodesExist(from: string, to: string, nodes: Map<string, TNode>): boolean {
  if (!nodes.has(from) || !nodes.has(to)) throw new Error("Both nodes must exist to make an edge");
  return true;
}

export const useDirectedGraph = create<TUseDirectedGraph>((set, get) => ({
  nodes: new Map<string, TNode>(),
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
  addEdge: (edge) => {
    set((state: TUseDirectedGraph) => addEdge(state, edge));
  },
  removeEdge: (from, to) => {
    set((state: TUseDirectedGraph) => removeEdge(state, from, to));
  },
  getCoords: (nodeId: string) => {
    const coords = get().nodes.get(nodeId)?.coords;
    if (coords) return coords;
    else throw Error("Invalid Node Id for getCoords");
  },
  updateCoords: (nodeId: string, x: number, y: number) => {
    set((state: TUseDirectedGraph) => updateCoords(state, nodeId, x, y));
  },
  isEmpty: () => {
    return get().nodes.size === 0;
  }
}));
