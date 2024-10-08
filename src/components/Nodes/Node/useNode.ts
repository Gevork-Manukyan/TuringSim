import { useCallback, useEffect, useState } from "react"
import { useDirectedGraph } from "../../../lib/stores/useDirectedGraph";
import { useConnectNodes } from "../../../lib/stores/useConnectNodes";
import { TNode } from "../../../lib/types";

type useNodeProps = {
    node: TNode;
    isDragging: boolean;
}

export function useNode({ node, isDragging }: useNodeProps) {
  const [isClicked, setIsClicked] = useState(false);
  const [inSettings, setInSettings] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [nodeValue, setNodeValue] = useState(node.value);
  
  const addNode = useDirectedGraph(state => state.addNode);
  const addEdge = useDirectedGraph(state => state.addEdge);
  const removeNode = useDirectedGraph(state => state.removeNode);
  const renameNode = useDirectedGraph(state => state.renameNode);

  const isAddingEdge = useConnectNodes(state => state.isAddingEdge);
  const addEdgeStartNode = useConnectNodes(state => state.startNode);
  const setIsAddingEdge = useConnectNodes(state => state.setIsAddingEdge);
  const setConnectingEdgeStartNode = useConnectNodes(state => state.setStartNode);
  const setEndNode = useConnectNodes(state => state.setEndNode);
  const setMouseCoords = useConnectNodes(state => state.setMouseCoords);
  const addingEdgeData = { isActive: isAddingEdge, startNode: addEdgeStartNode }

  useEffect(() => { isDragging ? closeMenus() : null }, [isDragging])


  const resetAllState = () => {
    closeMenus();
    setIsAddingEdge(false);
  }

  const isMenuLocked = () => {
    return isAddingEdge;
  }

  const closeMenus = () => {
    setIsClicked(false)
    setInSettings(false)
  }

  const handleRightClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    if (isMenuLocked()) return;
    setInSettings(false)
    setIsClicked(prev => !prev)
  }

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLDivElement, Element>) => {
      const currentTarget = event.currentTarget;

      // Give browser time to focus the next element
      requestAnimationFrame(() => {
        // Check if the new focused element is a child of the original container
        if (!currentTarget.contains(document.activeElement)) {
          closeMenus()
        }
      })
    },
    []
  )

  const handleAddNode = () => {
    const newNodeId = addNode(null);
    addEdge({fromId: node.id, toId: newNodeId, value: "" })
    setIsClicked(false)    
  }

  const handleAddEdge = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    setConnectingEdgeStartNode(node)
    setMouseCoords({ x: event.clientX, y: event.clientY })
    setIsAddingEdge(true)
    closeMenus()
  }

  const handleSelectNodeAddEdge = () => {
    addEdge({ fromId: addEdgeStartNode!.id, toId: node.id, value: "" })
    setMouseCoords(null)
    setIsAddingEdge(false)
  }

  const handleAddEdgeHover = () => {
    setEndNode(node)
  }

  const handleAddEdgeLeave = () => {
    setEndNode(null)
  }

  const handleDeleteNode = () => {
    removeNode(node.id)
    resetAllState()  
  }

  const handleSettingNode = () => {
    setIsClicked(false)
    setInSettings(true)
  }

  const handleSettingsBack = () => {
    setIsClicked(true)
    setInSettings(false)
  }

  const handleRenameNode = () => {
    setIsClicked(false);
    setInSettings(false);
    setIsRenaming(true);
  }

  const handleRenameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation()
    setNodeValue(event.target.value)
  }

  const handleConfirm = () => {    
    renameNode(node.id, nodeValue)
    setIsRenaming(false);
  }

  const handleCancel = () => {
    if (isRenaming) {
      setNodeValue(node.value)
      setIsRenaming(false);
    }
    else if (isAddingEdge) {
      setIsAddingEdge(false)
    }
  }

  return {
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
    handleRenameChange,
    handleConfirm,
    handleCancel
  }
}