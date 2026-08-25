import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { BookOpen, Calendar, Tag, User } from 'lucide-react'
import { useState } from 'react'
import BlogCommentsSection from './blog-comments-section'
import { getBlogPosts } from '@/data/blog-posts'
import { Navbar } from '@/components/Navbar'

export function BlogPostDetailPage({ postId }: { postId: number }) {
  const [hasImageError, setHasImageError] = useState(false)
  const post = getBlogPosts().find((item) => item.id === postId)
  const shouldShowHeroImage = Boolean(post?.image?.trim()) && !hasImageError

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="max-w-md text-center">
            <p className="text-sm uppercase tracking-widest text-primary-accent mb-4">
              404
            </p>
            <h1 className="text-3xl font-bold text-slate-900 text-foreground mb-6">
              Blog post not found
            </h1>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-primary-accent px-6 py-3 text-sm font-semibold text-white hover:bg-primary-accent transition-colors"
            >
              Back home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <Navbar />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="pt-18"
      >
        {/* Hero banner */}
        <div className="relative w-full h-36 sm:h-48 md:h-60 overflow-hidden bg-linear-to-br from-slate-100 via-slate-100 to-primary-accent/5 dark:from-slate-900 dark:via-slate-950 dark:to-primary/95/30">
          {shouldShowHeroImage ? (
            <img
              src={post.image}
              alt={post.title}
              onError={() => setHasImageError(true)}
              className="w-full h-full object-cover opacity-60 dark:opacity-40"
            />
          ) : (
            /* Unique gradient placeholder based on post ID */
            <div className="flex h-full w-full items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-white/40">
                  <BookOpen className="h-7 w-7" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
                  {post.category}
                </p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-slate-50/80 dark:from-slate-950 via-slate-50/20 dark:via-slate-950/40 to-transparent" />
        </div>

        {/* Content wrapper */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 pb-16">
          {/* Header card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl border border-slate-200 border-border bg-white dark:bg-card shadow-xl shadow-card p-6 sm:p-10 mb-6"
          >
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 mb-5 text-xs text-slate-500 text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar size={12} className="text-primary-accent" />
                {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <User size={12} className="text-primary-accent" />
                {post.author}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-slate-900 text-foreground mb-6">
              {post.title}
            </h1>

            {/* Intro */}
            <p className="text-base sm:text-lg leading-relaxed text-slate-600 text-foreground mb-7 border-l-4 border-primary-accent pl-5">
              {post.intro}
            </p>

            {/* Tags */}
            {(post.tags ?? []).length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <Tag size={13} className="text-slate-400 dark:text-slate-500" />
                {(post.tags ?? []).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 border-border bg-slate-100 bg-card px-3 py-1 text-xs font-semibold text-slate-600 text-foreground hover:border-primary-accent/50 hover:text-primary hover:text-primary-accent transition-colors"
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
            className="rounded-2xl border border-slate-200 border-border bg-white dark:bg-card shadow-sm p-6 sm:p-10 mb-6"
          >
            <article
              className="
                prose prose-slate dark:prose-invert max-w-none
                prose-headings:text-slate-900 dark:prose-headings:text-white
                prose-p:text-slate-600 dark:prose-p:text-slate-300
                prose-p:leading-8 prose-p:text-base
                prose-strong:text-slate-900 dark:prose-strong:text-white
                prose-a:text-primary dark:prose-a:text-primary-accent
                prose-code:text-primary dark:prose-code:text-primary-accent
                prose-code:bg-slate-100 dark:prose-code:bg-slate-800
                prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                [&_b]:text-slate-900 dark:[&_b]:text-white
                [&_img]:rounded-xl [&_img]:border [&_img]:border-slate-200 dark:[&_img]:border-slate-700
                [&_img]:w-full [&_img]:h-64 sm:[&_img]:h-80 [&_img]:object-contain [&_img]:bg-slate-50 dark:[&_img]:bg-card
                [&_p]:mb-5
              "
            >
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>

            {/* Code snippet */}
            {post.codeSnippet && (
              <div className="mt-8">
                <div className="flex items-center justify-between px-4 py-2 rounded-t-xl bg-slate-800 dark:bg-background border border-b-0 border-slate-700">
                  <span className="text-xs font-mono text-slate-400">Code</span>
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-400/70" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
                    <span className="w-3 h-3 rounded-full bg-green-400/70" />
                  </div>
                </div>
                <pre className="overflow-x-auto rounded-b-xl border border-slate-700 bg-card dark:bg-background p-5 text-sm leading-7 text-emerald-300 whitespace-pre-wrap font-mono">
                  {post.codeSnippet}
                </pre>
              </div>
            )}

            {/* Footer */}
            {post.footer && (
              <div
                className="mt-8 pt-8 border-t border-slate-200 border-border text-sm leading-7 text-slate-500 text-muted-foreground [&_a]:text-primary dark:[&_a]:text-primary-accent [&_a]:underline-offset-2 [&_a]:hover:underline"
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
