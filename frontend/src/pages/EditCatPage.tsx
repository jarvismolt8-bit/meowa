import { useParams, Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useCat } from '@/hooks/useCats'
import CatForm from '@/components/CatForm'
import { Button } from '@/components/ui/button'
import type { Cat } from '@/lib/api'

export default function EditCatPage() {
  const { id } = useParams<{ id: string }>()
  const catId = Number(id)
  const { data: cat, isLoading, error } = useCat(catId)
  const navigate = useNavigate()

  const handleSuccess = (updatedCat: Cat) => {
    navigate(`/cats/${updatedCat.id}`)
  }

  if (isNaN(catId)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-medium text-destructive">Invalid cat ID</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-[600px] animate-pulse rounded-xl bg-muted" />
      </div>
    )
  }

  if (error || !cat) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-medium text-destructive">Cat not found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          The cat you're trying to edit could not be found.
        </p>
        <Button variant="outline" className="mt-4" asChild>
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    )
  }

  return <CatForm mode="edit" initialData={cat} onSuccess={handleSuccess} />
}
