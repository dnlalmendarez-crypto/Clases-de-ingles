import { useState } from "react";
import type { Unit, UserLevel } from "../types";
import { isSpeechRecognitionSupported, listenOnce, speak } from "../lib/speech";
import { getSpeakFeedback } from "../lib/api";
import { similarityScore } from "../lib/textDistance";
import ActivityHeader from "./ActivityHeader";

interface Props {
  unit: Unit;
  level: UserLevel;
  onExit: () => void;
  onDone: (score: number) => void;
}

type Status = "idle" | "listening" | "checking" | "done" | "error";

export default function SpeakingActivity({ unit, level, onExit, onDone }: Props) {
  const items = unit.vocab;
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [heard, setHeard] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [tip, setTip] = useState("");
  const [totalScore, setTotalScore] = useState(0);
  const speechSupported = isSpeechRecognitionSupported();

  const item = items[index];
  const target = item.exampleEn;
  const isLast = index === items.length - 1;

  const record = async () => {
    setStatus("listening");
    setHeard("");
    setTip("");
    try {
      const { transcript } = await listenOnce();
      setHeard(transcript);
      const sim = similarityScore(target, transcript);
      setScore(sim);
      setStatus("checking");
      const feedback = await getSpeakFeedback({ target, heard: transcript, level });
      setTip(feedback.tip);
      setTotalScore((s) => s + sim);
      setStatus("done");
    } catch {
      setTip("No pude acceder al micrófono. Revisa los permisos del navegador e inténtalo de nuevo.");
      setStatus("error");
    }
  };

  const skip = () => {
    setStatus("done");
    setScore(0);
    setTip("No se pudo usar el micrófono. Sigamos con la siguiente frase.");
  };

  const next = () => {
    if (isLast) {
      onDone(Math.round(totalScore / items.length));
    } else {
      setIndex((i) => i + 1);
      setStatus("idle");
      setHeard("");
      setScore(null);
      setTip("");
    }
  };

  return (
    <div className="min-h-screen pb-10">
      <ActivityHeader
        title={`${unit.emoji} ${unit.title} — Habla en inglés`}
        onExit={onExit}
        current={index + 1}
        total={items.length}
      />

      <div className="max-w-xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          <p className="text-gray-500 mb-2">Repite esta frase en voz alta</p>
          <div className="text-3xl mb-1">{item.emoji}</div>
          <div className="text-2xl font-extrabold text-gray-800">{target}</div>
          <div className="text-gray-400 text-sm mt-1">"{item.exampleEs}"</div>

          <button
            onClick={() => speak(target)}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-50 text-brand-700 font-semibold px-4 py-2 hover:bg-brand-100 transition text-sm"
          >
            🔊 Escuchar ejemplo
          </button>

          <div className="mt-6">
            {!speechSupported && (
              <p className="text-sm text-red-500 mb-3">
                Tu navegador no soporta reconocimiento de voz. Prueba con Chrome en computadora o
                Android.
              </p>
            )}

            {speechSupported && status !== "done" && status !== "error" && (
              <button
                onClick={record}
                disabled={status === "listening" || status === "checking"}
                className="rounded-full bg-sun-500 text-white font-bold w-24 h-24 text-4xl shadow-md hover:bg-sun-400 transition disabled:opacity-60"
              >
                {status === "listening" ? "🎙️" : status === "checking" ? "⏳" : "🎤"}
              </button>
            )}

            {status === "listening" && <p className="text-brand-600 mt-3 animate-pulse">Escuchando...</p>}
            {status === "checking" && <p className="text-brand-600 mt-3">Revisando tu pronunciación...</p>}

            {(status === "done" || status === "error") && (
              <div className="mt-4 bg-brand-50/60 rounded-2xl p-4 text-left">
                {heard && (
                  <p className="text-sm text-gray-600">
                    Escuché: <span className="font-semibold">"{heard}"</span>
                    {score !== null && <span className="text-gray-400"> ({score}%)</span>}
                  </p>
                )}
                <p className="text-gray-800 mt-2">{tip}</p>
                <div className="flex gap-2 mt-3">
                  {speechSupported && (
                    <button
                      onClick={record}
                      className="text-sm text-brand-600 font-semibold hover:underline"
                    >
                      🔁 Intentar de nuevo
                    </button>
                  )}
                </div>
              </div>
            )}

            {speechSupported && status === "idle" && (
              <button onClick={skip} className="block mx-auto mt-4 text-xs text-gray-400 underline">
                No puedo usar el micrófono ahora
              </button>
            )}
          </div>
        </div>

        <button
          onClick={next}
          disabled={status !== "done" && status !== "error"}
          className="w-full mt-6 rounded-2xl bg-brand-500 text-white font-bold py-3 text-lg shadow-md hover:bg-brand-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLast ? "Continuar" : "Siguiente"}
        </button>
      </div>
    </div>
  );
}
