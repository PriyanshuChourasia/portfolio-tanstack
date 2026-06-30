import type { Conversion, CreateConversionInput, UpdateConversionInput, ConversionPreviewRequest, ConversionPreviewResult } from '../types/conversion'

const API_BASE = '/api'

export const conversionService = {
  async getAll(): Promise<Conversion[]> {
    const res = await fetch(`${API_BASE}/conversions`)
    if (!res.ok) throw new Error('Failed to fetch conversions')
    return res.json()
  },

  async create(input: CreateConversionInput): Promise<Conversion> {
    const res = await fetch(`${API_BASE}/conversions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    if (!res.ok) throw new Error('Failed to create conversion')
    return res.json()
  },

  async update(input: UpdateConversionInput): Promise<Conversion> {
    const { id, ...data } = input
    const res = await fetch(`${API_BASE}/conversions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update conversion')
    return res.json()
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/conversions/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to delete conversion')
  },

  async preview(input: ConversionPreviewRequest): Promise<ConversionPreviewResult> {
    const res = await fetch(`${API_BASE}/conversions/preview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    if (!res.ok) throw new Error('Failed to preview conversion')
    return res.json()
  },
}
