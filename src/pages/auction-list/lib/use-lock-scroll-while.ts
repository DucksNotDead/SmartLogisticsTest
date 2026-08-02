import { useEffect } from 'react'

/** Locks `[data-app-scroll]` overflow while `locked` is true. */
export function useLockScrollWhile(locked: boolean) {
  useEffect(() => {
    if (!locked) return

    const scrollRoot = document.querySelector('[data-app-scroll]')
    if (!(scrollRoot instanceof HTMLElement)) return

    const previousOverflowY = scrollRoot.style.overflowY
    scrollRoot.style.overflowY = 'hidden'
    scrollRoot.scrollTop = 0

    return () => {
      scrollRoot.style.overflowY = previousOverflowY
    }
  }, [locked])
}
