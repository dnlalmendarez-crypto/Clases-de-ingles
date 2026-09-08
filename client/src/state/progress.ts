import { useCallback, useEffect, useState } from "react";
import type { ProgressState, UserLevel } from "../types";
import { CURRICULUM } from "../data/curriculum";

const STORAGE_KEY = "clases-de-ingles:progress:v1";

function defaultState(): ProgressState {
  return {
    level: "nulo",
    name: "",
    xp: 0,
    streak: 0,
    lastActiveDate: null,
    units: {},
    onboardingDone: false,
  };
}

function loadState(): ProgressState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return { ...defaultState(), ...parsed };
  } catch {
    return defaultState();
  }
}

function saveState(state: ProgressState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Almacenamiento lleno o bloqueado (modo privado, etc.): la app sigue
    // funcionando en memoria durante la sesión actual.
  }
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function bumpStreak(state: ProgressState): ProgressState {
  const today = todayStr();
  if (state.lastActiveDate === today) return state;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const wasYesterday = state.lastActiveDate === yesterday.toISOString().slice(0, 10);

  return {
    ...state,
    streak: wasYesterday ? state.streak + 1 : 1,
    lastActiveDate: today,
  };
}

/** Codifica el progreso en un texto corto que se puede copiar y pegar. */
export function encodeProgress(state: ProgressState): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(state))));
}

/** Decodifica un código de respaldo. Devuelve null si no es válido. */
export function decodeProgress(code: string): ProgressState | null {
  try {
    const json = decodeURIComponent(escape(atob(code.trim())));
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== "object" || typeof parsed.units !== "object") {
      return null;
    }
    return { ...defaultState(), ...parsed };
  } catch {
    return null;
  }
}

export function useProgress() {
  const [state, setState] = useState<ProgressState>(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const completeOnboarding = useCallback((level: UserLevel, name: string) => {
    setState((prev) => ({ ...prev, level, name, onboardingDone: true }));
  }, []);

  const setLevel = useCallback((level: UserLevel) => {
    setState((prev) => ({ ...prev, level }));
  }, []);

  const recordUnitResult = useCallback((unitId: string, score: number) => {
    setState((prev) => {
      const bumped = bumpStreak(prev);
      const prevUnit = bumped.units[unitId];
      const stars = score >= 90 ? 3 : score >= 70 ? 2 : score >= 40 ? 1 : 0;
      const bestScore = Math.max(prevUnit?.bestScore ?? 0, score);
      const bestStars = Math.max(prevUnit?.stars ?? 0, stars);
      const xpGain = Math.max(10, Math.round(score / 2));

      return {
        ...bumped,
        xp: bumped.xp + xpGain,
        units: {
          ...bumped.units,
          [unitId]: {
            unitId,
            completed: true,
            stars: bestStars,
            bestScore,
          },
        },
      };
    });
  }, []);

  const resetProgress = useCallback(() => {
    setState(defaultState());
  }, []);

  /** Restaura el progreso desde un código de respaldo. Devuelve true si tuvo éxito. */
  const importProgress = useCallback((code: string): boolean => {
    const restored = decodeProgress(code);
    if (!restored) return false;
    setState(restored);
    return true;
  }, []);

  const getBackupCode = useCallback(() => encodeProgress(state), [state]);

  const isUnitUnlocked = useCallback(
    (unitId: string) => {
      const index = CURRICULUM.findIndex((u) => u.id === unitId);
      if (index <= 0) return true;
      const prevUnit = CURRICULUM[index - 1];
      return Boolean(state.units[prevUnit.id]?.completed);
    },
    [state.units]
  );

  return {
    state,
    completeOnboarding,
    setLevel,
    recordUnitResult,
    resetProgress,
    importProgress,
    getBackupCode,
    isUnitUnlocked,
  };
}
