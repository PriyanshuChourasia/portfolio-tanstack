import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
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
import { Input } from '@/components/ui/input'
import type { Unit } from '../types/unit'
import type { Conversion } from '../types/conversion'

const conversionSchema = z.object({
  parentUnitId: z.string().min(1, 'Parent unit is required'),
  childUnitId: z.string().min(1, 'Child unit is required'),
  factor: z.preprocess(
    (val) => (val === '' || val === undefined ? undefined : Number(val)),
    z.number({ message: 'Factor must be a number' }).positive('Factor must be a positive number'),
  ),
})

type ConversionFormValues = z.infer<typeof conversionSchema>

interface ConversionFormProps {
  units: Unit[]
  onSubmit: (data: ConversionFormValues) => Promise<void>
  isLoading?: boolean
  onReset?: () => void
  conversion?: Conversion | null
}

export function ConversionForm({ units, onSubmit, isLoading, onReset, conversion }: ConversionFormProps) {
  const form = useForm<ConversionFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(conversionSchema) as any,
    defaultValues: {
      parentUnitId: '',
      childUnitId: '',
      factor: undefined,
    },
  })

  useEffect(() => {
    if (conversion) {
      form.reset({
        parentUnitId: conversion.parentUnitId,
        childUnitId: conversion.childUnitId,
        factor: conversion.factor,
      })
    }
  }, [conversion, form])

  const handleReset = () => {
    form.reset({
      parentUnitId: '',
      childUnitId: '',
      factor: undefined,
    })
    onReset?.()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="parentUnitId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Unit</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.name} ({unit.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="childUnitId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Child Unit</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select child unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.name} ({unit.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="factor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conversion Factor</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
                    placeholder="e.g. 10"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const val = e.target.value
                      field.onChange(val === '' ? undefined : Number(val))
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </form>
    </Form>
  )
}

export type { ConversionFormValues }
