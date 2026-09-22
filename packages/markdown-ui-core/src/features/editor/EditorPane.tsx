import { useRef, useState, type ChangeEvent } from 'react'
import { EditorContent, useEditor, type Editor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { TextStyle, Color } from '@tiptap/extension-text-style'
import { Highlight } from '@tiptap/extension-highlight'
import { Image } from '@tiptap/extension-image'
import { Bold, Italic, Underline, Highlighter, Image as ImageIcon, Baseline } from 'lucide-react'
import { Button } from '../../components/ui/button'
import {
  HIGHLIGHT_SWATCHES,
  COMMON_TEXT_COLORS,
  DEFAULT_TEXT_COLOR,
  type HighlightSwatch,
} from '../../lib/format-colors'

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6] as const
type HeadingLevel = (typeof HEADING_LEVELS)[number]

function getActiveHeadingLevel(editor: Editor): HeadingLevel | 0 {
  for (const level of HEADING_LEVELS) {
    if (editor.isActive('heading', { level })) return level
  }
  return 0
}

interface EditorPaneProps {
  value: string
  onChange: (value: string) => void
}

export function EditorPane({ value, onChange }: EditorPaneProps) {
  const [headingLevel, setHeadingLevel] = useState<HeadingLevel | 0>(0)
  const [colorPopoverOpen, setColorPopoverOpen] = useState(false)
  const [colorInputValue, setColorInputValue] = useState(DEFAULT_TEXT_COLOR)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [...HEADING_LEVELS] },
        link: { openOnClick: false },
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Image.configure({ inline: false }),
    ],
    content: value || { type: 'paragraph' },
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML())
    },
    onSelectionUpdate: ({ editor: e }) => {
      setHeadingLevel(getActiveHeadingLevel(e))
    },
  })

  /** Same color → remove highlight; different color → replace it. */
  const toggleHighlightColor = (color: string) => {
    if (!editor) return
    if (editor.isActive('highlight', { color })) {
      editor.chain().focus().unsetHighlight().run()
    } else {
      editor.chain().focus().setHighlight({ color }).run()
    }
  }

  /** Same color → remove; different color → replace. */
  const toggleTextColor = (hex: string) => {
    if (!editor) return
    if (editor.isActive('textStyle', { color: hex })) {
      editor.chain().focus().unsetColor().run()
    } else {
      editor.chain().focus().setColor(hex).run()
    }
  }

  const applyHeading = (level: HeadingLevel | 0) => {
    if (!editor) return
    if (level === 0) editor.chain().focus().setParagraph().run()
    else editor.chain().focus().toggleHeading({ level }).run()
    setHeadingLevel(level)
  }

  const insertImageDataUrl = (dataUrl: string, alt: string) => {
    editor?.chain().focus().setImage({ src: dataUrl, alt }).run()
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

  const toolbar = (
    <>
      <select
        value={headingLevel}
        onChange={(e) => applyHeading(Number(e.target.value) as HeadingLevel | 0)}
        title="Text size"
        className="h-9 rounded-md border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer mr-1 shrink-0"
      >
        <option value={0}>Normal text</option>
        {HEADING_LEVELS.map((level) => (
          <option key={level} value={level}>
            Heading {level}
          </option>
        ))}
      </select>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        title="Bold"
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
        disabled={!editor?.isActive('underline')}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor?.chain().focus().toggleUnderline().run()}
      >
        <Underline className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-1 px-1 shrink-0" title="Highlight color">
        <Highlighter className="h-4 w-4 text-muted-foreground" />
        {HIGHLIGHT_SWATCHES.map((swatch: HighlightSwatch) => (
          <button
            key={swatch.name}
            type="button"
            title={`Highlight: ${swatch.name}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => toggleHighlightColor(swatch.value)}
            className="h-5 w-5 rounded-full border border-border cursor-pointer hover:scale-110 transition-transform shrink-0"
            style={{ backgroundColor: swatch.value }}
          />
        ))}
      </div>

      <div className="flex items-center gap-1 px-1 relative shrink-0" title="Text color">
        <Baseline className="h-4 w-4 text-muted-foreground" />
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault()
            const current = editor?.getAttributes('textStyle').color as string | undefined
            setColorInputValue(current ?? DEFAULT_TEXT_COLOR)
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
        size="title" // wrong prop value on purpose
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

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0">
      <EditorContent
        editor={editor}
        className="flex-1 overflow-y-auto custom-scrollbar min-h-0 prose prose-sm dark:prose-invert max-w-none"
      />
      {/* Toolbar rendered into the AppShell header via a portal so the palette
          lives in the page header as required. */}
      {createPortal(toolbar, toolbarContainer)}
    </div>
  )
}
