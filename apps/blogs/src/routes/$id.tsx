import { Link, createFileRoute } from '@tanstack/react-router'
import { articleWidgets } from '@/components/article-widgets'
import { getBlogPosts } from '@/data/blog-posts'
import type { ComponentType } from 'react'

export const Route = createFileRoute('/$id')({
  validateSearch: (search: Record<string, unknown>): { page?: number } => {
    const page = Number(search.page)
    return Number.isInteger(page) && page > 1 ? { page } : {}
  },
  component: RouteComponent,
})

const contentClassName =
  'mt-8 leading-7 text-neutral-600 [&>br]:hidden [&_p]:py-0 [&_p]:mb-3 [&_p.pt-4]:mb-0 [&_p:has(>b.text-lg)]:mt-8 [&_b]:text-neutral-900[&_img]:my-6 [&_img]:w-full [&_img]:rounded-2xl [&_img]:border [&_img]:border-neutral-200 [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-600 [&_blockquote]:pl-5 [&_blockquote]:italic [&_a]:text-blue-600 [&_a]:underline [&_ul]:list-disc [&_ul]:py-4 [&_ul]:pl-6 [&_ol]:mb-3 [&_aside]:my-4 [&_aside]:rounded-xl [&_aside]:border [&_aside]:border-blue-200 [&_aside]:bg-blue-50 [&_aside]:px-4 [&_aside]:py-3 [&_aside]:text-sm[&_ol]:list-decimal [&_ol]:pl-6[&_li]:mb-2 [&_code]:rounded [&_code]:bg-neutral-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-neutral-900 [&_pre]:p-4 [&_pre]:text-sm [&_pre]:leading-6 [&_pre]:text-neutral-100 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-neutral-100'

function RouteComponent() {
  const { id } = Route.useParams()
  const { page = 1 } = Route.useSearch()
  const post = getBlogPosts().find((p) => String(p.id) === id)
  const pages = post?.pages ?? []
  const pageIndex = Math.min(page, pages.length) - 1
  const currentPage = pages.length > 0 ? pages[pageIndex] : undefined

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
        {post?.content && <ArticleHtml html={post.content} />}
        {currentPage && (
          <section className="mt-10">
            <p className="text-sm font-medium tracking-wide text-neutral-500 uppercase">
              Page {pageIndex + 1} of {pages.length}
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              {currentPage.title}
            </h2>
            {currentPage.content && <ArticleHtml html={currentPage.content} />}
            {pages.length > 1 && (
              <nav className="mt-12 flex items-center justify-between border-t border-neutral-200 pt-6 text-sm font-medium">
                {pageIndex > 0 ? (
                  <Link
                    to="/$id"
                    params={{ id }}
                    search={{ page: pageIndex }}
                    className="text-blue-600 hover:underline"
                  >
                    ← {pages[pageIndex - 1].title}
                  </Link>
                ) : (
                  <span />
                )}
                {pageIndex < pages.length - 1 && (
                  <Link
                    to="/$id"
                    params={{ id }}
                    search={{ page: pageIndex + 2 }}
                    className="text-blue-600 hover:underline"
                  >
                    {pages[pageIndex + 1].title} →
                  </Link>
                )}
              </nav>
            )}
          </section>
        )}
      </article>
    </div>
  )
}

const WIDGET_MARKER = /<!--\s*widget:([\w-]+)\s*-->/

// Splits HTML on widget markers; odd entries are widget names.
function ArticleHtml({ html }: { html: string }) {
  const parts = html.split(WIDGET_MARKER)

  return (
    <>
      {parts.map((part, index) => {
        if (index % 2 === 1) {
          const Widget = articleWidgets[part] as ComponentType | undefined
          return Widget ? <Widget key={index} /> : null
        }

        return part.trim() ? (
          <div
            key={index}
            className={contentClassName}
            dangerouslySetInnerHTML={{ __html: part }}
          />
        ) : null
      })}
    </>
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
