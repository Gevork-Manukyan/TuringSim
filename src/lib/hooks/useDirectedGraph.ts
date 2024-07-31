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

// export type TEdge = {
//   start: {
//     id: string;
//     coords: Coords;
//   },
//   end: {
//     id: string;
//     coords: Coords;
//   }
// }

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

  return { nodes: newNodes }
}

function removeNode(state: TUseDirectedGraph, nodeId: string): Partial<TUseDirectedGraph> {
  const newNodes = new Map(state.nodes);
  const isNodeDeleted = newNodes.delete(nodeId);
  if (!isNodeDeleted) throw new Error("Node must exist to be deleted")

  // Remove all edges going out of node
  const newOutgoingEdges = new Map(state.outgoingEdges);
  newOutgoingEdges.set(nodeId, []);

  // Remove all edges going into node
  const newIncomingEdges = new Map(state.incomingEdges);
  newIncomingEdges.set(nodeId, []);

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
  updateCoords: (nodeId: string, x: number, y: number) => void;
  isEmpty: () => boolean;
}

// TODO: remove the edge references from the nodes 
// there should be a global dictionary that tracks all connections between nodes
// Incoming: key is the end node, value is an array of all nodes that end at end node
// Outgoing: key is the start node, value is an array of all nodes that start at the start node
// Onmousedown on node, you get the incoming start nodes once and outgoing end nodes once since these dont change.
// generate arrows using this data
// Don't worry about dropping the node yet
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
    else throw Error("Invalid Node Id for getCoords");
  },
  updateCoords: (nodeId: string, x: number, y: number) => {
    set((state: TUseDirectedGraph) => updateCoords(state, nodeId, x, y));
  },
  isEmpty: () => {
    return get().nodes.size === 0;
  }
}));
