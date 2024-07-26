import "./Canvas.scss";
import { useDirectedGraph } from "../../lib/hooks/useDirectedGraph";
import { useState } from "react";
import { DndContext, KeyboardSensor, MouseSensor, PointerActivationConstraint, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Coordinates } from "@dnd-kit/core/dist/types";
import Node from "../Nodes/Node/Node";
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

  const [{x, y}, setCoordinates] = useState<Coordinates>(defaultCoordinates);
  const mouseSensor = useSensor(MouseSensor)
  const touchSensor = useSensor(TouchSensor)
  const keyboardSensor = useSensor(KeyboardSensor, {})
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={({active, delta}) => {
        setCoordinates(({x, y}) => {
          return {
            x: x + delta.x,
            y: y + delta.y
          }
        })
      }}
    >
      <section id="Canvas">
        {/* <Arrow startPoint={{x: 0, y: 0}} endPoint={{x: 382, y: 418}} /> */}
        {isGraphEmpty() && <AddNodeButton>+</AddNodeButton>}
        {Array.from(graphNodes.entries()).map(([key, node]) => {
          return <Node key={key} node={node} />
        })}
      </section>
    </DndContext>
  );
}
