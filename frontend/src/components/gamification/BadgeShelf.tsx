import type { Badge } from '@/lib/gamification'

interface BadgeShelfProps {
  badges: Badge[]
}

export default function BadgeShelf({ badges }: BadgeShelfProps) {
  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-muted-foreground">Badges</span>
      <div className="grid grid-cols-5 gap-2">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`flex flex-col items-center gap-1 rounded-lg p-2 text-center transition-transform hover:scale-110 ${
              badge.earned
                ? 'bg-primary/10'
                : 'bg-muted/50'
            }`}
            title={badge.description}
          >
            <span
              className={`text-xl transition-all duration-300 ${
                badge.earned ? '' : 'grayscale opacity-30'
              }`}
            >
              {badge.icon}
            </span>
            <span
              className={`text-[10px] leading-tight ${
                badge.earned ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {badge.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
