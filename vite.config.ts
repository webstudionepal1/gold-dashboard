import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      // Add Node.js polyfills for browser compatibility
      crypto: "crypto-browserify",
      stream: "stream-browserify",
      util: "util",
      buffer: "buffer",
    },
  },
  build: {
    target: "esnext",
    rollupOptions: {
      external: [],
    },
  },
  optimizeDeps: {
    include: [
      "crypto-js",
      "crypto-browserify",
      "stream-browserify",
      "util",
      "buffer",
    ],
  },
});
