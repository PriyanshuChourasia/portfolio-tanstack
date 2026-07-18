import { useEffect, useRef, useState } from "react"
import { Pencil } from "lucide-react"
import { cn } from "@/lib/utils"

interface EditableLabelProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function EditableLabel({ value, onChange, className }: EditableLabelProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])

  const commit = () => {
    onChange(draft.trim() || value)
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit()
          if (e.key === "Escape") {
            setDraft(value)
            setEditing(false)
          }
        }}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "bg-transparent border-b border-primary/50 outline-none text-center w-full",
          className
        )}
      />
    )
  }

  return (
    <span
      className={cn("group/edit relative cursor-pointer", className)}
      onClick={(e) => {
        e.stopPropagation()
        setDraft(value)
        setEditing(true)
      }}
    >
      {value}
      <Pencil className="w-2.5 h-2.5 absolute -right-3.5 top-1/2 -translate-y-1/2 opacity-0 group-hover/edit:opacity-60 transition-opacity" />
    </span>
  )
}
