import { z } from 'zod'

export const DEFAULT_PAGE = 1
export const DEFAULT_PER_PAGE = 20
export const PER_PAGE_OPTIONS = [5, 10, 15, 20] as const

export type PerPageOption = (typeof PER_PAGE_OPTIONS)[number]

const perPageSchema = z.coerce
  .number()
  .int()
  .refine(
    (value): value is PerPageOption =>
      (PER_PAGE_OPTIONS as readonly number[]).includes(value),
  )
  .catch(DEFAULT_PER_PAGE)

export const auctionListSearchSchema = z.object({
  page: z.coerce.number().int().positive().catch(DEFAULT_PAGE),
  per_page: perPageSchema,
})

export type AuctionListSearch = z.infer<typeof auctionListSearchSchema>

export function parseAuctionListSearch(
  search: Record<string, unknown>,
): AuctionListSearch {
  return auctionListSearchSchema.parse(search)
}
