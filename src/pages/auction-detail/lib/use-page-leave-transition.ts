import { useCallback, useState } from 'react'
import {
  useCanGoBack,
  useNavigate,
  useRouter,
} from '@tanstack/react-router'

const LEAVE_MS = 220

export function usePageLeaveTransition() {
  const navigate = useNavigate()
  const router = useRouter()
  const canGoBack = useCanGoBack()
  const [leaving, setLeaving] = useState(false)

  const goToList = useCallback(() => {
    if (leaving) return
    setLeaving(true)
    window.setTimeout(() => {
      if (canGoBack) {
        router.history.back()
        return
      }
      void navigate({
        to: '/auctions',
        search: { page: 1, per_page: 20 },
      })
    }, LEAVE_MS)
  }, [canGoBack, leaving, navigate, router.history])

  return { leaving, goToList }
}
