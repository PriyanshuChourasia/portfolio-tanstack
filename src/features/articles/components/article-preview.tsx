import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import blogData from '@/data/blog-data.json'

const previewPosts = blogData.posts.slice(0, 4)

export default function ArticlePreviewSection() {
  return (
    <section id="articles" className="py-20">
      <div className="max-w-2xl mx-auto px-6">

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-500">
            Writing
          </h2>
          <span className="text-xs text-emerald-600/50 dark:text-emerald-500/50">Featured</span>
        </div>

        <hr className="border-emerald-100 dark:border-[#1a2e22]" />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          {previewPosts.map((post, i) => (
            <div key={post.id}>
              <Link
                to="/blog/$id"
                params={{ id: String(post.id) }}
                className="flex items-center justify-between py-5 gap-4 group"
              >
                <p className="text-base font-semibold text-emerald-950 dark:text-emerald-50 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                  {post.title}
                </p>
                <span className="text-sm text-emerald-600/50 dark:text-emerald-400/50 shrink-0">
                  {post.date}
                </span>
              </Link>
              {i < previewPosts.length - 1 && (
                <hr className="border-emerald-50 dark:border-[#1a2e22]/60" />
              )}
            </div>
          ))}
        </motion.div>

        <hr className="border-emerald-100 dark:border-[#1a2e22] mb-5" />

        <a
          href="#articles"
          className="inline-flex items-center gap-1.5 text-sm text-emerald-600/60 dark:text-emerald-400/50 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
        >
          All Writing <ArrowRight size={13} />
        </a>
      </div>
    </section>
  )
}
