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

export type {
  AuctionListItem,
  AuctionListItemTrading,
  AuctionListMeta,
  AuctionListRequest,
  AuctionListResponseBase,
  AuctionShowResponse,
  AuctionShowTrading,
  AuctionStatus,
  TradingStatus,
} from '@/shared/api/generated/schemas'
