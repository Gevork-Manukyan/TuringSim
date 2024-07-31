import { useEffect } from "react"
import { Transform } from '@dnd-kit/utilities';
import { TNode } from "../../../lib/hooks/useDirectedGraph";

type useNodeProps = {
    isDragging: boolean;
    transform: Transform | null;
    node: TNode; 
    setIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useNode({ isDragging, setIsClicked }: useNodeProps) {
  useEffect(() => { isDragging ? setIsClicked(false) : null }, [isDragging])

  const handleRightClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    setIsClicked(prev => !prev)
  }

  return {
    handleRightClick
  }
}