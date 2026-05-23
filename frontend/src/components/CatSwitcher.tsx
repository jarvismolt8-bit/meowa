import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { type Cat } from '@/lib/api'

interface CatSwitcherProps {
  cats: Cat[]
  selectedCatId: number
  onSelect: (id: number) => void
}

export default function CatSwitcher({ cats, selectedCatId, onSelect }: CatSwitcherProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">Your cats</h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {cats.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={cn(
              'flex shrink-0 flex-col items-center gap-1 rounded-xl p-2 transition-colors',
              cat.id === selectedCatId
                ? 'surface-card ring-2 ring-brand-yellow/60'
                : 'surface-tint-violet hover:opacity-80',
            )}
          >
            <div className="flex size-14 items-center justify-center overflow-hidden rounded-full bg-muted">
              {cat.photo_path ? (
                <img
                  src={cat.photo_path}
                  alt={cat.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="text-2xl">😺</span>
              )}
            </div>
            <span className="max-w-16 truncate text-xs font-medium">{cat.name}</span>
          </button>
        ))}
        <Link
          to="/cats/new"
          className="flex shrink-0 flex-col items-center justify-center gap-1 rounded-xl p-2 transition-colors hover:bg-muted"
        >
          <div className="flex size-14 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/40 text-2xl text-muted-foreground">
            +
          </div>
          <span className="text-xs text-muted-foreground">Add cat</span>
        </Link>
      </div>
    </div>
  )
}
