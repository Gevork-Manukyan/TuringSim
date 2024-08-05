import './Node.scss'
import NodeSettingButton from './NodeSettingButton';
import { TNode } from '../../../lib/hooks/useDirectedGraph';
import { useDraggable } from '@dnd-kit/core';
import { useNode } from './useNode';
import { Settings, TextCursorInput, CornerDownLeft, Check, X } from 'lucide-react';
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
    isRenaming,
    nodeValue,
    handleRightClick, 
    handleBlur, 
    handleAddNode, 
    handleDeleteNode, 
    handleSettingNode,
    handleSettingsBack,
    handleRenameNode,
    handleRenameChange
  } = useNode({ node, isDragging });
  
  const style = {
        top: `${node.coords.y}px`,
        left: `${node.coords.x}px`,
  } as React.CSSProperties

  const classNameString = `Node${className ? ' ' + className : ''}` + 
                    `${isClicked ? ' Node--clicked' : ''}` +
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
          {!isRenaming && nodeValue ? nodeValue : ""}
        </button>
        {isRenaming && 
          <input 
            className='Node__renameInput' 
            type='text' 
            value={nodeValue ? nodeValue : ''} 
            onChange={handleRenameChange} 
            maxLength={29} 
            autoFocus 
          />
        }

        
        <NodeSettingButton 
          className='Node__settingBtn--1' 
          onClick={handleAddNode}
        >
          <NewNodeIcon />
        </NodeSettingButton>
        
        <NodeSettingButton 
          className='Node__settingBtn--2' 
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
          onClick={handleRenameNode}
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
          onClick={handleSettingsBack}
        >
          <CornerDownLeft strokeWidth={2} />    
        </NodeSettingButton>

        <NodeSettingButton 
          className='Node__settingBtn--confirm'
        >
          <Check strokeWidth={3} />
        </NodeSettingButton>

        <NodeSettingButton 
          className='Node__settingBtn--cancel'
        >
          <X strokeWidth={3} />
        </NodeSettingButton>
      </div>
  )
}