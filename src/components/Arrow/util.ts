import { Coords } from "../../lib/types";

export const calculateDeltas = (startPoint: Coords, targetPoint: Coords) => {
    const dx = targetPoint.x - startPoint.x;
    const dy = targetPoint.y - startPoint.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    return { dx, dy, absDx, absDy };
  };

export const calculateControlPoints = ({
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

    const p1 = { x: leftTopX, y: leftTopY };
    const p2 = { x: rightBottomX, y: rightBottomY };

    return { p1, p2 };
  };

export const calculateControlPointsWithBuffer = ({
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
    const { p1, p2 } = calculateControlPoints({
      absDx,
      absDy,
      dx,
      dy,
    });

    const topBorder = Math.min(p1.y, p2.y);
    const bottomBorder = Math.max(p1.y, p2.y);
    const leftBorder = Math.min(p1.x, p2.x);
    const rightBorder = Math.max(p1.x, p2.x);

    const verticalBuffer =
      (bottomBorder - topBorder - absDy) / 2 + boundingBoxElementsBuffer;
    const horizontalBuffer =
      (rightBorder - leftBorder - absDx) / 2 + boundingBoxElementsBuffer;

    return {
      p1: { x: p1.x + horizontalBuffer, y: p1.y + verticalBuffer },
      p2: { x: p2.x + horizontalBuffer, y: p2.y + verticalBuffer },
      boundingBoxBuffer: { vertical: verticalBuffer, horizontal: horizontalBuffer },
    };
  };

export const calculateCanvasDimensions = ({
    absDx,
    absDy,
    boundingBoxBuffer: { vertical, horizontal },
    isCircle,
    circleRadius,
  }: {
    absDx: number;
    absDy: number;
    boundingBoxBuffer: { vertical: number; horizontal: number };
    isCircle: boolean;
    circleRadius: number;
  }) => {
    const canvasWidth = isCircle
      ? 2 * circleRadius + 2 * horizontal
      : absDx + 2 * horizontal;
  
    const canvasHeight = isCircle
      ? 2 * circleRadius + 2 * vertical
      : absDy + 2 * vertical;
  
    return { canvasWidth, canvasHeight };
};
  

export const calculateArrowheadPoints = ({ p2, arrowHeadEndingSize, angle }: { p2: Coords, arrowHeadEndingSize: number, angle: number }) => {
    const arrowPoint1 = {
      x: p2.x - arrowHeadEndingSize * Math.cos(angle) + arrowHeadEndingSize * Math.sin(angle),
      y: p2.y - arrowHeadEndingSize * Math.sin(angle) - arrowHeadEndingSize * Math.cos(angle),
    };
    
    const arrowPoint2 = {
      x: p2.x - arrowHeadEndingSize * Math.cos(angle) - arrowHeadEndingSize * Math.sin(angle),
      y: p2.y - arrowHeadEndingSize * Math.sin(angle) + arrowHeadEndingSize * Math.cos(angle),
    };

    return { arrowPoint1, arrowPoint2 }
  }