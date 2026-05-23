import { useReminders } from '@/hooks/useReminders'
import ReminderCard from '@/components/ReminderCard'
import { AlertCircle } from 'lucide-react'

const sectionConfig = {
  overdue: { title: 'Overdue', icon: '🔴' },
  due_soon: { title: 'Due Soon', icon: '🟡' },
  upcoming: { title: 'Upcoming', icon: '🟢' },
} as const

export default function RemindersPage() {
  const { data, isLoading, error } = useReminders()

  if (isLoading) {
    return (
      <div className="space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-6 w-32 animate-pulse rounded bg-muted" />
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, j) => (
                <div
                  key={j}
                  className="h-24 animate-pulse rounded-xl bg-muted"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="size-12 text-destructive" />
        <p className="mt-4 text-lg font-medium text-destructive">
          Failed to load reminders
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Please check that the backend server is running and try again.
        </p>
      </div>
    )
  }

  if (
    !data ||
    (data.overdue.length === 0 &&
      data.due_soon.length === 0 &&
      data.upcoming.length === 0)
  ) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="relative mb-4" aria-hidden>
          <div className="confetti-piece left-[40%] top-0 size-2 rounded-full bg-pastel-red" />
          <div className="confetti-piece left-[55%] top-2 size-2.5 rounded-full bg-pastel-yellow" />
          <div className="confetti-piece left-[30%] top-4 size-1.5 rounded-full bg-pastel-green" />
          <div className="confetti-piece left-[60%] top-1 size-2 rounded-full bg-pastel-blue" />
          <div className="confetti-piece left-[45%] top-3 size-1.5 rounded-full bg-pastel-mint" />
          <div className="confetti-piece left-[50%] top-5 size-2 rounded-full bg-pastel-yellow" />
          <span className="text-6xl">🎉</span>
        </div>
        <p className="mt-4 text-lg font-medium">
          No reminders &mdash; all checkups are up to date!
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Your cats are all healthy and happy. Great job, pet parent!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Reminders</h1>
      {(['overdue', 'due_soon', 'upcoming'] as const).map((key) => {
        const section = sectionConfig[key]
        const cats = data[key]

        if (cats.length === 0) return null

        return (
          <section key={key} className="space-y-3">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <span>{section.icon}</span>
              {section.title}
              <span className="text-sm font-normal text-muted-foreground">
                ({cats.length})
              </span>
            </h2>
            <div className="space-y-3">
              {cats.map((cat) => (
                <ReminderCard key={cat.id} cat={cat} status={key} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
