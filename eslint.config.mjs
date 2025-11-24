import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import perfectionist from 'eslint-plugin-perfectionist';

export default defineConfig([
  { ignores: ['.yarn/**/*', 'coverage/**/*.js', 'dist/**/*'] },
  {
    extends: [tseslint.configs.recommended],
    plugins: {
      perfectionist,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'perfectionist/sort-imports': 'error',
    },
    files: ['**/*.{js,jsx,ts,tsx}'],
  },
]);
