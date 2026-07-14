import { create } from "zustand";
import { NodeId } from "../types";

/**
 * Which node's radial menu is open. A single source of truth guarantees only
 * one menu is open at a time and gives Canvas a clean click-away / Esc target.
 */
type SelectionStore = {
  selectedNodeId: NodeId | null;
  select: (id: NodeId) => void;
  toggle: (id: NodeId) => void;
  clear: () => void;
};

export const useSelection = create<SelectionStore>((set, get) => ({
  selectedNodeId: null,
  select: (id) => set({ selectedNodeId: id }),
  toggle: (id) =>
    set({ selectedNodeId: get().selectedNodeId === id ? null : id }),
  clear: () => set({ selectedNodeId: null }),
}));
