import { createFileRoute, redirect } from '@tanstack/react-router'

import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '@/pages/auction-list'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({
      to: '/auctions',
      search: { page: DEFAULT_PAGE, per_page: DEFAULT_PER_PAGE },
    })
  },
})
