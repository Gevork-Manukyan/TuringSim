export type Coord = {
  x: number;
  y: number;
};

export type TNode = {
  id: string;
  value: string | number | null;
  coords: Coord;
  isEndNode: boolean;
};

export type ArrowConfig = {
  arrowColor?: string;
  arrowHighlightedColor?: string;
  controlPointsColor?: string;
  boundingBoxColor?: string;
  dotEndingBackground?: string;
  dotEndingRadius?: number;
  arrowHeadEndingSize?: number;
  hoverableLineWidth?: number;
  strokeWidth?: number;
  circleArcRadius?: number;
};
