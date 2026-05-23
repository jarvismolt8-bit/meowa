import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { type Cat } from '@/lib/api'

interface CatHeroProps {
  cat: Cat
}

export default function CatHero({ cat }: CatHeroProps) {
  const navigate = useNavigate()

  const checkupLabel = cat.next_checkup_due
    ? new Date(cat.next_checkup_due) > new Date()
      ? 'Checkup upcoming'
      : 'Checkup overdue'
    : 'No checkup scheduled'

  return (
    <Card className="overflow-hidden surface-card">
      <div className="surface-tint-violet flex items-center justify-center pb-0 pt-8">
        {cat.photo_path ? (
          <div className="size-24 rounded-full bg-gradient-cozy p-1">
            <img
              src={cat.photo_path}
              alt={cat.name}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        ) : (
          <div className="size-24 rounded-full bg-gradient-cozy flex items-center justify-center text-6xl">
            😺
          </div>
        )}
      </div>
      <CardContent className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{cat.name}</h2>
          <Badge variant="secondary">{checkupLabel}</Badge>
        </div>
        {cat.age != null && (
          <p className="text-sm text-muted-foreground">{cat.age} years old</p>
        )}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate(`/cats/${cat.id}`)}
        >
          View profile
        </Button>
      </CardContent>
    </Card>
  )
}
