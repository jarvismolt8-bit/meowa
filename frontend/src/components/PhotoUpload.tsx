import { useRef } from 'react'
import { Upload, X } from 'lucide-react'
import { uploadsApi } from '@/lib/api'

interface PhotoUploadProps {
  value: string | null
  onChange: (path: string | null) => void
  onError?: (message: string) => void
}

export default function PhotoUpload({ value, onChange, onError }: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const objectUrlRef = useRef<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      onError?.('Photo must be 5 MB or smaller')
      return
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
    }
    const url = URL.createObjectURL(file)
    objectUrlRef.current = url

    // Optimistically show preview
    onChange(url)

    try {
      const result = await uploadsApi.upload(file)
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = null
      }
      onChange(result.path)
    } catch {
      onError?.('Failed to upload photo')
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = null
      }
      onChange(null)
    }
  }

  const handleRemove = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    onChange(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-1">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        aria-label="Upload photo"
      />
      {value ? (
        <div className="relative aspect-[3/1] w-full overflow-hidden rounded-xl bg-muted">
          <img src={value} alt="Preview" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-background/80 text-foreground hover:bg-background"
            aria-label="Remove photo"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="surface-tint-violet flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--brand-violet-soft)] px-4 py-3 text-sm font-medium text-[var(--brand-ink)] transition-opacity hover:opacity-80"
        >
          <Upload className="size-4" />
          Upload Photo
        </button>
      )}
    </div>
  )
}
