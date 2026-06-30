import { useState, type ChangeEvent } from 'react'
import { ArrowDown, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useConversionPreview } from '../hooks/useConversions'
import type { Unit } from '../types/unit'
import type { ConversionStep } from '../types/conversion'

interface ConversionPreviewCardProps {
  units: Unit[]
}

export function ConversionPreviewCard({ units }: ConversionPreviewCardProps) {
  const [quantity, setQuantity] = useState<string>('')
  const [unitId, setUnitId] = useState<string>('')
  const [result, setResult] = useState<ConversionStep[] | null>(null)

  const previewMutation = useConversionPreview()

  const handlePreview = async () => {
    if (!quantity || !unitId) return

    const data = await previewMutation.mutateAsync({
      quantity: Number(quantity),
      unitId,
    })

    setResult(data.steps)
  }

  const handleReset = () => {
    setQuantity('')
    setUnitId('')
    setResult(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Conversion Preview</CardTitle>
        <CardDescription>
          Preview how a quantity converts through the unit hierarchy.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="preview-qty">Quantity</Label>
            <Input
              id="preview-qty"
              type="number"
              step="any"
              placeholder="e.g. 5"
              value={quantity}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setQuantity(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preview-unit">Unit</Label>
            <Select
              value={unitId}
              onValueChange={(value: string) => {
                setUnitId(value)
                setResult(null)
              }}
            >
              <SelectTrigger id="preview-unit">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.name} ({unit.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-2">
            <Button
              onClick={handlePreview}
              disabled={!quantity || !unitId || previewMutation.isPending}
            >
              {previewMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Previewing...
                </>
              ) : (
                'Preview'
              )}
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>

        {result && result.length > 0 && (
          <div className="mt-6 rounded-lg border bg-muted/30 p-6">
            <div className="flex flex-col items-center gap-3">
              {result.map((step: ConversionStep, index: number) => (
                <div key={step.unitId} className="flex flex-col items-center">
                  <div className="rounded-md border bg-card px-4 py-2 text-center shadow-sm">
                    <span className="text-lg font-bold">
                      {step.quantity.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      {step.unitName} ({step.unitSymbol})
                    </span>
                  </div>
                  {index < result.length - 1 && (
                    <ArrowDown className="my-1 size-5 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {previewMutation.isError && (
          <p className="text-destructive text-sm">
            {(previewMutation.error as Error)?.message ?? 'Failed to preview conversion'}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
