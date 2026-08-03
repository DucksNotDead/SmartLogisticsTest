import type { AuctionDetailViewModel } from '@/entities/auction'

import { dash } from '../lib/format'

type PaymentProps = {
  payment: AuctionDetailViewModel['payment']
}

export function Payment({ payment }: PaymentProps) {
  return (
    <section className="min-w-0" aria-label="Оплата">
      <h2 className="text-sm font-semibold">Оплата</h2>
      <dl className="mt-2 grid min-w-0 grid-cols-2 gap-x-3 gap-y-2 text-xs">
        <div>
          <dt className="text-muted-foreground">Форма</dt>
          <dd className="mt-0.5 font-medium">{dash(payment.form)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Отсрочка</dt>
          <dd className="mt-0.5 font-medium">
            {payment.delay != null ? `${payment.delay} дн.` : '—'}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Валюта</dt>
          <dd className="mt-0.5 font-medium">{dash(payment.currencyCode)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Предоплата</dt>
          <dd className="mt-0.5 font-medium">{dash(payment.prepay)}</dd>
        </div>
        {(payment.condition || payment.conditionPredefined) && (
          <div className="col-span-2">
            <dt className="text-muted-foreground">Условие</dt>
            <dd className="mt-0.5 break-words font-medium">
              {payment.condition ?? payment.conditionPredefined}
            </dd>
          </div>
        )}
      </dl>
    </section>
  )
}
