import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import type { Unit, CreateUnitInput } from '../types/unit'

const unitTypes = ['Packaging', 'Quantity', 'Weight', 'Volume', 'Length'] as const

const unitSchema = z.object({
  name: z.string().min(1, 'Unit name is required'),
  symbol: z.string().min(1, 'Symbol is required'),
  type: z.string().refine(
    (val) => unitTypes.includes(val as typeof unitTypes[number]),
    { message: 'Type is required' }
  ),
})

type UnitFormValues = z.infer<typeof unitSchema>

interface UnitFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateUnitInput) => Promise<void>
  unit?: Unit | null
  isLoading?: boolean
}

export function UnitFormModal({
  open,
  onOpenChange,
  onSubmit,
  unit,
  isLoading,
}: UnitFormModalProps) {
  const form = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      name: '',
      symbol: '',
      type: '',
    },
  })

  useEffect(() => {
    if (open) {
      if (unit) {
        form.reset({
          name: unit.name,
          symbol: unit.symbol,
          type: unit.type,
        })
      } else {
        form.reset({
          name: '',
          symbol: '',
          type: '',
        })
      }
    }
  }, [open, unit, form])

  const handleSubmit = async (data: UnitFormValues) => {
    await onSubmit(data as CreateUnitInput)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{unit ? 'Edit Unit' : 'Add Unit'}</DialogTitle>
          <DialogDescription>
            {unit
              ? 'Update the unit details below.'
              : 'Fill in the details to create a new unit.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Box, Kilogram, Meter" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symbol</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. bx, kg, m" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {unitTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset()
                  onOpenChange(false)
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : unit ? 'Update' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
