import { useDirectedGraph } from "../../lib/stores/useDirectedGraph"
import { useEffect, useState } from "react"
import { Coord } from "../../lib/types"
import { NODE_RADIUS } from "../../lib/constants"

export default function useToolbar ({ canvasRef }: { canvasRef: React.RefObject<HTMLElement> }) {
    const resetGraph = useDirectedGraph(state => state.clear)
    const step = useDirectedGraph(state => state.step)
    const continueEval = useDirectedGraph(state => state.continueEval)
    const startSimulation = useDirectedGraph(state => state.startSimulation)
    const resetSimulation = useDirectedGraph(state => state.resetSimulation)
    const simulation = useDirectedGraph(state => state.simulation)

    const [inputString, setInputString] = useState("")
    const [options, setOptions] = useState({
        commaSeparated: false,
    })
    const [canvasCoord, setCanvasCoord] = useState<Coord>()

    useEffect(() => {
        if (!canvasRef.current) return;

        // Canvas-local centre (nodes are positioned relative to #Canvas, not the viewport).
        const rect = canvasRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        setCanvasCoord({ x: centerX, y: centerY })
    }, [canvasRef])

    const handleStart = () => {
        const evaluateString = options.commaSeparated
            ? inputString.split(', ')
            : inputString.split('');
        // An empty text field means the empty string (ε), i.e. no symbols.
        const parsed = inputString === "" ? [] : evaluateString;
        startSimulation(parsed)
    }

    const handleStep = () => {
        step()
    }

    const handleContinue = () => {
        continueEval()
    }

    const handleReset = () => {
        resetSimulation()
    }

    const isRunning = simulation?.status === "running"

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target
        setOptions(prev => ({ ...prev, [name]: checked }))
    }

    const handleClear = () => {
        resetGraph()
        resetSimulation()
    }

    const getNodeCoords = () => {
        if (!canvasCoord) return undefined;
        return { x: canvasCoord.x - NODE_RADIUS, y: canvasCoord.y - NODE_RADIUS}
    }

    return {
        inputString,
        setInputString,
        handleStart,
        handleStep,
        handleContinue,
        handleReset,
        handleOptionChange,
        handleClear,
        getNodeCoords,
        simulation,
        isRunning
    }
}