import './Node.scss'
import { useEffect, useState } from 'react';
import { useDirectedGraph, TNode } from '../../../lib/hooks/useDirectedGraph';
import { useDraggable } from '@dnd-kit/core';
import { Transform } from '@dnd-kit/utilities';


function getStyles(transform: Transform | null) {
  return transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;
}

type NodeProps = {
  className?: string;
  node: TNode;
  onCoordsChange?: ({id, x, y}: {id: string; x: number; y: number}) => void;
}



export default function Node({ className, node, onCoordsChange }: NodeProps) {
  
  /* VARIABLES */
  const [isClicked, setIsClicked] = useState(false);
  const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
    id: node.id,
  });
  const style = getStyles(transform)

  /* FUNCTIONS */
  useEffect(() => { isDragging ? setIsClicked(false) : null }, [isDragging])

  useEffect(() => {
    if (onCoordsChange) onCoordsChange({ id: node.id, x: transform?.x ?? 0, y: transform?.y ?? 0 })
  }, [transform])

  const handleRightClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    setIsClicked(prev => !prev)
  }

  return (
    <div 
      className={`Node${className ? ` ${className}` : ''}${isClicked && !isDragging ? ' Node--clicked': ''}`} 
      style={style}
      ref={setNodeRef}
      onContextMenu={handleRightClick}
    >
        <button 
          className="Node__content"         
          {...listeners}
          {...attributes}
        >
          {node.value ? node.value : "Node"}
        </button>

        <PlusButton className='Node__plusBtn--1' nodeId={node.id} setIsClicked={setIsClicked} />
        <PlusButton className='Node__plusBtn--2' nodeId={node.id} setIsClicked={setIsClicked} />
        <PlusButton className='Node__plusBtn--3' nodeId={node.id} setIsClicked={setIsClicked} />
        <PlusButton className='Node__plusBtn--4' nodeId={node.id} setIsClicked={setIsClicked} />
      </div>
  )
}



type PlusButtonProps = {
  className: string;
  style?: React.CSSProperties;
  nodeId: string;
  setIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

function PlusButton({ className, style, nodeId, setIsClicked }: PlusButtonProps) {

  const addNode = useDirectedGraph(state => state.addNode)
  const addEdge = useDirectedGraph(state => state.addEdge)

  const handleClick = () => {
    const newNodeId = addNode(null);
    addEdge({ from: nodeId, to: newNodeId })
    setIsClicked(false)    
  }

  return (
    <span 
      className={`Node__plusBtn${className ? ` ${className}`: ''}`}
      style={style}
      onClick={handleClick}
      >
      +
    </span>
  )
}
