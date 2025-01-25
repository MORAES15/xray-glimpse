import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import tailwindcss from "tailwindcss"; // Importação direta
import autoprefixer from "autoprefixer"; // Importação direta

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss(), // Uso direto
        autoprefixer(), // Uso direto
      ],
    },
  },
}));