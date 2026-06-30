import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Unit } from '../types/unit'

interface UnitTableProps {
  units: Unit[]
  onEdit: (unit: Unit) => void
  onDelete: (unit: Unit) => void
}

const typeColors: Record<string, string> = {
  Packaging: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  Quantity: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  Weight: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  Volume: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  Length: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
}

export function UnitTable({ units, onEdit, onDelete }: UnitTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Unit Name</TableHead>
          <TableHead>Symbol</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {units.map((unit) => (
          <TableRow key={unit.id}>
            <TableCell className="font-medium">{unit.name}</TableCell>
            <TableCell className="font-mono text-sm">{unit.symbol}</TableCell>
            <TableCell>
              <Badge variant="outline" className={typeColors[unit.type]}>
                {unit.type}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={unit.status === 'active' ? 'default' : 'secondary'}>
                {unit.status}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {new Date(unit.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onEdit(unit)}
                >
                  <Pencil className="size-4" />
                  <span className="sr-only">Edit {unit.name}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onDelete(unit)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="size-4" />
                  <span className="sr-only">Delete {unit.name}</span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
