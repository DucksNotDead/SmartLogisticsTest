export {
  getListBetsQueryKey,
  getListBetsQueryOptions,
  getSetBetMutationOptions,
  listBets,
  setBet,
  useListBets,
  useSetBet,
} from '@/shared/api/generated/endpoints/auctions/auctions'

export type {
  BetItem,
  BetListResponse,
  ListBetsParams,
  SetBetRequest,
} from '@/shared/api/generated/schemas'
