import "./Canvas.scss";
import { useEffect, useMemo, useState } from "react";
import { DragMoveEvent, DragStartEvent } from "@dnd-kit/core/dist/types";
import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { TEdgeCoords, useDirectedGraph } from "../../lib/stores/useDirectedGraph";
import { useConnectNodes } from "../../lib/stores/useConnectNodes";
import { Coords } from "../../lib/types";
import Node from "../Nodes/Node/Node";
import AddNodeButton from "../Buttons/AddNodeButton/AddNodeButton";
import Arrow from "../Arrow/Arrow";
import NewNodeIcon from "../Icons/NewNodeIcon";
import { ARROW_CONFIG, NODE_DIAMETER } from "../../lib/constants";


export default function Canvas() {
  const [startCoords, setStartCoords] = useState<Coords | null>(null)  
  
  const mouseSensor = useSensor(MouseSensor)
  const touchSensor = useSensor(TouchSensor)
  const keyboardSensor = useSensor(KeyboardSensor, {})
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const graphNodes = useDirectedGraph(state => state.nodes)
  const getAllOutgoingEdgesCoords = useDirectedGraph(state => state.getAllOutgoingEdgesCoords)
  const isGraphEmpty = useDirectedGraph(state => state.isEmpty)
  const updateCoords = useDirectedGraph(state => state.updateCoords)
  const getCoords = useDirectedGraph(state => state.getCoords)

  const isAddingEdge = useConnectNodes(state => state.isAddingEdge)

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
        {getAllOutgoingEdgesCoords().map((edge, index) => {
          const { startCoords, endCoords } = calcArrowCoords(edge)
          return <Arrow key={index} startPoint={startCoords} endPoint={endCoords} config={ARROW_CONFIG} />
        })}

        {/* Arrow when adding new Edge */}
        {isAddingEdge ? <AddEdgeArrow /> : null}
      </section>
    </DndContext>
  );
}

function calcArrowCoords(edge: TEdgeCoords) {
  const { startCoords, endCoords } = edge
  const nodeRadius = NODE_DIAMETER / 2;
  const startCenter = { x: startCoords.x + nodeRadius, y: startCoords.y + nodeRadius}
  const endCenter = { x: endCoords.x + nodeRadius, y: endCoords.y + nodeRadius}

  const dx = endCenter.x - startCenter.x;
  const dy = endCenter.y - startCenter.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  const unitX = dx / distance;
  const unitY = dy / distance;
  
  const endX = endCenter.x - nodeRadius * unitX;
  const endY = endCenter.y - nodeRadius * unitY;

  return { startCoords: startCenter, endCoords: {x: endX, y: endY} }
}

function AddEdgeArrow() {
  const isAddingEdge = useConnectNodes(state => state.isAddingEdge)

  const addingEdgeStartNode = useConnectNodes(state => state.startNode)
  const addingEdgeEndNode = useConnectNodes(state => state.endNode)
  const mouseCoords = useConnectNodes(state => state.mouseCoords)
  const setMouseCoords = useConnectNodes(state => state.setMouseCoords)

  useEffect(() => {
    if (!isAddingEdge) return;

    const handleMouseMove = (event: MouseEvent) => {
      setMouseCoords({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isAddingEdge, setMouseCoords])

  // Early return if addingEdgeStartNode is null
  if (!addingEdgeStartNode) return null

  const startCoords = useMemo(() => {
    const {x, y} = addingEdgeStartNode.coords
    return {x: x + (NODE_DIAMETER / 2), y: y + (NODE_DIAMETER / 2)}
  }, [addingEdgeStartNode.coords])

  return (
    <>
    {mouseCoords ? 
      <Arrow 
        config={ARROW_CONFIG}
        key={addingEdgeStartNode.id} 
        startPoint={startCoords}
        endPoint={addingEdgeEndNode ? addingEdgeEndNode.coords : mouseCoords}
      /> : null
    }
    </>
  )
}