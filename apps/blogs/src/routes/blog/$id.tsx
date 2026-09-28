import { createFileRoute, useParams } from '@tanstack/react-router'
import { JsonLd } from '@/components/JsonLd'
import { BlogPostDetailPage } from '@/features/blog/components/blog-detail-page'
import { getBlogPosts } from '@/data/blog-posts'
import {
  AUTHOR_NAME,
  DEFAULT_IMAGE,
  SITE_URL,
  absoluteUrl,
  buildMeta,
} from '@/lib/seo'

export const Route = createFileRoute('/blog/$id')({
  head: ({ params }) => buildMeta({
      title: params.id
        ? `${getBlogPosts().find((item) => item.id === parseInt(params.id))?.title ?? 'Blog post not found'} | Priyanshu Chourasia`
        : 'Blog post not found | Priyanshu Chourasia',
      description: getBlogPosts().find((item) => item.id === parseInt(params.id))?.desc ?? 'Read the latest blog post from Priyanshu Chourasia.',
      url: `${SITE_URL}/blog/${params.id}`,
      image: getBlogPosts().find((item) => item.id === parseInt(params.id))?.image ? absoluteUrl(getBlogPosts().find((item) => item.id === parseInt(params.id))!.image!) : DEFAULT_IMAGE,
      type: 'article',
    }),
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams()
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
