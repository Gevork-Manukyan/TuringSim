import "./MainCanvas.css";
import {useState} from 'react';
import {DndContext} from '@dnd-kit/core';
import { Droppable } from "../Droppable/Droppable";
import { Draggable } from "../Draggable/Draggable";


export default function MainCanvas() {
    const [isDropped, setIsDropped] = useState(false);


    function handleDragEnd(event) {
      if (event.over && event.over.id === 'droppable') {
        setIsDropped(true);
      }
    }

    return (
      <DndContext onDragEnd={handleDragEnd}>
        <Draggable id="myDragButton" className="myDragButton">Button</Draggable>
        <Droppable id="area" className="myDropArea">
          Drop Text Here
        </Droppable>
      </DndContext>
    );
}
