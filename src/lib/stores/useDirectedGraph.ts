import { create } from "zustand";
import { Coord, EdgeId, NodeId, Node, Edge, EdgeCoords } from "../types";
import { generateRandomString } from "../util";

type MapEdge = {
  nodeId: NodeId;
  edgeId: EdgeId;
}

type TUseDirectedGraph = {
  nodes: Map<NodeId, Node>;
  edges: Map<EdgeId, Edge>;
  incomingEdges: Map<NodeId, MapEdge[]>;
  outgoingEdges: Map<NodeId, MapEdge[]>;
  addNode: (value: Node["value"], isStartNode?: boolean, isEndNode?: boolean) => NodeId;
  removeNode: (nodeId: NodeId) => void;
  renameNode: (nodeId: NodeId, newValue: Node["value"]) => void;
  addEdge: (edge: Edge) => void;
  removeEdge: (edge: Edge) => void;
  getNodeCoords: (nodeId: NodeId) => Coord;
  getAllEdgeCoords: () => EdgeCoords[];
  getIncomingEdges: (nodeId: NodeId) => MapEdge[];
  getOutgoingEdges: (nodeId: NodeId) => MapEdge[];
  updateNodeCoords: (nodeId: NodeId, x: number, y: number) => void;
  isEmpty: () => boolean;
};

export const useDirectedGraph = create<TUseDirectedGraph>((set, get) => ({
  nodes: new Map<NodeId, Node>(),
  edges: new Map<EdgeId, Edge>(),
  incomingEdges: new Map<NodeId, MapEdge[]>(),
  outgoingEdges: new Map<NodeId, MapEdge[]>(),
  addNode: (value, isStartNode = false, isEndNode = false) => {
    const nodeId = generateRandomNodeId(get().nodes);
    set((state: TUseDirectedGraph) => addNode(state, value, nodeId, isStartNode, isEndNode));
    return nodeId;
  },
  removeNode: (nodeId) => {
    set((state) => removeNode(state, nodeId));
  },
  renameNode: (nodeId, newValue) => {
    if (newValue === null) return;
    set((state) => renameNode(state, nodeId, newValue));
  },
  addEdge: (edge) => {
    set((state) => addEdge(state, edge));
  },
  removeEdge: (edge) => {
    set((state) => removeEdge(state, edge));
  },
  getNodeCoords: (nodeId) => {
    const coords = get().nodes.get(nodeId)?.coords;
    if (coords) return coords;
    else throw Error("Invalid Node ID");
  },
  getAllEdgeCoords: () => {
    const nodes = get().nodes;
    const outgoingEdges = get().outgoingEdges;
    return getAllEdgeCoords(nodes, outgoingEdges);
  },
  getIncomingEdges: (nodeId) => {
    const nodeEdges = get().incomingEdges.get(nodeId);
    if (nodeEdges) return nodeEdges;
    else throw Error("Invalid Node ID");
  },
  getOutgoingEdges: (nodeId) => {
    const nodeEdges = get().outgoingEdges.get(nodeId);
    if (nodeEdges) return nodeEdges;
    else throw Error("Invalid Node ID");
  },
  updateNodeCoords: (nodeId, x, y) => {
    set((state) => updateNodeCoords(state, nodeId, x, y));
  },
  isEmpty: () => {
    return get().nodes.size === 0;
  },
}));

function generateRandomNodeId(nodes: TUseDirectedGraph["nodes"]) {
  return generateRandomId(nodes);
}

function generateRandomEdgeId(edges: TUseDirectedGraph["edges"]) {
  return generateRandomId(edges);
}

function generateRandomId<V>(map: Map<string, V>) {
  let id;
  do {
    id = generateRandomString();
  } while (map.has(id));
  return id;
}

function addNode(
  state: TUseDirectedGraph,
  nodeValue: Node["value"],
  nodeId: string,
  isStartNode: boolean,
  isEndNode: boolean
): Partial<TUseDirectedGraph> {
  const newNodes = new Map(state.nodes);
  newNodes.set(nodeId, {
    id: nodeId,
    value: nodeValue,
    coords: { x: 0, y: 0 },
    isStartNode: isStartNode,
    isEndNode: isEndNode,
  });

  const newIncomingEdges = new Map(state.incomingEdges);
  const newOutgoingEdges = new Map(state.outgoingEdges);

  newIncomingEdges.set(nodeId, []);
  newOutgoingEdges.set(nodeId, []);

  return {
    nodes: newNodes,
    incomingEdges: newIncomingEdges,
    outgoingEdges: newOutgoingEdges,
  };
}

function removeNode(
  state: TUseDirectedGraph,
  nodeId: string
): Partial<TUseDirectedGraph> {
  const newNodes = new Map(state.nodes);
  const isNodeDeleted = newNodes.delete(nodeId);
  if (!isNodeDeleted) throw new Error("Node must exist to be deleted");

  const newOutgoingEdges = new Map(state.outgoingEdges);
  const newIncomingEdges = new Map(state.incomingEdges);

  // Remove all edges going out of node
  for (const outgoingEdge of newOutgoingEdges.get(nodeId)!) {
    const filteredEdges = newIncomingEdges
      .get(outgoingEdge.nodeId)!
      .filter((edge) => edge.nodeId !== nodeId);
    newIncomingEdges.set(outgoingEdge.nodeId, filteredEdges);
  }
  newOutgoingEdges.delete(nodeId);

  // Remove all edges going into node
  for (const incomingEdge of newIncomingEdges.get(nodeId)!) {
    const filteredEdges = newOutgoingEdges
      .get(incomingEdge.nodeId)!
      .filter((edge) => edge.nodeId !== nodeId);
    newOutgoingEdges.set(incomingEdge.nodeId, filteredEdges);
  }
  newIncomingEdges.delete(nodeId);

  return {
    nodes: newNodes,
    incomingEdges: newIncomingEdges,
    outgoingEdges: newOutgoingEdges,
  };
}

function renameNode(
  state: TUseDirectedGraph,
  nodeId: NodeId,
  newValue: Node["value"]
): Partial<TUseDirectedGraph> {
  const newNodes = new Map(state.nodes);
  const node = newNodes.get(nodeId);
  if (node) {
    node.value = newValue;
    newNodes.set(nodeId, node);
    return { nodes: newNodes };
  }
  return state;
}

function addEdge(
  state: TUseDirectedGraph,
  edge: Edge
): Partial<TUseDirectedGraph> {
  const { id, fromId, toId } = edge;
  if (!doNodesExist(fromId, toId, state.nodes))
    throw new Error("Both nodes must exist to make an edge");
  if (doesEdgeExist(state.incomingEdges, state.outgoingEdges, fromId, toId))
    throw Error(`Edge already exists from node '${fromId}' to node '${toId}'`);

  const newIncomingEdges = new Map(state.incomingEdges);
  const newOutgoingEdges = new Map(state.outgoingEdges);

  // Add the new edge to the outgoing edges of the from node
  newOutgoingEdges.get(fromId)!.push({ nodeId: toId, edgeId: id });
  // Add the new edge to the incoming edges of the to node
  newIncomingEdges.get(toId)!.push({ nodeId: fromId, edgeId: id });

  return { incomingEdges: newIncomingEdges, outgoingEdges: newOutgoingEdges };
}

function removeEdge(
  state: TUseDirectedGraph,
  edge: Edge
): Partial<TUseDirectedGraph> {
  const { fromId, toId } = edge;
  if (!doNodesExist(fromId, toId, state.nodes))
    throw new Error("Both nodes must exist to remove an edge");
  if (!doesEdgeExist(state.incomingEdges, state.outgoingEdges, fromId, toId))
    throw Error(
      `Cannot remove edge from node '${fromId}' to node '${toId}' as it does not exist`
    );

  const newIncomingEdges = new Map(state.incomingEdges);
  const newOutgoingEdges = new Map(state.outgoingEdges);

  const filteredIncomingEdges = newIncomingEdges
    .get(toId)!
    .filter((edge) => edge.nodeId !== fromId);
  const filteredOutgoingEdges = newOutgoingEdges
    .get(fromId)!
    .filter((edge) => edge.nodeId !== toId);

  newIncomingEdges.set(toId, filteredIncomingEdges);
  newOutgoingEdges.set(fromId, filteredOutgoingEdges);

  return { incomingEdges: newIncomingEdges, outgoingEdges: newOutgoingEdges };
}

function updateNodeCoords(
  state: TUseDirectedGraph,
  nodeId: string,
  x: number,
  y: number
): Partial<TUseDirectedGraph> {
  if (!state.nodes.has(nodeId)) {
    throw new Error(`Node with id ${nodeId} does not exist`);
  }

  const newNodes = new Map(state.nodes);
  const node = newNodes.get(nodeId);
  newNodes.set(nodeId, {
    ...node!,
    coords: { x, y },
  });

  return { nodes: newNodes };
}

function getAllEdgeCoords(
  nodes: TUseDirectedGraph["nodes"],
  outgoingEdges: TUseDirectedGraph["outgoingEdges"]
) {
  const allEdges: EdgeCoords[] = [];
  const entries = outgoingEdges.entries();

  for (const [nodeId, edges] of entries) {
    const startCoord = nodes.get(nodeId)!.coords;
    edges.forEach((edge) => {
      const endCoord = nodes.get(edge.nodeId)!.coords;
      allEdges.push({ id: edge.edgeId, startCoord, endCoord });
    });
  }

  return allEdges;
}

function doesEdgeExist(
  incomingEdges: TUseDirectedGraph["incomingEdges"],
  outgoingEdges: TUseDirectedGraph["outgoingEdges"],
  from: string,
  to: string
): boolean {
  const fromOutgoingEdges = outgoingEdges.get(from)!;
  if (fromOutgoingEdges.includes(to)) return true;

  const toIncomingEdges = incomingEdges.get(to)!;
  if (toIncomingEdges.includes(from)) return true;

  return false;
}

function doNodesExist(
  from: string,
  to: string,
  nodes: TUseDirectedGraph["nodes"]
): boolean {
  if (!nodes.has(from) || !nodes.has(to)) return false;
  return true;
}
