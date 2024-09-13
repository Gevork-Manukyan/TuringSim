import "./Toolbar.scss";
import AddNodeButton from "../Buttons/AddNodeButton/AddNodeButton";
import useToolbar from "./useToolbar";
import TextInput from "../TextInput/TextInput";

export default function Toolbar({
  canvasRef,
}: {
  canvasRef: React.RefObject<HTMLElement>;
}) {
  const {
    inputString,
    setInputString,
    handleEvaluateClick,
    handleStep,
    handleContinue,
    handleOptionChange,
    handleClear,
    getNodeCoords,
  } = useToolbar({ canvasRef });

  return (
    <section className="Toolbar">
      <ToolbarButton>
        <button onClick={handleEvaluateClick}>Start</button>
      </ToolbarButton>
      <TextInput 
        id="Toolbar__stringInput"
        value={inputString}
        onChange={(e) => setInputString(e.target.value)}
      />
      <ToolbarButton>
        <button onClick={handleStep}>Step</button>
      </ToolbarButton>
      <ToolbarButton>
        <button onClick={handleContinue}>Continue</button>
      </ToolbarButton>
      <label htmlFor="commaSeparated" className="Toolbar__label">
        Comma Separated
        <input
          className="Toolbar__checkbox"
          name="commaSeparated"
          type="checkbox"
          onChange={handleOptionChange}
        />
      </label>
      <ToolbarButton>
        <AddNodeButton nodeCoord={getNodeCoords()}>New Node</AddNodeButton>
      </ToolbarButton>
      <ToolbarButton>
        <button onClick={handleClear}>Clear</button>
      </ToolbarButton>
    </section>
  );
} 

function ToolbarButton({ children }: { children: React.ReactNode }) {
  return <div className="ToolbarButton">{children}</div>;
}
