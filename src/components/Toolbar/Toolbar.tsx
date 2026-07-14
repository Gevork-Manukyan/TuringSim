import "./Toolbar.scss";
import AddNodeButton from "../Buttons/AddNodeButton/AddNodeButton";
import useToolbar from "./useToolbar";
import TextInput from "../TextInput/TextInput";
import Button from "../Button/Button";
import Tape from "../Tape/Tape";
import { Play, StepForward, FastForward, RotateCcw, Plus, Trash2 } from "lucide-react";

export default function Toolbar({
  canvasRef,
}: {
  canvasRef: React.RefObject<HTMLElement>;
}) {
  const {
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
    isRunning,
  } = useToolbar({ canvasRef });

  return (
    <section className="Toolbar">
      <div className="Toolbar__group">
        <Button variant="primary" onClick={handleStart}>
          <Play size={16} /> Start
        </Button>
        <TextInput
          id="Toolbar__stringInput"
          value={inputString}
          placeholder="input string…"
          onChange={(e) => setInputString(e.target.value)}
        />
        <Button onClick={handleStep} disabled={!isRunning}>
          <StepForward size={16} /> Step
        </Button>
        <Button onClick={handleContinue} disabled={!isRunning}>
          <FastForward size={16} /> Continue
        </Button>
        {simulation && (
          <Button onClick={handleReset}>
            <RotateCcw size={16} /> Reset
          </Button>
        )}
      </div>

      <label className="Toolbar__option">
        <input
          type="checkbox"
          name="commaSeparated"
          onChange={handleOptionChange}
        />
        Comma separated
      </label>

      <div className="Toolbar__status">
        <Tape />
        {simulation && <ResultBadge simulation={simulation} />}
      </div>

      <div className="Toolbar__spacer" />

      <div className="Toolbar__group">
        <AddNodeButton nodeCoord={getNodeCoords()}>
          <Plus size={16} /> New Node
        </AddNodeButton>
        <Button variant="danger" onClick={handleClear}>
          <Trash2 size={16} /> Clear
        </Button>
      </div>
    </section>
  );
}

function ResultBadge({
  simulation,
}: {
  simulation: NonNullable<ReturnType<typeof useToolbar>["simulation"]>;
}) {
  const { status, errorMessage, index, input } = simulation;

  let text: string;
  if (status === "accepted") text = "ACCEPTED";
  else if (status === "rejected") text = errorMessage ?? "REJECTED";
  else text = `Reading ${index}/${input.length}`;

  return (
    <div className={`Toolbar__result Toolbar__result--${status}`}>{text}</div>
  );
}
