import { createFileRoute } from '@tanstack/react-router'
import { JavaExamPage } from '@/features/java-exam/JavaExamPage'

export const Route = createFileRoute('/java-exam')({
  component: JavaExamPage,
  head: () => ({
    meta: [
      { title: 'iPrepare — Java Interview Exams' },
      {
        name: 'description',
        content:
          'Timed Java backend interview exams: fundamentals to system design, auto-graded objective questions, self-graded subjective answers, mastery tracking and revision exams.',
      },
    ],
  }),
})
