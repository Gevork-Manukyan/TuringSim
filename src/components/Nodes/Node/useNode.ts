import { useEffect } from "react"
import { Transform } from '@dnd-kit/utilities';
import { TNode } from "../../../lib/hooks/useDirectedGraph";
import { TonCoordsChange } from "./Node";

type useNodeProps = {
    isDragging: boolean;
    transform: Transform | null;
    node: TNode; 
    setIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
    onCoordsChange?: (params: TonCoordsChange) => void | undefined; 
}

export function useNode({ isDragging, transform, node, setIsClicked, onCoordsChange }: useNodeProps) {
  useEffect(() => { isDragging ? setIsClicked(false) : null }, [isDragging])

  useEffect(() => {
    if (onCoordsChange) onCoordsChange({ id: node.id, x: transform?.x ?? 0, y: transform?.y ?? 0 })
  }, [transform])

  const handleRightClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    setIsClicked(prev => !prev)
  }

  return {
    handleRightClick
  }
}