import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  LayoutGrid,
  Award,
  Globe,
  Trophy,
  Heart,
  BookOpen,
  Users,
  Star,
  Puzzle,
  GripVertical,
} from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { useResumeStore } from '../store'
import { SECTION_LABELS, type SectionId } from '../types'
import { PersonalInfoForm } from './sections/PersonalInfoForm'
import { SummaryForm } from './sections/SummaryForm'
import { ExperienceForm } from './sections/ExperienceForm'
import { EducationForm } from './sections/EducationForm'
import { SkillsForm } from './sections/SkillsForm'
import { ProjectsForm } from './sections/ProjectsForm'
import { CertificationsForm } from './sections/CertificationsForm'
import { LanguagesForm } from './sections/LanguagesForm'
import { AwardsForm } from './sections/AwardsForm'
import { VolunteerForm } from './sections/VolunteerForm'
import { PublicationsForm } from './sections/PublicationsForm'
import { ReferencesForm } from './sections/ReferencesForm'
import { InterestsForm } from './sections/InterestsForm'
import { CustomSectionsForm } from './sections/CustomSectionsForm'

interface BuilderSidebarProps {
  templateId: string
}

interface SectionMeta {
  id: SectionId
  icon: typeof User
  color: string
  defaultOpen?: boolean
}

const SECTION_META: SectionMeta[] = [
  { id: 'personal', icon: User, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', defaultOpen: true },
  { id: 'summary', icon: FileText, color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' },
  { id: 'experience', icon: Briefcase, color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', defaultOpen: true },
  { id: 'education', icon: GraduationCap, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  { id: 'skills', icon: Wrench, color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' },
  { id: 'projects', icon: LayoutGrid, color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400' },
  { id: 'certifications', icon: Award, color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
  { id: 'languages', icon: Globe, color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400' },
  { id: 'awards', icon: Trophy, color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' },
  { id: 'volunteer', icon: Heart, color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
  { id: 'publications', icon: BookOpen, color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
  { id: 'references', icon: Users, color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400' },
  { id: 'interests', icon: Star, color: 'bg-lime-500/10 text-lime-600 dark:text-lime-400' },
  { id: 'custom', icon: Puzzle, color: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400' },
]

export function BuilderSidebar({ templateId }: BuilderSidebarProps) {
  const [search, setSearch] = useState('')

  const data = useResumeStore((s) => s.history.present)
  const updatePersonalInfo = useResumeStore((s) => s.updatePersonalInfo)
  const updateSummary = useResumeStore((s) => s.updateSummary)
  const experience = useResumeStore((s) => s.experience)
  const education = useResumeStore((s) => s.education)
  const skills = useResumeStore((s) => s.skills)
  const projects = useResumeStore((s) => s.projects)
  const certifications = useResumeStore((s) => s.certifications)
  const languages = useResumeStore((s) => s.languages)
  const awards = useResumeStore((s) => s.awards)
  const volunteer = useResumeStore((s) => s.volunteer)
  const publications = useResumeStore((s) => s.publications)
  const references = useResumeStore((s) => s.references)
  const interests = useResumeStore((s) => s.interests)
  const customSections = useResumeStore((s) => s.customSections)

  // Wrap list fields so items are read from present (triggers re-render)
  const listFields = useMemo(() => ({
    experience: { ...experience, get items() { return data.experience } },
    education: { ...education, get items() { return data.education } },
    skills: { ...skills, get items() { return data.skills } },
    projects: { ...projects, get items() { return data.projects } },
    certifications: { ...certifications, get items() { return data.certifications } },
    languages: { ...languages, get items() { return data.languages } },
    awards: { ...awards, get items() { return data.awards } },
    volunteer: { ...volunteer, get items() { return data.volunteer } },
    publications: { ...publications, get items() { return data.publications } },
    references: { ...references, get items() { return data.references } },
    interests: { ...interests, get items() { return data.interests } },
    customSections: { ...customSections, get items() { return data.customSections } },
  }), [data, experience, education, skills, projects, certifications, languages, awards, volunteer, publications, references, interests, customSections])

  const sectionCounts: Record<SectionId, number> = useMemo(
    () => ({
      personal: data.personalInfo.fullName.trim() ? 1 : 0,
      summary: data.summary.trim() ? 1 : 0,
      experience: data.experience.length,
      education: data.education.length,
      skills: data.skills.length,
      projects: data.projects.length,
      certifications: data.certifications.length,
      languages: data.languages.length,
      awards: data.awards.length,
      volunteer: data.volunteer.length,
      publications: data.publications.length,
      references: data.references.length,
      interests: data.interests.length,
      custom: data.customSections.length,
    }),
    [data],
  )

  const filteredSections = useMemo(() => {
    if (!search.trim()) return SECTION_META
    const q = search.toLowerCase()
    return SECTION_META.filter((s) => SECTION_LABELS[s.id].toLowerCase().includes(q))
  }, [search])

  const defaultOpenValues = useMemo(
    () => SECTION_META.filter((s) => s.defaultOpen).map((s) => s.id),
    [],
  )

  const sectionFormMap: Record<SectionId, React.ReactNode> = {
    personal: (
      <PersonalInfoForm value={data.personalInfo} onChange={updatePersonalInfo} />
    ),
    summary: <SummaryForm value={data.summary} onChange={updateSummary} />,
    experience: <ExperienceForm {...listFields.experience} />,
    education: <EducationForm {...listFields.education} />,
    skills: <SkillsForm {...listFields.skills} />,
    projects: <ProjectsForm {...listFields.projects} />,
    certifications: <CertificationsForm {...listFields.certifications} />,
    languages: <LanguagesForm {...listFields.languages} />,
    awards: <AwardsForm {...listFields.awards} />,
    volunteer: <VolunteerForm {...listFields.volunteer} />,
    publications: <PublicationsForm {...listFields.publications} />,
    references: <ReferencesForm {...listFields.references} />,
    interests: <InterestsForm {...listFields.interests} />,
    custom: <CustomSectionsForm {...listFields.customSections} />,
  }

  return (
    <motion.aside
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex w-full flex-col bg-background md:w-[45%] lg:w-[420px] md:border-r print:hidden"
    >
      {/* Search */}
      <div className="border-b px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/50" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sections..."
            className="h-8 pl-8 text-xs"
          />
        </div>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="space-y-0.5 p-3 pb-4 sm:p-4 sm:pb-4">
          <Accordion
            type="multiple"
            defaultValue={defaultOpenValues}
            className="space-y-1"
          >
            {filteredSections.map((meta) => {
              const Icon = meta.icon
              const count = sectionCounts[meta.id]

              return (
                <motion.div
                  key={meta.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <AccordionItem
                    value={meta.id}
                    className="overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md"
                  >
                    <AccordionTrigger className="group px-3 py-2.5 hover:no-underline sm:px-4 sm:py-3 [&[data-state=open]>svg]:rotate-180">
                      <span className="flex items-center gap-2 sm:gap-2.5">
                        <GripVertical className="size-3.5 shrink-0 text-muted-foreground/30" />
                        <span
                          className={`flex size-5 shrink-0 items-center justify-center rounded-md sm:size-6 ${meta.color}`}
                        >
                          <Icon className="size-3 sm:size-3.5" />
                        </span>
                        <span className="text-sm font-medium">
                          {SECTION_LABELS[meta.id]}
                        </span>
                        {count > 0 && (
                          <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary sm:px-2">
                            {count}
                          </span>
                        )}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="border-t px-3 pb-3 pt-2 sm:px-4 sm:pb-4 sm:pt-3">
                      {sectionFormMap[meta.id]}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              )
            })}
          </Accordion>

          {filteredSections.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <Search className="size-8 text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground/60">
                No sections matching "{search}"
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  )
}
