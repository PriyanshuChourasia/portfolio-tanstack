import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { unitService } from '../services/unit.service'
import type { CreateUnitInput, UpdateUnitInput } from '../types/unit'

const UNITS_KEY = ['units'] as const

export function useUnits() {
  return useQuery({
    queryKey: UNITS_KEY,
    queryFn: () => unitService.getAll(),
  })
}

export function useUnit(id: string) {
  return useQuery({
    queryKey: [...UNITS_KEY, id],
    queryFn: () => unitService.getById(id),
    enabled: !!id,
  })
}

export function useCreateUnit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateUnitInput) => unitService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UNITS_KEY })
    },
  })
}

export function useUpdateUnit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateUnitInput) => unitService.update(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UNITS_KEY })
    },
  })
}

export function useDeleteUnit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => unitService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UNITS_KEY })
    },
  })
}
