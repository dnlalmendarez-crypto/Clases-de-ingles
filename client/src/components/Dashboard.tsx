import { CURRICULUM } from "../data/curriculum";
import type { ProgressState } from "../types";
import BackupPanel from "./BackupPanel";

interface Props {
  progress: ProgressState;
  isUnitUnlocked: (unitId: string) => boolean;
  onSelectUnit: (unitId: string) => void;
  onReset: () => void;
  getBackupCode: () => string;
  onImportProgress: (code: string) => boolean;
}

function Stars({ count }: { count: number }) {
  return (
    <span className="text-sm">
      {"⭐".repeat(count)}
      {"☆".repeat(3 - count)}
    </span>
  );
}

export default function Dashboard({
  progress,
  isUnitUnlocked,
  onSelectUnit,
  onReset,
  getBackupCode,
  onImportProgress,
}: Props) {
  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-800">
            ¡Hola, {progress.name || "estudiante"}! 👋
          </h1>
          <p className="text-brand-600 text-sm mt-1">Sigue tu camino para aprender inglés</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-xl px-3 py-2 shadow text-center">
            <div className="text-xs text-gray-400">XP</div>
            <div className="font-bold text-brand-700">{progress.xp}</div>
          </div>
          <div className="bg-white rounded-xl px-3 py-2 shadow text-center">
            <div className="text-xs text-gray-400">Racha</div>
            <div className="font-bold text-sun-500">🔥 {progress.streak}</div>
          </div>
        </div>
      </header>

      <div className="space-y-4">
        {CURRICULUM.map((unit, index) => {
          const unlocked = isUnitUnlocked(unit.id);
          const unitProgress = progress.units[unit.id];

          return (
            <button
              key={unit.id}
              disabled={!unlocked}
              onClick={() => onSelectUnit(unit.id)}
              className={`w-full flex items-center gap-4 rounded-2xl p-4 shadow transition text-left ${
                unlocked
                  ? `bg-gradient-to-br ${unit.color} text-white hover:scale-[1.01]`
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <div className="text-4xl bg-white/20 rounded-xl w-16 h-16 flex items-center justify-center">
                {unlocked ? unit.emoji : "🔒"}
              </div>
              <div className="flex-1">
                <div className="font-bold text-lg flex items-center gap-2">
                  {index + 1}. {unit.title}
                </div>
                <div className={`text-sm ${unlocked ? "text-white/90" : "text-gray-400"}`}>
                  {unit.description}
                </div>
                {unitProgress?.completed && (
                  <div className="mt-1">
                    <Stars count={unitProgress.stars} />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <BackupPanel getBackupCode={getBackupCode} onImport={onImportProgress} />

      <div className="text-center mt-6">
        <button onClick={onReset} className="text-xs text-gray-400 underline hover:text-gray-600">
          Reiniciar progreso
        </button>
      </div>
    </div>
  );
}
