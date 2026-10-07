import { useState } from 'react'
import {
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Code2,
  Eye,
  Lightbulb,
  ListChecks,
  Rocket,
  Send,
  Sigma,
  Star,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { getProblem } from '../data'
import { isAttempted, solutionUnlocked } from '../engine/progress'
import { buildReviewPrompt } from '../engine/sessions'
import { useGoDsaStore } from '../store'
import type { ProblemKind } from '../types'
import { REVIEW_CHECKS } from '../types'
import {
  CodeBlock,
  CodeEditor,
  ComplexityTable,
  CopyButton,
  ProblemBadges,
  RichText,
  ScorePicker,
  SectionLabel,
} from './shared'

const APPROACH_LABEL: Record<ProblemKind, { title: string; placeholder: string }> = {
  concept: { title: 'Your answer', placeholder: 'Explain it in your own words…' },
  predict: { title: 'Your prediction — what prints, and WHY?', placeholder: 'Output:\n…\n\nWhy:\n…' },
  debug: { title: 'Your diagnosis — what is wrong, and why?', placeholder: 'The bug is… because…' },
  code: { title: 'Your approach', placeholder: 'Brute force first, then improve. Data structures? Complexity?' },
  design: { title: 'Your design', placeholder: 'Components, data structures, concurrency model, failure modes…' },
}

const HAS_EDITOR = new Set<ProblemKind>(['code', 'design', 'debug'])

/**
 * The §48 loop for one problem: problem → approach → code → review → hint →
 * second attempt → solution → optimisation → advanced variation.
 * `hideContext` hides tier/topic labels (revision rounds must not reveal the concept).
 */
export function ProblemWorkspace({ problemId, hideContext = false }: { problemId: string; hideContext?: boolean }) {
  const entry = getProblem(problemId)
  const attempt = useGoDsaStore((state) => state.data.attempts[problemId])
  const editAttempt = useGoDsaStore((state) => state.editAttempt)
  const submitAttempt = useGoDsaStore((state) => state.submitAttempt)
  const selectOption = useGoDsaStore((state) => state.selectOption)
  const revealHint = useGoDsaStore((state) => state.revealHint)
  const revealSolution = useGoDsaStore((state) => state.revealSolution)
  const toggleReview = useGoDsaStore((state) => state.toggleReview)
  const setScore = useGoDsaStore((state) => state.setScore)
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (!entry) return <p className="text-sm text-muted-foreground">Problem not found.</p>
  const { problem, topic } = entry

  const attempts = attempt?.attempts ?? 0
  const hintsRevealed = attempt?.hintsRevealed ?? 0
  const approach = attempt?.approach ?? ''
  // Starter code is shown until the learner types their own.
  const code = attempt?.code || (problem.kind === 'code' || problem.kind === 'design' ? (problem.code ?? '') : '')
  const unlocked = solutionUnlocked(problem, attempt)
  const showSolution = !!attempt?.solutionRevealed || (!!problem.check && attempt?.selectedOption != null)
  const context = topic ? topic.title : 'Production mode'
  const canSubmit = approach.trim().length > 0 || (attempt?.code ?? '').trim().length > 0

  return (
    <div className="space-y-4">
      {/* Problem */}
      <Card>
        <CardContent className="space-y-3 p-5">
          <ProblemBadges tier={hideContext ? undefined : problem.tier} level={problem.level} kind={problem.kind} />
          <h1 className="text-xl font-black tracking-tight sm:text-2xl">{problem.title}</h1>
          {problem.story && (
            <p className="rounded-lg border-l-4 border-primary/60 bg-primary/5 p-3 text-sm italic leading-relaxed">
              {problem.story}
            </p>
          )}
          <RichText text={problem.prompt} />
          {problem.code && (problem.kind === 'predict' || problem.kind === 'debug' || problem.kind === 'concept') && (
            <CodeBlock code={problem.code} />
          )}
          {problem.requirements && (
            <div>
              <p className="text-xs font-bold">Requirements</p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {problem.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Auto-graded choice */}
      {problem.check && (
        <Card>
          <CardContent className="space-y-2 p-5">
            <SectionLabel icon={ListChecks}>Choose your answer</SectionLabel>
            {problem.check.options.map((option, index) => {
              const selected = attempt?.selectedOption === index
              const locked = attempt?.selectedOption != null
              const correct = index === problem.check!.answerIndex
              return (
                <button
                  key={index}
                  type="button"
                  disabled={locked}
                  onClick={() => selectOption(problem.id, index)}
                  className={cn(
                    'flex w-full items-start gap-2 rounded-lg border p-3 text-left text-sm transition-colors',
                    !locked && 'hover:border-primary/50 hover:bg-muted/50',
                    locked && correct && 'border-emerald-500/50 bg-emerald-500/10',
                    locked && selected && !correct && 'border-rose-500/50 bg-rose-500/10',
                  )}
                >
                  <span className="font-mono text-xs text-muted-foreground">{String.fromCharCode(65 + index)}.</span>
                  <span className="flex-1 whitespace-pre-wrap font-mono text-[13px]">{option}</span>
                  {locked && correct && <CheckCircle2 className="size-4 text-emerald-600" />}
                  {locked && selected && !correct && <XCircle className="size-4 text-rose-600" />}
                </button>
              )
            })}
            <p className="pt-1 text-xs text-muted-foreground">
              Then write WHY below — the reasoning matters more than the letter.
            </p>
          </CardContent>
        </Card>
      )}

      {/* My approach / code */}
      <Card>
        <CardContent className="space-y-4 p-5">
          <div>
            <SectionLabel icon={BookOpen}>{problem.check ? 'Why?' : APPROACH_LABEL[problem.kind].title}</SectionLabel>
            <textarea
              value={approach}
              onChange={(event) => editAttempt(problem.id, { approach: event.target.value })}
              placeholder={APPROACH_LABEL[problem.kind].placeholder}
              rows={4}
              className="custom-scrollbar mt-2 w-full resize-y rounded-lg border border-border bg-transparent p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            />
          </div>
          {HAS_EDITOR.has(problem.kind) && !problem.check && (
            <div>
              <SectionLabel icon={Code2}>{problem.kind === 'debug' ? 'Your fixed code (optional)' : 'Your code'}</SectionLabel>
              <div className="mt-2">
                <CodeEditor
                  value={code}
                  onChange={(value) => editAttempt(problem.id, { code: value })}
                  placeholder={'package main\n\nfunc main() {\n\t\n}'}
                />
              </div>
            </div>
          )}
          {!problem.check && (
            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={() => submitAttempt(problem.id)} disabled={!canSubmit}>
                <Send className="size-4" />
                {attempts === 0 ? 'Submit attempt' : `Submit attempt #${attempts + 1}`}
              </Button>
              {attempts > 0 && (
                <span className="text-xs text-muted-foreground">
                  {attempts} attempt{attempts === 1 ? '' : 's'} submitted — review it below, then revise and resubmit.
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review */}
      {(attempts > 0 || showSolution) && (
        <Card>
          <CardContent className="space-y-4 p-5">
            <SectionLabel icon={ClipboardList}>Review</SectionLabel>
            {!problem.check && (
              <div className="space-y-1.5">
                {REVIEW_CHECKS.map((check) => (
                  <label key={check.key} className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="size-4 accent-[var(--primary)]"
                      checked={!!attempt?.review[check.key]}
                      onChange={() => toggleReview(problem.id, check.key)}
                    />
                    {check.label}
                  </label>
                ))}
                <p className="pt-1 text-xs text-muted-foreground">
                  Run it for real: <code className="rounded bg-muted px-1">go run .</code>,{' '}
                  <code className="rounded bg-muted px-1">go vet ./...</code>,{' '}
                  <code className="rounded bg-muted px-1">go test -race</code> — or paste into go.dev/play.
                </p>
              </div>
            )}
            <div>
              <p className="flex items-center gap-1.5 text-xs font-bold">
                <Star className="size-3.5 text-primary" /> Score (0–10)
                {problem.check && <span className="font-normal text-muted-foreground">— auto-graded</span>}
                {attempt?.revealedWithoutAttempt && (
                  <span className="font-normal text-amber-600">— solution was taken before attempting; be honest</span>
                )}
              </p>
              <div className="mt-2">
                <ScorePicker value={attempt?.score ?? null} onChange={(score) => setScore(problem.id, score)} />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
              <CopyButton text={buildReviewPrompt(problem, attempt, context)} label="Copy AI review prompt" />
              <span className="text-xs text-muted-foreground">
                Paste into Claude for a full line-by-line review — it is told to hint, not solve.
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hints */}
      {problem.hints.length > 0 && !(problem.check && attempt?.selectedOption != null) && (
        <Card>
          <CardContent className="space-y-2 p-5">
            <SectionLabel icon={Lightbulb}>
              Hints ({hintsRevealed}/{problem.hints.length})
            </SectionLabel>
            {problem.hints.slice(0, hintsRevealed).map((hint, i) => (
              <p key={i} className="rounded-lg bg-amber-500/10 p-3 text-sm leading-relaxed">
                <span className="font-semibold">Hint {i + 1}: </span>
                {hint}
              </p>
            ))}
            {hintsRevealed < problem.hints.length && (
              <Button variant="outline" size="sm" onClick={() => revealHint(problem.id)}>
                {attempts === 0 && !isAttempted(attempt) ? 'I’m stuck — give me a hint' : `Reveal hint ${hintsRevealed + 1}`}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Solution */}
      <Card className={cn(showSolution && 'border-emerald-500/30')}>
        <CardContent className="space-y-4 p-5">
          {!showSolution ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <SectionLabel icon={Eye}>Solution</SectionLabel>
                <p className="mt-1 text-xs text-muted-foreground">
                  {unlocked
                    ? 'Unlocked after reasonable effort. Compare it line by line with yours.'
                    : 'Unlocks after two attempts, or one attempt plus every hint. You can still request it.'}
                </p>
              </div>
              <Button
                variant={unlocked ? 'default' : 'outline'}
                onClick={() => (unlocked ? revealSolution(problem.id) : setConfirmOpen(true))}
              >
                <Eye className="size-4" />
                {unlocked ? 'Show solution' : 'Request solution'}
              </Button>
            </div>
          ) : (
            <>
              <SectionLabel icon={Eye}>Solution</SectionLabel>
              {problem.kind === 'code' || problem.kind === 'design' ? (
                <CodeBlock code={problem.solution} />
              ) : (
                <RichText text={problem.solution} />
              )}
              <div>
                <p className="text-xs font-bold">Why it works</p>
                <RichText text={problem.explanation} className="mt-1 text-muted-foreground" />
              </div>
              {problem.complexity && (
                <div>
                  <SectionLabel icon={Sigma}>Complexity</SectionLabel>
                  <div className="mt-2">
                    <ComplexityTable complexity={problem.complexity} />
                  </div>
                </div>
              )}
              {problem.variation && (
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                  <p className="flex items-center gap-1.5 text-xs font-bold text-primary">
                    <Rocket className="size-3.5" /> Harder variation
                  </p>
                  <RichText text={problem.variation} className="mt-1" />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reveal the solution now?</DialogTitle>
            <DialogDescription>
              {attempts === 0
                ? 'You haven’t submitted an attempt yet. The objective is to make you THINK — try an approach first, even a brute-force one.'
                : 'You have hints left. One more hint may be all you need.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Keep trying
            </Button>
            <Button
              onClick={() => {
                revealSolution(problem.id)
                setConfirmOpen(false)
              }}
            >
              Reveal anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
