import "./Canvas.scss";
import { useDirectedGraph } from "../../lib/hooks/useDirectedGraph";
import { useState } from "react";
import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Coordinates } from "@dnd-kit/core/dist/types";
import Node, { TonCoordsChange } from "../Nodes/Node/Node";
import EndNode from "../Nodes/EndNode/EndNode";
import AddNodeButton from "../Buttons/AddNodeButton/AddNodeButton";
import Arrow from "../Arrow/Arrow";

const defaultCoordinates = {
  x: 0,
  y: 0,
};


export default function Canvas() {
  const graphNodes = useDirectedGraph((state) => state.nodes)
  const isGraphEmpty = useDirectedGraph(state => state.isEmpty)
  const updateCoords = useDirectedGraph(state => state.updateCoords)
  const getCoords = useDirectedGraph(state => state.getCoords)

  // const [{x, y}, setCoordinates] = useState<Coordinates>(defaultCoordinates);
  const mouseSensor = useSensor(MouseSensor)
  const touchSensor = useSensor(TouchSensor)
  const keyboardSensor = useSensor(KeyboardSensor, {})
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const handleCoordsChange = (event: TonCoordsChange) => {
    const { id, x, y } = event;
    // updateCoords(id, x, y)
  }

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={({active, delta}) => {
        const id = active.id.toString()
        const { x, y } = getCoords(id)
        updateCoords(id, x + delta.x, y + delta.y)
      }}
    >
      <section id="Canvas">
        {/* <Arrow startPoint={{x: 0, y: 0}} endPoint={{x: 382, y: 418}} /> */}
        {isGraphEmpty() && <AddNodeButton>+</AddNodeButton>}
        {Array.from(graphNodes.entries()).map(([key, node]) => {
          return <Node key={key} node={node} onCoordsChange={handleCoordsChange} />
        })}
      </section>
    </DndContext>
  );
}
