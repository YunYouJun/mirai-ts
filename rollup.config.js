import { defineConfig } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import { dependencies } from "./package.json";

const external = Object.keys({ ...dependencies }); // 默认不打包 dependencies,
const outputName = "MiraiTs"; // 导出的模块名称 PascalCase

function getPlugins({
  isBrowser = false,
  isMin = false,
  isDeclaration = false,
}) {
  const plugins = [];
  plugins.push(
    nodeResolve({
      browser: isBrowser,
      preferBuiltins: true,
    })
  );
  plugins.push(
    typescript({
      tsconfig: "tsconfig.json",
      module: "esnext",
      target: "es2018",
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      declaration: isDeclaration,
      sourceMap: false,
    })
  );
  plugins.push(
    commonjs({
      sourceMap: false,
    })
  );
  plugins.push(json({}));
  if (isMin) {
    plugins.push(
      terser({
        module: true,
      })
    );
  }
  return plugins;
}

export default defineConfig([
  {
    input: "src/index.ts", // 生成类型文件
    external,
    output: {
      dir: "dist",
      format: "esm",
      name: outputName,
    },
    plugins: getPlugins({
      isBrowser: false,
      isDeclaration: true,
      isMin: false,
    }),
  },
  {
    input: "src/index.ts",
    external,
    output: {
      file: "dist/index.js", // 生成 cjs
      format: "cjs",
      name: outputName,
    },
    plugins: getPlugins({
      isBrowser: false,
      isDeclaration: false,
      isMin: false,
    }),
  },
  {
    input: "src/index.ts",
    external,
    output: {
      file: "dist/index.esm.js", // 生成 esm
      format: "esm",
      name: outputName,
    },
    plugins: getPlugins({
      isBrowser: false,
      isDeclaration: false,
      isMin: false,
    }),
  },
  // {
  //     input: 'src/index.ts',
  //     output: {
  //         file: 'dist/index.browser.js', // 生成 browser umd
  //         format: 'umd',
  //         name: outputName,
  //     },
  //     plugins: getPlugins({
  //         isBrowser: true,
  //         isDeclaration: false,
  //         isMin: true,
  //     }),
  // },
  // {
  //     input: 'src/index.ts',
  //     output: {
  //         file: 'dist/index.browser.esm.js', // 生成 browser esm
  //         format: 'esm',
  //         name: outputName,
  //     },
  //     plugins: getPlugins({
  //         isBrowser: true,
  //         isDeclaration: false,
  //         isMin: true,
  //     }),
  // },
]);
