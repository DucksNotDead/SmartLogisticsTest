import { createFileRoute } from '@tanstack/react-router'

import { AuctionDetailPage } from '@/pages/auction-detail'

export const Route = createFileRoute('/auctions_/$auctionUuid')({
  component: AuctionDetailRoute,
})

function AuctionDetailRoute() {
  const { auctionUuid } = Route.useParams()
  return <AuctionDetailPage auctionUuid={auctionUuid} />
}
