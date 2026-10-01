import { motion } from 'framer-motion'
import { ArrowRight, CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getBlogPosts } from '@/data/blog-posts'

export function BlogChainSection() {
  const posts = getBlogPosts()

  if (posts.length === 0) {
    return null
  }

  return (
    <section id="blogs" className="mx-auto max-w-5xl px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sm font-medium uppercase tracking-widest text-neutral-400">
          All posts
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900">
          The blog chain
        </h2>
        <p className="mt-4 max-w-xl text-neutral-500">
          Every post, newest first, linked one after another.
        </p>
      </motion.div>

      <ol className="relative mt-12">
        {/* Chain line: left rail on mobile, centered on desktop */}
        <span
          aria-hidden
          className="absolute top-2 bottom-2 left-4 w-px bg-neutral-200 md:left-1/2 md:-translate-x-1/2"
        />

        {posts.map((post, i) => {
          const isRight = i % 2 === 1

          return (
            <li
              key={post.id}
              className="relative pb-10 pl-12 last:pb-0 md:grid md:grid-cols-2 md:gap-12 md:pl-0"
            >
              {/* Chain node */}
              <span
                aria-hidden
                className="absolute top-6 left-4 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border border-neutral-300 bg-white text-xs font-semibold text-neutral-600 shadow-sm md:left-1/2"
              >
                {posts.length - i}
              </span>

              <motion.article
                initial={{ opacity: 0, x: isRight ? 24 : -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5 }}
                className={cn(
                  'group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-md',
                  isRight && 'md:col-start-2',
                )}
              >
                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
                  <span className="rounded-full bg-neutral-100 px-2.5 py-1 font-medium text-neutral-600">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {post.date}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-bold tracking-tight text-neutral-900 transition-colors group-hover:text-neutral-600">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-neutral-500">
                  {post.desc}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900">
                  Read article
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <a
                  href={`/${post.id}`}
                  className="absolute inset-0"
                  aria-label={`Read ${post.title}`}
                />
              </motion.article>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
