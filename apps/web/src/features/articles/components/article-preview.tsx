import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { BlogArtwork } from '@/components/blog-artwork'
import { getBlogPosts } from '@/data/blog-posts'

const previewPosts = getBlogPosts().slice(0, 3)

export default function ArticlePreviewSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white dark:bg-slate-950 py-2 sm:py-4 md:py-6">
      <div className="relative z-10 mx-auto max-w-[88rem] px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-gradient-to-br dark:from-slate-900/95 dark:via-slate-800/90 dark:to-slate-700/80 p-4 sm:p-5 md:p-8 shadow-lg dark:shadow-2xl dark:shadow-black/30 backdrop-blur-xl"
        >
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start xl:gap-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                  See my blogs
                </h2>
                <p className="max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300 md:text-base">
                  Short reads and notes on design, development, and the thinking
                  behind the work.
                </p>
              </div>

              <a
                href="#articles"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-cyan-400/30 bg-white dark:bg-white/5 px-5 py-3 text-sm font-semibold text-cyan-600 dark:text-cyan-200 transition-colors hover:border-cyan-400 hover:bg-cyan-50 dark:hover:border-cyan-300/40 dark:hover:bg-cyan-400/10 sm:w-auto"
              >
                Explore the full section
                <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="space-y-4">
              {previewPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group flex flex-col gap-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-4 transition-colors hover:border-cyan-400/40 dark:hover:border-cyan-400/30 hover:bg-slate-50 dark:hover:bg-white/10 sm:flex-row sm:items-center"
                >
                  <div className="h-40 w-full shrink-0 overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 sm:h-20 sm:w-20">
                    <BlogArtwork
                      src={post.image}
                      alt={post.title}
                      placeholderLabel="Blog cover"
                      showPlaceholder={true}
                      compact
                      seed={post.id}
                      className="transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="min-w-0 grow space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-cyan-500 dark:text-cyan-300">
                      <span>{post.category}</span>
                      <span className="text-slate-300 dark:text-slate-500">
                        •
                      </span>
                      <span>{post.date}</span>
                    </div>
                    <h3 className="truncate text-base font-semibold text-slate-900 dark:text-white">
                      {post.title}
                    </h3>
                    <p className="line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {post.desc}
                    </p>
                  </div>

                  <Link
                    to="/blog/$id"
                    params={{ id: String(post.id) }}
                    className="shrink-0 self-start rounded-full border border-cyan-400/30 bg-cyan-50 dark:bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-600 dark:text-cyan-200 transition-colors hover:border-cyan-400 hover:bg-cyan-100 dark:hover:border-cyan-300/40 dark:hover:bg-cyan-400/20"
                    aria-label={`Open ${post.title}`}
                  >
                    →
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
