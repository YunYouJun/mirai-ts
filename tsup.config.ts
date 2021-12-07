import { defineConfig } from "tsup";

export default defineConfig({
  splitting: false,
  clean: true,
  dts: true,
  minify: true,
  entryPoints: ["src/index.ts"],
  format: ["esm", "cjs"],
});
