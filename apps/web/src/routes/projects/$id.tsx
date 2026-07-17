import { ProjectDetailPage } from '@/features/works/components/project-detail-page'
import worksData from '@/data/works-data.json'
import { createFileRoute } from '@tanstack/react-router'

const SITE_URL = 'https://codymitra.com'

export const Route = createFileRoute('/projects/$id')({
  head: ({ params }) => {
    const project = worksData.items[parseInt(params.id) - 1]
    const title = project
      ? `${project.title} | Priyanshu Chourasia`
      : 'Project not found | Priyanshu Chourasia'
    const description =
      project?.description ?? 'Browse projects built by Priyanshu Chourasia.'
    const image = project?.image
      ? `${SITE_URL}${project.image}`
      : `${SITE_URL}/hero-person.png`
    const url = `${SITE_URL}/projects/${params.id}`

    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image },
        { property: 'og:url', content: url },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image },
      ],
      links: [{ rel: 'canonical', href: url }],
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  return <ProjectDetailPage projectId={parseInt(id)} />
}