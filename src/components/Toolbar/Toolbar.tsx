import "./Toolbar.scss"
import { useDirectedGraph } from "../../lib/stores/useDirectedGraph"
import { useEffect, useState } from "react"
import { Coord } from "../../lib/types"
import AddNodeButton from "../Buttons/AddNodeButton/AddNodeButton"
import { NODE_RADIUS } from "../../lib/constants"

export default function Toolbar({ canvasRef }: { canvasRef: React.RefObject<HTMLElement> }) {
    const resetGraph = useDirectedGraph(state => state.clear)
    const [inputString, setInputString] = useState("")
    const [options, setOptions] = useState({
        commaSeparated: false,
    })
    const [canvasCoord, setCanvasCoord] = useState<Coord>()
    
    useEffect(() => {
        if (!canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
    
        setCanvasCoord({ x: centerX, y: centerY })
    }, [canvasRef])

    const evaluate = useDirectedGraph(state => state.evaluate)

    const handleEvaluateClick = () => {
        const evaluateString = options.commaSeparated ? inputString.split(', ') : inputString.split('');
        evaluate(evaluateString)
    }

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target
        setOptions(prev => ({ ...prev, [name]: checked }))
    }

    const handleClear = () => {
        resetGraph()
    }

    const getNodeCoords = () => {
        if (!canvasCoord) return undefined;
        return { x: canvasCoord.x - NODE_RADIUS, y: canvasCoord.y - NODE_RADIUS}
    }
    
    return (
        <section className="Toolbar">
            <button onClick={handleEvaluateClick}>Start</button>
            <input id="Toolbar__stringInput" value={inputString} onChange={(e) => setInputString(e.target.value)}></input>
            <label htmlFor="commaSeparated" className="Toolbar__label">
                Comma Separated
                <input className="Toolbar__checkbox" name="commaSeparated" type="checkbox" onChange={handleOptionChange}></input>
            </label>
            <AddNodeButton nodeCoord={getNodeCoords()}>New Node</AddNodeButton>
            <button onClick={handleClear}>Clear</button>
        </section>
    )
}