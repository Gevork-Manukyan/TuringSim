import "./Canvas.scss";
import { useDirectedGraph } from "../../lib/hooks/useDirectedGraph";
import Node from "../Nodes/Node/Node";
import EndNode from "../Nodes/EndNode/EndNode";
import AddNodeButton from "../Buttons/AddNodeButton/AddNodeButton";
import Arrow from "../Arrow/Arrow";
import { DndContext } from "@dnd-kit/core";

export default function Canvas() {
  const graphNodes = useDirectedGraph((state) => state.nodes)
  const isGraphEmpty = useDirectedGraph(state => state.isEmpty)

  

  return (
    <DndContext>
      <section id="Canvas">
        {/* <Arrow startPoint={{x: 0, y: 0}} endPoint={{x: 382, y: 418}} /> */}
        {isGraphEmpty() && <AddNodeButton>+</AddNodeButton>}
        {Array.from(graphNodes.entries()).map(([key, node]) => {
          return <Node key={key} node={node} />
        })}
      </section>
    </DndContext>
  );
}
