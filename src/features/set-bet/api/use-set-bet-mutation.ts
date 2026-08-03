import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  getGetAuctionQueryKey,
  getListAuctionsQueryKey,
} from '@/entities/auction'
import {
  getListBetsQueryKey,
  useSetBet,
  type SetBetRequest,
} from '@/entities/bet'
import { ApiError, isValidationProblem } from '@/shared/api'

export type SetBetMutationVariables = {
  auctionUuid: string
  data: SetBetRequest
}

export type SetBetFieldError = {
  field: string
  message: string
}

/** Map 422 `ValidationProblem.errors[]` for form `setError`. */
export function getSetBetValidationErrors(
  error: unknown,
): SetBetFieldError[] {
  if (!(error instanceof ApiError) || error.status !== 422) return []
  if (!isValidationProblem(error.body)) return []
  return error.body.errors.map((item) => ({
    field: item.field,
    message: item.message,
  }))
}

type UseSetBetMutationOptions = {
  onSuccess?: (variables: SetBetMutationVariables) => void
  onError?: (
    error: unknown,
    variables: SetBetMutationVariables,
    fieldErrors: SetBetFieldError[],
  ) => void
}

/**
 * setBet + invalidate list/detail/bets + success/error toast.
 * 422 field errors remain on the thrown `ApiError` (see
 * `getSetBetValidationErrors`).
 */
export function useSetBetMutation(options?: UseSetBetMutationOptions) {
  const queryClient = useQueryClient()

  return useSetBet({
    mutation: {
      onSuccess: async (_data, variables) => {
        const { auctionUuid } = variables
        const listKey = getListAuctionsQueryKey()

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [listKey[0], listKey[1]],
          }),
          queryClient.invalidateQueries({
            queryKey: getGetAuctionQueryKey(auctionUuid),
          }),
          queryClient.invalidateQueries({
            queryKey: getListBetsQueryKey(auctionUuid),
          }),
        ])

        toast.success('Ставка принята')
        options?.onSuccess?.(variables)
      },
      onError: (error, variables) => {
        const fieldErrors = getSetBetValidationErrors(error)
        const message =
          error instanceof ApiError
            ? error.message
            : 'Не удалось установить ставку'
        toast.error(message)
        options?.onError?.(error, variables, fieldErrors)
      },
    },
  })
}
