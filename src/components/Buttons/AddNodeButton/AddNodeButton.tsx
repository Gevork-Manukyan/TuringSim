import './AddNodeButton.scss'
import { useDirectedGraph } from '../../../lib/stores/useDirectedGraph'
import { Coord, TNode } from '../../../lib/types';
import { NODE_RADIUS } from '../../../lib/constants';

type AddNodeButtonProps = {
    children?: React.ReactNode;
    value?: TNode['value'];
    nodeCoord?: Coord;
}

export default function AddNodeButton({ children, value="", nodeCoord }: AddNodeButtonProps) {
    const addNode = useDirectedGraph(state => state.addNode)
    console.log("ADD: ", nodeCoord)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const x = event.clientX - NODE_RADIUS
        const y = event.clientY - NODE_RADIUS
        const startCoord = nodeCoord ? nodeCoord : { x, y }
        addNode({ value, startCoord })
    }
    
    return (
        <button className="AddNodeButton" onClick={handleClick}>{children}</button>
    )
}