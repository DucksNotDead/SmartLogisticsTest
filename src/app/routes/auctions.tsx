import { createFileRoute } from '@tanstack/react-router'

import { AuctionListPage } from '@/pages/auction-list'

export const Route = createFileRoute('/auctions')({
  component: AuctionListPage,
})
