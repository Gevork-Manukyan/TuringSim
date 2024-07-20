import './Canvas.scss'
import { useDirectedGraph } from '../../lib/hooks/useDirectedGraph'
import Node from '../Nodes/Node/Node'
import StartNode from '../Nodes/EndNode/EndNode'

export default function Canvas() {

    const { } = useDirectedGraph();

  return (
    <section id='Canvas'>
        <StartNode />
        <Node />
    </section>
  )
}
