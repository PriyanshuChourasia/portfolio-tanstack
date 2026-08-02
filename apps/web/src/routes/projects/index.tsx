import { createFileRoute } from '@tanstack/react-router'
import { ProjectsPage } from '@/features/works/components/projects-page'
import { JsonLd } from '@/components/JsonLd'
import { SITE_URL, absoluteUrl, buildMeta } from '@/lib/seo'
import worksData from '@/data/works-data.json'

const TITLE = 'Projects | Priyanshu Chourasia'
const DESCRIPTION =
  'Browse projects built by Priyanshu Chourasia across web development, full stack, and frontend engineering.'
const URL = `${SITE_URL}/projects`

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: worksData.items.map((project, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `${SITE_URL}/projects/${index + 1}`,
    name: project.title,
    image: absoluteUrl(project.image),
  })),
}

export const Route = createFileRoute('/projects/')({
  head: () => buildMeta({ title: TITLE, description: DESCRIPTION, url: URL }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <JsonLd data={itemListSchema} />
      <ProjectsPage />
    </>
  )
}
