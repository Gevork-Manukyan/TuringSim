import './AddNodeButton.scss'
import { useDirectedGraph } from '../../../lib/stores/useDirectedGraph'
import { TNode } from '../../../lib/types';

type AddNodeButtonProps = {
    children?: React.ReactNode;
    value?: TNode['value'];
}

export default function AddNodeButton({ children, value="" }: AddNodeButtonProps) {
    const addNode = useDirectedGraph(state => state.addNode)
    
    return (
        <button className="AddNodeButton" onClick={() => addNode(value)}>{children}</button>
    )
}