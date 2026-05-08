import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm", "iife"],
  dts: true,
  sourcemap: true,
  clean: true,
  target: "es2016",
  globalName: "ImpostosBrasil",
  minify: false,

  outputOptions: {
    comments: {
      legal: false
    }
  },

  treeshake: {
    moduleSideEffects: (id) => {
      if (id.includes("extensoes")) return true;
      if (id.includes("extensions")) return true;
      return false;
    },
    propertyReadSideEffects: false,
    unknownGlobalSideEffects: false,
    annotations: true
  },

  unbundle: false,
});