export interface Conversion {
  id: string
  parentUnitId: string
  childUnitId: string
  factor: number
  parentUnitName?: string
  parentUnitSymbol?: string
  childUnitName?: string
  childUnitSymbol?: string
  createdAt?: string
}

export interface CreateConversionInput {
  parentUnitId: string
  childUnitId: string
  factor: number
}

export interface UpdateConversionInput extends Partial<CreateConversionInput> {
  id: string
}

export interface ConversionPreviewRequest {
  quantity: number
  unitId: string
}

export interface ConversionPreviewResult {
  steps: ConversionStep[]
}

export interface ConversionStep {
  unitId: string
  unitName: string
  unitSymbol: string
  quantity: number
}
