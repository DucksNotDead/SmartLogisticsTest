import {
  mapAuctionDetail,
  useGetAuction,
} from '@/entities/auction'
import { ApiError } from '@/shared/api'
import { cn } from '@/shared/lib'

import { useDetailChromeTitle } from '../lib/use-detail-chrome-title'
import { usePageLeaveTransition } from '../lib/use-page-leave-transition'
import { AuctionDetailError } from './AuctionDetailError.component'
import { AuctionDetailSkeleton } from './AuctionDetailSkeleton.component'
import { BetsTabPlaceholder } from './BetsTabPlaceholder.component'
import { DetailHeader } from './DetailHeader.component'
import { DetailTabs } from './DetailTabs.component'
import { InfoTab } from './InfoTab.component'

type AuctionDetailPageProps = {
  auctionUuid: string
}

function isNotFoundError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404
}

export function AuctionDetailPage({ auctionUuid }: AuctionDetailPageProps) {
  const query = useGetAuction(auctionUuid)
  const detail = query.data ? mapAuctionDetail(query.data) : null
  const title = detail?.title ?? 'Аукцион'
  const titleRef = useDetailChromeTitle(query.isSuccess ? title : 'Аукцион')
  const { leaving, goToList } = usePageLeaveTransition()

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
        info={<InfoTab detail={detail} />}
        bets={
          <BetsTabPlaceholder
            hideBetsHistory={!detail.visibility.betsHistory}
          />
        }
      />
    </div>
  )
}
