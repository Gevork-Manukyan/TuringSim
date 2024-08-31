/* eslint-disable react-hooks/rules-of-hooks */
import './Arrow.scss'
import styled from "styled-components";
import { ArrowConfig, Coord, Edge, EdgeId } from "../../lib/types";
import {
  calculateDeltas,
  calculateControlPointsWithBuffer,
  calculateCanvasDimensions,
  calculateArrowheadPoints,
} from "./util";
import useArrowLabel from './useArrowLabel';
import { useState } from 'react';

type ArrowProps = {
  className?: string;
  edgeId: EdgeId | null;
  startPoint: Coord;
  endPoint: Coord;
  label?: Edge['value'];
  type?: "line" | "circle";
  isHighlighted?: boolean;
  isDisabled?: boolean;
  isLocked?: boolean;
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
  className,
  edgeId, 
  startPoint,
  endPoint,
  label = "",
  type = "line",
  isHighlighted = false,
  isLocked = false,
  isDisabled = false,
  onMouseEnter,
  onMouseLeave,
  onClick,
  config,
  tooltip,
}: ArrowProps) => {
  const defaultConfig = {
    arrowColor: "#bcc4cc",
    arrowHighlightedColor: "#f87171",
    controlPointsColor: "#ff4747",
    boundingBoxColor: "#ffcccc",
    dotEndingBackground: "#fff",
    dotEndingRadius: 0,
    arrowHeadEndingSize: 10,
    hoverableLineWidth: 20,
    strokeWidth: 3,
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

  const CIRCLE_RADIUS: number = 50;

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

  // In radians
  const arrowAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

  const {
    labelStyle,
    isEditingLabel,
    arrowLabel,
    handleOnClick,
    handleOnBlur,
    handleLabelChange,
  } = useArrowLabel({ type, label, startPoint, endPoint, CIRCLE_RADIUS, arrowAngle, onClick, edgeId })

  const canvasXOffset =
    Math.min(startPoint.x, endPoint.x) - boundingBoxBuffer.horizontal;
  const canvasYOffset =
    type === "line"
      ? Math.min(startPoint.y, endPoint.y) - boundingBoxBuffer.vertical
      : Math.min(startPoint.y, endPoint.y) -
        boundingBoxBuffer.vertical -
        2 * CIRCLE_RADIUS;

  const { arrowPoint1, arrowPoint2 } = calculateArrowheadPoints({
    p2,
    arrowHeadEndingSize,
    angle: arrowAngle,
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

  const [isHighlightedState, useIsHighlightedState] = useState(false)
  const handleOnHighlight = () => {
    useIsHighlightedState(true)
  }

  const handleOnUnhighlight = () => {
    useIsHighlightedState(false)
  }

  const isDisabledOrLocked = () => isDisabled || isLocked

  const strokeColor = (isHighlighted || isHighlightedState) && !isDisabledOrLocked()
    ? arrowHighlightedColor 
    : arrowColor;

  return (
    <div className={`Arrow${className ? ` ${className}` : ''}`}>
      <StraightLine
        width={canvasWidth}
        height={canvasHeight}
        $isHighlighted={isHighlighted !== undefined ? isHighlighted : isHighlightedState}
        $boundingBoxColor={boundingBoxColor}
        // $xTranslate={!isLocked ? canvasXOffset : 0}
        // $yTranslate={!isLocked ? canvasYOffset : 0}
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
          onMouseEnter={onMouseEnter && !isDisabledOrLocked() ? onMouseEnter : handleOnHighlight}
          onMouseLeave={onMouseLeave && !isDisabledOrLocked() ? onMouseLeave : handleOnUnhighlight}
          onClick={!isDisabledOrLocked() ? handleOnClick : () => {}}
        >
          {tooltip && <title>{tooltip}</title>}
        </HoverableLine>
      </StraightLine>
      <div className={`Arrow__label${type === 'circle' ? " Arrow__label--circle" : ""}`} style={labelStyle} onClick={handleOnClick}>
        {isEditingLabel 
         ? <input autoFocus type='text' className='Arrow__input' value={arrowLabel} onChange={handleLabelChange} onBlur={handleOnBlur} />
         : arrowLabel}
      </div>
    </div>
  );
};

export default Arrow;
