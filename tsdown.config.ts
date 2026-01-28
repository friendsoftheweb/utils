import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: 'src/index.ts',
  target: 'es2020',
  format: ['esm', 'cjs'],
  sourcemap: true,
  dts: true,
});
