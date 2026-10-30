import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  { ignores: ['dist', 'docs'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    // The simulation is the game's source of truth. Keeping it free of engine code
    // keeps it deterministic, testable headless, and portable (see docs/ARCHITECTURE.md).
    files: ['src/sim/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['react', 'react-*', 'three', 'three/*', '@react-three/*', 'zustand', '../game/*', '../render/*', '../ui/*', '../data/*'],
              message: 'src/sim must stay engine-free: no React, three.js, store or data imports.',
            },
          ],
        },
      ],
    },
  },
);
