import { useMemo, useState } from "react";
import type { Unit, UserLevel } from "../types";
import { correctWriting } from "../lib/api";
import type { CorrectionResult } from "../lib/api";
import ActivityHeader from "./ActivityHeader";

interface Props {
  unit: Unit;
  level: UserLevel;
  onExit: () => void;
  onDone: (score: number) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function WritingActivity({ unit, level, onExit, onDone }: Props) {
  const prompts = useMemo(() => {
    const roundSize = Math.min(3, unit.writingPrompts.length);
    return shuffle(unit.writingPrompts).slice(0, roundSize);
    // Subconjunto aleatorio en cada intento, para variar los ejercicios.
  }, [unit]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<CorrectionResult | null>(null);
  const [totalScore, setTotalScore] = useState(0);

  const prompt = prompts[index];
  const isLast = index === prompts.length - 1;

  const check = async () => {
    if (!answer.trim() || checking) return;
    setChecking(true);
    const res = await correctWriting({
      prompt: prompt.promptEs,
      expected: prompt.answerEn,
      studentAnswer: answer,
      level,
    });
    setResult(res);
    setTotalScore((s) => s + (res.isCorrect ? 100 : 40));
    setChecking(false);
  };

  const next = () => {
    if (isLast) {
      onDone(Math.round(totalScore / prompts.length));
    } else {
      setIndex((i) => i + 1);
      setAnswer("");
      setResult(null);
    }
  };

  return (
    <div className="min-h-screen pb-10">
      <ActivityHeader
        title={`${unit.emoji} ${unit.title} — Escribe en inglés`}
        onExit={onExit}
        current={index + 1}
        total={prompts.length}
      />

      <div className="max-w-xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <p className="text-gray-500 mb-1">Traduce al inglés:</p>
          <p className="text-xl font-bold text-gray-800 mb-4">{prompt.promptEs}</p>
          {prompt.hintEs && <p className="text-sm text-brand-500 mb-3">💡 {prompt.hintEs}</p>}

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={Boolean(result)}
            placeholder="Escribe tu respuesta en inglés..."
            rows={2}
            className="w-full rounded-xl border-2 border-brand-100 px-4 py-3 text-lg focus:border-brand-400 focus:outline-none disabled:bg-gray-50"
          />

          {!result && (
            <button
              onClick={check}
              disabled={!answer.trim() || checking}
              className="w-full mt-4 rounded-2xl bg-brand-500 text-white font-bold py-3 shadow-md hover:bg-brand-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {checking ? "Revisando..." : "Revisar"}
            </button>
          )}

          {result && (
            <div
              className={`mt-4 rounded-2xl p-4 ${
                result.isCorrect ? "bg-brand-50 text-brand-800" : "bg-orange-50 text-orange-800"
              }`}
            >
              <p className="font-bold">{result.isCorrect ? "✅ ¡Correcto!" : "✏️ Casi"}</p>
              <p className="mt-1">
                Respuesta correcta: <span className="font-semibold">{result.correctedText}</span>
              </p>
              <p className="mt-2 text-sm">{result.explanation}</p>
              <p className="mt-2 text-sm italic">{result.encouragement}</p>
            </div>
          )}
        </div>

        <button
          onClick={next}
          disabled={!result}
          className="w-full mt-6 rounded-2xl bg-brand-500 text-white font-bold py-3 text-lg shadow-md hover:bg-brand-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLast ? "Ver resultados" : "Siguiente"}
        </button>
      </div>
    </div>
  );
}
