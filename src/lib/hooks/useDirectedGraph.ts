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
  addNode: (node: Node) => TUseDirectedGraph | void;
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
}

function removeNode(state: TUseDirectedGraph, nodeId: string) {
  const newNodes = new Map(state.nodes);
  
}

export const useDirectedGraph = create((set) => ({
  nodes: new Map<string, Node>(),
  adjacencyList: new Map<string, Edge[]>(),
  addNode: (node: Node) => {
    set((state: TUseDirectedGraph) => addNode(state, node));
  },
  removeNode: (nodeId: string) => {
    set((state: TUseDirectedGraph) => removeNode(state, nodeId));
  }
}));
