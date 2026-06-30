import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUnits } from '@/features/units/hooks/useUnits'
import { useConversions, useCreateConversion, useDeleteConversion, useUpdateConversion } from '@/features/units/hooks/useConversions'
import { ConversionForm } from '@/features/units/components/ConversionForm'
import type { ConversionFormValues } from '@/features/units/components/ConversionForm'
import { ConversionTable } from '@/features/units/components/ConversionTable'
import { ConversionPreviewCard } from '@/features/units/components/ConversionPreviewCard'
import { DeleteDialog } from '@/features/units/components/DeleteDialog'
import { LoadingSkeleton } from '@/features/units/components/LoadingSkeleton'
import { EmptyState } from '@/features/units/components/EmptyState'
import type { Conversion } from '@/features/units/types/conversion'

export const Route = createFileRoute('/units/conversion')({
  component: UnitConversionPage,
})

function UnitConversionPage() {
  const { data: units, isLoading: unitsLoading } = useUnits()
  const { data: conversions, isLoading: conversionsLoading, isError, error } = useConversions()
  const createConversion = useCreateConversion()
  const updateConversion = useUpdateConversion()
  const deleteConversion = useDeleteConversion()

  const [deletingConversion, setDeletingConversion] = useState<Conversion | null>(null)
  const [editingConversion, setEditingConversion] = useState<Conversion | null>(null)

  const handleSubmitConversion = async (data: ConversionFormValues) => {
    if (editingConversion) {
      await updateConversion.mutateAsync({ id: editingConversion.id, ...data })
    } else {
      await createConversion.mutateAsync(data)
    }
    setEditingConversion(null)
  }

  const handleEditConversion = (conversion: Conversion) => {
    setEditingConversion(conversion)
  }

  const handleResetForm = () => {
    setEditingConversion(null)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingConversion) return
    await deleteConversion.mutateAsync(deletingConversion.id)
    setDeletingConversion(null)
  }

  const isLoading = unitsLoading || conversionsLoading

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <LoadingSkeleton />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <EmptyState
          title="Error loading conversions"
          description={(error as Error)?.message ?? 'An unexpected error occurred.'}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Unit Conversion</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Define and manage conversion factors between units.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Create Conversion */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {editingConversion ? 'Edit Conversion' : 'Create Conversion'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ConversionForm
                units={units ?? []}
                onSubmit={handleSubmitConversion}
                isLoading={createConversion.isPending || updateConversion.isPending}
                onReset={handleResetForm}
                conversion={editingConversion}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conversion List</CardTitle>
            </CardHeader>
            <CardContent>
              {!conversions || conversions.length === 0 ? (
                <EmptyState
                  title="No conversions yet"
                  description="Define conversion factors between units above."
                />
              ) : (
                <ConversionTable
                  conversions={conversions}
                  onEdit={handleEditConversion}
                  onDelete={setDeletingConversion}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Conversion Preview */}
        <div>
          <ConversionPreviewCard units={units ?? []} />
        </div>
      </div>

      <DeleteDialog
        open={!!deletingConversion}
        onOpenChange={(open: boolean) => {
          if (!open) setDeletingConversion(null)
        }}
        title="Delete Conversion"
        description={
          deletingConversion
            ? `Are you sure you want to delete this conversion (${deletingConversion.parentUnitName ?? deletingConversion.parentUnitId} → ${deletingConversion.childUnitName ?? deletingConversion.childUnitId})? This action cannot be undone.`
            : ''
        }
        onConfirm={handleDeleteConfirm}
        isLoading={deleteConversion.isPending}
      />
    </div>
  )
}
