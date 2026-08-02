import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'

function App() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background p-6 text-foreground">
      <p className="text-sm text-muted-foreground">УЛ Лайт — smoke shell</p>
      <Input placeholder="Smoke input" className="max-w-xs" />
      <Button type="button">Smoke button</Button>
    </main>
  )
}

export default App
