import './Node.scss'
import SubNodeButton from './SubNodeButton';
import { TNode } from '../../../lib/types';
import { useDraggable } from '@dnd-kit/core';
import { useNode } from './useNode';
import { TextCursorInput, Check, X } from 'lucide-react';
import NewNodeIcon from '../../Icons/NewNodeIcon';
import DeleteNodeIcon from '../../Icons/DeleteNodeIcon';
import NewEdgeIcon from '../../Icons/NewEdgeIcon';
import StartNodeIcon from '../../Icons/StartNodeIcon';
import EndNodeIcon from '../../Icons/EndNodeIcon';
import Arrow from '../../Arrow/Arrow';
import { calcEdgeCoords, calcNodeCenter } from '../../../lib/util';
import { NODE_RADIUS } from '../../../lib/constants';
import { useDirectedGraph } from '../../../lib/stores/useDirectedGraph';

type NodeProps = {
  children?: React.ReactNode
  className?: string;
  node: TNode;
}

const MENU_RADIUS = 82;

export default function Node({ className, node }: NodeProps) {

  const { attributes, listeners, setNodeRef, setActivatorNodeRef, isDragging } = useDraggable({ id: node.id });
  const {
    isMenuOpen,
    isRenaming,
    addingEdgeData,
    nodeValue,
    isMenuLocked,
    handleNodeClick,
    handleRightClick,
    handleAddNode,
    handleAddEdge,
    handleSelectNodeAddEdge,
    handleAddEdgeHover,
    handleAddEdgeLeave,
    handleDeleteNode,
    handleRenameNode,
    handleStartNode,
    handleEndNode,
    handleRenameChange,
    handleRenameKeyDown,
    handleConfirm,
    handleCancel
  } = useNode({ node, isDragging });

  const simulation = useDirectedGraph(state => state.simulation);
  const isActive = simulation?.activeNodeIds.includes(node.id) ?? false;
  const isAccepted = isActive && simulation?.status === 'accepted';
  const isRejected = isActive && simulation?.status === 'rejected';

  // The radial actions, ordered clockwise from the top of the ring.
  const actions = [
    { key: 'rename', title: 'Rename', icon: <TextCursorInput />, onClick: handleRenameNode },
    { key: 'addEdge', title: 'Add transition', icon: <NewEdgeIcon />, onClick: handleAddEdge },
    { key: 'addNode', title: 'Add connected node', icon: <NewNodeIcon />, onClick: handleAddNode },
    { key: 'delete', title: 'Delete', icon: <DeleteNodeIcon />, onClick: handleDeleteNode, danger: true },
    { key: 'start', title: 'Toggle start state', icon: <StartNodeIcon />, onClick: handleStartNode },
    { key: 'accept', title: 'Toggle accept state', icon: <EndNodeIcon />, onClick: handleEndNode },
  ];

  const style = {
    top: `${node.coords.y}px`,
    left: `${node.coords.x}px`,
  } as React.CSSProperties

  const classNameString =
    `Node${className ? ' ' + className : ''}` +
    `${isMenuOpen ? ' Node--menu' : ''}` +
    `${isRenaming ? ' Node--renaming' : ''}` +
    `${isDragging ? ' Node--dragging' : ''}` +
    `${addingEdgeData.isActive && addingEdgeData.startNode?.id === node.id ? ' Node--addingEdge' : ''}` +
    `${node.isStartNode ? ' Node--startNode' : ''}` +
    `${node.isEndNode ? ' Node--endNode' : ''}` +
    `${isActive ? ' Node--active' : ''}` +
    `${isAccepted ? ' Node--accepted' : ''}` +
    `${isRejected ? ' Node--rejected' : ''}`


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
        style={style}
      >
        {/* Covers node when adding edge to allow for self loops */}
        <div className="Node__addEdgeOverlay" onClick={handleSelectNodeAddEdge} onMouseOver={handleAddEdgeHover} onMouseLeave={handleAddEdgeLeave} />
        <button
          className="Node__content"
          ref={setActivatorNodeRef}
          {...listeners}
          {...attributes}
          onClick={handleNodeClick}
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
            onKeyDown={handleRenameKeyDown}
            maxLength={20}
            autoFocus
          />
        }

        {/* Radial action ring */}
        {actions.map((action, i) => {
          const angle = (-90 + i * (360 / actions.length)) * (Math.PI / 180);
          const tx = Math.cos(angle) * MENU_RADIUS;
          const ty = Math.sin(angle) * MENU_RADIUS;
          return (
            <SubNodeButton
              key={action.key}
              className={action.danger ? 'Node__subNodeBtn--danger' : ''}
              title={action.title}
              onClick={action.onClick}
              style={{ '--tx': `${tx}px`, '--ty': `${ty}px`, '--i': i } as React.CSSProperties}
            >
              {action.icon}
            </SubNodeButton>
          );
        })}

        {/* Rename confirm / cancel */}
        {isRenaming &&
          <div className="Node__renameActions">
            <button className="Node__renameBtn Node__renameBtn--confirm" onClick={handleConfirm} title="Confirm">
              <Check strokeWidth={3} size={18} />
            </button>
            <button className="Node__renameBtn Node__renameBtn--cancel" onClick={handleCancel} title="Cancel">
              <X strokeWidth={3} size={18} />
            </button>
          </div>
        }
      </div>
    </>
  )
}
