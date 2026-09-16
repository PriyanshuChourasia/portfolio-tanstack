import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronRight, MessageCircleQuestion } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { interviewGroups } from '@/data/interview-data'

const ease = [0.25, 0.46, 0.45, 0.94] as const

export function InterviewPage() {
  const [activeGroupId, setActiveGroupId] = useState(interviewGroups[0]?.id)
  const [activeSubtopicId, setActiveSubtopicId] = useState<string | null>(null)
  const activeGroup = interviewGroups.find((g) => g.id === activeGroupId)
  const activeSubtopic = activeGroup?.subtopics?.find(
    (s) => s.id === activeSubtopicId,
  )

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-xl dark:bg-background/90">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back
          </Link>
          <div className="h-4 w-px bg-border/60" />
          <div className="flex items-center gap-1.5">
            <MessageCircleQuestion className="size-4 text-primary" />
            <span className="text-sm font-bold tracking-tight">Interview Questions</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <Badge variant="secondary" className="mb-4 rounded-full px-3 py-1 text-xs">
            Prep
          </Badge>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Interview Questions
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Curated questions and answers grouped by topic to help you prepare.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-10">
          {/* Topic list */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease }}
            className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-x-visible lg:pb-0"
          >
            {interviewGroups.map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => {
                  setActiveGroupId(group.id)
                  setActiveSubtopicId(null)
                }}
                className={`snap-start shrink-0 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all lg:shrink ${
                  activeGroupId === group.id
                    ? 'border-primary/30 bg-primary/5 text-foreground shadow-sm'
                    : 'border-transparent text-muted-foreground hover:border-border/60 hover:bg-muted/30 hover:text-foreground'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span>{group.topic}</span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                    {group.questions.length}
                  </span>
                </div>
              </button>
            ))}
          </motion.div>

          {/* Questions */}
          <motion.div
            key={`${activeGroup?.id}-${activeSubtopic?.id ?? 'root'}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
            className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm sm:p-6"
          >
            {activeSubtopic ? (
              <>
                <button
                  type="button"
                  onClick={() => setActiveSubtopicId(null)}
                  className="mb-3 flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="size-3.5" />
                  {activeGroup?.topic}
                </button>
                <h2 className="mb-2 text-xl font-bold">{activeSubtopic.topic}</h2>

                {activeSubtopic.questions.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {activeSubtopic.questions.map((q) => (
                      <AccordionItem key={q.id} value={q.id}>
                        <AccordionTrigger>{q.question}</AccordionTrigger>
                        <AccordionContent className="whitespace-pre-line text-muted-foreground">
                          {q.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    Questions for this topic are coming soon.
                  </p>
                )}
              </>
            ) : (
              <>
                <h2 className="mb-2 text-xl font-bold">{activeGroup?.topic}</h2>

                {activeGroup && activeGroup.questions.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {activeGroup.questions.map((q) => (
                      <AccordionItem key={q.id} value={q.id}>
                        <AccordionTrigger>{q.question}</AccordionTrigger>
                        <AccordionContent className="whitespace-pre-line text-muted-foreground">
                          {q.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    Questions for this topic are coming soon.
                  </p>
                )}

                {activeGroup?.subtopics && activeGroup.subtopics.length > 0 && (
                  <div className="mt-6 border-t border-border/40 pt-6">
                    <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
                      Related topics
                    </h3>
                    <div className="flex flex-col gap-2">
                      {activeGroup.subtopics.map((sub) => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => setActiveSubtopicId(sub.id)}
                          className="flex items-center justify-between gap-3 rounded-xl border border-transparent px-4 py-3 text-left text-sm font-medium text-foreground/80 transition-all hover:border-border/60 hover:bg-muted/30"
                        >
                          <span>{sub.topic}</span>
                          <span className="flex items-center gap-2 text-muted-foreground">
                            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold">
                              {sub.questions.length}
                            </span>
                            <ChevronRight className="size-4" />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  )
}
