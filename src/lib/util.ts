import { NODE_RADIUS } from "./constants";
import { TEdgeCoords } from "./stores/useDirectedGraph";
import { Coords } from "./types";

export function calcEdgeCoords(edge: TEdgeCoords) {
    const { startCoords, endCoords } = edge
    const startCenter = getNodeCenter(startCoords)
    const endCenter = getNodeCenter(endCoords)
  
    const dx = endCenter.x - startCenter.x;
    const dy = endCenter.y - startCenter.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const unitX = dx / distance;
    const unitY = dy / distance;
    
    const endX = endCenter.x - NODE_RADIUS * unitX;
    const endY = endCenter.y - NODE_RADIUS * unitY;
  
    return { startCoords: startCenter, endCoords: {x: endX, y: endY} }
}

export function getNodeCenter(coords: Coords) {
  return { x: coords.x + NODE_RADIUS, y: coords.y + NODE_RADIUS };
}
