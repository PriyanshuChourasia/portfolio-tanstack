import type { ChangeEvent, KeyboardEvent } from 'react'

interface EditorPaneProps {
  value: string
  onChange: (value: string) => void
}

export function EditorPane({ value, onChange }: EditorPaneProps) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const target = e.currentTarget
      const start = target.selectionStart
      const end = target.selectionEnd
      const newValue = value.substring(0, start) + '  ' + value.substring(end)
      onChange(newValue)
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 2
      })
    }
  }

  return (
    <div className="flex-1 overflow-hidden min-h-0">
      <textarea
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="h-full w-full resize-none bg-transparent p-4 font-mono text-sm leading-relaxed focus:outline-none placeholder:text-muted-foreground"
        placeholder="Type your Markdown here..."
        spellCheck={false}
        autoComplete="off"
      />
    </div>
  )
}
