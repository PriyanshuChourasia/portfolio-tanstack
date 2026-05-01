  

import { Link } from '@tanstack/react-router'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import blogData from '@/data/blog-data.json'

export default function Articles() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start center', 'end center'],
  })

  const articles = blogData.posts

  const titleY = useTransform(scrollYProgress, [0, 0.3], [100, 0])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  return (
    <section
      id="articles"
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-slate-950 py-16 md:py-24 lg:py-32"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="text-center mb-10 md:mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold">
            Featured <span className="text-cyan-500">Blogs</span>
          </h2>
        </motion.div>

        
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
          {articles.map((article, index) => {
            const cardY = useTransform(
              scrollYProgress,
              [0, 0.5, 1],
              [48 + index * 10, 0, -24]
            )

            const cardOpacity = useTransform(
              scrollYProgress,
              [0, 0.3, 0.7, 1],
              [0, 1, 1, 0.5]
            )

            return (
              <motion.div
                key={index}
                style={{ y: cardY, opacity: cardOpacity }}
                className="group relative h-full overflow-hidden rounded-3xl"
              >
             
                <div
                  className="absolute inset-0 bg-linear-to-br from-cyan-500/10 via-slate-900/80 to-blue-950/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />

          
                <div className="absolute inset-0 border border-white/10 group-hover:border-cyan-400/40 rounded-2xl transition-colors duration-300" />

                <div className="relative flex h-full flex-col bg-slate-950/70 p-5 backdrop-blur-xl sm:p-6 lg:p-8">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="inline-block mb-4 w-fit"
                  >
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">
                      {article.category}
                    </span>
                  </motion.div>

                  <h3 className="mb-3 text-lg font-bold text-white transition-colors line-clamp-2 group-hover:text-cyan-300 sm:text-xl">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="mb-6 grow text-sm leading-relaxed text-slate-400">
                    {article.desc}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="text-[11px] text-slate-500 sm:text-xs">
                      <p>{article.date}</p>
                      <p className="mt-1">{article.author}</p>
                    </div>
                    <Link
                      to="/blog/$id"
                      params={{ id: String(article.id) }}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 transition-transform duration-300 group-hover:translate-x-1"
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
          <a href="#articles" className="inline-block w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full rounded-full bg-linear-to-r from-blue-600 to-cyan-600 px-8 py-3 font-semibold text-white transition-shadow hover:shadow-2xl hover:shadow-blue-500/50 sm:w-auto"
            >
              Read All Blogs
            </motion.button>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
