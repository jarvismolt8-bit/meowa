import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { medicalApi, type MedicalEntry } from '@/lib/api'

export function useMedical(catId: number) {
  return useQuery<MedicalEntry[]>({
    queryKey: ['medical', catId],
    queryFn: () => medicalApi.list(catId),
    enabled: !!catId,
  })
}

export function useAddMedical(catId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { date: string; notes: string }) =>
      medicalApi.create(catId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['medical', catId] }),
  })
}

export function useUpdateMedical(catId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ mId, data }: { mId: number; data: { date: string; notes: string } }) =>
      medicalApi.update(catId, mId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['medical', catId] }),
  })
}

export function useDeleteMedical(catId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (mId: number) => medicalApi.delete(catId, mId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['medical', catId] }),
  })
}
