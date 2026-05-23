import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateCat, useUpdateCat } from '@/hooks/useCats'
import { type Cat } from '@/lib/api'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import PhotoUpload from '@/components/PhotoUpload'
import FoodInput from '@/components/FoodInput'
import Confetti, { useConfetti } from '@/components/gamification/Confetti'

// --------------- Zod schema ---------------
const catSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  age: z
    .string()
    .optional()
    .refine(
      (v) => !v || (/^\d+$/.test(v) && parseInt(v) >= 1),
      { message: 'Age must be a positive integer' }
    ),
  details: z.string().optional(),
  favorite_foods: z.array(z.string()).optional(),
  last_checkup: z.string().optional(),
  photo_path: z.string().nullable().optional(),
})

type CatFormValues = z.infer<typeof catSchema>

// ------------------------------------------

interface CatFormProps {
  mode: 'create' | 'edit'
  initialData?: Cat
  onSuccess?: (cat: Cat) => void
}

export default function CatForm({ mode, initialData, onSuccess }: CatFormProps) {
  const navigate = useNavigate()
  const createCat = useCreateCat()
  const updateCat = useUpdateCat()
  const confetti = useConfetti(2500)
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<CatFormValues>({
    resolver: zodResolver(catSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      age: initialData?.age?.toString() ?? '',
      details: initialData?.details ?? '',
      favorite_foods: initialData?.favorite_foods ?? [],
      last_checkup: initialData?.last_checkup ?? '',
      photo_path: initialData?.photo_path ?? null,
    },
  })

  const showToast = useCallback((message: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current)
    setError('root', { message })
    toastTimeoutRef.current = setTimeout(() => clearErrors('root'), 4000)
  }, [setError, clearErrors])

  const onSubmit = async (values: CatFormValues) => {
    const data: Partial<Cat> = {
      name: values.name.trim(),
      age: values.age ? parseInt(values.age) : null,
      details: values.details || null,
      favorite_foods: values.favorite_foods ?? [],
      last_checkup: values.last_checkup || null,
      photo_path: values.photo_path ?? null,
    }

    try {
      if (mode === 'create') {
        const cat = await createCat.mutateAsync(data)
        confetti.trigger()
        await new Promise((r) => setTimeout(r, 1200))
        onSuccess?.(cat)
      } else if (initialData) {
        const cat = await updateCat.mutateAsync({ id: initialData.id, data })
        onSuccess?.(cat)
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to save cat')
    }
  }

  return (
    <div className="surface-card p-6">
      <h2 className="mb-5 text-xl font-semibold text-[var(--brand-ink)]">
        {mode === 'create' ? 'Add a New Cat' : `Edit ${initialData?.name ?? 'Cat'}`}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {errors.root?.message && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive" role="alert">
            {errors.root.message}
          </div>
        )}

        {/* Photo */}
        <div className="space-y-1">
          <Label>Photo</Label>
          <Controller
            name="photo_path"
            control={control}
            render={({ field }) => (
              <PhotoUpload
                value={field.value ?? null}
                onChange={field.onChange}
                onError={(msg) => setError('photo_path', { message: msg })}
              />
            )}
          />
          {errors.photo_path && (
            <p id="photo-error" className="text-xs text-destructive" role="alert">
              {errors.photo_path.message}
            </p>
          )}
        </div>

        {/* Name */}
        <div className="space-y-1">
          <Label htmlFor="name">
            Name <span className="text-destructive" aria-hidden="true">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Enter cat's name"
            className="border-[var(--brand-violet-soft)] focus:border-[var(--brand-violet)]"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            {...register('name')}
          />
          {errors.name && (
            <p id="name-error" className="text-xs text-destructive" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Age */}
        <div className="space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            min="1"
            placeholder="Enter cat's age"
            className="border-[var(--brand-violet-soft)] focus:border-[var(--brand-violet)]"
            aria-invalid={!!errors.age}
            aria-describedby={errors.age ? 'age-error' : undefined}
            {...register('age')}
          />
          {errors.age && (
            <p id="age-error" className="text-xs text-destructive" role="alert">
              {errors.age.message}
            </p>
          )}
        </div>

        {/* Details */}
        <div className="space-y-1">
          <Label htmlFor="details">Details</Label>
          <textarea
            id="details"
            placeholder="Enter any details about your cat..."
            className="h-24 w-full resize-y rounded-lg border border-[var(--brand-violet-soft)] bg-transparent px-2.5 py-1 text-sm placeholder:text-muted-foreground focus-visible:border-[var(--brand-violet)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-violet)]/30"
            {...register('details')}
          />
        </div>

        {/* Favorite Foods */}
        <div className="space-y-1">
          <Label>Favorite Foods</Label>
          <Controller
            name="favorite_foods"
            control={control}
            render={({ field }) => (
              <FoodInput
                value={field.value ?? []}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        {/* Last Checkup */}
        <div className="space-y-1">
          <Label htmlFor="lastCheckup">Last Checkup</Label>
          <Input
            id="lastCheckup"
            type="date"
            className="border-[var(--brand-violet-soft)] focus:border-[var(--brand-violet)]"
            {...register('last_checkup')}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--brand-cream)] disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-sunny flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold text-[var(--brand-ink)] disabled:opacity-50 transition-opacity hover:opacity-90"
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {mode === 'create' ? 'Create Cat' : 'Save Changes'}
          </button>
        </div>
      </form>

      <Confetti particles={confetti.particles} />
    </div>
  )
}
