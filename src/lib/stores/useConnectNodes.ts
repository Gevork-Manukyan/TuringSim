import { create } from "zustand";
import { TNode } from "./useDirectedGraph";

type TUseConnectNodes = {
    isAddingEdge: boolean;
    startNode: TNode | null;
    endNode: TNode | null;
}

export const useConnectNodes = create<TUseConnectNodes>((set) => ({
    isAddingEdge: false,
    startNode: null,
    endNode: null 
}))