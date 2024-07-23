import { create } from "zustand";

type Node = {
  id: string;
  value: string | number;
  isEndNode: boolean;
  edges: string[];
}

type Edge = {
  to: string;
  from: string;
}

type TUseDirectedGraph = {
  nodes: Map<string, Node>;
  addNode: (value: Node['value'], isEndNode?: boolean) => void;
  removeNode: (nodeId: string) => void;
  addEdge: (edge: Edge) => void;
  removeEdge: (from: string, to: string) => void;
  isEmpty: () => boolean;
}

function generateRandomStringId(): string {
  const length = 16;
  const array = new Uint8Array(length / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

function addNode(state: TUseDirectedGraph, nodeValue: Node['value'], isEndNode: boolean) {
  let id;
  do {
    id = generateRandomStringId()
  } while (state.nodes.has(id))
  const newId = id;

  const newNodes = new Map(state.nodes);
  newNodes.set(newId, {
    id: newId,
    value: nodeValue,
    isEndNode: isEndNode,
    edges: []
  });

  return { nodes: newNodes }
}

function removeNode(state: TUseDirectedGraph, nodeId: string) {
  const newNodes = new Map(state.nodes);
  const isNodeDeleted = newNodes.delete(nodeId);
  if (!isNodeDeleted) throw new Error("Node must exist to be deleted")

  // Remove all edges going out of node
  newNodes.get(nodeId)!.edges = []

  // Remove all edges going into node
  for (const id of newNodes.keys()) {
    const node = newNodes.get(id)
    const filteredEdges = node!.edges.filter(edge => edge === nodeId)
    newNodes.set(id, { ...node!, edges: filteredEdges })
  }

  return { nodes: newNodes }
}

function addEdge(state: TUseDirectedGraph, edge: Edge) {
  const { from, to } = edge;
  doNodesExist(from, to, state.nodes);

  const newNodes = new Map(state.nodes);
  newNodes.get(from)!.edges.push(to);
  
  return { nodes: newNodes };
}

function removeEdge(state: TUseDirectedGraph, from: string, to: string) {
  const newNodes = new Map(state.nodes);
  doNodesExist(from, to, state.nodes);
  
  const node = newNodes.get(from)
  const filteredEdges = node!.edges.filter(edge => edge !== to);
  newNodes.set(from, { ...node!, edges: filteredEdges })

  return { nodes: newNodes };
}

function doNodesExist(from: string, to: string, nodes: Map<string, Node>): boolean {
  if (!nodes.has(from) || !nodes.has(to)) throw new Error("Both nodes must exist to make an edge");
  return true;
}

export const useDirectedGraph = create<TUseDirectedGraph>((set, get) => ({
  nodes: new Map<string, Node>(),
  addNode: (value, isEndNode=false) => {
    set((state: TUseDirectedGraph) => addNode(state, value, isEndNode));
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
  isEmpty: () => {
    return get().nodes.size === 0;
  }
}));
