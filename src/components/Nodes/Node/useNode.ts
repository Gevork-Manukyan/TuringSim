import { useCallback, useEffect, useState } from "react"
import { TNode, useDirectedGraph } from "../../../lib/hooks/useDirectedGraph";

type useNodeProps = {
    node: TNode;
    isDragging: boolean;
}

export function useNode({ node, isDragging }: useNodeProps) {
  const [isClicked, setIsClicked] = useState(false);
  const [inSettings, setInSettings] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [nodeValue, setNodeValue] = useState(node.value)
  
  const addNode = useDirectedGraph(state => state.addNode);
  const addEdge = useDirectedGraph(state => state.addEdge);
  const removeNode = useDirectedGraph(state => state.removeNode);


  useEffect(() => { isDragging ? clearStates() : null }, [isDragging])

  const clearStates = () => {
    setIsClicked(false)
    setInSettings(false)
  }

  const handleRightClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
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
          clearStates()
        }
      })
    },
    [setIsClicked]
  )

  const handleAddNode = () => {
    const newNodeId = addNode("Node");
    addEdge(node.id, newNodeId)
    setIsClicked(false)    
  }

  const handleDeleteNode = () => {
    removeNode(node.id)
    setIsClicked(false)    
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
    setIsRenaming(true);
  }

  const handleRenameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation()
    setNodeValue(event.target.value)
  }

  return {
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
  }
}