import { useCallback, useEffect, useRef, useState } from "react"
import { TNode, useDirectedGraph } from "../../../lib/hooks/useDirectedGraph";

type useNodeProps = {
    node: TNode;
    isDragging: boolean;
}

export function useNode({ node, isDragging }: useNodeProps) {
  const [isClicked, setIsClicked] = useState(false);
  const [inSettings, setInSettings] = useState(false);
  
  const addNode = useDirectedGraph(state => state.addNode);
  const addEdge = useDirectedGraph(state => state.addEdge);
  const removeNode = useDirectedGraph(state => state.removeNode);


  useEffect(() => { isDragging ? setIsClicked(false) : null }, [isDragging])

  const handleRightClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    setIsClicked(prev => !prev)
  }

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLDivElement, Element>) => {
      const currentTarget = event.currentTarget;

      // Give browser time to focus the next element
      requestAnimationFrame(() => {
        // Check if the new focused element is a child of the original container
        if (!currentTarget.contains(document.activeElement)) {
          setIsClicked(false);
        }
      })
    },
    [setIsClicked]
  )

  const handleAddNode = () => {
    const newNodeId = addNode(null);
    addEdge(node.id, newNodeId)
    setIsClicked(false)    
  }

  const handleDeleteNode = () => {
    removeNode(node.id)
    setIsClicked(false)    
  }

  const handleSettingNode = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    setInSettings(true)
  }

  return {
    isClicked,
    inSettings,
    handleRightClick,
    handleBlur, 
    handleAddNode,
    handleDeleteNode,
    handleSettingNode
  }
}