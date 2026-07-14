import './AddNodeButton.scss'
import { useDirectedGraph } from '../../../lib/stores/useDirectedGraph'
import { Coord, TNode } from '../../../lib/types';
import { NODE_RADIUS } from '../../../lib/constants';
import { toCanvasCoords } from '../../../lib/util';
import Button from '../../Button/Button';

type Variant = "primary" | "ghost" | "danger" | "icon";

type AddNodeButtonProps = {
    children?: React.ReactNode;
    value?: TNode['value'];
    nodeCoord?: Coord;
    variant?: Variant;
    className?: string;
}

export default function AddNodeButton({ children, value = "", nodeCoord, variant = "ghost", className }: AddNodeButtonProps) {
    const addNode = useDirectedGraph(state => state.addNode)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const local = toCanvasCoords(event.clientX, event.clientY)
        const startCoord = nodeCoord ? nodeCoord : { x: local.x - NODE_RADIUS, y: local.y - NODE_RADIUS }
        addNode({ value, startCoord })
    }

    return (
        <Button
            variant={variant}
            className={`AddNodeButton${className ? ` ${className}` : ''}`}
            onClick={handleClick}
        >
            {children}
        </Button>
    )
}
