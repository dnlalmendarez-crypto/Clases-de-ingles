import { useState } from "react";
import type { Unit } from "../types";
import { speak } from "../lib/speech";
import ActivityHeader from "./ActivityHeader";

interface Props {
  unit: Unit;
  onExit: () => void;
  onDone: () => void;
}

export default function Presentation({ unit, onExit, onDone }: Props) {
  const [index, setIndex] = useState(0);
  const item = unit.vocab[index];
  const isLast = index === unit.vocab.length - 1;

  const next = () => {
    if (isLast) {
      onDone();
    } else {
      setIndex((i) => i + 1);
    }
  };

  return (
    <div className="min-h-screen pb-10">
      <ActivityHeader
        title={`${unit.emoji} ${unit.title} — Vocabulario`}
        onExit={onExit}
        current={index + 1}
        total={unit.vocab.length}
      />

      <div className="max-w-xl mx-auto px-4">
        <div key={item.id} className="bg-white rounded-3xl shadow-xl p-8 text-center animate-pop">
          <div className="text-8xl mb-4">{item.emoji}</div>
          <div className="text-3xl font-extrabold text-gray-800">{item.en}</div>
          <div className="text-xl text-brand-600 mt-1">{item.es}</div>

          <button
            onClick={() => speak(item.en)}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-50 text-brand-700 font-semibold px-5 py-2 hover:bg-brand-100 transition"
          >
            🔊 Escuchar
          </button>

          <div className="mt-6 bg-brand-50/60 rounded-2xl p-4 text-left">
            <div className="text-gray-800 font-medium">"{item.exampleEn}"</div>
            <div className="text-gray-500 text-sm mt-1">"{item.exampleEs}"</div>
          </div>
        </div>

        <button
          onClick={next}
          className="w-full mt-6 rounded-2xl bg-brand-500 text-white font-bold py-3 text-lg shadow-md hover:bg-brand-600 transition"
        >
          {isLast ? "Continuar a la práctica" : "Siguiente"}
        </button>
      </div>
    </div>
  );
}
