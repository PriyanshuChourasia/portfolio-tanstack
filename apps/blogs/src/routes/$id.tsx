import { createFileRoute } from '@tanstack/react-router'
import { getBlogPosts } from '@/data/blog-posts'

export const Route = createFileRoute('/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const post = getBlogPosts().find((p) => String(p.id) === id)

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <article className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {post ? (
            <HighlightedTitle title={post.title} highlight={post.highlight} />
          ) : (
            'Post not found'
          )}
        </h1>
        {post?.content && (
          <div
            className="mt-8 leading-8 text-neutral-600 [&_b]:text-neutral-900 [&_img]:my-6 [&_img]:w-full [&_img]:rounded-2xl [&_img]:border [&_img]:border-neutral-200 [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-600 [&_blockquote]:pl-5 [&_blockquote]:italic [&_a]:text-blue-600 [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        )}
      </article>
    </div>
  )
}

function HighlightedTitle({
  title,
  highlight,
}: {
  title: string
  highlight?: string
}) {
  if (!highlight || !title.includes(highlight)) {
    return title
  }

  const [before, ...rest] = title.split(highlight)

  return (
    <>
      {before}
      <span className="text-blue-600">{highlight}</span>
      {rest.join(highlight)}
    </>
  )
}
