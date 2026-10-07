import { useState, type KeyboardEvent, type ReactNode } from 'react'
import { ArrowLeft, Check, Copy } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Complexity, Level, ProblemKind, ProgressStatus, Tier } from '../types'
import { KIND_LABELS, LEVEL_LABELS, STATUS_META, TIER_LABELS } from '../types'

export function BackButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button variant="ghost" size="sm" onClick={onClick}>
      <ArrowLeft className="size-4" />
      {label}
    </Button>
  )
}

export function CodeBlock({ code, className }: { code: string; className?: string }) {
  return (
    <pre
      className={cn(
        'custom-scrollbar overflow-x-auto rounded-lg bg-zinc-950 p-3 font-mono text-[12px] leading-relaxed text-zinc-100',
        className,
      )}
    >
      <code>{code}</code>
    </pre>
  )
}

/** Plain textarea tuned for Go: monospace, Tab inserts a tab instead of moving focus. */
export function CodeEditor({
  value,
  onChange,
  placeholder,
  minRows = 12,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minRows?: number
}) {
  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== 'Tab' || event.shiftKey) return
    event.preventDefault()
    const target = event.currentTarget
    const { selectionStart, selectionEnd } = target
    const next = value.slice(0, selectionStart) + '\t' + value.slice(selectionEnd)
    onChange(next)
    requestAnimationFrame(() => {
      target.selectionStart = target.selectionEnd = selectionStart + 1
    })
  }

  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      rows={minRows}
      spellCheck={false}
      autoCapitalize="off"
      autoCorrect="off"
      className="custom-scrollbar w-full resize-y rounded-lg border border-border bg-zinc-950 p-3 font-mono text-[12px] leading-relaxed text-zinc-100 outline-none [tab-size:4] placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-ring/50"
    />
  )
}

export function StatusEmoji({ status }: { status: ProgressStatus }) {
  return (
    <span title={STATUS_META[status].label} aria-label={STATUS_META[status].label}>
      {STATUS_META[status].emoji}
    </span>
  )
}

export function ProblemBadges({ tier, level, kind }: { tier?: Tier; level: Level; kind: ProblemKind }) {
  return (
    <span className="flex flex-wrap items-center gap-1.5">
      {tier && (
        <Badge variant="secondary" className="rounded-full text-[10px]">
          {TIER_LABELS[tier]}
        </Badge>
      )}
      <Badge variant="outline" className="rounded-full text-[10px]">
        L{level} · {LEVEL_LABELS[level]}
      </Badge>
      <Badge variant="outline" className="rounded-full text-[10px]">
        {KIND_LABELS[kind]}
      </Badge>
    </span>
  )
}

export function ComplexityTable({ complexity }: { complexity: Complexity }) {
  const rows: Array<[string, string | undefined]> = [
    ['Time', complexity.time],
    ['Space', complexity.space],
    ['Best case', complexity.best],
    ['Average case', complexity.average],
    ['Worst case', complexity.worst],
  ]
  return (
    <div className="overflow-hidden rounded-lg border border-border text-sm">
      <table className="w-full">
        <tbody>
          {rows
            .filter(([, value]) => value)
            .map(([label, value]) => (
              <tr key={label} className="border-b border-border last:border-0">
                <td className="w-32 bg-muted/50 px-3 py-1.5 text-xs font-semibold">{label}</td>
                <td className="px-3 py-1.5 font-mono text-xs">{value}</td>
              </tr>
            ))}
        </tbody>
      </table>
      {complexity.notes && (
        <p className="border-t border-border bg-muted/30 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
          {complexity.notes}
        </p>
      )}
    </div>
  )
}

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }
  return (
    <Button variant="outline" size="sm" onClick={copy}>
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {copied ? 'Copied' : label}
    </Button>
  )
}

export function SectionLabel({ icon: Icon, children }: { icon: typeof Check; children: ReactNode }) {
  return (
    <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary">
      <Icon className="size-3.5" />
      {children}
    </p>
  )
}

/** 0–10 score picker. */
export function ScorePicker({ value, onChange }: { value: number | null; onChange: (score: number) => void }) {
  return (
    <div className="flex flex-wrap gap-1">
      {Array.from({ length: 11 }, (_, score) => (
        <button
          key={score}
          type="button"
          onClick={() => onChange(score)}
          className={cn(
            'size-8 rounded-md border text-xs font-semibold transition-colors',
            value === score
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border hover:border-primary/50 hover:bg-muted',
          )}
        >
          {score}
        </button>
      ))}
    </div>
  )
}

/**
 * Minimal rich text: ``` fences become code blocks, blank lines split
 * paragraphs, `backticks` become inline code. Enough for lesson/solution prose.
 */
export function RichText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/```(?:go|text|bash)?\n?/)
  return (
    <div className={cn('space-y-2 text-sm leading-relaxed', className)}>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <CodeBlock key={i} code={part.replace(/\n$/, '')} />
        ) : (
          part
            .split(/\n{2,}/)
            .filter((para) => para.trim())
            .map((para, j) => (
              <p key={`${i}-${j}`} className="whitespace-pre-line">
                <InlineCode text={para.trim()} />
              </p>
            ))
        ),
      )}
    </div>
  )
}

function InlineCode({ text }: { text: string }) {
  const segments = text.split(/(`[^`]+`)/)
  return (
    <>
      {segments.map((segment, i) =>
        segment.startsWith('`') && segment.endsWith('`') && segment.length > 1 ? (
          <code key={i} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]">
            {segment.slice(1, -1)}
          </code>
        ) : (
          <span key={i}>{segment}</span>
        ),
      )}
    </>
  )
}
