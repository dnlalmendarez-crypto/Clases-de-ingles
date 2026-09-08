// Envoltorios sobre la Web Speech API del navegador: texto-a-voz (para
// escuchar palabras/frases en inglés) y voz-a-texto (para practicar habla).
// No requieren backend ni llaves de API: funcionan directo en el navegador
// (mejor soporte en Chrome/Edge).

export function speak(text: string, rate = 0.9): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as any;
  return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
}

interface ListenResult {
  transcript: string;
}

export function listenOnce(): Promise<ListenResult> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("no_window"));
      return;
    }
    const w = window as any;
    const SpeechRecognitionCtor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      reject(new Error("not_supported"));
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    let settled = false;

    recognition.onresult = (event: any) => {
      settled = true;
      const transcript = event.results?.[0]?.[0]?.transcript ?? "";
      resolve({ transcript });
    };

    recognition.onerror = (event: any) => {
      if (settled) return;
      settled = true;
      reject(new Error(event.error || "speech_error"));
    };

    recognition.onend = () => {
      if (!settled) {
        settled = true;
        resolve({ transcript: "" });
      }
    };

    try {
      recognition.start();
    } catch (err) {
      reject(err instanceof Error ? err : new Error("start_failed"));
    }
  });
}
