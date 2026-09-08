import { useState } from "react";
import type { UserLevel } from "../types";

interface Props {
  onFinish: (level: UserLevel, name: string) => void;
}

const LEVEL_OPTIONS: { level: UserLevel; title: string; desc: string; emoji: string }[] = [
  {
    level: "nulo",
    title: "No sé nada de inglés",
    desc: "Nunca he estudiado inglés, empecemos desde cero.",
    emoji: "🌱",
  },
  {
    level: "principiante",
    title: "Sé algunas palabras",
    desc: "Conozco palabras sueltas como 'hello' o 'thank you'.",
    emoji: "🌿",
  },
  {
    level: "basico",
    title: "Puedo armar frases simples",
    desc: "Puedo decir cosas como 'I want water'.",
    emoji: "🌳",
  },
];

export default function Onboarding({ onFinish }: Props) {
  const [step, setStep] = useState<0 | 1>(0);
  const [name, setName] = useState("");
  const [level, setLevel] = useState<UserLevel | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 animate-pop">
        <div className="text-center mb-6">
          <div className="text-6xl mb-2">🎓</div>
          <h1 className="text-2xl font-extrabold text-brand-800">Clases de Inglés</h1>
          <p className="text-brand-600 mt-1">Aprende inglés paso a paso, desde cero</p>
        </div>

        {step === 0 && (
          <div className="space-y-5">
            <label className="block">
              <span className="text-sm font-semibold text-gray-700">¿Cómo te llamas?</span>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Escribe tu nombre"
                className="mt-2 w-full rounded-xl border-2 border-brand-100 px-4 py-3 text-lg focus:border-brand-400 focus:outline-none"
              />
            </label>
            <button
              disabled={!name.trim()}
              onClick={() => setStep(1)}
              className="w-full rounded-2xl bg-brand-500 text-white font-bold py-3 text-lg shadow-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-600 transition"
            >
              Continuar
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-gray-700 text-center">
              Hola {name} 👋 ¿Cuánto inglés sabes ahorita?
            </p>
            <div className="space-y-3">
              {LEVEL_OPTIONS.map((opt) => (
                <button
                  key={opt.level}
                  onClick={() => setLevel(opt.level)}
                  className={`w-full text-left flex items-center gap-4 rounded-2xl border-2 px-4 py-3 transition ${
                    level === opt.level
                      ? "border-brand-500 bg-brand-50"
                      : "border-gray-100 hover:border-brand-200"
                  }`}
                >
                  <span className="text-3xl">{opt.emoji}</span>
                  <span>
                    <span className="block font-bold text-gray-800">{opt.title}</span>
                    <span className="block text-sm text-gray-500">{opt.desc}</span>
                  </span>
                </button>
              ))}
            </div>
            <button
              disabled={!level}
              onClick={() => level && onFinish(level, name.trim())}
              className="w-full rounded-2xl bg-brand-500 text-white font-bold py-3 text-lg shadow-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-600 transition"
            >
              Empezar a aprender
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
