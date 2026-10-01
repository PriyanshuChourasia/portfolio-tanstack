import { motion } from 'framer-motion'
import { ArrowRight, CalendarDays } from 'lucide-react'
import { getBlogPosts } from '@/data/blog-posts'

export function HeroSection() {
  const posts = getBlogPosts().slice(0, 3)
  const [featured, ...rest] = posts

  if (!featured) {
    return (
      <section id="home" className="mx-auto max-w-3xl px-6 pt-16 pb-20">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900">
          Welcome
        </h1>
        <p className="mt-3 text-neutral-500">No blog posts yet.</p>
      </section>
    )
  }

  return (
    <section id="home" className="mx-auto max-w-5xl px-6 pt-16 pb-20">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-sm font-medium uppercase tracking-widest text-neutral-400"
      >
        Blog
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mt-3 text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl"
      >
        Notes on building software
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mt-4 max-w-xl text-neutral-500"
      >
        Writing about engineering, design, and everything I learn along the way.
      </motion.p>

      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[1.8fr_1fr]">
        {/* Featured post */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white"
        >
          {featured.image && (
            <div className="aspect-[16/8] w-full overflow-hidden">
              <img
                src={featured.image}
                alt={featured.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          )}
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 text-xs text-neutral-400">
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 font-medium text-neutral-600">
                {featured.category}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                {featured.date}
              </span>
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-neutral-900 transition-colors group-hover:text-neutral-600 sm:text-3xl">
              {featured.title}
            </h2>
            <p className="mt-3 line-clamp-2 text-neutral-500">{featured.desc}</p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900">
              Read article
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
          <a
            href={`/${featured.id}`}
            className="absolute inset-0"
            aria-label={`Read ${featured.title}`}
          />
        </motion.article>

        {/* Side posts */}
        <div className="flex flex-col gap-6">
          {rest.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="group relative flex-1 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-3 text-xs text-neutral-400">
                <span className="rounded-full bg-neutral-100 px-2.5 py-1 font-medium text-neutral-600">
                  {post.category}
                </span>
                <span>{post.date}</span>
              </div>
              <h3 className="mt-3 text-base font-bold tracking-tight text-neutral-900 transition-colors group-hover:text-neutral-600">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-neutral-500">
                {post.desc}
              </p>
              <a
                href={`/${post.id}`}
                className="absolute inset-0"
                aria-label={`Read ${post.title}`}
              />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
