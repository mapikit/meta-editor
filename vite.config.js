import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  root: "./",
  publicDir: "./static",
  build: {
    assetsDir: "./assets",
    outDir: "./dist",
    emptyOutDir: true,
    minify: "esbuild",
    target: "es6"
  },
  server: {
    host: "0.0.0.0",
    port: 3000
  }
});