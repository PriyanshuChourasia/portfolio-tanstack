import { createFileRoute } from '@tanstack/react-router'
import { ProjectDetailPage } from '@/features/works/components/project-detail-page'
import { JsonLd } from '@/components/JsonLd'
import worksData from '@/data/works-data.json'
import { AUTHOR_NAME, DEFAULT_IMAGE, SITE_URL, absoluteUrl, buildMeta } from '@/lib/seo'

export const Route = createFileRoute('/projects/$id')({
  head: ({ params }) => {
    const project = worksData.items[parseInt(params.id) - 1]
    const title = project
      ? `${project.title} | Priyanshu Chourasia`
      : 'Project not found | Priyanshu Chourasia'
    const description =
      project?.description ?? 'Browse projects built by Priyanshu Chourasia.'
    const image = project ? absoluteUrl(project.image) : DEFAULT_IMAGE
    const url = `${SITE_URL}/projects/${params.id}`

    return buildMeta({ title, description, url, image, type: 'article' })
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const project = worksData.items[parseInt(id) - 1]

  const schema = project && {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    image: absoluteUrl(project.image),
    url: `${SITE_URL}/projects/${id}`,
    author: { '@type': 'Person', name: AUTHOR_NAME },
    ...(project.link && project.link !== '#' ? { sameAs: project.link } : {}),
  }

  return (
    <>
      {schema && <JsonLd data={schema} />}
      <ProjectDetailPage projectId={parseInt(id)} />
    </>
  )
}
