import { defineConfig } from 'orval'

export default defineConfig({
  auctions: {
    input: {
      target: './input/openapi.auctions.v0.json',
    },
    output: {
      mode: 'tags-split',
      target: './src/shared/api/generated/endpoints',
      schemas: './src/shared/api/generated/schemas',
      client: 'react-query',
      mock: false,
      clean: true,
      override: {
        mutator: {
          path: './src/shared/api/http.ts',
          name: 'customFetch',
        },
        fetch: {
          // Mutator returns JSON body (throws on error); no { data, status, headers } wrap.
          includeHttpResponseReturnType: false,
        },
        operations: {
          // POST list is a read; expose as query, not mutation.
          listAuctions: {
            query: {
              useQuery: true,
            },
          },
        },
      },
    },
  },
})
