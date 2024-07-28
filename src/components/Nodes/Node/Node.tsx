import './Node.scss'
import { useState } from 'react';
import { TNode } from '../../../lib/hooks/useDirectedGraph';
import { useDraggable } from '@dnd-kit/core';
import { Transform } from '@dnd-kit/utilities';
import { useNode } from './useNode';
import PlusButton from './PlusButton';


function getStyles(transform: Transform | null) {
  return transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;
}

type NodeProps = {
  className?: string;
  node: TNode;
  onCoordsChange?: ({ id, x, y }: TonCoordsChange) => void;
}

export type TonCoordsChange = {
  id: string;
  x: number;
  y: number;
}

export default function Node({ className, node, onCoordsChange }: NodeProps) {
  
  const [isClicked, setIsClicked] = useState(false);
  const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({ id: node.id });
  const style = getStyles(transform)
  const { handleRightClick } = useNode({ isDragging, transform, node, setIsClicked, onCoordsChange })

  return (
    <div 
      className={`Node${className ? ` ${className}` : ''}${isClicked && !isDragging ? ' Node--clicked': ''}`} 
      ref={setNodeRef}
      onContextMenu={handleRightClick}
      style={
        {
          'top': node.coords.x,
          'left': node.coords.y,
          ...style,
        } as React.CSSProperties
      }
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
