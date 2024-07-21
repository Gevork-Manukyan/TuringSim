import { create } from "zustand";

type Node = {
  id: string;
  value?: string | number;
}

type Edge = {
  from: string;
  to: string;
}

type TUseDirectedGraph = {
  nodes: Map<string, Node>;
  adjacencyList: Map<string, Edge[]>;
  addNode: (node: Node) => void;
  removeNode: (nodeId: string) => void;
  addEdge: (edge: Edge) => void;
  removeEdge: (from: string, to: string) => void;
}

function generateRandomStringId(): string {
  const length = 16;
  const array = new Uint8Array(length / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

function addNode(state: TUseDirectedGraph, node: Node) {
  if (state.nodes.has(node.id)) {
    const newNodes = new Map(state.nodes);
    newNodes.set(node.id, node);

    const newAdjacencyList = new Map(state.adjacencyList);
    newAdjacencyList.set(node.id, [])

    return { nodes: newNodes, adjacencyList: newAdjacencyList }
  }
  return state;
}

function removeNode(state: TUseDirectedGraph, nodeId: string) {
  const newNodes = new Map(state.nodes);
  const isNodeDeleted = newNodes.delete(nodeId);
  if (!isNodeDeleted) throw new Error("Node must exist to be deleted")

  // Remove all edges going out of node
  const newAdjacencyList = new Map(state.adjacencyList);
  newAdjacencyList.delete(nodeId)

  // Remove all edges going into node
  for (const fromNodeId of newAdjacencyList.keys()) {
    const filteredEdges = newAdjacencyList.get(fromNodeId)!.filter(edge => edge.to !== nodeId);
    newAdjacencyList.set(fromNodeId, filteredEdges)
  }

  return { nodes: newNodes, adjacencyList: newAdjacencyList }
}

function addEdge(state: TUseDirectedGraph, edge: Edge) {
  const { from, to } = edge;
  doNodesExist(from, to, state.nodes);

  const newAdjacencyList = new Map(state.adjacencyList);
  newAdjacencyList.get(from)!.push({ from, to });
  
  return { adjacencyList: newAdjacencyList };
}

function removeEdge(state: TUseDirectedGraph, from: string, to: string) {
  const newAdjacencyList = new Map(state.adjacencyList);
  doNodesExist(from, to, state.nodes);
        
  const filteredEdges = newAdjacencyList.get(from)!.filter(edge => edge.to !== to);
  newAdjacencyList.set(from, filteredEdges)

  return { adjacencyList: newAdjacencyList };
}

function doNodesExist(from: string, to: string, nodes: Map<string, Node>): boolean {
  if (!nodes.has(from) || !nodes.has(to)) throw new Error("Both nodes must exist to make an edge");
  return true;
}

export const useDirectedGraph = create((set) => ({
  nodes: new Map<string, Node>(),
  adjacencyList: new Map<string, Edge[]>(),
  addNode: (node: Node) => {
    set((state: TUseDirectedGraph) => addNode(state, node));
  },
  removeNode: (nodeId: string) => {
    set((state: TUseDirectedGraph) => removeNode(state, nodeId));
  },
  addEdge: (edge: Edge) => {
    set((state: TUseDirectedGraph) => addEdge(state, edge));
  },
  removeEdge: (from: string, to: string) => {
    set((state: TUseDirectedGraph) => removeEdge(state, from, to));
  }
}));
