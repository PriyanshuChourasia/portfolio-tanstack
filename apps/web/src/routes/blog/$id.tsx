import { BlogPostDetailPage } from '@/features/blog/components/blog-detail-page'
import { getBlogPosts } from '@/data/blog-posts'
import { createFileRoute } from '@tanstack/react-router'

const SITE_URL = 'https://codymitra.com'

export const Route = createFileRoute('/blog/$id')({
  head: ({ params }) => {
    const post = getBlogPosts().find((item) => item.id === parseInt(params.id))
    const title = post ? `${post.title} | Priyanshu Chourasia` : 'Blog post not found | Priyanshu Chourasia'
    const description = post?.desc ?? 'Read the latest blog post from Priyanshu Chourasia.'
    const image = post?.image ? `${SITE_URL}${post.image}` : `${SITE_URL}/hero-person.png`
    const url = `${SITE_URL}/blog/${params.id}`

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
  return <BlogPostDetailPage postId={parseInt(id)} />
}
