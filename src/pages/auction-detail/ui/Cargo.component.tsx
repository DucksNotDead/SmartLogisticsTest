import type { AuctionDetailViewModel } from '@/entities/auction'

import { dash } from '../lib/format'

type CargoProps = {
  cargo: AuctionDetailViewModel['cargo']
  showCargoPrice: boolean
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 break-words font-medium text-foreground">{value}</dd>
    </div>
  )
}

export function Cargo({ cargo, showCargoPrice }: CargoProps) {
  const car = cargo.car

  return (
    <section
      className="min-w-0"
      aria-label="Груз и ТС"
      data-no_view_cargo_price={!showCargoPrice}
    >
      <h2 className="text-sm font-semibold">Груз и ТС</h2>
      <dl className="mt-2 grid min-w-0 grid-cols-2 gap-x-3 gap-y-2 text-xs">
        {showCargoPrice ? (
          <Meta label="Цена груза" value={dash(cargo.price)} />
        ) : null}
        <Meta label="Кузов" value={dash(cargo.bodyType)} />
        <Meta
          label="Расстояние"
          value={cargo.distance != null ? `${cargo.distance} км` : '—'}
        />
        <Meta label="Машин" value={dash(cargo.truckCount)} />
        {car?.weight != null ? (
          <Meta label="Вес ТС" value={`${car.weight}`} />
        ) : null}
        {car?.volume != null ? (
          <Meta label="Объём ТС" value={`${car.volume}`} />
        ) : null}
        {cargo.tempFrom != null || cargo.tempTo != null ? (
          <Meta
            label="Температура"
            value={`${dash(cargo.tempFrom)}…${dash(cargo.tempTo)}`}
          />
        ) : null}
        {cargo.adr != null ? <Meta label="ADR" value={String(cargo.adr)} /> : null}
        {cargo.belts != null ? (
          <Meta label="Ремни" value={String(cargo.belts)} />
        ) : null}
        {cargo.containered ? (
          <Meta
            label="Контейнер"
            value={[cargo.containerType, cargo.containerSize]
              .filter(Boolean)
              .join(' · ') || 'да'}
          />
        ) : null}
      </dl>
    </section>
  )
}
