import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCats } from '@/hooks/useCats'
import CatHero from '@/components/CatHero'
import CatSwitcher from '@/components/CatSwitcher'
import { Button } from '@/components/ui/button'

const categoryPills = [
  { label: 'Kitten', class: 'chip-yellow' },
  { label: 'Adult', class: 'chip-green' },
  { label: 'Senior', class: 'chip-violet' },
]

export default function HomePage() {
  const { data: cats, isLoading, error } = useCats()
  const [selectedId, setSelectedId] = useState<number | null>(null)

  if (isLoading) {
    return (
      <div className="space-y-6 bg-brand-cream">
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
      <div className="flex flex-col items-center justify-center py-20 text-center bg-brand-cream">
        <p className="text-lg font-medium text-destructive">Failed to load cats</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Please check that the backend server is running and try again.
        </p>
      </div>
    )
  }

  if (!cats || cats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-brand-cream">
        <span className="text-6xl">😺</span>
        <p className="mt-4 text-lg font-medium bg-gradient-meowa bg-clip-text text-transparent">
          No cats yet
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add your first cat to get started!
        </p>
        <Button className="mt-6 bg-gradient-sunny text-white" asChild>
          <Link to="/cats/new">Add your first cat</Link>
        </Button>
      </div>
    )
  }

  const activeId = selectedId ?? cats[0].id
  const activeCat = cats.find((c) => c.id === activeId) ?? cats[0]

  return (
    <div className="space-y-6 bg-brand-cream">
      <CatHero cat={activeCat} />

      <div className="surface-tint-yellow rounded-2xl p-4">
        <div className="mb-3 flex items-center gap-2">
          <h3 className="text-sm font-semibold text-brand-ink">Your Cats</h3>
          <div className="ml-auto flex gap-1.5">
            {categoryPills.map((pill) => (
              <span key={pill.label} className={pill.class}>
                {pill.label}
              </span>
            ))}
          </div>
        </div>
        <CatSwitcher
          cats={cats}
          selectedCatId={activeCat.id}
          onSelect={setSelectedId}
        />
      </div>

      <div className="surface-tint-green rounded-2xl p-4">
        <h3 className="mb-2 text-sm font-semibold text-brand-ink">Recent Activity</h3>
        <p className="text-sm text-brand-ink/60">
          Recent checkups, vaccinations, and medical records will appear here.
        </p>
      </div>
    </div>
  )
}
