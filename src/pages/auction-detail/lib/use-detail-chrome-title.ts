import { useEffect, useRef } from 'react'

import { useChromeTitleStore } from '@/shared/model'

export function useDetailChromeTitle(title: string) {
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
    const root = scrollRoot instanceof Element ? scrollRoot : null

    const syncVisible = (isIntersecting: boolean) => {
      setCompactVisible(!isIntersecting)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        syncVisible(entry?.isIntersecting ?? true)
      },
      {
        root,
        threshold: 0,
        rootMargin: '0px 0px 0px 0px',
      },
    )

    observer.observe(heading)

    const rootRect = root?.getBoundingClientRect()
    const headingRect = heading.getBoundingClientRect()
    if (rootRect) {
      const isIntersecting =
        headingRect.bottom > rootRect.top && headingRect.top < rootRect.bottom
      syncVisible(isIntersecting)
    } else {
      syncVisible(true)
    }

    return () => {
      observer.disconnect()
      setCompactVisible(false)
    }
  }, [setCompactVisible, title])

  return headingRef
}
