import "./Tape.scss";
import { useDirectedGraph } from "../../lib/stores/useDirectedGraph";

/**
 * The input string as a row of cells. Consumed symbols dim, the next symbol to
 * read gets the cursor. Renders nothing until a simulation with input exists.
 */
export default function Tape() {
  const simulation = useDirectedGraph((state) => state.simulation);

  if (!simulation || simulation.input.length === 0) return null;

  return (
    <div className="Tape" aria-label="input tape">
      {simulation.input.map((symbol, i) => {
        const consumed = i < simulation.index;
        const isCursor = i === simulation.index && simulation.status === "running";
        const className =
          "Tape__cell" +
          (consumed ? " Tape__cell--consumed" : "") +
          (isCursor ? " Tape__cell--cursor" : "");
        return (
          <div key={i} className={className}>
            {symbol}
          </div>
        );
      })}
    </div>
  );
}
