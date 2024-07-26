import "./Draggable.scss"
import React, {forwardRef} from 'react';
import type {DraggableSyntheticListeners} from '@dnd-kit/core';
import type {Transform} from '@dnd-kit/utilities';

interface Props {
    dragging?: boolean;
    label?: string;
    listeners?: DraggableSyntheticListeners;
    style?: React.CSSProperties;
    buttonStyle?: React.CSSProperties;
    transform?: Transform | null;
  }

export const Draggable = forwardRef<HTMLButtonElement, Props>(
    function Draggable({
        dragging,
        label,
        listeners,
        transform,
        style,
        buttonStyle,
        ...props
    }, ref) {
        return (
            <div
                className={`Draggable${dragging ? ` dragging` : ''}`}
                style={
                    {
                        ...style,
                        '--translate-x': `${transform?.x ?? 0}px`,
                        '--translate-y': `${transform?.y ?? 0}px`,
                    } as React.CSSProperties
                }
            >
                <button
                    {...props}
                    aria-label="Draggable"
                    data-cypress="draggable-item"
                    {...listeners}
                    ref={ref}
                    style={buttonStyle}
                >
                </button>
                {label ? <label>{label}</label> : null}
            </div>
        )
    }
)