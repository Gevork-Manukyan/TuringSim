import "./InputSequence.scss";
import { useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { useInputSequence } from "../../lib/stores/useInputSequence";
import { useDirectedGraph } from "../../lib/stores/useDirectedGraph";
import SymbolChip, { PlayState } from "./SymbolChip";

/**
 * The editable input sequence: a row of draggable, deletable symbol chips plus
 * an inline field to append new ones (Enter commits one literal chip). During a
 * simulation the same chips light up as the cursor consumes them.
 */
export default function InputSequence() {
  const symbols = useInputSequence((s) => s.symbols);
  const add = useInputSequence((s) => s.add);
  const remove = useInputSequence((s) => s.remove);
  const move = useInputSequence((s) => s.move);

  const simulation = useDirectedGraph((s) => s.simulation);
  const resetSimulation = useDirectedGraph((s) => s.resetSimulation);

  const [draft, setDraft] = useState("");

  const isRunning = simulation?.status === "running";

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  // Editing after a finished run clears the stale result first.
  const beforeEdit = () => {
    if (simulation) resetSimulation();
  };

  const handleAddKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    const value = draft.trim();
    if (!value) return;
    beforeEdit();
    add(value);
    setDraft("");
  };

  const handleRemove = (id: string) => {
    beforeEdit();
    remove(id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = symbols.findIndex((s) => s.id === active.id);
    const to = symbols.findIndex((s) => s.id === over.id);
    if (from === -1 || to === -1) return;
    beforeEdit();
    move(from, to);
  };

  const chipState = (i: number): PlayState => {
    if (!simulation) return "idle";
    const { index, status } = simulation;
    if (status === "running") {
      if (i < index) return "consumed";
      if (i === index) return "cursor";
      return "idle";
    }
    // Terminal: tint the symbols that were consumed with the result colour.
    if ((status === "accepted" || status === "rejected") && i < index) {
      return status;
    }
    return "idle";
  };

  return (
    <div className="InputSequence">
      {!isRunning && (
        <input
          className="InputSequence__add"
          value={draft}
          placeholder="Type a symbol, press Enter"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleAddKeyDown}
        />
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToHorizontalAxis]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={symbols.map((s) => s.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="InputSequence__list">
            {symbols.map((symbol, i) => (
              <SymbolChip
                key={symbol.id}
                symbol={symbol}
                state={chipState(i)}
                disabled={!!isRunning}
                onRemove={handleRemove}
              />
            ))}
            {symbols.length === 0 && !isRunning && (
              <span className="InputSequence__hint">
                symbols appear here — drag to reorder
              </span>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
