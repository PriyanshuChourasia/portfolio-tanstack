import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { conversionService } from '../services/conversion.service'
import type { CreateConversionInput, UpdateConversionInput, ConversionPreviewRequest } from '../types/conversion'

const CONVERSIONS_KEY = ['conversions'] as const

export function useConversions() {
  return useQuery({
    queryKey: CONVERSIONS_KEY,
    queryFn: () => conversionService.getAll(),
  })
}

export function useCreateConversion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateConversionInput) => conversionService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONVERSIONS_KEY })
    },
  })
}

export function useUpdateConversion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateConversionInput) => conversionService.update(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONVERSIONS_KEY })
    },
  })
}

export function useDeleteConversion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => conversionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONVERSIONS_KEY })
    },
  })
}

export function useConversionPreview() {
  return useMutation({
    mutationFn: (input: ConversionPreviewRequest) => conversionService.preview(input),
  })
}
