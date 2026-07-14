import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";
import { SeqSymbol } from "../../lib/stores/useInputSequence";

export type PlayState = "idle" | "consumed" | "cursor" | "accepted" | "rejected";

// Playback highlight fades — composed onto dnd-kit's own transform transition so
// the drop settles smoothly without fighting our CSS.
const COLOR_TRANSITIONS =
  "opacity var(--dur-base) var(--ease-out)," +
  "background-color var(--dur-base) var(--ease-out)," +
  "color var(--dur-base) var(--ease-out)," +
  "border-color var(--dur-base) var(--ease-out)," +
  "box-shadow var(--dur-base) var(--ease-out)";

type SymbolChipProps = {
  symbol: SeqSymbol;
  state: PlayState;
  disabled: boolean; // locked during a running step-through
  onRemove: (id: string) => void;
};

export default function SymbolChip({ symbol, state, disabled, onRemove }: SymbolChipProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: symbol.id, disabled });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    // While dragging: no transition, so the chip stays glued to the pointer.
    // Otherwise: dnd-kit's transition drives the smooth reorder + drop settle,
    // with our colour fades composed on for playback highlighting.
    transition: isDragging
      ? "none"
      : [transition, COLOR_TRANSITIONS].filter(Boolean).join(", "),
  };

  const className =
    "SymbolChip" +
    ` SymbolChip--${state}` +
    (isDragging ? " SymbolChip--dragging" : "") +
    (disabled ? " SymbolChip--locked" : "");

  const handleRemove = (event: React.MouseEvent) => {
    event.stopPropagation();
    onRemove(symbol.id);
  };

  return (
    <div
      ref={setNodeRef}
      className={className}
      style={style}
      {...attributes}
      {...listeners}
    >
      <span className="SymbolChip__value">{symbol.value}</span>
      {!disabled && (
        <button
          className="SymbolChip__remove"
          onClick={handleRemove}
          onPointerDown={(event) => event.stopPropagation()}
          title="Remove"
          aria-label={`Remove ${symbol.value || "symbol"}`}
        >
          <X size={12} strokeWidth={3} />
        </button>
      )}
    </div>
  );
}
