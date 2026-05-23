import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
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
    cardClass: 'bg-red-50',
    badgeClass: 'chip-violet',
  },
  due_soon: {
    label: 'Due Soon',
    cardClass: 'surface-tint-yellow',
    badgeClass: 'chip-yellow',
  },
  upcoming: {
    label: 'Upcoming',
    cardClass: 'surface-tint-green',
    badgeClass: 'chip-green',
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
        'cursor-pointer transition-shadow hover:shadow-md surface-card',
        config.cardClass
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
            <span className={config.badgeClass}>{config.label}</span>
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
