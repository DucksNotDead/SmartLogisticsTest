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
  TradingStatus,
} from '@/shared/api/generated/schemas'

export type {
  AuctionListItem,
  AuctionListItemTrading,
  AuctionListMeta,
  AuctionListRequest,
  AuctionListResponseBase,
  AuctionShowResponse,
  AuctionShowTrading,
  AuctionStatus,
} from '@/shared/api/generated/schemas'
