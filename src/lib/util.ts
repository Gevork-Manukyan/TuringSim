import { NODE_RADIUS } from "./constants";
import { Coords } from "./types";


export function calcEdgeCoords(startNodeCenter: Coords, endNodeCenter: Coords) {
  
    const dx = endNodeCenter.x - startNodeCenter.x;
    const dy = endNodeCenter.y - startNodeCenter.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const unitX = dx / distance;
    const unitY = dy / distance;
    
    const endX = endNodeCenter.x - NODE_RADIUS * unitX;
    const endY = endNodeCenter.y - NODE_RADIUS * unitY;
  
    return { startCoords: startNodeCenter, endCoords: {x: endX, y: endY} }
}

export function calcNodeCenter(coords: Coords) {
  return { x: coords.x + NODE_RADIUS, y: coords.y + NODE_RADIUS };
}
