import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { catsApi, type Cat } from '@/lib/api'

export function useCats() {
  return useQuery<Cat[]>({
    queryKey: ['cats'],
    queryFn: catsApi.list,
  })
}

export function useCat(id: number) {
  return useQuery<Cat>({
    queryKey: ['cats', id],
    queryFn: () => catsApi.get(id),
    enabled: !!id,
  })
}

export function useCreateCat() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Cat>) => catsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cats'] }),
  })
}

export function useUpdateCat() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Cat> }) =>
      catsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cats'] }),
  })
}

export function useDeleteCat() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => catsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cats'] }),
  })
}
