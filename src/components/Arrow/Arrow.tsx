import React from 'react';
import styled from "styled-components";
import { ArrowConfig, Coords } from "../../lib/types";
import { calculateDeltas, calculateControlPointsWithBuffer, calculateCanvasDimensions, calculateArrowheadPoints } from './util';

// Types
type ArrowProps = {
  startPoint: Coords;
  endPoint: Coords;
  type?: 'line' | 'circle';
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

// Styled Components
const Line = styled.svg.attrs<LineProps>(({ $xTranslate, $yTranslate }) => ({
  style: { transform: `translate(${ $xTranslate }px, ${ $yTranslate }px)` },
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

const Endings = styled(Line)`
  pointer-events: none;
  z-index: ${({ $isHighlighted }) => ($isHighlighted ? 11 : 10)};
`;

const ArrowHeadEnding = styled.path.attrs<TranslateProps>(({ $xTranslate, $yTranslate }) => ({
  style: { transform: `translate(${ $xTranslate }px, ${ $yTranslate }px)` },
}))<TranslateProps>`
  transition: stroke 300ms;
  transform-origin: center;
  transform-box: fill-box;
`;

const DotEnding = styled.circle`
  transition: stroke 300ms;
`;

const HoverableLine = styled.path`
  cursor: default;
`;

const HoverableArrowHeadEnding = styled(ArrowHeadEnding)`
  cursor: default;
`;

const HoverableDotEnding = styled.circle`
  cursor: default;
`;

// Arrow Component
const Arrow = ({
  startPoint,
  endPoint,
  type = 'circle',
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
    dotEndingBackground,
    dotEndingRadius,
  } = currentConfig;

  const boundingBoxElementsBuffer =
    hoverableLineWidth / 2 +
    arrowHeadEndingSize +
    dotEndingRadius;

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
    isCircle: type === 'circle',
    circleRadius: CIRCLE_RADIUS
  });

  const canvasXOffset =
    Math.min(startPoint.x, endPoint.x) - boundingBoxBuffer.horizontal;
  const canvasYOffset = type === 'line'
    ? Math.min(startPoint.y, endPoint.y) - boundingBoxBuffer.vertical
    : Math.min(startPoint.y, endPoint.y) - boundingBoxBuffer.vertical - (2 * CIRCLE_RADIUS)
  
  const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
  
  const { arrowPoint1, arrowPoint2 } = calculateArrowheadPoints({ p2, arrowHeadEndingSize, angle })
  
  const linePath = type === 'line' ? 
  `
    M ${p1.x} ${p1.y}
    L ${p2.x} ${p2.y}
    L ${arrowPoint1.x} ${arrowPoint1.y}
    M ${p2.x} ${p2.y}
    L ${arrowPoint2.x} ${arrowPoint2.y}
  ` : `
    m ${30} ${CIRCLE_RADIUS * 2}
    a ${CIRCLE_RADIUS} ${CIRCLE_RADIUS} 0 1 1 ${p2.x - 30} ${p2.y}
  `

  const getStrokeColor = () => isHighlighted ? arrowHighlightedColor : arrowColor;
  const strokeColor = getStrokeColor();

  return (
    <>
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
          onClick={onClick}
        >
          {tooltip && <title>{tooltip}</title>}
        </HoverableLine>
        <HoverableDotEnding
          cx={p1.x}
          cy={p1.y}
          r={dotEndingRadius}
          stroke="transparent"
          strokeWidth={hoverableLineWidth}
          fill="transparent"
        >
          {tooltip && <title>{tooltip}</title>}
        </HoverableDotEnding>
      </StraightLine>
      <Endings
        width={canvasWidth}
        height={canvasHeight}
        $isHighlighted={isHighlighted}
        $xTranslate={canvasXOffset}
        $yTranslate={canvasYOffset}
      >
        <DotEnding
          cx={p1.x}
          cy={p1.y}
          r={dotEndingRadius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill={dotEndingBackground}
        />
      </Endings>
    </>
  );
};

export default Arrow;