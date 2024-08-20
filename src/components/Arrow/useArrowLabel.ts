import { useState } from "react"
import { useDirectedGraph } from "../../lib/stores/useDirectedGraph"
import { Edge, EdgeId } from "../../lib/types"

type useArrowLabelProps = {
  label: Edge['value'];
  onClick?: (e: React.MouseEvent) => void;
  edgeId: EdgeId | null;
}

export default function useArrowLabel({ label, onClick, edgeId }: useArrowLabelProps) {
  const renameEdge = useDirectedGraph(state => state.renameEdge)
  const [isEditingLabel, setIsEditingLabel] = useState(false)
  const [arrowLabel, setArrowLabel] = useState(label)
  
  const handleOnClick = (e: React.MouseEvent) => {
    setIsEditingLabel(true)

    if (onClick) onClick(e);
  }

  const handleOnBlur = () => {
    if(isEditingLabel && edgeId) renameEdge(edgeId, arrowLabel)
    setIsEditingLabel(false)
  }

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArrowLabel(e.target.value)
  }

  return {
    isEditingLabel,
    arrowLabel,
    handleOnClick,
    handleOnBlur,
    handleLabelChange,
  }
}