import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'

import {
  mapAuctionDetail,
  useGetAuction,
} from '@/entities/auction'
import { getListBetsQueryKey } from '@/entities/bet'
import { SetBetSheet } from '@/features/set-bet'
import { ApiError } from '@/shared/api'
import { cn } from '@/shared/lib'

import { useDetailChromeTitle } from '../lib/use-detail-chrome-title'
import { usePageLeaveTransition } from '../lib/use-page-leave-transition'
import type { DetailTab } from '../model/search'
import { AuctionDetailError } from './AuctionDetailError.component'
import { AuctionDetailSkeleton } from './AuctionDetailSkeleton.component'
import { BetsTab } from './BetsTab.component'
import { DetailHeader } from './DetailHeader.component'
import { DetailTabs } from './DetailTabs.component'
import { InfoTab } from './InfoTab.component'

const HIGHLIGHT_MS = 1500

type AuctionDetailPageProps = {
  auctionUuid: string
}

function isNotFoundError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404
}

export function AuctionDetailPage({ auctionUuid }: AuctionDetailPageProps) {
  const queryClient = useQueryClient()
  const query = useGetAuction(auctionUuid)
  const detail = query.data ? mapAuctionDetail(query.data) : null
  const title = detail?.title ?? 'Аукцион'
  const titleRef = useDetailChromeTitle(query.isSuccess ? title : 'Аукцион')
  const { leaving, goToList } = usePageLeaveTransition()

  const { tab } = useSearch({ from: '/auctions_/$auctionUuid' })
  const navigate = useNavigate({ from: '/auctions/$auctionUuid' })

  const [sheetOpen, setSheetOpen] = useState(false)
  const [sheetKey, setSheetKey] = useState(0)
  const [highlightPrice, setHighlightPrice] = useState<number | null>(null)
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const highlightSeqRef = useRef(0)

  useEffect(() => {
    return () => {
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current)
      highlightSeqRef.current += 1
    }
  }, [])

  const setTab = (next: DetailTab) => {
    void navigate({
      search: { tab: next },
      replace: true,
    })
  }

  const openSetBet = () => {
    if (query.isFetching) return
    setSheetKey((key) => key + 1)
    setSheetOpen(true)
  }

  const handlePlaced = (price: number) => {
    setTab('bets')
    if (!detail?.visibility.betsHistory) return

    const seq = ++highlightSeqRef.current
    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current)

    void queryClient
      .refetchQueries({
        queryKey: getListBetsQueryKey(auctionUuid),
      })
      .then(() => {
        if (seq !== highlightSeqRef.current) return
        setHighlightPrice(price)
        highlightTimerRef.current = setTimeout(() => {
          if (seq !== highlightSeqRef.current) return
          setHighlightPrice(null)
        }, HIGHLIGHT_MS)
      })
  }

  if (query.isPending) {
    return (
      <div className="detail-page-enter min-w-0">
        <AuctionDetailSkeleton />
      </div>
    )
  }

  if (query.isError) {
    return (
      <div className="detail-page-enter min-w-0">
        {isNotFoundError(query.error) ? (
          <AuctionDetailError kind="not-found" />
        ) : (
          <AuctionDetailError
            kind="error"
            onRetry={() => {
              void query.refetch()
            }}
          />
        )}
      </div>
    )
  }

  if (!detail) {
    return (
      <div className="detail-page-enter min-w-0">
        <AuctionDetailError kind="not-found" />
      </div>
    )
  }

  const canSetBet = detail.trading.canSetBet
  const setBetDisabled = query.isFetching

  return (
    <div
      className={cn(
        'flex w-full min-w-0 flex-col gap-4 overflow-x-hidden pb-2',
        leaving ? 'detail-page-leave' : 'detail-page-enter',
      )}
    >
      <DetailHeader
        title={detail.title}
        titleRef={titleRef}
        onBack={goToList}
      />
      <DetailTabs
        value={tab}
        onValueChange={setTab}
        info={
          <InfoTab
            detail={detail}
            onSetBet={canSetBet ? openSetBet : undefined}
            setBetDisabled={setBetDisabled}
          />
        }
        bets={
          <BetsTab
            auctionUuid={auctionUuid}
            hideBetsHistory={!detail.visibility.betsHistory}
            hidePlaces={!detail.visibility.places}
            canSetBet={canSetBet}
            onSetBet={canSetBet ? openSetBet : undefined}
            setBetDisabled={setBetDisabled}
            highlightPrice={highlightPrice}
          />
        }
      />

      {canSetBet ? (
        <SetBetSheet
          key={sheetKey}
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          auctionUuid={auctionUuid}
          prices={detail.trading.prices}
          canSetBet={canSetBet && !setBetDisabled}
          onPlaced={handlePlaced}
        />
      ) : null}
    </div>
  )
}
