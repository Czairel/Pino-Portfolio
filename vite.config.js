import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// On Netlify, the site is served from the domain root and published from `dist`.
// Elsewhere (GitHub Pages), it's served from /pino-portfolio/ and published from `docs`.
const isNetlify = !!process.env.NETLIFY;

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  base: mode === "production" && !isNetlify ? "/pino-portfolio/" : "/",
  build: {
    outDir: isNetlify ? "dist" : "docs",
  },
}));
