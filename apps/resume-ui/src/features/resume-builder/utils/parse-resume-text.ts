import { createId } from '../constants'
import type { ResumeData } from '../types'

const INDIAN_STATES = [
  'andhra pradesh', 'arunachal pradesh', 'assam', 'bihar', 'chhattisgarh',
  'goa', 'gujarat', 'haryana', 'himachal pradesh', 'jharkhand', 'karnataka',
  'kerala', 'madhya pradesh', 'maharashtra', 'manipur', 'meghalaya',
  'mizoram', 'nagaland', 'odisha', 'punjab', 'rajasthan', 'sikkim',
  'tamil nadu', 'telangana', 'tripura', 'uttar pradesh', 'uttarakhand',
  'west bengal', 'delhi', 'chandigarh',
]

/* ──────────────────────────────────────────────────────────────
 * Helpers
 * ────────────────────────────────────────────────────────────── */

/** Normalise common PDF text-extraction artifacts. */
function normalizeText(raw: string): string {
  let s = raw
  // Fix hyphenated line breaks e.g. "develop-↵ment" → "development"
  s = s.replace(/[a-z]{2,}-\n([a-z]{2,})/gi, '$1')
  // Collapse 3+ consecutive newlines into 2 (preserve paragraph breaks)
  s = s.replace(/\n{3,}/g, '\n\n')
  // Trim whitespace per line
  s = s
    .split('\n')
    .map((l) => l.trim())
    .join('\n')
  // Remove isolated single characters on their own line (PDF artifacts)
  s = s.replace(/^\s*[a-zA-Z0-9]\s*\n/gm, '')
  return s.trim()
}

/** Try to extract a date range from any text block. */
function extractDateRange(block: string): { startDate: string; endDate: string } {
  // "Jan 2020 — Present", "September 2020 – Jun 2024"
  let m = block.match(
    /([A-Z][a-z]+(?:\.)?\s+\d{4})\s*[-–—to]+\s*([A-Z][a-z]+(?:\.)?\s+\d{4}|Present|Current)/i,
  )
  if (m) return { startDate: m[1].trim(), endDate: m[2].trim() }

  // "01/2020 – 05/2023" or "01/2020 – Present"
  m = block.match(
    /(\d{1,2}\/\d{4})\s*[-–—]+\s*(\d{1,2}\/\d{4}|Present|Current)/,
  )
  if (m) return { startDate: m[1].trim(), endDate: m[2].trim() }

  // "2020 – 2023" or "2020 – Present" (year-only range)
  m = block.match(
    /(\d{4})\s*[-–—]+\s*(\d{4}|Present|Current)/,
  )
  if (m) return { startDate: m[1].trim(), endDate: m[2].trim() }

  // Single date: "May 2024" or "05/2024"
  m = block.match(/([A-Z][a-z]+(?:\.)?\s+\d{4})/)
  if (m) return { startDate: m[1].trim(), endDate: '' }

  m = block.match(/(\d{1,2}\/\d{4})/)
  if (m) return { startDate: m[1].trim(), endDate: '' }

  return { startDate: '', endDate: '' }
}

/**
 * Find section boundaries in the raw text.
 *
 * First pass: try the strict pattern (header on its own line followed by
 * content on the next line).  Second pass: fall back to a looser match
 * where the header can be inline.
 */
function findSections(text: string): Array<{ name: string; start: number }> {
  const patterns: Array<{ regex: RegExp; label: string }> = [
    { regex: /\b(professional\s*summary|summary|profile|about\s*me|objective)\b/i, label: 'summary' },
    { regex: /\b(work\s*experience|professional\s*experience|experience|employment|work\s*history)\b/i, label: 'experience' },
    { regex: /\b(education|academic|qualifications|academic\s*background)\b/i, label: 'education' },
    { regex: /\b(technical\s*skills|skills|core\s*competencies|expertise|technologies|tech\s*stack)\b/i, label: 'skills' },
    { regex: /\b(projects|personal\s*projects|key\s*projects|professional\s*projects)\b/i, label: 'projects' },
    { regex: /\b(certifications|certificates|certification|licenses|licences)\b/i, label: 'certifications' },
    { regex: /\b(languages|language)\b/i, label: 'languages' },
  ]

  const sections: Array<{ name: string; start: number }> = []

  for (const { regex } of patterns) {
    // Strict: header followed by a newline (content starts on next line)
    const strict = text.match(
      new RegExp(`(?:^|\\n)\\s*${regex.source}\\s*\\n`, 'im'),
    )
    if (strict && strict.index !== undefined) {
      sections.push({
        name: strict[0].trim(),
        start: strict.index + strict[0].length,
      })
      continue
    }

    // Loose: header is present anywhere (fallback)
    // Loose: header at the start of a line (fallback)
    const loose = text.match(
      new RegExp(`(?:^|\\n)\\s*${regex.source}`, 'im'),
    )
    if (loose && loose.index !== undefined) {
      sections.push({
        name: loose[0].trim(),
        start: loose.index + loose[0].length,
      })
    }
  }

  sections.sort((a, b) => a.start - b.start)

  // Deduplicate — if two sections start within 5 characters, keep the first
  return sections.filter(
    (s, i) => i === 0 || s.start - sections[i - 1].start > 5,
  )
}

function getSectionContent(
  sectionName: string,
  sections: Array<{ name: string; start: number }>,
  text: string,
): string | undefined {
  const idx = sections.findIndex((s) =>
    s.name.toLowerCase().includes(sectionName.toLowerCase()),
  )
  if (idx === -1) return undefined
  const start = sections[idx].start
  const end =
    idx + 1 < sections.length
      ? sections[idx + 1].start
      : text.length
  return text.slice(start, end).trim()
}

/* ════════════════════════════════════════════════════════════════
 * Main parser
 * ════════════════════════════════════════════════════════════════ */

export function parseResumeText(rawText: string): Partial<ResumeData> {
  const text = normalizeText(rawText)
  const result: Partial<ResumeData> = {}

  const lines = text.split('\n').filter(Boolean)

  /* ── Personal Info ─────────────────────────────────────────── */
  // Name: first non-empty, non-date, non-URL line
  let name = ''
  for (const line of lines) {
    const trimmed = line.trim()
    if (
      trimmed &&
      !trimmed.match(/^https?:\/\//) &&
      !trimmed.match(/^\+?\d[\d\s\-().]{6,}/) &&
      !trimmed.match(/^[A-Z][a-z]+ \d{4}/) && // not a date like "January 2024"
      !trimmed.match(/^[^a-zA-Z]/)
    ) {
      name = trimmed
      break
    }
  }

  result.personalInfo = {
    fullName: name || (lines[0] ?? ''),
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    photoUrl: '',
  }

  // Email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
  if (emailMatch) result.personalInfo.email = emailMatch[0]

  // Phone
  const phoneMatch = text.match(
    /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
  )
  if (phoneMatch) result.personalInfo.phone = phoneMatch[0]

  // LinkedIn
  const linkedinMatch = text.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i)
  if (linkedinMatch) result.personalInfo.linkedin = linkedinMatch[0]

  // Website / Portfolio (exclude linkedin URLs)
  const urlMatches = text.match(
    /https?:\/\/(?!linkedin\.com)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[^\s]*/g,
  )
  if (urlMatches) result.personalInfo.website = urlMatches[0]

  // Location — look for "City, State" or "City, Country" patterns in first 20 lines
  const locationMatch = text.match(
    /([A-Z][a-z]+(?:[\s-][A-Z][a-z]+)*),\s*([A-Z]{2}|[A-Z][a-z]+)/,
  )
  if (locationMatch) result.personalInfo.location = locationMatch[0]

  // Title — look for it among the first few lines after name, short and non-contact
  if (name) {
    const nameIdx = lines.findIndex((l) => l.includes(name))
    const candidateLines = lines.slice(nameIdx + 1, nameIdx + 6).filter(
      (l) =>
        !l.includes('@') &&
        !l.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/) &&
        !l.includes('linkedin') &&
        !l.match(/https?:\/\//) &&
        !l.match(/^\+?[\d\s\-().]+$/) &&
        l.length < 120,
    )
    if (candidateLines.length > 0) {
      result.personalInfo.title = candidateLines[0]
    }
  }

  /* ── Sections ──────────────────────────────────────────────── */
  const sections = findSections(text)

  /* ── Summary ───────────────────────────────────────────────── */
  const summaryText =
    getSectionContent('summary', sections, text) ??
    getSectionContent('profile', sections, text) ??
    getSectionContent('objective', sections, text)
  if (summaryText) {
    result.summary = summaryText.replace(/\n{3,}/g, '\n\n').trim()
  }

  /* ── Skills ────────────────────────────────────────────────── */
  const skillsText = getSectionContent('skills', sections, text)
  if (skillsText) {
    const skillLines = skillsText
      .split('\n')
      .map((l) => l.replace(/^[•\-*\d+.]\s*/, '').trim())
      .filter(Boolean)

    const categoryPattern = /^([A-Za-z/+#\s]+?)[:\-]\s*(.+)$/
    const categorized: Array<{ label: string; values: string[] }> = []
    let currentCategory: { label: string; values: string[] } | null = null

    for (const line of skillLines) {
      const catMatch = line.match(categoryPattern)
      if (catMatch) {
        if (currentCategory) categorized.push(currentCategory)
        currentCategory = {
          label: catMatch[1].trim(),
          values: catMatch[2].split(/[,;|/]\s*/).filter(Boolean),
        }
      } else if (currentCategory) {
        currentCategory.values.push(
          ...line.split(/[,;|/]\s*/).filter(Boolean),
        )
      } else {
        if (!currentCategory) {
          currentCategory = { label: 'Skills', values: [] }
        }
        currentCategory.values.push(
          ...line.split(/[,;|/]\s*/).filter(Boolean),
        )
      }
    }
    if (currentCategory) categorized.push(currentCategory)

    if (categorized.length > 0) {
      result.skills = categorized.map((cat) => ({
        id: createId(),
        label: cat.label,
        value: cat.values.join(', '),
      }))
    } else {
      const allSkills = skillLines.flatMap((l) =>
        l.split(/[,;|/]\s*/).filter(Boolean),
      )
      if (allSkills.length > 0) {
        result.skills = [{ id: createId(), label: 'Skills', value: allSkills.join(', ') }]
      }
    }
  }

  /* ── Experience ────────────────────────────────────────────── */
  const expText = getSectionContent('experience', sections, text)
  if (expText) {
    const blocks = expText.split(/\n{2,}/).filter(Boolean)
    result.experience = blocks
      .map((block) => {
        const expLines = block.split('\n').map((l) => l.trim()).filter(Boolean)
        if (expLines.length === 0) return null

        // Try "Role at Company" on one line
        const roleLine = expLines[0]
        const roleAtMatch = roleLine.match(
          /^(.+?)\s+(?:at|@|,|\|)\s+(.+)$/,
        )
        let role: string
        let company: string

        if (roleAtMatch) {
          role = roleAtMatch[1].trim()
          company = roleAtMatch[2].trim()
        } else if (expLines.length >= 2) {
          // Try multiline: line 1 = role, line 2 = company
          const second = expLines[1]
          // Check if second line looks like a company (not a date, not a bullet)
          if (
            second &&
            !second.match(/^\d/) &&
            !second.match(/^[•\-*\d+.]/) &&
            !second.match(/present|current/i) &&
            second.length < 100
          ) {
            role = roleLine
            company = second
          } else {
            role = roleLine
            company = ''
          }
        } else {
          role = roleLine
          company = ''
        }

        const { startDate, endDate } = extractDateRange(block)

        // Location: any "City, ST" pattern within the block
        const locMatches = [...block.matchAll(
          /([A-Z][a-z]+(?:[\s-][A-Z][a-z]+)*),\s*([A-Z]{2})/g,
        )]
        const location =
          locMatches
            .map((m) => m[0])
            .filter(
              (loc) =>
                !company.toLowerCase().includes(loc.toLowerCase().split(',')[0].trim().toLowerCase()),
            )
            .pop() ?? ''

        // Build date-line regex so we can skip the date line from bullets
        const dateParts = [startDate, endDate].filter(Boolean)
        // Determine which lines are NOT bullets (header lines, date lines, company/role)
        const skipLines = new Set<string>()
        skipLines.add(roleLine.toLowerCase())
        if (company) skipLines.add(company.toLowerCase())
        // Also skip the line containing a date-range pattern (dash + year/Present)
        if (dateParts.length > 0) {
          const dateRangePat = new RegExp(
            `${startDate.replace(/\d{4}/g, '\\d{4}') || ''}\\s*[-–—]+\\s*${(endDate || 'Present|Current').replace(/\d{4}/g, '\\d{4}')}`,
            'i',
          )
          for (const line of expLines) {
            if (dateRangePat.test(line)) {
              skipLines.add(line.toLowerCase())
            }
          }
        }

        // Every other line is a bullet
        // Determine which lines are the "header" (first 1-2 lines + date lines)
        let headerEndIdx = 0
        if (company && expLines.length >= 2 && expLines[1] === company) {
          headerEndIdx = 1 // first two lines are role + company
        }
        // Find the line with the date range
        const dateRangePat2 = dateParts.length > 0
          ? new RegExp(
              `${startDate.replace(/\d{4}/g, '\\d{4}') || ''}\\s*[-–—]+\\s*${(endDate || 'Present|Current').replace(/\d{4}/g, '\\d{4}')}`,
              'i',
            )
          : null
        const dateLineIdx = expLines.findIndex(
          (l) => dateRangePat2?.test(l) ?? false,
        )

        const bulletLines: string[] = []
        for (let i = 0; i < expLines.length; i++) {
          // Skip header lines
          if (i <= headerEndIdx) continue
          // Skip the date line
          if (i === dateLineIdx) continue
          const clean = expLines[i]
            .replace(/^[•\-*\d+.]\s*/, '')
            .trim()
          if (clean && !skipLines.has(clean.toLowerCase()) && clean.length > 1) {
            bulletLines.push(clean)
          }
        }

        return {
          id: createId(),
          role,
          company,
          location,
          startDate,
          endDate: endDate || 'Present',
          bullets: bulletLines.join('\n'),
        }
      })
      .filter((e): e is NonNullable<typeof e> => e !== null && e.role.length > 0)
  }

  /* ── Education ─────────────────────────────────────────────── */
  const eduText = getSectionContent('education', sections, text)
  if (eduText) {
    const blocks = eduText.split(/\n{2,}/).filter(Boolean)
    result.education = blocks
      .map((block) => {
        const eduLines = block.split('\n').map((l) => l.trim()).filter(Boolean)
        if (eduLines.length === 0) return null

        const first = eduLines[0]

        // Check if the first line is a date/year — if so, find the real content
        let contentStart = 0
        if (first.match(/^\d{4}|^[A-Z][a-z]+\s+\d{4}/)) {
          contentStart = 1
        }

        // Degree: look for B.Tech, B.E., B.Sc, M.Tech, PhD, etc.
        const degreePattern =
          /^(B\.?[A-Za-z.]+|M\.?[A-Za-z.]+|P\.?h\.?D|Ph\.?D|B\.?Tech|M\.?Tech|B\.?E\.?|M\.?E\.?|B\.?Sc|M\.?Sc|B\.?A\.?|M\.?A\.?|B\.?Com|M\.?Com|B\.?B\.?A\.?|M\.?B\.?A\.?|B\.?C\.?A\.?|M\.?C\.?A\.?|B\.?Arch|L\.?L\.?B\.?|L\.?L\.?M\.?|Diploma|B\.?Ed|M\.?Ed|B\.?Des|M\.?Des|B\.?F\.?A\.?|M\.?F\.?A\.?|H\.?S\.?C|S\.?S\.?C|Intermediate|B\.?S\.?|M\.?S\.?)/i
        let degreeLine = ''
        let degree = ''
        let fieldOfStudy = ''

        for (const line of eduLines.slice(contentStart)) {
          if (degreePattern.test(line)) {
            degreeLine = line
            const fosMatch = line.match(
              /^(.+?)\s+(?:in|of|-)\s+(.+)/i,
            )
            if (fosMatch) {
              degree = fosMatch[1].trim()
              fieldOfStudy = fosMatch[2].trim()
            } else {
              degree = line
            }
            break
          }
        }

        if (!degree && eduLines.length > contentStart) {
          degree = eduLines[contentStart]
        }

        // Institution: look for university/college keywords, or second non-degree line
        let institution = ''
        let date = ''
        let location = ''

        for (const line of eduLines.slice(contentStart)) {
          if (
            line !== degreeLine &&
            /university|college|institute|school|academy|polytechnic/i.test(line) &&
            !institution
          ) {
            institution = line
          }
          const dateMatch = line.match(
            /(\d{4}\s*[-–]+\s*(?:\d{4}|Present|Expected|Current))/i,
          )
          if (dateMatch && !date) date = dateMatch[1]
          if (!date) {
            const singleDate = line.match(/(?:^|\s)(\d{4})(?:\s|$)/)
            if (singleDate && !line.match(degreePattern) && !line.match(/university|college|institute|school/i)) {
              date = singleDate[1]
            }
          }
          const locMatch = line.match(
            /([A-Z][a-z]+(?:[\s-][A-Z][a-z]+)*),\s*([A-Z]{2})/,
          )
          if (locMatch && !location) location = locMatch[0]
        }

        // If no institution found, try the first line that isn't the degree
        if (!institution) {
          for (const line of eduLines) {
            if (line !== degreeLine && line !== first && line.length > 5) {
              institution = line
              break
            }
          }
        }

        const { startDate, endDate } = extractDateRange(date || block)

        let state = ''
        if (location) {
          const lower = location.toLowerCase()
          for (const st of INDIAN_STATES) {
            if (lower.includes(st)) {
              state = st.replace(/\b\w/g, (ch: string) => ch.toUpperCase())
              break
            }
          }
        }

        return {
          id: createId(),
          degree: degree ?? '',
          institution,
          fieldOfStudy,
          state,
          startDate,
          endDate,
          location,
          date,
        }
      })
      .filter((e): e is NonNullable<typeof e> => e !== null && e.degree.length > 0)
  }

  /* ── Projects ──────────────────────────────────────────────── */
  const projText = getSectionContent('projects', sections, text)
  if (projText) {
    const blocks = projText.split(/\n{2,}/).filter(Boolean)
    result.projects = blocks
      .map((block) => {
        const projLines = block.split('\n').map((l) => l.trim()).filter(Boolean)
        if (projLines.length === 0) return null

        const name = projLines[0].replace(/^[•\-*\d+.]\s*/, '').trim()
        const stackMatch = block.match(
          /(?:stack|tech|technologies|built\s*with|using|tools)[:\-]\s*(.+)/i,
        )
        const stack = stackMatch?.[1]?.trim() ?? ''

        const { startDate, endDate } = extractDateRange(block)

        const bulletLines = projLines
          .slice(1)
          .filter((l) => !l.match(/(?:stack|tech|technologies|built\s*with|tools)/i))
          .map((l) => l.replace(/^[•\-*\d+.]\s*/, '').trim())
          .filter(Boolean)

        return {
          id: createId(),
          name,
          domain: '',
          stack,
          startDate,
          endDate,
          bullets: bulletLines.join('\n'),
        }
      })
      .filter((p): p is NonNullable<typeof p> => p !== null && p.name.length > 0)
  }

  /* ── Certifications ────────────────────────────────────────── */
  const certText = getSectionContent('certifications', sections, text)
  if (certText) {
    const certLines = certText
      .split('\n')
      .map((l) => l.replace(/^[•\-*\d+.]\s*/, '').trim())
      .filter(Boolean)
    result.certifications = certLines.map((line) => {
      const urlMatch = line.match(/https?:\/\/[^\s]+/)
      const name = urlMatch ? line.replace(urlMatch[0], '').trim() : line
      return {
        id: createId(),
        name,
        url: urlMatch?.[0] ?? '',
      }
    })
  }

  /* ── Languages ─────────────────────────────────────────────── */
  const langText = getSectionContent('languages', sections, text)
  if (langText) {
    const langLines = langText
      .split('\n')
      .map((l) => l.replace(/^[•\-*\d+.]\s*/, '').trim())
      .filter(Boolean)
    result.languages = langLines.map((line) => {
      const parts = line.split(/[-–:(]/).map((s) => s.trim())
      return {
        id: createId(),
        name: parts[0],
        level: parts[1] ?? '',
      }
    })
  }

  return result
}
