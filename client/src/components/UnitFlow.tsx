import { useState } from "react";
import type { ActivityKind, Unit, UserLevel } from "../types";
import Presentation from "./Presentation";
import ListeningActivity from "./ListeningActivity";
import SpeakingActivity from "./SpeakingActivity";
import WritingActivity from "./WritingActivity";
import ResultsScreen from "./ResultsScreen";

interface Props {
  unit: Unit;
  level: UserLevel;
  onExit: () => void;
  onComplete: (unitId: string, score: number) => void;
}

export default function UnitFlow({ unit, level, onExit, onComplete }: Props) {
  const [stage, setStage] = useState<ActivityKind>("presentation");
  const [scores, setScores] = useState<number[]>([]);

  const addScoreAndAdvance = (score: number, next: ActivityKind) => {
    setScores((s) => [...s, score]);
    setStage(next);
  };

  if (stage === "presentation") {
    return <Presentation unit={unit} onExit={onExit} onDone={() => setStage("listening")} />;
  }

  if (stage === "listening") {
    return (
      <ListeningActivity
        unit={unit}
        onExit={onExit}
        onDone={(score) => addScoreAndAdvance(score, "speaking")}
      />
    );
  }

  if (stage === "speaking") {
    return (
      <SpeakingActivity
        unit={unit}
        level={level}
        onExit={onExit}
        onDone={(score) => addScoreAndAdvance(score, "writing")}
      />
    );
  }

  if (stage === "writing") {
    return (
      <WritingActivity
        unit={unit}
        level={level}
        onExit={onExit}
        onDone={(score) => {
          const allScores = [...scores, score];
          const finalScore = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
          setScores(allScores);
          onComplete(unit.id, finalScore);
          setStage("results");
        }}
      />
    );
  }

  const finalScore =
    scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  return <ResultsScreen unit={unit} score={finalScore} onBackToDashboard={onExit} />;
}
