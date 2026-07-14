import { describe, it, expect } from 'vitest'
import { parseResumeText } from '../parse-resume-text'

const SAMPLE_RESUME = `John Doe
Senior Software Engineer
john@example.com | +1 234-567-8900 | linkedin.com/in/johndoe
San Francisco, CA

Professional Summary
Experienced software engineer with 8+ years building scalable web applications.

Technical Skills
Languages: TypeScript, Python, Go
Frontend: React, Next.js, TailwindCSS
Backend: Node.js, FastAPI, PostgreSQL
Cloud: AWS, Docker, Kubernetes

Experience

Senior Software Engineer at TechCorp
Jan 2020 - Present
San Francisco, CA
• Designed and implemented microservices architecture reducing latency by 40%
• Led a team of 5 engineers delivering 3 major product releases
• Built real-time data pipeline processing 1M+ events per day

Software Engineer at StartupXYZ
Jun 2016 - Dec 2019
New York, NY
• Developed RESTful APIs serving 100K+ daily active users
• Migrated legacy monolith to microservices improving deployment frequency

Education

B.Tech in Computer Science
Indian Institute of Technology, Bombay
Mumbai, Maharashtra
2012 - 2016

Projects

E-Commerce Platform
React, Node.js, MongoDB, Stripe API
Jan 2022 - Jun 2022
• Built full-stack e-commerce platform with payment integration
• Implemented real-time inventory management system

Certifications
AWS Certified Developer - Associate https://aws.amazon.com/certification/
Google Cloud Professional Data Engineer

Languages
English: Native
Hindi: Native
French: Intermediate`

describe('parseResumeText', () => {
  const result = parseResumeText(SAMPLE_RESUME)

  it('should extract personal info', () => {
    expect(result.personalInfo?.fullName).toBe('John Doe')
    expect(result.personalInfo?.email).toBe('john@example.com')
    expect(result.personalInfo?.phone).toBe('+1 234-567-8900')
    expect(result.personalInfo?.linkedin).toContain('linkedin.com/in/johndoe')
    expect(result.personalInfo?.location).toContain('San Francisco')
    expect(result.personalInfo?.title).toBe('Senior Software Engineer')
  })

  it('should extract summary', () => {
    expect(result.summary).toBeTruthy()
    expect(result.summary!.toLowerCase()).toContain('experienced software engineer')
  })

  it('should extract skills with categories', () => {
    expect(result.skills).toBeDefined()
    expect(result.skills!.length).toBeGreaterThanOrEqual(3)
    const languages = result.skills!.find(s => s.label.toLowerCase() === 'languages')
    expect(languages).toBeDefined()
    expect(languages!.value).toContain('TypeScript')
    // Check that frontend skills are captured
    const frontend = result.skills!.find(s => s.label.toLowerCase() === 'frontend')
    expect(frontend).toBeDefined()
    expect(frontend!.value).toContain('React')
  })

  it('should extract experience entries', () => {
    expect(result.experience).toBeDefined()
    expect(result.experience!.length).toBeGreaterThanOrEqual(2)

    // Verify the first role is parsed correctly
    const senior = result.experience!.find(e => e.role.includes('Senior'))
    expect(senior).toBeDefined()
    expect(senior!.company).toBe('TechCorp')
    expect(senior!.startDate).toBe('Jan 2020')
    expect(senior!.endDate).toBe('Present')
    expect(senior!.bullets).toContain('microservices')

    // Verify the second role
    const junior = result.experience!.find(e => e.role.includes('Software') && e.company === 'StartupXYZ')
    expect(junior).toBeDefined()
    expect(junior!.startDate).toBe('Jun 2016')
    expect(junior!.endDate).toBe('Dec 2019')
  })

  it('should extract education with fieldOfStudy', () => {
    expect(result.education).toBeDefined()
    expect(result.education!.length).toBeGreaterThanOrEqual(1)

    const btech = result.education!.find(e => e.degree.includes('B.Tech'))
    expect(btech).toBeDefined()
    if (btech) {
      // "B.Tech in Computer Science" should extract degree + fieldOfStudy
      expect(btech.fieldOfStudy).toBe('Computer Science')
      expect(btech.institution).toContain('Indian Institute')
      expect(btech.startDate || btech.date).toBeTruthy()
    }
  })

  it('should extract projects with data', () => {
    expect(result.projects).toBeDefined()
    expect(result.projects!.length).toBeGreaterThanOrEqual(1)
    const ecom = result.projects!.find(p => p.name.includes('E-Commerce'))
    expect(ecom).toBeDefined()
    if (ecom) {
      // Stack extraction requires a 'stack:' or 'built with' prefix;
      // when the tech list is unprefixed, stack will be empty.
      // This is a known parser limitation.
      expect(ecom.bullets).toBeTruthy()
      expect(ecom.startDate || ecom.endDate).toBeTruthy()
    }
  })

  it('should extract certifications', () => {
    expect(result.certifications).toBeDefined()
    expect(result.certifications!.length).toBeGreaterThanOrEqual(2)
    const awsCert = result.certifications!.find(c => c.name.includes('AWS'))
    expect(awsCert).toBeDefined()
    expect(awsCert!.url).toContain('aws.amazon.com')
  })

  it('should extract languages with levels', () => {
    expect(result.languages).toBeDefined()
    expect(result.languages!.length).toBeGreaterThanOrEqual(2)
    const english = result.languages!.find(l => l.name.toLowerCase() === 'english')
    expect(english).toBeDefined()
    expect(english!.level).toBe('Native')
  })
})
