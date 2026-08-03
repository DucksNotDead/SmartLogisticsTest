import type { ReactNode } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'

type DetailTabsProps = {
  info: ReactNode
  bets: ReactNode
}

export function DetailTabs({ info, bets }: DetailTabsProps) {
  return (
    <Tabs defaultValue="info" className="min-w-0">
      <TabsList variant="line" className="w-full max-w-md">
        <TabsTrigger value="info">Инфо</TabsTrigger>
        <TabsTrigger value="bets">Ставки</TabsTrigger>
      </TabsList>
      <TabsContent value="info" className="mt-4 min-w-0">
        {info}
      </TabsContent>
      <TabsContent value="bets" className="mt-4 min-w-0">
        {bets}
      </TabsContent>
    </Tabs>
  )
}
