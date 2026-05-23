import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMedical, useAddMedical, useDeleteMedical } from '@/hooks/useMedical'
import { PlusIcon, Trash2Icon } from 'lucide-react'

interface MedicalPanelProps {
  catId: number
}

export default function MedicalPanel({ catId }: MedicalPanelProps) {
  const [showForm, setShowForm] = useState(false)
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')
  const { data: entries, isLoading, error } = useMedical(catId)
  const addEntry = useAddMedical(catId)
  const deleteEntry = useDeleteMedical(catId)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!date || !notes.trim()) return
    addEntry.mutate(
      { date, notes: notes.trim() },
      { onSuccess: () => { setShowForm(false); setDate(''); setNotes('') } },
    )
  }

  function handleCancel() {
    setShowForm(false)
    setDate('')
    setNotes('')
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medical History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medical History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">Failed to load medical history.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical History</CardTitle>
        <CardAction>
          <Button size="sm" onClick={() => setShowForm((prev) => !prev)}>
            <PlusIcon /> Add entry
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3">
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="space-y-3 rounded-lg border bg-muted/30 p-3"
          >
            <div className="space-y-1">
              <Label htmlFor="medical-date">Date</Label>
              <Input
                id="medical-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="medical-notes">Notes</Label>
              <Input
                id="medical-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Vaccination booster, checkup"
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={addEntry.isPending}>
                {addEntry.isPending ? 'Saving...' : 'Save'}
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {!entries || entries.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <p className="text-sm text-muted-foreground">No records yet</p>
            <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
              <PlusIcon /> Add entry
            </Button>
          </div>
        ) : (
          <ul className="divide-y">
            {entries.map((e) => (
              <li
                key={e.id}
                className="flex items-start justify-between gap-2 py-2 first:pt-0 last:pb-0"
              >
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs text-muted-foreground">
                    {new Date(e.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm">{e.notes}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="mt-0.5 shrink-0"
                  onClick={() => deleteEntry.mutate(e.id)}
                  disabled={deleteEntry.isPending}
                >
                  <Trash2Icon className="text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
