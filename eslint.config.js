import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'public', 'scripts/**/*.png']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strict,
      tseslint.configs.stylistic,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      // GSAP plugins must be registered once, in src/lib/gsap.ts. Import from '@/lib/gsap' everywhere else.
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'gsap',
              message: "Import { gsap } from '@/lib/gsap' so plugins are registered once.",
            },
            { name: '@gsap/react', message: "Import { useGSAP } from '@/lib/gsap'." },
            {
              name: 'framer-motion',
              message: 'Framer Motion is not used in this project. Use GSAP.',
            },
            { name: 'motion', message: 'Framer Motion is not used in this project. Use GSAP.' },
          ],
          patterns: [{ group: ['gsap/*'], message: "Import GSAP plugins from '@/lib/gsap'." }],
        },
      ],
    },
  },
  {
    files: ['src/lib/gsap.ts'],
    rules: { 'no-restricted-imports': 'off' },
  },
  {
    files: ['vite.config.ts', 'eslint.config.js', 'scripts/**/*.{js,mjs}'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['scripts/**/*.{js,mjs}', 'eslint.config.js'],
    extends: [js.configs.recommended],
  },
  {
    // Puppeteer scripts: page.evaluate callbacks run in the browser.
    files: ['scripts/mockups/**/*.mjs', 'scripts/readme/**/*.mjs'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
  prettier,
])
