import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface SectionSearchProps {
  value: string
  onChange: (value: string) => void
}

export function SectionSearch({ value, onChange }: SectionSearchProps) {
  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search sections..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 border-0 bg-muted/50 pl-8 text-xs focus-visible:bg-muted/80 focus-visible:ring-1 focus-visible:ring-ring/40"
        />
      </div>
    </div>
  )
}
