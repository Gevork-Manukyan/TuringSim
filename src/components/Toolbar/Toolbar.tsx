import "./Toolbar.scss"
import { useDirectedGraph } from "../../lib/stores/useDirectedGraph"

export default function Toolbar() {
    const evaluate = useDirectedGraph(state => state.evaluate)
    
    return (
        <section className="Toolbar">
            <button onClick={() => evaluate(['1', '2', '3'])}>Start</button>
        </section>
    )
}