import { useEffect } from "react"
import { Transform } from '@dnd-kit/utilities';
import { TNode } from "../../../lib/hooks/useDirectedGraph";
import { TonChange } from "./Node";

type useNodeProps = {
    isDragging: boolean;
    transform: Transform | null;
    node: TNode; 
    setIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
    onChange?: (params: TonChange) => void | undefined; 
}

export function useNode({ isDragging, transform, node, setIsClicked, onChange }: useNodeProps) {
  useEffect(() => { isDragging ? setIsClicked(false) : null }, [isDragging])

  useEffect(() => {
    if (onChange) onChange({ node, x: transform?.x ?? 0, y: transform?.y ?? 0 })
  }, [transform])

  const handleRightClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    setIsClicked(prev => !prev)
  }

  return {
    handleRightClick
  }
}