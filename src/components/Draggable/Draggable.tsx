import "./Draggable.scss"
import React, {forwardRef} from 'react';
import type {DraggableSyntheticListeners} from '@dnd-kit/core';
import type {Transform} from '@dnd-kit/utilities';

interface Props {
    children?: React.ReactNode;
    className?: string;
    dragging?: boolean;
    label?: string;
    listeners?: DraggableSyntheticListeners;
    onContextMenu?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    style?: React.CSSProperties;
    buttonStyle?: React.CSSProperties;
    transform?: Transform | null;
  }

export const Draggable = forwardRef<HTMLButtonElement, Props>(
    function Draggable({
        children,
        className,
        dragging,
        label,
        listeners,
        onContextMenu,
        transform,
        style,
        buttonStyle,
        ...props
    }, ref) {
        return (
            <div
                className={`Draggable${dragging ? ` dragging` : ''}${className ? ` ${className}` : ``}`}
                style={
                    {
                        ...style,
                        '--translate-x': `${transform?.x ?? 0}px`,
                        '--translate-y': `${transform?.y ?? 0}px`,
                    } as React.CSSProperties
                }
                onContextMenu={onContextMenu}
            >
                <button
                    {...props}
                    aria-label="Draggable"
                    data-cypress="draggable-item"
                    {...listeners}
                    ref={ref}
                    style={buttonStyle}
                >
                    {children}
                </button>
                {label ? <label>{label}</label> : null}
            </div>
        )
    }
)