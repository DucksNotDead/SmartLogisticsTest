import { z } from 'zod'

export const DETAIL_TABS = ['info', 'bets'] as const
export type DetailTab = (typeof DETAIL_TABS)[number]

export const DEFAULT_DETAIL_TAB: DetailTab = 'info'

export type AuctionDetailSearch = {
  tab: DetailTab
}

const detailSearchSchema = z.object({
  tab: z.enum(DETAIL_TABS).catch(DEFAULT_DETAIL_TAB),
})

/** Safe search parse for detail tabs (`?tab=info|bets`). */
export function parseAuctionDetailSearch(
  search: Record<string, unknown>,
): AuctionDetailSearch {
  return detailSearchSchema.parse(search)
}
