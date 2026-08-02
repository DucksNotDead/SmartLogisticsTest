import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auctions_/$auctionUuid')({
  component: AuctionDetailStubPage,
})

function AuctionDetailStubPage() {
  const { auctionUuid } = Route.useParams()

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <h1 className="text-2xl font-semibold tracking-tight">Аукцион</h1>
      <p className="break-all text-sm text-muted-foreground">{auctionUuid}</p>
      <p className="text-sm text-muted-foreground">
        Детальная страница будет в следующей change.
      </p>
    </div>
  )
}
