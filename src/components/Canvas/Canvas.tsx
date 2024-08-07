import "./Canvas.scss";
import { useEffect, useState } from "react";
import { DragMoveEvent, DragStartEvent } from "@dnd-kit/core/dist/types";
import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useDirectedGraph } from "../../lib/stores/useDirectedGraph";
import Node from "../Nodes/Node/Node";
import AddNodeButton from "../Buttons/AddNodeButton/AddNodeButton";
import Arrow from "../Arrow/Arrow";
import NewNodeIcon from "../Icons/NewNodeIcon";
import { useConnectNodes } from "../../lib/stores/useConnectNodes";
import { Coords } from "../../lib/types";


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

  const isAddingEdge = useConnectNodes(state => state.isAddingEdge)
  const addingEdgeStartNode = useConnectNodes(state => state.startNode)
  const addingEdgeEndNode = useConnectNodes(state => state.endNode)

  const [startCoords, setStartCoords] = useState<Coords | null>(null)
  const [mouseCooords, setMouseCoords] = useState<Coords | null>(null)
  

  useEffect(() => {
    if (!isAddingEdge) return;

    const handleMouseMove = (event: MouseEvent) => {
      setMouseCoords({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isAddingEdge])

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
      <section id="Canvas" className={`${isAddingEdge ? 'Canvas--addingEdge' : ''}`}>
        {isGraphEmpty() && <AddNodeButton><NewNodeIcon /></AddNodeButton>}
        
        {/* Render nodes */}
        {Array.from(graphNodes.entries()).map(([key, node]) => {
          return <Node key={key} node={node} />
        })}

        {/* Render arrows connecting Nodes */}
        {getAllOutgoingEdgesCoords().map((edge, index) => (
          <Arrow key={index} startPoint={edge.startCoords} endPoint={edge.endCoords} />
        ))}

        {/* Arrow when adding new Edge */}
        {isAddingEdge && addingEdgeStartNode && mouseCooords ? 
          <Arrow 
            key={addingEdgeStartNode.id} 
            startPoint={addingEdgeStartNode.coords}
            endPoint={addingEdgeEndNode ? addingEdgeEndNode.coords : mouseCooords}
          /> : null
        }
      </section>
    </DndContext>
  );
}
