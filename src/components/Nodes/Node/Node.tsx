import './Node.scss'
import { useState } from 'react';
import { TNode } from '../../../lib/hooks/useDirectedGraph';
import { useDraggable } from '@dnd-kit/core';
import { useNode } from './useNode';
import PlusButton from './PlusButton';



type NodeProps = {
  className?: string;
  node: TNode;
}

export default function Node({ className, node }: NodeProps) {
  
  const [isClicked, setIsClicked] = useState(false);
  const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({ id: node.id });
  const { handleRightClick } = useNode({ isDragging, transform, node, setIsClicked })
  
  const style = {
        top: `${node.coords.y}px`,
        left: `${node.coords.x}px`,
        transform: `translate(${transform?.x ?? 0}px, ${transform?.y ?? 0}px)`,
  } as React.CSSProperties

  return (
    <div 
      className={`Node${className ? ` ${className}` : ''}${isClicked && !isDragging ? ' Node--clicked': ''}`} 
      ref={setNodeRef}
      onContextMenu={handleRightClick}
      style={style}
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
