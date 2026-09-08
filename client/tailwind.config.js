/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Nunito'", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#eefbf3",
          100: "#d6f5e2",
          200: "#aeebc9",
          300: "#7bdaac",
          400: "#46c28c",
          500: "#22a672",
          600: "#15855c",
          700: "#136a4b",
          800: "#12543e",
          900: "#104634",
        },
        sun: {
          400: "#ffc857",
          500: "#ffb703",
        },
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-6px)" },
          "75%": { transform: "translateX(6px)" },
        },
      },
      animation: {
        pop: "pop 0.25s ease-out",
        shake: "shake 0.3s ease-in-out",
      },
    },
  },
  plugins: [],
};
