import type { AuctionDetailViewModel } from '@/entities/auction'

import { formatDateTime } from '../lib/format'
import { labelOf, OP_TYPE_LABEL } from '../lib/labels'

type RoutePointsProps = {
  routes: AuctionDetailViewModel['routes']
  showAddresses: boolean
}

export function RoutePoints({ routes, showAddresses }: RoutePointsProps) {
  if (routes.length === 0) {
    return (
      <section className="min-w-0" aria-label="Маршрут">
        <h2 className="text-base font-semibold">Маршрут</h2>
        <p className="mt-2 text-sm text-muted-foreground">Точки не указаны</p>
      </section>
    )
  }

  return (
    <section
      className="min-w-0"
      aria-label="Маршрут"
      data-hide_points_address_and_contacts={!showAddresses}
    >
      <h2 className="text-base font-semibold">Маршрут</h2>
      <ol className="mt-3 flex min-w-0 flex-col gap-3">
        {routes.map((point, index) => {
          const key = `${point.rowNum ?? index}-${point.opType ?? 'point'}`
          return (
            <li
              key={key}
              className="min-w-0 border-l-2 border-primary pl-3"
            >
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {labelOf(OP_TYPE_LABEL, point.opType)}
                {point.rowNum != null ? ` · ${point.rowNum}` : null}
              </p>
              <p className="mt-0.5 text-base font-medium">
                {point.cityFullName ?? point.cityName ?? '—'}
              </p>
              {showAddresses && point.address ? (
                <p className="mt-0.5 break-words text-sm text-muted-foreground">
                  {point.address}
                </p>
              ) : null}
              <p className="mt-1 text-xs text-muted-foreground">
                {formatDateTime(point.startDate)}
                {point.endDate ? ` — ${formatDateTime(point.endDate)}` : null}
              </p>
              {point.contractor ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {point.contractor}
                </p>
              ) : null}
              {showAddresses && point.contact?.name ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {point.contact.name}
                  {point.contact.phone ? ` · ${point.contact.phone}` : null}
                </p>
              ) : null}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
