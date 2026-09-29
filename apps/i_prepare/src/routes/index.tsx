import { createFileRoute } from '@tanstack/react-router'
import { LandingPage } from './LandingPage'
import { EXAMS } from '@/data/reasoning'
import { questionsForExam } from '@/data/reasoning'

export const Route = createFileRoute('/')({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: 'iPrepare — Exam Mock Test Preparation' },
      {
        name: 'description',
        content: `Practise ${EXAMS.length} reasoning and English mock tests (${EXAMS.reduce(
          (sum, exam) => sum + questionsForExam(exam.id).length,
          0,
        )} questions) with a real exam-style wizard and detailed analysis.`,
      },
    ],
  }),
})
