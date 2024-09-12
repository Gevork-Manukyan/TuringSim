
import Arrow from "../../Arrow/Arrow";
import useAddEdgeArrow from "./useAddEdgeArrow";

export default function AddEdgeArrow() {

  const {
    addingEdgeStartNode,
    addingEdgeEndNode,
    mouseCoords
  } = useAddEdgeArrow()
  
  return (
    <>
      {/* If start node id is same as end, then use circle arrow */}
      {addingEdgeStartNode && mouseCoords ? (
          <Arrow
            edgeId={null}
            key={addingEdgeStartNode.id}
            startPoint={addingEdgeStartNode.coords}
            endPoint={addingEdgeEndNode ? addingEdgeEndNode.coords : mouseCoords}
            type={addingEdgeStartNode.id === addingEdgeEndNode?.id ? "circle" : "line"}
          />
        ) : null}
      </>
    );
  }
  
  