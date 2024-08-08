import { create } from "zustand";
import { Coords, TNode } from "../types";
import { TEdgeCoords } from "./useDirectedGraph";
import { calcEdgeCoords } from "../util";

type TUseConnectNodes = {
    isAddingEdge: boolean;
    startNode: TNode | null;
    endNode: TNode | null;
    mouseCoords: Coords | null;
    setIsAddingEdge: (value: TUseConnectNodes['isAddingEdge']) => void;
    setStartNode: (node: TUseConnectNodes['startNode']) => void;
    setEndNode: (node: TUseConnectNodes['endNode']) => void;
    setMouseCoords: (coords: TUseConnectNodes['mouseCoords']) => void;
    getEdgeCoords: () => TEdgeCoords | null;
}

export const useConnectNodes = create<TUseConnectNodes>((set, get) => ({
    isAddingEdge: false,
    startNode: null,
    endNode: null,
    mouseCoords: null, 
    setIsAddingEdge: (value) => set({ isAddingEdge: value }),
    setStartNode: (node) => set({ startNode: node }),
    setEndNode: (node) => set({ endNode: node }),
    setMouseCoords: (coords) => set({ mouseCoords: coords }),
    getEdgeCoords: () => {
        const startNode = get().startNode;
        const endNode = get().endNode;
        
        if (startNode && endNode) getEdgeCoords(startNode.coords, endNode.coords)
        
        return null;  // Return null if either startNode or endNode is null
    }
}))

function getEdgeCoords(startNodeCoords: Coords, endNodeCoords: Coords) {
    return calcEdgeCoords({ startCoords: startNodeCoords, endCoords: endNodeCoords })
}