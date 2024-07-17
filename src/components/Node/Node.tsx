import React, { useMemo, useState } from "react";
import {
  DndContext,
  useDraggable,
  useSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  PointerActivationConstraint,
  useSensors,
} from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import type { Coordinates } from "@dnd-kit/utilities";
import { Draggable, Wrapper } from "..";
import { generateRandomStringId } from "../utilities";

const defaultCoordinates = {
  x: 0,
  y: 0,
};

interface Props {
  activationConstraint?: PointerActivationConstraint;
  buttonStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  label?: string;
}

export function Node({
  activationConstraint,
  label = "",
  style,
  buttonStyle,
}: Props) {
  const [{ x, y }, setCoordinates] = useState<Coordinates>(defaultCoordinates);
  const mouseSensor = useSensor(MouseSensor, { activationConstraint });
  const touchSensor = useSensor(TouchSensor, { activationConstraint });
  const keyboardSensor = useSensor(KeyboardSensor, {});
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const id = useMemo(() => generateRandomStringId(), []);

  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useDraggable({
      id: id,
    });

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={({ delta }) => {
        setCoordinates(({ x, y }) => {
          return {
            x: x + delta.x,
            y: y + delta.y,
          };
        });
      }}
      modifiers={[snapCenterToCursor]}
    >
      <Wrapper>
        <Draggable
          ref={setNodeRef}
          dragging={isDragging}
          label={label}
          listeners={listeners}
          style={{ ...style, top: y, left: x }}
          buttonStyle={buttonStyle}
          transform={transform}
          {...attributes}
        >
          Node
        </Draggable>
      </Wrapper>
    </DndContext>
  );
}
