import "./Canvas.scss";
import { useState } from "react";
import { DragMoveEvent, DragStartEvent } from "@dnd-kit/core/dist/types";
import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Coords, useDirectedGraph } from "../../lib/hooks/useDirectedGraph";
import Node from "../Nodes/Node/Node";
import AddNodeButton from "../Buttons/AddNodeButton/AddNodeButton";
import Arrow from "../Arrow/Arrow";


export default function Canvas() {
  const graphNodes = useDirectedGraph(state => state.nodes)
  const getAllOutgoingEdgesCoords = useDirectedGraph(state => state.getAllOutgoingEdgesCoords)
  const isGraphEmpty = useDirectedGraph(state => state.isEmpty)
  const updateCoords = useDirectedGraph(state => state.updateCoords)
  const getCoords = useDirectedGraph(state => state.getCoords)

  const mouseSensor = useSensor(MouseSensor)
  const touchSensor = useSensor(TouchSensor)
  const keyboardSensor = useSensor(KeyboardSensor, {})
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);


  const [startCoords, setStartCoords] = useState<Coords | null>(null)

  const handleDragStart = (event: DragStartEvent) => {
    const nodeId = event.active.id.toString()
    setStartCoords(getCoords(nodeId))
  } 

  const handleDragMove = ({ active, delta }: DragMoveEvent) => {
    updateCoords(active.id.toString(), startCoords!.x + delta.x, startCoords!.y + delta.y)
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
    >
      <section id="Canvas">
        {isGraphEmpty() && <AddNodeButton>+</AddNodeButton>}
        {Array.from(graphNodes.entries()).map(([key, node]) => {
          return <Node key={key} node={node} />
        })}
        {getAllOutgoingEdgesCoords().map((edge, index) => (
          <Arrow key={index} startPoint={edge.startCoords} endPoint={edge.endCoords} />
        ))}
      </section>
    </DndContext>
  );
}
