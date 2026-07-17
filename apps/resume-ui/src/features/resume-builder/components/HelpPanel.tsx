import { HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface HelpSection {
  title: string
  body: Array<string>
}

const HELP_SECTIONS: Array<HelpSection> = [
  {
    title: 'Sections & reordering',
    body: [
      'Every part of your resume — Summary, Experience, Skills, Projects, Awards, and so on — is its own section in the left sidebar. Click a section\'s header to expand it and fill in its fields.',
      'Grab the grip icon (⠿) on the left of a section row and drag it up or down to change where that section appears on the resume. The preview on the right updates instantly to match.',
    ],
  },
  {
    title: 'Page setup',
    body: [
      'Long resumes flow across pages automatically — a section is never split awkwardly in the middle.',
      'If a section lands somewhere that doesn\'t look right, click the "start new page" icon on its row (next to the item count) to force that section onto a fresh page. Click it again to undo. This is independent of section order, so you can fine-tune page breaks without changing what comes before or after.',
    ],
  },
  {
    title: 'Templates & styling',
    body: [
      'Use the template picker in the header to switch the resume\'s visual design at any time — your content carries over.',
      'Open Settings (gear icon) to adjust fonts, font sizes, line height, margins, paper size, orientation, and accent colors.',
    ],
  },
  {
    title: 'Import & export',
    body: [
      'Import pulls text from an existing resume (PDF or image) and fills in matching sections automatically — review the results afterward.',
      'Export to PDF or Word from the header, or use Print for a browser print dialog. All three use the exact section order and page breaks you see in the preview.',
    ],
  },
  {
    title: 'Multiple resumes & history',
    body: [
      'The resume name dropdown next to the template picker lets you create, rename, switch between, or delete separate resumes — handy for tailoring a version per job application.',
      'Undo/redo (top right) step back and forward through your edits, including reordering and page-break changes.',
    ],
  },
]

export function HelpPanel() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" size="icon-sm" title="Help">
          <HelpCircle className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>How to use the Resume Builder</DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] space-y-5 overflow-y-auto pr-1">
          {HELP_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="mb-1.5 text-sm font-semibold text-foreground">
                {section.title}
              </h3>
              <div className="space-y-1.5">
                {section.body.map((paragraph, i) => (
                  <p key={i} className="text-sm leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
