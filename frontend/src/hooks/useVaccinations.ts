import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { vaccinationsApi, type Vaccination } from '@/lib/api'

export function useVaccinations(catId: number) {
  return useQuery<Vaccination[]>({
    queryKey: ['vaccinations', catId],
    queryFn: () => vaccinationsApi.list(catId),
    enabled: !!catId,
  })
}

export function useAddVaccination(catId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; date: string }) =>
      vaccinationsApi.create(catId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vaccinations', catId] }),
  })
}

export function useUpdateVaccination(catId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ vId, data }: { vId: number; data: { name: string; date: string } }) =>
      vaccinationsApi.update(catId, vId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vaccinations', catId] }),
  })
}

export function useDeleteVaccination(catId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vId: number) => vaccinationsApi.delete(catId, vId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vaccinations', catId] }),
  })
}
