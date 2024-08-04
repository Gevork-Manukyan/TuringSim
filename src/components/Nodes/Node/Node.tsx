import './Node.scss'
import NodeSettingButton from './NodeSettingButton';
import { TNode } from '../../../lib/hooks/useDirectedGraph';
import { useDraggable } from '@dnd-kit/core';
import { useNode } from './useNode';
import { Settings, CirclePlus, Trash2, ArrowRightFromLine, TextCursorInput } from 'lucide-react';


type NodeProps = {
  className?: string;
  node: TNode;
}

export default function Node({ className, node }: NodeProps) {
  
  const {attributes, listeners, setNodeRef, isDragging} = useDraggable({ id: node.id });
  const { 
    isClicked,
    inSettings,
    handleRightClick, 
    handleBlur, 
    handleAddNode, 
    handleDeleteNode, 
    handleSettingNode 
  } = useNode({ node, isDragging });
  
  const style = {
        top: `${node.coords.y}px`,
        left: `${node.coords.x}px`,
  } as React.CSSProperties




  const classNameString = `Node${className ? ' ' + className : ''}` + 
                    `${isClicked && !isDragging ? ' Node--clicked' : ''}` +
                    `${inSettings ? ' Node--settings' : ''}` +
                    `${isDragging ? ' Node--dragging' : ''}`

  return (
    <div 
      className={classNameString}
      ref={setNodeRef}
      onContextMenu={handleRightClick}
      onBlur={handleBlur}
      tabIndex={0}
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
          onClick={handleAddNode}
        >
          <CirclePlus size={27} />
        </NodeSettingButton>
        
        <NodeSettingButton 
          className='Node__settingBtn--2' 
          // onClick={}
        >
          <ArrowRightFromLine size={27} />
        </NodeSettingButton>
        
        <NodeSettingButton 
          className='Node__settingBtn--3' 
          onClick={handleDeleteNode}
        >
          <Trash2 size={27} />
        </NodeSettingButton>
        
        <NodeSettingButton 
          className='Node__settingBtn--4' 
          onClick={handleSettingNode}
        >
          <Settings />
        </NodeSettingButton>

        <NodeSettingButton 
          className='Node__settingBtn--5'
        >
          
        </NodeSettingButton>

        <NodeSettingButton 
          className='Node__settingBtn--6'
        >
          
        </NodeSettingButton>

        <NodeSettingButton 
          className='Node__settingBtn--7'
        >
          
        </NodeSettingButton>

        <NodeSettingButton 
          className='Node__settingBtn--8'
        >
          <TextCursorInput />
        </NodeSettingButton>
      </div>
  )
}
