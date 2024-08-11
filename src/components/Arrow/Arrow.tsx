import React from 'react';
import styled from "styled-components";
import { ArrowConfig, Coords } from "../../lib/types";

// Types
type Props = {
  startPoint: Coords;
  endPoint: Coords;
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
  isHighlighted = false,
  onMouseEnter,
  onMouseLeave,
  onClick,
  config,
  tooltip,
}: Props) => {
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

  const arrowHeadOffset = arrowHeadEndingSize / 2;
  const boundingBoxElementsBuffer =
    strokeWidth +
    arrowHeadEndingSize / 2 +
    dotEndingRadius;

  const calculateDeltas = (startPoint: Coords, targetPoint: Coords) => {
    const dx = targetPoint.x - startPoint.x;
    const dy = targetPoint.y - startPoint.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    return { dx, dy, absDx, absDy };
  };

  const calculateControlPoints = ({
    absDx,
    absDy,
    dx,
    dy,
  }: {
    absDx: number;
    absDy: number;
    dx: number;
    dy: number;
  }) => {
    let leftTopX = 0;
    let leftTopY = 0;
    let rightBottomX = absDx;
    let rightBottomY = absDy;
    if (dx < 0) [leftTopX, rightBottomX] = [rightBottomX, leftTopX];
    if (dy < 0) [leftTopY, rightBottomY] = [rightBottomY, leftTopY];

    const WEIGHT_X = 4;
    const WEIGHT_Y = 0.8;
    const fixedLineInflectionConstant = Math.round(Math.sqrt(absDx) * WEIGHT_X + Math.sqrt(absDy) * WEIGHT_Y);
    const lowDyYShift = Math.round(
      Math.pow(0.9, Math.pow(1.2, Math.abs(dy) / 10)),
    );

    const p1 = { x: leftTopX, y: leftTopY };
    const p2 = { x: leftTopX + fixedLineInflectionConstant, y: leftTopY + lowDyYShift };
    const p3 = { x: rightBottomX - fixedLineInflectionConstant, y: rightBottomY - lowDyYShift };
    const p4 = { x: rightBottomX, y: rightBottomY };

    return { p1, p2, p3, p4 };
  };

  const calculateControlPointsWithBuffer = ({
    boundingBoxElementsBuffer,
    absDx,
    absDy,
    dx,
    dy,
  }: {
    boundingBoxElementsBuffer: number;
    absDx: number;
    absDy: number;
    dx: number;
    dy: number;
  }) => {
    const { p1, p2, p3, p4 } = calculateControlPoints({
      absDx,
      absDy,
      dx,
      dy,
    });

    const topBorder = Math.min(p1.y, p2.y, p3.y, p4.y);
    const bottomBorder = Math.max(p1.y, p2.y, p3.y, p4.y);
    const leftBorder = Math.min(p1.x, p2.x, p3.x, p4.x);
    const rightBorder = Math.max(p1.x, p2.x, p3.x, p4.x);

    const verticalBuffer =
      (bottomBorder - topBorder - absDy) / 2 + boundingBoxElementsBuffer;
    const horizontalBuffer =
      (rightBorder - leftBorder - absDx) / 2 + boundingBoxElementsBuffer;

    return {
      p1: { x: p1.x + horizontalBuffer, y: p1.y + verticalBuffer },
      p2: { x: p2.x + horizontalBuffer, y: p2.y + verticalBuffer },
      p3: { x: p3.x + horizontalBuffer, y: p3.y + verticalBuffer },
      p4: { x: p4.x + horizontalBuffer, y: p4.y + verticalBuffer },
      boundingBoxBuffer: { vertical: verticalBuffer, horizontal: horizontalBuffer },
    };
  };

  const calculateCanvasDimensions = ({
    absDx,
    absDy,
    boundingBoxBuffer,
  }: {
    absDx: number;
    absDy: number;
    boundingBoxBuffer: { vertical: number; horizontal: number };
  }) => {
    const canvasWidth = absDx + 2 * boundingBoxBuffer.horizontal;
    const canvasHeight = absDy + 2 * boundingBoxBuffer.vertical;

    return { canvasWidth, canvasHeight };
  };

  const { absDx, absDy, dx, dy } = calculateDeltas(startPoint, endPoint);
  const { p1, p4, boundingBoxBuffer } = calculateControlPointsWithBuffer({
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
  });

  const canvasXOffset =
    Math.min(startPoint.x, endPoint.x) - boundingBoxBuffer.horizontal;
  const canvasYOffset =
    Math.min(startPoint.y, endPoint.y) - boundingBoxBuffer.vertical;

  const straightLinePath = `
    M ${p1.x} ${p1.y}
    L ${p4.x} ${p4.y}
  `;

  const arrowHeadEndingPath = `
    M ${(arrowHeadEndingSize / 5) * 2} 0
    L ${arrowHeadEndingSize} ${arrowHeadEndingSize / 2}
    L ${(arrowHeadEndingSize / 5) * 2} ${arrowHeadEndingSize}
  `;

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
          d={straightLinePath}
          strokeWidth={strokeWidth}
          stroke={strokeColor}
          fill="none"
        />
        <HoverableLine
          d={straightLinePath}
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
        <HoverableArrowHeadEnding
          d={arrowHeadEndingPath}
          fill="none"
          stroke="transparent"
          strokeWidth={hoverableLineWidth}
          strokeLinecap="round"
          pointerEvents="all"
          $xTranslate={p4.x - arrowHeadOffset * 2}
          $yTranslate={p4.y - arrowHeadOffset}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onClick={onClick}
        >
          {tooltip && <title>{tooltip}</title>}
        </HoverableArrowHeadEnding>
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
        <ArrowHeadEnding
          d={arrowHeadEndingPath}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          $xTranslate={p4.x - arrowHeadOffset * 2}
          $yTranslate={p4.y - arrowHeadOffset}
        />
      </Endings>
    </>
  );
};

export default Arrow;