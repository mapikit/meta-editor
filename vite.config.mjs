import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import nodeResolve from "@rollup/plugin-node-resolve";

export default defineConfig({
  plugins: [svelte()],
  root: "./",
  publicDir: "./static",
  build: {
    assetsDir: "./assets",
    outDir: "./dist",
    emptyOutDir: true,
    minify: "esbuild",
    target: "es6",
    rollupOptions: {
      plugins: [
       nodeResolve({}),
      ],    
    }
  },
  optimizeDeps: {
  },
  server: {
    host: "0.0.0.0",
    port: 3000
  }
});