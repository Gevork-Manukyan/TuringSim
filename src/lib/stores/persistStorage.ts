import { createJSONStorage, PersistStorage } from "zustand/middleware";

/**
 * Shared localStorage persistence helpers for the app's Zustand stores.
 *
 * Two concerns are handled here:
 *  1. `Map` objects are not JSON-serializable (they stringify to `{}`), so the
 *     graph store's four Maps are tagged on write and rebuilt on read.
 *  2. Reads/writes are wrapped so malformed JSON, quota errors, or private-mode
 *     restrictions degrade to the store's in-memory defaults instead of throwing.
 */

type SerializedMap = {
  __type: "Map";
  entries: [unknown, unknown][];
};

function isSerializedMap(value: unknown): value is SerializedMap {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { __type?: unknown }).__type === "Map" &&
    Array.isArray((value as { entries?: unknown }).entries)
  );
}

/** JSON.stringify replacer: encode Maps as a tagged, array-backed object. */
function mapReplacer(_key: string, value: unknown): unknown {
  if (value instanceof Map) {
    return { __type: "Map", entries: Array.from(value.entries()) };
  }
  return value;
}

/** JSON.parse reviver: rebuild real Maps from the tagged encoding. */
function mapReviver(_key: string, value: unknown): unknown {
  if (isSerializedMap(value)) {
    return new Map(value.entries);
  }
  return value;
}

/**
 * Build a `PersistStorage` backed by localStorage that never throws. Pass
 * `withMaps` for stores that hold `Map` state (the directed graph); leave it
 * off for plain JSON state (the input sequence).
 */
export function createSafeStorage<S>(
  withMaps = false
): PersistStorage<S> | undefined {
  const json = createJSONStorage<S>(
    () => localStorage,
    withMaps ? { replacer: mapReplacer, reviver: mapReviver } : undefined
  );
  if (!json) return undefined;

  return {
    getItem: (name) => {
      try {
        return json.getItem(name);
      } catch {
        // Malformed or unreadable storage -> fall back to store defaults.
        return null;
      }
    },
    setItem: (name, value) => {
      try {
        return json.setItem(name, value);
      } catch {
        // Ignore write failures (quota exceeded, private mode, etc.).
        return undefined;
      }
    },
    removeItem: (name) => {
      try {
        return json.removeItem(name);
      } catch {
        // Ignore removal failures.
        return undefined;
      }
    },
  };
}
