import './Arrow.scss'
import styled from "styled-components";
import { ArrowConfig, Coord, Edge, EdgeId } from "../../lib/types";
import {
  calculateDeltas,
  calculateControlPointsWithBuffer,
  calculateCanvasDimensions,
  calculateArrowheadPoints,
  calculateMidpoint,
} from "./util";
import { useState } from 'react';
import { useDirectedGraph } from '../../lib/stores/useDirectedGraph';

type ArrowProps = {
  edgeId: EdgeId | null;
  startPoint: Coord;
  endPoint: Coord;
  label?: Edge['value'];
  type?: "line" | "circle";
  isHighlighted?: boolean;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
  config?: ArrowConfig;
  tooltip?: string;
};

type TranslateProps = {
  $xTranslate: number;
  $yTranslate: number;
};

type LineProps = {
  $isHighlighted: boolean;
  $boundingBoxColor?: string;
} & TranslateProps;

const Line = styled.svg.attrs<LineProps>(({ $xTranslate, $yTranslate }) => ({
  style: { transform: `translate(${$xTranslate}px, ${$yTranslate}px)` },
}))<LineProps>`
  pointer-events: none;
  z-index: ${({ $isHighlighted }) => ($isHighlighted ? 2 : 1)};
  position: absolute;
  left: 0;
  top: 0;
`;

const StraightLine = styled(Line)`
  border: 0;
`;

const RenderedLine = styled.path`
  transition: stroke 300ms;
`;

const HoverableLine = styled.path`
  cursor: default;
`;


const Arrow = ({
  edgeId, 
  startPoint,
  endPoint,
  label = "",
  type = "circle",
  isHighlighted = false,
  onMouseEnter,
  onMouseLeave,
  onClick,
  config,
  tooltip,
}: ArrowProps) => {
  const defaultConfig = {
    arrowColor: "#bcc4cc",
    arrowHighlightedColor: "#4da6ff",
    controlPointsColor: "#ff4747",
    boundingBoxColor: "#ffcccc",
    dotEndingBackground: "#fff",
    dotEndingRadius: 3,
    arrowHeadEndingSize: 9,
    hoverableLineWidth: 15,
    strokeWidth: 1,
  };

  const currentConfig = { ...defaultConfig, ...config };

  const {
    arrowColor,
    arrowHighlightedColor,
    boundingBoxColor,
    arrowHeadEndingSize,
    strokeWidth,
    hoverableLineWidth,
    dotEndingRadius,
  } = currentConfig;

  const boundingBoxElementsBuffer =
    hoverableLineWidth / 2 + arrowHeadEndingSize + dotEndingRadius;

  const CIRCLE_RADIUS = 50;

  const { absDx, absDy, dx, dy } = calculateDeltas(startPoint, endPoint);

  const { p1, p2, boundingBoxBuffer } = calculateControlPointsWithBuffer({
    boundingBoxElementsBuffer,
    dx,
    dy,
    absDx,
    absDy,
  });
  const { canvasWidth, canvasHeight } = calculateCanvasDimensions({
    absDx,
    absDy,
    boundingBoxBuffer,
    isCircle: type === "circle",
    circleRadius: CIRCLE_RADIUS,
  });

  const canvasXOffset =
    Math.min(startPoint.x, endPoint.x) - boundingBoxBuffer.horizontal;
  const canvasYOffset =
    type === "line"
      ? Math.min(startPoint.y, endPoint.y) - boundingBoxBuffer.vertical
      : Math.min(startPoint.y, endPoint.y) -
        boundingBoxBuffer.vertical -
        2 * CIRCLE_RADIUS;

  const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

  const { arrowPoint1, arrowPoint2 } = calculateArrowheadPoints({
    p2,
    arrowHeadEndingSize,
    angle,
  });

  const linePath =
    type === "line"
      ? `
    M ${p1.x} ${p1.y}
    L ${p2.x} ${p2.y}
    L ${arrowPoint1.x} ${arrowPoint1.y}
    M ${p2.x} ${p2.y}
    L ${arrowPoint2.x} ${arrowPoint2.y}
  `
      : `
    m ${30} ${CIRCLE_RADIUS * 2}
    a ${CIRCLE_RADIUS} ${CIRCLE_RADIUS} 0 1 1 ${p2.x - 30} ${p2.y}
  `;

  const getStrokeColor = () =>
    isHighlighted ? arrowHighlightedColor : arrowColor;
  const strokeColor = getStrokeColor();

  const midPoint = calculateMidpoint(startPoint, endPoint, CIRCLE_RADIUS, angle)

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

  return (
    <div className="Arrow">
      <StraightLine
        width={canvasWidth}
        height={canvasHeight}
        $isHighlighted={isHighlighted}
        $boundingBoxColor={boundingBoxColor}
        $xTranslate={canvasXOffset}
        $yTranslate={canvasYOffset}
      >
        <RenderedLine
          d={linePath}
          strokeWidth={strokeWidth}
          stroke={strokeColor}
          fill="none"
        />
        <HoverableLine
          d={linePath}
          strokeWidth={hoverableLineWidth}
          stroke="transparent"
          pointerEvents="all"
          fill="none"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onClick={handleOnClick}
        >
          {tooltip && <title>{tooltip}</title>}
        </HoverableLine>
      </StraightLine>
      <div className="Arrow__label" style={{left: midPoint.x, top: midPoint.y}} onClick={handleOnClick}>
        {isEditingLabel 
         ? <input autoFocus className='Arrow__input' value={arrowLabel} onChange={handleLabelChange} onBlur={handleOnBlur} />
         : arrowLabel}
      </div>
    </div>
  );
};

export default Arrow;
