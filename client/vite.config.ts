import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Nota: las funciones en api/ solo corren con `vercel dev` o en Vercel.
// Con `vite` (npm run dev) el frontend funciona igual, pero /api/* no
// responde y la app usa su modo de corrección local automáticamente.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
