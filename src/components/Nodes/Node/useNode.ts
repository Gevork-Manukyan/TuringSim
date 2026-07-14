import { useEffect, useRef, useState } from "react"
import { useDirectedGraph } from "../../../lib/stores/useDirectedGraph";
import { useConnectNodes } from "../../../lib/stores/useConnectNodes";
import { useSelection } from "../../../lib/stores/useSelection";
import { TNode } from "../../../lib/types";
import { NODE_DIAMETER } from "../../../lib/constants";
import { toCanvasCoords } from "../../../lib/util";

type useNodeProps = {
    node: TNode;
    isDragging: boolean;
}

export function useNode({ node, isDragging }: useNodeProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [nodeValue, setNodeValue] = useState(node.value);

  const addNode = useDirectedGraph(state => state.addNode);
  const addEdge = useDirectedGraph(state => state.addEdge);
  const removeNode = useDirectedGraph(state => state.removeNode);
  const renameNode = useDirectedGraph(state => state.renameNode);
  const setIsStartNode = useDirectedGraph(state => state.setIsStartNode);
  const setIsEndNode = useDirectedGraph(state => state.setIsEndNode);

  const selectedNodeId = useSelection(state => state.selectedNodeId);
  const toggleSelect = useSelection(state => state.toggle);
  const clearSelection = useSelection(state => state.clear);

  const isAddingEdge = useConnectNodes(state => state.isAddingEdge);
  const addEdgeStartNode = useConnectNodes(state => state.startNode);
  const setIsAddingEdge = useConnectNodes(state => state.setIsAddingEdge);
  const setConnectingEdgeStartNode = useConnectNodes(state => state.setStartNode);
  const setEndNode = useConnectNodes(state => state.setEndNode);
  const setMouseCoords = useConnectNodes(state => state.setMouseCoords);

  const isMenuOpen = selectedNodeId === node.id && !isRenaming && !isAddingEdge;
  const addingEdgeData = { isActive: isAddingEdge, startNode: addEdgeStartNode };

  // Distinguish a click (opens the menu) from the tail end of a drag. isDragging
  // is briefly true during a drag; we keep a flag set until just after it clears
  // so the synthetic click fired after mouseup is ignored.
  const justDragged = useRef(false);
  useEffect(() => {
    if (isDragging) {
      justDragged.current = true;
      clearSelection();
    } else if (justDragged.current) {
      const t = setTimeout(() => { justDragged.current = false }, 0);
      return () => clearTimeout(t);
    }
  }, [isDragging, clearSelection]);

  const isMenuLocked = () => isAddingEdge;

  const handleNodeClick = () => {
    if (isDragging || justDragged.current || isAddingEdge || isRenaming) return;
    toggleSelect(node.id);
  }

  const handleRightClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    if (isMenuLocked() || isRenaming) return;
    toggleSelect(node.id);
  }

  const handleAddNode = () => {
    const startX = node.coords.x;
    const startY = node.coords.y - NODE_DIAMETER - 20;
    const newNodeId = addNode({ value: "", startCoord: { x: startX, y: startY } });
    addEdge({ fromId: node.id, toId: newNodeId, value: "" });
    clearSelection();
  }

  const handleAddEdge = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setConnectingEdgeStartNode(node);
    setMouseCoords(toCanvasCoords(event.clientX, event.clientY));
    setIsAddingEdge(true);
    clearSelection();
  }

  const handleSelectNodeAddEdge = () => {
    if (!addEdgeStartNode) return;
    addEdge({ fromId: addEdgeStartNode.id, toId: node.id, value: "" });
    setMouseCoords(null);
    setIsAddingEdge(false);
  }

  const handleAddEdgeHover = () => setEndNode(node);
  const handleAddEdgeLeave = () => setEndNode(null);

  const handleDeleteNode = () => {
    removeNode(node.id);
    clearSelection();
  }

  const handleStartNode = () => {
    setIsStartNode(node.id, !node.isStartNode);
    clearSelection();
  }

  const handleEndNode = () => {
    setIsEndNode(node.id, !node.isEndNode);
    clearSelection();
  }

  const handleRenameNode = () => {
    setNodeValue(node.value);
    setIsRenaming(true);
  }

  const handleRenameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    setNodeValue(event.target.value);
  }

  const handleConfirm = () => {
    renameNode(node.id, nodeValue);
    setIsRenaming(false);
    clearSelection();
  }

  const handleCancel = () => {
    setNodeValue(node.value);
    setIsRenaming(false);
  }

  const handleRenameKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleConfirm();
    else if (event.key === "Escape") handleCancel();
  }

  return {
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
  }
}
