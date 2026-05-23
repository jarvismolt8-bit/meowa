import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateCat, useUpdateCat } from '@/hooks/useCats'
import { uploadsApi, type Cat } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Upload, Loader2, Plus } from 'lucide-react'

interface CatFormProps {
  mode: 'create' | 'edit'
  initialData?: Cat
  onSuccess?: (cat: Cat) => void
}

export default function CatForm({ mode, initialData, onSuccess }: CatFormProps) {
  const navigate = useNavigate()
  const createCat = useCreateCat()
  const updateCat = useUpdateCat()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const objectUrlRef = useRef<string | null>(null)
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [name, setName] = useState(initialData?.name ?? '')
  const [age, setAge] = useState(initialData?.age?.toString() ?? '')
  const [details, setDetails] = useState(initialData?.details ?? '')
  const [favoriteFoods, setFavoriteFoods] = useState<string[]>(initialData?.favorite_foods ?? [])
  const [lastCheckup, setLastCheckup] = useState(initialData?.last_checkup ?? '')
  const [foodInput, setFoodInput] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.photo_path ?? null)
  const [photoPath, setPhotoPath] = useState<string | null>(initialData?.photo_path ?? null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const showToast = useCallback((message: string, type: 'error' | 'success') => {
    setToast({ message, type })
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current)
    toastTimeoutRef.current = setTimeout(() => setToast(null), 4000)
  }, [])

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current)
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    }
  }, [])

  const addFood = () => {
    const trimmed = foodInput.trim()
    if (trimmed && !favoriteFoods.includes(trimmed)) {
      setFavoriteFoods([...favoriteFoods, trimmed])
    }
    setFoodInput('')
  }

  const removeFood = (food: string) => {
    setFavoriteFoods(favoriteFoods.filter((f) => f !== food))
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photo: 'Photo must be 5 MB or smaller' }))
      return
    }

    setErrors((prev) => {
      const { photo, ...rest } = prev
      return rest
    })

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
    }
    const url = URL.createObjectURL(file)
    objectUrlRef.current = url
    setPreviewUrl(url)

    try {
      const result = await uploadsApi.upload(file)
      setPhotoPath(result.path)
    } catch {
      showToast('Failed to upload photo', 'error')
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = null
      }
      setPreviewUrl(initialData?.photo_path ?? null)
      setPhotoPath(initialData?.photo_path ?? null)
    }
  }

  const handleRemovePhoto = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    setPreviewUrl(null)
    setPhotoPath(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (age && (!/^\d+$/.test(age) || parseInt(age) < 1)) {
      newErrors.age = 'Age must be a positive integer'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) return

    setIsSubmitting(true)

    try {
      const data: Partial<Cat> = {
        name: name.trim(),
        age: age ? parseInt(age) : null,
        details: details || null,
        favorite_foods: favoriteFoods,
        last_checkup: lastCheckup || null,
        photo_path: photoPath,
      }

      if (mode === 'create') {
        const cat = await createCat.mutateAsync(data)
        onSuccess?.(cat)
      } else if (initialData) {
        const cat = await updateCat.mutateAsync({ id: initialData.id, data })
        onSuccess?.(cat)
      }
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to save cat',
        'error'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? 'Add a New Cat' : `Edit ${initialData?.name ?? 'Cat'}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {toast && (
            <div
              className={`rounded-lg p-3 text-sm ${
                toast.type === 'error'
                  ? 'bg-destructive/10 text-destructive'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {toast.message}
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="photo">Photo</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {previewUrl ? (
              <div className="relative aspect-[3/1] w-full overflow-hidden rounded-xl bg-muted">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-background/80 text-foreground hover:bg-background"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="size-4" />
                Upload Photo
              </Button>
            )}
            {errors.photo && (
              <p className="text-xs text-destructive">{errors.photo}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter cat's name"
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              min="0"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter cat's age"
              aria-invalid={!!errors.age}
            />
            {errors.age && (
              <p className="text-xs text-destructive">{errors.age}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="details">Details</Label>
            <textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Enter any details about your cat..."
              className="h-24 w-full resize-y rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <div className="space-y-1">
            <Label>Favorite Foods</Label>
            <div className="flex gap-2">
              <Input
                value={foodInput}
                onChange={(e) => setFoodInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addFood()
                  }
                }}
                placeholder="Add a favorite food..."
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={addFood}>
                <Plus className="size-4" />
                Add
              </Button>
            </div>
            {favoriteFoods.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {favoriteFoods.map((food) => (
                  <Badge key={food} variant="secondary" className="gap-1">
                    {food}
                    <button
                      type="button"
                      onClick={() => removeFood(food)}
                      className="flex size-3.5 items-center justify-center rounded-full hover:bg-destructive/20 hover:text-destructive"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="lastCheckup">Last Checkup</Label>
            <Input
              id="lastCheckup"
              type="date"
              value={lastCheckup}
              onChange={(e) => setLastCheckup(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {mode === 'create' ? 'Create Cat' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
