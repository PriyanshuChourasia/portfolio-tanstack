import { createFileRoute } from '@tanstack/react-router'
import { BlogPostDetailPage } from '@/features/blog/components/blog-detail-page'
import { JsonLd } from '@/components/JsonLd'
import { getBlogPosts } from '@/data/blog-posts'
import { AUTHOR_NAME, DEFAULT_IMAGE, SITE_URL, absoluteUrl, buildMeta } from '@/lib/seo'

export const Route = createFileRoute('/blog/$id')({
  head: ({ params }) => {
    const post = getBlogPosts().find((item) => item.id === parseInt(params.id))
    const title = post ? `${post.title} | Priyanshu Chourasia` : 'Blog post not found | Priyanshu Chourasia'
    const description = post?.desc ?? 'Read the latest blog post from Priyanshu Chourasia.'
    const image = post?.image ? absoluteUrl(post.image) : DEFAULT_IMAGE
    const url = `${SITE_URL}/blog/${params.id}`

    return buildMeta({ title, description, url, image, type: 'article' })
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const post = getBlogPosts().find((item) => item.id === parseInt(id))

  const schema = post && {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.desc,
    image: absoluteUrl(post.image),
    url: `${SITE_URL}/blog/${id}`,
    datePublished: post.date,
    author: { '@type': 'Person', name: post.author || AUTHOR_NAME },
  }

  return (
    <>
      {schema && <JsonLd data={schema} />}
      <BlogPostDetailPage postId={parseInt(id)} />
    </>
  )
}
