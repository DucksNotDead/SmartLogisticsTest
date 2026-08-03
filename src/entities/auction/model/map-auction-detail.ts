import type {
  Assembly,
  AuctionShowCargo,
  AuctionShowMain,
  AuctionShowOrganizer,
  AuctionShowPayment,
  AuctionShowResponse,
  AuctionShowTradingSettings,
  AuctionStatus,
  AuctionType,
  BidMeasurementType,
  Contact,
  RoutePoint,
  TradingStatus,
} from '../api/auctions'

export type NullablePrice = number | null

export type AuctionDetailPrices = {
  start: NullablePrice
  startNoVat: NullablePrice
  current: NullablePrice
  currentNoVat: NullablePrice
  available: NullablePrice
  availableNoVat: NullablePrice
  min: NullablePrice
  minNoVat: NullablePrice
  max: NullablePrice
  maxNoVat: NullablePrice
  step: NullablePrice
  stepNoVat: NullablePrice
  pricePerKm: NullablePrice
}

export type AuctionDetailVisibility = {
  contacts: boolean
  pointAddresses: boolean
  cargoPrice: boolean
  places: boolean
  betsHistory: boolean
}

export type AuctionDetailYourBet = {
  bet: boolean
  lastBet: NullablePrice
  lastBetWithVat: NullablePrice
  win: boolean
}

export type AuctionDetailRoutePoint = {
  rowNum: number | null
  opType: RoutePoint['op_type']
  startDate: string | null
  endDate: string | null
  comment: string | null
  contractor: string | null
  contractorInn: string | null
  cityName: string | null
  cityFullName: string | null
  /** null when addresses are hidden */
  address: string | null
  cargo: RoutePoint['cargo']
  /** null when contacts/addresses are hidden */
  contact: RoutePoint['contact'] | null
}

export type AuctionDetailViewModel = {
  uuid: string
  title: string
  main: {
    id: number | null
    cargoNum: string | null
    cargoDate: string | null
    orderUid: string | null
    aucType: AuctionType | null
    createdAt: string | null
  }
  organizer: {
    organizationName: string | null
    organizationInn: string | null
    organizationKpp: string | null
    subscriberCode: string | null
  }
  contacts: Contact[]
  cargo: {
    price: string | null
    currency: number | null
    distance: number | null
    truckCount: number | null
    bodyType: string | null
    isInternational: boolean
    containered: boolean
    containerType: string | null
    containerSize: string | null
    car: AuctionShowCargo['car']
    loadingTypes: AuctionShowCargo['loading_types']
    docs: AuctionShowCargo['docs']
    tempFrom: number | null
    tempTo: number | null
    adr: number | null
    belts: number | null
  }
  routes: AuctionDetailRoutePoint[]
  payment: {
    form: string | null
    condition: string | null
    conditionPredefined: string | null
    delay: number | null
    delayType: AuctionShowPayment['delay_type']
    currencyCode: string | null
    prepay: string | null
  }
  assembly: {
    num: string | null
    date: string | null
  }
  trading: {
    status: AuctionStatus | null
    statusMobile: TradingStatus | null
    startTime: string | null
    stopTime: string | null
    bidMeasurementType: BidMeasurementType | null
    canSetBet: boolean
    hidePlaces: boolean
    prices: AuctionDetailPrices
    your: AuctionDetailYourBet
    settings: {
      prolongAfterBet: number | null
      winnerConfirm: number | null
      winnerCounterMode: number | null
      transmissionTimeIn: number | null
      coefficient: number | null
    }
  }
  visibility: AuctionDetailVisibility
}

function nullableNumber(value: number | null | undefined): NullablePrice {
  return value ?? null
}

function nullableString(value: string | null | undefined): string | null {
  return value ?? null
}

function mapPrices(
  price: AuctionShowResponse['trading']['price'] | undefined,
): AuctionDetailPrices {
  return {
    start: nullableNumber(price?.start),
    startNoVat: nullableNumber(price?.start_no_vat),
    current: nullableNumber(price?.current),
    currentNoVat: nullableNumber(price?.current_no_vat),
    available: nullableNumber(price?.available),
    availableNoVat: nullableNumber(price?.available_no_vat),
    min: nullableNumber(price?.min),
    minNoVat: nullableNumber(price?.min_no_vat),
    max: nullableNumber(price?.max),
    maxNoVat: nullableNumber(price?.max_no_vat),
    step: nullableNumber(price?.step),
    stepNoVat: nullableNumber(price?.step_no_vat),
    pricePerKm: nullableNumber(price?.price_per_km),
  }
}

function mapSettings(
  settings: AuctionShowTradingSettings | undefined,
): AuctionDetailViewModel['trading']['settings'] {
  return {
    prolongAfterBet: nullableNumber(settings?.prolong_after_bet),
    winnerConfirm: nullableNumber(settings?.winner_confirm),
    winnerCounterMode: nullableNumber(settings?.winner_counter_mode),
    transmissionTimeIn: nullableNumber(settings?.transmission_time_in),
    coefficient: nullableNumber(settings?.coefficient),
  }
}

function mapRoutePoint(
  point: RoutePoint,
  hideAddressesAndContacts: boolean,
): AuctionDetailRoutePoint {
  return {
    rowNum: point.row_num ?? null,
    opType: point.op_type,
    startDate: nullableString(point.start_date),
    endDate: nullableString(point.end_date),
    comment: nullableString(point.comment),
    contractor: nullableString(point.contractor),
    contractorInn: nullableString(point.contractor_inn),
    cityName: nullableString(point.location?.city_name),
    cityFullName: nullableString(point.location?.city_full_name),
    address: hideAddressesAndContacts
      ? null
      : nullableString(point.location?.loading_address),
    cargo: point.cargo,
    contact: hideAddressesAndContacts ? null : (point.contact ?? null),
  }
}

function resolveTitle(main: AuctionShowMain): string {
  if (main.cargo_num) return main.cargo_num
  if (main.order_uid) return main.order_uid
  if (main.id != null) return `Аукцион #${main.id}`
  return 'Аукцион'
}

/**
 * Maps OpenAPI `AuctionShowResponse` → detail ViewModel.
 * Normalizes visibility flags and nullable trading prices.
 */
export function mapAuctionDetail(
  response: AuctionShowResponse,
): AuctionDetailViewModel {
  const trading = response.trading
  const hidePointsAddressAndContacts = Boolean(
    trading.hide_points_address_and_contacts,
  )
  const noViewCargoPrice = Boolean(trading.no_view_cargo_price)
  const hidePlaces = Boolean(trading.hide_places)
  const hideBetsHistory = Boolean(
    response.hide_bets_history || trading.hide_bets_history,
  )

  const visibility: AuctionDetailVisibility = {
    contacts: !hidePointsAddressAndContacts,
    pointAddresses: !hidePointsAddressAndContacts,
    cargoPrice: !noViewCargoPrice,
    places: !hidePlaces,
    betsHistory: !hideBetsHistory,
  }

  const cargo: AuctionShowCargo = response.cargo
  const organizer: AuctionShowOrganizer = response.organizer
  const payment: AuctionShowPayment = response.payment
  const assembly: Assembly = response.assembly

  return {
    uuid: response.main.order_uid ?? '',
    title: resolveTitle(response.main),
    main: {
      id: response.main.id ?? null,
      cargoNum: nullableString(response.main.cargo_num),
      cargoDate: nullableString(response.main.cargo_date),
      orderUid: nullableString(response.main.order_uid),
      aucType: response.main.auc_type ?? null,
      createdAt: nullableString(response.main.created_at),
    },
    organizer: {
      organizationName: nullableString(organizer.organization_name),
      organizationInn: nullableString(organizer.organization_inn),
      organizationKpp: nullableString(organizer.organization_kpp),
      subscriberCode: nullableString(organizer.subscriber_code),
    },
    contacts: visibility.contacts ? [...response.contacts] : [],
    cargo: {
      price: visibility.cargoPrice ? nullableString(cargo.price) : null,
      currency: nullableNumber(cargo.currency),
      distance: nullableNumber(cargo.distance),
      truckCount: cargo.truck_count ?? null,
      bodyType: nullableString(cargo.body_type),
      isInternational: Boolean(cargo.is_international),
      containered: Boolean(cargo.containered),
      containerType: nullableString(cargo.container_type),
      containerSize: nullableString(cargo.container_size),
      car: cargo.car ?? null,
      loadingTypes: cargo.loading_types,
      docs: cargo.docs,
      tempFrom: nullableNumber(cargo.temp_from),
      tempTo: nullableNumber(cargo.temp_to),
      adr: nullableNumber(cargo.adr),
      belts: nullableNumber(cargo.belts),
    },
    routes: response.routes.map((point) =>
      mapRoutePoint(point, hidePointsAddressAndContacts),
    ),
    payment: {
      form: nullableString(payment.form),
      condition: nullableString(payment.condition),
      conditionPredefined: nullableString(payment.condition_predefined),
      delay: nullableNumber(payment.delay),
      delayType: payment.delay_type ?? null,
      currencyCode: nullableString(payment.currency_code),
      prepay: nullableString(payment.prepay),
    },
    assembly: {
      num: nullableString(assembly.num),
      date: nullableString(assembly.date),
    },
    trading: {
      status: trading.status ?? null,
      statusMobile: trading.status_mobile ?? null,
      startTime: nullableString(trading.start_time),
      stopTime: nullableString(trading.stop_time),
      bidMeasurementType: trading.bid_measurement_type ?? null,
      canSetBet: Boolean(trading.can_set_bet),
      hidePlaces,
      prices: mapPrices(trading.price),
      your: {
        bet: Boolean(trading.your?.bet),
        lastBet: nullableNumber(trading.your?.last_bet),
        lastBetWithVat: nullableNumber(trading.your?.last_bet_with_vat),
        win: Boolean(trading.your?.win),
      },
      settings: mapSettings(trading.settings),
    },
    visibility,
  }
}
