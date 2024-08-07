import { create } from "zustand";
import { Coords, TNode } from "../types";

type TUseConnectNodes = {
    isAddingEdge: boolean;
    startNode: TNode | null;
    endNode: TNode | null;
    mouseCoords: Coords | null;
    setIsAddingEdge: (value: TUseConnectNodes['isAddingEdge']) => void;
    setStartNode: (node: TUseConnectNodes['startNode']) => void;
    setEndNode: (node: TUseConnectNodes['endNode']) => void;
    setMouseCoords: (coords: TUseConnectNodes['mouseCoords']) => void;
}

export const useConnectNodes = create<TUseConnectNodes>((set) => ({
    isAddingEdge: false,
    startNode: null,
    endNode: null,
    mouseCoords: null, 
    setIsAddingEdge: (value) => set({ isAddingEdge: value }),
    setStartNode: (node) => set({ startNode: node }),
    setEndNode: (node) => set({ endNode: node }),
    setMouseCoords: (coords) => set({ mouseCoords: coords })
}))