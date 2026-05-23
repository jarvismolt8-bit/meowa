import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useVaccinations, useAddVaccination, useDeleteVaccination } from '@/hooks/useVaccinations'
import { PlusIcon, Trash2Icon } from 'lucide-react'
import Confetti, { useConfetti } from '@/components/gamification/Confetti'

interface VaccinationsPanelProps {
  catId: number
}

export default function VaccinationsPanel({ catId }: VaccinationsPanelProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const { data: vaccinations, isLoading, error } = useVaccinations(catId)
  const addVaccination = useAddVaccination(catId)
  const deleteVaccination = useDeleteVaccination(catId)
  const confetti = useConfetti(2000)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !date) return
    addVaccination.mutate(
      { name: name.trim(), date },
      {
        onSuccess: () => {
          confetti.trigger()
          setOpen(false)
          setName('')
          setDate('')
        },
      },
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vaccinations</CardTitle>
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
          <CardTitle>Vaccinations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">Failed to load vaccinations.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Vaccinations</CardTitle>
          <CardAction>
            <Button size="sm" onClick={() => setOpen(true)}>
              <PlusIcon /> Add vaccination
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {!vaccinations || vaccinations.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-6 text-center">
              <p className="text-sm text-muted-foreground">No records yet</p>
              <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
                <PlusIcon /> Add vaccination
              </Button>
            </div>
          ) : (
            <ul className="divide-y">
              {vaccinations.map((v) => (
                <li
                  key={v.id}
                  className="flex items-center justify-between gap-2 py-2 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{v.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(v.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => deleteVaccination.mutate(v.id)}
                    disabled={deleteVaccination.isPending}
                  >
                    <Trash2Icon className="text-destructive" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Vaccination</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vaccine-name">Vaccine name</Label>
              <Input
                id="vaccine-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rabies"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vaccine-date">Date</Label>
              <Input
                id="vaccine-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={addVaccination.isPending}>
                {addVaccination.isPending ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Confetti particles={confetti.particles} />
    </>
  )
}
