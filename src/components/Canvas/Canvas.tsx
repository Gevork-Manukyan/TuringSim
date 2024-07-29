import "./Canvas.scss";
import { Coords, useDirectedGraph } from "../../lib/hooks/useDirectedGraph";
import Node, { TonChange } from "../Nodes/Node/Node";
import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import AddNodeButton from "../Buttons/AddNodeButton/AddNodeButton";
import { Coordinates } from "@dnd-kit/core/dist/types";
import EndNode from "../Nodes/EndNode/EndNode";
import Arrow from "../Arrow/Arrow";
import { useMemo } from "react";

type ArrowData = { 
  startCoords: Coords, 
  endCoords: Coords 
}

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

  // TODO: Canvas needs to track all the arrows between nodes. Use the handleChange function to update the arrows of a node (incoming/outgoing) when the node is changed
  const handleChange = (event: TonChange) => {
    const { node, x, y } = event;

  }

  const arrows: ArrowData[] = useMemo(() => {
    const arrowList: ArrowData[] = [];
    graphNodes.forEach((node, nodeId) => {
      node.outgoingEdges.forEach(targetId => {
        const startCoords = getCoords(nodeId);
        const endCoords = getCoords(targetId);
        arrowList.push({ startCoords, endCoords });
      });
    });
    return arrowList;
  }, [graphNodes, getCoords]);

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
        {isGraphEmpty() && <AddNodeButton>+</AddNodeButton>}
        {Array.from(graphNodes.entries()).map(([key, node]) => {
          return <Node key={key} node={node} onChange={handleChange} />
        })}
        {arrows.map((arrow, index) => (
          <Arrow key={index} startPoint={arrow.startCoords} endPoint={arrow.endCoords} />
        ))}
      </section>
    </DndContext>
  );
}
