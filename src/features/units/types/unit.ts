export type UnitType = 'Packaging' | 'Quantity' | 'Weight' | 'Volume' | 'Length'

export interface Unit {
  id: string
  name: string
  symbol: string
  type: UnitType
  status: 'active' | 'inactive'
  createdAt: string
}

export interface CreateUnitInput {
  name: string
  symbol: string
  type: UnitType
}

export interface UpdateUnitInput extends Partial<CreateUnitInput> {
  id: string
}
