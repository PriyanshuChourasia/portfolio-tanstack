import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { EditorContent, useEditor, useEditorState, type Editor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { TextStyle, Color } from '@tiptap/extension-text-style'
import { Image } from '@tiptap/extension-image'
import { Bold, Italic, Underline, Image as ImageIcon, Baseline } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { cn } from '../../lib/utils'
import { COMMON_TEXT_COLORS, DEFAULT_TEXT_COLOR } from '../../lib/format-colors'

/**
 * Font-size mark: extends TextStyle so Color and FontSize share one
 * `<span style="color:...; font-size:...">`. (The open-source TextStyle
 * extension doesn't ship a fontSize attribute by default.)
 */
const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        parseHTML: (el) => el.style.fontSize || null,
        renderHTML: (attrs) => (attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {}),
      },
    }
  },
})

/**
 * Text-formatting palette rendered in the AppShell header. All formatting goes
 * through TipTap commands; active states are derived from editor state.
 */
export function EditorToolbar({ editor }: { editor: Editor | null }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [colorPopoverOpen, setColorPopoverOpen] = useState(false)
  const [colorInputValue, setColorInputValue] = useState(DEFAULT_TEXT_COLOR)
  const [sizeInput, setSizeInput] = useState('16')

  // Re-renders only when one of these selected values changes.
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e
        ? {
            bold: e.isActive('bold'),
            italic: e.isActive('italic'),
            underline: e.isActive('underline'),
            color: e.getAttributes('textStyle').color as string | undefined,
            fontSize: e.getAttributes('textStyle').fontSize as string | undefined,
          }
        : null,
  })

  // Keep the size input in sync with the selection's active font size
  // (16 px = prose base) as the caret moves around.
  const activePx = state?.fontSize ? Number.parseFloat(state.fontSize) : NaN
  useEffect(() => {
    setSizeInput(Number.isFinite(activePx) ? String(Math.round(activePx)) : '16')
  }, [activePx])

  /** Same color → remove; different color → replace. */
  const toggleTextColor = (hex: string) => {
    if (!editor) return
    if (editor.isActive('textStyle', { color: hex })) {
      editor.chain().focus().unsetColor().run()
    } else {
      editor.chain().focus().setColor(hex).run()
    }
  }

  /** Set (or clear with null) the font size on the selection — same textStyle mark Color writes to. */
  const applyFontSize = (size: string | null) => {
    if (!editor) return
    editor.chain().focus().setMark('textStyle', { fontSize: size }).run()
  }

  const commitFontSize = () => {
    const trimmed = sizeInput.trim()
    if (trimmed === '') {
      applyFontSize(null)
      return
    }
    const n = Number(trimmed)
    if (!Number.isFinite(n)) return
    applyFontSize(`${Math.min(96, Math.max(8, Math.round(n)))}px`)
  }

  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        editor
          ?.chain()
          .focus()
          .setImage({ src: reader.result, alt: file.name.replace(/\.[^./]+$/, '') })
          .run()
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <>
      <div className="flex items-center gap-1 mr-1 shrink-0" title="Font size (px)">
        <input
          type="number"
          min={8}
          max={96}
          step={1}
          value={sizeInput}
          aria-label="Font size (px)"
          onChange={(e) => setSizeInput(e.target.value)}
          onBlur={commitFontSize}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              ;(e.target as HTMLInputElement).blur()
            }
          }}
          className="h-9 w-16 rounded-md border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <span className="text-xs text-muted-foreground select-none">px</span>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        title="Bold"
        aria-pressed={state?.bold ?? false}
        className={cn(state?.bold && 'bg-accent text-accent-foreground')}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor?.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        title="Italic"
        aria-pressed={state?.italic ?? false}
        className={cn(state?.italic && 'bg-accent text-accent-foreground')}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor?.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        title="Underline"
        aria-pressed={state?.underline ?? false}
        className={cn(state?.underline && 'bg-accent text-accent-foreground')}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor?.chain().focus().toggleUnderline().run()}
      >
        <Underline className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-1 px-1 relative shrink-0" title="Text color">
        <Baseline className="h-4 w-4 text-muted-foreground" />
        <button
          type="button"
          title="Text color"
          onMouseDown={(e) => {
            e.preventDefault()
            setColorInputValue(state?.color ?? DEFAULT_TEXT_COLOR)
            setColorPopoverOpen(!colorPopoverOpen)
          }}
          className="h-5 w-5 rounded border border-border cursor-pointer hover:scale-110 transition-transform bg-transparent flex items-center justify-center"
          style={{ color: '#333' }}
        >
          <Baseline className="h-3 w-3" />
        </button>
        {colorPopoverOpen && (
          <div className="absolute top-full left-0 z-20 flex flex-col gap-1 rounded-md border border-border bg-card p-2 shadow-lg">
            <input
              type="color"
              value={colorInputValue}
              onChange={(e) => {
                // Live update while dragging the picker; each change runs the command.
                setColorInputValue(e.target.value)
                editor?.chain().focus().setColor(e.target.value).run()
              }}
              className="h-8 w-16 cursor-pointer rounded border border-input bg-background p-1"
            />
            <div className="flex flex-wrap gap-1">
              {COMMON_TEXT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  title={c}
                  onMouseDown={(e) => { e.preventDefault(); toggleTextColor(c) }}
                  className="h-5 w-5 rounded border border-border cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        title="Insert image"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon className="h-4 w-4" />
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageFileChange}
      />
    </>
  )
}

interface EditorPaneProps {
  value: string
  onChange: (value: string) => void
  /** Reports the editor instance up so the header toolbar can bind to it. */
  onEditorReady?: (editor: Editor | null) => void
}

export function EditorPane({ value, onChange, onEditorReady }: EditorPaneProps) {
  const editor = useEditor({
    extensions: [
      // Heading stays in the schema so legacy <h1>–<h6> from converted .md
      // pages keep rendering — it's just no longer exposed in the toolbar.
      StarterKit.configure({
        link: { openOnClick: false },
      }),
      FontSize,
      Color,
      Image.configure({ inline: false }),
    ],
    content: value || { type: 'paragraph' },
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML())
    },
  })

  useEffect(() => {
    onEditorReady?.(editor ?? null)
    return () => onEditorReady?.(null)
  }, [editor, onEditorReady])

  return (
    <EditorContent
      editor={editor}
      className="flex-1 overflow-y-auto custom-scrollbar min-h-0 prose prose-sm dark:prose-invert max-w-none"
    />
  )
}
