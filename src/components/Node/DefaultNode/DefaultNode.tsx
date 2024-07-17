import "./DefaultNode.css"
import { Draggable } from "../../Draggable/Draggable"

type DefaultNodeProps = {
    children?: React.ReactNode
}

export default function DefaultNode({ children }: DefaultNodeProps) {
    return (
        <Draggable className="DefaultNode">
            {children}
        </Draggable>
    )
}
