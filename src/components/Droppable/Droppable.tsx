import { useDroppable } from "@dnd-kit/core";

type DroppableProps = {
  children?: React.ReactNode;
  className?: string;
  id: string;
};

export function Droppable({ children, className, id }: DroppableProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div
      className={`Droppable${className ? " " + className : ""}${isOver ? ' hovered' : ''}`}
      ref={setNodeRef}
    >
      {children}
    </div>
  );
}
