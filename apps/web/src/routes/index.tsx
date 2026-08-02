import { createFileRoute } from '@tanstack/react-router'
import { PortfolioLayout } from '@/features/portfolio-main/components/portfoliolayout'
import { JsonLd } from '@/components/JsonLd'
import {
  AUTHOR_EMAIL,
  AUTHOR_NAME,
  DEFAULT_DESCRIPTION,
  DEFAULT_IMAGE,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_URL,
  SOCIAL_LINKS,
  buildMeta,
} from '@/lib/seo'

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: AUTHOR_NAME,
  url: SITE_URL,
  image: DEFAULT_IMAGE,
  email: AUTHOR_EMAIL,
  jobTitle: 'Full Stack Developer',
  sameAs: [SOCIAL_LINKS.github, SOCIAL_LINKS.linkedin, SOCIAL_LINKS.twitter],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
}

export const Route = createFileRoute('/')({
  head: () => buildMeta({
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <JsonLd data={personSchema} />
      <JsonLd data={websiteSchema} />
      <PortfolioLayout />
    </>
  )
}
