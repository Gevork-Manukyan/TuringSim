import { useState } from "react"
import { useDirectedGraph } from "../../lib/stores/useDirectedGraph"
import { Coord, Edge, EdgeId } from "../../lib/types"
import { calculateMidpoint } from "./util";

type useArrowLabelProps = {
  type?: "line" | "circle";
  label: Edge['value'];
  startPoint: Coord;
  endPoint: Coord;
  CIRCLE_RADIUS: number;
  arrowAngle: number;
  onClick?: (e: React.MouseEvent) => void;
  edgeId: EdgeId | null;
}

export default function useArrowLabel({ type, label, startPoint, endPoint, CIRCLE_RADIUS, arrowAngle, onClick, edgeId }: useArrowLabelProps) {
  const renameEdge = useDirectedGraph(state => state.renameEdge)
  const [isEditingLabel, setIsEditingLabel] = useState(false)
  const [arrowLabel, setArrowLabel] = useState(label)
  
  // Calculate location of label for straight arrow
  const midPoint = calculateMidpoint(startPoint, endPoint, CIRCLE_RADIUS, arrowAngle)

  // Calculate location of label for circular arrow
  const circleArrowCenter = { x: endPoint.x, y: endPoint.y - CIRCLE_RADIUS }
  const circleLabelAngle = -1 * (Math.PI / 4)
  const circleLabelCoords = { x: circleArrowCenter.x + (CIRCLE_RADIUS * Math.cos(circleLabelAngle)), y: circleArrowCenter.y + (CIRCLE_RADIUS * Math.sin(circleLabelAngle)) }

  const labelStyle = type === 'line'
  ? { left: midPoint.x, top: midPoint.y }
  : { left: circleLabelCoords.x, top: circleLabelCoords.y }

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
    labelStyle,
    isEditingLabel,
    arrowLabel,
    handleOnClick,
    handleOnBlur,
    handleLabelChange,
  }
}