import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { BlogArtwork } from '@/components/blog-artwork'
import { getBlogPosts } from '@/data/blog-posts'

const previewPosts = getBlogPosts().slice(0, 3)

export default function ArticlePreviewSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white dark:bg-background py-2 sm:py-4 md:py-6">
      <div className="relative z-10 mx-auto max-w-[88rem] px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl border border-slate-200 border-border bg-slate-50 dark:bg-gradient-to-br from-card/95 via-card/90 to-card/80 p-4 sm:p-5 md:p-8 shadow-lg shadow-2xl shadow-card backdrop-blur-xl"
        >
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start xl:gap-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 text-foreground">
                  See my blogs
                </h2>
                <p className="max-w-xl text-sm leading-7 text-slate-600 text-foreground md:text-base">
                  Short reads and notes on design, development, and the thinking
                  behind the work.
                </p>
              </div>

              <a
                href="#articles"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary-accent/30 bg-white bg-card/5 px-5 py-3 text-sm font-semibold text-primary text-primary-accent/80 transition-colors hover:border-primary-accent hover:bg-primary-accent/5 hover:border-primary-accent/30/40 hover:bg-primary-accent/10 sm:w-auto"
              >
                Explore the full section
                <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              {previewPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 border-border bg-white bg-card/5 transition-all duration-300 hover:-translate-y-1 hover:border-primary-accent/40 hover:shadow-xl hover:shadow-primary-accent/10 dark:hover:border-primary-accent/30"
                >
                  <div className="relative h-36 w-full shrink-0 overflow-hidden sm:h-40">
                    <BlogArtwork
                      src={post.image}
                      alt={post.title}
                      placeholderLabel="Blog cover"
                      showPlaceholder={true}
                      seed={post.id}
                      className="transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>

                  <div className="flex grow flex-col gap-3 p-4 sm:p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-primary-accent/20 bg-primary-accent/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary dark:border-primary-accent/25 dark:bg-primary-accent/15 dark:text-primary-accent">
                        {post.category}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        {post.date}
                      </span>
                    </div>

                    <h3 className="line-clamp-2 text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-primary text-foreground dark:group-hover:text-primary-accent">
                      {post.title}
                    </h3>

                    <p className="line-clamp-2 grow text-sm leading-6 text-slate-500 text-muted-foreground">
                      {post.desc}
                    </p>

                    <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-primary dark:text-primary-accent">
                      Read article
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </div>
                  </div>

                  <Link
                    to="/blog/$id"
                    params={{ id: String(post.id) }}
                    className="absolute inset-0"
                    aria-label={`Open ${post.title}`}
                  />
                </motion.article>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
