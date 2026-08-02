import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'

function App() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6">
      <Input placeholder="Smoke input" className="max-w-xs" />
      <Button type="button">Smoke button</Button>
    </main>
  )
}

export default App
