import './Canvas.scss'
import Node from '../Nodes/Node/Node'
import StartNode from '../Nodes/StartNode/StartNode'

export default function Canvas() {
  return (
    <section id='Canvas'>
        <StartNode />
        <Node />
    </section>
  )
}
