import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '@/components/Navbar'
import Articles from '@/features/articles/components/articles'
import { SITE_URL, buildMeta } from '@/lib/seo'

export const Route = createFileRoute('/blog/')({
  head: () =>
    buildMeta({
      title: 'Blog | Priyanshu Chourasia',
      description: 'Read the latest blog posts from Priyanshu Chourasia.',
      url: `${SITE_URL}/blog`,
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
