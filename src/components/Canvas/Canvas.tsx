import './Canvas.scss'
import Node from '../Nodes/Node/Node'
import StartNode from '../Nodes/EndNode/EndNode'

export default function Canvas() {
  return (
    <section id='Canvas'>
        <StartNode />
        <Node />
    </section>
  )
}
