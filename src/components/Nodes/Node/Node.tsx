import './Node.scss'
import { useEffect, useState } from 'react';
import { useDirectedGraph, TNode } from '../../../lib/hooks/useDirectedGraph';
import { useDraggable } from '@dnd-kit/core';
import { Transform } from '@dnd-kit/utilities';
import { Draggable } from '../../Draggable/Draggable';


function getStyles(transform: Transform | null) {
  return transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;
}

type NodeProps = {
  className?: string;
  node: TNode;
}

export default function Node({ className, node }: NodeProps) {
  
  /* VARIABLES */
  const [isClicked, setIsClicked] = useState(false);
  const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
    id: node.id,
  });
  const style = getStyles(transform)


  /* FUNCTIONS */
  useEffect(() => { isDragging ? setIsClicked(false) : null }, [isDragging])

  const handleRightClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    setIsClicked(prev => !prev)
  }

  return (
    <div className='Node__wrapper'>
      {/* <button 
        className={`Node${className ? ` ${className}` : ''}${isClicked && !isDragging ? ' Node--clicked': ''}`} 
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        onContextMenu={handleRightClick}
      >
        {node.value ? node.value : "Node"}
      </button> */}

      <Draggable
        className={`Node${className ? ` ${className}` : ''}${isClicked && !isDragging ? ' Node--clicked': ''}`} 
        ref={setNodeRef}
        dragging={isDragging}  
        listeners={listeners}
        onContextMenu={handleRightClick}
        style={style}
        transform={transform}
        {...attributes}
      >
        {node.value ? node.value : "Node"}

        <PlusButton className='Node__plus_btn--1' nodeId={node.id} setIsClicked={setIsClicked} />
        <PlusButton className='Node__plus_btn--2' nodeId={node.id} setIsClicked={setIsClicked} />
        <PlusButton className='Node__plus_btn--3' nodeId={node.id} setIsClicked={setIsClicked} />
        <PlusButton className='Node__plus_btn--4' nodeId={node.id} setIsClicked={setIsClicked} />
      </Draggable>
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
