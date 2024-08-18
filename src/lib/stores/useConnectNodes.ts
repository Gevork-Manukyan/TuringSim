import { create } from "zustand";
import { Coord, Node } from "../types";
import { calcEdgeCoords, calcNodeCenter } from "../util";

type TUseConnectNodes = {
  isAddingEdge: boolean;
  startNode: Node | null;
  endNode: Node | null;
  mouseCoords: Coord | null;
  setIsAddingEdge: (value: TUseConnectNodes["isAddingEdge"]) => void;
  setStartNode: (node: TUseConnectNodes["startNode"]) => void;
  setEndNode: (node: TUseConnectNodes["endNode"]) => void;
  setMouseCoords: (coords: TUseConnectNodes["mouseCoords"]) => void;
};

export const useConnectNodes = create<TUseConnectNodes>((set) => ({
  isAddingEdge: false,
  startNode: null,
  endNode: null,
  mouseCoords: null,
  setIsAddingEdge: (value) => set({ isAddingEdge: value }),
  setStartNode: (node) =>
    set(() => {
      if (node) {
        const newNode = { ...node, coords: calcNodeCenter(node.coords) };
        return { startNode: newNode };
      }
      return { startNode: null };
    }),
  setEndNode: (node) =>
    set((state) => {
      if (node && state.startNode) {
        const endNodeCenter = calcNodeCenter(node.coords);
        const { endCoords } = calcEdgeCoords(
          state.startNode.coords,
          endNodeCenter
        );
        const newNode = { ...node, coords: endCoords };
        return { endNode: newNode };
      }

      return { endNode: null };
    }),
  setMouseCoords: (coords) => set({ mouseCoords: coords }),
}));
