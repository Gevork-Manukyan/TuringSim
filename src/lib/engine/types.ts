import { NodeId, EdgeId, TNode, Edge } from "../types";

/**
 * A read-only view of the graph that a simulation engine needs. Structurally
 * compatible with the shape stored in `useDirectedGraph`, so the store can pass
 * itself straight through without adapting anything.
 */
export type MapEdge = {
  nodeId: NodeId;
  edgeId: EdgeId;
};

export type GraphSnapshot = {
  nodes: Map<NodeId, TNode>;
  edges: Map<EdgeId, Edge>;
  outgoingEdges: Map<NodeId, MapEdge[]>;
  startNodeId: NodeId;
  endNodeIds: NodeId[];
};

export type SimStatus = "idle" | "running" | "accepted" | "rejected";

export type SimState = {
  input: string[]; // symbols to consume, left to right
  index: number; // index of the next symbol to read
  activeNodeIds: NodeId[]; // singleton for a DFA; a set for an NFA later
  lastEdgeId: EdgeId | null; // the transition just taken (for edge highlighting)
  status: SimStatus;
  errorMessage: string | null; // validation error or reason for rejection
};

/**
 * The seam that lets us add NFA / PDA / Turing engines later without touching
 * the store or the UI: each is just another object implementing this interface.
 */
export type AutomatonEngine = {
  init: (graph: GraphSnapshot, input: string[]) => SimState;
  step: (graph: GraphSnapshot, sim: SimState) => SimState;
};
