import fsd from '@feature-sliced/steiger-plugin'
import { defineConfig } from 'steiger'

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // Codegen layout is not an FSD segment tree.
    ignores: ['./src/shared/api/generated/**'],
    rules: {
      // Entities land before pages (005-api); pages come in a later change.
      'fsd/insignificant-slice': 'off',
    },
  },
])
