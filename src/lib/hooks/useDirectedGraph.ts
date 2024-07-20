import { create } from 'zustand'

interface Node {
    id: string;
    value?: string | number;
}

interface Edge {
    from: string;
    to: string;
}

function generateRandomStringId(): string {
  const length = 16;
  const array = new Uint8Array(length / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

export const useDirectedGraph = create((set) => ({
    graph: {
        nodes: new Map<string, Node>(),
        adjacencyList: new Map<string, Edge[]>()
    },
    addNode: (node: Node) =>{
        
    }
}))
