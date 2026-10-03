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
            className="mt-8 leading-7 text-neutral-600 [&>br]:hidden [&_p]:py-0 [&_p]:mb-3 [&_p.pt-4]:mb-0 [&_p:has(>b.text-lg)]:mt-8 [&_b]:text-neutral-900[&_img]:my-6 [&_img]:w-full [&_img]:rounded-2xl [&_img]:border [&_img]:border-neutral-200 [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-600 [&_blockquote]:pl-5 [&_blockquote]:italic [&_a]:text-blue-600 [&_a]:underline [&_ul]:list-disc [&_ul]:py-4 [&_ul]:pl-6 [&_ol]:mb-3 [&_aside]:my-4 [&_aside]:rounded-xl [&_aside]:border [&_aside]:border-blue-200 [&_aside]:bg-blue-50 [&_aside]:px-4 [&_aside]:py-3 [&_aside]:text-sm[&_ol]:list-decimal [&_ol]:pl-6[&_li]:mb-2 [&_code]:rounded [&_code]:bg-neutral-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm"
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
