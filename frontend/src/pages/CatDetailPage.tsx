import { useParams, Link } from 'react-router-dom'
import { useCat } from '@/hooks/useCats'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import VaccinationsPanel from '@/components/VaccinationsPanel'
import MedicalPanel from '@/components/MedicalPanel'

export default function CatDetailPage() {
  const { id } = useParams<{ id: string }>()
  const catId = Number(id)
  const { data: cat, isLoading, error } = useCat(catId)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 animate-pulse rounded bg-muted" />
        <div className="aspect-[3/1] w-full animate-pulse rounded-xl bg-muted" />
        <div className="space-y-3">
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-medium text-destructive">Failed to load cat</p>
        <p className="mt-1 text-sm text-muted-foreground">
          The cat you're looking for could not be found.
        </p>
        <Button variant="outline" className="mt-4" asChild>
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    )
  }

  if (!cat) return null

  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Back
      </Link>

      <Card className="overflow-hidden">
        <div className="aspect-[3/1] w-full bg-muted">
          {cat.photo_path ? (
            <img
              src={cat.photo_path}
              alt={cat.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl">
              😺
            </div>
          )}
        </div>
        <CardContent className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">{cat.name}</h1>
            <Button variant="outline" size="sm" asChild>
              <Link to={`/cats/${cat.id}/edit`}>Edit</Link>
            </Button>
          </div>

          {cat.age != null && (
            <div>
              <span className="text-sm text-muted-foreground">Age</span>
              <p className="font-medium">{cat.age} years</p>
            </div>
          )}

          {cat.details && (
            <div>
              <span className="text-sm text-muted-foreground">Details</span>
              <p className="font-medium">{cat.details}</p>
            </div>
          )}

          {cat.favorite_foods.length > 0 && (
            <div>
              <span className="text-sm text-muted-foreground">Favorite foods</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {cat.favorite_foods.map((food) => (
                  <Badge key={food} variant="secondary">
                    {food}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {cat.last_checkup && (
            <div>
              <span className="text-sm text-muted-foreground">Last checkup</span>
              <p className="font-medium">
                {new Date(cat.last_checkup).toLocaleDateString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div id="vaccinations-slot" data-testid="vaccinations-slot">
        <VaccinationsPanel catId={catId} />
      </div>
      <div id="medical-slot" data-testid="medical-slot">
        <MedicalPanel catId={catId} />
      </div>
      <div id="gamification-slot" data-testid="gamification-slot" />
    </div>
  )
}
