import { useState, KeyboardEvent } from 'react'
import { Plus, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface FoodInputProps {
  value: string[]
  onChange: (foods: string[]) => void
}

export default function FoodInput({ value, onChange }: FoodInputProps) {
  const [inputText, setInputText] = useState('')

  const addFood = () => {
    const trimmed = inputText.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
    }
    setInputText('')
  }

  const removeFood = (food: string) => {
    onChange(value.filter((f) => f !== food))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addFood()
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a favorite food..."
          className="flex-1 border-[var(--brand-violet-soft)] focus:border-[var(--brand-violet)]"
          aria-label="Favorite food input"
        />
        <button
          type="button"
          onClick={addFood}
          className="flex items-center gap-1 rounded-lg border border-[var(--brand-violet-soft)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--brand-violet-soft)] transition-colors"
        >
          <Plus className="size-4" />
          Add
        </button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((food) => (
            <span key={food} className="chip-green gap-1">
              {food}
              <button
                type="button"
                onClick={() => removeFood(food)}
                aria-label={`Remove ${food}`}
                className="ml-1 flex size-3.5 items-center justify-center rounded-full opacity-80 hover:opacity-100"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
