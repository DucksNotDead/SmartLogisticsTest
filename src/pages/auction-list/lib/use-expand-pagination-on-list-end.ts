import { useEffect, useRef, useState } from 'react'

/**
 * Mobile: expand pagination when the list end enters the scrollport;
 * collapse to summary on scroll when the sentinel is out of view
 * (manual expand mid-list collapses again while scrolling).
 */
export function useExpandPaginationOnListEnd(enabled: boolean) {
  const listEndSentinelRef = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!enabled) return

    const sentinel = listEndSentinelRef.current
    if (!sentinel) return

    const scrollRoot = sentinel.closest('[data-app-scroll]')
    const root = scrollRoot instanceof Element ? scrollRoot : null

    const syncFromIntersection = (isIntersecting: boolean) => {
      setExpanded(isIntersecting)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        syncFromIntersection(entry.isIntersecting)
      },
      {
        root,
        threshold: 0,
      },
    )

    observer.observe(sentinel)

    const onScroll = () => {
      const rootRect = root
        ? root.getBoundingClientRect()
        : new DOMRect(0, 0, window.innerWidth, window.innerHeight)
      const sentinelRect = sentinel.getBoundingClientRect()
      const inView =
        sentinelRect.top < rootRect.bottom &&
        sentinelRect.bottom > rootRect.top
      if (!inView) {
        setExpanded(false)
      }
    }

    const scrollTarget: EventTarget = root ?? window
    scrollTarget.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      scrollTarget.removeEventListener('scroll', onScroll)
    }
  }, [enabled])

  return {
    listEndSentinelRef,
    expanded: enabled ? expanded : false,
    setExpanded,
  }
}
