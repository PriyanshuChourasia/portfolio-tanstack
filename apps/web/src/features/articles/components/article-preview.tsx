import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

import { BlogArtwork } from '@/components/blog-artwork'
import { getBlogPosts } from '@/data/blog-posts'

const previewPosts = getBlogPosts().slice(0, 3)
const featured = previewPosts[0]
const sideArticles = previewPosts.slice(1)

function CategoryRow({
  category,
  date,
}: {
  category: string
  date: string
}) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="truncate font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-[#EF1D25]">
        {category}
      </span>

      <span
        className="h-1 w-1 shrink-0 rounded-full bg-[#444444]"
        aria-hidden="true"
      />

      <span className="shrink-0 font-mono text-[9px] uppercase tracking-wider text-[#555555]">
        {date}
      </span>
    </div>
  )
}

export default function ArticlePreviewSection() {
  return (
    <section
      className="
        relative w-full overflow-hidden bg-[#050505]
        lg:h-[calc(100svh-72px)]
        lg:min-h-[680px]
      "
    >
      <div
        className="
          relative z-10 mx-auto flex h-full max-w-[88rem]
          flex-col px-4 py-8
          sm:px-6
          lg:px-8 lg:py-8
          xl:px-10
        "
      >
        {/* =====================================================
            HEADER
        ===================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="
            flex shrink-0 flex-col gap-5
            lg:flex-row lg:items-end lg:justify-between
          "
        >
          {/* Left */}
          <div className="max-w-3xl">
            <span className="mb-2 block font-mono text-[9px] font-semibold uppercase tracking-[0.35em] text-[#EF1D25]">
              Insights / Writing
            </span>

            <h2
              className="
                text-3xl font-bold leading-[1.05] tracking-tight
                text-[#F5F5F5]
                sm:text-4xl
                lg:text-[2.7rem]
                xl:text-5xl
              "
            >
              Engineering notes, ideas{' '}
              <span className="text-[#EF1D25]">&amp;</span>
              <br className="hidden sm:block" /> things I learned.
            </h2>

            <p
              className="
                mt-3 max-w-2xl text-xs leading-5 text-[#777777]
                sm:text-sm
                lg:max-w-xl
              "
            >
              Articles about software engineering, ERP systems, architecture,
              and development — plus things I learned while building products.
            </p>
          </div>

          {/* View all */}
          <Link
            to="/blog"
            className="
              group inline-flex shrink-0 items-center gap-2
              font-mono text-[10px] font-semibold uppercase
              tracking-[0.18em] text-[#F5F5F5]
              transition-colors duration-300
              hover:text-[#EF1D25]
              lg:mb-1
            "
          >
            View all articles

            <ArrowRight
              className="
                h-3.5 w-3.5 text-[#EF1D25]
                transition-transform duration-300
                group-hover:translate-x-1
              "
              aria-hidden="true"
            />
          </Link>
        </motion.div>

        {/* =====================================================
            BLOG GRID
        ===================================================== */}
        <div
          className="
            mt-7 grid min-h-0 flex-1 grid-cols-1 gap-4
            lg:grid-cols-[1.65fr_1fr]
            xl:mt-8
          "
        >
          {/* ===================================================
              FEATURED ARTICLE
          =================================================== */}
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -3 }}
            className="
              group relative flex min-h-0 flex-col
              overflow-hidden rounded-2xl
              border border-[#242424]
              bg-[#0B0B0B]
              transition-colors duration-300
              hover:border-[#3A3A3A]
            "
          >
            {/* Image */}
            <div
              className="
                relative h-[190px] shrink-0 overflow-hidden
                sm:h-[230px]
                lg:h-[220px]
                xl:h-[250px]
              "
            >
              <BlogArtwork
                src={featured.image}
                alt={featured.title}
                placeholderLabel="Blog cover"
                showPlaceholder={true}
                seed={featured.id}
                className="
                  h-full w-full object-cover
                  transition-transform duration-500
                  ease-out group-hover:scale-[1.025]
                "
              />

              {/* Bottom fade */}
              <div
                className="
                  pointer-events-none absolute inset-x-0 bottom-0
                  h-20 bg-gradient-to-t
                  from-[#0B0B0B] to-transparent
                "
              />

              {/* Featured label */}
              <div
                className="
                  absolute left-5 top-5
                  rounded-full border border-[#333333]
                  bg-[#080808]/90 px-3 py-1
                  backdrop-blur-sm
                "
              >
                <span className="font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-[#F5F5F5]">
                  Featured
                </span>
              </div>
            </div>

            {/* Content */}
            <div
              className="
                flex min-h-0 flex-1 flex-col
                p-5
                sm:p-6
                lg:p-6
              "
            >
              <CategoryRow
                category={featured.category}
                date={featured.date}
              />

              <h3
                className="
                  mt-3 line-clamp-2
                  text-xl font-bold leading-[1.15]
                  text-[#F5F5F5]
                  sm:text-2xl
                  lg:text-[1.7rem]
                "
              >
                {featured.title}
              </h3>

              <p
                className="
                  mt-2 line-clamp-2 max-w-2xl
                  text-xs leading-5 text-[#777777]
                  sm:text-sm
                "
              >
                {featured.desc}
              </p>

              {/* Bottom action */}
              <div
                className="
                  mt-auto flex items-center justify-between
                  border-t border-[#242424]
                  pt-4
                "
              >
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#555555]">
                  {featured.date}
                </span>

                <span
                  className="
                    flex items-center gap-2
                    text-xs font-semibold text-[#F5F5F5]
                    transition-colors duration-300
                    group-hover:text-[#EF1D25]
                  "
                >
                  Read article

                  <ArrowRight
                    className="
                      h-3.5 w-3.5 text-[#EF1D25]
                      transition-transform duration-300
                      group-hover:translate-x-1
                    "
                    aria-hidden="true"
                  />
                </span>
              </div>
            </div>

            <Link
              to="/blog/$id"
              params={{ id: String(featured.id) }}
              className="absolute inset-0 z-10"
              aria-label={`Open ${featured.title}`}
            />
          </motion.article>

          {/* ===================================================
              SIDE ARTICLES
          =================================================== */}
          <div className="grid min-h-0 grid-cols-1 gap-4">
            {sideArticles.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.1 + index * 0.1,
                }}
                whileHover={{
                  y: -3,
                }}
                className="
                  group relative grid min-h-0
                  grid-cols-[42%_58%]
                  overflow-hidden rounded-2xl
                  border border-[#242424]
                  bg-[#0B0B0B]
                  transition-colors duration-300
                  hover:border-[#3A3A3A]

                  sm:grid-cols-[45%_55%]

                  lg:grid-cols-1
                  lg:grid-rows-[42%_58%]
                "
              >
                {/* Image */}
                <div
                  className="
                    relative min-h-0 overflow-hidden
                    lg:h-full
                  "
                >
                  <BlogArtwork
                    src={post.image}
                    alt={post.title}
                    placeholderLabel="Blog cover"
                    showPlaceholder={true}
                    seed={post.id}
                    className="
                      h-full w-full object-cover
                      transition-transform duration-500
                      ease-out group-hover:scale-[1.025]
                    "
                  />

                  <div
                    className="
                      pointer-events-none absolute inset-0
                      bg-gradient-to-r
                      from-transparent to-[#0B0B0B]/30
                      lg:bg-gradient-to-t
                    "
                  />
                </div>

                {/* Content */}
                <div
                  className="
                    flex min-h-0 flex-col
                    justify-between p-4
                    sm:p-5
                    lg:p-5
                  "
                >
                  <div className="min-h-0">
                    <CategoryRow
                      category={post.category}
                      date={post.date}
                    />

                    <h3
                      className="
                        mt-2 line-clamp-2
                        text-sm font-bold leading-snug
                        text-[#F5F5F5]
                        sm:text-base
                        lg:text-lg
                      "
                    >
                      {post.title}
                    </h3>

                    <p
                      className="
                        mt-2 line-clamp-2
                        text-[11px] leading-5 text-[#777777]
                        sm:text-xs
                      "
                    >
                      {post.desc}
                    </p>
                  </div>

                  {/* Read */}
                  <div
                    className="
                      mt-3 flex items-center justify-between
                      border-t border-[#242424]
                      pt-3
                    "
                  >
                    <span className="font-mono text-[8px] uppercase tracking-wider text-[#555555]">
                      {post.date}
                    </span>

                    <span
                      className="
                        flex items-center gap-1.5
                        text-[10px] font-semibold
                        text-[#F5F5F5]
                        transition-colors duration-300
                        group-hover:text-[#EF1D25]
                      "
                    >
                      Read

                      <ArrowRight
                        className="
                          h-3 w-3 text-[#EF1D25]
                          transition-transform duration-300
                          group-hover:translate-x-1
                        "
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </div>

                <Link
                  to="/blog/$id"
                  params={{ id: String(post.id) }}
                  className="absolute inset-0 z-10"
                  aria-label={`Open ${post.title}`}
                />
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}