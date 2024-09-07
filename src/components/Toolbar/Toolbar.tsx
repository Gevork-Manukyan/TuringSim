import "./Toolbar.scss"
import { useDirectedGraph } from "../../lib/stores/useDirectedGraph"
import { useState } from "react"

export default function Toolbar() {
    const [inputString, setInputString] = useState("")
    const [options, setOptions] = useState({
        commaSeparated: false,
    })
    
    const evaluate = useDirectedGraph(state => state.evaluate)

    const handleEvaluateClick = () => {
        const evaluateString = options.commaSeparated ? inputString.split(', ') : inputString.split('');
        evaluate(evaluateString)
    }

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target
        setOptions(prev => ({ ...prev, [name]: checked }))
    }
    
    return (
        <section className="Toolbar">
            <button onClick={handleEvaluateClick}>Start</button>
            <input id="Toolbar__stringInput" value={inputString} onChange={(e) => setInputString(e.target.value)}></input>
            <label className="Toolbar__label" htmlFor="commaSeparated">
                Comma Separated
                <input className="Toolbar__checkbox" name="commaSeparated" type="checkbox" onChange={handleOptionChange}></input>
            </label>
        </section>
    )
}