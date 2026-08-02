import fsd from '@feature-sliced/steiger-plugin'
import { defineConfig } from 'steiger'

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // Codegen / file-based router segments are not an FSD segment tree.
    ignores: [
      './src/shared/api/generated/**',
      './src/app/routeTree.gen.ts',
      './src/app/routes/**',
    ],
    rules: {
      // Thin slices (e.g. header-only shell / title page) are intentional early on.
      'fsd/insignificant-slice': 'off',
    },

  },
])
