import "./MainCanvas.css";
import {useState} from 'react';
import {DndContext} from '@dnd-kit/core';
import { Droppable } from "../Droppable/Droppable";
import DirectedGraph, { Node, Edge } from "../../lib/directedGraph";
import DefaultNode from "../Node/DefaultNode/DefaultNode";

export default function MainCanvas() {
    const [isDropped, setIsDropped] = useState(false);
    const graph = new DirectedGraph()



    function handleDragEnd(event) {
      if (event.over && event.over.id === 'droppable') {
        console.log("dropped")
        setIsDropped(true);
      }
    }

    return (
      <DndContext onDragEnd={handleDragEnd}>
        <DefaultNode />
        <DefaultNode />
        <DefaultNode />
        <DefaultNode />
        <Droppable id="area" className="myDropArea">
          Drop Text Here
        </Droppable>
      </DndContext>
    );
}
