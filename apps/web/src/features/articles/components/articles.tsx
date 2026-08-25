import { Link } from '@tanstack/react-router'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { getBlogPosts } from '@/data/blog-posts'

export default function Articles() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start center', 'end center'],
  })

  const articles = getBlogPosts()

  const titleY = useTransform(scrollYProgress, [0, 0.3], [100, 0])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  return (
    <section
      id="articles"
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-slate-50 dark:bg-background pt-6 pb-16 md:pt-8 md:pb-24"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="text-center mb-12 md:mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 text-foreground">
            Featured <span className="text-primary-accent">Blogs</span>
          </h2>
        </motion.div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
          {articles.map((article, index) => {
            const cardY = useTransform(
              scrollYProgress,
              [0, 0.5, 1],
              [48 + index * 10, 0, -24],
            )
            const cardOpacity = useTransform(
              scrollYProgress,
              [0, 0.3, 0.7, 1],
              [0, 1, 1, 0.5],
            )

            return (
              <motion.div
                key={index}
                style={{ y: cardY, opacity: cardOpacity }}
                className="group relative h-full overflow-hidden rounded-3xl border border-slate-200 border-border bg-white dark:bg-card/70 hover:border-primary-accent/50 dark:hover:border-primary-accent/40 transition-colors backdrop-blur-xl"
              >
                <div className="absolute inset-0 overflow-hidden">
                  {article.image ? (
                    <img
                      src={article.image}
                      alt=""
                      aria-hidden="true"
                      className="h-full w-full object-cover opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity duration-500 scale-105 group-hover:scale-100"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-linear-to-br from-white/90 via-white/95 to-white/90 from-card/95 dark:via-slate-900/90 dark:to-slate-900/95 group-hover:from-white/70 group-hover:via-white/80 group-hover:to-white/70 dark:group-hover:from-slate-900/70 dark:group-hover:via-slate-900/65 dark:group-hover:to-slate-900/70 transition-all duration-500" />
                </div>

                <div className="relative flex h-full flex-col p-5 sm:p-6 lg:p-8">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="inline-block mb-4 w-fit"
                  >
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary-accent/5 dark:bg-primary-accent/15 text-primary dark:text-primary-accent border border-primary-accent/20 dark:border-primary-accent/25">
                      {article.category}
                    </span>
                  </motion.div>

                  <h3 className="mb-3 text-lg font-bold text-slate-900 text-foreground transition-colors line-clamp-2 group-hover:text-primary dark:group-hover:text-primary-accent sm:text-xl">
                    {article.title}
                  </h3>

                  <p className="mb-6 grow text-sm leading-relaxed text-slate-500 text-muted-foreground">
                    {article.desc}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 border-border">
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 sm:text-xs">
                      <p>{article.date}</p>
                      <p className="mt-1">{article.author}</p>
                    </div>
                    <Link
                      to="/blog/$id"
                      params={{ id: String(article.id) }}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary-accent transition-transform duration-300 group-hover:translate-x-1"
                      aria-label={`Open ${article.title}`}
                    >
                      Open
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-10 text-center md:mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto rounded-full bg-linear-to-r from-primary to-primary-accent px-8 py-3 font-semibold text-white transition-shadow hover:shadow-2xl hover:shadow-primary-accent/50"
          >
            Read All Blogs
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
