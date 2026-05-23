import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { type Cat } from '@/lib/api'
import { cn } from '@/lib/utils'

interface ReminderCardProps {
  cat: Cat
  status: 'overdue' | 'due_soon' | 'upcoming'
}

const statusConfig = {
  overdue: {
    label: 'Overdue',
    borderClass: 'ring-pastel-red/40 ring-2',
    badgeClass: 'bg-destructive/10 text-destructive',
  },
  due_soon: {
    label: 'Due Soon',
    borderClass: 'ring-pastel-yellow/50 ring-2',
    badgeClass: 'bg-pastel-yellow/50 text-amber-800',
  },
  upcoming: {
    label: 'Upcoming',
    borderClass: 'ring-pastel-green/50 ring-2',
    badgeClass: 'bg-secondary/80 text-green-800',
  },
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function ReminderCard({ cat, status }: ReminderCardProps) {
  const navigate = useNavigate()
  const config = statusConfig[status]

  return (
    <Card
      className={cn(
        'cursor-pointer transition-shadow hover:shadow-md',
        config.borderClass
      )}
      onClick={() => navigate(`/cats/${cat.id}`)}
    >
      <div className="flex gap-4 p-4">
        <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
          {cat.photo_path ? (
            <img
              src={cat.photo_path}
              alt={cat.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-2xl">
              😺
            </div>
          )}
        </div>
        <CardContent className="flex flex-1 flex-col gap-1 p-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{cat.name}</h3>
            <Badge className={config.badgeClass}>{config.label}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Last checkup: {formatDate(cat.last_checkup)}
          </p>
          <p className="text-xs text-muted-foreground">
            Next due: {formatDate(cat.next_checkup_due)}
          </p>
          <div className="mt-1">
            <Button
              variant="outline"
              size="xs"
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/cats/${cat.id}/edit`)
              }}
            >
              Update checkup
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
