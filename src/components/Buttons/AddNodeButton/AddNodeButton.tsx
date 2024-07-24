import { useDirectedGraph } from '../../../lib/hooks/useDirectedGraph'
import './AddNodeButton.scss'

type AddNodeButtonProps = {
    children?: React.ReactNode;
    value: string | number;
}

export default function AddNodeButton({ children, value }: AddNodeButtonProps) {
    const addNode = useDirectedGraph(state => state.addNode)
    
    return (
        <button className="AddNodeButton" onClick={() => addNode(value)}>{children}</button>
    )
}