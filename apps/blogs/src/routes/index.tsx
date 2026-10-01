import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '@/components/Navbar'
import Articles from '@/features/articles/components/articles'
import { SITE_URL, buildMeta } from '@/lib/seo'

export const Route = createFileRoute('/')({
  head: () =>
    buildMeta({
      title: 'Blog | Priyanshu Chourasia',
      description: 'Read the latest blog posts from Priyanshu Chourasia.',
      url: `${SITE_URL}/`,
    }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Navbar />
      <Articles />
    </>
  )
}
