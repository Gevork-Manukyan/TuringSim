import "./Canvas.scss";
import { useEffect, useState } from "react";
import { DragMoveEvent, DragStartEvent } from "@dnd-kit/core/dist/types";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useDirectedGraph } from "../../lib/stores/useDirectedGraph";
import { useConnectNodes } from "../../lib/stores/useConnectNodes";
import { Coord } from "../../lib/types";
import Node from "../Nodes/Node/Node";
import AddNodeButton from "../Buttons/AddNodeButton/AddNodeButton";
import Arrow from "../Arrow/Arrow";
import NewNodeIcon from "../Icons/NewNodeIcon";
import { calcEdgeCoords, calcNodeCenter } from "../../lib/util";

export default function Canvas() {
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

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
    >
      <section
        id="Canvas"
        className={`${isAddingEdge ? "Canvas--addingEdge" : ""}`}
      >
        {isGraphEmpty() && (
          <AddNodeButton>
            <NewNodeIcon />
          </AddNodeButton>
        )}

        {/* Render nodes */}
        {Array.from(graphNodes.entries()).map(([key, node]) => {
          return <Node key={key} node={node} />;
        })}

        {/* Render arrows connecting Nodes */}
        {getAllEdgeCoords().map((edgeCoords, index) => {
          const { startCoords, endCoords } = calcEdgeCoords(
            calcNodeCenter(edgeCoords.startCoord),
            calcNodeCenter(edgeCoords.endCoord)
          );
          const selfPointing =
            edgeCoords.startCoord.x === edgeCoords.endCoord.x &&
            edgeCoords.startCoord.y === edgeCoords.endCoord.y;
          return (
            <Arrow
              key={index}
              edgeId={edgeCoords.id}
              startPoint={startCoords}
              endPoint={endCoords}
              label={getEdge(edgeCoords.id).value}
              type={selfPointing ? "circle" : "line"}
            />
          );
        })}

        {/* Arrow when adding new Edge */}
        {isAddingEdge ? <AddEdgeArrow /> : null}
      </section>
    </DndContext>
  );
}

function AddEdgeArrow() {
  const isAddingEdge = useConnectNodes((state) => state.isAddingEdge);

  const addingEdgeStartNode = useConnectNodes((state) => state.startNode);
  const addingEdgeEndNode = useConnectNodes((state) => state.endNode);
  const mouseCoords = useConnectNodes((state) => state.mouseCoords);
  const setMouseCoords = useConnectNodes((state) => state.setMouseCoords);

  useEffect(() => {
    if (!isAddingEdge) return;

    const handleMouseMove = (event: MouseEvent) => {
      setMouseCoords({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isAddingEdge, setMouseCoords]);

  return (
    <>
      {/* If start node id is same as end, then use circle arrow */}
      {addingEdgeStartNode && mouseCoords ? (
        <Arrow
          edgeId={null}
          key={addingEdgeStartNode.id}
          startPoint={addingEdgeStartNode.coords}
          endPoint={addingEdgeEndNode ? addingEdgeEndNode.coords : mouseCoords}
          type={addingEdgeStartNode.id === addingEdgeEndNode?.id ? "circle" : "line"}
        />
      ) : null}
    </>
  );
}
