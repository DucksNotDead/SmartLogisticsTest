import { useNavigate } from '@tanstack/react-router'

import { DEFAULT_PAGE, type PerPageOption } from '../model/search'

export function useAuctionListPagingActions(perPage: PerPageOption) {
  const navigate = useNavigate({ from: '/auctions' })

  const goTo = (nextPage: number) => {
    void navigate({
      search: (prev) => ({ ...prev, page: nextPage, per_page: perPage }),
    })
  }

  const changePerPage = (nextPerPage: PerPageOption) => {
    void navigate({
      search: (prev) => ({
        ...prev,
        page: DEFAULT_PAGE,
        per_page: nextPerPage,
      }),
    })
  }

  return { goTo, changePerPage }
}
