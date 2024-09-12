
import { useEffect } from "react";
import { useConnectNodes } from "../../../lib/stores/useConnectNodes";

export default function useAddEdgeArrow() {
    const isAddingEdge = useConnectNodes((state) => state.isAddingEdge);
  
    const addingEdgeStartNode = useConnectNodes((state) => state.startNode);
    const addingEdgeEndNode = useConnectNodes((state) => state.endNode);
    const mouseCoords = useConnectNodes((state) => state.mouseCoords);
    const setMouseCoords = useConnectNodes((state) => state.setMouseCoords);
  
    useEffect(() => {
      if (!isAddingEdge) return;
  
      const handleMouseMove = (event: MouseEvent) => {
        setMouseCoords({ x: event.clientX, y: event.clientY });
      };
  
      window.addEventListener("mousemove", handleMouseMove);
  
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }, [isAddingEdge, setMouseCoords]);

    return {
        addingEdgeStartNode,
        addingEdgeEndNode,
        mouseCoords
    }
}