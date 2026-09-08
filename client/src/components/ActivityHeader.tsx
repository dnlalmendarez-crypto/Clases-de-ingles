import ProgressBar from "./ProgressBar";

interface Props {
  title: string;
  onExit: () => void;
  current: number;
  total: number;
}

export default function ActivityHeader({ title, onExit, current, total }: Props) {
  return (
    <div className="max-w-xl mx-auto px-4 pt-6">
      <div className="flex items-center gap-4 mb-3">
        <button
          onClick={onExit}
          aria-label="Salir"
          className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
        >
          ✕
        </button>
        <div className="flex-1">
          <ProgressBar current={current} total={total} />
        </div>
      </div>
      <h2 className="text-center text-brand-700 font-bold mb-4">{title}</h2>
    </div>
  );
}
