import type { Unit } from "../types";

interface Props {
  unit: Unit;
  score: number;
  onBackToDashboard: () => void;
}

export default function ResultsScreen({ unit, score, onBackToDashboard }: Props) {
  const stars = score >= 90 ? 3 : score >= 70 ? 2 : score >= 40 ? 1 : 0;
  const message =
    stars === 3
      ? "¡Increíble! Dominaste esta unidad."
      : stars === 2
      ? "¡Muy bien hecho! Sigue así."
      : stars === 1
      ? "¡Buen trabajo! Con práctica mejorarás."
      : "¡Completaste la unidad! Puedes repasarla cuando quieras.";

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center animate-pop">
        <div className="text-7xl mb-3">{stars >= 2 ? "🏆" : "🎉"}</div>
        <h2 className="text-2xl font-extrabold text-brand-800">
          {unit.emoji} {unit.title} completado
        </h2>
        <p className="text-gray-500 mt-2">{message}</p>

        <div className="text-4xl mt-4">
          {"⭐".repeat(stars)}
          {"☆".repeat(3 - stars)}
        </div>

        <div className="mt-4 text-brand-700 font-bold text-lg">Puntaje: {score}%</div>

        <button
          onClick={onBackToDashboard}
          className="w-full mt-6 rounded-2xl bg-brand-500 text-white font-bold py-3 text-lg shadow-md hover:bg-brand-600 transition"
        >
          Volver al mapa
        </button>
      </div>
    </div>
  );
}
