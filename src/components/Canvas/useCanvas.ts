import { useEffect, useState } from "react";
import { DragMoveEvent, DragStartEvent } from "@dnd-kit/core/dist/types";
import {
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useDirectedGraph } from "../../lib/stores/useDirectedGraph";
import { Coord } from "../../lib/types";
import { useConnectNodes } from "../../lib/stores/useConnectNodes";
import { useSelection } from "../../lib/stores/useSelection";

export default function useCanvas() {

    const [startCoords, setStartCoords] = useState<Coord | null>(null);

    // A short activation distance lets a stationary click through to open a
    // node's radial menu, while movement past the threshold starts a drag.
    const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 8 } });
    const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 8 } });
    const keyboardSensor = useSensor(KeyboardSensor, {});
    const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

    const graphNodes = useDirectedGraph((state) => state.nodes);
    const getAllEdgeCoords = useDirectedGraph((state) => state.getAllEdgeCoords);
    const isGraphEmpty = useDirectedGraph((state) => state.isEmpty);
    const updateCoords = useDirectedGraph((state) => state.updateNodeCoords);
    const getCoords = useDirectedGraph((state) => state.getNodeCoords);
    const getEdge = useDirectedGraph((state) => state.getEdge)
    const lastEdgeId = useDirectedGraph((state) => state.simulation?.lastEdgeId ?? null)

    const isAddingEdge = useConnectNodes((state) => state.isAddingEdge);
    const setIsAddingEdge = useConnectNodes((state) => state.setIsAddingEdge);
    const setEndNode = useConnectNodes((state) => state.setEndNode);
    const setMouseCoords = useConnectNodes((state) => state.setMouseCoords);

    const clearSelection = useSelection((state) => state.clear);

    const cancelEdge = () => {
      setIsAddingEdge(false);
      setEndNode(null);
      setMouseCoords(null);
    };

    // Esc cancels an in-progress edge and closes any open menu.
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key !== "Escape") return;
        cancelEdge();
        clearSelection();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCanvasClick = (event: React.MouseEvent<HTMLElement>) => {
      // Only react to clicks on empty canvas, not on a node/its menu.
      if ((event.target as HTMLElement).closest(".Node")) return;
      clearSelection();
      if (isAddingEdge) cancelEdge();
    };

    const handleDragStart = (event: DragStartEvent) => {
      const nodeId = event.active.id.toString();
      setStartCoords(getCoords(nodeId));
    };

    const handleDragMove = ({ active, delta }: DragMoveEvent) => {
      updateCoords(
        active.id.toString(),
        startCoords!.x + delta.x,
        startCoords!.y + delta.y
      );
    };

    return {
        sensors,
        graphNodes,
        getAllEdgeCoords,
        isGraphEmpty,
        getEdge,
        lastEdgeId,
        isAddingEdge,
        handleCanvasClick,
        handleDragStart,
        handleDragMove
    }
}
