import { create } from "zustand";

export type Theme = "light" | "dark";

const STORAGE_KEY = "turing-sim-theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

/** Reflect the theme onto <html data-theme> so the token overrides apply. */
function applyTheme(theme: Theme) {
  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = theme;
  }
}

type ThemeStore = {
  theme: Theme;
  toggle: () => void;
  setTheme: (theme: Theme) => void;
};

export const useTheme = create<ThemeStore>((set, get) => {
  const initial = getInitialTheme();
  applyTheme(initial);

  const persist = (theme: Theme) => {
    applyTheme(theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore storage failures (private mode, etc.) */
    }
  };

  return {
    theme: initial,
    toggle: () => {
      const next: Theme = get().theme === "dark" ? "light" : "dark";
      persist(next);
      set({ theme: next });
    },
    setTheme: (theme: Theme) => {
      persist(theme);
      set({ theme });
    },
  };
});
