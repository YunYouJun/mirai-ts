import { defineConfig } from 'tsup'

export default defineConfig((options) => {
  return {
    splitting: false,
    clean: true,
    dts: true,
    minify: !options.watch,
    entryPoints: ['src/index.ts'],
    format: ['esm', 'cjs'],
  }
})
