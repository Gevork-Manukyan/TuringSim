import "./MainCanvas.css";
import { useState } from "react";
import { DndContext } from "@dnd-kit/core";

export function MainCanvas() {
  const [isDropped, setIsDropped] = useState(false);
  const graph = new DirectedGraph();

  function handleDragEnd(event) {
    if (event.over && event.over.id === "droppable") {
      console.log("dropped");
      setIsDropped(true);
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>

    </DndContext>
  );
}
