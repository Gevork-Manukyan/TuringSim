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
import { ARROW_CONFIG } from "../../lib/constants";
import { calcEdgeCoords, calcNodeCenter } from "../../lib/util";

export default function Canvas() {
  const [startCoords, setStartCoords] = useState<Coord | null>(null);

  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor, {});
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const graphNodes = useDirectedGraph((state) => state.nodes);
  const getAllOutgoingEdgesCoords = useDirectedGraph(
    (state) => state.getAllOutgoingEdgesCoords
  );
  const isGraphEmpty = useDirectedGraph((state) => state.isEmpty);
  const updateCoords = useDirectedGraph((state) => state.updateCoords);
  const getCoords = useDirectedGraph((state) => state.getCoords);

  const isAddingEdge = useConnectNodes((state) => state.isAddingEdge);

  const [isArrowHovered, setIsArrowHovered] = useState(false);

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

  const handleArrowClick = () => {};

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
        {getAllOutgoingEdgesCoords().map((edge, index) => {
          const { startCoords, endCoords } = calcEdgeCoords(
            calcNodeCenter(edge.startCoords),
            calcNodeCenter(edge.endCoords)
          );
          const selfPointing =
            edge.startCoords.x === edge.endCoords.x &&
            edge.startCoords.y === edge.endCoords.y;
          return (
            <Arrow
              key={index}
              startPoint={startCoords}
              endPoint={endCoords}
              config={ARROW_CONFIG}
              type={selfPointing ? "circle" : "line"}
              onClick={handleArrowClick}
              onMouseEnter={() => setIsArrowHovered(true)}
              onMouseLeave={() => setIsArrowHovered(false)}
              isHighlighted={isArrowHovered}
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
          config={ARROW_CONFIG}
          key={addingEdgeStartNode.id}
          startPoint={addingEdgeStartNode.coords}
          endPoint={addingEdgeEndNode ? addingEdgeEndNode.coords : mouseCoords}
          type={
            addingEdgeStartNode.id === addingEdgeEndNode?.id ? "circle" : "line"
          }
        />
      ) : null}
    </>
  );
}
