import { CircleCheckIcon } from 'lucide-react'

import { cn } from '@/shared/lib'

type SetBetSuccessProps = {
  className?: string
}

export function SetBetSuccess({ className }: SetBetSuccessProps) {
  return (
    <div
      className={cn(
        'absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-popover/95 px-6 text-center',
        'animate-in fade-in-0 zoom-in-95 duration-300',
        className,
      )}
      data-set-bet-success
      role="status"
      aria-live="polite"
    >
      <CircleCheckIcon
        className="size-20 text-emerald-600 sm:size-24"
        aria-hidden
        strokeWidth={1.5}
      />
      <p className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        Ставка принята
      </p>
    </div>
  )
}
