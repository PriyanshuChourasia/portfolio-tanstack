

import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import blogData from '@/data/blog-data.json'
import BlogCommentsSection from './blog-comments-section'


export function BlogPostDetailPage({ postId }: { postId: number }) {
  const post = blogData.posts.find((item) => item.id === postId)

  if (!post) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-2 text-white sm:px-6 sm:py-4">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:rounded-[28px] sm:p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Blog not found</p>
          <h1 className="mt-4 text-2xl font-bold sm:text-3xl">This blog does not exist.</h1>
          <Link
            to="/"
            className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-200 sm:w-auto"
          >
            Back home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-slate-950 px-4 py-4 text-white sm:px-6 sm:py-4"
    >
      <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">


        <div className="overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-slate-900/90 via-slate-900/75 to-cyan-950/35 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:rounded-4xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 py-5  px-6 text-sm font-semibold text-cyan-300 transition-colors hover:text-cyan-200"
          >
            <span aria-hidden="true">←</span>
            Back to home
          </Link>
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-5 sm:p-8 md:p-12 lg:p-14">
              <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-cyan-300">
                <span>{post.category}</span>
                <span className="text-slate-500">•</span>
                <span>{post.date}</span>
                <span className="text-slate-500">•</span>
                <span>{post.author}</span>
              </div>

              <h1 className="mt-5 text-3xl font-bold leading-tight sm:mt-6 sm:text-3xl md:text-6xl">
                {post.title}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:mt-6 sm:text-base sm:leading-8">
                {post?.intro}
              </p>

              <div className="mt-6 flex flex-wrap gap-2 sm:mt-8">
                {(post.tags ?? []).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 bg-black/10 p-3 sm:p-4 lg:border-l lg:border-t-0 lg:p-6">
              <div className="h-64 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 sm:h-80 sm:rounded-3xl lg:h-full">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-6 border-t border-white/10 px-4 py-8 sm:px-6 sm:py-10 md:px-12 lg:grid-cols-[1.25fr_0.75fr] lg:px-14">
            <article className="space-y-5 text-slate-300 sm:space-y-6">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />

              {post.codeSnippet ? (
                <pre className="overflow-x-auto rounded-2xl border border-cyan-400/20 bg-slate-950/80 p-4 text-xs leading-6 text-cyan-100 whitespace-pre-wrap sm:p-6 sm:text-sm sm:leading-7">
                  {post.codeSnippet}
                </pre>
              ) : null}

              {post.footer ? (
                <div
                  className="text-sm leading-7 text-slate-400"
                  dangerouslySetInnerHTML={{ __html: post.footer }}
                />
              ) : null}
            </article>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Blog details</p>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  <p>
                    <span className="text-slate-500">Author:</span> {post.author}
                  </p>
                  <p>
                    <span className="text-slate-500">Category:</span> {post.category}
                  </p>
                  <p>
                    <span className="text-slate-500">Published:</span> {post.date}
                  </p>
                  <p>
                    <span className="text-slate-500">Description:</span> {post.desc}
                  </p>
                </div>
              </div>

            </aside>
          </div>

          <BlogCommentsSection />
        </div>
      </div>
    </motion.main>
  )
}
