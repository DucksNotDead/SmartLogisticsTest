import { useEffect, useRef, useState } from 'react'

/**
 * Mobile: expand pagination when the list end enters the scrollport;
 * collapse when it leaves. Tap expand/collapse still works (observer
 * only updates on intersection change).
 */
export function useExpandPaginationOnListEnd(enabled: boolean) {
  const listEndSentinelRef = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!enabled) return

    const sentinel = listEndSentinelRef.current
    if (!sentinel) return

    const scrollRoot = sentinel.closest('[data-app-scroll]')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        setExpanded(entry.isIntersecting)
      },
      {
        root: scrollRoot instanceof Element ? scrollRoot : null,
        threshold: 0,
      },
    )

    observer.observe(sentinel)
    return () => {
      observer.disconnect()
    }
  }, [enabled])

  return {
    listEndSentinelRef,
    expanded: enabled ? expanded : false,
    setExpanded,
  }
}
