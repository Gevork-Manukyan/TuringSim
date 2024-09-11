import "./Toolbar.scss"
import AddNodeButton from "../Buttons/AddNodeButton/AddNodeButton"
import useToolbar from "./useToolbar"

export default function Toolbar({ canvasRef }: { canvasRef: React.RefObject<HTMLElement> }) {

    const {
        inputString, 
        setInputString,
        handleEvaluateClick,
        handleStep,
        handleContinue,
        handleOptionChange,
        handleClear,
        getNodeCoords
    } = useToolbar({ canvasRef })
    
    return (
        <section className="Toolbar">
            <button onClick={handleEvaluateClick}>Start</button>
            <input id="Toolbar__stringInput" value={inputString} onChange={(e) => setInputString(e.target.value)}></input>
            <button onClick={handleStep}>Step</button>
            <button onClick={handleContinue}>Continue</button>
            <label htmlFor="commaSeparated" className="Toolbar__label">
                Comma Separated
                <input className="Toolbar__checkbox" name="commaSeparated" type="checkbox" onChange={handleOptionChange}></input>
            </label>
            <AddNodeButton nodeCoord={getNodeCoords()}>New Node</AddNodeButton>
            <button onClick={handleClear}>Clear</button>
        </section>
    )
}