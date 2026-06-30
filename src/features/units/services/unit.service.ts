import type { Unit, CreateUnitInput, UpdateUnitInput } from '../types/unit'

const API_BASE = '/api'

export const unitService = {
  async getAll(): Promise<Unit[]> {
    const res = await fetch(`${API_BASE}/units`)
    if (!res.ok) throw new Error('Failed to fetch units')
    return res.json()
  },

  async getById(id: string): Promise<Unit> {
    const res = await fetch(`${API_BASE}/units/${id}`)
    if (!res.ok) throw new Error('Failed to fetch unit')
    return res.json()
  },

  async create(input: CreateUnitInput): Promise<Unit> {
    const res = await fetch(`${API_BASE}/units`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    if (!res.ok) throw new Error('Failed to create unit')
    return res.json()
  },

  async update(input: UpdateUnitInput): Promise<Unit> {
    const { id, ...data } = input
    const res = await fetch(`${API_BASE}/units/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update unit')
    return res.json()
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/units/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to delete unit')
  },
}
