import "./Draggable.css"
import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";

type DraggableProps = {
  children?: React.ReactNode;
  className?: string;
  id?: string;
};

function generateRandomStringId(): string {
  const length = 16;
  const array = new Uint8Array(length / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function Draggable({ children, className, id }: DraggableProps) {
  const [draggableId, setDraggableId] = useState(id ? id : generateRandomStringId())

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: draggableId,
  });

  const dragHandleProps = {
    ...listeners,
    ...attributes
  }

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <button
      ref={setNodeRef}
      className={`Draggable${className ? " " + className : ""}`}
      style={style}
      {...dragHandleProps}
    >
      {children}
    </button>
  );
}
