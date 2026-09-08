import { useState } from "react";

interface Props {
  getBackupCode: () => string;
  onImport: (code: string) => boolean;
}

export default function BackupPanel({ getBackupCode, onImport }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState("");
  const [importStatus, setImportStatus] = useState<"idle" | "ok" | "error">("idle");

  const copyCode = async () => {
    const code = getBackupCode();
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const restore = () => {
    if (!importText.trim()) return;
    const ok = onImport(importText.trim());
    setImportStatus(ok ? "ok" : "error");
  };

  return (
    <div className="mt-8">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-sm text-brand-600 font-semibold hover:underline"
      >
        {open ? "Ocultar respaldo de progreso" : "💾 Respaldar o restaurar progreso"}
      </button>

      {open && (
        <div className="mt-3 bg-white rounded-2xl shadow p-5 space-y-5">
          <div>
            <p className="text-sm text-gray-600">
              Tu progreso ya se guarda automáticamente en este navegador, aunque cierres la
              aplicación. Si vas a cambiar de navegador o de dispositivo, copia este código y
              úsalo para restaurar tu progreso ahí.
            </p>
            <textarea
              readOnly
              value={getBackupCode()}
              rows={3}
              className="w-full mt-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-mono text-gray-500"
              onFocus={(e) => e.currentTarget.select()}
            />
            <button
              onClick={copyCode}
              className="mt-2 text-sm rounded-lg bg-brand-500 text-white font-semibold px-4 py-2 hover:bg-brand-600 transition"
            >
              {copied ? "¡Copiado!" : "Copiar código"}
            </button>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-600 mb-2">Restaurar progreso desde un código:</p>
            <textarea
              value={importText}
              onChange={(e) => {
                setImportText(e.target.value);
                setImportStatus("idle");
              }}
              rows={3}
              placeholder="Pega aquí tu código de respaldo..."
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-mono focus:border-brand-400 focus:outline-none"
            />
            <button
              onClick={restore}
              disabled={!importText.trim()}
              className="mt-2 text-sm rounded-lg bg-gray-700 text-white font-semibold px-4 py-2 hover:bg-gray-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Restaurar
            </button>
            {importStatus === "ok" && (
              <p className="text-sm text-brand-600 mt-2">Progreso restaurado correctamente.</p>
            )}
            {importStatus === "error" && (
              <p className="text-sm text-red-500 mt-2">
                Ese código no es válido. Revisa que lo hayas copiado completo.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
