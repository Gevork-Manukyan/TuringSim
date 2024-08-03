import { useEffect } from "react"

type useNodeProps = {
    isDragging: boolean;
    setIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useNode({ isDragging, setIsClicked }: useNodeProps) {
  useEffect(() => { isDragging ? setIsClicked(false) : null }, [isDragging])

  const handleRightClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    setIsClicked(prev => !prev)
  }

  const handleBlur = () => {
    setIsClicked(false);
  }

  return {
    handleRightClick,
    handleBlur
  }
}