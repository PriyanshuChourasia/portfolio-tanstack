import { createFileRoute } from '@tanstack/react-router'
import { PhotofolioPage } from '@/features/photofolio'

export const Route = createFileRoute('/photofolio/$projectId')({
  component: PhotofolioEditor,
  head: () => ({
    meta: [
      { title: 'Photofolio Editor' },
      { name: 'description', content: 'Edit your photofolio project.' },
    ],
  }),
})

function PhotofolioEditor() {
  const { projectId } = Route.useParams()
  return <PhotofolioPage projectId={projectId} />
}
