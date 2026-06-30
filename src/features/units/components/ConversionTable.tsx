import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Conversion } from '../types/conversion'

interface ConversionTableProps {
  conversions: Conversion[]
  onEdit: (conversion: Conversion) => void
  onDelete: (conversion: Conversion) => void
}

export function ConversionTable({ conversions, onEdit, onDelete }: ConversionTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Parent Unit</TableHead>
          <TableHead>Child Unit</TableHead>
          <TableHead>Factor</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {conversions.map((conversion) => (
          <TableRow key={conversion.id}>
            <TableCell className="font-medium">
              {conversion.parentUnitName ?? conversion.parentUnitId}
              {conversion.parentUnitSymbol ? (
                <span className="text-muted-foreground ml-1 font-mono text-sm">
                  ({conversion.parentUnitSymbol})
                </span>
              ) : null}
            </TableCell>
            <TableCell>
              {conversion.childUnitName ?? conversion.childUnitId}
              {conversion.childUnitSymbol ? (
                <span className="text-muted-foreground ml-1 font-mono text-sm">
                  ({conversion.childUnitSymbol})
                </span>
              ) : null}
            </TableCell>
            <TableCell className="font-mono font-medium">{conversion.factor}</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onEdit(conversion)}
                >
                  <Pencil className="size-4" />
                  <span className="sr-only">Edit conversion</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onDelete(conversion)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="size-4" />
                  <span className="sr-only">Delete conversion</span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
