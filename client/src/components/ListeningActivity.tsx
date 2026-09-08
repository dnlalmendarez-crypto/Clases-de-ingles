import { useMemo, useState } from "react";
import type { Unit, VocabItem } from "../types";
import { speak } from "../lib/speech";
import ActivityHeader from "./ActivityHeader";

interface Props {
  unit: Unit;
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

interface Question {
  item: VocabItem;
  options: VocabItem[];
}

export default function ListeningActivity({ unit, onExit, onDone }: Props) {
  const questions = useMemo<Question[]>(() => {
    const roundSize = Math.min(6, unit.vocab.length);
    const picked = shuffle(unit.vocab).slice(0, roundSize);
    return picked.map((item) => {
      const distractors = shuffle(unit.vocab.filter((v) => v.id !== item.id)).slice(0, 3);
      return { item, options: shuffle([item, ...distractors]) };
    });
    // Se vuelve a elegir un subconjunto aleatorio cada vez que se entra a la unidad,
    // para que la práctica no sea siempre exactamente igual.
  }, [unit]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const question = questions[index];
  const isLast = index === questions.length - 1;
  const answered = selected !== null;
  const isCorrect = selected === question.item.id;

  const playAudio = () => speak(question.item.en);

  const choose = (optionId: string) => {
    if (answered) return;
    setSelected(optionId);
    if (optionId === question.item.id) setCorrectCount((c) => c + 1);
  };

  const next = () => {
    if (isLast) {
      onDone(Math.round((correctCount / questions.length) * 100));
    } else {
      setSelected(null);
      setIndex((i) => i + 1);
    }
  };

  return (
    <div className="min-h-screen pb-10">
      <ActivityHeader
        title={`${unit.emoji} ${unit.title} — Escucha y elige`}
        onExit={onExit}
        current={index + 1}
        total={questions.length}
      />

      <div className="max-w-xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <p className="text-gray-500 mb-4">Escucha la palabra y elige la traducción correcta</p>
          <button
            onClick={playAudio}
            className="text-6xl bg-brand-50 hover:bg-brand-100 transition rounded-full w-28 h-28 flex items-center justify-center mx-auto"
            aria-label="Reproducir audio"
          >
            🔊
          </button>

          <div className="grid grid-cols-2 gap-3 mt-8">
            {question.options.map((opt) => {
              const isSelected = selected === opt.id;
              const showCorrect = answered && opt.id === question.item.id;
              const showWrong = answered && isSelected && opt.id !== question.item.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => choose(opt.id)}
                  disabled={answered}
                  className={`rounded-2xl border-2 px-4 py-4 font-semibold transition ${
                    showCorrect
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : showWrong
                      ? "border-red-400 bg-red-50 text-red-600 animate-shake"
                      : "border-gray-100 hover:border-brand-200 text-gray-700"
                  }`}
                >
                  <span className="text-2xl block mb-1">{opt.emoji}</span>
                  {opt.es}
                </button>
              );
            })}
          </div>

          {answered && (
            <p className={`mt-5 font-semibold ${isCorrect ? "text-brand-600" : "text-red-500"}`}>
              {isCorrect ? "¡Correcto! 🎉" : `Era: ${question.item.es}`}
            </p>
          )}
        </div>

        <button
          onClick={next}
          disabled={!answered}
          className="w-full mt-6 rounded-2xl bg-brand-500 text-white font-bold py-3 text-lg shadow-md hover:bg-brand-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLast ? "Continuar" : "Siguiente"}
        </button>
      </div>
    </div>
  );
}
