import "./Canvas.scss";
import { useDirectedGraph } from "../../lib/hooks/useDirectedGraph";
import Node from "../Nodes/Node/Node";
import EndNode from "../Nodes/EndNode/EndNode";

export default function Canvas() {
  const graph = useDirectedGraph((state) => ({
    nodes: state.nodes,
    adjacencyList: state.adjacencyList
  }))

  return (
    <section id="Canvas">
      <EndNode />
      <Node />
    </section>
  );
}
