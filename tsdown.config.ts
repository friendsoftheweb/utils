import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    node: 'src/node/index.ts',
  },
  target: 'es2020',
  format: ['esm', 'cjs'],
  sourcemap: true,
  dts: true,
});
