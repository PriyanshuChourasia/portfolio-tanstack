import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { getBlogPosts } from '@/data/blog-posts'

const articles = getBlogPosts()
const featured = articles[0]
const supporting = articles.slice(1, 3)

function CategoryRow({ category, date }: { category: string; date: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2 font-mono uppercase">
      <span className="text-[9px] tracking-[0.25em] text-[#EF1D25]">
        {category}
      </span>
      <span
        className="h-0.5 w-0.5 rounded-full bg-[#444444]"
        aria-hidden="true"
      />
      <span className="text-[9px] tracking-[0.2em] text-[#555555]">{date}</span>
    </div>
  )
}

export default function Articles() {
  return (
    <section
      id="articles"
      className="relative w-full overflow-hidden bg-[#050505]"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(239,68,68,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.12) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
        <div className="absolute left-0 right-0 top-0 h-px bg-[#242424]" />
        <div className="absolute left-0 right-0 bottom-0 h-px bg-[#242424]" />
        <span className="absolute left-0 top-0 h-6 w-px bg-[#6B1A1A]" />
        <span className="absolute right-0 top-0 h-px w-6 bg-[#6B1A1A]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="mb-10 flex flex-col gap-6 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#EF1D25]">
              Insights / Writing
            </span>
            <h1 className="mt-2 text-4xl font-black uppercase tracking-tight leading-[0.9] text-[#F5F5F5] sm:text-5xl">
              MY <span className="text-[#EF1D25]">BLOGS</span>
            </h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#858585]">
              Notes from building software, designing systems, and learning
              along the way.
            </p>
          </div>

          <span className="hidden shrink-0 items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-[#555555] lg:flex">
            <span
              className="h-1 w-1 rounded-full bg-[#EF1D25]"
              aria-hidden="true"
            />
            {String(articles.length).padStart(2, '0')} Articles
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.9fr_1fr]">
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#242424] bg-[#0B0B0B] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#4A1717]"
          >
            <div className="relative aspect-[16/7] w-full overflow-hidden">
              <img
                src={featured.image}
                alt={featured.title}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505]/40 to-transparent" />
              <span className="absolute left-4 top-4 border border-[#EF1D25]/30 bg-[#050505]/70 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.25em] text-[#EF1D25]">
                Featured
              </span>
            </div>

            <div className="flex grow flex-col p-6 sm:p-8">
              <CategoryRow category={featured.category} date={featured.date} />
              <h2 className="mt-4 text-2xl font-bold leading-tight text-[#F5F5F5] transition-colors duration-300 group-hover:text-[#EF1D25] sm:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-3 line-clamp-3 max-w-2xl text-sm leading-7 text-[#858585]">
                {featured.desc}
              </p>

              <div className="mt-7 flex items-center justify-between border-t border-[#242424] pt-5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#555555]">
                  {featured.date}
                </span>
                <span className="flex items-center gap-2 text-sm font-semibold text-[#F5F5F5] transition-colors duration-300 group-hover:text-[#EF1D25]">
                  Read article
                  <ArrowRight
                    className="h-4 w-4 text-[#EF1D25] transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </div>

            <Link
              to="/blog/$id"
              params={{ id: String(featured.id) }}
              className="absolute inset-0 z-10"
              aria-label={`Read ${featured.title}`}
            />
          </motion.article>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 lg:gap-6">
            {supporting.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#242424] bg-[#0B0B0B] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#4A1717]"
              >
                <div className="relative aspect-[16/7] w-full overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505]/35 to-transparent" />
                  <span
                    className="absolute left-3 top-3 h-1 w-1 rounded-full bg-[#EF1D25]"
                    aria-hidden="true"
                  />
                </div>

                <div className="flex grow flex-col p-5">
                  <CategoryRow category={post.category} date={post.date} />
                  <h3 className="mt-3 text-base font-bold leading-snug text-[#F5F5F5] transition-colors duration-300 group-hover:text-[#EF1D25]">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-1 text-[13px] leading-6 text-[#858585]">
                    {post.desc}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-[#242424] pt-4">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#555555]">
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-[#F5F5F5] transition-colors duration-300 group-hover:text-[#EF1D25]">
                      Read
                      <ArrowRight
                        className="h-3.5 w-3.5 text-[#EF1D25] transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </div>

                <Link
                  to="/blog/$id"
                  params={{ id: String(post.id) }}
                  className="absolute inset-0 z-10"
                  aria-label={`Read ${post.title}`}
                />
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
