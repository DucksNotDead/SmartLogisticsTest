import { createFileRoute } from '@tanstack/react-router'

import {
  AuctionListPage,
  parseAuctionListSearch,
} from '@/pages/auction-list'

export const Route = createFileRoute('/auctions')({
  validateSearch: (search) => parseAuctionListSearch(search),
  component: AuctionListPage,
})
