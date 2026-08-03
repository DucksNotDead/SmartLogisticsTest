import type { AuctionDetailViewModel } from '@/entities/auction'

import { dash, formatDateTime } from '../lib/format'
import {
  AUC_TYPE_LABEL,
  BID_TYPE_LABEL,
  labelOf,
} from '../lib/labels'

type TradingParamsProps = {
  detail: AuctionDetailViewModel
}

export function TradingParams({ detail }: TradingParamsProps) {
  const { trading, main, assembly } = detail
  const { settings } = trading

  return (
    <section className="min-w-0" aria-label="Параметры торгов">
      <h2 className="text-sm font-semibold">Параметры торгов</h2>
      <dl className="mt-2 grid min-w-0 grid-cols-2 gap-x-3 gap-y-2 text-xs">
        <div>
          <dt className="text-muted-foreground">Тип</dt>
          <dd className="mt-0.5 font-medium">
            {labelOf(AUC_TYPE_LABEL, main.aucType)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Ед. ставки</dt>
          <dd className="mt-0.5 font-medium">
            {labelOf(BID_TYPE_LABEL, trading.bidMeasurementType)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Старт</dt>
          <dd className="mt-0.5 font-medium">
            {formatDateTime(trading.startTime)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Стоп</dt>
          <dd className="mt-0.5 font-medium">
            {formatDateTime(trading.stopTime)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Дата груза</dt>
          <dd className="mt-0.5 font-medium">{dash(main.cargoDate)}</dd>
        </div>
        {(assembly.num || assembly.date) && (
          <div>
            <dt className="text-muted-foreground">Сборка</dt>
            <dd className="mt-0.5 font-medium">
              {[assembly.num, assembly.date].filter(Boolean).join(' · ') || '—'}
            </dd>
          </div>
        )}
        {settings.prolongAfterBet != null ? (
          <div>
            <dt className="text-muted-foreground">Продление</dt>
            <dd className="mt-0.5 font-medium">
              {settings.prolongAfterBet} мин
            </dd>
          </div>
        ) : null}
        {settings.winnerConfirm != null ? (
          <div>
            <dt className="text-muted-foreground">Подтверждение</dt>
            <dd className="mt-0.5 font-medium">
              {settings.winnerConfirm} мин
            </dd>
          </div>
        ) : null}
        {settings.transmissionTimeIn != null ? (
          <div>
            <dt className="text-muted-foreground">Передача</dt>
            <dd className="mt-0.5 font-medium">
              {settings.transmissionTimeIn} ч
            </dd>
          </div>
        ) : null}
      </dl>
    </section>
  )
}
