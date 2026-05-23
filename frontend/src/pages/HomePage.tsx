import { useState } from 'react'
import { useCats } from '@/hooks/useCats'
import CatHero from '@/components/CatHero'
import CatSwitcher from '@/components/CatSwitcher'

export default function HomePage() {
  const { data: cats, isLoading, error } = useCats()
  const [selectedId, setSelectedId] = useState<number | null>(null)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="aspect-[3/2] w-full animate-pulse rounded-xl bg-muted" />
        <div className="flex gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex shrink-0 flex-col items-center gap-1">
              <div className="size-14 animate-pulse rounded-full bg-muted" />
              <div className="h-3 w-12 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-medium text-destructive">Failed to load cats</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Please check that the backend server is running and try again.
        </p>
      </div>
    )
  }

  if (!cats || cats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-6xl">😺</span>
        <p className="mt-4 text-lg font-medium">No cats yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add your first cat to get started!
        </p>
      </div>
    )
  }

  const activeId = selectedId ?? cats[0].id
  const activeCat = cats.find((c) => c.id === activeId) ?? cats[0]

  return (
    <div className="space-y-6">
      <CatHero cat={activeCat} />
      <CatSwitcher
        cats={cats}
        selectedCatId={activeCat.id}
        onSelect={setSelectedId}
      />
    </div>
  )
}
