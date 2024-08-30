export type Coord = {
  x: number;
  y: number;
};

export type NodeId = string;
export type EdgeId = string;

export type TNode = {
  id: NodeId;
  value: string;
  coords: Coord;
  isStartNode: boolean;
  isEndNode: boolean;
};

export type Edge = {
  id: EdgeId;
  value: string | number;
  fromId: NodeId;
  toId: NodeId;
};

export type EdgeCoords = {
  id: EdgeId;
  startCoord: Coord;
  endCoord: Coord;
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
