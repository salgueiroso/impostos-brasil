import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm", "iife", "umd"], // Build for commonJS and ESmodules
  dts: true, // Generate declaration file (.d.ts)
  sourcemap: true,
  clean: true,




  // Minificação — no tsdown aceita booleano ou opções granulares
  minify: true,

  // Tree-shaking nativo do rolldown (já ativo por padrão, mas explícito)
  treeshake: true,

  // Target do ambiente — false desativa transformação de sintaxe
  // Defina explicitamente se quiser garantir compatibilidade:
  target: false, // ou "node18", "chrome90", etc.


  // Para o formato iife, defina o nome global
  globalName: "ImpostosBrasil",// Configuração para remover consoles

});