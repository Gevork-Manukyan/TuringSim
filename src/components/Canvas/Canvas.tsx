import "./Canvas.scss";
import { useDirectedGraph } from "../../lib/hooks/useDirectedGraph";
import Node from "../Nodes/Node/Node";
import EndNode from "../Nodes/EndNode/EndNode";
import AddNodeButton from "../Buttons/AddNodeButton/AddNodeButton";

export default function Canvas() {
  const graphNodes = useDirectedGraph((state) => state.nodes)
  const isGraphEmpty = useDirectedGraph(state => state.isEmpty)


  return (
    <section id="Canvas">
      {isGraphEmpty() && <AddNodeButton>+</AddNodeButton>}
      {Array.from(graphNodes.entries()).map(([key, node]) => {
        return <Node key={key} node={node} />
      })}
    </section>
  );
}
