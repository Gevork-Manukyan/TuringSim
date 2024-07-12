import "./Draggable.css"
import { useDraggable } from "@dnd-kit/core";

type DraggableProps = {
  children?: React.ReactNode;
  className?: string;
  id: string;
};

export function Draggable({ children, className, id }: DraggableProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      className={`Draggable${className ? " " + className : ""}`}
      style={style}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
}
