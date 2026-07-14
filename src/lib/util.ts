import { NODE_RADIUS } from "./constants";
import { Coord } from "./types";

type CalcEdgeCoordsR = {
  startCoords: Coord;
  endCoords: Coord;
};

/**
 * Node coordinates are stored relative to the #Canvas element, but pointer
 * events report viewport coordinates. Convert a viewport point into the
 * canvas-local space nodes/edges live in. Returns the point unchanged if the
 * canvas isn't mounted yet.
 */
export function toCanvasCoords(clientX: number, clientY: number): Coord {
  const canvas = typeof document !== "undefined" && document.getElementById("Canvas");
  if (!canvas) return { x: clientX, y: clientY };
  const rect = canvas.getBoundingClientRect();
  return { x: clientX - rect.left, y: clientY - rect.top };
}

export function calcEdgeCoords(
  startNodeCenter: Coord,
  endNodeCenter: Coord
): CalcEdgeCoordsR {
  const dx = endNodeCenter.x - startNodeCenter.x;
  const dy = endNodeCenter.y - startNodeCenter.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Node pointing to itself
  if (distance === 0) {
    const endX = endNodeCenter.x + NODE_RADIUS;
    const endY = endNodeCenter.y;

    return { startCoords: startNodeCenter, endCoords: { x: endX, y: endY } };
  }

  const unitX = dx / distance;
  const unitY = dy / distance;

  const endX = endNodeCenter.x - NODE_RADIUS * unitX;
  const endY = endNodeCenter.y - NODE_RADIUS * unitY;

  return { startCoords: startNodeCenter, endCoords: { x: endX, y: endY } };
}

export function calcNodeCenter(coords: Coord) {
  return { x: coords.x + NODE_RADIUS, y: coords.y + NODE_RADIUS };
}

export function generateRandomString(): string {
  const length = 16;
  const array = new Uint8Array(length / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}