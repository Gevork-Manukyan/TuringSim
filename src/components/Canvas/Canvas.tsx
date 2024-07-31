import "./Canvas.scss";
import { Coords, useDirectedGraph } from "../../lib/hooks/useDirectedGraph";
import Node from "../Nodes/Node/Node";
import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import AddNodeButton from "../Buttons/AddNodeButton/AddNodeButton";
import { DragEndEvent, DragMoveEvent, DragStartEvent } from "@dnd-kit/core/dist/types";
import Arrow from "../Arrow/Arrow";
import { useMemo, useState } from "react";

type ArrowData = { 
  startCoords: Coords, 
  endCoords: Coords 
}

type TDraggingNode = {
  nodeId: string;
  incomingEdges: string[];
  outgoingEdges: string[];
}

export default function Canvas() {
  const graphNodes = useDirectedGraph(state => state.nodes)
  const getIncomingEdges = useDirectedGraph(state => state.getIncomingEdges)
  const getOutgoingEdges = useDirectedGraph(state => state.getOutgoingEdges)
  const isGraphEmpty = useDirectedGraph(state => state.isEmpty)
  const updateCoords = useDirectedGraph(state => state.updateCoords)
  const getCoords = useDirectedGraph(state => state.getCoords)

  const mouseSensor = useSensor(MouseSensor)
  const touchSensor = useSensor(TouchSensor)
  const keyboardSensor = useSensor(KeyboardSensor, {})
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);


  
  const [isDragging, setIsDragging] = useState(false);
  const [draggingNode, setDraggingNode] = useState<TDraggingNode | null>(null)
  const [draggingNodeCoords, setDraggingNodeCoords] = useState<Coords | null>(null)

  const handleDragStart = (event: DragStartEvent) => {
    const nodeId = event.active.id.toString()
    const incomingEdges = getIncomingEdges(nodeId)
    const outgoingEdges = getOutgoingEdges(nodeId)
    setDraggingNode({
      nodeId,
      incomingEdges,
      outgoingEdges
    })
    setDraggingNodeCoords(getCoords(nodeId))
    setIsDragging(true)
  } 

  const handleDragMove = ({ active, delta }: DragMoveEvent) => {
    const id = active.id.toString()
    const { x, y } = getCoords(id)
    setDraggingNodeCoords({ x: x + delta.x, y: y + delta.y })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const id = event.active.id.toString()
    const { x, y } = getCoords(id)
    updateCoords(id, x + event.delta.x, y + event.delta.y)
    setIsDragging(false)
  }

  const arrows: ArrowData[] = useMemo(() => {
    if (!isDragging) return [];
    if (!draggingNodeCoords) throw Error ("Cannot access dragging node's coords")

    const arrowList: ArrowData[] = [];

    draggingNode?.incomingEdges.forEach(targetId => {
      const targetCoords = getCoords(targetId)
      arrowList.push({ startCoords: targetCoords, endCoords: draggingNodeCoords })
    })

    draggingNode?.outgoingEdges.forEach(targetId => {
      const targetCoords = getCoords(targetId)
      arrowList.push({ startCoords: draggingNodeCoords, endCoords: targetCoords })
    })

    return arrowList;
  }, [isDragging, draggingNode, draggingNodeCoords, getCoords]);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      <section id="Canvas">
        {isGraphEmpty() && <AddNodeButton>+</AddNodeButton>}
        {Array.from(graphNodes.entries()).map(([key, node]) => {
          return <Node key={key} node={node} />
        })}
        {arrows.map((arrow, index) => (
          <Arrow key={index} startPoint={arrow.startCoords} endPoint={arrow.endCoords} />
        ))}
      </section>
    </DndContext>
  );
}
