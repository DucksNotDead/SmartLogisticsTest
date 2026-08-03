export {
  getAuction,
  getGetAuctionQueryKey,
  getGetAuctionQueryOptions,
  getListAuctionsQueryKey,
  getListAuctionsQueryOptions,
  listAuctions,
  useGetAuction,
  useListAuctions,
} from '@/shared/api/generated/endpoints/auctions/auctions'

export {
  AuctionType,
  BidMeasurementType,
  OperationType,
  TradingStatus,
} from '@/shared/api/generated/schemas'

export type {
  Assembly,
  AuctionListItem,
  AuctionListItemTrading,
  AuctionListMeta,
  AuctionListRequest,
  AuctionListResponseBase,
  AuctionShowCargo,
  AuctionShowMain,
  AuctionShowOrganizer,
  AuctionShowPayment,
  AuctionShowResponse,
  AuctionShowTrading,
  AuctionShowTradingSettings,
  AuctionStatus,
  Contact,
  RoutePoint,
} from '@/shared/api/generated/schemas'
