import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMedical, useAddMedical, useUpdateMedical, useDeleteMedical } from '@/hooks/useMedical'
import { PlusIcon, Trash2Icon, PencilIcon } from 'lucide-react'

interface MedicalPanelProps {
  catId: number
}

export default function MedicalPanel({ catId }: MedicalPanelProps) {
  const [showForm, setShowForm] = useState(false)
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editDate, setEditDate] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const { data: entries, isLoading, error } = useMedical(catId)
  const addEntry = useAddMedical(catId)
  const updateEntry = useUpdateMedical(catId)
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

  function handleEditStart(entry: { id: number; date: string; notes: string }) {
    setEditingId(entry.id)
    setEditDate(entry.date)
    setEditNotes(entry.notes)
  }

  function handleEditCancel() {
    setEditingId(null)
    setEditDate('')
    setEditNotes('')
  }

  function handleEditSave(e: React.FormEvent, mId: number) {
    e.preventDefault()
    if (!editDate || !editNotes.trim()) return
    updateEntry.mutate(
      { mId, data: { date: editDate, notes: editNotes.trim() } },
      {
        onSuccess: () => {
          setEditingId(null)
          setEditDate('')
          setEditNotes('')
        },
      },
    )
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
          <Button size="sm" onClick={() => setShowForm((prev) => !prev)} aria-label="Add medical entry">
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
            <Button variant="outline" size="sm" onClick={() => setShowForm(true)} aria-label="Add medical entry">
              <PlusIcon /> Add entry
            </Button>
          </div>
        ) : (
          <ul className="divide-y">
            {entries.map((e) => (
              <li
                key={e.id}
                className="py-2 first:pt-0 last:pb-0"
              >
                {editingId === e.id ? (
                  <form
                    onSubmit={(ev) => handleEditSave(ev, e.id)}
                    className="space-y-2 rounded-lg border bg-muted/30 p-3"
                  >
                    <div className="space-y-1">
                      <Label htmlFor={`edit-medical-date-${e.id}`}>Date</Label>
                      <Input
                        id={`edit-medical-date-${e.id}`}
                        type="date"
                        value={editDate}
                        onChange={(ev) => setEditDate(ev.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`edit-medical-notes-${e.id}`}>Notes</Label>
                      <Input
                        id={`edit-medical-notes-${e.id}`}
                        value={editNotes}
                        onChange={(ev) => setEditNotes(ev.target.value)}
                        required
                      />
                    </div>
                    <div className="flex justify-between gap-2">
                      <Button type="button" variant="ghost" size="sm" onClick={handleEditCancel}>
                        Cancel
                      </Button>
                      <Button type="submit" size="sm" disabled={updateEntry.isPending}>
                        {updateEntry.isPending ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-xs text-muted-foreground">
                        {new Date(e.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm">{e.notes}</p>
                    </div>
                    <div className="mt-0.5 flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        className="chip-violet cursor-pointer"
                        onClick={() => handleEditStart(e)}
                        aria-label={`Edit medical entry from ${new Date(e.date).toLocaleDateString()}`}
                      >
                        <PencilIcon className="mr-1 size-3" />
                        Edit
                      </button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => deleteEntry.mutate(e.id)}
                        disabled={deleteEntry.isPending}
                        aria-label={`Delete medical entry from ${new Date(e.date).toLocaleDateString()}`}
                      >
                        <Trash2Icon className="text-destructive" />
                      </Button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
