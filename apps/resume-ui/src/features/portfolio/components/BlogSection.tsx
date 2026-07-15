import { motion } from 'framer-motion'
import { Calendar, ArrowRight } from 'lucide-react'
import type { BlogPost, ColorTheme } from '../types'

interface BlogSectionProps {
  posts: Array<BlogPost>
  theme: ColorTheme
}

export function BlogSection({ posts, theme }: BlogSectionProps) {
  if (posts.length === 0) return null

  return (
    <section
      id="blog"
      className="relative py-24 sm:py-32"
      style={{ backgroundColor: theme.surface, color: theme.text }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, ${theme.text} 1px, transparent 0)`,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p
            className="mb-3 inline-block rounded-full px-4 py-1.5 text-sm font-medium tracking-wide"
            style={{
              backgroundColor: `${theme.accent}15`,
              color: theme.accent,
            }}
          >
            Blog
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Latest Articles
          </h2>
          <div
            className="mx-auto mt-4 h-1 w-20 rounded-full"
            style={{ backgroundColor: theme.accent }}
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {posts.map((post) => (
            <motion.article
              key={post.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="group cursor-pointer overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-2"
              style={{
                backgroundColor: theme.background,
                borderColor: `${theme.textMuted}15`,
              }}
            >
              {/* Image */}
              <div className="relative aspect-[16/9] overflow-hidden">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div
                    className="flex size-full items-center justify-center text-2xl"
                    style={{ backgroundColor: theme.background, color: theme.textMuted }}
                  >
                    📝
                  </div>
                )}
                {/* Category badge */}
                <span
                  className="absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider"
                  style={{
                    backgroundColor: theme.accent,
                    color: '#fff',
                  }}
                >
                  {post.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="mb-3 flex items-center gap-2 text-xs" style={{ color: theme.textMuted }}>
                  <Calendar className="size-3" />
                  {post.date}
                </div>
                <h3 className="mb-2 line-clamp-2 text-base font-semibold leading-snug transition-colors duration-200 group-hover:text-[color]"
                  style={{ color: theme.text }}
                >
                  {post.title}
                </h3>
                <p className="mb-4 line-clamp-2 text-sm leading-relaxed" style={{ color: theme.textMuted }}>
                  {post.excerpt}
                </p>
                <a
                  href={post.link}
                  className="inline-flex items-center gap-1.5 text-sm font-medium transition-all duration-200 group-hover:gap-2"
                  style={{ color: theme.accent }}
                >
                  Read More
                  <ArrowRight className="size-3.5" />
                </a>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
