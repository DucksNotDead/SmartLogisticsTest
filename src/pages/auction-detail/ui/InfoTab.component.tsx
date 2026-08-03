import type { AuctionDetailViewModel } from '@/entities/auction'

import { Cargo } from './Cargo.component'
import { Contacts } from './Contacts.component'
import { Organizer } from './Organizer.component'
import { Payment } from './Payment.component'
import { PriceHero } from './PriceHero.component'
import { RoutePoints } from './RoutePoints.component'
import { TradingParams } from './TradingParams.component'

type InfoTabProps = {
  detail: AuctionDetailViewModel
}

export function InfoTab({ detail }: InfoTabProps) {
  const showAddresses = detail.visibility.pointAddresses
  const showCargoPrice = detail.visibility.cargoPrice
  const showContacts = detail.visibility.contacts

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PriceHero detail={detail} />

      <div className="min-w-0 rounded-xl border border-border px-4 py-4 md:px-5">
        <RoutePoints
          routes={detail.routes}
          showAddresses={showAddresses}
        />
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
        <div className="min-w-0 rounded-lg border border-border/80 px-3 py-3">
          <Cargo cargo={detail.cargo} showCargoPrice={showCargoPrice} />
        </div>
        <div className="min-w-0 rounded-lg border border-border/80 px-3 py-3">
          <Payment payment={detail.payment} />
        </div>
        <div className="min-w-0 rounded-lg border border-border/80 px-3 py-3">
          <Organizer organizer={detail.organizer} />
        </div>
        {showContacts ? (
          <div className="min-w-0 rounded-lg border border-border/80 px-3 py-3">
            <Contacts contacts={detail.contacts} />
          </div>
        ) : null}
        <div className="min-w-0 rounded-lg border border-border/80 px-3 py-3 md:col-span-2">
          <TradingParams detail={detail} />
        </div>
      </div>
    </div>
  )
}
