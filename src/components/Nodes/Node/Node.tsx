import './Node.scss'
import SubNodeButton from './SubNodeButton';
import { TNode } from '../../../lib/types';
import { useDraggable } from '@dnd-kit/core';
import { useNode } from './useNode';
import { Settings, TextCursorInput, CornerDownLeft, Check, X } from 'lucide-react';
import NewNodeIcon from '../../Icons/NewNodeIcon';
import DeleteNodeIcon from '../../Icons/DeleteNodeIcon';
import NewEdgeIcon from '../../Icons/NewEdgeIcon';
import StartNodeIcon from '../../Icons/StartNodeIcon';
import EndNodeIcon from '../../Icons/EndNodeIcon';
import Arrow from '../../Arrow/Arrow';
import { calcEdgeCoords, calcNodeCenter } from '../../../lib/util';
import { ARROW_CONFIG, NODE_RADIUS } from '../../../lib/constants';


type NodeProps = {
  children?: React.ReactNode
  className?: string;
  node: TNode;
}

export default function Node({ className, node }: NodeProps) {
  
  const {attributes, listeners, setNodeRef, setActivatorNodeRef, isDragging} = useDraggable({ id: node.id });
  const { 
    isClicked,
    inSettings,
    isRenaming,
    addingEdgeData,
    nodeValue, 
    isMenuLocked,
    handleRightClick,
    handleBlur, 
    handleAddNode,
    handleAddEdge,
    handleSelectNodeAddEdge,
    handleAddEdgeHover,
    handleAddEdgeLeave,
    handleDeleteNode,
    handleSettingNode,
    handleSettingsBack,
    handleRenameNode,
    handleStartNode,
    handleEndNode,
    handleRenameChange,
    handleConfirm,
    handleCancel
  } = useNode({ node, isDragging });
  
  const style = {
        top: `${node.coords.y}px`,
        left: `${node.coords.x}px`,
  } as React.CSSProperties

  const classNameString = 
    `Node${className ? ' ' + className : ''}` + 
    `${isClicked ? ' Node--clicked' : ''}` +
    `${inSettings ? ' Node--settings' : ''}` +
    `${isRenaming ? ' Node--confirmation' : ''}` +
    `${isDragging ? ' Node--dragging' : ''}` +
    `${addingEdgeData.isActive && addingEdgeData.startNode?.id === node.id ? ' Node--addingEdge' : ''}` +
    `${node.isStartNode ? ' Node--startNode' : ''}` +
    `${node.isEndNode ? ' Node--endNode' : ''}`


  const nodeCenter = calcNodeCenter(node.coords)
  const arrowStartCoords = { x: nodeCenter.x - (2 * NODE_RADIUS), y: nodeCenter.y }
  const { startCoords, endCoords } = calcEdgeCoords(arrowStartCoords, nodeCenter)

  return (
    <>
    {/* Starting Node Arrow */}
    {node.isStartNode && 
      <Arrow className='Node__startArrow' edgeId={null} startPoint={startCoords} endPoint={endCoords} isDisabled isLocked />
    }
    <div 
      className={classNameString}
      ref={setNodeRef}
      onContextMenu={handleRightClick}
      onBlur={handleBlur}
      tabIndex={0}
      style={style}
    >
        {/* Covers node when adding edge to allow for self loops */}
        <div className="Node__addEdgeOverlay" onClick={handleSelectNodeAddEdge} onMouseOver={handleAddEdgeHover} onMouseLeave={handleAddEdgeLeave} />
        <button 
          className="Node__content"  
          ref={setActivatorNodeRef}
          {...listeners}
          {...attributes}
          disabled={isMenuLocked()}
          >
          {!isRenaming && node.value ? node.value : ""}
        </button>
        
        {/* Renaming Input */}
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
        <SubNodeButton 
          className='Node__subNodeBtn--1' 
          onClick={handleAddNode}
          >
          <NewNodeIcon />
        </SubNodeButton>
        
        {/* Add Edge */}
        <SubNodeButton 
          className='Node__subNodeBtn--2'
          onClick={handleAddEdge}
          >
          <NewEdgeIcon />
        </SubNodeButton>
        
        {/* Delete Node */}
        <SubNodeButton 
          className='Node__subNodeBtn--3' 
          onClick={handleDeleteNode}
          >
          <DeleteNodeIcon />
        </SubNodeButton>
        
        {/* Settings */}
        <SubNodeButton 
          className='Node__subNodeBtn--4' 
          onClick={handleSettingNode}
          >
          <Settings />
        </SubNodeButton>

        {/* Rename Node */}
        <SubNodeButton 
          className='Node__subNodeBtn--5'
          onClick={handleRenameNode}
          >
          <TextCursorInput />
        </SubNodeButton>

        {/* Set Starting Node */}
        <SubNodeButton 
          className='Node__subNodeBtn--6'
          onClick={handleStartNode}
          >
          <StartNodeIcon />
        </SubNodeButton>

        {/* Set Ending Node */}
        <SubNodeButton 
          className='Node__subNodeBtn--7'
          onClick={handleEndNode}
          >
          <EndNodeIcon />
        </SubNodeButton>

        {/* Go Back */}
        <SubNodeButton 
          className='Node__subNodeBtn--8'
          onClick={handleSettingsBack}
          >
          <CornerDownLeft strokeWidth={2} />    
        </SubNodeButton>

        {/* Confirm */}
        <SubNodeButton 
          className='Node__subNodeBtn--confirm'
          onClick={handleConfirm}
          >
          <Check strokeWidth={3} />
        </SubNodeButton>

        {/* Cancel */}
        <SubNodeButton 
          className='Node__subNodeBtn--cancel'
          onClick={handleCancel}
          >
          <X strokeWidth={3} />
        </SubNodeButton>
    </div>
    </>
  )
}