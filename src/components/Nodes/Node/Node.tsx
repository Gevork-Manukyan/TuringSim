import './Node.scss'
import NodeSettingButton from './NodeSettingButton';
import { useState } from 'react';
import { TNode, useDirectedGraph } from '../../../lib/hooks/useDirectedGraph';
import { useDraggable } from '@dnd-kit/core';
import { useNode } from './useNode';
import { Settings, CirclePlus, Trash2, ArrowRightFromLine } from 'lucide-react';


type NodeProps = {
  className?: string;
  node: TNode;
}

export default function Node({ className, node }: NodeProps) {
  
  const [isClicked, setIsClicked] = useState(false);
  const {attributes, listeners, setNodeRef, isDragging} = useDraggable({ id: node.id });
  const { handleRightClick, handleBlur } = useNode({ isDragging, setIsClicked })
  const addNode = useDirectedGraph(state => state.addNode)
  const addEdge = useDirectedGraph(state => state.addEdge)
  const removeNode = useDirectedGraph(state => state.removeNode)
  
  const style = {
        top: `${node.coords.y}px`,
        left: `${node.coords.x}px`,
  } as React.CSSProperties


  const handleAddNode = () => {
    const newNodeId = addNode(null);
    addEdge(node.id, newNodeId)
    setIsClicked(false)    
  }

  const handleDeleteNode = () => {
    removeNode(node.id)
    setIsClicked(false)    
  }

  return (
    <div 
      className={`Node${className ? ` ${className}` : ''}${isClicked && !isDragging ? ' Node--clicked': ''}${isDragging ? ' Node--dragging' : ''}`} 
      ref={setNodeRef}
      onContextMenu={handleRightClick}
      onBlur={handleBlur}
      style={style}
    >
        <button 
          className="Node__content"  
          {...listeners}
          {...attributes}
        >
          {node.value ? node.value : "Node"}
        </button>

        
        <NodeSettingButton 
          className='Node__settingBtn--1' 
          nodeId={node.id} 
          setIsClicked={setIsClicked}
          // onClick={}
        >
          <CirclePlus size={27} />
        </NodeSettingButton>
        
        <NodeSettingButton 
          className='Node__settingBtn--2' 
          nodeId={node.id} 
          setIsClicked={setIsClicked}
          onClick={handleAddNode}
        >
          <ArrowRightFromLine size={27} />
        </NodeSettingButton>
        
        <NodeSettingButton 
          className='Node__settingBtn--3' 
          nodeId={node.id} 
          setIsClicked={setIsClicked}
          onClick={handleDeleteNode}
        >
          <Trash2 size={27} />
        </NodeSettingButton>
        
        <NodeSettingButton 
          className='Node__settingBtn--4' 
          nodeId={node.id} 
          setIsClicked={setIsClicked}
          // onClick={}
        >
          <Settings />
        </NodeSettingButton>
      </div>
  )
}
