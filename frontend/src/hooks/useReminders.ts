import { useQuery } from '@tanstack/react-query'
import { remindersApi, type ReminderBuckets } from '@/lib/api'

export function useReminders() {
  return useQuery<ReminderBuckets>({
    queryKey: ['reminders'],
    queryFn: remindersApi.list,
  })
}
