import type { XpState } from '@/lib/gamification'

interface XpBarProps {
  xp: XpState
}

export default function XpBar({ xp }: XpBarProps) {
  const fillPercent = Math.round(xp.progress * 100)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Level {xp.level}
        </span>
        <span className="text-xs text-muted-foreground">
          {xp.currentXp} / {xp.nextLevelXp} XP
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-pastel-yellow to-pastel-green transition-all duration-500"
          style={{ width: `${fillPercent}%` }}
        />
      </div>
    </div>
  )
}
