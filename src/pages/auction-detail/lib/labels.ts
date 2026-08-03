export const AUC_TYPE_LABEL: Record<string, string> = {
  Request: 'Заявочный',
  Up: 'На повышение',
  Down: 'На понижение',
  FixPrice: 'Фикс. цена',
  Unknown: 'Неизвестно',
}

export const STATUS_LABEL: Record<string, string> = {
  Planning: 'Планирование',
  Auction: 'Торги',
  DeterminateWinner: 'Определение победителя',
  WaitDeal: 'Ожидание сделки',
  InProgress: 'В работе',
  Finished: 'Завершён',
  Stopped: 'Остановлен',
  Canceled: 'Отменён',
  Unknown: 'Неизвестно',
}

export const MOBILE_STATUS_LABEL: Record<string, string> = {
  NotParticipating: 'Не участвует',
  Leading: 'Лидирует',
  Losing: 'Перебит',
  Winner: 'Победитель',
  Confirmed: 'Подтверждён',
  OnPending: 'Ожидание',
  ChoosingWinner: 'Выбор победителя',
  Accepted: 'Принят',
  Unknown: 'Неизвестно',
}

export const BID_TYPE_LABEL: Record<string, string> = {
  PerRoute: 'За рейс',
  PerKm: 'За км',
  Unknown: 'Неизвестно',
}

export const OP_TYPE_LABEL: Record<string, string> = {
  Loading: 'Погрузка',
  Unloading: 'Выгрузка',
  Unknown: 'Операция',
}

export function labelOf(
  map: Record<string, string>,
  value: string | null | undefined,
): string {
  if (!value) return '—'
  return map[value] ?? value
}
