import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ClipboardCheck,
  Factory,
  Flag,
  Repeat,
  Timer,
  Trophy,
  XCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { getModule, getProblem, PRODUCTION_PROBLEMS, WEEKLY_CHALLENGES } from '../data'
import { isDone } from '../engine/progress'
import {
  clarificationsFor,
  followUpsFor,
  interviewAverage,
  interviewCandidates,
} from '../engine/sessions'
import { shuffle } from '../engine/random'
import { selectActiveExam, selectActiveRevision, selectCurrentInterview, useGoDsaStore } from '../store'
import { INTERVIEW_STAGES } from '../types'
import { ProblemWorkspace } from './ProblemWorkspace'
import { BackButton, CodeBlock, CodeEditor, ComplexityTable, ProblemBadges, RichText, ScorePicker } from './shared'

/* ── Revision round ────────────────────────────────────────────────────────── */

export function RevisionScreen() {
  const data = useGoDsaStore((state) => state.data)
  const go = useGoDsaStore((state) => state.go)
  const moveRevision = useGoDsaStore((state) => state.moveRevision)
  const finishRevision = useGoDsaStore((state) => state.finishRevision)
  const round = selectActiveRevision(data)

  useEffect(() => {
    window.scrollTo?.({ top: 0 })
  }, [round?.index])

  if (!round) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <BackButton label="Dashboard" onClick={() => go('dashboard')} />
        <p className="mt-6 text-sm text-muted-foreground">No revision round in progress.</p>
      </div>
    )
  }

  const problemId = round.problemIds[round.index]
  const done = round.problemIds.filter((id) => isDone(data.attempts[id])).length

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-12">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <BackButton label="Dashboard" onClick={() => go('dashboard')} />
        <Badge variant="secondary" className="gap-1.5 rounded-full">
          <Repeat className="size-3.5" /> Revision {round.number} · {round.index + 1}/{round.problemIds.length} · {done}{' '}
          scored
        </Badge>
      </div>
      <div className="mb-4 flex gap-1">
        {round.problemIds.map((id, i) => (
          <span
            key={id}
            className={cn(
              'h-1.5 flex-1 rounded-full',
              i === round.index ? 'bg-primary' : isDone(data.attempts[id]) ? 'bg-emerald-500' : 'bg-muted',
            )}
          />
        ))}
      </div>
      <ProblemWorkspace key={problemId} problemId={problemId} hideContext />
      <div className="mt-6 flex items-center justify-between">
        <Button variant="outline" size="sm" disabled={round.index === 0} onClick={() => moveRevision(-1)}>
          <ArrowLeft className="size-4" /> Previous
        </Button>
        {round.index < round.problemIds.length - 1 ? (
          <Button size="sm" onClick={() => moveRevision(1)}>
            Next <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button size="sm" onClick={finishRevision}>
            <Flag className="size-4" /> Finish revision
          </Button>
        )}
      </div>
    </div>
  )
}

/* ── Exam mode ─────────────────────────────────────────────────────────────── */

function useCountdown(startedAt: string, durationSec: number) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])
  return Math.max(0, Math.round(durationSec - (now - Date.parse(startedAt)) / 1000))
}

export function ExamScreen() {
  const data = useGoDsaStore((state) => state.data)
  const go = useGoDsaStore((state) => state.go)
  const answerExam = useGoDsaStore((state) => state.answerExam)
  const moveExam = useGoDsaStore((state) => state.moveExam)
  const submitExam = useGoDsaStore((state) => state.submitExam)
  const exam = selectActiveExam(data)
  const remaining = useCountdown(exam?.startedAt ?? new Date().toISOString(), exam?.durationSec ?? 0)

  useEffect(() => {
    if (exam && remaining === 0) submitExam()
  }, [exam, remaining, submitExam])

  if (!exam) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <BackButton label="Dashboard" onClick={() => go('dashboard')} />
      </div>
    )
  }

  const problem = getProblem(exam.problemIds[exam.index])?.problem
  const answered = exam.problemIds.filter((id) => exam.answers[id] != null).length
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="flex items-center gap-2 text-xl font-black tracking-tight">
          <ClipboardCheck className="size-5 text-primary" /> EXAM MODE
        </h1>
        <div className="flex items-center gap-2">
          <Badge variant={remaining < 120 ? 'destructive' : 'secondary'} className="gap-1 rounded-full font-mono">
            <Timer className="size-3.5" /> {mm}:{ss}
          </Badge>
          <Badge variant="outline" className="rounded-full">
            {answered}/{exam.problemIds.length} answered
          </Badge>
        </div>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">No hints. Go syntax, concepts, debugging, output prediction, DSA, complexity and concurrency.</p>

      <div className="mt-4 flex flex-wrap gap-1">
        {exam.problemIds.map((id, i) => (
          <button
            key={id}
            type="button"
            onClick={() => moveExam(i)}
            className={cn(
              'size-7 rounded-md border text-[11px] font-semibold',
              i === exam.index
                ? 'border-primary bg-primary text-primary-foreground'
                : exam.answers[id] != null
                  ? 'border-emerald-500/50 bg-emerald-500/10'
                  : 'border-border',
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {problem?.check && (
        <Card className="mt-4">
          <CardContent className="space-y-3 p-5">
            <ProblemBadges level={problem.level} kind={problem.kind} />
            <p className="text-sm font-bold">
              Q{exam.index + 1}. {problem.title}
            </p>
            <RichText text={problem.prompt} />
            {problem.code && <CodeBlock code={problem.code} />}
            <div className="space-y-2">
              {problem.check.options.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => answerExam(problem.id, index)}
                  className={cn(
                    'flex w-full items-start gap-2 rounded-lg border p-3 text-left text-sm',
                    exam.answers[problem.id] === index ? 'border-primary bg-primary/10' : 'hover:bg-muted/50',
                  )}
                >
                  <span className="font-mono text-xs text-muted-foreground">{String.fromCharCode(65 + index)}.</span>
                  <span className="whitespace-pre-wrap font-mono text-[13px]">{option}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-6 flex items-center justify-between">
        <Button variant="outline" size="sm" disabled={exam.index === 0} onClick={() => moveExam(exam.index - 1)}>
          <ArrowLeft className="size-4" /> Previous
        </Button>
        <div className="flex gap-2">
          {exam.index < exam.problemIds.length - 1 && (
            <Button variant="outline" size="sm" onClick={() => moveExam(exam.index + 1)}>
              Next <ArrowRight className="size-4" />
            </Button>
          )}
          <Button size="sm" onClick={submitExam}>
            <Flag className="size-4" /> Submit exam
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ExamResultScreen() {
  const data = useGoDsaStore((state) => state.data)
  const viewedExamId = useGoDsaStore((state) => state.viewedExamId)
  const go = useGoDsaStore((state) => state.go)
  const startExam = useGoDsaStore((state) => state.startExam)
  const exam = data.exams.find((item) => item.id === viewedExamId)
  if (!exam) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <BackButton label="Dashboard" onClick={() => go('dashboard')} />
      </div>
    )
  }

  // Per-module breakdown to surface weak areas.
  const byModule = new Map<string, { title: string; correct: number; total: number }>()
  for (const id of exam.problemIds) {
    const entry = getProblem(id)
    if (!entry?.module || !entry.problem.check) continue
    const key = entry.module.id
    const bucket = byModule.get(key) ?? { title: entry.module.shortTitle, correct: 0, total: 0 }
    bucket.total++
    if (exam.answers[id] === entry.problem.check.answerIndex) bucket.correct++
    byModule.set(key, bucket)
  }
  const weak = [...byModule.values()].filter((bucket) => bucket.correct < bucket.total)

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-12">
      <BackButton label="Dashboard" onClick={() => go('dashboard')} />
      <Card className="mt-3">
        <CardContent className="p-6 text-center">
          <Trophy className="mx-auto size-8 text-primary" />
          <p className="mt-2 text-4xl font-black tabular-nums">{exam.percentage}%</p>
          <p className="text-sm text-muted-foreground">
            {exam.correctCount} of {exam.problemIds.length} correct · score {Math.round(exam.percentage / 10)}/10
          </p>
          {weak.length > 0 && (
            <p className="mt-3 text-xs text-muted-foreground">
              Revise: {weak.map((bucket) => `${bucket.title} (${bucket.correct}/${bucket.total})`).join(' · ')}
            </p>
          )}
          <Button className="mt-4" onClick={startExam}>
            New exam
          </Button>
        </CardContent>
      </Card>

      <div className="mt-6 space-y-3">
        {exam.problemIds.map((id, i) => {
          const problem = getProblem(id)?.problem
          if (!problem?.check) return null
          const selected = exam.answers[id]
          const correct = selected === problem.check.answerIndex
          return (
            <details key={id} className="rounded-xl border border-border bg-card">
              <summary className="flex cursor-pointer list-none items-center gap-2 p-4 text-sm font-medium">
                {correct ? (
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                ) : (
                  <XCircle className="size-4 shrink-0 text-rose-600" />
                )}
                Q{i + 1}. {problem.title}
              </summary>
              <div className="space-y-2 border-t border-border p-4 text-sm">
                {problem.code && <CodeBlock code={problem.code} />}
                <p>
                  Your answer:{' '}
                  <span className="font-mono">{selected != null ? problem.check.options[selected] : '— (skipped)'}</span>
                </p>
                <p>
                  Correct: <span className="font-mono">{problem.check.options[problem.check.answerIndex]}</span>
                </p>
                <RichText text={problem.explanation} className="text-muted-foreground" />
              </div>
            </details>
          )
        })}
      </div>
    </div>
  )
}

/* ── Interview mode ────────────────────────────────────────────────────────── */

export function InterviewScreen() {
  const data = useGoDsaStore((state) => state.data)
  const go = useGoDsaStore((state) => state.go)
  const beginInterview = useGoDsaStore((state) => state.beginInterview)
  const setResponse = useGoDsaStore((state) => state.setInterviewResponse)
  const scoreStage = useGoDsaStore((state) => state.scoreInterviewStage)
  const moveStage = useGoDsaStore((state) => state.moveInterviewStage)
  const finishInterview = useGoDsaStore((state) => state.finishInterview)
  const abandonInterview = useGoDsaStore((state) => state.abandonInterview)
  const [track, setTrack] = useState<'go' | 'dsa' | 'all'>('dsa')
  const session = selectCurrentInterview(data)
  const live = session && session.completedAt === null
  const candidates = useMemo(() => interviewCandidates(track), [track])

  function pickRandom() {
    const fresh = candidates.filter((entry) => !data.interviews.some((s) => s.problemId === entry.problem.id))
    const pool = fresh.length > 0 ? fresh : candidates
    const pick = shuffle(pool)[0]
    if (pick) beginInterview(pick.problem.id)
  }

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <BackButton label="Dashboard" onClick={() => go('dashboard')} />
      <h1 className="flex items-center gap-2 text-xl font-black tracking-tight">
        <Briefcase className="size-5 text-primary" /> INTERVIEW MODE
      </h1>
    </div>
  )

  if (!session || (!live && session.stageIndex < INTERVIEW_STAGES.length)) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-12">
        {header}
        <Card className="mt-6">
          <CardContent className="space-y-4 p-6">
            <p className="text-sm text-muted-foreground">
              I behave like an interviewer: you get a problem with no teaching. Clarify requirements, explain your
              approach, state complexity and edge cases, code it, then face optimisation probes. Feedback at the end.
            </p>
            <div className="flex flex-wrap gap-2">
              {(['dsa', 'go', 'all'] as const).map((value) => (
                <Button key={value} size="sm" variant={track === value ? 'default' : 'outline'} onClick={() => setTrack(value)}>
                  {value === 'dsa' ? 'DSA' : value === 'go' ? 'Go' : 'Mixed'}
                </Button>
              ))}
            </div>
            <Button onClick={pickRandom} disabled={candidates.length === 0}>
              Start interview ({candidates.length} problems in pool)
            </Button>
          </CardContent>
        </Card>
        <InterviewHistory />
      </div>
    )
  }

  const entry = getProblem(session.problemId)
  if (!entry) return null
  const { problem } = entry
  const stage = INTERVIEW_STAGES[session.stageIndex]
  const finished = session.stageIndex >= INTERVIEW_STAGES.length

  if (finished) {
    const avg = interviewAverage(session)
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-12">
        {header}
        <Card className="mt-6">
          <CardContent className="space-y-4 p-6">
            <p className="text-sm font-bold">Feedback — {problem.title}</p>
            <p className="text-3xl font-black tabular-nums">{avg ?? '–'}/10</p>
            <div className="space-y-1 text-sm">
              {INTERVIEW_STAGES.map((item) => (
                <div key={item.key} className="flex justify-between border-b border-border py-1">
                  <span>{item.label}</span>
                  <span className="tabular-nums">{session.scores[item.key] ?? '–'}/10</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {lowestStageAdvice(session.scores)}
            </p>
            <p className="text-xs font-bold">Reference solution</p>
            <CodeBlock code={problem.solution} />
            {problem.complexity && <ComplexityTable complexity={problem.complexity} />}
            <div className="flex gap-2">
              <Button onClick={pickRandom}>Next interview</Button>
              {live && <Button variant="outline" onClick={finishInterview}>Save</Button>}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const interviewerNotes: Record<string, string[]> = {
    clarify: clarificationsFor(problem),
    approach: problem.hints.slice(0, 1).map((hint) => `A strong approach usually starts from: ${hint}`),
    complexity: problem.complexity
      ? [`Expected: time ${problem.complexity.time}, space ${problem.complexity.space}.`]
      : ['Interviewer expects tight bounds with justification.'],
    edgeCases: ['Empty input', 'Single element', 'All duplicates', 'Very large input / overflow', 'Negative values or nil'],
    code: ['Compare against the reference after scoring. Did it compile in your head? Clear names? Errors handled?'],
    optimize: followUpsFor(problem),
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-12">
      {header}
      <div className="mt-4 flex gap-1">
        {INTERVIEW_STAGES.map((item, i) => (
          <span key={item.key} className={cn('h-1.5 flex-1 rounded-full', i <= session.stageIndex ? 'bg-primary' : 'bg-muted')} />
        ))}
      </div>

      <Card className="mt-4">
        <CardContent className="space-y-3 p-5">
          <ProblemBadges level={problem.level} kind={problem.kind} />
          <p className="text-lg font-black">{problem.title}</p>
          {problem.story && <p className="text-sm italic text-muted-foreground">{problem.story}</p>}
          <RichText text={problem.prompt} />
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="space-y-3 p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">
            Stage {session.stageIndex + 1}/{INTERVIEW_STAGES.length} — {stage.label}
          </p>
          <p className="text-sm">{stage.prompt}</p>
          {stage.key === 'optimize' && (
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {interviewerNotes.optimize.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          )}
          {stage.key === 'code' ? (
            <CodeEditor
              value={session.responses.code ?? problem.code ?? ''}
              onChange={(value) => setResponse('code', value)}
            />
          ) : (
            <textarea
              value={session.responses[stage.key] ?? ''}
              onChange={(event) => setResponse(stage.key, event.target.value)}
              rows={6}
              className="w-full rounded-lg border border-border bg-transparent p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            />
          )}

          {(session.responses[stage.key] ?? '').trim().length > 0 && stage.key !== 'optimize' && (
            <details className="rounded-lg border border-border p-3 text-sm">
              <summary className="cursor-pointer font-semibold">Interviewer notes (open after answering)</summary>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                {interviewerNotes[stage.key].map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </details>
          )}

          <div>
            <p className="text-xs font-bold">Self-score this stage</p>
            <div className="mt-1.5">
              <ScorePicker value={session.scores[stage.key] ?? null} onChange={(score) => scoreStage(stage.key, score)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={session.stageIndex === 0} onClick={() => moveStage(-1)}>
            <ArrowLeft className="size-4" /> Back
          </Button>
          <Button variant="ghost" size="sm" onClick={abandonInterview}>
            Abandon
          </Button>
        </div>
        {session.stageIndex < INTERVIEW_STAGES.length - 1 ? (
          <Button size="sm" onClick={() => moveStage(1)}>
            Next stage <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button size="sm" onClick={finishInterview}>
            <Flag className="size-4" /> Finish & get feedback
          </Button>
        )}
      </div>
    </div>
  )
}

function lowestStageAdvice(scores: Partial<Record<string, number>>): string {
  const entries = INTERVIEW_STAGES.map((stage) => [stage.label, scores[stage.key]] as const).filter(
    (pair): pair is readonly [(typeof INTERVIEW_STAGES)[number]['label'], number] => typeof pair[1] === 'number',
  )
  if (entries.length === 0) return 'Score each stage to get targeted feedback.'
  const [label, score] = entries.reduce((low, cur) => (cur[1] < low[1] ? cur : low))
  if (score >= 8) return 'Strong round across the board. Move up a level or try a Production problem.'
  return `Weakest stage: ${label} (${score}/10). Practise that stage explicitly in your next interview.`
}

function InterviewHistory() {
  const interviews = useGoDsaStore((state) => state.data.interviews).filter((s) => s.completedAt)
  if (interviews.length === 0) return null
  return (
    <section className="mt-6">
      <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Past interviews</h2>
      <div className="mt-2 space-y-2">
        {interviews.slice(0, 15).map((session) => (
          <div key={session.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
            <span>{getProblem(session.problemId)?.problem.title ?? session.problemId}</span>
            <span className="tabular-nums text-muted-foreground">{interviewAverage(session) ?? '–'}/10</span>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── Production mode ───────────────────────────────────────────────────────── */

export function ProductionScreen() {
  const data = useGoDsaStore((state) => state.data)
  const go = useGoDsaStore((state) => state.go)
  const openProblem = useGoDsaStore((state) => state.openProblem)
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-12">
      <BackButton label="Dashboard" onClick={() => go('dashboard')} />
      <h1 className="mt-2 flex items-center gap-2 text-2xl font-black tracking-tight">
        <Factory className="size-6 text-primary" /> PRODUCTION MODE
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Real backend engineering problems, implemented in idiomatic Go. Same loop: design → code → review → hints →
        reference implementation.
      </p>
      <div className="mt-6 space-y-2">
        {PRODUCTION_PROBLEMS.map((problem, i) => {
          const attempt = data.attempts[problem.id]
          return (
            <button
              key={problem.id}
              type="button"
              onClick={() => openProblem(problem.id, 'production')}
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 text-left hover:border-primary/40"
            >
              <span className="min-w-0">
                <span className="text-[11px] font-semibold text-muted-foreground">P{i + 1}</span>
                <span className="block text-sm font-bold">{problem.title}</span>
                <span className="mt-1 block">
                  <ProblemBadges level={problem.level} kind={problem.kind} />
                </span>
              </span>
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                {isDone(attempt) ? `${attempt!.score}/10 ✓` : attempt?.attempts ? 'In progress' : ''}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ── Weekly challenges ─────────────────────────────────────────────────────── */

export function ChallengesScreen() {
  const data = useGoDsaStore((state) => state.data)
  const go = useGoDsaStore((state) => state.go)
  const toggle = useGoDsaStore((state) => state.toggleMilestone)
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-12">
      <BackButton label="Dashboard" onClick={() => go('dashboard')} />
      <h1 className="mt-2 flex items-center gap-2 text-2xl font-black tracking-tight">
        <Trophy className="size-6 text-primary" /> Weekly challenges
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        A larger project after each major section. Tick milestones as you finish them; build it in your own repo.
      </p>
      <div className="mt-6 space-y-4">
        {WEEKLY_CHALLENGES.map((challenge) => {
          const done = data.challenges[challenge.id] ?? []
          const module = getModule(challenge.afterModuleId)
          return (
            <Card key={challenge.id}>
              <CardContent className="space-y-3 p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      After module {module?.number} · {module?.shortTitle}
                    </p>
                    <p className="text-base font-black">{challenge.title}</p>
                  </div>
                  <Badge variant={done.length === challenge.milestones.length ? 'default' : 'outline'} className="rounded-full">
                    {done.length}/{challenge.milestones.length}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{challenge.brief}</p>
                <div className="space-y-1.5">
                  {challenge.milestones.map((milestone, i) => (
                    <label key={i} className="flex cursor-pointer items-start gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="mt-0.5 size-4"
                        checked={done.includes(i)}
                        onChange={() => toggle(challenge.id, i)}
                      />
                      <span className={cn(done.includes(i) && 'text-muted-foreground line-through')}>{milestone}</span>
                    </label>
                  ))}
                </div>
                {challenge.stretch.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Stretch: </span>
                    {challenge.stretch.join(' · ')}
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
