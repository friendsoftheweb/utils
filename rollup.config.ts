import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';

export default [
  defineConfig({
    input: ['src/index.ts'],
    output: [
      {
        dir: 'dist/cjs',
        format: 'cjs',
        preserveModules: true,
        exports: 'auto',
        sourcemap: true,
      },
    ],
    plugins: [typescript({ outDir: './dist/cjs' })],
  }),
  defineConfig({
    input: ['src/index.ts'],
    output: [
      {
        dir: 'dist/esm',
        format: 'esm',
        preserveModules: true,
        exports: 'auto',
        sourcemap: true,
      },
    ],
    plugins: [typescript({ outDir: './dist/esm' })],
  }),
];
