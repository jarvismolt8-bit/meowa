import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import VaccinationsPanel from '../VaccinationsPanel'

// Mock the vaccinations hooks to avoid real network calls
vi.mock('@/hooks/useVaccinations', () => ({
  useVaccinations: (_catId: number) => ({
    data: [],
    isLoading: false,
    error: null,
  }),
  useAddVaccination: (_catId: number) => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useUpdateVaccination: (_catId: number) => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useDeleteVaccination: (_catId: number) => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}))

function makeQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } })
}

function renderVaccinationsPanel(catId = 1) {
  const qc = makeQueryClient()
  return render(
    <QueryClientProvider client={qc}>
      <VaccinationsPanel catId={catId} />
    </QueryClientProvider>,
  )
}

describe('VaccinationsPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    renderVaccinationsPanel()
    expect(screen.getByText('Vaccinations')).toBeInTheDocument()
  })

  it('shows empty-state text when there are no vaccinations', () => {
    renderVaccinationsPanel()
    expect(screen.getByText('No records yet')).toBeInTheDocument()
  })

  it('shows the Add vaccination button', () => {
    renderVaccinationsPanel()
    // There are two "Add vaccination" buttons in the empty state (header + body)
    const addButtons = screen.getAllByRole('button', { name: /add vaccination/i })
    expect(addButtons.length).toBeGreaterThan(0)
  })
})
