import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react'
import blogData from '@/data/blog-data.json'
import BlogCommentsSection from './blog-comments-section'
import { Navbar } from '@/components/Navbar'

export function BlogPostDetailPage({ postId }: { postId: number }) {
  const post = blogData.posts.find((item) => item.id === postId)

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="max-w-md text-center">
            <p className="text-sm uppercase tracking-widest text-cyan-500 mb-4">404</p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Blog post not found
            </h1>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-white hover:bg-cyan-600 transition-colors"
            >
              <ArrowLeft size={16} />
              Back home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="pt-20"
      >
        {/* Hero banner */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden bg-slate-100 dark:bg-slate-900">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover opacity-60 dark:opacity-40"
          />
          <div className="absolute inset-0 bg-linear-to-t from-white dark:from-slate-950 via-white/40 dark:via-slate-950/60 to-transparent" />

          {/* Back link overlaid on hero */}
          <div className="absolute top-6 left-4 sm:left-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 dark:border-white/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-cyan-400/60 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors"
            >
              <ArrowLeft size={14} />
              Back
            </Link>
          </div>
        </div>

        {/* Content wrapper */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 pb-24">
          {/* Header card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-xl dark:shadow-slate-900/50 p-6 sm:p-10 mb-8"
          >
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar size={12} className="text-cyan-500" />
                {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <User size={12} className="text-cyan-500" />
                {post.author}
              </span>
              <span className="uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-semibold text-[10px]">
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-slate-900 dark:text-white mb-6">
              {post.title}
            </h1>

            {/* Intro */}
            <p className="text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300 mb-8 border-l-4 border-cyan-400 pl-5">
              {post.intro}
            </p>

            {/* Tags */}
            {(post.tags ?? []).length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <Tag size={13} className="text-slate-400 dark:text-slate-500" />
                {(post.tags ?? []).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-cyan-400/50 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Article body */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-sm p-6 sm:p-10 mb-8"
          >
            <article
              className="
                prose prose-slate dark:prose-invert max-w-none
                prose-headings:text-slate-900 dark:prose-headings:text-white
                prose-p:text-slate-600 dark:prose-p:text-slate-300
                prose-p:leading-8 prose-p:text-base
                prose-strong:text-slate-900 dark:prose-strong:text-white
                prose-a:text-cyan-600 dark:prose-a:text-cyan-400
                prose-code:text-cyan-600 dark:prose-code:text-cyan-300
                prose-code:bg-slate-100 dark:prose-code:bg-slate-800
                prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                [&_b]:text-slate-900 dark:[&_b]:text-white
                [&_img]:rounded-xl [&_img]:border [&_img]:border-slate-200 dark:[&_img]:border-slate-700
                [&_img]:w-full [&_img]:h-64 sm:[&_img]:h-80 [&_img]:object-contain [&_img]:bg-slate-50 dark:[&_img]:bg-slate-900
                [&_p]:mb-5
              "
            >
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>

            {/* Code snippet */}
            {post.codeSnippet && (
              <div className="mt-8">
                <div className="flex items-center justify-between px-4 py-2 rounded-t-xl bg-slate-800 dark:bg-slate-950 border border-b-0 border-slate-700">
                  <span className="text-xs font-mono text-slate-400">Code</span>
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-400/70" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
                    <span className="w-3 h-3 rounded-full bg-green-400/70" />
                  </div>
                </div>
                <pre className="overflow-x-auto rounded-b-xl border border-slate-700 bg-slate-900 dark:bg-slate-950 p-5 text-sm leading-7 text-emerald-300 whitespace-pre-wrap font-mono">
                  {post.codeSnippet}
                </pre>
              </div>
            )}

            {/* Footer */}
            {post.footer && (
              <div
                className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700 text-sm leading-7 text-slate-500 dark:text-slate-400 [&_a]:text-cyan-600 dark:[&_a]:text-cyan-400 [&_a]:underline-offset-2 [&_a]:hover:underline"
                dangerouslySetInnerHTML={{ __html: post.footer }}
              />
            )}
          </motion.div>

          {/* Comments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <BlogCommentsSection />
          </motion.div>
        </div>
      </motion.main>
    </div>
  )
}
