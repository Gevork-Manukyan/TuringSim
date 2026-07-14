import { create } from "zustand";
import { generateRandomString } from "../util";

export type SeqSymbol = {
  id: string;
  value: string;
};

/**
 * The authored input sequence, as an ordered list of symbol chips. Each symbol
 * carries a stable id for React keys and drag-reordering. On Start the values
 * are handed to the simulation via `startSimulation(symbols.map(s => s.value))`.
 */
type InputSequenceStore = {
  symbols: SeqSymbol[];
  add: (value: string) => void;
  remove: (id: string) => void;
  move: (fromIndex: number, toIndex: number) => void;
  clear: () => void;
};

export const useInputSequence = create<InputSequenceStore>((set) => ({
  symbols: [],
  add: (value) =>
    set((state) => ({
      symbols: [...state.symbols, { id: generateRandomString(), value }],
    })),
  remove: (id) =>
    set((state) => ({ symbols: state.symbols.filter((s) => s.id !== id) })),
  move: (fromIndex, toIndex) =>
    set((state) => {
      if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= state.symbols.length ||
        toIndex >= state.symbols.length
      ) {
        return state;
      }
      const next = [...state.symbols];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return { symbols: next };
    }),
  clear: () => set({ symbols: [] }),
}));
