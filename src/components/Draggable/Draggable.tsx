import React, { forwardRef } from "react";
import classNames from "classnames";
import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import type { Transform } from "@dnd-kit/utilities";
import styles from "./Draggable.module.css";

interface Props {
  children?: React.ReactNode;
  className?: string;
  dragOverlay?: boolean;
  dragging?: boolean;
  label?: string;
  listeners?: DraggableSyntheticListeners;
  style?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
  transform?: Transform | null;
}

export const Draggable = forwardRef<HTMLButtonElement, Props>(
  function Draggable(
    {
      children,
      className,
      dragOverlay,
      dragging,
      label,
      listeners,
      transform,
      style,
      buttonStyle,
      ...props
    },
    ref
  ) {
    return (
      <div
        className={`${classNames(
          styles.Draggable,
          dragOverlay && styles.dragOverlay,
          dragging && styles.dragging
        )}`}
        style={
          {
            ...style,
            "--translate-x": `${transform?.x ?? 0}px`,
            "--translate-y": `${transform?.y ?? 0}px`,
          } as React.CSSProperties
        }
      >
        <button
          className={className ? ` ${className}` : ''}
          {...props}
          aria-label="Draggable"
          data-cypress="draggable-item"
          {...listeners}
          tabIndex={undefined}
          ref={ref}
          style={buttonStyle}
        >
          {children}
        </button>
        {label ? <label>{label}</label> : null}
      </div>
    );
  }
);
