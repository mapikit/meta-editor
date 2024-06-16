import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import nodeResolve from "@rollup/plugin-node-resolve";
import tsconfig from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [svelte(), tsconfig()],
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