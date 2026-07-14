import { AutomatonEngine, GraphSnapshot, SimState } from "./types";
import { NodeId } from "../types";

/**
 * Returns a human-readable reason the graph can't be simulated, or null if it's
 * a runnable DFA. Mirrors the old `checkIfGraphIsValid`, but returns the message
 * instead of only logging it so the UI can surface it.
 */
function validate(graph: GraphSnapshot): string | null {
  if (graph.startNodeId === "") return "Set a start state before running.";
  if (graph.endNodeIds.length === 0) return "Mark at least one accept state.";
  for (const edge of graph.edges.values()) {
    if (edge.value.trim() === "") return "Every transition needs a label.";
  }
  return null;
}

/** Decide accept/reject once all input is consumed, based on the final state. */
function decide(graph: GraphSnapshot, sim: SimState, nodeId: NodeId): SimState {
  const accepted = graph.nodes.get(nodeId)?.isEndNode ?? false;
  return { ...sim, status: accepted ? "accepted" : "rejected", errorMessage: null };
}

function init(graph: GraphSnapshot, input: string[]): SimState {
  const error = validate(graph);
  if (error) {
    return {
      input,
      index: 0,
      activeNodeIds: [],
      lastEdgeId: null,
      status: "rejected",
      errorMessage: error,
    };
  }
  return {
    input,
    index: 0,
    activeNodeIds: [graph.startNodeId],
    lastEdgeId: null,
    status: "running",
    errorMessage: null,
  };
}

function step(graph: GraphSnapshot, sim: SimState): SimState {
  if (sim.status !== "running") return sim;

  const currentId = sim.activeNodeIds[0];

  // No input left: finalize on the state we're sitting on (handles empty input).
  if (sim.index >= sim.input.length) {
    return decide(graph, sim, currentId);
  }

  const symbol = sim.input[sim.index];
  const outgoing = (graph.outgoingEdges.get(currentId) ?? [])
    .map((me) => graph.edges.get(me.edgeId))
    .filter((edge): edge is NonNullable<typeof edge> => edge !== undefined);
  const match = outgoing.find((edge) => edge.value === symbol);

  if (!match) {
    return {
      ...sim,
      status: "rejected",
      errorMessage: `No transition on '${symbol}' from the current state.`,
    };
  }

  const nextIndex = sim.index + 1;
  const advanced: SimState = {
    ...sim,
    index: nextIndex,
    activeNodeIds: [match.toId],
    lastEdgeId: match.id,
  };

  // Fold the accept/reject decision into the step that consumes the last symbol
  // so a length-n run finishes in exactly n steps.
  if (nextIndex >= sim.input.length) {
    return decide(graph, advanced, match.toId);
  }
  return advanced;
}

export const dfaEngine: AutomatonEngine = { init, step };
