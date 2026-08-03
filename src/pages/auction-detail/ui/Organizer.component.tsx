import type { AuctionDetailViewModel } from '@/entities/auction'

import { dash } from '../lib/format'

type OrganizerProps = {
  organizer: AuctionDetailViewModel['organizer']
}

export function Organizer({ organizer }: OrganizerProps) {
  return (
    <section className="min-w-0" aria-label="Организатор">
      <h2 className="text-sm font-semibold">Организатор</h2>
      <dl className="mt-2 grid min-w-0 gap-y-2 text-xs">
        <div>
          <dt className="text-muted-foreground">Организация</dt>
          <dd className="mt-0.5 break-words font-medium">
            {dash(organizer.organizationName)}
          </dd>
        </div>
        <div className="grid grid-cols-2 gap-x-3">
          <div>
            <dt className="text-muted-foreground">ИНН</dt>
            <dd className="mt-0.5 font-medium tabular-nums">
              {dash(organizer.organizationInn)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">КПП</dt>
            <dd className="mt-0.5 font-medium tabular-nums">
              {dash(organizer.organizationKpp)}
            </dd>
          </div>
        </div>
        <div>
          <dt className="text-muted-foreground">Код</dt>
          <dd className="mt-0.5 font-medium">{dash(organizer.subscriberCode)}</dd>
        </div>
      </dl>
    </section>
  )
}
