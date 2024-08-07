import './Node.scss'
import NodeSettingButton from './NodeSettingButton';
import { TNode } from '../../../lib/stores/useDirectedGraph';
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
    isNodeLocked,
    handleRightClick,
    handleBlur, 
    handleAddNode,
    handleAddEdge,
    handleDeleteNode,
    handleSettingNode,
    handleSettingsBack,
    handleRenameNode,
    handleRenameChange,
    handleConfirm,
    handleCancel
  } = useNode({ node, isDragging });
  
  const style = {
        top: `${node.coords.y}px`,
        left: `${node.coords.x}px`,
  } as React.CSSProperties

  const classNameString = `Node${className ? ' ' + className : ''}` + 
                    `${isClicked ? ' Node--clicked' : ''}` +
                    `${inSettings ? ' Node--settings' : ''}` +
                    `${isRenaming ? ' Node--confirmation' : ''}` +
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
          {!isRenaming && node.value ? node.value : ""}
        </button>
        {isRenaming && 
          <input 
            className='Node__renameInput' 
            type='text' 
            value={nodeValue ? nodeValue : ''}
            onFocus={e => e.target.select()}
            onChange={handleRenameChange} 
            maxLength={20} 
            autoFocus 
          />
        }

        {/* Add Node */}
        <NodeSettingButton 
          className='Node__settingBtn--1' 
          onClick={handleAddNode}
        >
          <NewNodeIcon />
        </NodeSettingButton>
        
        {/* Add Edge */}
        <NodeSettingButton 
          className='Node__settingBtn--2'
          onClick={handleAddEdge}
        >
          <NewEdgeIcon />
        </NodeSettingButton>
        
        {/* Delete Node */}
        <NodeSettingButton 
          className='Node__settingBtn--3' 
          onClick={handleDeleteNode}
        >
          <DeleteNodeIcon />
        </NodeSettingButton>
        
        {/* Settings */}
        <NodeSettingButton 
          className='Node__settingBtn--4' 
          onClick={handleSettingNode}
        >
          <Settings />
        </NodeSettingButton>

        {/* Rename Node */}
        <NodeSettingButton 
          className='Node__settingBtn--5'
          onClick={handleRenameNode}
        >
          <TextCursorInput />
        </NodeSettingButton>

        {/* Set Starting Node */}
        <NodeSettingButton 
          className='Node__settingBtn--6'
        >
          <StartNodeIcon />
        </NodeSettingButton>

        {/* Set Ending Node */}
        <NodeSettingButton 
          className='Node__settingBtn--7'
        >
          <EndNodeIcon />
        </NodeSettingButton>

        {/* Go Back */}
        <NodeSettingButton 
          className='Node__settingBtn--8'
          onClick={handleSettingsBack}
        >
          <CornerDownLeft strokeWidth={2} />    
        </NodeSettingButton>

        {/* Confirm */}
        <NodeSettingButton 
          className='Node__settingBtn--confirm'
          onClick={handleConfirm}
        >
          <Check strokeWidth={3} />
        </NodeSettingButton>

        {/* Cancel */}
        <NodeSettingButton 
          className='Node__settingBtn--cancel'
          onClick={handleCancel}
        >
          <X strokeWidth={3} />
        </NodeSettingButton>
      </div>
  )
}