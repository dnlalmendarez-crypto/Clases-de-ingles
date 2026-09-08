import { useState } from "react";
import type { Unit } from "../types";
import { speak } from "../lib/speech";
import ActivityHeader from "./ActivityHeader";

interface Props {
  unit: Unit;
  onExit: () => void;
  onDone: (score: number) => void;
}

export default function DialogueActivity({ unit, onExit, onDone }: Props) {
  const { dialogue } = unit;
  const [phase, setPhase] = useState<"reading" | "check">("reading");
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const isCorrect = selected === dialogue.check.correctIndex;

  const submit = () => {
    if (selected === null) return;
    setChecked(true);
  };

  const finish = () => {
    onDone(isCorrect ? 100 : 50);
  };

  return (
    <div className="min-h-screen pb-10">
      <ActivityHeader
        title={`${unit.emoji} ${unit.title} — Caso real`}
        onExit={onExit}
        current={phase === "reading" ? 1 : 2}
        total={2}
      />

      <div className="max-w-xl mx-auto px-4">
        {phase === "reading" && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="font-bold text-gray-800">{dialogue.titleEs}</h3>
            <p className="text-sm text-gray-500 mt-1 mb-5">{dialogue.contextEs}</p>

            <div className="space-y-3">
              {dialogue.lines.map((line, i) => {
                const isA = line.speaker === "A";
                return (
                  <div key={i} className={`flex ${isA ? "justify-start" : "justify-end"}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        isA ? "bg-brand-50 text-gray-800" : "bg-brand-600 text-white"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <p className="font-medium">{line.en}</p>
                        <button
                          onClick={() => speak(line.en)}
                          aria-label="Escuchar"
                          className={`shrink-0 text-sm ${isA ? "text-brand-500" : "text-white/80"}`}
                        >
                          🔊
                        </button>
                      </div>
                      <p className={`text-sm mt-1 ${isA ? "text-gray-500" : "text-white/80"}`}>{line.es}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setPhase("check")}
              className="w-full mt-6 rounded-2xl bg-brand-500 text-white font-bold py-3 text-lg shadow-md hover:bg-brand-600 transition"
            >
              Continuar
            </button>
          </div>
        )}

        {phase === "check" && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <p className="text-gray-500 mb-1">Pregunta sobre la conversación:</p>
            <p className="text-xl font-bold text-gray-800 mb-5">{dialogue.check.questionEs}</p>

            <div className="space-y-3">
              {dialogue.check.options.map((opt, i) => {
                const isSelected = selected === i;
                const showCorrect = checked && i === dialogue.check.correctIndex;
                const showWrong = checked && isSelected && i !== dialogue.check.correctIndex;
                return (
                  <button
                    key={i}
                    onClick={() => !checked && setSelected(i)}
                    disabled={checked}
                    className={`w-full text-left rounded-xl border-2 px-4 py-3 font-medium transition ${
                      showCorrect
                        ? "border-brand-500 bg-brand-50 text-brand-700"
                        : showWrong
                        ? "border-red-400 bg-red-50 text-red-600 animate-shake"
                        : isSelected
                        ? "border-brand-400 bg-brand-50"
                        : "border-gray-100 hover:border-brand-200 text-gray-700"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {!checked ? (
              <button
                onClick={submit}
                disabled={selected === null}
                className="w-full mt-6 rounded-2xl bg-brand-500 text-white font-bold py-3 text-lg shadow-md hover:bg-brand-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Revisar
              </button>
            ) : (
              <>
                <p className={`mt-4 font-semibold ${isCorrect ? "text-brand-600" : "text-red-500"}`}>
                  {isCorrect ? "¡Correcto! 🎉" : `La respuesta correcta era: ${dialogue.check.options[dialogue.check.correctIndex]}`}
                </p>
                <button
                  onClick={finish}
                  className="w-full mt-4 rounded-2xl bg-brand-500 text-white font-bold py-3 text-lg shadow-md hover:bg-brand-600 transition"
                >
                  Continuar
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
