/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      colors: {
        // Paleta principal: azul pizarra apagado, tono serio para un
        // publico adulto (en vez del verde/menta tipo app infantil).
        brand: {
          50: "#f2f6f8",
          100: "#e1e9ee",
          200: "#c2d3dc",
          300: "#99b3c1",
          400: "#6d8fa3",
          500: "#4d7089",
          600: "#3c5a6f",
          700: "#304757",
          800: "#283a47",
          900: "#22303a",
        },
        // Acento: dorado apagado, para XP/logros, sin ser estridente.
        sun: {
          400: "#d1a54e",
          500: "#b8892e",
        },
      },
      keyframes: {
        pop: {
          "0%": { transform: "translateY(6px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px)" },
          "75%": { transform: "translateX(5px)" },
        },
      },
      animation: {
        pop: "pop 0.2s ease-out",
        shake: "shake 0.25s ease-in-out",
      },
    },
  },
  plugins: [],
};
