import './Node.scss'
import { useEffect, useRef, useState } from 'react';
import { useDirectedGraph, TNode } from '../../../lib/hooks/useDirectedGraph';
import { Point } from '../../Arrow/Arrow';
import { useDraggable } from '@dnd-kit/core';

type NodeProps = {
  className?: string;
  node: TNode;
}

export default function Node({ className, node }: NodeProps) {
  const [isClicked, setIsClicked] = useState(false);
  const [coordinates, setCoordinates] = useState<Point>({x: 0, y: 0})
  
  const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
    id: 'draggable',
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const handleRightClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    setIsClicked(prev => !prev)
  }

  useEffect(() => {
    if (isDragging) setIsClicked(false)
  }, [isDragging])

  // useEffect(() => {
  //   if (ref.current) {
  //     const rect = ref.current.getBoundingClientRect();
  //     setCoordinates({ x: rect.x, y: rect.y })
  //   }
  // }, [])

  return (
    <div className='Node__wrapper' style={style}>
      <button 
        className={`Node${className ? ` ${className}` : ''}${isClicked && !isDragging ? ' Node--clicked': ''}`} 
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        onContextMenu={handleRightClick}
      >
        {node.value ? node.value : "Node"}
      </button>

      <PlusButton className='Node__plus_btn--1' nodeId={node.id} setIsClicked={setIsClicked} />
      <PlusButton className='Node__plus_btn--2' nodeId={node.id} setIsClicked={setIsClicked} />
      <PlusButton className='Node__plus_btn--3' nodeId={node.id} setIsClicked={setIsClicked} />
      <PlusButton className='Node__plus_btn--4' nodeId={node.id} setIsClicked={setIsClicked} />
    </div>
  )
}



type PlusButtonProps = {
  className: string;
  nodeId: string;
  setIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

function PlusButton({ className, nodeId, setIsClicked }: PlusButtonProps) {

  const addNode = useDirectedGraph(state => state.addNode)
  const addEdge = useDirectedGraph(state => state.addEdge)

  const handleClick = () => {
    const newNodeId = addNode(null);
    addEdge({ from: nodeId, to: newNodeId })
    setIsClicked(false)    
  }

  return (
    <span 
      className={`Node__plus_btn${className ? ` ${className}`: ''}`}
      onClick={handleClick}
    >
      +
    </span>
  )
}
