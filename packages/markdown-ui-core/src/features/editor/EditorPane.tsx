import { useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react'
import { Bold, Italic, Highlighter, Image } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { HIGHLIGHT_COLORS, type HighlightColor } from '../../lib/remark-highlight'

const NOTE_PREFIX = '%%note:'
const NOTE_SUFFIX = '%%'
const NOTES_ENABLED = false

interface EditorPaneProps {
  value: string
  onChange: (value: string) => void
}

const MAX_HEADING_LEVEL = 6

// Mirrors the mark.hl-* colors in styles.css, so the swatch shows what you'll actually get.
const HIGHLIGHT_SWATCHES: Record<HighlightColor, string> = {
  yellow: '#fde68a',
  green: '#bbf7d0',
  blue: '#bfdbfe',
  pink: '#fbcfe8',
  orange: '#fed7aa',
  purple: '#e9d5ff',
}

const HIGHLIGHT_BEFORE_RE = new RegExp(`==(${HIGHLIGHT_COLORS.join('|')}):$`)
const HIGHLIGHT_BEFORE_MAX_LEN = Math.max(...HIGHLIGHT_COLORS.map((c) => c.length)) + 3 // "==" + color + ":"

/** If the selection is already wrapped in `==color:...==`, return that wrapper's bounds and color. */
function findHighlightWrap(
  value: string,
  selectionStart: number,
  selectionEnd: number,
): { wrapStart: number; wrapEnd: number; color: HighlightColor } | null {
  const lookback = value.slice(Math.max(0, selectionStart - HIGHLIGHT_BEFORE_MAX_LEN), selectionStart)
  const beforeMatch = lookback.match(HIGHLIGHT_BEFORE_RE)
  if (!beforeMatch || value.slice(selectionEnd, selectionEnd + 2) !== '==') return null
  return {
    wrapStart: selectionStart - (lookback.length - beforeMatch.index!),
    wrapEnd: selectionEnd + 2,
    color: beforeMatch[1] as HighlightColor,
  }
}

function getLineBounds(value: string, pos: number): { lineStart: number; lineEnd: number } {
  const lineStart = value.lastIndexOf('\n', pos - 1) + 1
  const nextBreak = value.indexOf('\n', pos)
  return { lineStart, lineEnd: nextBreak === -1 ? value.length : nextBreak }
}

/** If the selection is already wrapped in `%%note:<encoded>%%...%%`, return wrapper bounds and decoded note text. */
function findNoteWrap(
  value: string,
  selectionStart: number,
  selectionEnd: number,
): { wrapStart: number; wrapEnd: number; noteText: string } | null {
  const searchStart = Math.max(0, selectionStart - 500)
  const beforeSelection = value.slice(searchStart, selectionStart)
  const noteIdx = beforeSelection.lastIndexOf(NOTE_PREFIX)
  if (noteIdx === -1) return null
  const prefixPos = searchStart + noteIdx
  const encodedEnd = value.indexOf(NOTE_SUFFIX, prefixPos + NOTE_PREFIX.length)
  if (encodedEnd === -1) return null
  if (selectionStart !== encodedEnd + NOTE_SUFFIX.length) return null
  const encodedNote = value.slice(prefixPos + NOTE_PREFIX.length, encodedEnd)
  const closingEnd = value.indexOf(NOTE_SUFFIX, selectionEnd)
  if (closingEnd === -1 || closingEnd !== selectionEnd) return null
  return {
    wrapStart: prefixPos,
    wrapEnd: closingEnd + NOTE_SUFFIX.length,
    noteText: decodeURIComponent(encodedNote),
  }
}

function detectHeadingLevel(value: string, pos: number): number {
  const { lineStart, lineEnd } = getLineBounds(value, pos)
  const match = value.slice(lineStart, lineEnd).match(/^(#{1,6})\s/)
  return match ? match[1].length : 0
}

export function EditorPane({ value, onChange }: EditorPaneProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [headingLevel, setHeadingLevel] = useState(0)
  const [notePopover, setNotePopover] = useState<{
    visible: boolean
    existingNoteText: string | null
  }>({ visible: false, existingNoteText: null })
  const [noteInputText, setNoteInputText] = useState('')

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
    setHeadingLevel(detectHeadingLevel(e.target.value, e.target.selectionStart))
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

  const wrapSelection = (before: string, after: string = before) => {
    const ta = textareaRef.current
    if (!ta) return
    const { selectionStart, selectionEnd } = ta
    const selected = value.slice(selectionStart, selectionEnd)

    // Toggle off: the markers sit just outside the selection (typical case — you selected
    // the inner word, not the ** themselves).
    const outerBefore = value.slice(selectionStart - before.length, selectionStart)
    const outerAfter = value.slice(selectionEnd, selectionEnd + after.length)
    if (before && outerBefore === before && outerAfter === after) {
      const newValue =
        value.slice(0, selectionStart - before.length) + selected + value.slice(selectionEnd + after.length)
      onChange(newValue)
      requestAnimationFrame(() => {
        ta.focus()
        ta.selectionStart = selectionStart - before.length
        ta.selectionEnd = selectionEnd - before.length
      })
      return
    }

    // Toggle off: the markers are included inside the selection itself.
    if (before && selected.length >= before.length + after.length && selected.startsWith(before) && selected.endsWith(after)) {
      const inner = selected.slice(before.length, selected.length - after.length)
      const newValue = value.slice(0, selectionStart) + inner + value.slice(selectionEnd)
      onChange(newValue)
      requestAnimationFrame(() => {
        ta.focus()
        ta.selectionStart = selectionStart
        ta.selectionEnd = selectionStart + inner.length
      })
      return
    }

    // Otherwise, wrap.
    const hasSelection = selectionStart !== selectionEnd
    const newValue = value.slice(0, selectionStart) + before + selected + after + value.slice(selectionEnd)
    onChange(newValue)
    requestAnimationFrame(() => {
      ta.focus()
      if (hasSelection) {
        // Re-select the wrapped text so a follow-up click (e.g. trying another color) toggles it off,
        // or a different-color click re-wraps this same real text instead of a placeholder.
        ta.selectionStart = selectionStart + before.length
        ta.selectionEnd = selectionStart + before.length + selected.length
      } else {
        // Nothing was selected — drop the cursor between the markers instead of inventing
        // placeholder text, so it can't get wrapped again by the next button click.
        ta.selectionStart = ta.selectionEnd = selectionStart + before.length
      }
    })
  }

  const applyHighlight = (color: HighlightColor) => {
    const ta = textareaRef.current
    if (!ta) return
    const { selectionStart, selectionEnd } = ta
    const existing = findHighlightWrap(value, selectionStart, selectionEnd)
    if (!existing) {
      wrapSelection(`==${color}:`, '==')
      return
    }

    const selected = value.slice(selectionStart, selectionEnd)
    if (existing.color === color) {
      // Same color clicked again on already-highlighted text: remove the highlight entirely.
      const newValue = value.slice(0, existing.wrapStart) + selected + value.slice(existing.wrapEnd)
      onChange(newValue)
      requestAnimationFrame(() => {
        ta.focus()
        ta.selectionStart = existing.wrapStart
        ta.selectionEnd = existing.wrapStart + selected.length
      })
      return
    }

    // Different color: replace the wrapper instead of nesting a new one around the old.
    const before = `==${color}:`
    const after = '=='
    const newValue = value.slice(0, existing.wrapStart) + before + selected + after + value.slice(existing.wrapEnd)
    onChange(newValue)
    requestAnimationFrame(() => {
      ta.focus()
      ta.selectionStart = existing.wrapStart + before.length
      ta.selectionEnd = existing.wrapStart + before.length + selected.length
    })
  }

  const applyHeading = (level: number) => {
    const ta = textareaRef.current
    if (!ta) return
    const { lineStart, lineEnd } = getLineBounds(value, ta.selectionStart)
    const stripped = value.slice(lineStart, lineEnd).replace(/^#{1,6}\s*/, '')
    const newLine = level === 0 ? stripped : `${'#'.repeat(level)} ${stripped}`
    const newValue = value.slice(0, lineStart) + newLine + value.slice(lineEnd)
    onChange(newValue)
    setHeadingLevel(level)
    requestAnimationFrame(() => {
      ta.focus()
      ta.selectionStart = ta.selectionEnd = lineStart + newLine.length
    })
  }

    const applyNote = (noteText: string) => {
    const ta = textareaRef.current
    if (!ta) return
    const { selectionStart, selectionEnd } = ta
    const existing = findNoteWrap(value, selectionStart, selectionEnd)
    const selected = value.slice(selectionStart, selectionEnd)

    if (existing) {
      if (!noteText.trim()) {
        const newValue = value.slice(0, existing.wrapStart) + selected + value.slice(existing.wrapEnd)
        onChange(newValue)
        requestAnimationFrame(() => {
          ta.focus()
          ta.selectionStart = existing.wrapStart
          ta.selectionEnd = existing.wrapStart + selected.length
        })
        setNotePopover({ visible: false, existingNoteText: null })
        return
      }
      const encoded = encodeURIComponent(noteText)
      const before = `%%note:${encoded}%%`
      const newValue = value.slice(0, existing.wrapStart) + before + selected + NOTE_SUFFIX + value.slice(existing.wrapEnd)
      onChange(newValue)
      requestAnimationFrame(() => {
        ta.focus()
        ta.selectionStart = existing.wrapStart + before.length
        ta.selectionEnd = existing.wrapStart + before.length + selected.length
      })
      setNotePopover({ visible: false, existingNoteText: null })
      return
    }

    if (!noteText.trim()) return
    const encoded = encodeURIComponent(noteText)
    const before = `%%note:${encoded}%%`
    const newValue = value.slice(0, selectionStart) + before + selected + NOTE_SUFFIX + value.slice(selectionEnd)
    onChange(newValue)
    requestAnimationFrame(() => {
      ta.focus()
      ta.selectionStart = selectionStart + before.length
      ta.selectionEnd = selectionStart + before.length + selected.length
    })
    setNotePopover({ visible: false, existingNoteText: null })
  }

  const handleSelectionChange = () => {
    if (!NOTES_ENABLED) return
    const ta = textareaRef.current
    if (!ta) return
    const selected = value.slice(ta.selectionStart, ta.selectionEnd)
    if (ta.selectionStart === ta.selectionEnd || !selected) {
      setNotePopover({ visible: false, existingNoteText: null })
      return
    }
    const existing = findNoteWrap(value, ta.selectionStart, ta.selectionEnd)
    setNotePopover({
      visible: true,
      existingNoteText: existing ? existing.noteText : null,
    })
    if (existing) {
      setNoteInputText(existing.noteText)
    } else {
      setNoteInputText('')
    }
  }

  const handleNoteConfirm = () => {
    applyNote(noteInputText)
  }

  const handleNoteRemove = () => {
    applyNote('')
  }

  const insertImageDataUrl = (dataUrl: string, alt: string) => {
    const ta = textareaRef.current
    const pos = ta ? ta.selectionStart : value.length
    const snippet = `![${alt}](${dataUrl})`
    const newValue = value.slice(0, pos) + snippet + value.slice(pos)
    onChange(newValue)
    requestAnimationFrame(() => {
      if (!ta) return
      ta.focus()
      ta.selectionStart = ta.selectionEnd = pos + snippet.length
    })
  }

  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        insertImageDataUrl(reader.result, file.name.replace(/\.[^./]+$/, ''))
      }
    }
    reader.readAsDataURL(file)
  }

  const formatButtons = [
    { icon: Bold, title: 'Bold', onClick: () => wrapSelection('**') },
    { icon: Italic, title: 'Italic', onClick: () => wrapSelection('*') },
  ]
  const insertButtons = [
    { icon: Image, title: 'Insert image', onClick: () => fileInputRef.current?.click() },
  ]

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0 relative">
      <div className="flex items-center gap-1 border-b border-border px-2 py-1 shrink-0">
        <select
          value={headingLevel}
          onChange={(e) => applyHeading(Number(e.target.value))}
          title="Text size"
          className="h-9 rounded-md border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer mr-1"
        >
          <option value={0}>Normal text</option>
          {Array.from({ length: MAX_HEADING_LEVEL }, (_, i) => i + 1).map((level) => (
            <option key={level} value={level}>
              Heading {level}
            </option>
          ))}
        </select>
        {formatButtons.map(({ icon: Icon, title, onClick }) => (
          <Button
            key={title}
            type="button"
            variant="ghost"
            size="icon"
            title={title}
            onMouseDown={(e) => e.preventDefault()}
            onClick={onClick}
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}
        <div className="flex items-center gap-1 px-1" title="Highlight color">
          <Highlighter className="h-4 w-4 text-muted-foreground" />
          {HIGHLIGHT_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              title={`Highlight: ${color}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyHighlight(color)}
              className="h-5 w-5 rounded-full border border-border cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: HIGHLIGHT_SWATCHES[color] }}
            />
          ))}
        </div>
        {insertButtons.map(({ icon: Icon, title, onClick }) => (
          <Button
            key={title}
            type="button"
            variant="ghost"
            size="icon"
            title={title}
            onMouseDown={(e) => e.preventDefault()}
            onClick={onClick}
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageFileChange}
        />
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onSelect={handleSelectionChange}
        onClick={handleSelectionChange}
        onKeyUp={handleSelectionChange}
        onMouseUp={handleSelectionChange}
        className="flex-1 resize-none bg-transparent p-4 font-mono text-sm leading-relaxed focus:outline-none placeholder:text-muted-foreground"
        placeholder="Type your Markdown here..."
        spellCheck={false}
        autoComplete="off"
      />
      {NOTES_ENABLED && notePopover.visible && (
        <div
          className="absolute top-2 right-2 z-10 flex flex-col gap-1 rounded-md border border-border bg-card p-2 shadow-lg"
        >
          <span className="text-xs text-muted-foreground">
            {notePopover.existingNoteText !== null ? 'Edit note' : 'Add note'}
          </span>
          <input
            type="text"
            value={noteInputText}
            onChange={(e) => setNoteInputText(e.target.value)}
            placeholder="Enter note text..."
            className="h-7 rounded border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring w-48"
            onKeyDown={(e) => { if (e.key === 'Enter') handleNoteConfirm() }}
            autoFocus
          />
          <div className="flex gap-1 justify-end">
            {notePopover.existingNoteText !== null && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-destructive"
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleNoteRemove}
              >
                Remove
              </Button>
            )}
            <Button
              type="button"
              variant="default"
              size="sm"
              className="h-6 text-xs"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleNoteConfirm}
            >
              Confirm
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
