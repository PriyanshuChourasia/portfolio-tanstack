import { memo, useState } from 'react'
import { 
  Undo2, 
  Redo2, 
  Trash2, 
  ChevronDown, 
  ChevronRight,
  Clock,
  Layers,
  Eye,
  EyeOff,

  Image as ImageIcon,
  LayoutGrid,
  Type,
  Palette,
  Settings,
} from 'lucide-react'


export interface StackEntry {
  id: string
  timestamp: number
  component: string
  action: string
  details?: string
  previousValue?: unknown
  newValue?: unknown
}

interface ComponentStackProps {
  history: StackEntry[]
  onUndo: (entry: StackEntry) => void
  onRedo: (entry: StackEntry) => void
  onClear: () => void
}

const componentIcons: Record<string, typeof ImageIcon> = {
  'Header': Settings,
  'Footer': Settings,
  'Layout': LayoutGrid,
  'Theme': Palette,
  'Text': Type,
  'Image': ImageIcon,
  'Section': Layers,
}

export const ComponentStack = memo(function ComponentStack({
  history,
  onUndo,
  onRedo,
  onClear,
}: ComponentStackProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(true)

  const groupedHistory = history.reduce((acc, entry) => {
    if (!acc[entry.component]) {
      acc[entry.component] = []
    }
    acc[entry.component].push(entry)
    return acc
  }, {} as Record<string, StackEntry[]>)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-border/40">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold text-foreground">Stack</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onClear}
              className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title="Clear history"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground/60">
          {history.length} change{history.length !== 1 ? 's' : ''} tracked
        </p>
      </div>

      {/* Stack list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {history.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-6 w-6 text-muted-foreground/20 mx-auto mb-2" />
            <p className="text-[10px] text-muted-foreground/40">No changes yet</p>
            <p className="text-[8px] text-muted-foreground/30">Start editing to track changes</p>
          </div>
        ) : (
          Object.entries(groupedHistory).map(([component, entries]) => {
            const Icon = componentIcons[component] || Settings
            return (
              <div key={component} className="space-y-0.5">
                {/* Component group header */}
                <button
                  onClick={() => setExpandedId(expandedId === component ? null : component)}
                  className="flex w-full items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors"
                >
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[10px] font-semibold text-foreground flex-1 text-left">
                    {component}
                  </span>
                  <span className="text-[8px] text-muted-foreground/50">
                    {entries.length}
                  </span>
                  {expandedId === component ? (
                    <ChevronDown className="h-3 w-3 text-muted-foreground/50" />
                  ) : (
                    <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
                  )}
                </button>

                {/* Entries */}
                {expandedId === component && (
                  <div className="ml-4 space-y-0.5">
                    {entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="group flex items-start gap-2 px-2 py-1.5 rounded-md hover:bg-muted/30 transition-colors"
                      >
                        <div className="mt-0.5">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary/30" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-medium text-foreground truncate">
                            {entry.action}
                          </p>
                          {entry.details && (
                            <p className="text-[8px] text-muted-foreground/50 truncate">
                              {entry.details}
                            </p>
                          )}
                          <p className="text-[7px] text-muted-foreground/30 mt-0.5">
                            {new Date(entry.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onUndo(entry)}
                            className="p-1 rounded text-muted-foreground hover:bg-muted hover:text-foreground"
                            title="Undo"
                          >
                            <Undo2 className="h-2.5 w-2.5" />
                          </button>
                          <button
                            onClick={() => onRedo(entry)}
                            className="p-1 rounded text-muted-foreground hover:bg-muted hover:text-foreground"
                            title="Redo"
                          >
                            <Redo2 className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Quick actions */}
      {history.length > 0 && (
        <div className="p-2 border-t border-border/40 space-y-1">
          <button
            onClick={() => {
              const lastEntry = history[history.length - 1]
              if (lastEntry) onUndo(lastEntry)
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border/40 py-1.5 text-[10px] font-medium text-muted-foreground hover:border-primary/20 hover:bg-primary/5 hover:text-foreground transition-all"
          >
            <Undo2 className="h-3 w-3" />
            Undo Last
          </button>
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border/40 py-1.5 text-[10px] font-medium text-muted-foreground hover:border-primary/20 hover:bg-primary/5 hover:text-foreground transition-all"
          >
            {showAll ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            {showAll ? 'Collapse All' : 'Expand All'}
          </button>
        </div>
      )}
    </div>
  )
})
