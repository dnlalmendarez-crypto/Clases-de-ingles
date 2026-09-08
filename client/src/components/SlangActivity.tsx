import { useState } from "react";
import type { Unit } from "../types";
import { speak } from "../lib/speech";
import ActivityHeader from "./ActivityHeader";

interface Props {
  unit: Unit;
  onExit: () => void;
  onDone: () => void;
}

export default function SlangActivity({ unit, onExit, onDone }: Props) {
  const items = unit.slang;
  const [index, setIndex] = useState(0);
  const item = items[index];
  const isLast = index === items.length - 1;

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
        title={`${unit.emoji} ${unit.title} — Slang y expresiones`}
        onExit={onExit}
        current={index + 1}
        total={items.length}
      />

      <div className="max-w-xl mx-auto px-4">
        <div key={item.id} className="bg-white rounded-2xl shadow-xl p-8 animate-pop">
          <span className="inline-block text-xs font-semibold uppercase tracking-wide bg-amber-100 text-amber-800 rounded-full px-3 py-1">
            Coloquial
          </span>

          <div className="text-2xl font-bold text-gray-800 mt-4">{item.phraseEn}</div>
          <div className="text-lg text-brand-600 mt-1">{item.meaningEs}</div>

          <button
            onClick={() => speak(item.phraseEn)}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-50 text-brand-700 font-semibold px-5 py-2 hover:bg-brand-100 transition text-sm"
          >
            🔊 Escuchar
          </button>

          <div className="mt-5 bg-brand-50/60 rounded-2xl p-4 text-left">
            <div className="text-gray-800 font-medium">"{item.exampleEn}"</div>
            <div className="text-gray-500 text-sm mt-1">"{item.exampleEs}"</div>
          </div>

          <div className="mt-3 text-sm text-gray-500 text-left">
            <span className="font-semibold text-gray-600">¿Cuándo usarlo? </span>
            {item.registerEs}
          </div>
        </div>

        <button
          onClick={next}
          className="w-full mt-6 rounded-2xl bg-brand-500 text-white font-bold py-3 text-lg shadow-md hover:bg-brand-600 transition"
        >
          {isLast ? "Continuar" : "Siguiente"}
        </button>
      </div>
    </div>
  );
}
