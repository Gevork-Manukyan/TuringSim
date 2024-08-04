import './Node.scss'
import NodeSettingButton from './NodeSettingButton';
import { TNode } from '../../../lib/hooks/useDirectedGraph';
import { useDraggable } from '@dnd-kit/core';
import { useNode } from './useNode';
import { Settings, Trash2, ArrowRightFromLine, TextCursorInput, CircleDot, CircleArrowRight, CornerDownLeft } from 'lucide-react';
import NewNodeIcon from '../../Icons/NewNodeIcon';
import DeleteNodeIcon from '../../Icons/DeleteNodeIcon';
import NewEdgeIcon from '../../Icons/NewEdgeIcon';
import StartNodeIcon from '../../Icons/StartNodeIcon';
import EndNodeIcon from '../../Icons/EndNodeIcon';


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
                    `${inSettings && !isDragging ? ' Node--settings' : ''}` +
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
          <NewNodeIcon />
        </NodeSettingButton>
        
        <NodeSettingButton 
          className='Node__settingBtn--2' 
          // onClick={}
        >
          <NewEdgeIcon />
        </NodeSettingButton>
        
        <NodeSettingButton 
          className='Node__settingBtn--3' 
          onClick={handleDeleteNode}
        >
          <DeleteNodeIcon />
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
          <TextCursorInput />
        </NodeSettingButton>

        <NodeSettingButton 
          className='Node__settingBtn--6'
        >
          <StartNodeIcon />
        </NodeSettingButton>

        <NodeSettingButton 
          className='Node__settingBtn--7'
        >
          <EndNodeIcon />
        </NodeSettingButton>

        <NodeSettingButton 
          className='Node__settingBtn--8'
        >
          <CornerDownLeft strokeWidth={2} />    
        </NodeSettingButton>
      </div>
  )
}