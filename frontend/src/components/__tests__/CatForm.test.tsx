import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import CatForm from '../CatForm'

// Mock the hooks so no real API calls are made
vi.mock('@/hooks/useCats', () => ({
  useCreateCat: () => ({
    mutateAsync: vi.fn().mockResolvedValue({ id: 1, name: 'Test Cat' }),
    isPending: false,
  }),
  useUpdateCat: () => ({
    mutateAsync: vi.fn().mockResolvedValue({ id: 1, name: 'Test Cat' }),
    isPending: false,
  }),
}))

// Mock the uploads API to prevent network calls during photo upload
vi.mock('@/lib/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api')>()
  return {
    ...actual,
    uploadsApi: {
      upload: vi.fn().mockResolvedValue({ path: '/uploads/test.jpg' }),
    },
  }
})

function makeQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } })
}

function renderCatForm(props: Parameters<typeof CatForm>[0]) {
  const qc = makeQueryClient()
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <CatForm {...props} />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('CatForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing and shows the name field', () => {
    renderCatForm({ mode: 'create' })
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
  })

  it('shows "Add a New Cat" heading in create mode', () => {
    renderCatForm({ mode: 'create' })
    expect(screen.getByText('Add a New Cat')).toBeInTheDocument()
  })

  it('shows a validation error when submitting with an empty name', async () => {
    renderCatForm({ mode: 'create' })
    const submitButton = screen.getByRole('button', { name: /create cat/i })
    fireEvent.click(submitButton)
    expect(await screen.findByText('Name is required')).toBeInTheDocument()
  })

  it('shows "Save Changes" button in edit mode', () => {
    const cat = {
      id: 1,
      name: 'Luna',
      age: 2,
      details: null,
      favorite_foods: [],
      last_checkup: null,
      photo_path: null,
      next_checkup_due: null,
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z',
    }
    renderCatForm({ mode: 'edit', initialData: cat })
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument()
  })
})
