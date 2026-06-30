import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUnits, useCreateUnit, useUpdateUnit, useDeleteUnit } from '@/features/units/hooks/useUnits'
import { UnitTable } from '@/features/units/components/UnitTable'
import { UnitFormModal } from '@/features/units/components/UnitFormModal'
import { DeleteDialog } from '@/features/units/components/DeleteDialog'
import { LoadingSkeleton } from '@/features/units/components/LoadingSkeleton'
import { EmptyState } from '@/features/units/components/EmptyState'
import type { Unit, CreateUnitInput, UnitType } from '@/features/units/types/unit'

export const Route = createFileRoute('/units/')({
  component: UnitMasterPage,
})

const unitTypes: UnitType[] = ['Packaging', 'Quantity', 'Weight', 'Volume', 'Length']

function UnitMasterPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null)
  const [deletingUnit, setDeletingUnit] = useState<Unit | null>(null)

  const { data: units, isLoading, isError, error } = useUnits()
  const createUnit = useCreateUnit()
  const updateUnit = useUpdateUnit()
  const deleteUnit = useDeleteUnit()

  const filteredUnits = (units ?? []).filter((unit) => {
    const matchesSearch =
      !search ||
      unit.name.toLowerCase().includes(search.toLowerCase()) ||
      unit.symbol.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === 'all' || unit.type === typeFilter
    return matchesSearch && matchesType
  })

  const handleAdd = () => {
    setEditingUnit(null)
    setIsFormOpen(true)
  }

  const handleEdit = (unit: Unit) => {
    setEditingUnit(unit)
    setIsFormOpen(true)
  }

  const handleSubmitForm = async (data: CreateUnitInput) => {
    if (editingUnit) {
      await updateUnit.mutateAsync({ id: editingUnit.id, ...data })
    } else {
      await createUnit.mutateAsync(data)
    }
    setIsFormOpen(false)
    setEditingUnit(null)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingUnit) return
    await deleteUnit.mutateAsync(deletingUnit.id)
    setDeletingUnit(null)
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <LoadingSkeleton />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <EmptyState
          title="Error loading units"
          description={(error as Error)?.message ?? 'An unexpected error occurred.'}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Unit Master</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage units of measurement across your organization.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Units</CardTitle>
            <Button onClick={handleAdd}>
              <Plus className="size-4" />
              Add Unit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                placeholder="Search units..."
                className="pl-9"
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              />
            </div>
            <Select
              value={typeFilter}
              onValueChange={(value: string) => setTypeFilter(value)}
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {unitTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filteredUnits.length === 0 ? (
            <EmptyState
              title={search || typeFilter !== 'all' ? 'No matching units' : 'No units found'}
              description={
                search || typeFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by creating your first unit.'
              }
              actionLabel={search || typeFilter !== 'all' ? undefined : 'Add Unit'}
              onAction={search || typeFilter !== 'all' ? undefined : handleAdd}
            />
          ) : (
            <UnitTable
              units={filteredUnits}
              onEdit={handleEdit}
              onDelete={setDeletingUnit}
            />
          )}
        </CardContent>
      </Card>

      <UnitFormModal
        open={isFormOpen}
        onOpenChange={(open: boolean) => {
          setIsFormOpen(open)
          if (!open) setEditingUnit(null)
        }}
        onSubmit={handleSubmitForm}
        unit={editingUnit}
        isLoading={createUnit.isPending || updateUnit.isPending}
      />

      <DeleteDialog
        open={!!deletingUnit}
        onOpenChange={(open: boolean) => {
          if (!open) setDeletingUnit(null)
        }}
        title="Delete Unit"
        description={
          deletingUnit
            ? `Are you sure you want to delete "${deletingUnit.name}"? This action cannot be undone.`
            : ''
        }
        onConfirm={handleDeleteConfirm}
        isLoading={deleteUnit.isPending}
      />
    </div>
  )
}
