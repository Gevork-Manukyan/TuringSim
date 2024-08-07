import { create } from "zustand";
import { TNode } from "../types";

type TUseConnectNodes = {
    isAddingEdge: boolean;
    startNode: TNode | null;
    endNode: TNode | null;
    setIsAddingEdge: (value: boolean) => void;
    setStartNode: (node: TNode) => void;
    setEndNode: (node: TNode) => void;
}

export const useConnectNodes = create<TUseConnectNodes>((set) => ({
    isAddingEdge: false,
    startNode: null,
    endNode: null,
    setIsAddingEdge: (value) => set({ isAddingEdge: value }),
    setStartNode: (node) => set({ startNode: node }),
    setEndNode: (node) => set({ endNode: node }),
}))