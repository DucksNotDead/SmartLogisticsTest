import type { Ref } from 'react'
import { ChevronLeft } from 'lucide-react'

import { Button } from '@/shared/ui/button'

type DetailHeaderProps = {
  title: string
  titleRef?: Ref<HTMLHeadingElement>
  onBack: () => void
}

export function DetailHeader({ title, titleRef, onBack }: DetailHeaderProps) {
  return (
    <header className="flex min-w-0 items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-lg"
        className="shrink-0"
        aria-label="Назад к списку аукционов"
        onClick={onBack}
      >
        <ChevronLeft className="size-7" />
      </Button>
      <h1
        ref={titleRef}
        className="min-w-0 flex-1 break-words text-2xl font-semibold tracking-tight"
      >
        {title}
      </h1>
    </header>
  )
}
