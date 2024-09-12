import "./Canvas.scss";
import { forwardRef } from "react";
import { DndContext } from "@dnd-kit/core";
import Node from "../Nodes/Node/Node";
import AddNodeButton from "../Buttons/AddNodeButton/AddNodeButton";
import Arrow from "../Arrow/Arrow";
import NewNodeIcon from "../Icons/NewNodeIcon";
import { calcEdgeCoords, calcNodeCenter } from "../../lib/util";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import useCanvas from "./useCanvas";
import AddEdgeArrow from "./AddEdgeArrow/AddEdgeArrow";

const Canvas = forwardRef<HTMLElement>((_, ref) => {

  const {
    sensors,
    graphNodes,
    getAllEdgeCoords,
    isGraphEmpty,
    getEdge,
    isAddingEdge,
    handleDragStart,
    handleDragMove
  } = useCanvas()

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      modifiers={[restrictToParentElement]}
    >
      <section
        id="Canvas"
        className={`${isAddingEdge ? "Canvas--addingEdge" : ""}`}
        ref={ref}
      >
        {isGraphEmpty() && (
          <AddNodeButton>
            <NewNodeIcon />
          </AddNodeButton>
        )}

        {/* Render nodes */}
        {Array.from(graphNodes.entries()).map(([key, node]) => {
          return <Node key={key} node={node} />;
        })}

        {/* Render arrows connecting Nodes */}
        {getAllEdgeCoords().map((edgeCoords, index) => {
          const { startCoords, endCoords } = calcEdgeCoords(
            calcNodeCenter(edgeCoords.startCoord),
            calcNodeCenter(edgeCoords.endCoord)
          );
          const selfPointing =
            edgeCoords.startCoord.x === edgeCoords.endCoord.x &&
            edgeCoords.startCoord.y === edgeCoords.endCoord.y;
          return (
            <Arrow
              key={index}
              edgeId={edgeCoords.id}
              startPoint={startCoords}
              endPoint={endCoords}
              label={getEdge(edgeCoords.id).value}
              type={selfPointing ? "circle" : "line"}
            />
          );
        })}

        {/* Arrow when adding new Edge */}
        {isAddingEdge ? <AddEdgeArrow /> : null}
      </section>
    </DndContext>
  );
})

export default Canvas;