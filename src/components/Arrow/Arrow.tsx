import styled from "styled-components";

import {
  calculateDeltas,
  calculateCanvasDimensions,
  calculateControlPoints,
} from "./utils/arrow-utils";
import { ArrowConfig, Coords } from "../../lib/types";


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

const Line = styled.svg.attrs(({ $xTranslate, $yTranslate }: LineProps) => ({
  style: { transform: `translate(${$xTranslate}px, ${$yTranslate}px)` },
}))<LineProps>`
  pointer-events: none;
  z-index: ${({ $isHighlighted }) => ($isHighlighted ? 2 : 1)};
  position: absolute;
  left: 0;
  top: 0;
`;

const StraightLine = styled(Line)`border: 0`;

const RenderedLine = styled.path`
  transition: stroke 300ms;
`;

const Endings = styled(Line)`
  pointer-events: none;
  z-index: ${({ $isHighlighted }) => ($isHighlighted ? 11 : 10)};
`;

const ArrowHeadEnding = styled.path.attrs(
  ({ $xTranslate, $yTranslate }: TranslateProps) => ({
    style: { transform: `translate(${$xTranslate}px, ${$yTranslate}px)` },
  })
)<TranslateProps>`
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

export default function Arrow({
  startPoint,
  endPoint,
  isHighlighted = false,
  onMouseEnter,
  onMouseLeave,
  onClick,
  config,
  tooltip,
}: Props) {
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
  const currentConfig = {
    ...defaultConfig,
    ...config,
  };

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

  const { absDx, absDy, dx, dy } = calculateDeltas(startPoint, endPoint);
  const { p1, p4, boundingBoxBuffer } = calculateControlPoints({
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
  L ${p4.x} ${p4.y}`;  

  const arrowHeadEndingPath = `
  M ${(arrowHeadEndingSize / 5) * 2} 0
  L ${arrowHeadEndingSize} ${arrowHeadEndingSize / 2}
  L ${(arrowHeadEndingSize / 5) * 2} ${arrowHeadEndingSize}`

  const getStrokeColor = () => {
    if (isHighlighted) return arrowHighlightedColor;

    return arrowColor;
  };

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
          stroke={getStrokeColor()}
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
}