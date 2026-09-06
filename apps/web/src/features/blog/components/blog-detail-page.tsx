import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react'
import BlogCommentsSection from './blog-comments-section'
import { getBlogPosts } from '@/data/blog-posts'
import { Navbar } from '@/components/Navbar'

function extractHeadings(html: string): Array<string> {
  const matches = html.match(/<h[23][^>]*>(.*?)<\/h[23]>/gis)
  if (!matches) return []
  return matches
    .map((m) => m.replace(/<[^>]+>/g, '').trim())
    .filter(Boolean)
    .slice(0, 8)
}

export function BlogPostDetailPage({ postId }: { postId: number }) {
  const [hasImageError, setHasImageError] = useState(false)
  const post = getBlogPosts().find((item) => item.id === postId)
  const headings = extractHeadings(post?.content ?? '')
  const shouldShowHeroImage = Boolean(post?.image?.trim()) && !hasImageError

  if (!post) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="max-w-md text-center">
            <p className="text-sm uppercase tracking-widest text-[#EF1D25] mb-4">
              404
            </p>
            <h1 className="text-3xl font-bold text-[#F5F5F5] mb-6">
              Blog post not found
            </h1>
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-[#EF1D25] px-6 py-3 text-sm font-semibold text-white hover:bg-[#DC171D] transition-colors"
            >
              <ArrowLeft size={15} />
              Back home
            </a>
          </div>
        </div>
      </div>
    )
  }

  const date = post.date
  const author = post.author

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5]">
      <Navbar />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="pt-16 px-5 sm:px-6 lg:px-8"
      >
        {/* Article hero */}
        <div className="max-w-5xl mx-auto py-12 sm:py-16">
          {/* Category */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#EF1D25]">
              {post.category}
            </span>
            <span className="flex items-center gap-2 text-[10px] font-mono text-[#5A5A5A]">
              <Calendar className="h-3 w-3" />
              {date}
            </span>
          </div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-[#F5F5F5] mb-6"
          >
            {post.title}
          </motion.h1>

          {/* Subtitle / intro */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-2xl border-l-[2px] border-[#EF1D25] pl-5 text-lg text-[#999999] leading-relaxed mb-8"
          >
            {post.intro}
          </motion.p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex flex-wrap items-center gap-2 mb-8"
            >
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#2A2A2A] bg-[#111111] px-3 py-1 text-xs font-medium text-[#A0A0A0] transition-colors duration-200 hover:border-[#6B1A1A] hover:text-[#EF1D25]"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          )}

          {/* Cover image */}
          {shouldShowHeroImage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-10 rounded-2xl overflow-hidden border border-[#242424] max-w-6xl mx-auto"
            >
              <img
                src={post.image}
                alt={post.title}
                onError={() => setHasImageError(true)}
                className="w-full aspect-[16/8] object-cover transition-transform duration-300 hover:scale-[1.01]"
              />
            </motion.div>
          )}

          {/* Meta row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center gap-3 px-1"
          >
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#5A5A5A]">
              {date}
            </span>
            <span className="text-[#242424]">•</span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#777777]">
              {author}
            </span>
            <span className="text-[#242424]">•</span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#5A5A5A]">
              8 MIN READ
            </span>
          </motion.div>
        </div>

        {/* Article body — two column layout on desktop */}
        <div className="mt-12 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-10 lg:gap-12">
            {/* Main content */}
            <div className="max-w-[760px]">
              {/* Article content */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="rounded-xl border border-[#242424] bg-[#0C0C0C] p-6 sm:p-8"
              >
                <article
                  className="text-[#A0A0A0] leading-8 text-base [&_h2]:text-[#F5F5F5] [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-[#F5F5F5] [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:mb-6 [&_p]:text-[#A0A0A0] [&_strong]:text-[#F5F5F5] [&_a]:text-[#EF1D25] [&_code]:bg-[#111111] [&_code]:border [&_code]:border-[#242424] [&_code]:rounded [&_code]:text-[#EF1D25] [&_code]:font-mono [&_code]:px-1.5 [&_code]:py-0.5 [&_blockquote]:border-l-2 [&_blockquote]:border-[#EF1D25] [&_blockquote]:pl-5 [&_blockquote]:text-[#B0B0B0] [&_blockquote]:my-6 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-[#A0A0A0] [&_li]:mb-2 [&_img]:w-full [&_img]:rounded-2xl [&_img]:border [&_img]:border-[#242424] [&_img]:my-6 [&_img]:overflow-hidden [&_img]:mb-6"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Code snippet */}
                {post.codeSnippet && (
                  <div className="mt-8">
                    <div className="flex items-center justify-between px-4 py-2.5 rounded-t-xl bg-[#111111] border border-[#242424] border-b-0">
                      <span className="text-[10px] font-mono text-[#5A5A5A] uppercase tracking-wider">
                        Code
                      </span>
                      <div className="flex gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#EF1D25]/70" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#F5F5F5]/20" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#F5F5F5]/20" />
                      </div>
                    </div>
                    <pre className="overflow-x-auto rounded-b-xl border border-[#242424] bg-[#0C0C0C] p-5 text-sm leading-7 text-[#A0A0A0] whitespace-pre-wrap font-mono">
                      {post.codeSnippet}
                    </pre>
                  </div>
                )}

                {/* Footer */}
                {post.footer && (
                  <div
                    className="mt-8 pt-8 border-t border-[#242424] text-sm leading-7 text-[#777777]"
                    dangerouslySetInnerHTML={{ __html: post.footer }}
                  />
                )}
              </motion.div>

              {/* Comments */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8"
              >
                <BlogCommentsSection />
              </motion.div>

              {/* Prev / Next navigation */}
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href="/blog"
                  className="group flex items-start gap-4 rounded-xl border border-[#242424] bg-[#0C0C0C] p-5 transition-all duration-200 hover:border-[#6B1A1A]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#111111] text-[#EF1D25] transition-colors group-hover:bg-[#6B1A1A]">
                    <ArrowLeft className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-[#5A5A5A] mb-1">
                      Previous
                    </p>
                    <p className="text-sm font-semibold text-[#F5F5F5] group-hover:text-[#EF1D25] transition-colors">
                      All articles
                    </p>
                  </div>
                </a>

                <a
                  href="/"
                  className="group flex items-end justify-end gap-4 rounded-xl border border-[#242424] bg-[#0C0C0C] p-5 text-right transition-all duration-200 hover:border-[#6B1A1A]"
                >
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-[#5A5A5A] mb-1">
                      Next
                    </p>
                    <p className="text-sm font-semibold text-[#F5F5F5] group-hover:text-[#EF1D25] transition-colors">
                      Back to home
                    </p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#111111] text-[#EF1D25] transition-colors group-hover:bg-[#6B1A1A]">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </a>
              </div>
            </div>

            {/* Table of contents — sticky on desktop */}
            {headings.length > 0 && (
              <div className="hidden lg:block">
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="sticky top-24"
                >
                  <div className="rounded-xl border border-[#242424] bg-[#0C0C0C] p-5">
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#5A5A5A] mb-4">
                      On this page
                    </p>
                    <nav className="flex flex-col gap-2">
                      {headings.map((heading, i) => (
                        <a
                          key={i}
                          href={`#${heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30)}`}
                          className="group flex items-start gap-2 text-[11px] font-mono text-[#666666] transition-colors duration-200 hover:text-[#EF1D25]"
                        >
                          <span className="shrink-0 text-[#242424] group-hover:text-[#EF1D25] transition-colors">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="line-clamp-2">{heading}</span>
                        </a>
                      ))}
                    </nav>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Mobile TOC — compact horizontal above article */}
            {headings.length > 0 && (
              <div className="lg:hidden">
                <div className="rounded-xl border border-[#242424] bg-[#0C0C0C] p-4 overflow-x-auto">
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#5A5A5A] mb-3 shrink-0">
                    On this page
                  </p>
                  <div className="flex gap-4 text-[11px] font-mono text-[#666666]">
                    {headings.map((heading, i) => (
                      <a
                        key={i}
                        href={`#${heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30)}`}
                        className="shrink-0 hover:text-[#EF1D25] transition-colors"
                      >
                        {String(i + 1).padStart(2, '0')} {heading}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.main>
    </div>
  )
}
