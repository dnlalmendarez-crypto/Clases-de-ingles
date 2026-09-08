import { useState } from "react";
import { useProgress } from "./state/progress";
import { getUnit } from "./data/curriculum";
import Onboarding from "./components/Onboarding";
import Dashboard from "./components/Dashboard";
import UnitFlow from "./components/UnitFlow";

export default function App() {
  const { state, completeOnboarding, recordUnitResult, resetProgress, isUnitUnlocked } =
    useProgress();
  const [activeUnitId, setActiveUnitId] = useState<string | null>(null);

  if (!state.onboardingDone) {
    return <Onboarding onFinish={completeOnboarding} />;
  }

  const activeUnit = activeUnitId ? getUnit(activeUnitId) : undefined;

  if (activeUnit) {
    return (
      <UnitFlow
        unit={activeUnit}
        level={state.level}
        onExit={() => setActiveUnitId(null)}
        onComplete={(unitId, score) => recordUnitResult(unitId, score)}
      />
    );
  }

  return (
    <Dashboard
      progress={state}
      isUnitUnlocked={isUnitUnlocked}
      onSelectUnit={setActiveUnitId}
      onReset={() => {
        if (window.confirm("¿Seguro que quieres reiniciar todo tu progreso?")) {
          resetProgress();
        }
      }}
    />
  );
}
