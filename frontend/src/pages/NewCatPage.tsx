import { useNavigate } from 'react-router-dom'
import CatForm from '@/components/CatForm'
import type { Cat } from '@/lib/api'

export default function NewCatPage() {
  const navigate = useNavigate()

  const handleSuccess = (cat: Cat) => {
    navigate(`/cats/${cat.id}`)
  }

  return (
    <div className="min-h-0">
      <CatForm mode="create" onSuccess={handleSuccess} />
    </div>
  )
}
