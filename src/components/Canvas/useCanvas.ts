import { useState } from "react";
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

export default function useCanvas() {

    const [startCoords, setStartCoords] = useState<Coord | null>(null);

    const mouseSensor = useSensor(MouseSensor);
    const touchSensor = useSensor(TouchSensor);
    const keyboardSensor = useSensor(KeyboardSensor, {});
    const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);
  
    const graphNodes = useDirectedGraph((state) => state.nodes);
    const getAllEdgeCoords = useDirectedGraph((state) => state.getAllEdgeCoords);
    const isGraphEmpty = useDirectedGraph((state) => state.isEmpty);
    const updateCoords = useDirectedGraph((state) => state.updateNodeCoords);
    const getCoords = useDirectedGraph((state) => state.getNodeCoords);
    const getEdge = useDirectedGraph((state) => state.getEdge)
  
    const isAddingEdge = useConnectNodes((state) => state.isAddingEdge);
  
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
        isAddingEdge,
        handleDragStart,
        handleDragMove
    }
}