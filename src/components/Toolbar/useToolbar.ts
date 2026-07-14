import { useDirectedGraph } from "../../lib/stores/useDirectedGraph"
import { useInputSequence } from "../../lib/stores/useInputSequence"
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

    const symbols = useInputSequence(state => state.symbols)
    const clearSequence = useInputSequence(state => state.clear)

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
        // Zero chips means the empty string (ε).
        startSimulation(symbols.map(s => s.value))
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

    const handleClear = () => {
        resetGraph()
        resetSimulation()
        clearSequence()
    }

    const getNodeCoords = () => {
        if (!canvasCoord) return undefined;
        return { x: canvasCoord.x - NODE_RADIUS, y: canvasCoord.y - NODE_RADIUS}
    }

    return {
        handleStart,
        handleStep,
        handleContinue,
        handleReset,
        handleClear,
        getNodeCoords,
        simulation,
        isRunning
    }
}
