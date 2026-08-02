import { useEffect, useRef } from 'react'

import { useChromeTitleStore } from '@/shared/model'

const DEFAULT_TITLE = 'Аукционы'

export function useCompactHeaderTitle(title = DEFAULT_TITLE) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const setTitle = useChromeTitleStore((state) => state.setTitle)
  const setCompactVisible = useChromeTitleStore(
    (state) => state.setCompactVisible,
  )
  const reset = useChromeTitleStore((state) => state.reset)

  useEffect(() => {
    setTitle(title)
    return () => {
      reset()
    }
  }, [reset, setTitle, title])

  useEffect(() => {
    const heading = headingRef.current
    if (!heading) return

    const scrollRoot = heading.closest('[data-app-scroll]')
    const observer = new IntersectionObserver(
      ([entry]) => {
        setCompactVisible(!(entry?.isIntersecting ?? true))
      },
      {
        root: scrollRoot instanceof Element ? scrollRoot : null,
        threshold: 0,
        rootMargin: '0px 0px 0px 0px',
      },
    )

    observer.observe(heading)
    return () => {
      observer.disconnect()
      setCompactVisible(false)
    }
  }, [setCompactVisible])

  return headingRef
}
